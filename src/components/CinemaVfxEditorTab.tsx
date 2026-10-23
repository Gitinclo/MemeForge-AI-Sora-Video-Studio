import React, { useState, useRef, useEffect } from 'react';
import {
  Film,
  Video,
  Layers,
  Sliders,
  SlidersHorizontal,
  Volume2,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  Scissors,
  Maximize2,
  Sparkles,
  Cpu,
  Server,
  HardDrive,
  Shield,
  Zap,
  Activity,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Clock,
  Radio,
  Wand2,
  Crosshair,
  Grid,
  BarChart3,
  RefreshCw,
  Download,
  CheckCircle2,
  Waves,
  Boxes,
  HelpCircle,
  FileCode,
  AlertTriangle,
  Flame,
} from 'lucide-react';
import {
  CinemaProjectSpec,
  ResolutionPreset,
  FrameRatePreset,
  ColorBitDepth,
  ColorSpaceStandard,
  HdrStandard,
  AudioSampleRate,
  AudioBitDepth,
  AudioChannelLayout,
  ProCodec,
  RenderEngineBackend,
  ProxyQuality,
  TimelineTool,
  TimelineTrack,
  TimelineClip,
  ScopeMode,
  ColorGradeControls,
} from '../types/cinemaEngine';
import {
  CINEMA_RESOLUTIONS,
  CINEMA_FRAME_RATES,
  AUDIO_SAMPLE_RATES,
  COLOR_BIT_DEPTHS,
  COLOR_SPACES,
  HDR_STANDARDS,
  PRO_CODECS,
  CINEMA_LUT_PRESETS,
  DEFAULT_CINEMA_PROJECT,
  TICKS_PER_SECOND_64,
  calculateUltraComputeMetrics,
  ticksToTimecode64,
  timecodeToTicks64,
  getProxyDimensions,
} from '../utils/cinemaEngine';
import { UserSubscription } from '../types/subscription';

interface CinemaVfxEditorTabProps {
  subscription?: UserSubscription;
  onOpenSubscriptionModal?: () => void;
}

