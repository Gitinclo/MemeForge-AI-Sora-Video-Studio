import test from 'node:test';
import assert from 'node:assert/strict';
import {
  VIDEO_ENGINES_2026,
  VEO3_VS_SEEDANCE_COMPARISON,
  getMagicHourMigrationSnippet,
  simulateMagicHourJob,
} from './engineMigration2026.js';

test('VIDEO_ENGINES_2026: contains all late-2026 post-Sora alternative models', () => {
  const ids = VIDEO_ENGINES_2026.map((e) => e.id);
  assert.ok(ids.includes('leo-8k'), 'Includes LEO 8K DiT Master');
  assert.ok(ids.includes('veo3'), 'Includes Veo3 AI');
  assert.ok(ids.includes('seedance'), 'Includes Seedance 1.0 (Hedra)');
  assert.ok(ids.includes('magic-hour'), 'Includes Magic Hour');
  assert.ok(ids.includes('oakgen'), 'Includes Oakgen');
  assert.ok(ids.includes('heygen'), 'Includes HeyGen');
  assert.ok(ids.includes('insmind'), 'Includes InsMind');
  assert.equal(VIDEO_ENGINES_2026.length, 7);
});

test('VIDEO_ENGINES_2026: categorizes models correctly by use case', () => {
  const cinematic = VIDEO_ENGINES_2026.filter((e) => e.category === 'Cinematic & 8K Video');
  const dev = VIDEO_ENGINES_2026.filter((e) => e.category === 'Developer & API Migration');
  const social = VIDEO_ENGINES_2026.filter((e) => e.category === 'Social Media & Marketing');

  assert.equal(cinematic.length, 3); // LEO 8K, Veo3, Seedance
  assert.equal(dev.length, 2); // Magic Hour, Oakgen
  assert.equal(social.length, 2); // HeyGen, InsMind
});

test('VEO3_VS_SEEDANCE_COMPARISON: contains complete pricing and motion comparisons', () => {
  const comp = VEO3_VS_SEEDANCE_COMPARISON;
  assert.equal(comp.engineA.name, 'Veo3 AI');
  assert.equal(comp.engineB.name, 'Seedance 1.0');

  // Verify Veo3 pricing features
  assert.equal(comp.engineA.pricingTiers.length, 3);
  assert.ok(comp.engineA.pricingTiers[0].inclusions.includes('zero invite code'));
  assert.equal(comp.engineA.costPerSecondUsd, 0.03);

  // Verify Seedance pricing features
  assert.equal(comp.engineB.pricingTiers.length, 3);
  assert.ok(comp.engineB.pricingTiers[1].inclusions.includes('6-axis camera physics'));
  assert.equal(comp.engineB.costPerSecondUsd, 0.06);

  // Verify motion control & prompt scores
  assert.ok(comp.engineA.promptFidelityScore > comp.engineB.promptFidelityScore);
  assert.ok(comp.engineB.motionControlScore > comp.engineA.motionControlScore);

  // Verify verdict matrix scenarios
  assert.ok(comp.verdictMatrix.length >= 5);
  assert.ok(comp.verdictMatrix.some((v) => v.winner === 'Veo3 AI'));
  assert.ok(comp.verdictMatrix.some((v) => v.winner === 'Seedance 1.0 (Hedra)'));
});

test('getMagicHourMigrationSnippet: generates valid TypeScript, Python, cURL, and Sora adapter code', () => {
  const tsCode = getMagicHourMigrationSnippet('typescript');
  assert.ok(tsCode.includes('MagicHourClient'));
  assert.ok(tsCode.includes('api.magichour.ai/v1'));
  assert.ok(tsCode.includes('styleTransfer'));

  const pyCode = getMagicHourMigrationSnippet('python');
  assert.ok(pyCode.includes('class MagicHourClient:'));
  assert.ok(pyCode.includes('generate_video'));

  const curlCode = getMagicHourMigrationSnippet('curl');
  assert.ok(curlCode.includes('curl -X POST'));
  assert.ok(curlCode.includes('MAGIC_HOUR_API_KEY'));

  const adapterCode = getMagicHourMigrationSnippet('sora_adapter');
  assert.ok(adapterCode.includes('SoraToMagicHourAdapter'));
  assert.ok(adapterCode.includes('sora-2-deprecated-adapter'));
});

test('simulateMagicHourJob: returns job id and completed status', async () => {
  const res = await simulateMagicHourJob({
    prompt: 'Neon hyper-speed train through mountain tunnel',
    resolution: '4K',
    fps: 60,
    durationSeconds: 10,
  });
  assert.ok(res.jobId.startsWith('mh_'));
  assert.equal(res.status, 'completed');
  assert.ok(res.outputPreviewUrl.length > 0);
});
