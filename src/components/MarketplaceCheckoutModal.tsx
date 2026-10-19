import React, { useState } from 'react';
import { MemeTemplate, CryptoWalletState } from '../types/meme';
import {
  X,
  Coins,
  CreditCard,
  QrCode,
  CheckCircle2,
  Lock,
  ArrowRight,
  ShieldCheck,
  Zap,
  Check,
  Smartphone,
  ExternalLink,
  IndianRupee,
} from 'lucide-react';

interface MarketplaceCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToMemeStudio?: () => void;
  template: MemeTemplate | null;
  wallet: CryptoWalletState;
  onSuccessCrypto: (templateId: string, amount: number, currency: 'ETH' | 'SOL' | 'MEME') => void;
  onSuccessUpi: (templateId: string, amount: number, upiId: string, utr: string) => void;
  onDepositFaucet: () => void;
}

export const MarketplaceCheckoutModal: React.FC<MarketplaceCheckoutModalProps> = ({
  isOpen,
  onClose,
  onSwitchToMemeStudio,
  template,
  wallet,
  onSuccessCrypto,
  onSuccessUpi,
  onDepositFaucet,
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'crypto' | 'upi'>('crypto');
  const [selectedCurrency, setSelectedCurrency] = useState<'ETH' | 'SOL' | 'MEME'>('ETH');
  const [upiIdInput, setUpiIdInput] = useState('user@okhdfcbank');
  const [selectedUpiApp, setSelectedUpiApp] = useState<'gpay' | 'phonepe' | 'paytm' | 'bhim'>('gpay');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentDone, setPaymentDone] = useState(false);
  const [txDetails, setTxDetails] = useState<{ id: string; method: string; amount: string } | null>(null);

  if (!isOpen || !template) return null;

  const cryptoPrice = template.price?.crypto || 0.005;
  const upiPriceInr = template.price?.upiInr || 49;

  // Real UPI intent deep-link
  const upiIntentUrl = `upi://pay?pa=memeforge@icici&pn=MemeForge%20Studio&am=${upiPriceInr}&cu=INR&tn=Unlock%20${encodeURIComponent(template.name)}`;

  const handlePayCrypto = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const txHash = `0x${Math.random().toString(16).substring(2, 10)}...${Math.random().toString(16).substring(2, 6)}`;
      onSuccessCrypto(template.id, cryptoPrice, selectedCurrency);
      setTxDetails({
        id: txHash,
        method: `${selectedCurrency} Crypto Web3`,
        amount: `${cryptoPrice} ${selectedCurrency}`,
      });
      setIsProcessing(false);
      setPaymentDone(true);
    }, 1200);
  };

  const handlePayUpi = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const utr = `UTR${Math.floor(100000000000 + Math.random() * 900000000000)}`;
      onSuccessUpi(template.id, upiPriceInr, upiIdInput, utr);
      setTxDetails({
        id: utr,
        method: `UPI (${selectedUpiApp.toUpperCase()})`,
        amount: `INR ${upiPriceInr}`,
      });
      setIsProcessing(false);
      setPaymentDone(true);
    }, 1400);
  };

  const hasEnoughCrypto = wallet.balances.eth >= cryptoPrice;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-emerald-500/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-purple-600 text-slate-950 flex items-center justify-center shadow-lg font-black">
              <Coins className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <span>Unlock Marketplace Template</span>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase">
                  Crypto &amp; UPI
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Buy &amp; unlock this meme template permanently
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setPaymentDone(false);
              onClose();
            }}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {paymentDone ? (
          /* Payment Success Confirmation */
          <div className="p-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto shadow-xl">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-white">Payment Successful!</h4>
              <p className="text-xs text-slate-400 mt-1">
                Template <strong>{template.name}</strong> has been unlocked and added to your canvas workspace!
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-1.5 text-left font-mono">
              <div className="flex justify-between">
                <span className="text-slate-500">Method:</span>
                <span className="text-white font-bold">{txDetails?.method}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Amount Paid:</span>
                <span className="text-emerald-400 font-bold">{txDetails?.amount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Tx Reference:</span>
                <span className="text-cyan-300 truncate max-w-[200px]">{txDetails?.id}</span>
              </div>
            </div>

            <button
              onClick={() => {
                setPaymentDone(false);
                if (onSwitchToMemeStudio) {
                  onSwitchToMemeStudio();
                } else {
                  onClose();
                }
              }}
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm transition-all shadow-lg shadow-amber-500/20"
            >
              Open in Meme Studio
            </button>
          </div>
        ) : (
          /* Checkout Body */
          <div className="p-5 overflow-y-auto space-y-5">
            {/* Item Card */}
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-3">
              <div className="w-14 h-14 rounded-xl bg-slate-900 border border-slate-800 p-1 flex-shrink-0 flex items-center justify-center overflow-hidden">
                <img
                  src={template.svgDataUri}
                  alt={template.name}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-white truncate">{template.name}</h4>
                <p className="text-xs text-slate-400 truncate">{template.description}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold uppercase">
                    {template.mood}
                  </span>
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                    <span>{cryptoPrice} ETH</span>
                    <span className="text-slate-600">/</span>
                    <span className="flex items-center">
                      <IndianRupee className="w-3 h-3 inline" />
                      {upiPriceInr} UPI
                    </span>
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Method Selector Tabs */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950 rounded-2xl border border-slate-800">
              <button
                onClick={() => setPaymentMethod('crypto')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  paymentMethod === 'crypto'
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Coins className="w-4 h-4" />
                Pay with Crypto
              </button>
              <button
                onClick={() => setPaymentMethod('upi')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  paymentMethod === 'upi'
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Smartphone className="w-4 h-4" />
                Pay with UPI
              </button>
            </div>

            {/* CRYPTO TAB */}
            {paymentMethod === 'crypto' && (
              <div className="space-y-4">
                {/* Wallet Balance & Network Status */}
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      Connected: <span className="font-mono text-slate-200">{wallet.address}</span>
                    </span>
                    <span className="text-cyan-400 text-[10px] font-mono uppercase bg-cyan-500/10 px-2 py-0.5 rounded">
                      {wallet.network}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 text-xs">
                    <span className="text-slate-400">Your Wallet Balance:</span>
                    <span className="font-mono font-bold text-amber-400">
                      {wallet.balances.eth.toFixed(3)} ETH ({wallet.balances.sol.toFixed(1)} SOL)
                    </span>
                  </div>
                </div>

                {/* Currency Selection */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Select Token
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'ETH', name: 'Ethereum', symbol: 'ETH', price: cryptoPrice },
                      { id: 'SOL', name: 'Solana', symbol: 'SOL', price: (cryptoPrice * 18).toFixed(3) },
                      { id: 'MEME', name: 'MemeCoin', symbol: 'MEME', price: (cryptoPrice * 50000).toFixed(0) },
                    ].map((tok) => {
                      const isSel = selectedCurrency === tok.id;
                      return (
                        <button
                          key={tok.id}
                          onClick={() => setSelectedCurrency(tok.id as any)}
                          className={`p-2.5 rounded-xl border text-left transition-all ${
                            isSel
                              ? 'bg-amber-500/20 border-amber-500 text-white shadow-md'
                              : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          <div className="font-bold text-xs">{tok.symbol}</div>
                          <div className="text-[10px] text-slate-400">{tok.name}</div>
                          <div className="text-[11px] font-mono text-amber-400 font-bold mt-1">
                            {tok.price}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {!hasEnoughCrypto && (
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between text-xs text-amber-300">
                    <span>Low testnet balance?</span>
                    <button
                      onClick={onDepositFaucet}
                      className="px-2.5 py-1 rounded-lg bg-amber-500 text-slate-950 font-bold text-[11px] hover:bg-amber-400"
                    >
                      + Get Free Faucet Crypto
                    </button>
                  </div>
                )}

                <button
                  onClick={handlePayCrypto}
                  disabled={isProcessing}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50"
                >
                  <Coins className="w-4 h-4" />
                  {isProcessing ? 'Confirming On-Chain Tx...' : `Pay ${cryptoPrice} ${selectedCurrency}`}
                </button>
              </div>
            )}

            {/* UPI TAB */}
            {paymentMethod === 'upi' && (
              <div className="space-y-4">
                {/* UPI Apps Selector */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Choose UPI App
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { id: 'gpay', label: 'GPay', color: 'text-blue-400' },
                      { id: 'phonepe', label: 'PhonePe', color: 'text-purple-400' },
                      { id: 'paytm', label: 'Paytm', color: 'text-cyan-400' },
                      { id: 'bhim', label: 'BHIM', color: 'text-emerald-400' },
                    ].map((app) => (
                      <button
                        key={app.id}
                        onClick={() => setSelectedUpiApp(app.id as any)}
                        className={`p-2 rounded-xl border text-center transition-all ${
                          selectedUpiApp === app.id
                            ? 'bg-emerald-500/20 border-emerald-500 text-white font-bold shadow-md'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        <div className={`text-xs font-black ${app.color}`}>{app.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Dynamic QR Code & Intent */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-center gap-4">
                  {/* Procedural Canvas UPI QR Mock */}
                  <div className="w-28 h-28 bg-white p-2 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                      {/* Standard QR finder patterns */}
                      <rect x="5" y="5" width="30" height="30" fill="none" stroke="#000" strokeWidth="6" />
                      <rect x="13" y="13" width="14" height="14" fill="#000" />
                      <rect x="65" y="5" width="30" height="30" fill="none" stroke="#000" strokeWidth="6" />
                      <rect x="73" y="13" width="14" height="14" fill="#000" />
                      <rect x="5" y="65" width="30" height="30" fill="none" stroke="#000" strokeWidth="6" />
                      <rect x="13" y="73" width="14" height="14" fill="#000" />
                      {/* Random procedural QR matrix dots */}
                      <rect x="45" y="10" width="8" height="8" fill="#000" />
                      <rect x="45" y="25" width="8" height="8" fill="#000" />
                      <rect x="10" y="45" width="8" height="8" fill="#000" />
                      <rect x="25" y="45" width="8" height="8" fill="#000" />
                      <rect x="45" y="45" width="12" height="12" fill="#10b981" />
                      <rect x="65" y="45" width="8" height="8" fill="#000" />
                      <rect x="80" y="45" width="8" height="8" fill="#000" />
                      <rect x="45" y="65" width="8" height="8" fill="#000" />
                      <rect x="65" y="65" width="12" height="12" fill="#000" />
                      <rect x="45" y="80" width="8" height="8" fill="#000" />
                      <rect x="80" y="80" width="8" height="8" fill="#000" />
                    </svg>
                  </div>

                  <div className="flex-1 space-y-1.5 text-center sm:text-left">
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                      Scan or Tap with any UPI App
                    </span>
                    <div className="text-base font-black text-white flex items-center gap-0.5">
                      <IndianRupee className="w-4 h-4 text-emerald-400 stroke-[2.5]" />
                      <span>{upiPriceInr} INR</span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Merchant VPA: <code className="text-slate-200">memeforge@icici</code>
                    </p>
                    <a
                      href={upiIntentUrl}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-cyan-400 hover:underline pt-0.5"
                    >
                      <span>Open UPI App Directly</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                {/* UPI ID input */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Or Enter Your UPI ID (VPA)
                  </label>
                  <input
                    type="text"
                    value={upiIdInput}
                    onChange={(e) => setUpiIdInput(e.target.value)}
                    placeholder="e.g. mobileNumber@upi or username@okhdfcbank"
                    className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-200 font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <button
                  onClick={handlePayUpi}
                  disabled={isProcessing}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {isProcessing ? (
                    'Verifying with NPCI Gateway...'
                  ) : (
                    <span className="flex items-center gap-1">
                      <span>Verify &amp; Pay</span>
                      <IndianRupee className="w-3.5 h-3.5 stroke-[3] inline" />
                      <span>{upiPriceInr} with UPI</span>
                    </span>
                  )}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
