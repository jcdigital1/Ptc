import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight } from 'lucide-react';

export const BannerCarousel: React.FC = () => {
  const { banners, setSelectedCategory, setActiveView, startPublishFlow } = useApp();
  const activeBanners = banners.filter(b => b.active);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (activeBanners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [activeBanners.length]);

  if (activeBanners.length === 0) return null;

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + activeBanners.length) % activeBanners.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
  };

  const handleBannerAction = (banner: typeof activeBanners[0]) => {
    if (banner.categoryId) {
      setSelectedCategory(banner.categoryId);
      setActiveView('home');
    } else if (banner.id === 'b3') {
      startPublishFlow();
    } else {
      // General action
      const section = document.getElementById('destaques-section');
      if (section) section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const currentBanner = activeBanners[currentIndex];

  return (
    <div className="relative w-full overflow-hidden rounded-2xl md:rounded-3xl shadow-sm border border-gray-200/80 bg-gray-900 group">
      {/* Banner Slide */}
      <div className="relative h-48 sm:h-64 md:h-80 w-full overflow-hidden">
        {/* Background Image with Overlay */}
        <img
          src={currentBanner.imageUrl}
          alt={currentBanner.title}
          className="w-full h-full object-cover object-center transform scale-100 group-hover:scale-102 transition-transform duration-700 opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-950/90 via-gray-950/60 to-transparent"></div>

        {/* Content Container */}
        <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-12 md:px-16 max-w-2xl text-white">
          <div className="inline-flex items-center gap-1.5 bg-[#F95700] text-white px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider w-max mb-2.5 shadow-md shadow-orange-600/30">
            <Sparkles className="w-3 h-3" />
            {currentBanner.tag}
          </div>

          <h2 className="text-xl sm:text-3xl md:text-4xl font-extrabold tracking-tight leading-tight mb-2 drop-shadow-sm">
            {currentBanner.title}
          </h2>

          <p className="text-xs sm:text-base text-gray-200 mb-4 sm:mb-6 line-clamp-2 drop-shadow">
            {currentBanner.subtitle}
          </p>

          <div>
            <button
              onClick={() => handleBannerAction(currentBanner)}
              className="bg-white hover:bg-orange-50 text-gray-900 hover:text-[#F95700] font-bold text-xs sm:text-sm px-5 py-2.5 rounded-full shadow-lg flex items-center gap-2 transition-all transform active:scale-95 cursor-pointer"
            >
              <span>{currentBanner.ctaText || 'Saiba Mais'}</span>
              <ArrowRight className="w-4 h-4 text-[#F95700]" />
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      {activeBanners.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-sm flex items-center justify-center transition-opacity opacity-0 group-hover:opacity-100 cursor-pointer"
            aria-label="Anterior"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-sm flex items-center justify-center transition-opacity opacity-0 group-hover:opacity-100 cursor-pointer"
            aria-label="Próximo"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
            {activeBanners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`transition-all rounded-full ${currentIndex === idx ? 'w-6 h-2 bg-[#F95700]' : 'w-2 h-2 bg-white/60 hover:bg-white'}`}
                aria-label={`Ir para banner ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};
