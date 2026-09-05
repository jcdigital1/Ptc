import React from 'react';
import { useApp } from '../context/AppContext';
import { AlertOctagon, MessageCircle, ExternalLink, X, ShieldAlert } from 'lucide-react';

export const WhatsAppRedirectModal: React.FC = () => {
  const {
    isWhatsAppRedirectModalOpen,
    whatsAppRedirectAd,
    closeWhatsAppRedirect,
    confirmWhatsAppRedirect
  } = useApp();

  if (!isWhatsAppRedirectModalOpen || !whatsAppRedirectAd) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-100 flex flex-col animate-in zoom-in-95">
        {/* Header */}
        <div className="bg-emerald-50 p-5 border-b border-emerald-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-[#25D366] flex items-center justify-center flex-shrink-0 shadow-xs">
              <MessageCircle className="w-6 h-6 fill-current" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                Negociação Externa
              </span>
              <h3 className="font-extrabold text-gray-900 text-base leading-tight mt-0.5">
                Aviso de Segurança WhatsApp
              </h3>
            </div>
          </div>
          <button
            onClick={closeWhatsAppRedirect}
            className="p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-white/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-xs sm:text-sm text-gray-700">
          <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 flex items-start gap-3">
            <AlertOctagon className="w-5 h-5 text-[#F95700] flex-shrink-0 mt-0.5" />
            <p className="text-xs font-semibold text-orange-950 leading-relaxed">
              Você está saindo do Vendi Patrocínio para conversar diretamente com o vendedor. <strong>Não envie dinheiro ou PIX antecipadamente sem verificar a oferta pessoalmente.</strong>
            </p>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-3.5 space-y-1.5 text-xs text-gray-600">
            <div className="font-bold text-gray-900">Resumo da negociação:</div>
            <div>Item: <span className="font-semibold text-gray-800">{whatsAppRedirectAd.title}</span></div>
            <div>Vendedor: <span className="font-semibold text-gray-800">{whatsAppRedirectAd.sellerName}</span> ({whatsAppRedirectAd.sellerUsername || '@vendedor'})</div>
            <div>Bairro: <span className="font-semibold text-gray-800">{whatsAppRedirectAd.neighborhood}</span>, Patrocínio - MG</div>
          </div>

          <p className="text-[11px] text-gray-500 text-center">
            O Vendi Patrocínio não recebe valores nem intermedeia o pagamento no WhatsApp. A negociação é feita exclusivamente entre vocês.
          </p>
        </div>

        {/* Buttons */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={closeWhatsAppRedirect}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={confirmWhatsAppRedirect}
            className="w-full sm:w-auto px-5 py-2.5 bg-[#25D366] hover:bg-[#1EBE5D] text-white rounded-xl text-xs font-black shadow-md flex items-center justify-center gap-2 active:scale-98 transition-all cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            <span>Continuar para o WhatsApp</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-80" />
          </button>
        </div>
      </div>
    </div>
  );
};
