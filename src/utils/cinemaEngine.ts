import {
  ResolutionPreset,
  ResolutionConfig,
  FrameRatePreset,
  ColorBitDepth,
  ColorSpaceStandard,
  HdrStandard,
  AudioSampleRate,
  AudioBitDepth,
  AudioChannelLayout,
  ProCodec,
  ProxyQuality,
  CinemaProjectSpec,
} from '../types/cinemaEngine';

/**
 * High-precision 64-bit timebase tick frequency:
 * 120,000,000,000 ticks per second (120 billion ticks/sec).
 * Even at 1000 FPS, each frame spans exactly 120,000,000 ticks with zero remainder!
 */
export const TICKS_PER_SECOND_64: bigint = 120_000_000_000n;

export const CINEMA_RESOLUTIONS: ResolutionConfig[] = [
  {
    id: '720p HD',
    label: '720p HD (1280×720)',
    width: 1280,
    height: 720,
    aspectRatio: '16:9',
    pixelCount: 921_600,
    megapixels: 0.92,
    vramEstimateGbPerFrame: 0.0037, // 32-bit float
    category: 'Consumer',
  },
  {
    id: '1080p FHD',
    label: '1080p FHD Broadcast (1920×1080)',
    width: 1920,
    height: 1080,
    aspectRatio: '16:9',
    pixelCount: 2_073_600,
    megapixels: 2.07,
    vramEstimateGbPerFrame: 0.033,
    category: 'Consumer',
  },
  {
    id: '2K DCI',
    label: '2K DCI Cinema Scope (2048×1080)',
    width: 2048,
    height: 1080,
    aspectRatio: '1.90:1',
    pixelCount: 2_211_840,
    megapixels: 2.21,
    vramEstimateGbPerFrame: 0.035,
    category: 'Cinema',
  },
  {
    id: '4K Ultra',
    label: '4K DCI Production (4096×2160)',
    width: 4096,
    height: 2160,
    aspectRatio: '1.90:1',
    pixelCount: 8_847_360,
    megapixels: 8.85,
    vramEstimateGbPerFrame: 0.141,
    category: 'Cinema',
  },
  {
    id: '8K UHD',
    label: '8K Master Vista (7680×4320)',
    width: 7680,
    height: 4320,
    aspectRatio: '16:9',
    pixelCount: 33_177_600,
    megapixels: 33.18,
    vramEstimateGbPerFrame: 0.531,
    category: 'VFX Master',
  },
  {
    id: '12K Blackmagic',
    label: '12K Super35 RAW (12288×6480)',
    width: 12288,
    height: 6480,
    aspectRatio: '17:9',
    pixelCount: 79_626_240,
    megapixels: 79.63,
    vramEstimateGbPerFrame: 1.274,
    category: 'VFX Master',
  },
  {
    id: '16K Master',
    label: '16K Ultra Archival (15360×8640)',
    width: 15360,
    height: 8640,
    aspectRatio: '16:9',
    pixelCount: 132_710_400,
    megapixels: 132.71,
    vramEstimateGbPerFrame: 2.123,
    category: 'VFX Master',
  },
  {
    id: '32K Ultra Master',
    label: '32K IMAX OmniMaster (32000×32000)',
    width: 32000,
    height: 32000,
    aspectRatio: '1:1 Omnimax',
    pixelCount: 1_024_000_000,
    megapixels: 1024.0, // 1.024 GIGAPIXELS
    vramEstimateGbPerFrame: 16.384, // 32000 * 32000 * 4 channels * 4 bytes = 16.384 GB per raw uncompressed frame!
    category: 'Future IMAX',
  },
];

export const CINEMA_FRAME_RATES: FrameRatePreset[] = [
  23.976,
  24,
  25,
  29.97,
  30,
  48,
  50,
  59.94,
  60,
  90,
  120,
  144,
  165,
  240,
  360,
  480,
  600,
  960,
  1000,
];

export const AUDIO_SAMPLE_RATES: AudioSampleRate[] = [
  44100,
  48000,
  88200,
  96000,
  176400,
  192000,
];

export const COLOR_BIT_DEPTHS: ColorBitDepth[] = [
  '8-bit Integer',
  '10-bit Rec.2020',
  '12-bit Cinema',
  '16-bit Half-Float',
  '32-bit Float',
  '64-bit Float Master',
];

export const COLOR_SPACES: ColorSpaceStandard[] = [
  'Rec.709',
  'Rec.2020',
  'DCI-P3',
  'BT.2100',
  'ACES 2.0 AP0',
  'ACEScc / ACEScct',
  'OpenColorIO (OCIO v2)',
];

export const HDR_STANDARDS: HdrStandard[] = [
  'SDR',
  'HDR10',
  'HDR10+',
  'HDR10+ Adaptive',
  'Dolby Vision Profile 8.4',
  'Dolby Vision Profile 7 (Dual Layer)',
  'HLG (Hybrid Log-Gamma)',
];

