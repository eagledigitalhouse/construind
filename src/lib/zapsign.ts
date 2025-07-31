import { showToast } from './toast';

// Configuração da API ZapSign
const ZAPSIGN_CONFIG = {
  baseUrl: '/api/zapsign-proxy',
  apiKey: import.meta.env.VITE_ZAPSIGN_API_KEY,
};

if (!ZAPSIGN_CONFIG.apiKey) {
  console.warn('VITE_ZAPSIGN_API_KEY não configurada nas variáveis de ambiente');
}

// Tipos para ZapSign API
export interface ZapSignTemplate {
  id: string;  // Mapeado de 'token' da API
  name: string;
  created_at: string;
  updated_at: string; // Mapeado de 'last_update_at' da API
  status: 'active' | 'inactive'; // Mapeado de 'active' da API (true -> 'active', false -> 'inactive')
  type: 'docx' | 'pdf'; // Mapeado de 'template_type' da API
}

export interface ZapSignDocument {
  open_id: number;
  token: string;
  status: 'pending' | 'signed' | 'cancelled' | 'refused';
  name: string;
  original_file: string;
  signed_file: string | null;
  created_at: string;
  last_update_at: string;
  signers: ZapSignSigner[];
  answers?: ZapSignAnswer[];
}

export interface ZapSignSigner {
  token: string;
  sign_url: string;
  status: 'new' | 'signed' | 'refused';
  name: string;
  email: string;
  phone_country: string;
  phone_number: string;
  times_viewed: number;
  last_view_at: string | null;
  signed_at: string | null;
  resend_attempts: number | null;
}

export interface ZapSignAnswer {
  variable: string;
  value: string;
}

export interface ZapSignTemplateInput {
  variable: string;
  input_type: string;
  label: string;
  help_text: string;
  options: string;
  required: boolean;
  order: number;
}

export interface ZapSignTemplateDetails {
  token: string;
  template_type: 'docx' | 'pdf';
  name: string;
  active: boolean;
  template_file: string;
  created_at: string;
  last_update_at: string;
  redirect_link: string;
  folder_path: string;
  lang: string;
  signers: Array<{
    name: string;
    auth_mode: string;
    email: string;
    phone_country: string;
    phone_number: string;
    lock_name: boolean;
    lock_phone: boolean;
    lock_email: boolean;
    hide_phone: boolean;
    blank_phone: boolean;
    hide_email: boolean;
    blank_email: boolean;
    require_selfie_photo: boolean;
    require_document_photo: boolean;
    selfie_validation_type: string;
    qualification: string;
  }>;
  inputs: ZapSignTemplateInput[];
}

export interface CreateDocumentFromTemplateRequest {
  template_id: string;
  signer_name: string;
  signer_email: string;
  signer_phone_country?: string;
  signer_phone_number?: string;
  data: Array<{
    de: string; // Nome da variável (ex: "{{NOME_COMPLETO}}")
    para: string; // Valor a ser substituído
  }>;
  send_automatic_email?: boolean;
  send_automatic_whatsapp?: boolean;
  send_automatic_whatsapp_signed_file?: boolean;
  custom_message?: string;
  folder?: string;
}

export interface ZapSignWebhookData {
  event: {
    name: string; // 'sign', 'close', 'refuse', etc
    occurred_at: string;
    data: {
      document: {
        token: string;
        status: string;
        downloads?: {
          original?: string;
          signed?: string;
        };
        signers: Array<{
          email: string;
          sign_as: string;
          signed: {
            signed_at: string;
          } | null;
          refused: {
            refused_at: string;
            reason: string;
          } | null;
        }>;
      };
    };
  };
}

// Classe principal para integração com ZapSign
export class ZapSignAPI {
  private baseUrl: string;
  private apiKey: string;

  constructor() {
    this.baseUrl = ZAPSIGN_CONFIG.baseUrl;
    this.apiKey = ZAPSIGN_CONFIG.apiKey;
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    if (!this.apiKey) {
      throw new Error('API Key do ZapSign não configurada');
    }

    // Remove a barra inicial do endpoint se existir
    const path = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
    
    // Construir a URL correta para o proxy
    const url = `${this.baseUrl}/${path}`;
    console.log('ZapSignAPI makeRequest: Endpoint original:', endpoint);
    console.log('ZapSignAPI makeRequest: Path processado:', path);
    console.log('ZapSignAPI makeRequest: URL final:', url);
    
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    try {
      console.log('ZapSignAPI makeRequest: Iniciando fetch');
      const response = await fetch(url, {
        ...options,
        headers,
      });
      console.log('ZapSignAPI makeRequest: Status da resposta:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('ZapSignAPI makeRequest: Erro na resposta:', {
          status: response.status,
          statusText: response.statusText,
          errorData
        });
        throw new Error(
          `Erro na API ZapSign: ${response.status} - ${errorData.message || response.statusText}`
        );
      }

