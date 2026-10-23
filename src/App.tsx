import React, { useState, useRef, useEffect } from 'react';
import { MemeCanvas } from './components/MemeCanvas';
import { MemeToolbar } from './components/MemeToolbar';
import { MemeTemplateSelector } from './components/MemeTemplateSelector';
import { MagicCaptionModal } from './components/MagicCaptionModal';
import { SoraStudioTab } from './components/SoraStudioTab';
import { TeamWorkspaceTab } from './components/TeamWorkspaceTab';
import { AiDirectorChatModal } from './components/AiDirectorChatModal';
import { AndroidPackageModal } from './components/AndroidPackageModal';
import { MarketplaceTab } from './components/MarketplaceTab';
import { MarketplaceCheckoutModal } from './components/MarketplaceCheckoutModal';
import { SubscriptionModal } from './components/SubscriptionModal';
import { PWAInstallButton } from './components/PWAInstallButton';
import { CinemaVfxEditorTab } from './components/CinemaVfxEditorTab';
import { MEME_TEMPLATES } from './data/memeTemplates';
import { UserSubscription } from './types/subscription';
import {
  TextLayer,
  MemeSticker,
  CanvasFilter,
  MemeTemplate,
  MagicCaption,
  VersionSnapshot,
  CryptoWalletState,
  TransactionRecord,
  MarketplaceListing,
  MemeAudioConfig,
} from './types/meme';
import {
  MEME_AUDIO_EFFECTS,
  playMemeAudio,
  stopMemeAudio,
  exportMemeVideoWithAudio,
} from './utils/memeAudioEngine';
import {
  Wand2,
  Sparkles,
  Download,
  Copy,
  Layers,
  Film,
  Users,
  MessageSquare,
  RotateCcw,
  Plus,
  Sliders,
  Check,
  Flame,
  Camera,
  Share2,
  Smartphone,
  Package,
  ShoppingBag,
  Coins,
  CreditCard,
  Music,
  Volume2,
  Play,
  Square,
  Crown,
  Building2,
  Boxes,
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'meme' | 'sora' | 'cinema' | 'team' | 'market'>('meme');
  const [isAndroidModalOpen, setIsAndroidModalOpen] = useState(false);
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  const [subscriptionModalCategory, setSubscriptionModalCategory] = useState<'individual' | 'company'>('individual');

  // User Subscription State (persisted in localStorage, default Free)
  const [subscription, setSubscription] = useState<UserSubscription>(() => {
    try {
      const saved = localStorage.getItem('memeforge_subscription');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return {
      plan: 'free',
      isActive: true,
      country: 'IN',
      priceInr: 0,
    };
  });

  // Active Meme state
  const defaultTemplate = MEME_TEMPLATES[0];
  const [currentImageSrc, setCurrentImageSrc] = useState<string>(defaultTemplate.svgDataUri);
  const [activeTemplate, setActiveTemplate] = useState<MemeTemplate | null>(defaultTemplate);

  const [textLayers, setTextLayers] = useState<TextLayer[]>([
    {
      id: 'top_1',
      text: defaultTemplate.defaultTopText,
      x: 50,
      y: 12,
      fontSize: 44,
      fontFamily: 'Impact',
      textColor: '#ffffff',
      outlineColor: '#000000',
      outlineWidth: 4,
      backgroundColor: 'transparent',
      textAlign: 'center',
      isUppercase: true,
      isBold: true,
      shadow: true,
      rotation: 0,
    },
    {
      id: 'bottom_1',
      text: defaultTemplate.defaultBottomText,
      x: 50,
      y: 88,
      fontSize: 44,
      fontFamily: 'Impact',
      textColor: '#ffffff',
      outlineColor: '#000000',
      outlineWidth: 4,
      backgroundColor: 'transparent',
      textAlign: 'center',
      isUppercase: true,
      isBold: true,
      shadow: true,
      rotation: 0,
    },
  ]);

  const [selectedLayerId, setSelectedLayerId] = useState<string | null>('top_1');
  const [stickers, setStickers] = useState<MemeSticker[]>([]);
  const [filter, setFilter] = useState<CanvasFilter>('none');
  const [aspectRatio, setAspectRatio] = useState<string>('1:1');

  // Audio Layer state
  const [audioConfig, setAudioConfig] = useState<MemeAudioConfig>({
    selectedEffectId: 'airhorn', // MLG Airhorn pre-attached by default
    volume: 0.9,
    playbackRate: 1.0,
    loop: false,
    delaySec: 0,
  });
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isExportingVideo, setIsExportingVideo] = useState(false);
  const [exportProgress, setExportProgress] = useState<{ percent: number; status: string } | null>(null);

  const activeAudioEffect = MEME_AUDIO_EFFECTS.find(
    (e) => e.id === audioConfig.selectedEffectId
  );

  // Modals state
  const [isMagicCaptionOpen, setIsMagicCaptionOpen] = useState(false);
  const [isDirectorChatOpen, setIsDirectorChatOpen] = useState(false);
  const [copiedToast, setCopiedToast] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Crypto & UPI Marketplace State
  const [wallet, setWallet] = useState<CryptoWalletState>({
    connected: true,
    address: '0x71C...4e8b',
    network: 'Ethereum Mainnet & UPI',
    balances: {
      eth: 0.15,
      sol: 6.8,
      meme: 5000,
      usdt: 250,
    },
  });

  const [unlockedTemplateIds, setUnlockedTemplateIds] = useState<string[]>([]);
  const [checkoutTemplate, setCheckoutTemplate] = useState<MemeTemplate | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Marketplace Listings
  const [marketplaceListings, setMarketplaceListings] = useState<MarketplaceListing[]>([
    {
      id: 'list_1',
      templateId: 'golden_doge_nft',
      title: 'Cyber Golden Doge 2026 (Exclusive)',
      creator: '0xSatoshi_Meme',
      category: 'Community',
      mood: 'Smug',
      priceCrypto: 0.005,
      cryptoCurrency: 'ETH',
      priceUpiInr: 49,
      previewImage: MEME_TEMPLATES.find((t) => t.id === 'golden_doge_nft')?.svgDataUri || '',
      likes: 142,
    },
    {
      id: 'list_2',
      templateId: 'sad_pablo_escobar',
      title: 'Sad Pablo Escobar (Waiting Forever)',
      creator: '0xMedellin_Art',
      category: 'Sad',
      mood: 'Sad',
      priceCrypto: 0.002,
      cryptoCurrency: 'ETH',
      priceUpiInr: 29,
      previewImage: MEME_TEMPLATES.find((t) => t.id === 'sad_pablo_escobar')?.svgDataUri || '',
      likes: 89,
    },
    {
      id: 'list_3',
      templateId: 'crying_cat',
      title: 'Crying Cat with Heavy Tears',
      creator: '0xMeow_Dev',
      category: 'Sad',
      mood: 'Sad',
      priceCrypto: 0.003,
      cryptoCurrency: 'ETH',
      priceUpiInr: 35,
      previewImage: MEME_TEMPLATES.find((t) => t.id === 'crying_cat')?.svgDataUri || '',
      likes: 215,
    },
    {
      id: 'list_4',
      templateId: 'stonks',
      title: 'Diamond Hands Stonks Up NFT',
      creator: '0xWallStreetBets',
      category: 'Trending',
      mood: 'Smug',
      priceCrypto: 0.004,
      cryptoCurrency: 'ETH',
      priceUpiInr: 45,
      previewImage: MEME_TEMPLATES.find((t) => t.id === 'stonks')?.svgDataUri || '',
      likes: 310,
    },
  ]);

  // Transaction Ledger
  const [transactions, setTransactions] = useState<TransactionRecord[]>([
    {
      id: 'tx_init_1',
      type: 'deposit',
      method: 'crypto',
      amountStr: '+0.15 ETH',
      itemTitle: 'Initial Web3 Faucet Grant',
      timestamp: 'Today, 10:14 AM',
      status: 'completed',
      txHash: '0x8f2a...391c',
    },
    {
      id: 'tx_init_2',
      type: 'deposit',
      method: 'upi',
      amountStr: '+INR 10,000 (UPI)',
      itemTitle: 'UPI Virtual Account Top-up',
      timestamp: 'Today, 10:15 AM',
      status: 'completed',
      utr: 'UTR920194821039',
    },
  ]);

  // Version Snapshots history
  const [versionHistory, setVersionHistory] = useState<VersionSnapshot[]>([
    {
      id: 'v_init',
      tag: 'v1.0.0-init',
      timestamp: 'Initial template',
      author: 'You (Creator)',
      role: 'Owner',
      note: 'Loaded Drake Hotline Bling template',
      memeState: {
        templateId: defaultTemplate.id,
        imageSrc: defaultTemplate.svgDataUri,
        textLayers: [
          {
            id: 'top_1',
            text: defaultTemplate.defaultTopText,
            x: 50,
            y: 12,
            fontSize: 44,
            fontFamily: 'Impact',
            textColor: '#ffffff',
            outlineColor: '#000000',
            outlineWidth: 4,
            backgroundColor: 'transparent',
            textAlign: 'center',
            isUppercase: true,
            isBold: true,
            shadow: true,
            rotation: 0,
          },
          {
            id: 'bottom_1',
            text: defaultTemplate.defaultBottomText,
            x: 50,
            y: 88,
            fontSize: 44,
            fontFamily: 'Impact',
            textColor: '#ffffff',
            outlineColor: '#000000',
            outlineWidth: 4,
            backgroundColor: 'transparent',
            textAlign: 'center',
            isUppercase: true,
            isBold: true,
            shadow: true,
            rotation: 0,
          },
        ],
        filter: 'none',
      },
    },
  ]);

  // Record a new snapshot in history (BUG FIX: captures currentImageSrc)
  const recordSnapshot = (
    note: string,
    updatedLayers = textLayers,
    currentFilter = filter,
    imgSrc = currentImageSrc
  ) => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newSnap: VersionSnapshot = {
      id: `v_${Date.now()}`,
      tag: `v1.${versionHistory.length}.0`,
      timestamp: time,
      author: 'You (Creator)',
      role: 'Meme Lord',
      note,
      memeState: {
        templateId: activeTemplate?.id || 'custom',
        imageSrc: imgSrc,
        textLayers: JSON.parse(JSON.stringify(updatedLayers)),
        filter: currentFilter,
      },
    };
    setVersionHistory((prev) => [newSnap, ...prev]);
  };

  // Select a template from catalog
  const handleSelectTemplate = (template: MemeTemplate) => {
    setActiveTemplate(template);
    setCurrentImageSrc(template.svgDataUri);
    setAspectRatio(template.aspectRatio);

    const newLayers: TextLayer[] = [
      {
        id: `top_${Date.now()}`,
        text: template.defaultTopText,
        x: 50,
        y: 12,
        fontSize: 44,
        fontFamily: 'Impact',
        textColor: '#ffffff',
        outlineColor: '#000000',
        outlineWidth: 4,
        backgroundColor: 'transparent',
        textAlign: 'center',
        isUppercase: true,
        isBold: true,
        shadow: true,
        rotation: 0,
      },
      {
        id: `bottom_${Date.now() + 1}`,
        text: template.defaultBottomText,
        x: 50,
        y: 88,
        fontSize: 44,
        fontFamily: 'Impact',
        textColor: '#ffffff',
        outlineColor: '#000000',
        outlineWidth: 4,
        backgroundColor: 'transparent',
        textAlign: 'center',
        isUppercase: true,
        isBold: true,
        shadow: true,
        rotation: 0,
      },
    ];

    setTextLayers(newLayers);
    setSelectedLayerId(newLayers[0].id);
    recordSnapshot(`Switched to ${template.name}`, newLayers, filter, template.svgDataUri);
  };

  // Upload custom image
  const handleCustomImageUpload = (imageSrc: string, name: string) => {
    setActiveTemplate(null);
    setCurrentImageSrc(imageSrc);

    const newLayers: TextLayer[] = [
      {
        id: `top_${Date.now()}`,
        text: 'TOP TEXT HERE',
        x: 50,
        y: 12,
        fontSize: 44,
        fontFamily: 'Impact',
        textColor: '#ffffff',
        outlineColor: '#000000',
        outlineWidth: 4,
        backgroundColor: 'transparent',
        textAlign: 'center',
        isUppercase: true,
        isBold: true,
        shadow: true,
        rotation: 0,
      },
      {
        id: `bottom_${Date.now() + 1}`,
        text: 'BOTTOM TEXT HERE',
        x: 50,
        y: 88,
        fontSize: 44,
        fontFamily: 'Impact',
        textColor: '#ffffff',
        outlineColor: '#000000',
        outlineWidth: 4,
        backgroundColor: 'transparent',
        textAlign: 'center',
        isUppercase: true,
        isBold: true,
        shadow: true,
        rotation: 0,
      },
    ];

    setTextLayers(newLayers);
    setSelectedLayerId(newLayers[0].id);
    recordSnapshot(`Uploaded custom image: ${name}`, newLayers, filter, imageSrc);
  };

  // Apply Magic Caption to Meme
  const handleApplyMagicCaption = (caption: MagicCaption) => {
    let updatedLayers: TextLayer[];

    if (textLayers.length >= 2) {
      updatedLayers = [
        {
          ...textLayers[0],
          text: caption.topText || caption.singleLine,
        },
        {
          ...textLayers[1],
          text: caption.bottomText || '',
        },
        ...textLayers.slice(2),
      ];
    } else {
      updatedLayers = [
        {
          id: `top_${Date.now()}`,
          text: caption.topText || caption.singleLine,
          x: 50,
          y: 12,
          fontSize: 44,
          fontFamily: 'Impact',
          textColor: '#ffffff',
          outlineColor: '#000000',
          outlineWidth: 4,
          backgroundColor: 'transparent',
          textAlign: 'center',
          isUppercase: true,
          isBold: true,
          shadow: true,
          rotation: 0,
        },
        {
          id: `bottom_${Date.now() + 1}`,
          text: caption.bottomText || '',
          x: 50,
          y: 88,
          fontSize: 44,
          fontFamily: 'Impact',
          textColor: '#ffffff',
          outlineColor: '#000000',
          outlineWidth: 4,
          backgroundColor: 'transparent',
          textAlign: 'center',
          isUppercase: true,
          isBold: true,
          shadow: true,
          rotation: 0,
        },
      ];
    }

    setTextLayers(updatedLayers);
    recordSnapshot(`Applied Magic Caption: ${caption.vibe || 'AI Suggestion'}`, updatedLayers);
  };

  // Update specific text layer
  const handleUpdateLayer = (id: string, updates: Partial<TextLayer>) => {
    setTextLayers((prev) =>
      prev.map((l) => (l.id === id ? { ...l, ...updates } : l))
    );
  };

  // Update layer position (from canvas drag)
  const handleUpdateLayerPosition = (id: string, x: number, y: number) => {
    setTextLayers((prev) =>
      prev.map((l) => (l.id === id ? { ...l, x, y } : l))
    );
  };

  // Add new custom text layer
  const handleAddLayer = () => {
    const newId = `layer_${Date.now()}`;
    const newLayer: TextLayer = {
      id: newId,
      text: 'NEW TEXT',
      x: 50,
      y: 50,
      fontSize: 40,
      fontFamily: 'Impact',
      textColor: '#facc15',
      outlineColor: '#000000',
      outlineWidth: 4,
      backgroundColor: 'transparent',
      textAlign: 'center',
      isUppercase: true,
      isBold: true,
      shadow: true,
      rotation: 0,
    };
    const updated = [...textLayers, newLayer];
    setTextLayers(updated);
    setSelectedLayerId(newId);
    recordSnapshot('Added text layer', updated);
  };

  // Remove text layer
  const handleRemoveLayer = (id: string) => {
    if (textLayers.length <= 1) return;
    const updated = textLayers.filter((l) => l.id !== id);
    setTextLayers(updated);
    setSelectedLayerId(updated[0]?.id || null);
    recordSnapshot('Removed text layer', updated);
  };

  // Stickers management
  const handleAddSticker = (type: MemeSticker['type'], emoji: string, label: string) => {
    const newSticker: MemeSticker = {
      id: `stk_${Date.now()}`,
      type,
      emoji,
      label,
      x: 50 + (Math.random() * 20 - 10),
      y: 50 + (Math.random() * 20 - 10),
      scale: 1,
      rotation: 0,
    };
    setStickers((prev) => [...prev, newSticker]);
  };

  const handleRemoveSticker = (id: string) => {
    setStickers((prev) => prev.filter((s) => s.id !== id));
  };

  // Rollback to historical snapshot (BUG FIX: properly restores custom imageSrc)
  const handleRollback = (snap: VersionSnapshot) => {
    if (snap.memeState.textLayers) {
      setTextLayers(snap.memeState.textLayers);
      setSelectedLayerId(snap.memeState.textLayers[0]?.id || null);
    }
    if (snap.memeState.filter) {
      setFilter(snap.memeState.filter);
    }
    if (snap.memeState.imageSrc) {
      setCurrentImageSrc(snap.memeState.imageSrc);
    }
    const matchedTpl = MEME_TEMPLATES.find((t) => t.id === snap.memeState.templateId);
    if (matchedTpl) {
      setActiveTemplate(matchedTpl);
    } else {
      setActiveTemplate(null);
    }
  };

  // Open Checkout Modal for Crypto / UPI template unlock
  const handleOpenCheckout = (template: MemeTemplate) => {
    setCheckoutTemplate(template);
    setIsCheckoutOpen(true);
  };

  // Handle successful Crypto purchase
  const handleSuccessCrypto = (templateId: string, amount: number, currency: 'ETH' | 'SOL' | 'MEME') => {
    setUnlockedTemplateIds((prev) => [...prev, templateId]);
    setWallet((prev) => ({
      ...prev,
      balances: {
        ...prev.balances,
        eth: Math.max(0, prev.balances.eth - (currency === 'ETH' ? amount : 0)),
        sol: Math.max(0, prev.balances.sol - (currency === 'SOL' ? amount : 0)),
        meme: Math.max(0, prev.balances.meme - (currency === 'MEME' ? amount : 0)),
      },
    }));

    const newTx: TransactionRecord = {
      id: `tx_${Date.now()}`,
      type: 'buy',
      method: 'crypto',
      amountStr: `-${amount} ${currency}`,
      itemTitle: checkoutTemplate?.name || 'Meme Template',
      timestamp: 'Just now',
      status: 'completed',
      txHash: `0x${Math.random().toString(16).slice(2, 10)}...`,
    };
    setTransactions((prev) => [newTx, ...prev]);

    // Automatically load template to canvas
    if (checkoutTemplate) {
      handleSelectTemplate(checkoutTemplate);
    }
  };

  // Handle successful UPI purchase
  const handleSuccessUpi = (templateId: string, amount: number, upiId: string, utr: string) => {
    setUnlockedTemplateIds((prev) => [...prev, templateId]);
    const newTx: TransactionRecord = {
      id: `tx_${Date.now()}`,
      type: 'buy',
      method: 'upi',
      amountStr: `-INR ${amount} (UPI)`,
      itemTitle: checkoutTemplate?.name || 'Meme Template',
      timestamp: 'Just now',
      status: 'completed',
      utr,
    };
    setTransactions((prev) => [newTx, ...prev]);

    if (checkoutTemplate) {
      handleSelectTemplate(checkoutTemplate);
    }
  };

  // Faucet grant (adds free testnet Crypto & UPI balance)
  const handleDepositFaucet = () => {
    setWallet((prev) => ({
      ...prev,
      balances: {
        ...prev.balances,
        eth: prev.balances.eth + 0.1,
        sol: prev.balances.sol + 2.5,
        meme: prev.balances.meme + 1000,
      },
    }));

    const newTx: TransactionRecord = {
      id: `tx_${Date.now()}`,
      type: 'deposit',
      method: 'crypto',
      amountStr: '+0.100 ETH & +INR 2,000 (UPI)',
      itemTitle: 'Testnet Faucet Grant',
      timestamp: 'Just now',
      status: 'completed',
      txHash: `0x${Math.random().toString(16).slice(2, 10)}...`,
    };
    setTransactions((prev) => [newTx, ...prev]);
  };

  // List current meme on marketplace
  const handleListMemeForSale = (listing: Partial<MarketplaceListing>) => {
    const canvas = canvasRef.current;
    let preview = currentImageSrc;
    if (canvas) {
      (canvas as any).drawCleanForExport?.();
      preview = canvas.toDataURL('image/png', 0.9);
      (canvas as any).restoreInteractiveSelection?.();
    }

    const newListing: MarketplaceListing = {
      id: `list_${Date.now()}`,
      templateId: `custom_${Date.now()}`,
      title: listing.title || 'Community Viral Meme',
      creator: wallet.address,
      category: 'Community',
      mood: listing.mood || 'Sarcastic',
      priceCrypto: listing.priceCrypto || 0.005,
      cryptoCurrency: 'ETH',
      priceUpiInr: listing.priceUpiInr || 49,
      previewImage: preview,
      likes: 1,
    };

    setMarketplaceListings((prev) => [newListing, ...prev]);

    const newTx: TransactionRecord = {
      id: `tx_${Date.now()}`,
      type: 'sell',
      method: 'crypto',
      amountStr: `Listed @ ${newListing.priceCrypto} ETH`,
      itemTitle: newListing.title,
      timestamp: 'Just now',
      status: 'completed',
    };
    setTransactions((prev) => [newTx, ...prev]);
  };

  // BUG FIX: Pristine download without selection rectangle baked in
  const handleDownload = (format: 'png' | 'jpeg' | 'webp' = 'png') => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Draw clean without dashed selection box
    (canvas as any).drawCleanForExport?.();

    const mimeType =
      format === 'jpeg' ? 'image/jpeg' : format === 'webp' ? 'image/webp' : 'image/png';
    const dataUrl = canvas.toDataURL(mimeType, 0.95);

    // Restore interactive selection box
    (canvas as any).restoreInteractiveSelection?.();

    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `meme_${Date.now()}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // BUG FIX: Pristine clipboard copy without selection rectangle baked in
  const handleCopyToClipboard = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Draw clean without dashed selection box
    (canvas as any).drawCleanForExport?.();

    try {
      canvas.toBlob(async (blob) => {
        // Restore interactive selection box
        (canvas as any).restoreInteractiveSelection?.();

        if (!blob) return;
        try {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob }),
          ]);
          setCopiedToast(true);
          setTimeout(() => setCopiedToast(false), 3000);
        } catch (err) {
          console.warn('Clipboard write failed:', err);
          handleDownload('png');
        }
      }, 'image/png');
    } catch (e) {
      (canvas as any).restoreInteractiveSelection?.();
      console.warn('Clipboard error:', e);
    }
  };

  const handleUpdateAudioConfig = (updates: Partial<MemeAudioConfig>) => {
    setAudioConfig((prev) => ({ ...prev, ...updates }));
  };

  // Play/Stop attached meme audio effect
  const handlePlayMemeAudio = () => {
    if (isPlayingAudio) {
      stopMemeAudio();
      setIsPlayingAudio(false);
      return;
    }

    if (!audioConfig.selectedEffectId && !audioConfig.customAudioUrl) {
      return;
    }

    setIsPlayingAudio(true);
    playMemeAudio(audioConfig, () => {
      setIsPlayingAudio(false);
    });
  };

  // Export Meme Video (.webm / .mp4) with embedded Audio Track
  const handleExportVideoWithAudio = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      setIsExportingVideo(true);
      setExportProgress({ percent: 10, status: 'Preparing audio stream & canvas frames...' });

      // Clean canvas without dashed bounding box
      (canvas as any).drawCleanForExport?.();

      const blob = await exportMemeVideoWithAudio(canvas, audioConfig, (percent, status) => {
        setExportProgress({ percent, status });
      });

      // Restore interactive selection box
      (canvas as any).restoreInteractiveSelection?.();

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `meme_video_${Date.now()}.webm`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 2000);

      setIsExportingVideo(false);
      setExportProgress(null);
    } catch (err) {
      console.warn('Video export error:', err);
      (canvas as any).restoreInteractiveSelection?.();
      setIsExportingVideo(false);
      setExportProgress(null);
    }
  };

  // Paste image directly into canvas with Ctrl+V
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
              const dataUri = event.target?.result as string;
              if (dataUri) {
                handleCustomImageUpload(dataUri, 'Pasted Clipboard Image');
              }
            };
            reader.readAsDataURL(file);
          }
          break;
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Main Navigation Header */}
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/80 px-4 sm:px-6 py-3 flex items-center justify-between">
        {/* Logo lockup */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-purple-600 to-indigo-600 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/20">
            <span className="text-xl">🔥</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-black tracking-tight bg-gradient-to-r from-amber-400 via-purple-300 to-cyan-300 bg-clip-text text-transparent">
                MemeForge AI
              </h1>
              <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30 uppercase tracking-widest hidden sm:inline-block">
                Studio
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Magic Caption • Live Editor • Crypto &amp; UPI Marketplace • Sora Video
            </p>
          </div>
        </div>

        {/* Studio Navigation Tabs */}
        <div className="flex items-center p-1 bg-slate-900 rounded-2xl border border-slate-800">
          <button
            onClick={() => setActiveTab('meme')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'meme'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span className="text-sm">🎭</span>
            <span>Meme Studio</span>
          </button>

          <button
            onClick={() => setActiveTab('market')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'market'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Marketplace</span>
          </button>

          <button
            onClick={() => setActiveTab('sora')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'sora'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            <span>Sora Video</span>
          </button>

          <button
            onClick={() => setActiveTab('cinema')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'cinema'
                ? 'bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 text-white shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Boxes className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Cinema VFX (32K)</span>
            <span className="sm:hidden">32K VFX</span>
          </button>

          <button
            onClick={() => setActiveTab('team')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'team'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Team Hub</span>
            <span className="sm:hidden">Team</span>
          </button>
        </div>

        {/* Top Right Quick Actions */}
        <div className="flex items-center gap-2">
          {/* PWA Install Button */}
          <PWAInstallButton />

          {/* Subscription Plan button (Individual ₹999/mo or Team ₹99,999/mo) */}
          <button
            onClick={() => {
              setSubscriptionModalCategory(subscription.plan === 'company_team' ? 'company' : 'individual');
              setIsSubscriptionModalOpen(true);
            }}
            className={`p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all shadow-sm ${
              subscription.isActive && subscription.plan === 'company_team'
                ? 'bg-gradient-to-r from-purple-600/30 via-indigo-600/30 to-cyan-500/30 hover:from-purple-600/40 text-cyan-300 border border-cyan-500/50'
                : subscription.isActive && subscription.plan === 'india_pro'
                ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 hover:from-emerald-500/30 text-emerald-300 border border-emerald-500/40'
                : 'bg-gradient-to-r from-amber-500/20 via-purple-500/20 to-indigo-500/20 hover:from-amber-500/30 text-amber-300 hover:text-white border border-amber-500/40 animate-pulse'
            }`}
            title="Manage Subscriptions: Individual Pro (₹999/mo) or Team Enterprise (₹99,999/mo)"
          >
            {subscription.isActive && subscription.plan === 'company_team' ? (
              <Building2 className="w-4 h-4 text-cyan-400" />
            ) : (
              <Crown className="w-4 h-4 text-amber-400" />
            )}
            <span className="w-3.5 h-2.5 rounded-xs overflow-hidden flex flex-col border border-white/20 shrink-0">
              <span className="h-1/3 bg-[#FF9933] w-full" />
              <span className="h-1/3 bg-white w-full flex items-center justify-center">
                <span className="w-0.5 h-0.5 rounded-full bg-[#000080]" />
              </span>
              <span className="h-1/3 bg-[#138808] w-full" />
            </span>
            <span className="hidden sm:inline">
              {subscription.isActive && subscription.plan === 'company_team'
                ? 'Team Active (Rs. 99,999)'
                : subscription.isActive && subscription.plan === 'india_pro'
                ? 'Pro Active (Rs. 999)'
                : 'Plans: Rs. 999 / Rs. 99,999'}
            </span>
            <span className="sm:hidden">
              {subscription.isActive && subscription.plan === 'company_team'
                ? 'Team'
                : subscription.isActive && subscription.plan === 'india_pro'
                ? 'Pro'
                : 'Plans'}
            </span>
          </button>

          {/* Android APK & AAB Packaging Modal Button */}
          <button
            onClick={() => setIsAndroidModalOpen(true)}
            className="p-2 sm:px-3 sm:py-2 bg-gradient-to-r from-emerald-500/15 to-cyan-500/15 hover:from-emerald-500/25 hover:to-cyan-500/25 text-emerald-300 hover:text-emerald-200 rounded-xl border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
            title="Build and export Android APK & AAB packages"
          >
            <Smartphone className="w-4 h-4 text-emerald-400" />
            <span className="hidden md:inline">Export APK &amp; AAB</span>
            <span className="md:hidden">APK / AAB</span>
          </button>

          {/* AI Co-Director / Comedy writer button */}
          <button
            onClick={() => setIsDirectorChatOpen(true)}
            className="p-2 sm:px-3 sm:py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-amber-300 rounded-xl border border-slate-800 text-xs font-bold flex items-center gap-1.5 transition-colors"
            title="Ask AI Co-Director for joke ideas"
          >
            <MessageSquare className="w-4 h-4 text-purple-400" />
            <span className="hidden lg:inline">AI Co-Director</span>
          </button>

          {/* Core Feature: Magic Caption Prominent Button */}
          {activeTab === 'meme' && (
            <button
              onClick={() => setIsMagicCaptionOpen(true)}
              className="px-3.5 py-2 bg-gradient-to-r from-amber-500 via-purple-600 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-white font-black text-xs rounded-xl flex items-center gap-1.5 shadow-lg shadow-purple-500/25 transition-all hover:scale-105 active:scale-95 animate-pulse"
            >
              <Wand2 className="w-4 h-4 text-amber-300" />
              <span>Magic Caption</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Studio Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 space-y-6">
        {/* TAB 1: MEME GENERATOR & LIVE EDITOR */}
        {activeTab === 'meme' && (
          <div className="space-y-6">
            {/* Top Workspace Grid: Canvas (Left/Center) + Live Editor (Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left & Center: Canvas Viewport (7 cols) */}
              <div className="lg:col-span-7 space-y-4">
                <MemeCanvas
                  imageSrc={currentImageSrc}
                  textLayers={textLayers}
                  stickers={stickers}
                  filter={filter}
                  aspectRatio={aspectRatio}
                  selectedLayerId={selectedLayerId}
                  onSelectLayer={setSelectedLayerId}
                  onUpdateLayerPosition={handleUpdateLayerPosition}
                  canvasRefOut={canvasRef}
                  isPlayingAudio={isPlayingAudio}
                  activeAudioName={audioConfig.customAudioName || activeAudioEffect?.name}
                />

                {/* Quick Action Bar under Canvas */}
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-lg">
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => setIsMagicCaptionOpen(true)}
                      className="px-3.5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs rounded-xl flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition-all"
                    >
                      <Wand2 className="w-3.5 h-3.5" />
                      Magic Caption AI
                    </button>

                    <button
                      onClick={handleAddLayer}
                      className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors border border-slate-700"
                    >
                      <Plus className="w-3.5 h-3.5 text-amber-400" />
                      Add Text
                    </button>

                    {/* Audio Layer Quick Test Controls */}
                    {(audioConfig.selectedEffectId || audioConfig.customAudioUrl) && (
                      <div className="flex items-center gap-1.5 p-1 px-2 bg-slate-950 border border-amber-500/30 rounded-xl">
                        <span className="text-sm">{activeAudioEffect?.emoji || '🎵'}</span>
                        <span className="text-xs font-bold text-amber-300 hidden md:inline truncate max-w-[100px]">
                          {audioConfig.customAudioName || activeAudioEffect?.name || 'Meme SFX'}
                        </span>
                        <button
                          onClick={handlePlayMemeAudio}
                          className={`px-2 py-1 text-xs font-bold rounded-lg flex items-center gap-1 transition-all ${
                            isPlayingAudio
                              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                              : 'bg-slate-800 hover:bg-slate-700 text-amber-300'
                          }`}
                          title="Play Meme with attached audio"
                        >
                          {isPlayingAudio ? (
                            <>
                              <Square className="w-3 h-3 fill-current" />
                              <span>Stop</span>
                            </>
                          ) : (
                            <>
                              <Play className="w-3 h-3 fill-current" />
                              <span>Play Sound</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}

                    {/* Sell on Marketplace Quick Button */}
                    <button
                      onClick={() => {
                        handleListMemeForSale({
                          title: activeTemplate?.name || 'Custom Viral Meme',
                          mood: activeTemplate?.mood || 'Sarcastic',
                          priceCrypto: 0.005,
                          priceUpiInr: 49,
                        });
                        setActiveTab('market');
                      }}
                      className="px-3 py-2 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 font-bold text-xs rounded-xl border border-emerald-500/30 flex items-center gap-1.5 transition-all"
                      title="Sell this created meme on the marketplace for Crypto & UPI"
                    >
                      <Coins className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="hidden sm:inline">Sell Meme</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Quick Video Export Button when Audio is Attached */}
                    {(audioConfig.selectedEffectId || audioConfig.customAudioUrl) && (
                      <button
                        onClick={handleExportVideoWithAudio}
                        disabled={isExportingVideo}
                        className="px-3 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs rounded-xl shadow-md shadow-purple-600/20 transition-all flex items-center gap-1.5"
                        title="Export Video Meme with Audio (.webm)"
                      >
                        <Film className="w-3.5 h-3.5 text-amber-300" />
                        <span className="hidden sm:inline">
                          {isExportingVideo ? 'Exporting...' : 'Export Video'}
                        </span>
                      </button>
                    )}

                    <button
                      onClick={handleCopyToClipboard}
                      className="px-3 py-2 bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-bold rounded-xl border border-slate-800 transition-colors flex items-center gap-1.5"
                    >
                      {copiedToast ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          Copy
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleDownload('png')}
                      className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold rounded-xl shadow-md shadow-amber-500/20 transition-all flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Export PNG
                    </button>
                  </div>
                </div>
              </div>

              {/* Right: Live Customizer Editor Toolbar (5 cols) */}
              <div className="lg:col-span-5">
                <MemeToolbar
                  textLayers={textLayers}
                  selectedLayerId={selectedLayerId}
                  onSelectLayer={setSelectedLayerId}
                  onUpdateLayer={handleUpdateLayer}
                  onAddLayer={handleAddLayer}
                  onRemoveLayer={handleRemoveLayer}
                  stickers={stickers}
                  onAddSticker={handleAddSticker}
                  onRemoveSticker={handleRemoveSticker}
                  filter={filter}
                  onFilterChange={(f) => {
                    setFilter(f);
                    recordSnapshot(`Applied filter: ${f}`);
                  }}
                  aspectRatio={aspectRatio}
                  onAspectRatioChange={(r) => {
                    setAspectRatio(r);
                    recordSnapshot(`Changed aspect ratio to ${r}`);
                  }}
                  onDownload={handleDownload}
                  onCopyToClipboard={handleCopyToClipboard}
                  copiedToast={copiedToast}
                  audioConfig={audioConfig}
                  onChangeAudioConfig={handleUpdateAudioConfig}
                  onExportVideoWithAudio={handleExportVideoWithAudio}
                  isExportingVideo={isExportingVideo}
                  exportProgress={exportProgress}
                />
              </div>
            </div>

            {/* Bottom: Trending Meme Templates with Tag & Mood Filter */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                    <span>Meme Template Library &amp; Mood Filters</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Filter by Mood (Sad, Sarcastic, Big Brain), Category (Classic, Trending), or custom Tags
                  </p>
                </div>
              </div>

              <MemeTemplateSelector
                onSelectTemplate={handleSelectTemplate}
                onCustomImageUpload={handleCustomImageUpload}
                activeTemplateId={activeTemplate?.id || null}
                onOpenCheckout={handleOpenCheckout}
                unlockedTemplateIds={unlockedTemplateIds}
              />
            </div>
          </div>
        )}

        {/* TAB 2: MARKETPLACE & CRYPTO / UPI HUB */}
        {activeTab === 'market' && (
          <MarketplaceTab
            wallet={wallet}
            transactions={transactions}
            onOpenCheckout={handleOpenCheckout}
            onDepositFaucet={handleDepositFaucet}
            currentCanvasImage={currentImageSrc}
            onListMemeForSale={handleListMemeForSale}
            listings={marketplaceListings}
          />
        )}

        {/* TAB 3: SORA VIDEO STUDIO */}
        {activeTab === 'sora' && (
          <SoraStudioTab
            subscription={subscription}
            onOpenSubscriptionModal={() => setIsSubscriptionModalOpen(true)}
            onOpenCinemaVfx={() => setActiveTab('cinema')}
          />
        )}

        {/* TAB 4: CINEMA VFX STUDIO (32K / 1000 FPS / 192 kHz) */}
        {activeTab === 'cinema' && (
          <CinemaVfxEditorTab
            subscription={subscription}
            onOpenSubscriptionModal={() => setIsSubscriptionModalOpen(true)}
          />
        )}

        {/* TAB 5: TEAM WORKSPACE & COLLABORATION */}
        {activeTab === 'team' && (
          <TeamWorkspaceTab
            versionHistory={versionHistory}
            onRollback={handleRollback}
            subscription={subscription}
            onOpenSubscriptionModal={(category?: 'individual' | 'company') => {
              setSubscriptionModalCategory(category || 'company');
              setIsSubscriptionModalOpen(true);
            }}
          />
        )}
      </main>

      {/* Floating Magic Caption Modal */}
      <MagicCaptionModal
        isOpen={isMagicCaptionOpen}
        onClose={() => setIsMagicCaptionOpen(false)}
        onSelectCaption={handleApplyMagicCaption}
        currentImagePreview={currentImageSrc}
        templateName={activeTemplate?.name || 'Custom Image'}
      />

      {/* Floating AI Co-Director Chat Modal */}
      <AiDirectorChatModal
        isOpen={isDirectorChatOpen}
        onClose={() => setIsDirectorChatOpen(false)}
      />

      {/* Floating Android APK & AAB Packaging Modal */}
      <AndroidPackageModal
        isOpen={isAndroidModalOpen}
        onClose={() => setIsAndroidModalOpen(false)}
      />

      {/* Floating Marketplace Crypto & UPI Checkout Modal */}
      <MarketplaceCheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onSwitchToMemeStudio={() => {
          setIsCheckoutOpen(false);
          setActiveTab('meme');
        }}
        template={checkoutTemplate}
        wallet={wallet}
        onSuccessCrypto={handleSuccessCrypto}
        onSuccessUpi={handleSuccessUpi}
        onDepositFaucet={handleDepositFaucet}
      />

      {/* India Creator Pro (₹999 / mo) & Team Enterprise (₹99,999 / mo) Subscription Modal */}
      <SubscriptionModal
        isOpen={isSubscriptionModalOpen}
        onClose={() => setIsSubscriptionModalOpen(false)}
        subscription={subscription}
        initialPlanCategory={subscriptionModalCategory}
        onUpdateSubscription={(updated) => {
          setSubscription(updated);
          try {
            localStorage.setItem('memeforge_subscription', JSON.stringify(updated));
          } catch (e) {
            console.error(e);
          }
        }}
      />

      {/* Footer info bar */}
      <footer className="mt-auto border-t border-slate-900 bg-slate-950 px-4 py-3 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>MemeForge AI Studio • 2026 Edition</span>
        </div>
        <div className="text-[11px] text-slate-500">
          Paste any image with <kbd className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 font-mono">Ctrl+V</kbd> • Click &amp; drag text to reposition
        </div>
      </footer>
    </div>
  );
}
