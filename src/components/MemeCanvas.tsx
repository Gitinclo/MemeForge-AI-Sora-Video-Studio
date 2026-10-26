import React, { useRef, useEffect, useState, useCallback } from 'react';
import { TextLayer, MemeSticker, CanvasFilter } from '../types/meme';
import { isSupportedImageFile, formatDroppedFileName } from '../utils/dragDropUtils';
import {
  UploadCloud,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Image as ImageIcon,
  Loader2,
} from 'lucide-react';

interface MemeCanvasProps {
  imageSrc: string;
  textLayers: TextLayer[];
  stickers: MemeSticker[];
  filter: CanvasFilter;
  aspectRatio: string;
  selectedLayerId: string | null;
  onSelectLayer: (id: string | null) => void;
  onUpdateLayerPosition: (id: string, x: number, y: number) => void;
  onUpdateStickerPosition?: (id: string, x: number, y: number) => void;
  onDropImageAsTemplate?: (dataUrl: string, fileName: string, file: File) => void;
  canvasRefOut?: React.RefObject<HTMLCanvasElement | null>;
  isPlayingAudio?: boolean;
  activeAudioName?: string;
}

export const MemeCanvas: React.FC<MemeCanvasProps> = ({
  imageSrc,
  textLayers,
  stickers,
  filter,
  aspectRatio,
  selectedLayerId,
  onSelectLayer,
  onUpdateLayerPosition,
  onDropImageAsTemplate,
  canvasRefOut,
  isPlayingAudio = false,
  activeAudioName,
}) => {
  const localCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvasRef = canvasRefOut || localCanvasRef;
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [imageObj, setImageObj] = useState<HTMLImageElement | null>(null);

  // Drag-and-drop state for desktop file uploads
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [dragEnterCount, setDragEnterCount] = useState(0);
  const [dragError, setDragError] = useState<string | null>(null);
  const [isProcessingDrop, setIsProcessingDrop] = useState(false);
  const [dropSuccessToast, setDropSuccessToast] = useState<string | null>(null);

  // Load image when imageSrc changes
  useEffect(() => {
    if (!imageSrc) return;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      setImageObj(img);
    };
    img.src = imageSrc;
  }, [imageSrc]);

  // Determine virtual canvas size based on aspect ratio
  const getCanvasDimensions = useCallback(() => {
    const baseWidth = 800;
    switch (aspectRatio) {
      case '16:9':
        return { width: 960, height: 540 };
      case '9:16':
        return { width: 540, height: 960 };
      case '4:3':
        return { width: 800, height: 600 };
      case '3:4':
        return { width: 600, height: 800 };
      case '1:1':
      default:
        return { width: baseWidth, height: baseWidth };
    }
  }, [aspectRatio]);

  // Word-wrap helper
  const wrapText = (
    ctx: CanvasRenderingContext2D,
    text: string,
    maxWidth: number
  ): string[] => {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = words[0] || '';

    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      const width = ctx.measureText(currentLine + ' ' + word).width;
      if (width < maxWidth) {
        currentLine += ' ' + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    if (currentLine) {
      lines.push(currentLine);
    }
    return lines;
  };

  // Render canvas (with option to exclude selection boundary box for pristine export)
  const drawMeme = useCallback(
    (includeSelectionOutline = true) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const { width, height } = getCanvasDimensions();
      canvas.width = width;
      canvas.height = height;

      // Reset transform
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, width, height);

      // 1. Draw Image Background with filter
      ctx.save();
      if (filter === 'grayscale') {
        ctx.filter = 'grayscale(100%) contrast(110%)';
      } else if (filter === 'deep_fried') {
        ctx.filter = 'contrast(240%) saturate(300%) brightness(110%)';
      } else if (filter === 'vintage') {
        ctx.filter = 'sepia(50%) contrast(120%) brightness(95%)';
      } else if (filter === 'high_contrast') {
        ctx.filter = 'contrast(170%) brightness(105%)';
      } else if (filter === 'cyberpunk') {
        ctx.filter = 'hue-rotate(280deg) saturate(180%) contrast(130%)';
      } else if (filter === 'warm') {
        ctx.filter = 'sepia(25%) saturate(140%) brightness(105%)';
      } else {
        ctx.filter = 'none';
      }

      if (imageObj) {
        // Draw image to cover canvas nicely
        const imgAspect = imageObj.width / imageObj.height;
        const canvasAspect = width / height;
        let drawW = width;
        let drawH = height;
        let drawX = 0;
        let drawY = 0;

        if (imgAspect > canvasAspect) {
          drawH = height;
          drawW = height * imgAspect;
          drawX = (width - drawW) / 2;
        } else {
          drawW = width;
          drawH = width / imgAspect;
          drawY = (height - drawH) / 2;
        }
        ctx.drawImage(imageObj, drawX, drawY, drawW, drawH);
      } else {
        const grad = ctx.createLinearGradient(0, 0, width, height);
        grad.addColorStop(0, '#1e293b');
        grad.addColorStop(1, '#0f172a');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);
      }
      ctx.restore();

      // 2. Draw Stickers
      stickers.forEach((sticker) => {
        const posX = (sticker.x / 100) * width;
        const posY = (sticker.y / 100) * height;
        ctx.save();
        ctx.translate(posX, posY);
        ctx.rotate((sticker.rotation * Math.PI) / 180);
        const fontSize = 54 * (sticker.scale || 1);
        ctx.font = `${fontSize}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(sticker.emoji, 0, 0);
        ctx.restore();
      });

      // 3. Draw Text Layers
      textLayers.forEach((layer) => {
        const textToRender = layer.isUppercase
          ? layer.text.toUpperCase()
          : layer.text;
        if (!textToRender.trim()) return;

        const posX = (layer.x / 100) * width;
        const posY = (layer.y / 100) * height;

        ctx.save();
        ctx.translate(posX, posY);
        if (layer.rotation) {
          ctx.rotate((layer.rotation * Math.PI) / 180);
        }

        const fontStyle = layer.isBold ? 'bold' : 'normal';
        ctx.font = `${fontStyle} ${layer.fontSize}px ${layer.fontFamily}, Impact, sans-serif`;
        ctx.textAlign = layer.textAlign;
        ctx.textBaseline = 'middle';

        const maxTextWidth = width * 0.92;
        const lines = wrapText(ctx, textToRender, maxTextWidth);
        const lineHeight = layer.fontSize * 1.18;
        const totalTextHeight = lines.length * lineHeight;
        const startY = -((lines.length - 1) * lineHeight) / 2;

        // Draw background highlight box if enabled
        if (layer.backgroundColor && layer.backgroundColor !== 'transparent') {
          const paddingX = layer.fontSize * 0.35;
          const paddingY = layer.fontSize * 0.2;
          let widestLine = 0;
          lines.forEach((l) => {
            const w = ctx.measureText(l).width;
            if (w > widestLine) widestLine = w;
          });

          let boxX = -widestLine / 2 - paddingX;
          if (layer.textAlign === 'left') boxX = -paddingX;
          if (layer.textAlign === 'right') boxX = -widestLine - paddingX;

          ctx.fillStyle = layer.backgroundColor;
          ctx.beginPath();
          ctx.roundRect(
            boxX,
            startY - lineHeight / 2 - paddingY,
            widestLine + paddingX * 2,
            totalTextHeight + paddingY * 2,
            8
          );
          ctx.fill();
        }

        // Draw each line with stroke + fill
        lines.forEach((line, idx) => {
          const lineY = startY + idx * lineHeight;

          if (layer.shadow) {
            ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
            ctx.shadowBlur = 12;
            ctx.shadowOffsetX = 3;
            ctx.shadowOffsetY = 3;
          } else {
            ctx.shadowColor = 'transparent';
          }

          if (layer.outlineWidth > 0 && layer.outlineColor !== 'transparent') {
            ctx.strokeStyle = layer.outlineColor;
            ctx.lineWidth = layer.outlineWidth * 2;
            ctx.lineJoin = 'miter';
            ctx.miterLimit = 2;
            ctx.strokeText(line, 0, lineY);
          }

          ctx.fillStyle = layer.textColor;
          ctx.fillText(line, 0, lineY);
        });

        // BUG FIX: Only draw dashed selection box during interactive editing, NOT during export/render
        if (includeSelectionOutline && layer.id === selectedLayerId) {
          ctx.shadowColor = 'transparent';
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 2;
          ctx.setLineDash([6, 6]);

          let maxW = 0;
          lines.forEach((l) => {
            const w = ctx.measureText(l).width;
            if (w > maxW) maxW = w;
          });
          const boxPad = 8;
          let selectX = -maxW / 2 - boxPad;
          if (layer.textAlign === 'left') selectX = -boxPad;
          if (layer.textAlign === 'right') selectX = -maxW - boxPad;

          ctx.strokeRect(
            selectX,
            startY - lineHeight / 2 - boxPad,
            maxW + boxPad * 2,
            totalTextHeight + boxPad * 2
          );
        }

        ctx.restore();
      });
    },
    [canvasRef, imageObj, textLayers, stickers, filter, aspectRatio, selectedLayerId, getCanvasDimensions]
  );

  useEffect(() => {
    drawMeme(true);
  }, [drawMeme]);

  // Expose clean export drawing function on the canvas element for pristine downloads
  useEffect(() => {
    const canvas = canvasRef.current as any;
    if (canvas) {
      canvas.drawCleanForExport = () => drawMeme(false);
      canvas.restoreInteractiveSelection = () => drawMeme(true);
    }
  }, [drawMeme, canvasRef]);

  // BUG FIX: Accurate hit testing & Window-attached pointer events for drag reliability
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const clickX = (e.clientX - rect.left) * scaleX;
    const clickY = (e.clientY - rect.top) * scaleY;

    let hitId: string | null = null;
    let hitOffset = { x: 0, y: 0 };

    // Test in reverse order (topmost layer first)
    for (let i = textLayers.length - 1; i >= 0; i--) {
      const layer = textLayers[i];
      const posX = (layer.x / 100) * canvas.width;
      const posY = (layer.y / 100) * canvas.height;
      const heightReach = layer.fontSize * 1.5;
      const widthReach = canvas.width * 0.45;

      // Check alignment bounding box
      let minX = posX - widthReach;
      let maxX = posX + widthReach;
      if (layer.textAlign === 'left') {
        minX = posX - 20;
        maxX = posX + widthReach * 2;
      } else if (layer.textAlign === 'right') {
        minX = posX - widthReach * 2;
        maxX = posX + 20;
      }

      if (
        clickX >= minX &&
        clickX <= maxX &&
        Math.abs(clickY - posY) <= heightReach
      ) {
        hitId = layer.id;
        hitOffset = {
          x: clickX - posX,
          y: clickY - posY,
        };
        break;
      }
    }

    if (hitId) {
      onSelectLayer(hitId);

      // Window-level listeners prevent text jumping or losing drag when mouse moves fast
      const onMove = (moveEv: PointerEvent) => {
        if (!canvas) return;
        const currentRect = canvas.getBoundingClientRect();
        const curScaleX = canvas.width / currentRect.width;
        const curScaleY = canvas.height / currentRect.height;
        const curMouseX = (moveEv.clientX - currentRect.left) * curScaleX;
        const curMouseY = (moveEv.clientY - currentRect.top) * curScaleY;

        const newPixelX = curMouseX - hitOffset.x;
        const newPixelY = curMouseY - hitOffset.y;

        const newPercentX = Math.max(5, Math.min(95, (newPixelX / canvas.width) * 100));
        const newPercentY = Math.max(5, Math.min(95, (newPixelY / canvas.height) * 100));

        onUpdateLayerPosition(hitId!, Math.round(newPercentX), Math.round(newPercentY));
      };

      const onUp = () => {
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('pointerup', onUp);
      };

      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', onUp);
    } else {
      onSelectLayer(null);
    }
  };

  // Drag-and-drop file processing from user's desktop
  const processDroppedFile = useCallback(
    (file: File) => {
      if (!isSupportedImageFile(file)) {
        setDragError(`"${file.name}" is not a supported image. Please drop a PNG, JPG, WebP, GIF, or SVG.`);
        setTimeout(() => setDragError(null), 4500);
        return;
      }

      setIsProcessingDrop(true);
      setDragError(null);

      const reader = new FileReader();
      reader.onload = (loadEv) => {
        const dataUrl = loadEv.target?.result as string;
        if (dataUrl && onDropImageAsTemplate) {
          onDropImageAsTemplate(dataUrl, file.name, file);
          const cleanTitle = formatDroppedFileName(file.name);
          setDropSuccessToast(`Loaded "${cleanTitle}" as new template layer!`);
          setTimeout(() => setDropSuccessToast(null), 3500);
        }
        setIsProcessingDrop(false);
      };

      reader.onerror = () => {
        setDragError('Failed to read desktop image file. Please try another image.');
        setIsProcessingDrop(false);
        setTimeout(() => setDragError(null), 4500);
      };

      reader.readAsDataURL(file);
    },
    [onDropImageAsTemplate]
  );

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragEnterCount((prev) => prev + 1);
    if (e.dataTransfer?.items && e.dataTransfer.items.length > 0) {
      setIsDraggingOver(true);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = 'copy';
    }
    if (!isDraggingOver) {
      setIsDraggingOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragEnterCount((prev) => {
      const next = prev - 1;
      if (next <= 0) {
        setIsDraggingOver(false);
        return 0;
      }
      return next;
    });
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
    setDragEnterCount(0);

    const files = e.dataTransfer?.files;
    if (files && files.length > 0) {
      processDroppedFile(files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processDroppedFile(files[0]);
    }
    e.target.value = '';
  };

  return (
    <div
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`relative w-full flex items-center justify-center p-2 sm:p-4 bg-slate-950/70 rounded-2xl border transition-all duration-300 shadow-2xl backdrop-blur-xl overflow-hidden group ${
        isDraggingOver
          ? 'border-amber-400 ring-4 ring-amber-400/30 shadow-amber-400/20 bg-slate-950/90'
          : isPlayingAudio
          ? 'border-amber-500/80 ring-4 ring-amber-500/20 shadow-amber-500/20'
          : 'border-slate-800/80 hover:border-slate-700/80'
      }`}
    >
      {/* Hidden file picker input for clicking to browse desktop files */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,.png,.jpg,.jpeg,.webp,.gif,.svg,.avif"
        onChange={handleFileInputChange}
        className="hidden"
      />

      <div className={`absolute inset-0 transition-opacity duration-300 pointer-events-none ${
        isDraggingOver
          ? 'bg-gradient-to-tr from-amber-500/25 via-purple-500/20 to-cyan-500/20 opacity-100'
          : isPlayingAudio
          ? 'bg-gradient-to-tr from-amber-500/20 via-purple-500/20 to-indigo-500/20 opacity-100'
          : 'bg-gradient-to-tr from-amber-500/5 via-indigo-500/5 to-purple-500/10 opacity-60'
      }`} />

      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        className={`max-h-[550px] w-auto max-w-full rounded-xl shadow-2xl cursor-grab active:cursor-grabbing border border-slate-700/60 object-contain touch-none transition-transform duration-200 ${
          isPlayingAudio ? 'scale-[1.01] shadow-amber-500/30' : ''
        }`}
      />

      {/* FULL DRAG-AND-DROP ACTIVE OVERLAY */}
      {isDraggingOver && (
        <div className="absolute inset-2 sm:inset-3 z-30 flex flex-col items-center justify-center p-6 bg-slate-950/90 backdrop-blur-md rounded-xl border-2 border-dashed border-amber-400 text-center animate-fade-in pointer-events-none">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/20 to-purple-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center shadow-xl shadow-amber-500/20 mb-3 animate-bounce">
            <UploadCloud className="w-8 h-8" />
          </div>
          <h4 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
            <span>Drop Desktop Image to Upload as Template</span>
            <Sparkles className="w-4 h-4 text-amber-300" />
          </h4>
          <p className="text-xs text-amber-200/90 mt-1 max-w-md leading-relaxed">
            Release your image file to replace the canvas template and auto-detect dimensions.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-1.5 mt-4 text-[10px] text-slate-300 font-mono">
            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">PNG</span>
            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">JPG</span>
            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">WEBP</span>
            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">GIF</span>
            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">SVG</span>
          </div>
        </div>
      )}

      {/* PROCESSING DROP SPINNER */}
      {isProcessingDrop && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-md rounded-2xl text-center animate-fade-in">
          <Loader2 className="w-10 h-10 text-amber-400 animate-spin mb-2" />
          <p className="text-sm font-bold text-white">Importing Desktop Template...</p>
          <p className="text-xs text-slate-400">Processing image buffer and fitting canvas dimensions</p>
        </div>
      )}

      {/* ERROR BANNER */}
      {dragError && (
        <div className="absolute top-4 inset-x-4 sm:inset-x-auto z-40 max-w-md mx-auto bg-red-950/95 border border-red-500/80 text-red-200 px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 shadow-2xl backdrop-blur-md animate-fade-in">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span className="flex-1">{dragError}</span>
        </div>
      )}

      {/* SUCCESS TOAST */}
      {dropSuccessToast && (
        <div className="absolute top-4 inset-x-4 sm:inset-x-auto z-40 max-w-md mx-auto bg-emerald-950/95 border border-emerald-500/80 text-emerald-200 px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-2xl backdrop-blur-md animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="flex-1">{dropSuccessToast}</span>
        </div>
      )}

      {/* Playing Audio Equalizer Overlay */}
      {isPlayingAudio && (
        <div className="absolute top-4 right-4 bg-slate-950/90 border border-amber-500/60 rounded-xl px-3 py-1.5 shadow-xl flex items-center gap-2 backdrop-blur-md animate-bounce">
          <div className="flex items-end gap-0.5 h-3">
            <span className="w-1 bg-amber-400 rounded-full animate-pulse h-full" />
            <span className="w-1 bg-amber-300 rounded-full animate-pulse h-2" style={{ animationDelay: '150ms' }} />
            <span className="w-1 bg-amber-500 rounded-full animate-pulse h-3.5" style={{ animationDelay: '300ms' }} />
          </div>
          <span className="text-[11px] font-black text-amber-300 tracking-wide flex items-center gap-1">
            <span>Playing:</span>
            <span className="text-white truncate max-w-[120px]">{activeAudioName || 'Meme SFX'}</span>
          </span>
        </div>
      )}

      {/* Bottom Canvas Hints & Desktop Drop Prompt */}
      <div className="absolute bottom-3 inset-x-4 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        <div className="text-[11px] font-medium text-slate-400 bg-slate-900/85 px-2.5 py-1 rounded-full border border-slate-700/50 backdrop-blur-md opacity-80 group-hover:opacity-100 transition-opacity flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Click &amp; drag text to reposition
        </div>

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="pointer-events-auto text-[11px] font-bold text-amber-300/90 hover:text-white bg-slate-900/85 hover:bg-slate-800/90 px-2.5 py-1 rounded-full border border-amber-500/30 hover:border-amber-500/60 backdrop-blur-md transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
          title="Drag and drop an image from your desktop, or click to browse files"
        >
          <UploadCloud className="w-3.5 h-3.5 text-amber-400" />
          <span>Drag desktop image here</span>
          <span className="text-slate-500">or browse</span>
        </button>
      </div>
    </div>
  );
};