      const responseData = await response.json();
      console.log('ZapSignAPI makeRequest: Resposta processada com sucesso');
      return responseData;
    } catch (error) {
      console.error('Erro na requisição ZapSign:', error);
      throw error;
    }
  }

  // Listar todos os modelos disponíveis
  async listTemplates(): Promise<ZapSignTemplate[]> {
    try {
      console.log('ZapSignAPI: Iniciando listagem de templates');
      console.log('ZapSignAPI: Usando baseUrl:', this.baseUrl);
      console.log('ZapSignAPI: API Key configurada:', this.apiKey ? 'Sim' : 'Não');
      
      // Usando o endpoint correto para listar templates
      const response = await this.makeRequest<{ results: any[] }>('templates');
      console.log('ZapSignAPI: Resposta da API:', response);
      
      // Mapear os campos da API para os campos da interface ZapSignTemplate
      const templates: ZapSignTemplate[] = (response.results || []).map(template => ({
        id: template.token,
        name: template.name,
        created_at: template.created_at,
        updated_at: template.last_update_at,
        status: template.active ? 'active' as const : 'inactive' as const,
        type: template.template_type
      }));
      
      console.log('ZapSignAPI: Templates mapeados:', templates);
      return templates;
    } catch (error) {
      console.error('ZapSignAPI: Erro ao listar modelos ZapSign:', error);
      showToast.error('Erro ao carregar modelos do ZapSign');
      throw error;
    }
  }

  // Obter detalhes de um template específico, incluindo variáveis
  async getTemplateDetails(templateId: string): Promise<ZapSignTemplateDetails> {
    try {
      console.log('ZapSignAPI: Obtendo detalhes do template:', templateId);
      
      const response = await this.makeRequest<ZapSignTemplateDetails>(`templates/${templateId}`);
      console.log('ZapSignAPI: Detalhes do template obtidos:', response);
      
      return response;
    } catch (error) {
      console.error('ZapSignAPI: Erro ao obter detalhes do template:', error);
      showToast.error('Erro ao carregar detalhes do template');
      throw error;
    }
  }

  // Criar documento a partir de um modelo
  async createDocumentFromTemplate(
    request: CreateDocumentFromTemplateRequest
  ): Promise<ZapSignDocument> {
    try {
      console.log('ZapSignAPI: Criando documento a partir do template:', request.template_id);
      
      // Garantir que estamos usando o token do template (que foi mapeado para id na listagem)
      // Não precisamos modificar o request aqui, pois o campo já é template_id na interface
      // e o valor passado já é o token do template (que foi mapeado para id)
      
      const response = await this.makeRequest<ZapSignDocument>(
        '/models/create-doc/',
        {
          method: 'POST',
          body: JSON.stringify(request),
        }
      );
      console.log('ZapSignAPI: Documento criado com sucesso:', response);
      return response;
    } catch (error) {
      console.error('Erro ao criar documento ZapSign:', error);
      showToast.error('Erro ao criar documento no ZapSign');
      throw error;
    }
  }

  // Consultar status de um documento
  async getDocumentStatus(documentToken: string): Promise<ZapSignDocument> {
    try {
      const response = await this.makeRequest<ZapSignDocument>(
        `/docs/${documentToken}/`
      );
      return response;
    } catch (error) {
      console.error('Erro ao consultar status do documento:', error);
      throw error;
    }
  }

  // Baixar arquivo assinado
  async downloadSignedFile(documentToken: string): Promise<Blob> {
    try {
      if (!this.apiKey) {
        throw new Error('API Key do ZapSign não configurada');
      }

      const url = `${this.baseUrl}/docs/${documentToken}/download/`;
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Erro ao baixar arquivo: ${response.status}`);
      }

      return await response.blob();
    } catch (error) {
      console.error('Erro ao baixar arquivo assinado:', error);
      throw error;
    }
  }

  // Cancelar documento
  async cancelDocument(documentToken: string): Promise<void> {
    try {
      await this.makeRequest(
        `/docs/${documentToken}/cancel/`,
        {
          method: 'POST',
        }
      );
    } catch (error) {
      console.error('Erro ao cancelar documento:', error);
      throw error;
    }
  }

  // Reenviar documento para assinatura
  async resendDocument(signerToken: string): Promise<void> {
    try {
      await this.makeRequest(
        `/signers/${signerToken}/resend/`,
        {
          method: 'POST',
        }
      );
    } catch (error) {
      console.error('Erro ao reenviar documento:', error);
      throw error;
    }
  }
}

// Funções utilitárias
export const mapZapSignStatusToLocal = (zapSignStatus: string): string => {
  const statusMap: Record<string, string> = {
    'pending': 'enviado_assinatura',
    'signed': 'assinado_completo',
    'cancelled': 'cancelado',
    'refused': 'cancelado',
  };
  return statusMap[zapSignStatus] || 'enviado_assinatura';
};

export const getZapSignStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    'pending': 'Pendente de Assinatura',
    'signed': 'Assinado',
    'cancelled': 'Cancelado',
    'refused': 'Recusado',
  };
  return labels[status] || status;
};

export const getZapSignStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    'pending': 'yellow',
    'signed': 'green',
    'cancelled': 'red',
    'refused': 'red',
  };
  return colors[status] || 'gray';
};

// Criar e exportar uma instância da API ZapSign
export const zapSignAPI = new ZapSignAPI();