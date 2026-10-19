import type { TextLayer } from '../types/meme';

export type MemeFontFamily =
  | 'Impact'
  | 'Anton'
  | 'Bebas Neue'
  | 'Montserrat'
  | 'Permanent Marker'
  | 'Orbitron'
  | 'Comic Sans MS'
  | 'Oswald'
  | 'Inter';

export interface TextStylePreset {
  id: string;
  name: string;
  badge: string;
  emoji: string;
  category: 'Classic' | 'Neon & Cyber' | 'Modern & Clean' | 'Chaos & Funny';
  fontFamily: MemeFontFamily;
  textColor: string;
  outlineColor: string;
  outlineWidth: number;
  backgroundColor: string;
  isUppercase: boolean;
  isBold: boolean;
  shadow: boolean;
  description: string;
}

export const MEME_STYLE_PRESETS: TextStylePreset[] = [
  {
    id: 'classic_impact',
    name: 'Classic Impact',
    badge: 'Legendary',
    emoji: '👑',
    category: 'Classic',
    fontFamily: 'Impact',
    textColor: '#ffffff',
    outlineColor: '#000000',
    outlineWidth: 4,
    backgroundColor: 'transparent',
    isUppercase: true,
    isBold: true,
    shadow: true,
    description: 'The immortal 2010s Advice Animal white on black stroke standard.',
  },
  {
    id: 'deep_fried_chaos',
    name: 'Deep Fried Chaos',
    badge: 'Viral',
    emoji: '🔥',
    category: 'Chaos & Funny',
    fontFamily: 'Anton',
    textColor: '#facc15',
    outlineColor: '#dc2626',
    outlineWidth: 5,
    backgroundColor: 'transparent',
    isUppercase: true,
    isBold: true,
    shadow: true,
    description: 'Screaming yellow with aggressive red outline for chaotic punchlines.',
  },
  {
    id: 'twitter_subtitle',
    name: 'Twitter / Subtitle Pill',
    badge: 'Modern',
    emoji: '💬',
    category: 'Modern & Clean',
    fontFamily: 'Inter',
    textColor: '#ffffff',
    outlineColor: '#000000',
    outlineWidth: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.82)',
    isUppercase: false,
    isBold: false,
    shadow: false,
    description: 'Clean dark rounded background pill, modern tweet & movie subtitle vibe.',
  },
  {
    id: 'cyberpunk_neon',
    name: 'Cyberpunk Neon',
    badge: 'Glow FX',
    emoji: '⚡',
    category: 'Neon & Cyber',
    fontFamily: 'Orbitron',
    textColor: '#06b6d4',
    outlineColor: '#4c1d95',
    outlineWidth: 4,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    isUppercase: true,
    isBold: true,
    shadow: true,
    description: 'Electric cyan with deep purple outline and neon sci-fi box.',
  },
  {
    id: 'stonks_profit',
    name: 'Stonks Green',
    badge: 'Profit',
    emoji: '📈',
    category: 'Classic',
    fontFamily: 'Impact',
    textColor: '#22c55e',
    outlineColor: '#052e16',
    outlineWidth: 4,
    backgroundColor: 'transparent',
    isUppercase: true,
    isBold: true,
    shadow: true,
    description: 'Emerald green financial powerhouse for crypto & stonks memes.',
  },
  {
    id: 'dramatic_horror',
    name: 'Panic Red Alert',
    badge: 'Intense',
    emoji: '🚨',
    category: 'Chaos & Funny',
    fontFamily: 'Anton',
    textColor: '#ef4444',
    outlineColor: '#000000',
    outlineWidth: 5,
    backgroundColor: 'transparent',
    isUppercase: true,
    isBold: true,
    shadow: true,
    description: 'High-stress crimson red with thick black border for emergency panic.',
  },
  {
    id: 'graffiti_rebel',
    name: 'Graffiti Marker',
    badge: 'Handmade',
    emoji: '🎨',
    category: 'Chaos & Funny',
    fontFamily: 'Permanent Marker',
    textColor: '#f43f5e',
    outlineColor: '#000000',
    outlineWidth: 4,
    backgroundColor: 'transparent',
    isUppercase: false,
    isBold: true,
    shadow: true,
    description: 'Expressive streetwear permanent marker with dark outline.',
  },
  {
    id: 'gold_vip',
    name: 'Gold Luxe VIP',
    badge: 'Flex',
    emoji: '💎',
    category: 'Classic',
    fontFamily: 'Montserrat',
    textColor: '#fef08a',
    outlineColor: '#713f12',
    outlineWidth: 3,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    isUppercase: true,
    isBold: true,
    shadow: true,
    description: '24K metallic gold with bronze outline for flexes and rich memes.',
  },
  {
    id: 'comic_doge',
    name: 'Doge Comic Sans',
    badge: 'Very Meme',
    emoji: '🐕',
    category: 'Chaos & Funny',
    fontFamily: 'Comic Sans MS',
    textColor: '#38bdf8',
    outlineColor: '#000000',
    outlineWidth: 3,
    backgroundColor: 'transparent',
    isUppercase: false,
    isBold: true,
    shadow: true,
    description: 'Much wow. Very ironic comic sans for legendary doge posts.',
  },
  {
    id: 'bebas_editorial',
    name: 'Bebas Headline',
    badge: 'Clean',
    emoji: '📰',
    category: 'Modern & Clean',
    fontFamily: 'Bebas Neue',
    textColor: '#f8fafc',
    outlineColor: '#0f172a',
    outlineWidth: 3,
    backgroundColor: 'transparent',
    isUppercase: true,
    isBold: true,
    shadow: false,
    description: 'Tall condensed headline typography with crisp contrast.',
  },
  {
    id: 'vaporwave_synth',
    name: 'Vaporwave 1984',
    badge: 'Retro',
    emoji: '🌸',
    category: 'Neon & Cyber',
    fontFamily: 'Oswald',
    textColor: '#e879f9',
    outlineColor: '#0284c7',
    outlineWidth: 3,
    backgroundColor: 'rgba(46, 16, 101, 0.7)',
    isUppercase: true,
    isBold: true,
    shadow: true,
    description: 'Nostalgic 80s synthwave magenta & cyan with dark purple backdrop.',
  },
  {
    id: 'hazard_yellow',
    name: 'Caution Warning',
    badge: 'Bold',
    emoji: '⚠️',
    category: 'Modern & Clean',
    fontFamily: 'Impact',
    textColor: '#000000',
    outlineColor: '#facc15',
    outlineWidth: 3,
    backgroundColor: '#facc15',
    isUppercase: true,
    isBold: true,
    shadow: false,
    description: 'High visibility hazard warning black-on-yellow sign box.',
  },
];

// Helper to apply preset styles to a layer while preserving text and coordinates
export function applyStylePresetToLayer(
  layer: TextLayer,
  preset: TextStylePreset
): TextLayer {
  return {
    ...layer,
    fontFamily: preset.fontFamily,
    textColor: preset.textColor,
    outlineColor: preset.outlineColor,
    outlineWidth: preset.outlineWidth,
    backgroundColor: preset.backgroundColor,
    isUppercase: preset.isUppercase,
    isBold: preset.isBold,
    shadow: preset.shadow,
  };
}
