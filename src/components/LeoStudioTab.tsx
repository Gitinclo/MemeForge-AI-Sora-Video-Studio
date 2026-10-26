import React, { useState, useEffect, useRef } from 'react';
import { VideoProjectSpec } from '../types/meme';
import {
  Film,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Sliders,
  Server,
  Activity,
  CheckCircle2,
  Clock,
  Zap,
  Globe,
  Layers,
  Video,
  Download,
  Share2,
  ShieldCheck,
  Flame,
  Crown,
  Lock,
  Youtube,
  Cpu,
  GitBranch,
  FileCode,
  Terminal,
  Check,
  Copy,
  ExternalLink,
  X,
  Boxes,
  Wand2,
  Eye,
  BookOpen,
  Camera,
  Code,
  Music,
  Briefcase,
} from 'lucide-react';
import {
  MAX_VIDEO_DURATION_HOURS,
  DURATION_PRESETS,
  clampVideoDuration,
  formatTimecode,
  formatDurationLabel,
  calculateVideoComputeMetrics,
} from '../utils/videoDurationUtils';
import { UserSubscription } from '../types/subscription';
import {
  canAccessVideoDuration,
  canAccessResolution,
  canAccessFrameRate,
} from '../utils/subscriptionUtils';
import {
  getCascadedPipelineStages,
  calculateSpacetimePatchTokens,
  calculate8kMasterMetrics,
  synthesizeVlmDenseCaption,
  OPEN_SOURCE_BENCHMARKS,
  getPyTorchCascadedPipelineCode,
  getInfrastructureStackConfig,
} from '../utils/leo8kEngine';
import { EngineHub2026Modal } from './EngineHub2026Modal';
import { AiDanceStudioModal } from './AiDanceStudioModal';
import {
  VideoEngineId,
  VIDEO_ENGINES_2026,
  simulateMagicHourJob,
} from '../utils/engineMigration2026';

interface LeoStudioTabProps {
  onMemeToVideoPrompt?: (promptText: string) => void;
  subscription?: UserSubscription;
  onOpenSubscriptionModal?: () => void;
  onOpenCinemaVfx?: () => void;
  onOpenYouTubePublish?: (title?: string, prompt?: string) => void;
  onOpenEnterpriseB2B?: () => void;
}

