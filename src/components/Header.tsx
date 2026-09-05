import React, { useState } from 'react';
import { Logo } from './Logo';
import { useApp } from '../context/AppContext';
import {
  Search,
  PlusCircle,
  Heart,
  User as UserIcon,
  ShieldCheck,
  LayoutDashboard,
  LogOut,
  MapPin,
  X,
  ChevronDown,
  SlidersHorizontal,
  Settings
} from 'lucide-react';
import { PATROCINIO_NEIGHBORHOODS } from '../data/initialData';

export const Header: React.FC = () => {
  const {
    currentUser,
    favorites,
    searchQuery,
    setSearchQuery,
    selectedNeighborhood,
    setSelectedNeighborhood,
    setActiveView,
    activeView,
    setIsAuthModalOpen,
    setIsPublishModalOpen,
    openBeforePublishModal,
    setIsSafetyModalOpen,
    logout,
    resetFilters
  } = useApp();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNeighborhoodOpen, setIsNeighborhoodOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveView('home');
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
      {/* Top micro bar with Patrocínio badge and safety reminder */}
      <div className="bg-orange-50/70 border-b border-orange-100/70 text-xs py-1 px-4 text-gray-600 hidden sm:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 font-medium text-orange-800">
              <MapPin className="w-3.5 h-3.5 text-[#F95700]" />
              Patrocínio - MG • Negociações presenciais e pelo WhatsApp
            </span>
            <span className="text-gray-300">|</span>
            <button
              onClick={() => setIsSafetyModalOpen(true)}
              className="text-gray-600 hover:text-orange-600 flex items-center gap-1 cursor-pointer transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Guia de Segurança contra Golpes
            </button>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                setActiveView('admin');
              }}
              className="text-xs text-gray-500 hover:text-orange-600 flex items-center gap-1 cursor-pointer font-medium"
            >
              <Settings className="w-3 h-3 text-gray-400" />
              Painel Administrativo
            </button>
          </div>
        </div>
      </div>

      {/* Main Header Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-3 sm:gap-6">
        {/* Logo */}
        <Logo
          size="md"
          onClick={() => {
            resetFilters();
            setActiveView('home');
          }}
        />

        {/* Center: Search Bar with Patrocínio Bairro Selector */}
        <form
          onSubmit={handleSearchSubmit}
          className="flex-1 max-w-2xl hidden md:flex items-center relative"
        >
          <div className="relative w-full flex items-center bg-gray-100 hover:bg-gray-100/90 focus-within:bg-white rounded-full border border-gray-200 focus-within:border-[#F95700] focus-within:ring-2 focus-within:ring-orange-100 transition-all">
            {/* Search icon */}
            <Search className="w-4 h-4 text-gray-400 ml-3.5 flex-shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="O que você está procurando em Patrocínio?"
              className="w-full py-2.5 px-3 bg-transparent text-sm text-gray-800 placeholder-gray-400 focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="p-1 text-gray-400 hover:text-gray-600 mr-2"
                title="Limpar busca"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {/* Neighborhood Pill Filter */}
            <div className="relative border-l border-gray-200">
              <button
                type="button"
                onClick={() => setIsNeighborhoodOpen(!isNeighborhoodOpen)}
                className="flex items-center gap-1.5 py-1.5 px-3 text-xs font-semibold text-gray-700 hover:text-orange-600 whitespace-nowrap"
              >
                <MapPin className="w-3.5 h-3.5 text-[#F95700]" />
                <span className="max-w-[110px] truncate">
                  {selectedNeighborhood || 'Todos os Bairros'}
                </span>
                <ChevronDown className="w-3 h-3 text-gray-400" />
              </button>

              {isNeighborhoodOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 max-h-64 overflow-y-auto bg-white rounded-xl shadow-xl border border-gray-200 py-1.5 z-50">
                  <div className="px-3 py-1.5 text-[11px] font-bold uppercase text-gray-400 tracking-wider">
                    Filtrar por Bairro
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedNeighborhood(null);
                      setIsNeighborhoodOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs hover:bg-orange-50 flex items-center justify-between ${!selectedNeighborhood ? 'text-[#F95700] font-bold bg-orange-50/50' : 'text-gray-700'}`}
                  >
                    Todos os Bairros
                  </button>
                  {PATROCINIO_NEIGHBORHOODS.map((bairro) => (
                    <button
                      key={bairro}
                      type="button"
                      onClick={() => {
                        setSelectedNeighborhood(bairro);
                        setIsNeighborhoodOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs hover:bg-orange-50 flex items-center justify-between ${selectedNeighborhood === bairro ? 'text-[#F95700] font-bold bg-orange-50/50' : 'text-gray-700'}`}
                    >
                      {bairro}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Submit button */}
            <button
              type="submit"
              className="bg-[#F95700] hover:bg-[#E04E00] text-white p-2.5 rounded-full mr-1 transition-colors flex items-center justify-center"
              title="Buscar anúncios"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Right Navigation & CTAs */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Favorites link button */}
          <button
            onClick={() => setActiveView('favorites')}
            className={`relative p-2 rounded-full hover:bg-orange-50 transition-colors ${activeView === 'favorites' ? 'text-[#F95700] bg-orange-50' : 'text-gray-600'}`}
            title="Meus Favoritos"
          >
            <Heart className={`w-5 h-5 ${favorites.length > 0 && activeView === 'favorites' ? 'fill-[#F95700] text-[#F95700]' : ''}`} />
            {favorites.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-[#F95700] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {favorites.length}
              </span>
            )}
          </button>

          {/* User Account / Auth Dropdown */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1.5 rounded-full hover:bg-gray-100 border border-gray-200 transition-all text-xs font-semibold text-gray-800"
              >
                {currentUser.avatarUrl ? (
                  <img
                    src={currentUser.avatarUrl}
                    alt={currentUser.name}
                    className="w-7 h-7 rounded-full object-cover border border-orange-200"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-orange-100 text-[#F95700] flex items-center justify-center font-bold">
                    {currentUser.name.charAt(0)}
                  </div>
                )}
                <span className="hidden lg:inline max-w-[110px] truncate">{currentUser.name.split(' ')[0]}</span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400 hidden sm:block" />
              </button>

              {isUserMenuOpen && (
                <div
                  onMouseLeave={() => setIsUserMenuOpen(false)}
                  className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-200 py-2 z-50 text-sm"
                >
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="font-bold text-gray-900 truncate">{currentUser.name}</p>
                    <p className="text-xs text-gray-500 truncate">{currentUser.email}</p>
                    <span className="inline-block mt-1 text-[11px] bg-orange-100 text-[#F95700] px-2 py-0.5 rounded-full font-medium">
                      📍 {currentUser.neighborhood}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setActiveView('seller_dashboard');
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-orange-50 text-gray-700 flex items-center gap-2"
                  >
                    <LayoutDashboard className="w-4 h-4 text-[#F95700]" />
                    Meus anúncios ({currentUser.activeAdsCount})
                  </button>

                  <button
                    onClick={() => {
                      setActiveView('favorites');
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-orange-50 text-gray-700 flex items-center gap-2"
                  >
                    <Heart className="w-4 h-4 text-red-500" />
                    Favoritos ({favorites.length})
                  </button>

                  <button
                    onClick={() => {
                      setActiveView('profile');
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-orange-50 text-gray-700 flex items-center gap-2"
                  >
                    <UserIcon className="w-4 h-4 text-gray-500" />
                    Meu Perfil
                  </button>

                  {currentUser.role === 'admin' && (
                    <button
                      onClick={() => {
                        setActiveView('admin');
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-purple-50 text-purple-700 flex items-center gap-2 font-medium"
                    >
                      <Settings className="w-4 h-4 text-purple-600" />
                      Painel Administrativo
                    </button>
                  )}

                  <div className="border-t border-gray-100 my-1"></div>

                  <button
                    onClick={() => {
                      logout();
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 flex items-center gap-2 text-xs font-semibold"
                  >
                    <LogOut className="w-4 h-4" />
                    Sair da conta
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="text-xs sm:text-sm font-semibold text-gray-700 hover:text-[#F95700] px-2.5 py-1.5 rounded-lg hover:bg-orange-50 transition-colors"
              >
                Entrar
              </button>
            </div>
          )}

          {/* Primary Action Button: "Publicar Anúncio" */}
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
            className="bg-[#F95700] hover:bg-[#E04E00] active:scale-95 text-white text-xs sm:text-sm font-bold px-3.5 sm:px-4 py-2 rounded-full shadow-md shadow-orange-500/20 flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Publicar anúncio</span>
          </button>
        </div>
      </div>

      {/* Mobile Search Bar Row (visible on small screens) */}
      <div className="md:hidden px-4 pb-2.5">
        <form onSubmit={handleSearchSubmit} className="relative flex items-center">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="O que você está procurando em Patrocínio?"
            className="w-full pl-9 pr-8 py-2 bg-gray-100 rounded-full text-xs text-gray-800 placeholder-gray-400 focus:bg-white focus:outline-none border border-transparent focus:border-[#F95700]"
          />
          {searchQuery ? (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 p-1 text-gray-400"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIsNeighborhoodOpen(!isNeighborhoodOpen)}
              className="absolute right-2.5 p-1 text-gray-400 hover:text-[#F95700]"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
            </button>
          )}
        </form>

        {/* Mobile Neighborhood pill filter if toggled */}
        {isNeighborhoodOpen && (
          <div className="mt-2 bg-white rounded-xl shadow-lg border border-gray-200 p-2 max-h-48 overflow-y-auto">
            <div className="text-[11px] font-bold text-gray-400 uppercase px-2 mb-1">
              Bairro em Patrocínio:
            </div>
            <div className="flex flex-wrap gap-1">
              <button
                type="button"
                onClick={() => {
                  setSelectedNeighborhood(null);
                  setIsNeighborhoodOpen(false);
                }}
                className={`px-2 py-1 rounded-full text-[11px] ${!selectedNeighborhood ? 'bg-[#F95700] text-white font-bold' : 'bg-gray-100 text-gray-700'}`}
              >
                Todos
              </button>
              {PATROCINIO_NEIGHBORHOODS.map((bairro) => (
                <button
                  key={bairro}
                  type="button"
                  onClick={() => {
                    setSelectedNeighborhood(bairro);
                    setIsNeighborhoodOpen(false);
                  }}
                  className={`px-2 py-1 rounded-full text-[11px] ${selectedNeighborhood === bairro ? 'bg-[#F95700] text-white font-bold' : 'bg-gray-100 text-gray-700'}`}
                >
                  {bairro}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
