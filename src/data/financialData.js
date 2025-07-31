// Dados mockados para o módulo financeiro
// Baseado no schema da EventAll

export const mockInvoices = [
  {
    id: 1,
    number: "INV-2025-001",
    entityId: 1,
    eventId: 1,
    
    description: "Contrato de participação - Stand Premium",
    amount: 5000.00,
    currency: "BRL",
    issueDate: "2025-01-15",
    dueDate: "2025-02-15",
    paidDate: null,
    status: "sent",
    paymentTerms: 30,
    lateFeesPercent: 2.0,
    discountPercent: 0,
    discountDueDate: null,
    items: [
      {
        description: "Stand Premium 3x3m",
        quantity: 1,
        unitPrice: 5000.00,
        total: 5000.00
      }
    ],
    subtotal: 5000.00,
    taxAmount: 0,
    totalAmount: 5000.00,
    paidAmount: 0,
    balanceDue: 5000.00,
    notes: "Pagamento via PIX com desconto de 5%",
    internalNotes: "Cliente preferencial",
    pdfUrl: null,
    attachments: [],
    sentAt: "2025-01-15T10:00:00Z",
    lastViewedAt: "2025-01-16T14:30:00Z",
    remindersSent: 1,
    lastReminderAt: "2025-01-20T09:00:00Z",
    createdBy: "admin",
    createdAt: "2025-01-15T09:00:00Z",
    updatedAt: "2025-01-20T09:00:00Z",
    // Dados relacionados
    entity: {
      id: 1,
      name: "Tech Solutions Ltda",
      email: "contato@techsolutions.com.br",
      phone: "(11) 99999-9999"
    },
    event: {
      id: 1,
      name: "Tech Expo 2025",
      startDate: "2025-03-15"
    }
  },
  {
    id: 2,
    number: "INV-2025-002",
    entityId: 2,
    eventId: 1,
    
    description: "Contrato de participação - Stand Standard",
    amount: 3000.00,
    currency: "BRL",
    issueDate: "2025-01-18",
    dueDate: "2025-02-18",
    paidDate: "2025-01-19",
    status: "paid",
    paymentTerms: 30,
    lateFeesPercent: 2.0,
    discountPercent: 5.0,
    discountDueDate: "2025-01-25",
    items: [
      {
        description: "Stand Standard 2x2m",
        quantity: 1,
        unitPrice: 3000.00,
        total: 3000.00
      }
    ],
    subtotal: 3000.00,
    taxAmount: 0,
    totalAmount: 2850.00,
    paidAmount: 2850.00,
    balanceDue: 0,
    notes: "Pagamento antecipado com desconto",
    internalNotes: "Pagamento via PIX",
    pdfUrl: null,
    attachments: [],
    sentAt: "2025-01-18T11:00:00Z",
    lastViewedAt: "2025-01-18T15:30:00Z",
    remindersSent: 0,
    lastReminderAt: null,
    createdBy: "admin",
    createdAt: "2025-01-18T10:00:00Z",
    updatedAt: "2025-01-19T16:00:00Z",
    entity: {
      id: 2,
      name: "Inovação Digital",
      email: "comercial@inovacaodigital.com.br",
      phone: "(11) 88888-8888"
    },
    event: {
      id: 1,
      name: "Tech Expo 2025",
      startDate: "2025-03-15"
    }
  },
  {
    id: 3,
    number: "INV-2025-003",
    entityId: 3,
    eventId: 1,
    
    source: "manual",
    description: "Patrocínio Ouro - Tech Expo 2025",
    amount: 15000.00,
    currency: "BRL",
    issueDate: "2025-01-20",
    dueDate: "2025-01-10",
    paidDate: null,
    status: "overdue",
    paymentTerms: 30,
    lateFeesPercent: 2.0,
    discountPercent: 0,
    discountDueDate: null,
    items: [
      {
        description: "Patrocínio Ouro",
        quantity: 1,
        unitPrice: 15000.00,
        total: 15000.00
      }
    ],
    subtotal: 15000.00,
    taxAmount: 0,
    totalAmount: 15000.00,
    paidAmount: 0,
    balanceDue: 15000.00,
    notes: "Patrocínio inclui logo no material gráfico",
    internalNotes: "Cliente em atraso - entrar em contato",
    pdfUrl: null,
    attachments: [],
    sentAt: "2025-01-20T12:00:00Z",
    lastViewedAt: null,
    remindersSent: 3,
    lastReminderAt: "2025-01-25T10:00:00Z",
    createdBy: "admin",
    createdAt: "2025-01-20T11:00:00Z",
    updatedAt: "2025-01-25T10:00:00Z",
    entity: {
      id: 3,
      name: "Mega Corp",
      email: "financeiro@megacorp.com.br",
      phone: "(11) 77777-7777"
    },
    event: {
      id: 1,
      name: "Tech Expo 2025",
      startDate: "2025-03-15"
    }
  },
  {
    id: 4,
    number: "INV-2025-004",
    entityId: 4,
    eventId: 2,
    
    description: "Contrato de participação - Stand Premium",
    amount: 4500.00,
    currency: "BRL",
    issueDate: "2025-01-22",
    dueDate: "2025-02-22",
    paidDate: null,
    status: "draft",
    paymentTerms: 30,
    lateFeesPercent: 2.0,
    discountPercent: 0,
    discountDueDate: null,
    items: [
      {
        description: "Stand Premium 3x3m",
        quantity: 1,
        unitPrice: 4500.00,
        total: 4500.00
      }
    ],
    subtotal: 4500.00,
    taxAmount: 0,
    totalAmount: 4500.00,
    paidAmount: 0,
    balanceDue: 4500.00,
    notes: "Aguardando aprovação do cliente",
    internalNotes: "Rascunho - não enviar ainda",
    pdfUrl: null,
    attachments: [],
    sentAt: null,
    lastViewedAt: null,
    remindersSent: 0,
    lastReminderAt: null,
    createdBy: "admin",
    createdAt: "2025-01-22T14:00:00Z",
    updatedAt: "2025-01-22T14:00:00Z",
    entity: {
      id: 4,
      name: "StartUp Inovadora",
      email: "contato@startupinovadora.com.br",
      phone: "(11) 66666-6666"
    },
    event: {
      id: 2,
      name: "Innovation Summit 2025",
      startDate: "2025-04-20"
    }
  }
];