export const PRO_CODECS: ProCodec[] = [
  'Apple ProRes 4444 XQ',
  'Apple ProRes 422 HQ',
  'Avid DNxHR HQX',
  'GoPro CineForm RAW',
  'OpenEXR 32-bit Float Sequence',
  'AOMedia AV1 (12-bit)',
  'HEVC / H.265 (10-bit 4:2:2)',
  'H.264 Broadcast',
  'TIFF 16-bit Sequence',
  'JPEG XL (JXL HDR)',
];

/**
 * Returns byte multiplier per RGBA pixel given color bit depth
 */
export function getBytesPerPixel(bitDepth: ColorBitDepth): number {
  switch (bitDepth) {
    case '8-bit Integer':
      return 4; // 1 byte * 4 channels (RGBA)
    case '10-bit Rec.2020':
      return 5; // Packed 10-bit
    case '12-bit Cinema':
      return 6;
    case '16-bit Half-Float':
      return 8; // 2 bytes * 4 channels
    case '32-bit Float':
      return 16; // 4 bytes * 4 channels
    case '64-bit Float Master':
      return 32; // 8 bytes * 4 channels
    default:
      return 16;
  }
}

/**
 * Calculates raw uncompressed bandwidth and VRAM metrics for ultra-scale rendering
 */
export interface UltraComputeMetrics {
  totalPixels: number;
  megapixels: number;
  gigapixels: number;
  frameSizeBytes: number;
  frameSizeMb: number;
  frameSizeGb: number;
  throughputGbps: number;
  throughputTbPerHour: number;
  recommendedProxy: ProxyQuality;
  clusterNodesRecommended: number;
}

export function calculateUltraComputeMetrics(
  width: number,
  height: number,
  fps: number,
  bitDepth: ColorBitDepth = '32-bit Float'
): UltraComputeMetrics {
  const totalPixels = width * height;
  const megapixels = totalPixels / 1_000_000;
  const gigapixels = totalPixels / 1_000_000_000;
  const bpp = getBytesPerPixel(bitDepth);

  const frameSizeBytes = totalPixels * bpp;
  const frameSizeMb = frameSizeBytes / (1024 * 1024);
  const frameSizeGb = frameSizeBytes / (1024 * 1024 * 1024);

  // Bandwidth in Gigabits per second
  const throughputGbps = (frameSizeBytes * fps * 8) / 1_000_000_000;

  // Uncompressed storage in Terabytes per hour
  const throughputTbPerHour = (frameSizeBytes * fps * 3600) / (1024 * 1024 * 1024 * 1024);

  // Auto recommend proxy quality for smooth timeline preview on standard computers
  let recommendedProxy: ProxyQuality = '1:1 Full Master';
  let clusterNodesRecommended = 1;

  if (megapixels > 500) {
    // 32K (1024 MP)
    recommendedProxy = '1/16 Super Proxy';
    clusterNodesRecommended = Math.ceil((fps / 24) * 8); // e.g. 8 to 333 nodes!
  } else if (megapixels > 100) {
    // 16K (132 MP)
    recommendedProxy = '1/8 Proxy';
    clusterNodesRecommended = Math.ceil((fps / 24) * 4);
  } else if (megapixels > 30) {
    // 8K / 12K
    recommendedProxy = '1/4 Proxy';
    clusterNodesRecommended = Math.ceil((fps / 30) * 2);
  } else if (megapixels > 8) {
    // 4K
    recommendedProxy = '1/2 Proxy';
    clusterNodesRecommended = 1;
  }

  return {
    totalPixels,
    megapixels: Number(megapixels.toFixed(2)),
    gigapixels: Number(gigapixels.toFixed(4)),
    frameSizeBytes,
    frameSizeMb: Number(frameSizeMb.toFixed(2)),
    frameSizeGb: Number(frameSizeGb.toFixed(3)),
    throughputGbps: Number(throughputGbps.toFixed(2)),
    throughputTbPerHour: Number(throughputTbPerHour.toFixed(2)),
    recommendedProxy,
    clusterNodesRecommended,
  };
}

/**
 * 64-bit frame-accurate timecode converter (works accurately even at 1000 FPS)
 */
