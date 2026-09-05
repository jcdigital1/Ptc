import React from 'react';
import { useApp } from '../context/AppContext';
import { X, ShieldCheck, AlertOctagon, MapPin, CheckCircle, Ban } from 'lucide-react';

export const SafetyGuideModal: React.FC = () => {
  const { isSafetyModalOpen, setIsSafetyModalOpen } = useApp();

  if (!isSafetyModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-xl w-full overflow-hidden border border-gray-100 animate-in zoom-in-95 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-emerald-50 p-6 pb-4 border-b border-emerald-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-gray-900 text-lg">Guia de Negociação Segura</h3>
              <p className="text-xs text-emerald-800">Dicas para comprar e vender com tranquilidade em Patrocínio</p>
            </div>
          </div>
          <button
            onClick={() => setIsSafetyModalOpen(false)}
            className="p-1.5 rounded-full bg-white text-gray-400 hover:text-gray-700 shadow-xs"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-6 space-y-4 text-xs text-gray-700">
          <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 flex items-start gap-3">
            <AlertOctagon className="w-5 h-5 text-[#F95700] flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-orange-950 text-sm mb-1">
                Nunca faça depósitos ou PIX adiantados!
              </h4>
              <p className="leading-relaxed text-orange-900">
                Desconfie de vendedores que pedem "sinal" ou taxa de reserva para segurar o produto. No Vendi Patrocínio, todo pagamento deve ser feito pessoalmente, após conferir o produto.
              </p>
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 flex items-start gap-3">
            <MapPin className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-gray-900 text-sm mb-1">
                Marque encontros em locais movimentados
              </h4>
              <p className="leading-relaxed text-gray-600">
                Prefira marcar a entrega em pontos conhecidos e movimentados da cidade, como a Praça Santa Luzia, Praça Honorato Borges, estacionamentos de supermercados (Bernardão, Bahamas, etc.) ou agências bancárias.
              </p>
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-gray-900 text-sm mb-1">
                Teste o produto antes de pagar
              </h4>
              <p className="leading-relaxed text-gray-600">
                Ligue eletrônicos, confira o estado físico de móveis e roupas, e faça o test-drive de veículos na presença do vendedor e em local seguro.
              </p>
            </div>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3">
            <Ban className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-red-950 text-sm mb-1">
                Itens Proibidos na Plataforma
              </h4>
              <p className="leading-relaxed text-red-900">
                É expressamente proibida a publicação de armas, munições, réplicas, remédios controlados, drogas, animais silvestres, produtos sem procedência lícita ou pirataria.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end">
          <button
            onClick={() => setIsSafetyModalOpen(false)}
            className="bg-[#F95700] hover:bg-[#E04E00] text-white font-bold px-6 py-2 rounded-xl text-xs shadow-md"
          >
            Entendido, obrigado!
          </button>
        </div>
      </div>
    </div>
  );
};
