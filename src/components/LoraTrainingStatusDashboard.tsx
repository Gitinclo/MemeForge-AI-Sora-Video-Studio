import React, { useState, useEffect } from 'react';
import {
  Activity,
  Cpu,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Play,
  Pause,
  RefreshCw,
  XCircle,
  Plus,
  ExternalLink,
  Layers,
  Sparkles,
  Zap,
  Filter,
  Check,
  Download,
  Flame,
  Search,
} from 'lucide-react';
import {
  LoraTrainingJobState,
  GpuUtilizationTelemetry,
  ProductLoraModel,
} from '../types/b2bEnterprise';
import {
  DEFAULT_GPU_CLUSTER_NODES,
  INITIAL_LORA_TRAINING_JOBS,
  formatRemainingTime,
  advanceTrainingJob,
} from '../utils/b2bEnterpriseEngine';

interface LoraTrainingStatusDashboardProps {
  onOpenModelBuilder?: () => void;
  onOpenModelSandbox?: (modelId?: string) => void;
  onModelTrained?: (model: ProductLoraModel) => void;
}

export const LoraTrainingStatusDashboard: React.FC<LoraTrainingStatusDashboardProps> = ({
  onOpenModelBuilder,
  onOpenModelSandbox,
  onModelTrained,
}) => {
  const [jobs, setJobs] = useState<LoraTrainingJobState[]>(INITIAL_LORA_TRAINING_JOBS);
  const [gpuNodes, setGpuNodes] = useState<GpuUtilizationTelemetry[]>(DEFAULT_GPU_CLUSTER_NODES);
  const [filterPhase, setFilterPhase] = useState<'all' | 'active' | 'completed'>('all');
  const [selectedJobId, setSelectedJobId] = useState<string>(INITIAL_LORA_TRAINING_JOBS[0].jobId);
  const [isSimulatingLiveTelemetry, setIsSimulatingLiveTelemetry] = useState(true);

  // Live telemetry & step advancement interval
  useEffect(() => {
    if (!isSimulatingLiveTelemetry) return;

    const interval = setInterval(() => {
      // 1. Advance active training jobs
      setJobs((prevJobs) =>
        prevJobs.map((job) => {
          if (job.phase === 'completed' || job.phase === 'failed') return job;
          const updated = advanceTrainingJob(job, 35);
          if (updated.phase === 'completed') {
            if (onModelTrained) {
              onModelTrained({
                id: updated.jobId,
                name: updated.productName,
                category: updated.category,
                triggerToken: updated.triggerToken,
                baseModel: updated.baseModel,
                rank: updated.rank,
                trainingSteps: updated.targetSteps,
                lossCurve: updated.lossHistory,
                sampleImage:
                  updated.category === 'apparel_footwear'
                    ? '/src/assets/images/b2b_sneaker_commercial_1793008333912.jpg'
                    : '/src/assets/images/b2b_product_perfume_bottle_1793008331955.jpg',
                preservationMetrics: {
                  logoFidelityPct: updated.preservationScores?.logoFidelityPct || 99.4,
                  geometryIoUPct: updated.preservationScores?.geometryIoUPct || 98.7,
                  textSharpnessScore: updated.preservationScores?.textSharpnessScore || 9.8,
                },
                checkpointSizeMb: updated.checkpointSizeMb,
                status: 'ready',
                description: `Live LoRA model fine-tuned on ${updated.targetSteps} steps with ControlNet geometry locking.`,
              });
            }
          }
          return updated;
        })
      );

      // 2. Subtle GPU telemetry jitter (realistic physical fluctuations)
      setGpuNodes((prevNodes) =>
        prevNodes.map((node) => {
          const utilDelta = (Math.random() * 1.6 - 0.8);
          const newUtil = Number(Math.min(99.8, Math.max(30.0, node.computeUtilizationPct + utilDelta)).toFixed(1));
          const vramDelta = (Math.random() * 0.4 - 0.2);
          const newVram = Number(Math.min(node.vramTotalGb * 0.95, Math.max(20.0, node.vramUsedGb + vramDelta)).toFixed(1));
          const pwrDelta = Math.round(Math.random() * 10 - 5);
          const newPwr = Math.min(node.powerLimitWatts * 0.92, Math.max(200, node.powerWatts + pwrDelta));

          return {
            ...node,
            computeUtilizationPct: newUtil,
            vramUsedGb: newVram,
            powerWatts: newPwr,
          };
        })
      );
    }, 1200);

    return () => clearInterval(interval);
  }, [isSimulatingLiveTelemetry, onModelTrained]);

  // Selected job
  const activeJob = jobs.find((j) => j.jobId === selectedJobId) || jobs[0];

  // Pause / Resume a job
  const handleToggleJobPause = (jobId: string) => {
    setJobs((prev) =>
      prev.map((j) => {
        if (j.jobId === jobId) {
          const isPaused = j.logs.some((l) => l.includes('[PAUSED]'));
          const logMsg = isPaused
            ? `[${new Date().toLocaleTimeString()}] Resumed training pipeline on H100 GPU cluster`
            : `[${new Date().toLocaleTimeString()}] [PAUSED] GPU worker held in checkpoint standby`;
          return {
            ...j,
            logs: [...j.logs, logMsg],
          };
        }
        return j;
      })
    );
  };

  // Abort / Cancel a job
  const handleAbortJob = (jobId: string) => {
    setJobs((prev) =>
      prev.map((j) => {
        if (j.jobId === jobId) {
          return {
            ...j,
            phase: 'failed',
            logs: [...j.logs, `[${new Date().toLocaleTimeString()}] [ABORTED] Job cancelled by administrator. GPU memory deallocated.`],
          };
        }
        return j;
      })
    );
  };

  const filteredJobs = jobs.filter((j) => {
    if (filterPhase === 'active') return j.phase !== 'completed' && j.phase !== 'failed';
    if (filterPhase === 'completed') return j.phase === 'completed';
    return true;
  });

  // Calculate cluster summary metrics
  const avgComputeUtil = Number(
    (gpuNodes.reduce((acc, n) => acc + n.computeUtilizationPct, 0) / gpuNodes.length).toFixed(1)
  );
  const totalVramUsed = Number(gpuNodes.reduce((acc, n) => acc + n.vramUsedGb, 0).toFixed(1));
  const totalVramCap = gpuNodes.reduce((acc, n) => acc + n.vramTotalGb, 0);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <span>LEO Private Cluster</span>
            <span aria-hidden="true">/</span>
            <span>Dedicated GPU Orchestrator</span>
            <span aria-hidden="true">/</span>
            <span className="text-emerald-400">Slurm &amp; NVLink Active</span>
          </div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
            <span>LoRA Training Status &amp; GPU Telemetry</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/30">
              Live Cluster
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time multi-tenant GPU compute telemetry, active LoRA loss convergence curves, and estimated time remaining.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsSimulatingLiveTelemetry(!isSimulatingLiveTelemetry)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors flex items-center gap-1.5 ${
              isSimulatingLiveTelemetry
                ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                : 'bg-slate-800 border-slate-700 text-slate-400'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span>Telemetry: {isSimulatingLiveTelemetry ? 'Polling (1.2s)' : 'Paused'}</span>
          </button>

          {onOpenModelBuilder && (
            <button
              onClick={onOpenModelBuilder}
              className="px-3.5 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Trigger New Training Job</span>
            </button>
          )}

          {onOpenModelSandbox && (
            <button
              onClick={() => onOpenModelSandbox(activeJob.jobId)}
              className="px-3.5 py-1.5 text-xs font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 text-white rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Open Model Sandbox</span>
            </button>
          )}
        </div>
      </div>

      {/* GPU Cluster Telemetry Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Cluster Compute Load</span>
            <Cpu className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <div className="font-mono text-xl font-bold text-white tabular-nums">
            {avgComputeUtil}%
          </div>
          <div className="text-[10px] text-slate-500 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>4 Dedicated GPU Nodes Active</span>
          </div>
        </div>

        <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Total VRAM Allocated</span>
            <Zap className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div className="font-mono text-xl font-bold text-white tabular-nums">
            {totalVramUsed} <span className="text-xs text-slate-400">/ {totalVramCap} GB</span>
          </div>
          <div className="text-[10px] text-slate-500">
            {((totalVramUsed / totalVramCap) * 100).toFixed(1)}% HBM3 / HBM3e Memory in use
          </div>
        </div>

        <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Active LoRA Pipelines</span>
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="font-mono text-xl font-bold text-emerald-400 tabular-nums">
            {jobs.filter((j) => j.phase !== 'completed' && j.phase !== 'failed').length} Running
          </div>
          <div className="text-[10px] text-slate-500">
            {jobs.filter((j) => j.phase === 'completed').length} Completed · 0 Queued
          </div>
        </div>

        <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Interconnect &amp; Invariants</span>
            <Activity className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="font-mono text-xl font-bold text-amber-400 tabular-nums">
            3.2 TB/s
          </div>
          <div className="text-[10px] text-slate-500">
            NVLink 4.0 Bi-directional Bandwidth
          </div>
        </div>
      </div>

      {/* Main 2-Column Split: Active Jobs List (6 cols) & Selected Job Detailed Telemetry (6 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Column: Jobs Table & Filters (6 cols) */}
        <div className="lg:col-span-6 bg-slate-900 rounded-xl border border-slate-800 p-4 space-y-3 flex flex-col justify-between">
          <div className="space-y-3">
            {/* Filter segmented buttons */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-200">
                Active Training Pipelines ({filteredJobs.length})
              </span>

              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-[11px]">
                <button
                  onClick={() => setFilterPhase('all')}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    filterPhase === 'all' ? 'bg-slate-800 text-white font-medium' : 'text-slate-400'
                  }`}
                >
                  All ({jobs.length})
                </button>
                <button
                  onClick={() => setFilterPhase('active')}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    filterPhase === 'active' ? 'bg-slate-800 text-blue-400 font-medium' : 'text-slate-400'
                  }`}
                >
                  Active ({jobs.filter((j) => j.phase !== 'completed' && j.phase !== 'failed').length})
                </button>
                <button
                  onClick={() => setFilterPhase('completed')}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    filterPhase === 'completed' ? 'bg-slate-800 text-emerald-400 font-medium' : 'text-slate-400'
                  }`}
                >
                  Completed ({jobs.filter((j) => j.phase === 'completed').length})
                </button>
              </div>
            </div>

            {/* Jobs List */}
            <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
              {filteredJobs.map((job) => {
                const progressPct = Math.round((job.currentStep / job.targetSteps) * 100);
                const isSelected = selectedJobId === job.jobId;
                const isRunning = job.phase !== 'completed' && job.phase !== 'failed';

                return (
                  <div
                    key={job.jobId}
                    onClick={() => setSelectedJobId(job.jobId)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-blue-600/15 border-blue-500 shadow-sm'
                        : 'bg-slate-950/80 border-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-0.5 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white truncate">{job.productName}</span>
                          <span className="font-mono text-[10px] text-blue-400 shrink-0">{job.triggerToken}</span>
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                          <span>{job.brandName}</span>
                          <span>·</span>
                          <span className="font-mono">Rank {job.rank}</span>
                          <span>·</span>
                          <span className="font-mono">{job.targetSteps} steps</span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        {job.phase === 'completed' ? (
                          <span className="font-mono text-[11px] font-semibold text-emerald-400 flex items-center gap-1 justify-end">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Ready</span>
                          </span>
                        ) : job.phase === 'failed' ? (
                          <span className="font-mono text-[11px] font-semibold text-red-400 flex items-center gap-1 justify-end">
                            <XCircle className="w-3 h-3" />
                            <span>Aborted</span>
                          </span>
                        ) : (
                          <span className="font-mono text-[11px] font-semibold text-blue-400 flex items-center gap-1 justify-end">
                            <RefreshCw className="w-3 h-3 animate-spin" />
                            <span>{progressPct}%</span>
                          </span>
                        )}
                        <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                          {formatRemainingTime(job.estimatedRemainingSeconds)}
                        </div>
                      </div>
                    </div>

                    {/* Step Progress Bar */}
                    <div className="mt-2.5 w-full bg-slate-900 h-1.5 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className={`h-full transition-all duration-300 ${
                          job.phase === 'completed' ? 'bg-emerald-500' : 'bg-blue-500'
                        }`}
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono mt-1.5">
                      <span>Step {job.currentStep} / {job.targetSteps}</span>
                      <span>Loss: <strong className="text-slate-300">{job.currentLoss}</strong></span>
                      <span className="capitalize text-slate-400">{job.phase.replace(/_/g, ' ')}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
            <span>Air-Gapped Private VPC · SOC 2 Invariant Validated</span>
            <span>Zero Data Retention SLA</span>
          </div>
        </div>

        {/* Right Column: Detailed Job Telemetry & GPU Node Monitor (6 cols) */}
        <div className="lg:col-span-6 bg-slate-900 rounded-xl border border-slate-800 p-5 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-xs font-semibold text-slate-200">
                  Pipeline Telemetry: <strong className="text-white">{activeJob.productName}</strong>
                </span>
                <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                  Job ID: {activeJob.jobId} · Model: {activeJob.safetensorsFilename}
                </div>
              </div>

              {/* Action Buttons for active job */}
              <div className="flex items-center gap-1.5">
                {activeJob.phase !== 'completed' && activeJob.phase !== 'failed' && (
                  <>
                    <button
                      onClick={() => handleToggleJobPause(activeJob.jobId)}
                      className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 text-xs"
                      title="Pause / Resume job execution"
                    >
                      <Pause className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleAbortJob(activeJob.jobId)}
                      className="p-1.5 bg-slate-800 hover:bg-red-900/40 text-red-400 rounded border border-slate-700 text-xs"
                      title="Abort training job"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                    </button>
                  </>
                )}

                {activeJob.phase === 'completed' && onOpenModelSandbox && (
                  <button
                    onClick={() => onOpenModelSandbox(activeJob.jobId)}
                    className="px-2.5 py-1 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Test in Sandbox</span>
                  </button>
                )}
              </div>
            </div>

            {/* Telemetry Stats Grid */}
            <div className="grid grid-cols-3 gap-2.5">
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-center">
                <div className="text-[10px] text-slate-500 uppercase tracking-wider">Estimated Time</div>
                <div className="font-mono text-sm font-bold text-blue-400 tabular-nums mt-0.5">
                  {formatRemainingTime(activeJob.estimatedRemainingSeconds)}
                </div>
                <div className="text-[9px] text-slate-500 mt-0.5">Step {activeJob.currentStep}/{activeJob.targetSteps}</div>
              </div>

              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-center">
                <div className="text-[10px] text-slate-500 uppercase tracking-wider">Current Loss</div>
                <div className="font-mono text-sm font-bold text-emerald-400 tabular-nums mt-0.5">
                  {activeJob.currentLoss}
                </div>
                <div className="text-[9px] text-slate-500 mt-0.5">Cosine decay lr: {activeJob.learningRate}</div>
              </div>

              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-center">
                <div className="text-[10px] text-slate-500 uppercase tracking-wider">Checkpoint Size</div>
                <div className="font-mono text-sm font-bold text-purple-400 tabular-nums mt.05">
                  {activeJob.checkpointSizeMb} MB
                </div>
                <div className="text-[9px] text-slate-500 mt-0.5">Safetensors format</div>
              </div>
            </div>

            {/* Loss History Visual Graph */}
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-300">Loss Convergence Sparkline</span>
                <span className="font-mono text-[10px] text-slate-400">
                  {activeJob.lossHistory.length} checkpoints recorded
                </span>
              </div>

              <div className="h-20 flex items-end gap-1 px-1 pt-2">
                {activeJob.lossHistory.map((loss, idx) => {
                  const heightPct = Math.max(12, Math.min(100, Math.round((loss / 0.6) * 100)));
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center justify-end h-full group relative">
                      <div
                        className={`w-full rounded-t transition-all ${
                          idx === activeJob.lossHistory.length - 1 ? 'bg-emerald-400' : 'bg-blue-500/80 hover:bg-blue-400'
                        }`}
                        style={{ height: `${heightPct}%` }}
                      />
                      <span className="text-[8px] font-mono text-slate-600 mt-1">{idx}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* GPU Node Telemetry Breakdown */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                <span>GPU Cluster Node Allocation</span>
                <span className="font-mono text-[10px] text-emerald-400">LIQUID COOLED</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {gpuNodes.slice(0, 2).map((node) => (
                  <div key={node.nodeId} className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[11px] font-bold text-slate-200">{node.nodeId}</span>
                      <span className="font-mono text-[10px] text-emerald-400 font-semibold">{node.computeUtilizationPct}% Load</span>
                    </div>
                    <div className="text-[10px] text-slate-400 truncate">{node.gpuModel}</div>

                    <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className="bg-blue-500 h-full"
                        style={{ width: `${(node.vramUsedGb / node.vramTotalGb) * 100}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[9px] font-mono text-slate-400">
                      <span>VRAM: {node.vramUsedGb}/{node.vramTotalGb}GB</span>
                      <span>{node.powerWatts}W / {node.temperatureC}°C</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Console Log stream */}
            <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 font-mono text-[10px] text-slate-400 max-h-28 overflow-y-auto space-y-1">
              {activeJob.logs.map((log, i) => (
                <div key={i} className="leading-tight">
                  {log}
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500 font-mono">
            <span>Model Hash: SHA256-e910f4b3</span>
            <span>Checkpoint: {activeJob.safetensorsFilename}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
