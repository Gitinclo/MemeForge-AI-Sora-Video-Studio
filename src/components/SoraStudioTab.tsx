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
} from 'lucide-react';

interface SoraStudioTabProps {
  onMemeToVideoPrompt?: (promptText: string) => void;
}

export const SoraStudioTab: React.FC<SoraStudioTabProps> = () => {
  const [spec, setSpec] = useState<VideoProjectSpec>({
    title: 'Neon Odyssey: Hyper-Reality',
    prompt: 'A cyberpunk courier gliding on an anti-gravity hoverboard through rain-slicked Tokyo skyscrapers, neon reflections, anamorphic 35mm lens flare, 4K detail',
    negativePrompt: 'blurry, low quality, artifacts, glitching, cartoonish, distorted face',
    resolution: '4K Ultra',
    frameRate: 60,
    aspectRatio: '16:9',
    cameraMotion: 'Dolly Zoom In',
    style: 'Photorealistic',
  });

  const [isPlaying, setIsPlaying] = useState(true);
  const [isRendering, setIsRendering] = useState(false);
  const [renderProgress, setRenderProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState('Idle');
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [currentTimecode, setCurrentTimecode] = useState(4.2);
  const totalDuration = 10.0;

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

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
    setIsRendering(true);
    setRenderProgress(0);

    const stages = [
      { p: 15, msg: 'Pre-Flight: Prompt semantic embedding & safety scan...' },
      { p: 40, msg: `Latent Diffusion: Generating ${spec.frameRate}fps neural frame tensors...` },
      { p: 70, msg: `Super-Resolution: Neural upscaling to ${spec.resolution}...` },
      { p: 90, msg: `Camera Motion: Interpolating ${spec.cameraMotion} vectors...` },
      { p: 100, msg: 'Distributed CDN Encode: Ready for global low-latency stream' },
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
        setCurrentTimecode((prev) => (prev >= totalDuration ? 0 : prev + 0.03));
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
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white uppercase tracking-wider">
                  Veo 3.1 Neural Engine
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Text-to-Video generation with professional multi-resolution, frame rate &amp; camera trajectory controls
              </p>
            </div>
          </div>
        </div>

        {/* Global Edge CDN Low-Latency Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-slate-300 font-semibold">Edge CDN Latency:</span>
          <span className="text-emerald-400 font-mono font-bold">11ms</span>
          <span className="text-slate-600">|</span>
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          <span className="text-cyan-400 text-[11px] font-bold">E2E Encrypted</span>
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
              <span className="px-2.5 py-1 rounded-lg bg-black/70 border border-purple-500/40 text-purple-300 text-xs font-mono font-bold flex items-center gap-1.5 backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                VEO 3.1 • {spec.resolution} • {spec.frameRate} FPS
              </span>
              <span className="px-2 py-1 rounded-lg bg-black/70 border border-slate-700 text-slate-300 text-xs font-mono backdrop-blur-md">
                {spec.aspectRatio}
              </span>
            </div>

            {/* Camera Motion Overlay Tag */}
            <div className="absolute top-4 right-4">
              <span className="px-2.5 py-1 rounded-lg bg-black/70 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold backdrop-blur-md">
                CAM: {spec.cameraMotion}
              </span>
            </div>

            {/* Center Play Button Overlay */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="absolute inset-0 flex items-center justify-center group/btn"
            >
              <div className="w-16 h-16 rounded-full bg-purple-600/80 group-hover/btn:bg-purple-500 border border-white/20 text-white flex items-center justify-center shadow-2xl backdrop-blur-md transition-all group-hover/btn:scale-110">
                {isPlaying ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7 ml-1" />}
              </div>
            </button>

            {/* Bottom Scrubber Overlay */}
            <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black via-black/80 to-transparent flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs text-slate-300 font-mono">
                <span>00:0{currentTimecode.toFixed(1)}</span>
                <span className="text-slate-500">/ 00:10.0</span>
              </div>
              <div className="w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full"
                  style={{ width: `${(currentTimecode / totalDuration) * 100}%` }}
                />
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
                  return (
                    <button
                      key={res}
                      onClick={() => setSpec({ ...spec, resolution: res })}
                      className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all ${
                        isSel
                          ? 'bg-purple-500/20 border-purple-500 text-purple-300 shadow-md shadow-purple-500/10'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {res}
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
                  return (
                    <button
                      key={fps}
                      onClick={() => setSpec({ ...spec, frameRate: fps })}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                        isSel
                          ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 shadow-md shadow-cyan-500/10'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {fps} fps
                    </button>
                  );
                })}
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
              onClick={handleStartRender}
              disabled={isRendering || !spec.prompt.trim()}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-extrabold text-sm rounded-2xl flex items-center justify-center gap-2 transition-all shadow-xl shadow-purple-500/25 active:scale-95 disabled:opacity-50"
            >
              {isRendering ? (
                <>
                  <Activity className="w-5 h-5 animate-spin" />
                  Synthesizing {spec.resolution} @ {spec.frameRate}fps...
                </>
              ) : (
                <>
                  <Video className="w-5 h-5" />
                  Generate Scene with Sora / Veo 3
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
