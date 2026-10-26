import React, { useState, useEffect, useRef, useId } from 'react';
import {
  X,
  Upload,
  Sparkles,
  Layers,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Download,
  Trash2,
  Eye,
  Sliders,
  ShieldCheck,
  Lock,
  ArrowRight,
  Info,
  Check,
  FileCode,
  Image as ImageIcon,
} from 'lucide-react';
import {
  B2BCategory,
  ProductTrainingImage,
  ProductAngleType,
  LoraTrainingJobState,
  ProductLoraModel,
} from '../types/b2bEnterprise';
import {
  validateProductDataset,
  getSampleProductDataset,
  createLoraTrainingJob,
  advanceTrainingJob,
} from '../utils/b2bEnterpriseEngine';

interface EnterpriseProductModelBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onModelTrained?: (newModel: ProductLoraModel) => void;
  onTestInLeoStudio?: (promptWithToken: string) => void;
  initialCategory?: B2BCategory;
}

const AVAILABLE_ANGLES: ProductAngleType[] = [
  'Front View',
  '3/4 Perspective',
  'Side Profile',
  'Rear View',
  'Top Down',
  'Macro Label Detail',
  'Cap & Closure',
  'Studio Lighting High-Key',
  'Studio Lighting Low-Key',
  'Floating 45° Angle',
];

