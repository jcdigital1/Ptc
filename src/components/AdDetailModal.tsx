import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatPrice, AdCard } from './AdCard';
import { buildWhatsAppLink } from '../utils/whatsapp';
import {
  X,
  Heart,
  Share2,
  MapPin,
  Tag,
  ShieldCheck,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  MessageCircle,
  Calendar,
  CheckCircle2,
  UserCheck,
  Eye,
  Info
} from 'lucide-react';

export const AdDetailModal: React.FC = () => {
  const {
    selectedAd,
    closeAdDetail,
    ads,
    categories,
    favorites,
    toggleFavorite,
    recordWhatsAppClick,
    openSellerProfile,
    openReportModal,
    setIsSafetyModalOpen,
    showToast
  } = useApp();

  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  if (!selectedAd) return null;

  const category = categories.find((c) => c.id === selectedAd.categoryId);
  const isFavorited = favorites.includes(selectedAd.id);

  // Other ads from the same seller (excluding current)
  const sellerOtherAds = ads.filter(
    (a) => a.sellerId === selectedAd.sellerId && a.id !== selectedAd.id && a.status === 'active'
  );

  // Similar ads in the same category
  const similarAds = ads.filter(
    (a) => a.categoryId === selectedAd.categoryId && a.id !== selectedAd.id && a.status === 'active'
  );

  const handleWhatsAppClick = () => {
    if (selectedAd.status === 'sold') return;

    recordWhatsAppClick(selectedAd.id);
    const waUrl = buildWhatsAppLink(selectedAd.whatsapp, selectedAd.title);
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  const handleShare = () => {
    const shareUrl = window.location.href.split('?')[0] + `?anuncio=${selectedAd.id}`;
    if (navigator.share) {
      navigator.share({
        title: `${selectedAd.title} - Vendi Patrocínio`,
        text: `Confira este anúncio em Patrocínio: ${selectedAd.title}`,
        url: shareUrl
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareUrl);
      showToast('Link do anúncio copiado! 📋');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="relative bg-white w-full max-w-4xl min-h-screen sm:min-h-0 sm:rounded-3xl shadow-2xl overflow-hidden my-auto flex flex-col max-h-[96vh]">
        {/* Sticky Modal Header */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-gray-200 px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-gray-500 truncate max-w-md">
            <span className="font-semibold text-gray-700">{category?.name || 'Geral'}</span>
            <span>•</span>
            <span className="flex items-center gap-1 text-gray-600 font-medium">
              <MapPin className="w-3.5 h-3.5 text-[#F95700]" />
              {selectedAd.neighborhood}, Patrocínio - MG
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors"
              title="Compartilhar"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => toggleFavorite(selectedAd.id)}
              className="p-2 rounded-full hover:bg-orange-50 text-gray-600 transition-colors"
              title={isFavorited ? 'Remover dos favoritos' : 'Favoritar'}
            >
              <Heart className={`w-4 h-4 ${isFavorited ? 'fill-[#F95700] text-[#F95700]' : ''}`} />
            </button>
            <button
              onClick={closeAdDetail}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors cursor-pointer"
              title="Fechar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className="overflow-y-auto flex-1 p-4 sm:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
            {/* Left Column: Photo Gallery */}
            <div className="lg:col-span-7 flex flex-col gap-3">
              {/* Main Photo View */}
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 group">
                <img
                  src={selectedAd.photos[activePhotoIndex] || selectedAd.photos[0]}
                  alt={selectedAd.title}
                  className="w-full h-full object-contain object-center bg-gray-950"
                />

                {/* Status Overlay */}
                {selectedAd.status === 'sold' && (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center">
                    <span className="bg-red-600 text-white font-extrabold px-6 py-2 rounded-full text-lg uppercase tracking-wider shadow-lg">
                      Produto Vendido
                    </span>
                  </div>
                )}

                {/* Left/Right arrows on main photo */}
                {selectedAd.photos.length > 1 && (
                  <>
                    <button
                      onClick={() =>
                        setActivePhotoIndex(
                          (prev) => (prev - 1 + selectedAd.photos.length) % selectedAd.photos.length
                        )
                      }
                      className="absolute left-2.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-xs transition-opacity"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() =>
                        setActivePhotoIndex((prev) => (prev + 1) % selectedAd.photos.length)
                      }
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-xs transition-opacity"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}

                {/* Photo Counter */}
                <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-2.5 py-1 rounded-full backdrop-blur-xs font-semibold">
                  {activePhotoIndex + 1} / {selectedAd.photos.length}
                </div>
              </div>

              {/* Thumbnails */}
              {selectedAd.photos.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                  {selectedAd.photos.map((photo, index) => (
                    <button
                      key={index}
                      onClick={() => setActivePhotoIndex(index)}
                      className={`relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${
                        activePhotoIndex === index
                          ? 'border-[#F95700] ring-2 ring-orange-200'
                          : 'border-gray-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={photo} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Location notice */}
              <div className="bg-orange-50/60 rounded-xl p-3 border border-orange-100 flex items-start gap-2.5 text-xs text-orange-900 mt-2">
                <MapPin className="w-4 h-4 text-[#F95700] flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Localização aproximada: </span>
                  <span>Bairro {selectedAd.neighborhood}, Patrocínio - MG. Por razões de privacidade e segurança, o endereço exato é combinado diretamente pelo WhatsApp.</span>
                </div>
              </div>
            </div>

            {/* Right Column: Details & WhatsApp Action */}
            <div className="lg:col-span-5 flex flex-col justify-between">
              <div>
                {/* Condition & Tags */}
                <div className="flex items-center flex-wrap gap-2 mb-2">
                  {selectedAd.condition !== 'nao_aplica' && (
                    <span className="bg-gray-100 text-gray-700 text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider">
                      {selectedAd.condition === 'seminovo'
                        ? 'Seminovo'
                        : selectedAd.condition === 'novo'
                        ? 'Novo'
                        : 'Usado'}
                    </span>
                  )}
                  {selectedAd.acceptsOffers && (
                    <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold px-2.5 py-1 rounded-full">
                      ✓ Aceita propostas
                    </span>
                  )}
                  {selectedAd.isFeatured && (
                    <span className="bg-orange-100 text-[#F95700] text-xs font-bold px-2.5 py-1 rounded-full">
                      ★ Destaque
                    </span>
                  )}
                </div>

                {/* Title */}
                <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight leading-snug mb-3">
                  {selectedAd.title}
                </h1>

                {/* Price Display */}
                <div className="mb-4 pb-4 border-b border-gray-100">
                  <div className="text-2xl sm:text-3xl font-black text-gray-900">
                    {formatPrice(selectedAd.price, selectedAd.priceType)}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5 flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      Publicado {selectedAd.createdAt}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" />
                      {selectedAd.viewsCount} visualizações
                    </span>
                  </div>
                </div>

                {/* Main WhatsApp CTA Button */}
                <div className="mb-6">
                  {selectedAd.status === 'sold' ? (
                    <div className="w-full bg-gray-100 text-gray-500 font-bold py-3.5 px-4 rounded-2xl text-center border border-gray-200 text-sm">
                      Este produto já foi marcado como vendido
                    </div>
                  ) : (
                    <button
                      onClick={handleWhatsAppClick}
                      className="w-full bg-[#25D366] hover:bg-[#20bd5a] active:scale-98 text-white font-extrabold py-3.5 px-6 rounded-2xl shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-3 text-base sm:text-lg transition-all cursor-pointer group"
                    >
                      <MessageCircle className="w-6 h-6 fill-white stroke-none group-hover:scale-110 transition-transform" />
                      <span>Chamar no WhatsApp</span>
                    </button>
                  )}
                  <p className="text-[11px] text-gray-500 text-center mt-2 flex items-center justify-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Negociação direta e sem comissão entre moradores de Patrocínio.
                  </p>
                </div>

                {/* Description */}
                <div className="mb-6">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                    Descrição do produto
                  </h3>
                  <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line bg-gray-50/70 p-4 rounded-2xl border border-gray-100">
                    {selectedAd.description}
                  </div>
                </div>

                {/* Seller Profile Card */}
                <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-xs mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {selectedAd.sellerAvatar ? (
                        <img
                          src={selectedAd.sellerAvatar}
                          alt={selectedAd.sellerName}
                          className="w-12 h-12 rounded-full object-cover border border-orange-200"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-orange-100 text-[#F95700] flex items-center justify-center font-extrabold text-lg">
                          {selectedAd.sellerName.charAt(0)}
                        </div>
                      )}
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm flex items-center gap-1.5">
                          {selectedAd.sellerName}
                          <span title="Vendedor verificado" className="inline-flex">
                            <UserCheck className="w-4 h-4 text-emerald-600" />
                          </span>
                        </h4>
                        <p className="text-xs text-gray-500">
                          Na plataforma desde {selectedAd.sellerJoinedDate}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        closeAdDetail();
                        openSellerProfile(selectedAd.sellerId);
                      }}
                      className="text-xs font-bold text-[#F95700] hover:text-orange-700 hover:underline flex items-center gap-0.5"
                    >
                      Ver perfil
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-center text-xs pt-2 border-t border-gray-100">
                    <div className="bg-gray-50 py-1.5 rounded-lg">
                      <span className="font-bold text-gray-800">
                        {sellerOtherAds.length + 1}
                      </span>{' '}
                      <span className="text-gray-500">anúncios ativos</span>
                    </div>
                    <div className="bg-emerald-50 text-emerald-800 py-1.5 rounded-lg font-medium">
                      ✓ Patrocínio - MG
                    </div>
                  </div>
                </div>

                {/* Safety & Report links */}
                <div className="flex items-center justify-between text-xs text-gray-500 pt-2">
                  <button
                    onClick={() => setIsSafetyModalOpen(true)}
                    className="hover:text-orange-600 flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Dicas de segurança
                  </button>

                  <button
                    onClick={() => openReportModal(selectedAd)}
                    className="hover:text-red-600 flex items-center gap-1 text-gray-400 hover:underline transition-colors cursor-pointer"
                  >
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                    Denunciar anúncio
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Section: Other Ads from this Seller */}
          {sellerOtherAds.length > 0 && (
            <div className="mt-10 pt-8 border-t border-gray-100">
              <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-4">
                Outros anúncios de {selectedAd.sellerName.split(' ')[0]}
              </h3>
              <div className="flex items-center gap-4 overflow-x-auto no-scrollbar pb-2">
                {sellerOtherAds.map((ad) => (
                  <AdCard key={ad.id} ad={ad} layout="carousel" />
                ))}
              </div>
            </div>
          )}

          {/* Section: Similar recommendations */}
          {similarAds.length > 0 && (
            <div className="mt-8 pt-6 border-t border-gray-100">
              <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-4">
                Produtos recomendados em {category?.name || 'Patrocínio'}
              </h3>
              <div className="flex items-center gap-4 overflow-x-auto no-scrollbar pb-2">
                {similarAds.slice(0, 4).map((ad) => (
                  <AdCard key={ad.id} ad={ad} layout="carousel" />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
