export type PlanTier = 'free' | 'india_pro' | 'company_team';

export interface SubscriptionPlanLimits {
  tier: PlanTier;
  name: string;
  priceInr: number;
  currency: 'INR' | 'USD';
  period: 'monthly';
  countryScope: 'India Only' | 'Global';
  targetAudience: 'Individual Creator' | 'Multi-seat Team / Company';
  teamWorkspaceSeats: number; // 2 for Free, 1 for Pro (individual), 50+ for Company/Team
  videoMaxDurationHours: number; // 0.00416 (15s) for free, 100 hours for Pro & Company
  videoMaxResolution: '720p HD' | '4K Ultra';
  videoMaxFps: 30 | 120;
  videoWatermark: boolean;
  priorityGpuQueue: boolean;
  gpuClusterTier: 'Shared Eco Queue' | 'Priority 4-Cluster Dispatch' | 'Dedicated 8-Node Enterprise Cluster';
  aiVideoCreditsPerMonth: number; // 15 for Free, 150 for Pro, -1 (Unlimited Enterprise)
  aiCaptionsPerDay: number; // 10 vs unlimited (-1)
  aiDirectorChatLimit: number; // 10 vs unlimited (-1)
  unlockedAudioEffectsCount: number; // 5 vs all (99)
  maxCustomAudioUploads: number; // 2 vs unlimited (-1)
  marketplacePlatformFeePercent: number; // 10% vs 0%
  offlineBuildSupport: boolean; // Local offline APK / AAB package generation (Direct Play Store publish disabled for security)
  gstInvoiceEnabled: boolean;
  dedicatedSlaSupport: boolean;
}

export const FREE_PLAN_LIMITS: SubscriptionPlanLimits = {
  tier: 'free',
  name: 'Free Creator',
  priceInr: 0,
  currency: 'INR',
  period: 'monthly',
  countryScope: 'Global',
  targetAudience: 'Individual Creator',
  teamWorkspaceSeats: 2,
  videoMaxDurationHours: 15 / 3600, // 15 seconds max
  videoMaxResolution: '720p HD',
  videoMaxFps: 30,
  videoWatermark: true,
  priorityGpuQueue: false,
  gpuClusterTier: 'Shared Eco Queue',
  aiVideoCreditsPerMonth: 15,
  aiCaptionsPerDay: 10,
  aiDirectorChatLimit: 10,
  unlockedAudioEffectsCount: 5,
  maxCustomAudioUploads: 2,
  marketplacePlatformFeePercent: 10,
  offlineBuildSupport: true,
  gstInvoiceEnabled: false,
  dedicatedSlaSupport: false,
};

export const INDIA_PRO_PLAN_LIMITS: SubscriptionPlanLimits = {
  tier: 'india_pro',
  name: 'India Creator Pro',
  priceInr: 999,
  currency: 'INR',
  period: 'monthly',
  countryScope: 'India Only',
  targetAudience: 'Individual Creator',
  teamWorkspaceSeats: 1, // Single creator seat
  videoMaxDurationHours: 100, // 100 Hours Max
  videoMaxResolution: '4K Ultra',
  videoMaxFps: 120,
  videoWatermark: false,
  priorityGpuQueue: true,
  gpuClusterTier: 'Priority 4-Cluster Dispatch',
  aiVideoCreditsPerMonth: 150,
  aiCaptionsPerDay: -1, // Unlimited
  aiDirectorChatLimit: -1, // Unlimited
  unlockedAudioEffectsCount: 99, // All unlocked
  maxCustomAudioUploads: -1, // Unlimited
  marketplacePlatformFeePercent: 0, // 0% platform fee
  offlineBuildSupport: true,
  gstInvoiceEnabled: false,
  dedicatedSlaSupport: false,
};

export const COMPANY_TEAM_PLAN_LIMITS: SubscriptionPlanLimits = {
  tier: 'company_team',
  name: 'Team / Company Enterprise',
  priceInr: 99999,
  currency: 'INR',
  period: 'monthly',
  countryScope: 'India Only',
  targetAudience: 'Multi-seat Team / Company',
  teamWorkspaceSeats: 50, // 50+ members / multiple people & teams
  videoMaxDurationHours: 100, // 100 Hours Max continuous video
  videoMaxResolution: '4K Ultra',
  videoMaxFps: 120,
  videoWatermark: false,
  priorityGpuQueue: true,
  gpuClusterTier: 'Dedicated 8-Node Enterprise Cluster',
  aiVideoCreditsPerMonth: -1, // Unlimited team generations
  aiCaptionsPerDay: -1, // Unlimited across all team members
  aiDirectorChatLimit: -1, // Unlimited
  unlockedAudioEffectsCount: 99,
  maxCustomAudioUploads: -1,
  marketplacePlatformFeePercent: 0,
  offlineBuildSupport: true,
  gstInvoiceEnabled: true, // Official B2B GST tax invoice with GSTIN & input tax credit
  dedicatedSlaSupport: true, // 24/7 dedicated enterprise account manager
};

export interface UserSubscription {
  plan: PlanTier;
  isActive: boolean;
  country: 'IN' | 'OTHER';
  priceInr: number;
  startDate?: string;
  renewsOn?: string;
  paymentMethod?: 'UPI_AUTOPAY' | 'UPI_INSTANT' | 'CARD' | 'CORPORATE_NETBANKING' | 'NEFT_RTGS';
  upiApp?: string;
  utr?: string;
  companyName?: string;
  gstin?: string;
  teamSeats?: number;
}
