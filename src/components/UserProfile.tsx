import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { compressImage } from '../utils/imageUtils';
import { formatPrice } from './AdCard';
import { Ad } from '../types';
import {
  User as UserIcon,
  MapPin,
  Phone,
  Mail,
  CheckCircle2,
  CheckCircle,
  ArrowLeft,
  ShoppingBag,
  ShieldCheck,
  Eye,
  Trash2,
  Smartphone,
  Lock,
  Calendar,
  AlertTriangle,
  LogOut,
  Camera,
  Upload,
  PlusCircle,
  Clock,
  MessageCircle,
  RotateCw,
  PackageCheck,
  ExternalLink,
  Tag
} from 'lucide-react';

export const UserProfile: React.FC = () => {
  const {
    currentUser,
    updateCurrentUser,
    setActiveView,
    openSellerProfile,
    neighborhoods,
    verifyCurrentUserWhatsApp,
    submitAccountDeletionRequest,
    openTermsModal,
    logout,
    showToast,
    ads,
    markAsSold,
    deleteAd,
    renewAd,
    openAdDetail,
    startPublishFlow
  } = useApp();

  // Tab navigation state: default to 'ads' so "Meus Anúncios" is immediately available in the profile
  const [activeTab, setActiveTab] = useState<'ads' | 'profile' | 'security'>('ads');

  // Profile edit fields
  const [name, setName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [whatsapp, setWhatsapp] = useState(currentUser?.whatsapp || '');
  const [neighborhood, setNeighborhood] = useState(currentUser?.neighborhood || 'Centro');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [avatarUrl, setAvatarUrl] = useState(currentUser?.avatarUrl || '');

  // Modals for ad actions
  const [adToMarkAsSold, setAdToMarkAsSold] = useState<Ad | null>(null);
  const [adToDelete, setAdToDelete] = useState<Ad | null>(null);

  // LGPD account deletion modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteReason, setDeleteReason] = useState('');
  const [confirmedLgpd, setConfirmedLgpd] = useState(false);

  if (!currentUser) return null;

  // Filter ads that belong to current user
  const userAds = ads.filter((a) => a.sellerId === currentUser.id);
  const totalViews = userAds.reduce((sum, a) => sum + (a.viewsCount || 0), 0);
  const totalWhatsAppClicks = userAds.reduce((sum, a) => sum + (a.whatsappClicksCount || 0), 0);

  const handlePhotoFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 12 * 1024 * 1024) {
        showToast('A imagem deve ter no máximo 12MB.', 'error');
        return;
      }
      try {
        showToast('Processando foto da galeria...', 'info');
        const compressed = await compressImage(file, 400, 400, 0.82);
        setAvatarUrl(compressed);
        await updateCurrentUser({ avatarUrl: compressed });
        showToast('Foto de perfil salva com sucesso! 🎉', 'success');
      } catch (err) {
        console.error('Failed to compress avatar:', err);
        showToast('Erro ao processar foto da galeria. Tente outra imagem.', 'error');
      }
    }
  };

  const handleSubmitProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateCurrentUser({
      name: name.trim(),
      phone: phone.replace(/\D/g, ''),
      whatsapp: whatsapp.replace(/\D/g, ''),
      neighborhood,
      bio: bio.trim(),
      avatarUrl: avatarUrl.trim() || undefined
    });
  };

  const handleOpenPublicView = () => {
    openSellerProfile(currentUser.id);
  };

  const handleRequestDeletion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmedLgpd) {
      showToast('Por favor, confirme que está ciente da exclusão dos dados.', 'error');
      return;
    }
    submitAccountDeletionRequest(deleteReason || 'Solicitado pelo usuário no painel do perfil');
    setIsDeleteModalOpen(false);
  };

  const confirmMarkAsSold = async () => {
    if (adToMarkAsSold) {
      const targetId = adToMarkAsSold.id;
      setAdToMarkAsSold(null);
      await markAsSold(targetId);
    }
  };

  const confirmDelete = async () => {
    if (adToDelete) {
      const targetId = adToDelete.id;
      setAdToDelete(null);
      await deleteAd(targetId);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6">
      {/* Top Header & Fast Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <button
          onClick={() => setActiveView('home')}
          className="text-xs font-semibold text-gray-500 hover:text-[#F95700] flex items-center gap-1 cursor-pointer w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para a Loja
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleOpenPublicView}
            className="bg-white border border-gray-200 hover:border-orange-300 text-xs font-bold text-gray-700 px-3.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-2xs hover:text-[#F95700] transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-[#F95700]" />
            Ver meu Perfil Público
          </button>

          <button
            id="btn-profile-logout"
            onClick={logout}
            className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs font-bold px-3.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer active:scale-95"
            title="Sair da sua conta"
          >
            <LogOut className="w-3.5 h-3.5 text-red-600" />
            <span>Sair</span>
          </button>
        </div>
      </div>

      {/* User Greeting Summary Header */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            {currentUser.avatarUrl ? (
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-[#F95700] shadow-sm"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-orange-100 text-[#F95700] flex items-center justify-center font-black text-2xl border-2 border-orange-300">
                {currentUser.name.charAt(0) || 'U'}
              </div>
            )}
            {currentUser.isWhatsAppVerified && (
              <span
                title="WhatsApp Verificado"
                className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-0.5 rounded-full border-2 border-white shadow-xs"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
              </span>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                {currentUser.name}
              </h1>
              {currentUser.role === 'admin' && (
                <span className="bg-purple-100 text-purple-700 font-extrabold text-[10px] px-2 py-0.5 rounded-full">
                  Administrador
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5 flex-wrap">
              <span className="font-mono font-bold text-[#F95700]">{currentUser.username}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-gray-400" />
                {currentUser.neighborhood}, Patrocínio - MG
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={startPublishFlow}
          className="bg-[#F95700] hover:bg-[#E04E00] text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap active:scale-95 self-stretch sm:self-auto justify-center"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Publicar Anúncio</span>
        </button>
      </div>

      {/* Tabs Selection: Meus Anúncios | Dados do Perfil | Segurança */}
      <div className="flex items-center gap-1.5 sm:gap-2 p-1 bg-gray-100/80 rounded-2xl border border-gray-200">
        <button
          id="tab-profile-my-ads"
          type="button"
          onClick={() => setActiveTab('ads')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer select-none ${
            activeTab === 'ads'
              ? 'bg-white text-gray-900 shadow-xs border border-gray-200'
              : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
          }`}
        >
          <ShoppingBag className={`w-4 h-4 ${activeTab === 'ads' ? 'text-[#F95700]' : 'text-gray-400'}`} />
          <span>Meus Anúncios</span>
          <span
            className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
              activeTab === 'ads'
                ? 'bg-orange-100 text-[#F95700]'
                : 'bg-gray-200 text-gray-600'
            }`}
          >
            {userAds.length}
          </span>
        </button>

        <button
          id="tab-profile-edit"
          type="button"
          onClick={() => setActiveTab('profile')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer select-none ${
            activeTab === 'profile'
              ? 'bg-white text-gray-900 shadow-xs border border-gray-200'
              : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
          }`}
        >
          <UserIcon className={`w-4 h-4 ${activeTab === 'profile' ? 'text-[#F95700]' : 'text-gray-400'}`} />
          <span>Dados do Perfil</span>
        </button>

        <button
          id="tab-profile-security"
          type="button"
          onClick={() => setActiveTab('security')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer select-none ${
            activeTab === 'security'
              ? 'bg-white text-gray-900 shadow-xs border border-gray-200'
              : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
          }`}
        >
          <ShieldCheck className={`w-4 h-4 ${activeTab === 'security' ? 'text-emerald-600' : 'text-gray-400'}`} />
          <span>Segurança & LGPD</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: MEUS ANÚNCIOS (EXCLUIR & MARCAR COMO VENDIDO)    */}
      {/* ======================================================== */}
      {activeTab === 'ads' && (
        <div className="space-y-6">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white p-3.5 rounded-2xl border border-gray-200 shadow-2xs">
              <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">
                Anúncios Ativos
              </div>
              <div className="text-xl sm:text-2xl font-black text-gray-900">
                {userAds.length}
              </div>
            </div>

            <div className="bg-white p-3.5 rounded-2xl border border-gray-200 shadow-2xs">
              <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">
                Produtos Vendidos
              </div>
              <div className="text-xl sm:text-2xl font-black text-emerald-600">
                {currentUser.soldAdsCount || 0}
              </div>
            </div>

            <div className="bg-white p-3.5 rounded-2xl border border-gray-200 shadow-2xs">
              <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">
                Visualizações
              </div>
              <div className="text-xl sm:text-2xl font-black text-gray-900">
                {totalViews}
              </div>
            </div>

            <div className="bg-white p-3.5 rounded-2xl border border-gray-200 shadow-2xs">
              <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">
                Cliques WhatsApp
              </div>
              <div className="text-xl sm:text-2xl font-black text-[#25D366]">
                {totalWhatsAppClicks}
              </div>
            </div>
          </div>

          {/* Ad List Section Header */}
          <div className="bg-white rounded-3xl p-5 sm:p-7 border border-gray-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 gap-2">
              <div>
                <h2 className="text-lg font-black text-gray-900">
                  Gerenciar Meus Anúncios
                </h2>
                <p className="text-xs text-gray-500">
                  Exclua seus anúncios a qualquer momento ou marque-os como vendidos (o anúncio é apagado automaticamente).
                </p>
              </div>

              <span className="text-xs font-semibold text-gray-500 bg-gray-50 px-3 py-1 rounded-full border border-gray-200 w-fit">
                {userAds.length} {userAds.length === 1 ? 'anúncio cadastrado' : 'anúncios cadastrados'}
              </span>
            </div>

            {/* Empty State */}
            {userAds.length === 0 ? (
              <div className="py-12 px-4 text-center">
                <div className="w-16 h-16 bg-orange-50 text-[#F95700] rounded-2xl flex items-center justify-center mx-auto mb-3 border border-orange-100">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-gray-800 mb-1">
                  Você não tem nenhum anúncio ativo no momento
                </h3>
                <p className="text-xs text-gray-500 mb-5 max-w-md mx-auto">
                  Desapegue de eletrônicos, veículos, móveis, roupas ou ofereça serviços para moradores de Patrocínio - MG.
                </p>
                <button
                  onClick={startPublishFlow}
                  className="bg-[#F95700] hover:bg-[#E04E00] text-white font-bold px-5 py-2.5 rounded-full text-xs shadow-md inline-flex items-center gap-2 cursor-pointer transition-all active:scale-95"
                >
                  <PlusCircle className="w-4 h-4" />
                  Publicar meu primeiro anúncio
                </button>
              </div>
            ) : (
              <div className="space-y-4 pt-1">
                {userAds.map((ad) => (
                  <div
                    key={ad.id}
                    className="p-4 sm:p-5 rounded-2xl border border-gray-200 hover:border-orange-200 bg-white transition-all shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    {/* Left: Thumbnail & Info */}
                    <div className="flex items-start sm:items-center gap-3.5 min-w-0 flex-1">
                      <div
                        onClick={() => openAdDetail(ad)}
                        className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200 cursor-pointer group"
                      >
                        {ad.photos && ad.photos.length > 0 ? (
                          <img
                            src={ad.photos[0]}
                            alt={ad.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-50">
                            <Tag className="w-6 h-6" />
                          </div>
                        )}
                        <span className="absolute bottom-1 left-1 bg-emerald-500 text-white text-[9px] font-black uppercase px-1.5 py-0.5 rounded shadow-xs">
                          Ativo
                        </span>
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="text-xs text-gray-500 font-medium">
                            📍 {ad.neighborhood}
                          </span>
                          <span className="text-xs text-gray-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {ad.createdAt}
                          </span>
                        </div>

                        <h3
                          onClick={() => openAdDetail(ad)}
                          className="font-bold text-gray-900 text-sm sm:text-base hover:text-[#F95700] transition-colors cursor-pointer line-clamp-1"
                        >
                          {ad.title}
                        </h3>

                        <div className="text-base sm:text-lg font-black text-gray-900 mt-0.5">
                          {formatPrice(ad.price, ad.priceType)}
                        </div>

                        {/* Metrics Row */}
                        <div className="flex items-center gap-3 text-xs text-gray-500 mt-1 flex-wrap">
                          <span className="flex items-center gap-1">
                            <Eye className="w-3.5 h-3.5 text-gray-400" />
                            {ad.viewsCount || 0} visualizações
                          </span>
                          <span className="flex items-center gap-1 text-emerald-700 font-medium">
                            <MessageCircle className="w-3.5 h-3.5 text-emerald-500" />
                            {ad.whatsappClicksCount || 0} contatos
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Action Buttons (Marcar como vendido & Excluir) */}
                    <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-100 justify-end">
                      {/* Botão Marcar como Vendido (apaga automaticamente) */}
                      <button
                        type="button"
                        onClick={() => setAdToMarkAsSold(ad)}
                        className="flex-1 sm:flex-none bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold py-2 px-3.5 rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer active:scale-95 shadow-2xs"
                        title="Marcar como vendido (o anúncio será apagado automaticamente)"
                      >
                        <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        <span>Marcar como vendido</span>
                      </button>

                      {/* Botão Excluir Anúncio */}
                      <button
                        type="button"
                        onClick={() => setAdToDelete(ad)}
                        className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs font-bold py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer active:scale-95 shadow-2xs"
                        title="Excluir este anúncio"
                      >
                        <Trash2 className="w-4 h-4 text-red-600 flex-shrink-0" />
                        <span className="hidden sm:inline">Excluir</span>
                      </button>

                      {/* Botão Ver Anúncio */}
                      <button
                        type="button"
                        onClick={() => openAdDetail(ad)}
                        className="p-2 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 transition-colors cursor-pointer"
                        title="Ver detalhes do anúncio"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: DADOS DO PERFIL (EDIÇÃO DE CONTA E FOTO)         */}
      {/* ======================================================== */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm">
          <div className="pb-4 mb-6 border-b border-gray-100">
            <h2 className="text-xl font-black text-gray-900 tracking-tight">
              Editar Dados Pessoais
            </h2>
            <p className="text-xs text-gray-500">
              Mantenha seu nome, foto e contato do WhatsApp atualizados para facilitar as negociações.
            </p>
          </div>

          <form onSubmit={handleSubmitProfile} className="space-y-4">
            {/* Foto de Perfil com upload direto e URL */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-2xl bg-orange-50/60 border border-orange-200/70 mb-4">
              <div className="relative group self-center sm:self-auto">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt=""
                    className="w-20 h-20 rounded-full object-cover border-3 border-[#F95700] shadow-sm"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-orange-100 text-[#F95700] flex items-center justify-center font-bold text-2xl border-2 border-orange-300">
                    {name.charAt(0) || 'U'}
                  </div>
                )}
                <label
                  htmlFor="user-profile-file-upload"
                  className="absolute bottom-0 right-0 bg-[#F95700] hover:bg-[#E04E00] text-white p-1.5 rounded-full shadow-md cursor-pointer border-2 border-white transition-all active:scale-95"
                  title="Tirar foto ou escolher do celular"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <input
                    id="user-profile-file-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoFileUpload}
                  />
                </label>
              </div>

              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-gray-800 block">
                    Foto de Perfil
                  </label>
                  <span className="text-[10px] text-gray-500 font-medium">JPG, PNG ou WEBP</span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <label
                    htmlFor="user-profile-file-btn"
                    className="bg-white border border-gray-300 hover:border-[#F95700] hover:bg-orange-50/40 text-xs font-bold text-gray-700 px-3 py-1.5 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-2xs transition-all"
                  >
                    <Upload className="w-3.5 h-3.5 text-[#F95700]" />
                    <span>Escolher foto do celular / PC</span>
                    <input
                      id="user-profile-file-btn"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handlePhotoFileUpload}
                    />
                  </label>
                </div>

                <input
                  type="url"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="Ou digite o link de uma imagem (URL)..."
                  className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-700"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Nome Completo
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:border-[#F95700]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Bairro em Patrocínio
                </label>
                <select
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:border-[#F95700]"
                >
                  {neighborhoods
                    .filter((n) => n.active)
                    .map((b) => (
                      <option key={b.id} value={b.name}>
                        {b.name} ({b.type})
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-gray-700 block">
                    WhatsApp de Negociação
                  </label>
                  {!currentUser.isWhatsAppVerified ? (
                    <button
                      type="button"
                      onClick={verifyCurrentUserWhatsApp}
                      className="text-[11px] font-bold text-[#F95700] hover:underline flex items-center gap-1"
                    >
                      <Smartphone className="w-3 h-3" />
                      Validar WhatsApp
                    </button>
                  ) : (
                    <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-0.5">
                      <CheckCircle2 className="w-3 h-3" /> Verificado
                    </span>
                  )}
                </div>
                <input
                  type="tel"
                  required
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="34 99999-0000"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold focus:bg-white focus:outline-none focus:border-[#F95700]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  E-mail (Privado - Login e Notificações)
                </label>
                <input
                  type="email"
                  disabled
                  value={currentUser.email}
                  className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-xl text-xs text-gray-500 cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">
                Bio / Apresentação do Vendedor
              </label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Conte um pouco sobre suas vendas, horários para atendimento em Patrocínio..."
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-[#F95700]"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="bg-[#F95700] hover:bg-[#E04E00] text-white font-bold px-6 py-2.5 rounded-xl text-xs shadow-md cursor-pointer transition-all active:scale-95"
              >
                Salvar Alterações do Perfil
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: SEGURANÇA & PRIVACIDADE (LGPD)                    */}
      {/* ======================================================== */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900">
                  Segurança e Privacidade (LGPD)
                </h2>
                <p className="text-xs text-gray-500">
                  Controle de dados pessoais conforme a Lei 13.709/2018
                </p>
              </div>
            </div>

            {/* Audit Trail Info */}
            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200 text-xs text-gray-700 space-y-2">
              <div className="font-bold text-gray-900 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[#F95700]" />
                Registro de Aceite dos Termos e Consentimentos:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-gray-600 pt-1">
                <div>
                  <span className="font-semibold text-gray-800">Versão dos Termos:</span>{' '}
                  {currentUser.termsAcceptance?.termsVersion || '2.1'}
                </div>
                <div>
                  <span className="font-semibold text-gray-800">Versão da Privacidade:</span>{' '}
                  {currentUser.termsAcceptance?.privacyVersion || '2.1'}
                </div>
                <div>
                  <span className="font-semibold text-gray-800">Data do Aceite:</span>{' '}
                  {currentUser.termsAcceptance?.acceptedAt || currentUser.joinedDate}
                </div>
                <div>
                  <span className="font-semibold text-gray-800">Declaração 18+:</span>{' '}
                  <span className="text-emerald-700 font-bold">Confirmada</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => openTermsModal('privacy')}
                  className="text-[11px] text-[#F95700] font-bold hover:underline cursor-pointer"
                >
                  Consultar Política de Privacidade completa &rarr;
                </button>
              </div>
            </div>

            {/* Account Deletion Request Channel */}
            <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-t border-gray-100">
              <div>
                <span className="text-xs font-bold text-gray-900 block">Exclusão de Conta e Dados Pessoais</span>
                <span className="text-[11px] text-gray-500">
                  Solicite a remoção definitiva da sua conta, anúncios e registros conforme a LGPD.
                </span>
              </div>

              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(true)}
                className="px-4 py-2 rounded-xl border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Solicitar Exclusão da Conta
              </button>
            </div>
          </div>

          {/* Sessão da Conta & Opção Sair */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center flex-shrink-0 border border-red-100">
                  <LogOut className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-gray-900">
                    Sessão e Conexão da Conta
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                    Você está conectado como <strong className="text-gray-800">{currentUser.name}</strong> (<span className="font-mono text-[#F95700] font-semibold">{currentUser.username}</span>).
                  </p>
                </div>
              </div>

              <button
                id="btn-profile-logout-footer"
                type="button"
                onClick={logout}
                className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow-sm hover:shadow-md cursor-pointer flex items-center justify-center gap-2 self-start sm:self-auto active:scale-95"
              >
                <LogOut className="w-4 h-4" />
                <span>Sair da minha Conta</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* CONFIRMATION MODAL: MARCAR COMO VENDIDO (APAGA AUTOMÁTICO) */}
      {/* ======================================================== */}
      {adToMarkAsSold && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-gray-100 animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-gray-900 text-center mb-2">
              Marcar anúncio como vendido?
            </h3>

            <p className="text-xs text-gray-600 text-center mb-6 leading-relaxed">
              Ao confirmar a venda, o anúncio de <span className="font-bold text-gray-900">"{adToMarkAsSold.title}"</span> será <span className="font-bold text-emerald-700">apagado automaticamente</span> da plataforma e das buscas do Vendi Patrocínio. Sua contagem de vendas será atualizada no seu perfil.
            </p>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setAdToMarkAsSold(null)}
                className="py-2.5 px-4 rounded-xl border border-gray-300 font-bold text-gray-700 hover:bg-gray-50 text-xs cursor-pointer"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={confirmMarkAsSold}
                className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 cursor-pointer active:scale-95"
              >
                Sim, marcar e apagar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* CONFIRMATION MODAL: EXCLUIR ANÚNCIO                     */}
      {/* ======================================================== */}
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
              Você tem certeza que deseja excluir <span className="font-bold text-gray-900">"{adToDelete.title}"</span>? Esta ação não pode ser desfeita e o anúncio será removido permanentemente.
            </p>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setAdToDelete(null)}
                className="py-2.5 px-4 rounded-xl border border-gray-300 font-bold text-gray-700 hover:bg-gray-50 text-xs cursor-pointer"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={confirmDelete}
                className="py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-600/20 cursor-pointer active:scale-95"
              >
                Sim, excluir anúncio
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: EXCLUSÃO DE CONTA LGPD                            */}
      {/* ======================================================== */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-red-200">
            <div className="bg-red-50 p-6 border-b border-red-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center font-bold flex-shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-gray-900 text-base">
                  Solicitar Exclusão da Conta (LGPD)
                </h3>
                <p className="text-xs text-red-800">
                  Esta ação é irreversível
                </p>
              </div>
            </div>

            <form onSubmit={handleRequestDeletion} className="p-6 space-y-4 text-xs text-gray-700">
              <p>
                Ao confirmar este pedido, todos os seus anúncios publicados, histórico de vendas e dados cadastrais associados ao usuário <strong>{currentUser.username}</strong> serão excluídos permanentemente.
              </p>

              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1">
                  Motivo da solicitação (opcional)
                </label>
                <textarea
                  rows={2}
                  value={deleteReason}
                  onChange={(e) => setDeleteReason(e.target.value)}
                  placeholder="Conte-nos por que deseja excluir sua conta..."
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                />
              </div>

              <label className="flex items-start gap-2.5 p-3 rounded-xl bg-gray-50 border border-gray-200 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={confirmedLgpd}
                  onChange={(e) => setConfirmedLgpd(e.target.checked)}
                  className="mt-0.5 w-4 h-4 text-red-600 rounded focus:ring-red-500 border-gray-300 cursor-pointer"
                />
                <span className="text-[11px] text-gray-800 leading-tight">
                  Estou ciente de que a exclusão da conta removerá todos os meus anúncios e dados associados no Vendi Patrocínio.
                </span>
              </label>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-4 py-2 border rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={!confirmedLgpd}
                  className={`px-4 py-2 rounded-xl text-xs font-bold text-white shadow-md transition-colors cursor-pointer ${
                    confirmedLgpd ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-300 cursor-not-allowed'
                  }`}
                >
                  Confirmar Exclusão
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
