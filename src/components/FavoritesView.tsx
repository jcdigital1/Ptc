import React from 'react';
import { useApp } from '../context/AppContext';
import { AdCard } from './AdCard';
import { Heart, ArrowLeft, ShoppingBag } from 'lucide-react';

export const FavoritesView: React.FC = () => {
  const { favorites, ads, setActiveView, currentUser, setIsAuthModalOpen } = useApp();

  const favoritedAds = ads.filter((a) => favorites.includes(a.id));

  if (!currentUser) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 text-center">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Heart className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Seus Favoritos</h2>
        <p className="text-gray-500 mb-6 text-sm">
          Faça login para salvar seus anúncios favoritos e acessá-los a qualquer momento.
        </p>
        <button
          onClick={() => setIsAuthModalOpen(true)}
          className="bg-[#F95700] text-white font-bold px-6 py-2.5 rounded-full text-sm shadow-md"
        >
          Entrar ou Criar Conta
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      <button
        onClick={() => setActiveView('home')}
        className="text-xs font-semibold text-gray-500 hover:text-[#F95700] flex items-center gap-1 mb-4 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar para a Loja
      </button>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            Meus Favoritos <span className="text-[#F95700]">({favoritedAds.length})</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">
            Produtos e serviços salvos para você conferir e negociar no WhatsApp
          </p>
        </div>
      </div>

      {favoritedAds.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-200">
          <div className="w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-3">
            <Heart className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-1">
            Você ainda não tem anúncios favoritados
          </h3>
          <p className="text-xs text-gray-500 mb-6 max-w-sm mx-auto">
            Clique no coração nos cartões dos anúncios para salvar itens que você gostaria de negociar.
          </p>
          <button
            onClick={() => setActiveView('home')}
            className="bg-[#F95700] text-white font-bold px-6 py-2.5 rounded-full text-sm"
          >
            Explorar Anúncios
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
          {favoritedAds.map((ad) => (
            <AdCard key={ad.id} ad={ad} />
          ))}
        </div>
      )}
    </div>
  );
};
