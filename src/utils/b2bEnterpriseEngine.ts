import {
  B2BCategory,
  ProductLoraModel,
  ProductCommercialPromptTemplate,
  SalesLeadRecord,
  SpokespersonTemplate,
  StoryboardScene,
  BrandKit,
  DirectorCameraSpec,
  B2BPlanId,
  B2BPlanDetails,
  RoiCalculatorInputs,
  RoiCalculatorOutputs,
  EnterpriseSecurityConfig,
  ProductTrainingImage,
  ProductAngleType,
  LoraTrainingPhase,
  LoraTrainingJobState,
  GpuUtilizationTelemetry,
  ModelSandboxPresetPrompt,
  SandboxTestResult,
} from '../types/b2bEnterprise';

export const B2B_PRICING_CATALOG: Record<B2BPlanId, B2BPlanDetails> = {
  starter: {
    id: 'starter',
    name: 'Starter',
    targetAudience: 'For single founders & growth marketers',
    priceUsdMonthly: 49,
    priceInrMonthly: 3999,
    seats: 1,
    videoMinutesPerMonth: 15,
    resolution: '1080p Full HD',
    productLoraModels: 0,
    spokespersonAvatars: '3 Standard Avatars',
    dedicatedGpuVpc: false,
    soc2ComplianceIncluded: false,
    ssoSaml: false,
    crmExport: false,
    features: [
      '1 User Seat',
      '15 minutes video generation / month',
      '1080p Full HD Export',
      'Standard Avatar Library (3 Avatars)',
      'Script-to-Video Engine (5 articles/mo)',
      'Basic Email Support',
    ],
  },
  pro: {
    id: 'pro',
    name: 'Professional',
    targetAudience: 'For scaling marketing & sales teams',
    priceUsdMonthly: 149,
    priceInrMonthly: 11999,
    seats: 3,
    videoMinutesPerMonth: 60,
    resolution: '4K Cinema HDR',
    productLoraModels: 1,
    spokespersonAvatars: '12 Executive Avatars + Custom Voice Clone',
    dedicatedGpuVpc: false,
    soc2ComplianceIncluded: true,
    ssoSaml: false,
    crmExport: true,
    features: [
      '3 User Seats with Role Approvals',
      '60 minutes video generation / month',
      '4K Cinema HDR Master Export',
      '1 Custom Product LoRA Model',
      'Custom Brand Kit (Colors, Fonts, Safe Margins)',
      'Programmatic CSV Batch (100 leads/mo)',
      'CRM Webhook & HubSpot/Salesforce Export',
      'Priority GPU Dispatch Queue',
    ],
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise Private Cloud',
    targetAudience: 'For multinational brands & enterprise sales orgs',
    priceUsdMonthly: 499,
    priceInrMonthly: 39999,
    seats: 'Unlimited',
    videoMinutesPerMonth: 'Unlimited',
    resolution: '8K Master ProRes',
    productLoraModels: 'Unlimited',
    spokespersonAvatars: 'Custom CEO Avatar Clone + Unlimited Custom Voices',
    dedicatedGpuVpc: true,
    soc2ComplianceIncluded: true,
    ssoSaml: true,
    crmExport: true,
    features: [
      'Unlimited User Seats & Multi-workspace RBAC',
      'Unlimited Video Minutes & High-speed Render Queue',
      '8K Master ProRes 4444 XQ Export',
      'Unlimited Custom Product LoRAs & ControlNet geometry locks',
      'Custom Executive Avatar Clones (CEO & Spokespersons)',
      'Dedicated AWS/Azure Private VPC & Isolated H100 GPU Cluster',
      'SOC 2 Type II Certified & Zero Data Retention (ZDR)',
      'Single Sign-On (SAML/Okta) & Audit Trail',
      '24/7 Dedicated Enterprise SLA Account Manager',
    ],
  },
};

export const PRESET_LORA_MODELS: ProductLoraModel[] = [
  {
    id: 'lora-aurora-serum',
    name: 'Aurora Lumina Hydrating Serum',
    category: 'cosmetics',
    triggerToken: '[AURORA_LUMINA_SERUM]',
    baseModel: 'LEO-DiT-Enterprise-v3',
    rank: 32,
    trainingSteps: 1500,
    lossCurve: [0.48, 0.32, 0.19, 0.12, 0.082, 0.054, 0.041],
    sampleImage: '/src/assets/images/b2b_product_perfume_bottle_1793008331955.jpg',
    preservationMetrics: {
      logoFidelityPct: 99.4,
      geometryIoUPct: 98.7,
      textSharpnessScore: 9.8,
    },
    checkpointSizeMb: 144,
    status: 'ready',
    description: 'Precision frosted glass cosmetic bottle with metallic gold cap and micro-embossed label preservation.',
  },
  {
    id: 'lora-velocity-sneaker',
    name: 'Aero Velocity Pro Carbon Sneaker',
    category: 'apparel_footwear',
    triggerToken: '[AERO_VELOCITY_SNEAKER]',
    baseModel: 'LEO-DiT-Enterprise-v3',
    rank: 32,
    trainingSteps: 1200,
    lossCurve: [0.52, 0.36, 0.22, 0.14, 0.091, 0.063, 0.047],
    sampleImage: '/src/assets/images/b2b_sneaker_commercial_1793008333912.jpg',
    preservationMetrics: {
      logoFidelityPct: 99.1,
      geometryIoUPct: 97.9,
      textSharpnessScore: 9.6,
    },
    checkpointSizeMb: 138,
    status: 'ready',
    description: 'Aerodynamic running shoe with carbon-plate sole texture and precision wing emblem preservation.',
  },
];

