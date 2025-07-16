import { type Patrocinador } from '@/lib/supabase';

// Nota: Este arquivo usa dados de exemplo com categoria_id genérico
// Em produção, use as categorias reais do banco de dados
export const patrociniadoresExemplo: Patrocinador[] = [
  {
    id: '1',
    nome: 'Nike',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg',
    website: 'https://www.nike.com.br',
    categoria: 'Equipamentos Esportivos',
    categoria_id: '1', // Use categoria_id real do banco
    tamanho_logo: 'grande',
    posicao: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    descricao: 'Líder mundial em equipamentos esportivos e calçados. Fornecemos soluções completas para atletas profissionais e amadores, com mais de 50 anos de experiência no mercado fitness.'
  },
  {
    id: '2',
    nome: 'Adidas',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg',
    website: 'https://www.adidas.com.br',
    categoria: 'Equipamentos Esportivos',
    categoria_id: '1', // Use categoria_id real do banco
    tamanho_logo: 'grande',
    posicao: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    descricao: 'Marca premium de equipamentos esportivos com certificação internacional. Líder absoluta do mercado mundial, pioneira em pesquisas e desenvolvimento de produtos para performance esportiva.'
  },
  {
    id: '3',
    nome: 'Puma',
    logo: 'https://upload.wikimedia.org/wikipedia/en/4/49/Puma_logo.svg',
    website: 'https://www.puma.com',
    categoria: 'Equipamentos Esportivos',
    categoria_id: '2', // Use categoria_id real do banco
    tamanho_logo: 'medio',
    posicao: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    descricao: 'Marca alemã de equipamentos esportivos com presença global. Focada em performance e estilo, oferecendo produtos para diversos esportes e atividades físicas.'
  },
  {
    id: '4',
    nome: 'Under Armour',
    logo: 'https://logos-world.net/wp-content/uploads/2020/09/Under-Armour-Logo.png',
    website: 'https://www.underarmour.com',
    categoria: 'Equipamentos Fitness',
    categoria_id: '2', // Use categoria_id real do banco
    tamanho_logo: 'medio',
    posicao: 4,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    descricao: 'Especializada em roupas e equipamentos fitness de alta performance. Oferece tecnologia avançada em tecidos e equipamentos para atletas profissionais e amadores.'
  },
  {
    id: '5',
    nome: 'Reebok',
    logo: 'https://logos-world.net/wp-content/uploads/2020/09/Reebok-Logo.png',
    website: 'https://www.reebok.com',
    categoria: 'Equipamentos Fitness',
    categoria_id: '2', // Use categoria_id real do banco
    tamanho_logo: 'medio',
    posicao: 5,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    descricao: 'Marca premium com foco em fitness e treinamento funcional. Oferece equipamentos e roupas especializadas para crossfit, running e atividades de alta intensidade.'
  },
  {
    id: '6',
    nome: 'New Balance',
    logo: 'https://logos-world.net/wp-content/uploads/2020/09/New-Balance-Logo.png',
    website: 'https://www.newbalance.com',
    categoria: 'Calçados Esportivos',
    categoria_id: '3', // Use categoria_id real do banco
    tamanho_logo: 'pequeno',
    posicao: 6,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    descricao: 'Especialista em calçados esportivos com foco em qualidade e conforto. Oferece tênis para corrida, caminhada e atividades físicas diversas.'
  },
  {
    id: '7',
    nome: 'Asics',
    logo: 'https://logos-world.net/wp-content/uploads/2020/09/ASICS-Logo.png',
    website: 'https://www.asics.com',
    categoria: 'Calçados Esportivos',
    categoria_id: '3', // Use categoria_id real do banco
    tamanho_logo: 'pequeno',
    posicao: 7,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    descricao: 'Marca japonesa com tradição em calçados esportivos. Oferece tecnologia avançada em amortecimento e suporte para corredores e atletas.'
  },
  {
    id: '8',
    nome: 'Mizuno',
    logo: 'https://logos-world.net/wp-content/uploads/2020/09/Mizuno-Logo.png',
    website: 'https://www.mizuno.com',
    categoria: 'Equipamentos Esportivos',
    categoria_id: '3', // Use categoria_id real do banco
    tamanho_logo: 'pequeno',
    posicao: 8,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    descricao: 'Marca japonesa especializada em equipamentos esportivos para diversos esportes. Oferece produtos de alta qualidade para atletas profissionais e amadores.'
  },
  {
    id: '9',
    nome: 'Fila',
    logo: 'https://logos-world.net/wp-content/uploads/2020/09/Fila-Logo.png',
    website: 'https://www.fila.com',
    categoria: 'Equipamentos Esportivos',
    categoria_id: '4', // Use categoria_id real do banco
    tamanho_logo: 'pequeno',
    posicao: 9,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    descricao: 'Marca italiana com tradição em equipamentos esportivos. Oferece produtos para tênis, fitness e lifestyle esportivo com design diferenciado.'
  }
];

export const popularPatrocinadores = () => {
  localStorage.setItem('patrocinadores', JSON.stringify(patrociniadoresExemplo));
  console.log('Patrocinadores de exemplo populados no localStorage!');
};

export const limparPatrocinadores = () => {
  localStorage.removeItem('patrocinadores');
  console.log('Patrocinadores removidos do localStorage!');
};