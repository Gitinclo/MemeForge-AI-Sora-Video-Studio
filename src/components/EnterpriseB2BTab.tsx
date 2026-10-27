import React, { useState, useId } from 'react';
import {
  Briefcase,
  ShieldCheck,
  Cpu,
  Layers,
  Upload,
  Play,
  Pause,
  Download,
  CheckCircle2,
  Sliders,
  DollarSign,
  TrendingUp,
  Clock,
  Video,
  FileSpreadsheet,
  FileText,
  Camera,
  Eye,
  Check,
  Copy,
  Users,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Lock,
  Server,
  Building2,
  RefreshCw,
  Search,
  Filter,
  Volume2,
  Radio,
  SlidersHorizontal,
  Activity,
} from 'lucide-react';
import {
  B2BCategory,
  ProductLoraModel,
  SalesLeadRecord,
  SpokespersonTemplate,
  StoryboardScene,
  BrandKit,
  DirectorCameraSpec,
  B2BPlanId,
  EnterpriseSecurityConfig,
} from '../types/b2bEnterprise';
import {
  B2B_PRICING_CATALOG,
  PRESET_LORA_MODELS,
  COMMERCIAL_PROMPT_TEMPLATES,
  DEFAULT_SPOKESPERSONS,
  SAMPLE_SALES_LEADS,
  DEFAULT_BRAND_KIT,
  DEFAULT_DIRECTOR_SPEC,
  DEFAULT_SECURITY_CONFIG,
  calculateB2bRoi,
  renderPersonalizedSalesScript,
  generateScriptToStoryboard,
  simulateLoRATraining,
  exportLeadsToCsv,
  parseLeadsCsv,
} from '../utils/b2bEnterpriseEngine';
import { UserSubscription } from '../types/subscription';
import { EnterpriseProductModelBuilderModal } from './EnterpriseProductModelBuilderModal';
import { LoraTrainingStatusDashboard } from './LoraTrainingStatusDashboard';
import { ModelSandbox } from './ModelSandbox';

interface EnterpriseB2BTabProps {
  subscription?: UserSubscription;
  onOpenSubscriptionModal?: () => void;
  onSendPromptToLeoStudio?: (prompt: string) => void;
}

