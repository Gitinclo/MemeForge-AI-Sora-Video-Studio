/**
 * 2026 Post-Sora Ecosystem Migration & Multi-Model Engine Hub
 * Comprehensive catalog, pricing comparison (Veo3 vs Seedance),
 * and Magic Hour API migration adapter tooling.
 */

export type VideoEngineId =
  | 'leo-8k'
  | 'veo3'
  | 'seedance'
  | 'magic-hour'
  | 'oakgen'
  | 'heygen'
  | 'insmind';

export type EngineCategory =
  | 'Cinematic & 8K Video'
  | 'Developer & API Migration'
  | 'Social Media & Marketing';

export interface VideoEngineProfile {
  id: VideoEngineId;
  name: string;
  vendor: string;
  category: EngineCategory;
  bestFor: string;
  keyAdvantageOverSora: string;
  maxResolution: string;
  pricingSummary: string;
  pricingModel: 'Free & Pro' | 'Freemium / Credit' | 'API Pay-per-Second' | 'Seat Subscription';
  costPerSecondUsd?: number;
  highlightFeatures: string[];
  latencyRank: 'Ultra-Fast (<1s)' | 'Interactive (~10s)' | 'Production Async (1-3m)' | 'Heavy Multi-Pass (5m+)';
  recommendedUseCases: string[];
  cameraControl: 'Prompt Only' | '6-Axis Physics & Splines' | 'Director Presets' | 'Avatar Anchor' | 'Mobile Auto';
  apiAvailable: boolean;
  isOpenAccess: boolean;
  badge: string;
}

