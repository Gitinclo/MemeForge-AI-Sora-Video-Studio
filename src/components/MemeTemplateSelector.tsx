import React, { useState, useMemo } from 'react';
import { MEME_TEMPLATES } from '../data/memeTemplates';
import { MemeTemplate, MemeMood } from '../types/meme';
import {
  Search,
  Upload,
  Sparkles,
  Image as ImageIcon,
  Link as LinkIcon,
  Check,
  Loader2,
  Tag,
  Lock,
  Coins,
  Smile,
  X,
  CreditCard,
  IndianRupee,
} from 'lucide-react';

interface MemeTemplateSelectorProps {
  onSelectTemplate: (template: MemeTemplate) => void;
  onCustomImageUpload: (imageSrc: string, name: string) => void;
  activeTemplateId: string | null;
  onOpenCheckout?: (template: MemeTemplate) => void;
  unlockedTemplateIds?: string[];
}

export const MemeTemplateSelector: React.FC<MemeTemplateSelectorProps> = ({
  onSelectTemplate,
  onCustomImageUpload,
  activeTemplateId,
  onOpenCheckout,
  unlockedTemplateIds = [],
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedMood, setSelectedMood] = useState<string>('All');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'templates' | 'upload' | 'ai_generate'>('templates');
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [aiError, setAiError] = useState('');

  // Comprehensive Category list including 'Classic', 'Trending', 'Sad', 'Reaction', 'Two-Panel', 'Multi-Panel'
  const categories = ['All', 'Classic', 'Trending', 'Sad', 'Reaction', 'Two-Panel', 'Multi-Panel', 'Community'];

  // Mood filters
  const moods: Array<{ id: string; label: string; emoji: string }> = [
    { id: 'All', label: 'All Moods', emoji: '🎭' },
    { id: 'Sad', label: 'Sad & Crying', emoji: '😭' },
    { id: 'Sarcastic', label: 'Sarcastic', emoji: '😏' },
    { id: 'Panic', label: 'Panic & Stress', emoji: '🔥' },
    { id: 'Big Brain', label: 'Big Brain', emoji: '🧠' },
    { id: 'Smug', label: 'Smug & Stonks', emoji: '📈' },
    { id: 'Angry', label: 'Angry & Yelling', emoji: '😡' },
    { id: 'Wholesome', label: 'Wholesome', emoji: '💖' },
  ];

  // Extract all unique tags across templates
  const allAvailableTags = useMemo(() => {
    const set = new Set<string>();
    MEME_TEMPLATES.forEach((tpl) => {
      tpl.tags.forEach((t) => set.add(t.toLowerCase()));
    });
    return Array.from(set).sort();
  }, []);

  // Tag-based filtering logic
  const filteredTemplates = useMemo(() => {
    return MEME_TEMPLATES.filter((tpl) => {
      // Category filter (including 'Sad')
      const matchesCategory =
        selectedCategory === 'All' ||
        tpl.category === selectedCategory ||
        (selectedCategory === 'Sad' && tpl.mood === 'Sad');

      // Mood filter
      const matchesMood =
        selectedMood === 'All' || tpl.mood === selectedMood;

      // Search query filter
      const searchLower = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !searchLower ||
        tpl.name.toLowerCase().includes(searchLower) ||
        tpl.description.toLowerCase().includes(searchLower) ||
        tpl.tags.some((tag) => tag.toLowerCase().includes(searchLower)) ||
        tpl.mood.toLowerCase().includes(searchLower) ||
        tpl.category.toLowerCase().includes(searchLower);

      // Selected tag chips filter (AND match for selected tags)
      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.every((st) => tpl.tags.map((t) => t.toLowerCase()).includes(st));

      return matchesCategory && matchesMood && matchesSearch && matchesTags;
    });
  }, [selectedCategory, selectedMood, searchQuery, selectedTags]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUri = event.target?.result as string;
      if (dataUri) {
        onCustomImageUpload(dataUri, file.name.replace(/\.[^/.]+$/, ''));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUri = event.target?.result as string;
      if (dataUri) {
        onCustomImageUpload(dataUri, file.name.replace(/\.[^/.]+$/, ''));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleUrlSubmit = () => {
    if (!imageUrlInput.trim()) return;
    onCustomImageUpload(imageUrlInput.trim(), 'Web Image');
    setImageUrlInput('');
  };

  const handleAiGenerate = async () => {
    if (!aiPrompt.trim()) return;
    setIsGeneratingAi(true);
    setAiError('');
    try {
      const res = await fetch('/api/generate-meme-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: aiPrompt }),
      });
      const data = await res.json();
      if (data.imageUrl) {
        onCustomImageUpload(data.imageUrl, `AI: ${aiPrompt.slice(0, 25)}`);
      } else {
        setAiError(data.error || 'Failed to generate meme image');
      }
    } catch (err: any) {
      setAiError(err.message || 'Error communicating with generation endpoint');
    } finally {
      setIsGeneratingAi(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-xl flex flex-col space-y-4">
      {/* Top Tabs */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-wrap gap-2">
        <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-2xl border border-slate-800/80">
          <button
            onClick={() => setActiveTab('templates')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'templates'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            Trending Templates
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'upload'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            Upload Image
          </button>
          <button
            onClick={() => setActiveTab('ai_generate')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'ai_generate'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            AI Generator
          </button>
        </div>

        {/* Templates Count indicator */}
        <div className="text-[11px] text-slate-400 flex items-center gap-1.5 font-semibold">
          <span>Showing {filteredTemplates.length} of {MEME_TEMPLATES.length} templates</span>
        </div>
      </div>

      {/* Tab 1: Templates Catalog with Tag-based & Mood filtering */}
      {activeTab === 'templates' && (
        <div className="space-y-3.5">
          {/* Search Input Bar */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, mood, or tag (e.g. 'Sad', 'Drake', 'Crying', 'Coding')..."
              className="w-full pl-9 pr-9 py-2.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* 1. Category Tabs (Classic, Trending, Sad, etc.) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              <span>Category</span>
            </div>
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap border transition-all ${
                      isSelected
                        ? cat === 'Sad'
                          ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-600/20'
                          : 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-sm'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                    }`}
                  >
                    {cat === 'Sad' ? '😭 Sad & Crying' : cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Mood Filter Buttons */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              <span className="flex items-center gap-1">
                <Smile className="w-3 h-3 text-amber-400" />
                Filter by Mood
              </span>
              {selectedMood !== 'All' && (
                <button
                  onClick={() => setSelectedMood('All')}
                  className="text-amber-400 hover:underline normal-case text-[10px]"
                >
                  Clear mood
                </button>
              )}
            </div>
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {moods.map((m) => {
                const isSelected = selectedMood === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => setSelectedMood(m.id)}
                    className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold whitespace-nowrap border transition-all flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-purple-600/30 border-purple-500 text-purple-200 shadow-sm'
                        : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span>{m.emoji}</span>
                    <span>{m.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Interactive Tag Chips Filtering System */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              <span className="flex items-center gap-1">
                <Tag className="w-3 h-3 text-cyan-400" />
                Popular Tag Chips
              </span>
              {selectedTags.length > 0 && (
                <button
                  onClick={() => setSelectedTags([])}
                  className="text-cyan-400 hover:underline normal-case text-[10px]"
                >
                  Clear tags ({selectedTags.length})
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto pr-1">
              {allAvailableTags.slice(0, 16).map((t) => {
                const isSelected = selectedTags.includes(t);
                return (
                  <button
                    key={t}
                    onClick={() => toggleTag(t)}
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border transition-all flex items-center gap-1 ${
                      isSelected
                        ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-sm'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-300'
                    }`}
                  >
                    <span>#{t}</span>
                    {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Grid of Filtered Templates */}
          {filteredTemplates.length === 0 ? (
            <div className="p-8 text-center bg-slate-950/50 rounded-2xl border border-slate-800 space-y-2">
              <p className="text-sm font-bold text-slate-300">No templates found</p>
              <p className="text-xs text-slate-500">
                Try clearing selected mood, category, or search filters.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSelectedMood('All');
                  setSelectedTags([]);
                  setSearchQuery('');
                }}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl transition-colors mt-2"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3 max-h-[340px] overflow-y-auto pr-1">
              {filteredTemplates.map((tpl) => {
                const isSelected = activeTemplateId === tpl.id;
                const isPremiumLocked =
                  tpl.price?.isPremium &&
                  !tpl.isUnlocked &&
                  !unlockedTemplateIds.includes(tpl.id);

                return (
                  <button
                    key={tpl.id}
                    onClick={() => {
                      if (isPremiumLocked && onOpenCheckout) {
                        onOpenCheckout(tpl);
                      } else {
                        onSelectTemplate(tpl);
                      }
                    }}
                    className={`group relative rounded-2xl overflow-hidden border text-left transition-all bg-slate-950 ${
                      isSelected
                        ? 'border-amber-500 ring-2 ring-amber-500/30 shadow-lg shadow-amber-500/10'
                        : isPremiumLocked
                        ? 'border-amber-500/30 hover:border-amber-500/70 hover:shadow-lg'
                        : 'border-slate-800 hover:border-slate-600 hover:shadow-md'
                    }`}
                  >
                    {/* SVG Image container */}
                    <div className="aspect-square w-full bg-slate-950 overflow-hidden relative flex items-center justify-center p-1">
                      <img
                        src={tpl.svgDataUri}
                        alt={tpl.name}
                        className="w-full h-full object-contain rounded-xl group-hover:scale-105 transition-transform duration-200"
                      />

                      {/* Selected Badge */}
                      {isSelected && (
                        <div className="absolute top-1.5 right-1.5 bg-amber-500 text-slate-950 rounded-full p-0.5 shadow-md">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      )}

                      {/* Premium / Crypto / UPI Lock Badge */}
                      {isPremiumLocked && (
                        <div className="absolute inset-0 bg-slate-950/65 backdrop-blur-[2px] flex flex-col items-center justify-center p-2 text-center rounded-xl">
                          <div className="p-1.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 mb-1">
                            <Lock className="w-4 h-4" />
                          </div>
                          <span className="text-[10px] font-black text-amber-300 uppercase tracking-wider">
                            Marketplace Exclusive
                          </span>
                          <div className="flex items-center gap-1 mt-1 text-[11px] font-bold text-emerald-400">
                            <span>{tpl.price?.crypto} {tpl.price?.cryptoCurrency}</span>
                            <span className="text-slate-400">•</span>
                            <span className="flex items-center">
                              <IndianRupee className="w-3 h-3 inline" />
                              <span>{tpl.price?.upiInr} UPI</span>
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Mood Pill on thumbnail */}
                      <div className="absolute bottom-1.5 left-1.5 bg-slate-950/80 backdrop-blur-md px-1.5 py-0.5 rounded text-[9px] font-semibold text-slate-300 border border-slate-800">
                        {tpl.mood}
                      </div>
                    </div>

                    <div className="p-2 border-t border-slate-800/80">
                      <p className="text-[11px] font-bold text-slate-200 truncate group-hover:text-amber-400">
                        {tpl.name}
                      </p>
                      <div className="flex items-center justify-between mt-0.5">
                        <span className="text-[9px] text-slate-500 uppercase font-semibold">
                          {tpl.category}
                        </span>
                        {isPremiumLocked ? (
                          <span className="text-[9px] text-amber-400 font-bold flex items-center gap-0.5">
                            <Coins className="w-2.5 h-2.5" /> Buy
                          </span>
                        ) : (
                          <span className="text-[9px] text-emerald-400 font-bold">
                            FREE
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Custom Image Upload */}
      {activeTab === 'upload' && (
        <div className="space-y-4">
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className="border-2 border-dashed border-slate-700/80 hover:border-amber-500/80 rounded-2xl p-6 sm:p-8 text-center transition-colors bg-slate-950/60 flex flex-col items-center justify-center cursor-pointer group relative"
          >
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Upload className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-white mb-1">
              Drag &amp; drop any image here, or click to browse
            </h4>
            <p className="text-xs text-slate-400 max-w-sm">
              Supports PNG, JPG, GIF, WebP. You can also paste directly into the page with <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 font-mono">Ctrl+V</kbd>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <LinkIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="url"
                value={imageUrlInput}
                onChange={(e) => setImageUrlInput(e.target.value)}
                placeholder="Or paste an image web URL..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>
            <button
              onClick={handleUrlSubmit}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl transition-colors"
            >
              Load URL
            </button>
          </div>
        </div>
      )}

      {/* Tab 3: AI Generate Meme Background */}
      {activeTab === 'ai_generate' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-500/10 to-amber-500/10 border border-purple-500/20">
            <h4 className="text-xs font-bold text-purple-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-purple-400" />
              Create Custom Meme Template with Gemini
            </h4>
            <p className="text-xs text-slate-400">
              Describe a funny expression, creature, or situation (e.g. &quot;Sad robot holding a dead battery in the rain&quot;)
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAiGenerate();
              }}
              placeholder="e.g. A cat wearing tiny glasses looking exhausted grading exams..."
              className="flex-1 px-3.5 py-2.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />
            <button
              onClick={handleAiGenerate}
              disabled={isGeneratingAi || !aiPrompt.trim()}
              className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-amber-500 hover:from-purple-500 hover:to-amber-400 text-slate-950 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-purple-500/20 disabled:opacity-50"
            >
              {isGeneratingAi ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span className="text-white">Generating Template...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate Image
                </>
              )}
            </button>
          </div>

          {aiError && (
            <div className="p-3 bg-red-950/40 border border-red-800/60 rounded-xl text-red-300 text-xs">
              {aiError}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
