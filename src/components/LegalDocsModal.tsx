import React, { useState } from 'react';
import { X, Shield, FileText, CheckCircle2, Lock, ExternalLink } from 'lucide-react';

interface LegalDocsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDoc?: 'terms' | 'privacy';
}

export const LegalDocsModal: React.FC<LegalDocsModalProps> = ({
  isOpen,
  onClose,
  initialDoc = 'terms',
}) => {
  const [activeTab, setActiveTab] = useState<'terms' | 'privacy'>(initialDoc);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[85vh] rounded-3xl bg-slate-950 border border-slate-800 shadow-2xl flex flex-col overflow-hidden text-slate-300">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/60 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              {activeTab === 'terms' ? <FileText className="w-5 h-5" /> : <Shield className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                {activeTab === 'terms' ? 'Terms & Conditions' : 'Privacy Policy'}
              </h3>
              <p className="text-xs text-slate-400">
                Official legal agreements for MemeForge AI Studio (Last updated: October 22, 2026)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Tab switch pills */}
            <div className="flex items-center p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs">
              <button
                type="button"
                onClick={() => setActiveTab('terms')}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  activeTab === 'terms' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                Terms
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('privacy')}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  activeTab === 'privacy' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                Privacy
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Document Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 text-xs leading-relaxed text-slate-300 font-sans">
          {activeTab === 'terms' ? (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-200">
                <strong>Executive Summary:</strong> You own your original memes and User Content. Free exports carry a watermark; Pro (Rs. 999/mo) and Enterprise (Rs. 99,999/mo) provide full commercial broadcast rights. Automated Google Play Store direct publishing is permanently disabled to safeguard developer credentials.
              </div>

              <section className="space-y-1.5">
                <h4 className="text-sm font-bold text-white">1. Acceptance &amp; Commercial Licenses</h4>
                <p>
                  By accessing or using MemeForge AI Studio, you agree to these Terms. Free tier licenses are granted for personal and non-commercial creative use. Subscribers to the India Creator Pro (Rs. 999/month) or Team / Company Enterprise (Rs. 99,999/month) plans receive full commercial broadcast, marketing, agency, and distribution rights without watermarks.
                </p>
              </section>

              <section className="space-y-1.5">
                <h4 className="text-sm font-bold text-white">2. Subscription Billing &amp; 18% GST Taxes</h4>
                <p>
                  Subscriptions are billed monthly in Indian Rupees (INR) via UPI AutoPay, Corporate NetBanking, or NEFT/RTGS mandates. Company Enterprise plans include official B2B tax invoices reflecting Company GSTIN with full 18% Goods &amp; Services Tax (GST) Input Tax Credit eligibility. Subscriptions renew automatically until cancelled in the UI. All subscription payments are non-refundable for partial billing periods.
                </p>
              </section>

              <section className="space-y-1.5">
                <h4 className="text-sm font-bold text-white">3. User Content &amp; Intellectual Property</h4>
                <p>
                  You retain all copyright and ownership rights to your original images, text, audio compositions, and video files created in the Studio. You warrant that your uploaded assets do not infringe third-party intellectual property or privacy rights.
                </p>
              </section>

              <section className="space-y-1.5">
                <h4 className="text-sm font-bold text-white">4. Acceptable Use &amp; AI Safety</h4>
                <p>
                  You agree not to use MemeForge Studio to generate defamatory, violent, illegal, or harassing material, or malicious non-consensual deepfakes. Attempting to overload the 32K / 1000 FPS rendering cluster or reverse-engineer private API proxies is strictly prohibited.
                </p>
              </section>

              <section className="space-y-1.5">
                <h4 className="text-sm font-bold text-white">5. Disclaimers &amp; Limitation of Liability</h4>
                <p>
                  The Application and AI models are provided &quot;AS IS&quot; without warranties of any kind. Under no circumstances shall MemeForge maintainers be liable for incidental, special, or consequential damages. Maximum aggregate liability is strictly limited to amounts paid by you in the preceding 12 months.
                </p>
              </section>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-200">
                <strong>Privacy Summary:</strong> Your canvas layers, drafts, and audio stems are processed locally on your client device. Multimodal image analysis through Google Gemini is handled ephemerally in memory—we do not harvest, store, or sell your images to train AI models.
              </div>

              <section className="space-y-1.5">
                <h4 className="text-sm font-bold text-white">1. Information We Collect</h4>
                <p>
                  We collect account and billing identifiers (email, company name, GSTIN) solely to issue tax-compliant invoices and allocate workspace seats. Payment transactions via UPI or Corporate NetBanking only log public VPA handles and transaction UTR numbers. We never collect or store banking passwords, card PINs, or UPI MPINs.
                </p>
              </section>

              <section className="space-y-1.5">
                <h4 className="text-sm font-bold text-white">2. Local-First Processing Architecture</h4>
                <p>
                  Image canvas manipulation, typography rendering, and synthetic audio generation execute entirely client-side using browser HTML5 Canvas and the Web Audio API. Images sent to <code>/api/magic-captions</code> for AI vision analysis are processed ephemerally in server RAM and immediately discarded.
                </p>
              </section>

              <section className="space-y-1.5">
                <h4 className="text-sm font-bold text-white">3. Data Security &amp; Offline Signing</h4>
                <p>
                  All server communications use TLS 1.3 encryption. Direct automated publishing to the Google Play Store is disabled across all studio tiers to protect user credentials and private keystores. Android APKs and AABs are compiled strictly for offline device sideloading and internal testing.
                </p>
              </section>

              <section className="space-y-1.5">
                <h4 className="text-sm font-bold text-white">4. Your Rights (GDPR, CCPA &amp; DPDPA)</h4>
                <p>
                  You have the right to access, rectify, or erase your personal information. Client project data can be purged instantly by clearing browser site storage. For billing inquiries, contact us at <code>lijogeorge1133@gmail.com</code>.
                </p>
              </section>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/60 flex items-center justify-between text-[11px] text-slate-400 shrink-0">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Compliant with GDPR, CCPA &amp; India DPDPA</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition-colors"
          >
            I Understand &amp; Agree
          </button>
        </div>
      </div>
    </div>
  );
};