export const VIDEO_ENGINES_2026: VideoEngineProfile[] = [
  {
    id: 'leo-8k',
    name: 'LEO 8K DiT Master',
    vendor: 'MemeForge Studio Core',
    category: 'Cinematic & 8K Video',
    bestFor: 'True 8K Cascaded Cinema Masters & Spacetime Patches',
    keyAdvantageOverSora: 'Native 8K (7680×4320) Cascaded Super-Resolution, zero monthly credit caps on Pro, and local client synthesis',
    maxResolution: '8K Cinema Master (7680×4320)',
    pricingSummary: 'Included in India Pro (₹999/mo) / Enterprise (₹99,999/mo)',
    pricingModel: 'Seat Subscription',
    highlightFeatures: [
      '3D Spacetime Patches (4×8×8) with 3D VAE Latent Compression',
      '3-Stage Cascaded Super-Resolution (1080p -> 4K -> 8K)',
      'Flow Matching & Rectified Flows with Euler/RK4 ODE solvers',
      'Synthetic VLM dense camera optics re-captioning',
    ],
    latencyRank: 'Production Async (1-3m)',
    recommendedUseCases: ['Feature films', '8K IMAX storyboards', 'Ultra-fidelity commercial VFX'],
    cameraControl: 'Director Presets',
    apiAvailable: true,
    isOpenAccess: true,
    badge: '8K FLAGSHIP',
  },
  {
    id: 'veo3',
    name: 'Veo3 AI',
    vendor: 'DeepMind / Independent Community',
    category: 'Cinematic & 8K Video',
    bestFor: 'General Creativity & Free Access',
    keyAdvantageOverSora: 'Unrestricted free access, zero invite codes or waitlists, and relaxed creative guardrails',
    maxResolution: '4K Ultra (3840×2160) & 8K Preview',
    pricingSummary: 'Generous Free Tier; $19/mo Pro; $0.03/sec Pay-as-you-go',
    pricingModel: 'Free & Pro',
    costPerSecondUsd: 0.03,
    highlightFeatures: [
      'The "People\'s Successor" to Sora after 2026 discontinuation',
      'High semantic prompt adherence without heavy safety filtering',
      'Instant queue access without invitation codes',
      'Native cinematic color grading (Rec.709 & Log profiles)',
    ],
    latencyRank: 'Production Async (1-3m)',
    recommendedUseCases: ['Indie filmmaking', 'Experimental creative visuals', 'Music video concepts'],
    cameraControl: 'Prompt Only',
    apiAvailable: true,
    isOpenAccess: true,
    badge: 'COMMUNITY FAVORITE',
  },
  {
    id: 'seedance',
    name: 'Seedance 1.0',
    vendor: 'Hedra',
    category: 'Cinematic & 8K Video',
    bestFor: 'Pro Filmmaking & Precision Motion Control',
    keyAdvantageOverSora: 'Granular trajectory control over character movement and 6-axis camera physics over raw prompt randomness',
    maxResolution: '4K Ultra (3840×2160)',
    pricingSummary: 'Free trial; $29/mo Animator; $79/mo Studio; $0.06/sec API',
    pricingModel: 'Freemium / Credit',
    costPerSecondUsd: 0.06,
    highlightFeatures: [
      '6-Axis Camera Physics (Pan, Tilt, Roll, Dolly, Crane, Orbit)',
      'Character skeletal trajectory splines and anchor point locking',
      'Zero temporal identity drift across multi-cut sequence plans',
      'Alembic / FBX camera motion import & export for Blender/Maya',
    ],
    latencyRank: 'Production Async (1-3m)',
    recommendedUseCases: ['Technical animation', 'Virtual production pre-vis', 'Action choreography'],
    cameraControl: '6-Axis Physics & Splines',
    apiAvailable: true,
    isOpenAccess: true,
    badge: 'PRO DIRECTORS',
  },
  {
    id: 'magic-hour',
    name: 'Magic Hour',
    vendor: 'Magic Hour Labs',
    category: 'Developer & API Migration',
    bestFor: 'App Developers & Sora API Migration',
    keyAdvantageOverSora: 'First-class drop-in Sora API migration workflows, bulletproof async webhooks, and video-to-video style transfer',
    maxResolution: '4K Ultra (3840×2160)',
    pricingSummary: 'Usage-based API: $0.04/sec standard, $0.09/sec Video-to-Video',
    pricingModel: 'API Pay-per-Second',
    costPerSecondUsd: 0.04,
    highlightFeatures: [
      'Specialized 2026 Sora API Migration compatibility endpoint',
      'Video-to-Video style transfer with high temporal stability',
      'Bulk batch generation queue with webhook completion callbacks',
      'Official TypeScript, Python, and Go developer SDKs',
    ],
    latencyRank: 'Interactive (~10s)',
    recommendedUseCases: ['Third-party video applications', 'Automated SaaS video workflows', 'Batch social generation'],
    cameraControl: 'Director Presets',
    apiAvailable: true,
    isOpenAccess: true,
    badge: 'DEV MIGRATION',
  },
  {
    id: 'oakgen',
    name: 'Oakgen',
    vendor: 'Oakgen AI',
    category: 'Developer & API Migration',
    bestFor: 'Real-Time Interactive Applications',
    keyAdvantageOverSora: 'Sub-second real-time streaming video generation prioritizing low latency over 8K render weight',
    maxResolution: '1080p FHD (1920×1080)',
    pricingSummary: '$0.015/sec real-time streaming token credits',
    pricingModel: 'API Pay-per-Second',
    costPerSecondUsd: 0.015,
    highlightFeatures: [
      'Sub-500ms first-frame response time',
      'Optimized for live interactive games and spatial streams',
      'WebRTC streaming endpoint with dynamic prompt steering',
      'Compact model footprint for edge deployments',
    ],
    latencyRank: 'Ultra-Fast (<1s)',
    recommendedUseCases: ['Live interactive streams', 'Real-time metaverse experiences', 'Rapid concept ideation'],
    cameraControl: 'Prompt Only',
    apiAvailable: true,
    isOpenAccess: true,
    badge: 'REAL-TIME SPEED',
  },
  {
    id: 'heygen',
    name: 'HeyGen Studio 2026',
    vendor: 'HeyGen Inc.',
    category: 'Social Media & Marketing',
    bestFor: 'Business, Ads & Talking Head Avatars',
    keyAdvantageOverSora: 'Flawless lip-synced talking head avatars and personalized sales outreach replacing Sora Cameos',
    maxResolution: '4K Ultra (3840×2160)',
    pricingSummary: '$29/mo Creator; $89/mo Team; Enterprise API custom',
    pricingModel: 'Seat Subscription',
    highlightFeatures: [
      'Micro-expression synchronization with natural gaze physics',
      '120+ language real-time voice cloning and lip matching',
      'Custom photo-to-talking-avatar instant pipeline',
      'CRM & Zapier automated video outreach triggers',
    ],
    latencyRank: 'Interactive (~10s)',
    recommendedUseCases: ['Corporate training', 'Sales outreach personalization', 'Multilingual localized ads'],
    cameraControl: 'Avatar Anchor',
    apiAvailable: true,
    isOpenAccess: true,
    badge: 'BEST LIP-SYNC',
  },
  {
    id: 'insmind',
    name: 'InsMind Mobile & Social',
    vendor: 'InsMind Creative',
    category: 'Social Media & Marketing',
    bestFor: 'All-in-One Viral Social Content',
    keyAdvantageOverSora: 'Mobile-first vertical 9:16 workflow with integrated smart auto-captioning and sound sync',
    maxResolution: '1080p Vertical (1080×1920)',
    pricingSummary: 'Freemium mobile app; $12.99/mo Pro Unlimited',
    pricingModel: 'Free & Pro',
    highlightFeatures: [
      'Automatic kinetic subtitle burning with viral styling',
      'Beat-matched transitions to trending audio tracks',
      'One-tap background removal and meme overlaying',
      'Direct publishing to TikTok, Reels, and YouTube Shorts',
    ],
    latencyRank: 'Interactive (~10s)',
    recommendedUseCases: ['TikTok & YouTube Shorts', 'Instagram Reels', 'Quick viral reaction clips'],
    cameraControl: 'Mobile Auto',
    apiAvailable: false,
    isOpenAccess: true,
    badge: 'VIRAL SHORTS',
  },
];

