import React from 'react';
import { Ad } from '../types';
import { useApp } from '../context/AppContext';
import { Heart, Share2, MapPin, Tag, CheckCircle2, Clock } from 'lucide-react';

interface AdCardProps {
  ad: Ad;
  layout?: 'grid' | 'carousel';
}

export const formatPrice = (price: number, priceType: Ad['priceType']) => {
  if (priceType === 'free') return 'Grátis';
  if (priceType === 'negotiable' && price === 0) return 'A combinar';
  const formatted = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0
  }).format(price);
  return priceType === 'negotiable' ? `${formatted} (A combinar)` : formatted;
};

export const AdCard: React.FC<AdCardProps> = ({ ad, layout = 'grid' }) => {
  const {
    favorites,
    toggleFavorite,
    openAdDetail,
    categories,
    showToast
  } = useApp();

  const isFavorited = favorites.includes(ad.id);
  const category = categories.find(c => c.id === ad.categoryId);

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareUrl = window.location.href.split('?')[0] + `?anuncio=${ad.id}`;
    if (navigator.share) {
      navigator.share({
        title: `${ad.title} - Vendi Patrocínio`,
        text: `Confira este anúncio em Patrocínio: ${ad.title} por ${formatPrice(ad.price, ad.priceType)}`,
        url: shareUrl
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareUrl);
      showToast('Link do anúncio copiado para a área de transferência! 📋');
    }
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(ad.id);
  };

  return (
    <div
      onClick={() => openAdDetail(ad)}
      className={`group relative bg-white rounded-2xl overflow-hidden border border-gray-200/90 shadow-[0_2px_6px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.08)] hover:border-orange-200 transition-all duration-200 cursor-pointer flex flex-col ${
        layout === 'carousel' ? 'w-64 sm:w-72 flex-shrink-0' : 'w-full'
      }`}
    >
      {/* Photo Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
        <img
          src={ad.photos[0] || 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=800&auto=format&fit=crop&q=80'}
          alt={ad.title}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
        />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          {ad.status === 'sold' && (
            <span className="bg-gray-900 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-md uppercase tracking-wider shadow">
              Vendido
            </span>
          )}
          {ad.isFeatured && ad.status !== 'sold' && (
            <span className="bg-[#F95700] text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-md uppercase tracking-wider shadow-sm flex items-center gap-1">
              ★ Destaque
            </span>
          )}
          {ad.isSponsored && (
            <span className="bg-amber-500 text-white text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider shadow-sm">
              Patrocinado
            </span>
          )}
        </div>

        {/* Action Buttons on Photo (Favorite & Share) */}
        <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 z-10">
          <button
            onClick={handleShare}
            className="w-8 h-8 rounded-full bg-white/90 hover:bg-white text-gray-700 hover:text-[#F95700] shadow-md backdrop-blur-xs flex items-center justify-center transition-all cursor-pointer"
            title="Compartilhar anúncio"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleFavoriteClick}
            className={`w-8 h-8 rounded-full shadow-md backdrop-blur-xs flex items-center justify-center transition-all cursor-pointer ${
              isFavorited
                ? 'bg-white text-[#F95700]'
                : 'bg-white/90 hover:bg-white text-gray-600 hover:text-[#F95700]'
            }`}
            title={isFavorited ? 'Remover dos favoritos' : 'Favoritar anúncio'}
          >
            <Heart
              className={`w-4 h-4 ${isFavorited ? 'fill-[#F95700] text-[#F95700]' : ''}`}
            />
          </button>
        </div>

        {/* Condition tag */}
        {ad.condition !== 'nao_aplica' && (
          <div className="absolute bottom-2 left-2.5">
            <span className="bg-white/95 text-gray-800 text-[10px] font-semibold px-2 py-0.5 rounded shadow-xs capitalize backdrop-blur-xs">
              {ad.condition === 'seminovo' ? 'Seminovo' : ad.condition === 'novo' ? 'Novo' : 'Usado'}
            </span>
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-3.5 flex flex-col flex-1 justify-between">
        <div>
          {/* Price */}
          <div className="mb-1">
            <span className="text-lg sm:text-xl font-black text-gray-900 tracking-tight">
              {formatPrice(ad.price, ad.priceType)}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-sm font-semibold text-gray-800 group-hover:text-[#F95700] transition-colors line-clamp-2 leading-snug mb-2">
            {ad.title}
          </h3>
        </div>

        <div>
          {/* Category & Location */}
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
            <span className="flex items-center gap-1 truncate text-gray-600 font-medium">
              <MapPin className="w-3.5 h-3.5 text-[#F95700] flex-shrink-0" />
              <span className="truncate">{ad.neighborhood}, Patrocínio</span>
            </span>
          </div>

          {/* Bottom Row: Seller Name & Date */}
          <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
            <span className="truncate font-medium text-gray-700 max-w-[120px]">
              {ad.sellerName.split(' ')[0]}
            </span>
            <span className="flex items-center gap-0.5 text-gray-400 whitespace-nowrap">
              <Clock className="w-3 h-3" />
              {ad.createdAt}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