export const COMMERCIAL_PROMPT_TEMPLATES: ProductCommercialPromptTemplate[] = [
  {
    templateId: 'tmpl-travertine-macro',
    title: 'Luxury Travertine Macro Commercial',
    category: 'cosmetics',
    promptTextWithToken:
      'A cinematic commercial shot of [AURORA_LUMINA_SERUM] resting on a polished travertine pedestal, warm diffused Mediterranean sunlight, gentle water ripples in background, 4K razor-sharp commercial photography',
    cameraPreset: 'Slow Orbit 360° + Push In',
    lightingSetup: 'Diffused Morning Rim Light (5600K)',
    aspectRatio: '16:9',
  },
  {
    templateId: 'tmpl-sneaker-kinetic',
    title: 'High-Motion Aerodynamic Kinetic Ad',
    category: 'apparel_footwear',
    promptTextWithToken:
      'Commercial advertisement of [AERO_VELOCITY_SNEAKER] floating in high-velocity air stream, carbon fiber particles disintegrating into light, rim lit against dark carbon background, anamorphic lens flare',
    cameraPreset: 'Dolly Zoom with 45° Shutter',
    lightingSetup: 'Cyan & White Studio Rim Strobes',
    aspectRatio: '16:9',
  },
  {
    templateId: 'tmpl-social-reel-vertical',
    title: 'TikTok/Reels 9:16 Product Spotlight',
    category: 'cosmetics',
    promptTextWithToken:
      'Vertical 9:16 commercial of [OUR_PRODUCT] rotating smoothly under soft beauty ring light, droplets condensing on glass, ultra clean pastel travertine background, UGC viral pacing',
    cameraPreset: 'Vertical Crane Down',
    lightingSetup: 'Softbox Beauty Ring (4500K)',
    aspectRatio: '9:16',
  },
];

export const DEFAULT_SPOKESPERSONS: SpokespersonTemplate[] = [
  {
    id: 'spokesperson-maya',
    name: 'Maya Reynolds',
    title: 'Chief Commercial Officer',
    role: 'Enterprise B2B Sales & Training',
    avatarPhotoUrl: '/src/assets/images/b2b_spokesperson_executive_1793008332124.jpg',
    voiceModel: 'ElevenLabs-Rachel-Executive',
    voiceName: 'Rachel (Executive Warmth & Authority)',
    lipSyncEngine: 'Wav2Lip-HQ',
    sampleAudioPitch: 1.0,
    defaultScript:
      'Hi {{firstName}}, I noticed {{company}} is accelerating digital video production this quarter. Traditional agency workflows take 14 days per video, while our automated platform delivers enterprise-grade consistency in minutes. Would you be open to seeing our custom product LoRA demo for {{company}}?',
  },
  {
    id: 'spokesperson-marcus',
    name: 'Marcus Vance',
    title: 'VP of Product Engineering',
    role: 'Technical Explainer & Onboarding',
    avatarPhotoUrl: '/src/assets/images/b2b_spokesperson_executive_1793008332124.jpg',
    voiceModel: 'ElevenLabs-Adam-Enterprise',
    voiceName: 'Adam (Clear Technical Precision)',
    lipSyncEngine: 'LivePortrait-2026',
    sampleAudioPitch: 0.95,
    defaultScript:
      'Welcome {{firstName}}! Today I am walking you through the latest architectural features in your {{company}} workspace. With SOC 2 Type II compliance and dedicated private VPC rendering, your product assets never train public models.',
  },
];

export const SAMPLE_SALES_LEADS: SalesLeadRecord[] = [
  {
    id: 'lead-1',
    firstName: 'Sarah',
    lastName: 'Chen',
    company: 'Apex Retail Brands',
    role: 'VP of Global Marketing',
    websiteUrl: 'https://apexretail.example.com',
    customValueProp: 'scale 500+ SKU commercial video ads in Q4',
    status: 'ready',
    progressPct: 100,
    generatedVideoUrl: '#video-preview-apex',
  },
  {
    id: 'lead-2',
    firstName: 'David',
    lastName: 'Kowalski',
    company: 'Vanguard Medical Devices',
    role: 'Head of Commercial Sales',
    websiteUrl: 'https://vanguardmed.example.com',
    customValueProp: 'train 1,200 international field reps with localized video',
    status: 'ready',
    progressPct: 100,
    generatedVideoUrl: '#video-preview-vanguard',
  },
  {
    id: 'lead-3',
    firstName: 'Elena',
    lastName: 'Rostova',
    company: 'Solaria Consumer Tech',
    role: 'Chief Revenue Officer',
    websiteUrl: 'https://solariatech.example.com',
    customValueProp: 'automate outbound personalized video outreach to Fortune 500 accounts',
    status: 'rendering',
    progressPct: 65,
  },
  {
    id: 'lead-4',
    firstName: 'Arjun',
    lastName: 'Mehta',
    company: 'NeoFleet Mobility',
    role: 'Enterprise Partnerships Director',
    websiteUrl: 'https://neofleet.example.com',
    customValueProp: 'showcase hardware telematics with zero video agency overhead',
    status: 'queued',
    progressPct: 0,
  },
];