export const EnterpriseProductModelBuilderModal: React.FC<EnterpriseProductModelBuilderModalProps> = ({
  isOpen,
  onClose,
  onModelTrained,
  onTestInLeoStudio,
  initialCategory = 'cosmetics',
}) => {
  const fileInputId = useId();
  // Form State
  const [productName, setProductName] = useState('Aurora Lumina Hydrating Serum');
  const [brandName, setBrandName] = useState('Global Cosmetics Group');
  const [category, setCategory] = useState<B2BCategory>(initialCategory);
  const [rank, setRank] = useState<16 | 32 | 64>(32);
  const [targetSteps, setTargetSteps] = useState<number>(1500);
  const [enableGeometryLock, setEnableGeometryLock] = useState(true);
  const [zeroDataRetention, setZeroDataRetention] = useState(true);

  // Training Dataset (10-20 images requirement)
  const [images, setImages] = useState<ProductTrainingImage[]>(() =>
    getSampleProductDataset(initialCategory, 'Aurora Lumina Hydrating Serum')
  );
  const [isDragOver, setIsDragOver] = useState(false);

  // Active Training Job State
  const [activeJob, setActiveJob] = useState<LoraTrainingJobState | null>(null);
  const [trainedModel, setTrainedModel] = useState<ProductLoraModel | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const logsContainerRef = useRef<HTMLDivElement | null>(null);

  // Dataset Validation
  const validation = validateProductDataset(images);

  // Trigger Token preview
  const derivedToken = `[${(productName || 'PRODUCT').toUpperCase().replace(/[^A-Z0-9]/g, '_')}]`;

  // Auto-scroll logs
  useEffect(() => {
    if (logsContainerRef.current) {
      logsContainerRef.current.scrollTop = logsContainerRef.current.scrollHeight;
    }
  }, [activeJob?.logs]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  if (!isOpen) return null;

  // Handle local file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newImages: ProductTrainingImage[] = [];
    const readPromises: Promise<void>[] = [];

    Array.from(files).forEach((file, index) => {
      if (images.length + newImages.length >= 20) return; // Cap at 20

      const p = new Promise<void>((resolve) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          const dataUri = event.target?.result as string;
          const assignedAngle = AVAILABLE_ANGLES[(images.length + index) % AVAILABLE_ANGLES.length];
          newImages.push({
            id: `uploaded-${Date.now()}-${index}`,
            name: file.name,
            dataUri: dataUri || '',
            angleLabel: assignedAngle,
            width: 1920,
            height: 1080,
            fileSizeBytes: file.size,
            vlmCaption: `Enterprise product photograph of ${productName} showing ${assignedAngle.toLowerCase()} with high fidelity.`,
          });
          resolve();
        };
        reader.readAsDataURL(file);
      });
      readPromises.push(p);
    });

    Promise.all(readPromises).then(() => {
      setImages((prev) => [...prev, ...newImages].slice(0, 20));
    });

    e.target.value = '';
  };

  // Handle Drag & Drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;

    const newImages: ProductTrainingImage[] = [];
    const readPromises: Promise<void>[] = [];

    Array.from(files).forEach((file, index) => {
      if (!file.type.startsWith('image/')) return;
      if (images.length + newImages.length >= 20) return;

      const p = new Promise<void>((resolve) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          const dataUri = event.target?.result as string;
          const assignedAngle = AVAILABLE_ANGLES[(images.length + index) % AVAILABLE_ANGLES.length];
          newImages.push({
            id: `dropped-${Date.now()}-${index}`,
            name: file.name,
            dataUri: dataUri || '',
            angleLabel: assignedAngle,
            width: 1920,
            height: 1080,
            fileSizeBytes: file.size,
            vlmCaption: `Enterprise product photograph of ${productName} showing ${assignedAngle.toLowerCase()} with high fidelity.`,
          });
          resolve();
        };
        reader.readAsDataURL(file);
      });
      readPromises.push(p);
    });

    Promise.all(readPromises).then(() => {
      setImages((prev) => [...prev, ...newImages].slice(0, 20));
    });
  };

  // Remove individual photo
  const handleRemoveImage = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  // Load sample dataset
  const handleLoadSampleDataset = (cat: B2BCategory) => {
    const pName =
      cat === 'apparel_footwear'
        ? 'Aero Velocity Pro Carbon Sneaker'
        : cat === 'tech_hardware'
        ? 'Quantum Core Server Pod'
        : 'Aurora Lumina Hydrating Serum';
    setProductName(pName);
    setCategory(cat);
    setImages(getSampleProductDataset(cat, pName));
  };

  // Update angle label on an image
  const handleUpdateAngle = (id: string, angle: ProductAngleType) => {
    setImages((prev) =>
      prev.map((img) => (img.id === id ? { ...img, angleLabel: angle } : img))
    );
  };

  // Trigger LoRA Training Job
  const handleTriggerTrainingJob = () => {
    if (!validation.canTrain) return;

    const initialJob = createLoraTrainingJob({
      productName,
      brandName,
      category,
      rank,
      targetSteps,
      enableGeometryLock,
      zeroDataRetention,
    });

    setActiveJob(initialJob);
    setTrainedModel(null);

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setActiveJob((prev) => {
        if (!prev) return null;
        if (prev.phase === 'completed') {
          if (intervalRef.current) clearInterval(intervalRef.current);

          const finalModel: ProductLoraModel = {
            id: prev.jobId,
            name: prev.productName,
            category: prev.category,
            triggerToken: prev.triggerToken,
            baseModel: prev.baseModel,
            rank: prev.rank,
            trainingSteps: prev.targetSteps,
            lossCurve: prev.lossHistory,
            sampleImage: images[0]?.dataUri || '/src/assets/images/b2b_product_perfume_bottle_1793008331955.jpg',
            preservationMetrics: {
              logoFidelityPct: prev.preservationScores?.logoFidelityPct || 99.4,
              geometryIoUPct: prev.preservationScores?.geometryIoUPct || 98.7,
              textSharpnessScore: prev.preservationScores?.textSharpnessScore || 9.8,
            },
            checkpointSizeMb: prev.checkpointSizeMb,
            status: 'ready',
            description: `Enterprise-grade LoRA model fine-tuned on ${images.length} verified studio angles with ControlNet geometry locking.`,
          };

          setTrainedModel(finalModel);
          if (onModelTrained) onModelTrained(finalModel);
          return prev;
        }

        return advanceTrainingJob(prev, 120);
      });
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-6xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-tight">
                  Enterprise Product Model Builder (LoRA)
                </h2>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  Zero Hallucination Pipeline
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Upload 10–20 product photos from diverse angles to train a dedicated LoRA weights model for consistent commercial video generation.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Split Layout */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Left Column: Image Ingestion & Dataset Validation (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              {/* Dataset Status & Threshold Gauge */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-slate-200">
                      Training Dataset (10–20 Images Requirement)
                    </span>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {validation.statusMessage}
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-mono text-lg font-bold tabular-nums text-blue-400">
                      {images.length} / 20
                    </span>
                    <div className="text-[10px] text-slate-500">Min: 10 · Max: 20</div>
                  </div>
                </div>

                {/* Progress Bar Gauge */}
                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className={`h-full transition-all duration-300 ${
                      images.length < 10
                        ? 'bg-amber-500'
                        : images.length <= 20
                        ? 'bg-emerald-500'
                        : 'bg-red-500'
                    }`}
                    style={{ width: `${Math.min(100, (images.length / 20) * 100)}%` }}
                  />
                </div>

                {/* Quick Presets & Diversity Metrics */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px]">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500">Angle Diversity:</span>
                    <span className="font-mono text-emerald-400 font-medium">{validation.angleDiversityPct}%</span>
                    <span className="text-slate-700">·</span>
                    <span className="text-slate-500">Quality Score:</span>
                    <span className="font-mono text-blue-400 font-medium">{validation.qualityScore}/100</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-500 text-[10px]">Test with Sample:</span>
                    <button
                      onClick={() => handleLoadSampleDataset('cosmetics')}
                      className="px-2 py-0.5 text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 transition-colors"
                    >
                      Cosmetic Bottle (14)
                    </button>
                    <button
                      onClick={() => handleLoadSampleDataset('apparel_footwear')}
                      className="px-2 py-0.5 text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 transition-colors"
                    >
                      Sneaker (14)
                    </button>
                  </div>
                </div>
              </div>

              {/* Drag & Drop Upload Zone */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragOver(true);
                }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleDrop}
                className={`p-6 rounded-xl border-2 border-dashed transition-all text-center flex flex-col items-center justify-center gap-2 ${
                  isDragOver
                    ? 'border-blue-500 bg-blue-500/10 text-white'
                    : 'border-slate-800 hover:border-slate-700 bg-slate-950/60 text-slate-400'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-blue-400">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-200">
                    Drag and drop 10–20 high-res product photos here
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Supports JPG, PNG, WEBP · Studio lighting, front, 3/4 angle, rear, macro label
                  </div>
                </div>

                <input
                  type="file"
                  id={fileInputId}
                  multiple
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <label
                  htmlFor={fileInputId}
                  className="px-3 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 transition-colors cursor-pointer mt-1"
                >
                  Browse Desktop Files
                </label>
              </div>

              {/* Uploaded Images Gallery Grid */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Uploaded Angles ({images.length})</span>
                  <button
                    onClick={() => setImages([])}
                    className="text-[11px] text-red-400 hover:text-red-300 transition-colors"
                  >
                    Clear All
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-[300px] overflow-y-auto p-1 border border-slate-800 rounded-xl bg-slate-950/40">
                  {images.map((img) => (
                    <div
                      key={img.id}
                      className="bg-slate-900 rounded-lg border border-slate-800 p-2 space-y-1.5 group relative"
                    >
                      <div className="relative aspect-square rounded overflow-hidden bg-black flex items-center justify-center">
                        <img
                          src={img.dataUri}
                          alt={img.name}
                          className="w-full h-full object-cover"
                        />
                        <button
                          onClick={() => handleRemoveImage(img.id)}
                          className="absolute top-1 right-1 w-6 h-6 rounded bg-black/70 hover:bg-red-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Remove photo"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="space-y-1">
                        <select
                          value={img.angleLabel}
                          onChange={(e) => handleUpdateAngle(img.id, e.target.value as ProductAngleType)}
                          className="w-full p-1 text-[10px] bg-slate-950 border border-slate-800 rounded text-slate-300 focus:outline-none focus:border-blue-500"
                        >
                          {AVAILABLE_ANGLES.map((angle) => (
                            <option key={angle} value={angle}>
                              {angle}
                            </option>
                          ))}
                        </select>
                        <div className="text-[9px] font-mono text-slate-500 truncate" title={img.name}>
                          {img.name}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Model Configuration & Live LoRA Training Runner (5 cols) */}
            <div className="lg:col-span-5 bg-slate-950 rounded-xl border border-slate-800 p-5 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-xs font-semibold text-slate-200">
                    Model &amp; Hyperparameter Setup
                  </span>
                  <span className="font-mono text-[10px] text-blue-400">
                    LEO-DiT-Enterprise-v3
                  </span>
                </div>

                {/* Product Name & Brand */}
                <div className="space-y-2">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                      Product Name
                    </label>
                    <input
                      type="text"
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-blue-500"
                      placeholder="e.g. Lumina Hydrating Serum"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                        Brand Name
                      </label>
                      <input
                        type="text"
                        value={brandName}
                        onChange={(e) => setBrandName(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-blue-500"
                        placeholder="e.g. Aurora Cosmetics"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                        Product Category
                      </label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value as B2BCategory)}
                        className="w-full px-2 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-blue-500"
                      >
                        <option value="cosmetics">Cosmetics &amp; Beauty</option>
                        <option value="apparel_footwear">Footwear &amp; Apparel</option>
                        <option value="tech_hardware">Tech Hardware &amp; Gadgets</option>
                        <option value="beverage_cpg">Beverage &amp; CPG</option>
                        <option value="automotive">Automotive</option>
                      </select>
                    </div>
                  </div>

                  {/* Trigger Token Display */}
                  <div className="p-2.5 bg-slate-900/90 rounded-lg border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-slate-500 uppercase tracking-wider">
                        Generated Trigger Token
                      </div>
                      <div className="font-mono text-xs font-bold text-blue-400 mt-0.5">
                        {derivedToken}
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-500">Auto-injected into prompt</span>
                  </div>
                </div>

                {/* LoRA Rank & Steps */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                      LoRA Rank ($r$)
                    </label>
                    <select
                      value={rank}
                      onChange={(e) => setRank(Number(e.target.value) as 16 | 32 | 64)}
                      className="w-full p-1.5 text-xs bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-blue-500"
                    >
                      <option value={16}>Rank 16 (72 MB · Fast)</option>
                      <option value={32}>Rank 32 (144 MB · Balanced)</option>
                      <option value={64}>Rank 64 (288 MB · Ultra-Detail)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                      Training Steps
                    </label>
                    <select
                      value={targetSteps}
                      onChange={(e) => setTargetSteps(Number(e.target.value))}
                      className="w-full p-1.5 text-xs bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-blue-500"
                    >
                      <option value={1000}>1,000 Steps (~7 mins)</option>
                      <option value={1500}>1,500 Steps (~10 mins)</option>
                      <option value={2000}>2,000 Steps (~14 mins)</option>
                    </select>
                  </div>
                </div>

                {/* Invariant Toggles */}
                <div className="space-y-1.5 pt-1">
                  <label className="flex items-center justify-between p-2 bg-slate-900/60 rounded-lg border border-slate-800 cursor-pointer">
                    <span className="text-[11px] text-slate-300">
                      ControlNet 3D Geometry Lock (Preserve Volume)
                    </span>
                    <input
                      type="checkbox"
                      checked={enableGeometryLock}
                      onChange={(e) => setEnableGeometryLock(e.target.checked)}
                      className="w-3.5 h-3.5 accent-blue-600 rounded"
                    />
                  </label>

                  <label className="flex items-center justify-between p-2 bg-slate-900/60 rounded-lg border border-slate-800 cursor-pointer">
                    <span className="text-[11px] text-slate-300">
                      Zero Data Retention (ZDR Private Air-gap)
                    </span>
                    <input
                      type="checkbox"
                      checked={zeroDataRetention}
                      onChange={(e) => setZeroDataRetention(e.target.checked)}
                      className="w-3.5 h-3.5 accent-emerald-600 rounded"
                    />
                  </label>
                </div>
              </div>

              {/* Training Progress HUD & Trigger Action */}
              <div className="space-y-3 pt-3 border-t border-slate-800">
                {activeJob && (
                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 font-semibold text-white">
                        {activeJob.phase !== 'completed' ? (
                          <RefreshCw className="w-3.5 h-3.5 text-blue-400 animate-spin" />
                        ) : (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        )}
                        <span className="capitalize">
                          {activeJob.phase.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <span className="font-mono text-[11px] text-slate-400">
                        Step {activeJob.currentStep} / {activeJob.targetSteps}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className="bg-blue-600 h-full transition-all duration-300"
                        style={{
                          width: `${Math.round((activeJob.currentStep / activeJob.targetSteps) * 100)}%`,
                        }}
                      />
                    </div>

                    {/* Live Loss & Invariant Stats */}
                    <div className="grid grid-cols-2 gap-2 text-[10px] font-mono pt-1">
                      <div className="bg-slate-950 p-1.5 rounded text-center">
                        <span className="text-slate-500">Loss:</span>{' '}
                        <strong className="text-emerald-400">{activeJob.currentLoss}</strong>
                      </div>
                      <div className="bg-slate-950 p-1.5 rounded text-center">
                        <span className="text-slate-500">ETA:</span>{' '}
                        <strong className="text-blue-400">{activeJob.estimatedRemainingSeconds}s</strong>
                      </div>
                    </div>

                    {/* Console Log stream */}
                    <div
                      ref={logsContainerRef}
                      className="h-20 overflow-y-auto bg-slate-950 p-2 rounded border border-slate-800 font-mono text-[10px] text-slate-400 space-y-1"
                    >
                      {activeJob.logs.map((log, i) => (
                        <div key={i} className="leading-tight">
                          {log}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Success Card when completed */}
                {trainedModel && (
                  <div className="bg-emerald-500/10 border border-emerald-500/30 p-3 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>LoRA Model Weights Ready</span>
                      </span>
                      <span className="font-mono text-[10px] text-emerald-400">
                        {trainedModel.checkpointSizeMb} MB Safetensors
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-300">
                      Trigger Token: <strong className="font-mono text-white">{trainedModel.triggerToken}</strong> (Fidelity: {trainedModel.preservationMetrics.logoFidelityPct}%)
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => {
                          const testPrompt = `A high-end cinematic commercial of ${trainedModel.triggerToken} placed on a smooth travertine pedestal, warm studio lighting, 4K commercial`;
                          if (onTestInLeoStudio) onTestInLeoStudio(testPrompt);
                          onClose();
                        }}
                        className="flex-1 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Test in LEO Studio</span>
                      </button>

                      <a
                        href={`#safetensors-${trainedModel.id}`}
                        download={`${trainedModel.name.toLowerCase().replace(/\s+/g, '_')}_lora.safetensors`}
                        onClick={(e) => {
                          e.preventDefault();
                          alert(`Safetensors weights (${trainedModel.checkpointSizeMb}MB) saved to your enterprise models catalog.`);
                        }}
                        className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 text-xs font-medium"
                        title="Download .safetensors checkpoint"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                )}

                {/* Primary Action Button */}
                <button
                  disabled={!validation.canTrain || (activeJob !== null && activeJob.phase !== 'completed')}
                  onClick={handleTriggerTrainingJob}
                  className="w-full py-2.5 text-xs font-semibold bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl shadow-md shadow-blue-600/20 transition-all flex items-center justify-center gap-2"
                >
                  {activeJob && activeJob.phase !== 'completed' ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>LoRA Training in Progress...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Trigger LoRA Training Job ({images.length} Images)</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
