import test from 'node:test';
import assert from 'node:assert/strict';
import {
  MEME_AUDIO_EFFECTS,
  generateSyntheticPCM,
  encodeWAV,
} from './memeAudioEngine.ts';

test('MEME_AUDIO_EFFECTS catalog includes core iconic sounds', () => {
  const ids = MEME_AUDIO_EFFECTS.map((e) => e.id);
  assert.ok(ids.includes('airhorn'), 'should include airhorn');
  assert.ok(ids.includes('sad_violin'), 'should include sad violin');
  assert.ok(ids.includes('laugh_track'), 'should include laugh track');
  assert.ok(ids.includes('vine_boom'), 'should include vine boom');
  assert.ok(ids.includes('bruh'), 'should include bruh');
  assert.ok(ids.length >= 10, 'should have at least 10 iconic meme sounds');

  // Verify all sound items have valid properties
  for (const sound of MEME_AUDIO_EFFECTS) {
    assert.ok(sound.name.length > 0, `${sound.id} should have name`);
    assert.ok(sound.emoji.length > 0, `${sound.id} should have emoji`);
    assert.ok(sound.durationSec > 0, `${sound.id} should have positive duration`);
    assert.ok(Array.isArray(sound.tags), `${sound.id} should have tags`);
  }
});

test('generateSyntheticPCM synthesizes non-empty stereo channels for airhorn', () => {
  const sampleRate = 22050; // fast rate for test
  const pcm = generateSyntheticPCM('airhorn', sampleRate);

  assert.equal(pcm.left.length, pcm.right.length, 'left and right channels should be equal length');
  assert.ok(pcm.duration > 0, 'duration should be greater than 0');
  assert.ok(pcm.left.length > 0, 'sample array should have samples');

  // Verify amplitude is non-zero (sound was synthesized)
  let maxAmp = 0;
  for (let i = 0; i < pcm.left.length; i++) {
    const abs = Math.abs(pcm.left[i]);
    if (abs > maxAmp) maxAmp = abs;
  }
  assert.ok(maxAmp > 0.05, `airhorn should have audible amplitude, got ${maxAmp}`);
  assert.ok(maxAmp <= 1.05, 'amplitude should be bounded without wild clipping');
});

test('generateSyntheticPCM synthesizes valid audio for sad_violin and vine_boom', () => {
  const sampleRate = 22050;
  const violinPcm = generateSyntheticPCM('sad_violin', sampleRate);
  assert.ok(violinPcm.duration >= 3.0, 'sad violin should be dramatic length >= 3s');

  const boomPcm = generateSyntheticPCM('vine_boom', sampleRate);
  assert.ok(boomPcm.left.length > 0, 'vine boom should generate samples');

  // Vine boom has heavy initial impact
  let firstImpactAmp = 0;
  for (let i = 0; i < Math.min(boomPcm.left.length, 2000); i++) {
    if (Math.abs(boomPcm.left[i]) > firstImpactAmp) {
      firstImpactAmp = Math.abs(boomPcm.left[i]);
    }
  }
  assert.ok(firstImpactAmp > 0.1, 'vine boom should have strong impact');
});

test('encodeWAV generates valid 44-byte RIFF WAVE header and PCM data', () => {
  const sampleRate = 44100;
  const numSamples = 1000;
  const left = new Float32Array(numSamples);
  const right = new Float32Array(numSamples);

  for (let i = 0; i < numSamples; i++) {
    left[i] = Math.sin(2 * Math.PI * 440 * (i / sampleRate));
    right[i] = Math.sin(2 * Math.PI * 440 * (i / sampleRate));
  }

  const wavBuffer = encodeWAV([left, right], sampleRate);
  assert.ok(wavBuffer instanceof ArrayBuffer, 'should produce an ArrayBuffer');

  const view = new DataView(wavBuffer);
  // Verify RIFF header
  const riff = String.fromCharCode(view.getUint8(0), view.getUint8(1), view.getUint8(2), view.getUint8(3));
  assert.equal(riff, 'RIFF');

  // Verify WAVE type
  const wave = String.fromCharCode(view.getUint8(8), view.getUint8(9), view.getUint8(10), view.getUint8(11));
  assert.equal(wave, 'WAVE');

  // Verify fmt
  const fmt = String.fromCharCode(view.getUint8(12), view.getUint8(13), view.getUint8(14), view.getUint8(15));
  assert.equal(fmt, 'fmt ');

  // Channels
  assert.equal(view.getUint16(22, true), 2, 'channels should be 2');
  // Sample rate
  assert.equal(view.getUint32(24, true), sampleRate, 'sample rate should match');
  // Bits per sample
  assert.equal(view.getUint16(34, true), 16, 'bits per sample should be 16');

  // Data chunk
  const data = String.fromCharCode(view.getUint8(36), view.getUint8(37), view.getUint8(38), view.getUint8(39));
  assert.equal(data, 'data');

  // Expected length = 44 + numSamples * 2 channels * 2 bytes = 44 + 4000 = 4044
  assert.equal(wavBuffer.byteLength, 44 + numSamples * 2 * 2);
});
