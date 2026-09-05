import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AdCard } from './AdCard';
import {
  UserCheck,
  Calendar,
  MapPin,
  PackageCheck,
  ShoppingBag,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  Share2,
  Flag,
  AtSign,
  ShieldAlert,
  Check
} from 'lucide-react';

export const SellerPublicProfile: React.FC = () => {
  const {
    selectedSeller,
    ads,
    setActiveView,
    openUserReportModal,
    showToast
  } = useApp();
  const [activeTab, setActiveTab] = useState<'active' | 'sold'>('active');
  const [copiedLink, setCopiedLink] = useState(false);

  if (!selectedSeller) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 text-center">
        <p className="text-gray-500 mb-4">Vendedor não encontrado.</p>
        <button
          onClick={() => setActiveView('home')}
          className="bg-[#F95700] text-white font-bold px-6 py-2 rounded-full text-sm"
        >
          Voltar ao início
        </button>
      </div>
    );
  }

  // Active ads for this seller
  const sellerActiveAds = ads.filter(
    (a) => a.sellerId === selectedSeller.id && a.status === 'active'
  );

  // Sold ads for this seller
  const sellerSoldAds = ads.filter(
    (a) => a.sellerId === selectedSeller.id && a.status === 'sold'
  );

  const displayedAds = activeTab === 'active' ? sellerActiveAds : sellerSoldAds;

  const handleShareProfile = () => {
    const url = window.location.origin + '/#' + (selectedSeller.username || selectedSeller.id);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedLink(true);
      showToast('Link do perfil copiado para a área de transferência!', 'success');
      setTimeout(() => setCopiedLink(false), 2500);
    } else {
      showToast(`Compartilhe o perfil: ${selectedSeller.username || selectedSeller.name}`, 'info');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => setActiveView('home')}
          className="text-xs font-semibold text-gray-500 hover:text-[#F95700] flex items-center gap-1 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para a lista de anúncios
        </button>

        {/* Action Buttons: Share & Report */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleShareProfile}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 bg-white hover:bg-gray-50 text-xs font-bold text-gray-700 shadow-xs transition-all cursor-pointer"
            title="Compartilhar este perfil"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5 text-gray-500" />}
            <span>{copiedLink ? 'Link Copiado!' : 'Compartilhar Perfil'}</span>
          </button>

          <button
            onClick={() => openUserReportModal(selectedSeller)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-red-200 bg-red-50/50 hover:bg-red-50 text-xs font-bold text-red-600 transition-all cursor-pointer"
            title="Denunciar suspeita de fraude ou má conduta"
          >
            <Flag className="w-3.5 h-3.5" />
            <span>Denunciar Perfil</span>
          </button>
        </div>
      </div>

      {/* Seller Hero Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm mb-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
          {/* Avatar */}
          <div className="relative">
            {selectedSeller.avatarUrl ? (
              <img
                src={selectedSeller.avatarUrl}
                alt={selectedSeller.name}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-orange-100 shadow-md"
              />
            ) : (
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-orange-100 text-[#F95700] flex items-center justify-center font-black text-3xl border-4 border-orange-100 shadow-md">
                {selectedSeller.name.charAt(0)}
              </div>
            )}
            {selectedSeller.isWhatsAppVerified && (
              <div
                className="absolute bottom-1 right-1 bg-emerald-500 text-white p-1.5 rounded-full border-2 border-white shadow-sm"
                title="WhatsApp Verificado em Patrocínio"
              >
                <CheckCircle2 className="w-4 h-4" />
              </div>
            )}
          </div>

          {/* Bio & Details */}
          <div className="flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                {selectedSeller.name}
              </h1>
              {selectedSeller.isWhatsAppVerified ? (
                <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  WhatsApp Verificado
                </span>
              ) : (
                <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2 py-0.5 rounded-full">
                  Membro Comum
                </span>
              )}
            </div>

            {/* Exclusive Username */}
            <p className="text-sm font-bold text-[#F95700] font-mono mb-2">
              {selectedSeller.username || '@vendedor'}
            </p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-gray-500 mb-3">
              <span className="flex items-center gap-1 font-medium text-gray-600">
                <MapPin className="w-3.5 h-3.5 text-[#F95700]" />
                {selectedSeller.neighborhood || 'Patrocínio'}, Patrocínio - MG
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-gray-400" />
                No Vendi Patrocínio desde {selectedSeller.joinedDate}
              </span>
            </div>

            {selectedSeller.bio && (
              <p className="text-sm text-gray-600 max-w-2xl leading-relaxed mb-4">
                {selectedSeller.bio}
              </p>
            )}

            {/* Note on LGPD Privacy */}
            <div className="inline-flex items-center gap-1.5 text-[11px] text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Privacidade protegida pela LGPD: e-mail, data de nascimento e endereço exato são estritamente confidenciais.</span>
            </div>
          </div>

          {/* Quick Stats Pill */}
          <div className="flex sm:flex-col gap-2.5 w-full sm:w-auto justify-center">
            <div className="bg-orange-50/70 border border-orange-200/60 rounded-2xl p-3 text-center min-w-[110px]">
              <span className="block text-2xl font-black text-[#F95700]">
                {sellerActiveAds.length}
              </span>
              <span className="text-[11px] font-bold text-gray-600 uppercase">
                Anúncios Ativos
              </span>
            </div>
            <div className="bg-emerald-50/70 border border-emerald-200/60 rounded-2xl p-3 text-center min-w-[110px]">
              <span className="block text-2xl font-black text-emerald-600">
                {sellerSoldAds.length + selectedSeller.soldAdsCount}
              </span>
              <span className="text-[11px] font-bold text-gray-600 uppercase">
                Já Vendidos
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Seller Tabs: Ativos vs Vendidos */}
      <div className="flex items-center gap-3 border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab('active')}
          className={`pb-3 px-3 text-sm font-bold transition-all relative cursor-pointer ${
            activeTab === 'active'
              ? 'text-[#F95700]'
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          Anúncios Disponíveis ({sellerActiveAds.length})
          {activeTab === 'active' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#F95700] rounded-full"></span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('sold')}
          className={`pb-3 px-3 text-sm font-bold transition-all relative cursor-pointer ${
            activeTab === 'sold'
              ? 'text-[#F95700]'
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          Finalizados / Vendidos ({sellerSoldAds.length})
          {activeTab === 'sold' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#F95700] rounded-full"></span>
          )}
        </button>
      </div>

      {/* Ads Grid */}
      {displayedAds.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {displayedAds.map((ad) => (
            <AdCard key={ad.id} ad={ad} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-3xl border border-gray-200 p-8">
          <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-gray-800">
            Nenhum anúncio encontrado nesta categoria.
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            {activeTab === 'active'
              ? 'Este vendedor não tem outros itens ativos no momento.'
              : 'Nenhum anúncio marcado como vendido até o momento.'}
          </p>
        </div>
      )}
    </div>
  );
};