export const DEFAULT_BRAND_KIT: BrandKit = {
  brandName: 'Global Solutions Corp',
  tagline: 'Enterprise Video at Scale',
  primaryColor: '#0F172A',
  secondaryColor: '#2563EB',
  accentColor: '#10B981',
  fontHeading: 'Plus Jakarta Sans',
  fontBody: 'DM Sans',
  safeMarginPct: 10,
  mandatoryDisclaimer: 'Confidential & Proprietary © 2026 Global Solutions Corp. All rights reserved.',
  enforceWatermarkCompliance: true,
};

export const DEFAULT_DIRECTOR_SPEC: DirectorCameraSpec = {
  motion: 'Push In / Dolly Zoom',
  lensFocalLength: '50mm Natural',
  aperture: 'f/2.8 Commercial Clean',
  shutterAngle: '180° Cinema Natural',
  seedLock: 4291823,
  characterConsistencyId: 'actor-exec-female-32',
  cameraSpeed: 1.0,
};

export const DEFAULT_SECURITY_CONFIG: EnterpriseSecurityConfig = {
  soc2Type2AuditReady: true,
  zeroDataRetention: true,
  dedicatedPrivateVpc: true,
  cloudRegion: 'us-east-1',
  dataEncryption: 'AES-256-GCM Hardware-Locked',
  retentionWindowDays: 0, // Zero retention by default
};

/**
 * Calculates dynamic ROI metrics comparing traditional agency costs to LEO Enterprise
 */
export function calculateB2bRoi(inputs: RoiCalculatorInputs): RoiCalculatorOutputs {
  const { videosPerMonth, traditionalCostPerVideo, traditionalTurnaroundDays, selectedPlan } = inputs;
  const plan = B2B_PRICING_CATALOG[selectedPlan];

  const traditionalMonthlyCost = videosPerMonth * traditionalCostPerVideo;
  const traditionalAnnualCost = traditionalMonthlyCost * 12;

  const platformMonthlyCost = plan.priceUsdMonthly;
  const platformAnnualCost = platformMonthlyCost * 12;

  const netAnnualSavings = Math.max(0, traditionalAnnualCost - platformAnnualCost);
  const roiMultiple = platformAnnualCost > 0
    ? Number((traditionalAnnualCost / platformAnnualCost).toFixed(1))
    : 0;

  // Traditional video takes ~30-40 hours of production/revisions vs ~15 mins on platform
  const hoursSavedPerVideo = Math.max(8, traditionalTurnaroundDays * 4);
  const turnaroundHoursSavedAnnual = videosPerMonth * hoursSavedPerVideo * 12;

  return {
    traditionalMonthlyCost,
    traditionalAnnualCost,
    platformAnnualCost,
    netAnnualSavings,
    roiMultiple,
    turnaroundHoursSavedAnnual,
  };
}

/**
 * Injects dynamic lead variables into a spokesperson script
 */
export function renderPersonalizedSalesScript(
  template: string,
  lead: Partial<SalesLeadRecord>
): string {
  let rendered = template;
  rendered = rendered.replace(/\{\{firstName\}\}/g, lead.firstName || 'there');
  rendered = rendered.replace(/\{\{lastName\}\}/g, lead.lastName || '');
  rendered = rendered.replace(/\{\{company\}\}/g, lead.company || 'your organization');
  rendered = rendered.replace(/\{\{role\}\}/g, lead.role || 'Leader');
  rendered = rendered.replace(/\{\{websiteUrl\}\}/g, lead.websiteUrl || 'your website');
  rendered = rendered.replace(/\{\{customValueProp\}\}/g, lead.customValueProp || 'drive measurable revenue growth');
  return rendered;
}

/**
 * Parses article text, markdown, or marketing brief into structured storyboard scene cards
 */
export function generateScriptToStoryboard(rawTextOrUrl: string): StoryboardScene[] {
  const cleaned = rawTextOrUrl.trim();
  const sentences = cleaned
    .split(/(?<=[.?!])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 5);

  const sceneCount = Math.max(3, Math.min(5, Math.ceil(sentences.length / 2) || 3));
  const scenes: StoryboardScene[] = [];

  const cameraMotions = [
    'Wide Establishing Drone Shot',
    'Medium Push-in on Spokesperson',
    'Macro Product Dolly Track',
    'Dynamic Over-the-shoulder Pan',
    'Hero Close-up with Studio Rim Light',
  ];

  const bRollTypes = [
    'Clean Office & Modern Architecture',
    'Travertine Product Showcase',
    'UI Dashboard Screencast & Analytics',
    'Team Collaboration in Studio',
    'High-Contrast Kinetic Motion Graphic',
  ];

  for (let i = 0; i < sceneCount; i++) {
    const primarySentence =
      sentences[i * 2] ||
      sentences[i] ||
      `Introducing the next breakthrough in commercial video automation for enterprise leaders.`;
    const secondarySentence =
      sentences[i * 2 + 1] ||
      `Empowering teams to achieve 100% brand fidelity and accelerate production speed.`;

    scenes.push({
      sceneNumber: i + 1,
      durationSec: 5,
      narrationScript: `${primarySentence} ${secondarySentence}`.trim(),
      visualDescription: `Cinematic commercial scene depicting ${bRollTypes[i % bRollTypes.length].toLowerCase()} with consistent brand color grading.`,
      cameraMotion: cameraMotions[i % cameraMotions.length],
      bRollType: bRollTypes[i % bRollTypes.length],
      textOverlay: `Key Takeaway ${i + 1}: ${primarySentence.slice(0, 40)}...`,
      voiceoverPacing: i === 0 ? 'deliberate' : i === sceneCount - 1 ? 'punchy' : 'normal',
    });
  }

  return scenes;
}

