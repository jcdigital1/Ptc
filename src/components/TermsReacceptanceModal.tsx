import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, FileText, CheckCircle2, Lock } from 'lucide-react';

export const TermsReacceptanceModal: React.FC = () => {
  const {
    isTermsReacceptanceModalOpen,
    reacceptTerms,
    currentUser,
    openTermsModal
  } = useApp();

  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [ageAccepted, setAgeAccepted] = useState(false);

  if (!isTermsReacceptanceModalOpen || !currentUser) return null;

  const canProceed = termsAccepted && privacyAccepted && ageAccepted;

  const handleConfirm = () => {
    if (!canProceed) return;
    reacceptTerms();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-orange-200 flex flex-col">
        {/* Header */}
        <div className="bg-orange-50 p-6 border-b border-orange-100 flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#F95700] text-white flex items-center justify-center flex-shrink-0 font-bold shadow-xs">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-[#F95700] bg-orange-100 px-2 py-0.5 rounded-full">
              Atualização Obrigatória • Versão 2.1
            </span>
            <h3 className="font-extrabold text-gray-900 text-lg leading-tight mt-0.5">
              Atualizamos nossos Termos e Políticas
            </h3>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-xs text-gray-700 leading-relaxed">
          <p>
            Olá, <strong>{currentUser.name}</strong> ({currentUser.username})! Para garantir conformidade com a LGPD e aumentar a segurança das negociações em Patrocínio - MG, atualizamos nossos <strong>Termos de Uso</strong> e <strong>Política de Privacidade</strong>.
          </p>

          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-3.5 space-y-2 text-[11px] text-gray-600">
            <div className="font-bold text-gray-800 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-[#F95700]" />
              Principais atualizações:
            </div>
            <ul className="list-disc pl-4 space-y-1">
              <li>Reforço da não responsabilidade direta do Vendi Patrocínio nas negociações entre compradores e vendedores;</li>
              <li>Novas regras de proteção de dados (LGPD) e canal de exclusão de conta;</li>
              <li>Exigência explícita de maioridade (18+) para todos os anunciantes;</li>
              <li>Selo de verificação de WhatsApp e combate a anúncios duplicados e fraudes.</li>
            </ul>
          </div>

          <div className="space-y-2 pt-2">
            <label className="flex items-start gap-2.5 p-2 rounded-xl hover:bg-orange-50/50 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="mt-0.5 w-4 h-4 text-[#F95700] rounded focus:ring-[#F95700] border-gray-300 cursor-pointer"
              />
              <span className="text-xs text-gray-800">
                Li e aceito os{' '}
                <button
                  type="button"
                  onClick={() => openTermsModal('terms')}
                  className="text-[#F95700] font-bold underline hover:text-[#E04E00]"
                >
                  Termos de Uso
                </button>{' '}
                atualizados (v2.1).
              </span>
            </label>

            <label className="flex items-start gap-2.5 p-2 rounded-xl hover:bg-orange-50/50 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={privacyAccepted}
                onChange={(e) => setPrivacyAccepted(e.target.checked)}
                className="mt-0.5 w-4 h-4 text-[#F95700] rounded focus:ring-[#F95700] border-gray-300 cursor-pointer"
              />
              <span className="text-xs text-gray-800">
                Li e aceito a{' '}
                <button
                  type="button"
                  onClick={() => openTermsModal('privacy')}
                  className="text-[#F95700] font-bold underline hover:text-[#E04E00]"
                >
                  Política de Privacidade
                </button>{' '}
                (LGPD v2.1).
              </span>
            </label>

            <label className="flex items-start gap-2.5 p-2 rounded-xl hover:bg-orange-50/50 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={ageAccepted}
                onChange={(e) => setAgeAccepted(e.target.checked)}
                className="mt-0.5 w-4 h-4 text-[#F95700] rounded focus:ring-[#F95700] border-gray-300 cursor-pointer"
              />
              <span className="text-xs text-gray-800">
                Declaro que tenho 18 anos ou mais e que os dados da minha conta permanecem verdadeiros.
              </span>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 bg-gray-50 border-t border-gray-100 flex justify-end">
          <button
            type="button"
            disabled={!canProceed}
            onClick={handleConfirm}
            className={`w-full py-3 px-4 rounded-xl text-xs font-black shadow-md flex items-center justify-center gap-2 transition-all ${
              canProceed
                ? 'bg-[#F95700] hover:bg-[#E04E00] text-white active:scale-98 cursor-pointer'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Confirmar Aceite e Continuar no Vendi Patrocínio</span>
          </button>
        </div>
      </div>
    </div>
  );
};
