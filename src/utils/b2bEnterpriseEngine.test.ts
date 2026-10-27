import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateB2bRoi,
  renderPersonalizedSalesScript,
  generateScriptToStoryboard,
  simulateLoRATraining,
  exportLeadsToCsv,
  parseLeadsCsv,
  B2B_PRICING_CATALOG,
  PRESET_LORA_MODELS,
  SAMPLE_SALES_LEADS,
  validateProductDataset,
  getSampleProductDataset,
  createLoraTrainingJob,
  advanceTrainingJob,
  formatRemainingTime,
  simulateSandboxTest,
  MODEL_SANDBOX_PRESET_PROMPTS,
  DEFAULT_GPU_CLUSTER_NODES,
  INITIAL_LORA_TRAINING_JOBS,
} from './b2bEnterpriseEngine';

test('calculateB2bRoi: calculates correct savings and ROI multiple for Pro plan', () => {
  const result = calculateB2bRoi({
    videosPerMonth: 10,
    traditionalCostPerVideo: 4500,
    traditionalTurnaroundDays: 14,
    selectedPlan: 'pro',
  });

  // Traditional annual: 10 * 4500 * 12 = 540,000
  assert.equal(result.traditionalMonthlyCost, 45000);
  assert.equal(result.traditionalAnnualCost, 540000);

  // Pro annual: 149 * 12 = 1,788
  assert.equal(result.platformAnnualCost, 1788);
  assert.equal(result.netAnnualSavings, 540000 - 1788);

  // ROI multiple: 540000 / 1788 ≈ 302.0
  assert.ok(result.roiMultiple > 250);
  assert.ok(result.turnaroundHoursSavedAnnual > 5000);
});

test('calculateB2bRoi: handles Enterprise plan boundaries', () => {
  const result = calculateB2bRoi({
    videosPerMonth: 50,
    traditionalCostPerVideo: 3000,
    traditionalTurnaroundDays: 10,
    selectedPlan: 'enterprise',
  });

  // Traditional annual: 50 * 3000 * 12 = 1,800,000
  assert.equal(result.traditionalAnnualCost, 1800000);
  // Enterprise annual: 499 * 12 = 5988
  assert.equal(result.platformAnnualCost, 5988);
  assert.ok(result.netAnnualSavings > 1790000);
});

test('renderPersonalizedSalesScript: correctly injects all placeholder tokens', () => {
  const template = 'Hello {{firstName}} from {{company}}! As {{role}}, check {{websiteUrl}} to {{customValueProp}}.';
  const lead = {
    firstName: 'Alex',
    company: 'Stripe',
    role: 'Lead Architect',
    websiteUrl: 'https://stripe.com',
    customValueProp: 'automate 8K product demos',
  };

  const rendered = renderPersonalizedSalesScript(template, lead);
  assert.equal(
    rendered,
    'Hello Alex from Stripe! As Lead Architect, check https://stripe.com to automate 8K product demos.'
  );
});

test('renderPersonalizedSalesScript: falls back safely when lead fields are missing', () => {
  const template = 'Hi {{firstName}} at {{company}}';
  const rendered = renderPersonalizedSalesScript(template, {});
  assert.equal(rendered, 'Hi there at your organization');
});

test('generateScriptToStoryboard: breaks article into structured scenes', () => {
  const article =
    'Acme Corp announced a revolutionary new autonomous drone. The system utilizes real-time lidar navigation and thermal imaging. Customers can monitor fleet analytics directly through an encrypted cloud dashboard.';
  const scenes = generateScriptToStoryboard(article);

  assert.ok(scenes.length >= 3);
  assert.equal(scenes[0].sceneNumber, 1);
  assert.ok(scenes[0].durationSec > 0);
  assert.ok(scenes[0].cameraMotion.length > 0);
  assert.ok(scenes[0].visualDescription.length > 0);
});

test('simulateLoRATraining: produces valid trigger token and high preservation metrics', () => {
  const lora = simulateLoRATraining('Quantum Pod X', 'tech_hardware', 32);

  assert.equal(lora.triggerToken, '[QUANTUM_POD_X]');
  assert.equal(lora.baseModel, 'LEO-DiT-Enterprise-v3');
  assert.equal(lora.rank, 32);
  assert.ok(lora.preservationMetrics.logoFidelityPct >= 99);
  assert.ok(lora.lossCurve.length > 5);
  // Loss should decrease over time
  assert.ok(lora.lossCurve[lora.lossCurve.length - 1] < lora.lossCurve[0]);
});

