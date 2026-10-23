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
  Building2,
  Crown,
  AlertTriangle,
  Zap,
  ShieldAlert,
  FileText,
  X,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { UserSubscription } from '../types/subscription';
import {
  getPlanLimits,
  canAccessTeamMembers,
  COMPANY_TEAM_MONTHLY_PRICE_INR,
} from '../utils/subscriptionUtils';

interface TeamWorkspaceTabProps {
  versionHistory: VersionSnapshot[];
  onRollback: (snapshot: VersionSnapshot) => void;
  subscription?: UserSubscription;
  onOpenSubscriptionModal?: (category?: 'individual' | 'company') => void;
}

export const TeamWorkspaceTab: React.FC<TeamWorkspaceTabProps> = ({
  versionHistory,
  onRollback,
  subscription,
  onOpenSubscriptionModal,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'versions' | 'members' | 'assets'>('versions');
  const [currentBranch, setCurrentBranch] = useState('main-cut');
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'Director' | 'VFX Artist' | 'Editor' | 'Sound Designer' | 'Reviewer'>('Editor');
  const [inviteSuccessMessage, setInviteSuccessMessage] = useState('');

  const limits = getPlanLimits(subscription);
  const isCompanyEnterprise = subscription?.isActive && subscription?.plan === 'company_team';

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

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName.trim() || !inviteEmail.trim()) return;

    if (!canAccessTeamMembers(teamMembers.length + 1, subscription)) {
      return;
    }

    const newMember: TeamMember = {
      id: `m-${Date.now()}`,
      name: inviteName.trim(),
      email: inviteEmail.trim(),
      role: inviteRole,
      avatarColor: ['bg-amber-500', 'bg-purple-500', 'bg-cyan-500', 'bg-emerald-500', 'bg-pink-500'][
        teamMembers.length % 5
      ],
      isOnline: true,
      activity: 'Just joined workspace',
    };

    setTeamMembers([...teamMembers, newMember]);
    setInviteSuccessMessage(`Invitation sent to ${inviteEmail.trim()} with role ${inviteRole}`);
    setInviteName('');
    setInviteEmail('');
    setTimeout(() => setInviteSuccessMessage(''), 4000);
    setIsInviteModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Enterprise Plan Banner (₹99,999/mo) or Upsell */}
      {isCompanyEnterprise ? (
        <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-indigo-950/80 via-slate-900 to-purple-950/80 border border-cyan-500/40 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-base font-black text-white">Team / Company Enterprise License Active</span>
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[10px] font-black uppercase">
                  50 Seats • Rs. 99,999 / mo
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                {subscription?.companyName ? <strong className="text-white">{subscription.companyName} • </strong> : ''}
                Dedicated 8-Node GPU Cluster • Unlimited 100-Hour 4K 120fps Renders • 18% GST Input Credit Active
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <span className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono font-bold text-cyan-300">
              Seats: {teamMembers.length} / {limits.teamWorkspaceSeats}
            </span>
            <button
              onClick={() => onOpenSubscriptionModal?.('company')}
              className="px-3.5 py-1.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/40 text-cyan-200 text-xs font-bold transition-colors"
            >
              License Details
            </button>
          </div>
        </div>
      ) : (
        <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-indigo-950/90 via-purple-950/70 to-slate-900 border border-cyan-500/40 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-gradient-to-tr from-cyan-500/20 via-indigo-500/20 to-purple-500/20 text-cyan-300 border border-cyan-500/40 shrink-0">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-base font-black text-white">Team / Company Subscription for Multiple People</span>
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[10px] font-black uppercase">
                  Rs. 99,999 / mo
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Collaborate with 50 team members, dedicated 8-node GPU cluster with 0 queue wait, unlimited 100-hour video exports, and B2B GST tax invoice.
              </p>
            </div>
          </div>
          <button
            onClick={() => onOpenSubscriptionModal?.('company')}
            className="px-4 py-2.5 bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 hover:opacity-95 text-white text-xs font-black rounded-xl shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 shrink-0 transition-transform active:scale-95"
          >
            <Building2 className="w-4 h-4" />
            <span>Upgrade Team (₹99,999/mo)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Security Guard Callout: Play Store Direct Publishing Disabled */}
      <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-200/90 leading-relaxed">
          <strong>Security Protection:</strong> Direct automated publishing to the Google Play Store is disabled across all studio tiers to prevent credential exploitation and developer account abuse. All mobile packages are compiled strictly for offline sideload testing and internal enterprise signing.
        </div>
      </div>

      {/* Success Notification */}
      {inviteSuccessMessage && (
        <div className="p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{inviteSuccessMessage}</span>
        </div>
      )}

      {/* Workspace Top Bar */}
      <div className="p-4 sm:p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Users className="w-5 h-5" />
            </span>
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                <h3 className="text-lg font-bold text-white tracking-tight">
                  Team Collaborative Hub
                </h3>
                <span className="self-start text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  Branch: {currentBranch}
                </span>
              </div>
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
            <div className="flex items-center gap-3">
              <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-xl border ${
                teamMembers.length > limits.teamWorkspaceSeats
                  ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                  : 'bg-slate-950 text-slate-300 border-slate-800'
              }`}>
                Seats: {teamMembers.length} / {limits.teamWorkspaceSeats}
              </span>
              <button
                onClick={() => setIsInviteModalOpen(true)}
                className="px-3 py-1.5 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                Invite Member
              </button>
            </div>
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

      {/* Invite Member Modal */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                  <Users className="w-5 h-5" />
                </span>
                <div>
                  <h4 className="text-base font-bold text-white">Invite Team Member</h4>
                  <p className="text-xs text-slate-400">
                    Add collaborators with specific studio permissions
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsInviteModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Seat capacity check */}
            {teamMembers.length >= limits.teamWorkspaceSeats ? (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2">
                  <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
                    <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
                    <span>Workspace Seat Limit Reached ({teamMembers.length} / {limits.teamWorkspaceSeats})</span>
                  </div>
                  <p className="text-xs text-amber-200/80 leading-relaxed">
                    Your current plan (<strong>{limits.name}</strong>) allows up to {limits.teamWorkspaceSeats} seat{limits.teamWorkspaceSeats > 1 ? 's' : ''}. To invite multiple people and entire teams, upgrade to the <strong>Team / Company Subscription (₹99,999 / month)</strong> which provides <strong>50 team seats</strong>, dedicated 8-node GPU clusters, and custom RBAC permissions.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Team / Company Enterprise:</span>
                    <span className="font-black text-cyan-300">₹99,999 / month</span>
                  </div>
                  <div className="text-[11px] text-slate-400 space-y-1">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>50 Team seats with Director, VFX Artist &amp; Reviewer roles</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Dedicated 8-Node GPU Cluster with instant queue priority</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>18% GST Input Tax Credit B2B tax invoice</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setIsInviteModalOpen(false);
                      onOpenSubscriptionModal?.('company');
                    }}
                    className="flex-1 py-3 px-4 bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 hover:opacity-95 text-white font-black text-xs rounded-xl shadow-lg flex items-center justify-center gap-2"
                  >
                    <Building2 className="w-4 h-4" />
                    <span>Upgrade to Team Plan (₹99,999/mo)</span>
                  </button>
                  <button
                    onClick={() => setIsInviteModalOpen(false)}
                    className="py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleAddMember} className="space-y-4">
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">
                    Member Name
                  </label>
                  <input
                    type="text"
                    required
                    value={inviteName}
                    onChange={(e) => setInviteName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">
                    Work Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="rahul@company.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">
                    Role &amp; Permissions
                  </label>
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-400"
                  >
                    <option value="Director">Director (Full pipeline &amp; AI prompt approvals)</option>
                    <option value="VFX Artist">VFX Artist (Render queue &amp; shader settings)</option>
                    <option value="Editor">Editor (Canvas layers &amp; timeline edits)</option>
                    <option value="Sound Designer">Sound Designer (Audio synthesis &amp; stems)</option>
                    <option value="Reviewer">Reviewer (View &amp; comment only)</option>
                  </select>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800">
                  <span>Seats remaining: {limits.teamWorkspaceSeats - teamMembers.length}</span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setIsInviteModalOpen(false)}
                      className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold flex items-center gap-1.5 shadow-md"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add to Workspace
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
