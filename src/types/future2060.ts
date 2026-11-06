/**
 * 2060/01/01 Quantum-Temporal & Future-Proofing Type Definitions
 * 64-bit Epoch Resilient Architecture
 */

export interface SpatialHologramManifest {
  version: '2060.1-holo';
  sceneId: string;
  timestampEpochMs: number; // 64-bit safe timestamp (milliseconds)
  isoTimestamp: string; // ISO 8601 Extended Zulu
  dimensions: {
    width: number;
    height: number;
    depthSlices: number;
  };
  camera: {
    orbitX: number; // degrees
    orbitY: number; // degrees
    distance: number;
    fov: number;
    focalDepth: number;
  };
  layers: HologramLayer[];
  lighting: {
    quantumAmbient: string;
    directionalVector: [number, number, number];
    intensity: number;
    specularGlow: number;
  };
}

export interface HologramLayer {
  id: string;
  name: string;
  depthZ: number; // -100 to +100
  parallaxMultiplier: number;
  rotationEuler: [number, number, number];
  opacity: number;
  lightResponse: 'diffuse' | 'quantum-specular' | 'emissive';
  sourceType: 'text' | 'image' | 'video-slice' | 'point-cloud';
  content: string;
}

export type QuantumEngineModel =
  | 'q-dit-2060-ultra'
  | 'veo-quantum-7'
  | 'seedance-spacetime-3'
  | 'chrono-diffusion-alpha';

export interface QuantumVideoConfig {
  engine: QuantumEngineModel;
  temporalResolution: 'sub-picosecond' | 'continuous-flow' | 'discrete-60fps';
  spatialResolution: '4K-Spatial' | '8K-Master' | '16K-Omni';
  fps: number;
  durationSeconds: number;
  qubitLatticeCoherence: number; // 0 to 1.0
  odeSolver: 'euler' | 'rk4' | 'dormand-prince-5';
  spacetimePatches: [number, number, number]; // [T, H, W]
  audioHarmonics: boolean;
  prompt: string;
  cameraChoreography: '6-Axis Spline' | 'Director Orbit' | 'Quantum Warp' | 'Static Rig';
}

export type DirectorAgentRole = 'director' | 'cinematographer' | 'lighting' | 'audio';

export interface DirectorAgentProfile {
  role: DirectorAgentRole;
  name: string;
  specialty: string;
  avatarSeed: string;
  colorAccent: string;
}

export interface DirectorMessage {
  id: string;
  role: DirectorAgentRole;
  agentName: string;
  content: string;
  timestampEpochMs: number;
  suggestedAction?: {
    type: 'camera_orbit' | 'depth_shift' | 'lighting_shift' | 'render_quantum' | 'tempo_shift';
    description: string;
    params: Record<string, number | string | boolean>;
  };
}

export interface EpochDiagnosticResult {
  currentTestYear: number;
  simulatedIsoString: string;
  timestampEpochMs: number;
  is64BitCompliant: boolean;
  y2038Safe: boolean;
  y2060Safe: boolean;
  timeZoneStabilityScore: number; // 0 - 100
  leapSecondResilient: boolean;
  activeStorageVerification: {
    localStorage: boolean;
    cryptoLedger: boolean;
    subscriptionEngine: boolean;
    hologramManifests: boolean;
  };
  diagnosticsLog: string[];
}
