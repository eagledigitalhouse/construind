import React from "react";
import { ArrowRight, Star, Eye, Users, Zap, Store, Target, Handshake, TrendingUp, Award, Crown, Sparkles, Heart, Calendar, MapPin, Phone, Mail, CheckCircle, Trophy, Activity, Dumbbell, Building2, UserCheck, Clock } from "lucide-react";
import Navbar from "@/components/Navbar";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";


const PatrocinioPage = () => {
  const beneficiosPatrocinio = [
    {
      icon: <Store className="w-6 h-6" />,
      title: "Estande no Evento",
      description: "Espaço físico exclusivo de 9m² a 12m² em localização privilegiada para exposição da sua marca"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Arena Esportiva",
      description: "1 hora exclusiva na arena esportiva para demonstrações, aulas ou apresentações da sua marca"
    },
    {
      icon: <Eye className="w-6 h-6" />,
      title: "Palco Principal",
      description: "30 minutos no palco principal para apresentação da empresa e produtos para todo o público"
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: "Presença Digital",
      description: "Logo no site oficial da FESPIN com diferentes tamanhos conforme a cota escolhida"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Telão LED",
      description: "Exibição da sua marca no telão LED durante o evento, com opções de vídeo ou estático"
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Marketing Colaborativo",
      description: "Posts colaborativos oficiais no Instagram e presença em todos os materiais promocionais"
    }
  ];

  const cotasPatrocinio = [
    {
      nome: "DIAMANTE",
      icone: <Crown className="w-8 h-8" />,
      cor: "from-[#40E0D0] to-[#00CED1]",
      corTexto: "text-[#008B8B]",
      destaque: true,
      beneficios: [
        "Estande no evento: 12m²",
        "1h na arena esportiva",
        "30min no palco principal",
        "Logo GRANDE no site oficial da FESPIN",
        "Logo no telão LED em vídeo (20s)",
        "Logo em destaque em todos os criativos oficiais",
        "02 posts colaborativos oficiais no Instagram",
        "Direito a sortear brindes no palco",
        "Agradecimento no palco"
      ]
    },
    {
      nome: "OURO",
      icone: <Trophy className="w-8 h-8" />,
      cor: "from-[#FFD700] to-[#DAA520]",
      corTexto: "text-[#B8860B]",
      destaque: false,
      beneficios: [
        "Estande no evento: 9m²",
        "1h na arena esportiva",
        "30min no palco principal",
        "Logo MÉDIO no site oficial da FESPIN",
        "Logo no telão LED estático (15s)",
        "Logo em grupo nos criativos oficiais",
        "01 post colaborativo oficial no Instagram",
        "Direito a sortear brindes no palco",
        "Agradecimento no palco"
      ]
    },
    {
      nome: "PRATA",
      icone: <Sparkles className="w-8 h-8" />,
      cor: "from-[#C0C0C0] to-[#A9A9A9]",
      corTexto: "text-[#696969]",
      destaque: false,
      beneficios: [
        "Estande no evento: 9m²",
        "1h na arena esportiva",
        "30min no palco principal",
        "Logo PEQUENO no site oficial da FESPIN",
        "Logo no telão LED estático (15s)",
        "Logo em grupo nos criativos oficiais",
        "Agradecimento no palco"
      ]
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
      icone: <Building2 className="w-7 h-7" />,
      titulo: "Local",
      descricao: "Espaço Viber - Indaiatuba/SP",
      cor: "from-[#00d856] to-[#b1f727]"
    },
    {
      icone: <UserCheck className="w-7 h-7" />,
      titulo: "Público",
      descricao: "12 a 15 mil visitantes esperados",
      cor: "from-[#0a2856] to-[#00d856]"
    },
    {
      icone: <Activity className="w-7 h-7" />,
      titulo: "Expositores",
      descricao: "83 espaços para expositores",
      cor: "from-[#00d856] to-[#b1f727]"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[80vh] flex items-center">
        {/* Background com gradiente mais suave */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a2856] via-[#0a2856]/95 to-[#00d856]/80"></div>
        <div className="absolute inset-0 bg-[url('/background-section1.png')] bg-cover bg-center opacity-5"></div>
        
        {/* Elementos decorativos */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-[#00d856]/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-[#b1f727]/20 rounded-full blur-3xl animate-pulse-slow" style={{animationDelay: '1s'}}></div>
        
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white mb-4 shadow-xl">
              <Crown className="w-5 h-5 mr-2 text-[#b1f727]" />
              <span className="font-semibold">Patrocínio FESPIN 2025</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-extrabold leading-[0.9] mb-4">
              <span className="block text-white mb-2">Sua marca no</span>
              <span className="block bg-gradient-to-r from-[#00d856] via-[#b1f727] to-[#00d856] bg-clip-text text-transparent animate-pulse-slow">
                centro do movimento
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-white/90 mb-6 max-w-3xl mx-auto leading-relaxed font-light">
              Conecte sua marca com mais de <span className="font-bold text-[#b1f727]">12 mil pessoas</span> apaixonadas por esporte, bem-estar e qualidade de vida na maior feira do interior.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <button 
                onClick={() => document.getElementById('cotas-patrocinio')?.scrollIntoView({ behavior: 'smooth' })}
                className="group bg-gradient-to-r from-[#00d856] to-[#b1f727] hover:from-[#00d856]/90 hover:to-[#b1f727]/90 text-[#0a2856] font-bold py-5 px-10 rounded-2xl transition-all duration-300 hover:scale-105 transform shadow-2xl hover:shadow-[#00d856]/50 min-w-[280px]"
              >
                <span className="flex items-center justify-center">
                  Ver Cotas de Patrocínio
                  <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                </span>
              </button>
              <button 
                onClick={() => document.getElementById('contato')?.scrollIntoView({ behavior: 'smooth' })}
                className="group bg-transparent border-2 border-white/60 text-white hover:bg-white/10 hover:border-white font-bold py-5 px-10 rounded-2xl transition-all duration-300 backdrop-blur-sm min-w-[280px]"
              >
                <span className="flex items-center justify-center">
                  Fale Conosco
                  <Phone className="ml-2 w-5 h-5 transition-transform group-hover:scale-110" />
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Benefícios Section */}
      <section className="py-12 md:py-16 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
        {/* Elementos decorativos de fundo */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-[#00d856]/5 rounded-full blur-3xl -translate-x-36 -translate-y-36"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#b1f727]/5 rounded-full blur-3xl translate-x-48 translate-y-48"></div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-8 md:mb-10">
            <div className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-gradient-to-r from-[#00d856] to-[#b1f727] text-[#0a2856] mb-3 shadow-lg">
              <Target className="w-5 h-5 mr-2" />
              <span className="font-bold">Por que patrocinar?</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold text-gray-900 mb-3 leading-tight">
              Benefícios exclusivos para{" "}
              <span className="bg-gradient-to-r from-[#00d856] to-[#b1f727] bg-clip-text text-transparent">
                patrocinadores
              </span>
            </h2>
            
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Maximize o alcance da sua marca com benefícios únicos pensados 
              para gerar resultados reais e conexões valiosas.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-5">
            {beneficiosPatrocinio.map((beneficio, index) => (
              <div 
                key={index} 
                className="group relative bg-white rounded-xl p-5 shadow-md hover:shadow-lg transition-all duration-300 hover:translate-y-[-4px] border border-gray-100/50 backdrop-blur-sm overflow-hidden flex flex-col"
                style={{
                  animation: `fadeInUp 0.5s ease-out forwards`,
                  animationDelay: `${index * 0.1}s`,
                  opacity: 0
                }}
              >
                {/* Gradient overlay sutil */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#00d856]/5 to-[#b1f727]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Header com ícone e título */}
                <div className="flex items-center mb-3">
                  {/* Ícone com gradiente */}
                  <div className="relative w-10 h-10 rounded-lg bg-gradient-to-br from-[#0a2856] to-[#00d856] flex items-center justify-center text-white group-hover:scale-105 transition-transform duration-200 shadow-md mr-3 flex-shrink-0">
                    {beneficio.icon}
                  </div>
                  
                  <h3 className="text-lg font-display font-bold text-gray-900 group-hover:text-[#0a2856] transition-colors duration-300">
                    {beneficio.title}
                  </h3>
                </div>
                
                <div className="relative">
                  <p className="text-gray-600 leading-relaxed text-sm">
                    {beneficio.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sobre o Evento Section */}
      <section className="py-12 md:py-16 bg-white relative overflow-hidden">
        {/* Background decorativo */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-[#00d856]/3 to-transparent"></div>
        
        {/* Elementos decorativos */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#00d856]/5 rounded-full blur-3xl -translate-x-48 -translate-y-48"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#b1f727]/5 rounded-full blur-3xl translate-x-40 translate-y-40"></div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-gradient-to-r from-[#0a2856] to-[#00d856] text-white mb-4 shadow-lg">
              <Zap className="w-5 h-5 mr-2" />
              <span className="font-bold">Sobre a FESPIN</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold text-gray-900 mb-4 leading-tight">
              A maior feira de esporte do{" "}
              <span className="bg-gradient-to-r from-[#0a2856] to-[#00d856] bg-clip-text text-transparent">
                interior
              </span>
            </h2>
            
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              A FESPIN é mais que uma feira - é um movimento que transforma vidas 
              através do esporte e da conexão entre pessoas.
            </p>
          </div>
          
          <div className="bg-gray-50 rounded-2xl p-8 md:p-10 mb-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-6">
                  Movimento que transforma vidas
                </h3>
                <p className="text-lg text-gray-600 leading-relaxed mb-8">
                  A FESPIN reúne academias, profissionais, marcas e entusiastas do esporte 
                  em um ambiente único de conexão, aprendizado e transformação. Três dias 
                  intensos de experiências (8h às 20h), networking e oportunidades de negócios.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-[#0a2856] flex items-center justify-center text-white flex-shrink-0">
                      <Dumbbell className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-gray-900 mb-1">4 Segmentos</h4>
                      <p className="text-sm text-gray-600">Academias, Esporte, Artigos Esportivos, Bem-estar</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-[#00d856] flex items-center justify-center text-white flex-shrink-0">
                      <Target className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-gray-900 mb-1">2 Arenas</h4>
                      <p className="text-sm text-gray-600">Aulas e demonstrações esportivas</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-[#b1f727] flex items-center justify-center text-[#0a2856] flex-shrink-0">
                      <Zap className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-gray-900 mb-1">Áreas Livres</h4>
                      <p className="text-sm text-gray-600">Ativações e vivências</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-[#0a2856] flex items-center justify-center text-white flex-shrink-0">
                      <Heart className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-gray-900 mb-1">Alimentação</h4>
                      <p className="text-sm text-gray-600">Praça com opções saudáveis</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="rounded-2xl overflow-hidden">
                <img 
                  src="/src/assets/FESPIN -APRESENTAÇÃO.png" 
                  alt="FESPIN - Movimento que transforma" 
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
          
          {/* Info FESPIN - Layout Compacto e Moderno */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-12">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <Zap className="w-5 h-5 text-[#00d856]" />
                Informações do Evento
              </h3>
              <div className="flex gap-2">
                <span className="px-2 py-1 bg-[#0a2856]/10 text-[#0a2856] text-xs font-medium rounded-full">2025</span>
                <span className="px-2 py-1 bg-[#00d856]/10 text-[#00d856] text-xs font-medium rounded-full">FESPIN</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {/* Data */}
              <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-4 hover:shadow-md transition-all duration-200 flex flex-col items-center justify-center">
                <div className="flex items-center justify-center w-9 h-9 rounded-full bg-[#0a2856]/10 mb-2">
                  <Calendar className="w-4 h-4 text-[#0a2856]" />
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-500 mb-1">Data</div>
                  <div className="font-semibold text-gray-800">14-16</div>
                  <div className="text-xs text-gray-400">NOV</div>
                </div>
              </div>
              
              {/* Horário */}
              <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-4 hover:shadow-md transition-all duration-200 flex flex-col items-center justify-center">
                <div className="flex items-center justify-center w-9 h-9 rounded-full bg-[#00d856]/10 mb-2">
                  <Clock className="w-4 h-4 text-[#00d856]" />
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-500 mb-1">Horário</div>
                  <div className="font-semibold text-gray-800">08-20h</div>
                  <div className="text-xs text-gray-400">Todos os dias</div>
                </div>
              </div>
              
              {/* Local */}
              <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-4 hover:shadow-md transition-all duration-200 flex flex-col items-center justify-center">
                <div className="flex items-center justify-center w-9 h-9 rounded-full bg-[#b1f727]/10 mb-2">
                  <MapPin className="w-4 h-4 text-[#b1f727]" />
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-500 mb-1">Local</div>
                  <div className="font-semibold text-gray-800">Espaço Viber</div>
                  <div className="text-xs text-gray-400">Indaiatuba/SP</div>
                </div>
              </div>
              
              {/* Público */}
              <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-4 hover:shadow-md transition-all duration-200 flex flex-col items-center justify-center">
                <div className="flex items-center justify-center w-9 h-9 rounded-full bg-[#0a2856]/10 mb-2">
                  <Users className="w-4 h-4 text-[#0a2856]" />
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-500 mb-1">Público</div>
                  <div className="font-semibold text-gray-800">15.000</div>
                  <div className="text-xs text-gray-400">visitantes</div>
                </div>
              </div>
              
              {/* Expositores */}
              <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-4 hover:shadow-md transition-all duration-200 flex flex-col items-center justify-center">
                <div className="flex items-center justify-center w-9 h-9 rounded-full bg-[#00d856]/10 mb-2">
                  <Store className="w-4 h-4 text-[#00d856]" />
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-500 mb-1">Expositores</div>
                  <div className="font-semibold text-gray-800">83</div>
                  <div className="text-xs text-gray-400">espaços</div>
                </div>
              </div>
              
              {/* Segmentos */}
              <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-4 hover:shadow-md transition-all duration-200 flex flex-col items-center justify-center">
                <div className="flex items-center justify-center w-9 h-9 rounded-full bg-[#b1f727]/10 mb-2">
                  <Target className="w-4 h-4 text-[#b1f727]" />
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-500 mb-1">Segmentos</div>
                  <div className="font-semibold text-gray-800">4</div>
                  <div className="text-xs text-gray-400">áreas</div>
                </div>
              </div>
            </div>
            
            {/* Barra de Progresso */}
            <div className="mt-6 pt-5 border-t border-gray-100">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-gray-600">Ocupação dos espaços</span>
                <span className="font-medium text-[#0a2856]">80%</span>
              </div>
              <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#0a2856] to-[#00d856] w-4/5 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cotas de Patrocínio Section */}
      <section id="cotas-patrocinio" className="py-12 md:py-16 bg-white relative overflow-hidden">
        {/* Background decorativo */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-[#00d856]/3 to-transparent"></div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-8 md:mb-10">
            <div className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-gradient-to-r from-[#0a2856] to-[#00d856] text-white mb-3 shadow-lg">
              <Star className="w-5 h-5 mr-2" />
              <span className="font-bold">Cotas disponíveis</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold text-gray-900 mb-3 leading-tight">
              Escolha a cota ideal para sua{" "}
              <span className="bg-gradient-to-r from-[#0a2856] to-[#00d856] bg-clip-text text-transparent">
                empresa
              </span>
            </h2>
            
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Diferentes níveis de patrocínio para atender às necessidades 
              e objetivos da sua marca.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto">
            {cotasPatrocinio.map((cota, index) => (
              <div 
                key={index} 
                className={`group relative rounded-3xl overflow-hidden shadow-2xl transition-all duration-500 hover:scale-105 hover:shadow-3xl flex flex-col aspect-square md:aspect-auto`}
                style={{
                  animation: `fadeInUp 0.6s ease-out forwards`,
                  animationDelay: `${index * 0.15}s`,
                  opacity: 0
                }}
              >
                {/* Header do card */}
                <div className={`bg-gradient-to-br ${cota.cor} p-8 text-center relative`}>
                  {/* Padrão decorativo */}
                  <div className="absolute inset-0 bg-white/5 backdrop-blur-sm"></div>
                  
                  <div className="relative">
                    <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white mb-6 mx-auto shadow-lg">
                      {cota.icone}
                    </div>
                    <h3 className="text-3xl font-display font-bold text-white mb-3">
                      {cota.nome}
                    </h3>
                  </div>
                </div>
                
                {/* Conteúdo do card */}
                <div className="bg-white p-8 flex flex-col h-full">
                  <ul className="space-y-4 mb-8 flex-1">
                    {cota.beneficios.map((beneficio, beneficioIndex) => (
                      <li key={beneficioIndex} className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#00d856] to-[#b1f727] flex items-center justify-center flex-shrink-0 mt-0.5">
                          <CheckCircle className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-gray-700 text-base leading-relaxed">{beneficio}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <button 
                    onClick={() => document.getElementById('contato')?.scrollIntoView({ behavior: 'smooth' })}
                    className={`w-full py-4 px-6 rounded-2xl font-bold transition-all duration-300 hover:scale-105 shadow-lg bg-gradient-to-r from-[#00d856] to-[#b1f727] hover:from-[#00d856]/90 hover:to-[#b1f727]/90 text-[#0a2856] shadow-[#00d856]/30`}
                  >
                    <span className="flex items-center justify-center">
                      Escolher {cota.nome}
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-16">
            <div className="max-w-2xl mx-auto bg-gradient-to-r from-gray-50 to-white rounded-3xl p-8 shadow-xl border border-gray-100">
              <h3 className="text-2xl font-display font-bold text-gray-900 mb-4">
                Precisa de algo personalizado?
              </h3>
              <p className="text-gray-600 mb-6 text-lg">
                Criamos propostas sob medida para atender às necessidades específicas da sua empresa.
              </p>
              <button 
                onClick={() => document.getElementById('contato')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-gradient-to-r from-[#0a2856] to-[#00d856] hover:from-[#0a2856]/90 hover:to-[#00d856]/90 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 hover:scale-105 shadow-lg"
              >
                <span className="flex items-center justify-center">
                  Solicitar Proposta Personalizada
                  <Sparkles className="ml-2 w-5 h-5" />
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <CTASection variant="patrocinio" />

      {/* Comparação Detalhada das Cotas */}
      <section className="py-12 md:py-16 bg-gradient-to-br from-gray-50 via-white to-gray-50 relative overflow-hidden">
        {/* Elementos decorativos */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#00d856]/5 rounded-full blur-3xl translate-x-48 -translate-y-48"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#b1f727]/5 rounded-full blur-3xl -translate-x-40 translate-y-40"></div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-8 md:mb-10">
            <div className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-gradient-to-r from-[#00d856] to-[#b1f727] text-[#0a2856] mb-3 shadow-lg">
              <CheckCircle className="w-5 h-5 mr-2" />
              <span className="font-bold">Comparação detalhada</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold text-gray-900 mb-3 leading-tight">
              Compare os{" "}
              <span className="bg-gradient-to-r from-[#00d856] to-[#b1f727] bg-clip-text text-transparent">
                benefícios
              </span>
            </h2>
            
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Veja em detalhes tudo o que cada cota de patrocínio oferece para sua marca
            </p>
            <p className="text-sm text-gray-500 mt-2 md:hidden bg-yellow-50 border border-yellow-200 rounded-lg p-2 mx-auto max-w-sm">
              💡 Deslize horizontalmente para ver todos os benefícios
            </p>
          </div>
          
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
            <div className="overflow-x-auto scrollbar-hide">
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr className="bg-gradient-to-r from-[#0a2856] via-[#00d856] to-[#b1f727]">
                    <th className="text-left p-8 font-display font-bold text-xl text-white">BENEFÍCIOS</th>
                    <th className="text-center p-8 font-display font-bold text-xl text-white">
                      <div className="flex flex-col items-center">
                        <Crown className="w-6 h-6 mb-2" />
                        DIAMANTE
                      </div>
                    </th>
                    <th className="text-center p-8 font-display font-bold text-xl text-white">
                      <div className="flex flex-col items-center">
                        <Trophy className="w-6 h-6 mb-2" />
                        OURO
                      </div>
                    </th>
                    <th className="text-center p-8 font-display font-bold text-xl text-white">
                      <div className="flex flex-col items-center">
                        <Sparkles className="w-6 h-6 mb-2" />
                        PRATA
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-gray-50 hover:to-transparent transition-all duration-200">
                    <td className="p-6 font-semibold text-gray-900 text-lg">Estande no evento</td>
                    <td className="p-6 text-center">
                      <div className="inline-flex items-center justify-center px-3 py-1 rounded-lg bg-gray-100 text-gray-800 font-semibold text-sm">
                        12m²
                      </div>
                    </td>
                    <td className="p-6 text-center">
                      <div className="inline-flex items-center justify-center px-3 py-1 rounded-lg bg-gray-100 text-gray-800 font-semibold text-sm">
                        9m²
                      </div>
                    </td>
                    <td className="p-6 text-center">
                      <div className="inline-flex items-center justify-center px-3 py-1 rounded-lg bg-gray-100 text-gray-800 font-semibold text-sm">
                        9m²
                      </div>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-gray-50 hover:to-transparent transition-all duration-200">
                    <td className="p-6 font-semibold text-gray-900 text-lg">Tempo na arena esportiva</td>
                    <td className="p-6 text-center">
                      <div className="w-8 h-8 rounded-full bg-[#00d856] flex items-center justify-center mx-auto">
                        <CheckCircle className="w-5 h-5 text-white" />
                      </div>
                    </td>
                    <td className="p-6 text-center">
                      <div className="w-8 h-8 rounded-full bg-[#00d856] flex items-center justify-center mx-auto">
                        <CheckCircle className="w-5 h-5 text-white" />
                      </div>
                    </td>
                    <td className="p-6 text-center">
                      <div className="w-8 h-8 rounded-full bg-[#00d856] flex items-center justify-center mx-auto">
                        <CheckCircle className="w-5 h-5 text-white" />
                      </div>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-gray-50 hover:to-transparent transition-all duration-200">
                    <td className="p-6 font-semibold text-gray-900 text-lg">Tempo no palco principal</td>
                    <td className="p-6 text-center">
                      <div className="w-8 h-8 rounded-full bg-[#00d856] flex items-center justify-center mx-auto">
                        <CheckCircle className="w-5 h-5 text-white" />
                      </div>
                    </td>
                    <td className="p-6 text-center">
                      <div className="w-8 h-8 rounded-full bg-[#00d856] flex items-center justify-center mx-auto">
                        <CheckCircle className="w-5 h-5 text-white" />
                      </div>
                    </td>
                    <td className="p-6 text-center">
                      <div className="w-8 h-8 rounded-full bg-[#00d856] flex items-center justify-center mx-auto">
                        <CheckCircle className="w-5 h-5 text-white" />
                      </div>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-gray-50 hover:to-transparent transition-all duration-200">
                    <td className="p-6 font-semibold text-gray-900 text-lg">Logo no site oficial</td>
                    <td className="p-6 text-center">
                      <div className="inline-flex items-center justify-center px-3 py-1 rounded-lg bg-gray-100 text-gray-800 font-semibold text-sm">
                        GRANDE
                      </div>
                    </td>
                    <td className="p-6 text-center">
                      <div className="inline-flex items-center justify-center px-3 py-1 rounded-lg bg-gray-100 text-gray-800 font-semibold text-sm">
                        MÉDIO
                      </div>
                    </td>
                    <td className="p-6 text-center">
                      <div className="inline-flex items-center justify-center px-3 py-1 rounded-lg bg-gray-100 text-gray-800 font-semibold text-sm">
                        PEQUENO
                      </div>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-gray-50 hover:to-transparent transition-all duration-200">
                    <td className="p-6 font-semibold text-gray-900 text-lg">Logo no telão LED</td>
                    <td className="p-6 text-center">
                      <div className="inline-flex items-center justify-center px-3 py-1 rounded-lg bg-gray-100 text-gray-800 font-semibold text-sm">
                        VÍDEO 20s
                      </div>
                    </td>
                    <td className="p-6 text-center">
                      <div className="inline-flex items-center justify-center px-3 py-1 rounded-lg bg-gray-100 text-gray-800 font-semibold text-sm">
                        ESTÁTICO 15s
                      </div>
                    </td>
                    <td className="p-6 text-center">
                      <div className="inline-flex items-center justify-center px-3 py-1 rounded-lg bg-gray-100 text-gray-800 font-semibold text-sm">
                        ESTÁTICO 15s
                      </div>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-gray-50 hover:to-transparent transition-all duration-200">
                    <td className="p-6 font-semibold text-gray-900 text-lg">Logo nos criativos oficiais</td>
                    <td className="p-6 text-center">
                      <div className="inline-flex items-center justify-center px-3 py-1 rounded-lg bg-gray-100 text-gray-800 font-semibold text-sm">
                        DESTAQUE TOTAL
                      </div>
                    </td>
                    <td className="p-6 text-center">
                      <div className="inline-flex items-center justify-center px-3 py-1 rounded-lg bg-gray-100 text-gray-800 font-semibold text-sm">
                        EM GRUPO
                      </div>
                    </td>
                    <td className="p-6 text-center">
                      <div className="inline-flex items-center justify-center px-3 py-1 rounded-lg bg-gray-100 text-gray-800 font-semibold text-sm">
                        EM GRUPO
                      </div>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-gray-50 hover:to-transparent transition-all duration-200">
                    <td className="p-6 font-semibold text-gray-900 text-lg">Posts colaborativos Instagram</td>
                    <td className="p-6 text-center">
                      <div className="inline-flex items-center justify-center px-3 py-1 rounded-lg bg-gray-100 text-gray-800 font-semibold text-sm">
                        02 POSTS
                      </div>
                    </td>
                    <td className="p-6 text-center">
                      <div className="inline-flex items-center justify-center px-3 py-1 rounded-lg bg-gray-100 text-gray-800 font-semibold text-sm">
                        01 POST
                      </div>
                    </td>
                    <td className="p-6 text-center">
                      <div className="inline-flex items-center justify-center px-3 py-1 rounded-lg bg-gray-100 text-gray-800 font-semibold text-sm">
                        ❌
                      </div>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-gray-50 hover:to-transparent transition-all duration-200">
                    <td className="p-6 font-semibold text-gray-900 text-lg">Sorteio de brindes no palco</td>
                    <td className="p-6 text-center">
                      <div className="w-8 h-8 rounded-full bg-[#00d856] flex items-center justify-center mx-auto">
                        <CheckCircle className="w-5 h-5 text-white" />
                      </div>
                    </td>
                    <td className="p-6 text-center">
                      <div className="w-8 h-8 rounded-full bg-[#00d856] flex items-center justify-center mx-auto">
                        <CheckCircle className="w-5 h-5 text-white" />
                      </div>
                    </td>
                    <td className="p-6 text-center">
                      <div className="inline-flex items-center justify-center px-3 py-1 rounded-lg bg-gray-100 text-gray-800 font-semibold text-sm">
                        ❌
                      </div>
                    </td>
                  </tr>
                  <tr className="hover:bg-gradient-to-r hover:from-gray-50 hover:to-transparent transition-all duration-200">
                    <td className="p-6 font-semibold text-gray-900 text-lg">Agradecimento no palco</td>
                    <td className="p-6 text-center">
                      <div className="w-8 h-8 rounded-full bg-[#00d856] flex items-center justify-center mx-auto">
                        <CheckCircle className="w-5 h-5 text-white" />
                      </div>
                    </td>
                    <td className="p-6 text-center">
                      <div className="w-8 h-8 rounded-full bg-[#00d856] flex items-center justify-center mx-auto">
                        <CheckCircle className="w-5 h-5 text-white" />
                      </div>
                    </td>
                    <td className="p-6 text-center">
                      <div className="w-8 h-8 rounded-full bg-[#00d856] flex items-center justify-center mx-auto">
                        <CheckCircle className="w-5 h-5 text-white" />
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Contato Section */}
      <section id="contato" className="py-12 md:py-16 bg-gradient-to-br from-white to-gray-50 relative overflow-hidden">
        {/* Elementos decorativos */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#00d856]/5 rounded-full blur-3xl -translate-x-48 -translate-y-48"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#b1f727]/5 rounded-full blur-3xl translate-x-40 translate-y-40"></div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-8 md:mb-10">
            <div className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-gradient-to-r from-[#00d856] to-[#b1f727] text-[#0a2856] mb-3 shadow-lg">
              <Phone className="w-5 h-5 mr-2" />
              <span className="font-bold">Fale conosco</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold text-gray-900 mb-3 leading-tight">
              Vamos construir uma{" "}
              <span className="bg-gradient-to-r from-[#00d856] to-[#b1f727] bg-clip-text text-transparent">
                parceria
              </span>
            </h2>
            
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Nossa equipe está pronta para criar a proposta ideal para sua empresa. 
              Entre em contato e descubra como sua marca pode brilhar na FESPIN 2025.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            {/* Formulário de Contato */}
            <div className="bg-white rounded-xl p-6 md:p-8 shadow-xl border border-gray-100 mb-8">
              <h3 className="text-2xl md:text-3xl font-display font-bold text-gray-900 mb-4 flex items-center justify-center">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-[#00d856] to-[#b1f727] flex items-center justify-center mr-3">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                Solicite uma Proposta
              </h3>
              
              <form className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Nome da Empresa
                    </label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00d856] focus:border-transparent transition-all duration-300 hover:border-[#00d856]/50"
                      placeholder="Digite o nome da sua empresa"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Nome do Responsável
                    </label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00d856] focus:border-transparent transition-all duration-300 hover:border-[#00d856]/50"
                      placeholder="Seu nome completo"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      E-mail
                    </label>
                    <input 
                      type="email" 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00d856] focus:border-transparent transition-all duration-300 hover:border-[#00d856]/50"
                      placeholder="seu@email.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Telefone
                    </label>
                    <input 
                      type="tel" 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00d856] focus:border-transparent transition-all duration-300 hover:border-[#00d856]/50"
                      placeholder="(19) 9 9999-9999"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Cota de Interesse
                  </label>
                                      <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00d856] focus:border-transparent transition-all duration-300 hover:border-[#00d856]/50">
                      <option>Selecione uma cota</option>
                      <option>Diamante</option>
                      <option>Ouro</option>
                      <option>Prata</option>
                      <option>Proposta Personalizada</option>
                    </select>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Mensagem
                  </label>
                  <textarea 
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00d856] focus:border-transparent transition-all duration-300 hover:border-[#00d856]/50 resize-none"
                    placeholder="Conte-nos mais sobre seus objetivos..."
                  ></textarea>
                </div>
                
                <button 
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#00d856] to-[#b1f727] hover:from-[#00d856]/90 hover:to-[#b1f727]/90 text-[#0a2856] font-bold py-4 px-6 rounded-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <span className="flex items-center justify-center">
                    <Mail className="mr-2 w-5 h-5" />
                    Solicitar Proposta
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </span>
                </button>
              </form>
            </div>
            

          </div>
        </div>
      </section>

      <Footer variant="patrocinio" />
    </div>
  );
};

export default PatrocinioPage; 