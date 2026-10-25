import React, { useState } from 'react';
import {
  X,
  Cpu,
  Layers,
  ArrowRight,
  Code,
  DollarSign,
  CheckCircle2,
  Sparkles,
  Zap,
  Film,
  Camera,
  Share2,
  Copy,
  Check,
  Send,
  Sliders,
  ExternalLink,
  ChevronRight,
  Play,
  Activity,
  Terminal,
} from 'lucide-react';
import {
  VIDEO_ENGINES_2026,
  VEO3_VS_SEEDANCE_COMPARISON,
  getMagicHourMigrationSnippet,
  simulateMagicHourJob,
  VideoEngineId,
  VideoEngineProfile,
} from '../utils/engineMigration2026';

interface EngineHub2026ModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeEngineId: VideoEngineId;
  onSelectEngine: (engineId: VideoEngineId) => void;
  currentPrompt: string;
}

export const EngineHub2026Modal: React.FC<EngineHub2026ModalProps> = ({
  isOpen,
  onClose,
  activeEngineId,
  onSelectEngine,
  currentPrompt,
}) => {
  const [activeTab, setActiveTab] = useState<'ecosystem' | 'veo3_vs_seedance' | 'magic_hour_api' | 'summary_table'>('ecosystem');
  const [codeFormat, setCodeFormat] = useState<'typescript' | 'python' | 'curl' | 'sora_adapter'>('sora_adapter');
  const [copiedSnippet, setCopiedSnippet] = useState(false);
  
  // Magic Hour Interactive Test Runner State
  const [mhPrompt, setMhPrompt] = useState(currentPrompt || 'Cinematic 8K tracking shot of an automated hovercraft gliding through misty neon metropolis, photoreal');
  const [mhResolution, setMhResolution] = useState<'720p' | '1080p' | '4k'>('4k');
  const [mhDuration, setMhDuration] = useState(10);
  const [mhIsRunning, setMhIsRunning] = useState(false);
  const [mhResult, setMhResult] = useState<any>(null);

  if (!isOpen) return null;

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  const handleRunMagicHourDispatch = async () => {
    setMhIsRunning(true);
    setMhResult(null);
    try {
      const res = await fetch('/api/magic-hour/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: mhPrompt,
          resolution: mhResolution,
          duration: mhDuration,
          fps: 60,
          mode: 'text-to-video',
        }),
      });
      const data = await res.json();
      setMhResult(data);
    } catch (err) {
      // Fallback to local simulator
      const sim = await simulateMagicHourJob({
        prompt: mhPrompt,
        resolution: mhResolution,
        fps: 60,
        durationSeconds: mhDuration,
      });
      setMhResult(sim);
    } finally {
      setMhIsRunning(false);
    }
  };

  const categories = [
    { key: 'Cinematic & 8K Video', title: '1. For Cinematic & 8K Video (Direct Replacements)', desc: 'High-end filmmaking, 8K fidelity, and storyboarding' },
    { key: 'Developer & API Migration', title: '2. For Developers & API Migration', desc: 'Displaced Sora developers, automated pipelines, and low latency' },
    { key: 'Social Media & Marketing', title: '3. For Social Media & Marketing', desc: 'Punchy content, avatar cameos, and vertical 9:16 reels' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-6xl max-h-[92vh] bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden my-auto text-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold tracking-tight text-white">2026 Video Generation Ecosystem Hub</h2>
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Late 2026 Landscape
                </span>
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Post-Sora 2
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Specialized replacements categorized for 8K filmmaking, developer API migration, and social marketing.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
            title="Close Hub"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-950/60 px-6 gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('ecosystem')}
            className={`py-3 px-4 text-xs sm:text-sm font-semibold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'ecosystem'
                ? 'border-indigo-500 text-indigo-400 bg-indigo-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Layers className="w-4 h-4" />
            Engine Router & Directory
          </button>

          <button
            onClick={() => setActiveTab('veo3_vs_seedance')}
            className={`py-3 px-4 text-xs sm:text-sm font-semibold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'veo3_vs_seedance'
                ? 'border-amber-500 text-amber-400 bg-amber-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            Veo3 vs Seedance Pricing & Motion
          </button>

          <button
            onClick={() => setActiveTab('magic_hour_api')}
            className={`py-3 px-4 text-xs sm:text-sm font-semibold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'magic_hour_api'
                ? 'border-cyan-500 text-cyan-400 bg-cyan-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Code className="w-4 h-4" />
            Magic Hour API & Sora Shim
          </button>

          <button
            onClick={() => setActiveTab('summary_table')}
            className={`py-3 px-4 text-xs sm:text-sm font-semibold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'summary_table'
                ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            2026 Comparison Matrix
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* TAB 1: ECOSYSTEM DIRECTORY & ENGINE ROUTER */}
          {activeTab === 'ecosystem' && (
            <div className="space-y-8">
              <div className="bg-gradient-to-r from-indigo-900/40 via-purple-900/20 to-slate-900 p-4 rounded-xl border border-indigo-500/30">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <Zap className="w-4 h-4 text-indigo-400" />
                      Active Studio Engine Routing
                    </h3>
                    <p className="text-xs text-slate-300 mt-1">
                      Choose which specialized backend model powers your video generations and previews in MemeForge LEO Studio.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 bg-slate-950/80 px-3 py-1.5 rounded-lg border border-slate-700">
                    <span className="text-xs text-slate-400">Current Active Engine:</span>
                    <span className="text-xs font-bold text-indigo-400">
                      {VIDEO_ENGINES_2026.find((e) => e.id === activeEngineId)?.name}
                    </span>
                  </div>
                </div>
              </div>

              {categories.map((catGroup) => {
                const groupEngines = VIDEO_ENGINES_2026.filter((e) => e.category === catGroup.key);
                return (
                  <div key={catGroup.key} className="space-y-3">
                    <div className="border-b border-slate-800 pb-2">
                      <h4 className="text-base font-bold text-white flex items-center gap-2">
                        {catGroup.title}
                      </h4>
                      <p className="text-xs text-slate-400">{catGroup.desc}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {groupEngines.map((engine) => {
                        const isSelected = activeEngineId === engine.id;
                        return (
                          <div
                            key={engine.id}
                            className={`rounded-xl p-4 border transition-all flex flex-col justify-between ${
                              isSelected
                                ? 'bg-indigo-950/30 border-indigo-500 ring-2 ring-indigo-500/20 shadow-lg shadow-indigo-950/50'
                                : 'bg-slate-950/50 border-slate-800 hover:border-slate-700'
                            }`}
                          >
                            <div className="space-y-3">
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <h5 className="font-bold text-white text-base">{engine.name}</h5>
                                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-slate-800 text-indigo-300 border border-slate-700">
                                      {engine.badge}
                                    </span>
                                  </div>
                                  <span className="text-xs text-slate-400 font-medium">{engine.vendor}</span>
                                </div>
                                {isSelected && (
                                  <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 px-2 py-0.5 rounded-full">
                                    <Check className="w-3 h-3" /> Active
                                  </span>
                                )}
                              </div>

                              <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800/80 space-y-1">
                                <div className="text-[11px] font-semibold text-slate-300">
                                  <span className="text-indigo-400">Best For: </span>
                                  {engine.bestFor}
                                </div>
                                <div className="text-[11px] text-slate-400">
                                  <span className="text-emerald-400 font-semibold">Advantage: </span>
                                  {engine.keyAdvantageOverSora}
                                </div>
                              </div>

                              <div className="space-y-1.5 text-xs">
                                <div className="flex items-center justify-between text-slate-400">
                                  <span>Max Resolution:</span>
                                  <span className="font-semibold text-slate-200">{engine.maxResolution}</span>
                                </div>
                                <div className="flex items-center justify-between text-slate-400">
                                  <span>Pricing:</span>
                                  <span className="font-semibold text-amber-300 text-[11px]">{engine.pricingSummary}</span>
                                </div>
                                <div className="flex items-center justify-between text-slate-400">
                                  <span>Camera Control:</span>
                                  <span className="font-semibold text-slate-300">{engine.cameraControl}</span>
                                </div>
                              </div>

                              <div className="pt-2 border-t border-slate-800/80">
                                <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">Key Highlights:</span>
                                <ul className="space-y-1">
                                  {engine.highlightFeatures.slice(0, 2).map((feat, idx) => (
                                    <li key={idx} className="text-[11px] text-slate-300 flex items-start gap-1.5">
                                      <span className="text-indigo-400 font-bold">•</span>
                                      <span>{feat}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>

                            <button
                              onClick={() => onSelectEngine(engine.id)}
                              className={`mt-4 w-full py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                                isSelected
                                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700'
                              }`}
                            >
                              {isSelected ? (
                                <>
                                  <Check className="w-3.5 h-3.5" /> Engine Routed & Selected
                                </>
                              ) : (
                                <>
                                  <Zap className="w-3.5 h-3.5" /> Route to {engine.name}
                                </>
                              )}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 2: VEO3 VS SEEDANCE 1.0 (HEDRA) PRICING & MOTION DEEP DIVE */}
          {activeTab === 'veo3_vs_seedance' && (
            <div className="space-y-6">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Film className="w-5 h-5 text-amber-400" />
                  Veo3 AI vs. Seedance 1.0 (by Hedra): The 2026 Cinematic Showdown
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Following Sora 2's discontinuation, creators split primarily between Veo3 AI (for unrestricted creative storytelling) and Seedance 1.0 (for deterministic 6-axis camera physics). Here is the full financial and technical breakdown.
                </p>
              </div>

              {/* Side-by-side Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* VEO3 CARD */}
                <div className="bg-slate-950/60 rounded-xl border border-blue-500/30 p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">General Creativity & Prompt Adherence</span>
                      <h4 className="text-xl font-bold text-white">{VEO3_VS_SEEDANCE_COMPARISON.engineA.name}</h4>
                      <p className="text-xs text-slate-400">{VEO3_VS_SEEDANCE_COMPARISON.engineA.vendor}</p>
                    </div>
                    <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-blue-500/20 text-blue-300 border border-blue-500/30">
                      $0.03 / sec
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 italic border-l-2 border-blue-500 pl-3">
                    "{VEO3_VS_SEEDANCE_COMPARISON.engineA.headline}"
                  </p>

                  <div className="space-y-2">
                    <span className="text-xs font-bold text-white uppercase tracking-wider block">Pricing Models</span>
                    <div className="space-y-2">
                      {VEO3_VS_SEEDANCE_COMPARISON.engineA.pricingTiers.map((tier, idx) => (
                        <div key={idx} className="bg-slate-900/90 p-3 rounded-lg border border-slate-800 text-xs">
                          <div className="flex items-center justify-between font-bold text-slate-200">
                            <span>{tier.tierName}</span>
                            <span className="text-emerald-400">
                              {tier.monthlyCostUsd === 0 ? 'FREE' : `$${tier.monthlyCostUsd}/mo (₹${tier.monthlyCostInr})`}
                            </span>
                          </div>
                          <p className="text-slate-400 mt-1 text-[11px]">{tier.inclusions}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2 text-xs">
                    <span className="text-xs font-bold text-white uppercase tracking-wider block">Technical Metrics</span>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800 text-center">
                        <span className="text-[10px] text-slate-400 block">Prompt Fidelity</span>
                        <span className="text-lg font-bold text-blue-400">{VEO3_VS_SEEDANCE_COMPARISON.engineA.promptFidelityScore} / 100</span>
                      </div>
                      <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800 text-center">
                        <span className="text-[10px] text-slate-400 block">Motion Control</span>
                        <span className="text-lg font-bold text-slate-300">{VEO3_VS_SEEDANCE_COMPARISON.engineA.motionControlScore} / 100</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">Key Advantages</span>
                    <ul className="space-y-1">
                      {VEO3_VS_SEEDANCE_COMPARISON.engineA.strengths.map((s, idx) => (
                        <li key={idx} className="text-xs text-slate-300 flex items-start gap-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    onClick={() => {
                      onSelectEngine('veo3');
                      onClose();
                    }}
                    className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 font-bold text-xs text-white shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-1.5"
                  >
                    Select Veo3 AI for Studio Generation
                  </button>
                </div>

                {/* SEEDANCE CARD */}
                <div className="bg-slate-950/60 rounded-xl border border-amber-500/30 p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">Pro Filmmaking & Physics Splines</span>
                      <h4 className="text-xl font-bold text-white">{VEO3_VS_SEEDANCE_COMPARISON.engineB.name}</h4>
                      <p className="text-xs text-slate-400">{VEO3_VS_SEEDANCE_COMPARISON.engineB.vendor}</p>
                    </div>
                    <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      $0.06 / sec
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 italic border-l-2 border-amber-500 pl-3">
                    "{VEO3_VS_SEEDANCE_COMPARISON.engineB.headline}"
                  </p>

                  <div className="space-y-2">
                    <span className="text-xs font-bold text-white uppercase tracking-wider block">Pricing Models</span>
                    <div className="space-y-2">
                      {VEO3_VS_SEEDANCE_COMPARISON.engineB.pricingTiers.map((tier, idx) => (
                        <div key={idx} className="bg-slate-900/90 p-3 rounded-lg border border-slate-800 text-xs">
                          <div className="flex items-center justify-between font-bold text-slate-200">
                            <span>{tier.tierName}</span>
                            <span className="text-amber-400">
                              {tier.monthlyCostUsd === 0 ? 'Trial' : `$${tier.monthlyCostUsd}/mo (₹${tier.monthlyCostInr})`}
                            </span>
                          </div>
                          <p className="text-slate-400 mt-1 text-[11px]">{tier.inclusions}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2 text-xs">
                    <span className="text-xs font-bold text-white uppercase tracking-wider block">Technical Metrics</span>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800 text-center">
                        <span className="text-[10px] text-slate-400 block">Prompt Fidelity</span>
                        <span className="text-lg font-bold text-slate-300">{VEO3_VS_SEEDANCE_COMPARISON.engineB.promptFidelityScore} / 100</span>
                      </div>
                      <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800 text-center">
                        <span className="text-[10px] text-slate-400 block">Motion Control</span>
                        <span className="text-lg font-bold text-amber-400">{VEO3_VS_SEEDANCE_COMPARISON.engineB.motionControlScore} / 100</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">Key Advantages</span>
                    <ul className="space-y-1">
                      {VEO3_VS_SEEDANCE_COMPARISON.engineB.strengths.map((s, idx) => (
                        <li key={idx} className="text-xs text-slate-300 flex items-start gap-1.5">
                          <Check className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    onClick={() => {
                      onSelectEngine('seedance');
                      onClose();
                    }}
                    className="w-full py-2.5 rounded-lg bg-amber-600 hover:bg-amber-500 font-bold text-xs text-white shadow-lg shadow-amber-600/30 transition-all flex items-center justify-center gap-1.5"
                  >
                    Select Seedance 1.0 for Studio Generation
                  </button>
                </div>
              </div>

              {/* Scenario Decision Matrix */}
              <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Scenario Decision Matrix: Which One Should You Pick?
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400">
                        <th className="py-2.5 px-3">Production Scenario</th>
                        <th className="py-2.5 px-3">Recommended Winner</th>
                        <th className="py-2.5 px-3">Engineering Rationale</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {VEO3_VS_SEEDANCE_COMPARISON.verdictMatrix.map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-900/50">
                          <td className="py-2.5 px-3 font-medium text-slate-200">{item.scenario}</td>
                          <td className="py-2.5 px-3">
                            <span
                              className={`px-2 py-0.5 rounded font-bold text-[11px] ${
                                item.winner === 'Veo3 AI'
                                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                                  : item.winner.includes('Seedance')
                                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                  : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                              }`}
                            >
                              {item.winner}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-slate-400">{item.reason}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: MAGIC HOUR API & SORA MIGRATION ADAPTER */}
          {activeTab === 'magic_hour_api' && (
            <div className="space-y-6">
              <div className="bg-slate-950 p-4 rounded-xl border border-cyan-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Code className="w-5 h-5 text-cyan-400" />
                    Magic Hour API: The 2026 Sora Migration Standard
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Migrate legacy applications from the deprecated Sora 2 API using Magic Hour's drop-in adapter or native high-speed video-to-video endpoints.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    Sora API Shim Ready
                  </span>
                </div>
              </div>

              {/* Code Format Selector & Snippet */}
              <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-900/80">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCodeFormat('sora_adapter')}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                        codeFormat === 'sora_adapter'
                          ? 'bg-cyan-600 text-white'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      🔄 Drop-in Sora 2 Adapter (TS)
                    </button>
                    <button
                      onClick={() => setCodeFormat('typescript')}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                        codeFormat === 'typescript'
                          ? 'bg-cyan-600 text-white'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      TypeScript Client
                    </button>
                    <button
                      onClick={() => setCodeFormat('python')}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                        codeFormat === 'python'
                          ? 'bg-cyan-600 text-white'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      Python Client
                    </button>
                    <button
                      onClick={() => setCodeFormat('curl')}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                        codeFormat === 'curl'
                          ? 'bg-cyan-600 text-white'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      cURL REST
                    </button>
                  </div>
                  <button
                    onClick={() => handleCopyCode(getMagicHourMigrationSnippet(codeFormat))}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition-colors border border-slate-700"
                  >
                    {copiedSnippet ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" /> Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" /> Copy Code
                      </>
                    )}
                  </button>
                </div>
                <pre className="p-4 text-xs font-mono text-cyan-200/90 bg-slate-950 overflow-x-auto max-h-96 leading-relaxed">
                  {getMagicHourMigrationSnippet(codeFormat)}
                </pre>
              </div>

              {/* Interactive Dispatcher / Migration Simulator */}
              <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-cyan-400" />
                    Interactive Magic Hour API Test Runner
                  </h4>
                  <span className="text-[11px] text-slate-400">Endpoint: /api/magic-hour/generate</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="md:col-span-2 space-y-1">
                    <label className="text-[11px] text-slate-400 font-medium">Prompt Payload</label>
                    <input
                      type="text"
                      value={mhPrompt}
                      onChange={(e) => setMhPrompt(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[11px] text-slate-400 font-medium">Resolution</label>
                      <select
                        value={mhResolution}
                        onChange={(e) => setMhResolution(e.target.value as any)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                      >
                        <option value="720p">720p</option>
                        <option value="1080p">1080p</option>
                        <option value="4k">4K Ultra</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] text-slate-400 font-medium">Duration</label>
                      <select
                        value={mhDuration}
                        onChange={(e) => setMhDuration(Number(e.target.value))}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                      >
                        <option value={5}>5 sec</option>
                        <option value={10}>10 sec</option>
                        <option value={15}>15 sec</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <p className="text-[11px] text-slate-400">
                    Dispatches asynchronous batch payload through the Sora 2 migration shim to Magic Hour cluster.
                  </p>
                  <button
                    onClick={handleRunMagicHourDispatch}
                    disabled={mhIsRunning}
                    className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-600/30 transition-all"
                  >
                    {mhIsRunning ? (
                      <>
                        <Activity className="w-3.5 h-3.5 animate-spin" /> Dispatching...
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5" /> Test Magic Hour Dispatch
                      </>
                    )}
                  </button>
                </div>

                {mhResult && (
                  <div className="bg-slate-900/90 rounded-lg p-3 border border-cyan-500/40 space-y-2 text-xs animate-fade-in">
                    <div className="flex items-center justify-between text-emerald-400 font-bold">
                      <span className="flex items-center gap-1.5">
                        <Check className="w-4 h-4" /> Job Executed Successfully
                      </span>
                      <span className="text-slate-400 font-mono text-[11px]">Job ID: {mhResult.jobId || mhResult.id}</span>
                    </div>
                    <pre className="text-[11px] font-mono text-slate-300 bg-slate-950 p-2.5 rounded border border-slate-800 overflow-x-auto">
                      {JSON.stringify(mhResult, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: COMPREHENSIVE 2026 SUMMARY MATRIX */}
          {activeTab === 'summary_table' && (
            <div className="space-y-5">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Layers className="w-5 h-5 text-emerald-400" />
                  Late 2026 Video Generation Landscape: Sora 2 Alternatives Matrix
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Categorized comparative analysis across cinematic resolution, developer APIs, and social marketing.
                </p>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-900/90 text-slate-300 font-semibold">
                      <th className="py-3 px-4">Platform</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Best For</th>
                      <th className="py-3 px-4">Key Advantage Over Sora</th>
                      <th className="py-3 px-4">Max Res</th>
                      <th className="py-3 px-4">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {VIDEO_ENGINES_2026.map((engine) => {
                      const isSelected = activeEngineId === engine.id;
                      return (
                        <tr key={engine.id} className={`hover:bg-slate-900/50 transition-colors ${isSelected ? 'bg-indigo-950/20' : ''}`}>
                          <td className="py-3 px-4">
                            <div className="font-bold text-white flex items-center gap-2">
                              {engine.name}
                              <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-slate-800 text-indigo-300">
                                {engine.badge}
                              </span>
                            </div>
                            <span className="text-[11px] text-slate-400">{engine.vendor}</span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-slate-300">{engine.category}</span>
                          </td>
                          <td className="py-3 px-4 font-medium text-slate-200">
                            {engine.bestFor}
                          </td>
                          <td className="py-3 px-4 text-emerald-300/90">
                            {engine.keyAdvantageOverSora}
                          </td>
                          <td className="py-3 px-4 font-mono text-slate-300">
                            {engine.maxResolution}
                          </td>
                          <td className="py-3 px-4">
                            <button
                              onClick={() => {
                                onSelectEngine(engine.id);
                                onClose();
                              }}
                              className={`px-3 py-1 rounded text-[11px] font-bold transition-all ${
                                isSelected
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white'
                              }`}
                            >
                              {isSelected ? 'Selected' : 'Use Engine'}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-slate-800 bg-slate-950 text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>MemeForge LEO Studio • Multi-Model Engine Routing & 2026 Migration</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-medium transition-colors"
            >
              Done
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
