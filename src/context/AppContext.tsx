import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  Ad,
  Category,
  Banner,
  User,
  Report,
  PlatformMetrics,
  RemovedAdRecord,
  AccountDeletionRequest,
  TermsAcceptanceRecord,
  NeighborhoodItem
} from '../types';
import {
  INITIAL_ADS,
  CATEGORIES,
  INITIAL_BANNERS,
  INITIAL_USERS,
  INITIAL_REPORTS,
  INITIAL_NEIGHBORHOODS,
  INITIAL_METRICS
} from '../data/initialData';
import { TermsTab } from '../components/TermsAndPoliciesModal';
import { buildWhatsAppLink } from '../utils/whatsapp';
import { calculateAgeFromDate } from '../utils/dateUtils';

export const CURRENT_TERMS_VERSION = 'v2.1';
export const CURRENT_PRIVACY_VERSION = 'v2.1';

export type AuthMode = 'login' | 'register' | 'verify_email' | 'set_photo';

interface AppContextType {
  ads: Ad[];
  categories: Category[];
  banners: Banner[];
  currentUser: User | null;
  users: User[];
  favorites: string[];
  reports: Report[];
  metrics: PlatformMetrics;
  removedAdsHistory: RemovedAdRecord[];
  accountDeletionRequests: AccountDeletionRequest[];
  neighborhoods: NeighborhoodItem[];

  // Search & Filter state
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string | null;
  setSelectedCategory: (categoryId: string | null) => void;
  selectedNeighborhood: string | null;
  setSelectedNeighborhood: (neighborhood: string | null) => void;
  selectedCondition: string | null;
  setSelectedCondition: (condition: string | null) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  sortBy: 'recent' | 'price_asc' | 'price_desc' | 'popular';
  setSortBy: (sort: 'recent' | 'price_asc' | 'price_desc' | 'popular') => void;
  resetFilters: () => void;

  // Modals & Navigation
  activeView: 'home' | 'categories' | 'favorites' | 'profile' | 'seller_dashboard' | 'admin' | 'seller_public_profile';
  setActiveView: (view: 'home' | 'categories' | 'favorites' | 'profile' | 'seller_dashboard' | 'admin' | 'seller_public_profile') => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalMode: AuthMode;
  setAuthModalMode: (mode: AuthMode) => void;
  pendingVerificationEmail: string | null;
  setPendingVerificationEmail: (email: string | null) => void;
  pendingDemoCode: string | null;
  setPendingDemoCode: (code: string | null) => void;

  isPublishModalOpen: boolean;
  setIsPublishModalOpen: (open: boolean) => void;
  isSafetyModalOpen: boolean;
  setIsSafetyModalOpen: (open: boolean) => void;
  isReportModalOpen: boolean;
  setIsReportModalOpen: (open: boolean) => void;
  selectedAd: Ad | null;
  openAdDetail: (ad: Ad) => void;
  closeAdDetail: () => void;
  selectedSeller: User | null;
  openSellerProfile: (sellerId: string) => void;
  adToReport: Ad | null;
  userToReport: User | null;
  openReportModal: (ad: Ad) => void;
  openUserReportModal: (user: User) => void;

  // Institutional Terms & Policies Modal
  isTermsModalOpen: boolean;
  termsModalTab: TermsTab;
  openTermsModal: (tab?: TermsTab) => void;
  closeTermsModal: () => void;
  setTermsModalTab: (tab: TermsTab) => void;

  // "Antes de anunciar" Disclaimer Modal
  isBeforePublishModalOpen: boolean;
  openBeforePublishModal: () => void;
  closeBeforePublishModal: () => void;
  confirmSellerDisclaimer: () => void;

  // WhatsApp Safety Redirect Interstitial
  isWhatsAppRedirectModalOpen: boolean;
  whatsAppRedirectAd: Ad | null;
  openWhatsAppRedirect: (ad: Ad) => void;
  closeWhatsAppRedirect: () => void;
  confirmWhatsAppRedirect: () => void;

  // Terms Re-acceptance Gate
  isTermsReacceptanceModalOpen: boolean;
  reacceptTerms: () => void;

  // Verification & Checks
  checkUsernameAvailability: (username: string, excludeUserId?: string) => { available: boolean; message: string };
  checkAge18OrOlder: (birthDate: string) => boolean;
  verifyCurrentUserWhatsApp: () => void;

  // Actions
  createAd: (adData: Omit<Ad, 'id' | 'createdAt' | 'viewsCount' | 'whatsappClicksCount' | 'status'>) => Promise<Ad | null>;
  updateAd: (id: string, adData: Partial<Ad>) => void;
  markAsSold: (id: string) => Promise<void>;
  deleteAd: (id: string) => Promise<void>;
  renewAd: (id: string) => void;
  toggleFavorite: (adId: string) => boolean;
  recordWhatsAppClick: (adId: string) => void;
  recordAdView: (adId: string) => void;
  submitReport: (adId: string, reason: Report['reason'], details: string) => void;
  submitUserReport: (userId: string, reason: Report['reason'], details: string) => void;

