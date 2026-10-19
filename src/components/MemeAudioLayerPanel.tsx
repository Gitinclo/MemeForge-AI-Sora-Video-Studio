import React, { useState, useRef } from 'react';
import {
  MemeAudioConfig,
  MemeAudioEffect,
} from '../types/meme';
import {
  MEME_AUDIO_EFFECTS,
  playMemeAudio,
  stopMemeAudio,
  downloadMemeAudioTrack,
} from '../utils/memeAudioEngine';
import {
  Volume2,
  VolumeX,
  Play,
  Square,
  Music,
  Upload,
  Check,
  Trash2,
  Sliders,
  Download,
  Film,
  Sparkles,
  Repeat,
  Gauge,
  Search,
} from 'lucide-react';

interface MemeAudioLayerPanelProps {
  audioConfig: MemeAudioConfig;
  onChangeAudioConfig: (updates: Partial<MemeAudioConfig>) => void;
  onExportVideoWithAudio: () => void;
  isExportingVideo: boolean;
  exportProgress: { percent: number; status: string } | null;
}

export const MemeAudioLayerPanel: React.FC<MemeAudioLayerPanelProps> = ({
  audioConfig,
  onChangeAudioConfig,
  onExportVideoWithAudio,
  isExportingVideo,
  exportProgress,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [previewingId, setPreviewingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const categories = ['All', 'Gaming', 'Dramatic', 'Funny', 'Reactions', 'Classic'];

  const filteredEffects = MEME_AUDIO_EFFECTS.filter((effect) => {
    const matchesCategory =
      selectedCategory === 'All' || effect.category === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === '' ||
      effect.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      effect.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      effect.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const activeEffect = MEME_AUDIO_EFFECTS.find(
    (e) => e.id === audioConfig.selectedEffectId
  );

  const handlePreview = (effect: MemeAudioEffect) => {
    if (previewingId === effect.id) {
      stopMemeAudio();
      setPreviewingId(null);
      return;
    }

    setPreviewingId(effect.id);
    playMemeAudio(
      {
        selectedEffectId: effect.id,
        volume: audioConfig.volume,
        playbackRate: audioConfig.playbackRate,
        loop: false,
        delaySec: 0,
      },
      () => {
        setPreviewingId(null);
      }
    );
  };

  const handleSelectEffect = (effectId: string) => {
    stopMemeAudio();
    setPreviewingId(null);
    onChangeAudioConfig({
      selectedEffectId: effectId,
      customAudioUrl: undefined,
      customAudioName: undefined,
    });
    // Play brief test preview
    playMemeAudio({
      selectedEffectId: effectId,
      volume: audioConfig.volume,
      playbackRate: audioConfig.playbackRate,
      loop: false,
      delaySec: 0,
    });
  };

  const handleCustomAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    onChangeAudioConfig({
      selectedEffectId: 'custom',
      customAudioUrl: url,
      customAudioName: file.name,
    });
    // Brief test preview
    playMemeAudio({
      selectedEffectId: null,
      customAudioUrl: url,
      volume: audioConfig.volume,
      playbackRate: audioConfig.playbackRate,
      loop: false,
      delaySec: 0,
    });
  };

  const handleRemoveAudio = () => {
    stopMemeAudio();
    setPreviewingId(null);
    onChangeAudioConfig({
      selectedEffectId: null,
      customAudioUrl: undefined,
      customAudioName: undefined,
    });
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-purple-600 flex items-center justify-center text-slate-950 font-black shadow-md shadow-amber-500/20">
            <Music className="w-4 h-4 text-slate-950 stroke-[2.5]" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-black text-slate-100 flex items-center gap-1.5 uppercase tracking-wider">
              <span>Audio Layer</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Meme SFX
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Attach iconic meme sounds (air horns, laugh tracks, sad violins) to your export
            </p>
          </div>
        </div>

        {/* Detach / Active badge */}
        {(audioConfig.selectedEffectId || audioConfig.customAudioUrl) && (
          <button
            onClick={handleRemoveAudio}
            className="px-2.5 py-1 text-[11px] font-bold text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg border border-red-500/20 flex items-center gap-1 transition-all"
            title="Detach audio from meme"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Detach</span>
          </button>
        )}
      </div>

      {/* Currently Attached Sound Banner */}
      {(audioConfig.selectedEffectId || audioConfig.customAudioUrl) ? (
        <div className="p-3 bg-gradient-to-r from-amber-500/15 via-purple-500/10 to-indigo-500/15 border border-amber-500/30 rounded-2xl flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">{activeEffect?.emoji || '🎵'}</span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-amber-300">
                  {audioConfig.customAudioName || activeEffect?.name || 'Attached Sound'}
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-200 border border-amber-500/30 font-semibold">
                  {activeEffect ? `${activeEffect.durationSec}s` : 'Custom Audio'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 truncate max-w-[280px]">
                {activeEffect?.description || 'Custom sound attached to your meme exports'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (previewingId === 'active') {
                  stopMemeAudio();
                  setPreviewingId(null);
                } else {
                  setPreviewingId('active');
                  playMemeAudio(audioConfig, () => setPreviewingId(null));
                }
              }}
              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-md shadow-amber-500/20"
            >
              {previewingId === 'active' ? (
                <>
                  <Square className="w-3.5 h-3.5 fill-current" />
                  <span>Stop</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Test Audio</span>
                </>
              )}
            </button>

            {activeEffect && (
              <button
                onClick={() => downloadMemeAudioTrack(audioConfig, `${activeEffect.id}_meme.wav`)}
                className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl border border-slate-700 transition-colors"
                title="Download Audio Track as .WAV"
              >
                <Download className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="p-3 bg-slate-950/60 border border-dashed border-slate-800 rounded-2xl flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <VolumeX className="w-4 h-4 text-slate-500" />
            <span>No sound attached yet. Choose an iconic meme SFX below!</span>
          </div>
        </div>
      )}

      {/* Audio Controls: Volume, Speed, Loop */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-slate-950 border border-slate-800/80 rounded-2xl">
        {/* Volume */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
            <span className="flex items-center gap-1">
              <Volume2 className="w-3 h-3 text-amber-400" />
              Volume
            </span>
            <span className="text-amber-400 font-mono">{Math.round((audioConfig.volume ?? 1) * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={audioConfig.volume ?? 1}
            onChange={(e) => onChangeAudioConfig({ volume: parseFloat(e.target.value) })}
            className="w-full accent-amber-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
          />
        </div>

        {/* Playback Rate / Speed */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
            <span className="flex items-center gap-1">
              <Gauge className="w-3 h-3 text-purple-400" />
              Speed
            </span>
            <span className="text-purple-400 font-mono">{audioConfig.playbackRate ?? 1.0}x</span>
          </div>
          <div className="flex gap-1">
            {[0.75, 1.0, 1.25, 1.5].map((rate) => (
              <button
                key={rate}
                onClick={() => onChangeAudioConfig({ playbackRate: rate })}
                className={`flex-1 py-1 text-[10px] font-bold rounded-lg border transition-all ${
                  (audioConfig.playbackRate ?? 1.0) === rate
                    ? 'bg-purple-600 text-white border-purple-500 shadow-sm'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {rate}x
              </button>
            ))}
          </div>
        </div>

        {/* Loop Toggle */}
        <div className="space-y-1">
          <span className="text-[11px] font-bold text-slate-400 block mb-1">Playback Mode</span>
          <button
            onClick={() => onChangeAudioConfig({ loop: !audioConfig.loop })}
            className={`w-full py-1.5 px-3 text-xs font-bold rounded-xl border flex items-center justify-center gap-1.5 transition-all ${
              audioConfig.loop
                ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Repeat className="w-3.5 h-3.5" />
            <span>{audioConfig.loop ? 'Looping Enabled' : 'Single Play'}</span>
          </button>
        </div>
      </div>

      {/* Category Pills & Search Bar */}
      <div className="space-y-2">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
          {/* Category tabs */}
          <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                  selectedCategory === cat
                    ? 'bg-slate-800 text-amber-400 border-amber-500/40 shadow-sm'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="relative min-w-[160px]">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search sounds..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-2.5 py-1 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>

        {/* Sound Effects List (Single column for pristine readability in sidebar) */}
        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1 scrollbar-thin">
          {filteredEffects.map((effect) => {
            const isSelected = audioConfig.selectedEffectId === effect.id;
            const isPreviewing = previewingId === effect.id;

            return (
              <div
                key={effect.id}
                className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 group ${
                  isSelected
                    ? 'bg-gradient-to-r from-amber-500/20 via-purple-500/15 to-transparent border-amber-400 shadow-md shadow-amber-500/10'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
                }`}
              >
                <div
                  onClick={() => handleSelectEffect(effect.id)}
                  className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer"
                >
                  <span className="text-2xl group-hover:scale-110 transition-transform flex-shrink-0">
                    {effect.emoji}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold transition-colors truncate ${
                        isSelected ? 'text-amber-300' : 'text-slate-100 group-hover:text-amber-300'
                      }`}>
                        {effect.name}
                      </span>
                      {isSelected && (
                        <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-amber-500 text-slate-950 flex-shrink-0">
                          Active
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">
                      {effect.description}
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-500">
                      <span className="px-1.5 py-0.2 rounded bg-slate-900 border border-slate-800 font-medium">
                        {effect.category}
                      </span>
                      <span>•</span>
                      <span>{effect.durationSec}s duration</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {/* Preview test button */}
                  <button
                    onClick={() => handlePreview(effect)}
                    aria-label={`Test preview ${effect.name}`}
                    data-testid={`test-${effect.id}`}
                    className={`px-2.5 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1 transition-all ${
                      isPreviewing
                        ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800'
                    }`}
                    title={isPreviewing ? 'Stop Preview' : 'Play Preview'}
                  >
                    {isPreviewing ? (
                      <>
                        <Square className="w-3.5 h-3.5 fill-current" />
                        <span className="text-[11px]">Stop</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 fill-current text-amber-400" />
                        <span className="text-[11px]">Test</span>
                      </>
                    )}
                  </button>

                  {/* Attach / Select button */}
                  <button
                    onClick={() => handleSelectEffect(effect.id)}
                    aria-label={`Attach ${effect.name}`}
                    data-testid={`attach-${effect.id}`}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 hover:bg-emerald-400'
                        : 'bg-slate-900 text-slate-300 hover:bg-amber-500/20 hover:text-amber-300 border border-slate-800'
                    }`}
                  >
                    {isSelected ? (
                      <>
                        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>Attached</span>
                      </>
                    ) : (
                      <span>Attach</span>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Upload Custom Sound & Video Export Action Bar */}
      <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
        <div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleCustomAudioUpload}
            accept="audio/mp3,audio/wav,audio/ogg,audio/m4a,audio/*"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-3 py-2 bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl border border-slate-800 text-xs font-bold flex items-center gap-1.5 transition-all"
          >
            <Upload className="w-3.5 h-3.5 text-purple-400" />
            <span>Upload Custom Audio</span>
          </button>
        </div>

        {/* Video Meme Export with Audio Button */}
        {(audioConfig.selectedEffectId || audioConfig.customAudioUrl) && (
          <button
            onClick={onExportVideoWithAudio}
            disabled={isExportingVideo}
            className={`px-4 py-2 bg-gradient-to-r from-purple-600 via-indigo-600 to-amber-500 hover:from-purple-500 hover:to-amber-400 text-white font-black text-xs rounded-xl flex items-center gap-2 shadow-lg shadow-purple-500/25 transition-all active:scale-95 ${
              isExportingVideo ? 'opacity-70 cursor-wait' : ''
            }`}
          >
            <Film className="w-4 h-4 text-amber-300" />
            <span>
              {isExportingVideo
                ? 'Recording Video...'
                : '🎬 Export Video Meme with Audio (.webm)'}
            </span>
          </button>
        )}
      </div>

      {/* Export progress banner if active */}
      {isExportingVideo && exportProgress && (
        <div className="p-3 bg-purple-950/40 border border-purple-500/30 rounded-2xl space-y-1.5 animate-pulse">
          <div className="flex items-center justify-between text-xs font-bold text-purple-200">
            <span>{exportProgress.status}</span>
            <span>{exportProgress.percent}%</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-purple-500 to-amber-400 h-full transition-all duration-150"
              style={{ width: `${exportProgress.percent}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
