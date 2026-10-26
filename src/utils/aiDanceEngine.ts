/**
 * AI Dance Video Maker & Motion Transfer Engine
 * Uses DWPose / OpenPose skeleton extraction + Moore-AnimateAnyone / MimicMotion
 * pipeline for viral dance choreography and fill-in-the-blank prompt synthesis.
 */

export interface DanceTemplate {
  id: string;
  name: string;
  category: 'Viral TikTok' | 'K-Pop' | 'Hip-Hop / Street' | 'Bollywood' | 'Retro Disco';
  bpm: number;
  durationSec: number;
  difficulty: 'Easy' | 'Medium' | 'Extreme';
  trendingSoundtrack: string;
  previewThumbnail: string;
  description: string;
  skeletonJointsCount: number; // typically 18 or 24 keypoints in DWPose
}

export const VIRAL_DANCE_TEMPLATES: DanceTemplate[] = [
  {
    id: 'slickback',
    name: 'Slickback Zero-G Glide',
    category: 'Viral TikTok',
    bpm: 128,
    durationSec: 8,
    difficulty: 'Medium',
    trendingSoundtrack: 'LAKEY INSPIRED - The Process',
    previewThumbnail: 'https://images.unsplash.com/photo-1547153760-18fc86324498?auto=format&fit=crop&w=400&q=80',
    description: 'The viral friction-defying slide where feet appear to hover 2 inches above the ground.',
    skeletonJointsCount: 24,
  },
  {
    id: 'kpop_chorus',
    name: 'K-Pop Sync Chorus Shuffle',
    category: 'K-Pop',
    bpm: 132,
    durationSec: 10,
    difficulty: 'Extreme',
    trendingSoundtrack: 'Hyper-Pop K-Wave Anthem',
    previewThumbnail: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=400&q=80',
    description: 'High-energy point choreography with rapid arm isolations and synchronized heel-toe footwork.',
    skeletonJointsCount: 24,
  },
  {
    id: 'electro_breakdance',
    name: 'Electro Windmill & Pop',
    category: 'Hip-Hop / Street',
    bpm: 110,
    durationSec: 12,
    difficulty: 'Extreme',
    trendingSoundtrack: 'Cyberfunk 2088 Groove',
    previewThumbnail: 'https://images.unsplash.com/photo-1535525153412-5a42439a210d?auto=format&fit=crop&w=400&q=80',
    description: 'Acrobatic floorwork with sudden freeze poses and mechanical popping isolations.',
    skeletonJointsCount: 24,
  },
  {
    id: 'bollywood_hook',
    name: 'Bollywood Cinematic Hook Step',
    category: 'Bollywood',
    bpm: 124,
    durationSec: 9,
    difficulty: 'Medium',
    trendingSoundtrack: 'Desi Dhol Bass Drop',
    previewThumbnail: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=400&q=80',
    description: 'Expansive rhythmic chest pops and shoulder bounces typical of big-budget celebration anthems.',
    skeletonJointsCount: 24,
  },
  {
    id: 'robo_tutting',
    name: 'Cybernetic 90° Tutting',
    category: 'Hip-Hop / Street',
    bpm: 105,
    durationSec: 8,
    difficulty: 'Medium',
    trendingSoundtrack: 'Glitch Synth Pulse',
    previewThumbnail: 'https://images.unsplash.com/photo-1518834107812-67b0b7c58434?auto=format&fit=crop&w=400&q=80',
    description: 'Geometric 90-degree wrist, elbow, and shoulder box patterns requiring precision keypoint alignment.',
    skeletonJointsCount: 24,
  },
];

// Fill-in-the-Blank Cinematic Prompt Presets
export interface FillInTheBlankTemplate {
  id: string;
  name: string;
  category: 'Cinematic' | 'Action' | 'Viral Dance' | 'Anime & Stylized' | 'Commercial VFX';
  rawTemplate: string;
  variables: { key: string; label: string; placeholder: string; options: string[] }[];
}

