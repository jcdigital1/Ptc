import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  User,
  MapPin,
  Phone,
  Mail,
  CheckCircle2,
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
  Upload
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
    showToast
  } = useApp();

  const [name, setName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [whatsapp, setWhatsapp] = useState(currentUser?.whatsapp || '');
  const [neighborhood, setNeighborhood] = useState(currentUser?.neighborhood || 'Centro');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [avatarUrl, setAvatarUrl] = useState(currentUser?.avatarUrl || '');

  // LGPD account deletion modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteReason, setDeleteReason] = useState('');
  const [confirmedLgpd, setConfirmedLgpd] = useState(false);

  if (!currentUser) return null;

  const handlePhotoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast('A imagem deve ter no máximo 5MB.', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setAvatarUrl(result);
        showToast('Foto selecionada! Clique em "Salvar Perfil" para confirmar.', 'info');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
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

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => setActiveView('home')}
          className="text-xs font-semibold text-gray-500 hover:text-[#F95700] flex items-center gap-1 cursor-pointer"
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

          {/* Opção Sair no Perfil */}
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

      {/* Main Profile Edit Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-gray-100 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-gray-900 tracking-tight">
                Meu Perfil
              </h1>
              {currentUser.isWhatsAppVerified && (
                <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  WhatsApp Verificado
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500">
              Nome de usuário exclusivo: <span className="font-mono font-bold text-[#F95700]">{currentUser.username}</span>
            </p>
          </div>

          <button
            onClick={() => setActiveView('seller_dashboard')}
            className="bg-orange-50 hover:bg-orange-100 text-[#F95700] font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 transition-colors self-start sm:self-auto cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            Meus Anúncios ({currentUser.activeAdsCount})
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
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
                <span className="text-[10px] text-gray-500 font-medium">JPG, PNG ou WEBP (até 5MB)</span>
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
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">
                Bairro em Patrocínio
              </label>
              <select
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium"
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
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold"
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
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="bg-[#F95700] hover:bg-[#E04E00] text-white font-bold px-6 py-2.5 rounded-xl text-xs shadow-md cursor-pointer"
            >
              Salvar Perfil
            </button>
          </div>
        </form>
      </div>

      {/* LGPD, Security & Account Governance Section */}
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
              className="text-[11px] text-[#F95700] font-bold hover:underline"
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
                Você está conectado como <strong className="text-gray-800">{currentUser.name}</strong> (<span className="font-mono text-[#F95700] font-semibold">{currentUser.username}</span>). Deseja desconectar deste dispositivo?
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

      {/* Account Deletion Modal */}
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
