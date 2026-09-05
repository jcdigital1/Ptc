import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, MessageCircle, MapPin, Sparkles, UserPlus, LogIn, FileText, Lock, CheckCircle2 } from 'lucide-react';

interface WelcomeAuthScreenProps {
  onOpenRegister: () => void;
  onOpenLogin: () => void;
}

export const WelcomeAuthScreen: React.FC<WelcomeAuthScreenProps> = ({
  onOpenRegister,
  onOpenLogin
}) => {
  const { openTermsModal } = useApp();

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50/70 via-white to-[#F8F9FA] flex flex-col justify-between p-4 sm:p-8">
      {/* Top micro bar */}
      <div className="w-full max-w-lg mx-auto flex items-center justify-between pt-2">
        <div className="inline-flex items-center gap-1.5 bg-orange-100/90 text-orange-900 text-xs font-bold px-3 py-1 rounded-full border border-orange-200 shadow-2xs">
          <MapPin className="w-3.5 h-3.5 text-[#F95700]" />
          <span>Exclusivo Patrocínio - MG</span>
        </div>
        <button
          type="button"
          onClick={() => openTermsModal('safety_tips')}
          className="text-xs font-bold text-gray-500 hover:text-[#F95700] flex items-center gap-1 cursor-pointer transition-colors"
        >
          <ShieldCheck className="w-4 h-4 text-[#F95700]" />
          <span>Segurança</span>
        </button>
      </div>

      {/* Center Main Card */}
      <div className="w-full max-w-md mx-auto my-auto py-8">
        <div className="bg-white rounded-3xl shadow-xl shadow-orange-500/5 border border-orange-100 p-6 sm:p-8 text-center animate-in fade-in zoom-in-95 duration-200">
          {/* Logo & Symbol */}
          <div className="flex flex-col items-center mb-6">
            <div className="relative mb-3">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#F95700] to-[#E04E00] flex items-center justify-center text-white shadow-lg shadow-orange-500/25">
                <div className="relative">
                  <span className="font-black text-3xl tracking-tighter select-none">VP</span>
                  <div className="absolute -bottom-1 -right-2 w-4 h-4 bg-emerald-400 rounded-full border-2 border-white flex items-center justify-center">
                    <CheckCircle2 className="w-2.5 h-2.5 text-white stroke-[3]" />
                  </div>
                </div>
              </div>
            </div>

            <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center justify-center gap-1.5">
              <span>Vendi</span>
              <span className="text-[#F95700]">Patrocínio</span>
            </h1>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mt-1">
              Classificados e Negociações Locais
            </p>
          </div>

          {/* Value propositions */}
          <div className="space-y-3 text-left bg-orange-50/60 border border-orange-100/80 rounded-2xl p-4 mb-6 text-xs text-gray-700">
            <div className="flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-full bg-[#F95700] text-white flex items-center justify-center flex-shrink-0 mt-0.5 shadow-2xs">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <span className="font-medium text-gray-800">
                Acesso protegido para ver produtos e serviços em <strong>Patrocínio - MG</strong>.
              </span>
            </div>

            <div className="flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center flex-shrink-0 mt-0.5 shadow-2xs">
                <MessageCircle className="w-3.5 h-3.5 fill-current" />
              </div>
              <span className="font-medium text-gray-800">
                Negociação 100% direta no <strong>WhatsApp</strong> sem intermediários ou taxas.
              </span>
            </div>

            <div className="flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-full bg-orange-500 text-white flex items-center justify-center flex-shrink-0 mt-0.5 shadow-2xs">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
              <span className="font-medium text-gray-800">
                Vendedores verificados por bairro da nossa cidade.
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              id="btn-welcome-register"
              type="button"
              onClick={onOpenRegister}
              className="w-full py-3.5 px-6 rounded-2xl bg-[#F95700] hover:bg-[#E04E00] text-white text-sm font-extrabold shadow-lg shadow-orange-500/20 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Criar minha conta</span>
            </button>

            <button
              id="btn-welcome-login"
              type="button"
              onClick={onOpenLogin}
              className="w-full py-3.5 px-6 rounded-2xl bg-white hover:bg-orange-50 text-gray-800 border-2 border-orange-200 hover:border-[#F95700] text-sm font-bold active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogIn className="w-4 h-4 text-[#F95700]" />
              <span>Já tenho uma conta</span>
            </button>
          </div>
        </div>
      </div>

      {/* Footer with Legal Links */}
      <div className="w-full max-w-md mx-auto text-center space-y-2 pb-4">
        <p className="text-xs text-gray-500">
          Ao entrar no Vendi Patrocínio, você concorda com nossos:
        </p>
        <div className="flex items-center justify-center gap-4 text-xs font-bold">
          <button
            type="button"
            onClick={() => openTermsModal('terms')}
            className="text-gray-700 hover:text-[#F95700] underline flex items-center gap-1 cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-[#F95700]" />
            <span>Termos de Uso</span>
          </button>
          <span className="text-gray-300">•</span>
          <button
            type="button"
            onClick={() => openTermsModal('privacy')}
            className="text-gray-700 hover:text-[#F95700] underline flex items-center gap-1 cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5 text-[#F95700]" />
            <span>Política de Privacidade (LGPD)</span>
          </button>
        </div>
        <p className="text-[11px] text-gray-400 pt-1">
          Patrocínio, Minas Gerais • Compra e Venda Segura
        </p>
      </div>
    </div>
  );
};
