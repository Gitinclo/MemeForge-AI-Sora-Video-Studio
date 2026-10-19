import React, { useState } from 'react';
import { VersionSnapshot, TeamMember } from '../types/meme';
import {
  Users,
  GitBranch,
  History,
  RotateCcw,
  Shield,
  Cloud,
  HardDrive,
  Lock,
  Download,
  CheckCircle2,
  Share2,
  ExternalLink,
  Plus,
  Key,
} from 'lucide-react';

interface TeamWorkspaceTabProps {
  versionHistory: VersionSnapshot[];
  onRollback: (snapshot: VersionSnapshot) => void;
}

export const TeamWorkspaceTab: React.FC<TeamWorkspaceTabProps> = ({
  versionHistory,
  onRollback,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'versions' | 'members' | 'assets'>('versions');
  const [currentBranch, setCurrentBranch] = useState('main-cut');

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      id: 'm1',
      name: 'Alex Rivera',
      email: 'alex@memeforge.studio',
      role: 'Owner',
      avatarColor: 'bg-amber-500',
      isOnline: true,
      activity: 'Reviewing 4K Master Render',
    },
    {
      id: 'm2',
      name: 'Elena Rostova',
      email: 'elena@memeforge.studio',
      role: 'Director',
      avatarColor: 'bg-purple-500',
      isOnline: true,
      activity: 'Tweaking Magic Caption tone',
    },
    {
      id: 'm3',
      name: 'Kenji Sato',
      email: 'kenji@memeforge.studio',
      role: 'VFX Artist',
      avatarColor: 'bg-cyan-500',
      isOnline: true,
      activity: 'Monitoring GPU cluster nodes',
    },
    {
      id: 'm4',
      name: 'Maya Lin',
      email: 'maya@client.media',
      role: 'Reviewer',
      avatarColor: 'bg-emerald-500',
      isOnline: false,
      activity: 'Last active 35m ago',
    },
  ]);

  const cloudAssets = [
    {
      id: 'a1',
      name: 'drake_hotline_4k_master.png',
      size: '14.2 MB',
      type: 'PNG 4K',
      edgeNode: 'Edge: Cloudflare IAD-1',
      latency: '8ms',
      permission: 'Team Read / Write',
      encrypted: true,
    },
    {
      id: 'a2',
      name: 'sora_neon_tokyo_60fps.mp4',
      size: '248.5 MB',
      type: 'ProRes 422',
      edgeNode: 'Edge: Google SFO-2',
      latency: '11ms',
      permission: 'Owner & Director',
      encrypted: true,
    },
    {
      id: 'a3',
      name: 'buff_doge_deepfried_layer.webp',
      size: '3.8 MB',
      type: 'WebP HD',
      edgeNode: 'Edge: Fastly LHR-3',
      latency: '15ms',
      permission: 'Public Cached',
      encrypted: true,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Workspace Top Bar */}
      <div className="p-4 sm:p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Users className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                <span>Team Collaborative Hub</span>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  Branch: {currentBranch}
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Real-time version snapshots, granular role permissions, and encrypted low-latency cloud storage
              </p>
            </div>
          </div>
        </div>

        {/* Sub-tab pills */}
        <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-2xl border border-slate-800">
          <button
            onClick={() => setActiveSubTab('versions')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSubTab === 'versions'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            Version History
          </button>
          <button
            onClick={() => setActiveSubTab('members')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSubTab === 'members'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            Roles &amp; Access
          </button>
          <button
            onClick={() => setActiveSubTab('assets')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSubTab === 'assets'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Cloud className="w-3.5 h-3.5" />
            Cloud Vault
          </button>
        </div>
      </div>

      {/* Sub-tab 1: Version History & Rollback */}
      {activeSubTab === 'versions' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <GitBranch className="w-4 h-4 text-amber-400" />
              <span>Timeline Snapshots ({versionHistory.length})</span>
            </h4>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500">Active:</span>
              <span className="text-emerald-400 font-mono font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                Latest Working Draft
              </span>
            </div>
          </div>

          <div className="space-y-3">
            {versionHistory.map((snap, idx) => {
              const isLatest = idx === 0;
              return (
                <div
                  key={snap.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    isLatest
                      ? 'bg-slate-950 border-amber-500/50 shadow-md shadow-amber-500/5'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="px-2 py-0.5 rounded-md font-mono text-xs font-extrabold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                        {snap.tag}
                      </span>
                      <span className="text-xs font-bold text-white">{snap.note}</span>
                      {isLatest && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase">
                          Current
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      <span>By {snap.author}</span>
                      <span className="text-slate-600">•</span>
                      <span>{snap.timestamp}</span>

                      {!isLatest && (
                        <button
                          onClick={() => onRollback(snap)}
                          className="px-3 py-1 bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 hover:text-amber-200 font-bold text-xs rounded-xl border border-amber-500/30 flex items-center gap-1.5 transition-all ml-2"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          Rollback
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Sub-tab 2: Team Members & Granular Permissions */}
      {activeSubTab === 'members' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Shield className="w-4 h-4 text-cyan-400" />
                <span>Team Access Control &amp; RBAC</span>
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Manage roles, live edit permissions, and rendering quota allocations
              </p>
            </div>
            <button className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors">
              <Plus className="w-3.5 h-3.5" />
              Invite Member
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div
                      className={`w-10 h-10 rounded-2xl ${member.avatarColor} text-slate-950 font-black text-sm flex items-center justify-center shadow-md`}
                    >
                      {member.name.slice(0, 2).toUpperCase()}
                    </div>
                    {member.isOnline && (
                      <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-slate-950" />
                    )}
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-white flex items-center gap-2">
                      {member.name}
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-semibold">
                        {member.role}
                      </span>
                    </h5>
                    <p className="text-xs text-slate-500">{member.email}</p>
                    <p className="text-[11px] text-cyan-400 mt-0.5">{member.activity}</p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <span className="text-[10px] text-emerald-400 font-mono font-bold flex items-center gap-1">
                    <Key className="w-3 h-3" />
                    Full Access
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sub-tab 3: Cloud Storage Vault */}
      {activeSubTab === 'assets' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-amber-400" />
                <span>Encrypted Edge Asset Vault</span>
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Low-latency distributed object storage with end-to-end encryption for production assets
              </p>
            </div>
          </div>

          <div className="space-y-2.5">
            {cloudAssets.map((asset) => (
              <div
                key={asset.id}
                className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center font-mono text-xs font-bold">
                    {asset.type.split(' ')[0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{asset.name}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                        {asset.size}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                      <span className="text-cyan-400">{asset.edgeNode}</span>
                      <span>•</span>
                      <span className="text-emerald-400 font-mono">{asset.latency} latency</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 font-semibold">
                    <Lock className="w-3 h-3" />
                    AES-256
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-300">
                    {asset.permission}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
