import { Ad, Category, Banner, User, Report, NeighborhoodItem, PlatformMetrics } from '../types';

export const INITIAL_NEIGHBORHOODS: NeighborhoodItem[] = [
  { id: 'b-belvedere', name: 'Belvedere', type: 'bairro', active: true },
  { id: 'b-boa-esperanca', name: 'Boa Esperança', type: 'bairro', active: true },
  { id: 'b-carajas', name: 'Carajás', type: 'bairro', active: true },
  { id: 'b-centro', name: 'Centro', type: 'bairro', active: true },
  { id: 'b-cidade-jardim', name: 'Cidade Jardim', type: 'bairro', active: true },
  { id: 'b-constantino', name: 'Constantino', type: 'bairro', active: true },
  { id: 'b-eneas', name: 'Enéas Ferreira de Aguiar', type: 'bairro', active: true },
  { id: 'b-esperanca', name: 'Esperança', type: 'bairro', active: true },
  { id: 'b-ipiranga', name: 'Ipiranga', type: 'bairro', active: true },
  { id: 'b-jardim-alvorada', name: 'Jardim Alvorada', type: 'bairro', active: true },
  { id: 'b-jardim-california', name: 'Jardim Califórnia', type: 'bairro', active: true },
  { id: 'b-jardim-oliveiras', name: 'Jardim das Oliveiras', type: 'bairro', active: true },
  { id: 'b-jardim-eldorado', name: 'Jardim Eldorado', type: 'bairro', active: true },
  { id: 'b-jardim-esplanada', name: 'Jardim Esplanada', type: 'bairro', active: true },
  { id: 'b-jardim-europa', name: 'Jardim Europa', type: 'bairro', active: true },
  { id: 'b-jardim-morumbi', name: 'Jardim Morumbi', type: 'bairro', active: true },
  { id: 'b-jardim-sul', name: 'Jardim Sul', type: 'bairro', active: true },
  { id: 'b-marciano-brandao', name: 'Marciano Brandão', type: 'bairro', active: true },
  { id: 'b-matinha', name: 'Matinha', type: 'bairro', active: true },
  { id: 'b-morada-nova', name: 'Morada Nova', type: 'bairro', active: true },
  { id: 'b-nacoes', name: 'Nações', type: 'bairro', active: true },
  { id: 'b-olimpio-nunes', name: 'Olímpio Nunes', type: 'bairro', active: true },
  { id: 'b-ouro-preto', name: 'Ouro Preto', type: 'bairro', active: true },
  { id: 'b-padre-eustaquio', name: 'Padre Eustáquio', type: 'bairro', active: true },
  { id: 'b-planalto', name: 'Planalto', type: 'bairro', active: true },
  { id: 'b-santa-terezinha', name: 'Santa Terezinha', type: 'bairro', active: true },
  { id: 'b-santo-antonio', name: 'Santo Antônio', type: 'bairro', active: true },
  { id: 'b-sao-benedito', name: 'São Benedito', type: 'bairro', active: true },
  { id: 'b-sao-cristovao', name: 'São Cristóvão', type: 'bairro', active: true },
  { id: 'b-sao-francisco', name: 'São Francisco', type: 'bairro', active: true },
  { id: 'b-sao-judas', name: 'São Judas Tadeu', type: 'bairro', active: true },
  { id: 'b-sao-lucas', name: 'São Lucas', type: 'bairro', active: true },
  { id: 'b-sao-vicente', name: 'São Vicente', type: 'bairro', active: true },
  { id: 'b-serra-negra', name: 'Serra Negra', type: 'bairro', active: true },
  { id: 'b-vila-nova', name: 'Vila Nova', type: 'bairro', active: true },
  { id: 'b-zona-rural', name: 'Zona Rural / Chácaras', type: 'zona_rural', active: true },
  { id: 'd-silvano', name: 'Distrito de Silvano', type: 'distrito', active: true },
  { id: 'd-salitre', name: 'Distrito de Salitre de Minas', type: 'distrito', active: true },
  { id: 'd-sao-joao', name: 'Distrito de São João da Serra Negra', type: 'distrito', active: true },
  { id: 'd-santa-luzia', name: 'Distrito de Santa Luzia dos Barros', type: 'distrito', active: true },
  { id: 'o-outro', name: 'Outro local de Patrocínio', type: 'outro', active: true }
];

