import React, { useState } from 'react';
import { MagicCaption } from '../types/meme';
import { Wand2, Sparkles, Check, RefreshCw, ChevronRight, Eye } from 'lucide-react';

interface AiCaptionSuggestionsBarProps {
  captions: MagicCaption[];
  detectedScene: string;
  isLoading: boolean;
  onSelectCaption: (caption: MagicCaption) => void;
  onOpenFullModal: () => void;
  onRefresh: () => void;
  activeCaptionText?: string;
}

export const AiCaptionSuggestionsBar: React.FC<AiCaptionSuggestionsBarProps> = ({
  captions,
  detectedScene,
  isLoading,
  onSelectCaption,
  onOpenFullModal,
  onRefresh,
  activeCaptionText,
}) => {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  if (captions.length === 0 && !isLoading) {
    return null;
  }

  return (
    <div className="p-3 bg-gradient-to-r from-purple-950/40 via-slate-900 to-indigo-950/40 border border-purple-500/30 rounded-2xl shadow-xl space-y-2.5 animate-in fade-in duration-300">
      {/* Top status bar */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-amber-500 to-purple-600 flex items-center justify-center text-slate-950 flex-shrink-0">
            <Sparkles className="w-3.5 h-3.5 text-slate-950 stroke-[2.5]" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-purple-200 tracking-wide uppercase">
                AI Vision Captions
              </span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold">
                5 Suggestions
              </span>
            </div>
            {detectedScene && (
              <p className="text-[11px] text-amber-300/90 truncate max-w-[400px]">
                🔍 <span className="text-slate-400">Context:</span> {detectedScene}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="p-1.5 px-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl border border-slate-700/60 text-[11px] font-bold flex items-center gap-1 transition-all"
            title="Generate 5 new AI captions"
          >
            <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin text-amber-400' : ''}`} />
            <span className="hidden sm:inline">Reroll</span>
          </button>

          <button
            onClick={onOpenFullModal}
            className="p-1.5 px-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-[11px] font-bold flex items-center gap-1 transition-all shadow-md shadow-purple-600/20"
          >
            <Wand2 className="w-3 h-3 text-amber-300" />
            <span>Customize Tone</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Suggestion Chips (1-click overlay) */}
      {isLoading ? (
        <div className="flex items-center gap-2 py-2 text-xs text-purple-300 animate-pulse">
          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          <span>Analyzing visual content, detected objects & facial expressions with Gemini...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-1.5">
          {captions.slice(0, 5).map((cap, idx) => {
            const isApplied =
              selectedIdx === idx ||
              activeCaptionText === cap.topText ||
              activeCaptionText === cap.singleLine;

            return (
              <button
                key={idx}
                onClick={() => {
                  setSelectedIdx(idx);
                  onSelectCaption(cap);
                }}
                className={`p-2 rounded-xl border text-left transition-all flex flex-col justify-between group ${
                  isApplied
                    ? 'bg-emerald-500/20 border-emerald-400 shadow-md shadow-emerald-500/10'
                    : 'bg-slate-950/80 border-slate-800 hover:border-purple-400 hover:bg-slate-850'
                }`}
                title={`Overlay on meme: "${cap.topText} - ${cap.bottomText}"`}
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.2 rounded bg-slate-900 border border-slate-800 text-purple-300 truncate">
                      {cap.vibe || `Meme #${idx + 1}`}
                    </span>
                    {isApplied && (
                      <span className="text-[9px] text-emerald-400 font-bold flex items-center gap-0.5">
                        <Check className="w-2.5 h-2.5" />
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] font-bold text-slate-100 group-hover:text-amber-300 transition-colors line-clamp-2 leading-tight">
                    {cap.topText}
                  </p>
                  {cap.bottomText && (
                    <p className="text-[10px] text-amber-400/90 truncate mt-0.5 font-medium">
                      {cap.bottomText}
                    </p>
                  )}
                </div>

                <div className="mt-1.5 pt-1 border-t border-slate-800/80 text-[9px] font-bold text-slate-400 group-hover:text-purple-300 flex items-center justify-between">
                  <span>Overlay</span>
                  <span className="text-purple-400 font-mono">#{idx + 1}</span>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
