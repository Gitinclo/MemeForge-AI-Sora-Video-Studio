import {
  UserSubscription,
  FREE_PLAN_LIMITS,
  INDIA_PRO_PLAN_LIMITS,
  COMPANY_TEAM_PLAN_LIMITS,
  SubscriptionPlanLimits,
} from '../types/subscription';

export const INDIA_PRO_MONTHLY_PRICE_INR = 999;
export const COMPANY_TEAM_MONTHLY_PRICE_INR = 99999;

/**
 * Returns active plan limits for a given user subscription
 */
export function getPlanLimits(subscription?: UserSubscription | null): SubscriptionPlanLimits {
  if (subscription?.isActive) {
    if (subscription.plan === 'company_team') {
      return COMPANY_TEAM_PLAN_LIMITS;
    }
    if (subscription.plan === 'india_pro') {
      return INDIA_PRO_PLAN_LIMITS;
    }
  }
  return FREE_PLAN_LIMITS;
}

/**
 * Checks if user subscription can generate a video of the requested duration (in hours)
 */
export function canAccessVideoDuration(hours: number, subscription?: UserSubscription | null): boolean {
  const limits = getPlanLimits(subscription);
  return hours <= limits.videoMaxDurationHours + 0.0001;
}

/**
 * Checks if user subscription can generate in requested resolution
 */
export function canAccessResolution(resolution: string, subscription?: UserSubscription | null): boolean {
  const limits = getPlanLimits(subscription);
  if (limits.videoMaxResolution === '4K Ultra') return true;
  return resolution === '720p HD';
}

/**
 * Checks if user subscription can generate at requested fps
 */
export function canAccessFrameRate(fps: number, subscription?: UserSubscription | null): boolean {
  const limits = getPlanLimits(subscription);
  return fps <= limits.videoMaxFps;
}

/**
 * Checks if user subscription can invite requested number of team seats
 */
export function canAccessTeamMembers(requestedSeats: number, subscription?: UserSubscription | null): boolean {
  const limits = getPlanLimits(subscription);
  return requestedSeats <= limits.teamWorkspaceSeats;
}

/**
 * Formats UPI Deep Link URL for Indian users paying ₹999/month (Individual Creator Pro)
 */
export function generateIndiaProUpiUrl(
  merchantVpa: string = 'memeforge.sub@icici',
  payeeName: string = 'MemeForge Studio India'
): string {
  const amount = INDIA_PRO_MONTHLY_PRICE_INR;
  const note = encodeURIComponent('MemeForge India Creator Pro Monthly Subscription');
  return `upi://pay?pa=${merchantVpa}&pn=${encodeURIComponent(payeeName)}&am=${amount}&cu=INR&tn=${note}`;
}

/**
 * Formats UPI Deep Link URL for Team / Company paying ₹99,999/month
 */
export function generateCompanyTeamUpiUrl(
  merchantVpa: string = 'memeforge.sub@icici',
  payeeName: string = 'MemeForge Studio India'
): string {
  const amount = COMPANY_TEAM_MONTHLY_PRICE_INR;
  const note = encodeURIComponent('MemeForge Team Company Enterprise Monthly Subscription');
  return `upi://pay?pa=${merchantVpa}&pn=${encodeURIComponent(payeeName)}&am=${amount}&cu=INR&tn=${note}`;
}

/**
 * Returns formatted renewal date string (30 days from now)
 */
export function calculateNextBillingDate(): string {
  const d = new Date();
  d.setDate(d.getDate() + 30);
  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}