export const EnterpriseB2BTab: React.FC<EnterpriseB2BTabProps> = ({
  subscription,
  onOpenSubscriptionModal,
  onSendPromptToLeoStudio,
}) => {
  const fileUploadId = useId();
  // Sub-modules: lora_preservation, training_dashboard, model_sandbox, programmatic_sales, spokesperson_avatars, script_to_video, director_mode, brand_kit, roi_calculator, security_soc2
  const [activeSubTab, setActiveSubTab] = useState<
    | 'lora_preservation'
    | 'training_dashboard'
    | 'model_sandbox'
    | 'programmatic_sales'
    | 'spokesperson_avatars'
    | 'script_to_video'
    | 'director_mode'
    | 'brand_kit'
    | 'roi_calculator'
    | 'security_soc2'
  >('lora_preservation');

  // Product Preservation state
  const [loraModels, setLoraModels] = useState<ProductLoraModel[]>(PRESET_LORA_MODELS);
  const [selectedLoraId, setSelectedLoraId] = useState<string>(PRESET_LORA_MODELS[0].id);
  const [isModelBuilderOpen, setIsModelBuilderOpen] = useState(false);
  const [isTrainingNewLora, setIsTrainingNewLora] = useState(false);
  const [newProductName, setNewProductName] = useState('');
  const [newProductCategory, setNewProductCategory] = useState<B2BCategory>('cosmetics');
  const [newProductRank, setNewProductRank] = useState<16 | 32 | 64>(32);
  const [trainingProgress, setTrainingProgress] = useState<number | null>(null);

  const activeLora = loraModels.find((m) => m.id === selectedLoraId) || loraModels[0];

  // Programmatic Sales Video state
  const [leads, setLeads] = useState<SalesLeadRecord[]>(SAMPLE_SALES_LEADS);
  const [selectedLeadId, setSelectedLeadId] = useState<string>(SAMPLE_SALES_LEADS[0].id);
  const [leadSearch, setLeadSearch] = useState('');
  const [leadFilterStatus, setLeadFilterStatus] = useState<'all' | 'ready' | 'rendering' | 'queued'>('all');
  const [isBulkBatchRunning, setIsBulkBatchRunning] = useState(false);
  const [batchProgress, setBatchProgress] = useState<number | null>(null);
  const [spokespersons] = useState<SpokespersonTemplate[]>(DEFAULT_SPOKESPERSONS);
  const [selectedSpokespersonId, setSelectedSpokespersonId] = useState<string>(DEFAULT_SPOKESPERSONS[0].id);

  const activeLead = leads.find((l) => l.id === selectedLeadId) || leads[0];
  const activeSpokesperson = spokespersons.find((s) => s.id === selectedSpokespersonId) || spokespersons[0];

  // Script-to-Video state
  const [sourceArticleText, setSourceArticleText] = useState(
    `Global Solutions Corp has announced its next-generation enterprise video suite. The new architecture pairs custom product LoRA weights with real-time lip-synced executive avatars. By eliminating traditional studio overhead, Fortune 500 enterprises are cutting turnaround times from 14 days down to 10 minutes while preserving 100% brand consistency.`
  );
  const [generatedStoryboard, setGeneratedStoryboard] = useState<StoryboardScene[]>(() =>
    generateScriptToStoryboard(
      `Global Solutions Corp has announced its next-generation enterprise video suite. The new architecture pairs custom product LoRA weights with real-time lip-synced executive avatars. By eliminating traditional studio overhead, Fortune 500 enterprises are cutting turnaround times from 14 days down to 10 minutes while preserving 100% brand consistency.`
    )
  );

  // Director's Mode state
  const [directorSpec, setDirectorSpec] = useState<DirectorCameraSpec>(DEFAULT_DIRECTOR_SPEC);

  // Brand Kit state
  const [brandKit, setBrandKit] = useState<BrandKit>(DEFAULT_BRAND_KIT);
  const [brandSavedToast, setBrandSavedToast] = useState(false);

  // ROI Calculator state
  const [roiVideosPerMonth, setRoiVideosPerMonth] = useState(15);
  const [roiTraditionalCost, setRoiTraditionalCost] = useState(4500);
  const [roiTurnaroundDays, setRoiTurnaroundDays] = useState(14);
  const [roiPlanId, setRoiPlanId] = useState<B2BPlanId>('pro');

  const roiMetrics = calculateB2bRoi({
    videosPerMonth: roiVideosPerMonth,
    traditionalCostPerVideo: roiTraditionalCost,
    traditionalTurnaroundDays: roiTurnaroundDays,
    selectedPlan: roiPlanId,
  });

  // Security config state
  const [securityConfig, setSecurityConfig] = useState<EnterpriseSecurityConfig>(DEFAULT_SECURITY_CONFIG);

  // Audio Preview simulation
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Handle simulate LoRA training
  const handleTrainCustomLora = () => {
    if (!newProductName.trim()) return;
    setIsTrainingNewLora(true);
    setTrainingProgress(10);

    const interval = setInterval(() => {
      setTrainingProgress((prev) => {
        if (prev === null) return 10;
        if (prev >= 90) {
          clearInterval(interval);
          const newModel = simulateLoRATraining(newProductName, newProductCategory, newProductRank);
          setLoraModels((prevList) => [newModel, ...prevList]);
          setSelectedLoraId(newModel.id);
          setIsTrainingNewLora(false);
          setTrainingProgress(null);
          setNewProductName('');
          return null;
        }
        return prev + 20;
      });
    }, 400);
  };

  // Handle Bulk Batch Run
  const handleRunBulkBatch = () => {
    setIsBulkBatchRunning(true);
    setBatchProgress(10);

    const interval = setInterval(() => {
      setBatchProgress((prev) => {
        if (prev === null) return 10;
        if (prev >= 90) {
          clearInterval(interval);
          setLeads((prevLeads) =>
            prevLeads.map((l) => ({
              ...l,
              status: 'ready',
              progressPct: 100,
              generatedVideoUrl: `#batch-video-${l.id}`,
            }))
          );
          setIsBulkBatchRunning(false);
          setBatchProgress(null);
          return null;
        }
        return prev + 25;
      });
    }, 450);
  };

  // Handle CSV export
  const handleDownloadLeadsCsv = () => {
    const csvContent = exportLeadsToCsv(leads);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `enterprise_leads_batch_${Date.now()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  };

  // Handle CSV upload
  const handleUploadLeadsCsv = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        const parsed = parseLeadsCsv(text);
        if (parsed.length > 0) {
          setLeads((prev) => [...parsed, ...prev]);
          setSelectedLeadId(parsed[0].id);
        }
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const filteredLeads = leads.filter((l) => {
    const matchesSearch =
      l.firstName.toLowerCase().includes(leadSearch.toLowerCase()) ||
      l.company.toLowerCase().includes(leadSearch.toLowerCase()) ||
      l.role.toLowerCase().includes(leadSearch.toLowerCase());
    const matchesFilter = leadFilterStatus === 'all' || l.status === leadFilterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="flex-1 bg-slate-950 text-slate-100 flex flex-col min-h-screen">
      {/* Top Banner: Strategic B2B Shift & Enterprise Context */}
      <div className="bg-slate-900/90 border-b border-slate-800 px-6 py-5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
              <span>LEO Platform</span>
              <span aria-hidden="true">/</span>
              <span>Enterprise B2B Video Suite</span>
              <span aria-hidden="true">/</span>
              <span className="text-emerald-400">SOC 2 Type II Certified</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2.5">
              <span>Enterprise Video Platform</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/30">
                B2B Production
              </span>
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-3xl">
              Solve expensive corporate video bottlenecks. Replace actor casting with AI Spokespersons, protect brand identity with Product Preservation LoRAs, and generate hyper-personalized sales videos at scale.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => setIsModelBuilderOpen(true)}
              className="px-3.5 py-2 text-xs font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-lg shadow-sm shadow-blue-500/20 transition-all flex items-center gap-1.5"
              title="Open 10-20 Product Image Uploader & LoRA Training Builder"
            >
              <Layers className="w-4 h-4 text-blue-200" />
              <span>Build Product Model</span>
              <span className="px-1.5 py-0.2 text-[9px] font-extrabold rounded bg-blue-500/30 text-blue-100">10-20 IMAGES</span>
            </button>

            <button
              onClick={() => setActiveSubTab('roi_calculator')}
              className="px-3.5 py-2 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 transition-colors flex items-center gap-1.5"
            >
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <span>ROI Calculator</span>
            </button>
            <button
              onClick={() => {
                if (onOpenSubscriptionModal) onOpenSubscriptionModal();
              }}
              className="px-4 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
            >
              <Building2 className="w-4 h-4" />
              <span>Enterprise Seats &amp; VPC</span>
            </button>
          </div>
        </div>

        {/* Feature Translation Comparison Grid */}
        <div className="max-w-7xl mx-auto mt-5 pt-4 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/60">
            <div className="text-[10px] uppercase tracking-wider text-slate-500">From B2C Viral</div>
            <div className="text-xs line-through text-slate-400 mt-0.5">AI Dance Videos</div>
            <div className="text-xs font-medium text-emerald-400 mt-1 flex items-center gap-1">
              <ArrowRight className="w-3 h-3" />
              <span>AI Spokespersons</span>
            </div>
          </div>
          <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/60">
            <div className="text-[10px] uppercase tracking-wider text-slate-500">From B2C Viral</div>
            <div className="text-xs line-through text-slate-400 mt-0.5">Photo to Video</div>
            <div className="text-xs font-medium text-emerald-400 mt-1 flex items-center gap-1">
              <ArrowRight className="w-3 h-3" />
              <span>Product LoRA Ads</span>
            </div>
          </div>
          <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/60">
            <div className="text-[10px] uppercase tracking-wider text-slate-500">From B2C Viral</div>
            <div className="text-xs line-through text-slate-400 mt-0.5">Trending Memes</div>
            <div className="text-xs font-medium text-emerald-400 mt-1 flex items-center gap-1">
              <ArrowRight className="w-3 h-3" />
              <span>Brand Kits &amp; Guidelines</span>
            </div>
          </div>
          <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/60">
            <div className="text-[10px] uppercase tracking-wider text-slate-500">From B2C Viral</div>
            <div className="text-xs line-through text-slate-400 mt-0.5">Random Text Prompts</div>
            <div className="text-xs font-medium text-emerald-400 mt-1 flex items-center gap-1">
              <ArrowRight className="w-3 h-3" />
              <span>Script-to-Video Engine</span>
            </div>
          </div>
          <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/60 col-span-2 sm:col-span-1">
            <div className="text-[10px] uppercase tracking-wider text-slate-500">From B2C Viral</div>
            <div className="text-xs line-through text-slate-400 mt-0.5">Random Generation</div>
            <div className="text-xs font-medium text-emerald-400 mt-1 flex items-center gap-1">
              <ArrowRight className="w-3 h-3" />
              <span>Director Camera Control</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Sub-Navigation Bar */}
      <div className="bg-slate-950 border-b border-slate-800 sticky top-14 z-20 px-6">
        <div className="max-w-7xl mx-auto flex items-center gap-1 overflow-x-auto py-2 no-scrollbar">
          <button
            onClick={() => setActiveSubTab('lora_preservation')}
            className={`px-3 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeSubTab === 'lora_preservation'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Product Preservation (LoRA)</span>
          </button>
          <button
            onClick={() => setActiveSubTab('training_dashboard')}
            className={`px-3 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeSubTab === 'training_dashboard'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Training Progress & GPU Telemetry</span>
          </button>
          <button
            onClick={() => setActiveSubTab('model_sandbox')}
            className={`px-3 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeSubTab === 'model_sandbox'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Model Consistency Sandbox</span>
          </button>

          <button
            onClick={() => setActiveSubTab('programmatic_sales')}
            className={`px-3 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeSubTab === 'programmatic_sales'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Programmatic Sales Video (CSV)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('spokesperson_avatars')}
            className={`px-3 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeSubTab === 'spokesperson_avatars'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>AI Spokespersons &amp; Avatars</span>
          </button>

          <button
            onClick={() => setActiveSubTab('script_to_video')}
            className={`px-3 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeSubTab === 'script_to_video'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Script-to-Video Engine</span>
          </button>

          <button
            onClick={() => setActiveSubTab('director_mode')}
            className={`px-3 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeSubTab === 'director_mode'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Director's Mode (Optics)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('brand_kit')}
            className={`px-3 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeSubTab === 'brand_kit'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Brand Kit &amp; Compliance</span>
          </button>

          <button
            onClick={() => setActiveSubTab('roi_calculator')}
            className={`px-3 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeSubTab === 'roi_calculator'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Interactive ROI Calculator</span>
          </button>

          <button
            onClick={() => setActiveSubTab('security_soc2')}
            className={`px-3 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeSubTab === 'security_soc2'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Security &amp; Private VPC</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-6 py-8">
        {/* SUBTAB 1: PRODUCT PRESERVATION & LORA TRAINING */}
        {activeSubTab === 'lora_preservation' && (
          <div className="space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <h2 className="text-xl font-bold text-white">Product Preservation Architecture (LoRA)</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  The #1 barrier for B2B video adoption: preventing AI from hallucinating product logos, textures, or geometry across motion shots.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveSubTab('training_dashboard')}
                  className="px-2.5 py-1.5 text-xs font-medium bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-lg border border-slate-800 transition-colors flex items-center gap-1.5"
                >
                  <Activity className="w-3.5 h-3.5 text-blue-400" />
                  <span>GPU Telemetry</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSubTab('model_sandbox')}
                  className="px-2.5 py-1.5 text-xs font-medium bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 rounded-lg border border-blue-500/30 transition-colors flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                  <span>Test in Sandbox</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsModelBuilderOpen(true)}
                  className="px-2.5 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Train New LoRA</span>
                </button>
              </div>
            </div>

            {/* Main 2-Column Split: Active Model Details & Visual Preservation Frame */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              {/* Left Column: Model Selector & Metrics (5 cols) */}
              <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
                <div className="space-y-4">
                  {/* Model Picker */}
                  <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-3">
                    <label className="text-xs font-semibold text-slate-300 block">Select Active Product LoRA Model</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {loraModels.map((model) => (
                        <button
                          key={model.id}
                          onClick={() => setSelectedLoraId(model.id)}
                          className={`p-3 rounded-lg border text-left transition-all ${
                            selectedLoraId === model.id
                              ? 'bg-blue-600/10 border-blue-500 text-white'
                              : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                          }`}
                        >
                          <div className="text-xs font-bold truncate text-slate-200">{model.name}</div>
                          <div className="font-mono text-[11px] text-blue-400 mt-1">{model.triggerToken}</div>
                          <div className="text-[10px] text-slate-500 mt-1 flex items-center gap-1.5">
                            <span>Rank {model.rank}</span>
                            <span>·</span>
                            <span>{model.trainingSteps} steps</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Preservation Scorecard */}
                  <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-300">Physical Preservation Verification</span>
                      <span className="font-mono text-[11px] text-emerald-400 font-medium">LEO Invariant Check Passed</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-center">
                        <div className="text-[10px] text-slate-500 uppercase tracking-wider">Logo Fidelity</div>
                        <div className="font-mono text-base font-bold text-emerald-400 tabular-nums mt-0.5">
                          {activeLora.preservationMetrics.logoFidelityPct}%
                        </div>
                        <div className="text-[9px] text-slate-500 mt-0.5">Zero distortion</div>
                      </div>

                      <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-center">
                        <div className="text-[10px] text-slate-500 uppercase tracking-wider">Geometry IoU</div>
                        <div className="font-mono text-base font-bold text-blue-400 tabular-nums mt-0.5">
                          {activeLora.preservationMetrics.geometryIoUPct}%
                        </div>
                        <div className="text-[9px] text-slate-500 mt-0.5">Precise volume</div>
                      </div>

                      <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-center">
                        <div className="text-[10px] text-slate-500 uppercase tracking-wider">Label Sharpness</div>
                        <div className="font-mono text-base font-bold text-amber-400 tabular-nums mt-0.5">
                          {activeLora.preservationMetrics.textSharpnessScore}/10
                        </div>
                        <div className="text-[9px] text-slate-500 mt-0.5">Micro-typography</div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed pt-1">
                      {activeLora.description}
                    </p>
                  </div>

                  {/* Training Loss Curve Mini Display */}
                  <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-300">Optimization Loss Convergence</span>
                      <span className="font-mono text-[11px] text-slate-400">Final loss: {activeLora.lossCurve[activeLora.lossCurve.length - 1]}</span>
                    </div>

                    {/* Visual loss bars */}
                    <div className="h-16 flex items-end gap-1.5 pt-2 px-1">
                      {activeLora.lossCurve.map((loss, idx) => {
                        const heightPct = Math.max(15, Math.round((loss / 0.6) * 100));
                        return (
                          <div key={idx} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                            <div
                              className="w-full bg-blue-500/80 hover:bg-blue-400 rounded-t transition-all"
                              style={{ height: `${heightPct}%` }}
                              title={`Step ${idx * 250}: loss ${loss}`}
                            />
                            <span className="text-[9px] font-mono text-slate-500">t{idx}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Train New LoRA Trigger Form */}
                <div className="bg-slate-900/60 p-4 rounded-xl border border-dashed border-slate-700 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                      <Upload className="w-3.5 h-3.5 text-blue-400" />
                      <span>Enterprise Product Model Builder</span>
                    </span>
                    <span className="text-[10px] text-emerald-400 font-mono">10–20 Studio Photos</span>
                  </div>

                  <p className="text-[11px] text-slate-400">
                    Upload 10–20 multi-angle product photos from desktop with automatic VLM captioning and ControlNet 3D geometry locking.
                  </p>

                  <button
                    onClick={() => setIsModelBuilderOpen(true)}
                    className="w-full py-2.5 text-xs font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-lg shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
                  >
                    <Layers className="w-4 h-4 text-blue-200" />
                    <span>Launch 10–20 Image Model Builder</span>
                  </button>

                  <div className="pt-2 border-t border-slate-800 space-y-2">
                    <div className="text-[11px] font-semibold text-slate-400">Or Quick One-Click Train</div>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="e.g. Lumina Serum"
                        value={newProductName}
                        onChange={(e) => setNewProductName(e.target.value)}
                        className="col-span-2 px-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500"
                      />

                      <select
                        value={newProductCategory}
                        onChange={(e) => setNewProductCategory(e.target.value as B2BCategory)}
                        className="px-2 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-blue-500"
                      >
                        <option value="cosmetics">Cosmetics &amp; Beauty</option>
                        <option value="apparel_footwear">Footwear &amp; Apparel</option>
                        <option value="tech_hardware">Tech Hardware &amp; Gadgets</option>
                        <option value="beverage_cpg">Beverage &amp; CPG</option>
                        <option value="automotive">Automotive</option>
                      </select>

                      <select
                        value={newProductRank}
                        onChange={(e) => setNewProductRank(Number(e.target.value) as 16 | 32 | 64)}
                        className="px-2 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-blue-500"
                      >
                        <option value={16}>Rank 16 (Fast · 7 min)</option>
                        <option value={32}>Rank 32 (Standard · 10 min)</option>
                        <option value={64}>Rank 64 (Ultra Precision)</option>
                      </select>
                    </div>

                    <button
                      disabled={isTrainingNewLora || !newProductName.trim()}
                      onClick={handleTrainCustomLora}
                      className="w-full py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 border border-slate-700 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                    >
                      {isTrainingNewLora ? (
                        <>
                          <RefreshCw className="w-3 h-3 animate-spin text-blue-400" />
                          <span>Extracting LoRA Weights ({trainingProgress}%)...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3 h-3 text-blue-400" />
                          <span>Quick Fine-Tune</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column: High-Fidelity Preservation Studio Viewport (7 cols) */}
              <div className="lg:col-span-7 bg-slate-900 rounded-xl border border-slate-800 p-5 flex flex-col justify-between space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-200">Preserved Commercial Asset Preview</span>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                      Zero Hallucination
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 flex items-center gap-2">
                    <span>Base: LEO-DiT-Enterprise</span>
                    <span>·</span>
                    <span className="font-mono">8K Master</span>
                  </div>
                </div>

                {/* Main Visual Display Frame */}
                <div className="relative rounded-lg overflow-hidden bg-slate-950 border border-slate-800 aspect-video flex items-center justify-center group">
                  <img
                    src={activeLora.sampleImage}
                    alt={activeLora.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />

                  {/* HUD Geometry Box Overlay */}
                  <div className="absolute inset-4 pointer-events-none border border-blue-500/40 rounded flex flex-col justify-between p-3 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] text-blue-300 bg-slate-900/90 px-2 py-0.5 rounded border border-blue-500/30">
                        TRACKING: {activeLora.triggerToken}
                      </span>
                      <span className="font-mono text-[10px] text-emerald-300 bg-slate-900/90 px-2 py-0.5 rounded border border-emerald-500/30">
                        IoU: {activeLora.preservationMetrics.geometryIoUPct}%
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="text-xs font-medium text-white drop-shadow-md">
                        Commercial Shot with Guaranteed Brand Preservation
                      </div>
                      <div className="text-[11px] text-slate-300 drop-shadow line-clamp-2">
                        Camera orbit smoothly rotates around the physical model without warping labels, typography, or packaging proportions.
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Commercial Prompts using this LoRA */}
                <div className="space-y-2 pt-2">
                  <div className="text-xs font-semibold text-slate-300">Ready-to-Render Commercial Prompts</div>
                  <div className="space-y-2">
                    {COMMERCIAL_PROMPT_TEMPLATES.filter(
                      (t) => t.category === activeLora.category || t.category === 'cosmetics'
                    ).map((t) => (
                      <div
                        key={t.templateId}
                        className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 hover:border-slate-700 flex items-start justify-between gap-3 transition-colors"
                      >
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center gap-2 text-xs font-medium text-white">
                            <span>{t.title}</span>
                            <span className="text-[10px] font-mono text-slate-500">[{t.cameraPreset}]</span>
                          </div>
                          <p className="text-[11px] text-slate-400 font-mono leading-relaxed">
                            {t.promptTextWithToken.replace(/\[AURORA_LUMINA_SERUM\]|\[AERO_VELOCITY_SNEAKER\]|\[OUR_PRODUCT\]/g, activeLora.triggerToken)}
                          </p>
                        </div>

                        <button
                          onClick={() => {
                            const formatted = t.promptTextWithToken.replace(
                              /\[AURORA_LUMINA_SERUM\]|\[AERO_VELOCITY_SNEAKER\]|\[OUR_PRODUCT\]/g,
                              activeLora.triggerToken
                            );
                            if (onSendPromptToLeoStudio) {
                              onSendPromptToLeoStudio(formatted);
                            } else {
                              navigator.clipboard.writeText(formatted);
                            }
                          }}
                          className="px-2.5 py-1.5 text-[11px] font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded transition-colors whitespace-nowrap shrink-0 flex items-center gap-1"
                        >
                          <SendIcon className="w-3 h-3" />
                          <span>Load in LEO Studio</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SUBTAB: LORA TRAINING PROGRESS & GPU TELEMETRY */}
        {activeSubTab === 'training_dashboard' && (
          <LoraTrainingStatusDashboard
            onOpenModelBuilder={() => setIsModelBuilderOpen(true)}
            onOpenModelSandbox={(modelId) => {
              if (modelId) setSelectedLoraId(modelId);
              setActiveSubTab('model_sandbox');
            }}
            onModelTrained={(newModel) => {
              setLoraModels((prev) => [newModel, ...prev]);
              setSelectedLoraId(newModel.id);
            }}
          />
        )}

        {/* SUBTAB: MODEL CONSISTENCY SANDBOX */}
        {activeSubTab === 'model_sandbox' && (
          <ModelSandbox
            loraModels={loraModels}
            selectedModelId={selectedLoraId}
            onSelectModel={(id) => setSelectedLoraId(id)}
            onSendPromptToLeoStudio={onSendPromptToLeoStudio}
            onOpenModelBuilder={() => setIsModelBuilderOpen(true)}
            onOpenTrainingDashboard={() => setActiveSubTab('training_dashboard')}
          />
        )}

        {/* SUBTAB 2: PROGRAMMATIC PERSONALIZED SALES VIDEO (CSV BULK BATCH) */}
        {activeSubTab === 'programmatic_sales' && (
          <div className="space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <h2 className="text-xl font-bold text-white">Programmatic Personalized Sales Video (Bulk Generator)</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Generate hundreds of hyper-personalized 1-to-1 video messages from a CSV of sales leads with dynamic website backdrops and tailored value props.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="file"
                  id={fileUploadId}
                  accept=".csv"
                  onChange={handleUploadLeadsCsv}
                  className="hidden"
                />
                <label
                  htmlFor={fileUploadId}
                  className="px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5 text-blue-400" />
                  <span>Upload Leads CSV</span>
                </label>

                <button
                  onClick={handleDownloadLeadsCsv}
                  className="px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 transition-colors flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Export CSV</span>
                </button>

                <button
                  disabled={isBulkBatchRunning}
                  onClick={handleRunBulkBatch}
                  className="px-4 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
                >
                  {isBulkBatchRunning ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Generating Batch ({batchProgress}%)...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Run Personalized Batch ({leads.length} Leads)</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Programmatic Grid: Leads Table & Live Dynamic Video Preview */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              {/* Left Column: Leads Data Grid (7 cols) */}
              <div className="lg:col-span-7 bg-slate-900 rounded-xl border border-slate-800 p-4 space-y-3 flex flex-col">
                {/* Search & Filter Header */}
                <div className="flex items-center justify-between gap-3">
                  <div className="relative flex-1">
                    <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="Search lead by name, company, or role..."
                      value={leadSearch}
                      onChange={(e) => setLeadSearch(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-[11px]">
                    <button
                      onClick={() => setLeadFilterStatus('all')}
                      className={`px-2 py-1 rounded transition-colors ${
                        leadFilterStatus === 'all' ? 'bg-slate-800 text-white font-medium' : 'text-slate-400'
                      }`}
                    >
                      All ({leads.length})
                    </button>
                    <button
                      onClick={() => setLeadFilterStatus('ready')}
                      className={`px-2 py-1 rounded transition-colors ${
                        leadFilterStatus === 'ready' ? 'bg-slate-800 text-emerald-400 font-medium' : 'text-slate-400'
                      }`}
                    >
                      Ready
                    </button>
                    <button
                      onClick={() => setLeadFilterStatus('queued')}
                      className={`px-2 py-1 rounded transition-colors ${
                        leadFilterStatus === 'queued' ? 'bg-slate-800 text-amber-400 font-medium' : 'text-slate-400'
                      }`}
                    >
                      Queued
                    </button>
                  </div>
                </div>

                {/* High Density Table */}
                <div className="overflow-x-auto flex-1 border border-slate-800 rounded-lg">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-950 text-[10px] text-slate-500 uppercase tracking-wider border-b border-slate-800">
                        <th className="py-2.5 px-3">Lead / Company</th>
                        <th className="py-2.5 px-3">Target Role</th>
                        <th className="py-2.5 px-3">Website</th>
                        <th className="py-2.5 px-3 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-xs">
                      {filteredLeads.map((lead) => (
                        <tr
                          key={lead.id}
                          onClick={() => setSelectedLeadId(lead.id)}
                          className={`cursor-pointer transition-colors ${
                            selectedLeadId === lead.id
                              ? 'bg-blue-600/15 text-white'
                              : 'hover:bg-slate-800/40 text-slate-300'
                          }`}
                        >
                          <td className="py-2.5 px-3 font-medium">
                            <div>{lead.firstName} {lead.lastName}</div>
                            <div className="text-[11px] text-slate-400">{lead.company}</div>
                          </td>
                          <td className="py-2.5 px-3 text-slate-400">{lead.role}</td>
                          <td className="py-2.5 px-3 font-mono text-[11px] text-blue-400 truncate max-w-[140px]">
                            {lead.websiteUrl}
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            {lead.status === 'ready' && (
                              <span className="font-mono text-[10px] text-emerald-400 font-medium">
                                Ready
                              </span>
                            )}
                            {lead.status === 'rendering' && (
                              <span className="font-mono text-[10px] text-blue-400 font-medium flex items-center justify-end gap-1">
                                <RefreshCw className="w-2.5 h-2.5 animate-spin" />
                                <span>{lead.progressPct}%</span>
                              </span>
                            )}
                            {lead.status === 'queued' && (
                              <span className="font-mono text-[10px] text-slate-500">
                                Queued
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1">
                  <span>Selected Lead: <strong className="text-slate-300">{activeLead.firstName} ({activeLead.company})</strong></span>
                  <span>HubSpot / Salesforce Sync Active</span>
                </div>
              </div>

              {/* Right Column: Live Dynamic Personalized Video Preview (5 cols) */}
              <div className="lg:col-span-5 bg-slate-900 rounded-xl border border-slate-800 p-5 space-y-4 flex flex-col justify-between">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-200">Personalized Video Output</span>
                    <span className="font-mono text-[10px] text-blue-400">{activeLead.company}</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Live dynamic composition combining executive avatar lip-sync with real prospect website in background.
                  </p>
                </div>

                {/* Simulated Personalized Video Player */}
                <div className="relative rounded-lg overflow-hidden bg-slate-950 border border-slate-800 aspect-[4/3] flex items-center justify-center">
                  {/* Background: Simulated Prospect Website */}
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 opacity-90 flex flex-col p-4">
                    <div className="h-5 bg-slate-800 rounded flex items-center px-2 gap-1.5 border border-slate-700">
                      <span className="w-2 h-2 rounded-full bg-red-500" />
                      <span className="w-2 h-2 rounded-full bg-amber-500" />
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span className="font-mono text-[9px] text-slate-400 ml-2">{activeLead.websiteUrl}</span>
                    </div>

                    <div className="mt-4 space-y-2 opacity-50">
                      <div className="h-4 bg-slate-700/60 rounded w-2/3" />
                      <div className="h-3 bg-slate-800 rounded w-5/6" />
                      <div className="h-3 bg-slate-800 rounded w-1/2" />
                      <div className="grid grid-cols-2 gap-2 pt-2">
                        <div className="h-12 bg-slate-800/80 rounded" />
                        <div className="h-12 bg-slate-800/80 rounded" />
                      </div>
                    </div>
                  </div>

                  {/* Foreground: Spokesperson Floating in Corner */}
                  <div className="absolute right-4 bottom-4 w-36 h-36 rounded-xl overflow-hidden border-2 border-blue-500 shadow-2xl shadow-blue-500/20 bg-slate-900">
                    <img
                      src={activeSpokesperson.avatarPhotoUrl}
                      alt={activeSpokesperson.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 inset-x-0 bg-slate-950/80 py-0.5 text-center font-mono text-[9px] text-blue-300">
                      {activeSpokesperson.name}
                    </div>
                  </div>

                  {/* Top Caption Banner */}
                  <div className="absolute top-8 left-4 right-4 bg-slate-950/90 border border-slate-700 p-2 rounded text-left">
                    <div className="text-[10px] font-bold text-emerald-400">Personalized Script Injected:</div>
                    <div className="text-[11px] text-slate-200 mt-0.5 line-clamp-2">
                      {renderPersonalizedSalesScript(activeSpokesperson.defaultScript, activeLead)}
                    </div>
                  </div>
                </div>

                {/* Rendered Script Breakdown */}
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1.5">
                  <div className="text-xs font-semibold text-slate-300">Target Voice &amp; Lip-Sync Engine</div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>Voice Model: <strong className="text-slate-200">{activeSpokesperson.voiceName}</strong></span>
                    <span className="font-mono text-emerald-400">{activeSpokesperson.lipSyncEngine}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SUBTAB 3: AI SPOKESPERSONS & AVATARS (LIP-SYNC & VOICE CLONING) */}
        {activeSubTab === 'spokesperson_avatars' && (
          <div className="space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <h2 className="text-xl font-bold text-white">AI Spokesperson &amp; Corporate Avatars</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Replace expensive actor casting, studio shoots, and reshoots. High-fidelity lip-sync engine with executive voice cloning for sales, explainers, and onboarding.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Lip-Sync Model:</span>
                <span className="font-mono text-xs text-blue-400 font-medium">Wav2Lip-HQ &amp; LivePortrait</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              {/* Left Column: Avatar Selection & Teleprompter Script (7 cols) */}
              <div className="lg:col-span-7 bg-slate-900 rounded-xl border border-slate-800 p-5 space-y-4">
                <div className="text-xs font-semibold text-slate-300">Select Corporate Spokesperson Avatar</div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {spokespersons.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setSelectedSpokespersonId(s.id)}
                      className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all ${
                        selectedSpokespersonId === s.id
                          ? 'bg-blue-600/15 border-blue-500'
                          : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <img
                        src={s.avatarPhotoUrl}
                        alt={s.name}
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 rounded-lg object-cover border border-slate-700 shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-white truncate">{s.name}</div>
                        <div className="text-[11px] text-blue-400 truncate">{s.title}</div>
                        <div className="text-[10px] text-slate-500 truncate">{s.role}</div>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Teleprompter Script Editor */}
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-300">Teleprompter Narration Script</span>
                    <span className="font-mono text-slate-500 text-[11px]">
                      Est. Runtime: ~{Math.ceil(activeSpokesperson.defaultScript.split(' ').length / 2.5)}s
                    </span>
                  </div>

                  <textarea
                    rows={4}
                    value={activeSpokesperson.defaultScript}
                    onChange={(e) => {
                      const updated = spokespersons.map((s) =>
                        s.id === activeSpokesperson.id ? { ...s, defaultScript: e.target.value } : s
                      );
                      // Update active in list
                    }}
                    className="w-full p-3 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500 leading-relaxed font-mono"
                  />
                </div>

                {/* Engine Configurations */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
                    <div className="text-[10px] text-slate-500 uppercase tracking-wider">Lip-Sync Model</div>
                    <div className="text-xs font-semibold text-slate-200">{activeSpokesperson.lipSyncEngine}</div>
                    <div className="text-[10px] text-emerald-400">Sub-frame phoneme sync</div>
                  </div>

                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
                    <div className="text-[10px] text-slate-500 uppercase tracking-wider">Voice Architecture</div>
                    <div className="text-xs font-semibold text-slate-200">{activeSpokesperson.voiceModel}</div>
                    <div className="text-[10px] text-blue-400">Zero latency streaming</div>
                  </div>
                </div>
              </div>

              {/* Right Column: Broadcast Video Viewport (5 cols) */}
              <div className="lg:col-span-5 bg-slate-900 rounded-xl border border-slate-800 p-5 space-y-4 flex flex-col justify-between">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-xs font-semibold text-slate-200">Broadcast Quality Preview</span>
                  <span className="font-mono text-[10px] text-blue-400">4K 60fps ProRes</span>
                </div>

                <div className="relative rounded-lg overflow-hidden bg-slate-950 border border-slate-800 aspect-square flex items-center justify-center">
                  <img
                    src={activeSpokesperson.avatarPhotoUrl}
                    alt={activeSpokesperson.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />

                  {/* Audio Waveform Simulator */}
                  <div className="absolute bottom-3 inset-x-3 bg-slate-950/85 backdrop-blur-sm border border-slate-700/80 rounded-lg p-2.5 flex items-center justify-between gap-3">
                    <button
                      onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                      className="w-8 h-8 rounded-full bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center transition-colors shrink-0"
                    >
                      {isPlayingAudio ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
                    </button>

                    <div className="flex-1 flex items-center gap-1 h-6">
                      {[40, 65, 80, 50, 95, 70, 45, 90, 60, 85, 40, 75, 90, 55, 70, 40, 85, 60].map((h, i) => (
                        <div
                          key={i}
                          className={`flex-1 rounded-full transition-all ${
                            isPlayingAudio ? 'bg-blue-400' : 'bg-slate-700'
                          }`}
                          style={{
                            height: isPlayingAudio ? `${h}%` : '20%',
                          }}
                        />
                      ))}
                    </div>

                    <span className="font-mono text-[10px] text-slate-400 shrink-0">
                      {isPlayingAudio ? 'Speaking...' : 'Ready'}
                    </span>
                  </div>
                </div>

                <div className="text-xs text-slate-400 leading-relaxed">
                  Enterprise avatar lip-sync adheres to executive vocal inflections, pausing naturally at punctuation marks and maintaining steady eye contact.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SUBTAB 4: SCRIPT-TO-VIDEO STORYBOARD ENGINE */}
        {activeSubTab === 'script_to_video' && (
          <div className="space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <h2 className="text-xl font-bold text-white">Script-to-Video Storyboard Generator</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Converts marketing articles, help guides, or blog posts directly into cohesive multi-scene video commercials with camera directions and pacing.
                </p>
              </div>

              <button
                onClick={() => {
                  const scenes = generateScriptToStoryboard(sourceArticleText);
                  setGeneratedStoryboard(scenes);
                }}
                className="px-4 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors flex items-center gap-1.5 shrink-0"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Parse Article into Storyboard</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              {/* Left Column: Article Input (5 cols) */}
              <div className="lg:col-span-5 bg-slate-900 rounded-xl border border-slate-800 p-5 space-y-3 flex flex-col">
                <label className="text-xs font-semibold text-slate-300 block">
                  Paste Source Article, URL, or Marketing Brief
                </label>
                <textarea
                  rows={10}
                  value={sourceArticleText}
                  onChange={(e) => setSourceArticleText(e.target.value)}
                  className="w-full p-3 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500 leading-relaxed font-mono flex-1"
                  placeholder="Paste article paragraphs here..."
                />
                <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1">
                  <span>Characters: {sourceArticleText.length}</span>
                  <span className="text-blue-400">Auto-Generates 3-5 Commercial Scenes</span>
                </div>
              </div>

              {/* Right Column: Structured Storyboard Scene Cards (7 cols) */}
              <div className="lg:col-span-7 space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                  <span>Structured Scene Storyboard ({generatedStoryboard.length} Scenes)</span>
                  <span className="font-mono text-slate-500">
                    Total Duration: ~{generatedStoryboard.reduce((acc, s) => acc + s.durationSec, 0)}s
                  </span>
                </div>

                <div className="space-y-3">
                  {generatedStoryboard.map((scene) => (
                    <div
                      key={scene.sceneNumber}
                      className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2 hover:border-slate-700 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white">Scene 0{scene.sceneNumber}</span>
                          <span className="text-[10px] font-mono text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-500/20">
                            {scene.durationSec}s
                          </span>
                          <span className="text-[10px] text-slate-400">·</span>
                          <span className="text-[10px] text-slate-400">{scene.cameraMotion}</span>
                        </div>

                        <span className="text-[10px] font-mono text-emerald-400 capitalize">
                          {scene.voiceoverPacing} pacing
                        </span>
                      </div>

                      <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800/80 text-xs text-slate-200 font-mono leading-relaxed">
                        "{scene.narrationScript}"
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 text-slate-400">
                        <div>
                          <strong className="text-slate-300">Visual B-Roll:</strong> {scene.visualDescription}
                        </div>
                        <div>
                          <strong className="text-slate-300">Text Graphic:</strong> {scene.textOverlay}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SUBTAB 5: DIRECTOR'S MODE (CAMERA CONTROL & OPTICS) */}
        {activeSubTab === 'director_mode' && (
          <div className="space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <h2 className="text-xl font-bold text-white">Director's Mode (Robotic Camera &amp; Optics)</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Full deterministic control over virtual camera sliders, anamorphic lenses, aperture depth of field, and character seed lock.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Seed Lock:</span>
                <span className="font-mono text-xs text-emerald-400 font-bold">{directorSpec.seedLock}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              {/* Controls Column (6 cols) */}
              <div className="lg:col-span-6 bg-slate-900 rounded-xl border border-slate-800 p-5 space-y-4">
                {/* Camera Motion Selector */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 block">6-Axis Robotic Camera Movement</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      'Push In / Dolly Zoom',
                      'Orbit 360°',
                      'Pan Left',
                      'Pan Right',
                      'Tilt Up',
                      'Tilt Down',
                      'Crane / Jib',
                      'Static Lock',
                    ].map((motion) => (
                      <button
                        key={motion}
                        onClick={() => setDirectorSpec({ ...directorSpec, motion: motion as any })}
                        className={`p-2 text-xs rounded-lg border text-center transition-all ${
                          directorSpec.motion === motion
                            ? 'bg-blue-600/15 border-blue-500 text-white font-medium'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {motion}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Prime Cinema Lens Selection */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 block">Prime Cinema Lens &amp; Focal Length</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {[
                      '24mm Ultra-Wide',
                      '35mm Commercial',
                      '50mm Natural',
                      '85mm Portrait Prime',
                      '100mm Macro',
                      'Anamorphic 2.39:1',
                    ].map((lens) => (
                      <button
                        key={lens}
                        onClick={() => setDirectorSpec({ ...directorSpec, lensFocalLength: lens as any })}
                        className={`p-2 text-xs rounded-lg border text-center transition-all ${
                          directorSpec.lensFocalLength === lens
                            ? 'bg-blue-600/15 border-blue-500 text-white font-medium'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {lens}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Aperture & Shutter Angle */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300 block">Aperture (Depth of Field)</label>
                    <select
                      value={directorSpec.aperture}
                      onChange={(e) => setDirectorSpec({ ...directorSpec, aperture: e.target.value as any })}
                      className="w-full p-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-blue-500"
                    >
                      <option value="f/1.4 Soft Bokeh">f/1.4 Soft Bokeh (Luxury Beauty)</option>
                      <option value="f/2.8 Commercial Clean">f/2.8 Commercial Clean (Standard)</option>
                      <option value="f/5.6 Studio Crisp">f/5.6 Studio Crisp (All-in-focus)</option>
                      <option value="f/11 Deep Focus">f/11 Deep Focus (Architectural)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300 block">Shutter Angle (Motion Blur)</label>
                    <select
                      value={directorSpec.shutterAngle}
                      onChange={(e) => setDirectorSpec({ ...directorSpec, shutterAngle: e.target.value as any })}
                      className="w-full p-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-blue-500"
                    >
                      <option value="180° Cinema Natural">180° Cinema Natural (24/60fps)</option>
                      <option value="90° Action Crisp">90° Action Crisp (Kinetic)</option>
                      <option value="45° Staccato Commercial">45° Staccato Commercial (Sharp)</option>
                    </select>
                  </div>
                </div>

                {/* Seed Lock & Speed Slider */}
                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-300">Camera Speed Multiplier</span>
                    <span className="font-mono text-blue-400 font-bold">{directorSpec.cameraSpeed.toFixed(1)}x</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="2.0"
                    step="0.1"
                    value={directorSpec.cameraSpeed}
                    onChange={(e) => setDirectorSpec({ ...directorSpec, cameraSpeed: Number(e.target.value) })}
                    className="w-full accent-blue-500"
                  />
                </div>
              </div>

              {/* Visual Director Monitor (6 cols) */}
              <div className="lg:col-span-6 bg-slate-900 rounded-xl border border-slate-800 p-5 space-y-4 flex flex-col justify-between">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-xs font-semibold text-slate-200">Director's Optical Monitor</span>
                  <span className="font-mono text-[10px] text-emerald-400">CALIBRATED</span>
                </div>

                <div className="relative rounded-lg overflow-hidden bg-slate-950 border border-slate-800 aspect-video flex items-center justify-center">
                  <img
                    src="/src/assets/images/b2b_commercial_director_rig_1793008334139.jpg"
                    alt="Director Camera Rig"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />

                  {/* Framing Crosshair Overlay */}
                  <div className="absolute inset-4 pointer-events-none border border-white/20 flex flex-col justify-between p-2">
                    <div className="flex items-center justify-between font-mono text-[9px] text-white/70">
                      <span>FPS: 60.00</span>
                      <span>LENS: {directorSpec.lensFocalLength}</span>
                      <span>SHUTTER: {directorSpec.shutterAngle}</span>
                    </div>

                    <div className="flex items-center justify-center">
                      <div className="w-6 h-6 border border-white/40 rounded-full flex items-center justify-center">
                        <div className="w-1 h-1 bg-white rounded-full" />
                      </div>
                    </div>

                    <div className="flex items-center justify-between font-mono text-[9px] text-white/70">
                      <span>IRIS: {directorSpec.aperture}</span>
                      <span>MOTION: {directorSpec.motion}</span>
                      <span>SEED: {directorSpec.seedLock}</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  Director's Mode binds spatial attention tokens along precise 3D trajectory splines, ensuring multi-camera sequences match lighting, depth, and character proportions perfectly.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* SUBTAB 6: BRAND KIT & COMPLIANCE */}
        {activeSubTab === 'brand_kit' && (
          <div className="space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <h2 className="text-xl font-bold text-white">Brand Kit &amp; Corporate Compliance</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Lock logos, brand colors, and legal safe margins so marketing teams never generate off-brand video assets.
                </p>
              </div>

              <button
                onClick={() => {
                  setBrandSavedToast(true);
                  setTimeout(() => setBrandSavedToast(false), 3000);
                }}
                className="px-4 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Save Brand Guidelines</span>
              </button>
            </div>

            {brandSavedToast && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400 text-xs font-medium flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Brand kit successfully saved and synced across all enterprise video pipelines.</span>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              <div className="lg:col-span-7 bg-slate-900 rounded-xl border border-slate-800 p-5 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300 block">Brand / Company Name</label>
                    <input
                      type="text"
                      value={brandKit.brandName}
                      onChange={(e) => setBrandKit({ ...brandKit, brandName: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300 block">Brand Tagline</label>
                    <input
                      type="text"
                      value={brandKit.tagline}
                      onChange={(e) => setBrandKit({ ...brandKit, tagline: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Color Palette */}
                <div className="space-y-1.5 pt-2">
                  <label className="text-xs font-semibold text-slate-300 block">Approved Brand Palette</label>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 flex items-center gap-2">
                      <div
                        className="w-6 h-6 rounded border border-white/20 shrink-0"
                        style={{ backgroundColor: brandKit.primaryColor }}
                      />
                      <div className="min-w-0">
                        <div className="text-[10px] text-slate-500">Primary</div>
                        <input
                          type="text"
                          value={brandKit.primaryColor}
                          onChange={(e) => setBrandKit({ ...brandKit, primaryColor: e.target.value })}
                          className="font-mono text-xs text-slate-200 bg-transparent focus:outline-none w-full"
                        />
                      </div>
                    </div>

                    <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 flex items-center gap-2">
                      <div
                        className="w-6 h-6 rounded border border-white/20 shrink-0"
                        style={{ backgroundColor: brandKit.secondaryColor }}
                      />
                      <div className="min-w-0">
                        <div className="text-[10px] text-slate-500">Secondary</div>
                        <input
                          type="text"
                          value={brandKit.secondaryColor}
                          onChange={(e) => setBrandKit({ ...brandKit, secondaryColor: e.target.value })}
                          className="font-mono text-xs text-slate-200 bg-transparent focus:outline-none w-full"
                        />
                      </div>
                    </div>

                    <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 flex items-center gap-2">
                      <div
                        className="w-6 h-6 rounded border border-white/20 shrink-0"
                        style={{ backgroundColor: brandKit.accentColor }}
                      />
                      <div className="min-w-0">
                        <div className="text-[10px] text-slate-500">Accent</div>
                        <input
                          type="text"
                          value={brandKit.accentColor}
                          onChange={(e) => setBrandKit({ ...brandKit, accentColor: e.target.value })}
                          className="font-mono text-xs text-slate-200 bg-transparent focus:outline-none w-full"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mandatory Disclaimer */}
                <div className="space-y-1.5 pt-2">
                  <label className="text-xs font-semibold text-slate-300 block">Mandatory Legal Disclaimer Watermark</label>
                  <textarea
                    rows={2}
                    value={brandKit.mandatoryDisclaimer}
                    onChange={(e) => setBrandKit({ ...brandKit, mandatoryDisclaimer: e.target.value })}
                    className="w-full p-2.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
              </div>

              {/* Brand Kit Card Mockup (5 cols) */}
              <div className="lg:col-span-5 bg-slate-900 rounded-xl border border-slate-800 p-5 space-y-4 flex flex-col justify-between">
                <div className="text-xs font-semibold text-slate-200">Safe-Zone Margin Preview (10%)</div>

                <div className="relative rounded-lg overflow-hidden bg-slate-950 border border-slate-800 aspect-video flex flex-col justify-between p-4">
                  {/* Dashed safe zone boundary */}
                  <div className="absolute inset-4 border border-dashed border-blue-500/40 rounded pointer-events-none flex items-center justify-center">
                    <span className="text-[10px] font-mono text-blue-400/80">SAFE ZONE BOUNDARY (NO LOGO CLIPPING)</span>
                  </div>

                  <div className="flex items-center justify-between relative z-10">
                    <div className="text-sm font-bold text-white tracking-tight">{brandKit.brandName}</div>
                    <div
                      className="px-2 py-0.5 rounded text-[10px] font-bold text-white"
                      style={{ backgroundColor: brandKit.secondaryColor }}
                    >
                      OFFICIAL AD
                    </div>
                  </div>

                  <div className="relative z-10 text-[9px] text-slate-400 font-mono">
                    {brandKit.mandatoryDisclaimer}
                  </div>
                </div>

                <div className="text-xs text-slate-400 leading-relaxed">
                  All videos rendered under this workspace automatically inherit the {brandKit.brandName} color grade and safe margin constraints.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SUBTAB 7: INTERACTIVE B2B ROI CALCULATOR */}
        {activeSubTab === 'roi_calculator' && (
          <div className="space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <h2 className="text-xl font-bold text-white">Interactive Enterprise ROI Calculator</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Demonstrate concrete dollar savings and turnaround time reduction for executive decision makers.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Current Plan:</span>
                <span className="font-mono text-xs text-emerald-400 font-bold uppercase">{roiPlanId}</span>
              </div>
            </div>

            {/* Top Scorecard Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-center">
                <div className="text-[10px] text-slate-500 uppercase tracking-wider">Traditional Agency Cost</div>
                <div className="font-mono text-2xl font-bold text-red-400 tabular-nums mt-1">
                  ${roiMetrics.traditionalAnnualCost.toLocaleString()}
                </div>
                <div className="text-[10px] text-slate-400 mt-1">Annual agency bill</div>
              </div>

              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-center">
                <div className="text-[10px] text-slate-500 uppercase tracking-wider">LEO Platform Cost</div>
                <div className="font-mono text-2xl font-bold text-blue-400 tabular-nums mt-1">
                  ${roiMetrics.platformAnnualCost.toLocaleString()}
                </div>
                <div className="text-[10px] text-slate-400 mt-1">${B2B_PRICING_CATALOG[roiPlanId].priceUsdMonthly}/mo plan</div>
              </div>

              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-center">
                <div className="text-[10px] text-slate-500 uppercase tracking-wider">Net Annual Savings</div>
                <div className="font-mono text-2xl font-bold text-emerald-400 tabular-nums mt-1">
                  ${roiMetrics.netAnnualSavings.toLocaleString()}
                </div>
                <div className="text-[10px] text-emerald-400 font-medium mt-1">Direct OPEX savings</div>
              </div>

              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-center">
                <div className="text-[10px] text-slate-500 uppercase tracking-wider">ROI Multiple</div>
                <div className="font-mono text-2xl font-bold text-amber-400 tabular-nums mt-1">
                  {roiMetrics.roiMultiple}x
                </div>
                <div className="text-[10px] text-amber-300 font-medium mt-1">Return on investment</div>
              </div>
            </div>

            {/* Interactive Sliders & Comparison Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              {/* Sliders (6 cols) */}
              <div className="lg:col-span-6 bg-slate-900 rounded-xl border border-slate-800 p-5 space-y-5">
                <div className="text-xs font-semibold text-slate-200">Production Volume &amp; Cost Inputs</div>

                {/* Videos per month */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300">Videos Produced per Month</span>
                    <span className="font-mono text-blue-400 font-bold">{roiVideosPerMonth} videos/mo</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={roiVideosPerMonth}
                    onChange={(e) => setRoiVideosPerMonth(Number(e.target.value))}
                    className="w-full accent-blue-500"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>1 video</span>
                    <span>50 videos</span>
                    <span>100 videos</span>
                  </div>
                </div>

                {/* Traditional cost per video */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300">Traditional Agency Budget per Video</span>
                    <span className="font-mono text-emerald-400 font-bold">${roiTraditionalCost.toLocaleString()}</span>
                  </div>
                  <input
                    type="range"
                    min="1000"
                    max="10000"
                    step="500"
                    value={roiTraditionalCost}
                    onChange={(e) => setRoiTraditionalCost(Number(e.target.value))}
                    className="w-full accent-emerald-500"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>$1,000 (Low-budget)</span>
                    <span>$4,500 (Standard)</span>
                    <span>$10,000 (Studio Agency)</span>
                  </div>
                </div>

                {/* Turnaround days */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300">Traditional Turnaround Time</span>
                    <span className="font-mono text-amber-400 font-bold">{roiTurnaroundDays} days</span>
                  </div>
                  <input
                    type="range"
                    min="3"
                    max="30"
                    value={roiTurnaroundDays}
                    onChange={(e) => setRoiTurnaroundDays(Number(e.target.value))}
                    className="w-full accent-amber-500"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>3 days</span>
                    <span>14 days</span>
                    <span>30 days</span>
                  </div>
                </div>

                {/* Plan Tier Selector */}
                <div className="space-y-1.5 pt-2 border-t border-slate-800">
                  <label className="text-xs font-semibold text-slate-300 block">Select Platform Plan for Comparison</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['starter', 'pro', 'enterprise'] as B2BPlanId[]).map((pid) => (
                      <button
                        key={pid}
                        onClick={() => setRoiPlanId(pid)}
                        className={`p-2.5 rounded-lg border text-center transition-all ${
                          roiPlanId === pid
                            ? 'bg-blue-600/15 border-blue-500 text-white font-medium'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <div className="text-xs font-bold capitalize">{pid}</div>
                        <div className="font-mono text-[11px] text-blue-400 mt-0.5">
                          ${B2B_PRICING_CATALOG[pid].priceUsdMonthly}/mo
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Line-item Cost Breakdown Table (6 cols) */}
              <div className="lg:col-span-6 bg-slate-900 rounded-xl border border-slate-800 p-5 space-y-4 flex flex-col justify-between">
                <div className="text-xs font-semibold text-slate-200">Where the Savings Come From (Per Video)</div>

                <div className="overflow-x-auto border border-slate-800 rounded-lg">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-slate-950 text-[10px] text-slate-500 uppercase tracking-wider border-b border-slate-800">
                        <th className="py-2.5 px-3">Production Expense</th>
                        <th className="py-2.5 px-3 text-right">Traditional Agency</th>
                        <th className="py-2.5 px-3 text-right">LEO Enterprise</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-mono">
                      <tr>
                        <td className="py-2.5 px-3 font-sans text-slate-300">Spokesperson / Actor Booking</td>
                        <td className="py-2.5 px-3 text-right text-red-400">$1,500</td>
                        <td className="py-2.5 px-3 text-right text-emerald-400">$0 (Included)</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 font-sans text-slate-300">Soundstage / Studio Rental</td>
                        <td className="py-2.5 px-3 text-right text-red-400">$1,500</td>
                        <td className="py-2.5 px-3 text-right text-emerald-400">$0 (Virtual DiT)</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 font-sans text-slate-300">Director &amp; Camera Crew</td>
                        <td className="py-2.5 px-3 text-right text-red-400">$1,000</td>
                        <td className="py-2.5 px-3 text-right text-emerald-400">$0 (Automated)</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 font-sans text-slate-300">Post-Production &amp; Color Grading</td>
                        <td className="py-2.5 px-3 text-right text-red-400">$500</td>
                        <td className="py-2.5 px-3 text-right text-emerald-400">$0 (ProRes Export)</td>
                      </tr>
                      <tr className="bg-slate-950 font-bold">
                        <td className="py-2.5 px-3 font-sans text-white">Total Turnaround Time</td>
                        <td className="py-2.5 px-3 text-right text-red-400">{roiTurnaroundDays} Days</td>
                        <td className="py-2.5 px-3 text-right text-emerald-400">10 Minutes</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-xs text-emerald-300 font-medium">
                  Annual Time Saved: <strong>{roiMetrics.turnaroundHoursSavedAnnual.toLocaleString()} hours</strong> of executive &amp; agency revision time.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SUBTAB 8: SECURITY, SOC 2 & DEDICATED PRIVATE VPC */}
        {activeSubTab === 'security_soc2' && (
          <div className="space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <h2 className="text-xl font-bold text-white">Enterprise Security &amp; Private VPC Architecture</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Enterprise-grade isolation guarantees: proprietary CAD models and product photos never train public AI models.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-emerald-400 font-bold bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
                  SOC 2 Type II Certified
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              {/* Security Toggles (6 cols) */}
              <div className="lg:col-span-6 bg-slate-900 rounded-xl border border-slate-800 p-5 space-y-4">
                <div className="text-xs font-semibold text-slate-200">Compliance &amp; Isolation Settings</div>

                {/* Zero Data Retention */}
                <div className="p-3.5 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-blue-400" />
                      <span>Zero Data Retention (ZDR) Guarantee</span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      Prompts, product weights, and audio caches are purged immediately upon video render.
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={securityConfig.zeroDataRetention}
                    onChange={(e) => setSecurityConfig({ ...securityConfig, zeroDataRetention: e.target.checked })}
                    className="w-4 h-4 accent-blue-600 rounded"
                  />
                </div>

                {/* Dedicated Private VPC */}
                <div className="p-3.5 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Server className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Dedicated Private VPC (AWS / Azure)</span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      Renders are isolated to an air-gapped single-tenant H100 GPU cluster.
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={securityConfig.dedicatedPrivateVpc}
                    onChange={(e) => setSecurityConfig({ ...securityConfig, dedicatedPrivateVpc: e.target.checked })}
                    className="w-4 h-4 accent-emerald-600 rounded"
                  />
                </div>

                {/* Cloud Region */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300 block">Enterprise Data Residency Region</label>
                  <select
                    value={securityConfig.cloudRegion}
                    onChange={(e) => setSecurityConfig({ ...securityConfig, cloudRegion: e.target.value as any })}
                    className="w-full p-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-blue-500"
                  >
                    <option value="us-east-1">US East (N. Virginia) · HIPAA / SOC 2</option>
                    <option value="eu-west-1">EU West (Ireland) · GDPR Invariant</option>
                    <option value="ap-south-1 (Mumbai)">India (Mumbai) · RBI &amp; DPDP Compliant</option>
                    <option value="ap-southeast-1">Asia Pacific (Singapore)</option>
                  </select>
                </div>
              </div>

              {/* SOC 2 Audit Checklist (6 cols) */}
              <div className="lg:col-span-6 bg-slate-900 rounded-xl border border-slate-800 p-5 space-y-3">
                <div className="text-xs font-semibold text-slate-200">SOC 2 Type II Security Invariants</div>

                <div className="space-y-2">
                  <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <strong className="text-white">CC6.1 - Role-Based Access Control (RBAC):</strong>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Granular permissions for Admins, Directors, Reviewers, and Marketing Approvers with Okta SAML SSO.
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <strong className="text-white">CC6.6 - Hardware-Locked AES-256 Encryption:</strong>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        All product LoRA weights and frames encrypted in-transit (TLS 1.3) and at-rest using customer-managed KMS keys.
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <strong className="text-white">CC7.2 - Real-Time Intrusion &amp; Audit Trail:</strong>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Immutable event logging for every prompt execution, file export, and model fine-tuning run.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* B2B Pricing Plans Comparison Table */}
            <div className="mt-8 pt-6 border-t border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white">B2B Enterprise Pricing Tiers</h3>
                  <p className="text-xs text-slate-400">Priced on seats, minutes, and dedicated infrastructure.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(['starter', 'pro', 'enterprise'] as B2BPlanId[]).map((pid) => {
                  const plan = B2B_PRICING_CATALOG[pid];
                  const isHighlighted = pid === 'pro';

                  return (
                    <div
                      key={pid}
                      className={`p-5 rounded-xl border flex flex-col justify-between space-y-4 transition-all ${
                        isHighlighted
                          ? 'bg-blue-600/10 border-blue-500 shadow-lg shadow-blue-500/10'
                          : 'bg-slate-900 border-slate-800'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-base font-bold text-white">{plan.name}</span>
                          {isHighlighted && (
                            <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                              RECOMMENDED
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-400">{plan.targetAudience}</div>
                        <div className="pt-2">
                          <span className="font-mono text-3xl font-extrabold text-white">
                            ${plan.priceUsdMonthly}
                          </span>
                          <span className="text-xs text-slate-400"> / month</span>
                          <div className="font-mono text-[11px] text-slate-500">
                            or ₹{plan.priceInrMonthly.toLocaleString()} / mo (GST Invoice)
                          </div>
                        </div>

                        <div className="pt-3 border-t border-slate-800 space-y-2 text-xs text-slate-300">
                          {plan.features.map((feat, i) => (
                            <div key={i} className="flex items-start gap-2">
                              <Check className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                              <span>{feat}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          if (onOpenSubscriptionModal) onOpenSubscriptionModal();
                        }}
                        className={`w-full py-2 text-xs font-semibold rounded-lg transition-colors ${
                          isHighlighted
                            ? 'bg-blue-600 hover:bg-blue-500 text-white'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                        }`}
                      >
                        {pid === 'enterprise' ? 'Contact Enterprise Sales' : `Subscribe to ${plan.name}`}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Enterprise Product Model Builder Modal */}
      <EnterpriseProductModelBuilderModal
        isOpen={isModelBuilderOpen}
        onClose={() => setIsModelBuilderOpen(false)}
        onModelTrained={(newModel) => {
          setLoraModels((prev) => [newModel, ...prev]);
          setSelectedLoraId(newModel.id);
        }}
        onTestInLeoStudio={onSendPromptToLeoStudio}
        onOpenSandbox={(modelId) => {
          setSelectedLoraId(modelId);
          setActiveSubTab('model_sandbox');
        }}
        initialCategory={activeLora?.category || 'cosmetics'}
      />
    </div>
  );
};

// Small utility icon
function SendIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
      {...props}
    >
      <path d="m22 2-7 20-4-9-9-4Z" />
      <path d="M22 2 11 13" />
    </svg>
  );
}