/**
 * Simulates a custom LoRA training pipeline for product preservation
 */
export function simulateLoRATraining(
  productName: string,
  category: B2BCategory,
  rank: 16 | 32 | 64 = 32
): ProductLoraModel {
  const token = `[${productName.toUpperCase().replace(/[^A-Z0-9]/g, '_')}]`;
  const id = `lora-${Date.now()}`;

  return {
    id,
    name: productName,
    category,
    triggerToken: token,
    baseModel: 'LEO-DiT-Enterprise-v3',
    rank,
    trainingSteps: rank === 64 ? 2000 : 1500,
    lossCurve: [0.55, 0.38, 0.24, 0.16, 0.095, 0.058, 0.038],
    sampleImage:
      category === 'apparel_footwear'
        ? '/src/assets/images/b2b_sneaker_commercial_1793008333912.jpg'
        : '/src/assets/images/b2b_product_perfume_bottle_1793008331955.jpg',
    preservationMetrics: {
      logoFidelityPct: 99.2,
      geometryIoUPct: 98.4,
      textSharpnessScore: 9.7,
    },
    checkpointSizeMb: rank === 64 ? 288 : 144,
    status: 'ready',
    description: `Enterprise-grade LoRA model fine-tuned on ${productName} with zero logo hallucination.`,
  };
}

/**
 * Converts sales leads into an RFC-4180 compliant CSV string for export
 */
export function exportLeadsToCsv(leads: SalesLeadRecord[]): string {
  const headers = ['Lead ID', 'First Name', 'Last Name', 'Company', 'Role', 'Website URL', 'Custom Value Prop', 'Status', 'Generated Video Link'];
  const rows = leads.map((l) => [
    l.id,
    `"${l.firstName.replace(/"/g, '""')}"`,
    `"${l.lastName.replace(/"/g, '""')}"`,
    `"${l.company.replace(/"/g, '""')}"`,
    `"${l.role.replace(/"/g, '""')}"`,
    `"${l.websiteUrl.replace(/"/g, '""')}"`,
    `"${l.customValueProp.replace(/"/g, '""')}"`,
    l.status,
    `"${l.generatedVideoUrl || ''}"`,
  ]);

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
}

/**
 * Parses raw CSV content into lead records
 */
export function parseLeadsCsv(rawCsvText: string): SalesLeadRecord[] {
  const lines = rawCsvText.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length <= 1) return [];

  const records: SalesLeadRecord[] = [];
  // Skip header row
  for (let i = 1; i < lines.length; i++) {
    const parts = lines[i].split(',').map((p) => p.trim().replace(/^"|"$/g, ''));
    if (parts.length >= 4) {
      records.push({
        id: `csv-lead-${Date.now()}-${i}`,
        firstName: parts[0] || 'Executive',
        lastName: parts[1] || '',
        company: parts[2] || 'Enterprise Corp',
        role: parts[3] || 'Director',
        websiteUrl: parts[4] || 'https://example.com',
        customValueProp: parts[5] || 'scale automated video production',
        status: 'queued',
        progressPct: 0,
      });
    }
  }

  return records;
}

/**
 * Validates that an enterprise product dataset satisfies the 10-20 images threshold
 */
export function validateProductDataset(images: ProductTrainingImage[]): {
  isValid: boolean;
  count: number;
  minRequired: number;
  maxAllowed: number;
  statusMessage: string;
  canTrain: boolean;
  qualityScore: number;
  angleDiversityPct: number;
} {
  const count = images.length;
  const minRequired = 10;
  const maxAllowed = 20;

  const uniqueAngles = new Set(images.map((img) => img.angleLabel));
  const angleDiversityPct = Math.min(100, Math.round((uniqueAngles.size / 6) * 100));

  if (count === 0) {
    return {
      isValid: false,
      count: 0,
      minRequired,
      maxAllowed,
      statusMessage: 'No product images uploaded. Upload 10-20 photos of your product from diverse angles.',
      canTrain: false,
      qualityScore: 0,
      angleDiversityPct: 0,
    };
  }

  if (count < minRequired) {
    return {
      isValid: false,
      count,
      minRequired,
      maxAllowed,
      statusMessage: `Insufficient dataset size: ${count}/${minRequired} images. Upload at least ${minRequired - count} more angles for 3D consistency.`,
      canTrain: false,
      qualityScore: Math.round((count / minRequired) * 60),
      angleDiversityPct,
    };
  }

  if (count > maxAllowed) {
    return {
      isValid: false,
      count,
      minRequired,
      maxAllowed,
      statusMessage: `Dataset exceeds maximum limit: ${count}/${maxAllowed} images. Excess images cause overfitting; remove ${count - maxAllowed} images.`,
      canTrain: false,
      qualityScore: 70,
      angleDiversityPct,
    };
  }

  // Count is between 10 and 20
  const qualityScore = Math.min(100, Math.round(80 + (count - 10) * 1.5 + (angleDiversityPct / 100) * 10));

  return {
    isValid: true,
    count,
    minRequired,
    maxAllowed,
    statusMessage: `Optimal enterprise dataset: ${count} studio angles verified. Ready for LoRA fine-tuning.`,
    canTrain: true,
    qualityScore,
    angleDiversityPct,
  };
}

/**
 * Returns a rich pre-curated 12-image studio product dataset for instant testing
 */
