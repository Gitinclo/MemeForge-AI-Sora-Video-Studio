import test from 'node:test';
import assert from 'node:assert/strict';
import type { TextLayer } from '../types/meme.ts';
import {
  MEME_STYLE_PRESETS,
  applyStylePresetToLayer,
} from './memeStylePresets.ts';

test('MEME_STYLE_PRESETS has comprehensive popular meme styles', () => {
  assert.ok(MEME_STYLE_PRESETS.length >= 10, 'should have at least 10 meme presets');

  const ids = MEME_STYLE_PRESETS.map((p) => p.id);
  assert.ok(ids.includes('classic_impact'), 'must have classic impact');
  assert.ok(ids.includes('deep_fried_chaos'), 'must have deep fried');
  assert.ok(ids.includes('twitter_subtitle'), 'must have twitter subtitle pill');
  assert.ok(ids.includes('cyberpunk_neon'), 'must have cyberpunk neon');
  assert.ok(ids.includes('stonks_profit'), 'must have stonks green');

  for (const preset of MEME_STYLE_PRESETS) {
    assert.ok(preset.name.length > 0, 'preset should have name');
    assert.ok(preset.textColor.startsWith('#') || preset.textColor.startsWith('rgb'), 'valid text color');
    assert.ok(preset.outlineWidth >= 0, 'non-negative outline width');
    assert.ok(typeof preset.isUppercase === 'boolean', 'boolean isUppercase');
    assert.ok(typeof preset.isBold === 'boolean', 'boolean isBold');
  }
});

test('applyStylePresetToLayer applies styling while preserving text, id and position', () => {
  const baseLayer: TextLayer = {
    id: 'layer_test_1',
    text: 'CUSTOM MEME USER TEXT',
    x: 42,
    y: 77,
    fontSize: 52,
    fontFamily: 'Inter',
    textColor: '#123456',
    outlineColor: '#654321',
    outlineWidth: 1,
    backgroundColor: 'transparent',
    textAlign: 'center',
    isUppercase: false,
    isBold: false,
    shadow: false,
    rotation: 5,
  };

  const cyberpunkPreset = MEME_STYLE_PRESETS.find((p) => p.id === 'cyberpunk_neon')!;
  const styledLayer = applyStylePresetToLayer(baseLayer, cyberpunkPreset);

  // Preserved properties
  assert.equal(styledLayer.id, 'layer_test_1');
  assert.equal(styledLayer.text, 'CUSTOM MEME USER TEXT');
  assert.equal(styledLayer.x, 42);
  assert.equal(styledLayer.y, 77);
  assert.equal(styledLayer.fontSize, 52);
  assert.equal(styledLayer.rotation, 5);

  // Updated style properties
  assert.equal(styledLayer.fontFamily, 'Orbitron');
  assert.equal(styledLayer.textColor, '#06b6d4');
  assert.equal(styledLayer.outlineColor, '#4c1d95');
  assert.equal(styledLayer.outlineWidth, 4);
  assert.equal(styledLayer.backgroundColor, 'rgba(15, 23, 42, 0.75)');
  assert.equal(styledLayer.isUppercase, true);
  assert.equal(styledLayer.isBold, true);
  assert.equal(styledLayer.shadow, true);
});
