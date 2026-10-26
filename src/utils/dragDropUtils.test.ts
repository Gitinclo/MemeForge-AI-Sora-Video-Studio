import test from 'node:test';
import assert from 'node:assert/strict';
import {
  isSupportedImageFile,
  detectImageAspectRatio,
  formatDroppedFileName,
  createCustomTemplateFromDrop,
} from './dragDropUtils.js';

test('isSupportedImageFile: validates common image MIME types and file extensions', () => {
  assert.equal(isSupportedImageFile({ type: 'image/png' }), true);
  assert.equal(isSupportedImageFile({ type: 'image/jpeg' }), true);
  assert.equal(isSupportedImageFile({ type: 'image/webp' }), true);
  assert.equal(isSupportedImageFile({ type: 'image/gif' }), true);
  assert.equal(isSupportedImageFile({ type: 'image/svg+xml' }), true);
  assert.equal(isSupportedImageFile({ name: 'my_cat.PNG' }), true);
  assert.equal(isSupportedImageFile({ name: 'banner.JPEG' }), true);
  assert.equal(isSupportedImageFile({ name: 'vector.svg' }), true);
  assert.equal(isSupportedImageFile({ name: 'sticker.webp' }), true);

  // Rejects non-images
  assert.equal(isSupportedImageFile({ type: 'application/pdf', name: 'document.pdf' }), false);
  assert.equal(isSupportedImageFile({ type: 'video/mp4', name: 'clip.mp4' }), false);
  assert.equal(isSupportedImageFile({ type: 'text/plain', name: 'notes.txt' }), false);
});

test('detectImageAspectRatio: matches dimensions to correct aspect ratio presets', () => {
  // 16:9
  assert.equal(detectImageAspectRatio(1920, 1080), '16:9');
  assert.equal(detectImageAspectRatio(1280, 720), '16:9');

  // 9:16
  assert.equal(detectImageAspectRatio(1080, 1920), '9:16');
  assert.equal(detectImageAspectRatio(720, 1280), '9:16');

  // 4:3
  assert.equal(detectImageAspectRatio(1024, 768), '4:3');
  assert.equal(detectImageAspectRatio(800, 600), '4:3');

  // 3:4
  assert.equal(detectImageAspectRatio(768, 1024), '3:4');
  assert.equal(detectImageAspectRatio(600, 800), '3:4');

  // 1:1
  assert.equal(detectImageAspectRatio(800, 800), '1:1');
  assert.equal(detectImageAspectRatio(1000, 1020), '1:1');
});

test('formatDroppedFileName: converts raw filename into clean human title', () => {
  assert.equal(formatDroppedFileName('surprised_pikachu_face.png'), 'Surprised Pikachu Face');
  assert.equal(formatDroppedFileName('stonks-meme-template.jpg'), 'Stonks Meme Template');
  assert.equal(formatDroppedFileName('epic.cat.v2.webp'), 'Epic Cat V2');
  assert.equal(formatDroppedFileName(''), 'Custom Desktop Template');
});

test('createCustomTemplateFromDrop: creates valid MemeTemplate with custom ID and defaults', () => {
  const tpl = createCustomTemplateFromDrop('distracted-bf.jpg', 'data:image/jpeg;base64,1234', '16:9');
  assert.ok(tpl.id.startsWith('custom_desktop_'));
  assert.equal(tpl.name, 'Distracted Bf');
  assert.equal(tpl.aspectRatio, '16:9');
  assert.equal(tpl.svgDataUri, 'data:image/jpeg;base64,1234');
  assert.equal(tpl.isUnlocked, true);
  assert.ok(tpl.tags.includes('desktop'));
});
