export type AdCondition = 'novo' | 'usado' | 'seminovo' | 'nao_aplica';

export type AdStatus = 'active' | 'sold' | 'paused' | 'pending_approval';

export interface Ad {
  id: string;
  title: string;
  description: string;
  price: number; // 0 if free or negotiable
  priceType: 'fixed' | 'negotiable' | 'free';
  categoryId: string;
  condition: AdCondition;
  neighborhood: string;
  city: string;
  whatsapp: string;
  photos: string[];
  acceptsOffers: boolean;
  isFeatured: boolean;
  isSponsored?: boolean;
  status: AdStatus;
  sellerId: string;
  sellerName: string;
  sellerUsername?: string;
  sellerAvatar?: string;
  sellerJoinedDate: string;
  sellerWhatsAppVerified?: boolean;
  createdAt: string;
  viewsCount: number;
  whatsappClicksCount: number;
}

export interface Category {
  id: string;
  name: string;
  iconName: string;
  slug: string;
  description?: string;
  color?: string;
}

export interface TermsAcceptanceRecord {
  termsVersion: string;
  privacyVersion: string;
  acceptedAt: string;
  ipAddress: string;
  method: string;
  confirmedAge18: boolean;
}

export interface NeighborhoodItem {
  id: string;
  name: string;
  type: 'bairro' | 'zona_rural' | 'distrito' | 'outro';
  active: boolean;
}

export interface User {
  id: string;
  name: string;
  username: string; // e.g., '@marcellovendas'
  email: string;
  phone: string; // international formatted "+5534999999999"
  whatsapp: string; // formatted "(34) 99999-9999" or clean digits
  neighborhood: string;
  avatarUrl: string; // mandatory
  bio?: string;
  joinedDate: string;
  activeAdsCount: number;
  soldAdsCount: number;
  isBlocked: boolean;
  isSuspended?: boolean;
  suspensionReason?: string;
  role: 'user' | 'admin';
  birthDate?: string;
  isWhatsAppVerified: boolean;
  isEmailVerified: boolean;
  emailVerificationCode?: string;
  emailVerificationExpiresAt?: string;
  hasAcceptedSellerDisclaimer?: boolean;
  termsAcceptance?: TermsAcceptanceRecord;
  blockedUsers?: string[]; // IDs of users this user has blocked
  dailyAdsCount?: { date: string; count: number };
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  imageUrl: string;
  ctaText?: string;
  categoryId?: string;
  bgColor?: string;
  active: boolean;
}

export interface Report {
  id: string;
  type: 'ad' | 'user';
  adId?: string;
  adTitle?: string;
  targetUserId?: string;
  targetUserName?: string;
  targetUsername?: string;
  reporterName: string;
  reporterContact?: string;
  reason: 'golpe' | 'proibido' | 'falso' | 'improprio' | 'duplicado' | 'outro';
  details: string;
  createdAt: string;
  status: 'pending' | 'reviewed' | 'action_taken' | 'dismissed';
}

export interface RemovedAdRecord {
  id: string;
  adId: string;
  title: string;
  sellerName: string;
  sellerUsername?: string;
  price: number;
  reason: string;
  removedAt: string;
  removedBy: string;
}

export interface AccountDeletionRequest {
  id: string;
  userId: string;
  userName: string;
  username: string;
  email: string;
  reason: string;
  requestedAt: string;
  status: 'pending' | 'processed';
}

export interface PlatformMetrics {
  totalVisits: number;
  whatsappClicks: number;
  totalAdsCreated: number;
  totalSold: number;
}

