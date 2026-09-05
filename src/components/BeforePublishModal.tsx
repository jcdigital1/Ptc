import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AlertTriangle, ShieldCheck, X, Check } from 'lucide-react';

export const BeforePublishModal: React.FC = () => {
  const {
    isBeforePublishModalOpen,
    closeBeforePublishModal,
    confirmSellerDisclaimer,
    openTermsModal
  } = useApp();

  const [hasUnderstood, setHasUnderstood] = useState(false);

  if (!isBeforePublishModalOpen) return null;

  const handleConfirm = () => {
    if (!hasUnderstood) return;
    confirmSellerDisclaimer();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-gray-100 flex flex-col">
        {/* Header */}
        <div className="bg-amber-50 p-5 sm:p-6 border-b border-amber-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-6 h-6 text-[#F95700]" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded-full">
                Aviso Importante
              </span>
              <h3 className="font-extrabold text-gray-900 text-lg leading-tight mt-0.5">
                Antes de anunciar
              </h3>
            </div>
          </div>
          <button
            onClick={closeBeforePublishModal}
            className="p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-white/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-xs sm:text-sm text-gray-700 leading-relaxed max-h-[70vh] overflow-y-auto">
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 text-xs space-y-3">
            <p className="font-semibold text-gray-900 leading-relaxed">
              O <strong>Vendi Patrocínio</strong> é uma plataforma de classificados que aproxima compradores e vendedores. A plataforma não vende os produtos anunciados, não recebe pagamentos, não realiza entregas e não participa das negociações.
            </p>

            <p className="text-gray-700 leading-relaxed">
              A responsabilidade pelas informações do anúncio, pela procedência do produto, pelo pagamento, pela entrega e pela conclusão da negociação pertence exclusivamente aos usuários envolvidos.
            </p>

            <p className="text-gray-700 leading-relaxed">
              Nunca faça pagamentos antecipados sem verificar o produto e o vendedor. Sempre que possível, negocie em local público e seguro. Desconfie de ofertas com preços muito abaixo do mercado e nunca compartilhe senhas, códigos de confirmação ou dados bancários.
            </p>
          </div>

          <div className="pt-2">
            <label className="flex items-start gap-3 p-3.5 rounded-2xl border-2 border-orange-200 bg-orange-50/50 hover:bg-orange-50 cursor-pointer select-none transition-colors">
              <input
                type="checkbox"
                checked={hasUnderstood}
                onChange={(e) => setHasUnderstood(e.target.checked)}
                className="mt-0.5 w-5 h-5 text-[#F95700] rounded focus:ring-[#F95700] border-gray-300 cursor-pointer"
              />
              <span className="text-xs font-bold text-gray-900 leading-tight">
                Entendi que o Vendi Patrocínio apenas divulga anúncios e não se responsabiliza diretamente pelas negociações realizadas entre os usuários.
              </span>
            </label>
          </div>

          <p className="text-[11px] text-gray-500 text-center">
            Para saber mais, consulte os nossos{' '}
            <button
              type="button"
              onClick={() => openTermsModal('terms')}
              className="text-[#F95700] font-bold underline hover:text-[#E04E00]"
            >
              Termos de Uso
            </button>{' '}
            e{' '}
            <button
              type="button"
              onClick={() => openTermsModal('ad_rules')}
              className="text-[#F95700] font-bold underline hover:text-[#E04E00]"
            >
              Regras de Publicação
            </button>
            .
          </p>
        </div>

        {/* Action Buttons */}
        <div className="p-4 sm:p-5 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={closeBeforePublishModal}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            disabled={!hasUnderstood}
            onClick={handleConfirm}
            className={`w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-2 shadow-md transition-all ${
              hasUnderstood
                ? 'bg-[#F95700] hover:bg-[#E04E00] text-white active:scale-98 cursor-pointer'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <Check className="w-4 h-4" />
            <span>Li, entendi e quero anunciar</span>
          </button>
        </div>
      </div>
    </div>
  );
};
