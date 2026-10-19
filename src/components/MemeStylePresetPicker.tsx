import React, { useState } from 'react';
import { TextLayer } from '../types/meme';
import { MEME_STYLE_PRESETS, TextStylePreset, applyStylePresetToLayer } from '../data/memeStylePresets';
import { Sparkles, Check, Layers, SlidersHorizontal } from 'lucide-react';

interface MemeStylePresetPickerProps {
  activeLayer: TextLayer | null;
  onApplyPreset: (preset: TextStylePreset, applyToAll: boolean) => void;
}

export const MemeStylePresetPicker: React.FC<MemeStylePresetPickerProps> = ({
  activeLayer,
  onApplyPreset,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [appliedPresetId, setAppliedPresetId] = useState<string | null>(null);

  const categories = ['All', 'Classic', 'Neon & Cyber', 'Modern & Clean', 'Chaos & Funny'];

  const filteredPresets = MEME_STYLE_PRESETS.filter(
    (p) => selectedCategory === 'All' || p.category === selectedCategory
  );

  const handleSelect = (preset: TextStylePreset, applyToAll = false) => {
    setAppliedPresetId(preset.id);
    onApplyPreset(preset, applyToAll);
    setTimeout(() => setAppliedPresetId(null), 2000);
  };

  return (
    <div className="space-y-3 p-3.5 bg-slate-950/80 border border-slate-800/80 rounded-2xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-amber-500 to-purple-600 flex items-center justify-center text-slate-950">
            <Sparkles className="w-3.5 h-3.5 text-slate-950 stroke-[2.5]" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <span>Meme Style Presets</span>
              <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                1-Click Styles
              </span>
            </h4>
            <p className="text-[10px] text-slate-400">
              Apply popular meme fonts, colors, and outline text effects in one click
            </p>
          </div>
        </div>

        {/* Apply to All Quick Action */}
        {activeLayer && (
          <span className="text-[10px] text-slate-400 font-medium">
            Active: <span className="text-amber-400 font-bold">{activeLayer.fontFamily}</span>
          </span>
        )}
      </div>

      {/* Category Filter Pills */}
      <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-2.5 py-0.5 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all border ${
              selectedCategory === cat
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Presets Grid */}
      <div className="grid grid-cols-2 gap-2 max-h-[250px] overflow-y-auto pr-1 scrollbar-thin">
        {filteredPresets.map((preset) => {
          const isJustApplied = appliedPresetId === preset.id;
          const isCurrentMatch =
            activeLayer &&
            activeLayer.fontFamily === preset.fontFamily &&
            activeLayer.textColor.toLowerCase() === preset.textColor.toLowerCase() &&
            activeLayer.outlineColor.toLowerCase() === preset.outlineColor.toLowerCase();

          return (
            <div
              key={preset.id}
              className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between group relative overflow-hidden ${
                isCurrentMatch
                  ? 'bg-gradient-to-r from-amber-500/20 to-purple-500/20 border-amber-400 shadow-md shadow-amber-500/10'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-1.5">
                  <span className="text-xs font-bold text-slate-200 flex items-center gap-1 truncate">
                    <span>{preset.emoji}</span>
                    <span className="truncate">{preset.name}</span>
                  </span>
                  <span className="text-[9px] px-1 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700/60 font-semibold flex-shrink-0">
                    {preset.badge}
                  </span>
                </div>

                {/* Stylized Preview of the Preset */}
                <div
                  className="w-full py-1.5 px-2 rounded-lg flex items-center justify-center text-center text-xs font-black truncate my-1 shadow-inner select-none transition-transform group-hover:scale-[1.02]"
                  style={{
                    backgroundColor:
                      preset.backgroundColor !== 'transparent'
                        ? preset.backgroundColor
                        : 'rgba(2, 6, 23, 0.7)',
                    fontFamily: preset.fontFamily,
                    color: preset.textColor,
                    textTransform: preset.isUppercase ? 'uppercase' : 'none',
                    fontWeight: preset.isBold ? 900 : 500,
                    textShadow: preset.shadow
                      ? `0 2px 8px rgba(0,0,0,0.9), 0 0 3px ${preset.outlineColor}`
                      : 'none',
                    WebkitTextStroke:
                      preset.outlineWidth > 0
                        ? `${Math.max(1, Math.round(preset.outlineWidth / 2.5))}px ${preset.outlineColor}`
                        : 'none',
                  }}
                >
                  MEME TEXT
                </div>

                <p className="text-[10px] text-slate-400 line-clamp-1 mt-1">
                  {preset.description}
                </p>
              </div>

              {/* Actions: Apply to current / Apply to all */}
              <div className="flex items-center gap-1 mt-2 pt-2 border-t border-slate-800/80">
                <button
                  onClick={() => handleSelect(preset, false)}
                  className={`flex-1 py-1 px-2 rounded-lg text-[10px] font-bold transition-all flex items-center justify-center gap-1 ${
                    isJustApplied
                      ? 'bg-emerald-500 text-slate-950 font-black'
                      : isCurrentMatch
                      ? 'bg-amber-500 text-slate-950 font-black'
                      : 'bg-slate-800 hover:bg-amber-500/20 text-slate-300 hover:text-amber-300 border border-slate-700'
                  }`}
                  title="Apply style preset to currently selected text layer"
                >
                  {isJustApplied ? (
                    <>
                      <Check className="w-3 h-3 stroke-[2.5]" />
                      <span>Applied!</span>
                    </>
                  ) : isCurrentMatch ? (
                    <>
                      <Check className="w-3 h-3 stroke-[2.5]" />
                      <span>Active</span>
                    </>
                  ) : (
                    <span>Apply</span>
                  )}
                </button>

                <button
                  onClick={() => handleSelect(preset, true)}
                  className="py-1 px-1.5 rounded-lg text-[10px] font-bold text-slate-400 hover:text-white bg-slate-950 border border-slate-800 hover:border-slate-700 transition-colors flex items-center gap-0.5"
                  title="Apply this style preset across ALL text layers on the meme"
                >
                  <Layers className="w-3 h-3" />
                  <span className="hidden xs:inline">All</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
