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
  Layers,
  FolderPlus,
  UploadCloud,
  Server,
  Copy,
  Trash2,
  Filter,
  Globe,
  Activity,
  ChevronDown,
  LayoutDashboard,
  Play,
  Pause,
  Clock,
  Cpu,
  Search,
  Eye,
  Send,
  MessageSquare,
  FileSpreadsheet,
  Check,
  Film,
  Radio,
  Sliders,
  RefreshCw,
  Bell,
  SlidersHorizontal,
} from 'lucide-react';
import {
  UserSubscription,
  EnterpriseWorkspace,
  EnterpriseVaultAsset,
  VideoProductionJob,
  CollaboratorPresence,
  TeamActivityLog,
  ProductionJobStatus,
  ProductionJobPriority,
} from '../types/subscription';
import {
  getPlanLimits,
  canAccessTeamMembers,
  canCreateWorkspace,
  canAccessEnterpriseVault,
  getCloudVaultQuota,
  COMPANY_TEAM_MONTHLY_PRICE_INR,
  canAccessProjectManagementDashboard,
  calculateProjectQueueMetrics,
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
  // Navigation tabs: Project Management, Workspaces, Enterprise Vault, Roles & RBAC, Timeline Snapshots
  const [activeSubTab, setActiveSubTab] = useState<'projects' | 'workspaces' | 'vault' | 'members' | 'versions'>('projects');
  const [currentBranch, setCurrentBranch] = useState('main-cut');

  // Project Management & Video Production Queue state
  const [productionJobs, setProductionJobs] = useState<VideoProductionJob[]>([
    {
      id: 'job-101',
      workspaceId: 'ws-prod-1',
      title: 'LEO 4K Brand Film - Episode 3',
      format: 'LEO 4K ProRes 422 HQ',
      resolution: '3840×2160 (4K)',
      fps: 60,
      duration: '04:30',
      assignedNode: 'GPU Node #1 (RTX 4090 D)',
      status: 'rendering',
      progress: 78,
      currentFrame: 12636,
      totalFrames: 16200,
      priority: 'urgent',
      leadCollaborator: 'Alex Rivera (Owner)',
      eta: '2m 45s',
      submittedAt: '12m ago',
    },
    {
      id: 'job-102',
      workspaceId: 'ws-vfx-2',
      title: '32K ACES 2.0 VFX Plate Render',
      format: 'OpenEXR 32-bit Float',
      resolution: '32000×32000 (1.024 GP)',
      fps: 1000,
      duration: '00:15',
      assignedNode: 'GPU Node #4 (H100 NVLink)',
      status: 'compositing',
      progress: 44,
      currentFrame: 6600,
      totalFrames: 15000,
      priority: 'high',
      leadCollaborator: 'Kenji Sato (VFX Artist)',
      eta: '5m 18s',
      submittedAt: '18m ago',
    },
    {
      id: 'job-103',
      workspaceId: 'ws-prod-1',
      title: 'Dolby Atmos 192kHz Spatial Master',
      format: 'Fairlight 192kHz 32-bit Float',
      resolution: '7.1.4 Bed + Ambisonics',
      fps: 192000,
      duration: '14:20',
      assignedNode: 'GPU Node #2 (A100-80GB)',
      status: 'rendering',
      progress: 91,
      currentFrame: 147420,
      totalFrames: 162000,
      priority: 'high',
      leadCollaborator: 'Samir Patel (Sound Designer)',
      eta: '54s',
      submittedAt: '35m ago',
    },
    {
      id: 'job-104',
      workspaceId: 'ws-agency-3',
      title: 'Viral Meme TikTok Campaign (9:16 Reel)',
      format: 'H.265 / HEVC 10-bit',
      resolution: '1080×1920 (Vertical)',
      fps: 60,
      duration: '00:45',
      assignedNode: 'GPU Node #3 (RTX 4090 D)',
      status: 'in_review',
      progress: 100,
      currentFrame: 2700,
      totalFrames: 2700,
      priority: 'normal',
      leadCollaborator: 'Elena Rostova (Director)',
      eta: 'Ready for Review',
      submittedAt: '1h ago',
    },
    {
      id: 'job-105',
      workspaceId: 'ws-prod-1',
      title: '100-Hour Continuous LEO Ambient Stream',
      format: 'AV1 Hardware Acceleration',
      resolution: '4K Ultra HD',
      fps: 60,
      duration: '100:00:00',
      assignedNode: 'Enterprise Cluster Node #7 & #8',
      status: 'queued',
      progress: 0,
      currentFrame: 0,
      totalFrames: 21600000,
      priority: 'normal',
      leadCollaborator: 'Alex Rivera (Owner)',
      eta: 'Queued behind Job #101',
      submittedAt: '2h ago',
    },
    {
      id: 'job-106',
      workspaceId: 'ws-vfx-2',
      title: 'Cinema VFX 1000 FPS Optical Flow Pass',
      format: 'Apple ProRes 4444 XQ',
      resolution: '7680×4320 (8K DCI)',
      fps: 1000,
      duration: '00:30',
      assignedNode: 'GPU Node #5 (H100 NVLink)',
      status: 'completed',
      progress: 100,
      currentFrame: 30000,
      totalFrames: 30000,
      priority: 'high',
      leadCollaborator: 'Kenji Sato (VFX Artist)',
      eta: 'Completed',
      submittedAt: '3h ago',
    },
  ]);

  // Collaborator Live Presence & Activity state
  const [collaborators, setCollaborators] = useState<CollaboratorPresence[]>([
    {
      id: 'collab-1',
      name: 'Alex Rivera',
      email: 'alex@memeforge.studio',
      role: 'Owner',
      avatarColor: 'bg-amber-500',
      status: 'rendering',
      currentActivity: 'Directing LEO 4K Episode 3 GPU render pipeline',
      activeWorkspaceId: 'ws-prod-1',
      activeWorkspaceName: 'Master Production Suite',
      currentClipOrProject: 'LEO 4K Brand Film - Episode 3',
      lastActive: 'Active now',
      assignedNode: 'GPU Node #1 (RTX 4090 D)',
    },
    {
      id: 'collab-2',
      name: 'Elena Rostova',
      email: 'elena@memeforge.studio',
      role: 'Director',
      avatarColor: 'bg-purple-500',
      status: 'in_review',
      currentActivity: 'Reviewing Viral TikTok Reel cut (v1.2) for client sign-off',
      activeWorkspaceId: 'ws-agency-3',
      activeWorkspaceName: 'Viral Ad Agency & Clients',
      currentClipOrProject: 'Viral Meme TikTok Campaign',
      lastActive: '2m ago',
      assignedNode: 'GPU Node #3 (RTX 4090 D)',
    },
    {
      id: 'collab-3',
      name: 'Kenji Sato',
      email: 'kenji@memeforge.studio',
      role: 'VFX Artist',
      avatarColor: 'bg-cyan-500',
      status: 'active',
      currentActivity: 'Compositing 32K ACES 2.0 optical flow plate in Cinema VFX',
      activeWorkspaceId: 'ws-vfx-2',
      activeWorkspaceName: 'Cinema VFX 32K Suite',
      currentClipOrProject: '32K ACES 2.0 VFX Plate Render',
      lastActive: 'Active now',
      assignedNode: 'GPU Node #4 (H100 NVLink)',
    },
    {
      id: 'collab-4',
      name: 'Samir Patel',
      email: 'samir@memeforge.studio',
      role: 'Sound Designer',
      avatarColor: 'bg-emerald-500',
      status: 'rendering',
      currentActivity: 'Mixing 192kHz Dolby Atmos bed with side-chain bus routing',
      activeWorkspaceId: 'ws-prod-1',
      activeWorkspaceName: 'Master Production Suite',
      currentClipOrProject: 'Dolby Atmos 192kHz Spatial Master',
      lastActive: '5m ago',
      assignedNode: 'GPU Node #2 (A100-80GB)',
    },
    {
      id: 'collab-5',
      name: 'Maya Lin',
      email: 'maya@client.media',
      role: 'Reviewer',
      avatarColor: 'bg-pink-500',
      status: 'active',
      currentActivity: 'Inspecting HDR false color scopes on master grade',
      activeWorkspaceId: 'ws-vfx-2',
      activeWorkspaceName: 'Cinema VFX 32K Suite',
      currentClipOrProject: 'Cinema VFX 1000 FPS Pass',
      lastActive: '12m ago',
      assignedNode: 'Enterprise Client Node',
    },
    {
      id: 'collab-6',
      name: 'Dev Anand',
      email: 'dev@memeforge.studio',
      role: 'Editor',
      avatarColor: 'bg-indigo-500',
      status: 'idle',
      currentActivity: 'Standby for episode 3 typography conform',
      activeWorkspaceId: 'ws-prod-1',
      activeWorkspaceName: 'Master Production Suite',
      currentClipOrProject: 'Queue Standby',
      lastActive: '28m ago',
      assignedNode: 'GPU Node #5 (Standby)',
    },
  ]);

  // Team Activity Logs & Audit Trail state
  const [activityLogs, setActivityLogs] = useState<TeamActivityLog[]>([
    {
      id: 'act-1',
      workspaceId: 'ws-prod-1',
      userId: 'collab-1',
      userName: 'Alex Rivera',
      userRole: 'Owner',
      userAvatarColor: 'bg-amber-500',
      action: 'Dispatched GPU render',
      target: 'LEO 4K Brand Film - Episode 3 (GPU Node #1)',
      category: 'production_queue',
      timestamp: '2m ago',
      statusTag: '78% Rendered',
    },
    {
      id: 'act-2',
      workspaceId: 'ws-vfx-2',
      userId: 'collab-3',
      userName: 'Kenji Sato',
      userRole: 'VFX Artist',
      userAvatarColor: 'bg-cyan-500',
      action: 'Allocated 2 dedicated GPU nodes',
      target: 'Cinema VFX 32K Suite (Total 4 Nodes)',
      category: 'workspace',
      timestamp: '8m ago',
      statusTag: 'Hardware Reconfigured',
    },
    {
      id: 'act-3',
      workspaceId: 'ws-agency-3',
      userId: 'collab-2',
      userName: 'Elena Rostova',
      userRole: 'Director',
      userAvatarColor: 'bg-purple-500',
      action: 'Submitted cut for review',
      target: 'Viral Meme TikTok Campaign (9:16 Reel)',
      category: 'review',
      timestamp: '16m ago',
      statusTag: 'Ready for Review',
    },
    {
      id: 'act-4',
      workspaceId: 'ws-prod-1',
      userId: 'collab-4',
      userName: 'Samir Patel',
      userRole: 'Sound Designer',
      userAvatarColor: 'bg-emerald-500',
      action: 'Synced Dolby Atmos stems',
      target: 'Enterprise Cloud Vault (Mumbai BOM-1 Edge)',
      category: 'vault',
      timestamp: '32m ago',
      statusTag: 'AES-256 Encrypted',
    },
    {
      id: 'act-5',
      workspaceId: 'ws-vfx-2',
      userId: 'collab-5',
      userName: 'Maya Lin',
      userRole: 'Reviewer',
      userAvatarColor: 'bg-pink-500',
      action: 'Approved color grade marker',
      target: 'Frame 4,200 on 32K ACES 2.0 Plate',
      category: 'review',
      timestamp: '45m ago',
      statusTag: 'Sign-off Verified',
    },
    {
      id: 'act-6',
      workspaceId: 'ws-prod-1',
      userId: 'collab-1',
      userName: 'Alex Rivera',
      userRole: 'Owner',
      userAvatarColor: 'bg-amber-500',
      action: 'Updated RBAC permissions',
      target: 'Sound Designer role (Write Access to Audio Bus Stems)',
      category: 'rbac',
      timestamp: '1h ago',
      statusTag: 'Permission Granted',
    },
    {
      id: 'act-7',
      workspaceId: 'ws-prod-1',
      userId: 'system',
      userName: 'System Daemon',
      userRole: 'Producer',
      userAvatarColor: 'bg-indigo-500',
      action: 'Automated snapshot backup',
      target: 'Sprint 42 Full Conform Snapshot (SHA-256 Verified)',
      category: 'pipeline',
      timestamp: '2h ago',
      statusTag: 'Snapshot Stored',
    },
    {
      id: 'act-8',
      workspaceId: 'ws-vfx-2',
      userId: 'collab-3',
      userName: 'Kenji Sato',
      userRole: 'VFX Artist',
      userAvatarColor: 'bg-cyan-500',
      action: 'Completed optical flow pass',
      target: 'Cinema VFX 1000 FPS Master (ProRes 4444 XQ)',
      category: 'production_queue',
      timestamp: '3h ago',
      statusTag: '100% Completed',
    },
  ]);

  // Project Management filter and modal states
  const [queueFilterStatus, setQueueFilterStatus] = useState<ProductionJobStatus | 'all'>('all');
  const [queueFilterWorkspace, setQueueFilterWorkspace] = useState<string>('all');
  const [queueSearch, setQueueSearch] = useState<string>('');
  const [activityCategoryFilter, setActivityCategoryFilter] = useState<'all' | 'production_queue' | 'vault' | 'workspace' | 'review' | 'rbac' | 'pipeline'>('all');
  const [isNewJobModalOpen, setIsNewJobModalOpen] = useState(false);
  const [selectedJobForPreview, setSelectedJobForPreview] = useState<VideoProductionJob | null>(null);
  const [projectDashboardSuccessMessage, setProjectDashboardSuccessMessage] = useState('');

  // Enqueue new job form fields
  const [newJobTitle, setNewJobTitle] = useState('');
  const [newJobFormat, setNewJobFormat] = useState('LEO 4K ProRes 422 HQ');
  const [newJobResolution, setNewJobResolution] = useState('3840×2160 (4K)');
  const [newJobFps, setNewJobFps] = useState(60);
  const [newJobDuration, setNewJobDuration] = useState('02:30');
  const [newJobWorkspaceId, setNewJobWorkspaceId] = useState('ws-prod-1');
  const [newJobNode, setNewJobNode] = useState('GPU Node #1 (RTX 4090 D)');
  const [newJobPriority, setNewJobPriority] = useState<ProductionJobPriority>('high');

  // Team Invite Modal state
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'Director' | 'VFX Artist' | 'Editor' | 'Sound Designer' | 'Reviewer'>('Editor');
  const [inviteSuccessMessage, setInviteSuccessMessage] = useState('');

  // Enterprise Multi-Workspace state
  const [workspaces, setWorkspaces] = useState<EnterpriseWorkspace[]>([
    {
      id: 'ws-prod-1',
      name: 'Master Production Suite',
      slug: 'master-prod',
      description: 'Main collaborative workspace for studio releases, LEO 4K videos and viral memes',
      assignedGpuNodes: 4,
      membersCount: 4,
      activeProjectsCount: 12,
      storageUsedGb: 320.5,
      isDefault: true,
      createdAt: '2026-10-01',
    },
    {
      id: 'ws-vfx-2',
      name: 'Cinema VFX 32K Suite',
      slug: 'cinema-32k',
      description: 'High-end 32000×32000 plates, 1000 FPS optical flow renders and ACES 2.0 grades',
      assignedGpuNodes: 2,
      membersCount: 2,
      activeProjectsCount: 5,
      storageUsedGb: 12400.8, // ~12.4 TB
      isDefault: false,
      createdAt: '2026-10-15',
    },
    {
      id: 'ws-marketing-3',
      name: 'Viral Ad Agency & Clients',
      slug: 'ad-agency',
      description: 'External client review drafts, vertical TikTok/Reel formats and sponsorship masters',
      assignedGpuNodes: 2,
      membersCount: 3,
      activeProjectsCount: 8,
      storageUsedGb: 180.2,
      isDefault: false,
      createdAt: '2026-10-20',
    },
  ]);

  const [activeWorkspaceId, setActiveWorkspaceId] = useState<string>('ws-prod-1');
  const [isNewWorkspaceModalOpen, setIsNewWorkspaceModalOpen] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState('');
  const [newWorkspaceSlug, setNewWorkspaceSlug] = useState('');
  const [newWorkspaceDesc, setNewWorkspaceDesc] = useState('');
  const [newWorkspaceNodes, setNewWorkspaceNodes] = useState<number>(2);
  const [workspaceSuccessMessage, setWorkspaceSuccessMessage] = useState('');

  // Enterprise Cloud Vault state (50 TB Quota)
  const [vaultFilter, setVaultFilter] = useState<'all' | '32K Master Plate' | 'ProRes 4444 XQ' | 'Fairlight 192kHz Audio' | 'Film 3D LUT'>('all');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [newAssetName, setNewAssetName] = useState('');
  const [newAssetType, setNewAssetType] = useState<EnterpriseVaultAsset['type']>('32K Master Plate');
  const [newAssetRegion, setNewAssetRegion] = useState('Edge: Mumbai BOM-1 (APAC)');
  const [newAssetPermission, setNewAssetPermission] = useState<EnterpriseVaultAsset['permission']>('Team Read / Write');
  const [copiedAssetId, setCopiedAssetId] = useState<string | null>(null);
  const [vaultSuccessMessage, setVaultSuccessMessage] = useState('');

  const [vaultAssets, setVaultAssets] = useState<EnterpriseVaultAsset[]>([
    {
      id: 'va-1',
      workspaceId: 'ws-vfx-2',
      name: 'cyberpunk_neo_tokyo_32k_master_plate.exr',
      size: '16.38 GB',
      sizeBytes: 17587847168,
      type: '32K Master Plate',
      edgeNode: 'Edge: Mumbai BOM-1 (APAC)',
      latency: '6ms',
      permission: 'Owner & Director Only',
      encrypted: true,
      encryptionStandard: 'AES-256 GCM Zero-Knowledge',
      uploadedBy: 'Kenji Sato (VFX Lead)',
      uploadedAt: 'Today at 02:45 AM',
    },
    {
      id: 'va-2',
      workspaceId: 'ws-prod-1',
      name: 'leo_hyperlapse_100h_prores_4444_xq.mov',
      size: '482.1 GB',
      sizeBytes: 517652758528,
      type: 'ProRes 4444 XQ',
      edgeNode: 'Edge: Singapore SIN-1',
      latency: '9ms',
      permission: 'Team Read / Write',
      encrypted: true,
      encryptionStandard: 'AES-256 GCM Zero-Knowledge',
      uploadedBy: 'Alex Rivera (Owner)',
      uploadedAt: 'Yesterday at 08:12 PM',
    },
    {
      id: 'va-3',
      workspaceId: 'ws-vfx-2',
      name: 'kodak_vision3_2383_dci_p3_32k.cube',
      size: '2.4 MB',
      sizeBytes: 2516582,
      type: 'Film 3D LUT',
      edgeNode: 'Edge: Tokyo NRT-1',
      latency: '11ms',
      permission: 'Team Read / Write',
      encrypted: true,
      encryptionStandard: 'AES-256 GCM Zero-Knowledge',
      uploadedBy: 'Elena Rostova (Director)',
      uploadedAt: '2 days ago',
    },
    {
      id: 'va-4',
      workspaceId: 'ws-prod-1',
      name: 'atmos_bed_dialogue_soundtrack_192khz.wav',
      size: '4.8 GB',
      sizeBytes: 5153960755,
      type: 'Fairlight 192kHz Audio',
      edgeNode: 'Edge: Frankfurt FRA-1 (EU)',
      latency: '14ms',
      permission: 'Team Read / Write',
      encrypted: true,
      encryptionStandard: 'AES-256 GCM Zero-Knowledge',
      uploadedBy: 'Alex Rivera (Owner)',
      uploadedAt: '3 days ago',
    },
    {
      id: 'va-5',
      workspaceId: 'ws-marketing-3',
      name: 'drake_hotline_4k_vector_pack.svg',
      size: '14.2 MB',
      sizeBytes: 14889779,
      type: 'Vector Template',
      edgeNode: 'Edge: US-East IAD-1',
      latency: '18ms',
      permission: 'Public CDN Cached',
      encrypted: false,
      encryptionStandard: 'Edge TLS 1.3',
      uploadedBy: 'Maya Lin (Reviewer)',
      uploadedAt: '4 days ago',
    },
  ]);

  const limits = getPlanLimits(subscription);
  const isCompanyEnterprise = subscription?.isActive && subscription?.plan === 'company_team';
  const vaultQuota = getCloudVaultQuota(subscription);

  const activeWorkspace = workspaces.find((w) => w.id === activeWorkspaceId) || workspaces[0];

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

  // Handle Team Member Invitation
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

  // Handle Create Enterprise Workspace
  const handleCreateWorkspace = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWorkspaceName.trim()) return;

    if (!canCreateWorkspace(workspaces.length, subscription)) {
      onOpenSubscriptionModal?.('company');
      return;
    }

    const created: EnterpriseWorkspace = {
      id: `ws-${Date.now()}`,
      name: newWorkspaceName.trim(),
      slug: newWorkspaceSlug.trim() || newWorkspaceName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: newWorkspaceDesc.trim() || 'Enterprise isolated production environment',
      assignedGpuNodes: newWorkspaceNodes,
      membersCount: 1,
      activeProjectsCount: 1,
      storageUsedGb: 0.5,
      isDefault: false,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setWorkspaces([...workspaces, created]);
    setActiveWorkspaceId(created.id);
    setWorkspaceSuccessMessage(`✓ Workspace "${created.name}" created with ${newWorkspaceNodes} dedicated GPU nodes!`);
    setNewWorkspaceName('');
    setNewWorkspaceSlug('');
    setNewWorkspaceDesc('');
    setTimeout(() => setWorkspaceSuccessMessage(''), 4000);
    setIsNewWorkspaceModalOpen(false);
  };

  // Handle Upload to Enterprise Cloud Vault
  const handleUploadAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAssetName.trim()) return;

    const newAsset: EnterpriseVaultAsset = {
      id: `va-${Date.now()}`,
      workspaceId: activeWorkspaceId,
      name: newAssetName.trim(),
      size: newAssetType === '32K Master Plate' ? '16.38 GB' : newAssetType === 'ProRes 4444 XQ' ? '4.2 GB' : '128 MB',
      sizeBytes: 1024 * 1024 * 128,
      type: newAssetType,
      edgeNode: newAssetRegion,
      latency: '7ms',
      permission: newAssetPermission,
      encrypted: true,
      encryptionStandard: 'AES-256 GCM Zero-Knowledge',
      uploadedBy: 'Alex Rivera (Owner)',
      uploadedAt: 'Just now',
    };

    setVaultAssets([newAsset, ...vaultAssets]);
    setVaultSuccessMessage(`✓ Asset "${newAsset.name}" encrypted and synced to ${newAsset.edgeNode}`);
    setNewAssetName('');
    setTimeout(() => setVaultSuccessMessage(''), 4000);
    setIsUploadModalOpen(false);
  };

  const handleCopyLink = (assetId: string) => {
    setCopiedAssetId(assetId);
    setTimeout(() => setCopiedAssetId(null), 3000);
  };

  const filteredVaultAssets = vaultFilter === 'all'
    ? vaultAssets
    : vaultAssets.filter((a) => a.type === vaultFilter);

  // Handle Toggle Job Pause / Resume
  const handleToggleJobPause = (jobId: string) => {
    setProductionJobs((prev) =>
      prev.map((j) => {
        if (j.id === jobId) {
          const nextStatus: ProductionJobStatus = j.status === 'paused' ? 'rendering' : 'paused';
          return { ...j, status: nextStatus };
        }
        return j;
      })
    );
    const target = productionJobs.find((j) => j.id === jobId);
    const isPaused = target?.status !== 'paused';
    setProjectDashboardSuccessMessage(isPaused ? `⏸ Job "${target?.title}" paused` : `▶ Job "${target?.title}" resumed on GPU cluster`);
    setTimeout(() => setProjectDashboardSuccessMessage(''), 3500);
  };

  // Handle Prioritize Job
  const handlePrioritizeJob = (jobId: string) => {
    setProductionJobs((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, priority: 'urgent' as const } : j))
    );
    const target = productionJobs.find((j) => j.id === jobId);
    setProjectDashboardSuccessMessage(`⚡ Job "${target?.title}" bumped to URGENT priority on GPU cluster!`);
    setTimeout(() => setProjectDashboardSuccessMessage(''), 3500);
  };

  // Handle Cancel Job
  const handleCancelJob = (jobId: string) => {
    const target = productionJobs.find((j) => j.id === jobId);
    setProductionJobs((prev) => prev.filter((j) => j.id !== jobId));
    setProjectDashboardSuccessMessage(`✕ Job "${target?.title}" removed from production queue`);
    setTimeout(() => setProjectDashboardSuccessMessage(''), 3500);
  };

  // Handle Enqueue New Video Job
  const handleEnqueueJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJobTitle.trim()) return;

    const createdJob: VideoProductionJob = {
      id: `job-${Date.now()}`,
      workspaceId: newJobWorkspaceId,
      title: newJobTitle.trim(),
      format: newJobFormat,
      resolution: newJobResolution,
      fps: newJobFps,
      duration: newJobDuration || '02:00',
      assignedNode: newJobNode,
      status: 'rendering',
      progress: 8,
      currentFrame: 144,
      totalFrames: newJobFps * 60 * 2,
      priority: newJobPriority,
      leadCollaborator: 'Alex Rivera (Owner)',
      eta: '3m 15s',
      submittedAt: 'Just now',
    };

    setProductionJobs([createdJob, ...productionJobs]);

    const newLog: TeamActivityLog = {
      id: `act-${Date.now()}`,
      workspaceId: newJobWorkspaceId,
      userId: 'collab-1',
      userName: 'Alex Rivera',
      userRole: 'Owner',
      userAvatarColor: 'bg-amber-500',
      action: 'Dispatched GPU render',
      target: `${createdJob.title} (${createdJob.format} on ${createdJob.assignedNode})`,
      category: 'production_queue',
      timestamp: 'Just now',
      statusTag: 'Dispatched to Cluster',
    };
    setActivityLogs([newLog, ...activityLogs]);

    setProjectDashboardSuccessMessage(`✓ Enqueued "${createdJob.title}" to ${createdJob.assignedNode}!`);
    setNewJobTitle('');
    setTimeout(() => setProjectDashboardSuccessMessage(''), 4000);
    setIsNewJobModalOpen(false);
  };

  // Handle Nudge Collaborator
  const handleNudgeCollaborator = (name: string, role: string) => {
    setProjectDashboardSuccessMessage(`🔔 Direct nudge sent to ${name} (${role}): "Pipeline status check requested"`);
    setTimeout(() => setProjectDashboardSuccessMessage(''), 4000);
  };

  // Handle Export Audit Log
  const handleExportAuditLog = (format: 'json' | 'csv') => {
    let content = '';
    let mimeType = '';
    let filename = '';

    if (format === 'json') {
      content = JSON.stringify(activityLogs, null, 2);
      mimeType = 'application/json';
      filename = `memeforge_team_audit_trail_${new Date().toISOString().split('T')[0]}.json`;
    } else {
      const headers = ['ID', 'Timestamp', 'User', 'Role', 'Action', 'Target', 'Category', 'Status Tag'];
      const rows = activityLogs.map((l) => [
        l.id,
        `"${l.timestamp}"`,
        `"${l.userName}"`,
        `"${l.userRole}"`,
        `"${l.action}"`,
        `"${l.target.replace(/"/g, '""')}"`,
        `"${l.category}"`,
        `"${l.statusTag || ''}"`,
      ]);
      content = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
      mimeType = 'text/csv';
      filename = `memeforge_team_audit_trail_${new Date().toISOString().split('T')[0]}.csv`;
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setProjectDashboardSuccessMessage(`✓ Exported ${activityLogs.length} activity audit log records (${format.toUpperCase()})`);
    setTimeout(() => setProjectDashboardSuccessMessage(''), 4000);
  };

  // Filtered production jobs
  const filteredJobs = productionJobs.filter((job) => {
    const matchesStatus = queueFilterStatus === 'all' || job.status === queueFilterStatus;
    const matchesWorkspace = queueFilterWorkspace === 'all' || job.workspaceId === queueFilterWorkspace;
    const matchesSearch =
      !queueSearch.trim() ||
      job.title.toLowerCase().includes(queueSearch.toLowerCase()) ||
      job.format.toLowerCase().includes(queueSearch.toLowerCase()) ||
      job.leadCollaborator.toLowerCase().includes(queueSearch.toLowerCase()) ||
      job.assignedNode.toLowerCase().includes(queueSearch.toLowerCase());
    return matchesStatus && matchesWorkspace && matchesSearch;
  });

  // Filtered activity logs
  const filteredActivityLogs =
    activityCategoryFilter === 'all'
      ? activityLogs
      : activityLogs.filter((log) => log.category === activityCategoryFilter);

  // Queue metrics
  const queueMetrics = calculateProjectQueueMetrics(productionJobs);

  return (
    <div className="space-y-6">
      {/* Enterprise Plan Banner (Rs. 99,999/mo) or Upsell */}
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
                  50 Seats • 10 Workspaces • 50 TB Vault • Rs. 99,999 / mo
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                {subscription?.companyName ? <strong className="text-white">{subscription.companyName} • </strong> : ''}
                Dedicated 8-Node GPU Cluster • Multi-Workspace Isolation • AES-256 Zero-Knowledge Vault • 18% GST Input Credit Active
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <span className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono font-bold text-cyan-300">
              Seats: {teamMembers.length} / {limits.teamWorkspaceSeats} • Workspaces: {workspaces.length} / {limits.teamWorkspacesMax}
            </span>
            <button
              onClick={() => onOpenSubscriptionModal?.('company')}
              className="px-3.5 py-1.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/40 text-cyan-200 text-xs font-bold transition-colors"
            >
              Enterprise SLA Details
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
                <span className="text-base font-black text-white">Team Enterprise: 10 Workspaces &amp; 50 TB Encrypted Vault</span>
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[10px] font-black uppercase">
                  Rs. 99,999 / mo
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Unlock 10 isolated production workspaces with dedicated GPU node pools, 50 TB AES-256 Zero-Knowledge Cloud Vault, and 50 team member seats.
              </p>
            </div>
          </div>
          <button
            onClick={() => onOpenSubscriptionModal?.('company')}
            className="px-4 py-2.5 bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 hover:opacity-95 text-white text-xs font-black rounded-xl shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 shrink-0 transition-transform active:scale-95"
          >
            <Building2 className="w-4 h-4" />
            <span>Upgrade Team (Rs. 99,999/mo)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Workspace Switcher & Hub Header Bar */}
      <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
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
                Active Workspace: <strong className="text-white">{activeWorkspace.name}</strong> ({activeWorkspace.assignedGpuNodes} Dedicated GPU Nodes • {activeWorkspace.storageUsedGb > 1000 ? `${(activeWorkspace.storageUsedGb / 1024).toFixed(1)} TB` : `${activeWorkspace.storageUsedGb} GB`})
              </p>
            </div>
          </div>

          {/* Quick Workspace Switcher Selector */}
          <div className="flex items-center gap-2 sm:ml-4">
            <select
              value={activeWorkspaceId}
              onChange={(e) => setActiveWorkspaceId(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-cyan-300 focus:outline-none focus:border-cyan-400"
            >
              {workspaces.map((w) => (
                <option key={w.id} value={w.id}>
                  📁 {w.name} ({w.assignedGpuNodes} Nodes)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Sub-tab pills: Project Management, Workspaces, Enterprise Vault, Roles & RBAC, Timeline Snapshots */}
        <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-2xl border border-slate-800 overflow-x-auto">
          <button
            onClick={() => setActiveSubTab('projects')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeSubTab === 'projects'
                ? 'bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/25 ring-1 ring-blue-400/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-blue-300" />
            <span>Project Management ({productionJobs.filter((j) => j.status === 'rendering' || j.status === 'compositing').length} Live)</span>
          </button>
          <button
            onClick={() => setActiveSubTab('workspaces')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeSubTab === 'workspaces'
                ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Workspaces ({workspaces.length}/{limits.teamWorkspacesMax})</span>
          </button>
          <button
            onClick={() => setActiveSubTab('vault')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeSubTab === 'vault'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Cloud className="w-3.5 h-3.5" />
            <span>Enterprise Vault (50 TB)</span>
          </button>
          <button
            onClick={() => setActiveSubTab('members')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeSubTab === 'members'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Roles &amp; Seats ({teamMembers.length}/{limits.teamWorkspaceSeats})</span>
          </button>
          <button
            onClick={() => setActiveSubTab('versions')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeSubTab === 'versions'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Snapshots ({versionHistory.length})</span>
          </button>
        </div>
      </div>

      {/* Success Notification Toasts */}
      {projectDashboardSuccessMessage && (
        <div className="p-3 rounded-2xl bg-blue-500/15 border border-blue-500/30 text-blue-300 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-blue-400" />
          <span>{projectDashboardSuccessMessage}</span>
        </div>
      )}
      {workspaceSuccessMessage && (
        <div className="p-3 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-cyan-400" />
          <span>{workspaceSuccessMessage}</span>
        </div>
      )}
      {vaultSuccessMessage && (
        <div className="p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{vaultSuccessMessage}</span>
        </div>
      )}

      {/* SUB-TAB 0: PROJECT MANAGEMENT DASHBOARD (Team Enterprise) */}
      {activeSubTab === 'projects' && (
        <div className="space-y-6">
          {/* Dashboard Header Bar & Global Cluster Telemetry */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-5">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2.5">
                  <span className="p-2 rounded-xl bg-gradient-to-tr from-blue-500/20 to-indigo-500/20 text-blue-400 border border-blue-500/30">
                    <LayoutDashboard className="w-5 h-5" />
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-black text-white tracking-wide uppercase">
                        Project Management &amp; Production Dashboard
                      </h4>
                      <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40 text-[10px] font-black uppercase">
                        Enterprise Engine
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Real-time video production queues, multi-seat collaborator presence, and team activity audit logs
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setIsNewJobModalOpen(true)}
                  className="px-3.5 py-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:opacity-95 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-500/20 flex items-center gap-2 transition-all active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span>Enqueue Production Job</span>
                </button>

                <div className="flex items-center rounded-xl bg-slate-950 border border-slate-800 p-0.5">
                  <button
                    onClick={() => handleExportAuditLog('csv')}
                    className="px-2.5 py-1.5 text-slate-300 hover:text-white hover:bg-slate-850 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors"
                    title="Export Audit Trail CSV"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Audit CSV</span>
                  </button>
                  <button
                    onClick={() => handleExportAuditLog('json')}
                    className="px-2.5 py-1.5 text-slate-300 hover:text-white hover:bg-slate-850 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors"
                    title="Export Audit Trail JSON"
                  >
                    <Download className="w-3.5 h-3.5 text-cyan-400" />
                    <span>JSON</span>
                  </button>
                </div>
              </div>
            </div>

            {/* 4 Telemetry Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Film className="w-3.5 h-3.5 text-blue-400" />
                    <span>Production Queue</span>
                  </span>
                  <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Live
                  </span>
                </div>
                <div>
                  <div className="text-xl font-black text-white font-mono">
                    {queueMetrics.activeCount} In Flight <span className="text-xs text-slate-400 font-sans font-normal">/ {queueMetrics.queuedCount} Queued</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
                    <span>Avg Progress: <strong className="text-blue-300 font-mono">{queueMetrics.avgProgress}%</strong></span>
                    <span>{queueMetrics.completedCount} Completed</span>
                  </div>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full" style={{ width: `${queueMetrics.avgProgress}%` }} />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-purple-400" />
                    <span>Dedicated GPU Load</span>
                  </span>
                  <span className="text-[10px] font-mono text-purple-300 font-bold">
                    8 Dedicated Nodes
                  </span>
                </div>
                <div>
                  <div className="text-xl font-black text-white font-mono">
                    84.2% <span className="text-xs text-slate-400 font-sans font-normal">Cluster Load</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    NVLink Bus: <strong className="text-emerald-400 font-mono">14.2 GB/s</strong> • 0 Dropped Frames
                  </div>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full" style={{ width: '84.2%' }} />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Collaborator Presence</span>
                  </span>
                  <span className="text-[10px] font-mono text-emerald-300 font-bold">
                    {collaborators.filter(c => c.status !== 'idle' && c.status !== 'offline').length} Active
                  </span>
                </div>
                <div>
                  <div className="text-xl font-black text-white font-mono">
                    {collaborators.length} Seats <span className="text-xs text-slate-400 font-sans font-normal">/ {limits.teamWorkspaceSeats} Max</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    2 Rendering • 1 Reviewing • 2 Active
                  </div>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-gradient-to-r from-emerald-500 to-cyan-500 h-full rounded-full" style={{ width: `${Math.min(100, (collaborators.length / limits.teamWorkspaceSeats) * 100)}%` }} />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-amber-400" />
                    <span>Audit Trail Log</span>
                  </span>
                  <span className="text-[10px] font-mono text-amber-300 font-bold">
                    24h Feed
                  </span>
                </div>
                <div>
                  <div className="text-xl font-black text-white font-mono">
                    {activityLogs.length} Events <span className="text-xs text-slate-400 font-sans font-normal">Logged</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    Multi-Region Edge Synced • SHA-256 Audit
                  </div>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-gradient-to-r from-amber-500 to-orange-500 h-full rounded-full" style={{ width: '100%' }} />
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 1: ACTIVE VIDEO PRODUCTION QUEUES */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <Film className="w-4 h-4 text-blue-400" />
                  <span>Active Video Production Queues ({filteredJobs.length} Jobs)</span>
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  High-throughput GPU render farm dispatching 4K LEO masters, 32K optical flow plates, and 192 kHz audio
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* Search */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={queueSearch}
                    onChange={(e) => setQueueSearch(e.target.value)}
                    placeholder="Search jobs..."
                    className="pl-8 pr-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500 placeholder-slate-500 w-36 sm:w-48"
                  />
                </div>

                {/* Workspace filter */}
                <select
                  value={queueFilterWorkspace}
                  onChange={(e) => setQueueFilterWorkspace(e.target.value)}
                  className="px-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-300 focus:outline-none focus:border-blue-500"
                >
                  <option value="all">All Workspaces</option>
                  {workspaces.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Status Filter Buttons */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              {(
                [
                  { id: 'all', label: 'All Jobs', count: productionJobs.length },
                  { id: 'rendering', label: 'Rendering', count: productionJobs.filter(j => j.status === 'rendering').length },
                  { id: 'compositing', label: 'Compositing', count: productionJobs.filter(j => j.status === 'compositing').length },
                  { id: 'in_review', label: 'In Review', count: productionJobs.filter(j => j.status === 'in_review').length },
                  { id: 'queued', label: 'Queued', count: productionJobs.filter(j => j.status === 'queued').length },
                  { id: 'completed', label: 'Completed', count: productionJobs.filter(j => j.status === 'completed').length },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setQueueFilterStatus(tab.id)}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                    queueFilterStatus === tab.id
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-800/80 text-slate-300">
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Jobs Queue List */}
            {filteredJobs.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-slate-950 border border-slate-850 space-y-2">
                <Film className="w-8 h-8 text-slate-600 mx-auto" />
                <p className="text-xs text-slate-400">No production jobs found matching current filters.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredJobs.map((job) => {
                  const ws = workspaces.find((w) => w.id === job.workspaceId);
                  const isRendering = job.status === 'rendering';
                  const isComp = job.status === 'compositing';
                  const isPaused = job.status === 'paused';
                  const isCompleted = job.status === 'completed';

                  return (
                    <div
                      key={job.id}
                      className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all space-y-3"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2.5">
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            {/* Priority Badge */}
                            <span
                              className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider ${
                                job.priority === 'urgent'
                                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                                  : job.priority === 'high'
                                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                  : 'bg-slate-800 text-slate-400'
                              }`}
                            >
                              {job.priority}
                            </span>

                            {/* Job Title */}
                            <span className="text-sm font-black text-white">{job.title}</span>

                            {/* Status Tag */}
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${
                                isRendering
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                  : isComp
                                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                                  : job.status === 'in_review'
                                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                  : job.status === 'queued'
                                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                                  : isCompleted
                                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                                  : 'bg-slate-800 text-slate-400'
                              }`}
                            >
                              {(isRendering || isComp) && (
                                <span className="w-1.5 h-1.5 rounded-full bg-current animate-ping" />
                              )}
                              <span>{job.status}</span>
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                            <span className="font-semibold text-slate-300">{job.format}</span>
                            <span className="text-slate-600">•</span>
                            <span className="font-mono text-cyan-400 text-[11px]">{job.resolution}</span>
                            <span className="text-slate-600">•</span>
                            <span className="font-mono text-slate-400 text-[11px]">{job.fps} FPS</span>
                            <span className="text-slate-600">•</span>
                            <span className="text-slate-300">📁 {ws?.name || 'Main Studio'}</span>
                            <span className="text-slate-600">•</span>
                            <span className="font-mono text-indigo-300 text-[11px]">{job.assignedNode}</span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 self-start lg:self-auto">
                          {(isRendering || isComp || isPaused) && (
                            <button
                              onClick={() => handleToggleJobPause(job.id)}
                              className={`px-2.5 py-1 rounded-xl text-xs font-bold border transition-all flex items-center gap-1 ${
                                isPaused
                                  ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/25'
                                  : 'bg-slate-900 border-slate-700 text-slate-300 hover:text-white'
                              }`}
                              title={isPaused ? 'Resume Job' : 'Pause Job'}
                            >
                              {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
                              <span>{isPaused ? 'Resume' : 'Pause'}</span>
                            </button>
                          )}

                          {job.priority !== 'urgent' && !isCompleted && (
                            <button
                              onClick={() => handlePrioritizeJob(job.id)}
                              className="px-2.5 py-1 rounded-xl text-xs font-bold bg-amber-500/15 border border-amber-500/30 text-amber-300 hover:bg-amber-500/25 transition-all flex items-center gap-1"
                              title="Prioritize to Top of GPU Queue"
                            >
                              <Zap className="w-3.5 h-3.5" />
                              <span>Prioritize</span>
                            </button>
                          )}

                          <button
                            onClick={() => setSelectedJobForPreview(job)}
                            className="px-2.5 py-1 rounded-xl text-xs font-bold bg-blue-500/15 border border-blue-500/30 text-blue-300 hover:bg-blue-500/25 transition-all flex items-center gap-1"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Preview</span>
                          </button>

                          {!isCompleted && (
                            <button
                              onClick={() => handleCancelJob(job.id)}
                              className="p-1.5 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                              title="Cancel Job"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Progress Bar & Telemetry */}
                      <div className="space-y-1.5 pt-1">
                        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-3 h-3 text-slate-500" />
                            <span>{job.eta}</span>
                            <span className="text-slate-600">•</span>
                            <span>Duration: {job.duration}</span>
                            <span className="text-slate-600">•</span>
                            <span>Lead: <strong className="text-slate-300">{job.leadCollaborator}</strong></span>
                          </span>
                          <span className="font-bold text-slate-200">
                            {job.currentFrame.toLocaleString()} / {job.totalFrames.toLocaleString()} Frames ({job.progress}%)
                          </span>
                        </div>

                        <div className="w-full h-2 rounded-full bg-slate-900 border border-slate-800 overflow-hidden flex">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              isCompleted
                                ? 'bg-purple-500'
                                : job.priority === 'urgent'
                                ? 'bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-600'
                                : 'bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-400'
                            }`}
                            style={{ width: `${job.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* SECTION 2 & 3 GRID: COLLABORATOR STATUS & ACTIVITY AUDIT TRAIL */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* PANEL 2: COLLABORATOR STATUS & LIVE PRESENCE */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                    <Users className="w-4 h-4 text-emerald-400" />
                    <span>Collaborator Status &amp; Real-Time Presence</span>
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {collaborators.filter(c => c.status !== 'idle' && c.status !== 'offline').length} collaborators actively driving pipelines
                  </p>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono font-bold">
                  {collaborators.length} Seats Active
                </span>
              </div>

              <div className="space-y-3">
                {collaborators.map((c) => {
                  const isRendering = c.status === 'rendering';
                  const isReviewing = c.status === 'in_review';
                  const isActive = c.status === 'active';

                  return (
                    <div
                      key={c.id}
                      className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        {/* Avatar with Status Ring */}
                        <div className="relative">
                          <div
                            className={`w-9 h-9 rounded-xl ${c.avatarColor} text-slate-950 font-black text-xs flex items-center justify-center shadow-md`}
                          >
                            {c.name.split(' ').map((n) => n[0]).join('')}
                          </div>
                          <span
                            className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-slate-950 ${
                              isRendering
                                ? 'bg-cyan-400 animate-pulse'
                                : isReviewing
                                ? 'bg-amber-400 animate-pulse'
                                : isActive
                                ? 'bg-emerald-400 animate-pulse'
                                : 'bg-slate-600'
                            }`}
                          />
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-white">{c.name}</span>
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 font-medium">
                              {c.role}
                            </span>
                            <span
                              className={`text-[9px] px-1.5 py-0.2 rounded font-mono uppercase ${
                                isRendering
                                  ? 'bg-cyan-500/20 text-cyan-300'
                                  : isReviewing
                                  ? 'bg-amber-500/20 text-amber-300'
                                  : isActive
                                  ? 'bg-emerald-500/20 text-emerald-300'
                                  : 'bg-slate-800 text-slate-500'
                              }`}
                            >
                              {c.status.replace('_', ' ')}
                            </span>
                          </div>

                          <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                            {c.currentActivity}
                          </p>

                          <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono mt-0.5">
                            <span>📁 {c.activeWorkspaceName}</span>
                            <span>•</span>
                            <span className="text-indigo-400">{c.assignedNode}</span>
                            <span>•</span>
                            <span>{c.lastActive}</span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleNudgeCollaborator(c.name, c.role)}
                        className="px-2.5 py-1 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 hover:text-white text-xs font-bold flex items-center gap-1.5 transition-colors self-end sm:self-auto shrink-0"
                      >
                        <Send className="w-3 h-3 text-cyan-400" />
                        <span>Nudge</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* PANEL 3: RECENT TEAM ACTIVITY LOGS */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div>
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                    <Activity className="w-4 h-4 text-amber-400" />
                    <span>Recent Team Activity &amp; Audit Logs</span>
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Immutable event trail across render queues, vault uploads &amp; RBAC changes
                  </p>
                </div>

                <div className="flex items-center gap-1.5">
                  <select
                    value={activityCategoryFilter}
                    onChange={(e) => setActivityCategoryFilter(e.target.value as any)}
                    className="px-2.5 py-1 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-300 focus:outline-none focus:border-amber-400"
                  >
                    <option value="all">All Categories</option>
                    <option value="production_queue">Production Queue</option>
                    <option value="vault">Enterprise Vault</option>
                    <option value="review">Review &amp; Sign-off</option>
                    <option value="workspace">Workspaces</option>
                    <option value="rbac">Roles &amp; RBAC</option>
                    <option value="pipeline">Pipeline Engine</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
                {filteredActivityLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80 hover:border-slate-750 transition-all flex items-start justify-between gap-3 text-xs"
                  >
                    <div className="flex items-start gap-2.5">
                      <div
                        className={`w-6 h-6 rounded-lg ${log.userAvatarColor} text-slate-950 font-black text-[10px] flex items-center justify-center shrink-0 mt-0.5`}
                      >
                        {log.userName.split(' ').map((n) => n[0]).join('')}
                      </div>

                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <strong className="text-white font-bold">{log.userName}</strong>
                          <span className="text-[10px] text-slate-500 font-mono">({log.userRole})</span>
                          <span className="text-slate-400 font-medium">{log.action}:</span>
                        </div>
                        <div className="text-slate-300 font-mono text-[11px] leading-relaxed">
                          {log.target}
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          {log.timestamp}
                        </div>
                      </div>
                    </div>

                    {log.statusTag && (
                      <span className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-[10px] font-mono text-cyan-300 shrink-0">
                        {log.statusTag}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 1: MULTI-WORKSPACE MANAGEMENT (10 Workspaces for Team Enterprise) */}
      {activeSubTab === 'workspaces' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                <span>Isolated Production Workspaces ({workspaces.length} of {limits.teamWorkspacesMax} Allowed)</span>
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Team Enterprise enables up to 10 isolated workspaces with dedicated GPU node pools and separate team access
              </p>
            </div>

            <button
              onClick={() => {
                if (canCreateWorkspace(workspaces.length, subscription)) {
                  setIsNewWorkspaceModalOpen(true);
                } else {
                  onOpenSubscriptionModal?.('company');
                }
              }}
              className="px-3.5 py-2 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 transition-all self-start sm:self-auto"
            >
              <FolderPlus className="w-4 h-4" />
              <span>Create New Workspace</span>
            </button>
          </div>

          {/* Workspaces Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {workspaces.map((ws) => {
              const isActive = ws.id === activeWorkspaceId;
              return (
                <div
                  key={ws.id}
                  className={`p-4 rounded-2xl border transition-all flex flex-col justify-between space-y-4 ${
                    isActive
                      ? 'bg-slate-950 border-cyan-500/60 shadow-xl shadow-cyan-950/40 ring-1 ring-cyan-500/30'
                      : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-white flex items-center gap-1.5">
                        <span>{ws.name}</span>
                        {ws.isDefault && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 uppercase font-mono">
                            Default
                          </span>
                        )}
                      </span>
                      {isActive ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                          Active
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono text-slate-500">/{ws.slug}</span>
                      )}
                    </div>

                    <p className="text-[11px] text-slate-400 leading-relaxed min-h-[34px]">
                      {ws.description}
                    </p>

                    <div className="grid grid-cols-2 gap-2 pt-2 text-[10px] font-mono border-t border-slate-900">
                      <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-300 flex items-center gap-1.5">
                        <Server className="w-3.5 h-3.5 text-cyan-400" />
                        <span>{ws.assignedGpuNodes} GPU Nodes</span>
                      </div>
                      <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-300 flex items-center gap-1.5">
                        <HardDrive className="w-3.5 h-3.5 text-purple-400" />
                        <span>{ws.storageUsedGb > 1000 ? `${(ws.storageUsedGb / 1024).toFixed(1)} TB` : `${ws.storageUsedGb} GB`}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-900 flex items-center justify-between">
                    <span className="text-[10px] text-slate-500 font-mono">
                      {ws.activeProjectsCount} projects • {ws.membersCount} members
                    </span>

                    {!isActive ? (
                      <button
                        onClick={() => setActiveWorkspaceId(ws.id)}
                        className="px-3 py-1 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-white transition-colors"
                      >
                        Switch To
                      </button>
                    ) : (
                      <span className="text-xs font-bold text-cyan-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Current</span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUB-TAB 2: ENTERPRISE 50 TB ENCRYPTED CLOUD VAULT */}
      {activeSubTab === 'vault' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Cloud className="w-4 h-4 text-cyan-400" />
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Enterprise Cloud Vault ({vaultQuota.storageTb} TB Quota)
                </h4>
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[9px] font-mono font-bold uppercase">
                  {vaultQuota.encryptionStandard.split(' ')[0]} GCM
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Zero-knowledge encrypted multi-region storage for 32K master plates, ProRes stems, and 192 kHz audio
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="px-3.5 py-2 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 transition-all"
              >
                <UploadCloud className="w-4 h-4" />
                <span>Upload to Enterprise Vault</span>
              </button>
            </div>
          </div>

          {/* Storage Quota Gauge & Multi-Region Health */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-cyan-400" />
                <span className="font-bold text-white">Cloud Storage Allocation:</span>
                <span className="font-mono text-cyan-300 font-bold">18.42 TB / {vaultQuota.storageTb} TB Used (36.8%)</span>
              </div>
              <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                Multi-Region Edge Active (5 Hubs)
              </span>
            </div>

            {/* Storage Progress Bar */}
            <div className="w-full h-3 rounded-full bg-slate-900 overflow-hidden flex border border-slate-800">
              <div className="h-full bg-gradient-to-r from-cyan-500 to-indigo-600 rounded-full" style={{ width: '36.8%' }} />
            </div>

            {/* Global Edge Latency Meters */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[10px] font-mono">
              <div className="p-2 rounded-xl bg-slate-900 border border-slate-850 flex items-center justify-between">
                <span className="text-slate-400">Mumbai BOM-1:</span>
                <span className="text-emerald-400 font-bold">6ms</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-900 border border-slate-850 flex items-center justify-between">
                <span className="text-slate-400">Singapore SIN-1:</span>
                <span className="text-emerald-400 font-bold">9ms</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-900 border border-slate-850 flex items-center justify-between">
                <span className="text-slate-400">Tokyo NRT-1:</span>
                <span className="text-emerald-400 font-bold">11ms</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-900 border border-slate-850 flex items-center justify-between">
                <span className="text-slate-400">Frankfurt FRA-1:</span>
                <span className="text-emerald-400 font-bold">14ms</span>
              </div>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <button
              onClick={() => setVaultFilter('all')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                vaultFilter === 'all' ? 'bg-cyan-500 text-slate-950 font-black' : 'bg-slate-950 text-slate-400 hover:text-white'
              }`}
            >
              All Assets ({vaultAssets.length})
            </button>
            <button
              onClick={() => setVaultFilter('32K Master Plate')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                vaultFilter === '32K Master Plate' ? 'bg-cyan-500 text-slate-950 font-black' : 'bg-slate-950 text-slate-400 hover:text-white'
              }`}
            >
              32K Plates (EXR)
            </button>
            <button
              onClick={() => setVaultFilter('ProRes 4444 XQ')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                vaultFilter === 'ProRes 4444 XQ' ? 'bg-cyan-500 text-slate-950 font-black' : 'bg-slate-950 text-slate-400 hover:text-white'
              }`}
            >
              ProRes 4444 XQ
            </button>
            <button
              onClick={() => setVaultFilter('Fairlight 192kHz Audio')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                vaultFilter === 'Fairlight 192kHz Audio' ? 'bg-cyan-500 text-slate-950 font-black' : 'bg-slate-950 text-slate-400 hover:text-white'
              }`}
            >
              192 kHz Audio
            </button>
            <button
              onClick={() => setVaultFilter('Film 3D LUT')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                vaultFilter === 'Film 3D LUT' ? 'bg-cyan-500 text-slate-950 font-black' : 'bg-slate-950 text-slate-400 hover:text-white'
              }`}
            >
              3D LUTs (.cube)
            </button>
          </div>

          {/* Assets Table */}
          <div className="space-y-2.5">
            {filteredVaultAssets.map((asset) => (
              <div
                key={asset.id}
                className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center font-mono text-[11px] font-bold shrink-0">
                    {asset.type.split(' ')[0]}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold text-white font-mono">{asset.name}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                        {asset.size}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 font-semibold">
                        <Lock className="w-3 h-3" />
                        {asset.encryptionStandard.split(' ')[0]}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400 mt-1">
                      <span className="text-cyan-400">{asset.edgeNode}</span>
                      <span>•</span>
                      <span className="text-emerald-400 font-mono">{asset.latency} latency</span>
                      <span>•</span>
                      <span>Uploaded by {asset.uploadedBy}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                  <button
                    onClick={() => handleCopyLink(asset.id)}
                    className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-mono text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors"
                    title="Copy presigned edge link with 1-hour expiration"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedAssetId === asset.id ? 'Copied Link!' : 'Presigned Link'}</span>
                  </button>

                  <button
                    className="px-3 py-1.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/40 text-cyan-300 text-xs font-bold flex items-center gap-1.5 transition-colors"
                    title="Download decrypted studio master"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Master</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: TEAM MEMBERS & GRANULAR RBAC PERMISSIONS */}
      {activeSubTab === 'members' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div>
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Shield className="w-4 h-4 text-cyan-400" />
                <span>Team Access Control &amp; RBAC ({teamMembers.length} / {limits.teamWorkspaceSeats} Seats)</span>
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Manage roles, live edit permissions, and rendering quota allocations across {workspaces.length} workspaces
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsInviteModalOpen(true)}
                className="px-3.5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs rounded-xl shadow-md flex items-center gap-1.5 transition-all self-start sm:self-auto cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Invite Member</span>
              </button>
            </div>
          </div>

          {inviteSuccessMessage && (
            <div className="p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{inviteSuccessMessage}</span>
            </div>
          )}

          <div className="space-y-3">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-2xl ${member.avatarColor} text-slate-950 font-black text-sm flex items-center justify-center shadow-md`}
                  >
                    {member.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{member.name}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                        {member.role}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400">{member.email}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs">
                  <span className="flex items-center gap-1.5 text-slate-400">
                    <span
                      className={`w-2 h-2 rounded-full ${member.isOnline ? 'bg-emerald-400' : 'bg-slate-600'}`}
                    />
                    <span>{member.activity}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 4: VERSION HISTORY & ROLLBACK */}
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

      {/* MODAL 1: CREATE ENTERPRISE WORKSPACE */}
      {isNewWorkspaceModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                  <FolderPlus className="w-5 h-5" />
                </span>
                <div>
                  <h4 className="text-base font-bold text-white">Create Isolated Workspace</h4>
                  <p className="text-xs text-slate-400">
                    Allocate dedicated GPU nodes and separate project storage
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsNewWorkspaceModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateWorkspace} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Workspace Name:
                </label>
                <input
                  type="text"
                  required
                  value={newWorkspaceName}
                  onChange={(e) => {
                    setNewWorkspaceName(e.target.value);
                    if (!newWorkspaceSlug) {
                      setNewWorkspaceSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
                    }
                  }}
                  placeholder="e.g. Cinema VFX 32K Suite"
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Workspace Slug Identifier:
                </label>
                <input
                  type="text"
                  required
                  value={newWorkspaceSlug}
                  onChange={(e) => setNewWorkspaceSlug(e.target.value)}
                  placeholder="e.g. vfx-master"
                  className="w-full px-3 py-2 text-xs font-mono bg-slate-950 border border-slate-800 rounded-xl text-cyan-300 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Dedicated GPU Nodes Allocation:
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[1, 2, 4, 8].map((nodes) => (
                    <button
                      key={nodes}
                      type="button"
                      onClick={() => setNewWorkspaceNodes(nodes)}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                        newWorkspaceNodes === nodes
                          ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {nodes} Nodes
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Description &amp; Project Scope:
                </label>
                <textarea
                  rows={2}
                  value={newWorkspaceDesc}
                  onChange={(e) => setNewWorkspaceDesc(e.target.value)}
                  placeholder="Describe what projects this workspace will contain..."
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-400 resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewWorkspaceModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-800 text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-cyan-500/20"
                >
                  Create Workspace
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: UPLOAD TO ENTERPRISE CLOUD VAULT */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                  <UploadCloud className="w-5 h-5" />
                </span>
                <div>
                  <h4 className="text-base font-bold text-white">Upload to Enterprise Cloud Vault</h4>
                  <p className="text-xs text-slate-400">
                    AES-256 encrypted multi-region storage (50 TB Quota)
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadAsset} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Master Asset Name:
                </label>
                <input
                  type="text"
                  required
                  value={newAssetName}
                  onChange={(e) => setNewAssetName(e.target.value)}
                  placeholder="e.g. cinema_raw_plate_001.exr"
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Asset Category:
                  </label>
                  <select
                    value={newAssetType}
                    onChange={(e) => setNewAssetType(e.target.value as EnterpriseVaultAsset['type'])}
                    className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="32K Master Plate">32K Master Plate (EXR)</option>
                    <option value="ProRes 4444 XQ">ProRes 4444 XQ Video</option>
                    <option value="Fairlight 192kHz Audio">Fairlight 192kHz Audio Stem</option>
                    <option value="Film 3D LUT">Film 3D LUT (.cube)</option>
                    <option value="4K Video Loop">4K Video Loop</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Edge Storage Hub:
                  </label>
                  <select
                    value={newAssetRegion}
                    onChange={(e) => setNewAssetRegion(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="Edge: Mumbai BOM-1 (APAC)">Edge: Mumbai BOM-1 (6ms)</option>
                    <option value="Edge: Singapore SIN-1">Edge: Singapore SIN-1 (9ms)</option>
                    <option value="Edge: Tokyo NRT-1">Edge: Tokyo NRT-1 (11ms)</option>
                    <option value="Edge: Frankfurt FRA-1 (EU)">Edge: Frankfurt FRA-1 (14ms)</option>
                    <option value="Edge: US-East IAD-1">Edge: US-East IAD-1 (18ms)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Access Permissions:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Team Read / Write', 'Owner & Director Only', 'VFX Restricted'] as const).map((perm) => (
                    <button
                      key={perm}
                      type="button"
                      onClick={() => setNewAssetPermission(perm)}
                      className={`p-2 rounded-xl text-[10px] font-bold border transition-all text-center ${
                        newAssetPermission === perm
                          ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {perm}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Zero-Knowledge AES-256 GCM client-side encryption will be applied before multi-region syncing.</span>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-800 text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-cyan-500/20"
                >
                  Encrypt &amp; Sync to Vault
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: INVITE TEAM MEMBER */}
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
                    Your current plan (<strong>{limits.name}</strong>) allows up to {limits.teamWorkspaceSeats} seat{limits.teamWorkspaceSeats > 1 ? 's' : ''}. To invite multiple people and entire teams, upgrade to the <strong>Team / Company Subscription (Rs. 99,999 / month)</strong> which provides <strong>50 team seats</strong>, 10 workspaces, 50 TB Cloud Vault, and dedicated 8-node GPU clusters.
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setIsInviteModalOpen(false);
                      onOpenSubscriptionModal?.('company');
                    }}
                    className="w-full py-3 bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:opacity-95 text-white font-black text-xs rounded-xl shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2"
                  >
                    <Building2 className="w-4 h-4" />
                    <span>Upgrade to Team Enterprise (50 Seats)</span>
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleAddMember} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Collaborator Name:
                  </label>
                  <input
                    type="text"
                    required
                    value={inviteName}
                    onChange={(e) => setInviteName(e.target.value)}
                    placeholder="e.g. Maya Lin"
                    className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Work Email Address:
                  </label>
                  <input
                    type="email"
                    required
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="e.g. maya@agency.com"
                    className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Studio Role &amp; Access Level:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {(['Director', 'VFX Artist', 'Editor', 'Sound Designer', 'Reviewer'] as const).map((role) => (
                      <button
                        key={role}
                        type="button"
                        onClick={() => setInviteRole(role)}
                        className={`p-2.5 rounded-xl text-xs font-bold border transition-all text-left ${
                          inviteRole === role
                            ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-sm'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        <div>{role}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsInviteModalOpen(false)}
                    className="flex-1 py-2.5 rounded-xl border border-slate-800 text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-amber-500/20 transition-all"
                  >
                    Send Workspace Invite
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* MODAL 4: ENQUEUE NEW VIDEO PRODUCTION JOB */}
      {isNewJobModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 shadow-2xl relative space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-blue-500/15 text-blue-400 border border-blue-500/30">
                  <Film className="w-5 h-5" />
                </span>
                <div>
                  <h4 className="text-base font-bold text-white">Enqueue Video Production Job</h4>
                  <p className="text-xs text-slate-400">
                    Dispatch rendering, optical flow or audio mix across the dedicated GPU cluster
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsNewJobModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEnqueueJob} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Video Production Title:
                </label>
                <input
                  type="text"
                  required
                  value={newJobTitle}
                  onChange={(e) => setNewJobTitle(e.target.value)}
                  placeholder="e.g. LEO 4K Cinematic Sequence - Episode 4"
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Format &amp; Pipeline Preset:
                  </label>
                  <select
                    value={newJobFormat}
                    onChange={(e) => {
                      const val = e.target.value;
                      setNewJobFormat(val);
                      if (val.includes('32K')) {
                        setNewJobResolution('32000×32000 (1.024 GP)');
                        setNewJobFps(1000);
                        setNewJobNode('GPU Node #4 (H100 NVLink)');
                      } else if (val.includes('4K')) {
                        setNewJobResolution('3840×2160 (4K)');
                        setNewJobFps(60);
                        setNewJobNode('GPU Node #1 (RTX 4090 D)');
                      } else if (val.includes('192kHz')) {
                        setNewJobResolution('7.1.4 Bed + Ambisonics');
                        setNewJobFps(192000);
                        setNewJobNode('GPU Node #2 (A100-80GB)');
                      } else {
                        setNewJobResolution('1080×1920 (Vertical)');
                        setNewJobFps(60);
                        setNewJobNode('GPU Node #3 (RTX 4090 D)');
                      }
                    }}
                    className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="LEO 4K ProRes 422 HQ">LEO 4K ProRes 422 HQ (60fps)</option>
                    <option value="Cinema VFX 32K Optical Flow">Cinema VFX 32K Optical Flow (1000fps)</option>
                    <option value="Fairlight 192kHz Spatial Master">Fairlight 192kHz Dolby Atmos Spatial</option>
                    <option value="TikTok / Reels 1080x1920 HEVC">TikTok / Reels 1080x1920 10-bit HEVC</option>
                    <option value="ProRes 4444 XQ Master Conform">ProRes 4444 XQ Master Conform (120fps)</option>
                    <option value="100-Hour Continuous AV1 Stream">100-Hour Continuous AV1 Stream</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Target Workspace:
                  </label>
                  <select
                    value={newJobWorkspaceId}
                    onChange={(e) => setNewJobWorkspaceId(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
                  >
                    {workspaces.map((w) => (
                      <option key={w.id} value={w.id}>
                        {w.name} ({w.assignedGpuNodes} Nodes)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Assigned Hardware Cluster Node:
                  </label>
                  <select
                    value={newJobNode}
                    onChange={(e) => setNewJobNode(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="GPU Node #1 (RTX 4090 D)">GPU Node #1 (RTX 4090 D - Primary)</option>
                    <option value="GPU Node #2 (A100-80GB)">GPU Node #2 (A100-80GB High VRAM)</option>
                    <option value="GPU Node #3 (RTX 4090 D)">GPU Node #3 (RTX 4090 D - Agency)</option>
                    <option value="GPU Node #4 (H100 NVLink)">GPU Node #4 (H100 NVLink 80GB)</option>
                    <option value="GPU Node #5 (H100 NVLink)">GPU Node #5 (H100 NVLink Optical Flow)</option>
                    <option value="Enterprise Cluster Nodes #7 & #8">Enterprise Cluster Nodes #7 &amp; #8</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Timeline Duration:
                  </label>
                  <input
                    type="text"
                    value={newJobDuration}
                    onChange={(e) => setNewJobDuration(e.target.value)}
                    placeholder="e.g. 03:15 or 100:00:00"
                    className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Queue Priority Level:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['urgent', 'high', 'normal'] as const).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setNewJobPriority(p)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all uppercase tracking-wider ${
                        newJobPriority === p
                          ? p === 'urgent'
                            ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                            : p === 'high'
                            ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                            : 'bg-blue-500/20 border-blue-500 text-blue-300'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Job will be dispatched across the 8-node cluster with 64-bit frame-accurate timing.</span>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewJobModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-800 text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:opacity-95 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-500/25 transition-all"
                >
                  Dispatch to GPU Cluster
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 5: PREVIEW JOB OUTPUT & VAULT SYNC */}
      {selectedJobForPreview && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 shadow-2xl relative space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-blue-500/15 text-blue-400 border border-blue-500/30">
                  <Eye className="w-5 h-5" />
                </span>
                <div>
                  <h4 className="text-base font-bold text-white">{selectedJobForPreview.title}</h4>
                  <p className="text-xs text-slate-400">
                    Production Output Preview &amp; Hardware Telemetry
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedJobForPreview(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Player Mock View */}
            <div className="aspect-video w-full rounded-2xl bg-slate-950 border border-slate-800 relative overflow-hidden flex flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center shadow-lg animate-pulse">
                <Film className="w-8 h-8" />
              </div>
              <div>
                <div className="text-sm font-bold text-white font-mono">{selectedJobForPreview.format}</div>
                <div className="text-xs text-cyan-300 font-mono mt-0.5">
                  {selectedJobForPreview.resolution} • {selectedJobForPreview.fps} FPS • {selectedJobForPreview.duration}
                </div>
              </div>
              <div className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] font-mono text-emerald-400">
                Frame {selectedJobForPreview.currentFrame.toLocaleString()} / {selectedJobForPreview.totalFrames.toLocaleString()} ({selectedJobForPreview.progress}%)
              </div>
            </div>

            {/* Hardware & Dispatch Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] font-mono">
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-slate-500 block">Assigned Node:</span>
                <span className="text-white font-bold block">{selectedJobForPreview.assignedNode.split(' ')[0]}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-slate-500 block">Queue Status:</span>
                <span className="text-emerald-400 font-bold block uppercase">{selectedJobForPreview.status}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-slate-500 block">Estimated ETA:</span>
                <span className="text-cyan-300 font-bold block">{selectedJobForPreview.eta}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-slate-500 block">Priority:</span>
                <span className="text-amber-300 font-bold block uppercase">{selectedJobForPreview.priority}</span>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSelectedJobForPreview(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-800 text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                Close Preview
              </button>
              <button
                type="button"
                onClick={() => {
                  setProjectDashboardSuccessMessage(`✓ Master cut for "${selectedJobForPreview.title}" dispatched to Enterprise Cloud Vault (50 TB)!`);
                  setTimeout(() => setProjectDashboardSuccessMessage(''), 4000);
                  setSelectedJobForPreview(null);
                }}
                className="flex-1 py-2.5 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:opacity-95 text-white font-bold text-xs rounded-xl shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2"
              >
                <Cloud className="w-4 h-4" />
                <span>Sync to Enterprise Vault (50 TB)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
