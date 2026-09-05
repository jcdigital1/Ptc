import React, { useState, useEffect } from 'react';
import { useApp, CURRENT_TERMS_VERSION, CURRENT_PRIVACY_VERSION } from '../context/AppContext';
import {
  X,
  LogIn,
  UserPlus,
  ShieldCheck,
  Phone,
  Lock,
  Mail,
  User as UserIcon,
  MapPin,
  Calendar,
  AtSign,
  CheckCircle2,
  AlertCircle,
  Camera,
  ArrowLeft,
  KeyRound,
  ExternalLink,
  RefreshCw,
  Edit3,
  Search,
  Check,
  ChevronDown,
  Eye,
  EyeOff,
  Sparkles,
  HelpCircle,
  CheckCheck,
  ArrowRight,
  Upload
} from 'lucide-react';
import { formatBrazilianInputPhone, validateBrazilianMobile } from '../utils/whatsapp';
import { formatBrazilianDateInput, calculateAgeFromDate } from '../utils/dateUtils';

const SAMPLE_AVATARS = [
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
];

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authModalMode,
    setAuthModalMode,
    pendingVerificationEmail,
    setPendingVerificationEmail,
    pendingDemoCode,
    login,
    registerUser,
    verifyEmailCode,
    resendVerificationCode,
    correctEmailAddress,
    neighborhoods,
    checkUsernameAvailability,
    checkAge18OrOlder,
    openTermsModal,
    currentUser,
    updateCurrentUser,
    syncWithServer,
    showToast
  } = useApp();

  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [showForgotModal, setShowForgotModal] = useState(false);

  // Post-registration profile photo state
  const [selectedPhoto, setSelectedPhoto] = useState<string>(SAMPLE_AVATARS[0]);
  const [customPhotoUrl, setCustomPhotoUrl] = useState('');
  const [isSavingPhoto, setIsSavingPhoto] = useState(false);

  // Register form state
  const [name, setName] = useState('');
  const [username, setUsername] = useState('@');
  const [usernameStatus, setUsernameStatus] = useState<{ available: boolean; message: string } | null>(null);
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [neighborhood, setNeighborhood] = useState('Centro');
  const [customNeighborhood, setCustomNeighborhood] = useState('');
  const [neighborhoodSearch, setNeighborhoodSearch] = useState('');
  const [isNeighborhoodDropdownOpen, setIsNeighborhoodDropdownOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(SAMPLE_AVATARS[0]);
  const [customAvatarInput, setCustomAvatarInput] = useState('');

  // Mandatory checkboxes
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptPrivacy, setAcceptPrivacy] = useState(false);
  const [declareAge18, setDeclareAge18] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  // Email verification state
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [newEmailInput, setNewEmailInput] = useState('');

  // Load remembered identifier on open
  useEffect(() => {
    try {
      const saved = localStorage.getItem('vp_saved_identifier');
      if (saved && !loginIdentifier) {
        setLoginIdentifier(saved);
      }
    } catch (e) {}
  }, []);

  // Live calculated age info for manual date input
  const birthAgeInfo = birthDate.length === 10 ? calculateAgeFromDate(birthDate) : null;

  // Live username checking
  useEffect(() => {
    if (!username || username === '@') {
      setUsernameStatus(null);
      return;
    }
    const timer = setTimeout(() => {
      const result = checkUsernameAvailability(username);
      setUsernameStatus(result);
    }, 150);
    return () => clearTimeout(timer);
  }, [username, checkUsernameAvailability]);

  // Pre-fill email in verification mode if available
  useEffect(() => {
    if (pendingVerificationEmail && !newEmailInput) {
      setNewEmailInput(pendingVerificationEmail);
    }
  }, [pendingVerificationEmail, newEmailInput]);

  // Sync selected photo when entering set_photo mode
  useEffect(() => {
    if (authModalMode === 'set_photo') {
      if (currentUser?.avatarUrl) {
        setSelectedPhoto(currentUser.avatarUrl);
      } else if (!selectedPhoto) {
        setSelectedPhoto(SAMPLE_AVATARS[0]);
      }
    }
  }, [authModalMode, currentUser, selectedPhoto]);

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.trim().toLowerCase();
    if (!val.startsWith('@')) {
      val = '@' + val.replace(/@/g, '');
    }
    val = '@' + val.slice(1).replace(/[^a-z0-9._]/g, '');
    setUsername(val);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatBrazilianInputPhone(e.target.value);
    setPhone(formatted);
  };

  const handleBirthDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatBrazilianDateInput(e.target.value);
    setBirthDate(formatted);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginIdentifier.trim()) {
      showToast('Informe seu e-mail ou nome de usuário.', 'error');
      return;
    }
    if (!loginPassword) {
      showToast('Digite sua senha cadastrada.', 'error');
      return;
    }

    try {
      if (rememberMe) {
        localStorage.setItem('vp_saved_identifier', loginIdentifier.trim());
      } else {
        localStorage.removeItem('vp_saved_identifier');
      }
    } catch (e) {}

    setIsLoggingIn(true);
    await login(loginIdentifier.trim(), loginPassword);
    setIsLoggingIn(false);
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Strict validation: none can be empty
    if (!name.trim()) {
      showToast('O nome completo é obrigatório.', 'error');
      return;
    }

    const uCheck = checkUsernameAvailability(username);
    if (!uCheck.available) {
      showToast(uCheck.message, 'error');
      return;
    }

    if (!avatarUrl.trim()) {
      showToast('A foto de perfil é obrigatória.', 'error');
      return;
    }

    const emailClean = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailClean || !emailRegex.test(emailClean)) {
      showToast('Informe um endereço de e-mail válido.', 'error');
      return;
    }

    const phoneValidation = validateBrazilianMobile(phone);
    if (!phoneValidation.valid) {
      showToast(phoneValidation.error || 'Número de celular inválido.', 'error');
      return;
    }

    let finalNeighborhood = neighborhood;
    if (neighborhood === 'Outro local de Patrocínio' && customNeighborhood.trim()) {
      finalNeighborhood = `Outro (${customNeighborhood.trim()})`;
    }
    if (!finalNeighborhood.trim()) {
      showToast('Selecione seu bairro em Patrocínio.', 'error');
      return;
    }

    if (regPassword.length < 6) {
      showToast('A senha deve conter no mínimo 6 caracteres.', 'error');
      return;
    }
    if (regPassword !== confirmPassword) {
      showToast('As senhas digitadas não coincidem.', 'error');
      return;
    }

    if (!birthDate || birthDate.trim().length < 10) {
      showToast('Digite sua data de nascimento completa no formato DD/MM/AAAA (ex: 20/05/1995).', 'error');
      return;
    }
    const ageResult = calculateAgeFromDate(birthDate);
    if (!ageResult.isValid) {
      showToast(ageResult.errorMessage || 'Data de nascimento inválida. Verifique o dia e o mês.', 'error');
      return;
    }
    if (!ageResult.is18OrOlder) {
      showToast('Apenas maiores de 18 anos podem se cadastrar no Vendi Patrocínio.', 'error');
      return;
    }

    if (!acceptTerms) {
      showToast('Você deve aceitar os Termos de Uso.', 'error');
      return;
    }
    if (!acceptPrivacy) {
      showToast('Você deve aceitar a Política de Privacidade.', 'error');
      return;
    }
    if (!declareAge18) {
      showToast('Confirme a declaração de maioridade (18 anos ou mais).', 'error');
      return;
    }

    setIsRegistering(true);

    const result = await registerUser({
      name: name.trim(),
      username: username.trim().toLowerCase(),
      avatarUrl: avatarUrl.trim(),
      email: emailClean,
      phone: phoneValidation.cleanDigits,
      neighborhood: finalNeighborhood,
      password: regPassword,
      birthDate,
      termsAccepted: true,
      privacyAccepted: true,
      age18Confirmed: true
    });

    setIsRegistering(false);
  };

  const handleVerifyCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pendingVerificationEmail) {
      showToast('E-mail de confirmação não identificado.', 'error');
      return;
    }
    if (!verificationCode.trim() || verificationCode.trim().length < 6) {
      showToast('Digite o código de 6 dígitos enviado por e-mail.', 'error');
      return;
    }

    setIsVerifying(true);
    await verifyEmailCode(pendingVerificationEmail, verificationCode.trim());
    setIsVerifying(false);
  };

  const handleResendCode = async () => {
    if (!pendingVerificationEmail) return;
    setIsResending(true);
    await resendVerificationCode(pendingVerificationEmail);
    setIsResending(false);
  };

  const handleCorrectEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pendingVerificationEmail) return;
    const cleanNew = newEmailInput.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!cleanNew || !emailRegex.test(cleanNew)) {
      showToast('Informe um e-mail válido.', 'error');
      return;
    }
    const result = await correctEmailAddress(pendingVerificationEmail, cleanNew);
    if (result.success) {
      setIsEditingEmail(false);
      setVerificationCode('');
    }
  };

  const handlePostRegFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast('A imagem deve ter no máximo 5MB.', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setSelectedPhoto(result);
        showToast('Foto carregada com sucesso! Clique em salvar para confirmar.', 'info');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSavePhoto = async () => {
    const photoToSave = selectedPhoto.trim() || currentUser?.avatarUrl || SAMPLE_AVATARS[0];
    setIsSavingPhoto(true);
    try {
      await updateCurrentUser({ avatarUrl: photoToSave });
      await syncWithServer();
      showToast('Foto de perfil salva com sucesso! Bem-vindo ao Vendi Patrocínio! 🎉', 'success');
      setIsAuthModalOpen(false);
    } catch (e) {
      showToast('Erro ao salvar foto de perfil. Tente novamente.', 'error');
    } finally {
      setIsSavingPhoto(false);
    }
  };

  const handleSkipPhoto = () => {
    setIsAuthModalOpen(false);
    showToast('Tudo pronto! Você pode adicionar ou alterar sua foto no seu Perfil a qualquer momento.', 'info');
  };

  // Filter neighborhoods safely by search
  const filteredNeighborhoods = (neighborhoods || [])
    .filter((n) => n && n.active)
    .filter((n) => (n.name || '').toLowerCase().includes((neighborhoodSearch || '').toLowerCase()));

  if (!isAuthModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-orange-100 my-4 max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#F95700] via-[#F95700] to-[#E04E00] px-6 py-4 text-white flex items-center justify-between flex-shrink-0 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center font-black text-base shadow-inner border border-white/25">
              VP
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="font-extrabold text-base sm:text-lg leading-tight">
                  {authModalMode === 'login' && 'Entrar na sua conta'}
                  {authModalMode === 'register' && 'Criar conta no Vendi Patrocínio'}
                  {authModalMode === 'verify_email' && 'Confirmação de E-mail'}
                  {authModalMode === 'set_photo' && 'Foto de Perfil'}
                </h2>
                <span className="hidden sm:inline-block text-[10px] bg-white/25 text-white font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Patrocínio - MG
                </span>
              </div>
              <p className="text-[11px] text-orange-100">
                {authModalMode === 'login' && 'Marketplace 100% gratuito e exclusivo de Patrocínio'}
                {authModalMode === 'register' && 'Preencha seus dados para anunciar e negociar'}
                {authModalMode === 'verify_email' && 'Verificação segura de autenticidade'}
                {authModalMode === 'set_photo' && 'Personalize sua conta para transmitir confiança'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/25 active:scale-95 flex items-center justify-center transition-all cursor-pointer"
            title="Fechar"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Top Tab Switcher (Login vs Cadastro) */}
        {authModalMode !== 'verify_email' && authModalMode !== 'set_photo' && (
          <div className="flex bg-orange-50/70 p-1.5 border-b border-orange-100/80 flex-shrink-0">
            <button
              type="button"
              onClick={() => setAuthModalMode('login')}
              className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                authModalMode === 'login'
                  ? 'bg-white text-[#F95700] shadow-sm border border-orange-200/50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/40'
              }`}
            >
              <LogIn className="w-4 h-4" />
              <span>Já tenho uma conta</span>
            </button>
            <button
              type="button"
              onClick={() => setAuthModalMode('register')}
              className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                authModalMode === 'register'
                  ? 'bg-white text-[#F95700] shadow-sm border border-orange-200/50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/40'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              <span>Criar minha conta</span>
            </button>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 text-gray-800">
          {/* ============================================================ */}
          {/* MODE 1: LOGIN TOP EXPERIENCE                                 */}
          {/* ============================================================ */}
          {authModalMode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {/* Top Greeting Badge & Header */}
              <div className="text-center pb-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100/80 text-orange-950 text-[11px] font-extrabold uppercase tracking-wider mb-2 border border-orange-200/60">
                  <MapPin className="w-3.5 h-3.5 text-[#F95700]" />
                  <span>Acesso Exclusivo para Patrocínio - MG</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                  Bem-vindo de volta! 👋
                </h3>
                <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                  Entre com seu e-mail ou @usuário para publicar anúncios, conversar direto no WhatsApp e favoritar ofertas.
                </p>
              </div>

              {/* Login Identifier Input */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                    E-mail ou Nome de usuário *
                  </label>
                  <span className="text-[10px] text-gray-400 font-semibold lowercase">
                    aceita @usuario ou e-mail
                  </span>
                </div>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                    <UserIcon className="w-4 h-4" />
                  </div>
                  <input
                    id="input-login-identifier"
                    type="text"
                    required
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    placeholder="Ex: @marcelo ou seu@email.com"
                    className="w-full pl-10 pr-10 py-3 rounded-2xl border border-gray-300 focus:border-[#F95700] focus:ring-3 focus:ring-orange-500/20 text-sm outline-hidden transition-all font-medium text-gray-900 bg-white"
                  />
                  {loginIdentifier && (
                    <button
                      type="button"
                      onClick={() => setLoginIdentifier('')}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5 rounded-full hover:bg-gray-100 cursor-pointer"
                      title="Limpar campo"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Login Password Input with Eye / EyeOff */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Sua Senha *
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(true)}
                    className="text-xs text-[#F95700] hover:text-[#E04E00] hover:underline font-bold cursor-pointer transition-colors"
                  >
                    Esqueceu a senha?
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="input-login-password"
                    type={showLoginPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Digite sua senha cadastrada"
                    className="w-full pl-10 pr-11 py-3 rounded-2xl border border-gray-300 focus:border-[#F95700] focus:ring-3 focus:ring-orange-500/20 text-sm outline-hidden transition-all font-medium text-gray-900 bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#F95700] p-1.5 rounded-xl hover:bg-orange-50 transition-colors cursor-pointer"
                    title={showLoginPassword ? 'Ocultar senha' : 'Ver senha digitada'}
                  >
                    {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember me checkbox */}
              <div className="flex items-center justify-between text-xs pt-0.5">
                <label className="flex items-center gap-2 cursor-pointer select-none text-gray-600 hover:text-gray-900">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-[#F95700] focus:ring-orange-500 border-gray-300 cursor-pointer"
                  />
                  <span className="font-medium">Lembrar meu usuário neste aparelho</span>
                </label>
              </div>

              {/* Demo test account helper */}
              <div className="bg-orange-50/70 border border-orange-200/80 rounded-2xl p-3 flex items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2 text-orange-950 min-w-0">
                  <Sparkles className="w-4 h-4 text-[#F95700] flex-shrink-0" />
                  <span className="truncate text-gray-700">Conta oficial de teste/moderação:</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setLoginIdentifier('@admin');
                    setLoginPassword('admin123');
                    showToast('Credenciais preenchidas (@admin). Clique em Entrar!', 'info');
                  }}
                  className="px-2.5 py-1 bg-white hover:bg-orange-100 text-[#F95700] border border-orange-300 rounded-lg text-[11px] font-extrabold flex-shrink-0 transition-colors cursor-pointer shadow-2xs"
                >
                  Preencher @admin
                </button>
              </div>

              {/* Login Button */}
              <button
                id="btn-submit-login"
                type="submit"
                disabled={isLoggingIn}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#F95700] to-[#E04E00] hover:from-[#E04E00] hover:to-[#C83E00] active:scale-98 text-white font-extrabold text-sm sm:text-base shadow-lg shadow-orange-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 mt-3"
              >
                {isLoggingIn ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>Autenticando com segurança...</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-5 h-5" />
                    <span>Entrar na minha conta</span>
                  </>
                )}
              </button>

              {/* Trust Micro-badges */}
              <div className="flex items-center justify-center gap-3 pt-1 text-[11px] text-gray-400 font-medium">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Conexão Criptografada
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <CheckCheck className="w-3.5 h-3.5 text-[#F95700]" />
                  Patrocínio - MG
                </span>
              </div>

              {/* Bottom Switch to Register CTA */}
              <div className="pt-4 border-t border-gray-100 text-center">
                <p className="text-xs text-gray-500 mb-2 font-medium">
                  Ainda não tem conta no Vendi Patrocínio?
                </p>
                <button
                  type="button"
                  onClick={() => setAuthModalMode('register')}
                  className="w-full py-3 px-4 rounded-2xl bg-orange-50 hover:bg-orange-100 text-[#F95700] border border-orange-200 text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Criar minha conta gratuita agora</span>
                </button>
              </div>
            </form>
          )}

          {/* ============================================================ */}
          {/* MODE 2: REGISTER                                             */}
          {/* ============================================================ */}
          {authModalMode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-3 text-xs text-amber-950 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <span>
                  Todos os campos são <strong>obrigatórios</strong>. Seu WhatsApp e Bairro serão vinculados aos seus anúncios de forma 100% automática.
                </span>
              </div>

              {/* 1. Nome Completo */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  1. Nome Completo *
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="reg-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Carlos Eduardo de Oliveira"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#F95700] focus:ring-2 focus:ring-orange-500/20 text-sm outline-hidden"
                  />
                </div>
              </div>

              {/* 2. Nome de Usuário Único (@) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                    2. Nome de Usuário Único *
                  </label>
                  <span className="text-[10px] text-gray-400 font-semibold">Inicia com @</span>
                </div>
                <div className="relative">
                  <AtSign className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="reg-username"
                    type="text"
                    required
                    value={username}
                    onChange={handleUsernameChange}
                    placeholder="@seunome"
                    className={`w-full pl-10 pr-10 py-2.5 rounded-xl border text-sm outline-hidden font-mono font-medium ${
                      usernameStatus === null
                        ? 'border-gray-300'
                        : usernameStatus.available
                        ? 'border-emerald-500 bg-emerald-50/20'
                        : 'border-red-400 bg-red-50/20'
                    }`}
                  />
                  {usernameStatus && (
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
                      {usernameStatus.available ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                  )}
                </div>
                {usernameStatus && (
                  <p
                    className={`text-[11px] mt-1 font-semibold ${
                      usernameStatus.available ? 'text-emerald-700' : 'text-red-600'
                    }`}
                  >
                    {usernameStatus.message}
                  </p>
                )}
              </div>

              {/* 3. Foto de Perfil */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  3. Foto de Perfil *
                </label>
                <div className="flex items-center gap-3">
                  <img
                    src={avatarUrl}
                    alt="Preview de perfil"
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-[#F95700] shadow-sm flex-shrink-0"
                  />
                  <div className="flex-1">
                    <p className="text-[11px] text-gray-500 mb-1.5 font-medium">
                      Escolha uma foto da galeria ou digite uma URL:
                    </p>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {SAMPLE_AVATARS.map((url, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setAvatarUrl(url)}
                          className={`w-7 h-7 rounded-full overflow-hidden border-2 cursor-pointer transition-all ${
                            avatarUrl === url
                              ? 'border-[#F95700] scale-110 shadow-sm'
                              : 'border-transparent opacity-70 hover:opacity-100'
                          }`}
                        >
                          <img src={url} alt={`Avatar ${idx + 1}`} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* 4. E-mail Obrigatório */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  4. E-mail Pessoal *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="reg-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu.email@exemplo.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#F95700] focus:ring-2 focus:ring-orange-500/20 text-sm outline-hidden"
                  />
                </div>
                <p className="text-[10px] text-gray-400 mt-1">
                  Enviaremos um código de verificação para este e-mail para validar o cadastro.
                </p>
              </div>

              {/* 5. Celular e WhatsApp Oficial com DDD */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  5. Celular / WhatsApp Oficial (com DDD) *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#25D366] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="reg-phone"
                    type="tel"
                    required
                    value={phone}
                    onChange={handlePhoneChange}
                    placeholder="(34) 99999-9999"
                    maxLength={15}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#25D366] focus:ring-2 focus:ring-emerald-500/20 text-sm outline-hidden font-medium"
                  />
                </div>
                <p className="text-[10px] text-gray-400 mt-1">
                  Salvo no padrão internacional +55. Utilizado automaticamente como botão de contato em seus anúncios.
                </p>
              </div>

              {/* 6. Bairro de Patrocínio */}
              <div className="relative">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  6. Seu Bairro em Patrocínio - MG *
                </label>
                <div
                  onClick={() => setIsNeighborhoodDropdownOpen(!isNeighborhoodDropdownOpen)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white flex items-center justify-between text-sm cursor-pointer hover:border-[#F95700]"
                >
                  <div className="flex items-center gap-2 truncate">
                    <MapPin className="w-4 h-4 text-[#F95700] flex-shrink-0" />
                    <span className="font-semibold text-gray-800 truncate">{neighborhood}</span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
                </div>

                {isNeighborhoodDropdownOpen && (
                  <div className="absolute left-0 right-0 top-full mt-1 bg-white rounded-2xl shadow-xl border border-gray-200 p-2 z-50 max-h-56 overflow-y-auto">
                    <div className="relative mb-2">
                      <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Pesquisar bairro..."
                        value={neighborhoodSearch}
                        onChange={(e) => setNeighborhoodSearch(e.target.value)}
                        className="w-full pl-8 pr-3 py-1.5 text-xs bg-gray-50 rounded-lg border border-gray-200 outline-hidden focus:border-[#F95700]"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>

                    <div className="space-y-1">
                      {filteredNeighborhoods.map((n) => (
                        <button
                          key={n.id}
                          type="button"
                          onClick={() => {
                            setNeighborhood(n.name);
                            setIsNeighborhoodDropdownOpen(false);
                          }}
                          className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between cursor-pointer transition-colors ${
                            neighborhood === n.name
                              ? 'bg-orange-100 text-[#F95700] font-bold'
                              : 'hover:bg-gray-100 text-gray-700'
                          }`}
                        >
                          <span>{n.name}</span>
                          {neighborhood === n.name && <Check className="w-3.5 h-3.5" />}
                        </button>
                      ))}

                      <div className="pt-1 mt-1 border-t border-gray-100">
                        <button
                          type="button"
                          onClick={() => {
                            setNeighborhood('Outro local de Patrocínio');
                            setIsNeighborhoodDropdownOpen(false);
                          }}
                          className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-bold text-gray-800 hover:bg-orange-50 cursor-pointer"
                        >
                          Outro local de Patrocínio
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {neighborhood === 'Outro local de Patrocínio' && (
                  <div className="mt-2">
                    <input
                      type="text"
                      required
                      placeholder="Especifique o nome do bairro ou condomínio"
                      value={customNeighborhood}
                      onChange={(e) => setCustomNeighborhood(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-orange-200 rounded-xl focus:border-[#F95700] outline-hidden bg-orange-50/40"
                    />
                  </div>
                )}
              </div>

              {/* 7 & 8. Senha e Confirmação de Senha */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    7. Senha *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      id="reg-password"
                      type={showRegPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Mínimo 6 dígitos"
                      className="w-full pl-9 pr-8 py-2.5 rounded-xl border border-gray-300 focus:border-[#F95700] text-sm outline-hidden"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#F95700] p-1 cursor-pointer"
                    >
                      {showRegPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    8. Confirmar Senha *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      id="reg-confirm-password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repita a senha"
                      className="w-full pl-9 pr-8 py-2.5 rounded-xl border border-gray-300 focus:border-[#F95700] text-sm outline-hidden"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#F95700] p-1 cursor-pointer"
                    >
                      {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Data de Nascimento Manual (Sem calendário difícil) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Data de Nascimento (Exige 18+ anos) *
                  </label>
                  <span className="text-[11px] font-semibold text-[#F95700]">
                    Digitação manual rápida
                  </span>
                </div>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="reg-birthdate"
                    type="text"
                    inputMode="numeric"
                    required
                    maxLength={10}
                    value={birthDate}
                    onChange={handleBirthDateChange}
                    placeholder="DD/MM/AAAA (Ex: 25/08/1995)"
                    className={`w-full pl-10 pr-10 py-2.5 rounded-xl border text-sm outline-hidden font-medium transition-all ${
                      birthAgeInfo === null
                        ? 'border-gray-300 focus:border-[#F95700] focus:ring-2 focus:ring-orange-500/20'
                        : birthAgeInfo.isValid && birthAgeInfo.is18OrOlder
                        ? 'border-emerald-500 bg-emerald-50/20 focus:border-emerald-500'
                        : 'border-red-400 bg-red-50/20 focus:border-red-500'
                    }`}
                  />
                  {birthDate && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      {birthAgeInfo?.isValid && birthAgeInfo.is18OrOlder ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : birthAgeInfo && (!birthAgeInfo.isValid || !birthAgeInfo.is18OrOlder) ? (
                        <AlertCircle className="w-4 h-4 text-red-500" />
                      ) : null}
                    </div>
                  )}
                </div>

                {/* Helper / Real-time calculation */}
                {birthDate.length === 0 && (
                  <p className="text-[11px] text-gray-400 mt-1 font-medium">
                    Digite diretamente pelo teclado (ex: digite <strong>15081995</strong> para 15/08/1995).
                  </p>
                )}
                {birthDate.length > 0 && birthDate.length < 10 && (
                  <p className="text-[11px] text-orange-600 mt-1 font-medium">
                    Digite os 8 números da sua data: dia, mês e ano completo.
                  </p>
                )}
                {birthAgeInfo && (
                  <div
                    className={`mt-1.5 px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 ${
                      birthAgeInfo.isValid && birthAgeInfo.is18OrOlder
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-red-50 text-red-800 border border-red-200'
                    }`}
                  >
                    {birthAgeInfo.isValid && birthAgeInfo.is18OrOlder ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                        <span className="font-semibold">
                          {birthAgeInfo.age} anos • Maior de 18 anos confirmado (Liberado para cadastro)
                        </span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-3.5 h-3.5 text-red-600 flex-shrink-0" />
                        <span className="font-semibold">
                          {birthAgeInfo.errorMessage || (birthAgeInfo.isValid && !birthAgeInfo.is18OrOlder ? `${birthAgeInfo.age} anos • Idade mínima de 18 anos exigida.` : 'Data incompleta ou inválida.')}
                        </span>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* 9, 10, 11: Mandatory Checkboxes */}
              <div className="space-y-2.5 pt-2 border-t border-gray-100 text-xs">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    id="cb-terms"
                    type="checkbox"
                    required
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded-sm text-[#F95700] focus:ring-orange-500 border-gray-300 cursor-pointer"
                  />
                  <span className="text-gray-700">
                    Li e concordo com os{' '}
                    <button
                      type="button"
                      onClick={() => openTermsModal('terms')}
                      className="text-[#F95700] font-bold underline cursor-pointer"
                    >
                      Termos de Uso
                    </button>{' '}
                    do Vendi Patrocínio.
                  </span>
                </label>

                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    id="cb-privacy"
                    type="checkbox"
                    required
                    checked={acceptPrivacy}
                    onChange={(e) => setAcceptPrivacy(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded-sm text-[#F95700] focus:ring-orange-500 border-gray-300 cursor-pointer"
                  />
                  <span className="text-gray-700">
                    Li e concordo com a{' '}
                    <button
                      type="button"
                      onClick={() => openTermsModal('privacy')}
                      className="text-[#F95700] font-bold underline cursor-pointer"
                    >
                      Política de Privacidade (LGPD)
                    </button>.
                  </span>
                </label>

                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    id="cb-age18"
                    type="checkbox"
                    required
                    checked={declareAge18}
                    onChange={(e) => setDeclareAge18(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded-sm text-[#F95700] focus:ring-orange-500 border-gray-300 cursor-pointer"
                  />
                  <span className="text-gray-700 font-medium">
                    Declaro, sob as penas da lei, que <strong>possuo 18 anos de idade ou mais</strong> e resido ou atuo em Patrocínio - MG.
                  </span>
                </label>
              </div>

              {/* Submit Registration Button */}
              <button
                id="btn-submit-register"
                type="submit"
                disabled={isRegistering}
                className="w-full py-3.5 px-6 rounded-2xl bg-[#F95700] hover:bg-[#E04E00] active:scale-98 text-white font-extrabold text-sm shadow-lg shadow-orange-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 mt-3"
              >
                {isRegistering ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <UserPlus className="w-4 h-4" />
                )}
                <span>Criar minha conta e verificar e-mail</span>
              </button>

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => setAuthModalMode('login')}
                  className="text-xs text-gray-500 hover:text-[#F95700] font-semibold cursor-pointer"
                >
                  Já tem uma conta cadastrada? Faça login aqui
                </button>
              </div>
            </form>
          )}

          {/* ============================================================ */}
          {/* MODE 3: VERIFY EMAIL CODE                                    */}
          {/* ============================================================ */}
          {authModalMode === 'verify_email' && (
            <div className="space-y-5">
              <div className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-orange-100 text-[#F95700] flex items-center justify-center mx-auto mb-3 shadow-inner">
                  <Mail className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-black text-gray-900">
                  Verifique seu e-mail
                </h3>
                <p className="text-xs text-gray-600 mt-1 max-w-xs mx-auto">
                  Enviamos um código de confirmação de 6 dígitos para:
                </p>
                <div className="mt-1 inline-flex items-center gap-1.5 bg-gray-100 px-3 py-1 rounded-full text-xs font-bold text-gray-800">
                  <span>{pendingVerificationEmail}</span>
                  <button
                    type="button"
                    onClick={() => setIsEditingEmail(true)}
                    className="text-[#F95700] hover:underline flex items-center gap-0.5 cursor-pointer ml-1"
                    title="Corrigir meu e-mail"
                  >
                    <Edit3 className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* DEMO / SIMULATION ASSISTANT BANNER */}
              {pendingDemoCode && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 text-center">
                  <p className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider mb-1">
                    Ambiente de Demonstração & Testes
                  </p>
                  <p className="text-xs text-emerald-950">
                    Seu código de confirmação gerado é:
                  </p>
                  <div className="text-2xl font-black tracking-widest text-emerald-700 my-1 select-all font-mono">
                    {pendingDemoCode}
                  </div>
                  <button
                    type="button"
                    onClick={() => setVerificationCode(pendingDemoCode)}
                    className="text-[11px] text-emerald-800 underline font-bold hover:text-emerald-950 cursor-pointer"
                  >
                    Clique aqui para preencher o código automaticamente
                  </button>
                </div>
              )}

              {/* Form to enter the code */}
              <form onSubmit={handleVerifyCodeSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider text-center mb-2">
                    Digite o código de 6 dígitos
                  </label>
                  <div className="relative max-w-xs mx-auto">
                    <KeyRound className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      id="input-verification-code"
                      type="text"
                      maxLength={6}
                      required
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                      placeholder="Ex: 482915"
                      className="w-full pl-12 pr-4 py-3 text-center tracking-widest font-black text-xl rounded-2xl border-2 border-orange-200 focus:border-[#F95700] focus:ring-4 focus:ring-orange-500/20 outline-hidden font-mono"
                    />
                  </div>
                  <p className="text-[11px] text-gray-400 text-center mt-1.5">
                    O código tem validade de 15 minutos.
                  </p>
                </div>

                <button
                  id="btn-confirm-code"
                  type="submit"
                  disabled={isVerifying || verificationCode.length < 6}
                  className="w-full py-3.5 px-6 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] active:scale-98 text-white font-extrabold text-sm shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isVerifying ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4" />
                  )}
                  <span>Confirmar e Acessar o Vendi Patrocínio</span>
                </button>
              </form>

              {/* Action buttons: Reenviar código e Corrigir e-mail */}
              <div className="pt-2 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <button
                  id="btn-resend-code"
                  type="button"
                  disabled={isResending}
                  onClick={handleResendCode}
                  className="text-gray-700 hover:text-[#F95700] font-bold flex items-center gap-1 cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isResending ? 'animate-spin' : ''}`} />
                  <span>Reenviar código</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsEditingEmail(true)}
                  className="text-[#F95700] hover:underline font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Corrigir meu e-mail</span>
                </button>
              </div>

              {/* Modal/dialog to edit email */}
              {isEditingEmail && (
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 mt-3 animate-in fade-in">
                  <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-2">
                    Corrigir endereço de e-mail
                  </h4>
                  <form onSubmit={handleCorrectEmailSubmit} className="space-y-3">
                    <input
                      type="email"
                      required
                      value={newEmailInput}
                      onChange={(e) => setNewEmailInput(e.target.value)}
                      placeholder="Novo endereço de e-mail"
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:border-[#F95700] outline-hidden bg-white"
                    />
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setIsEditingEmail(false)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-600 hover:bg-gray-200 cursor-pointer"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-[#F95700] hover:bg-[#E04E00] cursor-pointer"
                      >
                        Salvar e enviar novo código
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* ============================================================ */}
          {/* MODE 4: POST-REGISTRATION PROFILE PHOTO STEP                  */}
          {/* ============================================================ */}
          {authModalMode === 'set_photo' && (
            <div className="space-y-5 text-center animate-in fade-in duration-200">
              {/* Celebration Tag */}
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Cadastro confirmado com sucesso! 🎉</span>
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                  Adicione sua Foto de Perfil 📸
                </h3>
                <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto leading-relaxed">
                  Perfis com foto passam mais confiança no WhatsApp e fecham negócios muito mais rápido em Patrocínio.
                </p>
              </div>

              {/* Big Profile Avatar Preview */}
              <div className="flex flex-col items-center justify-center pt-1">
                <div className="relative group">
                  <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-[#F95700] shadow-xl bg-orange-50 flex items-center justify-center transition-transform hover:scale-105">
                    {selectedPhoto ? (
                      <img
                        src={selectedPhoto}
                        alt="Prévia da sua foto"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <UserIcon className="w-14 h-14 text-orange-400" />
                    )}
                  </div>

                  {/* Camera Upload Badge */}
                  <label
                    htmlFor="post-reg-file-camera"
                    className="absolute bottom-0 right-0 bg-[#F95700] hover:bg-[#E04E00] text-white p-2.5 rounded-full shadow-lg cursor-pointer border-2 border-white transition-all active:scale-95"
                    title="Tirar foto ou escolher do celular"
                  >
                    <Camera className="w-4 h-4" />
                    <input
                      id="post-reg-file-camera"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handlePostRegFileUpload}
                    />
                  </label>
                </div>

                <div className="mt-2.5">
                  <p className="text-sm font-black text-gray-800">
                    {currentUser?.name || name || 'Seu Perfil'}
                  </p>
                  <p className="text-xs font-mono font-bold text-[#F95700]">
                    {currentUser?.username || username || '@usuario'}
                  </p>
                </div>
              </div>

              {/* Upload from Mobile / PC Button */}
              <div className="bg-orange-50/70 p-4 rounded-2xl border border-orange-200/70 space-y-2">
                <label
                  htmlFor="post-reg-file-btn"
                  className="w-full py-3 px-4 rounded-xl bg-white border-2 border-dashed border-orange-300 hover:border-[#F95700] hover:bg-orange-50/40 text-gray-800 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all shadow-2xs"
                >
                  <Upload className="w-4 h-4 text-[#F95700]" />
                  <span>Escolher foto do celular ou computador</span>
                  <input
                    id="post-reg-file-btn"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePostRegFileUpload}
                  />
                </label>
                <p className="text-[11px] text-gray-500">
                  Tire uma foto com a câmera ou escolha da sua galeria (JPG, PNG ou WEBP)
                </p>
              </div>

              {/* Preset Avatars Grid */}
              <div className="text-left">
                <p className="text-xs font-bold text-gray-700 mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#F95700]" />
                  <span>Ou selecione um avatar rápido:</span>
                </p>
                <div className="grid grid-cols-5 gap-2">
                  {SAMPLE_AVATARS.map((url, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedPhoto(url)}
                      className={`relative rounded-2xl overflow-hidden aspect-square border-2 cursor-pointer transition-all hover:scale-105 ${
                        selectedPhoto === url
                          ? 'border-[#F95700] ring-3 ring-orange-200 shadow-md scale-105'
                          : 'border-gray-200 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={url} alt={`Opção ${idx + 1}`} className="w-full h-full object-cover" />
                      {selectedPhoto === url && (
                        <div className="absolute inset-0 bg-[#F95700]/25 flex items-center justify-center">
                          <CheckCircle2 className="w-5 h-5 text-white drop-shadow-md" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Optional URL input */}
              <div className="text-left">
                <details className="text-xs text-gray-500 cursor-pointer">
                  <summary className="font-semibold hover:text-[#F95700] transition-colors">
                    Prefere colar um link de imagem da internet?
                  </summary>
                  <div className="mt-2 flex gap-2">
                    <input
                      type="url"
                      value={customPhotoUrl}
                      onChange={(e) => {
                        setCustomPhotoUrl(e.target.value);
                        if (e.target.value.trim().startsWith('http')) {
                          setSelectedPhoto(e.target.value.trim());
                        }
                      }}
                      placeholder="https://exemplo.com/sua-foto.jpg"
                      className="flex-1 px-3 py-2 text-xs rounded-xl border border-gray-200 bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (customPhotoUrl.trim()) {
                          setSelectedPhoto(customPhotoUrl.trim());
                          showToast('Foto do link aplicada!', 'info');
                        }
                      }}
                      className="px-3 py-2 bg-orange-100 hover:bg-orange-200 text-[#F95700] font-bold text-xs rounded-xl cursor-pointer"
                    >
                      Aplicar
                    </button>
                  </div>
                </details>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 space-y-2">
                <button
                  type="button"
                  id="btn-save-post-reg-photo"
                  onClick={handleSavePhoto}
                  disabled={isSavingPhoto}
                  className="w-full py-3.5 px-6 rounded-2xl bg-[#F95700] hover:bg-[#E04E00] active:scale-98 text-white font-extrabold text-sm shadow-lg shadow-orange-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                >
                  {isSavingPhoto ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCheck className="w-4 h-4" />
                  )}
                  <span>Salvar Foto e Começar a Usar o Vendi</span>
                </button>

                <button
                  type="button"
                  onClick={handleSkipPhoto}
                  className="w-full py-2 text-xs font-semibold text-gray-500 hover:text-gray-800 transition-colors cursor-pointer"
                >
                  Pular por enquanto (usar avatar padrão)
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Esqueceu a Senha - Suporte Local Patrocínio Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-2xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-orange-100 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-orange-100 text-[#F95700] flex items-center justify-center">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-gray-900">
                    Recuperação de Acesso
                  </h4>
                  <p className="text-[11px] text-gray-500">Patrocínio - MG</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowForgotModal(false)}
                className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-800 flex items-center justify-center cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed">
              Para sua segurança, caso tenha esquecido sua senha, você pode solicitar a recuperação direta com o suporte oficial de Patrocínio:
            </p>

            <div className="space-y-2 text-xs">
              <a
                href="https://wa.me/5534999990000?text=Ol%C3%A1!%20Esqueci%20minha%20senha%20no%20Vendi%20Patroc%C3%ADnio%20e%20gostaria%20de%20ajuda%20para%20recuperar%20meu%20acesso."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 font-bold transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-[#25D366] text-white flex items-center justify-center">
                    <Phone className="w-3.5 h-3.5" />
                  </div>
                  <span>Suporte no WhatsApp</span>
                </div>
                <ArrowRight className="w-4 h-4 text-emerald-600" />
              </a>

              <div className="p-3 rounded-2xl bg-orange-50/60 border border-orange-100 text-gray-700">
                <p className="font-bold text-gray-900 mb-0.5">E-mail oficial:</p>
                <p className="text-[11px] font-mono text-[#F95700]">suporte@vendipatrocinio.com.br</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowForgotModal(false)}
              className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl text-xs font-bold text-gray-700 transition-colors cursor-pointer"
            >
              Voltar para o Login
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