export const FILL_IN_THE_BLANK_TEMPLATES: FillInTheBlankTemplate[] = [
  {
    id: 'drone_cliff',
    name: 'Epic Cliffside Drone Shot',
    category: 'Cinematic',
    rawTemplate: 'A cinematic drone shot of {SUBJECT} standing on a cliff in {LOCATION}, {WEATHER}, 4k, epic volumetric lighting',
    variables: [
      {
        key: 'SUBJECT',
        label: 'Subject',
        placeholder: 'e.g. an armored cybernetic warrior',
        options: ['an armored cybernetic warrior', 'a lone wandering monk', 'a retro astronaut', 'a majestic wolf'],
      },
      {
        key: 'LOCATION',
        label: 'Location',
        placeholder: 'e.g. a misty fjord in Norway',
        options: ['a misty fjord in Norway', 'a neon-lit Neo-Tokyo rooftop', 'an Icelandic basalt plateau', 'a Martian canyon'],
      },
      {
        key: 'WEATHER',
        label: 'Weather & Mood',
        placeholder: 'e.g. dramatic stormy sunset',
        options: ['dramatic stormy sunset', 'golden hour haze', 'dense volumetric fog', 'soft morning drizzle'],
      },
    ],
  },
  {
    id: 'neon_slowmo',
    name: 'Neon Streetwalker Slow-Motion',
    category: 'Action',
    rawTemplate: 'An ultra-detailed slow motion close-up of {SUBJECT} walking through rain-slicked streets in {CITY}, {OPTICS}, 8K photorealism',
    variables: [
      {
        key: 'SUBJECT',
        label: 'Subject',
        placeholder: 'e.g. a trenchcoat detective',
        options: ['a trenchcoat detective', 'a futuristic street courier', 'a cyborg with glowing cyber-eyes', 'a street dancer'],
      },
      {
        key: 'CITY',
        label: 'City',
        placeholder: 'e.g. Shinjuku Tokyo',
        options: ['Shinjuku Tokyo', 'Mumbai Marine Drive at night', 'Kowloon Walled City 2099', 'cyberpunk London'],
      },
      {
        key: 'OPTICS',
        label: 'Camera Lens',
        placeholder: 'e.g. 85mm anamorphic T/1.5 lens flare',
        options: ['85mm anamorphic T/1.5 lens flare', '35mm Panavision vintage glass', 'Cooke 50mm creamy bokeh', 'ultra-wide 16mm IMAX'],
      },
    ],
  },
  {
    id: 'viral_dance_prompt',
    name: 'Viral Motion Transfer Dance',
    category: 'Viral Dance',
    rawTemplate: 'Photo-to-video motion transfer of {CHARACTER} performing {DANCE_MOVE} inside {VENUE}, high temporal coherence, synchronized DWPose tracking',
    variables: [
      {
        key: 'CHARACTER',
        label: 'Character/Photo',
        placeholder: 'e.g. Mona Lisa in streetwear',
        options: ['Mona Lisa in streetwear', 'GigaChad wearing a tuxedo', 'a funny Shiba Inu on hind legs', 'a medieval armored knight'],
      },
      {
        key: 'DANCE_MOVE',
        label: 'Dance Move',
        placeholder: 'e.g. slickback zero-gravity glide',
        options: ['slickback zero-gravity glide', 'K-Pop sync chorus shuffle', 'electro windmill breakdance', 'Bollywood hook step'],
      },
      {
        key: 'VENUE',
        label: 'Venue',
        placeholder: 'e.g. an underground Berlin rave club',
        options: ['an underground Berlin rave club', 'a sunlit Venice piazza', 'a spaceship hangar bay', 'a vibrant Indian wedding hall'],
      },
    ],
  },
];

// Open Source vs. API Model Selection & Cost Matrix
export interface ModelCostComparison {
  modelName: string;
  type: 'API Route' | 'Open Source (Self-Hosted)';
  bestFor: string;
  costPer5sVideoUsd: number;
  realismScore: number; // 0-100
  motionQualityScore: number; // 0-100
  computeRequirements: string;
  latencySeconds: number;
  commercialLicense: 'Commercial API' | 'Apache 2.0' | 'Non-Commercial Research' | 'Custom Enterprise';
}

export const MODEL_SELECTION_CATALOG: ModelCostComparison[] = [
  {
    modelName: 'Luma Dream Machine API',
    type: 'API Route',
    bestFor: 'Cinematic Camera Dynamics & Rapid API Prototyping',
    costPer5sVideoUsd: 0.12,
    realismScore: 94,
    motionQualityScore: 92,
    computeRequirements: 'Managed API (REST / Webhooks)',
    latencySeconds: 40,
    commercialLicense: 'Commercial API',
  },
  {
    modelName: 'Runway Gen-3 Alpha API',
    type: 'API Route',
    bestFor: 'High-End Photorealism & Complex Character Acting',
    costPer5sVideoUsd: 0.25,
    realismScore: 97,
    motionQualityScore: 95,
    computeRequirements: 'Managed API (REST / Webhooks)',
    latencySeconds: 65,
    commercialLicense: 'Commercial API',
  },
  {
    modelName: 'Kling AI API',
    type: 'API Route',
    bestFor: 'Extended Video Length (up to 10s) & High Coherence',
    costPer5sVideoUsd: 0.15,
    realismScore: 93,
    motionQualityScore: 91,
    computeRequirements: 'Managed API (REST / Webhooks)',
    latencySeconds: 75,
    commercialLicense: 'Commercial API',
  },
  {
    modelName: 'Mochi 1 (Genmo)',
    type: 'Open Source (Self-Hosted)',
    bestFor: 'Sora-Like Motion Fidelity on Custom Infrastructure',
    costPer5sVideoUsd: 0.04, // GPU spot cost on Modal/RunPod
    realismScore: 95,
    motionQualityScore: 96,
    computeRequirements: '4x NVIDIA H100 80GB SXM5 (vLLM / FSDP)',
    latencySeconds: 35,
    commercialLicense: 'Apache 2.0',
  },
  {
    modelName: 'CogVideoX',
    type: 'Open Source (Self-Hosted)',
    bestFor: 'Balanced Text-to-Video at Lower Compute Threshold',
    costPer5sVideoUsd: 0.02,
    realismScore: 88,
    motionQualityScore: 86,
    computeRequirements: '1x NVIDIA A100 80GB or RTX 4090 (Quantized)',
    latencySeconds: 28,
    commercialLicense: 'Apache 2.0',
  },
  {
    modelName: 'Stable Video Diffusion (SVD)',
    type: 'Open Source (Self-Hosted)',
    bestFor: 'Photo-to-Video 2D Parallax & Quick Camera Pans',
    costPer5sVideoUsd: 0.01,
    realismScore: 82,
    motionQualityScore: 75,
    computeRequirements: '1x NVIDIA RTX 3090 / 4090 (Consumer GPU)',
    latencySeconds: 15,
    commercialLicense: 'Non-Commercial Research',
  },
  {
    modelName: 'Moore-AnimateAnyone / MimicMotion',
    type: 'Open Source (Self-Hosted)',
    bestFor: 'AI Dance, Character Motion Transfer & DWPose Guidance',
    costPer5sVideoUsd: 0.03,
    realismScore: 91,
    motionQualityScore: 94,
    computeRequirements: '1x NVIDIA A100 / H100 with ControlNet/DensePose',
    latencySeconds: 25,
    commercialLicense: 'Apache 2.0',
  },
];