  // Auth & Admin Actions
  login: (emailOrUsername: string, password?: string) => Promise<{ success: boolean; requireVerification?: boolean; email?: string; message?: string }>;
  loginAsUser: (user: User) => void;
  registerUser: (formData: any) => Promise<{ success: boolean; requireVerification?: boolean; email?: string; demoCode?: string; message?: string }>;
  verifyEmailCode: (email: string, code: string) => Promise<{ success: boolean; message: string }>;
  resendVerificationCode: (email: string) => Promise<{ success: boolean; message: string; demoCode?: string }>;
  correctEmailAddress: (oldEmail: string, newEmail: string) => Promise<{ success: boolean; message: string; demoCode?: string }>;
  logout: () => void;
  updateCurrentUser: (userData: Partial<User>) => void;
  blockUser: (userId: string) => void;
  adminSuspendUser: (userId: string, reason: string) => void;
  adminReactivateUser: (userId: string) => void;
  adminRemoveAd: (adId: string, reason: string) => void;
  submitAccountDeletionRequest: (reason: string) => void;
  adminProcessDeletionRequest: (requestId: string) => void;
  updateReportStatus: (reportId: string, status: Report['status']) => void;
  toggleBannerActive: (bannerId: string) => void;
  addBanner: (banner: Omit<Banner, 'id'>) => void;

  // Neighborhood management
  addNeighborhood: (name: string, type?: NeighborhoodItem['type']) => Promise<boolean>;
  toggleNeighborhoodActive: (id: string) => Promise<boolean>;

  // Toast notifications
  toast: { message: string; type: 'success' | 'error' | 'info' } | null;
  toastMessage: { message: string; type: 'success' | 'error' | 'info' } | null;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Primary state
  const [ads, setAds] = useState<Ad[]>(() => {
    const saved = localStorage.getItem('vendi_ads');
    return saved ? JSON.parse(saved) : [];
  });

  const [categories] = useState<Category[]>(CATEGORIES);