export const mockPayments = [
  {
    id: 1,
    invoiceId: 2,
    amount: 2850.00,
    currency: "BRL",
    method: "pix",
    reference: "PIX-20250119-001",
    externalId: "pix_1234567890",
    status: "completed",
    paidAt: "2025-01-19T16:00:00Z",
    processedAt: "2025-01-19T16:01:00Z",
    processor: "manual",
    processorFee: 0,
    netAmount: 2850.00,
    notes: "Pagamento via PIX com desconto antecipado",
    metadata: {},
    reconciledAt: "2025-01-20T09:00:00Z",
    bankStatementReference: "PIX-001-20250119",
    createdBy: "admin",
    createdAt: "2025-01-19T16:00:00Z",
    updatedAt: "2025-01-20T09:00:00Z"
  }
];

export const expenses = [
  {
    id: 1,
    description: "Aluguel do espaço para evento",
    supplier: "Centro de Convenções São Paulo",
    eventId: 1,
    amount: 25000.00,
    currency: "BRL",
    issueDate: "2025-01-10",
    dueDate: "2025-02-10",
    paidDate: "2025-01-15",
    status: "paid",
    category: "venue",
    paymentMethod: "bank_transfer",
    paymentReference: "TED-20250115-001",
    notes: "Pagamento do aluguel do pavilhão principal",
    attachments: [],
    supplierEntityId: null,
    approvedBy: "admin",
    approvedAt: "2025-01-12T10:00:00Z",
    createdBy: "admin",
    createdAt: "2025-01-10T09:00:00Z",
    updatedAt: "2025-01-15T14:00:00Z"
  },
  {
    id: 2,
    description: "Serviços de catering para evento",
    supplier: "Buffet Premium",
    eventId: 1,
    amount: 8500.00,
    currency: "BRL",
    issueDate: "2025-01-12",
    dueDate: "2025-02-12",
    paidDate: null,
    status: "pending",
    category: "catering",
    paymentMethod: null,
    paymentReference: null,
    notes: "Coffee break e almoço para 200 pessoas",
    attachments: [],
    supplierEntityId: null,
    approvedBy: "admin",
    approvedAt: "2025-01-12T15:00:00Z",
    createdBy: "admin",
    createdAt: "2025-01-12T14:00:00Z",
    updatedAt: "2025-01-12T15:00:00Z"
  },
  {
    id: 3,
    description: "Equipamentos de som e iluminação",
    supplier: "Audio Visual Pro",
    eventId: 1,
    amount: 12000.00,
    currency: "BRL",
    issueDate: "2025-01-14",
    dueDate: "2025-02-14",
    paidDate: null,
    status: "pending",
    category: "equipment",
    paymentMethod: null,
    paymentReference: null,
    notes: "Sistema completo de som e iluminação LED",
    attachments: [],
    supplierEntityId: null,
    approvedBy: null,
    approvedAt: null,
    createdBy: "admin",
    createdAt: "2025-01-14T11:00:00Z",
    updatedAt: "2025-01-14T11:00:00Z"
  },
  {
    id: 4,
    description: "Marketing digital e impressos",
    supplier: "Agência Criativa",
    eventId: 1,
    amount: 5500.00,
    currency: "BRL",
    issueDate: "2025-01-16",
    dueDate: "2025-01-06",
    paidDate: null,
    status: "overdue",
    category: "marketing",
    paymentMethod: null,
    paymentReference: null,
    notes: "Campanha digital e material gráfico",
    attachments: [],
    supplierEntityId: null,
    approvedBy: "admin",
    approvedAt: "2025-01-16T13:00:00Z",
    createdBy: "admin",
    createdAt: "2025-01-16T12:00:00Z",
    updatedAt: "2025-01-16T13:00:00Z"
  },
  {
    id: 5,
    description: "Segurança do evento",
    supplier: "Segurança Total",
    eventId: 2,
    amount: 3200.00,
    currency: "BRL",
    issueDate: "2025-01-18",
    dueDate: "2025-02-18",
    paidDate: null,
    status: "pending",
    category: "security",
    paymentMethod: null,
    paymentReference: null,
    notes: "Equipe de segurança para 2 dias de evento",
    attachments: [],
    supplierEntityId: null,
    approvedBy: null,
    approvedAt: null,
    createdBy: "admin",
    createdAt: "2025-01-18T16:00:00Z",
    updatedAt: "2025-01-18T16:00:00Z"
  }
];