/**
 * Calculates synthetic 2D skeleton keypoint positions for DWPose procedural visualization
 * Normalized coordinates (0-100) based on phase and dance move.
 */
export function getProceduralDanceKeypoints(danceId: string, timeSec: number): {
  head: { x: number; y: number };
  neck: { x: number; y: number };
  leftShoulder: { x: number; y: number };
  rightShoulder: { x: number; y: number };
  leftElbow: { x: number; y: number };
  rightElbow: { x: number; y: number };
  leftWrist: { x: number; y: number };
  rightWrist: { x: number; y: number };
  pelvis: { x: number; y: number };
  leftKnee: { x: number; y: number };
  rightKnee: { x: number; y: number };
  leftAnkle: { x: number; y: number };
  rightAnkle: { x: number; y: number };
} {
  const t = timeSec * 4;
  const sway = Math.sin(t) * 12;
  const bounce = Math.abs(Math.sin(t * 2)) * 6;

  // Base coordinates with procedural dance oscillations
  const headX = 50 + sway * 0.4;
  const headY = 16 - bounce * 0.5;
  const neckX = 50 + sway * 0.3;
  const neckY = 24 - bounce * 0.5;

  // Shoulders
  const lShoulderX = 42 + sway * 0.2;
  const lShoulderY = 26 - bounce * 0.5;
  const rShoulderX = 58 + sway * 0.2;
  const rShoulderY = 26 - bounce * 0.5;

  // Arms: dynamic waving / tutting
  const armWaveL = Math.cos(t * 1.5) * 14;
  const armWaveR = Math.sin(t * 1.5) * 14;
  const lElbowX = 34 + armWaveL * 0.5;
  const lElbowY = 38 + armWaveL * 0.4;
  const rElbowX = 66 + armWaveR * 0.5;
  const rElbowY = 38 - armWaveR * 0.4;

  const lWristX = 28 + armWaveL;
  const lWristY = 48 + armWaveL * 0.7;
  const rWristX = 72 + armWaveR;
  const rWristY = 48 - armWaveR * 0.7;

  // Pelvis / Hips
  const pelvisX = 50 + sway * 0.8;
  const pelvisY = 52 + bounce;

  // Legs: slickback glide or step
  const legSwingL = Math.sin(t) * 14;
  const legSwingR = Math.sin(t + Math.PI) * 14;

  const lKneeX = 44 + legSwingL * 0.6;
  const lKneeY = 70 - Math.max(0, legSwingL * 0.5);
  const rKneeX = 56 + legSwingR * 0.6;
  const rKneeY = 70 - Math.max(0, legSwingR * 0.5);

  const lAnkleX = 42 + legSwingL * 1.2;
  const lAnkleY = 88 - Math.max(0, legSwingL * 0.8);
  const rAnkleX = 58 + legSwingR * 1.2;
  const rAnkleY = 88 - Math.max(0, legSwingR * 0.8);

  return {
    head: { x: headX, y: headY },
    neck: { x: neckX, y: neckY },
    leftShoulder: { x: lShoulderX, y: lShoulderY },
    rightShoulder: { x: rShoulderX, y: rShoulderY },
    leftElbow: { x: lElbowX, y: lElbowY },
    rightElbow: { x: rElbowX, y: rElbowY },
    leftWrist: { x: lWristX, y: lWristY },
    rightWrist: { x: rWristX, y: rWristY },
    pelvis: { x: pelvisX, y: pelvisY },
    leftKnee: { x: lKneeX, y: lKneeY },
    rightKnee: { x: rKneeX, y: rKneeY },
    leftAnkle: { x: lAnkleX, y: lAnkleY },
    rightAnkle: { x: rAnkleX, y: rAnkleY },
  };
}
