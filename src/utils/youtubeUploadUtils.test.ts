import test from 'node:test';
import assert from 'node:assert/strict';
import {
  parseTags,
  formatTagsForInput,
  validateYouTubeMetadata,
  calculateUploadProgress,
  generateLocalFallbackMetadata,
  YOUTUBE_CATEGORIES,
  getKotlinWorkManagerCode,
  getKotlinArgonGeneratorCode,
  getKotlinDependenciesCode,
  getAndroidManifestCode,
} from './youtubeUploadUtils.js';

test('parseTags: handles comma-separated string with hashtags and whitespace', () => {
  const input = '#meme, funny, #viral, comedy,    #shorts,  meme';
  const tags = parseTags(input);
  assert.deepEqual(tags, ['meme', 'funny', 'viral', 'comedy', 'shorts']);
});

test('parseTags: handles array input and limits to 30 tags', () => {
  const input = Array.from({ length: 40 }, (_, i) => `tag${i}`);
  const tags = parseTags(input);
  assert.equal(tags.length, 30);
  assert.equal(tags[0], 'tag0');
});

test('formatTagsForInput: produces clean comma-separated output', () => {
  const formatted = formatTagsForInput(['meme', 'ai', 'leo']);
  assert.equal(formatted, 'meme, ai, leo');
});

test('validateYouTubeMetadata: catches empty or overlong title', () => {
  const emptyRes = validateYouTubeMetadata({ title: '', tags: ['meme'] });
  assert.equal(emptyRes.valid, false);
  assert.ok(emptyRes.errors.some((e) => e.includes('Title is required')));

  const longTitle = 'A'.repeat(101);
  const longRes = validateYouTubeMetadata({ title: longTitle, tags: ['meme'] });
  assert.equal(longRes.valid, false);
  assert.ok(longRes.errors.some((e) => e.includes('100 characters or less')));
});

test('validateYouTubeMetadata: passes for valid metadata', () => {
  const validRes = validateYouTubeMetadata({
    title: 'Epic AI Meme Reaction 🔥',
    description: 'Check out this viral moment!',
    tags: ['meme', 'viral', 'ai', 'shorts', 'funny'],
  });
  assert.equal(validRes.valid, true);
  assert.equal(validRes.errors.length, 0);
});

test('calculateUploadProgress: handles boundaries correctly', () => {
  const zero = calculateUploadProgress(0, 1000);
  assert.equal(zero.percent, 0);

  const half = calculateUploadProgress(500, 1000);
  assert.equal(half.percent, 50);

  const full = calculateUploadProgress(1000, 1000);
  assert.equal(full.percent, 100);

  const overflow = calculateUploadProgress(1500, 1000);
  assert.equal(overflow.percent, 100);

  const mbFormat = calculateUploadProgress(5 * 1024 * 1024, 10 * 1024 * 1024);
  assert.equal(mbFormat.formattedUploaded, '5.0 MB');
  assert.equal(mbFormat.formattedTotal, '10.0 MB');
});

test('generateLocalFallbackMetadata: creates high quality fallback metadata', () => {
  const meta = generateLocalFallbackMetadata({ title: 'Cyberpunk Doge' });
  assert.ok(meta.title.includes('Cyberpunk Doge'));
  assert.ok(meta.description.includes('MemeForge AI Studio'));
  assert.ok(meta.tags.length >= 5);
  assert.equal(meta.categoryId, '23');
  assert.ok((meta.viralityScore ?? 0) > 80);
});

test('YOUTUBE_CATEGORIES: contains essential categories', () => {
  const ids = YOUTUBE_CATEGORIES.map((c) => c.id);
  assert.ok(ids.includes('23')); // Comedy
  assert.ok(ids.includes('24')); // Entertainment
  assert.ok(ids.includes('22')); // People & Blogs
});

test('Kotlin template generators: produce valid code snippets with Argon and WorkManager', () => {
  const workManagerCode = getKotlinWorkManagerCode();
  assert.ok(workManagerCode.includes('class YouTubeUploadWorker'));
  assert.ok(workManagerCode.includes('MediaHttpUploader'));
  assert.ok(workManagerCode.includes('CoroutineWorker'));

  const argonCode = getKotlinArgonGeneratorCode();
  assert.ok(argonCode.includes('gemini-4-argon'));
  assert.ok(argonCode.includes('generateVideoMetadataWithArgon'));

  const gradleCode = getKotlinDependenciesCode();
  assert.ok(gradleCode.includes('google-api-services-youtube'));
  assert.ok(gradleCode.includes('work-runtime-ktx'));
  assert.ok(gradleCode.includes('generativeai'));

  const manifestCode = getAndroidManifestCode();
  assert.ok(manifestCode.includes('android.permission.INTERNET'));
  assert.ok(manifestCode.includes('android.permission.FOREGROUND_SERVICE'));
});