test('exportLeadsToCsv and parseLeadsCsv: roundtrips lead records with RFC-4180 compatibility', () => {
  const csv = exportLeadsToCsv(SAMPLE_SALES_LEADS);
  assert.ok(csv.includes('Lead ID,First Name,Last Name'));
  assert.ok(csv.includes('Sarah'));
  assert.ok(csv.includes('Apex Retail Brands'));

  const parsed = parseLeadsCsv(
    'First Name,Last Name,Company,Role,Website,Value Prop\nMark,Zucker,Meta,CEO,https://meta.com,scale spatial video'
  );
  assert.equal(parsed.length, 1);
  assert.equal(parsed[0].firstName, 'Mark');
  assert.equal(parsed[0].company, 'Meta');
  assert.equal(parsed[0].websiteUrl, 'https://meta.com');
});

test('B2B_PRICING_CATALOG: contains Starter, Pro, and Enterprise tiers with correct pricing', () => {
  assert.equal(B2B_PRICING_CATALOG.starter.priceUsdMonthly, 49);
  assert.equal(B2B_PRICING_CATALOG.pro.priceUsdMonthly, 149);
  assert.equal(B2B_PRICING_CATALOG.enterprise.priceUsdMonthly, 499);
  assert.equal(B2B_PRICING_CATALOG.enterprise.dedicatedGpuVpc, true);
  assert.equal(B2B_PRICING_CATALOG.pro.soc2ComplianceIncluded, true);
});

test('validateProductDataset: enforces 10 to 20 images threshold strictly', () => {
  const sample14 = getSampleProductDataset('cosmetics', 'Test Serum');
  assert.equal(sample14.length, 14);

  // 14 images -> valid
  const validResult = validateProductDataset(sample14);
  assert.equal(validResult.isValid, true);
  assert.equal(validResult.canTrain, true);
  assert.ok(validResult.qualityScore >= 80);

  // 0 images -> invalid
  const emptyResult = validateProductDataset([]);
  assert.equal(emptyResult.isValid, false);
  assert.equal(emptyResult.canTrain, false);

  // 5 images -> invalid (< 10)
  const underResult = validateProductDataset(sample14.slice(0, 5));
  assert.equal(underResult.isValid, false);
  assert.equal(underResult.canTrain, false);
  assert.ok(underResult.statusMessage.includes('Insufficient dataset size'));

  // 22 images -> invalid (> 20)
  const overResult = validateProductDataset([...sample14, ...sample14.slice(0, 8)]);
  assert.equal(overResult.isValid, false);
  assert.equal(overResult.canTrain, false);
  assert.ok(overResult.statusMessage.includes('exceeds maximum limit'));
});

test('createLoraTrainingJob and advanceTrainingJob: steps through lifecycle to completion', () => {
  let job = createLoraTrainingJob({
    productName: 'Hydra Glass Bottle',
    category: 'cosmetics',
    rank: 32,
    targetSteps: 300,
  });

  assert.equal(job.triggerToken, '[HYDRA_GLASS_BOTTLE]');
  assert.equal(job.phase, 'validating_dataset');
  assert.equal(job.currentStep, 0);

  // Step 1: Advance by 50 steps
  job = advanceTrainingJob(job, 50);
  assert.ok(job.currentStep > 0);
  assert.ok(job.logs.length >= 4);

  // Step 2: Advance to completion
  job = advanceTrainingJob(job, 300);
  assert.equal(job.phase, 'completed');
  assert.equal(job.currentStep, job.targetSteps);
  assert.ok(job.currentLoss < 0.1);
  assert.ok(job.preservationScores);
  assert.equal(job.preservationScores.logoFidelityPct, 99.4);
});

test("formatRemainingTime: formats minutes and seconds correctly", () => {
  assert.equal(formatRemainingTime(0), "Complete");
  assert.equal(formatRemainingTime(162), "02m 42s remaining");
  assert.equal(formatRemainingTime(45), "00m 45s remaining");
});

test("DEFAULT_GPU_CLUSTER_NODES and INITIAL_LORA_TRAINING_JOBS: valid telemetry and job specs", () => {
  assert.ok(DEFAULT_GPU_CLUSTER_NODES.length >= 3);
  const h100 = DEFAULT_GPU_CLUSTER_NODES[0];
  assert.equal(h100.vramTotalGb, 80);
  assert.ok(h100.computeUtilizationPct > 90);

  assert.ok(INITIAL_LORA_TRAINING_JOBS.length >= 2);
  const activeJob = INITIAL_LORA_TRAINING_JOBS[0];
  assert.equal(activeJob.phase, "training_lora");
  assert.ok(activeJob.estimatedRemainingSeconds > 0);
});

test("simulateSandboxTest: runs test verification and computes invariant metrics", () => {
  const model = PRESET_LORA_MODELS[0];
  const preset = MODEL_SANDBOX_PRESET_PROMPTS[0];
  const result = simulateSandboxTest(model, preset);

  assert.equal(result.modelId, model.id);
  assert.equal(result.presetId, preset.id);
  assert.ok(result.logoIntegrityPct >= 97);
  assert.ok(result.geometrySilhouetteIoU >= 96);
  assert.equal(result.status, "passed");
  assert.ok(result.renderTimeSec > 0);
});
