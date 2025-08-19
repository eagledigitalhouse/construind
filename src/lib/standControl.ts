import { supabase } from './supabase';

// Tipos
export interface StandStatus {
  numero_stand: string;
  status: 'disponivel' | 'temp_reservado' | 'pre_reservado' | 'ocupado';
  user_session?: string;
  reserved_at?: string;
  expires_at?: string;
  categoria: string;
  cor: string;
  inscricao_id?: string;
  nome_empresa?: string;
}

// Gerar hash único da sessão do usuário
export function generateUserSession(): string {
  const browser = navigator.userAgent;
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2);
  
  // Criar hash simples mas único para esta sessão
  const sessionData = `${browser}-${timestamp}-${random}`;
  return btoa(sessionData).substring(0, 16); // Base64 truncado
}

// Salvar sessão no localStorage
export function getUserSession(): string {
  let session = localStorage.getItem('construind_stand_session');
  
  if (!session) {
    session = generateUserSession();
    localStorage.setItem('construind_stand_session', session);
  }
  
  return session;
}

// Carregar status de todos os stands
export async function loadStandsStatus(): Promise<StandStatus[]> {
  try {
    const { data, error } = await supabase
      .from('v_stands_status')
      .select('*')
      .order('numero_stand::INTEGER');

    if (error) {
      console.error('Erro ao carregar stands:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Erro ao carregar stands:', error);
    return [];
  }
}

// Verificar disponibilidade de um stand específico
export async function checkStandAvailability(standNumber: string): Promise<string> {
  try {
    const { data, error } = await supabase
      .rpc('check_stand_availability', { stand_num: standNumber });

    if (error) {
      console.error('Erro ao verificar disponibilidade:', error);
      return 'erro';
    }

    return data || 'disponivel';
  } catch (error) {
    console.error('Erro ao verificar disponibilidade:', error);
    return 'erro';
  }
}

// Reservar stand temporariamente (10 minutos)
export async function reserveStandTemporary(
  standNumber: string, 
  userSession: string = getUserSession()
): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .rpc('reserve_stand_temp', {
        stand_num: standNumber,
        session_hash: userSession,
        minutes_duration: 10
      });

    if (error) {
      console.error('Erro ao reservar stand:', error);
      return false;
    }

    return data === true;
  } catch (error) {
    console.error('Erro ao reservar stand:', error);
    return false;
  }
}

// Confirmar reserva definitiva (ao submeter formulário)
export async function confirmStandReservation(
  standNumber: string,
  inscricaoId: string,
  userSession: string = getUserSession()
): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .rpc('confirm_stand_reservation', {
        stand_num: standNumber,
        session_hash: userSession,
        inscription_id: inscricaoId
      });

    if (error) {
      console.error('Erro ao confirmar reserva:', error);
      return false;
    }

    return data === true;
  } catch (error) {
    console.error('Erro ao confirmar reserva:', error);
    return false;
  }
}

// Liberar reserva temporária (quando usuário deseleciona)
export async function releaseTemporaryReservation(
  standNumber: string,
  userSession: string = getUserSession()
): Promise<boolean> {
  try {
    // Só libera se for da mesma sessão
    const { data, error } = await supabase
      .from('stand_status')
      .update({
        status: 'disponivel',
        user_session: null,
        expires_at: null,
        updated_at: new Date().toISOString()
      })
      .eq('numero_stand', standNumber)
      .eq('user_session', userSession)
      .eq('status', 'temp_reservado');

    if (error) {
      console.error('Erro ao liberar reserva:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Erro ao liberar reserva:', error);
    return false;
  }
}

// Limpar reservas expiradas (executar periodicamente)
export async function cleanupExpiredReservations(): Promise<number> {
  try {
    const { data, error } = await supabase
      .rpc('cleanup_expired_reservations');

    if (error) {
      console.error('Erro ao limpar reservas:', error);
      return 0;
    }

    return data || 0;
  } catch (error) {
    console.error('Erro ao limpar reservas:', error);
    return 0;
  }
}

// Verificar se um stand pode ser selecionado pelo usuário atual
export function canSelectStand(stand: StandStatus, userSession: string): boolean {
  const { status, user_session } = stand;
  
  // Disponível para todos
  if (status === 'disponivel') return true;
  
  // Reservado temporariamente pela mesma sessão
  if (status === 'temp_reservado' && user_session === userSession) return true;
  
  // Outros casos não podem selecionar
  return false;
}

// Obter informações visuais do stand baseado no status
export function getStandVisualInfo(stand: StandStatus, userSession: string) {
  const canSelect = canSelectStand(stand, userSession);
  
  let className = 'w-10 h-10 rounded-full border-2 text-xs font-bold transition-all duration-200';
  let title = '';
  let disabled = false;

  if (!canSelect) {
    disabled = true;
    className += ' cursor-not-allowed opacity-50';
    
    switch (stand.status) {
      case 'temp_reservado':
        title = `Stand reservado temporariamente por outro usuário`;
        className += ' border-orange-400 bg-orange-100 text-orange-700';
        break;
      case 'pre_reservado':
        title = `Stand pré-reservado (aguardando aprovação)`;
        className += ' border-blue-400 bg-blue-100 text-blue-700';
        break;
      case 'ocupado':
        title = `Stand ocupado - ${stand.nome_empresa || 'Empresa'}`;
        className += ' border-red-400 bg-red-100 text-red-700';
        break;
      default:
        title = 'Stand indisponível';
        className += ' border-gray-400 bg-gray-100 text-gray-700';
    }
  } else {
    className += ' cursor-pointer hover:scale-110 hover:shadow-md';
    title = `Stand ${stand.numero_stand} - ${stand.categoria} - Disponível`;
    
    if (stand.status === 'temp_reservado' && stand.user_session === userSession) {
      className += ' border-[#0a2856] ring-2 ring-[#0a2856]/30';
      title += ' (reservado para você)';
    } else {
      className += ' border-gray-300 text-gray-700 hover:border-gray-400';
    }
  }

  return {
    className,
    title,
    disabled,
    backgroundColor: canSelect ? stand.cor : '#f5f5f5'
  };
}

// Estatísticas dos stands
export function getStandsStats(stands: StandStatus[]) {
  return {
    total: stands.length,
    disponivel: stands.filter(s => s.status === 'disponivel').length,
    temp_reservado: stands.filter(s => s.status === 'temp_reservado').length,
    pre_reservado: stands.filter(s => s.status === 'pre_reservado').length,
    ocupado: stands.filter(s => s.status === 'ocupado').length,
    stands2x2: stands.filter(s => s.categoria === '2x2').length,
    stands3x3: stands.filter(s => s.categoria === '3x3').length,
    stands5x5: stands.filter(s => s.categoria === '5x5').length,
    stands8x8: stands.filter(s => s.categoria === '8x8').length,
    stands10x10: stands.filter(s => s.categoria === '10x10').length,
    stands9x10: stands.filter(s => s.categoria === '9x10').length,
  };
}