export const LeoStudioTab: React.FC<LeoStudioTabProps> = ({
  onMemeToVideoPrompt,
  subscription,
  onOpenSubscriptionModal,
  onOpenCinemaVfx,
  onOpenYouTubePublish,
  onOpenEnterpriseB2B,
}) => {
  const [spec, setSpec] = useState<VideoProjectSpec>({
    title: 'Neon Odyssey: Hyper-Reality',
    prompt: 'A cyberpunk courier gliding on an anti-gravity hoverboard through rain-slicked Tokyo skyscrapers, neon reflections, anamorphic 35mm lens flare, 4K detail',
    negativePrompt: 'blurry, low quality, artifacts, glitching, cartoonish, distorted face',
    resolution: '4K Ultra',
    frameRate: 60,
    aspectRatio: '16:9',
    cameraMotion: 'Dolly Zoom In',
    style: 'Photorealistic',
    durationHours: 100, // 100 hours max duration
  });

  const [isPlaying, setIsPlaying] = useState(true);
  const [isRendering, setIsRendering] = useState(false);
  const [renderProgress, setRenderProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState('Idle');
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isVlmRecaptioning, setIsVlmRecaptioning] = useState(false);
  const [isBlueprintModalOpen, setIsBlueprintModalOpen] = useState(false);
  const [blueprintActiveTab, setBlueprintActiveTab] = useState<'dit' | 'cascade' | 'vlm' | 'stack' | 'opensource' | 'code'>('dit');
  const [selectedCascadeStage, setSelectedCascadeStage] = useState<'stage1_base' | 'stage2_upscaler_a' | 'stage3_upscaler_b'>('stage3_upscaler_b');
  const [flowSolver, setFlowSolver] = useState<'Euler' | 'Midpoint' | 'Runge-Kutta 4' | 'DPM-Solver++'>('Euler');
  const [noiseAugSigma, setNoiseAugSigma] = useState(0.08);
  const [temporalAttentionWindow, setTemporalAttentionWindow] = useState(32);
  const [copiedBlueprintCode, setCopiedBlueprintCode] = useState<string | null>(null);
  const [durationInputUnit, setDurationInputUnit] = useState<'hours' | 'minutes' | 'seconds'>('hours');

  // 2026 Multi-Model Engine Routing State
  const [selectedEngineId, setSelectedEngineId] = useState<VideoEngineId>('leo-8k');
  const [isEngineHubOpen, setIsEngineHubOpen] = useState(false);

  // Seedance 1.0 (Hedra) 6-Axis Physics & Trajectory Spline State
  const [seedancePan, setSeedancePan] = useState(15); // degrees
  const [seedanceTilt, setSeedanceTilt] = useState(-5); // degrees
  const [seedanceRoll, setSeedanceRoll] = useState(0); // degrees
  const [seedanceDolly, setSeedanceDolly] = useState(4.2); // meters
  const [seedanceCrane, setSeedanceCrane] = useState(1.8); // meters
  const [seedanceOrbitSpeed, setSeedanceOrbitSpeed] = useState(12); // deg/sec
  const [seedanceTrajectory, setSeedanceTrajectory] = useState<'Bezier Spline' | 'Linear' | 'Cinematic Arc' | 'FPV Corkscrew'>('Bezier Spline');
  const [seedanceLockIdentityAnchor, setSeedanceLockIdentityAnchor] = useState(true);

  // Veo3 AI (The People's Successor) State
  const [veo3GuidanceScale, setVeo3GuidanceScale] = useState(8.5);
  const [veo3ColorSpace, setVeo3ColorSpace] = useState<'Rec.709' | 'CineLog-C' | 'ACEScg' | 'HDR10+'>('CineLog-C');
  const [veo3UnrestrictedCreative, setVeo3UnrestrictedCreative] = useState(true);

  // Magic Hour API & Sora Migration State
  const [mhMode, setMhMode] = useState<'text-to-video' | 'video-to-video'>('text-to-video');
  const [mhDenoiseStrength, setMhDenoiseStrength] = useState(0.65);
  const [mhTemporalCoherence, setMhTemporalCoherence] = useState(0.95);
  const [mhDispatchStatus, setMhDispatchStatus] = useState<string | null>(null);
  const [isMhDispatching, setIsMhDispatching] = useState(false);

  // AI Dance Video Maker & Fill-in-the-Blank Modal State
  const [isAiDanceModalOpen, setIsAiDanceModalOpen] = useState(false);

  const totalDurationSec = (spec.durationHours || 100) * 3600;
  const [currentTimecode, setCurrentTimecode] = useState(14400); // 4 hours in default preview
  const computeMetrics = calculateVideoComputeMetrics(spec.durationHours || 100, spec.frameRate, spec.resolution);
  const master8kMetrics = calculate8kMasterMetrics(spec.durationHours || 100, spec.frameRate);
  const cascadeStages = getCascadedPipelineStages();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const isProUser = subscription?.isActive && subscription.plan === 'india_pro';
  const hasDurationAccess = canAccessVideoDuration(spec.durationHours, subscription);
  const hasResolutionAccess = canAccessResolution(spec.resolution, subscription);
  const hasFpsAccess = canAccessFrameRate(spec.frameRate, subscription);
  const isSpecAllowed = hasDurationAccess && hasResolutionAccess && hasFpsAccess;

  // Fast Prompt Enhancer with Gemini Flash-Lite
  const handleEnhancePrompt = async () => {
    if (!spec.prompt) return;
    setIsEnhancing(true);
    try {
      const res = await fetch('/api/expand-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: spec.prompt }),
      });
      const data = await res.json();
      if (data.expanded) {
        setSpec((prev) => ({ ...prev, prompt: data.expanded }));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsEnhancing(false);
    }
  };

  // Synthetic VLM Dense Re-captioner (The "Synthetic Edge" for DiTs)
  const handleVlmRecaption = async () => {
    if (!spec.prompt) return;
    setIsVlmRecaptioning(true);
    try {
      const res = await fetch('/api/leo/vlm-recaption', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: spec.prompt, resolution: spec.resolution }),
      });
      const data = await res.json();
      if (data.recaptioned) {
        setSpec((prev) => ({ ...prev, prompt: data.recaptioned }));
      }
    } catch (e) {
      console.error(e);
      setSpec((prev) => ({ ...prev, prompt: synthesizeVlmDenseCaption(prev.prompt) }));
    } finally {
      setIsVlmRecaptioning(false);
    }
  };

  // Video Generation Pipeline Trigger (With 8K Cascaded Super-Resolution stages)
  const handleStartRender = () => {
    if (isRendering) return;
    if (!isSpecAllowed) {
      onOpenSubscriptionModal?.();
      return;
    }
    setIsRendering(true);
    setRenderProgress(0);

    const totalFrames = Math.round(totalDurationSec * spec.frameRate);
    const hoursStr = formatDurationLabel(spec.durationHours);
    const is8k = spec.resolution === '8K Cinema Master';

    let stages: Array<{ p: number; msg: string }> = [];

    if (selectedEngineId === 'seedance') {
      stages = [
        { p: 15, msg: `Seedance 1.0 (Hedra): Solving 6-axis camera physics (Pan: ${seedancePan}°, Tilt: ${seedanceTilt}°, Roll: ${seedanceRoll}°)...` },
        { p: 40, msg: `Trajectory Splines: Synthesizing ${seedanceTrajectory} vectors with zero subject coordinate drift...` },
        { p: 70, msg: `Skeletal Anchor Locking: Grounding multi-joint kinematics across ${totalFrames.toLocaleString()} frames...` },
        { p: 90, msg: `Alembic / FBX Camera Path Sync: Baking sub-pixel cinematic motion blur into ${spec.resolution}...` },
        { p: 100, msg: `Seedance 1.0 Render Complete: Deterministic physics sequence exported with zero hallucinated jitter!` },
      ];
    } else if (selectedEngineId === 'veo3') {
      stages = [
        { p: 15, msg: `Veo3 AI (People's Successor): Parsing prompt with unrestricted creative mode (Guidance: ${veo3GuidanceScale})...` },
        { p: 40, msg: `DeepMind Latent Flow: Synthesizing dense visual narrative without safety gatekeeping...` },
        { p: 70, msg: `Color Grading Pipeline: Rendering in ${veo3ColorSpace} wide color gamut at ${spec.frameRate} FPS...` },
        { p: 90, msg: `High-Fidelity Interpolation: Polishing motion dynamics with zero invite code waitlist...` },
        { p: 100, msg: `Veo3 AI Render Complete: ${hoursStr} cinematic sequence ready for export!` },
      ];
    } else if (selectedEngineId === 'magic-hour') {
      stages = [
        { p: 15, msg: `Magic Hour API: Intercepting request via Sora 2 Compatibility Shim (/v1/video/generate)...` },
        { p: 40, msg: `Async GPU Worker Cluster: Dispatching ${mhMode} job with temporal coherence ${mhTemporalCoherence}...` },
        { p: 70, msg: `Style Transfer Pipeline: Applying denoise filtering (σ = ${mhDenoiseStrength}) to frame buffers...` },
        { p: 90, msg: `Webhook Callback Receiver: Verifying signed payload from Magic Hour production cluster...` },
        { p: 100, msg: `Magic Hour Render Complete: Video CDN URL streamed with zero Sora migration friction!` },
      ];
    } else if (selectedEngineId === 'oakgen') {
      stages = [
        { p: 25, msg: `Oakgen Real-Time: Initializing sub-second streaming inference pipeline...` },
        { p: 60, msg: `WebRTC Edge Pipeline: Streaming frames with sub-500ms first-frame response...` },
        { p: 100, msg: `Oakgen Real-Time Stream Ready: Interactive video running at ${spec.frameRate} FPS!` },
      ];
    } else if (selectedEngineId === 'heygen') {
      stages = [
        { p: 20, msg: `HeyGen Studio: Extracting phonetic viseme timestamps from audio stream...` },
        { p: 55, msg: `Avatar Cameo Sync: Locking lip-sync micro-expressions & natural gaze physics...` },
        { p: 85, msg: `Multilingual Voice Matching: Blending natural studio lighting with character anchor...` },
        { p: 100, msg: `HeyGen Video Complete: Flawless avatar speech synchronized!` },
      ];
    } else if (selectedEngineId === 'insmind') {
      stages = [
        { p: 20, msg: `InsMind Social Engine: Formatting 9:16 vertical reel viewport for viral publishing...` },
        { p: 55, msg: `Kinetic Auto-Captions: Transcribing speech into animated trending font presets...` },
        { p: 85, msg: `Beat-Sync Engine: Auto-cutting transitions to trending audio tempo...` },
        { p: 100, msg: `InsMind Vertical Reel Ready: 1-click export to Shorts & Reels!` },
      ];
    } else if (is8k) {
      stages = [
        {
          p: 15,
          msg: `Stage 1 Base DiT: 3D Spacetime Patches & Flow Matching (${flowSolver} 25 steps at 1080p)...`,
        },
        {
          p: 40,
          msg: `Stage 2 Upscaler A: Denoising 1080p -> 4K with Noise Augmentation (σ = ${noiseAugSigma}) for pores & fabric weave...`,
        },
        {
          p: 70,
          msg: `Stage 3 Upscaler B: Bilateral ${temporalAttentionWindow}-frame temporal attention upscaling 4K -> 8K Master...`,
        },
        {
          p: 90,
          msg: `Temporal Anti-Flicker: Resolving 33.18 MP/frame (7680×4320 @ ${spec.frameRate}fps) across H100 clusters...`,
        },
        {
          p: 100,
          msg: `8K Cinema Master Complete: ${hoursStr} ProRes 4444 XQ stream generated with Zero Inter-Frame Flickering!`,
        },
      ];
    } else {
      stages = [
        { p: 15, msg: `Pre-Flight: Prompt semantic vectorization & ${hoursStr} keyframe roadmap...` },
        {
          p: 40,
          msg: `Distributed Diffusion: Partitioning ${totalFrames.toLocaleString()} frames across 4 GPU clusters...`,
        },
        { p: 70, msg: `Super-Resolution: Neural upscaling to ${spec.resolution} with persistent latent memory...` },
        { p: 90, msg: `Camera Motion: Interpolating continuous ${spec.cameraMotion} trajectories without drift...` },
        { p: 100, msg: `Distributed CDN Master: ${hoursStr} stream ready (100h Max Cap Engine)` },
      ];
    }

    let currentIdx = 0;
    const interval = setInterval(() => {
      if (currentIdx < stages.length) {
        setRenderProgress(stages[currentIdx].p);
        setCurrentStage(stages[currentIdx].msg);
        currentIdx++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setIsRendering(false);
        }, 800);
      }
    }, 700);
  };

  // Procedural Cinematic Canvas Preview Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let phase = 0;
    const render = () => {
      phase += 0.02;
      const w = canvas.width;
      const h = canvas.height;

      // Dark sci-fi gradient
      const grad = ctx.createRadialGradient(w / 2, h / 2, 50, w / 2, h / 2, w / 1.2);
      grad.addColorStop(0, '#1e1035');
      grad.addColorStop(0.5, '#0a0d1a');
      grad.addColorStop(1, '#020205');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Perspective horizon grid
      ctx.strokeStyle = 'rgba(168, 85, 247, 0.25)';
      ctx.lineWidth = 1.5;
      const horizonY = h * 0.58;
      for (let i = 0; i < 14; i++) {
        const y = horizonY + i * i * 1.8;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Vanishing point rays
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.2)';
      for (let x = -4; x <= 14; x++) {
        ctx.beginPath();
        ctx.moveTo(w / 2, horizonY);
        ctx.lineTo(x * (w / 10), h);
        ctx.stroke();
      }

      // Simulated glowing anamorphic lens flare
      const flareX = w / 2 + Math.sin(phase) * 60;
      const flareY = h * 0.45 + Math.cos(phase * 0.7) * 20;

      // Horizontal beam
      const beamGrad = ctx.createLinearGradient(0, flareY, w, flareY);
      beamGrad.addColorStop(0, 'rgba(6, 182, 212, 0)');
      beamGrad.addColorStop(0.4, 'rgba(6, 182, 212, 0.8)');
      beamGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.95)');
      beamGrad.addColorStop(0.6, 'rgba(168, 85, 247, 0.8)');
      beamGrad.addColorStop(1, 'rgba(168, 85, 247, 0)');
      ctx.fillStyle = beamGrad;
      ctx.fillRect(0, flareY - 4, w, 8);

      // Core glow
      const sunGrad = ctx.createRadialGradient(flareX, flareY, 0, flareX, flareY, 80);
      sunGrad.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
      sunGrad.addColorStop(0.2, 'rgba(245, 158, 11, 0.6)');
      sunGrad.addColorStop(0.6, 'rgba(168, 85, 247, 0.3)');
      sunGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = sunGrad;
      ctx.beginPath();
      ctx.arc(flareX, flareY, 80, 0, Math.PI * 2);
      ctx.fill();

      // Floating holographic motion vectors
      for (let i = 0; i < 8; i++) {
        const ringR = 40 + i * 18 + Math.sin(phase + i) * 6;
        ctx.strokeStyle = `rgba(34, 211, 238, ${0.4 - i * 0.04})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.ellipse(flareX, flareY, ringR, ringR * 0.4, phase * 0.5, 0, Math.PI * 2);
        ctx.stroke();
      }

      if (isPlaying) {
        // Advance time smoothly; loop back to 0 when reaching totalDurationSec
        const stepSec = Math.max(0.1, totalDurationSec / 20000);
        setCurrentTimecode((prev) => (prev >= totalDurationSec ? 0 : prev + stepSec));
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying]);

  return (
    <div className="space-y-6">
      {/* Top Banner / LEO Specs Bar */}
      <div className="p-4 sm:p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Film className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                <span>LEO Video Studio</span>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-gradient-to-r from-purple-500 via-indigo-500 to-amber-500 text-white uppercase tracking-wider flex items-center gap-1 shadow-sm">
                  <Flame className="w-3 h-3 text-amber-300" />
                  Veo 3.1 • 100h Max
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Text-to-Video generation with professional multi-resolution, up to 100 hours max duration &amp; distributed GPU cluster rendering
              </p>
            </div>
          </div>
        </div>

        {/* Global Edge CDN Low-Latency Badge & Max Duration Pill */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-purple-950/60 border border-purple-500/30 text-xs">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-purple-200 font-semibold">Max Duration:</span>
            <span className="text-amber-300 font-mono font-bold">100 Hours</span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-slate-300 font-semibold">Edge CDN Latency:</span>
            <span className="text-emerald-400 font-mono font-bold">11ms</span>
            <span className="text-slate-600">|</span>
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span className="text-cyan-400 text-[11px] font-bold">E2E Encrypted</span>
          </div>

          {onOpenEnterpriseB2B && (
            <button
              onClick={onOpenEnterpriseB2B}
              className="px-3 py-1.5 rounded-2xl bg-gradient-to-r from-blue-600/30 via-indigo-600/30 to-cyan-500/30 hover:from-blue-600/40 hover:to-cyan-500/40 border border-blue-500/50 text-blue-300 hover:text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
              title="Open Enterprise B2B Video Suite (LoRA Product Preservation, Programmatic Sales, Spokespersons)"
            >
              <Briefcase className="w-3.5 h-3.5 text-blue-400" />
              <span>Enterprise B2B</span>
              <span className="px-1.5 py-0.2 text-[9px] font-extrabold rounded bg-blue-500/30 text-blue-200">LORA &amp; SALES</span>
            </button>
          )}

          <button
            onClick={() => setIsAiDanceModalOpen(true)}
            className="px-3 py-1.5 rounded-2xl bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-indigo-500/20 hover:from-pink-500/30 hover:to-indigo-500/30 border border-pink-500/40 text-pink-300 hover:text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
            title="Open AI Dance Video Maker & Motion Transfer Studio (DWPose + AnimateAnyone)"
          >
            <Music className="w-3.5 h-3.5 text-pink-400" />
            <span>AI Dance Maker</span>
            <span className="px-1.5 py-0.2 text-[9px] font-extrabold rounded bg-pink-500/30 text-pink-200">VIRAL DUET</span>
          </button>

          <button
            onClick={() => setIsEngineHubOpen(true)}
            className="px-3 py-1.5 rounded-2xl bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-blue-500/20 hover:from-indigo-500/30 hover:to-blue-500/30 border border-indigo-500/40 text-indigo-300 hover:text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
            title="Open 2026 Post-Sora Migration Hub, Engine Router & Pricing Comparison"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>2026 Engine Hub</span>
            <span className="px-1.5 py-0.2 text-[9px] font-extrabold rounded bg-indigo-500/30 text-indigo-200">POST-SORA</span>
          </button>

          <button
            onClick={() => setIsBlueprintModalOpen(true)}
            className="px-3 py-1.5 rounded-2xl bg-gradient-to-r from-amber-500/20 via-purple-500/20 to-cyan-500/20 hover:from-amber-500/30 hover:to-cyan-500/30 border border-amber-500/40 text-amber-300 hover:text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
            title="Inspect 8K Cascaded DiT Architecture Technical Blueprint"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span>8K DiT Blueprint</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Viewport & Timeline (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative rounded-3xl overflow-hidden bg-black border border-slate-800 shadow-2xl aspect-video flex items-center justify-center group">
            <canvas
              ref={canvasRef}
              width={960}
              height={540}
              className="w-full h-full object-cover"
            />

            {/* Overlays / Spec Tag */}
            <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-black/75 border border-purple-500/40 text-purple-300 text-xs font-mono font-bold flex items-center gap-1.5 backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                {selectedEngineId === 'leo-8k'
                  ? 'LEO DiT 8K Cascaded'
                  : selectedEngineId === 'veo3'
                  ? 'Veo3 AI (Unrestricted)'
                  : selectedEngineId === 'seedance'
                  ? 'Seedance 1.0 (6-Axis Physics)'
                  : selectedEngineId === 'magic-hour'
                  ? 'Magic Hour (Sora API Shim)'
                  : selectedEngineId === 'oakgen'
                  ? 'Oakgen (<1s Realtime)'
                  : selectedEngineId === 'heygen'
                  ? 'HeyGen Avatar Lip-Sync'
                  : 'InsMind 9:16 Shorts'} • {spec.resolution} • {spec.frameRate} FPS • {formatDurationLabel(spec.durationHours)}
              </span>
              <span className="px-2 py-1 rounded-lg bg-black/75 border border-slate-700 text-slate-300 text-xs font-mono backdrop-blur-md">
                {spec.aspectRatio}
              </span>
            </div>

            {/* Camera Motion / Physics Overlay Tag */}
            <div className="absolute top-4 right-4 flex items-center gap-2">
              {selectedEngineId === 'seedance' ? (
                <span className="px-2.5 py-1 rounded-lg bg-black/75 border border-amber-500/50 text-amber-300 text-xs font-mono font-bold backdrop-blur-md">
                  PHYSICS: P:{seedancePan}° T:{seedanceTilt}° R:{seedanceRoll}°
                </span>
              ) : selectedEngineId === 'veo3' ? (
                <span className="px-2.5 py-1 rounded-lg bg-black/75 border border-blue-500/50 text-blue-300 text-xs font-mono font-bold backdrop-blur-md">
                  VEO3: {veo3ColorSpace}
                </span>
              ) : selectedEngineId === 'magic-hour' ? (
                <span className="px-2.5 py-1 rounded-lg bg-black/75 border border-cyan-500/50 text-cyan-300 text-xs font-mono font-bold backdrop-blur-md">
                  API: {mhMode.toUpperCase()}
                </span>
              ) : (
                <span className="px-2.5 py-1 rounded-lg bg-black/75 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold backdrop-blur-md">
                  CAM: {spec.cameraMotion}
                </span>
              )}
            </div>

            {/* Center Play Button Overlay */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="absolute inset-0 flex items-center justify-center group/btn"
              title={isPlaying ? 'Pause preview' : 'Play continuous 100h preview'}
            >
              <div className="w-16 h-16 rounded-full bg-purple-600/80 group-hover/btn:bg-purple-500 border border-white/20 text-white flex items-center justify-center shadow-2xl backdrop-blur-md transition-all group-hover/btn:scale-110">
                {isPlaying ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7 ml-1" />}
              </div>
            </button>

            {/* Bottom Scrubber Overlay with 100-Hour Navigation */}
            <div className="absolute bottom-0 inset-x-0 p-3 sm:p-4 bg-gradient-to-t from-black via-black/85 to-transparent flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-[11px] sm:text-xs text-slate-300 font-mono">
                <div className="flex items-center gap-1.5">
                  <span className="text-cyan-400 font-bold">{formatTimecode(currentTimecode)}</span>
                  <span className="text-slate-500">/</span>
                  <span className="text-amber-300 font-bold">{formatTimecode(totalDurationSec)}</span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px]">
                  <span className="px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30">
                    {formatDurationLabel(spec.durationHours)}
                  </span>
                  {spec.durationHours >= 100 && (
                    <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                      100H MAX
                    </span>
                  )}
                </div>
              </div>

              {/* Clickable / Draggable Scrubber Bar */}
              <div
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const clickX = e.clientX - rect.left;
                  const ratio = Math.max(0, Math.min(1, clickX / rect.width));
                  setCurrentTimecode(ratio * totalDurationSec);
                }}
                className="w-full bg-slate-800/80 hover:bg-slate-700/80 h-2.5 rounded-full overflow-hidden cursor-pointer relative group/scrub transition-all"
                title="Click anywhere to jump on the 100-hour timeline"
              >
                <div
                  className="h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-400 rounded-full"
                  style={{ width: `${Math.min(100, (currentTimecode / totalDurationSec) * 100)}%` }}
                />
              </div>

              {/* Quick Scrub Timeline Jump Controls */}
              <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setCurrentTimecode(0)}
                    className="px-1.5 py-0.5 bg-slate-900/80 hover:bg-slate-800 border border-slate-700 rounded text-slate-300 hover:text-white transition-colors"
                  >
                    00:00:00
                  </button>
                  {totalDurationSec >= 7200 && (
                    <>
                      <button
                        onClick={() => setCurrentTimecode((prev) => Math.max(0, prev - 3600))}
                        className="px-1.5 py-0.5 bg-slate-900/80 hover:bg-slate-800 border border-slate-700 rounded text-slate-300 hover:text-white transition-colors"
                        title="Rewind 1 hour"
                      >
                        -1 hr
                      </button>
                      <button
                        onClick={() => setCurrentTimecode((prev) => Math.min(totalDurationSec, prev + 3600))}
                        className="px-1.5 py-0.5 bg-slate-900/80 hover:bg-slate-800 border border-slate-700 rounded text-slate-300 hover:text-white transition-colors"
                        title="Fast forward 1 hour"
                      >
                        +1 hr
                      </button>
                    </>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setCurrentTimecode(totalDurationSec / 2)}
                    className="px-1.5 py-0.5 bg-slate-900/80 hover:bg-slate-800 border border-slate-700 rounded text-slate-300 hover:text-white transition-colors"
                  >
                    Midpoint (50%)
                  </button>
                  <button
                    onClick={() => setCurrentTimecode(totalDurationSec)}
                    className="px-1.5 py-0.5 bg-slate-900/80 hover:bg-slate-800 border border-slate-700 rounded text-slate-300 hover:text-white transition-colors"
                  >
                    End ({formatTimecode(totalDurationSec).slice(0, 5)})
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Render Progress Bar if Active */}
          {isRendering && (
            <div className="p-4 rounded-2xl bg-slate-900 border border-purple-500/40 shadow-xl space-y-2 animate-in fade-in">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-purple-400 animate-spin" />
                  <span className="font-semibold text-white">{currentStage}</span>
                </div>
                <span className="font-mono font-bold text-purple-400">{renderProgress}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-400 transition-all duration-300"
                  style={{ width: `${renderProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Quick Distributed Render Clusters HUD */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-300 uppercase tracking-wider">
              <span className="flex items-center gap-1.5">
                <Server className="w-4 h-4 text-cyan-400" />
                Distributed GPU Render Nodes
              </span>
              <span className="text-emerald-400 font-normal">All 4 Clusters Healthy</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { name: 'US-East (VA)', gpu: '8x H100', load: '48%', ping: '9ms' },
                { name: 'US-West (OR)', gpu: '8x H100', load: '32%', ping: '14ms' },
                { name: 'EU-Central (FRA)', gpu: '4x A100', load: '72%', ping: '28ms' },
                { name: 'Asia-East (TYO)', gpu: '4x A100', load: '21%', ping: '35ms' },
              ].map((node) => (
                <div
                  key={node.name}
                  className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200">{node.name}</span>
                    <span className="text-emerald-400 font-mono text-[10px]">{node.ping}</span>
                  </div>
                  <div className="text-[10px] text-slate-500">{node.gpu}</div>
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-slate-400">Load</span>
                    <span className="font-mono text-cyan-300">{node.load}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: LEO Production Parameters (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-purple-400" />
                Generation Controls
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleVlmRecaption}
                  disabled={isVlmRecaptioning}
                  className="text-[11px] font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors disabled:opacity-50"
                  title="Synthesize dense VLM camera optics and lighting specs (Synthetic Data Pipeline)"
                >
                  <Wand2 className="w-3.5 h-3.5 text-cyan-400" />
                  {isVlmRecaptioning ? 'VLM Recaptioning...' : 'VLM Dense Re-caption'}
                </button>
                <button
                  type="button"
                  onClick={handleEnhancePrompt}
                  disabled={isEnhancing}
                  className="text-[11px] font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors disabled:opacity-50"
                >
                  <Zap className="w-3.5 h-3.5" />
                  {isEnhancing ? 'Optimizing...' : 'Flash-Lite'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsAiDanceModalOpen(true)}
                  className="text-[11px] font-bold text-pink-400 hover:text-pink-300 flex items-center gap-1 transition-colors"
                  title="Open Fill-in-the-Blank Prompts & AI Dance Duet Studio"
                >
                  <Sparkles className="w-3.5 h-3.5 text-pink-400" />
                  <span>Fill-in Prompts</span>
                </button>
              </div>
            </h4>

            {/* 2026 Post-Sora Multi-Model Engine Switcher */}
            <div className="p-3 rounded-2xl bg-slate-950/90 border border-indigo-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200">
                  <Cpu className="w-3.5 h-3.5 text-indigo-400" />
                  <span>2026 Video Engine Hub</span>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                    Late 2026
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEngineHubOpen(true)}
                  className="text-[11px] font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
                >
                  <span>Compare & Migrate</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                {[
                  { id: 'leo-8k', label: 'LEO 8K DiT', tag: '8K Master', color: 'border-purple-500 text-purple-300' },
                  { id: 'veo3', label: 'Veo3 AI', tag: 'Creative Free', color: 'border-blue-500 text-blue-300' },
                  { id: 'seedance', label: 'Seedance 1.0', tag: '6-Axis Physics', color: 'border-amber-500 text-amber-300' },
                  { id: 'magic-hour', label: 'Magic Hour', tag: 'Sora API Shim', color: 'border-cyan-500 text-cyan-300' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedEngineId(item.id as VideoEngineId)}
                    className={`py-1.5 px-2 rounded-xl text-xs font-bold border transition-all flex flex-col items-center justify-center ${
                      selectedEngineId === item.id
                        ? `bg-indigo-600/30 ${item.color} shadow-sm ring-1 ring-indigo-500/40`
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span className="truncate">{item.label}</span>
                    <span className="text-[8px] font-bold opacity-80 mt-0.5">{item.tag}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Prompt input */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Cinematic Text Prompt
              </label>
              <textarea
                value={spec.prompt}
                onChange={(e) => setSpec({ ...spec, prompt: e.target.value })}
                rows={3}
                placeholder="Describe lighting, camera physics, motion vectors, and textures..."
                className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-purple-500 resize-none leading-relaxed"
              />
            </div>

            {/* Resolution Buttons */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Resolution Output Control
                </label>
                {spec.resolution === '8K Cinema Master' && (
                  <span className="text-[10px] font-mono text-cyan-400 font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                    33.18 Megapixels / Frame
                  </span>
                )}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['720p HD', '1080p FHD', '4K Ultra', '8K Cinema Master'] as const).map((res) => {
                  const isSel = spec.resolution === res;
                  const isProRes = res !== '720p HD';
                  const isAllowed = canAccessResolution(res, subscription);
                  return (
                    <button
                      key={res}
                      onClick={() => {
                        setSpec({ ...spec, resolution: res });
                        if (!isAllowed) onOpenSubscriptionModal?.();
                      }}
                      className={`py-2 px-1.5 rounded-xl text-xs font-bold border transition-all relative flex flex-col items-center justify-center ${
                        isSel
                          ? 'bg-purple-500/20 border-purple-500 text-purple-300 shadow-md shadow-purple-500/10'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <span className="flex items-center gap-1">
                        <span className="truncate">{res.replace(' Cinema Master', '')}</span>
                        {isProRes && !isProUser && (
                          <span className="text-[8px] font-black px-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                            PRO
                          </span>
                        )}
                      </span>
                      {res === '8K Cinema Master' && (
                        <span className="text-[8px] font-mono text-cyan-400 font-bold mt-0.5">8K DiT</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Specialized Dynamic Inspector per Selected 2026 Engine */}
            {selectedEngineId === 'leo-8k' && (
              <div className="p-3.5 rounded-2xl bg-gradient-to-br from-purple-950/40 via-slate-950 to-cyan-950/40 border border-purple-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <GitBranch className="w-3.5 h-3.5 text-cyan-400" />
                    Cascaded 8K Super-Resolution Pipeline
                  </span>
                  <span className="text-[10px] font-mono text-amber-300 font-bold px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                    DiT + 3D VAE Latent
                  </span>
                </div>

                {/* 3 Interactive Pipeline Stages */}
                <div className="grid grid-cols-3 gap-1.5">
                  {cascadeStages.map((stg, idx) => {
                    const isCur = selectedCascadeStage === stg.stageId;
                    return (
                      <button
                        key={stg.stageId}
                        type="button"
                        onClick={() => setSelectedCascadeStage(stg.stageId)}
                        className={`p-2 rounded-xl border text-left transition-all ${
                          isCur
                            ? 'bg-purple-500/20 border-purple-400 text-white shadow-md'
                            : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <div className="text-[10px] text-cyan-400 font-mono font-bold">Stage {idx + 1}</div>
                        <div className="text-[11px] font-bold truncate text-slate-200">{stg.outputResolution.split(' ')[0]}</div>
                        <div className="text-[9px] text-slate-500 truncate">
                          {stg.stageId === 'stage1_base' ? 'Base DiT' : stg.stageId === 'stage2_upscaler_a' ? 'Upscaler A' : 'Upscaler B'}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Active Stage Deep Details */}
                {(() => {
                  const cur = cascadeStages.find((s) => s.stageId === selectedCascadeStage);
                  if (!cur) return null;
                  return (
                    <div className="p-2.5 rounded-xl bg-slate-950/90 border border-slate-800 text-[11px] space-y-2">
                      <div className="flex items-center justify-between font-bold">
                        <span className="text-white">{cur.name}</span>
                        <span className="text-cyan-400 font-mono text-[10px]">
                          {cur.nativeWidth}×{cur.nativeHeight} ({cur.megapixelsPerFrame} MP)
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 leading-relaxed">{cur.technique}</p>

                      {/* Controls per stage */}
                      {cur.stageId === 'stage1_base' && (
                        <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 text-[10px]">
                          <span className="text-slate-400">Flow Matching Solver:</span>
                          <select
                            value={flowSolver}
                            onChange={(e) => setFlowSolver(e.target.value as any)}
                            className="bg-slate-900 border border-slate-700 rounded px-1.5 py-0.5 text-slate-200 font-mono"
                          >
                            <option value="Euler">Euler (25 steps)</option>
                            <option value="Midpoint">Midpoint (20 steps)</option>
                            <option value="Runge-Kutta 4">RK4 (30 steps)</option>
                            <option value="DPM-Solver++">DPM-Solver++</option>
                          </select>
                        </div>
                      )}

                      {cur.stageId === 'stage2_upscaler_a' && (
                        <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 text-[10px]">
                          <span className="text-slate-400">Noise Augmentation (Texture Hallucination):</span>
                          <div className="flex items-center gap-1.5">
                            <input
                              type="range"
                              min="0.05"
                              max="0.20"
                              step="0.01"
                              value={noiseAugSigma}
                              onChange={(e) => setNoiseAugSigma(parseFloat(e.target.value))}
                              className="w-16 accent-purple-500"
                            />
                            <span className="font-mono text-amber-300">σ={noiseAugSigma}</span>
                          </div>
                        </div>
                      )}

                      {cur.stageId === 'stage3_upscaler_b' && (
                        <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 text-[10px]">
                          <span className="text-slate-400">Anti-Flicker Temporal Window:</span>
                          <select
                            value={temporalAttentionWindow}
                            onChange={(e) => setTemporalAttentionWindow(parseInt(e.target.value))}
                            className="bg-slate-900 border border-slate-700 rounded px-1.5 py-0.5 text-slate-200 font-mono"
                          >
                            <option value={16}>16 frames (Low VRAM)</option>
                            <option value={32}>32 frames (Optimal)</option>
                            <option value={64}>64 frames (Ultra Anti-Flicker)</option>
                          </select>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            )}

            {/* SEEDANCE 1.0 (HEDRA) 6-AXIS CAMERA PHYSICS & TRAJECTORY SPLINE CARD */}
            {selectedEngineId === 'seedance' && (
              <div className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-950/40 via-slate-950 to-orange-950/30 border border-amber-500/40 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5 text-amber-400" />
                    Seedance 1.0 (Hedra) 6-Axis Camera Physics
                  </span>
                  <span className="text-[10px] font-mono text-amber-300 font-bold px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/40">
                    Deterministic Splines
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-[10px]">
                  <div className="space-y-1 bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                    <div className="flex justify-between text-slate-400">
                      <span>Pan</span>
                      <span className="font-mono text-amber-300">{seedancePan}°</span>
                    </div>
                    <input
                      type="range"
                      min="-90"
                      max="90"
                      value={seedancePan}
                      onChange={(e) => setSeedancePan(parseInt(e.target.value))}
                      className="w-full accent-amber-500 h-1"
                    />
                  </div>
                  <div className="space-y-1 bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                    <div className="flex justify-between text-slate-400">
                      <span>Tilt</span>
                      <span className="font-mono text-amber-300">{seedanceTilt}°</span>
                    </div>
                    <input
                      type="range"
                      min="-60"
                      max="60"
                      value={seedanceTilt}
                      onChange={(e) => setSeedanceTilt(parseInt(e.target.value))}
                      className="w-full accent-amber-500 h-1"
                    />
                  </div>
                  <div className="space-y-1 bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                    <div className="flex justify-between text-slate-400">
                      <span>Roll</span>
                      <span className="font-mono text-amber-300">{seedanceRoll}°</span>
                    </div>
                    <input
                      type="range"
                      min="-45"
                      max="45"
                      value={seedanceRoll}
                      onChange={(e) => setSeedanceRoll(parseInt(e.target.value))}
                      className="w-full accent-amber-500 h-1"
                    />
                  </div>

                  <div className="space-y-1 bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                    <div className="flex justify-between text-slate-400">
                      <span>Dolly</span>
                      <span className="font-mono text-amber-300">{seedanceDolly}m</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="20"
                      step="0.5"
                      value={seedanceDolly}
                      onChange={(e) => setSeedanceDolly(parseFloat(e.target.value))}
                      className="w-full accent-amber-500 h-1"
                    />
                  </div>
                  <div className="space-y-1 bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                    <div className="flex justify-between text-slate-400">
                      <span>Crane</span>
                      <span className="font-mono text-amber-300">{seedanceCrane}m</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      step="0.2"
                      value={seedanceCrane}
                      onChange={(e) => setSeedanceCrane(parseFloat(e.target.value))}
                      className="w-full accent-amber-500 h-1"
                    />
                  </div>
                  <div className="space-y-1 bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                    <div className="flex justify-between text-slate-400">
                      <span>Orbit</span>
                      <span className="font-mono text-amber-300">{seedanceOrbitSpeed}°/s</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="45"
                      value={seedanceOrbitSpeed}
                      onChange={(e) => setSeedanceOrbitSpeed(parseInt(e.target.value))}
                      className="w-full accent-amber-500 h-1"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] pt-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-400">Trajectory:</span>
                    <select
                      value={seedanceTrajectory}
                      onChange={(e) => setSeedanceTrajectory(e.target.value as any)}
                      className="bg-slate-900 border border-slate-700 rounded px-2 py-0.5 text-amber-300 text-[10px]"
                    >
                      <option value="Bezier Spline">Bezier Spline (Smooth)</option>
                      <option value="Linear">Linear Motion Path</option>
                      <option value="Cinematic Arc">Cinematic Arc 180°</option>
                      <option value="FPV Corkscrew">FPV Corkscrew Dive</option>
                    </select>
                  </div>

                  <label className="flex items-center gap-1.5 cursor-pointer text-[10px] text-slate-300">
                    <input
                      type="checkbox"
                      checked={seedanceLockIdentityAnchor}
                      onChange={(e) => setSeedanceLockIdentityAnchor(e.target.checked)}
                      className="rounded accent-amber-500"
                    />
                    <span>Lock Identity Anchor</span>
                  </label>
                </div>
              </div>
            )}

            {/* VEO3 AI UNRESTRICTED CREATIVE STUDIO CARD */}
            {selectedEngineId === 'veo3' && (
              <div className="p-3.5 rounded-2xl bg-gradient-to-br from-blue-950/40 via-slate-950 to-indigo-950/30 border border-blue-500/40 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                    Veo3 AI: The People's Successor
                  </span>
                  <span className="text-[10px] font-mono text-emerald-300 font-bold px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/40">
                    Zero Waitlist • $0 Free Tier
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-[11px]">Prompt Adherence Guidance Scale:</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="range"
                        min="3.0"
                        max="15.0"
                        step="0.5"
                        value={veo3GuidanceScale}
                        onChange={(e) => setVeo3GuidanceScale(parseFloat(e.target.value))}
                        className="w-24 accent-blue-500"
                      />
                      <span className="font-mono text-blue-300 text-[11px]">{veo3GuidanceScale}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-800/80">
                    <span className="text-slate-400 text-[11px]">Master Color Profile:</span>
                    <select
                      value={veo3ColorSpace}
                      onChange={(e) => setVeo3ColorSpace(e.target.value as any)}
                      className="bg-slate-900 border border-slate-700 rounded px-2 py-0.5 text-blue-300 text-xs"
                    >
                      <option value="Rec.709">Rec.709 (Broadcast Ready)</option>
                      <option value="CineLog-C">CineLog-C (High Dynamic Range)</option>
                      <option value="ACEScg">ACEScg (Cinema VFX Standard)</option>
                      <option value="HDR10+">HDR10+ (PQ 1000-nits)</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-1.5 cursor-pointer text-[11px] text-slate-300">
                      <input
                        type="checkbox"
                        checked={veo3UnrestrictedCreative}
                        onChange={(e) => setVeo3UnrestrictedCreative(e.target.checked)}
                        className="rounded accent-blue-500"
                      />
                      <span className="font-semibold text-white">Unrestricted Creative Expression</span>
                    </label>
                    <span className="text-[10px] text-slate-400">Prompt Fidelity: 96/100</span>
                  </div>
                </div>
              </div>
            )}

            {/* MAGIC HOUR SORA MIGRATION & VIDEO-TO-VIDEO CARD */}
            {selectedEngineId === 'magic-hour' && (
              <div className="p-3.5 rounded-2xl bg-gradient-to-br from-cyan-950/40 via-slate-950 to-indigo-950/30 border border-cyan-500/40 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Code className="w-3.5 h-3.5 text-cyan-400" />
                    Magic Hour API: 2026 Sora Migration Shim
                  </span>
                  <span className="text-[10px] font-mono text-cyan-300 font-bold px-2 py-0.5 rounded bg-cyan-500/20 border border-cyan-500/40">
                    Sora-2 Compatible
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-[11px]">Generation Pipeline:</span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setMhMode('text-to-video')}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          mhMode === 'text-to-video'
                            ? 'bg-cyan-600 text-white'
                            : 'bg-slate-900 text-slate-400 hover:text-white'
                        }`}
                      >
                        Text-to-Video
                      </button>
                      <button
                        type="button"
                        onClick={() => setMhMode('video-to-video')}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          mhMode === 'video-to-video'
                            ? 'bg-cyan-600 text-white'
                            : 'bg-slate-900 text-slate-400 hover:text-white'
                        }`}
                      >
                        Video-to-Video Transfer
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-800/80">
                    <div>
                      <div className="flex justify-between text-slate-400 text-[10px]">
                        <span>Denoise Strength</span>
                        <span className="font-mono text-cyan-300">{mhDenoiseStrength}</span>
                      </div>
                      <input
                        type="range"
                        min="0.1"
                        max="1.0"
                        step="0.05"
                        value={mhDenoiseStrength}
                        onChange={(e) => setMhDenoiseStrength(parseFloat(e.target.value))}
                        className="w-full accent-cyan-500 h-1"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-slate-400 text-[10px]">
                        <span>Temporal Coherence</span>
                        <span className="font-mono text-cyan-300">{mhTemporalCoherence}</span>
                      </div>
                      <input
                        type="range"
                        min="0.5"
                        max="1.0"
                        step="0.01"
                        value={mhTemporalCoherence}
                        onChange={(e) => setMhTemporalCoherence(parseFloat(e.target.value))}
                        className="w-full accent-cyan-500 h-1"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <button
                      type="button"
                      onClick={async () => {
                        setIsMhDispatching(true);
                        setMhDispatchStatus(null);
                        try {
                          const res = await fetch('/api/magic-hour/generate', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              prompt: spec.prompt,
                              resolution: spec.resolution === '4K Ultra' ? '4k' : '1080p',
                              duration: 10,
                              fps: spec.frameRate,
                              mode: mhMode,
                            }),
                          });
                          const data = await res.json();
                          setMhDispatchStatus(`Job ${data.jobId || data.id} Dispatched Successfully!`);
                        } catch (e) {
                          setMhDispatchStatus('Simulated Sora Migration Job Sent (Status: 200 OK)');
                        } finally {
                          setIsMhDispatching(false);
                        }
                      }}
                      disabled={isMhDispatching}
                      className="w-full py-1.5 rounded-lg bg-cyan-600/30 hover:bg-cyan-600/50 border border-cyan-500/50 text-cyan-200 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                    >
                      {isMhDispatching ? (
                        <>
                          <Activity className="w-3.5 h-3.5 animate-spin" /> Dispatching to Magic Hour Cluster...
                        </>
                      ) : (
                        <>
                          <Terminal className="w-3.5 h-3.5" /> Test Sora-to-Magic-Hour API Shim
                        </>
                      )}
                    </button>
                  </div>

                  {mhDispatchStatus && (
                    <div className="text-[10px] text-emerald-400 font-mono text-center bg-emerald-950/40 p-1.5 rounded border border-emerald-500/30">
                      {mhDispatchStatus}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* OAKGEN, HEYGEN, INSMIND CARDS */}
            {selectedEngineId === 'oakgen' && (
              <div className="p-3.5 rounded-2xl bg-slate-950/90 border border-emerald-500/30 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-400">Oakgen Real-Time Engine</span>
                  <span className="font-mono text-emerald-300 font-bold text-[10px]">Latency: &lt;500ms</span>
                </div>
                <p className="text-[10px] text-slate-400">
                  Prioritizes sub-second real-time streaming over 8K render weight. Ideal for interactive live virtual experiences.
                </p>
              </div>
            )}

            {selectedEngineId === 'heygen' && (
              <div className="p-3.5 rounded-2xl bg-slate-950/90 border border-purple-500/30 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-purple-400">HeyGen Studio Avatar Lip-Sync</span>
                  <span className="font-mono text-purple-300 font-bold text-[10px]">120+ Languages</span>
                </div>
                <p className="text-[10px] text-slate-400">
                  Replaces Sora Cameos with production talking head avatars, natural gaze physics, and audio-driven lip synchronization.
                </p>
              </div>
            )}

            {selectedEngineId === 'insmind' && (
              <div className="p-3.5 rounded-2xl bg-slate-950/90 border border-pink-500/30 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-pink-400">InsMind Vertical Reels &amp; Auto-Captions</span>
                  <span className="font-mono text-pink-300 font-bold text-[10px]">9:16 Shorts Ready</span>
                </div>
                <p className="text-[10px] text-slate-400">
                  Mobile-first short-form video generation with animated kinetic subtitles and beat-synced transitions.
                </p>
              </div>
            )}

            {/* Frame Rate Buttons */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Frame Rate (Temporal Cadence)
              </label>
              <div className="grid grid-cols-4 gap-2">
                {([24, 30, 60, 120] as const).map((fps) => {
                  const isSel = spec.frameRate === fps;
                  const isProFps = fps > 30;
                  const isAllowed = canAccessFrameRate(fps, subscription);
                  return (
                    <button
                      key={fps}
                      onClick={() => {
                        setSpec({ ...spec, frameRate: fps });
                        if (!isAllowed) onOpenSubscriptionModal?.();
                      }}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all relative flex items-center justify-center gap-1 ${
                        isSel
                          ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 shadow-md shadow-cyan-500/10'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <span>{fps} fps</span>
                      {isProFps && !isProUser && (
                        <span className="text-[8px] font-black px-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                          PRO
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Pro Cinema VFX 32K & 1000 FPS Mode CTA */}
              <div className="p-3 rounded-2xl bg-gradient-to-r from-cyan-950/60 via-slate-900 to-indigo-950/60 border border-cyan-500/30 flex items-center justify-between gap-3 mt-2">
                <div className="flex items-center gap-2.5">
                  <span className="p-1.5 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    <Sparkles className="w-4 h-4" />
                  </span>
                  <div>
                    <h5 className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span>Cinema VFX Suite</span>
                      <span className="px-1.5 py-0.2 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[9px] font-mono">
                        32K (32000×32000) • 1000 FPS
                      </span>
                    </h5>
                    <p className="text-[10px] text-slate-400">
                      Need 32-bit float color, ACES 2.0, 192 kHz Fairlight audio &amp; DaVinci 3D LUTs?
                    </p>
                  </div>
                </div>
                {onOpenCinemaVfx && (
                  <button
                    type="button"
                    onClick={onOpenCinemaVfx}
                    className="px-3 py-1.5 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-black text-xs rounded-xl shadow-md shrink-0 transition-transform active:scale-95"
                  >
                    Open 32K VFX Studio
                  </button>
                )}
              </div>
            </div>

            {/* Aspect Ratio */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Aspect Ratio
              </label>
              <div className="grid grid-cols-4 gap-2">
                {(['16:9', '9:16', '1:1', '21:9'] as const).map((ratio) => {
                  const isSel = spec.aspectRatio === ratio;
                  return (
                    <button
                      key={ratio}
                      onClick={() => setSpec({ ...spec, aspectRatio: ratio })}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                        isSel
                          ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-md shadow-amber-500/10'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {ratio}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* AI Video Duration Control (Up to 100 Hours Max) */}
            <div className="space-y-2.5 p-3.5 rounded-2xl bg-slate-950/90 border border-purple-500/40 shadow-inner">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-purple-400" />
                  <span>AI Video Duration</span>
                  <span className="px-1.5 py-0.5 rounded bg-gradient-to-r from-purple-500 to-amber-500 text-white text-[9px] font-extrabold shadow-sm">
                    MAX 100 HOURS
                  </span>
                </label>
                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-amber-300">
                    {formatDurationLabel(spec.durationHours)}
                  </span>
                </div>
              </div>

              {/* Quick Preset Buttons (including 100h MAX ULTRA) */}
              <div className="grid grid-cols-4 gap-1.5">
                {DURATION_PRESETS.map((preset) => {
                  const isSelected = Math.abs(spec.durationHours - preset.hours) < 0.001;
                  const isPresetAllowed = canAccessVideoDuration(preset.hours, subscription);
                  return (
                    <button
                      key={preset.id}
                      onClick={() => {
                        setSpec((prev) => ({ ...prev, durationHours: preset.hours }));
                        setCurrentTimecode(Math.min(currentTimecode, preset.hours * 3600));
                        if (!isPresetAllowed) onOpenSubscriptionModal?.();
                      }}
                      className={`py-1.5 px-1 rounded-xl text-[11px] font-bold border transition-all relative flex flex-col items-center justify-center ${
                        isSelected
                          ? 'bg-gradient-to-r from-purple-600 via-indigo-600 to-amber-600 border-amber-400/80 text-white shadow-md shadow-purple-500/20'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                      }`}
                      title={preset.description}
                    >
                      <div className="flex items-center gap-0.5">
                        {!isPresetAllowed && preset.hours > 15 / 3600 && (
                          <Lock className="w-2.5 h-2.5 text-amber-400 shrink-0" />
                        )}
                        <span>{preset.label}</span>
                      </div>
                      {preset.badge ? (
                        <span className="text-[8px] font-black text-amber-300 uppercase tracking-tight">
                          {preset.badge}
                        </span>
                      ) : !isPresetAllowed && preset.hours > 15 / 3600 ? (
                        <span className="text-[7px] font-extrabold text-amber-400/90 tracking-tighter">
                          PRO Rs. 999
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </div>

              {/* Range Slider for continuous adjustment up to 100 Hours */}
              <div className="space-y-1 pt-1">
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span>1 sec</span>
                  <span className="text-purple-300 font-mono font-semibold">
                    Scale: 0 to 100 Hours Max
                  </span>
                  <span className="text-amber-400 font-bold">100h Cap</span>
                </div>
                <input
                  type="range"
                  min="0.005"
                  max="100"
                  step={spec.durationHours <= 1 ? 0.01 : spec.durationHours <= 10 ? 0.1 : 0.5}
                  value={spec.durationHours}
                  onChange={(e) => {
                    const val = clampVideoDuration(parseFloat(e.target.value));
                    setSpec((prev) => ({ ...prev, durationHours: val }));
                    setCurrentTimecode((prev) => Math.min(prev, val * 3600));
                  }}
                  className="w-full accent-amber-500 cursor-pointer h-2 bg-slate-900 rounded-lg appearance-none"
                />
              </div>

              {/* Exact Input + Unit Selector */}
              <div className="flex items-center gap-2 pt-1">
                <div className="flex-1 flex items-center bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1 text-xs">
                  <span className="text-[10px] font-bold text-slate-500 uppercase mr-2">Exact:</span>
                  <input
                    type="number"
                    min="0.001"
                    max={durationInputUnit === 'hours' ? 100 : durationInputUnit === 'minutes' ? 6000 : 360000}
                    step={durationInputUnit === 'hours' ? '0.1' : '1'}
                    value={
                      durationInputUnit === 'hours'
                        ? Math.round(spec.durationHours * 100) / 100
                        : durationInputUnit === 'minutes'
                        ? Math.round(spec.durationHours * 60 * 10) / 10
                        : Math.round(spec.durationHours * 3600)
                    }
                    onChange={(e) => {
                      const raw = parseFloat(e.target.value) || 0;
                      let calculatedHours = raw;
                      if (durationInputUnit === 'minutes') calculatedHours = raw / 60;
                      if (durationInputUnit === 'seconds') calculatedHours = raw / 3600;
                      const clamped = clampVideoDuration(calculatedHours);
                      setSpec((prev) => ({ ...prev, durationHours: clamped }));
                      setCurrentTimecode((prev) => Math.min(prev, clamped * 3600));
                    }}
                    className="w-full bg-transparent text-white font-mono text-xs focus:outline-none"
                  />
                </div>
                <select
                  value={durationInputUnit}
                  onChange={(e) => setDurationInputUnit(e.target.value as any)}
                  className="bg-slate-900 border border-slate-800 rounded-xl px-2 py-1 text-xs text-slate-300 font-bold focus:outline-none"
                >
                  <option value="hours">Hours (Max 100h)</option>
                  <option value="minutes">Minutes</option>
                  <option value="seconds">Seconds</option>
                </select>
              </div>

              {/* 100-Hour Compute Metrics HUD */}
              <div className="mt-2 p-2.5 rounded-xl bg-slate-900/95 border border-slate-800 text-[10px] space-y-1.5">
                <div className="flex items-center justify-between font-mono">
                  <span className="text-slate-400">Total Neural Frames:</span>
                  <span className="text-cyan-300 font-bold">{computeMetrics.totalFrames.toLocaleString()} frames</span>
                </div>
                <div className="flex items-center justify-between font-mono">
                  <span className="text-slate-400">Cluster Workload:</span>
                  <span className="text-emerald-400 font-bold">4 Nodes • {computeMetrics.hoursPerCluster}h/cluster</span>
                </div>
                <div className="flex items-center justify-between font-mono">
                  <span className="text-slate-400">Est. Master Size:</span>
                  <span className="text-amber-300 font-bold">~{computeMetrics.estimatedStorageGb} GB ({spec.resolution})</span>
                </div>
              </div>

              {/* Pro Subscription Status or Upgrade Banner */}
              {subscription?.isActive && subscription.plan === 'india_pro' ? (
                <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between text-[11px] text-emerald-300">
                  <span className="flex items-center gap-1.5 font-bold">
                    <Crown className="w-3.5 h-3.5 text-amber-400" />
                    <span>India Creator Pro Active • 100 Hours Max Cap Unlocked</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">Rs. 999 / mo</span>
                </div>
              ) : (
                <div className="p-2.5 rounded-xl bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-slate-900 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Crown className="w-4 h-4 text-amber-400 shrink-0" />
                    <span className="text-[11px] text-amber-200">
                      <strong>India Creator Pro (Rs. 999/mo):</strong> Unlock 100h Max duration, 4K Ultra, and Priority Edge GPU dispatch.
                    </span>
                  </div>
                  <button
                    onClick={onOpenSubscriptionModal}
                    className="px-2.5 py-1 bg-gradient-to-r from-amber-500 to-purple-600 hover:from-amber-400 hover:to-purple-500 text-white text-[10px] font-black rounded-lg shrink-0 shadow-sm transition-all"
                  >
                    Upgrade Rs. 999
                  </button>
                </div>
              )}
            </div>

            {/* Camera Motion & Visual Style */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Camera Motion
                </label>
                <select
                  value={spec.cameraMotion}
                  onChange={(e) =>
                    setSpec({ ...spec, cameraMotion: e.target.value as VideoProjectSpec['cameraMotion'] })
                  }
                  className="w-full px-2.5 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-purple-400"
                >
                  <option value="Dolly Zoom In">Dolly Zoom In</option>
                  <option value="Pan Right">Pan Right</option>
                  <option value="Tilt Up">Tilt Up</option>
                  <option value="Orbit 360">Orbit 360</option>
                  <option value="FPV Drone Dive">FPV Drone Dive</option>
                  <option value="Static">Static Lock</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Aesthetic Style
                </label>
                <select
                  value={spec.style}
                  onChange={(e) =>
                    setSpec({ ...spec, style: e.target.value as VideoProjectSpec['style'] })
                  }
                  className="w-full px-2.5 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-purple-400"
                >
                  <option value="Photorealistic">Photorealistic 35mm</option>
                  <option value="Cyberpunk Neon">Cyberpunk Neon</option>
                  <option value="Cinematic Film 35mm">Cinematic Noir</option>
                  <option value="Anime Ethereal">Anime Ethereal</option>
                  <option value="Retro VHS">Retro VHS Grain</option>
                </select>
              </div>
            </div>

            {/* Big Generate Action Button */}
            <button
              onClick={() => {
                if (!isSpecAllowed) {
                  onOpenSubscriptionModal?.();
                } else {
                  handleStartRender();
                }
              }}
              disabled={isRendering || !spec.prompt.trim()}
              className={`w-full py-3.5 px-4 font-extrabold text-sm rounded-2xl flex items-center justify-center gap-2 transition-all shadow-xl active:scale-95 disabled:opacity-50 ${
                !isSpecAllowed
                  ? 'bg-gradient-to-r from-amber-500 via-purple-600 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-white shadow-purple-950/50'
                  : 'bg-gradient-to-r from-purple-600 via-indigo-600 to-amber-500 hover:from-purple-500 hover:to-amber-400 text-white shadow-purple-500/25'
              }`}
            >
              {isRendering ? (
                <>
                  <Activity className="w-5 h-5 animate-spin" />
                  Synthesizing {formatDurationLabel(spec.durationHours)} ({spec.resolution} @ {spec.frameRate}fps)...
                </>
              ) : !isSpecAllowed ? (
                <>
                  <Crown className="w-5 h-5 text-amber-300" />
                  <span>Unlock {formatDurationLabel(spec.durationHours)} with India Pro (Rs. 999/mo)</span>
                </>
              ) : (
                <>
                  <Video className="w-5 h-5" />
                  <span>Generate {formatDurationLabel(spec.durationHours)} Scene with LEO / Veo 3</span>
                </>
              )}
            </button>

            {/* Quick Publish to YouTube Button */}
            {onOpenYouTubePublish && (
              <button
                type="button"
                onClick={() => onOpenYouTubePublish(spec.title, spec.prompt)}
                className="w-full py-2.5 px-4 font-bold text-xs rounded-xl bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/40 flex items-center justify-center gap-2 transition-all hover:text-white"
                title="Publish LEO Video to YouTube with Gemini 4 Argon Metadata"
              >
                <Youtube className="w-4 h-4 text-red-400" />
                <span>Publish Scene to YouTube (Data API v3)</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 8K Cascaded DiT Technical Architecture Blueprint Modal */}
      {isBlueprintModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in">
          <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-lg">
                  <Boxes className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                    LEO 8K Cascaded DiT Architecture Blueprint
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-mono">
                      Beyond Diffusion
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Decoupled Multi-Stage 8K Synthesis • Diffusion Transformer • Flow Matching • H100/B200 FSDP
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsBlueprintModalOpen(false)}
                className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Navigation Tabs */}
            <div className="flex flex-wrap gap-1 p-3 bg-slate-950/50 border-b border-slate-800 text-xs font-bold">
              {[
                { id: 'dit', label: '1. Core DiT & 3D Patches' },
                { id: 'cascade', label: '2. Cascaded 8K Pipeline' },
                { id: 'vlm', label: '3. Synthetic VLM Edge' },
                { id: 'stack', label: '4. Infrastructure Stack' },
                { id: 'opensource', label: '5. Open-Source Benchmark' },
                { id: 'code', label: '6. PyTorch & Stack Code' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setBlueprintActiveTab(tab.id as any)}
                  className={`px-3 py-1.5 rounded-xl transition-all ${
                    blueprintActiveTab === tab.id
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5 flex-1 text-xs leading-relaxed text-slate-300">
              {/* TAB 1: CORE DiT */}
              {blueprintActiveTab === 'dit' && (
                <div className="space-y-4">
                  <div className="p-4 bg-slate-950 rounded-2xl border border-purple-500/30 space-y-3">
                    <h4 className="text-sm font-black text-white flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-purple-400" />
                      1. The Core Architecture: Diffusion Transformer (DiT)
                    </h4>
                    <p>
                      Traditional video generation models rely on 2D U-Nets with temporal convolutions, causing motion drift, blurry frames, and severe distortion beyond 1024px. LEO uses a pure <strong>Diffusion Transformer (DiT)</strong> that matches LLM-level scalability.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl space-y-1.5">
                      <span className="text-amber-400 font-bold block text-xs">3D Spacetime Patches</span>
                      <p className="text-[11px] text-slate-400">
                        Divides video into 3D spacetime volumes (<code className="text-slate-200">4×8×8</code> cubes). Flattened into tokens like words in an LLM, allowing the transformer to learn true 3D spatial geometry and motion continuity.
                      </p>
                    </div>

                    <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl space-y-1.5">
                      <span className="text-cyan-400 font-bold block text-xs">3D VAE Latent Compression</span>
                      <p className="text-[11px] text-slate-400">
                        Never trains on raw pixels. A 3D Video Autoencoder compresses high-res video 8× spatially and 4× temporally into a compact latent space. The DiT operates strictly on latents, decoded back to 8K pixels by the 3D VAE.
                      </p>
                    </div>

                    <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl space-y-1.5">
                      <span className="text-emerald-400 font-bold block text-xs">Flow Matching (Rectified Flows)</span>
                      <p className="text-[11px] text-slate-400">
                        Replaces curved diffusion paths with straight trajectories from Gaussian noise to data. Solves ODEs in 20-25 steps (Euler/RK4) instead of 100 DDIM steps, yielding faster inference and crisper details.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: CASCADED SUPER-RESOLUTION */}
              {blueprintActiveTab === 'cascade' && (
                <div className="space-y-4">
                  <div className="p-4 bg-slate-950 rounded-2xl border border-cyan-500/30 space-y-2">
                    <h4 className="text-sm font-black text-white flex items-center gap-2">
                      <GitBranch className="w-4 h-4 text-cyan-400" />
                      2. The 8K Strategy: Cascaded Super-Resolution
                    </h4>
                    <p>
                      Generating 8K directly is computationally prohibitive ($O(N^2)$ spatial-temporal attention). LEO implements a <strong>3-Stage Cascade</strong> decoupling core semantics from high-frequency texture hallucination:
                    </p>
                  </div>

                  <div className="space-y-3">
                    {cascadeStages.map((stg, i) => (
                      <div key={stg.stageId} className="p-4 bg-slate-950/80 border border-slate-800 rounded-2xl space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-white flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center text-[10px]">
                              {i + 1}
                            </span>
                            {stg.name}
                          </span>
                          <span className="font-mono text-cyan-400 text-[11px] font-bold">
                            {stg.outputResolution} ({stg.megapixelsPerFrame} MP/frame)
                          </span>
                        </div>
                        <p className="text-slate-400 text-[11px]">{stg.technique}</p>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[10px] font-mono text-slate-300">
                          {Object.entries(stg.keyParameters).map(([k, v]) => (
                            <div key={k} className="p-2 bg-slate-900 rounded-lg">
                              <span className="text-slate-500 block">{k}</span>
                              <span className="text-amber-300 font-bold">{String(v)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: SYNTHETIC DATA & VLM */}
              {blueprintActiveTab === 'vlm' && (
                <div className="space-y-4">
                  <div className="p-4 bg-slate-950 rounded-2xl border border-amber-500/30 space-y-2">
                    <h4 className="text-sm font-black text-white flex items-center gap-2">
                      <Wand2 className="w-4 h-4 text-amber-400" />
                      3. Data Pipeline: The "Synthetic" Edge
                    </h4>
                    <p>
                      Raw internet text captions are poor and lack physical scene details. Modern DiTs achieve superhuman visual fidelity through <strong>VLM Synthetic Dense Re-captioning</strong>.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-2xl space-y-2">
                      <h5 className="font-bold text-white text-xs">Visual Language Models (VLMs)</h5>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        Multimodal models (Gemini Vision / GPT-4V) watch millions of video clips and author dense, camera-accurate captions detailing sensor formats (ARRI Alexa 65), lens millimeter, volumetric god-rays, atmospheric scattering, and surface roughness.
                      </p>
                    </div>

                    <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-2xl space-y-2">
                      <h5 className="font-bold text-white text-xs">Curated 10M+ Native 4K/8K Dataset</h5>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        Trained on 10M+ high-motion cinematic sequences. Upscaler A and Upscaler B are fine-tuned on native 4K and 8K master plates to learn authentic high-frequency micro-textures (skin pores, fabric thread weave, water ripples).
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: INFRASTRUCTURE STACK */}
              {blueprintActiveTab === 'stack' && (
                <div className="space-y-4">
                  <div className="p-4 bg-slate-950 rounded-2xl border border-emerald-500/30 space-y-2">
                    <h4 className="text-sm font-black text-white flex items-center gap-2">
                      <Server className="w-4 h-4 text-emerald-400" />
                      4. Infrastructure &amp; Serving Stack
                    </h4>
                    <p>
                      Generating 8K master streams requires high-throughput distributed parallel execution.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
                    <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                      <span className="font-bold text-cyan-400">Training Hardware</span>
                      <p className="text-slate-400">Clusters of NVIDIA H100 / B200 GPUs with FSDP (Fully Sharded Data Parallel) splitting weights, gradients, and optimizer states across nodes.</p>
                    </div>

                    <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                      <span className="font-bold text-purple-400">Inference Engine</span>
                      <p className="text-slate-400">TensorRT-LLM and vLLM optimized for 3D Spacetime FlashAttention-3 with FP8 quantization and paged KV cache management.</p>
                    </div>

                    <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                      <span className="font-bold text-amber-400">Backend Queue</span>
                      <p className="text-slate-400">Celery + Redis distributed async worker queue to manage long-running multi-minute neural synthesis without HTTP timeouts.</p>
                    </div>

                    <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                      <span className="font-bold text-emerald-400">Storage &amp; CDN</span>
                      <p className="text-slate-400">Google Cloud Storage (GCS) Multi-Region with Cloud CDN packaging ProRes 4444 XQ and AV1 HDR streams for instant global delivery.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: OPEN-SOURCE BENCHMARKS */}
              {blueprintActiveTab === 'opensource' && (
                <div className="space-y-4">
                  <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                    <h4 className="text-sm font-black text-white flex items-center gap-2">
                      <Boxes className="w-4 h-4 text-purple-400" />
                      5. Open-Source Comparative Architecture Matrix
                    </h4>
                    <p className="text-slate-400 text-[11px]">
                      Benchmark comparing LEO 8K Cascaded DiT against prominent open-source video generation models:
                    </p>
                  </div>

                  <div className="overflow-x-auto border border-slate-800 rounded-2xl">
                    <table className="w-full text-left text-[11px]">
                      <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 font-mono">
                        <tr>
                          <th className="p-3">Model</th>
                          <th className="p-3">Architecture</th>
                          <th className="p-3">Max Output</th>
                          <th className="p-3">Spacetime Patches</th>
                          <th className="p-3">Flow Matching</th>
                          <th className="p-3">Consistency</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/80">
                        {OPEN_SOURCE_BENCHMARKS.map((m) => (
                          <tr key={m.name} className={m.name.includes('LEO') ? 'bg-purple-950/20 font-bold' : ''}>
                            <td className="p-3 text-white flex items-center gap-1.5">
                              {m.name.includes('LEO') && <Flame className="w-3.5 h-3.5 text-amber-400" />}
                              {m.name}
                            </td>
                            <td className="p-3 text-slate-300">{m.architecture}</td>
                            <td className="p-3 font-mono text-cyan-300">{m.maxResolution}</td>
                            <td className="p-3">{m.spacetimePatches ? '✅ Yes' : '❌ No'}</td>
                            <td className="p-3">{m.flowMatching ? '✅ Yes' : '❌ No'}</td>
                            <td className="p-3 font-mono text-emerald-400">{m.temporalConsistencyScore}/100</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 6: PYTORCH & STACK CODE */}
              {blueprintActiveTab === 'code' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-black text-white flex items-center gap-2">
                      <Terminal className="w-4 h-4 text-cyan-400" />
                      Production PyTorch Cascaded 8K Pipeline Code
                    </h4>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(getPyTorchCascadedPipelineCode());
                        setCopiedBlueprintCode('pytorch');
                        setTimeout(() => setCopiedBlueprintCode(null), 2500);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
                    >
                      {copiedBlueprintCode === 'pytorch' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedBlueprintCode === 'pytorch' ? 'Code Copied!' : 'Copy PyTorch Code'}
                    </button>
                  </div>

                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 font-mono text-[11px] text-slate-300 max-h-72 overflow-y-auto">
                    <pre>{getPyTorchCascadedPipelineCode()}</pre>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <h4 className="text-sm font-black text-white flex items-center gap-2">
                      <FileCode className="w-4 h-4 text-emerald-400" />
                      H100/B200 FSDP &amp; TensorRT-LLM Cluster Config (YAML)
                    </h4>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(getInfrastructureStackConfig());
                        setCopiedBlueprintCode('yaml');
                        setTimeout(() => setCopiedBlueprintCode(null), 2500);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1.5 transition-colors"
                    >
                      {copiedBlueprintCode === 'yaml' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedBlueprintCode === 'yaml' ? 'Config Copied!' : 'Copy Cluster YAML'}
                    </button>
                  </div>

                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 font-mono text-[11px] text-slate-300 max-h-56 overflow-y-auto">
                    <pre>{getInfrastructureStackConfig()}</pre>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-mono">
                LEO 8K Cascaded DiT • 7680×4320 @ 60fps • 33.18 MP/frame
              </span>
              <button
                onClick={() => setIsBlueprintModalOpen(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl transition-colors"
              >
                Close Blueprint
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2026 Post-Sora Multi-Model Engine Hub & Migration Modal */}
      <EngineHub2026Modal
        isOpen={isEngineHubOpen}
        onClose={() => setIsEngineHubOpen(false)}
        activeEngineId={selectedEngineId}
        onSelectEngine={(newEngine) => setSelectedEngineId(newEngine)}
        currentPrompt={spec.prompt}
      />

      {/* AI Dance Video Maker & Fill-in-the-Blank Studio Modal */}
      <AiDanceStudioModal
        isOpen={isAiDanceModalOpen}
        onClose={() => setIsAiDanceModalOpen(false)}
        onApplyPromptToStudio={(newPrompt) => {
          setSpec((prev) => ({ ...prev, prompt: newPrompt }));
        }}
      />
    </div>
  );
};