export const mockExpenses = [
  {
    id: 1,
    description: "Aluguel do espaço para evento",
    supplier: "Centro de Convenções São Paulo",
    eventId: 1,
    amount: 25000.00,
    currency: "BRL",
    issueDate: "2025-01-10",
    dueDate: "2025-02-10",
    paidDate: "2025-01-15",
    status: "paid",
    category: "venue",
    paymentMethod: "bank_transfer",
    paymentReference: "TED-20250115-001",
    notes: "Pagamento do aluguel do pavilhão principal",
    attachments: [],
    supplierEntityId: null,
    approvedBy: "admin",
    approvedAt: "2025-01-12T10:00:00Z",
    createdBy: "admin",
    createdAt: "2025-01-10T09:00:00Z",
    updatedAt: "2025-01-15T14:00:00Z"
  },
  {
    id: 2,
    description: "Serviços de catering para evento",
    supplier: "Buffet Premium",
    eventId: 1,
    amount: 8500.00,
    currency: "BRL",
    issueDate: "2025-01-12",
    dueDate: "2025-02-12",
    paidDate: null,
    status: "pending",
    category: "catering",
    paymentMethod: null,
    paymentReference: null,
    notes: "Coffee break e almoço para 200 pessoas",
    attachments: [],
    supplierEntityId: null,
    approvedBy: "admin",
    approvedAt: "2025-01-12T15:00:00Z",
    createdBy: "admin",
    createdAt: "2025-01-12T14:00:00Z",
    updatedAt: "2025-01-12T15:00:00Z"
  },
  {
    id: 3,
    description: "Equipamentos de som e iluminação",
    supplier: "Audio Visual Pro",
    eventId: 1,
    amount: 12000.00,
    currency: "BRL",
    issueDate: "2025-01-14",
    dueDate: "2025-02-14",
    paidDate: null,
    status: "pending",
    category: "equipment",
    paymentMethod: null,
    paymentReference: null,
    notes: "Sistema completo de som e iluminação LED",
    attachments: [],
    supplierEntityId: null,
    approvedBy: null,
    approvedAt: null,
    createdBy: "admin",
    createdAt: "2025-01-14T11:00:00Z",
    updatedAt: "2025-01-14T11:00:00Z"
  },
  {
    id: 4,
    description: "Marketing digital e impressos",
    supplier: "Agência Criativa",
    eventId: 1,
    amount: 5500.00,
    currency: "BRL",
    issueDate: "2025-01-16",
    dueDate: "2025-01-06",
    paidDate: null,
    status: "overdue",
    category: "marketing",
    paymentMethod: null,
    paymentReference: null,
    notes: "Campanha digital e material gráfico",
    attachments: [],
    supplierEntityId: null,
    approvedBy: "admin",
    approvedAt: "2025-01-16T13:00:00Z",
    createdBy: "admin",
    createdAt: "2025-01-16T12:00:00Z",
    updatedAt: "2025-01-16T13:00:00Z"
  },
  {
    id: 5,
    description: "Segurança do evento",
    supplier: "Segurança Total",
    eventId: 2,
    amount: 3200.00,
    currency: "BRL",
    issueDate: "2025-01-18",
    dueDate: "2025-02-18",
    paidDate: null,
    status: "pending",
    category: "security",
    paymentMethod: null,
    paymentReference: null,
    notes: "Equipe de segurança para 2 dias de evento",
    attachments: [],
    supplierEntityId: null,
    approvedBy: null,
    approvedAt: null,
    createdBy: "admin",
    createdAt: "2025-01-18T16:00:00Z",
    updatedAt: "2025-01-18T16:00:00Z"
  }
];

