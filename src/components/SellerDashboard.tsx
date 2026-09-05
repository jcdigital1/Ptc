import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Ad } from '../types';
import { formatPrice } from './AdCard';
import {
  PackageCheck,
  RotateCw,
  Trash2,
  Share2,
  Edit,
  CheckCircle,
  Clock,
  Eye,
  MessageCircle,
  PlusCircle,
  AlertTriangle,
  ArrowLeft,
  ShoppingBag,
  ExternalLink,
  X
} from 'lucide-react';

export const SellerDashboard: React.FC = () => {
  const {
    currentUser,
    ads,
    markAsSold,
    deleteAd,
    renewAd,
    updateAd,
    startPublishFlow,
    setActiveView,
    openAdDetail,
    showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'sold'>('all');
  const [adToMarkAsSold, setAdToMarkAsSold] = useState<Ad | null>(null);
  const [adToDelete, setAdToDelete] = useState<Ad | null>(null);
  const [editingAd, setEditingAd] = useState<Ad | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editDescription, setEditDescription] = useState('');

  if (!currentUser) {
    return (
      <div className="max-w-3xl mx-auto py-12 px-4 text-center">
        <div className="w-16 h-16 bg-orange-100 text-[#F95700] rounded-full flex items-center justify-center mx-auto mb-4">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Painel do Vendedor</h2>
        <p className="text-gray-600 mb-6">
          Faça login ou crie sua conta para gerenciar seus anúncios em Patrocínio.
        </p>
        <button
          onClick={() => setActiveView('home')}
          className="bg-[#F95700] text-white font-bold px-6 py-2.5 rounded-full"
        >
          Voltar para a Página Inicial
        </button>
      </div>
    );
  }

  // Filter ads that belong to the current user
  const userAds = ads.filter((a) => a.sellerId === currentUser.id);
  const filteredAds = userAds.filter((ad) => {
    if (activeTab === 'active') return ad.status === 'active';
    if (activeTab === 'sold') return ad.status === 'sold';
    return true;
  });

  const totalViews = userAds.reduce((sum, a) => sum + (a.viewsCount || 0), 0);
  const totalWhatsAppClicks = userAds.reduce((sum, a) => sum + (a.whatsappClicksCount || 0), 0);
  const soldCount = currentUser.soldAdsCount || 0;
  const activeCount = userAds.filter((a) => a.status === 'active').length;

  const handleShareAd = (ad: Ad) => {
    const shareUrl = window.location.href.split('?')[0] + `?anuncio=${ad.id}`;
    if (navigator.share) {
      navigator.share({
        title: `${ad.title} - Vendi Patrocínio`,
        text: `Veja meu anúncio: ${ad.title}`,
        url: shareUrl
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareUrl);
      showToast('Link do anúncio copiado!');
    }
  };

  const handleOpenEdit = (ad: Ad) => {
    setEditingAd(ad);
    setEditTitle(ad.title);
    setEditPrice(ad.price.toString());
    setEditDescription(ad.description);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAd) return;

    updateAd(editingAd.id, {
      title: editTitle.trim(),
      price: parseFloat(editPrice) || 0,
      description: editDescription.trim()
    });

    setEditingAd(null);
  };

  const confirmMarkAsSold = () => {
    if (adToMarkAsSold) {
      markAsSold(adToMarkAsSold.id);
      setAdToMarkAsSold(null);
    }
  };

  const confirmDelete = () => {
    if (adToDelete) {
      deleteAd(adToDelete.id);
      setAdToDelete(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <button
            onClick={() => setActiveView('home')}
            className="text-xs font-semibold text-gray-500 hover:text-[#F95700] flex items-center gap-1 mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para o início
          </button>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            Meus Anúncios
          </h1>
          <p className="text-sm text-gray-500">
            Gerencie suas publicações, vendas e contatos de Patrocínio - MG
          </p>
        </div>

        <button
          onClick={startPublishFlow}
          className="bg-[#F95700] hover:bg-[#E04E00] text-white font-bold px-5 py-2.5 rounded-full shadow-md shadow-orange-500/20 flex items-center gap-2 text-sm self-start sm:self-auto cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Publicar novo anúncio</span>
        </button>
      </div>

      {/* Metrics Summary Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8">
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
            Anúncios Ativos
          </div>
          <div className="text-2xl font-black text-gray-900">{activeCount}</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
            Produtos Vendidos
          </div>
          <div className="text-2xl font-black text-emerald-600">{soldCount}</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
            Visualizações Totais
          </div>
          <div className="text-2xl font-black text-gray-900">{totalViews}</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
            Contatos WhatsApp
          </div>
          <div className="text-2xl font-black text-[#25D366]">{totalWhatsAppClicks}</div>
        </div>
      </div>

      {/* Tabs: Todos, Ativos, Histórico de Vendas */}
      <div className="flex items-center gap-2 border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab('all')}
          className={`pb-3 px-3 text-sm font-bold transition-all relative ${
            activeTab === 'all'
              ? 'text-[#F95700]'
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          Todos ({userAds.length})
          {activeTab === 'all' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#F95700] rounded-full"></span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('active')}
          className={`pb-3 px-3 text-sm font-bold transition-all relative ${
            activeTab === 'active'
              ? 'text-[#F95700]'
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          Ativos ({activeCount})
          {activeTab === 'active' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#F95700] rounded-full"></span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('sold')}
          className={`pb-3 px-3 text-sm font-bold transition-all relative ${
            activeTab === 'sold'
              ? 'text-[#F95700]'
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          Histórico de Vendidos ({soldCount})
          {activeTab === 'sold' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#F95700] rounded-full"></span>
          )}
        </button>
      </div>

      {/* List of Ads */}
      {filteredAds.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-200">
          <div className="w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-3">
            <PackageCheck className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-1">
            {activeTab === 'sold'
              ? 'Nenhum produto marcado como vendido ainda'
              : 'Você não tem anúncios nesta categoria'}
          </h3>
          <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto">
            {activeTab === 'sold'
              ? 'Quando negociar um produto com sucesso pelo WhatsApp, marque-o como vendido para registrar seu histórico de sucesso.'
              : 'Desapegue de eletrônicos, veículos, roupas ou anuncie seus serviços em Patrocínio.'}
          </p>
          <button
            onClick={startPublishFlow}
            className="bg-[#F95700] text-white font-bold px-6 py-2.5 rounded-full text-sm shadow-md"
          >
            Publicar primeiro anúncio
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAds.map((ad) => (
            <div
              key={ad.id}
              className={`bg-white rounded-2xl p-4 sm:p-5 border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                ad.status === 'sold'
                  ? 'border-gray-200 bg-gray-50/60 opacity-90'
                  : 'border-gray-200 hover:border-orange-200 shadow-xs'
              }`}
            >
              {/* Product Info Block */}
              <div className="flex items-center gap-4 min-w-0 flex-1">
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200">
                  <img
                    src={ad.photos[0]}
                    alt={ad.title}
                    className="w-full h-full object-cover"
                  />
                  {ad.status === 'sold' && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <span className="text-[10px] font-black text-white uppercase tracking-wider">
                        Vendido
                      </span>
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span
                      className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${
                        ad.status === 'sold'
                          ? 'bg-gray-200 text-gray-700'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {ad.status === 'sold' ? 'Vendido (Desativado)' : 'Ativo'}
                    </span>
                    <span className="text-xs text-gray-500">• {ad.neighborhood}</span>
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {ad.createdAt}
                    </span>
                  </div>

                  <h3
                    onClick={() => openAdDetail(ad)}
                    className="font-bold text-gray-900 text-base sm:text-lg hover:text-[#F95700] transition-colors cursor-pointer truncate"
                  >
                    {ad.title}
                  </h3>

                  <div className="text-base sm:text-lg font-black text-gray-900 mt-0.5">
                    {formatPrice(ad.price, ad.priceType)}
                  </div>

                  {/* Performance Indicators */}
                  <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5 text-gray-400" />
                      {ad.viewsCount} visualizações
                    </span>
                    <span className="flex items-center gap-1 text-emerald-700 font-medium">
                      <MessageCircle className="w-3.5 h-3.5" />
                      {ad.whatsappClicksCount} contatos no WhatsApp
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons Toolbar */}
              <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                {/* Marcar como Vendido (Only for active ads) */}
                {ad.status === 'active' && (
                  <button
                    onClick={() => setAdToMarkAsSold(ad)}
                    className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold py-2 px-3 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="Marcar como vendido"
                  >
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>Marcar como vendido</span>
                  </button>
                )}

                {/* Renovar Anúncio (Bump to top) */}
                {ad.status === 'active' && (
                  <button
                    onClick={() => renewAd(ad.id)}
                    className="bg-orange-50 hover:bg-orange-100 text-[#F95700] text-xs font-bold py-2 px-3 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="Renovar anúncio"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                    <span>Renovar</span>
                  </button>
                )}

                {/* Editar */}
                <button
                  onClick={() => handleOpenEdit(ad)}
                  className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors cursor-pointer"
                  title="Editar informações"
                >
                  <Edit className="w-4 h-4" />
                </button>

                {/* Compartilhar */}
                <button
                  onClick={() => handleShareAd(ad)}
                  className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors cursor-pointer"
                  title="Compartilhar link"
                >
                  <Share2 className="w-4 h-4" />
                </button>

                {/* Excluir */}
                <button
                  onClick={() => setAdToDelete(ad)}
                  className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition-colors cursor-pointer"
                  title="Excluir anúncio"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirmation Modal: "Marcar como vendido" (Exact requirement from prompt) */}
      {adToMarkAsSold && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-gray-100 animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-gray-900 text-center mb-2">
              Tem certeza de que deseja marcar este produto como vendido?
            </h3>

            <p className="text-xs text-gray-600 text-center mb-6 leading-relaxed">
              Ao confirmar, o anúncio de <span className="font-bold">"{adToMarkAsSold.title}"</span> será marcado como vendido e <span className="font-bold text-gray-900">apagado automaticamente</span> da plataforma e das buscas públicas.
            </p>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setAdToMarkAsSold(null)}
                className="py-2.5 px-4 rounded-xl border border-gray-300 font-bold text-gray-700 hover:bg-gray-50 text-sm cursor-pointer"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={confirmMarkAsSold}
                className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/20 cursor-pointer"
              >
                Sim, marcar e apagar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal: "Excluir Anúncio" */}
      {adToDelete && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-gray-100 animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-gray-900 text-center mb-2">
              Excluir anúncio permanentemente?
            </h3>

            <p className="text-xs text-gray-600 text-center mb-6 leading-relaxed">
              Você tem certeza que deseja excluir "{adToDelete.title}"? Esta ação é irreversível.
            </p>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setAdToDelete(null)}
                className="py-2.5 px-4 rounded-xl border border-gray-300 font-bold text-gray-700 hover:bg-gray-50 text-sm"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={confirmDelete}
                className="py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-md"
              >
                Sim, excluir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Edit Modal */}
      {editingAd && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveEdit}
            className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-gray-100 space-y-4"
          >
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h3 className="font-bold text-gray-900 text-base">Editar Anúncio</h3>
              <button
                type="button"
                onClick={() => setEditingAd(null)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Título
              </label>
              <input
                type="text"
                required
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full px-3 py-2 border rounded-xl text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Preço (R$)
              </label>
              <input
                type="number"
                value={editPrice}
                onChange={(e) => setEditPrice(e.target.value)}
                className="w-full px-3 py-2 border rounded-xl text-sm font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Descrição
              </label>
              <textarea
                rows={3}
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="w-full px-3 py-2 border rounded-xl text-sm"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingAd(null)}
                className="px-4 py-2 border rounded-xl text-xs font-bold text-gray-600"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#F95700] text-white rounded-xl text-xs font-bold shadow-md"
              >
                Salvar alterações
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