export function getSampleProductDataset(
  category: B2BCategory = 'cosmetics',
  productName = 'Aurora Lumina Hydrating Serum'
): ProductTrainingImage[] {
  const baseImg =
    category === 'apparel_footwear'
      ? '/src/assets/images/b2b_sneaker_commercial_1793008333912.jpg'
      : '/src/assets/images/b2b_product_perfume_bottle_1793008331955.jpg';

  const angles: { label: ProductAngleType; desc: string; size: number }[] = [
    { label: 'Front View', desc: 'Direct eye-level front shot on clean neutral travertine, sharp logo typography.', size: 2450000 },
    { label: '3/4 Perspective', desc: '45-degree angle displaying bottle volume, depth, and gold cap reflection.', size: 2600000 },
    { label: 'Side Profile', desc: 'Orthographic side profile displaying cylindrical curvature and frosted glass thickness.', size: 2150000 },
    { label: 'Macro Label Detail', desc: 'Extreme macro zoom on printed ingredients and brand typography.', size: 3100000 },
    { label: 'Cap & Closure', desc: 'Top metallic gold cap specular highlight detail under diffused 5600K studio strobe.', size: 1950000 },
    { label: 'Rear View', desc: 'Rear packaging view showing barcode, net weight 50ml, and batch identification.', size: 2300000 },
    { label: 'Top Down', desc: 'Overhead flat-lay perspective looking directly down at cap on textured stone.', size: 2200000 },
    { label: 'Studio Lighting High-Key', desc: 'Bright diffused softbox lighting revealing liquid refraction and golden serum tint.', size: 2800000 },
    { label: 'Studio Lighting Low-Key', desc: 'Dramatic dark background rim lighting accentuating frosted edges and glass contours.', size: 2900000 },
    { label: 'Floating 45° Angle', desc: 'Dynamic suspended levitation shot with subtle studio motion blur and crisp rim light.', size: 3200000 },
    { label: 'Front View', desc: 'Alternate front shot under warm morning sunlight with natural water droplet condensation.', size: 2750000 },
    { label: '3/4 Perspective', desc: 'Secondary 3/4 beauty angle positioned adjacent to raw travertine stone block.', size: 2650000 },
    { label: 'Macro Label Detail', desc: 'High-contrast angled macro shot verifying ink sharpness on textured cream paper.', size: 3050000 },
    { label: 'Studio Lighting High-Key', desc: 'Even 360-degree fill light with seamless white infinite sweep cyclorama backdrop.', size: 2500000 },
  ];

  return angles.map((a, i) => ({
    id: `train-img-${i + 1}`,
    name: `${productName.toLowerCase().replace(/\s+/g, '_')}_angle_0${i + 1}.jpg`,
    dataUri: baseImg,
    angleLabel: a.label,
    width: 2048,
    height: 1536,
    fileSizeBytes: a.size,
    vlmCaption: `Commercial studio photograph of ${productName}: ${a.desc}`,
  }));
}

/**
 * Initializes a new LoRA training job
 */
export function createLoraTrainingJob(config: {
  productName: string;
  brandName?: string;
  category: B2BCategory;
  rank?: 16 | 32 | 64;
  targetSteps?: number;
  enableGeometryLock?: boolean;
  zeroDataRetention?: boolean;
}): LoraTrainingJobState {
  const token = `[${config.productName.toUpperCase().replace(/[^A-Z0-9]/g, '_')}]`;
  const rank = config.rank || 32;
  const targetSteps = config.targetSteps || (rank === 64 ? 2000 : 1500);
  const jobId = `job-lora-${Date.now()}`;
  const safetensorsFilename = `${config.productName.toLowerCase().replace(/\s+/g, '_')}_lora_r${rank}.safetensors`;

  return {
    jobId,
    productName: config.productName,
    brandName: config.brandName || 'Enterprise Brand Group',
    triggerToken: token,
    category: config.category,
    baseModel: 'LEO-DiT-Enterprise-v3 (14B)',
    rank,
    alpha: rank === 64 ? 64 : 32,
    learningRate: '1.2e-4 (Cosine Decay)',
    enableGeometryLock: config.enableGeometryLock ?? true,
    zeroDataRetention: config.zeroDataRetention ?? true,
    targetSteps,
    currentStep: 0,
    currentLoss: 0.54,
    phase: 'validating_dataset',
    lossHistory: [0.54],
    logs: [
      `[${new Date().toLocaleTimeString()}] Initializing Enterprise LoRA Builder for ${config.productName}`,
      `[${new Date().toLocaleTimeString()}] Target Token: ${token} | Architecture: LEO-DiT-Enterprise-v3`,
      `[${new Date().toLocaleTimeString()}] Hyperparameters: Rank=${rank}, Alpha=${rank === 64 ? 64 : 32}, LR=1.2e-4`,
      `[${new Date().toLocaleTimeString()}] Security: Zero Data Retention (ZDR) Active · Single-Tenant Sandbox`,
    ],
    checkpointSizeMb: rank === 64 ? 288 : rank === 32 ? 144 : 72,
    safetensorsFilename,
    estimatedRemainingSeconds: Math.round((targetSteps / 100) * 1.5),
  };
}

/**
 * Advances a LoRA training job state through its lifecycle phases
 */
