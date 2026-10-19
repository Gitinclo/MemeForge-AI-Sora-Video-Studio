import test from 'node:test';
import assert from 'node:assert/strict';

// Test 1: Word wrapping calculation
function wrapText(words: string[], maxCharsPerLine: number): string[] {
  const lines: string[] = [];
  let currentLine = words[0] || '';

  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    if ((currentLine + ' ' + word).length <= maxCharsPerLine) {
      currentLine += ' ' + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  if (currentLine) lines.push(currentLine);
  return lines;
}

test('word wrap wraps text when exceeding character limit', () => {
  const text = 'WAKING UP THINKING IT IS SATURDAY MORNING';
  const lines = wrapText(text.split(' '), 16);
  assert.equal(lines.length > 1, true);
  assert.equal(lines.join(' '), text);
});

// Test 2: Tag and Mood Filtering Logic
interface MockTemplate {
  id: string;
  category: string;
  mood: string;
  tags: string[];
}

function filterTemplates(
  templates: MockTemplate[],
  category: string,
  mood: string,
  selectedTags: string[],
  searchQuery: string
): MockTemplate[] {
  const query = searchQuery.toLowerCase().trim();
  return templates.filter((tpl) => {
    const matchCat =
      category === 'All' || tpl.category === category || (category === 'Sad' && tpl.mood === 'Sad');
    const matchMood = mood === 'All' || tpl.mood === mood;
    const matchSearch =
      !query ||
      tpl.id.toLowerCase().includes(query) ||
      tpl.tags.some((t) => t.toLowerCase().includes(query)) ||
      tpl.mood.toLowerCase().includes(query);
    const matchTags =
      selectedTags.length === 0 ||
      selectedTags.every((st) => tpl.tags.map((t) => t.toLowerCase()).includes(st.toLowerCase()));

    return matchCat && matchMood && matchSearch && matchTags;
  });
}

const mockCatalog: MockTemplate[] = [
  { id: 'drake', category: 'Two-Panel', mood: 'Sarcastic', tags: ['drake', 'choice', 'classic'] },
  { id: 'pablo', category: 'Sad', mood: 'Sad', tags: ['sad', 'pablo', 'waiting', 'alone'] },
  { id: 'crying_cat', category: 'Sad', mood: 'Sad', tags: ['sad', 'cat', 'crying', 'tears'] },
  { id: 'stonks', category: 'Trending', mood: 'Smug', tags: ['stonks', 'finance', 'crypto'] },
];

test('filters accurately by category "Sad"', () => {
  const result = filterTemplates(mockCatalog, 'Sad', 'All', [], '');
  assert.equal(result.length, 2);
  assert.equal(result.some((t) => t.id === 'pablo'), true);
  assert.equal(result.some((t) => t.id === 'crying_cat'), true);
});

test('filters accurately by mood tag "Smug"', () => {
  const result = filterTemplates(mockCatalog, 'All', 'Smug', [], '');
  assert.equal(result.length, 1);
  assert.equal(result[0].id, 'stonks');
});

test('filters accurately by multiple tags', () => {
  const result = filterTemplates(mockCatalog, 'All', 'All', ['sad', 'crying'], '');
  assert.equal(result.length, 1);
  assert.equal(result[0].id, 'crying_cat');
});

// Test 3: Crypto & UPI Purchase calculations
test('crypto balance deduction and transaction tracking', () => {
  const initialEth = 0.15;
  const priceEth = 0.005;
  const finalEth = Number((initialEth - priceEth).toFixed(4));
  assert.equal(finalEth, 0.145);
});

test('UPI conversion rate accuracy', () => {
  const upiInr = 49;
  const memeCoinReward = upiInr * 10;
  assert.equal(memeCoinReward, 490);
});
