export type B2BCategory =
  | 'cosmetics'
  | 'apparel_footwear'
  | 'tech_hardware'
  | 'beverage_cpg'
  | 'automotive';

export interface ProductLoraModel {
  id: string;
  name: string;
  category: B2BCategory;
  triggerToken: string;
  baseModel: string;
  rank: 16 | 32 | 64;
  trainingSteps: number;
  lossCurve: number[];
  sampleImage: string;
  preservationMetrics: {
    logoFidelityPct: number;
    geometryIoUPct: number;
    textSharpnessScore: number;
  };
  checkpointSizeMb: number;
  status: 'ready' | 'training' | 'queued';
  description: string;
}

export interface ProductCommercialPromptTemplate {
  templateId: string;
  title: string;
  category: B2BCategory;
  promptTextWithToken: string;
  cameraPreset: string;
  lightingSetup: string;
  aspectRatio: '16:9' | '9:16' | '1:1' | '4:3';
}

export interface SalesLeadRecord {
  id: string;
  firstName: string;
  lastName: string;
  company: string;
  role: string;
  websiteUrl: string;
  customValueProp: string;
  status: 'queued' | 'rendering' | 'ready' | 'sent';
  progressPct?: number;
  generatedVideoUrl?: string;
  previewBackdropUrl?: string;
}

export type LipSyncEngineId = 'Wav2Lip-HQ' | 'SadTalker-Pro' | 'LivePortrait-2026';
export type VoiceCloneEngineId = 'ElevenLabs-Adam-Enterprise' | 'ElevenLabs-Rachel-Executive' | 'Azure-Neural-Jenny';

export interface SpokespersonTemplate {
  id: string;
  name: string;
  title: string;
  role: string;
  avatarPhotoUrl: string;
  voiceModel: VoiceCloneEngineId;
  voiceName: string;
  lipSyncEngine: LipSyncEngineId;
  sampleAudioPitch: number;
  defaultScript: string;
}

export interface StoryboardScene {
  sceneNumber: number;
  durationSec: number;
  narrationScript: string;
  visualDescription: string;
  cameraMotion: string;
  bRollType: string;
  textOverlay: string;
  voiceoverPacing: 'normal' | 'punchy' | 'deliberate';
}

export interface BrandKit {
  brandName: string;
  tagline: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontHeading: string;
  fontBody: string;
  logoUrl?: string;
  safeMarginPct: number;
  mandatoryDisclaimer: string;
  enforceWatermarkCompliance: boolean;
}

export interface DirectorCameraSpec {
  motion:
    | 'Pan Left'
    | 'Pan Right'
    | 'Tilt Up'
    | 'Tilt Down'
    | 'Push In / Dolly Zoom'
    | 'Orbit 360°'
    | 'Crane / Jib'
    | 'Static Lock';
  lensFocalLength:
    | '24mm Ultra-Wide'
    | '35mm Commercial'
    | '50mm Natural'
    | '85mm Portrait Prime'
    | '100mm Macro'
    | 'Anamorphic 2.39:1';
  aperture:
    | 'f/1.4 Soft Bokeh'
    | 'f/2.8 Commercial Clean'
    | 'f/5.6 Studio Crisp'
    | 'f/11 Deep Focus';
  shutterAngle: '180° Cinema Natural' | '90° Action Crisp' | '45° Staccato Commercial';
  seedLock: number;
  characterConsistencyId?: string;
  cameraSpeed: number;
}

export type B2BPlanId = 'starter' | 'pro' | 'enterprise';

export interface B2BPlanDetails {
  id: B2BPlanId;
  name: string;
  targetAudience: string;
  priceUsdMonthly: number;
  priceInrMonthly: number;
  seats: number | 'Unlimited';
  videoMinutesPerMonth: number | 'Unlimited';
  resolution: '1080p Full HD' | '4K Cinema HDR' | '8K Master ProRes';
  productLoraModels: number | 'Unlimited';
  spokespersonAvatars: string;
  dedicatedGpuVpc: boolean;
  soc2ComplianceIncluded: boolean;
  ssoSaml: boolean;
  crmExport: boolean;
  features: string[];
}

export interface RoiCalculatorInputs {
  videosPerMonth: number;
  traditionalCostPerVideo: number;
  traditionalTurnaroundDays: number;
  selectedPlan: B2BPlanId;
}

export interface RoiCalculatorOutputs {
  traditionalMonthlyCost: number;
  traditionalAnnualCost: number;
  platformAnnualCost: number;
  netAnnualSavings: number;
  roiMultiple: number;
  turnaroundHoursSavedAnnual: number;
}

export interface EnterpriseSecurityConfig {
  soc2Type2AuditReady: boolean;
  zeroDataRetention: boolean;
  dedicatedPrivateVpc: boolean;
  cloudRegion: 'us-east-1' | 'eu-west-1' | 'ap-south-1 (Mumbai)' | 'ap-southeast-1';
  dataEncryption: 'AES-256-GCM Hardware-Locked';
  retentionWindowDays: number;
}
