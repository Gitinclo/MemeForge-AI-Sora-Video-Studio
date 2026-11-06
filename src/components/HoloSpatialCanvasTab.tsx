import React, { useState, useRef, useEffect } from 'react';
import {
  SpatialHologramManifest,
  HologramLayer,
} from '../types/future2060';
import { TextLayer } from '../types/meme';
import {
  createDefaultHologramManifest,
  convert2DLayersToHologram,
  calculateParallaxOffset,
  exportHologramJson,
} from '../utils/hologramSpatialEngine';
import {
  Box,
  Layers,
  Camera,
  RotateCcw,
  Download,
  Eye,
  Sliders,
  Sparkles,
  Maximize2,
  Share2,
  Check,
  Grid,
  Sun,
  Activity,
} from 'lucide-react';

interface HoloSpatialCanvasTabProps {
  current2DTextLayers: TextLayer[];
  current2DImageSrc: string;
  onSendToQuantum?: (prompt: string) => void;
}

export const HoloSpatialCanvasTab: React.FC<HoloSpatialCanvasTabProps> = ({
  current2DTextLayers,
  current2DImageSrc,
  onSendToQuantum,
}) => {
  const [manifest, setManifest] = useState<SpatialHologramManifest>(() =>
    createDefaultHologramManifest()
  );
  const [orbitX, setOrbitX] = useState<number>(10);
  const [orbitY, setOrbitY] = useState<number>(-15);
  const [depthScale, setDepthScale] = useState<number>(1.2);
  const [showWireframe, setShowWireframe] = useState<boolean>(true);
  const [selectedLayerId, setSelectedLayerId] = useState<string>('layer_foreground_text');
  const [exportNotice, setExportNotice] = useState<string | null>(null);
  const [isStereoMode, setIsStereoMode] = useState<boolean>(false);
  const [activeFocalDepth, setActiveFocalDepth] = useState<number>(0);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Synchronize 2D layers into hologram layers on demand
  const handleImportFrom2D = () => {
    const upgradedLayers = convert2DLayersToHologram(
      current2DTextLayers,
      'Extruded 2D Canvas Volume'
    );
    setManifest((prev) => ({
      ...prev,
      layers: upgradedLayers,
    }));
    setExportNotice('Imported active 2D text layers into 3D Volumetric depth planes');
    setTimeout(() => setExportNotice(null), 3000);
  };

  // Render 3D spatial parallax and depth slices onto canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear with cybernetic deep obsidian
    ctx.fillStyle = '#080C14';
    ctx.fillRect(0, 0, width, height);

    // Draw holographic grid horizon
    if (showWireframe) {
      ctx.save();
      ctx.strokeStyle = 'rgba(0, 242, 254, 0.12)';
      ctx.lineWidth = 1;

      const gridCenterY = height * 0.75 + orbitX * 1.5;
      for (let i = -width; i <= width * 2; i += 60) {
        ctx.beginPath();
        ctx.moveTo(width / 2 + orbitY * 2, gridCenterY - 120);
        ctx.lineTo(i, height);
        ctx.stroke();
      }

      for (let y = gridCenterY - 100; y < height; y += 24) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
      ctx.restore();
    }

    // Sort layers by depthZ (back to front)
    const sortedLayers = [...manifest.layers].sort((a, b) => a.depthZ - b.depthZ);

    sortedLayers.forEach((layer) => {
      const { offsetX, offsetY, scale } = calculateParallaxOffset(
        layer.depthZ,
        orbitX,
        orbitY,
        depthScale
      );

      ctx.save();
      ctx.translate(width / 2 + offsetX, height / 2 + offsetY);
      ctx.scale(scale, scale);

      const isSelected = layer.id === selectedLayerId;

      if (layer.sourceType === 'point-cloud') {
        // Render quantum lightfield particles
        ctx.fillStyle = 'rgba(0, 242, 254, 0.4)';
        for (let p = 0; p < 40; p++) {
          const px = (Math.sin(p * 99) * width) / 3;
          const py = (Math.cos(p * 37) * height) / 3;
          ctx.beginPath();
          ctx.arc(px, py, 2, 0, Math.PI * 2);
          ctx.fill();
        }
      } else if (layer.sourceType === 'image') {
        // Render 3D backplate card
        ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
        ctx.strokeStyle = isSelected ? '#00F2FE' : 'rgba(56, 189, 248, 0.3)';
        ctx.lineWidth = isSelected ? 2 : 1;

        const cardW = 380;
        const cardH = 220;
        ctx.beginPath();
        ctx.roundRect(-cardW / 2, -cardH / 2, cardW, cardH, 8);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#94A3B8';
        ctx.font = '12px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`[VOLUME SLICE Z: ${layer.depthZ}] ${layer.content}`, 0, 0);
      } else if (layer.sourceType === 'text') {
        // Render extruded holographic floating text
        ctx.font = 'bold 28px "Plus Jakarta Sans", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Quantum specular glow
        ctx.shadowColor = '#00F2FE';
        ctx.shadowBlur = isSelected ? 20 : 10;

        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(layer.content, 0, 0);

        if (isSelected) {
          ctx.strokeStyle = 'rgba(0, 242, 254, 0.6)';
          ctx.lineWidth = 1.5;
          ctx.strokeText(layer.content, 0, 0);
        }
      }

      ctx.restore();
    });

    // Render spatial telemetry HUD overlay in top-left
    ctx.fillStyle = 'rgba(0, 242, 254, 0.8)';
    ctx.font = '11px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`CAM ORBIT: [${orbitX.toFixed(1)}°, ${orbitY.toFixed(1)}°] · DEPTH SLICES: 32`, 16, 26);
    ctx.fillText(`QUANTUM RADIANCE: 1.25 W/sr · YEAR 2060 RESILIENT`, 16, 42);
  }, [manifest, orbitX, orbitY, depthScale, showWireframe, selectedLayerId]);

  const handleDownloadHolo = () => {
    const jsonStr = exportHologramJson(manifest);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${manifest.sceneId}.holo`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setExportNotice('Exported 2060 Spatial Hologram manifest (.holo)');
    setTimeout(() => setExportNotice(null), 3000);
  };

  const resetCamera = () => {
    setOrbitX(0);
    setOrbitY(0);
    setDepthScale(1.0);
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto py-6 px-4">
      {/* Top Header & Overview */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
            <span>2060.01.01 SPATIAL CORE</span>
            <span aria-hidden="true">·</span>
            <span>VOLUMETRIC LIGHTFIELD ENGINE</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-400">64-BIT TIMESTAMP NOMINAL</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Box className="w-6 h-6 text-cyan-400" />
            Holographic 3D Spatial Canvas
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Real-time depth slicing, 6-axis camera parallax, and volumetric `.holo` lightfield export.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleImportFrom2D}
            className="flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
          >
            <Layers className="w-4 h-4 text-cyan-400" />
            Import 2D Layers
          </button>
          <button
            onClick={handleDownloadHolo}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-colors shadow-lg shadow-cyan-500/20"
          >
            <Download className="w-4 h-4" />
            Export .holo
          </button>
        </div>
      </div>

      {exportNotice && (
        <div className="flex items-center gap-2 p-3 bg-cyan-950/60 border border-cyan-500/40 rounded-lg text-xs text-cyan-200">
          <Check className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>{exportNotice}</span>
        </div>
      )}

      {/* Main Interactive Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive 3D Holographic Viewport */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="relative rounded-xl border border-slate-800 bg-[#080C14] overflow-hidden shadow-2xl">
            {/* Viewport Top Bar */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-900/40">
              <div className="flex items-center gap-2 text-xs text-slate-300 font-mono">
                <Activity className="w-4 h-4 text-cyan-400" />
                <span>SPATIAL VIEWPORT (1920×1080 VOLUMETRIC BUFFER)</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowWireframe(!showWireframe)}
                  className={`px-2.5 py-1 text-xs rounded transition-colors ${
                    showWireframe ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Grid className="w-3.5 h-3.5 inline mr-1" />
                  Grid
                </button>
                <button
                  onClick={resetCamera}
                  className="px-2.5 py-1 text-xs text-slate-400 hover:text-white transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5 inline mr-1" />
                  Reset Cam
                </button>
              </div>
            </div>

            {/* Canvas Viewport */}
            <div className="flex items-center justify-center p-4">
              <canvas
                ref={canvasRef}
                width={800}
                height={460}
                className="w-full max-w-[800px] h-[380px] rounded-lg border border-slate-800/80 cursor-grab active:cursor-grabbing bg-[#080C14]"
                onMouseMove={(e) => {
                  if (e.buttons === 1) {
                    setOrbitY((prev) => Math.max(-60, Math.min(60, prev + e.movementX * 0.3)));
                    setOrbitX((prev) => Math.max(-45, Math.min(45, prev - e.movementY * 0.3)));
                  }
                }}
              />
            </div>

            {/* Viewport Bottom Controls */}
            <div className="flex flex-wrap items-center justify-between gap-4 px-4 py-3 border-t border-slate-800 bg-slate-900/30 text-xs text-slate-400">
              <div className="flex items-center gap-4">
                <span>Drag inside viewport to rotate 6-axis camera</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono text-cyan-300">
                  FOV: {manifest.camera.fov}° · DIST: {manifest.camera.distance}px
                </span>
              </div>
              {onSendToQuantum && (
                <button
                  onClick={() => onSendToQuantum('3D Volumetric Scene with Quantum Lighting')}
                  className="text-xs text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Send Scene to Quantum DiT
                </button>
              )}
            </div>
          </div>

          {/* Quick Camera Orbit Sliders */}
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 flex flex-col gap-4">
            <div className="flex items-center justify-between text-xs font-medium text-slate-300">
              <span className="flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-cyan-400" />
                6-Axis Camera & Depth Slicing Controls
              </span>
              <span className="font-mono text-slate-500">2060.01.01 PROTOCOL</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div>
                <div className="flex justify-between mb-1 text-slate-400">
                  <span>Pitch (Orbit X)</span>
                  <span className="font-mono text-cyan-300">{orbitX.toFixed(1)}°</span>
                </div>
                <input
                  type="range"
                  min="-45"
                  max="45"
                  step="0.5"
                  value={orbitX}
                  onChange={(e) => setOrbitX(parseFloat(e.target.value))}
                  className="w-full accent-cyan-400"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1 text-slate-400">
                  <span>Yaw (Orbit Y)</span>
                  <span className="font-mono text-cyan-300">{orbitY.toFixed(1)}°</span>
                </div>
                <input
                  type="range"
                  min="-60"
                  max="60"
                  step="0.5"
                  value={orbitY}
                  onChange={(e) => setOrbitY(parseFloat(e.target.value))}
                  className="w-full accent-cyan-400"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1 text-slate-400">
                  <span>Parallax Depth Scale</span>
                  <span className="font-mono text-cyan-300">{depthScale.toFixed(2)}x</span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="2.5"
                  step="0.05"
                  value={depthScale}
                  onChange={(e) => setDepthScale(parseFloat(e.target.value))}
                  className="w-full accent-cyan-400"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Volumetric Layer Hierarchy & Lighting */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Depth Slices Inspector */}
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 flex flex-col gap-3">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-200">
              <span className="flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-cyan-400" />
                Volumetric Layers ({manifest.layers.length})
              </span>
              <span className="text-[11px] font-mono text-slate-500">Z-ORDERED</span>
            </div>

            <div className="flex flex-col gap-2 max-h-[260px] overflow-y-auto pr-1">
              {manifest.layers.map((layer) => {
                const isSelected = layer.id === selectedLayerId;
                return (
                  <div
                    key={layer.id}
                    onClick={() => setSelectedLayerId(layer.id)}
                    className={`p-3 rounded-lg border text-xs cursor-pointer transition-colors ${
                      isSelected
                        ? 'border-cyan-500/80 bg-cyan-950/30 text-white'
                        : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between font-medium">
                      <span>{layer.name}</span>
                      <span className="font-mono text-[11px] text-cyan-300">
                        Z: {layer.depthZ > 0 ? `+${layer.depthZ}` : layer.depthZ}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500">
                      <span>Type: {layer.sourceType}</span>
                      <span>·</span>
                      <span>Parallax: {layer.parallaxMultiplier.toFixed(1)}x</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Layer Depth Slider for Selected Layer */}
            {selectedLayerId && (
              <div className="mt-2 pt-3 border-t border-slate-800 flex flex-col gap-2 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Selected Layer Depth Z</span>
                  <span className="font-mono text-cyan-300">
                    {manifest.layers.find((l) => l.id === selectedLayerId)?.depthZ}
                  </span>
                </div>
                <input
                  type="range"
                  min="-80"
                  max="80"
                  value={manifest.layers.find((l) => l.id === selectedLayerId)?.depthZ || 0}
                  onChange={(e) => {
                    const newZ = parseInt(e.target.value, 10);
                    setManifest((prev) => ({
                      ...prev,
                      layers: prev.layers.map((l) =>
                        l.id === selectedLayerId ? { ...l, depthZ: newZ } : l
                      ),
                    }));
                  }}
                  className="w-full accent-cyan-400"
                />
              </div>
            )}
          </div>

          {/* Hologram Lighting & Specular Controls */}
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 flex flex-col gap-3">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-200">
              <span className="flex items-center gap-1.5">
                <Sun className="w-4 h-4 text-cyan-400" />
                Quantum Photonic Lighting
              </span>
              <span className="text-[11px] font-mono text-cyan-400">#00F2FE</span>
            </div>

            <div className="flex flex-col gap-3 text-xs">
              <div>
                <div className="flex justify-between mb-1 text-slate-400">
                  <span>Quantum Ambient Glow</span>
                  <span className="font-mono text-slate-300">
                    {(manifest.lighting.intensity * 100).toFixed(0)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2.0"
                  step="0.05"
                  value={manifest.lighting.intensity}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    setManifest((prev) => ({
                      ...prev,
                      lighting: { ...prev.lighting, intensity: val },
                    }));
                  }}
                  className="w-full accent-cyan-400"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1 text-slate-400">
                  <span>Specular Shimmer</span>
                  <span className="font-mono text-slate-300">
                    {(manifest.lighting.specularGlow * 100).toFixed(0)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.05"
                  value={manifest.lighting.specularGlow}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    setManifest((prev) => ({
                      ...prev,
                      lighting: { ...prev.lighting, specularGlow: val },
                    }));
                  }}
                  className="w-full accent-cyan-400"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
