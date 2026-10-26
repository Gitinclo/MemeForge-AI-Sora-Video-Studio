import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Music,
  Sparkles,
  Zap,
  Play,
  Pause,
  Upload,
  Layers,
  ArrowRight,
  RotateCcw,
  Check,
  CheckCircle2,
  Copy,
  DollarSign,
  Cpu,
  Split,
  Eye,
  Sliders,
  Flame,
  Volume2,
} from 'lucide-react';
import {
  VIRAL_DANCE_TEMPLATES,
  FILL_IN_THE_BLANK_TEMPLATES,
  MODEL_SELECTION_CATALOG,
  DanceTemplate,
  getProceduralDanceKeypoints,
} from '../utils/aiDanceEngine';

interface AiDanceStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeMemeImageSrc?: string;
  onApplyPromptToStudio?: (prompt: string) => void;
}

export const AiDanceStudioModal: React.FC<AiDanceStudioModalProps> = ({
  isOpen,
  onClose,
  activeMemeImageSrc,
  onApplyPromptToStudio,
}) => {
  const [activeTab, setActiveTab] = useState<'dance_maker' | 'fill_in_prompts' | 'model_matrix'>('dance_maker');

  // Dance Maker State
  const [selectedDance, setSelectedDance] = useState<DanceTemplate>(VIRAL_DANCE_TEMPLATES[0]);
  const [characterImage, setCharacterImage] = useState<string>(
    activeMemeImageSrc || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'
  );
  const [isDuetMode, setIsDuetMode] = useState<boolean>(true);
  const [poseGuidanceScale, setPoseGuidanceScale] = useState<number>(1.8);
  const [isPlayingPreview, setIsPlayingPreview] = useState<boolean>(true);
  const [isRenderingDance, setIsRenderingDance] = useState<boolean>(false);
  const [renderProgress, setRenderProgress] = useState<number>(0);
  const [renderStage, setRenderStage] = useState<string>('Idle');
  const [danceRenderComplete, setDanceRenderComplete] = useState<boolean>(false);

  // Fill-in-the-Blank State
  const [selectedFillTemplateId, setSelectedFillTemplateId] = useState<string>(FILL_IN_THE_BLANK_TEMPLATES[0].id);
  const [promptValues, setPromptValues] = useState<Record<string, string>>({
    SUBJECT: 'an armored cybernetic warrior',
    LOCATION: 'a misty fjord in Norway',
    WEATHER: 'dramatic stormy sunset',
    CHARACTER: 'Mona Lisa in streetwear',
    DANCE_MOVE: 'slickback zero-gravity glide',
    VENUE: 'an underground Berlin rave club',
    CITY: 'Shinjuku Tokyo',
    OPTICS: '85mm anamorphic T/1.5 lens flare',
  });
  const [copiedPrompt, setCopiedPrompt] = useState<boolean>(false);

  const skeletonCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Sync activeMemeImageSrc if updated
  useEffect(() => {
    if (activeMemeImageSrc && !characterImage) {
      setCharacterImage(activeMemeImageSrc);
    }
  }, [activeMemeImageSrc]);

  // Procedural DWPose 2D Skeleton Animation Loop
  useEffect(() => {
    if (!isOpen || activeTab !== 'dance_maker') return;
    const canvas = skeletonCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let startTime = Date.now();

    const drawSkeleton = () => {
      const elapsedSec = (Date.now() - startTime) / 1000;
      const w = canvas.width;
      const h = canvas.height;

      ctx.fillStyle = '#090d16';
      ctx.fillRect(0, 0, w, h);

      // Grid background
      ctx.strokeStyle = 'rgba(79, 70, 229, 0.15)';
      ctx.lineWidth = 1;
      for (let x = 0; x < w; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      const kp = getProceduralDanceKeypoints(selectedDance.id, isPlayingPreview ? elapsedSec : 0);

      // Helper to project normalized (0-100) to canvas px
      const px = (pt: { x: number; y: number }) => ({
        x: (pt.x / 100) * w,
        y: (pt.y / 100) * h,
      });

      const pHead = px(kp.head);
      const pNeck = px(kp.neck);
      const pLShoulder = px(kp.leftShoulder);
      const pRShoulder = px(kp.rightShoulder);
      const pLElbow = px(kp.leftElbow);
      const pRElbow = px(kp.rightElbow);
      const pLWrist = px(kp.leftWrist);
      const pRWrist = px(kp.rightWrist);
      const pPelvis = px(kp.pelvis);
      const pLKnee = px(kp.leftKnee);
      const pRKnee = px(kp.rightKnee);
      const pLAnkle = px(kp.leftAnkle);
      const pRAnkle = px(kp.rightAnkle);

      // Draw Bones (colored lines according to OpenPose / DWPose standards)
      const drawBone = (p1: { x: number; y: number }, p2: { x: number; y: number }, color: string, width = 3) => {
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      };

      // Spine / Torso
      drawBone(pHead, pNeck, '#f43f5e', 4);
      drawBone(pNeck, pPelvis, '#f59e0b', 5);
      drawBone(pNeck, pLShoulder, '#10b981', 4);
      drawBone(pNeck, pRShoulder, '#06b6d4', 4);

      // Left Arm
      drawBone(pLShoulder, pLElbow, '#10b981', 3.5);
      drawBone(pLElbow, pLWrist, '#34d399', 3);

      // Right Arm
      drawBone(pRShoulder, pRElbow, '#06b6d4', 3.5);
      drawBone(pRElbow, pRWrist, '#38bdf8', 3);

      // Pelvis to Hips/Legs
      drawBone(pPelvis, pLKnee, '#8b5cf6', 4);
      drawBone(pLKnee, pLAnkle, '#a78bfa', 3.5);

      drawBone(pPelvis, pRKnee, '#ec4899', 4);
      drawBone(pRKnee, pRAnkle, '#f472b6', 3.5);

      // Draw Keypoint Joint circles with glow
      const joints = [
        pHead, pNeck, pLShoulder, pRShoulder, pLElbow, pRElbow,
        pLWrist, pRWrist, pPelvis, pLKnee, pRKnee, pLAnkle, pRAnkle
      ];

      joints.forEach((j) => {
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 8;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(j.x, j.y, 4.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // HUD overlay info on skeleton canvas
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(8, 8, 140, 36);
      ctx.strokeStyle = '#4f46e5';
      ctx.strokeRect(8, 8, 140, 36);

      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 10px monospace';
      ctx.fillText('DWPose 2D Extractor', 14, 22);
      ctx.fillStyle = '#94a3b8';
      ctx.font = '9px monospace';
      ctx.fillText(`BPM: ${selectedDance.bpm} • 24 Joints`, 14, 35);

      animFrameRef.current = requestAnimationFrame(drawSkeleton);
    };

    drawSkeleton();
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isOpen, activeTab, selectedDance, isPlayingPreview]);

  if (!isOpen) return null;

  const handleStartDanceRender = () => {
    setIsRenderingDance(true);
    setDanceRenderComplete(false);
    setRenderProgress(10);
    setRenderStage('DWPose: Extracting 24-joint skeletal trajectory from template video...');

    setTimeout(() => {
      setRenderProgress(35);
      setRenderStage('DensePose: Mapping 3D human body mesh surface coordinates...');
    }, 1200);

    setTimeout(() => {
      setRenderProgress(65);
      setRenderStage('Moore-AnimateAnyone: Diffusion frame-by-frame character texture synthesis...');
    }, 2400);

    setTimeout(() => {
      setRenderProgress(90);
      setRenderStage('Duet Sync: Aligning audio beats & motion blur across side-by-side viewport...');
    }, 3600);

    setTimeout(() => {
      setRenderProgress(100);
      setRenderStage('AI Dance Video Ready! Viral motion transfer complete.');
      setIsRenderingDance(false);
      setDanceRenderComplete(true);
    }, 4800);
  };

  // Compile prompt for current fill-in-the-blank selection
  const currentFillTemplate = FILL_IN_THE_BLANK_TEMPLATES.find((t) => t.id === selectedFillTemplateId) || FILL_IN_THE_BLANK_TEMPLATES[0];
  let compiledPrompt = currentFillTemplate.rawTemplate;
  currentFillTemplate.variables.forEach((v) => {
    compiledPrompt = compiledPrompt.replace(`{${v.key}}`, promptValues[v.key] || v.placeholder);
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto text-slate-100">
      <div className="relative w-full max-w-5xl max-h-[92vh] bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden my-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-gradient-to-r from-slate-950 via-purple-950/40 to-slate-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 via-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/25">
              <Flame className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold tracking-tight text-white">AI Dance Video Maker &amp; Studio</h2>
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30">
                  DWPose + AnimateAnyone
                </span>
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Side-by-Side Duet
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Turn photos and memes into viral dancing sensations with pose-guided motion transfer.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-950/60 px-6 gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('dance_maker')}
            className={`py-3 px-4 text-xs sm:text-sm font-semibold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'dance_maker'
                ? 'border-pink-500 text-pink-400 bg-pink-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Music className="w-4 h-4" />
            AI Dance &amp; Motion Transfer
          </button>

          <button
            onClick={() => setActiveTab('fill_in_prompts')}
            className={`py-3 px-4 text-xs sm:text-sm font-semibold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'fill_in_prompts'
                ? 'border-amber-500 text-amber-400 bg-amber-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            Fill-in-the-Blank Prompts
          </button>

          <button
            onClick={() => setActiveTab('model_matrix')}
            className={`py-3 px-4 text-xs sm:text-sm font-semibold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'model_matrix'
                ? 'border-cyan-500 text-cyan-400 bg-cyan-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            Model Selection &amp; Cost Matrix
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* TAB 1: AI DANCE MAKER */}
          {activeTab === 'dance_maker' && (
            <div className="space-y-6">
              
              {/* Step 1 & 2 Selector Bar */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                
                {/* Left: Interactive Viewport (Duet / Side-by-Side or Solo) */}
                <div className="md:col-span-7 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                        Real-Time Viewport
                      </span>
                      <button
                        type="button"
                        onClick={() => setIsDuetMode(!isDuetMode)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border ${
                          isDuetMode
                            ? 'bg-pink-600/30 border-pink-500 text-pink-300'
                            : 'bg-slate-800 border-slate-700 text-slate-400'
                        }`}
                      >
                        <Split className="w-3.5 h-3.5" />
                        <span>Viral Duet Mode (Side-by-Side)</span>
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsPlayingPreview(!isPlayingPreview)}
                      className="text-xs font-bold text-slate-300 hover:text-white flex items-center gap-1"
                    >
                      {isPlayingPreview ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
                      <span>{isPlayingPreview ? 'Pause' : 'Play'}</span>
                    </button>
                  </div>

                  {/* Canvas Viewport (Split or Solo) */}
                  <div className="relative rounded-2xl overflow-hidden bg-black border border-slate-800 shadow-2xl aspect-[16/10] grid grid-cols-1 md:grid-cols-2">
                    
                    {/* Left Panel: DWPose Skeleton Tracking on Source Dance */}
                    <div className="relative border-r border-slate-800 flex items-center justify-center bg-slate-950">
                      <canvas
                        ref={skeletonCanvasRef}
                        width={360}
                        height={400}
                        className="w-full h-full object-contain"
                      />
                      <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/75 border border-purple-500/40 text-[10px] font-mono text-purple-300">
                        SRC: {selectedDance.name}
                      </div>
                    </div>

                    {/* Right Panel: Character Target Render (Moore-AnimateAnyone) */}
                    <div className="relative flex items-center justify-center bg-slate-900 overflow-hidden">
                      <img
                        src={characterImage}
                        alt="Target Character"
                        className={`w-full h-full object-cover transition-all duration-300 ${
                          danceRenderComplete ? 'filter-none' : 'opacity-85 filter contrast-125'
                        }`}
                      />

                      {/* Animated overlay motion indicator */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-3">
                        <div className="flex items-center justify-between text-[11px] font-mono">
                          <span className="text-pink-300 font-bold">
                            {danceRenderComplete ? '✓ Motion Transferred' : 'Target Photo / Meme'}
                          </span>
                          <span className="text-slate-400">ControlNet 1.8</span>
                        </div>
                      </div>

                      <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/75 border border-pink-500/40 text-[10px] font-mono text-pink-300">
                        AnimateAnyone
                      </div>
                    </div>

                  </div>

                  {/* Render progress bar if active */}
                  {isRenderingDance && (
                    <div className="p-3 bg-slate-950 border border-pink-500/40 rounded-xl space-y-1.5 animate-fade-in">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-pink-300 font-semibold">{renderStage}</span>
                        <span className="text-pink-400 font-mono font-bold">{renderProgress}%</span>
                      </div>
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 h-full transition-all duration-300"
                          style={{ width: `${renderProgress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {danceRenderComplete && (
                    <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-xl flex items-center justify-between text-xs text-emerald-300">
                      <span className="flex items-center gap-1.5 font-bold">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        AI Dance Duet Render Complete! Ready to export for TikTok / Reels.
                      </span>
                      <button
                        onClick={() => {
                          onApplyPromptToStudio?.(
                            `Photo-to-video motion transfer of character performing ${selectedDance.name}, DWPose ControlNet 1.8, 4K 60fps cinematic lighting`
                          );
                          onClose();
                        }}
                        className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 font-bold text-white text-[11px]"
                      >
                        Send to LEO Studio
                      </button>
                    </div>
                  )}
                </div>

                {/* Right: Controls & Dance Catalog */}
                <div className="md:col-span-5 space-y-4">
                  
                  {/* Select Viral Move */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                      1. Select Viral Dance Move
                    </label>
                    <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                      {VIRAL_DANCE_TEMPLATES.map((dance) => {
                        const isSel = selectedDance.id === dance.id;
                        return (
                          <button
                            key={dance.id}
                            type="button"
                            onClick={() => setSelectedDance(dance)}
                            className={`w-full p-2.5 rounded-xl border text-left transition-all flex items-center gap-3 ${
                              isSel
                                ? 'bg-pink-950/40 border-pink-500 ring-1 ring-pink-500/30'
                                : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                            }`}
                          >
                            <img
                              src={dance.previewThumbnail}
                              alt={dance.name}
                              className="w-12 h-12 rounded-lg object-cover shrink-0 border border-slate-800"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <h5 className="text-xs font-bold text-white truncate">{dance.name}</h5>
                                <span className="text-[10px] font-mono text-pink-400">{dance.bpm} BPM</span>
                              </div>
                              <p className="text-[10px] text-slate-400 line-clamp-1">{dance.description}</p>
                              <div className="flex items-center gap-2 mt-1 text-[9px] text-slate-500">
                                <span>{dance.category}</span>
                                <span>•</span>
                                <span>{dance.durationSec}s Loop</span>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Character Photo Source */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                        2. Target Character Photo
                      </label>
                      <label className="cursor-pointer text-[10px] font-bold text-pink-400 hover:text-pink-300 flex items-center gap-1">
                        <Upload className="w-3 h-3" />
                        <span>Upload Custom Photo</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const r = new FileReader();
                              r.onload = (ev) => {
                                if (ev.target?.result) setCharacterImage(ev.target.result as string);
                              };
                              r.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-3">
                      <img
                        src={characterImage}
                        alt="Current Target"
                        className="w-12 h-12 rounded-lg object-cover border border-slate-700"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-white truncate">Active Character / Meme</div>
                        <div className="text-[10px] text-slate-400">
                          Skeletal pose will be painted onto this subject
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Pose Guidance Strength Slider */}
                  <div className="space-y-1.5 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                    <div className="flex items-center justify-between text-slate-400">
                      <span>Pose Guidance Scale (ControlNet):</span>
                      <span className="font-mono text-pink-400 font-bold">{poseGuidanceScale}</span>
                    </div>
                    <input
                      type="range"
                      min="1.0"
                      max="3.0"
                      step="0.1"
                      value={poseGuidanceScale}
                      onChange={(e) => setPoseGuidanceScale(parseFloat(e.target.value))}
                      className="w-full accent-pink-500 h-1.5"
                    />
                    <div className="flex justify-between text-[9px] text-slate-500">
                      <span>Soft Flow</span>
                      <span>Strict Keyframe Anchor</span>
                    </div>
                  </div>

                  {/* Action Render Button */}
                  <button
                    onClick={handleStartDanceRender}
                    disabled={isRenderingDance}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 hover:from-pink-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-purple-500/25 transition-all disabled:opacity-50"
                  >
                    <Zap className="w-4 h-4 text-amber-300" />
                    <span>Generate AI Dance Motion Transfer</span>
                  </button>

                </div>

              </div>
            </div>
          )}

          {/* TAB 2: FILL-IN-THE-BLANK PROMPTS */}
          {activeTab === 'fill_in_prompts' && (
            <div className="space-y-6">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  Fill-in-the-Blank Cinematic Prompt Builder
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Eliminate blank-page syndrome with structured viral formulas. Click any bracketed variable to customize.
                </p>
              </div>

              {/* Template Selector Pills */}
              <div className="flex flex-wrap gap-2">
                {FILL_IN_THE_BLANK_TEMPLATES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setSelectedFillTemplateId(t.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                      selectedFillTemplateId === t.id
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {t.name}
                  </button>
                ))}
              </div>

              {/* Interactive Variables Form */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-950/70 p-4 rounded-xl border border-slate-800">
                {currentFillTemplate.variables.map((v) => (
                  <div key={v.key} className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-300 flex items-center justify-between">
                      <span>{v.label} [{v.key}]</span>
                    </label>
                    <input
                      type="text"
                      value={promptValues[v.key] || ''}
                      onChange={(e) =>
                        setPromptValues({ ...promptValues, [v.key]: e.target.value })
                      }
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                    <div className="flex flex-wrap gap-1 mt-1">
                      {v.options.map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => setPromptValues({ ...promptValues, [v.key]: opt })}
                          className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Live Compiled Prompt Preview */}
              <div className="bg-slate-950 p-4 rounded-xl border border-amber-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                    Compiled Cinematic Prompt
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(compiledPrompt);
                      setCopiedPrompt(true);
                      setTimeout(() => setCopiedPrompt(false), 2000);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition-colors border border-slate-700"
                  >
                    {copiedPrompt ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedPrompt ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>

                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 text-xs text-slate-200 font-mono leading-relaxed">
                  {compiledPrompt}
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => {
                      onApplyPromptToStudio?.(compiledPrompt);
                      onClose();
                    }}
                    className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 font-bold text-xs text-slate-950 shadow-lg shadow-amber-500/20 transition-all flex items-center gap-1.5"
                  >
                    <span>Send Directly to LEO Video Studio</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: MODEL SELECTION & COST MATRIX */}
          {activeTab === 'model_matrix' && (
            <div className="space-y-6">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-cyan-400" />
                  API Route vs. Open-Source Self-Hosted Engine Architecture
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Full cost-per-video, hardware requirements, and realism tradeoffs for scaling AI Video Studios.
                </p>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-900/90 text-slate-300 font-semibold">
                      <th className="py-3 px-4">Engine / Model</th>
                      <th className="py-3 px-4">Architecture</th>
                      <th className="py-3 px-4">Cost (5s clip)</th>
                      <th className="py-3 px-4">Realism</th>
                      <th className="py-3 px-4">Motion Score</th>
                      <th className="py-3 px-4">Hardware Stack</th>
                      <th className="py-3 px-4">License</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {MODEL_SELECTION_CATALOG.map((m) => (
                      <tr key={m.modelName} className="hover:bg-slate-900/50">
                        <td className="py-3 px-4 font-bold text-white">
                          <div>{m.modelName}</div>
                          <div className="text-[10px] text-slate-400 font-normal">{m.bestFor}</div>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              m.type === 'API Route'
                                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                                : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                            }`}
                          >
                            {m.type}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-amber-300">
                          ${m.costPer5sVideoUsd.toFixed(2)}
                        </td>
                        <td className="py-3 px-4 font-mono text-emerald-400 font-bold">
                          {m.realismScore} / 100
                        </td>
                        <td className="py-3 px-4 font-mono text-purple-400 font-bold">
                          {m.motionQualityScore} / 100
                        </td>
                        <td className="py-3 px-4 text-slate-300 text-[11px]">
                          {m.computeRequirements}
                        </td>
                        <td className="py-3 px-4 text-slate-400 text-[11px]">
                          {m.commercialLicense}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Architectural Recommendation Card */}
              <div className="bg-gradient-to-r from-indigo-950/40 via-slate-900 to-purple-950/30 p-4 rounded-xl border border-indigo-500/30 text-xs space-y-2">
                <h4 className="font-bold text-white flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Recommended Hybrid Architecture
                </h4>
                <p className="text-slate-300 leading-relaxed">
                  For MVP launch, route <strong>Dance Video Maker</strong> tasks to self-hosted <em>Moore-AnimateAnyone</em> on Modal/RunPod serverless GPUs (~$0.03/video), and general cinematic 8K generation to <strong>LEO 8K Cascaded DiT</strong> with Luma/Runway APIs as instant fallback endpoints.
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-slate-800 bg-slate-950 text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            <Flame className="w-4 h-4 text-pink-400" />
            <span>LEO Dance Studio • Motion Transfer &amp; DWPose Guidance</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-medium transition-colors"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
