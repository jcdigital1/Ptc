import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { HomePage } from './components/HomePage';
import { CategoriesView } from './components/CategoriesView';
import { FavoritesView } from './components/FavoritesView';
import { SellerDashboard } from './components/SellerDashboard';
import { SellerPublicProfile } from './components/SellerPublicProfile';
import { AdminPanel } from './components/AdminPanel';
import { UserProfile } from './components/UserProfile';
import { MobileBottomNav } from './components/MobileBottomNav';
import { Footer } from './components/Footer';
import { AdDetailModal } from './components/AdDetailModal';
import { PublishAdModal } from './components/PublishAdModal';
import { AuthModal } from './components/AuthModal';
import { ReportModal } from './components/ReportModal';
import { SafetyGuideModal } from './components/SafetyGuideModal';
import { TermsAndPoliciesModal } from './components/TermsAndPoliciesModal';
import { BeforePublishModal } from './components/BeforePublishModal';
import { TermsReacceptanceModal } from './components/TermsReacceptanceModal';
import { WhatsAppRedirectModal } from './components/WhatsAppRedirectModal';
import { WelcomeAuthScreen } from './components/WelcomeAuthScreen';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const AppContent: React.FC = () => {
  const {
    activeView,
    currentUser,
    setIsAuthModalOpen,
    setAuthModalMode,
    toast,
    showToast
  } = useApp();

  // If user is not authenticated, show the Welcome Auth Screen (Gate)
  if (!currentUser) {
    return (
      <div className="min-h-screen flex flex-col bg-white text-gray-900">
        <WelcomeAuthScreen
          onOpenRegister={() => {
            setAuthModalMode('register');
            setIsAuthModalOpen(true);
          }}
          onOpenLogin={() => {
            setAuthModalMode('login');
            setIsAuthModalOpen(true);
          }}
        />

        {/* Auth Modal & Terms Modals are active over the welcome screen */}
        <AuthModal />
        <TermsAndPoliciesModal />

        {/* Global Toast Notification System */}
        {toast && (
          <div className="fixed bottom-6 right-4 z-50 animate-in slide-in-from-bottom-5">
            <div
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl border text-xs font-bold text-white max-w-sm ${
                toast.type === 'error'
                  ? 'bg-red-600 border-red-700'
                  : toast.type === 'info'
                  ? 'bg-blue-600 border-blue-700'
                  : 'bg-gray-900 border-gray-800'
              }`}
            >
              {toast.type === 'error' ? (
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
              ) : toast.type === 'info' ? (
                <Info className="w-4 h-4 flex-shrink-0" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              )}
              <span className="flex-1">{toast.message}</span>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA] text-gray-900 selection:bg-orange-100 selection:text-[#F95700]">
      {/* 1. Cabeçalho fixo com a logomarca “Vendi Patrocínio” */}
      <Header />

      {/* Main Dynamic View Area */}
      <main className="flex-1">
        {activeView === 'home' && <HomePage />}
        {activeView === 'categories' && <CategoriesView />}
        {activeView === 'favorites' && <FavoritesView />}
        {activeView === 'seller_dashboard' && <SellerDashboard />}
        {activeView === 'seller_public_profile' && <SellerPublicProfile />}
        {activeView === 'admin' && <AdminPanel />}
        {activeView === 'profile' && <UserProfile />}
      </main>

      {/* 10. Rodapé com termos de uso, política de privacidade, segurança e contato */}
      <Footer />

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomNav />

      {/* Global Interactive Modals */}
      <AdDetailModal />
      <PublishAdModal />
      <AuthModal />
      <ReportModal />
      <SafetyGuideModal />
      <TermsAndPoliciesModal />
      <BeforePublishModal />
      <TermsReacceptanceModal />
      <WhatsAppRedirectModal />

      {/* Global Toast Notification System */}
      {toast && (
        <div className="fixed bottom-20 md:bottom-8 right-4 z-50 animate-in slide-in-from-bottom-5">
          <div
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl border text-xs font-bold text-white max-w-sm ${
              toast.type === 'error'
                ? 'bg-red-600 border-red-700'
                : toast.type === 'info'
                ? 'bg-blue-600 border-blue-700'
                : 'bg-gray-900 border-gray-800'
            }`}
          >
            {toast.type === 'error' ? (
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
            ) : toast.type === 'info' ? (
              <Info className="w-4 h-4 flex-shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            )}
            <span className="flex-1">{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