export const mockFinancialSummary = {
  currentBalance: 45350.00,
  accountsReceivable: 24500.00,
  accountsPayable: 29200.00,
  totalRevenue: 25350.00,
  totalExpenses: 54200.00,
  netProfit: -28850.00,
  lastUpdated: "2025-01-25T10:00:00Z"
};

export const mockCashflowData = [
  { month: "Jan", income: 25350, expenses: 54200, net: -28850 },
  { month: "Fev", income: 35000, expenses: 28000, net: 7000 },
  { month: "Mar", income: 45000, expenses: 32000, net: 13000 },
  { month: "Abr", income: 38000, expenses: 29000, net: 9000 },
  { month: "Mai", income: 42000, expenses: 31000, net: 11000 },
  { month: "Jun", income: 48000, expenses: 35000, net: 13000 }
];

export const mockUrgentActions = [
  {
    id: 1,
    type: "overdue_invoice",
    title: "Fatura vencida",
    description: "INV-2025-003 - Mega Corp - R$ 15.000,00",
    priority: "high",
    dueDate: "2025-01-10",
    actionUrl: "/admin/financeiro/faturas/3"
  },
  {
    id: 2,
    type: "overdue_expense",
    title: "Despesa vencida",
    description: "Marketing digital - R$ 5.500,00",
    priority: "high",
    dueDate: "2025-01-06",
    actionUrl: "/admin/financeiro/despesas/4"
  },
  {
    id: 3,
    type: "pending_approval",
    title: "Despesa pendente de aprovação",
    description: "Equipamentos de som - R$ 12.000,00",
    priority: "medium",
    dueDate: "2025-02-14",
    actionUrl: "/admin/financeiro/despesas/3"
  },
  {
    id: 4,
    type: "draft_invoice",
    title: "Fatura em rascunho",
    description: "INV-2025-004 - StartUp Inovadora - R$ 4.500,00",
    priority: "low",
    dueDate: "2025-02-22",
    actionUrl: "/admin/financeiro/faturas/4"
  }
];

