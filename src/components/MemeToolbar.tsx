import React, { useState } from 'react';
import { TextLayer, MemeSticker, CanvasFilter, MemeAudioConfig } from '../types/meme';
import { MEME_FONTS, POPULAR_COLORS, MEME_STICKER_PRESETS } from '../data/memeTemplates';
import { MEME_AUDIO_EFFECTS } from '../utils/memeAudioEngine';
import { MemeAudioLayerPanel } from './MemeAudioLayerPanel';
import {
  Type,
  Palette,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Plus,
  Trash2,
  Sliders,
  Sparkles,
  Download,
  Copy,
  Layers,
  Smile,
  Ratio,
  Maximize2,
  RotateCw,
  Eye,
  Check,
  Music,
  Film,
} from 'lucide-react';

interface MemeToolbarProps {
  textLayers: TextLayer[];
  selectedLayerId: string | null;
  onSelectLayer: (id: string | null) => void;
  onUpdateLayer: (id: string, updates: Partial<TextLayer>) => void;
  onAddLayer: () => void;
  onRemoveLayer: (id: string) => void;
  stickers: MemeSticker[];
  onAddSticker: (type: MemeSticker['type'], emoji: string, label: string) => void;
  onRemoveSticker: (id: string) => void;
  filter: CanvasFilter;
  onFilterChange: (filter: CanvasFilter) => void;
  aspectRatio: string;
  onAspectRatioChange: (ratio: string) => void;
  onDownload: (format: 'png' | 'jpeg' | 'webp') => void;
  onCopyToClipboard: () => void;
  copiedToast: boolean;
  audioConfig?: MemeAudioConfig;
  onChangeAudioConfig?: (updates: Partial<MemeAudioConfig>) => void;
  onExportVideoWithAudio?: () => void;
  isExportingVideo?: boolean;
  exportProgress?: { percent: number; status: string } | null;
}

