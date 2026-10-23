import test from 'node:test';
import assert from 'node:assert/strict';
import {
  TICKS_PER_SECOND_64,
  CINEMA_RESOLUTIONS,
  CINEMA_FRAME_RATES,
  AUDIO_SAMPLE_RATES,
  calculateUltraComputeMetrics,
  ticksToTimecode64,
  timecodeToTicks64,
  getProxyDimensions,
  getBytesPerPixel,
} from './cinemaEngine.ts';

test('32K resolution (32000x32000) produces 1.024 Gigapixels with correct VRAM math', () => {
  const r32k = CINEMA_RESOLUTIONS.find((r) => r.id === '32K Ultra Master');
  assert.ok(r32k);
  assert.equal(r32k.width, 32000);
  assert.equal(r32k.height, 32000);
  assert.equal(r32k.pixelCount, 1_024_000_000);
  assert.equal(r32k.megapixels, 1024);

  // Uncompressed 32-bit float frame size: 1,024,000,000 * 16 bytes = 16,384,000,000 bytes (~15.25 GiB / 16.38 GB)
  const metrics = calculateUltraComputeMetrics(32000, 32000, 1000, '32-bit Float');
  assert.equal(metrics.megapixels, 1024);
  assert.equal(metrics.gigapixels, 1.024);
  assert.equal(metrics.recommendedProxy, '1/16 Super Proxy');
  assert.ok(metrics.throughputGbps > 100_000); // Massive bandwidth requirement
});

test('1000 FPS High Frame Rate Engine operates with 64-bit frame accuracy', () => {
  assert.ok(CINEMA_FRAME_RATES.includes(1000));
  assert.ok(CINEMA_FRAME_RATES.includes(240));
  assert.ok(CINEMA_FRAME_RATES.includes(480));
  assert.ok(CINEMA_FRAME_RATES.includes(960));

  // Ticks per frame at 1000 FPS
  const ticksPerFrame1000 = TICKS_PER_SECOND_64 / 1000n;
  assert.equal(ticksPerFrame1000, 120_000_000n);

  // Timecode at frame 0, frame 500, frame 999
  const tc0 = ticksToTimecode64(0n, 1000);
  assert.equal(tc0, '00:00:00:000');

  const tc500 = ticksToTimecode64(500n * ticksPerFrame1000, 1000);
  assert.equal(tc500, '00:00:00:500');

  // Timecode after exactly 1 second (1000 frames)
  const tc1000 = ticksToTimecode64(1000n * ticksPerFrame1000, 1000);
  assert.equal(tc1000, '00:00:01:000');
});

test('Professional Audio Engine includes 192 kHz sample rate and high fidelity tiers', () => {
  assert.ok(AUDIO_SAMPLE_RATES.includes(192000));
  assert.ok(AUDIO_SAMPLE_RATES.includes(96000));
  assert.ok(AUDIO_SAMPLE_RATES.includes(48000));
  assert.ok(AUDIO_SAMPLE_RATES.includes(44100));
});

test('Proxy quality downscales 32K cleanly for real-time editing on consumer hardware', () => {
  // 1/16 Super Proxy of 32000x32000 = 2000x2000
  const p16 = getProxyDimensions(32000, 32000, '1/16 Super Proxy');
  assert.equal(p16.width, 2000);
  assert.equal(p16.height, 2000);

  // 1/8 Proxy of 32000x32000 = 4000x4000
  const p8 = getProxyDimensions(32000, 32000, '1/8 Proxy');
  assert.equal(p8.width, 4000);
  assert.equal(p8.height, 4000);
});

test('Color bit depth byte multipliers calculate correct memory footprint', () => {
  assert.equal(getBytesPerPixel('8-bit Integer'), 4);
  assert.equal(getBytesPerPixel('16-bit Half-Float'), 8);
  assert.equal(getBytesPerPixel('32-bit Float'), 16);
  assert.equal(getBytesPerPixel('64-bit Float Master'), 32);
});