export const CinemaVfxEditorTab: React.FC<CinemaVfxEditorTabProps> = ({
  subscription,
  onOpenSubscriptionModal,
}) => {
  // Cinema Workspace View: Edit, Color & Scopes, VFX Node Graph, Fairlight Audio, Deliver
  const [workspaceMode, setWorkspaceMode] = useState<'edit' | 'color' | 'vfx' | 'audio' | 'deliver'>('edit');

  // Active Project Specifications (Defaulting to 32K 1000 FPS 32-bit Float Master)
  const [projectSpec, setProjectSpec] = useState<CinemaProjectSpec>(DEFAULT_CINEMA_PROJECT);

  // Playback & 64-bit Frame-Accurate Timebase state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTicks, setCurrentTicks] = useState<bigint>(0n);
  const [durationTicks, setDurationTicks] = useState<bigint>(10n * TICKS_PER_SECOND_64); // 10 seconds default project
  const [activeTool, setActiveTool] = useState<TimelineTool>('select');

  // Scopes state
  const [scopes, setScopes] = useState<ScopeMode>({
    waveform: true,
    rgbParade: false,
    vectorscope: true,
    histogram: false,
    falseColor: false,
  });

  // Color Grading state
  const [colorGrade, setColorGrade] = useState<ColorGradeControls>({
    lift: { r: 0, g: 0, b: 0, luma: 0 },
    gamma: { r: 0, g: 0, b: 0, luma: 0 },
    gain: { r: 0, g: 0, b: 0, luma: 0 },
    offset: { r: 0, g: 0, b: 0, luma: 0 },
    contrast: 1.15,
    pivot: 0.43,
    saturation: 110,
    temperature: 5600,
    tint: 0,
    activeLut: 'hollywood_teal_orange',
  });

  // AI Feature triggers
  const [isProcessingAi, setIsProcessingAi] = useState(false);
  const [aiStatusMessage, setAiStatusMessage] = useState<string>('');

  // Timeline Tracks
  const [tracks, setTracks] = useState<TimelineTrack[]>([
    {
      id: 'v3',
      name: 'V3 • AI Rotomask & VFX',
      type: 'video',
      isMuted: false,
      isLocked: false,
      color: 'bg-cyan-500/30 border-cyan-500/50 text-cyan-200',
      clips: [
        {
          id: 'c-v3-1',
          trackId: 'v3',
          name: 'AI Neural Depth Glow (32K Mask)',
          startTicks: 2n * TICKS_PER_SECOND_64,
          durationTicks: 5n * TICKS_PER_SECOND_64,
          sourceStartTicks: 0n,
          color: 'bg-cyan-600/40 border-cyan-400',
          speedMultiplier: 1.0,
        },
      ],
    },
    {
      id: 'v2',
      name: 'V2 • Cinema Overlay Titles',
      type: 'video',
      isMuted: false,
      isLocked: false,
      color: 'bg-purple-500/30 border-purple-500/50 text-purple-200',
      clips: [
        {
          id: 'c-v2-1',
          trackId: 'v2',
          name: '32000×32000 IMAX Master Title',
          startTicks: 0n,
          durationTicks: 4n * TICKS_PER_SECOND_64,
          sourceStartTicks: 0n,
          color: 'bg-purple-600/40 border-purple-400',
          speedMultiplier: 1.0,
        },
      ],
    },
    {
      id: 'v1',
      name: 'V1 • 32K 1000 FPS RAW Plate',
      type: 'video',
      isMuted: false,
      isLocked: false,
      color: 'bg-amber-500/30 border-amber-500/50 text-amber-200',
      clips: [
        {
          id: 'c-v1-1',
          trackId: 'v1',
          name: 'Sora Omnimax Hyperlapse (1000 FPS Optical Flow)',
          startTicks: 0n,
          durationTicks: 10n * TICKS_PER_SECOND_64,
          sourceStartTicks: 0n,
          color: 'bg-amber-600/40 border-amber-400',
          speedMultiplier: 1.0,
        },
      ],
    },
    {
      id: 'fx1',
      name: 'FX • ACES 2.0 Transform Layer',
      type: 'adjustment',
      isMuted: false,
      isLocked: false,
      color: 'bg-indigo-500/30 border-indigo-500/50 text-indigo-200',
      clips: [
        {
          id: 'c-fx-1',
          trackId: 'fx1',
          name: 'Dolby Vision Profile 7 Tone Curve + 3D LUT',
          startTicks: 0n,
          durationTicks: 10n * TICKS_PER_SECOND_64,
          sourceStartTicks: 0n,
          color: 'bg-indigo-600/40 border-indigo-400',
          speedMultiplier: 1.0,
        },
      ],
    },
    {
      id: 'a1',
      name: 'A1 • Dialogue (192 kHz / 32-bit Float)',
      type: 'audio',
      isMuted: false,
      isLocked: false,
      color: 'bg-emerald-500/30 border-emerald-500/50 text-emerald-200',
      clips: [
        {
          id: 'c-a1-1',
          trackId: 'a1',
          name: 'Studio Mic Stem 192kHz (AI Speech Enhanced)',
          startTicks: 0n,
          durationTicks: 8n * TICKS_PER_SECOND_64,
          sourceStartTicks: 0n,
          color: 'bg-emerald-600/40 border-emerald-400',
          speedMultiplier: 1.0,
        },
      ],
    },
    {
      id: 'a2',
      name: 'A2 • Atmos Bed 7.1.4 (Ambisonics 3rd Order)',
      type: 'audio',
      isMuted: false,
      isLocked: false,
      color: 'bg-teal-500/30 border-teal-500/50 text-teal-200',
      clips: [
        {
          id: 'c-a2-1',
          trackId: 'a2',
          name: '16-Channel 3D Spatial Foley Bed',
          startTicks: 0n,
          durationTicks: 10n * TICKS_PER_SECOND_64,
          sourceStartTicks: 0n,
          color: 'bg-teal-600/40 border-teal-400',
          speedMultiplier: 1.0,
        },
      ],
    },
  ]);

  // Compute metrics for current project configuration
  const computeMetrics = calculateUltraComputeMetrics(
    projectSpec.width,
    projectSpec.height,
    projectSpec.frameRate,
    projectSpec.colorDepth
  );

  const proxyDims = getProxyDimensions(projectSpec.width, projectSpec.height, projectSpec.proxyQuality);

  // Playback timer loop
  const animFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  useEffect(() => {
    if (isPlaying) {
      lastTimeRef.current = performance.now();
      const step = (now: number) => {
        const deltaSeconds = (now - lastTimeRef.current) / 1000;
        lastTimeRef.current = now;

        setCurrentTicks((prev) => {
          const deltaTicks = BigInt(Math.round(deltaSeconds * Number(TICKS_PER_SECOND_64)));
          const next = prev + deltaTicks;
          if (next >= durationTicks) {
            return 0n; // Loop
          }
          return next;
        });

        animFrameRef.current = requestAnimationFrame(step);
      };
      animFrameRef.current = requestAnimationFrame(step);
    } else {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    }
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying, durationTicks]);

  // Step 1 frame forward or backward with 64-bit frame accuracy
  const handleStepFrame = (direction: 1 | -1) => {
    const ticksPerFrame = TICKS_PER_SECOND_64 / BigInt(Math.round(projectSpec.frameRate));
    setCurrentTicks((prev) => {
      const next = prev + BigInt(direction) * ticksPerFrame;
      if (next < 0n) return 0n;
      if (next > durationTicks) return durationTicks;
      return next;
    });
  };

  // Change Resolution
  const handleSelectResolution = (resId: ResolutionPreset) => {
    const cfg = CINEMA_RESOLUTIONS.find((r) => r.id === resId);
    if (cfg) {
      setProjectSpec((prev) => ({
        ...prev,
        resolutionPreset: resId,
        width: cfg.width,
        height: cfg.height,
        proxyQuality: cfg.megapixels > 500 ? '1/16 Super Proxy' : cfg.megapixels > 30 ? '1/4 Proxy' : '1:1 Full Master',
      }));
    }
  };

  // Trigger AI Cinema feature
  const triggerAiFeature = (name: string, description: string) => {
    setIsProcessingAi(true);
    setAiStatusMessage(`Processing ${name}: ${description}...`);
    setTimeout(() => {
      setIsProcessingAi(false);
      setAiStatusMessage(`✓ ${name} completed successfully on WebGPU cluster!`);
      setTimeout(() => setAiStatusMessage(''), 4500);
    }, 2000);
  };

  const selectedLut = CINEMA_LUT_PRESETS.find((l) => l.id === colorGrade.activeLut);

  return (
    <div className="space-y-4">
      {/* Top Header Bar: Pro Cinema Suite Banner & Workspace Tabs */}
      <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-purple-600 text-white shadow-lg shadow-cyan-500/20">
            <Film className="w-6 h-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-black text-white tracking-tight">
                Cinema VFX Studio Master
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[10px] font-black uppercase tracking-wider">
                32K • 1000 FPS • 192 kHz
              </span>
              <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 text-[10px] font-mono font-bold">
                ACES 2.0 AP0
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Next-generation cinema architecture combining Adobe Premiere timeline precision, DaVinci Resolve color science, and Fusion VFX node graphs.
            </p>
          </div>
        </div>

        {/* Workspace Mode Switcher (Premiere vs DaVinci vs Fusion vs Fairlight vs Deliver) */}
        <div className="flex items-center p-1 bg-slate-950 rounded-2xl border border-slate-800 overflow-x-auto shrink-0">
          <button
            onClick={() => setWorkspaceMode('edit')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              workspaceMode === 'edit'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Scissors className="w-3.5 h-3.5" />
            <span>Edit &amp; Cut</span>
          </button>
          <button
            onClick={() => setWorkspaceMode('color')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              workspaceMode === 'color'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Color &amp; Scopes</span>
          </button>
          <button
            onClick={() => setWorkspaceMode('vfx')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              workspaceMode === 'vfx'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Boxes className="w-3.5 h-3.5" />
            <span>Fusion VFX Graph</span>
          </button>
          <button
            onClick={() => setWorkspaceMode('audio')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              workspaceMode === 'audio'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Waves className="w-3.5 h-3.5" />
            <span>Fairlight 192kHz</span>
          </button>
          <button
            onClick={() => setWorkspaceMode('deliver')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              workspaceMode === 'deliver'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            <span>Deliver &amp; Farm</span>
          </button>
        </div>
      </div>

      {/* Compute Engine & Hardware Metrics Bar */}
      <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-1.5 text-slate-300">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>Engine:</span>
            <strong className="text-white font-mono">{projectSpec.renderBackend.split(' ')[0]}</strong>
          </div>
          <div className="flex items-center gap-1.5 text-slate-300">
            <Activity className="w-4 h-4 text-purple-400" />
            <span>Raw Resolution:</span>
            <strong className="text-cyan-300 font-mono">
              {projectSpec.width}×{projectSpec.height} ({computeMetrics.megapixels} MP)
            </strong>
          </div>
          <div className="flex items-center gap-1.5 text-slate-300">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Timebase:</span>
            <strong className="text-amber-300 font-mono">{projectSpec.frameRate} FPS (64-bit Sync)</strong>
          </div>
          <div className="flex items-center gap-1.5 text-slate-300">
            <Waves className="w-4 h-4 text-emerald-400" />
            <span>Audio Master:</span>
            <strong className="text-emerald-300 font-mono">192 kHz / 32-bit Float</strong>
          </div>
        </div>

        {/* Real-time Memory & Proxy status */}
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-mono text-slate-400">
            Frame: <span className="text-white font-bold">{computeMetrics.frameSizeGb} GB</span> •
            Proxy: <span className="text-cyan-300 font-bold">{projectSpec.proxyQuality} ({proxyDims.width}×{proxyDims.height})</span>
          </span>
          <select
            value={projectSpec.proxyQuality}
            onChange={(e) => setProjectSpec({ ...projectSpec, proxyQuality: e.target.value as ProxyQuality })}
            className="px-2 py-1 rounded-lg bg-slate-900 border border-slate-800 text-cyan-300 text-[11px] font-mono focus:outline-none focus:border-cyan-400"
          >
            <option value="1:1 Full Master">1:1 Full Master (Extreme VRAM)</option>
            <option value="1/2 Proxy">1/2 Proxy</option>
            <option value="1/4 Proxy">1/4 Proxy (Fast)</option>
            <option value="1/8 Proxy">1/8 Proxy (Ultra Fast)</option>
            <option value="1/16 Super Proxy">1/16 Super Proxy (Smooth 32K on Laptops)</option>
          </select>
        </div>
      </div>

      {/* AI Processing Status Toast */}
      {isProcessingAi && (
        <div className="p-3 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-bold flex items-center gap-2 animate-pulse">
          <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" />
          <span>{aiStatusMessage}</span>
        </div>
      )}
      {!isProcessingAi && aiStatusMessage && (
        <div className="p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{aiStatusMessage}</span>
        </div>
      )}

      {/* MAIN DUAL-PANE WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left / Center Monitor Viewport (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="p-4 rounded-3xl bg-slate-950 border border-slate-800 shadow-2xl relative flex flex-col items-center justify-center min-h-[360px] overflow-hidden">
            {/* Monitor Header info */}
            <div className="w-full flex items-center justify-between text-[11px] font-mono text-slate-400 pb-2 border-b border-slate-850">
              <span className="flex items-center gap-1.5 text-cyan-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>32K Cinema Master Output</span>
              </span>
              <span>
                Color Space: <strong className="text-white">{projectSpec.colorSpace}</strong> | HDR: <strong className="text-white">{projectSpec.hdrStandard}</strong>
              </span>
            </div>

            {/* Video Canvas Simulation Screen */}
            <div
              className="relative w-full aspect-video rounded-2xl overflow-hidden bg-gradient-to-tr from-slate-950 via-slate-900 to-indigo-950/60 border border-slate-800 flex items-center justify-center my-3 shadow-inner"
              style={{
                filter: selectedLut?.colorFilter || 'none',
              }}
            >
              {/* Visual Demo Elements representing 32K / 1000 FPS scene */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 space-y-2 pointer-events-none">
                <div className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>32000×32000 Native Latent Plate @ {projectSpec.frameRate} FPS</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white tracking-wide drop-shadow-md">
                  CINEMA VFX MASTER TIMELINE
                </h3>
                <p className="text-xs text-slate-300 max-w-md drop-shadow">
                  Sub-frame 64-bit frame accuracy with 192 kHz Fairlight audio and ACES 2.0 deep color grading
                </p>
              </div>

              {/* Real-time False Color Heatmap Overlay (if false color is enabled) */}
              {scopes.falseColor && (
                <div className="absolute inset-0 bg-gradient-to-r from-purple-700/60 via-green-500/40 to-red-600/60 mix-blend-color pointer-events-none" />
              )}

              {/* Timecode overlay in bottom right */}
              <div className="absolute bottom-3 right-3 px-3 py-1 rounded-xl bg-black/80 backdrop-blur-md border border-white/20 font-mono text-sm font-black text-amber-300 tracking-wider">
                {ticksToTimecode64(currentTicks, projectSpec.frameRate)}
              </div>
            </div>

            {/* Transport Bar Controls (Play, Step, Loop, Timecode) */}
            <div className="w-full flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-850">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setCurrentTicks(0n)}
                  className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
                  title="Go to Beginning (Home)"
                >
                  <SkipBack className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleStepFrame(-1)}
                  className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
                  title="Step 1 Frame Backward (Left Arrow)"
                >
                  -1F
                </button>
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-black text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20 active:scale-95 transition-all"
                  title="Play / Pause (Space)"
                >
                  {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                  <span>{isPlaying ? 'PAUSE' : 'PLAY'}</span>
                </button>
                <button
                  onClick={() => handleStepFrame(1)}
                  className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
                  title="Step 1 Frame Forward (Right Arrow)"
                >
                  +1F
                </button>
                <button
                  onClick={() => setCurrentTicks(durationTicks)}
                  className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
                  title="Go to End (End)"
                >
                  <SkipForward className="w-4 h-4" />
                </button>
              </div>

              {/* Exact 64-bit frame-accurate SMPTE Timecode Display */}
              <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 font-mono text-xs">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-slate-400">TC:</span>
                <span className="text-white font-bold">{ticksToTimecode64(currentTicks, projectSpec.frameRate)}</span>
                <span className="text-slate-600">/</span>
                <span className="text-slate-400">{ticksToTimecode64(durationTicks, projectSpec.frameRate)}</span>
              </div>
            </div>
          </div>

          {/* Real-Time Video Scopes Panel (Waveform, RGB Parade, Vectorscope, False Color) */}
          <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-purple-400" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Real-Time Broadcast HDR Scopes
                </h4>
              </div>
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-[10px] font-mono">
                <button
                  onClick={() => setScopes({ ...scopes, waveform: !scopes.waveform })}
                  className={`px-2 py-0.5 rounded-lg font-bold transition-colors ${
                    scopes.waveform ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Waveform
                </button>
                <button
                  onClick={() => setScopes({ ...scopes, vectorscope: !scopes.vectorscope })}
                  className={`px-2 py-0.5 rounded-lg font-bold transition-colors ${
                    scopes.vectorscope ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Vectorscope
                </button>
                <button
                  onClick={() => setScopes({ ...scopes, falseColor: !scopes.falseColor })}
                  className={`px-2 py-0.5 rounded-lg font-bold transition-colors ${
                    scopes.falseColor ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  False Color
                </button>
              </div>
            </div>

            {/* Scope Visualizers Canvas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-[10px]">
              {scopes.waveform && (
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="flex justify-between text-slate-400">
                    <span>Luma Waveform (IRE 0-100)</span>
                    <span className="text-emerald-400">Peak: 980 Nits (HDR10+)</span>
                  </div>
                  <div className="h-24 rounded-lg bg-black/80 border border-slate-800/80 p-2 flex flex-col justify-between text-[9px] text-slate-500 relative overflow-hidden">
                    <div className="w-full border-b border-red-500/30 text-red-400/70 text-[8px]">100 IRE (Clip)</div>
                    <div className="w-full border-b border-yellow-500/20 text-yellow-400/50 text-[8px]">75 IRE</div>
                    <div className="w-full border-b border-emerald-500/20 text-emerald-400/50 text-[8px]">50 IRE (Skin)</div>
                    <div className="w-full border-b border-cyan-500/20 text-cyan-400/50 text-[8px]">0 IRE (Floor)</div>
                    {/* Simulated Waveform Trace */}
                    <div className="absolute inset-0 flex items-center justify-around pointer-events-none opacity-80">
                      <div className="w-1/6 h-3/4 bg-gradient-to-t from-emerald-500/10 via-emerald-400/40 to-emerald-300/80 rounded blur-[1px]" />
                      <div className="w-1/6 h-2/3 bg-gradient-to-t from-emerald-500/10 via-emerald-400/40 to-emerald-300/80 rounded blur-[1px]" />
                      <div className="w-1/6 h-4/5 bg-gradient-to-t from-emerald-500/10 via-emerald-400/40 to-emerald-300/80 rounded blur-[1px]" />
                    </div>
                  </div>
                </div>
              )}

              {scopes.vectorscope && (
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="flex justify-between text-slate-400">
                    <span>Vectorscope (Color Phase)</span>
                    <span className="text-cyan-400">ACES AP0 Target</span>
                  </div>
                  <div className="h-24 rounded-lg bg-black/80 border border-slate-800/80 flex items-center justify-center relative">
                    {/* Vectorscope circular crosshairs */}
                    <div className="w-20 h-20 rounded-full border border-dashed border-cyan-500/30 flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full border border-slate-700 flex items-center justify-center">
                        <div className="w-1 h-1 rounded-full bg-cyan-400" />
                      </div>
                    </div>
                    {/* Skin Tone Indicator Line */}
                    <div className="absolute w-20 h-0.5 bg-amber-400/40 -rotate-45" title="Skin Tone Line" />
                    {/* Chroma Cloud */}
                    <div className="absolute w-8 h-8 rounded-full bg-cyan-400/20 blur-sm -translate-x-1 -translate-y-1" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Settings & Controls Pane (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Sub-view: Edit & Master Spec Settings */}
          {workspaceMode === 'edit' && (
            <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-cyan-400" />
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Master Cinema Specifications
                  </h4>
                </div>
                <span className="text-[10px] font-mono text-cyan-300 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded-full">
                  64-bit Engine
                </span>
              </div>

              {/* 1. Ultra Resolution Pipeline */}
              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1.5 flex items-center justify-between">
                  <span>Ultra Resolution Pipeline</span>
                  <span className="text-[10px] font-mono text-amber-400">720p up to 32K (32000×32000)</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {CINEMA_RESOLUTIONS.map((res) => (
                    <button
                      key={res.id}
                      type="button"
                      onClick={() => handleSelectResolution(res.id)}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        projectSpec.resolutionPreset === res.id
                          ? 'bg-gradient-to-r from-cyan-500/20 to-purple-600/20 border-cyan-400 text-white shadow-md'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <div className="text-xs font-bold text-white flex items-center justify-between">
                        <span>{res.id}</span>
                        {res.id === '32K Ultra Master' && (
                          <span className="text-[8px] px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 uppercase font-black">
                            IMAX
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                        {res.width}×{res.height}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. High Frame Rate Engine (up to 1000 FPS) */}
              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1.5 flex items-center justify-between">
                  <span>High Frame Rate Engine</span>
                  <span className="text-[10px] font-mono text-amber-400">23.976 to 1000 FPS</span>
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {CINEMA_FRAME_RATES.map((fps) => (
                    <button
                      key={fps}
                      type="button"
                      onClick={() => setProjectSpec({ ...projectSpec, frameRate: fps })}
                      className={`px-2.5 py-1 rounded-lg border text-[11px] font-mono font-bold transition-all ${
                        projectSpec.frameRate === fps
                          ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-sm'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {fps} FPS
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Color Depth & Color Science */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Color Precision
                  </label>
                  <select
                    value={projectSpec.colorDepth}
                    onChange={(e) => setProjectSpec({ ...projectSpec, colorDepth: e.target.value as ColorBitDepth })}
                    className="w-full px-2.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:outline-none focus:border-cyan-400"
                  >
                    {COLOR_BIT_DEPTHS.map((depth) => (
                      <option key={depth} value={depth}>
                        {depth}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Color Science Space
                  </label>
                  <select
                    value={projectSpec.colorSpace}
                    onChange={(e) => setProjectSpec({ ...projectSpec, colorSpace: e.target.value as ColorSpaceStandard })}
                    className="w-full px-2.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:outline-none focus:border-cyan-400"
                  >
                    {COLOR_SPACES.map((cs) => (
                      <option key={cs} value={cs}>
                        {cs}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 4. Professional Audio Engine (192 kHz) */}
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Professional Audio Sample Rate
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {AUDIO_SAMPLE_RATES.map((sr) => (
                    <button
                      key={sr}
                      type="button"
                      onClick={() => setProjectSpec({ ...projectSpec, audioSampleRate: sr })}
                      className={`p-1.5 rounded-lg border text-center text-[10px] font-mono font-bold transition-all ${
                        projectSpec.audioSampleRate === sr
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {sr >= 1000 ? `${sr / 1000} kHz` : `${sr} Hz`}
                    </button>
                  ))}
                </div>
              </div>

              {/* 5. Professional Codec */}
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Master Archive Codec
                </label>
                <select
                  value={projectSpec.codec}
                  onChange={(e) => setProjectSpec({ ...projectSpec, codec: e.target.value as ProCodec })}
                  className="w-full px-2.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:outline-none focus:border-cyan-400"
                >
                  {PRO_CODECS.map((codec) => (
                    <option key={codec} value={codec}>
                      {codec}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Sub-view: Color & 3D LUT Grading (DaVinci Mode) */}
          {workspaceMode === 'color' && (
            <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-purple-400" />
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    DaVinci-Style Color &amp; 3D LUT Suite
                  </h4>
                </div>
                <span className="text-[10px] font-mono text-purple-300 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded-full">
                  HDR10+ / Dolby Vision
                </span>
              </div>

              {/* 3D LUT Selector */}
              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1.5 flex items-center justify-between">
                  <span>Film Emulation 3D LUT (.cube)</span>
                  <span className="text-[10px] text-cyan-400">OpenColorIO v2 Ready</span>
                </label>
                <div className="space-y-2">
                  {CINEMA_LUT_PRESETS.map((lut) => (
                    <button
                      key={lut.id}
                      type="button"
                      onClick={() => setColorGrade({ ...colorGrade, activeLut: lut.id })}
                      className={`w-full p-2.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                        colorGrade.activeLut === lut.id
                          ? 'bg-purple-600/20 border-purple-400 text-white shadow-md'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <div>
                        <div className="text-xs font-bold text-white">{lut.name}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{lut.description}</div>
                      </div>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-900 text-purple-300 border border-slate-800">
                        {lut.targetSpace}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 3-Way Color Wheels Simulation (Lift, Gamma, Gain) */}
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <span className="text-[11px] font-bold text-slate-300 block">
                  3-Way Primary Color Wheels (Lift / Gamma / Gain)
                </span>
                <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                    <span className="text-cyan-400 font-bold">LIFT (Shadows)</span>
                    <div className="w-12 h-12 mx-auto rounded-full border border-cyan-500/30 bg-black/60 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-sm" />
                    </div>
                    <span className="font-mono text-slate-400">RGB: 0, 0, 0</span>
                  </div>

                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                    <span className="text-amber-400 font-bold">GAMMA (Mids)</span>
                    <div className="w-12 h-12 mx-auto rounded-full border border-amber-500/30 bg-black/60 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-amber-400 shadow-sm" />
                    </div>
                    <span className="font-mono text-slate-400">RGB: 0, 0, 0</span>
                  </div>

                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                    <span className="text-purple-400 font-bold">GAIN (Highlights)</span>
                    <div className="w-12 h-12 mx-auto rounded-full border border-purple-500/30 bg-black/60 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-purple-400 shadow-sm" />
                    </div>
                    <span className="font-mono text-slate-400">RGB: 0, 0, 0</span>
                  </div>
                </div>

                {/* Tone Curve Controls */}
                <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900 text-slate-300">
                    <span>Contrast:</span>
                    <span className="text-white font-bold">{colorGrade.contrast}</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900 text-slate-300">
                    <span>Saturation:</span>
                    <span className="text-white font-bold">{colorGrade.saturation}%</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Sub-view: Fusion VFX & AI Node Graph (Fusion / AI Mode) */}
          {workspaceMode === 'vfx' && (
            <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Boxes className="w-4 h-4 text-cyan-400" />
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Fusion VFX &amp; AI Neural Tools
                  </h4>
                </div>
                <span className="text-[10px] font-mono text-cyan-300 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded-full">
                  Node Graph
                </span>
              </div>

              {/* AI Features Grid */}
              <div className="space-y-2.5">
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <Wand2 className="w-4 h-4 text-cyan-400" />
                    <div>
                      <h5 className="text-xs font-bold text-white">AI Optical Flow Frame Interpolation</h5>
                      <p className="text-[10px] text-slate-400">Synthesize intermediate motion frames up to 1000 FPS</p>
                    </div>
                  </div>
                  <button
                    onClick={() => triggerAiFeature('1000 FPS Interpolation', 'Generating sub-frame motion vectors')}
                    className="px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-bold"
                  >
                    Run 1000 FPS
                  </button>
                </div>

                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <div>
                      <h5 className="text-xs font-bold text-white">AI 32K Super-Resolution Upscaling</h5>
                      <p className="text-[10px] text-slate-400">Upscale 4K/8K plates to 32000×32000 IMAX Master</p>
                    </div>
                  </div>
                  <button
                    onClick={() => triggerAiFeature('32K Neural Upscaler', 'Synthesizing 1.024 Gigapixel detail')}
                    className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold"
                  >
                    Upscale 32K
                  </button>
                </div>

                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <Crosshair className="w-4 h-4 text-purple-400" />
                    <div>
                      <h5 className="text-xs font-bold text-white">AI Magic Mask &amp; Rotoscoping</h5>
                      <p className="text-[10px] text-slate-400">Zero-keyframe automated actor and object separation</p>
                    </div>
                  </div>
                  <button
                    onClick={() => triggerAiFeature('AI Magic Mask', 'Tracking actor contours across 1000 FPS')}
                    className="px-3 py-1.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 text-xs font-bold"
                  >
                    Auto Mask
                  </button>
                </div>

                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <Scissors className="w-4 h-4 text-rose-400" />
                    <div>
                      <h5 className="text-xs font-bold text-white">AI Generative Object Removal</h5>
                      <p className="text-[10px] text-slate-400">Erase boom mics, wires, and background bystanders</p>
                    </div>
                  </div>
                  <button
                    onClick={() => triggerAiFeature('Object Removal', 'Inpainting plate with background geometry')}
                    className="px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-bold"
                  >
                    Inpaint
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Sub-view: Fairlight Professional Audio 192 kHz */}
          {workspaceMode === 'audio' && (
            <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Waves className="w-4 h-4 text-emerald-400" />
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Fairlight Pro Audio Engine
                  </h4>
                </div>
                <span className="text-[10px] font-mono text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                  192 kHz / 64-bit Summing
                </span>
              </div>

              {/* Multi-channel Layout & Surround */}
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Spatial Channel Configuration
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {['Stereo (2.0)', '5.1 Surround', '7.1 Cinema Surround', 'Dolby Atmos (7.1.4 Bed + Objects)'].map((layout) => (
                    <button
                      key={layout}
                      type="button"
                      onClick={() => setProjectSpec({ ...projectSpec, audioLayout: layout as AudioChannelLayout })}
                      className={`p-2 rounded-xl border text-left text-[11px] font-semibold transition-all ${
                        projectSpec.audioLayout === layout
                          ? 'bg-emerald-500/20 border-emerald-400 text-white'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {layout}
                    </button>
                  ))}
                </div>
              </div>

              {/* Master Audio Metering Simulation */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex justify-between text-xs text-slate-300 font-mono">
                  <span>Master Bus Level (dBFS)</span>
                  <span className="text-emerald-400 font-bold">-14.2 LUFS (EBU R128)</span>
                </div>
                <div className="space-y-1.5 font-mono text-[9px]">
                  <div className="flex items-center gap-2">
                    <span className="w-6 text-slate-500">L</span>
                    <div className="flex-1 h-3 rounded bg-slate-900 overflow-hidden flex">
                      <div className="h-full bg-emerald-500" style={{ width: '74%' }} />
                    </div>
                    <span className="w-10 text-right text-slate-400">-4.2 dB</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-6 text-slate-500">R</span>
                    <div className="flex-1 h-3 rounded bg-slate-900 overflow-hidden flex">
                      <div className="h-full bg-emerald-500" style={{ width: '71%' }} />
                    </div>
                    <span className="w-10 text-right text-slate-400">-4.8 dB</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-6 text-slate-500">C</span>
                    <div className="flex-1 h-3 rounded bg-slate-900 overflow-hidden flex">
                      <div className="h-full bg-emerald-500" style={{ width: '65%' }} />
                    </div>
                    <span className="w-10 text-right text-slate-400">-6.0 dB</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-6 text-slate-500">LFE</span>
                    <div className="flex-1 h-3 rounded bg-slate-900 overflow-hidden flex">
                      <div className="h-full bg-amber-500" style={{ width: '82%' }} />
                    </div>
                    <span className="w-10 text-right text-amber-400">-2.1 dB</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Sub-view: Deliver & Distributed Render Farm */}
          {workspaceMode === 'deliver' && (
            <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Server className="w-4 h-4 text-indigo-400" />
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Deliver &amp; Distributed Render Farm
                  </h4>
                </div>
                <span className="text-[10px] font-mono text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-full">
                  GPU Render Graph
                </span>
              </div>

              {/* Render Farm Specifications */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5 font-mono text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>Selected Codec:</span>
                  <span className="text-white font-bold">{projectSpec.codec}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Tile Rendering:</span>
                  <span className="text-cyan-400">1024×1024 Sub-Tiles (Enabled)</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Cluster Nodes:</span>
                  <span className="text-amber-400 font-bold">{computeMetrics.clusterNodesRecommended} Dedicated GPU Nodes</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Est. Uncompressed Rate:</span>
                  <span className="text-purple-400 font-bold">{computeMetrics.throughputTbPerHour} TB / hour</span>
                </div>
              </div>

              <button
                onClick={() => triggerAiFeature('32K 1000 FPS Render Export', `Dispatching to ${computeMetrics.clusterNodesRecommended} GPU nodes in ProRes 4444 XQ`)}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:opacity-95 text-white font-black text-xs rounded-xl shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2"
              >
                <Server className="w-4 h-4" />
                <span>Start Distributed Master Render</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* BOTTOM: PREMIERE / FINAL CUT MULTI-TRACK 64-BIT TIMELINE */}
      <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-3">
        {/* Timeline Header & Tools bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setActiveTool('select')}
              className={`p-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1 ${
                activeTool === 'select' ? 'bg-amber-500 text-slate-950' : 'bg-slate-950 text-slate-400 hover:text-white'
              }`}
              title="Selection Tool (V)"
            >
              Select (V)
            </button>
            <button
              onClick={() => setActiveTool('blade')}
              className={`p-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1 ${
                activeTool === 'blade' ? 'bg-amber-500 text-slate-950' : 'bg-slate-950 text-slate-400 hover:text-white'
              }`}
              title="Razor Blade Tool (C)"
            >
              <Scissors className="w-3.5 h-3.5" />
              Blade (C)
            </button>
            <button
              onClick={() => setActiveTool('ripple')}
              className={`p-2 rounded-xl text-xs font-bold transition-colors ${
                activeTool === 'ripple' ? 'bg-amber-500 text-slate-950' : 'bg-slate-950 text-slate-400 hover:text-white'
              }`}
              title="Ripple Edit (B)"
            >
              Ripple (B)
            </button>
            <button
              onClick={() => setActiveTool('rolling')}
              className={`p-2 rounded-xl text-xs font-bold transition-colors ${
                activeTool === 'rolling' ? 'bg-amber-500 text-slate-950' : 'bg-slate-950 text-slate-400 hover:text-white'
              }`}
              title="Rolling Edit (N)"
            >
              Rolling (N)
            </button>
            <button
              onClick={() => setActiveTool('slip')}
              className={`p-2 rounded-xl text-xs font-bold transition-colors ${
                activeTool === 'slip' ? 'bg-amber-500 text-slate-950' : 'bg-slate-950 text-slate-400 hover:text-white'
              }`}
              title="Slip (Y)"
            >
              Slip (Y)
            </button>
            <button
              onClick={() => setActiveTool('slide')}
              className={`p-2 rounded-xl text-xs font-bold transition-colors ${
                activeTool === 'slide' ? 'bg-amber-500 text-slate-950' : 'bg-slate-950 text-slate-400 hover:text-white'
              }`}
              title="Slide (U)"
            >
              Slide (U)
            </button>
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-1.5 text-xs text-slate-300 font-bold cursor-pointer">
              <input
                type="checkbox"
                checked={projectSpec.enableMagneticTimeline}
                onChange={(e) => setProjectSpec({ ...projectSpec, enableMagneticTimeline: e.target.checked })}
                className="rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-0"
              />
              <span>Magnetic Timeline (Final Cut Style)</span>
            </label>
            <span className="text-xs font-mono text-cyan-300 bg-slate-950 px-2.5 py-1 rounded-xl border border-slate-800">
              Timebase: 120,000,000 Ticks / Frame
            </span>
          </div>
        </div>

        {/* Tracks List & Ruler */}
        <div className="space-y-2 overflow-x-auto">
          {/* Timecode Ruler */}
          <div className="flex items-center text-[10px] font-mono text-slate-500 pl-40 pr-4 h-6 border-b border-slate-800/80">
            <div className="w-1/4">00:00:00:000</div>
            <div className="w-1/4">00:00:02:500</div>
            <div className="w-1/4">00:00:05:000</div>
            <div className="w-1/4 text-right">00:00:10:000</div>
          </div>

          {/* Render Tracks */}
          {tracks.map((track) => (
            <div key={track.id} className="flex items-center gap-2">
              {/* Track Header (left) */}
              <div className="w-38 shrink-0 p-2 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                <span className="font-bold text-slate-300 truncate">{track.name.split('•')[0]}</span>
                <div className="flex items-center gap-1 text-slate-500">
                  <button
                    onClick={() => {
                      setTracks(
                        tracks.map((t) => (t.id === track.id ? { ...t, isMuted: !t.isMuted } : t))
                      );
                    }}
                    className={`p-1 rounded hover:text-white ${track.isMuted ? 'text-red-400' : ''}`}
                    title={track.isMuted ? 'Unmute' : 'Mute'}
                  >
                    {track.isMuted ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  </button>
                  <button
                    onClick={() => {
                      setTracks(
                        tracks.map((t) => (t.id === track.id ? { ...t, isLocked: !t.isLocked } : t))
                      );
                    }}
                    className={`p-1 rounded hover:text-white ${track.isLocked ? 'text-amber-400' : ''}`}
                    title={track.isLocked ? 'Unlock' : 'Lock'}
                  >
                    {track.isLocked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                  </button>
                </div>
              </div>

              {/* Track Lane / Clips container */}
              <div className="flex-1 h-12 rounded-xl bg-slate-950 border border-slate-850 p-1 relative flex items-center overflow-hidden">
                {track.clips.map((clip) => {
                  const startPct = (Number(clip.startTicks) / Number(durationTicks)) * 100;
                  const widthPct = (Number(clip.durationTicks) / Number(durationTicks)) * 100;

                  return (
                    <div
                      key={clip.id}
                      className={`absolute h-10 rounded-lg border px-2.5 py-1 text-xs font-bold flex items-center justify-between truncate shadow-sm cursor-grab active:cursor-grabbing ${clip.color}`}
                      style={{
                        left: `${startPct}%`,
                        width: `${widthPct}%`,
                      }}
                    >
                      <span className="truncate">{clip.name}</span>
                      <span className="text-[9px] font-mono opacity-75 shrink-0 ml-1">
                        {ticksToTimecode64(clip.durationTicks, projectSpec.frameRate)}
                      </span>
                    </div>
                  );
                })}

                {/* Playhead indicator bar */}
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-red-500 shadow-md pointer-events-none z-10"
                  style={{
                    left: `${(Number(currentTicks) / Number(durationTicks)) * 100}%`,
                  }}
                >
                  <div className="w-2.5 h-2.5 bg-red-500 -ml-1 rounded-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