export const PATROCINIO_NEIGHBORHOODS: string[] = INITIAL_NEIGHBORHOODS.map(n => n.name);

export const CATEGORIES: Category[] = [
  { id: 'eletronicos', name: 'Celulares e eletrônicos', iconName: 'Smartphone', slug: 'celulares-e-eletronicos', color: '#F95700' },
  { id: 'videogames', name: 'Videogames', iconName: 'Gamepad2', slug: 'videogames', color: '#7C3AED' },
  { id: 'veiculos', name: 'Veículos', iconName: 'Car', slug: 'veiculos', color: '#2563EB' },
  { id: 'imoveis', name: 'Imóveis', iconName: 'Home', slug: 'imoveis', color: '#059669' },
  { id: 'moveis', name: 'Casa e móveis', iconName: 'Armchair', slug: 'casa-e-moveis', color: '#D97706' },
  { id: 'roupas', name: 'Roupas e acessórios', iconName: 'Shirt', slug: 'roupas-e-acessorios', color: '#DB2777' },
  { id: 'beleza', name: 'Perfumes e beleza', iconName: 'Sparkles', slug: 'perfumes-e-beleza', color: '#E11D48' },
  { id: 'servicos', name: 'Serviços', iconName: 'Wrench', slug: 'servicos', color: '#0891B2' },
  { id: 'empregos', name: 'Empregos', iconName: 'Briefcase', slug: 'empregos', color: '#4F46E5' },
  { id: 'agro', name: 'Agro e zona rural', iconName: 'Tractor', slug: 'agro-e-zona-rural', color: '#16A34A' },
  { id: 'animais', name: 'Animais', iconName: 'Dog', slug: 'animais', color: '#EA580C' },
  { id: 'outros', name: 'Outros', iconName: 'Layers', slug: 'outros', color: '#64748B' },
];

// REAL ZERO ADS - Zero fake ads or mock products
export const INITIAL_ADS: Ad[] = [];

// Clean initial administration account (for platform moderation/supervision)
export const INITIAL_USERS: User[] = [
  {
    id: 'user_admin',
    name: 'Moderação Patrocínio',
    username: '@admin',
    email: 'admin@vendipatrocinio.com.br',
    phone: '+5534999990000',
    whatsapp: '(34) 99999-0000',
    neighborhood: 'Centro',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    bio: 'Equipe oficial de suporte e moderação do Vendi Patrocínio.',
    joinedDate: 'Hoje',
    activeAdsCount: 0,
    soldAdsCount: 0,
    isBlocked: false,
    isSuspended: false,
    isWhatsAppVerified: true,
    isEmailVerified: true,
    hasAcceptedSellerDisclaimer: true,
    birthDate: '1990-01-01',
    termsAcceptance: {
      termsVersion: 'v2.1',
      privacyVersion: 'v2.1',
      acceptedAt: new Date().toISOString(),
      ipAddress: '177.136.204.1 (Patrocínio - MG)',
      method: 'web_checkbox_explicit',
      confirmedAge18: true
    },
    role: 'admin'
  }
];

export const INITIAL_BANNERS: Banner[] = [
  {
    id: 'b1',
    title: 'Venda direto no WhatsApp',
    subtitle: 'O marketplace 100% gratuito e exclusivo de Patrocínio - MG.',
    tag: 'Negociação Local',
    imageUrl: 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?w=800&auto=format&fit=crop&q=80',
    ctaText: 'Anunciar Grátis',
    bgColor: '#F95700',
    active: true
  },
  {
    id: 'b2',
    title: 'Negocie com Segurança',
    subtitle: 'Combine entregas em locais públicos de Patrocínio e confira o produto antes de pagar.',
    tag: 'Dica de Segurança',
    imageUrl: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=800&auto=format&fit=crop&q=80',
    ctaText: 'Ver Dicas',
    bgColor: '#16A34A',
    active: true
  }
];

export const INITIAL_REPORTS: Report[] = [];

export const INITIAL_METRICS: PlatformMetrics = {
  totalVisits: 0,
  whatsappClicks: 0,
  totalAdsCreated: 0,
  totalSold: 0
};