// Deep-Dive Comparison: Veo3 AI vs Seedance 1.0 (Hedra)
export interface ModelPricingTier {
  tierName: string;
  monthlyCostUsd: number;
  monthlyCostInr: number;
  inclusions: string;
  targetAudience: string;
}

export interface DetailedEngineComparison {
  engineA: {
    id: string;
    name: string;
    vendor: string;
    headline: string;
    pricingTiers: ModelPricingTier[];
    costPerSecondUsd: number;
    motionApproach: string;
    promptFidelityScore: number; // 0-100
    motionControlScore: number; // 0-100
    latencySeconds10sClip: number;
    commercialRights: string;
    strengths: string[];
    tradeoffs: string[];
    bestSuitedUser: string;
  };
  engineB: {
    id: string;
    name: string;
    vendor: string;
    headline: string;
    pricingTiers: ModelPricingTier[];
    costPerSecondUsd: number;
    motionApproach: string;
    promptFidelityScore: number; // 0-100
    motionControlScore: number; // 0-100
    latencySeconds10sClip: number;
    commercialRights: string;
    strengths: string[];
    tradeoffs: string[];
    bestSuitedUser: string;
  };
  verdictMatrix: {
    scenario: string;
    winner: 'Veo3 AI' | 'Seedance 1.0 (Hedra)' | 'Tie / Hybrid';
    reason: string;
  }[];
}

