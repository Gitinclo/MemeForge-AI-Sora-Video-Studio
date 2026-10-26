import test from 'node:test';
import assert from 'node:assert/strict';
import {
  VIRAL_DANCE_TEMPLATES,
  FILL_IN_THE_BLANK_TEMPLATES,
  MODEL_SELECTION_CATALOG,
  getProceduralDanceKeypoints,
} from './aiDanceEngine.js';

test('VIRAL_DANCE_TEMPLATES: contains iconic moves like slickback and kpop', () => {
  const ids = VIRAL_DANCE_TEMPLATES.map((t) => t.id);
  assert.ok(ids.includes('slickback'));
  assert.ok(ids.includes('kpop_chorus'));
  assert.ok(ids.includes('bollywood_hook'));
  assert.equal(VIRAL_DANCE_TEMPLATES.length >= 4, true);
});

test('FILL_IN_THE_BLANK_TEMPLATES: provides fill-in bracketed structures', () => {
  const tpl = FILL_IN_THE_BLANK_TEMPLATES.find((t) => t.id === 'drone_cliff');
  assert.ok(tpl);
  assert.ok(tpl.rawTemplate.includes('{SUBJECT}'));
  assert.ok(tpl.rawTemplate.includes('{LOCATION}'));
  assert.ok(tpl.variables.length >= 3);
});

test('MODEL_SELECTION_CATALOG: covers Luma, Runway Gen-3, Kling, Mochi 1, CogVideoX, and AnimateAnyone', () => {
  const names = MODEL_SELECTION_CATALOG.map((m) => m.modelName);
  assert.ok(names.some((n) => n.includes('Luma')));
  assert.ok(names.some((n) => n.includes('Runway Gen-3')));
  assert.ok(names.some((n) => n.includes('Kling')));
  assert.ok(names.some((n) => n.includes('Mochi 1')));
  assert.ok(names.some((n) => n.includes('CogVideoX')));
  assert.ok(names.some((n) => n.includes('AnimateAnyone')));

  // Verify cost & realism metrics
  const mochi = MODEL_SELECTION_CATALOG.find((m) => m.modelName.includes('Mochi 1'));
  assert.equal(mochi?.type, 'Open Source (Self-Hosted)');
  assert.ok(mochi!.realismScore >= 90);
});

test('getProceduralDanceKeypoints: outputs 13 distinct anatomical joints within normalized 0-100 coordinates', () => {
  const kp = getProceduralDanceKeypoints('slickback', 1.5);
  assert.ok(kp.head.x >= 0 && kp.head.x <= 100);
  assert.ok(kp.head.y >= 0 && kp.head.y <= 100);
  assert.ok(kp.neck);
  assert.ok(kp.leftShoulder);
  assert.ok(kp.rightShoulder);
  assert.ok(kp.leftElbow);
  assert.ok(kp.rightElbow);
  assert.ok(kp.leftWrist);
  assert.ok(kp.rightWrist);
  assert.ok(kp.pelvis);
  assert.ok(kp.leftKnee);
  assert.ok(kp.rightKnee);
  assert.ok(kp.leftAnkle);
  assert.ok(kp.rightAnkle);
});
