export type MemeMood =
  | 'Sad'
  | 'Happy'
  | 'Panic'
  | 'Sarcastic'
  | 'Big Brain'
  | 'Smug'
  | 'Angry'
  | 'Confused'
  | 'Wholesome';

export interface TemplatePrice {
  crypto: number;
  cryptoCurrency: 'ETH' | 'SOL' | 'MEME';
  upiInr: number;
  isPremium: boolean;
}

export interface TextLayer {
  id: string;
  text: string;
  x: number; // percentage 0-100 of canvas width
  y: number; // percentage 0-100 of canvas height
  fontSize: number; // in pixels at standard 800px width
  fontFamily: 'Impact' | 'Anton' | 'Bebas Neue' | 'Montserrat' | 'Permanent Marker' | 'Orbitron' | 'Comic Sans MS' | 'Oswald' | 'Inter';
  textColor: string;
  outlineColor: string;
  outlineWidth: number; // in px
  backgroundColor: string; // 'transparent' or rgba/hex
  textAlign: 'left' | 'center' | 'right';
  isUppercase: boolean;
  isBold: boolean;
  shadow: boolean;
  rotation: number; // degrees
}

export interface MemeSticker {
  id: string;
  type: 'deal_with_it' | 'laser_eyes' | 'stonks' | 'not_stonks' | 'hundred' | 'fire' | 'skull' | 'clown' | 'verified' | 'sparkle' | 'pepe_smile' | 'crying_laughing';
  label: string;
  emoji: string;
  x: number; // 0-100%
  y: number; // 0-100%
  scale: number;
  rotation: number;
}

export interface MemeTemplate {
  id: string;
  name: string;
  category: 'Classic' | 'Reaction' | 'Trending' | 'Two-Panel' | 'Multi-Panel' | 'Sad' | 'Community';
  mood: MemeMood;
  tags: string[];
  defaultTopText: string;
  defaultBottomText: string;
  aspectRatio: '1:1' | '4:3' | '16:9' | '9:16' | '3:4';
  svgDataUri: string;
  description: string;
  price?: TemplatePrice;
  isUnlocked?: boolean;
  author?: string;
  salesCount?: number;
}

export interface MagicCaption {
  topText: string;
  bottomText: string;
  singleLine: string;
  vibe: string;
  category: string;
}

export type CanvasFilter = 'none' | 'deep_fried' | 'vintage' | 'high_contrast' | 'cyberpunk' | 'grayscale' | 'warm';

export interface VideoProjectSpec {
  title: string;
  prompt: string;
  negativePrompt: string;
  resolution: '720p HD' | '1080p FHD' | '4K Ultra';
  frameRate: 24 | 30 | 60 | 120;
  aspectRatio: '16:9' | '9:16' | '1:1' | '21:9';
  cameraMotion: 'Static' | 'Dolly Zoom In' | 'Pan Right' | 'Tilt Up' | 'Orbit 360' | 'FPV Drone Dive';
  style: 'Photorealistic' | 'Cyberpunk Neon' | 'Cinematic Film 35mm' | 'Anime Ethereal' | 'Retro VHS';
}

export interface VersionSnapshot {
  id: string;
  tag: string;
  timestamp: string;
  author: string;
  role: string;
  note: string;
  memeState: {
    templateId: string;
    imageSrc?: string;
    textLayers: TextLayer[];
    filter: CanvasFilter;
  };
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'Owner' | 'Director' | 'Meme Lord' | 'VFX Artist' | 'Reviewer';
  avatarColor: string;
  isOnline: boolean;
  activity: string;
}

// Marketplace & Crypto / UPI Types
export interface CryptoWalletState {
  connected: boolean;
  address: string;
  network: string;
  balances: {
    eth: number;
    sol: number;
    meme: number;
    usdt: number;
  };
}

export interface TransactionRecord {
  id: string;
  type: 'buy' | 'sell' | 'deposit';
  method: 'crypto' | 'upi';
  amountStr: string;
  itemTitle: string;
  timestamp: string;
  status: 'completed' | 'pending';
  txHash?: string;
  utr?: string;
}

export interface MarketplaceListing {
  id: string;
  templateId: string;
  title: string;
  creator: string;
  category: string;
  mood: MemeMood;
  priceCrypto: number;
  cryptoCurrency: 'ETH' | 'SOL' | 'MEME';
  priceUpiInr: number;
  previewImage: string;
  likes: number;
  isSoldOut?: boolean;
}

// Audio Layer & Meme Sound Effects Types
export interface MemeAudioEffect {
  id: string;
  name: string;
  category: 'Classic' | 'Reactions' | 'Dramatic' | 'Gaming' | 'Funny';
  emoji: string;
  durationSec: number;
  description: string;
  type: 'builtin' | 'custom';
  tags: string[];
}

export interface MemeAudioConfig {
  selectedEffectId: string | null;
  volume: number; // 0.0 - 1.0
  playbackRate: number; // 0.5 - 2.0
  loop: boolean;
  delaySec: number; // 0.0 - 3.0
  customAudioUrl?: string;
  customAudioName?: string;
}
