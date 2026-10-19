import React, { useState } from 'react';
import { MagicCaption } from '../types/meme';
import { Sparkles, Wand2, X, RefreshCw, Check, Flame, MessageSquare, AlertCircle } from 'lucide-react';

interface MagicCaptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCaption: (caption: MagicCaption) => void;
  currentImagePreview: string;
  templateName: string;
}

export const MagicCaptionModal: React.FC<MagicCaptionModalProps> = ({
  isOpen,
  onClose,
  onSelectCaption,
  currentImagePreview,
  templateName,
}) => {
  const [tone, setTone] = useState<string>('sarcastic');
  const [topic, setTopic] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [captions, setCaptions] = useState<MagicCaption[]>([]);
  const [appliedIndex, setAppliedIndex] = useState<number | null>(null);
  const [detectedScene, setDetectedScene] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const TONES = [
    { id: 'sarcastic', label: 'Sarcastic & Witty', emoji: '😏', desc: 'Irony, deadpan humor & daily struggles' },
    { id: 'gen_z', label: 'Gen Z / Brainrot', emoji: '💀', desc: 'Main character, no cap, crash out' },
    { id: 'tech_dev', label: 'Tech & Developer', emoji: '💻', desc: 'Git force push, production down, div centering' },
    { id: 'corporate', label: 'Corporate Office', emoji: '💼', desc: 'Per my last email, synergy, meeting fatigue' },
    { id: 'wholesome', label: 'Wholesome & Pure', emoji: '💖', desc: 'Cute pets, supportive friends, small wins' },
  ];

  const fetchMagicCaptions = async (selectedTone = tone, selectedTopic = topic) => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const response = await fetch('/api/magic-captions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: currentImagePreview.startsWith('data:') ? currentImagePreview : undefined,
          templateName: templateName || 'Custom Meme',
          tone: selectedTone,
          topic: selectedTopic,
        }),
      });

      const data = await response.json();
      if (data.captions && Array.isArray(data.captions)) {
        setCaptions(data.captions);
        if (data.detectedScene) {
          setDetectedScene(data.detectedScene);
        }
      } else {
        setErrorMessage('Failed to generate captions. Please try another tone or topic.');
      }
    } catch (err: any) {
      console.error('Error fetching magic captions:', err);
      setErrorMessage(err.message || 'Network error fetching captions.');
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-fetch if opened and captions list is empty
  React.useEffect(() => {
    if (isOpen && captions.length === 0 && !isLoading) {
      fetchMagicCaptions();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="relative p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-indigo-500/10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-amber-500 to-purple-600 text-white shadow-lg shadow-amber-500/20">
              <Wand2 className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-white tracking-tight">AI Magic Caption</h3>
                <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider bg-amber-400 text-slate-950 rounded-full">
                  Gemini Vision
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Analyzes image visual context &amp; suggests 5 viral comedy captions
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {/* Tone Selector */}
          <div>
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
              <span>Choose Comedy Tone</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {TONES.map((t) => {
                const isSelected = tone === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => {
                      setTone(t.id);
                      fetchMagicCaptions(t.id, topic);
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-amber-500/20 border-amber-500 text-white shadow-md shadow-amber-500/10'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="text-base">{t.emoji}</span>
                      <span className="text-xs font-bold truncate">{t.label}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1 line-clamp-1">{t.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Optional Topic Input */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') fetchMagicCaptions();
              }}
              placeholder="Optional: Add topic (e.g. coffee addiction, gym, debugging, crypto)..."
              className="flex-1 px-3.5 py-2 text-sm bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
            />
            <button
              onClick={() => fetchMagicCaptions()}
              disabled={isLoading}
              className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-md shadow-amber-500/20 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <RefreshCw className="w-3.5 h-3.5" />
                  Reroll
                </>
              )}
            </button>
          </div>

          {errorMessage && (
            <div className="p-3 bg-red-950/40 border border-red-800/60 rounded-xl text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Captions List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400 font-semibold uppercase tracking-wider">
              <span>5 AI Generated Captions (Click any to overlay)</span>
              {detectedScene && (
                <span className="text-[11px] text-amber-400/90 font-medium normal-case truncate max-w-[280px]">
                  Scene: {detectedScene}
                </span>
              )}
            </div>

            {isLoading ? (
              <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
                <div className="relative">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-purple-600 animate-spin flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Analyzing Meme Context...</h4>
                  <p className="text-xs text-slate-400 mt-1 max-w-sm">
                    Reading facial expressions, scene dynamics and comedy timing for {templateName}
                  </p>
                </div>
              </div>
            ) : (
              captions.map((item, idx) => {
                const isJustApplied = appliedIndex === idx;
                return (
                  <div
                    key={idx}
                    onClick={() => {
                      setAppliedIndex(idx);
                      onSelectCaption(item);
                      setTimeout(() => {
                        onClose();
                      }, 400);
                    }}
                    className={`group relative p-4 rounded-2xl border cursor-pointer transition-all ${
                      isJustApplied
                        ? 'bg-emerald-500/15 border-emerald-500 shadow-lg shadow-emerald-500/10'
                        : 'bg-slate-950/70 border-slate-800/90 hover:border-amber-500/70 hover:bg-slate-800/60 hover:shadow-xl'
                    }`}
                  >
                    {/* Header tags */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-400 text-[10px] font-bold uppercase tracking-wider border border-amber-500/30">
                          {item.vibe || `Caption #${idx + 1}`}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {item.category}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-400 group-hover:text-amber-400 font-bold transition-colors">
                        {isJustApplied ? (
                          <span className="text-emerald-400 flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" /> Applied!
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            <Sparkles className="w-3.5 h-3.5" /> Click to Overlay
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Meme Text Display */}
                    <div className="space-y-1.5 font-impact uppercase tracking-wide text-white">
                      {item.topText && (
                        <div className="text-base sm:text-lg text-slate-100 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                          {item.topText}
                        </div>
                      )}
                      {item.bottomText && (
                        <div className="text-sm sm:text-base text-amber-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                          {item.bottomText}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Powered by Gemini Multi-modal Intelligence
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
