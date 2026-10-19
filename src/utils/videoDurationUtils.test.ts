import test from 'node:test';
import assert from 'node:assert/strict';
import {
  MAX_VIDEO_DURATION_HOURS,
  MIN_VIDEO_DURATION_HOURS,
  DURATION_PRESETS,
  clampVideoDuration,
  formatTimecode,
  formatDurationLabel,
  calculateVideoComputeMetrics,
} from './videoDurationUtils.ts';

test('MAX_VIDEO_DURATION_HOURS is strictly 100 hours', () => {
  assert.equal(MAX_VIDEO_DURATION_HOURS, 100);
});

test('clampVideoDuration clamps values above 100 hours down to 100', () => {
  assert.equal(clampVideoDuration(100), 100);
  assert.equal(clampVideoDuration(150), 100);
  assert.equal(clampVideoDuration(1000), 100);
  assert.equal(clampVideoDuration(24), 24);
  assert.equal(clampVideoDuration(0.5), 0.5);
  assert.equal(clampVideoDuration(-10), MIN_VIDEO_DURATION_HOURS);
});

test('DURATION_PRESETS includes 100 hours max preset with MAX ULTRA badge', () => {
  const maxPreset = DURATION_PRESETS.find((p) => p.id === '100h');
  assert.ok(maxPreset, '100h preset must exist');
  assert.equal(maxPreset?.hours, 100);
  assert.equal(maxPreset?.badge, 'MAX ULTRA');
});

test('formatTimecode properly formats 100 hours and lower intervals', () => {
  // 100 hours = 360,000 seconds
  assert.equal(formatTimecode(360000), '100:00:00.0');

  // 24 hours = 86,400 seconds
  assert.equal(formatTimecode(86400), '24:00:00.0');

  // 1 hour, 23 minutes, 45.6 seconds = 3600 + 1380 + 45.6 = 5025.6
  assert.equal(formatTimecode(5025.6), '01:23:45.6');

  // 10 seconds
  assert.equal(formatTimecode(10.5), '00:00:10.5');
});

test('formatDurationLabel displays correct labels up to 100 hours max', () => {
  assert.equal(formatDurationLabel(100), '100 Hours (Max Limit)');
  assert.equal(formatDurationLabel(120), '100 Hours (Max Limit)');
  assert.equal(formatDurationLabel(24), '24 Hours');
  assert.equal(formatDurationLabel(1.5), '1h 30m');
  assert.equal(formatDurationLabel(1), '1 Hours');
  assert.equal(formatDurationLabel(0.5), '30 min');
});

test('calculateVideoComputeMetrics calculates 100 hours at 60fps accurately', () => {
  const metrics = calculateVideoComputeMetrics(100, 60, '4K Ultra');
  assert.equal(metrics.validHours, 100);
  assert.equal(metrics.totalSeconds, 360000);
  // 360,000s * 60fps = 21,600,000 frames!
  assert.equal(metrics.totalFrames, 21600000);
  assert.equal(metrics.clusterCount, 4);
  assert.equal(metrics.hoursPerCluster, 25);
  assert.equal(metrics.framesPerCluster, 5400000);
  assert.equal(metrics.isMaxDuration, true);
  assert.ok(metrics.estimatedStorageGb > 500);
});
