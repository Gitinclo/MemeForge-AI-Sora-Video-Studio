export const MAX_VIDEO_DURATION_HOURS = 100;
export const MIN_VIDEO_DURATION_HOURS = 1 / 3600; // 1 second

export interface DurationPreset {
  id: string;
  label: string;
  hours: number;
  description: string;
  badge?: string;
}

export const DURATION_PRESETS: DurationPreset[] = [
  {
    id: '15s',
    label: '15s',
    hours: 15 / 3600,
    description: 'Shorts & TikTok Reel',
  },
  {
    id: '1m',
    label: '1 min',
    hours: 1 / 60,
    description: 'Standard Scene Clip',
  },
  {
    id: '10m',
    label: '10 min',
    hours: 10 / 60,
    description: 'Extended Cinematic Short',
  },
  {
    id: '1h',
    label: '1 Hour',
    hours: 1,
    description: 'Longform Narrative Feature',
  },
  {
    id: '10h',
    label: '10 Hours',
    hours: 10,
    description: 'Lofi Ambient / Study Loop',
  },
  {
    id: '24h',
    label: '24 Hours',
    hours: 24,
    description: 'Full Day Real-Time Cycle',
  },
  {
    id: '50h',
    label: '50 Hours',
    hours: 50,
    description: 'Ultra Deep Simulation Stream',
  },
  {
    id: '100h',
    label: '100 Hours',
    hours: 100,
    description: 'Maximum AI Marathon Stream',
    badge: 'MAX ULTRA',
  },
];

/**
 * Clamps duration within [MIN_VIDEO_DURATION_HOURS, MAX_VIDEO_DURATION_HOURS] (1s to 100 hours max)
 */
export function clampVideoDuration(hours: number): number {
  if (isNaN(hours) || hours <= 0) return MIN_VIDEO_DURATION_HOURS;
  if (hours > MAX_VIDEO_DURATION_HOURS) return MAX_VIDEO_DURATION_HOURS;
  return hours;
}

/**
 * Formats seconds into HH:MM:SS.s or HHH:MM:SS.s for long durations up to 100+ hours
 */
export function formatTimecode(seconds: number): string {
  const totalSec = Math.max(0, seconds);
  const hrs = Math.floor(totalSec / 3600);
  const mins = Math.floor((totalSec % 3600) / 60);
  const secs = Math.floor(totalSec % 60);
  const tenths = Math.floor((totalSec % 1) * 10);

  const hh = String(hrs).padStart(2, '0');
  const mm = String(mins).padStart(2, '0');
  const ss = String(secs).padStart(2, '0');

  return `${hh}:${mm}:${ss}.${tenths}`;
}

/**
 * Formats a duration in hours into user-friendly descriptive text
 */
export function formatDurationLabel(hours: number): string {
  const clamped = clampVideoDuration(hours);
  if (clamped >= 100) {
    return '100 Hours (Max Limit)';
  }
  if (clamped >= 1) {
    if (Number.isInteger(clamped)) {
      return `${clamped} Hours`;
    }
    const h = Math.floor(clamped);
    const m = Math.round((clamped - h) * 60);
    return m > 0 ? `${h}h ${m}m` : `${h} Hours`;
  }

  const totalMinutes = clamped * 60;
  if (totalMinutes >= 1) {
    if (Number.isInteger(totalMinutes)) {
      return `${totalMinutes} min`;
    }
    const m = Math.floor(totalMinutes);
    const s = Math.round((totalMinutes - m) * 60);
    return s > 0 ? `${m}m ${s}s` : `${m} min`;
  }

  const totalSeconds = Math.round(clamped * 3600);
  return `${totalSeconds} sec`;
}

/**
 * Calculates compute and cluster distribution metrics for a given duration & frame rate
 */
export function calculateVideoComputeMetrics(hours: number, frameRate: number = 60, resolution: string = '4K Ultra') {
  const validHours = clampVideoDuration(hours);
  const totalSeconds = validHours * 3600;
  const totalFrames = Math.round(totalSeconds * frameRate);

  // 4 distributed clusters
  const clusterCount = 4;
  const hoursPerCluster = validHours / clusterCount;
  const framesPerCluster = Math.round(totalFrames / clusterCount);

  // Approximate storage estimate based on resolution (GB per hour of compressed video)
  const gbPerHourMap: Record<string, number> = {
    '720p HD': 1.5,
    '1080p FHD': 3.5,
    '4K Ultra': 8.0,
  };
  const gbPerHour = gbPerHourMap[resolution] || 5.0;
  const estimatedStorageGb = Math.round(validHours * gbPerHour * 10) / 10;

  return {
    validHours,
    totalSeconds,
    totalFrames,
    clusterCount,
    hoursPerCluster: Math.round(hoursPerCluster * 10) / 10,
    framesPerCluster,
    estimatedStorageGb,
    isMaxDuration: validHours >= MAX_VIDEO_DURATION_HOURS,
  };
}
