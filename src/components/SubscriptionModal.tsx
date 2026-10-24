import React, { useState, useEffect } from 'react';
import {
  X,
  Crown,
  Check,
  CheckCircle2,
  Sparkles,
  Zap,
  Clock,
  Video,
  ShieldCheck,
  Flame,
  ArrowRight,
  QrCode,
  Smartphone,
  ExternalLink,
  Lock,
  Globe,
  Bell,
  RefreshCw,
  Info,
  ChevronDown,
  ChevronUp,
  Building2,
  Users,
  FileText,
  CreditCard,
  Briefcase,
  Shield,
} from 'lucide-react';
import {
  UserSubscription,
  FREE_PLAN_LIMITS,
  INDIA_PRO_PLAN_LIMITS,
  COMPANY_TEAM_PLAN_LIMITS,
} from '../types/subscription';
import {
  generateIndiaProUpiUrl,
  generateCompanyTeamUpiUrl,
  calculateNextBillingDate,
  INDIA_PRO_MONTHLY_PRICE_INR,
  COMPANY_TEAM_MONTHLY_PRICE_INR,
} from '../utils/subscriptionUtils';

export const IndiaFlag: React.FC<{ className?: string }> = ({ className = 'w-4 h-3' }) => (
  <span className={`inline-flex flex-col rounded-xs overflow-hidden border border-white/20 shrink-0 ${className}`}>
    <span className="h-1/3 bg-[#FF9933] w-full" />
    <span className="h-1/3 bg-white w-full flex items-center justify-center">
      <span className="w-1 h-1 rounded-full bg-[#000080]" />
    </span>
    <span className="h-1/3 bg-[#138808] w-full" />
  </span>
);