export function advanceTrainingJob(
  job: LoraTrainingJobState,
  stepIncrement = 150
): LoraTrainingJobState {
  if (job.phase === 'completed' || job.phase === 'failed') {
    return job;
  }

  const nextStep = Math.min(job.targetSteps, job.currentStep + stepIncrement);
  const progressRatio = nextStep / job.targetSteps;

  // Calculate exponential loss decay: starts around 0.52, drops to ~0.038
  const baseLoss = 0.52 * Math.exp(-3.2 * progressRatio) + 0.035 + (Math.random() * 0.006 - 0.003);
  const currentLoss = Number(Math.max(0.025, baseLoss).toFixed(4));
  const lossHistory = [...job.lossHistory, currentLoss];

  let phase: LoraTrainingPhase = 'training_lora';
  const newLogs = [...job.logs];

  if (nextStep < job.targetSteps * 0.12) {
    phase = 'validating_dataset';
    if (!job.logs.some((l) => l.includes('Auto-captioning'))) {
      newLogs.push(`[${new Date().toLocaleTimeString()}] [Dataset Validation] Auto-captioning 100% of uploaded angles via VLM vision encoder`);
    }
  } else if (nextStep < job.targetSteps * 0.28) {
    phase = 'extracting_latents';
    if (!job.logs.some((l) => l.includes('Extracting 3D VAE'))) {
      newLogs.push(`[${new Date().toLocaleTimeString()}] [Latent Extraction] Extracting 3D VAE latent tensors & ControlNet surface normals`);
    }
  } else if (nextStep < job.targetSteps) {
    phase = 'training_lora';
    if (nextStep % 300 <= stepIncrement) {
      newLogs.push(
        `[${new Date().toLocaleTimeString()}] [Step ${nextStep}/${job.targetSteps}] Rank ${job.rank} attention projection loss: ${currentLoss}`
      );
    }
  } else {
    phase = 'completed';
    newLogs.push(`[${new Date().toLocaleTimeString()}] [Optimization Converged] Final training loss: ${currentLoss}`);
    newLogs.push(`[${new Date().toLocaleTimeString()}] [Safetensors Export] Saved ${job.safetensorsFilename} (${job.checkpointSizeMb} MB)`);
    newLogs.push(`[${new Date().toLocaleTimeString()}] [Invariant Check] Logo Fidelity: 99.4% · Geometry IoU: 98.7% · PASSED`);
  }

  const remainingSteps = job.targetSteps - nextStep;
  const estimatedRemainingSeconds = Math.max(0, Math.round((remainingSteps / 100) * 1.5));

  return {
    ...job,
    currentStep: nextStep,
    currentLoss,
    phase,
    lossHistory,
    logs: newLogs,
    estimatedRemainingSeconds,
    preservationScores:
      phase === 'completed'
        ? {
            logoFidelityPct: 99.4,
            geometryIoUPct: 98.7,
            textSharpnessScore: 9.8,
          }
        : undefined,
  };
}

export const DEFAULT_GPU_CLUSTER_NODES: GpuUtilizationTelemetry[] = [
  {
    nodeId: 'gpu-node-01',
    clusterRack: 'Rack A / Pod 04 (Virginia DC)',
    gpuModel: 'NVIDIA H100 80GB SXM5',
    computeUtilizationPct: 97.4,
    vramUsedGb: 68.4,
    vramTotalGb: 80,
    temperatureC: 58,
    powerWatts: 512,
    powerLimitWatts: 700,
    activeCudaStreams: 8,
    pcieBandwidthGbps: 112.4,
    hbm3BandwidthTbps: 3.2,
    fanSpeedPct: 76,
    status: 'optimal',
  },
  {
    nodeId: 'gpu-node-02',
    clusterRack: 'Rack A / Pod 05 (Virginia DC)',
    gpuModel: 'NVIDIA H100 80GB SXM5',
    computeUtilizationPct: 94.2,
    vramUsedGb: 64.1,
    vramTotalGb: 80,
    temperatureC: 56,
    powerWatts: 485,
    powerLimitWatts: 700,
    activeCudaStreams: 6,
    pcieBandwidthGbps: 108.0,
    hbm3BandwidthTbps: 3.1,
    fanSpeedPct: 72,
    status: 'optimal',
  },
  {
    nodeId: 'gpu-node-03',
    clusterRack: 'Rack B / Pod 01 (Frankfurt DC)',
    gpuModel: 'NVIDIA B200 192GB Blackwell',
    computeUtilizationPct: 88.5,
    vramUsedGb: 112.0,
    vramTotalGb: 192,
    temperatureC: 52,
    powerWatts: 620,
    powerLimitWatts: 1000,
    activeCudaStreams: 12,
    pcieBandwidthGbps: 224.0,
    hbm3BandwidthTbps: 8.0,
    fanSpeedPct: 68,
    status: 'optimal',
  },
  {
    nodeId: 'gpu-node-04',
    clusterRack: 'Rack C / Pod 02 (Mumbai DC)',
    gpuModel: 'NVIDIA A100 80GB SXM4',
    computeUtilizationPct: 45.0,
    vramUsedGb: 32.0,
    vramTotalGb: 80,
    temperatureC: 49,
    powerWatts: 280,
    powerLimitWatts: 400,
    activeCudaStreams: 4,
    pcieBandwidthGbps: 54.0,
    hbm3BandwidthTbps: 2.0,
    fanSpeedPct: 58,
    status: 'optimal',
  },
];

