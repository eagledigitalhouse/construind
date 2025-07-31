const date = new Date();
const nextDay = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
const nextWeek = new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000);
const nextMonth = date.getMonth() === 11 
  ? new Date(date.getFullYear() + 1, 0, 1) 
  : new Date(date.getFullYear(), date.getMonth() + 1, 1);

export const categorias = [
  {
    label: "Trabalho",
    value: "trabalho",
    activeClass: "border-indigo-500 bg-indigo-500",
    className: "group-hover:border-indigo-500",
  },
  {
    label: "Pessoal",
    value: "pessoal",
    activeClass: "border-green-500 bg-green-500",
    className: "group-hover:border-green-500",
  },
  {
    label: "Evento",
    value: "evento",
    activeClass: "border-red-500 bg-red-500",
    className: "group-hover:border-red-500",
  },
  {
    label: "Reunião",
    value: "reuniao",
    activeClass: "border-yellow-500 bg-yellow-500",
    className: "group-hover:border-yellow-500",
  },
  {
    label: "Feriado",
    value: "feriado",
    activeClass: "border-cyan-500 bg-cyan-500",
    className: "group-hover:border-cyan-500",
  },
];

export const agendaData = [
  {
    id: "1",
    title: "Reunião de Planejamento FESPIN 2024",
    start: new Date(date.getFullYear(), date.getMonth(), date.getDate() + 2),
    end: new Date(date.getFullYear(), date.getMonth(), date.getDate() + 2),
    allDay: false,
    extendedProps: {
      calendar: "trabalho",
      descricao: "Reunião para definir estratégias e cronograma do evento FESPIN 2024",
      local: "Sala de Reuniões - Sede FESPIN",
      participantes: ["João Silva", "Maria Santos", "Pedro Costa"],
    },
  },
  {
    id: "2",
    title: "Visita Técnica ao Local do Evento",
    start: new Date(date.getFullYear(), date.getMonth(), date.getDate() + 5),
    end: new Date(date.getFullYear(), date.getMonth(), date.getDate() + 5),
    allDay: true,
    extendedProps: {
      calendar: "evento",
      descricao: "Inspeção e avaliação da infraestrutura do local do evento",
      local: "Centro de Convenções",
      participantes: ["Equipe Técnica", "Fornecedores"],
    },
  },
  {
    id: "3",
    title: "Reunião com Patrocinadores",
    start: new Date(date.getFullYear(), date.getMonth(), date.getDate() + 7),
    end: new Date(date.getFullYear(), date.getMonth(), date.getDate() + 7),
    allDay: false,
    extendedProps: {
      calendar: "reuniao",
      descricao: "Apresentação de propostas e negociação de parcerias",
      local: "Hotel Executivo - Sala VIP",
      participantes: ["Diretoria", "Representantes dos Patrocinadores"],
    },
  },
  {
    id: "4",
    title: "Consulta Médica",
    start: new Date(date.getFullYear(), date.getMonth(), date.getDate() + 3),
    end: new Date(date.getFullYear(), date.getMonth(), date.getDate() + 3),
    allDay: false,
    extendedProps: {
      calendar: "pessoal",
      descricao: "Consulta de rotina",
      local: "Clínica Médica Central",
      participantes: [],
    },
  },
  {
    id: "5",
    title: "Feriado Nacional",
    start: new Date(date.getFullYear(), date.getMonth(), date.getDate() + 15),
    end: new Date(date.getFullYear(), date.getMonth(), date.getDate() + 15),
    allDay: true,
    extendedProps: {
      calendar: "feriado",
      descricao: "Dia de folga nacional",
      local: "",
      participantes: [],
    },
  },
  {
    id: "6",
    title: "Reunião com Fornecedores de Catering",
    start: new Date(date.getFullYear(), date.getMonth(), date.getDate() + 10),
    end: new Date(date.getFullYear(), date.getMonth(), date.getDate() + 10),
    allDay: false,
    extendedProps: {
      calendar: "evento",
      descricao: "Degustação e definição do cardápio para o evento",
      local: "Restaurante Gourmet",
      participantes: ["Chef Executivo", "Coordenador de Eventos"],
    },
  },
  {
    id: "7",
    title: "Workshop de Capacitação da Equipe",
    start: new Date(date.getFullYear(), date.getMonth(), date.getDate() + 12),
    end: new Date(date.getFullYear(), date.getMonth(), date.getDate() + 12),
    allDay: true,
    extendedProps: {
      calendar: "trabalho",
      descricao: "Treinamento em atendimento ao cliente e gestão de eventos",
      local: "Auditório FESPIN",
      participantes: ["Toda a Equipe", "Instrutor Externo"],
    },
  },
  {
    id: "8",
    title: "Aniversário da Filha",
    start: new Date(date.getFullYear(), date.getMonth(), date.getDate() + 20),
    end: new Date(date.getFullYear(), date.getMonth(), date.getDate() + 20),
    allDay: true,
    extendedProps: {
      calendar: "pessoal",
      descricao: "Festa de aniversário",
      local: "Casa",
      participantes: ["Família", "Amigos"],
    },
  },
  {
    id: "9",
    title: "Reunião de Avaliação Mensal",
    start: nextMonth,
    end: nextMonth,
    allDay: false,
    extendedProps: {
      calendar: "trabalho",
      descricao: "Análise de resultados e planejamento do próximo mês",
      local: "Sala de Reuniões",
      participantes: ["Equipe de Gestão"],
    },
  },
  {
    id: "10",
    title: "Inspeção de Segurança do Evento",
    start: new Date(date.getFullYear(), date.getMonth(), date.getDate() + 18),
    end: new Date(date.getFullYear(), date.getMonth(), date.getDate() + 18),
    allDay: false,
    extendedProps: {
      calendar: "evento",
      descricao: "Verificação de protocolos de segurança e emergência",
      local: "Local do Evento",
      participantes: ["Bombeiros", "Segurança Privada", "Coordenação"],
    },
  },
];