export const RupeeSign: React.FC<{ className?: string }> = ({ className = 'w-3.5 h-3.5 inline-block shrink-0' }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M6 3h12" />
    <path d="M6 8h12" />
    <path d="M6 13l8.5 8" />
    <path d="M6 13h3a4 4 0 0 0 0-8H6" />
  </svg>
);

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  subscription: UserSubscription;
  onUpdateSubscription: (updated: UserSubscription) => void;
  initialPlanCategory?: 'individual' | 'company';
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  isOpen,
  onClose,
  subscription,
  onUpdateSubscription,
  initialPlanCategory,
}) => {
  const [selectedCountry, setSelectedCountry] = useState<'IN' | 'OTHER'>('IN');
  const [planCategory, setPlanCategory] = useState<'individual' | 'company'>(
    initialPlanCategory || (subscription?.plan === 'company_team' ? 'company' : 'individual')
  );

  useEffect(() => {
    if (initialPlanCategory) {
      setPlanCategory(initialPlanCategory);
    } else if (subscription?.plan === 'company_team') {
      setPlanCategory('company');
    }
  }, [initialPlanCategory, isOpen, subscription?.plan]);
  const [selectedUpiApp, setSelectedUpiApp] = useState<'gpay' | 'phonepe' | 'paytm' | 'bhim'>('gpay');
  const [upiIdInput, setUpiIdInput] = useState('creator@okhdfcbank');
  const [companyNameInput, setCompanyNameInput] = useState('Zenith Media India Pvt Ltd');
  const [gstinInput, setGstinInput] = useState('29ABCDE1234F1Z5');
  const [companyPaymentMethod, setCompanyPaymentMethod] = useState<'UPI_AUTOPAY' | 'CORPORATE_NETBANKING' | 'NEFT_RTGS'>('UPI_AUTOPAY');
  const [corporateBank, setCorporateBank] = useState('HDFC Bank');
  const [isProcessing, setIsProcessing] = useState(false);
  const [waitlistJoined, setWaitlistJoined] = useState(false);
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [showQrCode, setShowQrCode] = useState(false);
  const [showLimitsGuide, setShowLimitsGuide] = useState(false);

  if (!isOpen) return null;

  const upiIntentUrl =
    planCategory === 'company'
      ? generateCompanyTeamUpiUrl('memeforge.sub@icici', 'MemeForge Studio India')
      : generateIndiaProUpiUrl('memeforge.sub@icici', 'MemeForge India Creator Pro');

  const handleActivatePro = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const utr = `UTR${Math.floor(100000000000 + Math.random() * 900000000000)}`;
      const nextDate = calculateNextBillingDate();
      onUpdateSubscription({
        plan: 'india_pro',
        isActive: true,
        country: 'IN',
        priceInr: INDIA_PRO_MONTHLY_PRICE_INR,
        startDate: new Date().toLocaleDateString('en-IN'),
        renewsOn: nextDate,
        paymentMethod: 'UPI_AUTOPAY',
        upiApp: selectedUpiApp.toUpperCase(),
        utr: utr,
        teamSeats: 1,
      });
      setIsProcessing(false);
      onClose();
    }, 1200);
  };

  const handleActivateCompany = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const utr = `UTR${Math.floor(100000000000 + Math.random() * 900000000000)}`;
      const nextDate = calculateNextBillingDate();
      onUpdateSubscription({
        plan: 'company_team',
        isActive: true,
        country: 'IN',
        priceInr: COMPANY_TEAM_MONTHLY_PRICE_INR,
        startDate: new Date().toLocaleDateString('en-IN'),
        renewsOn: nextDate,
        paymentMethod: companyPaymentMethod,
        upiApp: companyPaymentMethod === 'UPI_AUTOPAY' ? selectedUpiApp.toUpperCase() : undefined,
        utr: utr,
        companyName: companyNameInput || 'Enterprise Studio Team',
        gstin: gstinInput || '29ABCDE1234F1Z5',
        teamSeats: 50,
      });
      setIsProcessing(false);
      onClose();
    }, 1500);
  };

  const handleCancelSubscription = () => {
    onUpdateSubscription({
      plan: 'free',
      isActive: false,
      country: 'IN',
      priceInr: 0,
      teamSeats: 2,
    });
  };

  const isPro = subscription.isActive && subscription.plan === 'india_pro';
  const isCompany = subscription.isActive && subscription.plan === 'company_team';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-slate-900 border border-purple-500/30 rounded-3xl shadow-2xl shadow-purple-950/50 overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-purple-950/80 via-slate-900 to-amber-950/60 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
              <Crown className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-extrabold text-white tracking-tight">
                  MemeForge Studio Subscriptions
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5">
                  <IndiaFlag /> India Special Pricing
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Unlock 100-hour video generation, multi-seat team collaboration, 4K 120fps &amp; zero marketplace fees
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Country / Region Switcher */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-bold text-slate-200">Billing Region &amp; Currency:</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedCountry('IN')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  selectedCountry === 'IN'
                    ? 'bg-gradient-to-r from-amber-500 to-purple-600 text-white shadow-md'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <IndiaFlag />
                <span className="flex items-center gap-0.5">
                  <span>India (UPI &amp; INR)</span>
                </span>
              </button>
              <button
                onClick={() => setSelectedCountry('OTHER')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  selectedCountry === 'OTHER'
                    ? 'bg-slate-800 text-white border border-slate-600'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <span>🌐</span> Other Countries (Global)
              </button>
            </div>
          </div>

          {/* Conditional Display: Other Countries Notice */}
          {selectedCountry === 'OTHER' ? (
            <div className="p-6 rounded-3xl bg-slate-950/80 border border-cyan-500/30 text-center space-y-4">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
                <Globe className="w-7 h-7" />
              </div>
              <div className="max-w-md mx-auto space-y-2">
                <h4 className="text-lg font-bold text-white">Global Pricing Launching Soon</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  The discounted Rs. 999/month Individual and Rs. 99,999/month Team rates are currently localized to Indian creators paying via Indian UPI / NetBanking. We are actively finalizing international payment gateways (Stripe, PayPal, Multi-currency cards) for other countries.
                </p>
              </div>

              {waitlistJoined ? (
                <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>You're on the global waitlist! We'll notify you as soon as international checkout opens.</span>
                </div>
              ) : (
                <div className="max-w-sm mx-auto flex items-center gap-2">
                  <input
                    type="email"
                    value={waitlistEmail}
                    onChange={(e) => setWaitlistEmail(e.target.value)}
                    placeholder="Enter your email for global access"
                    className="flex-1 px-3.5 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-400"
                  />
                  <button
                    onClick={() => {
                      if (waitlistEmail.trim()) setWaitlistJoined(true);
                    }}
                    disabled={!waitlistEmail.trim()}
                    className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-extrabold rounded-xl transition-all disabled:opacity-50 flex items-center gap-1.5"
                  >
                    <Bell className="w-3.5 h-3.5" />
                    Join Waitlist
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* India Subscriptions */
            <div className="space-y-6">
              {/* Active Plan Status Banner if already Subscribed */}
              {(isPro || isCompany) && (
                <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/60 to-slate-900 border border-emerald-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      <CheckCircle2 className="w-5 h-5" />
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        {isCompany ? (
                          <>
                            <Building2 className="w-4 h-4 text-purple-400" />
                            <span>Team / Company Enterprise Active</span>
                            <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[10px] font-black uppercase">
                              50 Team Seats • Rs. 99,999/mo
                            </span>
                          </>
                        ) : (
                          <>
                            <Crown className="w-4 h-4 text-amber-400" />
                            <span>India Creator Pro Active</span>
                            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-black uppercase">
                              Active (Rs. 999/mo)
                            </span>
                          </>
                        )}
                      </h4>
                      <p className="text-xs text-slate-400">
                        {isCompany && subscription.companyName && (
                          <span className="text-slate-200 font-semibold mr-2">{subscription.companyName} (GSTIN: {subscription.gstin || 'B2B'}) •</span>
                        )}
                        Renews on <span className="text-amber-300 font-bold">{subscription.renewsOn || 'Next month'}</span> via {subscription.upiApp || subscription.paymentMethod || 'UPI'} • All 100-hour limits unlocked
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleCancelSubscription}
                    className="px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-300 text-xs font-bold transition-colors"
                  >
                    Cancel Plan (Switch to Free)
                  </button>
                </div>
              )}

              {/* Plan Category Switcher: Individual vs Team/Company */}
              <div className="flex items-center p-1 bg-slate-950 rounded-2xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => setPlanCategory('individual')}
                  className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    planCategory === 'individual'
                      ? 'bg-gradient-to-r from-amber-500 to-purple-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Crown className="w-4 h-4 text-amber-300" />
                  <span>Individual Creator (Rs. 999 / mo)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPlanCategory('company')}
                  className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 relative ${
                    planCategory === 'company'
                      ? 'bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Building2 className="w-4 h-4 text-cyan-300" />
                  <span>Team / Company Enterprise (Rs. 99,999 / mo)</span>
                  <span className="px-1.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[9px] font-black uppercase">
                    Multiple People
                  </span>
                </button>
              </div>

              {/* VIEW 1: INDIVIDUAL PLANS (Free vs ₹999/mo) */}
              {planCategory === 'individual' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Plan 1: Free Tier */}
                  <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                          {FREE_PLAN_LIMITS.name}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px] font-bold">
                          Basic
                        </span>
                      </div>

                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-black text-white flex items-center gap-0.5">
                          <RupeeSign className="w-6 h-6 text-slate-400" />
                          <span>0</span>
                        </span>
                        <span className="text-xs text-slate-500">/ forever</span>
                      </div>
                      <p className="text-xs text-slate-400">
                        Ideal for casual meme making and short 15-second AI video clips.
                      </p>

                      <hr className="border-slate-900" />

                      <ul className="space-y-2.5 text-xs text-slate-300">
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-slate-500 shrink-0" />
                          <span>AI Video Duration: <strong className="text-white">15 sec max</strong></span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-slate-500 shrink-0" />
                          <span>Resolution: <strong className="text-white">720p HD @ 30fps</strong></span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-slate-500 shrink-0" />
                          <span>Queue: Standard Eco GPU cluster (queue delays)</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-slate-500 shrink-0" />
                          <span>Watermark: MemeForge corner watermark</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-slate-500 shrink-0" />
                          <span>AI Magic Captions: 10 captions / day</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-slate-500 shrink-0" />
                          <span>Marketplace Fee: 10% platform fee</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-slate-500 shrink-0" />
                          <span>Team Collaboration: Single creator (2 seats max)</span>
                        </li>
                      </ul>
                    </div>

                    <div className="pt-2">
                      <span className="block text-center py-2.5 px-4 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 text-xs font-bold">
                        {isPro || isCompany ? 'Included' : 'Current Active Plan'}
                      </span>
                    </div>
                  </div>

                  {/* Plan 2: India Creator Pro */}
                  <div className="relative p-5 rounded-3xl bg-gradient-to-b from-purple-950/40 via-slate-950 to-slate-950 border-2 border-purple-500/60 shadow-xl shadow-purple-950/40 flex flex-col justify-between space-y-4">
                    <div className="absolute -top-3 right-6 px-3 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-purple-500 text-white text-[10px] font-black uppercase tracking-wider shadow-md">
                      POPULAR IN INDIA
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
                          <Flame className="w-3.5 h-3.5 text-amber-400" />
                          {INDIA_PRO_PLAN_LIMITS.name}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-black">
                          PRO CREATOR
                        </span>
                      </div>

                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-black text-amber-300 flex items-center gap-0.5">
                          <RupeeSign className="w-7 h-7 text-amber-400" />
                          <span>999</span>
                        </span>
                        <span className="text-xs text-slate-400">/ month</span>
                        <span className="ml-2 text-[10px] text-emerald-400 font-bold">(Billed Monthly)</span>
                      </div>
                      <p className="text-xs text-purple-200/80">
                        Full creative horsepower for individual creators, marathon video streams &amp; agencies.
                      </p>

                      <hr className="border-purple-500/20" />

                      <ul className="space-y-2.5 text-xs text-slate-200">
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span>AI Video Duration: <strong className="text-amber-300 font-bold">Up to 100 Hours Max!</strong></span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span>Resolution &amp; FPS: <strong className="text-cyan-300 font-bold">4K Ultra &amp; 1080p @ 120 FPS</strong></span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span>GPU Processing: <strong className="text-white">Priority 4-Cluster Dispatch</strong></span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span>No Watermarks: <strong className="text-white">Clean Studio Master Export</strong></span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span>AI Captions &amp; Director: <strong className="text-white">Unlimited Gemini Vision</strong></span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span>Audio Studio: <strong className="text-white">All 16+ sounds + unlimited uploads</strong></span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span>Marketplace: <strong className="text-emerald-400 font-bold">0% Platform Fee</strong> (Instant UPI)</span>
                        </li>
                      </ul>
                    </div>

                    {/* Payment Selection & Activation */}
                    {!isPro ? (
                      <div className="pt-2 space-y-3">
                        {/* UPI App selector */}
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                            Select Instant UPI / AutoPay App:
                          </label>
                          <div className="grid grid-cols-4 gap-1.5">
                            {(['gpay', 'phonepe', 'paytm', 'bhim'] as const).map((app) => (
                              <button
                                key={app}
                                onClick={() => setSelectedUpiApp(app)}
                                className={`py-1.5 px-1 rounded-xl text-[11px] font-bold border transition-all uppercase ${
                                  selectedUpiApp === app
                                    ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                                }`}
                              >
                                {app}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* UPI ID input + QR Code Toggle */}
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={upiIdInput}
                            onChange={(e) => setUpiIdInput(e.target.value)}
                            placeholder="yourname@upi"
                            className="flex-1 px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:border-amber-400"
                          />
                          <button
                            type="button"
                            onClick={() => setShowQrCode(!showQrCode)}
                            className={`px-3 py-2 border rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
                              showQrCode
                                ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                                : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-300'
                            }`}
                            title="Toggle UPI QR Code"
                          >
                            <QrCode className="w-3.5 h-3.5 text-amber-400" />
                            <span>QR</span>
                          </button>
                          <a
                            href={upiIntentUrl}
                            className="px-3 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-xl text-slate-300 text-xs font-bold flex items-center gap-1"
                            title="Open UPI App directly on mobile"
                          >
                            <Smartphone className="w-3.5 h-3.5 text-amber-400" />
                            <span>App</span>
                          </a>
                        </div>

                        {/* Expandable UPI QR Code Card */}
                        {showQrCode && (
                          <div className="p-3 bg-slate-900/90 border border-amber-500/30 rounded-2xl flex flex-col items-center gap-2 text-center animate-in fade-in zoom-in-95">
                            <div className="p-2.5 bg-white rounded-xl shadow-md">
                              <svg className="w-28 h-28" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect width="100" height="100" fill="white" />
                                <rect x="10" y="10" width="24" height="24" fill="#0f172a" rx="2" />
                                <rect x="14" y="14" width="16" height="16" fill="white" rx="1" />
                                <rect x="18" y="18" width="8" height="8" fill="#f59e0b" rx="1" />

                                <rect x="66" y="10" width="24" height="24" fill="#0f172a" rx="2" />
                                <rect x="70" y="14" width="16" height="16" fill="white" rx="1" />
                                <rect x="74" y="18" width="8" height="8" fill="#f59e0b" rx="1" />

                                <rect x="10" y="66" width="24" height="24" fill="#0f172a" rx="2" />
                                <rect x="14" y="70" width="16" height="16" fill="white" rx="1" />
                                <rect x="18" y="74" width="8" height="8" fill="#f59e0b" rx="1" />

                                <rect x="38" y="14" width="6" height="6" fill="#0f172a" />
                                <rect x="48" y="14" width="6" height="6" fill="#0f172a" />
                                <rect x="38" y="24" width="6" height="6" fill="#0f172a" />
                                <rect x="52" y="24" width="6" height="6" fill="#0f172a" />
                                <rect x="14" y="44" width="6" height="6" fill="#0f172a" />
                                <rect x="24" y="44" width="6" height="6" fill="#0f172a" />
                                <rect x="38" y="40" width="8" height="8" fill="#f59e0b" />
                                <rect x="50" y="40" width="8" height="8" fill="#8b5cf6" />
                                <rect x="66" y="44" width="6" height="6" fill="#0f172a" />
                                <rect x="78" y="44" width="6" height="6" fill="#0f172a" />
                                <rect x="40" y="56" width="6" height="6" fill="#0f172a" />
                                <rect x="52" y="56" width="6" height="6" fill="#0f172a" />
                                <rect x="44" y="68" width="6" height="6" fill="#0f172a" />
                                <rect x="56" y="68" width="6" height="6" fill="#0f172a" />
                                <rect x="68" y="68" width="8" height="8" fill="#0f172a" />
                                <rect x="80" y="76" width="6" height="6" fill="#0f172a" />
                                <rect x="68" y="80" width="6" height="6" fill="#0f172a" />
                              </svg>
                            </div>
                            <div className="text-[11px] space-y-0.5">
                              <p className="font-bold text-white">Scan with GPay, PhonePe, Paytm or BHIM</p>
                              <p className="text-[10px] text-slate-400 font-mono flex items-center justify-center gap-1">
                                <span>VPA: memeforge.sub@icici • Amount:</span>
                                <RupeeSign className="w-2.5 h-2.5" />
                                <span>999</span>
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Pay & Activate Button */}
                        <button
                          onClick={handleActivatePro}
                          disabled={isProcessing}
                          className="w-full py-3 px-4 bg-gradient-to-r from-amber-500 via-purple-600 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-white font-black text-sm rounded-2xl flex items-center justify-center gap-2 transition-all shadow-xl shadow-purple-950/50 active:scale-95 disabled:opacity-50"
                        >
                          {isProcessing ? (
                            <>
                              <RefreshCw className="w-4 h-4 animate-spin" />
                              <span className="flex items-center gap-1">
                                <span>Verifying UPI AutoPay Mandate (</span>
                                <RupeeSign className="w-3.5 h-3.5" />
                                <span>999)...</span>
                              </span>
                            </>
                          ) : (
                            <>
                              <Crown className="w-4 h-4 text-amber-300" />
                              <span className="flex items-center gap-1">
                                <span>Subscribe for</span>
                                <RupeeSign className="w-4 h-4" />
                                <span>999 / month</span>
                              </span>
                              <ArrowRight className="w-4 h-4" />
                            </>
                          )}
                        </button>

                        <div className="flex items-center justify-center gap-3 text-[10px] text-slate-400">
                          <span className="flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3 text-emerald-400" />
                            100% Encrypted UPI
                          </span>
                          <span>•</span>
                          <span>Cancel anytime with 1-click</span>
                        </div>
                      </div>
                    ) : (
                      <div className="pt-2">
                        <div className="py-2.5 px-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold text-center">
                          ✓ All Pro Features &amp; 100-Hour Limits Active
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* VIEW 2: TEAM / COMPANY ENTERPRISE (₹99,999/mo - Multiple People) */
                <div className="relative p-6 rounded-3xl bg-gradient-to-b from-indigo-950/60 via-slate-950 to-slate-950 border-2 border-cyan-500/60 shadow-2xl shadow-cyan-950/40 space-y-5">
                  <div className="absolute -top-3 right-6 px-3.5 py-1 rounded-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 text-white text-[10px] font-black uppercase tracking-wider shadow-lg flex items-center gap-1">
                    <Building2 className="w-3 h-3" />
                    <span>MULTIPLE PEOPLE &amp; TEAM LICENSE</span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
                          <Building2 className="w-6 h-6" />
                        </span>
                        <div>
                          <h4 className="text-xl font-black text-white flex items-center gap-2">
                            <span>{COMPANY_TEAM_PLAN_LIMITS.name}</span>
                          </h4>
                          <p className="text-xs text-cyan-200/80">
                            Enterprise horsepower for production studios, agency teams &amp; creative corporations.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="text-left sm:text-right">
                      <div className="flex items-baseline sm:justify-end gap-1">
                        <span className="text-3xl sm:text-4xl font-black text-cyan-300 flex items-center gap-0.5">
                          <RupeeSign className="w-8 h-8 text-cyan-400" />
                          <span>99,999</span>
                        </span>
                        <span className="text-xs text-slate-400">/ month</span>
                      </div>
                      <span className="text-[10px] text-emerald-400 font-bold block">
                        + 18% GST Input Tax Credit Eligible (B2B Invoice)
                      </span>
                    </div>
                  </div>

                  <hr className="border-cyan-500/20" />

                  {/* Enterprise Features Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs text-slate-200">
                    <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                      <div className="font-bold text-white flex items-center gap-2 text-[11px] uppercase tracking-wider text-cyan-300">
                        <Users className="w-4 h-4 text-cyan-400" />
                        <span>Team &amp; Multi-Seat Collaboration</span>
                      </div>
                      <ul className="space-y-1.5 text-[11px] text-slate-300">
                        <li className="flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                          <span><strong>50 Team Member Seats</strong> with Admin, Editor &amp; Reviewer roles</span>
                        </li>
                        <li className="flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                          <span>Centralized Team Workspace &amp; live multi-editor canvas</span>
                        </li>
                        <li className="flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                          <span>Shared Cloud Asset Vault &amp; company-wide brand kits</span>
                        </li>
                      </ul>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                      <div className="font-bold text-white flex items-center gap-2 text-[11px] uppercase tracking-wider text-purple-300">
                        <Zap className="w-4 h-4 text-purple-400" />
                        <span>Dedicated Enterprise GPU Cluster</span>
                      </div>
                      <ul className="space-y-1.5 text-[11px] text-slate-300">
                        <li className="flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                          <span><strong>Dedicated 8-Node Multi-Cluster GPU:</strong> Zero queue wait</span>
                        </li>
                        <li className="flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                          <span><strong>Unlimited 100-Hour Video Generation</strong> in 4K Ultra &amp; 120 FPS</span>
                        </li>
                        <li className="flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                          <span>Continuous neural latent streaming with team ProRes stems</span>
                        </li>
                      </ul>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                      <div className="font-bold text-white flex items-center gap-2 text-[11px] uppercase tracking-wider text-emerald-300">
                        <FileText className="w-4 h-4 text-emerald-400" />
                        <span>Commercial License &amp; GST Invoicing</span>
                      </div>
                      <ul className="space-y-1.5 text-[11px] text-slate-300">
                        <li className="flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span><strong>Zero Watermarks:</strong> Full broadcast commercial usage rights</span>
                        </li>
                        <li className="flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>B2B Tax Invoice with Company GSTIN for 18% Input Tax Credit</span>
                        </li>
                        <li className="flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span><strong>0% Marketplace Fee:</strong> 100% direct payouts to team accounts</span>
                        </li>
                      </ul>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                      <div className="font-bold text-white flex items-center gap-2 text-[11px] uppercase tracking-wider text-cyan-300">
                        <Building2 className="w-4 h-4 text-cyan-400" />
                        <span>Workspaces &amp; Enterprise Cloud Vault</span>
                      </div>
                      <ul className="space-y-1.5 text-[11px] text-slate-300">
                        <li className="flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                          <span><strong>10 Isolated Production Workspaces:</strong> Dedicated environments with GPU node allocations</span>
                        </li>
                        <li className="flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                          <span><strong>50 TB Encrypted Cloud Vault:</strong> Multi-region edge storage (Mumbai, Singapore, Tokyo, EU)</span>
                        </li>
                        <li className="flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                          <span><strong>AES-256 GCM Zero-Knowledge:</strong> End-to-end encrypted storage for 32K master plates &amp; ProRes stems</span>
                        </li>
                      </ul>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                      <div className="font-bold text-white flex items-center gap-2 text-[11px] uppercase tracking-wider text-amber-300">
                        <Shield className="w-4 h-4 text-amber-400" />
                        <span>Security &amp; Dedicated Support</span>
                      </div>
                      <ul className="space-y-1.5 text-[11px] text-slate-300">
                        <li className="flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span><strong>Direct Play Store Auto-Publish Disabled:</strong> Prevents credential exploit</span>
                        </li>
                        <li className="flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span>Offline local APK/AAB compilation for internal enterprise auditing</span>
                        </li>
                        <li className="flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span><strong>24/7 Dedicated Account Manager</strong> via Slack, WhatsApp &amp; Phone</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Corporate Billing Inputs & Activation */}
                  {!isCompany ? (
                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                            Company / Studio Name:
                          </label>
                          <input
                            type="text"
                            value={companyNameInput}
                            onChange={(e) => setCompanyNameInput(e.target.value)}
                            placeholder="Enter Company or Agency Name"
                            className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-400"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                            Business GSTIN / PAN (for Tax Credit):
                          </label>
                          <input
                            type="text"
                            value={gstinInput}
                            onChange={(e) => setGstinInput(e.target.value)}
                            placeholder="e.g. 29ABCDE1234F1Z5"
                            className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-white font-mono uppercase focus:outline-none focus:border-cyan-400"
                          />
                        </div>
                      </div>

                      {/* Payment Method Selector for ₹99,999 */}
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                          Select Enterprise Payment Method:
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          <button
                            type="button"
                            onClick={() => setCompanyPaymentMethod('UPI_AUTOPAY')}
                            className={`py-2 px-2.5 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                              companyPaymentMethod === 'UPI_AUTOPAY'
                                ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300'
                                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                            }`}
                          >
                            <Smartphone className="w-3.5 h-3.5" />
                            <span>Instant UPI AutoPay</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setCompanyPaymentMethod('CORPORATE_NETBANKING')}
                            className={`py-2 px-2.5 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                              companyPaymentMethod === 'CORPORATE_NETBANKING'
                                ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300'
                                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                            }`}
                          >
                            <CreditCard className="w-3.5 h-3.5" />
                            <span>Corporate NetBanking</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setCompanyPaymentMethod('NEFT_RTGS')}
                            className={`py-2 px-2.5 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                              companyPaymentMethod === 'NEFT_RTGS'
                                ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300'
                                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                            }`}
                          >
                            <Building2 className="w-3.5 h-3.5" />
                            <span>NEFT / RTGS Mandate</span>
                          </button>
                        </div>
                      </div>

                      {/* If Corporate NetBanking is chosen */}
                      {companyPaymentMethod === 'CORPORATE_NETBANKING' && (
                        <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between text-xs">
                          <span className="text-slate-400 text-[11px]">Supported Corporate Banks:</span>
                          <div className="flex gap-1.5 font-bold text-slate-300 text-[11px]">
                            {['HDFC Bank', 'ICICI Bank', 'SBI Corporate', 'Axis Bank'].map((b) => (
                              <button
                                key={b}
                                type="button"
                                onClick={() => setCorporateBank(b)}
                                className={`px-2 py-1 rounded-lg border text-[10px] ${
                                  corporateBank === b
                                    ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300'
                                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                                }`}
                              >
                                {b}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Tax Breakdown Preview */}
                      <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] font-mono flex items-center justify-between text-slate-400">
                        <span>Base: Rs. 84,744.92 + 18% GST (Rs. 15,254.08)</span>
                        <span className="text-white font-bold">Total Payable: Rs. 99,999 / mo</span>
                      </div>

                      {/* Activate Button */}
                      <button
                        onClick={handleActivateCompany}
                        disabled={isProcessing}
                        className="w-full py-3.5 px-4 bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-black text-sm rounded-2xl flex items-center justify-center gap-2 transition-all shadow-xl shadow-cyan-950/50 active:scale-95 disabled:opacity-50"
                      >
                        {isProcessing ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            <span>Verifying Corporate Mandate &amp; Allocating 50 Seats (Rs. 99,999)...</span>
                          </>
                        ) : (
                          <>
                            <Building2 className="w-4 h-4 text-cyan-300" />
                            <span className="flex items-center gap-1">
                              <span>Activate Team / Company Plan (</span>
                              <RupeeSign className="w-4 h-4" />
                              <span>99,999 / month)</span>
                            </span>
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>

                      <div className="flex items-center justify-center gap-3 text-[10px] text-slate-400">
                        <span className="flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3 text-emerald-400" />
                          Official B2B Invoice Generated Instantly
                        </span>
                        <span>•</span>
                        <span>50 Seats Instantly Provisioned</span>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold text-center">
                      ✓ Team / Company Enterprise Active • 50 Seats &amp; 8-Node Dedicated GPU Online
                    </div>
                  )}
                </div>
              )}

              {/* Expandable Plan Limits & Architecture Strategy Guide */}
              <div className="rounded-2xl bg-slate-950/80 border border-slate-800 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setShowLimitsGuide(!showLimitsGuide)}
                  className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-900/50 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      <Info className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white flex items-center gap-2">
                        <span>Plan Limits Architecture &amp; Rationale Guide</span>
                        <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 uppercase">
                          Executive Summary
                        </span>
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        Why we chose 15s Free vs 100h Pro, Rs. 99,999 Team Plan, disabled store auto-publish &amp; India pricing
                      </p>
                    </div>
                  </div>
                  <div className="text-slate-400">
                    {showLimitsGuide ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {showLimitsGuide && (
                  <div className="p-4 pt-0 space-y-3.5 text-xs text-slate-300 border-t border-slate-900 animate-in fade-in">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3">
                      <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
                        <span className="font-bold text-amber-300 text-[11px] uppercase tracking-wider block">
                          1. Video Duration: 15s Free vs 100 Hours Pro
                        </span>
                        <p className="text-[11px] text-slate-400 leading-relaxed">
                          15 seconds allows unlimited casual meme tests and social loops at near-zero GPU cost. The 100-hour ceiling uses distributed multi-cluster latent memory for marathon streams and ambient video creators, protected by the Rs. 999/mo individual or Rs. 99,999/mo team subscription.
                        </p>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
                        <span className="font-bold text-cyan-300 text-[11px] uppercase tracking-wider block">
                          2. Team / Company Plan (Rs. 99,999/mo)
                        </span>
                        <p className="text-[11px] text-slate-400 leading-relaxed">
                          Tailored for agencies and media companies needing 50+ seats, dedicated 8-node GPU cluster with zero queuing, multi-editor synchronization, and official 18% GST input credit tax invoicing.
                        </p>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
                        <span className="font-bold text-purple-300 text-[11px] uppercase tracking-wider block">
                          3. Watermarking &amp; Commercial Master
                        </span>
                        <p className="text-[11px] text-slate-400 leading-relaxed">
                          Free exports carry a discreet MemeForge watermark which drives viral organic product discovery. Pro and Company subscribers get 100% clean studio master renders for commercial broadcast.
                        </p>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
                        <span className="font-bold text-rose-300 text-[11px] uppercase tracking-wider block">
                          4. Google Play Direct Publish Disabled for Security
                        </span>
                        <p className="text-[11px] text-slate-400 leading-relaxed">
                          Direct automated publishing to Google Play Store has been removed to prevent credential theft and policy abuse. Packages are generated strictly for offline sideload testing and internal signing.
                        </p>
                      </div>
                    </div>

                    {/* Comprehensive Plan Limits Comparison Matrix */}
                    <div className="overflow-x-auto rounded-xl border border-slate-800">
                      <table className="w-full text-[11px] text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-900 border-b border-slate-800">
                            <th className="p-2.5 font-bold text-slate-300">Feature / Limit Metric</th>
                            <th className="p-2.5 font-bold text-slate-400">Free Tier (Rs. 0)</th>
                            <th className="p-2.5 font-bold text-amber-300">India Creator Pro (Rs. 999/mo)</th>
                            <th className="p-2.5 font-bold text-cyan-300">Team / Company Enterprise (Rs. 99,999/mo)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60 font-mono">
                          <tr className="hover:bg-slate-900/30">
                            <td className="p-2 font-sans font-semibold text-slate-300">Max Video Duration</td>
                            <td className="p-2 text-slate-400">15 seconds</td>
                            <td className="p-2 text-amber-300 font-bold">100 Hours Max</td>
                            <td className="p-2 text-cyan-300 font-bold">100 Hours Continuous</td>
                          </tr>
                          <tr className="hover:bg-slate-900/30">
                            <td className="p-2 font-sans font-semibold text-slate-300">Resolution &amp; FPS</td>
                            <td className="p-2 text-slate-400">720p HD @ 30fps</td>
                            <td className="p-2 text-amber-300">4K Ultra @ 120fps</td>
                            <td className="p-2 text-cyan-300">4K Ultra @ 120fps</td>
                          </tr>
                          <tr className="hover:bg-slate-900/30">
                            <td className="p-2 font-sans font-semibold text-slate-300">Collaborative Workspace Seats</td>
                            <td className="p-2 text-slate-400">2 Seats</td>
                            <td className="p-2 text-slate-300">1 Creator Seat (Solo)</td>
                            <td className="p-2 text-cyan-300 font-bold">50 Team Seats (Multi-User)</td>
                          </tr>
                          <tr className="hover:bg-slate-900/30">
                            <td className="p-2 font-sans font-semibold text-slate-300">Isolated Production Workspaces</td>
                            <td className="p-2 text-slate-400">1 (Default)</td>
                            <td className="p-2 text-slate-400">1 (Solo)</td>
                            <td className="p-2 text-cyan-300 font-bold">10 Workspaces (Isolated GPU Nodes)</td>
                          </tr>
                          <tr className="hover:bg-slate-900/30">
                            <td className="p-2 font-sans font-semibold text-slate-300">Encrypted Cloud Vault</td>
                            <td className="p-2 text-slate-400">1 GB Browser Cache</td>
                            <td className="p-2 text-amber-300">100 GB AES-256 Vault</td>
                            <td className="p-2 text-cyan-300 font-bold">50 TB Multi-Region Edge Vault</td>
                          </tr>
                          <tr className="hover:bg-slate-900/30">
                            <td className="p-2 font-sans font-semibold text-slate-300">GPU Cluster Acceleration</td>
                            <td className="p-2 text-slate-400">Shared Eco Queue</td>
                            <td className="p-2 text-amber-300">Priority 4-Cluster Dispatch</td>
                            <td className="p-2 text-cyan-300 font-bold">Dedicated 8-Node Enterprise Cluster</td>
                          </tr>
                          <tr className="hover:bg-slate-900/30">
                            <td className="p-2 font-sans font-semibold text-slate-300">AI Magic Captions &amp; Director</td>
                            <td className="p-2 text-slate-400">10 / day</td>
                            <td className="p-2 text-emerald-400">Unlimited</td>
                            <td className="p-2 text-emerald-400">Unlimited (Company Pool)</td>
                          </tr>
                          <tr className="hover:bg-slate-900/30">
                            <td className="p-2 font-sans font-semibold text-slate-300">Watermark / Broadcast Master</td>
                            <td className="p-2 text-slate-400">Corner Watermark</td>
                            <td className="p-2 text-emerald-400">Zero Watermark</td>
                            <td className="p-2 text-emerald-400">Commercial Broadcast Rights</td>
                          </tr>
                          <tr className="hover:bg-slate-900/30">
                            <td className="p-2 font-sans font-semibold text-slate-300">Play Store Direct Publishing</td>
                            <td className="p-2 text-amber-400">Disabled (Exploit Guard)</td>
                            <td className="p-2 text-amber-400">Disabled (Exploit Guard)</td>
                            <td className="p-2 text-amber-400">Disabled (Offline Signing Only)</td>
                          </tr>
                          <tr className="hover:bg-slate-900/30">
                            <td className="p-2 font-sans font-semibold text-slate-300">B2B GST Tax Invoice</td>
                            <td className="p-2 text-slate-500">—</td>
                            <td className="p-2 text-slate-500">—</td>
                            <td className="p-2 text-emerald-400 font-bold">Included (18% Input Credit)</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-200/90 leading-relaxed">
                      <strong>🇮🇳 Regional Strategy (India First):</strong> The Rs. 999/mo (Creator) and Rs. 99,999/mo (Company) plans are optimized for Indian payment methods (UPI AutoPay &amp; Corporate NetBanking) and GST compliance. Global multi-currency tiers will be added in a subsequent rollout.
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
