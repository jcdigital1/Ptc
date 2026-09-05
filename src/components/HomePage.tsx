import React, { useRef, useState } from 'react';
import { useApp } from '../context/AppContext';
import { BannerCarousel } from './BannerCarousel';
import { CategoryBar } from './CategoryBar';
import { AdCard } from './AdCard';
import {
  Sparkles,
  Clock,
  MapPin,
  Flame,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  X,
  Search,
  Filter,
  CheckCircle2,
  Plus
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const {
    ads,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedNeighborhood,
    setSelectedNeighborhood,
    selectedCondition,
    setSelectedCondition,
    sortBy,
    setSortBy,
    resetFilters,
    categories,
    neighborhoods,
    openBeforePublishModal
  } = useApp();

  const [localNeighborhoodTab, setLocalNeighborhoodTab] = useState<string>('Centro');

  // References for horizontal scrolling
  const recentScrollRef = useRef<HTMLDivElement>(null);
  const featuredScrollRef = useRef<HTMLDivElement>(null);
  const nearbyScrollRef = useRef<HTMLDivElement>(null);

  const scrollContainer = (ref: React.RefObject<HTMLDivElement | null>, direction: 'left' | 'right') => {
    if (ref.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      ref.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Only active ads are shown on public carousels and feeds
  const activeAds = ads.filter((a) => a.status === 'active');

  // 6. "Últimos anúncios" carousel (recently added)
  const recentAds = [...activeAds].slice(0, 8);

  // 7. "Destaques em Patrocínio" carousel (featured)
  const featuredAds = activeAds.filter((a) => a.isFeatured || a.isSponsored);

  // 8. "Perto de você" (filtered by local neighborhood tab or selected neighborhood)
  const effectiveNeighborhood = selectedNeighborhood || localNeighborhoodTab;
  const nearbyAds = activeAds.filter((a) => a.neighborhood === effectiveNeighborhood);
  const fallbackNearbyAds = nearbyAds.length > 0 ? nearbyAds : activeAds.slice(0, 6);

  // 9. Feed geral com todos os anúncios ativos da plataforma (filtered by search, category, etc.)
  let generalFeed = activeAds.filter((ad) => {
    // Search query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchTitle = ad.title.toLowerCase().includes(q);
      const matchDesc = ad.description.toLowerCase().includes(q);
      const matchNeighborhood = ad.neighborhood.toLowerCase().includes(q);
      const matchCategory = categories.find((c) => c.id === ad.categoryId)?.name.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchNeighborhood && !matchCategory) return false;
    }

    // Category filter
    if (selectedCategory && ad.categoryId !== selectedCategory) {
      return false;
    }

    // Neighborhood filter
    if (selectedNeighborhood && ad.neighborhood !== selectedNeighborhood) {
      return false;
    }

    // Condition filter
    if (selectedCondition && ad.condition !== selectedCondition) {
      return false;
    }

    return true;
  });

  // Sorting
  generalFeed = [...generalFeed].sort((a, b) => {
    if (sortBy === 'price_asc') return a.price - b.price;
    if (sortBy === 'price_desc') return b.price - a.price;
    if (sortBy === 'popular') return (b.viewsCount || 0) - (a.viewsCount || 0);
    return 0; // Default recent
  });

  const activeCategoryObj = categories.find((c) => c.id === selectedCategory);
  const isFiltering = Boolean(searchQuery || selectedCategory || selectedNeighborhood || selectedCondition);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8 space-y-8 sm:space-y-12">
      {/* 4. Carrossel principal para banners, promoções e anúncios patrocinados */}
      {!isFiltering && <BannerCarousel />}

      {/* 5. Seção horizontal de categorias com ícones */}
      <CategoryBar />

      {/* Filter Active Notice if searching */}
      {isFiltering && (
        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center flex-wrap gap-2 text-xs">
            <span className="font-bold text-gray-700">Filtros aplicados:</span>
            {searchQuery && (
              <span className="bg-white px-2.5 py-1 rounded-full border border-orange-300 font-bold text-[#F95700] flex items-center gap-1">
                Busca: "{searchQuery}"
                <button onClick={() => setSearchQuery('')}><X className="w-3 h-3" /></button>
              </span>
            )}
            {selectedCategory && (
              <span className="bg-white px-2.5 py-1 rounded-full border border-orange-300 font-bold text-[#F95700] flex items-center gap-1">
                Categoria: {activeCategoryObj?.name}
                <button onClick={() => setSelectedCategory(null)}><X className="w-3 h-3" /></button>
              </span>
            )}
            {selectedNeighborhood && (
              <span className="bg-white px-2.5 py-1 rounded-full border border-orange-300 font-bold text-[#F95700] flex items-center gap-1">
                Bairro: {selectedNeighborhood}
                <button onClick={() => setSelectedNeighborhood(null)}><X className="w-3 h-3" /></button>
              </span>
            )}
          </div>

          <button
            onClick={resetFilters}
            className="text-xs font-bold text-[#F95700] hover:underline self-start sm:self-auto cursor-pointer"
          >
            Limpar todos os filtros
          </button>
        </div>
      )}

      {/* 6. Carrossel “Últimos anúncios”, apresentando os produtos publicados mais recentemente */}
      {!isFiltering && (
        <section className="relative">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-orange-100 text-[#F95700] flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-extrabold text-gray-900 tracking-tight">
                  Últimos anúncios
                </h2>
                <p className="text-xs text-gray-500">Publicados recentemente em Patrocínio</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => scrollContainer(recentScrollRef, 'left')}
                className="w-8 h-8 rounded-full border border-gray-200 bg-white hover:bg-orange-50 text-gray-600 hover:text-[#F95700] flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Rolar para a esquerda"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => scrollContainer(recentScrollRef, 'right')}
                className="w-8 h-8 rounded-full border border-gray-200 bg-white hover:bg-orange-50 text-gray-600 hover:text-[#F95700] flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Rolar para a direita"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div
            ref={recentScrollRef}
            className="flex items-stretch gap-4 overflow-x-auto no-scrollbar pb-3 -mx-4 px-4 sm:mx-0 sm:px-0"
          >
            {recentAds.map((ad) => (
              <AdCard key={ad.id} ad={ad} layout="carousel" />
            ))}
          </div>
        </section>
      )}

      {/* 7. Carrossel “Destaques em Patrocínio” */}
      {!isFiltering && featuredAds.length > 0 && (
        <section id="destaques-section" className="relative">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-extrabold text-gray-900 tracking-tight">
                  Destaques em Patrocínio
                </h2>
                <p className="text-xs text-gray-500">Ofertas selecionadas e de grande procura</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => scrollContainer(featuredScrollRef, 'left')}
                className="w-8 h-8 rounded-full border border-gray-200 bg-white hover:bg-orange-50 text-gray-600 hover:text-[#F95700] flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Rolar para a esquerda"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => scrollContainer(featuredScrollRef, 'right')}
                className="w-8 h-8 rounded-full border border-gray-200 bg-white hover:bg-orange-50 text-gray-600 hover:text-[#F95700] flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Rolar para a direita"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div
            ref={featuredScrollRef}
            className="flex items-stretch gap-4 overflow-x-auto no-scrollbar pb-3 -mx-4 px-4 sm:mx-0 sm:px-0"
          >
            {featuredAds.map((ad) => (
              <AdCard key={ad.id} ad={ad} layout="carousel" />
            ))}
          </div>
        </section>
      )}

      {/* 8. Seção “Perto de você” */}
      {!isFiltering && (
        <section className="relative bg-gradient-to-br from-orange-50/60 to-white p-4 sm:p-6 rounded-3xl border border-orange-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#F95700] text-white flex items-center justify-center shadow-xs">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-extrabold text-gray-900 tracking-tight">
                  Perto de você
                </h2>
                <p className="text-xs text-gray-500">
                  Compre de quem mora no mesmo bairro que você em Patrocínio
                </p>
              </div>
            </div>

            {/* Quick Bairro Selector Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
              {neighborhoods
                .filter((n) => n.active)
                .slice(0, 8)
                .map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setLocalNeighborhoodTab(item.name)}
                    className={`text-xs px-3 py-1 rounded-full font-bold whitespace-nowrap transition-all cursor-pointer ${
                      effectiveNeighborhood === item.name
                        ? 'bg-[#F95700] text-white shadow-xs'
                        : 'bg-white text-gray-600 border border-gray-200 hover:border-orange-300'
                    }`}
                  >
                    {item.name}
                  </button>
                ))}
            </div>
          </div>

          <div
            ref={nearbyScrollRef}
            className="flex items-stretch gap-4 overflow-x-auto no-scrollbar pb-2 -mx-2 px-2"
          >
            {fallbackNearbyAds.map((ad) => (
              <AdCard key={ad.id} ad={ad} layout="carousel" />
            ))}
          </div>
        </section>
      )}

      {/* 9. Feed geral com todos os anúncios ativos da plataforma */}
      <section id="feed-geral">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-200">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
              {selectedCategory
                ? activeCategoryObj?.name
                : searchQuery
                ? `Resultados para "${searchQuery}"`
                : 'Feed Geral de Anúncios'}
            </h2>
            <p className="text-xs text-gray-500">
              {generalFeed.length}{' '}
              {generalFeed.length === 1 ? 'produto ou serviço disponível' : 'produtos e serviços disponíveis'}
            </p>
          </div>

          {/* Sort Controls */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <span className="text-xs font-semibold text-gray-400 hidden sm:inline">Ordenar:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-xs font-bold bg-white border border-gray-200 rounded-xl px-3 py-2 text-gray-700 focus:outline-none focus:border-[#F95700]"
            >
              <option value="recent">Mais Recentes</option>
              <option value="price_asc">Menor Preço</option>
              <option value="price_desc">Maior Preço</option>
              <option value="popular">Mais Vistos</option>
            </select>
          </div>
        </div>

        {generalFeed.length === 0 ? (
          activeAds.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border border-orange-100 shadow-xs">
              <div className="w-16 h-16 bg-orange-100 text-[#F95700] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner">
                <Plus className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-2">
                Nenhum anúncio publicado ainda em Patrocínio
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 mb-6 max-w-md mx-auto leading-relaxed">
                Seja o primeiro morador ou comerciante a divulgar seus produtos e serviços na sua cidade! É 100% grátis e a negociação é feita direto no WhatsApp.
              </p>
              <button
                onClick={openBeforePublishModal}
                className="bg-[#F95700] hover:bg-[#E04E00] text-white font-extrabold px-8 py-3.5 rounded-2xl text-sm shadow-lg shadow-orange-500/25 transition-all inline-flex items-center gap-2 cursor-pointer hover:scale-102 active:scale-98"
              >
                <Plus className="w-5 h-5" />
                <span>Publicar Anúncio Agora</span>
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-gray-200">
              <div className="w-16 h-16 bg-orange-50 text-[#F95700] rounded-full flex items-center justify-center mx-auto mb-3">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">
                Nenhum anúncio encontrado
              </h3>
              <p className="text-xs text-gray-500 mb-6 max-w-sm mx-auto">
                Tente buscar por termos mais genéricos ou limpe os filtros selecionados.
              </p>
              <button
                onClick={resetFilters}
                className="bg-[#F95700] text-white font-bold px-6 py-2.5 rounded-full text-xs shadow-md cursor-pointer"
              >
                Ver todos os anúncios de Patrocínio
              </button>
            </div>
          )
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
            {generalFeed.map((ad) => (
              <AdCard key={ad.id} ad={ad} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