export const MODEL_SANDBOX_PRESET_PROMPTS: ModelSandboxPresetPrompt[] = [
  {
    id: 'preset-macro-travertine',
    scenarioName: 'Clean Studio Macro on Travertine',
    scenarioCategory: 'studio_macro',
    promptTemplate:
      'A pristine macro commercial shot of {{token}} resting on a smooth honed travertine stone pedestal, warm diffused Mediterranean sunlight, delicate water ripples in background, 8K razor-sharp commercial photography',
    recommendedCamera: 'Slow Orbit 360° + Macro Track',
    recommendedLighting: 'Diffused Morning Rim Light (5600K)',
    previewImage: '/src/assets/images/b2b_product_perfume_bottle_1793008331955.jpg',
    testFocus: 'Logo vector alignment & label typography clarity',
    expectedInvariant: 'Zero typography distortion, 99.4% logo fidelity',
  },
  {
    id: 'preset-high-motion',
    scenarioName: 'High-Velocity Kinetic & Splash Test',
    scenarioCategory: 'high_motion',
    promptTemplate:
      'Commercial advertisement of {{token}} suspended mid-air in high-velocity airflow, carbon fiber particles disintegrating into light, rim lit against dark carbon background, anamorphic lens flare',
    recommendedCamera: 'Dolly Zoom with 45° Shutter',
    recommendedLighting: 'Cyan & White Studio Rim Strobes',
    previewImage: '/src/assets/images/b2b_sneaker_commercial_1793008333912.jpg',
    testFocus: '3D volume & silhouette preservation during motion ramps',
    expectedInvariant: 'No mesh warping or logo hallucination at high velocity',
  },
  {
    id: 'preset-low-key-obsidian',
    scenarioName: 'Dramatic Low-Key Obsidian Studio',
    scenarioCategory: 'dramatic_lighting',
    promptTemplate:
      'A cinematic low-key commercial shot of {{token}} placed against matte dark obsidian stone, razor-thin cyan edge lighting outlining silhouette and surface finish, moody luxury advertising aesthetic',
    recommendedCamera: 'Vertical Crane Jib Down',
    recommendedLighting: 'Dual Edge Rim Lights (Cyan / Warm Tungsten)',
    previewImage: '/src/assets/images/b2b_product_perfume_bottle_1793008331955.jpg',
    testFocus: 'Reflective surface properties & dark shadow contours',
    expectedInvariant: 'Precise edge boundary definition with >98% IoU',
  },
  {
    id: 'preset-spokesperson-lifestyle',
    scenarioName: 'Executive Spokesperson Commercial',
    scenarioCategory: 'lifestyle',
    promptTemplate:
      'A high-end corporate video advertisement showing a professional spokesperson in executive attire presenting {{token}} on a modern conference glass table, natural depth of field, authentic scale',
    recommendedCamera: 'Medium Over-the-Shoulder Track',
    recommendedLighting: 'Architectural Window Daylight',
    previewImage: '/src/assets/images/b2b_spokesperson_executive_1793008332124.jpg',
    testFocus: 'Relative physical scale against human hands and office setting',
    expectedInvariant: 'Accurate scale proportions without blurring',
  },
  {
    id: 'preset-label-macro',
    scenarioName: 'Macro Label & Ingredient Legibility',
    scenarioCategory: 'label_typography',
    promptTemplate:
      'Extreme close-up macro lens inspection of {{token}} printed label, razor-sharp focus on brand logotype, typography hierarchy, net weight text, and barcode fidelity, zero hallucination',
    recommendedCamera: '100mm Macro Linear Slider',
    recommendedLighting: 'Even Ring Light Diffuser (4500K)',
    previewImage: '/src/assets/images/b2b_product_perfume_bottle_1793008331955.jpg',
    testFocus: 'Micro-text readability, barcode structure, and ink contrast',
    expectedInvariant: '100% vector letterform adherence with no hallucinated characters',
  },
];

