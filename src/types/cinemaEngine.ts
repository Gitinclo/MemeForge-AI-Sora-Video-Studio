import { VideoProjectSpec } from './meme';

export type ResolutionPreset =
  | '720p HD'
  | '1080p FHD'
  | '2K DCI'
  | '4K Ultra'
  | '8K UHD'
  | '12K Blackmagic'
  | '16K Master'
  | '32K Ultra Master'
  | 'Custom';

export interface ResolutionConfig {
  id: ResolutionPreset;
  label: string;
  width: number;
  height: number;
  aspectRatio: string;
  pixelCount: number;
  megapixels: number;
  vramEstimateGbPerFrame: number;
  category: 'Consumer' | 'Cinema' | 'VFX Master' | 'Future IMAX';
}

export type FrameRatePreset =
  | 23.976
  | 24
  | 25
  | 29.97
  | 30
  | 48
  | 50
  | 59.94
  | 60
  | 90
  | 120
  | 144
  | 165
  | 240
  | 360
  | 480
  | 600
  | 960
  | 1000;

export type ColorBitDepth =
  | '8-bit Integer'
  | '10-bit Rec.2020'
  | '12-bit Cinema'
  | '16-bit Half-Float'
  | '32-bit Float'
  | '64-bit Float Master';

export type ColorSpaceStandard =
  | 'Rec.709'
  | 'Rec.2020'
  | 'DCI-P3'
  | 'BT.2100'
  | 'ACES 2.0 AP0'
  | 'ACEScc / ACEScct'
  | 'OpenColorIO (OCIO v2)';

export type HdrStandard =
  | 'SDR'
  | 'HDR10'
  | 'HDR10+'
  | 'HDR10+ Adaptive'
  | 'Dolby Vision Profile 8.4'
  | 'Dolby Vision Profile 7 (Dual Layer)'
  | 'HLG (Hybrid Log-Gamma)';

export type AudioSampleRate =
  | 44100
  | 48000
  | 88200
  | 96000
  | 176400
  | 192000;

export type AudioBitDepth =
  | '16-bit Integer'
  | '24-bit Broadcast Wave'
  | '32-bit Integer'
  | '32-bit Float'
  | '64-bit Internal Mixing';

export type AudioChannelLayout =
  | 'Mono (1.0)'
  | 'Stereo (2.0)'
  | '5.1 Surround'
  | '7.1 Cinema Surround'
  | 'Dolby Atmos (7.1.4 Bed + Objects)'
  | 'Ambisonics (3rd Order 16-Ch)';

export type ProCodec =
  | 'Apple ProRes 422 HQ'
  | 'Apple ProRes 4444 XQ'
  | 'Avid DNxHR HQX'
  | 'GoPro CineForm RAW'
  | 'AOMedia AV1 (12-bit)'
  | 'HEVC / H.265 (10-bit 4:2:2)'
  | 'H.264 Broadcast'
  | 'OpenEXR 32-bit Float Sequence'
  | 'TIFF 16-bit Sequence'
  | 'PNG 16-bit Sequence'
  | 'JPEG XL (JXL HDR)';

export type RenderEngineBackend =
  | 'WebGPU Compute Graph'
  | 'Vulkan Hardware Acceleration'
  | 'Apple Metal 3'
  | 'DirectX 12 Agility'
  | 'Distributed Render Farm';

export type ProxyQuality = '1:1 Full Master' | '1/2 Proxy' | '1/4 Proxy' | '1/8 Proxy' | '1/16 Super Proxy';

export type TimelineTool =
  | 'select'
  | 'blade'
  | 'ripple'
  | 'rolling'
  | 'slip'
  | 'slide'
  | 'hand'
  | 'zoom';

export interface TimelineTrack {
  id: string;
  name: string;
  type: 'video' | 'audio' | 'adjustment' | 'subtitle';
  isMuted: boolean;
  isLocked: boolean;
  color: string;
  clips: TimelineClip[];
}

export interface TimelineClip {
  id: string;
  trackId: string;
  name: string;
  startTicks: bigint; // 64-bit timebase
  durationTicks: bigint;
  sourceStartTicks: bigint;
  color: string;
  thumbnail?: string;
  speedMultiplier: number;
}

export interface ScopeMode {
  waveform: boolean;
  rgbParade: boolean;
  vectorscope: boolean;
  histogram: boolean;
  falseColor: boolean;
}

export interface ColorGradeControls {
  lift: { r: number; g: number; b: number; luma: number }; // -100 to +100
  gamma: { r: number; g: number; b: number; luma: number };
  gain: { r: number; g: number; b: number; luma: number };
  offset: { r: number; g: number; b: number; luma: number };
  contrast: number; // 0.5 to 2.0
  pivot: number; // 0.0 to 1.0
  saturation: number; // 0 to 200%
  temperature: number; // 2000K to 12000K
  tint: number; // -100 to +100
  activeLut?: string;
}

export interface CinemaProjectSpec {
  id: string;
  title: string;
  resolutionPreset: ResolutionPreset;
  width: number;
  height: number;
  frameRate: FrameRatePreset;
  colorDepth: ColorBitDepth;
  colorSpace: ColorSpaceStandard;
  hdrStandard: HdrStandard;
  audioSampleRate: AudioSampleRate;
  audioBitDepth: AudioBitDepth;
  audioLayout: AudioChannelLayout;
  codec: ProCodec;
  renderBackend: RenderEngineBackend;
  proxyQuality: ProxyQuality;
  enableMagneticTimeline: boolean;
  enableSimdAcceleration: boolean;
  enableZeroCopyGpu: boolean;
  renderFarmNodes: number;
}
