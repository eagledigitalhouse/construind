import React from "react";
import { ArrowRight, Star, Eye, Users, Zap, Store, Target, Handshake, TrendingUp, Award, Crown, CheckCircle, Calendar, Building2, UserCheck, Phone, Mail, MapPin, Clock, Activity, Sparkles } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import CTASection from "@/components/sections/CTASection";
import Footer from "@/components/layout/Footer";
import MapViewer from "@/components/pages/MapViewer";
import { GlassChip } from "@/components/ui/glass-chip";
import { TextReveal } from "@/components/ui/text-reveal";
import { AnimatedList } from "@/components/ui/animated-list";

const ExpositorPage = () => {
  const beneficiosExpositor = [
    {
      icon: <Target className="w-6 h-6" />,
      title: "Primeira Feira do Segmento",
      description: "Seja pioneiro na primeira feira de esporte do interior de SP. Posicione sua marca como líder desde o início."
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "15.000 Visitantes Qualificados",
      description: "Acesso direto a proprietários de academias, personal trainers e entusiastas do esporte em 3 dias."
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "ROI Garantido",
      description: "Ambiente exclusivo para fechamento de negócios, parcerias e expansão da sua rede de contatos."
    },
    {
      icon: <Crown className="w-6 h-6" />,
      title: "Visibilidade Premium",
      description: "Sua marca em destaque nos telões LED, materiais oficiais e redes sociais do evento."
    },
    {
      icon: <Activity className="w-6 h-6" />,
      title: "Demonstrações ao Vivo",
      description: "1 hora exclusiva nas arenas esportivas para apresentar produtos e conquistar clientes."
    },
    {
      icon: <Handshake className="w-6 h-6" />,
      title: "Networking Estratégico",
      description: "Conecte-se com decisores, influenciadores e profissionais do mercado fitness."
    }
  ];

  const tiposEstandes = [
    {
      nome: "ESTANDES 3X3M",
      tamanho: "Metragem 9m²",
      cor: "from-[#0a2856] to-[#00d856]",
      icone: <Store className="w-8 h-8" />,
      destaque: true,
      beneficios: [
        "Estande octanorme completo",
        "Carpete incluso",
        "Energia 220V",
        "Localização estratégica",
        "Suporte técnico"
      ]
    },
    {
      nome: "ÁREA LIVRE 5X5M",
      tamanho: "Metragem 25m²",
      cor: "from-[#00d856] to-[#b1f727]",
      icone: <Sparkles className="w-8 h-8" />,
      destaque: false,
      beneficios: [
        "Espaço amplo sem estande",
        "Energia 220V inclusa",
        "Flexibilidade total de layout",
        "Ideal para demonstrações",
        "Maior visibilidade"
      ]
    }
  ];

  const segmentosEvento = [
    {
      nome: "ESTANDES ACADEMIAS 3X3M",
      cor: "bg-[#b1f727]",
      descricao: "Área exclusiva para academias e centros de treinamento"
    },
    {
      nome: "ESTANDES BEM ESTAR 3X3M",
      cor: "bg-[#ff6b6b]",
      descricao: "Espaço para produtos de bem-estar e saúde"
    },
    {
      nome: "ESTANDES ARTIGOS ESPORTIVOS 3X3M",
      cor: "bg-[#4ecdc4]",
      descricao: "Área para equipamentos e artigos esportivos"
    },
    {
      nome: "ESTANDES SAÚDE-SUPLEMENTOS-NUTRIÇÃO 3X3M",
      cor: "bg-[#45b7d1]",
      descricao: "Segmento focado em nutrição e suplementação"
    }
  ];

  const infoEvento = [
    {
      icone: <Calendar className="w-7 h-7" />,
      titulo: "Data",
      descricao: "14 a 16 de novembro de 2025",
      cor: "from-[#0a2856] to-[#00d856]"
    },
    {
      icone: <Clock className="w-7 h-7" />,
      titulo: "Horário",
      descricao: "8h às 20h todos os dias",
      cor: "from-[#00d856] to-[#b1f727]"
    },
    {
      icone: <Building2 className="w-7 h-7" />,
      titulo: "Local",
      descricao: "Espaço Viber - Indaiatuba/SP",
      cor: "from-[#0a2856] to-[#00d856]"
    },
    {
      icone: <UserCheck className="w-7 h-7" />,
      titulo: "Público",
      descricao: "15.000 visitantes esperados",
      cor: "from-[#00d856] to-[#b1f727]"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[80vh] flex items-center">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a2856] via-[#0a2856]/95 to-[#00d856]/80"></div>
        <div className="absolute inset-0 bg-[url('/background-section1.png')] bg-cover bg-center opacity-5"></div>
        
        <div className="absolute top-20 left-10 w-32 h-32 bg-[#00d856]/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-[#b1f727]/20 rounded-full blur-3xl animate-pulse-slow" style={{animationDelay: '1s'}}></div>
        
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center max-w-5xl mx-auto">
            <div className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white mb-4 shadow-xl">
              <Crown className="w-5 h-5 mr-2 text-[#b1f727]" />
              <span className="font-semibold">Seja um Expositor FESPIN 2025</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-extrabold leading-[0.9] mb-2">
              <span className="block text-white mb-1">Seja pioneiro na</span>
              <span className="block bg-gradient-to-r from-[#00d856] via-[#b1f727] to-[#00d856] bg-clip-text text-transparent animate-pulse-slow">
                primeira feira do segmento
              </span>
            </h1>
            
            <p className="text-base md:text-lg text-white/90 mb-4 max-w-3xl mx-auto leading-tight font-light">
              Posicione sua marca como líder desde o início. Conecte-se com mais de <span className="font-bold text-[#b1f727]">15.000 visitantes</span> qualificados na primeira feira de esporte do interior de São Paulo.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <button 
                onClick={() => document.getElementById('tipos-estandes')?.scrollIntoView({ behavior: 'smooth' })}
                className="group bg-gradient-to-r from-[#00d856] to-[#b1f727] hover:from-[#00d856]/90 hover:to-[#b1f727]/90 text-[#0a2856] font-bold py-5 px-10 rounded-2xl transition-all duration-300 hover:scale-105 transform shadow-2xl hover:shadow-[#00d856]/50 min-w-[280px]"
              >
                <span className="flex items-center justify-center">
                  Ver Tipos de Estandes
                  <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                </span>
              </button>
              <button 
                onClick={() => document.getElementById('contato')?.scrollIntoView({ behavior: 'smooth' })}
                className="group bg-transparent border-2 border-white/60 text-white hover:bg-white/10 hover:border-white font-bold py-5 px-10 rounded-2xl transition-all duration-300 backdrop-blur-sm min-w-[280px]"
              >
                <span className="flex items-center justify-center">
                  Garantir Meu Espaço
                  <Phone className="ml-2 w-5 h-5 transition-transform group-hover:scale-110" />
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

            {/* Por que Expor na FESPIN */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Coluna Esquerda - Conteúdo */}
            <div className="lg:sticky lg:top-8">
              <div className="flex items-start gap-4 mb-8 justify-start">
                <GlassChip icon={<Target className="w-4 h-4" />}>
                  Oportunidade única
                </GlassChip>
              </div>
              
              <div className="space-y-6">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold text-gray-900 leading-tight text-left">
                  <span className="block">
                    <TextReveal className="py-0 text-left" highlightWords={["expor"]}>
                      Por que expor na
                    </TextReveal>
                  </span>
                  <span className="block">
                    <TextReveal className="py-0 text-left" highlightWords={["FESPIN", "2025"]}>
                      FESPIN 2025?
                    </TextReveal>
                  </span>
                </h2>
                
                <p className="text-lg text-gray-600 leading-tight max-w-lg text-left">
                  A primeira feira de esporte do interior é sua chance de liderar um mercado em expansão 
                  e conectar-se com um público altamente qualificado.
                </p>
              </div>
            </div>
            
            {/* Coluna Direita - Benefícios */}
            <div className="space-y-6">
              {[
                {
                  icon: <Eye className="w-5 h-5" />,
                  title: "Visibilidade da marca",
                  description: "Exponha sua marca para milhares de visitantes e potenciais clientes do segmento esportivo."
                },
                {
                  icon: <Users className="w-5 h-5" />,
                  title: "Networking qualificado",
                  description: "Conecte-se com profissionais, atletas e empresários do setor esportivo regional."
                },
                {
                  icon: <TrendingUp className="w-5 h-5" />,
                  title: "Aumente suas vendas",
                  description: "Aproveite o ambiente propício para apresentar produtos e fechar negócios."
                },
                {
                  icon: <Target className="w-5 h-5" />,
                  title: "Posicionamento estratégico",
                  description: "Associe sua marca ao primeiro evento esportivo do interior da região."
                }
              ].map((beneficio, index) => (
                <div 
                  key={index} 
                  className="group flex gap-4 p-6 bg-white rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all duration-300"
                  style={{
                    animation: `fadeInUp 0.6s ease-out forwards`,
                    animationDelay: `${index * 0.1}s`,
                    opacity: 0
                  }}
                >
                  {/* Ícone */}
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-gray-700 group-hover:bg-gray-100 transition-colors duration-300">
                    {beneficio.icon}
                  </div>
                  
                  {/* Conteúdo */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-display font-bold text-gray-900 mb-2 leading-tight">
                      {beneficio.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-tight">
                      {beneficio.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mapa do Evento */}
      <section id="mapa-evento" className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6 md:mb-8">
            <div className="flex items-center justify-center gap-4 mb-6">
              <GlassChip icon={<MapPin className="w-4 h-4" />}>
                Layout do evento
              </GlassChip>
            </div>
            
            <div className="mb-2">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-extrabold text-gray-900 leading-tight">
                <TextReveal className="py-0" highlightWords={["Mapa", "evento"]}>
                  Mapa do evento
                </TextReveal>
              </h2>
            </div>
            
            <p className="text-base text-gray-600 max-w-3xl mx-auto leading-tight">
              Veja a distribuição dos estandes e escolha a localização ideal para sua marca.
            </p>
          </div>
          
          {/* Visualizador do Mapa */}
          <div className="max-w-6xl mx-auto">
            <MapViewer 
              mapImage="/mapa fespin.png"
              title="Mapa do Evento FESPIN 2025"
              description="Visualize a distribuição dos estandes e escolha a localização ideal para sua marca"
            />
          </div>
        </div>
      </section>

      <CTASection 
        variant="patrocinio"
        title="Não perca esta oportunidade única"
        subtitle="Vagas limitadas!"
        description="Seja um dos pioneiros na primeira feira de esporte do interior. Garanta seu espaço antes que seja tarde."
        primaryButton={{
          text: "Quero Garantir Meu Espaço",
          href: "#contato",
          icon: <Crown className="mr-3 w-5 h-5" />
        }}
        secondaryButton={{
          text: "Falar com Consultor",
          href: "#contato",
          icon: <Phone className="mr-3 w-5 h-5" />
        }}
        highlights={[
          { text: "Apenas 83 Vagas" },
          { text: "Resposta em 24h", delay: 0.5 },
          { text: "Primeira Feira do Segmento", delay: 1 }
        ]}
      />

      {/* Tipos de Estandes */}
      <section id="tipos-estandes" className="py-12 md:py-16 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-[#00d856]/3 to-transparent"></div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-6 md:mb-8">
            <div className="flex items-center justify-center gap-4 mb-6">
              <GlassChip icon={<Store className="w-4 h-4" />}>
                Escolha seu espaço
              </GlassChip>
            </div>
            
            <div className="mb-2">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-extrabold text-gray-900 leading-tight">
                <TextReveal className="py-0" highlightWords={["Tipos", "estandes"]}>
                  Tipos de estandes
                </TextReveal>
              </h2>
            </div>
            
            <p className="text-base text-gray-600 max-w-3xl mx-auto leading-tight">
              Escolha o formato ideal para apresentar sua marca e produtos no evento.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {tiposEstandes.map((tipo, index) => (
              <div 
                key={index} 
                className={`group relative rounded-3xl overflow-hidden shadow-2xl transition-all duration-500 hover:scale-105 hover:shadow-3xl`}
                style={{
                  animation: `fadeInUp 0.6s ease-out forwards`,
                  animationDelay: `${index * 0.15}s`,
                  opacity: 0
                }}
              >
                <div className={`bg-gradient-to-br ${tipo.cor} p-8 text-center relative`}>
                  <div className="absolute inset-0 bg-white/5 backdrop-blur-sm"></div>
                  
                  <div className="relative">
                    <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white mb-6 mx-auto shadow-lg">
                      {tipo.icone}
                    </div>
                    <h3 className="text-xl font-display font-bold text-white mb-1">
                      {tipo.nome}
                    </h3>
                    <p className="text-lg text-white/90 font-semibold">
                      {tipo.tamanho}
                    </p>
                  </div>
                </div>
                
                <div className="bg-white p-8">
                  <ul className="space-y-3 mb-8">
                    {tipo.beneficios.map((beneficio, beneficioIndex) => (
                      <li key={beneficioIndex} className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <CheckCircle className="w-4 h-4 text-gray-700" />
                        </div>
                                                  <span className="text-gray-700 leading-tight">{beneficio}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <button 
                    onClick={() => document.getElementById('contato')?.scrollIntoView({ behavior: 'smooth' })}
                    className="w-full py-4 px-6 rounded-2xl font-bold transition-all duration-300 hover:scale-105 shadow-lg bg-gradient-to-r from-[#00d856] to-[#b1f727] hover:from-[#00d856]/90 hover:to-[#b1f727]/90 text-[#0a2856] shadow-[#00d856]/30"
                  >
                    <span className="flex items-center justify-center">
                      Quero Este Espaço
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Segmentos do Evento */}
      <section className="py-12 md:py-16 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#00d856]/5 rounded-full blur-3xl -translate-x-48 -translate-y-48"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#b1f727]/5 rounded-full blur-3xl translate-x-40 translate-y-40"></div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-4 mb-6">
              <GlassChip icon={<Activity className="w-4 h-4" />}>
                Segmentos especializados
              </GlassChip>
            </div>
            
            <div className="mb-2">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-extrabold text-gray-900 leading-tight">
                <TextReveal className="py-0" highlightWords={["Áreas", "exclusivas", "segmento"]}>
                  Áreas exclusivas para cada segmento
                </TextReveal>
              </h2>
            </div>
            
            <p className="text-base text-gray-600 max-w-3xl mx-auto leading-tight">
              Cada segmento tem sua área exclusiva para maximizar o networking 
              e as oportunidades de negócios entre empresas do mesmo setor.
            </p>
          </div>
          
          <div className="bg-gray-50 rounded-2xl p-6 md:p-8 mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl md:text-3xl font-display font-bold text-gray-900 mb-4">
                  4 Segmentos Especializados
                </h3>
                <p className="text-base text-gray-600 leading-tight mb-6">
                  Cada área do evento foi pensada para criar conexões estratégicas 
                  entre empresas complementares, maximizando as oportunidades de 
                  networking e parcerias comerciais.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-[#b1f727] flex items-center justify-center text-[#0a2856] flex-shrink-0">
                      <Store className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-gray-900 mb-1">Academias</h4>
                      <p className="text-sm text-gray-600">Centros de treinamento e academias</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-[#ff6d4d] flex items-center justify-center text-white flex-shrink-0">
                      <Activity className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-gray-900 mb-1">Bem-estar</h4>
                      <p className="text-sm text-gray-600">Produtos de saúde e bem-estar</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-[#6cace3] flex items-center justify-center text-white flex-shrink-0">
                      <Target className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-gray-900 mb-1">Artigos Esportivos</h4>
                      <p className="text-sm text-gray-600">Equipamentos e acessórios</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-[#4dff8e] flex items-center justify-center text-[#0a2856] flex-shrink-0">
                      <Zap className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-gray-900 mb-1">Saúde & Nutrição</h4>
                      <p className="text-sm text-gray-600">Suplementos e nutrição esportiva</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="rounded-2xl overflow-hidden">
                <div className="bg-gradient-to-br from-[#0a2856] to-[#00d856] p-8 text-white rounded-2xl">
                  <h4 className="text-xl font-display font-bold mb-3">
                    Networking Estratégico
                  </h4>
                  <p className="text-white/90 mb-4">
                    Cada segmento foi posicionado estrategicamente para facilitar 
                    conexões entre empresas complementares e potenciais parceiros.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-[#b1f727] flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-[#0a2856]" />
                      </div>
                      <span className="text-sm">Proximidade entre segmentos complementares</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-[#b1f727] flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-[#0a2856]" />
                      </div>
                      <span className="text-sm">Área de networking central</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-[#b1f727] flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-[#0a2856]" />
                      </div>
                      <span className="text-sm">Praça de alimentação integrada</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Informações do Evento - Integrada */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 md:p-8">
            <div className="text-center mb-4">
              <h3 className="text-xl md:text-2xl font-display font-bold text-gray-900 mb-2 flex items-center justify-center gap-3">
                <Zap className="w-6 h-6 text-[#00d856]" />
                Informações do Evento
              </h3>
              <div className="flex justify-center gap-2 mt-3">
                <span className="px-3 py-1 bg-[#0a2856]/10 text-[#0a2856] text-sm font-medium rounded-full">FESPIN 2025</span>
                <span className="px-3 py-1 bg-[#00d856]/10 text-[#00d856] text-sm font-medium rounded-full">PRIMEIRA EDIÇÃO</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
              {/* Data */}
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 shadow-sm p-4 hover:shadow-md transition-all duration-200 flex flex-col items-center justify-center">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#0a2856]/10 mb-3">
                  <Calendar className="w-6 h-6 text-[#0a2856]" />
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-500 mb-1">Data</div>
                  <div className="font-bold text-gray-800">14-16</div>
                  <div className="text-xs text-gray-400">NOVEMBRO</div>
                </div>
              </div>
              
              {/* Horário */}
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 shadow-sm p-4 hover:shadow-md transition-all duration-200 flex flex-col items-center justify-center">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#00d856]/10 mb-3">
                  <Clock className="w-6 h-6 text-[#00d856]" />
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-500 mb-1">Horário</div>
                  <div className="font-bold text-gray-800">08-20h</div>
                  <div className="text-xs text-gray-400">TODOS OS DIAS</div>
                </div>
              </div>
              
              {/* Local */}
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 shadow-sm p-4 hover:shadow-md transition-all duration-200 flex flex-col items-center justify-center">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#b1f727]/10 mb-3">
                  <MapPin className="w-6 h-6 text-[#b1f727]" />
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-500 mb-1">Local</div>
                  <div className="font-bold text-gray-800">Espaço Viber</div>
                  <div className="text-xs text-gray-400">INDAIATUBA/SP</div>
                </div>
              </div>
              
              {/* Público */}
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 shadow-sm p-4 hover:shadow-md transition-all duration-200 flex flex-col items-center justify-center">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#0a2856]/10 mb-3">
                  <Users className="w-6 h-6 text-[#0a2856]" />
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-500 mb-1">Público</div>
                  <div className="font-bold text-gray-800">15.000</div>
                  <div className="text-xs text-gray-400">VISITANTES</div>
                </div>
              </div>
              
              {/* Expositores */}
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 shadow-sm p-4 hover:shadow-md transition-all duration-200 flex flex-col items-center justify-center">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#00d856]/10 mb-3">
                  <Store className="w-6 h-6 text-[#00d856]" />
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-500 mb-1">Expositores</div>
                  <div className="font-bold text-gray-800">83</div>
                  <div className="text-xs text-gray-400">ESPAÇOS</div>
                </div>
              </div>
              
              {/* Segmentos */}
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 shadow-sm p-4 hover:shadow-md transition-all duration-200 flex flex-col items-center justify-center">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#b1f727]/10 mb-3">
                  <Target className="w-6 h-6 text-[#b1f727]" />
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-500 mb-1">Segmentos</div>
                  <div className="font-bold text-gray-800">4</div>
                  <div className="text-xs text-gray-400">ÁREAS</div>
                </div>
              </div>
            </div>
            
            {/* Barra de Progresso */}
            <div className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between text-sm mb-3">
                <span className="text-gray-600 font-medium">Ocupação dos espaços</span>
                <span className="font-bold text-[#0a2856]">80%</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#0a2856] to-[#00d856] w-4/5 rounded-full transition-all duration-500"></div>
              </div>
              <div className="text-center mt-3">
                <span className="text-xs text-gray-500">Restam apenas 17 espaços disponíveis</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contato Section */}
      <section id="contato" className="py-12 md:py-16 bg-gradient-to-br from-white to-gray-50 relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-6 md:mb-8">
            <div className="flex items-center justify-center gap-4 mb-6">
              <GlassChip icon={<Phone className="w-4 h-4" />}>
                Fale conosco
              </GlassChip>
            </div>
            
            <div className="mb-2">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-extrabold text-gray-900 leading-tight">
                <TextReveal className="py-0" highlightWords={["Garanta", "espaço", "FESPIN", "2025"]}>
                  Garanta seu espaço na FESPIN 2025
                </TextReveal>
              </h2>
            </div>
            
            <p className="text-base md:text-lg text-gray-600 max-w-3xl mx-auto leading-tight">
              Entre em contato conosco e garante seu espaço na primeira feira de esporte do interior. 
              Nossa equipe está pronta para ajudar você a escolher a melhor opção.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
                          <div className="bg-white rounded-3xl p-8 md:p-10 shadow-2xl border border-gray-100">
                <div className="text-center mb-6">
                  <h3 className="text-xl md:text-2xl font-display font-bold text-gray-900 mb-3">
                    Solicite Informações Sem Compromisso
                  </h3>
                  <p className="text-sm text-gray-600">
                    Preencha o formulário abaixo e nossa equipe entrará em contato em até 24 horas.
                  </p>
                </div>
              
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Nome da Empresa *
                    </label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#00d856] focus:border-transparent transition-all duration-300"
                      placeholder="Digite o nome da sua empresa"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Responsável *
                    </label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#00d856] focus:border-transparent transition-all duration-300"
                      placeholder="Seu nome completo"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      E-mail *
                    </label>
                    <input 
                      type="email" 
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#00d856] focus:border-transparent transition-all duration-300"
                      placeholder="seu@email.com"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Telefone *
                    </label>
                    <input 
                      type="tel" 
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#00d856] focus:border-transparent transition-all duration-300"
                      placeholder="(11) 9 9999-9999"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tipo de Estande Preferido
                  </label>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#00d856] focus:border-transparent transition-all duration-300">
                    <option value="">Selecione uma opção</option>
                    <option value="3x3">Estande 3x3m (9m²)</option>
                    <option value="5x5">Área Livre 5x5m (25m²)</option>
                    <option value="consulta">Preciso de consultoria</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Mensagem
                  </label>
                  <textarea 
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#00d856] focus:border-transparent transition-all duration-300 h-32 resize-none"
                    placeholder="Conte-nos mais sobre sua empresa e objetivos no evento..."
                  ></textarea>
                </div>
                
                <div className="text-center">
                  <button 
                    type="submit"
                    className="bg-gradient-to-r from-[#00d856] to-[#b1f727] hover:from-[#00d856]/90 hover:to-[#b1f727]/90 text-[#0a2856] font-bold py-4 px-12 rounded-2xl transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-[#00d856]/50"
                  >
                    <span className="flex items-center justify-center">
                      <Mail className="mr-3 w-6 h-6" />
                      Enviar Solicitação
                    </span>
                  </button>
                  
                  <p className="text-sm text-gray-500 mt-4">
                    Resposta garantida em até 24 horas úteis
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ExpositorPage;