export function ticksToTimecode64(ticks: bigint, fps: number): string {
  if (ticks < 0n) ticks = 0n;
  const safeFps = fps > 0 ? fps : 24;

  const totalNanoseconds = ticks / (TICKS_PER_SECOND_64 / 1_000_000_000n);
  const totalSeconds = Number(ticks / TICKS_PER_SECOND_64);
  const ticksIntoCurrentSecond = ticks % TICKS_PER_SECOND_64;

  const ticksPerFrame = BigInt(Math.round(Number(TICKS_PER_SECOND_64) / safeFps));
  const currentFrame = ticksPerFrame > 0n ? Number(ticksIntoCurrentSecond / ticksPerFrame) : 0;

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);

  const pad = (n: number, digits: number = 2) => String(n).padStart(digits, '0');

  // Format: HH:MM:SS:FF (or FF.sub for sub-frame accuracy if 1000 FPS)
  const framePadding = safeFps >= 100 ? 3 : 2;
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}:${pad(currentFrame, framePadding)}`;
}

/**
 * Converts a SMPTE timecode (HH:MM:SS:FF) into 64-bit ticks
 */
export function timecodeToTicks64(timecode: string, fps: number): bigint {
  const parts = timecode.split(':').map((p) => parseFloat(p) || 0);
  const hours = parts[0] || 0;
  const minutes = parts[1] || 0;
  const seconds = parts[2] || 0;
  const frames = parts[3] || 0;

  const totalSeconds = hours * 3600 + minutes * 60 + seconds;
  const secondsTicks = BigInt(Math.round(totalSeconds)) * TICKS_PER_SECOND_64;

  const ticksPerFrame = BigInt(Math.round(Number(TICKS_PER_SECOND_64) / (fps || 24)));
  const frameTicks = BigInt(Math.round(frames)) * ticksPerFrame;

  return secondsTicks + frameTicks;
}

/**
 * Computes preview downscaled dimensions given proxy quality setting
 */
export function getProxyDimensions(width: number, height: number, proxy: ProxyQuality): { width: number; height: number; scale: number } {
  let scale = 1.0;
  switch (proxy) {
    case '1/2 Proxy':
      scale = 0.5;
      break;
    case '1/4 Proxy':
      scale = 0.25;
      break;
    case '1/8 Proxy':
      scale = 0.125;
      break;
    case '1/16 Super Proxy':
      scale = 0.0625;
      break;
    default:
      scale = 1.0;
  }
  return {
    width: Math.max(16, Math.round(width * scale)),
    height: Math.max(16, Math.round(height * scale)),
    scale,
  };
}

/**
 * Built-in Cinema 3D LUT Presets (.cube simulator)
 */
export interface CinemaLutPreset {
  id: string;
  name: string;
  description: string;
  targetSpace: string;
  colorFilter: string;
}

export const CINEMA_LUT_PRESETS: CinemaLutPreset[] = [
  {
    id: 'kodak_2383',
    name: 'Kodak Vision3 2383 Film Print',
    description: 'Iconic warm film print with rich shadow contrast and organic roll-off',
    targetSpace: 'DCI-P3 D65',
    colorFilter: 'sepia(0.18) saturate(1.25) contrast(1.15) hue-rotate(-6deg)',
  },
  {
    id: 'fuji_eterna',
    name: 'Fujifilm ETERNA 500T Cine',
    description: 'Soft highlight rolloff, muted cinematic pastel skin tones and deep cyan shadows',
    targetSpace: 'Rec.709',
    colorFilter: 'contrast(1.05) saturate(0.92) hue-rotate(4deg) brightness(1.02)',
  },
  {
    id: 'hollywood_teal_orange',
    name: 'Blockbuster Teal & Orange 32K',
    description: 'Complementary color separation with cyan shadows and warm sunlit skin highlights',
    targetSpace: 'Rec.2020 HDR',
    colorFilter: 'contrast(1.22) saturate(1.35) hue-rotate(-12deg)',
  },
  {
    id: 'matrix_green_grade',
    name: 'Cyberpunk Acid Phosphor',
    description: 'High contrast stylized green-tinted shadows for sci-fi and nighttime VFX',
    targetSpace: 'ACES 2.0',
    colorFilter: 'contrast(1.3) saturate(1.1) hue-rotate(55deg)',
  },
  {
    id: 'monochrome_tri_x',
    name: 'Kodak Tri-X 400 Silver Halide',
    description: 'Deep high-contrast black & white with wide dynamic range tonality',
    targetSpace: 'Linear ACES',
    colorFilter: 'grayscale(1) contrast(1.4) brightness(0.95)',
  },
];

/**
 * Default Cinema Project Specification
 */
export const DEFAULT_CINEMA_PROJECT: CinemaProjectSpec = {
  id: 'cin-proj-1',
  title: 'MemeForge Cinema VFX Master Project',
  resolutionPreset: '32K Ultra Master',
  width: 32000,
  height: 32000,
  frameRate: 1000,
  colorDepth: '32-bit Float',
  colorSpace: 'ACES 2.0 AP0',
  hdrStandard: 'Dolby Vision Profile 7 (Dual Layer)',
  audioSampleRate: 192000,
  audioBitDepth: '32-bit Float',
  audioLayout: 'Dolby Atmos (7.1.4 Bed + Objects)',
  codec: 'Apple ProRes 4444 XQ',
  renderBackend: 'WebGPU Compute Graph',
  proxyQuality: '1/16 Super Proxy',
  enableMagneticTimeline: true,
  enableSimdAcceleration: true,
  enableZeroCopyGpu: true,
  renderFarmNodes: 8,
};
