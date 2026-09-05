import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Ad, User, Report, Banner, Category } from '../types';
import {
  ShieldAlert,
  BarChart3,
  Users,
  FileText,
  Layers,
  Image as ImageIcon,
  CheckCircle,
  XCircle,
  Trash2,
  Lock,
  Unlock,
  Eye,
  MessageCircle,
  Plus,
  ArrowLeft,
  Search,
  Star,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  MapPin,
  Tag
} from 'lucide-react';
import { CategoryIconMap } from './CategoryBar';

export const AdminPanel: React.FC = () => {
  const {
    ads,
    deleteAd,
    updateAd,
    users,
    blockUser,
    reports,
    updateReportStatus,
    banners,
    toggleBannerActive,
    addBanner,
    categories,
    metrics,
    neighborhoods,
    addNeighborhood,
    toggleNeighborhoodActive,
    setActiveView,
    openAdDetail,
    showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState<'metrics' | 'ads' | 'users' | 'reports' | 'banners' | 'categories' | 'neighborhoods'>('metrics');
  const [adSearch, setAdSearch] = useState('');
  const [userSearch, setUserSearch] = useState('');
  const [neighborhoodSearch, setNeighborhoodSearch] = useState('');

  // Neighborhood management form
  const [newNeighborhoodName, setNewNeighborhoodName] = useState('');
  const [newNeighborhoodType, setNewNeighborhoodType] = useState<'bairro' | 'distrito' | 'rural' | 'condominio'>('bairro');
  const [isSavingNeighborhood, setIsSavingNeighborhood] = useState(false);

  // New Banner Form State
  const [isNewBannerOpen, setIsNewBannerOpen] = useState(false);
  const [newBannerTitle, setNewBannerTitle] = useState('');
  const [newBannerSubtitle, setNewBannerSubtitle] = useState('');
  const [newBannerTag, setNewBannerTag] = useState('');
  const [newBannerImage, setNewBannerImage] = useState('');

  const filteredNeighborhoods = neighborhoods.filter((n) =>
    n.name.toLowerCase().includes(neighborhoodSearch.toLowerCase())
  );

  const handleAddNeighborhood = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNeighborhoodName.trim()) {
      showToast('Digite o nome do bairro ou região.', 'error');
      return;
    }
    setIsSavingNeighborhood(true);
    const success = await addNeighborhood(newNeighborhoodName.trim(), newNeighborhoodType);
    if (success) {
      setNewNeighborhoodName('');
    }
    setIsSavingNeighborhood(false);
  };

  const filteredAds = ads.filter(
    (a) =>
      a.title.toLowerCase().includes(adSearch.toLowerCase()) ||
      a.sellerName.toLowerCase().includes(adSearch.toLowerCase()) ||
      a.neighborhood.toLowerCase().includes(adSearch.toLowerCase())
  );

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.neighborhood.toLowerCase().includes(userSearch.toLowerCase())
  );

  const handleToggleFeature = (ad: Ad) => {
    updateAd(ad.id, { isFeatured: !ad.isFeatured });
    showToast(
      ad.isFeatured ? 'Anúncio removido dos destaques.' : 'Anúncio promovido a Destaque! ★'
    );
  };

  const handleToggleSponsored = (ad: Ad) => {
    updateAd(ad.id, { isSponsored: !ad.isSponsored });
    showToast(
      ad.isSponsored ? 'Patrocínio removido.' : 'Anúncio marcado como Patrocinado!'
    );
  };

  const handleCreateBanner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBannerTitle || !newBannerImage) {
      showToast('Preencha título e imagem do banner.', 'error');
      return;
    }

    addBanner({
      title: newBannerTitle,
      subtitle: newBannerSubtitle,
      tag: newBannerTag || 'PROMOÇÃO PATROCÍNIO',
      imageUrl: newBannerImage,
      ctaText: 'Ver mais',
      active: true
    });

    setNewBannerTitle('');
    setNewBannerSubtitle('');
    setNewBannerTag('');
    setNewBannerImage('');
    setIsNewBannerOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <button
            onClick={() => setActiveView('home')}
            className="text-xs font-semibold text-gray-500 hover:text-[#F95700] flex items-center gap-1 mb-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para a Loja
          </button>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              Painel Administrativo
            </h1>
            <span className="bg-purple-100 text-purple-800 text-xs font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Moderação Oficial
            </span>
          </div>
          <p className="text-xs sm:text-sm text-gray-500">
            Controle de anúncios, denúncias, usuários e métricas em Patrocínio - MG
          </p>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar border-b border-gray-200 mb-8 pb-1">
        <button
          onClick={() => setActiveTab('metrics')}
          className={`flex items-center gap-2 pb-3 px-3 text-xs sm:text-sm font-bold whitespace-nowrap transition-all relative ${
            activeTab === 'metrics'
              ? 'text-[#F95700]'
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          Métricas de Acesso
          {activeTab === 'metrics' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#F95700] rounded-full"></span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('ads')}
          className={`flex items-center gap-2 pb-3 px-3 text-xs sm:text-sm font-bold whitespace-nowrap transition-all relative ${
            activeTab === 'ads'
              ? 'text-[#F95700]'
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <FileText className="w-4 h-4" />
          Anúncios ({ads.length})
          {activeTab === 'ads' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#F95700] rounded-full"></span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('reports')}
          className={`flex items-center gap-2 pb-3 px-3 text-xs sm:text-sm font-bold whitespace-nowrap transition-all relative ${
            activeTab === 'reports'
              ? 'text-[#F95700]'
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          Denúncias ({reports.filter((r) => r.status === 'pending').length} pendentes)
          {activeTab === 'reports' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#F95700] rounded-full"></span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-2 pb-3 px-3 text-xs sm:text-sm font-bold whitespace-nowrap transition-all relative ${
            activeTab === 'users'
              ? 'text-[#F95700]'
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <Users className="w-4 h-4" />
          Usuários ({users.length})
          {activeTab === 'users' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#F95700] rounded-full"></span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('banners')}
          className={`flex items-center gap-2 pb-3 px-3 text-xs sm:text-sm font-bold whitespace-nowrap transition-all relative ${
            activeTab === 'banners'
              ? 'text-[#F95700]'
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          Banners ({banners.length})
          {activeTab === 'banners' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#F95700] rounded-full"></span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('categories')}
          className={`flex items-center gap-2 pb-3 px-3 text-xs sm:text-sm font-bold whitespace-nowrap transition-all relative ${
            activeTab === 'categories'
              ? 'text-[#F95700]'
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <Layers className="w-4 h-4" />
          Categorias ({categories.length})
          {activeTab === 'categories' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#F95700] rounded-full"></span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('neighborhoods')}
          className={`flex items-center gap-2 pb-3 px-3 text-xs sm:text-sm font-bold whitespace-nowrap transition-all relative ${
            activeTab === 'neighborhoods'
              ? 'text-[#F95700]'
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <MapPin className="w-4 h-4" />
          Bairros & Regiões ({neighborhoods.length})
          {activeTab === 'neighborhoods' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#F95700] rounded-full"></span>
          )}
        </button>
      </div>

      {/* Tab: METRICS */}
      {activeTab === 'metrics' && (
        <div className="space-y-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Visualizações
                </span>
                <Eye className="w-4 h-4 text-orange-500" />
              </div>
              <div className="text-3xl font-black text-gray-900">
                {metrics.totalVisits.toLocaleString('pt-BR')}
              </div>
              <p className="text-[11px] text-gray-500 mt-1">Visitas na plataforma</p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Cliques WhatsApp
                </span>
                <MessageCircle className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-3xl font-black text-[#25D366]">
                {metrics.whatsappClicks.toLocaleString('pt-BR')}
              </div>
              <p className="text-[11px] text-gray-500 mt-1">Negociações iniciadas</p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Total de Anúncios
                </span>
                <FileText className="w-4 h-4 text-blue-500" />
              </div>
              <div className="text-3xl font-black text-gray-900">
                {ads.length}
              </div>
              <p className="text-[11px] text-gray-500 mt-1">{ads.filter(a => a.status === 'active').length} ativos agora</p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Itens Vendidos
                </span>
                <CheckCircle className="w-4 h-4 text-purple-600" />
              </div>
              <div className="text-3xl font-black text-purple-600">
                {metrics.totalSold + ads.filter(a => a.status === 'sold').length}
              </div>
              <p className="text-[11px] text-gray-500 mt-1">Negócios concluídos</p>
            </div>
          </div>

          {/* Security & Prevention Rules */}
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs">
            <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              Regras e Diretrizes Ativas de Segurança em Patrocínio
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-gray-600">
              <div className="bg-orange-50/60 p-3.5 rounded-2xl border border-orange-100">
                <h4 className="font-bold text-orange-900 mb-1">🚫 Produtos Proibidos</h4>
                <p>Armas, munições, medicamentos sob prescrição, cigarros eletrônicos, animais silvestres, produtos roubados ou falsificados.</p>
              </div>
              <div className="bg-blue-50/60 p-3.5 rounded-2xl border border-blue-100">
                <h4 className="font-bold text-blue-900 mb-1">🛡️ Anti-Golpe & PIX</h4>
                <p>Orientação expressa para nunca transferir adiantamento ou "sinal". Pagamento somente após conferir o produto em mãos.</p>
              </div>
              <div className="bg-emerald-50/60 p-3.5 rounded-2xl border border-emerald-100">
                <h4 className="font-bold text-emerald-900 mb-1">📍 Pontos de Encontro Seguros</h4>
                <p>Recomendação de entrega em locais públicos de Patrocínio como Praça Santa Luzia, Praça Honorato Borges e supermercados.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: ADS MANAGEMENT */}
      {activeTab === 'ads' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={adSearch}
                onChange={(e) => setAdSearch(e.target.value)}
                placeholder="Buscar por título, vendedor ou bairro..."
                className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#F95700]"
              />
            </div>
            <span className="text-xs text-gray-500">{filteredAds.length} anúncios encontrados</span>
          </div>

          <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-600">
                <thead className="bg-gray-50 text-gray-400 font-bold uppercase tracking-wider border-b border-gray-200">
                  <tr>
                    <th className="p-3.5">Anúncio</th>
                    <th className="p-3.5">Vendedor</th>
                    <th className="p-3.5">Bairro</th>
                    <th className="p-3.5">Preço</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5">Engajamento</th>
                    <th className="p-3.5 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredAds.map((ad) => (
                    <tr key={ad.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="p-3.5 flex items-center gap-3">
                        <img
                          src={ad.photos[0]}
                          alt=""
                          className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                        />
                        <div>
                          <div
                            onClick={() => openAdDetail(ad)}
                            className="font-bold text-gray-900 hover:text-[#F95700] cursor-pointer max-w-xs truncate"
                          >
                            {ad.title}
                          </div>
                          <span className="text-[10px] text-gray-400">{ad.id}</span>
                        </div>
                      </td>
                      <td className="p-3.5 font-medium text-gray-800">{ad.sellerName}</td>
                      <td className="p-3.5">{ad.neighborhood}</td>
                      <td className="p-3.5 font-bold text-gray-900">R$ {ad.price.toLocaleString('pt-BR')}</td>
                      <td className="p-3.5">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                            ad.status === 'active'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {ad.status === 'active' ? 'Ativo' : 'Vendido'}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <div className="flex items-center gap-2 text-[11px]">
                          <span>👁️ {ad.viewsCount}</span>
                          <span className="text-emerald-600 font-bold">💬 {ad.whatsappClicksCount}</span>
                        </div>
                      </td>
                      <td className="p-3.5 text-right space-x-1 whitespace-nowrap">
                        <button
                          onClick={() => handleToggleFeature(ad)}
                          className={`p-1.5 rounded-lg text-xs font-bold ${
                            ad.isFeatured
                              ? 'bg-orange-100 text-[#F95700]'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                          title="Alternar destaque"
                        >
                          <Star className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleToggleSponsored(ad)}
                          className={`p-1.5 rounded-lg text-xs font-bold ${
                            ad.isSponsored
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                          title="Alternar patrocinado"
                        >
                          $
                        </button>
                        <button
                          onClick={() => deleteAd(ad.id)}
                          className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600"
                          title="Remover anúncio"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab: REPORTS */}
      {activeTab === 'reports' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-700">Denúncias Registradas</h3>
            <span className="text-xs text-gray-400">Total: {reports.length}</span>
          </div>

          <div className="space-y-3">
            {reports.map((report) => (
              <div
                key={report.id}
                className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-red-100 text-red-700 text-[10px] font-black uppercase px-2 py-0.5 rounded">
                      Motivo: {report.reason}
                    </span>
                    <span className="text-xs font-bold text-gray-900">{report.adTitle}</span>
                    <span className="text-xs text-gray-400">• {report.createdAt}</span>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">
                    <span className="font-semibold">Relato: </span>"{report.details}"
                  </p>
                  <p className="text-[11px] text-gray-400">
                    Denunciante: {report.reporterName} {report.reporterContact && `(${report.reporterContact})`}
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-bold capitalize ${
                      report.status === 'pending'
                        ? 'bg-amber-100 text-amber-800'
                        : report.status === 'action_taken'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {report.status === 'pending' ? 'Pendente' : report.status === 'action_taken' ? 'Ação Tomada' : 'Arquivado'}
                  </span>

                  {report.status === 'pending' && (
                    <>
                      <button
                        onClick={() => updateReportStatus(report.id, 'action_taken')}
                        className="bg-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-xl hover:bg-emerald-700"
                      >
                        Remover Anúncio
                      </button>
                      <button
                        onClick={() => updateReportStatus(report.id, 'dismissed')}
                        className="bg-gray-100 text-gray-700 text-xs font-bold px-3 py-1.5 rounded-xl hover:bg-gray-200"
                      >
                        Dispensar
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: USERS */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="relative max-w-md">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              placeholder="Buscar usuários por nome, email ou bairro..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#F95700]"
            />
          </div>

          <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs text-gray-600">
              <thead className="bg-gray-50 text-gray-400 font-bold uppercase tracking-wider border-b border-gray-200">
                <tr>
                  <th className="p-3.5">Usuário</th>
                  <th className="p-3.5">Contato</th>
                  <th className="p-3.5">Bairro</th>
                  <th className="p-3.5">Anúncios / Vendas</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50/80">
                    <td className="p-3.5 flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-orange-100 text-[#F95700] flex items-center justify-center font-bold">
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 flex items-center gap-1">
                          {u.name}
                          {u.role === 'admin' && (
                            <span className="text-[9px] bg-purple-100 text-purple-700 px-1.5 py-0.2 rounded font-black">
                              ADMIN
                            </span>
                          )}
                        </div>
                        <span className="text-gray-400 text-[10px]">{u.email}</span>
                      </div>
                    </td>
                    <td className="p-3.5 font-medium">{u.whatsapp}</td>
                    <td className="p-3.5">{u.neighborhood}</td>
                    <td className="p-3.5">
                      <span className="text-gray-900 font-bold">{u.activeAdsCount}</span> ativos /{' '}
                      <span className="text-emerald-600 font-bold">{u.soldAdsCount}</span> vendidos
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          u.isBlocked
                            ? 'bg-red-100 text-red-700'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {u.isBlocked ? 'Bloqueado' : 'Ativo'}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => blockUser(u.id)}
                        className={`px-3 py-1.5 rounded-xl font-bold text-xs cursor-pointer ${
                          u.isBlocked
                            ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                            : 'bg-red-50 text-red-700 hover:bg-red-100'
                        }`}
                      >
                        {u.isBlocked ? 'Desbloquear' : 'Bloquear Conta'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: BANNERS */}
      {activeTab === 'banners' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-gray-900">Banners Promocionais da Home</h3>
            <button
              onClick={() => setIsNewBannerOpen(true)}
              className="bg-[#F95700] text-white text-xs font-bold px-4 py-2 rounded-full flex items-center gap-1 shadow"
            >
              <Plus className="w-4 h-4" />
              Novo Banner
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {banners.map((b) => (
              <div
                key={b.id}
                className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-xs flex flex-col"
              >
                <div className="relative h-36 bg-gray-900">
                  <img src={b.imageUrl} alt="" className="w-full h-full object-cover opacity-80" />
                  <div className="absolute top-2 left-2 bg-[#F95700] text-white text-[9px] font-black px-2 py-0.5 rounded">
                    {b.tag}
                  </div>
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm mb-1">{b.title}</h4>
                    <p className="text-xs text-gray-500 mb-3">{b.subtitle}</p>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <span className="text-xs text-gray-400">
                      Status: <strong className={b.active ? 'text-emerald-600' : 'text-gray-400'}>{b.active ? 'Visível' : 'Oculto'}</strong>
                    </span>
                    <button
                      onClick={() => toggleBannerActive(b.id)}
                      className={`text-xs font-bold px-3 py-1 rounded-xl ${
                        b.active ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'
                      }`}
                    >
                      {b.active ? 'Ocultar' : 'Ativar'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* New Banner Modal */}
          {isNewBannerOpen && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
              <form
                onSubmit={handleCreateBanner}
                className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4"
              >
                <h3 className="font-bold text-gray-900 text-base">Adicionar Novo Banner</h3>
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Título</label>
                  <input
                    type="text"
                    required
                    value={newBannerTitle}
                    onChange={(e) => setNewBannerTitle(e.target.value)}
                    placeholder="Ex: Semana do Café em Patrocínio"
                    className="w-full px-3 py-2 border rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Subtítulo</label>
                  <input
                    type="text"
                    value={newBannerSubtitle}
                    onChange={(e) => setNewBannerSubtitle(e.target.value)}
                    placeholder="Ex: As melhores ofertas em maquinários..."
                    className="w-full px-3 py-2 border rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Tag Superior</label>
                  <input
                    type="text"
                    value={newBannerTag}
                    onChange={(e) => setNewBannerTag(e.target.value)}
                    placeholder="Ex: DESTAQUE LOCAL"
                    className="w-full px-3 py-2 border rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">URL da Imagem</label>
                  <input
                    type="url"
                    required
                    value={newBannerImage}
                    onChange={(e) => setNewBannerImage(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-2 border rounded-xl text-xs"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsNewBannerOpen(false)}
                    className="px-4 py-2 border rounded-xl text-xs font-bold text-gray-600"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#F95700] text-white rounded-xl text-xs font-bold shadow-md"
                  >
                    Salvar Banner
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* Tab: CATEGORIES */}
      {activeTab === 'categories' && (
        <div className="space-y-4">
          <h3 className="text-base font-bold text-gray-900">
            Categorias do Marketplace ({categories.length})
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {categories.map((cat) => {
              const IconComp = CategoryIconMap[cat.iconName] || Layers;
              const adsCount = ads.filter((a) => a.categoryId === cat.id).length;
              return (
                <div
                  key={cat.id}
                  className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#F95700] flex items-center justify-center">
                    <IconComp className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-xs">{cat.name}</h4>
                    <span className="text-[11px] text-gray-400">{adsCount} anúncios</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      {/* Tab: NEIGHBORHOODS */}
      {activeTab === 'neighborhoods' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#F95700]" />
                Gestão de Bairros e Regiões de Patrocínio ({neighborhoods.length})
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Cadastre novos bairros ou ative/desative regiões para exibição automática no cadastro e nos anúncios.
              </p>
            </div>

            {/* Live Neighborhood Search */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={neighborhoodSearch}
                onChange={(e) => setNeighborhoodSearch(e.target.value)}
                placeholder="Filtrar bairros..."
                className="w-full pl-9 pr-4 py-2 bg-white rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:border-[#F95700]"
              />
            </div>
          </div>

          {/* Quick Add Form */}
          <div className="bg-white p-5 rounded-3xl border border-orange-200 shadow-xs">
            <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-[#F95700]" />
              Cadastrar Novo Bairro ou Distrito
            </h4>
            <form onSubmit={handleAddNeighborhood} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <input
                  type="text"
                  required
                  placeholder="Nome do bairro (Ex: Bairro São Cristóvão)"
                  value={newNeighborhoodName}
                  onChange={(e) => setNewNeighborhoodName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:border-[#F95700]"
                />
              </div>

              <div>
                <select
                  value={newNeighborhoodType}
                  onChange={(e) => setNewNeighborhoodType(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:border-[#F95700] bg-white font-medium"
                >
                  <option value="bairro">Bairro Urbano</option>
                  <option value="distrito">Distrito de Patrocínio</option>
                  <option value="rural">Zona Rural / Chácara</option>
                  <option value="condominio">Condomínio Fechado</option>
                </select>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isSavingNeighborhood}
                  className="w-full py-2.5 px-4 bg-[#F95700] hover:bg-[#E04E00] text-white rounded-xl text-xs font-bold shadow-md shadow-orange-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Plus className="w-4 h-4" />
                  <span>{isSavingNeighborhood ? 'Cadastrando...' : 'Adicionar Região'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Neighborhoods List */}
          <div className="bg-white rounded-3xl border border-gray-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between text-xs text-gray-500">
              <span>Bairros cadastrados: <strong>{filteredNeighborhoods.length}</strong></span>
              <span className="text-emerald-700 font-bold">
                {neighborhoods.filter((n) => n.active).length} ativos
              </span>
            </div>

            <div className="divide-y divide-gray-100 max-h-[500px] overflow-y-auto">
              {filteredNeighborhoods.length === 0 ? (
                <div className="p-8 text-center text-xs text-gray-400">
                  Nenhum bairro encontrado para a busca "{neighborhoodSearch}".
                </div>
              ) : (
                filteredNeighborhoods.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 flex items-center justify-between gap-3 hover:bg-gray-50/80 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold ${
                        item.active ? 'bg-orange-100 text-[#F95700]' : 'bg-gray-100 text-gray-400'
                      }`}>
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div>
                        <h5 className="font-bold text-gray-900 text-sm">{item.name}</h5>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-600">
                            {item.type}
                          </span>
                          <span className={`text-[10px] font-bold ${
                            item.active ? 'text-emerald-600' : 'text-gray-400'
                          }`}>
                            {item.active ? '● Ativo no App' : '○ Oculto / Inativo'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleNeighborhoodActive(item.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer border ${
                        item.active
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-red-50 hover:text-red-700 hover:border-red-200'
                          : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200'
                      }`}
                    >
                      {item.active ? 'Desativar' : 'Ativar Região'}
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
