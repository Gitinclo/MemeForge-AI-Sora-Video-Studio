/**
 * Drag and Drop Utilities for MemeCanvas Desktop File Uploads
 */
import { MemeTemplate } from '../types/meme';

export const SUPPORTED_IMAGE_MIME_TYPES = [
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp',
  'image/gif',
  'image/svg+xml',
  'image/bmp',
  'image/avif',
];

export const SUPPORTED_EXTENSIONS = [
  '.png',
  '.jpg',
  '.jpeg',
  '.webp',
  '.gif',
  '.svg',
  '.bmp',
  '.avif',
];

/**
 * Checks if a dropped file is a supported image file based on MIME type and extension
 */
export function isSupportedImageFile(file: { type?: string; name?: string }): boolean {
  if (file.type && file.type.startsWith('image/')) {
    return true;
  }
  if (file.type && SUPPORTED_IMAGE_MIME_TYPES.includes(file.type.toLowerCase())) {
    return true;
  }
  if (file.name) {
    const lowerName = file.name.toLowerCase();
    return SUPPORTED_EXTENSIONS.some((ext) => lowerName.endsWith(ext));
  }
  return false;
}

/**
 * Calculates the best matching aspect ratio preset based on image dimensions
 */
export function detectImageAspectRatio(
  width: number,
  height: number
): '16:9' | '9:16' | '4:3' | '3:4' | '1:1' {
  if (!width || !height || width <= 0 || height <= 0) return '1:1';
  const ratio = width / height;

  if (ratio >= 1.55) return '16:9'; // e.g. 16:9 = 1.77
  if (ratio <= 0.65) return '9:16'; // e.g. 9:16 = 0.5625
  if (ratio >= 1.2) return '4:3'; // e.g. 4:3 = 1.333
  if (ratio <= 0.85) return '3:4'; // e.g. 3:4 = 0.75
  return '1:1';
}

/**
 * Formats a raw file name into a clean template title
 * e.g., 'drake_happy-face.png' -> 'Drake Happy Face'
 */
export function formatDroppedFileName(fileName: string): string {
  if (!fileName) return 'Custom Desktop Template';
  // Strip extension
  const withoutExt = fileName.replace(/\.[^/.]+$/, '');
  // Replace underscores, hyphens, and multiple dots with spaces
  const clean = withoutExt.replace(/[-_.]+/g, ' ').trim();
  if (!clean) return 'Custom Desktop Template';
  // Capitalize words
  return clean
    .split(' ')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Asynchronously loads a File or Blob as a Data URL
 */
export function readFileAsDataUrl(file: File | Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        resolve(result);
      } else {
        reject(new Error('Empty result from FileReader'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file as Data URL'));
    reader.readAsDataURL(file);
  });
}

/**
 * Creates a structured custom MemeTemplate from a dropped file
 */
export function createCustomTemplateFromDrop(
  fileName: string,
  dataUrl: string,
  aspectRatio: '16:9' | '9:16' | '4:3' | '3:4' | '1:1' = '1:1',
  topText = 'TOP TEXT HERE',
  bottomText = 'BOTTOM TEXT HERE'
): MemeTemplate {
  const title = formatDroppedFileName(fileName);
  return {
    id: `custom_desktop_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    name: title,
    category: 'Community',
    mood: 'Sarcastic',
    tags: ['custom', 'uploaded', 'desktop', 'drag-drop'],
    defaultTopText: topText,
    defaultBottomText: bottomText,
    aspectRatio,
    svgDataUri: dataUrl,
    description: `Direct desktop upload: ${fileName}`,
    isUnlocked: true,
  };
}
