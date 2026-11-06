import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  createDefaultHologramManifest,
  convert2DLayersToHologram,
  calculateParallaxOffset,
  exportHologramJson,
} from './hologramSpatialEngine';

describe('hologramSpatialEngine', () => {
  it('creates a valid default 2060 hologram manifest', () => {
    const manifest = createDefaultHologramManifest('scene_test', 'Test Hologram');
    assert.strictEqual(manifest.version, '2060.1-holo');
    assert.strictEqual(manifest.dimensions.depthSlices, 32);
    assert.strictEqual(manifest.layers.length, 3);
    assert.strictEqual(manifest.lighting.quantumAmbient, '#00F2FE');
  });

  it('converts 2D text layers into depth-stratified 3D holographic layers', () => {
    const layers = convert2DLayersToHologram([
      {
        id: 'top',
        text: 'WHEN 2060 ARRIVES',
        x: 50,
        y: 10,
        fontSize: 32,
        fontFamily: 'Impact',
        textColor: '#fff',
        outlineColor: '#000',
        outlineWidth: 2,
        backgroundColor: 'transparent',
        textAlign: 'center',
        isUppercase: true,
        isBold: true,
        shadow: false,
        rotation: 0,
      },
      {
        id: 'bot',
        text: 'FUTURE PROOF FOREVER',
        x: 50,
        y: 90,
        fontSize: 32,
        fontFamily: 'Impact',
        textColor: '#fff',
        outlineColor: '#000',
        outlineWidth: 2,
        backgroundColor: 'transparent',
        textAlign: 'center',
        isUppercase: true,
        isBold: true,
        shadow: false,
        rotation: 0,
      },
    ]);

    assert.strictEqual(layers.length, 3);
    // Background layer
    assert.strictEqual(layers[0].depthZ, -50);
    // Top text has positive depth
    assert.strictEqual(layers[1].depthZ >= 25, true);
    // Bottom text has higher depth
    assert.strictEqual(layers[2].depthZ >= 45, true);
  });

  it('calculates parallax offsets based on camera orbit and depth', () => {
    const p1 = calculateParallaxOffset(50, 10, 20); // front element
    const p2 = calculateParallaxOffset(-50, 10, 20); // back element
    // Front element moves opposite to back element
    assert.strictEqual(Math.sign(p1.offsetX), -Math.sign(p2.offsetX));
    assert.strictEqual(p1.scale > 1.0, true);
    assert.strictEqual(p2.scale < 1.0, true);
  });

  it('exports valid JSON string format', () => {
    const manifest = createDefaultHologramManifest();
    const json = exportHologramJson(manifest);
    const parsed = JSON.parse(json);
    assert.strictEqual(parsed.version, '2060.1-holo');
  });
});
