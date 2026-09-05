import React from 'react';
import { useApp } from '../context/AppContext';
import { Home, Grid, PlusCircle, Heart, User } from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const {
    activeView,
    setActiveView,
    favorites,
    currentUser,
    setIsAuthModalOpen,
    setIsPublishModalOpen,
    openBeforePublishModal
  } = useApp();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 px-2 py-1 shadow-[0_-4px_12px_rgba(0,0,0,0.05)] pb-safe">
      <div className="flex items-center justify-around">
        {/* Início */}
        <button
          onClick={() => setActiveView('home')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-lg transition-colors ${activeView === 'home' ? 'text-[#F95700]' : 'text-gray-500 hover:text-gray-900'}`}
        >
          <Home className={`w-5 h-5 ${activeView === 'home' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className={`text-[10px] mt-0.5 ${activeView === 'home' ? 'font-bold' : 'font-medium'}`}>
            Início
          </span>
        </button>

        {/* Categorias */}
        <button
          onClick={() => setActiveView('categories')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-lg transition-colors ${activeView === 'categories' ? 'text-[#F95700]' : 'text-gray-500 hover:text-gray-900'}`}
        >
          <Grid className={`w-5 h-5 ${activeView === 'categories' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className={`text-[10px] mt-0.5 ${activeView === 'categories' ? 'font-bold' : 'font-medium'}`}>
            Categorias
          </span>
        </button>

        {/* Publicar (Elevated Center Button) */}
        <button
          onClick={() => {
            if (!currentUser) {
              setIsAuthModalOpen(true);
            } else if (!currentUser.hasAcceptedSellerDisclaimer) {
              openBeforePublishModal();
            } else {
              setIsPublishModalOpen(true);
            }
          }}
          className="flex flex-col items-center justify-center -mt-3.5 group"
        >
          <div className="w-12 h-12 rounded-full bg-[#F95700] text-white flex items-center justify-center shadow-lg shadow-orange-500/30 group-active:scale-95 transition-transform">
            <PlusCircle className="w-6 h-6 stroke-[2.5]" />
          </div>
          <span className="text-[10px] font-bold text-[#F95700] mt-0.5">
            Publicar
          </span>
        </button>

        {/* Favoritos */}
        <button
          onClick={() => setActiveView('favorites')}
          className={`relative flex flex-col items-center justify-center py-1 px-2.5 rounded-lg transition-colors ${activeView === 'favorites' ? 'text-[#F95700]' : 'text-gray-500 hover:text-gray-900'}`}
        >
          <Heart className={`w-5 h-5 ${activeView === 'favorites' ? 'fill-[#F95700] stroke-[2.5]' : 'stroke-2'}`} />
          {favorites.length > 0 && (
            <span className="absolute top-0 right-1.5 bg-[#F95700] text-white text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
              {favorites.length}
            </span>
          )}
          <span className={`text-[10px] mt-0.5 ${activeView === 'favorites' ? 'font-bold' : 'font-medium'}`}>
            Favoritos
          </span>
        </button>

        {/* Perfil */}
        <button
          onClick={() => {
            if (!currentUser) {
              setIsAuthModalOpen(true);
            } else {
              setActiveView('profile');
            }
          }}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-lg transition-colors ${activeView === 'profile' || activeView === 'seller_dashboard' ? 'text-[#F95700]' : 'text-gray-500 hover:text-gray-900'}`}
        >
          <User className={`w-5 h-5 ${activeView === 'profile' || activeView === 'seller_dashboard' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className={`text-[10px] mt-0.5 ${activeView === 'profile' || activeView === 'seller_dashboard' ? 'font-bold' : 'font-medium'}`}>
            Perfil
          </span>
        </button>
      </div>
    </nav>
  );
};