export const INITIAL_LORA_TRAINING_JOBS: LoraTrainingJobState[] = [
  {
    jobId: 'job-lora-live-1',
    productName: 'Aurora Lumina Hydrating Serum',
    brandName: 'Global Cosmetics Group',
    triggerToken: '[AURORA_LUMINA_SERUM]',
    category: 'cosmetics',
    baseModel: 'LEO-DiT-Enterprise-v3 (14B)',
    rank: 32,
    alpha: 32,
    learningRate: '1.2e-4 (Cosine Decay)',
    enableGeometryLock: true,
    zeroDataRetention: true,
    targetSteps: 1500,
    currentStep: 960,
    currentLoss: 0.058,
    phase: 'training_lora',
    lossHistory: [0.52, 0.41, 0.28, 0.17, 0.11, 0.078, 0.058],
    logs: [
      '[10:14:02] Initializing Enterprise LoRA Builder for Aurora Lumina Hydrating Serum',
      '[10:14:15] [Dataset Validation] Auto-captioned 14 studio angles via VLM vision encoder',
      '[10:14:38] [Latent Extraction] Extracted 3D VAE latent tensors & ControlNet surface normals',
      '[10:16:10] [Step 300/1500] Rank 32 attention projection loss: 0.174',
      '[10:18:24] [Step 600/1500] Rank 32 attention projection loss: 0.108',
      '[10:20:45] [Step 900/1500] Rank 32 attention projection loss: 0.064',
    ],
    checkpointSizeMb: 144,
    safetensorsFilename: 'aurora_lumina_serum_lora_r32.safetensors',
    estimatedRemainingSeconds: 162,
    preservationScores: {
      logoFidelityPct: 99.4,
      geometryIoUPct: 98.7,
      textSharpnessScore: 9.8,
    },
  },
  {
    jobId: 'job-lora-live-2',
    productName: 'Aero Velocity Pro Carbon Sneaker',
    brandName: 'Aero Athletics Enterprise',
    triggerToken: '[AERO_VELOCITY_SNEAKER]',
    category: 'apparel_footwear',
    baseModel: 'LEO-DiT-Enterprise-v3 (14B)',
    rank: 32,
    alpha: 32,
    learningRate: '1.2e-4 (Cosine Decay)',
    enableGeometryLock: true,
    zeroDataRetention: true,
    targetSteps: 1200,
    currentStep: 1200,
    currentLoss: 0.041,
    phase: 'completed',
    lossHistory: [0.55, 0.38, 0.23, 0.14, 0.09, 0.058, 0.041],
    logs: [
      '[09:45:10] Initializing Enterprise LoRA Builder for Aero Velocity Pro Carbon Sneaker',
      '[09:45:22] [Dataset Validation] Auto-captioned 14 studio angles via VLM vision encoder',
      '[09:47:05] [Latent Extraction] Extracted 3D VAE latent tensors & ControlNet surface normals',
      '[09:56:40] [Optimization Converged] Final training loss: 0.041',
      '[09:56:52] [Safetensors Export] Saved aero_velocity_pro_carbon_sneaker_lora_r32.safetensors (138 MB)',
      '[09:57:01] [Invariant Check] Logo Fidelity: 99.1% · Geometry IoU: 97.9% · PASSED',
    ],
    checkpointSizeMb: 138,
    safetensorsFilename: 'aero_velocity_pro_carbon_sneaker_lora_r32.safetensors',
    estimatedRemainingSeconds: 0,
    preservationScores: {
      logoFidelityPct: 99.1,
      geometryIoUPct: 97.9,
      textSharpnessScore: 9.6,
    },
  },
  {
    jobId: 'job-lora-live-3',
    productName: 'Quantum Core Server Pod',
    brandName: 'Quantum Hardware Systems',
    triggerToken: '[QUANTUM_CORE_POD]',
    category: 'tech_hardware',
    baseModel: 'LEO-DiT-Enterprise-v3 (14B)',
    rank: 64,
    alpha: 64,
    learningRate: '1.0e-4 (Cosine Decay)',
    enableGeometryLock: true,
    zeroDataRetention: true,
    targetSteps: 2000,
    currentStep: 340,
    currentLoss: 0.31,
    phase: 'extracting_latents',
    lossHistory: [0.58, 0.46, 0.38, 0.31],
    logs: [
      '[10:22:15] Initializing Enterprise LoRA Builder for Quantum Core Server Pod',
      '[10:22:30] [Dataset Validation] Auto-captioned 16 studio angles via VLM vision encoder',
      '[10:23:45] [Latent Extraction] Extracting 3D VAE latent tensors & ControlNet surface normals',
    ],
    checkpointSizeMb: 288,
    safetensorsFilename: 'quantum_core_server_pod_lora_r64.safetensors',
    estimatedRemainingSeconds: 380,
  },
];

/**
 * Formats seconds into human-readable minutes and seconds (e.g. 02m 45s)
 */
export function formatRemainingTime(totalSeconds: number): string {
  if (totalSeconds <= 0) return 'Complete';
  const mins = Math.floor(totalSeconds / 60);
  const secs = Math.floor(totalSeconds % 60);
  return `${mins.toString().padStart(2, '0')}m ${secs.toString().padStart(2, '0')}s remaining`;
}

/**
 * Simulates a real-time sandbox test verification run for a LoRA model
 */
export function simulateSandboxTest(
  model: ProductLoraModel,
  preset: ModelSandboxPresetPrompt,
  customPrompt?: string
): SandboxTestResult {
  const promptText = customPrompt || preset.promptTemplate.replace(/\{\{token\}\}/g, model.triggerToken);
  const isCustom = Boolean(customPrompt && customPrompt.trim().length > 0);

  // High precision simulation based on model rank and preset category
  const logoBase = model.preservationMetrics?.logoFidelityPct || 99.2;
  const iouBase = model.preservationMetrics?.geometryIoUPct || 98.4;
  const sharpnessBase = (model.preservationMetrics?.textSharpnessScore || 9.7) * 10;

  // Add minute realistic variation
  const logoIntegrityPct = Number(Math.min(99.9, Math.max(97.5, logoBase + (Math.random() * 0.4 - 0.2))).toFixed(1));
  const geometrySilhouetteIoU = Number(Math.min(99.5, Math.max(96.8, iouBase + (Math.random() * 0.4 - 0.2))).toFixed(1));
  const materialPurityPct = Number(Math.min(99.8, Math.max(97.0, (sharpnessBase + 0.1) + (Math.random() * 0.3 - 0.15))).toFixed(1));

  const imageSrc =
    model.category === 'apparel_footwear'
      ? '/src/assets/images/b2b_sneaker_commercial_1793008333912.jpg'
      : '/src/assets/images/b2b_product_perfume_bottle_1793008331955.jpg';

  return {
    testId: `test-run-${Date.now()}`,
    presetId: preset.id,
    scenarioName: isCustom ? 'Custom Enterprise Prompt' : preset.scenarioName,
    modelId: model.id,
    modelToken: model.triggerToken,
    renderedImage: imageSrc,
    logoIntegrityPct,
    geometrySilhouetteIoU,
    materialPurityPct,
    status: logoIntegrityPct >= 98.0 && geometrySilhouetteIoU >= 97.0 ? 'passed' : 'review_needed',
    renderTimeSec: Number((1.8 + Math.random() * 0.8).toFixed(2)),
    timestamp: new Date().toLocaleTimeString(),
  };
}

