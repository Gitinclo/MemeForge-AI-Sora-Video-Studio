import { SpatialHologramManifest, HologramLayer } from '../types/future2060';
import { TextLayer } from '../types/meme';

/**
 * 2060 Hologram Spatial Engine
 * Handles depth-slicing, 6-axis camera transformations,
 * and volumetric hologram exports (.holo JSON, stereoscopic SBS).
 */

export function createDefaultHologramManifest(
  sceneId = `holo_${Date.now()}`,
  title = '2060 Spatial Master'
): SpatialHologramManifest {
  const now = Date.now();
  return {
    version: '2060.1-holo',
    sceneId,
    timestampEpochMs: now,
    isoTimestamp: new Date(now).toISOString(),
    dimensions: {
      width: 1920,
      height: 1080,
      depthSlices: 32,
    },
    camera: {
      orbitX: 0,
      orbitY: 0,
      distance: 600,
      fov: 65,
      focalDepth: 0,
    },
    layers: [
      {
        id: 'layer_back_grid',
        name: 'Quantum Lightfield Horizon',
        depthZ: -60,
        parallaxMultiplier: 0.3,
        rotationEuler: [0, 0, 0],
        opacity: 0.85,
        lightResponse: 'emissive',
        sourceType: 'point-cloud',
        content: 'quantum-grid',
      },
      {
        id: 'layer_subject',
        name: 'Primary Subject Volume',
        depthZ: 0,
        parallaxMultiplier: 1.0,
        rotationEuler: [0, 0, 0],
        opacity: 1.0,
        lightResponse: 'diffuse',
        sourceType: 'image',
        content: title,
      },
      {
        id: 'layer_foreground_text',
        name: 'Holographic Kinetic HUD',
        depthZ: 40,
        parallaxMultiplier: 1.6,
        rotationEuler: [0, 0, 0],
        opacity: 0.95,
        lightResponse: 'quantum-specular',
        sourceType: 'text',
        content: '2060 QUANTUM VOLUMETRIC HUD',
      },
    ],
    lighting: {
      quantumAmbient: '#00F2FE',
      directionalVector: [0.5, -1.0, 0.8],
      intensity: 1.25,
      specularGlow: 0.8,
    },
  };
}

/**
 * Converts 2D text layers into depth-stratified 3D holographic layers
 */
export function convert2DLayersToHologram(
  textLayers: TextLayer[],
  backgroundTitle = 'Meme Volume'
): HologramLayer[] {
  const result: HologramLayer[] = [
    {
      id: 'holo_bg',
      name: 'Background Substrate',
      depthZ: -50,
      parallaxMultiplier: 0.4,
      rotationEuler: [0, 0, 0],
      opacity: 0.9,
      lightResponse: 'diffuse',
      sourceType: 'image',
      content: backgroundTitle,
    },
  ];

  textLayers.forEach((tl, idx) => {
    // Top text sits slightly forward (+25), bottom text sits further forward (+50)
    const isTop = tl.y < 50;
    const depthZ = isTop ? 25 + idx * 5 : 45 + idx * 5;

    result.push({
      id: `holo_text_${tl.id}`,
      name: `HUD: ${tl.text.slice(0, 16) || 'Layer'}`,
      depthZ,
      parallaxMultiplier: 1.0 + (depthZ / 50),
      rotationEuler: [0, 0, tl.rotation || 0],
      opacity: 1.0,
      lightResponse: 'quantum-specular',
      sourceType: 'text',
      content: tl.text,
    });
  });

  return result;
}

/**
 * Calculates parallax offsets in pixels for a given depth level and camera orbit
 */
export function calculateParallaxOffset(
  depthZ: number,
  orbitX: number,
  orbitY: number,
  intensity = 1.0
): { offsetX: number; offsetY: number; scale: number } {
  // Negative depth moves slightly with camera; positive depth moves opposite
  const normalizedDepth = depthZ / 100; // -1.0 to 1.0
  const offsetX = -orbitY * normalizedDepth * 1.5 * intensity;
  const offsetY = orbitX * normalizedDepth * 1.2 * intensity;
  // Perspective scaling: closer elements are slightly larger
  const scale = 1.0 + normalizedDepth * 0.15;

  return { offsetX, offsetY, scale };
}

/**
 * Generates downloadable .holo JSON file string
 */
export function exportHologramJson(manifest: SpatialHologramManifest): string {
  return JSON.stringify(manifest, null, 2);
}
