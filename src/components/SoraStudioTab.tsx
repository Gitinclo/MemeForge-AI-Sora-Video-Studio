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

interface SoraStudioTabProps {
  onMemeToVideoPrompt?: (promptText: string) => void;
  subscription?: UserSubscription;
  onOpenSubscriptionModal?: () => void;
  onOpenCinemaVfx?: () => void;
}

export const SoraStudioTab: React.FC<SoraStudioTabProps> = ({
  onMemeToVideoPrompt,
  subscription,
  onOpenSubscriptionModal,
  onOpenCinemaVfx,
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
  const [durationInputUnit, setDurationInputUnit] = useState<'hours' | 'minutes' | 'seconds'>('hours');

  const totalDurationSec = (spec.durationHours || 100) * 3600;
  const [currentTimecode, setCurrentTimecode] = useState(14400); // 4 hours in default preview
  const computeMetrics = calculateVideoComputeMetrics(spec.durationHours || 100, spec.frameRate, spec.resolution);

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

  // Video Generation Pipeline Trigger
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

    const stages = [
      { p: 15, msg: `Pre-Flight: Prompt semantic vectorization & ${hoursStr} keyframe roadmap...` },
      { p: 40, msg: `Distributed Diffusion: Partitioning ${totalFrames.toLocaleString()} frames across 4 GPU clusters...` },
      { p: 70, msg: `Super-Resolution: Neural upscaling to ${spec.resolution} with persistent latent memory...` },
      { p: 90, msg: `Camera Motion: Interpolating continuous ${spec.cameraMotion} trajectories without drift...` },
      { p: 100, msg: `Distributed CDN Master: ${hoursStr} stream ready (100h Max Cap Engine)` },
    ];

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
      {/* Top Banner / Sora Specs Bar */}
      <div className="p-4 sm:p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Film className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                <span>Sora Video Studio</span>
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
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-black/75 border border-purple-500/40 text-purple-300 text-xs font-mono font-bold flex items-center gap-1.5 backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                VEO 3.1 • {spec.resolution} • {spec.frameRate} FPS • {formatDurationLabel(spec.durationHours)}
              </span>
              <span className="px-2 py-1 rounded-lg bg-black/75 border border-slate-700 text-slate-300 text-xs font-mono backdrop-blur-md">
                {spec.aspectRatio}
              </span>
            </div>

            {/* Camera Motion Overlay Tag */}
            <div className="absolute top-4 right-4">
              <span className="px-2.5 py-1 rounded-lg bg-black/75 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold backdrop-blur-md">
                CAM: {spec.cameraMotion}
              </span>
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

        {/* Right: Sora Production Parameters (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-purple-400" />
                Generation Controls
              </span>
              <button
                onClick={handleEnhancePrompt}
                disabled={isEnhancing}
                className="text-[11px] font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors disabled:opacity-50"
              >
                <Zap className="w-3.5 h-3.5" />
                {isEnhancing ? 'Optimizing...' : 'Flash-Lite Enhance'}
              </button>
            </h4>

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
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Resolution Output Control
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['720p HD', '1080p FHD', '4K Ultra'] as const).map((res) => {
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
                      className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all relative flex flex-col items-center justify-center ${
                        isSel
                          ? 'bg-purple-500/20 border-purple-500 text-purple-300 shadow-md shadow-purple-500/10'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <span className="flex items-center gap-1">
                        <span>{res}</span>
                        {isProRes && !isProUser && (
                          <span className="text-[8px] font-black px-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                            PRO
                          </span>
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

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
                  <span>Generate {formatDurationLabel(spec.durationHours)} Scene with Sora / Veo 3</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