  const [banners, setBanners] = useState<Banner[]>(() => {
    const saved = localStorage.getItem('vendi_banners');
    return saved ? JSON.parse(saved) : INITIAL_BANNERS;
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('vendi_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  // Current user: default to NULL if not already authenticated!
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('vendi_user_session');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.id && parsed.isEmailVerified) {
          return parsed;
        }
      } catch (e) {
        console.error('Error loading session:', e);
      }
    }
    return null;
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('vendi_favorites');
    return saved ? JSON.parse(saved) : [];
  });

  const [reports, setReports] = useState<Report[]>(() => {
    const saved = localStorage.getItem('vendi_reports');
    return saved ? JSON.parse(saved) : [];
  });

  const [neighborhoods, setNeighborhoods] = useState<NeighborhoodItem[]>(() => {
    const saved = localStorage.getItem('vendi_neighborhoods');
    return saved ? JSON.parse(saved) : INITIAL_NEIGHBORHOODS;
  });

  const [removedAdsHistory, setRemovedAdsHistory] = useState<RemovedAdRecord[]>(() => {
    const saved = localStorage.getItem('vendi_removed_ads');
    return saved ? JSON.parse(saved) : [];
  });

  const [accountDeletionRequests, setAccountDeletionRequests] = useState<AccountDeletionRequest[]>(() => {
    const saved = localStorage.getItem('vendi_deletion_requests');
    return saved ? JSON.parse(saved) : [];
  });

  const [metrics, setMetrics] = useState<PlatformMetrics>(() => {
    const saved = localStorage.getItem('vendi_metrics');
    return saved ? JSON.parse(saved) : INITIAL_METRICS;
  });

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string | null>(null);
  const [selectedCondition, setSelectedCondition] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [sortBy, setSortBy] = useState<'recent' | 'price_asc' | 'price_desc' | 'popular'>('recent');

  // Navigation & Modals
  const [activeView, setActiveView] = useState<'home' | 'categories' | 'favorites' | 'profile' | 'seller_dashboard' | 'admin' | 'seller_public_profile'>('home');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<AuthMode>('login');
  const [pendingVerificationEmail, setPendingVerificationEmail] = useState<string | null>(null);
  const [pendingDemoCode, setPendingDemoCode] = useState<string | null>(null);

  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [isSafetyModalOpen, setIsSafetyModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedAd, setSelectedAd] = useState<Ad | null>(null);
  const [selectedSeller, setSelectedSeller] = useState<User | null>(null);
  const [adToReport, setAdToReport] = useState<Ad | null>(null);
  const [userToReport, setUserToReport] = useState<User | null>(null);

  // Institutional Terms modal state
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [termsModalTab, setTermsModalTab] = useState<TermsTab>('terms');

  // "Antes de anunciar" Disclaimer modal
  const [isBeforePublishModalOpen, setIsBeforePublishModalOpen] = useState(false);

  // WhatsApp Safety Redirect Interstitial
  const [isWhatsAppRedirectModalOpen, setIsWhatsAppRedirectModalOpen] = useState(false);
  const [whatsAppRedirectAd, setWhatsAppRedirectAd] = useState<Ad | null>(null);

  // Terms Re-acceptance modal
  const [isTermsReacceptanceModalOpen, setIsTermsReacceptanceModalOpen] = useState(false);

  // Toast
  const [toastMessage, setToastMessage] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToastMessage({ message, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  }, []);

  // Fetch initial state from server API
  const syncWithServer = useCallback(async () => {
    try {
      const res = await fetch('/api/state');
      if (res.ok) {
        const data = await res.json();
        if (data.ads) {
          setAds(data.ads);
          try {
            localStorage.setItem('vendi_ads', JSON.stringify(data.ads));
          } catch (err) {}
        }
        if (data.users) {
          setUsers(data.users);
          try {
            localStorage.setItem('vendi_users', JSON.stringify(data.users));
          } catch (err) {}
        }
        if (data.neighborhoods) {
          setNeighborhoods(data.neighborhoods);
          try {
            localStorage.setItem('vendi_neighborhoods', JSON.stringify(data.neighborhoods));
          } catch (err) {}
        }
        if (data.reports) setReports(data.reports);
        if (data.deletionRequests) setAccountDeletionRequests(data.deletionRequests);
        if (data.metrics) setMetrics(data.metrics);
      }
    } catch (e) {
      console.warn('Sync with server failed, using local cache:', e);
    }
  }, []);

  // Sync on mount
  useEffect(() => {
    syncWithServer();
    // Record page visit on server
    fetch('/api/metrics/visit', { method: 'POST' }).catch(() => {});
  }, [syncWithServer]);

  // Connect to Server-Sent Events (SSE) for instant real-time synchronization
  useEffect(() => {
    let es: EventSource | null = null;
    try {
      es = new EventSource('/api/live-stream');

      es.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          if (payload.type === 'AD_CREATED') {
            const newAd = payload.payload as Ad;
            setAds((prev) => [newAd, ...prev.filter((a) => a.id !== newAd.id)]);
          } else if (payload.type === 'AD_UPDATED') {
            const updated = payload.payload as Ad;
            setAds((prev) => {
              if (updated.status !== 'active') {
                return prev.filter((a) => a.id !== updated.id);
              }
              return prev.map((a) => (a.id === updated.id ? updated : a));
            });
          } else if (payload.type === 'AD_DELETED') {
            const { id } = payload.payload;
            setAds((prev) => prev.filter((a) => a.id !== id));
          } else if (payload.type === 'NEIGHBORHOODS_UPDATED') {
            setNeighborhoods(payload.payload);
          } else if (payload.type === 'USER_UPDATED') {
            const updatedUser = payload.payload as User;
            setUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
            if (currentUser && currentUser.id === updatedUser.id) {
              setCurrentUser(updatedUser);
            }
          }
        } catch (err) {
          // ignore ping or malformed json
        }
      };
    } catch (e) {
      console.warn('SSE connection not available:', e);
    }

    return () => {
      if (es) es.close();
    };
  }, [currentUser]);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('vendi_ads', JSON.stringify(ads));
  }, [ads]);

  useEffect(() => {
    localStorage.setItem('vendi_banners', JSON.stringify(banners));
  }, [banners]);

  useEffect(() => {
    localStorage.setItem('vendi_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('vendi_neighborhoods', JSON.stringify(neighborhoods));
  }, [neighborhoods]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('vendi_user_session', JSON.stringify(currentUser));
      if (currentUser.termsAcceptance && currentUser.termsAcceptance.termsVersion !== CURRENT_TERMS_VERSION) {
        setIsTermsReacceptanceModalOpen(true);
      }
    } else {
      localStorage.removeItem('vendi_user_session');
      setIsTermsReacceptanceModalOpen(false);
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('vendi_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('vendi_reports', JSON.stringify(reports));
  }, [reports]);

  useEffect(() => {
    localStorage.setItem('vendi_removed_ads', JSON.stringify(removedAdsHistory));
  }, [removedAdsHistory]);

  useEffect(() => {
    localStorage.setItem('vendi_deletion_requests', JSON.stringify(accountDeletionRequests));
  }, [accountDeletionRequests]);

  useEffect(() => {
    localStorage.setItem('vendi_metrics', JSON.stringify(metrics));
  }, [metrics]);

  // Real-time username availability check
  const checkUsernameAvailability = (username: string, excludeUserId?: string): { available: boolean; message: string } => {
    const clean = username.trim().toLowerCase();
    if (!clean.startsWith('@')) {
      return { available: false, message: 'O nome de usuário deve começar com “@”.' };
    }
    const handle = clean.slice(1);
    if (handle.length < 3) {
      return { available: false, message: 'O nome de usuário deve ter pelo menos 3 caracteres após o @.' };
    }
    if (handle.length > 30) {
      return { available: false, message: 'O nome de usuário pode ter no máximo 30 caracteres.' };
    }
    if (!/^[a-zA-Z0-9._]+$/.test(handle)) {
      return { available: false, message: 'Aceita apenas letras, números, pontos e sublinhados, sem espaços.' };
    }

    const reserved = [
      'admin',
      'administrador',
      'vendipatrocinio',
      'suporte',
      'moderacao',
      'vendi',
      'oficial',
      'patrocinio',
      'sistema',
      'seguranca',
      'contato',
      'root',
      'ouvidoria'
    ];
    if (reserved.includes(handle)) {
      return { available: false, message: 'Este nome de usuário é reservado pela administração da plataforma.' };
    }

    const offensiveTerms = ['golpe', 'fraude', 'fake', 'droga', 'arma', 'crime', 'pirata'];
    if (offensiveTerms.some((term) => handle.includes(term))) {
      return { available: false, message: 'Nome de usuário contém termos não permitidos.' };
    }

    const isTaken = users.some(
      (u) => u.username?.toLowerCase() === clean && u.id !== excludeUserId
    );
    if (isTaken) {
      return { available: false, message: 'Este nome de usuário já está sendo utilizado. Escolha outro.' };
    }

    return { available: true, message: 'Este nome de usuário está disponível.' };
  };

  // Age verification (18+)
  const checkAge18OrOlder = (birthDateStr: string): boolean => {
    if (!birthDateStr) return false;
    const result = calculateAgeFromDate(birthDateStr);
    return result.isValid && result.is18OrOlder;
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory(null);
    setSelectedNeighborhood(null);
    setSelectedCondition(null);
    setPriceRange([0, 100000]);
    setSortBy('recent');
  };

  const openAdDetail = (ad: Ad) => {
    setSelectedAd(ad);
    recordAdView(ad.id);
  };

  const closeAdDetail = () => {
    setSelectedAd(null);
  };

  const openSellerProfile = (sellerId: string) => {
    const seller = users.find((u) => u.id === sellerId) || {
      id: sellerId,
      name: 'Vendedor Patrocínio',
      username: '@vendedor',
      email: '',
      phone: '',
      whatsapp: '(34) 99999-9999',
      neighborhood: 'Patrocínio - MG',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
      joinedDate: 'Hoje',
      activeAdsCount: 1,
      soldAdsCount: 0,
      isBlocked: false,
      isWhatsAppVerified: true,
      isEmailVerified: true,
      role: 'user'
    };
    setSelectedSeller(seller);
    setActiveView('seller_public_profile');
  };

  const openReportModal = (ad: Ad) => {
    setAdToReport(ad);
    setUserToReport(null);
    setIsReportModalOpen(true);
  };

  const openUserReportModal = (user: User) => {
    setUserToReport(user);
    setAdToReport(null);
    setIsReportModalOpen(true);
  };

  const openTermsModal = (tab: TermsTab = 'terms') => {
    setTermsModalTab(tab);
    setIsTermsModalOpen(true);
  };

  const closeTermsModal = () => {
    setIsTermsModalOpen(false);
  };

  const openBeforePublishModal = () => {
    setIsBeforePublishModalOpen(true);
  };

  const closeBeforePublishModal = () => {
    setIsBeforePublishModalOpen(false);
  };

  const confirmSellerDisclaimer = () => {
    if (currentUser) {
      const updated = { ...currentUser, hasAcceptedSellerDisclaimer: true };
      setCurrentUser(updated);
      setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
    }
    setIsBeforePublishModalOpen(false);
    setIsPublishModalOpen(true);
    showToast('Aviso confirmado! Agora você pode criar seu anúncio.', 'info');
  };

  const openWhatsAppRedirect = (ad: Ad) => {
    setWhatsAppRedirectAd(ad);
    setIsWhatsAppRedirectModalOpen(true);
  };

  const closeWhatsAppRedirect = () => {
    setIsWhatsAppRedirectModalOpen(false);
    setWhatsAppRedirectAd(null);
  };

  const confirmWhatsAppRedirect = () => {
    if (!whatsAppRedirectAd) return;
    recordWhatsAppClick(whatsAppRedirectAd.id);
    const link = buildWhatsAppLink(whatsAppRedirectAd.whatsapp, whatsAppRedirectAd.title);
    window.open(link, '_blank');
    closeWhatsAppRedirect();
  };

  const reacceptTerms = () => {
    if (!currentUser) return;
    const now = new Date().toISOString();
    const updatedRecord: TermsAcceptanceRecord = {
      termsVersion: CURRENT_TERMS_VERSION,
      privacyVersion: CURRENT_PRIVACY_VERSION,
      acceptedAt: now,
      ipAddress: '177.136.204.18 (Patrocínio - MG)',
      method: 'web_reacceptance_gate',
      confirmedAge18: true
    };
    const updated = { ...currentUser, termsAcceptance: updatedRecord };
    setCurrentUser(updated);
    setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
    setIsTermsReacceptanceModalOpen(false);
    showToast('Termos atualizados aceitos com sucesso! Obrigado.', 'success');
  };

  const verifyCurrentUserWhatsApp = () => {
    if (!currentUser) return;
    const updated = { ...currentUser, isWhatsAppVerified: true };
    setCurrentUser(updated);
    setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
    showToast('WhatsApp verificado com sucesso! Selo verde ativado.', 'success');
  };

  const toggleFavorite = (adId: string): boolean => {
    if (!currentUser) {
      setAuthModalMode('login');
      setIsAuthModalOpen(true);
      showToast('Crie uma conta ou faça login para favoritar anúncios.', 'info');
      return false;
    }

    const isFav = favorites.includes(adId);
    if (isFav) {
      setFavorites((prev) => prev.filter((id) => id !== adId));
      showToast('Anúncio removido dos favoritos.');
      return false;
    } else {
      setFavorites((prev) => [...prev, adId]);
      showToast('Adicionado aos seus favoritos! ❤️');
      return true;
    }
  };

  const recordWhatsAppClick = (adId: string) => {
    fetch('/api/metrics/whatsapp-click', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ adId })
    }).catch(() => {});

    setAds((prev) =>
      prev.map((ad) => {
        if (ad.id === adId) {
          return { ...ad, whatsappClicksCount: (ad.whatsappClicksCount || 0) + 1 };
        }
        return ad;
      })
    );

    setMetrics((prev) => ({
      ...prev,
      whatsappClicks: prev.whatsappClicks + 1
    }));
  };

  const recordAdView = (adId: string) => {
    setAds((prev) =>
      prev.map((ad) => {
        if (ad.id === adId) {
          return { ...ad, viewsCount: (ad.viewsCount || 0) + 1 };
        }
        return ad;
      })
    );

    setMetrics((prev) => ({
      ...prev,
      totalVisits: prev.totalVisits + 1
    }));
  };

  // Create an ad via server API
  const createAd = async (adData: Omit<Ad, 'id' | 'createdAt' | 'viewsCount' | 'whatsappClicksCount' | 'status'>): Promise<Ad | null> => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      showToast('É necessário estar conectado para anunciar.', 'error');
      return null;
    }

    // 1. Anti-spam: Duplicate detection
    const isDuplicate = ads.some(
      (a) =>
        a.sellerId === currentUser.id &&
        a.status === 'active' &&
        a.title.trim().toLowerCase() === adData.title.trim().toLowerCase()
    );

    if (isDuplicate) {
      showToast('Você já possui um anúncio ativo com este mesmo título. Evite publicações repetidas.', 'error');
      return null;
    }

    try {
      const res = await fetch('/api/ads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...adData,
          userId: currentUser.id,
          whatsapp: currentUser.whatsapp
        })
      });

      if (!res.ok) {
        const errorData = await res.json();
        showToast(errorData.error || 'Erro ao publicar anúncio.', 'error');
        return null;
      }

      const responseData = await res.json();
      const newAd: Ad = responseData.ad;

      setAds((prev) => [newAd, ...prev.filter((a) => a.id !== newAd.id)]);

      if (responseData.seller) {
        setCurrentUser(responseData.seller);
        setUsers((prev) => prev.map((u) => (u.id === responseData.seller.id ? responseData.seller : u)));
      }

      setMetrics((prev) => ({
        ...prev,
        totalAdsCreated: prev.totalAdsCreated + 1
      }));

      showToast('Anúncio publicado com sucesso no Vendi Patrocínio! 🎉');
      return newAd;
    } catch (e) {
      console.error('Failed to create ad on server:', e);
      showToast('Falha na comunicação com o servidor. Tente novamente.', 'error');
      return null;
    }
  };

  const updateAd = (id: string, adData: Partial<Ad>) => {
    setAds((prev) => prev.map((ad) => (ad.id === id ? { ...ad, ...adData } : ad)));
    showToast('Anúncio atualizado com sucesso!');
  };

  const markAsSold = async (id: string) => {
    if (!currentUser) return;
    try {
      await fetch(`/api/ads/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'sold', userId: currentUser.id })
      });
    } catch (e) {
      console.error('Error marking as sold:', e);
    }

    setAds((prev) =>
      prev.map((ad) => {
        if (ad.id === id) {
          return { ...ad, status: 'sold' };
        }
        return ad;
      })
    );

    setCurrentUser((prev) =>
      prev
        ? {
            ...prev,
            activeAdsCount: Math.max(0, prev.activeAdsCount - 1),
            soldAdsCount: prev.soldAdsCount + 1
          }
        : null
    );

    setMetrics((prev) => ({
      ...prev,
      totalSold: prev.totalSold + 1
    }));

    showToast('Parabéns pela venda! O anúncio foi marcado como vendido e o WhatsApp desativado.', 'success');
  };

  const deleteAd = async (id: string) => {
    if (!currentUser) return;
    const target = ads.find((a) => a.id === id);
    if (target) {
      const removalRecord: RemovedAdRecord = {
        id: 'rem-' + Date.now(),
        adId: target.id,
        title: target.title,
        sellerName: target.sellerName,
        sellerUsername: target.sellerUsername,
        price: target.price,
        reason: 'Excluído pelo anunciante',
        removedAt: 'Hoje',
        removedBy: currentUser.name
      };
      setRemovedAdsHistory((prev) => [removalRecord, ...prev]);
    }

    try {
      await fetch(`/api/ads/${id}?userId=${currentUser.id}`, { method: 'DELETE' });
    } catch (e) {
      console.error('Error deleting ad on server:', e);
    }

    setAds((prev) => prev.filter((ad) => ad.id !== id));
    setCurrentUser((prev) => (prev ? { ...prev, activeAdsCount: Math.max(0, prev.activeAdsCount - 1) } : null));
    showToast('Anúncio excluído com sucesso.', 'info');
  };

  const adminRemoveAd = (adId: string, reason: string) => {
    const target = ads.find((a) => a.id === adId);
    if (!target) return;

    const removalRecord: RemovedAdRecord = {
      id: 'rem-' + Date.now(),
      adId: target.id,
      title: target.title,
      sellerName: target.sellerName,
      sellerUsername: target.sellerUsername,
      price: target.price,
      reason: reason || 'Violação das regras de publicação',
      removedAt: 'Agora mesmo',
      removedBy: currentUser?.name || 'Administração'
    };

    setRemovedAdsHistory((prev) => [removalRecord, ...prev]);
    setAds((prev) => prev.filter((a) => a.id !== adId));
    showToast(`Anúncio "${target.title}" foi removido e registrado no histórico de auditoria.`, 'info');
  };

  const renewAd = (id: string) => {
    setAds((prev) =>
      prev.map((ad) => {
        if (ad.id === id) {
          return { ...ad, createdAt: 'Renovado agora' };
        }
        return ad;
      })
    );
    showToast('Anúncio renovado! Ele voltou para o topo dos mais recentes.');
  };

  const submitReport = async (adId: string, reason: Report['reason'], details: string) => {
    const ad = ads.find((a) => a.id === adId);
    const body = {
      type: 'ad',
      adId,
      adTitle: ad ? ad.title : 'Anúncio ' + adId,
      reporterName: currentUser ? currentUser.name : 'Visitante Anônimo',
      reporterContact: currentUser ? currentUser.whatsapp : undefined,
      reason,
      details
    };

    try {
      await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
    } catch (e) {}

    const newReport: Report = {
      id: 'rep-' + Date.now(),
      type: 'ad',
      adId,
      adTitle: ad ? ad.title : 'Anúncio ' + adId,
      reporterName: currentUser ? currentUser.name : 'Visitante Anônimo',
      reporterContact: currentUser ? currentUser.whatsapp : undefined,
      reason,
      details,
      createdAt: 'Agora mesmo',
      status: 'pending'
    };

    setReports((prev) => [newReport, ...prev]);
    setIsReportModalOpen(false);
    showToast('Denúncia enviada para a equipe de moderação. Obrigado por manter Patrocínio segura!', 'info');
  };

  const submitUserReport = async (targetUserId: string, reason: Report['reason'], details: string) => {
    const targetUser = users.find((u) => u.id === targetUserId);
    const body = {
      type: 'user',
      targetUserId,
      targetUserName: targetUser ? targetUser.name : 'Usuário ' + targetUserId,
      targetUsername: targetUser ? targetUser.username : '@usuario',
      reporterName: currentUser ? currentUser.name : 'Visitante Anônimo',
      reporterContact: currentUser ? currentUser.whatsapp : undefined,
      reason,
      details
    };

    try {
      await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
    } catch (e) {}

    const newReport: Report = {
      id: 'rep-' + Date.now(),
      type: 'user',
      targetUserId,
      targetUserName: targetUser ? targetUser.name : 'Usuário ' + targetUserId,
      targetUsername: targetUser ? targetUser.username : '@usuario',
      reporterName: currentUser ? currentUser.name : 'Visitante Anônimo',
      reporterContact: currentUser ? currentUser.whatsapp : undefined,
      reason,
      details,
      createdAt: 'Agora mesmo',
      status: 'pending'
    };

    setReports((prev) => [newReport, ...prev]);
    setIsReportModalOpen(false);
    showToast('Denúncia do perfil enviada com sucesso para os moderadores.', 'info');
  };

  // Login via server API
  const login = async (emailOrUsername: string, password?: string): Promise<{ success: boolean; requireVerification?: boolean; email?: string; message?: string }> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailOrUsername, password: password || '123456' })
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.requireEmailVerification) {
          setPendingVerificationEmail(data.email);
          setPendingDemoCode(data.demoCode || null);
          setAuthModalMode('verify_email');
          showToast(data.error || 'Confirme seu e-mail para acessar a conta.', 'info');
          return { success: false, requireVerification: true, email: data.email, message: data.error };
        }
        showToast(data.error || 'Erro ao realizar login.', 'error');
        return { success: false, message: data.error };
      }

      setCurrentUser(data.user);
      setIsAuthModalOpen(false);
      syncWithServer();
      showToast(`Bem-vindo(a) de volta, ${data.user.name}!`);
      return { success: true };
    } catch (e) {
      console.error('Login error:', e);
      showToast('Erro de conexão ao tentar fazer login.', 'error');
      return { success: false, message: 'Erro de conexão' };
    }
  };

  const loginAsUser = (user: User) => {
    if (user.isSuspended || user.isBlocked) {
      showToast('Não é possível acessar uma conta suspensa.', 'error');
      return;
    }
    setCurrentUser(user);
    syncWithServer();
    showToast(`Conectado como: ${user.name} (${user.username})`);
    setIsAuthModalOpen(false);
  };

  // Register user via server API
  const registerUser = async (formData: any): Promise<{ success: boolean; requireVerification?: boolean; email?: string; demoCode?: string; message?: string }> => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok) {
        showToast(data.error || 'Erro ao criar conta.', 'error');
        return { success: false, message: data.error };
      }

      setPendingVerificationEmail(data.email);
      setPendingDemoCode(data.demoCode || null);
      setAuthModalMode('verify_email');
      showToast(data.message || 'Código de confirmação enviado para seu e-mail!', 'success');
      return { success: true, requireVerification: true, email: data.email, demoCode: data.demoCode };
    } catch (e) {
      console.error('Registration error:', e);
      showToast('Erro ao conectar ao servidor para cadastro.', 'error');
      return { success: false, message: 'Falha na conexão com o servidor.' };
    }
  };

  // Verify email code
  const verifyEmailCode = async (email: string, code: string): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code })
      });

      const data = await res.json();

      if (!res.ok) {
        showToast(data.error || 'Código inválido.', 'error');
        return { success: false, message: data.error };
      }

      setCurrentUser(data.user);
      setPendingVerificationEmail(null);
      setPendingDemoCode(null);
      syncWithServer();
      // Directly prompt for profile photo right after registration/verification
      setAuthModalMode('set_photo');
      setIsAuthModalOpen(true);
      showToast('E-mail verificado com sucesso! Escolha sua foto de perfil. 📸', 'success');
      return { success: true, message: data.message };
    } catch (e) {
      showToast('Erro ao validar código. Tente novamente.', 'error');
      return { success: false, message: 'Erro na conexão' };
    }
  };

  // Resend code
  const resendVerificationCode = async (email: string): Promise<{ success: boolean; message: string; demoCode?: string }> => {
    try {
      const res = await fetch('/api/auth/resend-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || 'Erro ao reenviar código.', 'error');
        return { success: false, message: data.error };
      }
      setPendingDemoCode(data.demoCode || null);
      showToast(data.message || 'Novo código enviado!', 'info');
      return { success: true, message: data.message, demoCode: data.demoCode };
    } catch (e) {
      showToast('Falha ao reenviar código.', 'error');
      return { success: false, message: 'Erro na conexão' };
    }
  };

  // Correct email address before verification
  const correctEmailAddress = async (oldEmail: string, newEmail: string): Promise<{ success: boolean; message: string; demoCode?: string }> => {
    try {
      const res = await fetch('/api/auth/change-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldEmail, newEmail })
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || 'Erro ao alterar e-mail.', 'error');
        return { success: false, message: data.error };
      }
      setPendingVerificationEmail(data.newEmail);
      setPendingDemoCode(data.demoCode || null);
      showToast(data.message || 'E-mail corrigido com sucesso!', 'success');
      return { success: true, message: data.message, demoCode: data.demoCode };
    } catch (e) {
      showToast('Falha ao corrigir e-mail.', 'error');
      return { success: false, message: 'Erro na conexão' };
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setActiveView('home');
    showToast('Você saiu da sua conta.');
  };

  const updateCurrentUser = async (userData: Partial<User>) => {
    if (!currentUser) return;
    try {
      const res = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: currentUser.id, ...userData })
      });
      if (res.ok) {
        const data = await res.json();
        setCurrentUser(data.user);
        setUsers((prev) => prev.map((u) => (u.id === data.user.id ? data.user : u)));
        showToast('Perfil atualizado com sucesso!');
        return;
      }
    } catch (e) {}

    const updated = { ...currentUser, ...userData };
    setCurrentUser(updated);
    setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
    showToast('Perfil atualizado com sucesso!');
  };

  const blockUser = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          return { ...u, isBlocked: !u.isBlocked };
        }
        return u;
      })
    );
    showToast('Status do usuário atualizado.');
  };

  const adminSuspendUser = (userId: string, reason: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          return { ...u, isSuspended: true, suspensionReason: reason };
        }
        return u;
      })
    );

    setAds((prev) => prev.map((a) => (a.sellerId === userId ? { ...a, status: 'paused' } : a)));

    if (currentUser?.id === userId) {
      setCurrentUser((prev) => (prev ? { ...prev, isSuspended: true, suspensionReason: reason } : null));
    }
    showToast('Conta de usuário suspensa e anúncios pausados preventivamente.', 'info');
  };

  const adminReactivateUser = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          return { ...u, isSuspended: false, suspensionReason: undefined };
        }
        return u;
      })
    );

    setAds((prev) => prev.map((a) => (a.sellerId === userId && a.status === 'paused' ? { ...a, status: 'active' } : a)));
    showToast('Conta reativada com sucesso.', 'success');
  };

  const submitAccountDeletionRequest = async (reason: string) => {
    if (!currentUser) return;
    try {
      await fetch('/api/deletion-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser.id, reason })
      });
    } catch (e) {}

    const request: AccountDeletionRequest = {
      id: 'del-' + Date.now(),
      userId: currentUser.id,
      userName: currentUser.name,
      username: currentUser.username,
      email: currentUser.email,
      reason: reason || 'Solicitado pelo titular via painel LGPD',
      requestedAt: new Date().toLocaleString('pt-BR'),
      status: 'pending'
    };

    setAccountDeletionRequests((prev) => [request, ...prev]);
    showToast('Solicitação de exclusão de conta e dados registrada conforme a LGPD.', 'info');
    closeTermsModal();
  };

  const adminProcessDeletionRequest = (requestId: string) => {
    const req = accountDeletionRequests.find((r) => r.id === requestId);
    if (!req) return;

    setAds((prev) => prev.filter((a) => a.sellerId !== req.userId));
    setUsers((prev) => prev.filter((u) => u.id !== req.userId));
    setAccountDeletionRequests((prev) => prev.map((r) => (r.id === requestId ? { ...r, status: 'processed' } : r)));

    if (currentUser?.id === req.userId) {
      setCurrentUser(null);
      setActiveView('home');
    }

    showToast(`Conta de ${req.userName} e dados excluídos definitivamente do sistema.`, 'info');
  };

  const updateReportStatus = (reportId: string, status: Report['status']) => {
    setReports((prev) => prev.map((r) => (r.id === reportId ? { ...r, status } : r)));
    showToast(`Denúncia marcada como ${status}.`);
  };

  const toggleBannerActive = (bannerId: string) => {
    setBanners((prev) => prev.map((b) => (b.id === bannerId ? { ...b, active: !b.active } : b)));
  };

  const addBanner = (bannerData: Omit<Banner, 'id'>) => {
    const newBanner: Banner = {
      ...bannerData,
      id: 'b-' + Date.now()
    };
    setBanners((prev) => [...prev, newBanner]);
    showToast('Novo banner cadastrado com sucesso!');
  };

  // Neighborhood management
  const addNeighborhood = async (name: string, type: NeighborhoodItem['type'] = 'bairro'): Promise<boolean> => {
    try {
      const res = await fetch('/api/neighborhoods', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, type })
      });
      if (res.ok) {
        const data = await res.json();
        setNeighborhoods(data.neighborhoods);
        showToast(`Bairro "${name}" adicionado com sucesso!`, 'success');
        return true;
      }
    } catch (e) {}

    const newItem: NeighborhoodItem = {
      id: 'nb_' + Date.now(),
      name: name.trim(),
      type,
      active: true
    };
    setNeighborhoods((prev) => [...prev, newItem].sort((a, b) => a.name.localeCompare(b.name, 'pt-BR')));
    showToast(`Bairro "${name}" adicionado!`, 'success');
    return true;
  };

  const toggleNeighborhoodActive = async (id: string): Promise<boolean> => {
    const item = neighborhoods.find((n) => n.id === id);
    if (!item) return false;
    const newActive = !item.active;
    try {
      const res = await fetch(`/api/neighborhoods/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: newActive })
      });
      if (res.ok) {
        const data = await res.json();
        setNeighborhoods(data.neighborhoods);
        return true;
      }
    } catch (e) {}

    setNeighborhoods((prev) =>
      prev.map((n) => (n.id === id ? { ...n, active: newActive } : n))
    );
    return true;
  };

  return (
    <AppContext.Provider
      value={{
        ads,
        categories,
        banners,
        currentUser,
        users,
        favorites,
        reports,
        metrics,
        removedAdsHistory,
        accountDeletionRequests,
        neighborhoods,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        selectedNeighborhood,
        setSelectedNeighborhood,
        selectedCondition,
        setSelectedCondition,
        priceRange,
        setPriceRange,
        sortBy,
        setSortBy,
        resetFilters,
        activeView,
        setActiveView,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        pendingVerificationEmail,
        setPendingVerificationEmail,
        pendingDemoCode,
        setPendingDemoCode,
        isPublishModalOpen,
        setIsPublishModalOpen,
        isSafetyModalOpen,
        setIsSafetyModalOpen,
        isReportModalOpen,
        setIsReportModalOpen,
        selectedAd,
        openAdDetail,
        closeAdDetail,
        selectedSeller,
        openSellerProfile,
        adToReport,
        userToReport,
        openReportModal,
        openUserReportModal,
        isTermsModalOpen,
        termsModalTab,
        openTermsModal,
        closeTermsModal,
        setTermsModalTab,
        isBeforePublishModalOpen,
        openBeforePublishModal,
        closeBeforePublishModal,
        confirmSellerDisclaimer,
        isWhatsAppRedirectModalOpen,
        whatsAppRedirectAd,
        openWhatsAppRedirect,
        closeWhatsAppRedirect,
        confirmWhatsAppRedirect,
        isTermsReacceptanceModalOpen,
        reacceptTerms,
        checkUsernameAvailability,
        checkAge18OrOlder,
        verifyCurrentUserWhatsApp,
        createAd,
        updateAd,
        markAsSold,
        deleteAd,
        renewAd,
        toggleFavorite,
        recordWhatsAppClick,
        recordAdView,
        submitReport,
        submitUserReport,
        login,
        loginAsUser,
        registerUser,
        verifyEmailCode,
        resendVerificationCode,
        correctEmailAddress,
        logout,
        updateCurrentUser,
        blockUser,
        adminSuspendUser,
        adminReactivateUser,
        adminRemoveAd,
        submitAccountDeletionRequest,
        adminProcessDeletionRequest,
        updateReportStatus,
        toggleBannerActive,
        addBanner,
        addNeighborhood,
        toggleNeighborhoodActive,
        toast: toastMessage,
        toastMessage,
        showToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
