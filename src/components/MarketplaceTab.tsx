import React, { useState } from 'react';
import {
  MemeTemplate,
  CryptoWalletState,
  TransactionRecord,
  MarketplaceListing,
  MemeMood,
} from '../types/meme';
import {
  Coins,
  CreditCard,
  Plus,
  Tag,
  Search,
  CheckCircle2,
  Lock,
  ArrowUpRight,
  ArrowDownLeft,
  Sparkles,
  Wallet,
  Zap,
  TrendingUp,
  ShoppingBag,
  Upload,
  RefreshCw,
  QrCode,
  DollarSign,
  Heart,
  Share2,
  IndianRupee,
} from 'lucide-react';

interface MarketplaceTabProps {
  wallet: CryptoWalletState;
  transactions: TransactionRecord[];
  onOpenCheckout: (template: MemeTemplate) => void;
  onDepositFaucet: () => void;
  currentCanvasImage?: string;
  onListMemeForSale: (listing: Partial<MarketplaceListing>) => void;
  listings: MarketplaceListing[];
}

export const MarketplaceTab: React.FC<MarketplaceTabProps> = ({
  wallet,
  transactions,
  onOpenCheckout,
  onDepositFaucet,
  currentCanvasImage,
  onListMemeForSale,
  listings,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'browse' | 'sell' | 'wallet'>('browse');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [moodFilter, setMoodFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Sell form state
  const [sellTitle, setSellTitle] = useState('My Custom Viral Meme');
  const [sellMood, setSellMood] = useState<MemeMood>('Sarcastic');
  const [sellPriceCrypto, setSellPriceCrypto] = useState('0.004');
  const [sellPriceUpi, setSellPriceUpi] = useState('39');
  const [sellSuccessToast, setSellSuccessToast] = useState(false);

  const moods: MemeMood[] = ['Sad', 'Sarcastic', 'Panic', 'Big Brain', 'Smug', 'Angry', 'Wholesome'];

  const filteredListings = listings.filter((item) => {
    const matchCat = categoryFilter === 'All' || item.category === categoryFilter;
    const matchMood = moodFilter === 'All' || item.mood === moodFilter;
    const matchSearch =
      !searchQuery ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.creator.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchMood && matchSearch;
  });

  const handleCreateListing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sellTitle.trim()) return;

    onListMemeForSale({
      title: sellTitle.trim(),
      creator: wallet.address,
      category: 'Community',
      mood: sellMood,
      priceCrypto: parseFloat(sellPriceCrypto) || 0.005,
      cryptoCurrency: 'ETH',
      priceUpiInr: parseInt(sellPriceUpi, 10) || 49,
      previewImage: currentCanvasImage || '',
      likes: 1,
    });

    setSellSuccessToast(true);
    setTimeout(() => {
      setSellSuccessToast(false);
      setActiveSubTab('browse');
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Top Marketplace & Wallet Header */}
      <div className="p-4 sm:p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2.5 rounded-xl bg-gradient-to-tr from-amber-500 to-emerald-500 text-slate-950 font-black shadow-md">
              <ShoppingBag className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                <span>Meme Marketplace &amp; Crypto/UPI Hub</span>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Buy &amp; Sell Active
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Buy exclusive templates, trade memes with Crypto (ETH / SOL) or UPI (GPay, PhonePe, Paytm)
              </p>
            </div>
          </div>
        </div>

        {/* Live Wallet Bar */}
        <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-950 rounded-2xl border border-slate-800 text-xs">
          <div className="flex items-center gap-1.5 px-2 py-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-400 font-medium">Wallet:</span>
            <span className="text-amber-400 font-mono font-bold">{wallet.balances.eth.toFixed(3)} ETH</span>
            <span className="text-slate-600">|</span>
            <span className="text-emerald-400 font-bold flex items-center gap-0.5">
              <IndianRupee className="w-3.5 h-3.5 inline" />
              <span>{wallet.balances.meme * 2} UPI</span>
            </span>
          </div>

          <button
            onClick={onDepositFaucet}
            className="px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold rounded-xl border border-amber-500/30 flex items-center gap-1 transition-all"
            title="Claim free testnet crypto & UPI balance"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>+ Claim Faucet</span>
          </button>
        </div>
      </div>

      {/* Sub Tabs: Browse / Sell / Wallet */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveSubTab('browse')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeSubTab === 'browse'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          Browse &amp; Buy
        </button>

        <button
          onClick={() => setActiveSubTab('sell')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeSubTab === 'sell'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <Plus className="w-4 h-4" />
          Sell Your Meme
        </button>

        <button
          onClick={() => setActiveSubTab('wallet')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeSubTab === 'wallet'
              ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <Wallet className="w-4 h-4" />
          Wallet &amp; UPI Ledger
        </button>
      </div>

      {/* TAB 1: BROWSE & BUY */}
      {activeSubTab === 'browse' && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search marketplace memes by title, creator, or tags..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Mood selector pills */}
            <div className="flex gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              <button
                onClick={() => setMoodFilter('All')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                  moodFilter === 'All'
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                All Moods
              </button>
              {moods.map((m) => (
                <button
                  key={m}
                  onClick={() => setMoodFilter(m)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all whitespace-nowrap ${
                    moodFilter === m
                      ? 'bg-purple-600/30 border-purple-500 text-purple-200'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {m === 'Sad' ? '😭 Sad' : m}
                </button>
              ))}
            </div>
          </div>

          {/* Listings Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredListings.map((item) => (
              <div
                key={item.id}
                className="rounded-3xl bg-slate-900 border border-slate-800 hover:border-slate-700 overflow-hidden shadow-xl flex flex-col group transition-all"
              >
                <div className="aspect-square bg-slate-950 p-2 relative flex items-center justify-center overflow-hidden">
                  <img
                    src={item.previewImage}
                    alt={item.title}
                    className="w-full h-full object-contain rounded-2xl group-hover:scale-105 transition-transform duration-200"
                  />
                  <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-2 py-0.5 rounded-full text-[10px] font-bold text-amber-400 border border-slate-800">
                    {item.mood}
                  </div>
                  <div className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-md px-2 py-0.5 rounded-full text-[10px] font-bold text-slate-300 border border-slate-800 flex items-center gap-1">
                    <Heart className="w-3 h-3 text-red-400 fill-current" />
                    <span>{item.likes}</span>
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h4 className="text-sm font-bold text-white truncate group-hover:text-amber-400">
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                      By {item.creator.slice(0, 10)}...
                    </p>
                  </div>

                  {/* Dual Pricing: Crypto & UPI */}
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-[9px] text-slate-500 font-bold uppercase block">Crypto</span>
                      <span className="text-xs font-mono font-bold text-amber-400">
                        {item.priceCrypto} {item.cryptoCurrency}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] text-slate-500 font-bold uppercase block">UPI</span>
                      <span className="text-xs font-bold text-emerald-400 flex items-center justify-end gap-0.5">
                        <IndianRupee className="w-3 h-3 inline" />
                        <span>{item.priceUpiInr} INR</span>
                      </span>
                    </div>
                  </div>

                  {/* Buy CTA */}
                  <button
                    onClick={() => {
                      onOpenCheckout({
                        id: item.templateId || item.id,
                        name: item.title,
                        category: item.category as any,
                        mood: item.mood,
                        tags: [item.mood.toLowerCase(), 'marketplace'],
                        defaultTopText: item.title,
                        defaultBottomText: 'UNLOCKED VIA MARKETPLACE',
                        aspectRatio: '1:1',
                        svgDataUri: item.previewImage,
                        description: `Purchased from ${item.creator}`,
                        price: {
                          crypto: item.priceCrypto,
                          cryptoCurrency: item.cryptoCurrency,
                          upiInr: item.priceUpiInr,
                          isPremium: true,
                        },
                      });
                    }}
                    className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-amber-500/10 active:scale-95"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Buy with Crypto or UPI</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: SELL YOUR MEME */}
      {activeSubTab === 'sell' && (
        <div className="max-w-2xl mx-auto p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-5">
          <div className="border-b border-slate-800 pb-3">
            <h4 className="text-base font-bold text-white flex items-center gap-2">
              <Plus className="w-5 h-5 text-purple-400" />
              <span>List Your Meme on the Marketplace</span>
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Set your asking price in Crypto (ETH) and UPI (INR). Other creators can buy your template, and earnings will be credited directly to your wallet!
            </p>
          </div>

          <form onSubmit={handleCreateListing} className="space-y-4">
            {/* Preview image */}
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-4">
              <div className="w-20 h-20 bg-slate-900 rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center p-1">
                {currentCanvasImage ? (
                  <img src={currentCanvasImage} alt="Canvas Meme" className="w-full h-full object-contain" />
                ) : (
                  <Sparkles className="w-6 h-6 text-slate-600" />
                )}
              </div>
              <div className="text-xs text-slate-300">
                <span className="font-bold text-white block">Current Live Canvas Meme</span>
                <span className="text-slate-500">Your edited artwork will be published to the marketplace.</span>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1">
                Meme Title
              </label>
              <input
                type="text"
                value={sellTitle}
                onChange={(e) => setSellTitle(e.target.value)}
                placeholder="e.g. 24K Golden Doge Edition"
                className="w-full px-3.5 py-2.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-purple-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1">
                  Mood Tag
                </label>
                <select
                  value={sellMood}
                  onChange={(e) => setSellMood(e.target.value as MemeMood)}
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-purple-500"
                >
                  {moods.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1">
                  Asking Price (ETH)
                </label>
                <input
                  type="number"
                  step="0.001"
                  min="0.001"
                  value={sellPriceCrypto}
                  onChange={(e) => setSellPriceCrypto(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:border-purple-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1">
                Asking Price (UPI INR)
              </label>
              <input
                type="number"
                step="1"
                min="10"
                value={sellPriceUpi}
                onChange={(e) => setSellPriceUpi(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-600/20 transition-all active:scale-95"
            >
              <ArrowUpRight className="w-4 h-4" />
              <span>Publish &amp; List on Marketplace</span>
            </button>

            {sellSuccessToast && (
              <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs font-bold text-center flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Meme listed successfully! Ready for buyers.</span>
              </div>
            )}
          </form>
        </div>
      )}

      {/* TAB 3: WALLET & UPI TRANSACTION LEDGER */}
      {activeSubTab === 'wallet' && (
        <div className="space-y-4">
          {/* Balance Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Ethereum Web3
              </span>
              <div className="text-2xl font-black text-amber-400 font-mono">
                {wallet.balances.eth.toFixed(3)} ETH
              </div>
              <p className="text-[11px] text-slate-500">Connected: {wallet.address}</p>
            </div>

            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                UPI Virtual Account
              </span>
              <div className="text-2xl font-black text-emerald-400 flex items-center gap-1">
                <IndianRupee className="w-6 h-6 inline stroke-[2.5]" />
                <span>{(wallet.balances.meme * 2).toFixed(2)} INR</span>
              </div>
              <p className="text-[11px] text-slate-500">Linked VPA: memeforge@icici</p>
            </div>

            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Solana &amp; Meme Tokens
              </span>
              <div className="text-2xl font-black text-cyan-400 font-mono">
                {wallet.balances.sol.toFixed(2)} SOL
              </div>
              <p className="text-[11px] text-slate-500">MEME Balance: {wallet.balances.meme.toLocaleString()}</p>
            </div>
          </div>

          {/* Transaction Ledger Table */}
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
              <span>On-Chain &amp; UPI Transaction Ledger ({transactions.length})</span>
              <span className="text-emerald-400 font-normal">All Cleared &amp; Settled</span>
            </h4>

            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-xl ${
                        tx.type === 'deposit'
                          ? 'bg-cyan-500/10 text-cyan-400'
                          : tx.type === 'buy'
                          ? 'bg-amber-500/10 text-amber-400'
                          : 'bg-emerald-500/10 text-emerald-400'
                      }`}
                    >
                      {tx.type === 'deposit' ? (
                        <Zap className="w-4 h-4" />
                      ) : tx.type === 'buy' ? (
                        <ArrowDownLeft className="w-4 h-4" />
                      ) : (
                        <ArrowUpRight className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <div className="font-bold text-white">{tx.itemTitle}</div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        {tx.method.toUpperCase()} • {tx.timestamp}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-mono font-bold text-white">{tx.amountStr}</div>
                    <span className="text-[10px] text-emerald-400 font-bold uppercase">
                      ✓ {tx.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