export const VEO3_VS_SEEDANCE_COMPARISON: DetailedEngineComparison = {
  engineA: {
    id: 'veo3',
    name: 'Veo3 AI',
    vendor: 'DeepMind / Open Video Coalition',
    headline: 'The Unrestricted Creative Powerhouse for Narrative Visionaries',
    pricingTiers: [
      {
        tierName: 'Free Community',
        monthlyCostUsd: 0,
        monthlyCostInr: 0,
        inclusions: '15 generations/day (720p/1080p), public queue, zero invite code needed',
        targetAudience: 'Hobbyists, students, indie creators exploring AI video',
      },
      {
        tierName: 'Creator Pro',
        monthlyCostUsd: 19,
        monthlyCostInr: 1599,
        inclusions: 'Unlimited 1080p generations, 80 priority 4K generations, relaxed content guardrails',
        targetAudience: 'Indie filmmakers, content creators, storyboard artists',
      },
      {
        tierName: 'Developer Pay-as-You-Go',
        monthlyCostUsd: 0,
        monthlyCostInr: 0,
        inclusions: '$0.03 / sec (1080p), $0.08 / sec (4K), REST API & batch webhook queue',
        targetAudience: 'Platform builders and automation scripts',
      },
    ],
    costPerSecondUsd: 0.03,
    motionApproach: 'Pure Semantic Diffusion Transformer with latent flow guidance',
    promptFidelityScore: 96,
    motionControlScore: 74,
    latencySeconds10sClip: 45,
    commercialRights: 'Full commercial rights granted on paid tiers; CC-BY on free tier',
    strengths: [
      'Unrestricted free tier without the invite-code waitlists that plagued Sora 2',
      'Exceptional understanding of dense, artistic, and multi-clause creative prompts',
      'Permissive prompt policy allows edgy narrative fiction and intense action',
      'Built-in Rec.709 and CineLog color space support for colorists',
    ],
    tradeoffs: [
      'Lacks precise keyframe positioning—camera path can wander over 15+ second cuts',
      'No character skeletal rigging or coordinate-based trajectory anchors',
      'Randomized physics when handling complex multi-limb acrobatics',
    ],
    bestSuitedUser: 'Filmmakers, writers, and artists who want raw visual beauty and high prompt adherence without rigid technical rigging.',
  },
  engineB: {
    id: 'seedance',
    name: 'Seedance 1.0',
    vendor: 'Hedra',
    headline: 'Deterministic Physics & Precision 6-Axis Motion Control',
    pricingTiers: [
      {
        tierName: 'Sandbox Free',
        monthlyCostUsd: 0,
        monthlyCostInr: 0,
        inclusions: '3 watermarked 5-second trial clips, interactive trajectory sandbox',
        targetAudience: 'VFX artists testing camera path compatibility',
      },
      {
        tierName: 'Animator Pro',
        monthlyCostUsd: 29,
        monthlyCostInr: 2499,
        inclusions: 'Granular trajectory splines, 6-axis camera physics, 4K rendering, zero watermark',
        targetAudience: '3D animators, technical directors, previs supervisors',
      },
      {
        tierName: 'Studio Production',
        monthlyCostUsd: 79,
        monthlyCostInr: 6699,
        inclusions: 'Skeletal motion keyframing, multi-character interaction, Alembic/FBX camera path export, priority GPU cluster',
        targetAudience: 'VFX studios, commercial agencies, virtual production teams',
      },
    ],
    costPerSecondUsd: 0.06,
    motionApproach: 'Trajectory-Conditioned Diffusion with physical coordinate vectors',
    promptFidelityScore: 84,
    motionControlScore: 98,
    latencySeconds10sClip: 60,
    commercialRights: 'Full perpetual commercial rights across all tiers including Sandbox with license tag',
    strengths: [
      'True 6-Axis Camera Physics (Pan, Tilt, Roll, Dolly, Crane, 360 Orbit)',
      'Draw direct trajectory vectors on canvas to dictate where subjects walk and run',
      'Zero temporal identity drift across multi-character interactions',
      'Seamless roundtrip integration with Blender, Maya, and Unreal Engine via FBX export',
    ],
    tradeoffs: [
      'Pricier per-second API cost ($0.06/sec vs Veo3 $0.03/sec)',
      'Requires spatial configuration; less forgiving if you only supply a 3-word prompt',
      'Slightly lower stylization variety compared to pure artistic diffusion models',
    ],
    bestSuitedUser: 'Animators, VFX artists, and commercial directors who demand exact camera choreography and cannot tolerate random subject drifting.',
  },
  verdictMatrix: [
    {
      scenario: 'Low Budget / Solo Creator / Quick Ideation',
      winner: 'Veo3 AI',
      reason: 'Veo3 AI offers an unrestricted free tier and a lower $19/mo plan with no invite codes needed.',
    },
    {
      scenario: 'Camera Pre-Visualization & Complex 3D Choreography',
      winner: 'Seedance 1.0 (Hedra)',
      reason: 'Seedance gives you exact 6-axis camera physics and spline trajectory vectors that match production cinema rigs.',
    },
    {
      scenario: 'Poetic & Surreal Storytelling',
      winner: 'Veo3 AI',
      reason: 'Veo3 scores 96/100 on prompt fidelity and excels at atmospheric, abstract, and high-contrast aesthetic interpretation.',
    },
    {
      scenario: 'Multi-Scene Continuity & Commercial Product Placement',
      winner: 'Seedance 1.0 (Hedra)',
      reason: 'Seedance locks subject identity coordinates, preventing character faces or product logos from morphing between shots.',
    },
    {
      scenario: '8K Ultra Master Final Delivery',
      winner: 'Tie / Hybrid',
      reason: 'Generate choreography in Seedance or Veo3, then feed the 1080p/4K master into LEO 8K Cascaded DiT for final 8K delivery.',
    },
  ],
};

