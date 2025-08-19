import jsPDF from 'jspdf';

interface DadosComprovante {
  nome: string;
  email: string;
  telefone: string;
  empresa?: string;
  tipoPessoa?: string;
  dataEnvio: string;
  horarioEnvio: string;
  numeroProtocolo: string;
  // Novos campos para informações do stand
  standSelecionado?: {
    numero: string;
    categoria: string;
    valor: number;
    metragem: string;
  };
  valorTotal?: number;
}

export const gerarComprovantePDF = (dados: DadosComprovante): void => {
  // Criar uma nova instância do PDF
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.width;
  const pageHeight = pdf.internal.pageSize.height;
  
  // Definir cores CONSTRUIND
  const corAzul = '#0a2856';
  const corLaranja = '#ff3c00'; // Cor principal do formulário
  
  // Adicionar fonte personalizada Helvetica para todo o documento
  pdf.setFont('helvetica');
  
  // ============ HEADER ============
  // Cabeçalho com gradiente
  pdf.setFillColor(10, 40, 86); // Azul escuro
  pdf.rect(0, 0, pageWidth, 38, 'F');
  
  // Faixa laranja (cor principal do formulário)
  pdf.setFillColor(255, 60, 0); // Laranja
  pdf.rect(0, 38, pageWidth, 8, 'F');
  
  // Logo/Título CONSTRUIND
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(30);
  pdf.setFont('helvetica', 'bold');
  pdf.text('CONSTRUIND 2025', 20, 22);
  
  pdf.setFontSize(13);
  pdf.setFont('helvetica', 'normal');
  pdf.text('FEIRA DA CONSTRUÇÃO CIVIL DE INDAIATUBA', 20, 30);
  
  // Data no cabeçalho (canto direito)
  pdf.setFontSize(10);
  pdf.setTextColor(255, 255, 255);
  pdf.text(`Emitido: ${new Date().toLocaleDateString('pt-BR')}`, pageWidth - 20, 18, {align: 'right'});
  pdf.text(`Horário: ${new Date().toLocaleTimeString('pt-BR')}`, pageWidth - 20, 24, {align: 'right'});

  // ============ TÍTULO DO DOCUMENTO ============
  // Barra de título
  pdf.setFillColor(240, 240, 240);
  pdf.rect(0, 55, pageWidth, 15, 'F');
  
  pdf.setTextColor(10, 40, 86);
  pdf.setFontSize(18);
  pdf.setFont('helvetica', 'bold');
  pdf.text('COMPROVANTE DE PRÉ-INSCRIÇÃO', pageWidth/2, 65, {align: 'center'});
  
  // ============ PROTOCOLO ============
  // Caixa de protocolo com design melhorado
  pdf.setDrawColor(255, 60, 0); // Laranja
  pdf.setFillColor(255, 245, 240);
  pdf.setLineWidth(1);
  pdf.roundedRect(15, 80, pageWidth - 30, 30, 3, 3, 'FD');
  
  // Número do protocolo com destaque
  pdf.setTextColor(10, 40, 86);
  pdf.setFontSize(14);
  pdf.text('PROTOCOLO:', 25, 92);
  
  pdf.setFontSize(22);
  pdf.setFont('helvetica', 'bold');
  pdf.text(dados.numeroProtocolo, 82, 92);
  
  // Data da solicitação
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Data: ${dados.dataEnvio}`, 25, 102);
  pdf.text(`Horário: ${dados.horarioEnvio}`, 85, 102);
  
  // ============ INFORMAÇÕES DO SOLICITANTE ============
  let yPos = 125; // Posição inicial para esta seção
  
  // Cabeçalho da seção
  pdf.setFillColor(10, 40, 86);
  pdf.rect(15, yPos, pageWidth - 30, 8, 'F');
  
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('DADOS DO SOLICITANTE', 20, yPos + 5.5);
  
  yPos += 18;
  
  // Tabela de informações
  const dadosTable = [
    { label: 'Nome:', valor: dados.nome },
    { label: 'E-mail:', valor: dados.email },
    { label: 'Telefone:', valor: dados.telefone }
  ];
  
  if (dados.empresa) {
    dadosTable.push({ label: 'Empresa:', valor: dados.empresa });
  }
  
  if (dados.tipoPessoa) {
    dadosTable.push({ 
      label: 'Tipo:', 
      valor: dados.tipoPessoa === 'fisica' ? 'Pessoa Física' : 'Pessoa Jurídica' 
    });
  }
  
  // Linhas zebradas para facilitar leitura
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(11);
  
  dadosTable.forEach((item, index) => {
    const isEven = index % 2 === 0;
    
    // Alternar cores de fundo para efeito zebrado
    if (isEven) {
      pdf.setFillColor(245, 245, 250);
      pdf.rect(15, yPos - 5, pageWidth - 30, 10, 'F');
    }
    
    pdf.setTextColor(10, 40, 86);
    pdf.setFont('helvetica', 'bold');
    pdf.text(item.label, 25, yPos);
    
    pdf.setTextColor(60, 60, 60);
    pdf.setFont('helvetica', 'normal');
    pdf.text(item.valor, 70, yPos);
    
    yPos += 10;
  });
  
  // ============ INFORMAÇÕES DO STAND ============
  if (dados.standSelecionado) {
    yPos += 10;
    
    // Cabeçalho da seção
    pdf.setFillColor(255, 60, 0); // Laranja
    pdf.rect(15, yPos, pageWidth - 30, 8, 'F');
    
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('STAND SELECIONADO', 20, yPos + 5.5);
    
    yPos += 18;
    
    // Informações do stand
    const standTable = [
      { label: 'Número:', valor: dados.standSelecionado.numero },
      { label: 'Categoria:', valor: dados.standSelecionado.categoria },
      { label: 'Metragem:', valor: dados.standSelecionado.metragem },
      { label: 'Valor:', valor: `R$ ${dados.standSelecionado.valor.toFixed(2)}` }
    ];
    
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(11);
    
    standTable.forEach((item, index) => {
      const isEven = index % 2 === 0;
      
      // Alternar cores de fundo para efeito zebrado
      if (isEven) {
        pdf.setFillColor(255, 245, 240);
        pdf.rect(15, yPos - 5, pageWidth - 30, 10, 'F');
      }
      
      pdf.setTextColor(10, 40, 86);
      pdf.setFont('helvetica', 'bold');
      pdf.text(item.label, 25, yPos);
      
      pdf.setTextColor(60, 60, 60);
      pdf.setFont('helvetica', 'normal');
      pdf.text(item.valor, 70, yPos);
      
      yPos += 10;
    });
  }
  
  // ============ FOOTER ============
  // Rodapé com linha e texto
  pdf.setDrawColor(255, 60, 0); // Laranja
  pdf.setLineWidth(2);
  pdf.line(15, pageHeight - 25, pageWidth - 15, pageHeight - 25);
  
  pdf.setTextColor(10, 40, 86);
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'italic');
  pdf.text('CONSTRUIND 2025 - Todos os direitos reservados', 15, pageHeight - 18);
  pdf.text('Documento gerado automaticamente pelo sistema', 15, pageHeight - 14);
  
  // Salvar PDF com nome formatado
  const dataFormatada = new Date().toISOString().split('T')[0];
  const nomeArquivo = `CONSTRUIND_Comprovante_${dados.numeroProtocolo}.pdf`;
  pdf.save(nomeArquivo);
};