// Utilitários para filtrar e buscar dados
export const getInvoices = () => {
  return mockInvoices;
};

export const getInvoicesByStatus = (status) => {
  return mockInvoices.filter(invoice => invoice.status === status);
};

export const filterInvoicesByStatus = (status) => {
  if (status === 'all') return mockInvoices;
  return mockInvoices.filter(invoice => invoice.status === status);
};

export const getExpensesByStatus = (status) => {
  return mockExpenses.filter(expense => expense.status === status);
};

export const getExpensesByCategory = (category) => {
  return mockExpenses.filter(expense => expense.category === category);
};

export const searchInvoices = (query) => {
  const lowercaseQuery = query.toLowerCase();
  return mockInvoices.filter(invoice => 
    invoice.number.toLowerCase().includes(lowercaseQuery) ||
    invoice.description.toLowerCase().includes(lowercaseQuery) ||
    invoice.entity.name.toLowerCase().includes(lowercaseQuery)
  );
};

export const searchExpenses = (query) => {
  const lowercaseQuery = query.toLowerCase();
  return mockExpenses.filter(expense => 
    expense.description.toLowerCase().includes(lowercaseQuery) ||
    expense.supplier.toLowerCase().includes(lowercaseQuery)
  );
};

// Status e categorias disponíveis
export const invoiceStatuses = [
  { value: "draft", label: "Rascunho", color: "gray" },
  { value: "sent", label: "Enviada", color: "blue" },
  { value: "paid", label: "Paga", color: "green" },
  { value: "overdue", label: "Vencida", color: "red" },
  { value: "cancelled", label: "Cancelada", color: "gray" },
  { value: "partially_paid", label: "Parcialmente Paga", color: "yellow" }
];

export const expenseStatuses = [
  { value: "pending", label: "Pendente", color: "yellow" },
  { value: "paid", label: "Pago", color: "green" },
  { value: "overdue", label: "Vencido", color: "red" },
  { value: "cancelled", label: "Cancelado", color: "gray" }
];

export const expenseCategories = [
  { value: "venue", label: "Local", icon: "Building" },
  { value: "catering", label: "Catering", icon: "UtensilsCrossed" },
  { value: "equipment", label: "Equipamentos", icon: "Settings" },
  { value: "marketing", label: "Marketing", icon: "Megaphone" },
  { value: "security", label: "Segurança", icon: "Shield" },
  { value: "staff", label: "Pessoal", icon: "Users" },
  { value: "other", label: "Outros", icon: "MoreHorizontal" }
];

export const paymentMethods = [
  { value: "pix", label: "PIX" },
  { value: "bank_transfer", label: "Transferência Bancária" },
  { value: "credit_card", label: "Cartão de Crédito" },
  { value: "cash", label: "Dinheiro" },
  { value: "check", label: "Cheque" },
  { value: "boleto", label: "Boleto" }
];

// Funções para obter dados financeiros
export const getFinancialSummary = () => {
  const invoicesCount = {
    total: mockInvoices.length,
    draft: mockInvoices.filter(inv => inv.status === 'draft').length,
    sent: mockInvoices.filter(inv => inv.status === 'sent').length,
    paid: mockInvoices.filter(inv => inv.status === 'paid').length,
    overdue: mockInvoices.filter(inv => inv.status === 'overdue').length
  };
  
  const expensesCount = {
    total: mockExpenses.length,
    pending: mockExpenses.filter(exp => exp.status === 'pending').length,
    paid: mockExpenses.filter(exp => exp.status === 'paid').length,
    overdue: mockExpenses.filter(exp => exp.status === 'overdue').length
  };
  
  return {
    ...mockFinancialSummary,
    invoicesCount,
    expensesCount,
    totalBalance: mockFinancialSummary.currentBalance,
    totalReceivable: mockFinancialSummary.accountsReceivable,
    totalPayable: mockFinancialSummary.accountsPayable
  };
};

export const getCashflowData = () => {
  return mockCashflowData;
};

export const getUrgentActions = () => {
  return mockUrgentActions;
};