// Magic Hour API Integration & Sora Migration Tooling
export interface MagicHourApiConfig {
  apiKey?: string;
  baseUrl: string;
  defaultFps: number;
  defaultResolution: '720p' | '1080p' | '4K';
  webhookUrl?: string;
}

export function getMagicHourMigrationSnippet(format: 'typescript' | 'python' | 'curl' | 'sora_adapter'): string {
  switch (format) {
    case 'typescript':
      return `// Magic Hour 2026 Node.js / TypeScript SDK Client
// Install: npm install axios
import axios from 'axios';

export interface MagicHourVideoRequest {
  prompt: string;
  negative_prompt?: string;
  resolution: '720p' | '1080p' | '4k';
  duration_seconds: number;
  fps?: number;
  style_preset?: 'cinematic' | 'photoreal' | 'anime' | 'cyberpunk';
  camera_motion?: {
    type: 'dolly' | 'pan' | 'orbit' | 'tilt';
    speed: number;
  };
  webhook_url?: string;
}

export class MagicHourClient {
  private client = axios.create({
    baseURL: 'https://api.magichour.ai/v1',
    headers: {
      'Authorization': \`Bearer \${process.env.MAGIC_HOUR_API_KEY}\`,
      'Content-Type': 'application/json',
      'X-Client-Version': '2026.4-sora-migration',
    },
  });

  async createVideo(params: MagicHourVideoRequest): Promise<{ id: string; status: string; poll_url: string }> {
    const res = await this.client.post('/video/generate', params);
    return res.data;
  }

  async pollUntilComplete(jobId: string, intervalMs = 4000): Promise<{ url: string; metadata: any }> {
    while (true) {
      const res = await this.client.get(\`/video/jobs/\${jobId}\`);
      const { status, output_url, error } = res.data;
      if (status === 'completed' && output_url) {
        return { url: output_url, metadata: res.data };
      }
      if (status === 'failed') {
        throw new Error(\`Magic Hour Generation Failed: \${error || 'Unknown error'}\`);
      }
      await new Promise((r) => setTimeout(r, intervalMs));
    }
  }

  // Video-to-Video Style Transfer Endpoint
  async styleTransfer(inputVideoUrl: string, targetStyle: string): Promise<{ id: string }> {
    const res = await this.client.post('/video/video-to-video', {
      source_video_url: inputVideoUrl,
      style_prompt: targetStyle,
      denoise_strength: 0.65,
      temporal_consistency: 0.92,
    });
    return res.data;
  }
}
`;

    case 'sora_adapter':
      return `// 🔄 DROP-IN SORA 2 TO MAGIC HOUR MIGRATION ADAPTER
// This shim replaces deprecated 'sora' SDK calls with zero backend refactoring!

import axios from 'axios';

export class SoraToMagicHourAdapter {
  private apiKey: string;
  private endpoint = 'https://api.magichour.ai/v1/video/generate';

  constructor(apiKey = process.env.MAGIC_HOUR_API_KEY || '') {
    this.apiKey = apiKey;
  }

  /**
   * Intercepts legacy Sora 2 SDK syntax:
   * await sora.videos.create({ prompt, model: "sora-2", seconds: 10, size: "1920x1080" })
   */
  async create(legacySoraPayload: {
    prompt: string;
    model?: string; // e.g. "sora-2", "sora-turbo"
    seconds?: number;
    size?: string; // e.g. "1920x1080", "3840x2160"
    fps?: number;
    negative_prompt?: string;
  }) {
    // Map legacy Sora resolution strings to Magic Hour standard
    let mappedResolution: '720p' | '1080p' | '4k' = '1080p';
    if (legacySoraPayload.size?.includes('3840') || legacySoraPayload.size === '4k') {
      mappedResolution = '4k';
    } else if (legacySoraPayload.size?.includes('1280') || legacySoraPayload.size === '720p') {
      mappedResolution = '720p';
    }

    const magicHourPayload = {
      prompt: legacySoraPayload.prompt,
      negative_prompt: legacySoraPayload.negative_prompt || 'low quality, artifacts, glitching',
      duration_seconds: legacySoraPayload.seconds || 10,
      resolution: mappedResolution,
      fps: legacySoraPayload.fps || 60,
      metadata: {
        source_client: 'sora-2-deprecated-adapter',
        original_model: legacySoraPayload.model || 'sora-2',
      },
    };

    console.log('[Migration Shim] Forwarding Sora 2 request to Magic Hour API:', magicHourPayload);

    // Call Magic Hour API
    const response = await axios.post(this.endpoint, magicHourPayload, {
      headers: {
        Authorization: \`Bearer \${this.apiKey}\`,
        'Content-Type': 'application/json',
      },
    });

    // Return in legacy Sora response structure for zero frontend code breakage
    return {
      id: response.data.id || \`mh_\${Date.now()}\`,
      object: 'video.generation',
      model: 'magic-hour-v2026 (migrated from sora-2)',
      created: Math.floor(Date.now() / 1000),
      status: response.data.status || 'processing',
      output: response.data.output_url || null,
      poll_url: response.data.poll_url || \`https://api.magichour.ai/v1/video/jobs/\${response.data.id}\`,
    };
  }
}

export const sora = {
  videos: new SoraToMagicHourAdapter(),
};
`;

    case 'python':
      return `# Magic Hour 2026 Python SDK & Sora Migration Client
# pip install httpx pydantic

import os
import time
import httpx

class MagicHourClient:
    def __init__(self, api_key: str = None):
        self.api_key = api_key or os.getenv("MAGIC_HOUR_API_KEY", "")
        self.base_url = "https://api.magichour.ai/v1"
        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
            "User-Agent": "MemeForge-2026-Client"
        }

    def generate_video(self, prompt: str, resolution: str = "1080p", duration: int = 10, fps: int = 60) -> dict:
        """Dispatches an async video generation job to Magic Hour's cluster."""
        payload = {
            "prompt": prompt,
            "resolution": resolution,
            "duration_seconds": duration,
            "fps": fps,
            "temporal_coherence": 0.95
        }
        with httpx.Client(timeout=30.0) as client:
            resp = client.post(f"{self.base_url}/video/generate", json=payload, headers=self.headers)
            resp.raise_for_status()
            return resp.json()

    def wait_for_video(self, job_id: str, poll_interval: int = 5) -> str:
        """Polls until the video is rendered and returns the CDN streaming URL."""
        with httpx.Client(timeout=30.0) as client:
            while True:
                resp = client.get(f"{self.base_url}/video/jobs/{job_id}", headers=self.headers)
                data = resp.json()
                status = data.get("status")
                if status == "completed":
                    return data.get("output_url")
                elif status == "failed":
                    raise RuntimeError(f"Job failed: {data.get('error')}")
                print(f"[Magic Hour] Rendering status: {status}... waiting {poll_interval}s")
                time.sleep(poll_interval)
`;

    case 'curl':
      return `# Magic Hour 2026 Direct REST API (cURL)
# 1. Dispatch generation job
curl -X POST "https://api.magichour.ai/v1/video/generate" \\
  -H "Authorization: Bearer $MAGIC_HOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "prompt": "Cinematic 8K tracking shot of an automated hovercraft gliding through misty neon metropolis, photoreal",
    "resolution": "4k",
    "duration_seconds": 10,
    "fps": 60,
    "style_preset": "cinematic"
  }'

# 2. Check Job Status
curl -X GET "https://api.magichour.ai/v1/video/jobs/JOB_ID_HERE" \\
  -H "Authorization: Bearer $MAGIC_HOUR_API_KEY"
`;
  }
}

/**
 * Helper to simulate or execute Magic Hour dispatch
 */
export async function simulateMagicHourJob(params: {
  prompt: string;
  resolution: string;
  fps: number;
  durationSeconds: number;
}): Promise<{
  jobId: string;
  status: 'queued' | 'processing' | 'completed';
  simulatedTimeMs: number;
  outputPreviewUrl: string;
  specs: typeof params;
}> {
  const jobId = 'mh_' + Math.random().toString(36).substring(2, 10);
  return {
    jobId,
    status: 'completed',
    simulatedTimeMs: 1400,
    outputPreviewUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80',
    specs: params,
  };
}
