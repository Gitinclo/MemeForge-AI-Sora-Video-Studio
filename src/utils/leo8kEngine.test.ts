import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateSpacetimePatchTokens,
  getCascadedPipelineStages,
  calculate8kMasterMetrics,
  synthesizeVlmDenseCaption,
  OPEN_SOURCE_BENCHMARKS,
  getPyTorchCascadedPipelineCode,
  getInfrastructureStackConfig,
} from './leo8kEngine.js';

test('calculateSpacetimePatchTokens: correctly calculates tokens for 1080p and 8K', () => {
  // 1920x1080 with 8x8 spatial patch and 4-frame temporal patch at 60fps
  const tokens1080p = calculateSpacetimePatchTokens(1920, 1080, 60, 4, 8);
  assert.equal(tokens1080p.temporalPatchSize, 4);
  assert.equal(tokens1080p.heightPatchSize, 8);
  assert.equal(tokens1080p.widthPatchSize, 8);
  assert.equal(tokens1080p.totalTokensPerFrame, 135 * 240); // 32,400 tokens per frame
  assert.equal(tokens1080p.tokensPerSecond, 32400 * 15); // 486,000 tokens/sec

  // 8K 7680x4320
  const tokens8k = calculateSpacetimePatchTokens(7680, 4320, 60, 4, 8);
  assert.equal(tokens8k.totalTokensPerFrame, 540 * 960); // 518,400 tokens per frame
});

test('getCascadedPipelineStages: returns all 3 distinct stages with correct resolutions', () => {
  const stages = getCascadedPipelineStages();
  assert.equal(stages.length, 3);

  // Stage 1: Base DiT (1080p)
  assert.equal(stages[0].stageId, 'stage1_base');
  assert.equal(stages[0].outputResolution, '1080p FHD (1920×1080)');
  assert.equal(stages[0].nativeWidth, 1920);
  assert.equal(stages[0].nativeHeight, 1080);
  assert.ok(stages[0].technique.includes('Spacetime Patches'));

  // Stage 2: Upscaler A (4K)
  assert.equal(stages[1].stageId, 'stage2_upscaler_a');
  assert.equal(stages[1].outputResolution, '4K Ultra (3840×2160)');
  assert.equal(stages[1].nativeWidth, 3840);
  assert.equal(stages[1].nativeHeight, 2160);
  assert.ok(stages[1].technique.includes('Noise Augmentation'));

  // Stage 3: Upscaler B (8K)
  assert.equal(stages[2].stageId, 'stage3_upscaler_b');
  assert.equal(stages[2].outputResolution, '8K Cinema Master (7680×4320)');
  assert.equal(stages[2].nativeWidth, 7680);
  assert.equal(stages[2].nativeHeight, 4320);
  assert.ok(stages[2].megapixelsPerFrame > 33);
  assert.ok(stages[2].technique.includes('Temporal'));
});

test('calculate8kMasterMetrics: verifies 33.18 MP per frame and storage calculation', () => {
  const metrics = calculate8kMasterMetrics(1, 60); // 1 hour at 60 fps
  assert.equal(metrics.totalFrames, 3600 * 60);
  assert.ok(metrics.megapixelsPerFrame > 33.1);
  assert.ok(metrics.totalGigapixels > 7000); // 7,000+ gigapixels per hour!
  assert.ok(metrics.estimatedStorageGb > 50); // High quality AV1/ProRes master
});

test('synthesizeVlmDenseCaption: enhances basic prompt with camera optics and lighting specs', () => {
  const raw = 'A cyberpunk hovercraft in rain';
  const enhanced = synthesizeVlmDenseCaption(raw);
  assert.ok(enhanced.includes(raw));
  assert.ok(enhanced.includes('ARRI Alexa 65'));
  assert.ok(enhanced.includes('volumetric'));
  assert.ok(enhanced.includes('subsurface scattering'));
});

test('OPEN_SOURCE_BENCHMARKS: compares LEO 8K against Open-Sora, Latte, and SVD', () => {
  const modelNames = OPEN_SOURCE_BENCHMARKS.map((m) => m.name);
  assert.ok(modelNames.includes('LEO 8K Cascaded DiT'));
  assert.ok(modelNames.some((n) => n.includes('Open-Sora')));
  assert.ok(modelNames.some((n) => n.includes('Latte')));
  assert.ok(modelNames.some((n) => n.includes('Stable Video Diffusion')));

  const leo = OPEN_SOURCE_BENCHMARKS.find((m) => m.name === 'LEO 8K Cascaded DiT')!;
  assert.equal(leo.maxResolution, '8K Master (7680×4320)');
  assert.equal(leo.flowMatching, true);
  assert.equal(leo.spacetimePatches, true);
  assert.equal(leo.temporalConsistencyScore, 99);
});

test('getPyTorchCascadedPipelineCode: outputs clean Python pipeline with 3D VAE and Flow Matching', () => {
  const code = getPyTorchCascadedPipelineCode();
  assert.ok(code.includes('class Leo8kCascadedPipeline'));
  assert.ok(code.includes('vae_3d'));
  assert.ok(code.includes('base_dit'));
  assert.ok(code.includes('upscaler_4k'));
  assert.ok(code.includes('upscaler_8k'));
  assert.ok(code.includes('FlowMatchEulerDiscreteScheduler'));
});

test('getInfrastructureStackConfig: contains H100/B200, FSDP, TensorRT-LLM and Celery/Redis', () => {
  const yaml = getInfrastructureStackConfig();
  assert.ok(yaml.includes('H100'));
  assert.ok(yaml.includes('FSDP'));
  assert.ok(yaml.includes('TensorRT-LLM'));
  assert.ok(yaml.includes('Celery'));
  assert.ok(yaml.includes('Redis'));
});
