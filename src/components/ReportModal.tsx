import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Report } from '../types';
import { X, AlertTriangle, ShieldAlert, Send, UserX } from 'lucide-react';

export const ReportModal: React.FC = () => {
  const {
    isReportModalOpen,
    setIsReportModalOpen,
    adToReport,
    userToReport,
    submitReport,
    submitUserReport,
    currentUser,
    setIsAuthModalOpen,
    showToast
  } = useApp();

  const [reason, setReason] = useState<Report['reason']>('golpe');
  const [details, setDetails] = useState('');

  if (!isReportModalOpen || (!adToReport && !userToReport)) return null;

  const isReportingUser = Boolean(userToReport);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) {
      showToast('Por favor, faça login para enviar uma denúncia verificada.', 'info');
      setIsAuthModalOpen(true);
      return;
    }

    if (!details.trim()) {
      showToast('Por favor, descreva o motivo da denúncia.', 'error');
      return;
    }

    if (isReportingUser && userToReport) {
      submitUserReport(userToReport.id, reason, details.trim());
    } else if (adToReport) {
      submitReport(adToReport.id, reason, details.trim());
    }

    setDetails('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-100 animate-in zoom-in-95">
        <div className="bg-red-50 p-6 pb-4 border-b border-red-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
              {isReportingUser ? <UserX className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-base">
                {isReportingUser ? 'Denunciar Perfil' : 'Denunciar Conteúdo'}
              </h3>
              <p className="text-xs text-gray-500">Ajude a manter Patrocínio segura</p>
            </div>
          </div>
          <button
            onClick={() => setIsReportModalOpen(false)}
            className="p-1 rounded-full text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="bg-gray-50 p-3 rounded-xl text-xs text-gray-700">
            {isReportingUser && userToReport ? (
              <>
                <span className="font-bold block text-gray-900 mb-0.5">Perfil denunciado:</span>
                <span className="font-semibold text-gray-900">{userToReport.name}</span>{' '}
                <span className="text-[#F95700] font-mono font-bold">({userToReport.username})</span>
                <p className="text-[11px] text-gray-500 mt-0.5">Localização: {userToReport.neighborhood}, Patrocínio - MG</p>
              </>
            ) : adToReport ? (
              <>
                <span className="font-bold block text-gray-900 mb-0.5">Anúncio denunciado:</span>
                <span className="line-clamp-1 font-semibold">{adToReport.title}</span>
                <span className="text-gray-500 block text-[11px] mt-0.5">Anunciante: {adToReport.sellerName}</span>
              </>
            ) : null}
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">
              Qual o motivo da denúncia?
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value as Report['reason'])}
              className="w-full px-3 py-2.5 bg-gray-50 rounded-xl border border-gray-200 text-xs font-medium text-gray-900 focus:bg-white focus:border-[#F95700]"
            >
              <option value="golpe">Tentativa de golpe ou fraude (PIX/Sinal adiantado)</option>
              <option value="proibido">Produto ou conduta proibida em Patrocínio</option>
              <option value="falso">Perfil ou fotos falsas / clone de terceiro</option>
              <option value="improprio">Comportamento agressivo, ofensivo ou impróprio</option>
              <option value="duplicado">Spam ou anúncios repetidos excessivos</option>
              <option value="outro">Outro motivo</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">
              Detalhes adicionais *
            </label>
            <textarea
              required
              rows={3}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Explique o que aconteceu para que a equipe de moderação de Patrocínio possa auditar..."
              className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-900 focus:bg-white focus:border-[#F95700]"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsReportModalOpen(false)}
              className="px-4 py-2 border rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50 cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              Enviar Denúncia
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
