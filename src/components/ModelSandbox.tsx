import React, { useState, useId } from 'react';
import {
  Sparkles,
  Play,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sliders,
  Camera,
  Layers,
  ShieldCheck,
  Send,
  Eye,
  FileCheck2,
  Info,
  Maximize2,
  ChevronRight,
  ArrowRight,
  Gauge,
  Check,
  Download,
  Terminal,
} from 'lucide-react';
import {
  ProductLoraModel,
  ModelSandboxPresetPrompt,
  SandboxTestResult,
} from '../types/b2bEnterprise';
import {
  MODEL_SANDBOX_PRESET_PROMPTS,
  simulateSandboxTest,
} from '../utils/b2bEnterpriseEngine';

interface ModelSandboxProps {
  loraModels: ProductLoraModel[];
  selectedModelId?: string;
  onSelectModel?: (modelId: string) => void;
  onSendPromptToLeoStudio?: (prompt: string) => void;
  onOpenModelBuilder?: () => void;
  onOpenTrainingDashboard?: () => void;
}

export const ModelSandbox: React.FC<ModelSandboxProps> = ({
  loraModels,
  selectedModelId,
  onSelectModel,
  onSendPromptToLeoStudio,
  onOpenModelBuilder,
  onOpenTrainingDashboard,
}) => {
  const customPromptInputId = useId();
  // Selected model state
  const currentModelId = selectedModelId || (loraModels.length > 0 ? loraModels[0].id : '');
  const activeModel = loraModels.find((m) => m.id === currentModelId) || loraModels[0];

  // Selected preset prompt
  const [selectedPresetId, setSelectedPresetId] = useState<string>(
    MODEL_SANDBOX_PRESET_PROMPTS[0].id
  );
  const activePreset =
    MODEL_SANDBOX_PRESET_PROMPTS.find((p) => p.id === selectedPresetId) ||
    MODEL_SANDBOX_PRESET_PROMPTS[0];

  // Custom prompt override
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16' | '1:1' | '21:9'>('16:9');
  const [cameraRig, setCameraRig] = useState<string>('35mm Prime Arri Alexa, Macro Slider');
  const [inferenceSteps, setInferenceSteps] = useState<number>(45);
  const [guidanceScale, setGuidanceScale] = useState<number>(6.5);

  // Testing & simulation states
  const [isRunningTest, setIsRunningTest] = useState(false);
  const [testStage, setTestStage] = useState<string>('');
  const [testProgress, setTestProgress] = useState<number>(0);
  const [latestResult, setLatestResult] = useState<SandboxTestResult | null>(() => {
    if (activeModel) {
      return simulateSandboxTest(activeModel, activePreset);
    }
    return null;
  });

  const [testHistory, setTestHistory] = useState<SandboxTestResult[]>(() => {
    if (activeModel) {
      return [simulateSandboxTest(activeModel, activePreset)];
    }
    return [];
  });

  // Inspection overlay states
  const [inspectionMode, setInspectionMode] = useState<'normal' | 'logo_mask' | 'edge_iou' | 'materials'>('normal');
  const [approvedModels, setApprovedModels] = useState<Record<string, boolean>>({
    'lora-perfume-01': true,
  });

  // Effective prompt computation
  const token = activeModel?.triggerToken || '<PRODUCT_TOKEN>';
  const effectivePrompt = customPrompt.trim().length > 0
    ? customPrompt
    : activePreset.promptTemplate.replace(/\{\{token\}\}/g, token);

  const handleRunTest = (presetOverride?: ModelSandboxPresetPrompt) => {
    if (!activeModel || isRunningTest) return;

    const presetToRun = presetOverride || activePreset;
    setIsRunningTest(true);
    setTestProgress(10);
    setTestStage('Initializing TensorRT LoRA weights & base checkpoint...');

    setTimeout(() => {
      setTestProgress(35);
      setTestStage('Sampling latents with Euler ancestral solver (45 steps)...');
    }, 400);

    setTimeout(() => {
      setTestProgress(70);
      setTestStage('Running VLM invariant inspection on logo & silhouette...');
    }, 850);

    setTimeout(() => {
      setTestProgress(100);
      const res = simulateSandboxTest(activeModel, presetToRun, customPrompt.trim() ? customPrompt : undefined);
      setLatestResult(res);
      setTestHistory((prev) => [res, ...prev.slice(0, 9)]);
      setIsRunningTest(false);
      setTestStage('');
    }, 1200);
  };

  const handleRunAllPresets = () => {
    if (!activeModel || isRunningTest) return;
    setIsRunningTest(true);
    setTestProgress(20);
    setTestStage('Batch executing 5 preset stress scenarios...');

    setTimeout(() => {
      setTestProgress(60);
      setTestStage('Calculating cross-scenario IoU & geometry variance...');
    }, 800);

    setTimeout(() => {
      const allResults = MODEL_SANDBOX_PRESET_PROMPTS.map((p) =>
        simulateSandboxTest(activeModel, p)
      );
      setLatestResult(allResults[0]);
      setTestHistory((prev) => [...allResults, ...prev].slice(0, 15));
      setIsRunningTest(false);
      setTestProgress(100);
      setTestStage('');
    }, 1400);
  };

  const handleToggleApprove = () => {
    if (!activeModel) return;
    setApprovedModels((prev) => ({
      ...prev,
      [activeModel.id]: !prev[activeModel.id],
    }));
  };

  const isModelApproved = Boolean(activeModel && approvedModels[activeModel.id]);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold tracking-tight text-foreground">
                  Model Consistency Sandbox
                </h2>
                <p className="text-sm text-muted-foreground">
                  Verify product logo fidelity, geometry silhouette IoU, and material reflectance before wide-scale deployment.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {onOpenTrainingDashboard && (
              <button
                type="button"
                onClick={onOpenTrainingDashboard}
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-secondary/50 px-3.5 py-2 text-xs font-medium text-foreground transition-colors hover:bg-secondary"
              >
                <ActivityIcon className="h-3.5 w-3.5 text-primary" />
                Live GPU Cluster Telemetry
              </button>
            )}
            {onOpenModelBuilder && (
              <button
                type="button"
                onClick={onOpenModelBuilder}
                className="inline-flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/10 px-3.5 py-2 text-xs font-semibold text-primary transition-colors hover:bg-primary/20"
              >
                <Layers className="h-3.5 w-3.5" />
                Train New Product LoRA
              </button>
            )}
          </div>
        </div>

        {/* Model Selection Bar */}
        <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-border pt-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Target LoRA Model:
          </span>
          <div className="flex flex-wrap items-center gap-2">
            {loraModels.map((model) => {
              const isSelected = model.id === currentModelId;
              const isApproved = approvedModels[model.id];

              return (
                <button
                  key={model.id}
                  type="button"
                  onClick={() => onSelectModel && onSelectModel(model.id)}
                  className={`group relative flex items-center gap-2.5 rounded-lg border px-3 py-2 text-left transition-all ${
                    isSelected
                      ? 'border-primary bg-primary/10 ring-1 ring-primary/40'
                      : 'border-border bg-card/60 hover:border-border hover:bg-secondary/40'
                  }`}
                >
                  <div className="h-2 w-2 rounded-full bg-emerald-500" />
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                      <span>{model.name}</span>
                      <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">
                        r:{model.rank}
                      </span>
                    </div>
                    <div className="font-mono text-[10px] text-muted-foreground">
                      {model.triggerToken}
                    </div>
                  </div>
                  {isApproved && (
                    <span
                      title="Enterprise Certified for Production"
                      className="ml-1 inline-flex items-center text-emerald-500"
                    >
                      <ShieldCheck className="h-4 w-4" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Grid: Left Controls (Presets & Prompt) vs Right (Viewer & Invariant Metrics) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column (Presets & Controls) - 5 cols */}
        <div className="space-y-6 lg:col-span-5">
          {/* Preset Scenarios */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Verification Scenarios (5 Presets)
              </h3>
              <button
                type="button"
                onClick={handleRunAllPresets}
                disabled={isRunningTest}
                className="text-xs font-medium text-primary transition-colors hover:text-primary/80 disabled:opacity-50"
              >
                Run All 5 Stress Tests
              </button>
            </div>

            <div className="space-y-2.5">
              {MODEL_SANDBOX_PRESET_PROMPTS.map((preset) => {
                const isSelected = preset.id === selectedPresetId;

                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => {
                      setSelectedPresetId(preset.id);
                      setCustomPrompt('');
                    }}
                    className={`w-full rounded-lg border p-3 text-left transition-all ${
                      isSelected
                        ? 'border-primary bg-primary/5 shadow-sm ring-1 ring-primary/40'
                        : 'border-border/80 bg-background/60 hover:border-border hover:bg-secondary/30'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-foreground">
                            {preset.scenarioName}
                          </span>
                          <span className="rounded bg-muted px-1.5 py-0.5 text-[9px] font-mono uppercase text-muted-foreground">
                            {preset.scenarioCategory.replace('_', ' ')}
                          </span>
                        </div>
                        <p className="text-[11px] text-muted-foreground line-clamp-2">
                          {preset.promptTemplate.replace(/\{\{token\}\}/g, token)}
                        </p>
                      </div>
                      <ChevronRight
                        className={`h-4 w-4 shrink-0 transition-transform ${
                          isSelected ? 'translate-x-0.5 text-primary' : 'text-muted-foreground'
                        }`}
                      />
                    </div>

                    <div className="mt-2.5 flex flex-wrap items-center gap-2 border-t border-border/50 pt-2 text-[10px] text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Camera className="h-3 w-3 text-primary/70" />
                        {preset.recommendedCamera}
                      </span>
                      <span className="text-border">•</span>
                      <span className="flex items-center gap-1 font-mono text-emerald-400">
                        <Check className="h-3 w-3" />
                        {preset.expectedInvariant}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Prompt & Generation Parameters */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <label htmlFor={customPromptInputId} className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Inference Prompt
              </label>
              <button
                type="button"
                onClick={() => {
                  setCustomPrompt(
                    (prev) => `${prev} ${token}`.trim()
                  );
                }}
                className="inline-flex items-center gap-1 rounded bg-secondary px-2 py-0.5 text-[10px] font-mono font-medium text-foreground hover:bg-secondary/80"
              >
                Insert {token}
              </button>
            </div>

            <textarea
              id={customPromptInputId}
              rows={3}
              value={customPrompt || activePreset.promptTemplate.replace(/\{\{token\}\}/g, token)}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="Enter custom commercial shot prompt..."
              className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary font-sans leading-relaxed"
            />

            {/* Quick Camera & Lighting Presets */}
            <div className="space-y-2">
              <span className="text-[11px] font-semibold text-muted-foreground">
                Lens & Cinematic Rig
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  '35mm Prime Arri Alexa, Macro Slider',
                  '85mm Anamorphic Portrait, Shallow DOF',
                  'FPV Drone Orbit, High Speed Shutter',
                  '90° Top-Down Flat-Lay, Softbox',
                ].map((rig) => (
                  <button
                    key={rig}
                    type="button"
                    onClick={() => setCameraRig(rig)}
                    className={`rounded border px-2 py-1 text-[10px] transition-colors ${
                      cameraRig === rig
                        ? 'border-primary bg-primary/10 text-primary font-medium'
                        : 'border-border bg-background/80 text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {rig}
                  </button>
                ))}
              </div>
            </div>

            {/* Aspect Ratio & Steps */}
            <div className="grid grid-cols-2 gap-3 border-t border-border pt-3">
              <div>
                <span className="text-[11px] font-semibold text-muted-foreground">
                  Aspect Ratio
                </span>
                <div className="mt-1 flex rounded-lg border border-border bg-background p-0.5 text-xs">
                  {(['16:9', '9:16', '1:1', '21:9'] as const).map((ratio) => (
                    <button
                      key={ratio}
                      type="button"
                      onClick={() => setAspectRatio(ratio)}
                      className={`flex-1 rounded py-1 text-[10px] font-mono transition-colors ${
                        aspectRatio === ratio
                          ? 'bg-primary text-primary-foreground font-semibold'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {ratio}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-muted-foreground">Inference Steps</span>
                  <span className="font-mono text-foreground font-semibold">{inferenceSteps}</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="60"
                  step="5"
                  value={inferenceSteps}
                  onChange={(e) => setInferenceSteps(Number(e.target.value))}
                  className="mt-2 w-full accent-primary"
                />
              </div>
            </div>

            {/* Run Button */}
            <button
              type="button"
              onClick={() => handleRunTest()}
              disabled={isRunningTest || !activeModel}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-xs font-semibold text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-50"
            >
              {isRunningTest ? (
                <>
                  <RotateCcw className="h-4 w-4 animate-spin" />
                  <span>Synthesizing Test Frame ({testProgress}%)...</span>
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 fill-current" />
                  <span>Run Sandbox Verification</span>
                </>
              )}
            </button>

            {isRunningTest && testStage && (
              <div className="rounded border border-primary/20 bg-primary/5 p-2.5 text-[11px] font-mono text-primary animate-pulse flex items-center gap-2">
                <Terminal className="h-3.5 w-3.5 shrink-0" />
                <span>{testStage}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Viewport, Overlays, Invariant Scorecards, & Deployment Action - 7 cols */}
        <div className="space-y-6 lg:col-span-7">
          {/* Visual Preview Screen */}
          <div className="relative overflow-hidden rounded-xl border border-border bg-black shadow-lg">
            {/* Top Toolbar */}
            <div className="flex items-center justify-between border-b border-white/10 bg-black/60 px-4 py-2.5 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                <span className="text-xs font-mono font-medium text-white">
                  {latestResult ? latestResult.scenarioName : activePreset.scenarioName}
                </span>
                <span className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] font-mono text-white/70">
                  {aspectRatio}
                </span>
              </div>

              {/* Inspection Mode Toggles */}
              <div className="flex items-center gap-1">
                {(
                  [
                    { id: 'normal', label: 'Color' },
                    { id: 'logo_mask', label: 'Logo Mask' },
                    { id: 'edge_iou', label: 'Geometry IoU' },
                    { id: 'materials', label: 'Materials' },
                  ] as const
                ).map((mode) => (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => setInspectionMode(mode.id)}
                    className={`rounded px-2 py-0.5 text-[10px] font-mono transition-colors ${
                      inspectionMode === mode.id
                        ? 'bg-primary text-primary-foreground font-semibold'
                        : 'text-white/70 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Frame Display */}
            <div className="relative aspect-video w-full bg-neutral-950 flex items-center justify-center overflow-hidden">
              {latestResult ? (
                <>
                  <img
                    src={latestResult.renderedImage}
                    alt="Sandbox Render"
                    className={`h-full w-full object-cover transition-all duration-300 ${
                      inspectionMode === 'edge_iou'
                        ? 'contrast-150 saturate-50 hue-rotate-90'
                        : inspectionMode === 'logo_mask'
                        ? 'brightness-90 contrast-200'
                        : inspectionMode === 'materials'
                        ? 'filter invert brightness-110'
                        : ''
                    }`}
                  />

                  {/* Inspection Overlays */}
                  {inspectionMode === 'logo_mask' && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="rounded-lg border-2 border-emerald-400/90 bg-emerald-500/10 px-4 py-2 backdrop-blur-[1px] text-center shadow-lg">
                        <div className="font-mono text-xs font-bold text-emerald-300">
                          LOGO PRESERVATION ZONE
                        </div>
                        <div className="font-mono text-[10px] text-emerald-200">
                          Fidelity: {latestResult.logoIntegrityPct}% (Confidence 0.998)
                        </div>
                      </div>
                    </div>
                  )}

                  {inspectionMode === 'edge_iou' && (
                    <div className="absolute inset-x-4 bottom-4 rounded border border-cyan-400/40 bg-black/80 p-2.5 font-mono text-[11px] text-cyan-300 backdrop-blur-sm pointer-events-none">
                      <div className="flex items-center justify-between">
                        <span>Silhouette Boundary Deviation: ±0.34px</span>
                        <span className="font-bold text-cyan-400">IoU: {latestResult.geometrySilhouetteIoU}%</span>
                      </div>
                    </div>
                  )}

                  {/* Watermark / Metadata HUD */}
                  <div className="absolute bottom-2 left-2 rounded bg-black/70 px-2 py-1 font-mono text-[9px] text-white/60 pointer-events-none">
                    LEO LoRA Engine • {activeModel?.name} • CFG {guidanceScale} • {latestResult.renderTimeSec}s
                  </div>
                </>
              ) : (
                <div className="text-center p-8 text-neutral-500">
                  <Camera className="mx-auto h-8 w-8 text-neutral-600 mb-2" />
                  <p className="text-xs">Select a preset or enter a prompt and click Run Sandbox Verification.</p>
                </div>
              )}
            </div>
          </div>

          {/* Invariant Scorecards */}
          {latestResult && (
            <div className="grid grid-cols-3 gap-3">
              {/* Logo Integrity */}
              <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="text-[11px] font-semibold uppercase tracking-wider">
                    Logo Integrity
                  </span>
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-2xl font-bold font-mono tracking-tight text-foreground tabular-nums">
                    {latestResult.logoIntegrityPct}%
                  </span>
                  <span className="text-[10px] text-emerald-500 font-medium">≥ 99.0% req</span>
                </div>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full bg-emerald-500 rounded-full"
                    style={{ width: `${latestResult.logoIntegrityPct}%` }}
                  />
                </div>
                <p className="mt-2 text-[10px] text-muted-foreground">
                  Zero glyph deformation detected.
                </p>
              </div>

              {/* Geometry Silhouette IoU */}
              <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="text-[11px] font-semibold uppercase tracking-wider">
                    Geometry IoU
                  </span>
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-2xl font-bold font-mono tracking-tight text-foreground tabular-nums">
                    {latestResult.geometrySilhouetteIoU}%
                  </span>
                  <span className="text-[10px] text-emerald-500 font-medium">≥ 98.0% req</span>
                </div>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full bg-cyan-500 rounded-full"
                    style={{ width: `${latestResult.geometrySilhouetteIoU}%` }}
                  />
                </div>
                <p className="mt-2 text-[10px] text-muted-foreground">
                  Physical form silhouette preserved.
                </p>
              </div>

              {/* Material Purity */}
              <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="text-[11px] font-semibold uppercase tracking-wider">
                    Material Purity
                  </span>
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-2xl font-bold font-mono tracking-tight text-foreground tabular-nums">
                    {latestResult.materialPurityPct}%
                  </span>
                  <span className="text-[10px] text-emerald-500 font-medium">≥ 98.0% req</span>
                </div>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full bg-violet-500 rounded-full"
                    style={{ width: `${latestResult.materialPurityPct}%` }}
                  />
                </div>
                <p className="mt-2 text-[10px] text-muted-foreground">
                  Reflectance and glass refraction matched.
                </p>
              </div>
            </div>
          )}

          {/* Enterprise Sign-Off & Handoff Controls */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <ShieldCheck
                    className={`h-5 w-5 ${
                      isModelApproved ? 'text-emerald-500' : 'text-muted-foreground'
                    }`}
                  />
                  <h4 className="text-sm font-semibold text-foreground">
                    Enterprise Deployment Certification
                  </h4>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {isModelApproved
                    ? 'Model is verified and approved for automated multi-seat production pipelines.'
                    : 'Sign off on invariant compliance before publishing to the enterprise workspace.'}
                </p>
              </div>

              <button
                type="button"
                onClick={handleToggleApprove}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold transition-all ${
                  isModelApproved
                    ? 'border border-emerald-500/40 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                    : 'border border-border bg-secondary text-foreground hover:bg-secondary/80'
                }`}
              >
                {isModelApproved ? (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    <span>Certified for Production</span>
                  </>
                ) : (
                  <>
                    <FileCheck2 className="h-3.5 w-3.5" />
                    <span>Sign Off & Approve Model</span>
                  </>
                )}
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2 border-t border-border pt-4">
              {onSendPromptToLeoStudio && (
                <button
                  type="button"
                  onClick={() => onSendPromptToLeoStudio(effectivePrompt)}
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
                >
                  <Send className="h-3.5 w-3.5" />
                  Generate Full Video in LEO Studio
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  const auditReport = {
                    modelId: activeModel?.id,
                    modelName: activeModel?.name,
                    triggerToken: activeModel?.triggerToken,
                    rank: activeModel?.rank,
                    certifiedAt: new Date().toISOString(),
                    invariantScores: {
                      logoIntegrity: latestResult?.logoIntegrityPct,
                      geometryIoU: latestResult?.geometrySilhouetteIoU,
                      materialPurity: latestResult?.materialPurityPct,
                    },
                    historyRunsCount: testHistory.length,
                  };
                  const blob = new Blob([JSON.stringify(auditReport, null, 2)], {
                    type: 'application/json',
                  });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `${activeModel?.name.toLowerCase().replace(/\s+/g, '_')}_compliance_audit.json`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-secondary/60 px-3.5 py-2 text-xs font-medium text-foreground transition-colors hover:bg-secondary"
              >
                <Download className="h-3.5 w-3.5" />
                Export SOC 2 Audit Certificate (JSON)
              </button>
            </div>
          </div>

          {/* Test History Audit Log */}
          {testHistory.length > 0 && (
            <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                Sandbox Test Execution Log ({testHistory.length} Runs)
              </h4>
              <div className="space-y-2">
                {testHistory.slice(0, 5).map((run) => (
                  <div
                    key={run.testId}
                    className="flex items-center justify-between rounded-lg border border-border/60 bg-background/50 px-3 py-2 text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="h-2 w-2 rounded-full bg-emerald-500" />
                      <span className="font-medium text-foreground">{run.scenarioName}</span>
                      <span className="font-mono text-[10px] text-muted-foreground">
                        {run.modelToken}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 font-mono text-[11px]">
                      <span className="text-emerald-400">Logo: {run.logoIntegrityPct}%</span>
                      <span className="text-cyan-400">IoU: {run.geometrySilhouetteIoU}%</span>
                      <span className="text-muted-foreground">{run.renderTimeSec}s</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

function ActivityIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={props.className}
    >
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  );
}
