/**
 * 06/11/2026 Hardware & Software Architecture Specifications
 * Next-Gen Blackwell B200/GB200 NVL72, TPU v6e Trillium, Distributed Actor Fabric
 */

export type HardwareArchitectureId =
  | 'nvidia-gb200-nvl72'
  | 'nvidia-b200-hgx'
  | 'google-tpu-v6e-trillium'
  | 'amd-instinct-mi325x'
  | 'apple-m4-max-edge-npu'
  | 'qualcomm-snapdragon-8-elite-npu';

export interface ComputeClusterProfile {
  id: HardwareArchitectureId;
  name: string;
  vendor: string;
  architectureGeneration: string;
  releaseDate: string; // 2026-11-06 standard
  computePrecision: 'FP4' | 'FP8' | 'BF16' | 'FP16' | 'FP32' | 'FP64';
  peakPFLOPS: number; // Dense / Tensor PFLOPS
  vramCapacityGB: number;
  memoryBandwidthTBps: number;
  interconnect: string;
  interconnectBandwidthTBps: number;
  thermalDesignPowerWatts: number;
  targetWorkload: string;
  features: string[];
}

export interface SoftwareArchitectureSpec {
  frameworkVersion: string; // 2026.11.06-stable
  distributedPattern: 'Decentralized Actor Swarm' | 'Parameter Server Sharded' | 'All-Reduce Ring v4';
  tensorEngine: 'Continuous Flow Matching v2' | 'Rectified Flow ODE' | 'Quantum-DiT TensorRT-LLM';
  inferencePrecision: 'FP4 Microscaled' | 'FP8 Hybrid' | 'BF16 Full Range';
  memoryAllocationStrategy: 'Zero-Redundancy Sharding (ZeRO-3)' | 'Unified Unified Virtual Memory' | 'NVLink C2C Direct DMA';
  temporalTimebaseResolution: string; // 120 GHz Native Sub-Frame BigInt
  epochResilienceVerified: boolean; // 2026-11-06 -> 2060-01-01 safe
  edgeOffloadCapable: boolean;
}

export interface ClusterComputeMetrics {
  totalNodes: number;
  aggregateVRAM_TB: number;
  aggregateBandwidth_TBps: number;
  aggregatePFLOPS_FP4: number;
  estimatedFramesPerSecond8K: number;
  powerConsumptionKW: number;
}
