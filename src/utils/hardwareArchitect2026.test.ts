import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  HARDWARE_ARCHITECTURES_2026,
  SOFTWARE_ARCHITECTURE_2026_STANDARD,
  calculateClusterScaling,
  verifySoftwareArchitectureCompliance,
} from './hardwareArchitect2026';

describe('hardwareArchitect2026', () => {
  it('contains state-of-the-art 2026-11-06 hardware architectures including GB200 NVL72', () => {
    assert.strictEqual(HARDWARE_ARCHITECTURES_2026.length, 6);
    const gb200 = HARDWARE_ARCHITECTURES_2026.find((h) => h.id === 'nvidia-gb200-nvl72');
    assert.ok(gb200);
    assert.strictEqual(gb200?.releaseDate, '2026-11-06');
    assert.strictEqual(gb200?.peakPFLOPS, 1440);
    assert.strictEqual(gb200?.vramCapacityGB, 13824);
  });

  it('correctly calculates aggregate cluster compute scaling metrics for 4x GB200 racks', () => {
    const metrics = calculateClusterScaling('nvidia-gb200-nvl72', 4);
    assert.strictEqual(metrics.totalNodes, 4);
    assert.strictEqual(metrics.aggregateVRAM_TB, 54.0); // 13.5 TB * 4
    assert.strictEqual(metrics.aggregateBandwidth_TBps, 2304.0); // 576 * 4
    assert.strictEqual(metrics.aggregatePFLOPS_FP4, 5760.0); // 1440 * 4
    assert.strictEqual(metrics.powerConsumptionKW, 480.0); // 120 * 4
    assert.strictEqual(metrics.estimatedFramesPerSecond8K, 480);
  });

  it('validates 06/11/2026 software architecture baseline compliance with 100% score', () => {
    const compliance = verifySoftwareArchitectureCompliance(SOFTWARE_ARCHITECTURE_2026_STANDARD);
    assert.strictEqual(compliance.compliant, true);
    assert.strictEqual(compliance.score, 100);
    assert.strictEqual(compliance.standardsPassed.length, 5);
  });
});
