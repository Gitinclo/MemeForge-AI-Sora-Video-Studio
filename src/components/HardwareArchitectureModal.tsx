import React, { useState } from 'react';
import {
  HardwareArchitectureId,
  ComputeClusterProfile,
} from '../types/hardwareArchitect2026';
import {
  HARDWARE_ARCHITECTURES_2026,
  SOFTWARE_ARCHITECTURE_2026_STANDARD,
  calculateClusterScaling,
  verifySoftwareArchitectureCompliance,
} from '../utils/hardwareArchitect2026';
import {
  Cpu,
  Server,
  Zap,
  Activity,
  CheckCircle2,
  Sliders,
  ShieldCheck,
  X,
  Gauge,
  Flame,
  Layers,
  Terminal,
} from 'lucide-react';

interface HardwareArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HardwareArchitectureModal: React.FC<HardwareArchitectureModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedArchId, setSelectedArchId] = useState<HardwareArchitectureId>('nvidia-gb200-nvl72');
  const [nodeCount, setNodeCount] = useState<number>(1);

  if (!isOpen) return null;

  const activeArch =
    HARDWARE_ARCHITECTURES_2026.find((a) => a.id === selectedArchId) ||
    HARDWARE_ARCHITECTURES_2026[0];

  const clusterMetrics = calculateClusterScaling(selectedArchId, nodeCount);
  const compliance = verifySoftwareArchitectureCompliance(SOFTWARE_ARCHITECTURE_2026_STANDARD);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl rounded-2xl border border-slate-800 bg-[#080C14] shadow-2xl text-slate-100 overflow-hidden my-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800/80 bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-purple-600 flex items-center justify-center text-slate-950 shadow-md shadow-cyan-500/20">
              <Cpu className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-tight">
                  06/11/2026 Hardware & Software Architecture Standard
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/80 uppercase">
                  2026-11-06 Standard
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Blackwell Ultra B200 / GB200 NVL72, TPU v6e Trillium & Continuous Flow Matching v2.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 flex flex-col gap-6 max-h-[80vh] overflow-y-auto">
          {/* Architecture Cluster Selector */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-2 font-mono">
              SELECT COMPUTE ARCHITECTURE ACCELERATOR (06/11/2026 SOTA)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {HARDWARE_ARCHITECTURES_2026.map((arch) => {
                const isSelected = arch.id === selectedArchId;
                return (
                  <div
                    key={arch.id}
                    onClick={() => setSelectedArchId(arch.id)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-cyan-500 bg-cyan-950/30 shadow-md shadow-cyan-500/10'
                        : 'border-slate-800/80 bg-slate-900/40 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-semibold text-xs text-white line-clamp-1">
                        {arch.name}
                      </span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />}
                    </div>
                    <div className="text-[11px] text-slate-400 mb-2 line-clamp-1">
                      {arch.architectureGeneration}
                    </div>
                    <div className="flex items-center justify-between text-[10px] font-mono border-t border-slate-800/80 pt-1.5 text-slate-500">
                      <span>{arch.computePrecision}</span>
                      <span className="text-cyan-400 font-semibold">{arch.peakPFLOPS} PFLOPS</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active Hardware Profile Card */}
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/30 flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
              <div>
                <div className="text-xs font-mono text-cyan-400">{activeArch.vendor}</div>
                <div className="text-lg font-bold text-white">{activeArch.name}</div>
                <div className="text-xs text-slate-400">{activeArch.targetWorkload}</div>
              </div>
              <div className="text-right">
                <span className="text-[11px] font-mono px-2 py-1 rounded bg-slate-950 border border-slate-800 text-emerald-400">
                  RELEASE: {activeArch.releaseDate}
                </span>
              </div>
            </div>

            {/* Spec KPIs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80">
                <div className="text-slate-500 text-[10px]">Peak Precision</div>
                <div className="text-cyan-300 font-bold text-sm">{activeArch.computePrecision} ({activeArch.peakPFLOPS} PFLOPS)</div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80">
                <div className="text-slate-500 text-[10px]">VRAM Capacity</div>
                <div className="text-white font-bold text-sm">{(activeArch.vramCapacityGB / 1024).toFixed(1)} TB HBM3e</div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80">
                <div className="text-slate-500 text-[10px]">Memory Bandwidth</div>
                <div className="text-white font-bold text-sm">{activeArch.memoryBandwidthTBps} TB/s</div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80">
                <div className="text-slate-500 text-[10px]">Thermal Design Power</div>
                <div className="text-amber-400 font-bold text-sm">{activeArch.thermalDesignPowerWatts / 1000} kW</div>
              </div>
            </div>

            {/* Architectural Highlights */}
            <div className="pt-2">
              <div className="text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Server className="w-3.5 h-3.5 text-cyan-400" />
                <span>Interconnect & Silicon Features</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-400">
                {activeArch.features.map((feat, fIdx) => (
                  <div key={fIdx} className="flex items-start gap-2">
                    <span className="text-cyan-400">›</span>
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Node Scaling Calculator */}
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 flex flex-col gap-3">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-200">
              <span className="flex items-center gap-1.5">
                <Gauge className="w-4 h-4 text-cyan-400" />
                Cluster Node Scaling Simulator (1 to 64 Racks/Nodes)
              </span>
              <span className="font-mono text-cyan-300 font-bold">
                {nodeCount} {nodeCount === 1 ? 'Node' : 'Nodes'} Active
              </span>
            </div>

            <input
              type="range"
              min="1"
              max="64"
              value={nodeCount}
              onChange={(e) => setNodeCount(parseInt(e.target.value, 10))}
              className="w-full accent-cyan-400 cursor-pointer"
            />

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono pt-1">
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-center">
                <div className="text-slate-500 text-[10px]">Aggregate VRAM</div>
                <div className="text-cyan-300 font-bold">{clusterMetrics.aggregateVRAM_TB} TB</div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-center">
                <div className="text-slate-500 text-[10px]">Aggregate Throughput</div>
                <div className="text-white font-bold">{clusterMetrics.aggregateBandwidth_TBps.toLocaleString()} TB/s</div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-center">
                <div className="text-slate-500 text-[10px]">Compute Density</div>
                <div className="text-emerald-400 font-bold">{clusterMetrics.aggregatePFLOPS_FP4.toLocaleString()} PFLOPS</div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-center">
                <div className="text-slate-500 text-[10px]">8K Frame Throughput</div>
                <div className="text-amber-300 font-bold">~{clusterMetrics.estimatedFramesPerSecond8K} FPS</div>
              </div>
            </div>
          </div>

          {/* Software Architecture Baseline Certification */}
          <div className="p-4 rounded-xl border border-emerald-500/40 bg-emerald-950/20 flex flex-col gap-3">
            <div className="flex items-center justify-between text-xs font-semibold text-emerald-300">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                06/11/2026 Software Architecture Standard Certification
              </span>
              <span className="font-mono text-emerald-400 font-bold">100% COMPLIANT</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
              {compliance.standardsPassed.map((std, sIdx) => (
                <div key={sIdx} className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{std}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-2 text-[11px] font-mono text-slate-400 border-t border-emerald-900/60 pt-2">
              <span>Framework: {SOFTWARE_ARCHITECTURE_2026_STANDARD.frameworkVersion}</span>
              <span>·</span>
              <span>Pattern: {SOFTWARE_ARCHITECTURE_2026_STANDARD.distributedPattern}</span>
              <span>·</span>
              <span>Timebase: {SOFTWARE_ARCHITECTURE_2026_STANDARD.temporalTimebaseResolution}</span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-slate-800/80 bg-slate-900/60 text-xs">
          <span className="text-slate-400 font-mono">
            Date Standard: 06/11/2026 · Native 64-Bit Resilient
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-colors cursor-pointer"
          >
            Acknowledge 06/11/2026 Architecture
          </button>
        </div>
      </div>
    </div>
  );
};