export const MemeToolbar: React.FC<MemeToolbarProps> = ({
  textLayers,
  selectedLayerId,
  onSelectLayer,
  onUpdateLayer,
  onAddLayer,
  onRemoveLayer,
  stickers,
  onAddSticker,
  onRemoveSticker,
  filter,
  onFilterChange,
  aspectRatio,
  onAspectRatioChange,
  onDownload,
  onCopyToClipboard,
  copiedToast,
  audioConfig,
  onChangeAudioConfig,
  onExportVideoWithAudio,
  isExportingVideo = false,
  exportProgress = null,
}) => {
  const [activeTab, setActiveTab] = useState<'text' | 'stickers' | 'audio'>('text');
  const activeLayer =
    textLayers.find((l) => l.id === selectedLayerId) || textLayers[0] || null;

  const activeAudioEffect = MEME_AUDIO_EFFECTS.find(
    (e) => e.id === audioConfig?.selectedEffectId
  );

  const filtersList: Array<{ id: CanvasFilter; label: string }> = [
    { id: 'none', label: 'Normal' },
    { id: 'deep_fried', label: 'Deep Fried 🔥' },
    { id: 'vintage', label: 'Vintage Sepia' },
    { id: 'high_contrast', label: 'High Contrast' },
    { id: 'cyberpunk', label: 'Cyberpunk' },
    { id: 'grayscale', label: 'Dramatic B&W' },
  ];

  const aspectRatios = [
    { id: '1:1', label: '1:1 Square' },
    { id: '16:9', label: '16:9 Landscape' },
    { id: '9:16', label: '9:16 Vertical Reel' },
    { id: '4:3', label: '4:3 Standard' },
    { id: '3:4', label: '3:4 Portrait' },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-xl space-y-4">
      {/* Toolbar Sub-Tabs */}
      <div className="flex items-center p-1 bg-slate-950 border border-slate-800 rounded-2xl gap-1">
        <button
          onClick={() => setActiveTab('text')}
          className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'text'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Type className="w-3.5 h-3.5" />
          <span>Text &amp; Fonts</span>
        </button>

        <button
          onClick={() => setActiveTab('stickers')}
          className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'stickers'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Smile className="w-3.5 h-3.5" />
          <span>Stickers &amp; FX</span>
        </button>

        <button
          onClick={() => setActiveTab('audio')}
          className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 relative ${
            activeTab === 'audio'
              ? 'bg-gradient-to-r from-amber-500 to-purple-600 text-white shadow-md shadow-purple-600/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Music className="w-3.5 h-3.5" />
          <span>Audio Layer</span>
          {(audioConfig?.selectedEffectId || audioConfig?.customAudioUrl) && (
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse ml-0.5" />
          )}
        </button>
      </div>

      {/* TAB 1: TEXT & FONTS */}
      {activeTab === 'text' && (
        <div className="space-y-4">
          {/* 1. Layers Selector & Layer Manager */}
          <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-amber-400" />
            <span>Text Layers ({textLayers.length})</span>
          </label>
          <button
            onClick={onAddLayer}
            className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1 transition-all shadow-md shadow-amber-500/20"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Text
          </button>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {textLayers.map((layer, idx) => {
            const isSelected = activeLayer?.id === layer.id;
            return (
              <div
                key={layer.id}
                onClick={() => onSelectLayer(layer.id)}
                className={`px-3 py-1.5 rounded-xl border text-xs font-semibold cursor-pointer transition-all flex items-center gap-2 whitespace-nowrap ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/10'
                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <span>
                  {layer.text
                    ? layer.text.slice(0, 16) + (layer.text.length > 16 ? '...' : '')
                    : `Layer ${idx + 1}`}
                </span>
                {textLayers.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveLayer(layer.id);
                    }}
                    className={`hover:opacity-80 p-0.5 rounded ${
                      isSelected ? 'text-slate-900' : 'text-slate-500 hover:text-red-400'
                    }`}
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Text Input for Active Layer */}
      {activeLayer && (
        <div className="space-y-3 p-3.5 bg-slate-950/80 border border-slate-800/80 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
              <Type className="w-3.5 h-3.5" />
              Editing Layer Text
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() =>
                  onUpdateLayer(activeLayer.id, { isUppercase: !activeLayer.isUppercase })
                }
                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-all ${
                  activeLayer.isUppercase
                    ? 'bg-amber-400 text-slate-950'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                CAPS
              </button>
              <button
                onClick={() =>
                  onUpdateLayer(activeLayer.id, { isBold: !activeLayer.isBold })
                }
                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-all ${
                  activeLayer.isBold
                    ? 'bg-amber-400 text-slate-950'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                Bold
              </button>
              <button
                onClick={() =>
                  onUpdateLayer(activeLayer.id, { shadow: !activeLayer.shadow })
                }
                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-all ${
                  activeLayer.shadow
                    ? 'bg-amber-400 text-slate-950'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                Glow
              </button>
            </div>
          </div>

          <textarea
            value={activeLayer.text}
            onChange={(e) => onUpdateLayer(activeLayer.id, { text: e.target.value })}
            placeholder="Type meme text here..."
            rows={2}
            className="w-full px-3 py-2 text-sm bg-slate-900 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 font-impact tracking-wide resize-none"
          />

          {/* Font Family Dropdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Font Style
              </label>
              <select
                value={activeLayer.fontFamily}
                onChange={(e) =>
                  onUpdateLayer(activeLayer.id, {
                    fontFamily: e.target.value as TextLayer['fontFamily'],
                  })
                }
                className="w-full px-2.5 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded-xl text-slate-200 focus:outline-none focus:border-amber-400"
              >
                {MEME_FONTS.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                <span>Font Size</span>
                <span className="text-amber-400">{activeLayer.fontSize}px</span>
              </div>
              <input
                type="range"
                min="18"
                max="92"
                value={activeLayer.fontSize}
                onChange={(e) =>
                  onUpdateLayer(activeLayer.id, { fontSize: Number(e.target.value) })
                }
                className="w-full accent-amber-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
            </div>
          </div>

          {/* Color Palettes & Stroke Width */}
          <div className="space-y-2 pt-2 border-t border-slate-800/80">
            {/* Text Color */}
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Palette className="w-3 h-3 text-amber-400" />
                Text Color
              </span>
              <div className="flex items-center gap-1.5">
                {POPULAR_COLORS.map((c) => (
                  <button
                    key={c}
                    onClick={() => onUpdateLayer(activeLayer.id, { textColor: c })}
                    style={{ backgroundColor: c }}
                    className={`w-5 h-5 rounded-full border transition-transform ${
                      activeLayer.textColor === c
                        ? 'scale-125 border-white ring-2 ring-amber-400'
                        : 'border-slate-700 hover:scale-110'
                    }`}
                  />
                ))}
                <input
                  type="color"
                  value={activeLayer.textColor}
                  onChange={(e) => onUpdateLayer(activeLayer.id, { textColor: e.target.value })}
                  className="w-5 h-5 rounded cursor-pointer bg-transparent border-0 p-0"
                />
              </div>
            </div>

            {/* Outline / Stroke Color */}
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Stroke Color
              </span>
              <div className="flex items-center gap-1.5">
                {['#000000', '#ffffff', '#dc2626', '#eab308', '#2563eb', 'transparent'].map((c) => (
                  <button
                    key={c}
                    onClick={() => onUpdateLayer(activeLayer.id, { outlineColor: c })}
                    style={{ backgroundColor: c === 'transparent' ? '#1e293b' : c }}
                    className={`w-5 h-5 rounded-full border transition-transform ${
                      activeLayer.outlineColor === c
                        ? 'scale-125 border-white ring-2 ring-amber-400'
                        : 'border-slate-700 hover:scale-110'
                    }`}
                    title={c === 'transparent' ? 'No Outline' : c}
                  />
                ))}
                <input
                  type="color"
                  value={activeLayer.outlineColor === 'transparent' ? '#000000' : activeLayer.outlineColor}
                  onChange={(e) => onUpdateLayer(activeLayer.id, { outlineColor: e.target.value })}
                  className="w-5 h-5 rounded cursor-pointer bg-transparent border-0 p-0"
                />
              </div>
            </div>

            {/* Stroke Thickness Slider */}
            <div className="flex items-center gap-3 pt-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">
                Outline Width ({activeLayer.outlineWidth}px)
              </span>
              <input
                type="range"
                min="0"
                max="10"
                value={activeLayer.outlineWidth}
                onChange={(e) =>
                  onUpdateLayer(activeLayer.id, { outlineWidth: Number(e.target.value) })
                }
                className="flex-1 accent-amber-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
            </div>

            {/* Alignment & Highlight */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onUpdateLayer(activeLayer.id, { textAlign: 'left' })}
                  className={`p-1.5 rounded-lg ${
                    activeLayer.textAlign === 'left' ? 'bg-amber-400 text-slate-950' : 'text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <AlignLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onUpdateLayer(activeLayer.id, { textAlign: 'center' })}
                  className={`p-1.5 rounded-lg ${
                    activeLayer.textAlign === 'center' ? 'bg-amber-400 text-slate-950' : 'text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <AlignCenter className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onUpdateLayer(activeLayer.id, { textAlign: 'right' })}
                  className={`p-1.5 rounded-lg ${
                    activeLayer.textAlign === 'right' ? 'bg-amber-400 text-slate-950' : 'text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <AlignRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Background Highlight Box */}
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Pill Box:</span>
                {[
                  { label: 'None', color: 'transparent' },
                  { label: 'Dark', color: 'rgba(0, 0, 0, 0.75)' },
                  { label: 'White', color: 'rgba(255, 255, 255, 0.9)' },
                  { label: 'Red', color: 'rgba(220, 38, 38, 0.85)' },
                  { label: 'Yellow', color: 'rgba(234, 179, 8, 0.9)' },
                ].map((bg) => (
                  <button
                    key={bg.label}
                    onClick={() => onUpdateLayer(activeLayer.id, { backgroundColor: bg.color })}
                    className={`px-1.5 py-0.5 rounded text-[10px] font-semibold border ${
                      activeLayer.backgroundColor === bg.color
                        ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                        : 'bg-slate-900 border-slate-700 text-slate-400'
                    }`}
                  >
                    {bg.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
        </div>
      )}
      {/* End of TAB 1: TEXT & FONTS */}

      {/* TAB 2: STICKERS & FILTERS */}
      {activeTab === 'stickers' && (
        <div className="space-y-4">
          {/* 3. Meme Stickers / Badges */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Smile className="w-4 h-4 text-amber-400" />
                Meme Stickers &amp; Emojis
              </span>
              {stickers.length > 0 && (
                <span className="text-[10px] text-slate-500 font-semibold lowercase">
                  {stickers.length} active
                </span>
              )}
            </label>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
              {MEME_STICKER_PRESETS.map((stk) => (
                <button
                  key={stk.type}
                  onClick={() => onAddSticker(stk.type, stk.emoji, stk.label)}
                  className="p-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-400/80 hover:bg-slate-800/80 text-center transition-all flex flex-col items-center gap-1 min-w-[56px] group"
                >
                  <span className="text-xl group-hover:scale-125 transition-transform">
                    {stk.emoji}
                  </span>
                  <span className="text-[9px] text-slate-400 font-medium whitespace-nowrap">
                    {stk.label}
                  </span>
                </button>
              ))}
            </div>

            {/* Active Stickers Pills with remove */}
            {stickers.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {stickers.map((s) => (
                  <span
                    key={s.id}
                    className="px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-[11px] text-slate-300 flex items-center gap-1.5"
                  >
                    <span>{s.emoji}</span>
                    <span>{s.label}</span>
                    <button
                      onClick={() => onRemoveSticker(s.id)}
                      className="hover:text-red-400 text-slate-500"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* 4. Canvas Filters & Aspect Ratio */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-800">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5 flex items-center gap-1">
                <Sliders className="w-3 h-3 text-amber-400" />
                Meme Filter
              </label>
              <select
                value={filter}
                onChange={(e) => onFilterChange(e.target.value as CanvasFilter)}
                className="w-full px-2.5 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-amber-400"
              >
                {filtersList.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5 flex items-center gap-1">
                <Ratio className="w-3 h-3 text-amber-400" />
                Aspect Ratio
              </label>
              <select
                value={aspectRatio}
                onChange={(e) => onAspectRatioChange(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-amber-400"
              >
                {aspectRatios.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
      {/* End of TAB 2 */}

      {/* TAB 3: AUDIO LAYER */}
      {activeTab === 'audio' && (
        <MemeAudioLayerPanel
          audioConfig={
            audioConfig || {
              selectedEffectId: null,
              volume: 1,
              playbackRate: 1,
              loop: false,
              delaySec: 0,
            }
          }
          onChangeAudioConfig={onChangeAudioConfig || (() => {})}
          onExportVideoWithAudio={onExportVideoWithAudio || (() => {})}
          isExportingVideo={isExportingVideo}
          exportProgress={exportProgress}
        />
      )}

      {/* Attached Audio Notification Strip when on another tab */}
      {activeTab !== 'audio' && (audioConfig?.selectedEffectId || audioConfig?.customAudioUrl) && (
        <div className="p-2.5 bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-indigo-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-lg">{activeAudioEffect?.emoji || '🎵'}</span>
            <div className="min-w-0">
              <span className="text-xs font-bold text-amber-300 truncate block">
                Sound Attached: {audioConfig.customAudioName || activeAudioEffect?.name || 'Meme SFX'}
              </span>
              <span className="text-[10px] text-slate-400">Attached to your video exports</span>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('audio')}
            className="px-2.5 py-1 text-[11px] font-bold text-amber-300 hover:text-amber-200 bg-amber-500/20 hover:bg-amber-500/30 rounded-lg border border-amber-500/40 transition-all flex-shrink-0"
          >
            Adjust SFX
          </button>
        </div>
      )}

      {/* 5. Export Actions */}
      <div className="pt-2 border-t border-slate-800 space-y-2">
        {/* If audio is attached, prominent video export button */}
        {(audioConfig?.selectedEffectId || audioConfig?.customAudioUrl) && onExportVideoWithAudio && (
          <button
            onClick={onExportVideoWithAudio}
            disabled={isExportingVideo}
            className={`w-full px-4 py-2.5 bg-gradient-to-r from-purple-600 via-indigo-600 to-amber-500 hover:from-purple-500 hover:to-amber-400 text-white font-black text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-purple-500/25 transition-all active:scale-95 ${
              isExportingVideo ? 'opacity-70 cursor-wait' : ''
            }`}
          >
            <Film className="w-4 h-4 text-amber-300" />
            <span>
              {isExportingVideo
                ? 'Recording Video with Audio...'
                : '🎬 Export Video Meme with Audio (.webm)'}
            </span>
          </button>
        )}

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onDownload('png')}
            className="flex-1 min-w-[130px] px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-500/20 active:scale-95"
          >
            <Download className="w-4 h-4" />
            Download HD PNG
          </button>

          <button
            onClick={onCopyToClipboard}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all border border-slate-700 active:scale-95"
          >
            {copiedToast ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy Meme
              </>
            )}
          </button>

          {!(audioConfig?.selectedEffectId || audioConfig?.customAudioUrl) && (
            <button
              onClick={() => setActiveTab('audio')}
              className="px-3 py-2.5 bg-slate-950 hover:bg-purple-950/60 text-purple-300 hover:text-purple-200 font-bold text-xs rounded-xl border border-purple-500/30 transition-all flex items-center gap-1.5"
              title="Add sound effect to export as video"
            >
              <Music className="w-3.5 h-3.5 text-amber-400" />
              <span>Add Audio</span>
            </button>
          )}

          <button
            onClick={() => onDownload('jpeg')}
            className="px-3 py-2.5 bg-slate-950 hover:bg-slate-800 text-slate-300 font-semibold text-xs rounded-xl border border-slate-800 transition-all"
          >
            JPEG
          </button>
        </div>
      </div>
    </div>
  );
};
