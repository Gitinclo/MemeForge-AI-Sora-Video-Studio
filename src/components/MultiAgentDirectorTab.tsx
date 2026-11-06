import React, { useState } from 'react';
import {
  DirectorMessage,
  DirectorAgentRole,
} from '../types/future2060';
import {
  Users,
  Video,
  Camera,
  Sun,
  Music,
  Send,
  Sparkles,
  Check,
  Play,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';

interface MultiAgentDirectorTabProps {
  onApplyCameraAction?: (params: Record<string, any>) => void;
  onSendToQuantum?: (prompt: string) => void;
}

export const MultiAgentDirectorTab: React.FC<MultiAgentDirectorTabProps> = ({
  onApplyCameraAction,
  onSendToQuantum,
}) => {
  const [concept, setConcept] = useState<string>(
    'High-speed chase along quantum mag-lev skyways amidst towering holographic neon monoliths'
  );
  const [messages, setMessages] = useState<DirectorMessage[]>([
    {
      id: 'init_1',
      role: 'director',
      agentName: 'Aura Vance (Narrative Lead)',
      content: 'Welcome to the 2060 Autonomous Production Room. Give me a premise, and our crew will plan shot choreography, photonic lighting, and spatial audio in unison.',
      timestampEpochMs: Date.now() - 10000,
    },
  ]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [appliedActionNotice, setAppliedActionNotice] = useState<string | null>(null);

  const handleConsultCrew = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/director/dialogue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ concept }),
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.messages)) {
        setMessages((prev) => [...prev, ...data.messages]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleIcon = (role: DirectorAgentRole) => {
    switch (role) {
      case 'director':
        return <Video className="w-4 h-4 text-cyan-400" />;
      case 'cinematographer':
        return <Camera className="w-4 h-4 text-violet-400" />;
      case 'lighting':
        return <Sun className="w-4 h-4 text-amber-400" />;
      case 'audio':
        return <Music className="w-4 h-4 text-emerald-400" />;
    }
  };

  const getRoleBadge = (role: DirectorAgentRole) => {
    switch (role) {
      case 'director':
        return 'text-cyan-400 border-cyan-800 bg-cyan-950/40';
      case 'cinematographer':
        return 'text-violet-400 border-violet-800 bg-violet-950/40';
      case 'lighting':
        return 'text-amber-400 border-amber-800 bg-amber-950/40';
      case 'audio':
        return 'text-emerald-400 border-emerald-800 bg-emerald-950/40';
    }
  };

  const handleApplyAction = (msg: DirectorMessage) => {
    if (!msg.suggestedAction) return;

    if (onApplyCameraAction && msg.suggestedAction.params) {
      onApplyCameraAction(msg.suggestedAction.params);
    }

    setAppliedActionNotice(`Applied: ${msg.suggestedAction.description}`);
    setTimeout(() => setAppliedActionNotice(null), 3000);
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto py-6 px-4">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
            <span>2060.01.01 AUTONOMOUS CREW</span>
            <span aria-hidden="true">·</span>
            <span>4-AGENT DELIBERATION LOOP</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-400">NEURAL FEEDBACK ACTIVE</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-cyan-400" />
            Autonomous Multi-Agent AI Director
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Collaborative real-time planning with dedicated AI specialists for Narrative, 6-Axis Camera, Photonic Lighting, and Spatial Audio.
          </p>
        </div>
      </div>

      {appliedActionNotice && (
        <div className="flex items-center gap-2 p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-lg text-xs text-emerald-200">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{appliedActionNotice}</span>
        </div>
      )}

      {/* Agents Roster Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { name: 'Aura Vance', role: 'director', specialty: 'Narrative & Pacing' },
          { name: 'Kaelen Thorne', role: 'cinematographer', specialty: '6-Axis Camera & Trajectories' },
          { name: 'Lyra Solis', role: 'lighting', specialty: 'Photonic & Depth Volumetrics' },
          { name: 'Orion Kross', role: 'audio', specialty: 'Temporal Sound & Sub-Bass' },
        ].map((agent, aIdx) => (
          <div
            key={aIdx}
            className="p-3 rounded-lg border border-slate-800 bg-slate-900/40 flex items-center gap-3"
          >
            <div className="p-2 rounded-lg bg-slate-800 border border-slate-700">
              {getRoleIcon(agent.role as DirectorAgentRole)}
            </div>
            <div>
              <div className="text-xs font-semibold text-white">{agent.name}</div>
              <div className="text-[11px] text-slate-400">{agent.specialty}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Input Concept Box */}
      <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 flex flex-col md:flex-row gap-3">
        <input
          type="text"
          value={concept}
          onChange={(e) => setConcept(e.target.value)}
          placeholder="Enter a scene concept, screenplay excerpt, or visual idea..."
          className="flex-1 p-3 rounded-lg bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
        />
        <button
          onClick={handleConsultCrew}
          disabled={isLoading}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs transition-colors shrink-0 disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Deliberating...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Convene Director Room</span>
            </>
          )}
        </button>
      </div>

      {/* Collaborative Deliberation Feed */}
      <div className="flex flex-col gap-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className="p-4 rounded-xl border border-slate-800/80 bg-slate-900/30 flex flex-col gap-2 transition-all hover:border-slate-700"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getRoleIcon(msg.role)}
                <span className="text-xs font-semibold text-white">{msg.agentName}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded border ${getRoleBadge(msg.role)}`}>
                  {msg.role.toUpperCase()}
                </span>
              </div>
              <span className="text-[11px] font-mono text-slate-500">
                {new Date(msg.timestampEpochMs).toLocaleTimeString()}
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed pl-6">
              {msg.content}
            </p>

            {/* Actionable Cue Button */}
            {msg.suggestedAction && (
              <div className="mt-2 pl-6 flex items-center justify-between gap-3 p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <div className="text-xs text-slate-400 flex items-center gap-2">
                  <span className="text-cyan-400 font-mono text-[11px]">SUGGESTION:</span>
                  <span>{msg.suggestedAction.description}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleApplyAction(msg)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-xs font-medium border border-cyan-500/40 transition-colors"
                  >
                    <span>Adopt Cue</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  {onSendToQuantum && (
                    <button
                      onClick={() => onSendToQuantum(msg.content)}
                      className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
                    >
                      To Quantum DiT
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
