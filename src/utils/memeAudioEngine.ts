export interface MemeAudioEffect {
  id: string;
  name: string;
  category: 'Classic' | 'Reactions' | 'Dramatic' | 'Gaming' | 'Funny';
  emoji: string;
  durationSec: number;
  description: string;
  type: 'builtin' | 'custom';
  tags: string[];
}

export interface MemeAudioConfig {
  selectedEffectId: string | null;
  volume: number; // 0.0 - 1.0
  playbackRate: number; // 0.5 - 2.0
  loop: boolean;
  delaySec: number; // 0.0 - 3.0
  customAudioUrl?: string;
  customAudioName?: string;
}

export const MEME_AUDIO_EFFECTS: MemeAudioEffect[] = [
  {
    id: 'airhorn',
    name: 'MLG Airhorn',
    category: 'Gaming',
    emoji: '📯',
    durationSec: 2.4,
    description: 'Iconic MLG triple airhorn blast for peak hype & triumph',
    type: 'builtin',
    tags: ['hype', 'mlg', 'loud', 'victory', 'airhorn'],
  },
  {
    id: 'sad_violin',
    name: 'Sad Violin',
    category: 'Dramatic',
    emoji: '🎻',
    durationSec: 4.0,
    description: 'Heartbreaking classical violin lament for tragic fails & Ls',
    type: 'builtin',
    tags: ['sad', 'crying', 'fail', 'loss', 'melodramatic'],
  },
  {
    id: 'laugh_track',
    name: 'Sitcom Laugh Track',
    category: 'Funny',
    emoji: '😂',
    durationSec: 3.2,
    description: 'Classic studio audience burst of hearty laughter',
    type: 'builtin',
    tags: ['comedy', 'audience', 'joke', 'laughter', 'funny'],
  },
  {
    id: 'vine_boom',
    name: 'Vine Boom',
    category: 'Dramatic',
    emoji: '💥',
    durationSec: 1.6,
    description: 'Earth-shattering sub-bass punch for shocking meme moments',
    type: 'builtin',
    tags: ['shock', 'impact', 'bass', 'vine', 'sus'],
  },
  {
    id: 'bruh',
    name: 'Bruh Sound Effect',
    category: 'Reactions',
    emoji: '🗿',
    durationSec: 1.4,
    description: 'Deep resonant deadpan "Bruh" vocal drop',
    type: 'builtin',
    tags: ['bruh', 'deadpan', 'disbelief', 'awkward', 'reaction'],
  },
  {
    id: 'titanic_flute',
    name: 'Titanic Recorder (Off-Key)',
    category: 'Funny',
    emoji: '🪈',
    durationSec: 3.8,
    description: 'Hilariously screechy and out-of-tune My Heart Will Go On recorder',
    type: 'builtin',
    tags: ['terrible', 'flute', 'titanic', 'hilarious', 'parody'],
  },
  {
    id: 'emotional_damage',
    name: 'Emotional Damage!',
    category: 'Reactions',
    emoji: '⚡',
    durationSec: 2.0,
    description: 'Dramatic Asian Dad quote impact with gong & punch',
    type: 'builtin',
    tags: ['damage', 'burn', 'roast', 'quote', 'savage'],
  },
  {
    id: 'windows_error',
    name: 'Windows Error Chime',
    category: 'Classic',
    emoji: '🔔',
    durationSec: 1.2,
    description: 'Retro system critical error stop chord from the XP era',
    type: 'builtin',
    tags: ['retro', 'error', 'crash', 'tech', 'xp'],
  },
  {
    id: 'metal_pipe',
    name: 'Metal Pipe Falling',
    category: 'Funny',
    emoji: '🔨',
    durationSec: 2.2,
    description: 'Unnecessarily loud resonant hollow metal pipe hitting the ground',
    type: 'builtin',
    tags: ['clatter', 'echo', 'loud', 'pipe', 'chaotic'],
  },
  {
    id: 'curb_enthusiasm',
    name: 'Curb Your Meme (Frolic)',
    category: 'Classic',
    emoji: '🎷',
    durationSec: 4.2,
    description: 'Bouncy tuba and clarinet staccato intro for instant awkward irony',
    type: 'builtin',
    tags: ['awkward', 'frolic', 'credits', 'irony', 'curb'],
  },
  {
    id: 'gigachad',
    name: 'Giga Chad Phonk Bass',
    category: 'Gaming',
    emoji: '🎶',
    durationSec: 3.5,
    description: 'Heavy distorted 808 cowbell phonk groove for pure sigma energy',
    type: 'builtin',
    tags: ['sigma', 'gigachad', 'phonk', 'bass', 'chad'],
  },
  {
    id: 'dun_dun_dun',
    name: 'Dramatic Dun Dun Dun!',
    category: 'Dramatic',
    emoji: '😱',
    durationSec: 2.5,
    description: 'Three dramatic orchestral brass hits building up suspense',
    type: 'builtin',
    tags: ['suspense', 'gasp', 'mystery', 'reveal', 'shock'],
  },
  {
    id: 'record_scratch',
    name: 'Record Scratch',
    category: 'Classic',
    emoji: '💿',
    durationSec: 1.0,
    description: 'Vinyl DJ stop scratch: "Yep, that is me. You are probably wondering..."',
    type: 'builtin',
    tags: ['scratch', 'freeze', 'stop', 'retro', 'pause'],
  },
  {
    id: 'roblox_oof',
    name: 'Roblox "Oof"',
    category: 'Gaming',
    emoji: '📢',
    durationSec: 0.8,
    description: 'The legendary retro video game character impact sound',
    type: 'builtin',
    tags: ['gaming', 'oof', 'roblox', 'classic', 'death'],
  },
];

// Helper to encode raw PCM float audio channels into standard RIFF WAV format
export function encodeWAV(
  channels: Float32Array[],
  sampleRate: number = 44100
): ArrayBuffer {
  const numChannels = channels.length;
  const numSamples = channels[0].length;
  const bytesPerSample = 2; // 16-bit PCM
  const blockAlign = numChannels * bytesPerSample;
  const byteRate = sampleRate * blockAlign;
  const dataSize = numSamples * blockAlign;
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);

  // RIFF identifier
  writeString(view, 0, 'RIFF');
  // RIFF chunk length: 36 + SubChunk2Size
  view.setUint32(4, 36 + dataSize, true);
  // RIFF type
  writeString(view, 8, 'WAVE');
  // format chunk identifier
  writeString(view, 12, 'fmt ');
  // format chunk length
  view.setUint32(16, 16, true);
  // sample format (1 is PCM)
  view.setUint16(20, 1, true);
  // channel count
  view.setUint16(22, numChannels, true);
  // sample rate
  view.setUint32(24, sampleRate, true);
  // byte rate
  view.setUint32(28, byteRate, true);
  // block align
  view.setUint16(32, blockAlign, true);
  // bits per sample
  view.setUint16(34, 16, true);
  // data chunk identifier
  writeString(view, 36, 'data');
  // data chunk length
  view.setUint32(40, dataSize, true);

  // Write 16-bit PCM interleaved samples
  let offset = 44;
  for (let i = 0; i < numSamples; i++) {
    for (let ch = 0; ch < numChannels; ch++) {
      let sample = channels[ch][i];
      // Hard clipping limiter
      sample = Math.max(-1, Math.min(1, sample));
      // Convert to 16-bit signed integer (-32768 to 32767)
      const int16 = sample < 0 ? sample * 32768 : sample * 32767;
      view.setInt16(offset, Math.floor(int16), true);
      offset += 2;
    }
  }

  return buffer;
}

function writeString(view: DataView, offset: number, string: string): void {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

// Pure synthetic PCM generator for iconic sounds (works in browser & Node.js for tests)
export function generateSyntheticPCM(
  effectId: string,
  sampleRate: number = 44100
): { left: Float32Array; right: Float32Array; duration: number } {
  const effect = MEME_AUDIO_EFFECTS.find((e) => e.id === effectId) || MEME_AUDIO_EFFECTS[0];
  const duration = effect.durationSec;
  const numSamples = Math.floor(sampleRate * duration);
  const left = new Float32Array(numSamples);
  const right = new Float32Array(numSamples);

  const t = (i: number) => i / sampleRate;

  switch (effectId) {
    case 'airhorn': {
      // MLG Airhorn: Triple blast pattern (blasts at 0.0s, 0.35s, 0.7s, sustained blast at 1.05s)
      const blastStarts = [0.0, 0.35, 0.7, 1.05];
      const blastLengths = [0.25, 0.25, 0.25, 1.1];
      // Characteristic chord frequencies: detuned brass saw cluster around 466Hz (Bb4), 587Hz (D5), 700Hz (F5)
      const baseFreqs = [466.16, 470.0, 587.33, 698.46, 932.33];

      for (let i = 0; i < numSamples; i++) {
        const time = t(i);
        let sample = 0;
        for (let b = 0; b < blastStarts.length; b++) {
          const start = blastStarts[b];
          const len = blastLengths[b];
          if (time >= start && time < start + len) {
            const relTime = time - start;
            // Attack / Decay envelope
            const env = Math.min(1, relTime / 0.02) * Math.pow(1 - relTime / len, 0.5);
            // Vibrato & detuned saws
            const lfo = Math.sin(2 * Math.PI * 12 * relTime) * 8;
            for (const f of baseFreqs) {
              const freq = f + lfo;
              // Sawtooth approximation with odd/even harmonics
              sample += (Math.sin(2 * Math.PI * freq * time) +
                         0.6 * Math.sin(2 * Math.PI * 2 * freq * time) +
                         0.3 * Math.sin(2 * Math.PI * 3 * freq * time)) * env * 0.16;
            }
          }
        }
        left[i] = sample;
        right[i] = sample;
      }
      break;
    }

    case 'sad_violin': {
      // Sad violin slow melancholy motif (C minor lament: C5 -> Bb4 -> Ab4 -> G4 with vibrato & bow scratch)
      const notes = [
        { start: 0.0, end: 1.0, freq: 523.25 }, // C5
        { start: 1.0, end: 1.9, freq: 466.16 }, // Bb4
        { start: 1.9, end: 2.8, freq: 415.30 }, // Ab4
        { start: 2.8, end: 3.9, freq: 392.00 }, // G4
      ];

      for (let i = 0; i < numSamples; i++) {
        const time = t(i);
        let sample = 0;
        for (const n of notes) {
          if (time >= n.start && time < n.end) {
            const rel = time - n.start;
            const dur = n.end - n.start;
            // Slow bow attack and gentle release
            const env = Math.sin((Math.PI * rel) / dur) * (1 - 0.15 * Math.sin(2 * Math.PI * 2 * rel));
            // Warm string vibrato starting after initial attack
            const vibratoDepth = Math.min(1, rel / 0.4) * 6;
            const vibrato = Math.sin(2 * Math.PI * 5.5 * rel) * vibratoDepth;
            const f = n.freq + vibrato;
            // String harmonic synthesis (rich saw-like harmonics with warm roll-off)
            sample += (
              Math.sin(2 * Math.PI * f * time) * 0.4 +
              Math.sin(2 * Math.PI * 2 * f * time) * 0.25 +
              Math.sin(2 * Math.PI * 3 * f * time) * 0.15 +
              Math.sin(2 * Math.PI * 4 * f * time) * 0.08
            ) * env;
          }
        }
        left[i] = sample * 0.8;
        right[i] = sample * 0.8;
      }
      break;
    }

    case 'vine_boom': {
      // Vine Boom: Sub-bass 808 drop with heavy punch + filtered noise impact
      for (let i = 0; i < numSamples; i++) {
        const time = t(i);
        // Exponential pitch drop from 180Hz down to 32Hz
        const freq = 32 + 150 * Math.exp(-time * 10);
        const sub = Math.sin(2 * Math.PI * freq * time);
        // Bass distortion
        const distorted = Math.tanh(sub * 2.5);
        // Exponential amplitude decay
        const amp = Math.exp(-time * 2.2);
        // Initial impact crack noise in first 50ms
        const noise = (Math.random() * 2 - 1) * Math.exp(-time * 40) * 0.4;
        const total = (distorted * 0.8 + noise) * amp;
        left[i] = total;
        right[i] = total;
      }
      break;
    }

    case 'bruh': {
      // Bruh: Formant vocal synthesis simulating "B-r-u-h" pitch drop (140Hz -> 85Hz)
      for (let i = 0; i < numSamples; i++) {
        const time = t(i);
        const pitch = 85 + 65 * Math.exp(-time * 3);
        const env = Math.min(1, time / 0.08) * Math.exp(-time * 2.0);
        // Vocal vocal-tract harmonics (fundamental + F1 ~ 500Hz + F2 ~ 1000Hz)
        const fundamental = Math.sin(2 * Math.PI * pitch * time);
        const f1 = Math.sin(2 * Math.PI * 500 * time) * 0.5;
        const f2 = Math.sin(2 * Math.PI * 1050 * time) * 0.3;
        const sample = (fundamental * 0.6 + f1 + f2) * env * 0.7;
        left[i] = sample;
        right[i] = sample;
      }
      break;
    }

    case 'laugh_track': {
      // Sitcom Laugh Track: Multiple overlapping giggles & hearty laugh pulses
      for (let i = 0; i < numSamples; i++) {
        const time = t(i);
        let sample = 0;
        // 5 overlapping laugh burst cycles (ha-ha-ha-ha)
        const haPulse = Math.sin(2 * Math.PI * 4.5 * time);
        const burstEnv = Math.max(0, haPulse) * Math.exp(-time * 0.6);
        // Vocal pitches: 260Hz, 320Hz, 390Hz (mixed voices in audience)
        sample += Math.sin(2 * Math.PI * 260 * time) * burstEnv * 0.25;
        sample += Math.sin(2 * Math.PI * 340 * time + 0.4) * burstEnv * 0.25;
        sample += Math.sin(2 * Math.PI * 410 * time + 1.1) * burstEnv * 0.2;
        // Ambient room rustle
        const roomNoise = (Math.random() * 2 - 1) * 0.05 * Math.min(1, time / 0.2) * Math.exp(-time * 0.5);
        left[i] = (sample + roomNoise) * 0.9;
        right[i] = (sample + roomNoise) * 0.9;
      }
      break;
    }

    case 'titanic_flute': {
      // Shitty Titanic recorder: Out-of-tune squeaks with random microtonal pitch drift & screech
      const notes = [
        { start: 0.0, end: 0.9, freq: 587.33 }, // D5
        { start: 0.9, end: 1.8, freq: 659.25 }, // E5
        { start: 1.8, end: 2.7, freq: 739.99 }, // F#5
        { start: 2.7, end: 3.7, freq: 659.25 }, // E5
      ];
      for (let i = 0; i < numSamples; i++) {
        const time = t(i);
        let sample = 0;
        for (const n of notes) {
          if (time >= n.start && time < n.end) {
            const rel = time - n.start;
            const dur = n.end - n.start;
            // Shaky breath & unstable pitch
            const breath = 1 + 0.15 * Math.sin(2 * Math.PI * 7 * rel);
            // Hilarious screeching overblow harmonic on attack
            const overblow = rel < 0.15 ? 0.6 * Math.sin(2 * Math.PI * n.freq * 2.8 * time) : 0;
            const detune = Math.sin(2 * Math.PI * 2.3 * rel) * 22; // Out of tune!
            const f = n.freq + detune;
            const env = Math.min(1, rel / 0.05) * (1 - rel / dur);
            sample = (Math.sin(2 * Math.PI * f * time) * 0.6 + overblow) * env * breath * 0.6;
          }
        }
        left[i] = sample;
        right[i] = sample;
      }
      break;
    }

    case 'windows_error': {
      // Windows Error: Classic retro OS chord (C5 + E5 + G5 with percussive attack)
      for (let i = 0; i < numSamples; i++) {
        const time = t(i);
        const env = Math.exp(-time * 4.5);
        const tone1 = Math.sin(2 * Math.PI * 523.25 * time);
        const tone2 = Math.sin(2 * Math.PI * 659.25 * time);
        const tone3 = Math.sin(2 * Math.PI * 783.99 * time);
        const sample = (tone1 * 0.4 + tone2 * 0.3 + tone3 * 0.3) * env * 0.8;
        left[i] = sample;
        right[i] = sample;
      }
      break;
    }

    case 'metal_pipe': {
      // Metal Pipe Falling: Inharmonic metallic modal resonators ringing with high frequencies
      const modalFreqs = [740, 1180, 1620, 2450, 3100, 4200];
      const decays = [4.0, 3.5, 3.0, 2.5, 2.0, 1.8];
      for (let i = 0; i < numSamples; i++) {
        const time = t(i);
        let sample = 0;
        for (let m = 0; m < modalFreqs.length; m++) {
          const f = modalFreqs[m];
          const d = decays[m];
          sample += Math.sin(2 * Math.PI * f * time) * Math.exp(-time * d) * (0.35 / (m + 1));
        }
        // Impact click at start
        const impact = (Math.random() * 2 - 1) * Math.exp(-time * 120) * 0.6;
        left[i] = (sample + impact) * 0.9;
        right[i] = (sample + impact) * 0.9;
      }
      break;
    }

    case 'emotional_damage': {
      // Emotional damage: Gong crash + heavy low-end kung-fu hit
      for (let i = 0; i < numSamples; i++) {
        const time = t(i);
        // Low punch
        const punch = Math.sin(2 * Math.PI * (120 * Math.exp(-time * 15)) * time) * Math.exp(-time * 6);
        // Shimmering gong resonances
        const gong1 = Math.sin(2 * Math.PI * 330 * time) * Math.exp(-time * 2.0);
        const gong2 = Math.sin(2 * Math.PI * 580 * time) * Math.exp(-time * 2.5);
        const sample = (punch * 0.6 + gong1 * 0.3 + gong2 * 0.25) * 0.85;
        left[i] = sample;
        right[i] = sample;
      }
      break;
    }

    case 'curb_enthusiasm': {
      // Frolic motif snippet: Eb - F - G - Eb bouncy pizzicato / tuba
      const notes = [
        { start: 0.0, end: 0.5, freq: 311.13 }, // Eb4
        { start: 0.5, end: 1.0, freq: 349.23 }, // F4
        { start: 1.0, end: 1.6, freq: 392.00 }, // G4
        { start: 1.6, end: 2.4, freq: 311.13 }, // Eb4
        { start: 2.4, end: 3.2, freq: 261.63 }, // C4
        { start: 3.2, end: 4.1, freq: 392.00 }, // G4
      ];
      for (let i = 0; i < numSamples; i++) {
        const time = t(i);
        let sample = 0;
        for (const n of notes) {
          if (time >= n.start && time < n.end) {
            const rel = time - n.start;
            // Plucky acoustic envelope
            const env = Math.exp(-rel * 5.0);
            const tubaSub = Math.sin(2 * Math.PI * (n.freq / 2) * time) * 0.4;
            const clarTone = Math.sin(2 * Math.PI * n.freq * time) * 0.5;
            sample = (tubaSub + clarTone) * env;
          }
        }
        left[i] = sample * 0.8;
        right[i] = sample * 0.8;
      }
      break;
    }

    case 'gigachad': {
      // Giga Chad Phonk Bass: Aggressive 808 sub + metallic Phonk Cowbell rhythm
      const cowbellHits = [0.0, 0.4, 0.8, 1.2, 1.6, 2.0, 2.4, 2.8];
      const cowbellPitches = [800, 800, 950, 800, 1050, 950, 800, 700];
      for (let i = 0; i < numSamples; i++) {
        const time = t(i);
        // Distorted 808 bass underneath
        const bass = Math.tanh(Math.sin(2 * Math.PI * 55 * time) * 3) * 0.4;
        // Phonk cowbell hits
        let bell = 0;
        for (let h = 0; h < cowbellHits.length; h++) {
          const hit = cowbellHits[h];
          if (time >= hit && time < hit + 0.35) {
            const rel = time - hit;
            const env = Math.exp(-rel * 14);
            const f = cowbellPitches[h];
            bell += (Math.sin(2 * Math.PI * f * time) + 0.5 * Math.sin(2 * Math.PI * (f * 1.5) * time)) * env * 0.4;
          }
        }
        left[i] = (bass + bell) * 0.85;
        right[i] = (bass + bell) * 0.85;
      }
      break;
    }

    case 'dun_dun_dun': {
      // Dun Dun Dun: 3 brass suspense stabs (1: 0.0s, 2: 0.5s, 3: 1.1s sustained)
      const stabs = [
        { start: 0.0, len: 0.4, freq: 220 }, // A3
        { start: 0.5, len: 0.4, freq: 207.65 }, // G#3
        { start: 1.0, len: 1.4, freq: 196 }, // G3
      ];
      for (let i = 0; i < numSamples; i++) {
        const time = t(i);
        let sample = 0;
        for (const s of stabs) {
          if (time >= s.start && time < s.start + s.len) {
            const rel = time - s.start;
            const env = Math.min(1, rel / 0.03) * Math.pow(1 - rel / s.len, 0.6);
            sample += (
              Math.sin(2 * Math.PI * s.freq * time) * 0.5 +
              Math.sin(2 * Math.PI * 2 * s.freq * time) * 0.3 +
              Math.sin(2 * Math.PI * 3 * s.freq * time) * 0.2
            ) * env;
          }
        }
        left[i] = sample * 0.85;
        right[i] = sample * 0.85;
      }
      break;
    }

    case 'record_scratch': {
      // Record scratch: Filtered noise + sweeping down pitch
      for (let i = 0; i < numSamples; i++) {
        const time = t(i);
        const pitch = 1200 * Math.exp(-time * 10);
        const env = Math.exp(-time * 3.5);
        const noise = (Math.random() * 2 - 1) * 0.6;
        const tone = Math.sin(2 * Math.PI * pitch * time) * 0.4;
        left[i] = (noise + tone) * env * 0.8;
        right[i] = (noise + tone) * env * 0.8;
      }
      break;
    }

    case 'roblox_oof': {
      // Roblox Oof: Rapid pitch drop from 280Hz down to 140Hz with sharp envelope
      for (let i = 0; i < numSamples; i++) {
        const time = t(i);
        const f = 140 + 140 * Math.exp(-time * 12);
        const env = Math.min(1, time / 0.02) * Math.exp(-time * 8);
        const sample = Math.sin(2 * Math.PI * f * time) * env * 0.9;
        left[i] = sample;
        right[i] = sample;
      }
      break;
    }

    default: {
      // Generic pleasant confirmation chime
      for (let i = 0; i < numSamples; i++) {
        const time = t(i);
        const env = Math.exp(-time * 3);
        const sample = Math.sin(2 * Math.PI * 587.33 * time) * env * 0.5;
        left[i] = sample;
        right[i] = sample;
      }
    }
  }

  return { left, right, duration };
}

// Global active audio source tracker for play/stop
let activeAudioContext: AudioContext | null = null;
let activeSourceNode: AudioBufferSourceNode | null = null;
let activeGainNode: GainNode | null = null;
let activeAudioElement: HTMLAudioElement | null = null;

// Convert PCM Float32Arrays to Web Audio AudioBuffer
export function createAudioBufferFromPCM(
  ctx: AudioContext,
  pcm: { left: Float32Array; right: Float32Array }
): AudioBuffer {
  const buffer = ctx.createBuffer(2, pcm.left.length, ctx.sampleRate);
  buffer.getChannelData(0).set(pcm.left);
  buffer.getChannelData(1).set(pcm.right);
  return buffer;
}

// Play sound in browser using Web Audio API or custom URL
export async function playMemeAudio(
  config: MemeAudioConfig,
  onEnded?: () => void
): Promise<void> {
  stopMemeAudio();

  const volume = config.volume ?? 1.0;
  const rate = config.playbackRate ?? 1.0;
  const isLoop = config.loop ?? false;

  // If custom uploaded audio
  if (config.customAudioUrl) {
    const audio = new Audio(config.customAudioUrl);
    audio.volume = Math.max(0, Math.min(1, volume));
    audio.playbackRate = Math.max(0.25, Math.min(4, rate));
    audio.loop = isLoop;
    audio.onended = () => {
      onEnded?.();
    };
    activeAudioElement = audio;
    await audio.play();
    return;
  }

  if (!config.selectedEffectId) {
    onEnded?.();
    return;
  }

  // Built-in synthetic audio
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!activeAudioContext || activeAudioContext.state === 'closed') {
      activeAudioContext = new AudioCtx();
    }
    if (activeAudioContext.state === 'suspended') {
      await activeAudioContext.resume();
    }

    const pcm = generateSyntheticPCM(config.selectedEffectId, activeAudioContext.sampleRate);
    const audioBuffer = createAudioBufferFromPCM(activeAudioContext, pcm);

    const source = activeAudioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.playbackRate.value = rate;
    source.loop = isLoop;

    const gain = activeAudioContext.createGain();
    gain.gain.value = volume;

    source.connect(gain);
    gain.connect(activeAudioContext.destination);

    source.onended = () => {
      onEnded?.();
    };

    activeSourceNode = source;
    activeGainNode = gain;

    source.start(0);
  } catch (err) {
    console.warn('Web Audio playback error:', err);
    onEnded?.();
  }
}

// Stop currently playing meme audio
export function stopMemeAudio(): void {
  if (activeSourceNode) {
    try {
      activeSourceNode.stop();
      activeSourceNode.disconnect();
    } catch {
      // ignore if already stopped
    }
    activeSourceNode = null;
  }
  if (activeAudioElement) {
    try {
      activeAudioElement.pause();
      activeAudioElement.currentTime = 0;
    } catch {
      // ignore
    }
    activeAudioElement = null;
  }
}

// Generate WAV Blob for attached sound effect
export function getMemeAudioWavBlob(config: MemeAudioConfig): Blob {
  if (!config.selectedEffectId) {
    throw new Error('No audio effect selected');
  }
  const sampleRate = 44100;
  const pcm = generateSyntheticPCM(config.selectedEffectId, sampleRate);
  const wavBuffer = encodeWAV([pcm.left, pcm.right], sampleRate);
  return new Blob([wavBuffer], { type: 'audio/wav' });
}

// Download Meme Audio Track as .WAV file
export function downloadMemeAudioTrack(
  config: MemeAudioConfig,
  fileName = 'meme_sound.wav'
): void {
  const blob = getMemeAudioWavBlob(config);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// Export Video Meme (.webm or .mp4) with embedded Audio Track
export async function exportMemeVideoWithAudio(
  canvas: HTMLCanvasElement,
  config: MemeAudioConfig,
  onProgress?: (percent: number, status: string) => void
): Promise<Blob> {
  const effect = MEME_AUDIO_EFFECTS.find((e) => e.id === config.selectedEffectId);
  const durationSec = effect ? Math.max(2.0, effect.durationSec / (config.playbackRate || 1.0)) : 3.0;

  // 1. Prepare Audio Context & Destination Stream
  const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  const ctx = new AudioCtx();
  if (ctx.state === 'suspended') {
    await ctx.resume();
  }
  const audioDestination = ctx.createMediaStreamDestination();

  // 2. Load audio into stream
  let sourceNode: AudioBufferSourceNode | MediaElementAudioSourceNode | null = null;
  let customAudioEl: HTMLAudioElement | null = null;

  if (config.customAudioUrl) {
    customAudioEl = new Audio(config.customAudioUrl);
    customAudioEl.crossOrigin = 'anonymous';
    const mediaSource = ctx.createMediaElementSource(customAudioEl);
    const gain = ctx.createGain();
    gain.gain.value = config.volume ?? 1.0;
    mediaSource.connect(gain);
    gain.connect(audioDestination);
  } else if (config.selectedEffectId) {
    const pcm = generateSyntheticPCM(config.selectedEffectId, ctx.sampleRate);
    const audioBuffer = createAudioBufferFromPCM(ctx, pcm);
    const bufferSource = ctx.createBufferSource();
    bufferSource.buffer = audioBuffer;
    bufferSource.playbackRate.value = config.playbackRate || 1.0;
    bufferSource.loop = config.loop ?? false;
    const gain = ctx.createGain();
    gain.gain.value = config.volume ?? 1.0;
    bufferSource.connect(gain);
    gain.connect(audioDestination);
    sourceNode = bufferSource;
  }

  // 3. Capture Canvas Stream (30fps)
  const canvasStream = canvas.captureStream ? canvas.captureStream(30) : (canvas as any).mozCaptureStream(30);

  // 4. Combine Video + Audio tracks into combined stream
  const combinedStream = new MediaStream([
    ...canvasStream.getVideoTracks(),
    ...audioDestination.stream.getAudioTracks(),
  ]);

  // Select supported MIME type
  let mimeType = 'video/webm;codecs=vp9,opus';
  if (!MediaRecorder.isTypeSupported(mimeType)) {
    mimeType = 'video/webm';
    if (!MediaRecorder.isTypeSupported(mimeType)) {
      mimeType = 'video/mp4';
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = '';
      }
    }
  }

  return new Promise<Blob>((resolve, reject) => {
    try {
      const recorder = mimeType ? new MediaRecorder(combinedStream, { mimeType }) : new MediaRecorder(combinedStream);
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      recorder.onstop = () => {
        try {
          ctx.close();
        } catch {
          // ignore
        }
        const blob = new Blob(chunks, { type: mimeType || 'video/webm' });
        resolve(blob);
      };

      recorder.onerror = (err) => {
        reject(err);
      };

      // Start recording
      recorder.start(100);

      // Start audio playback
      if (sourceNode) {
        (sourceNode as AudioBufferSourceNode).start(0);
      } else if (customAudioEl) {
        customAudioEl.play().catch(console.warn);
      }

      // Progress countdown
      const startTime = Date.now();
      const totalMs = durationSec * 1000;
      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(99, Math.round((elapsed / totalMs) * 100));
        onProgress?.(progress, `Recording Video with Audio (${(elapsed / 1000).toFixed(1)}s / ${durationSec.toFixed(1)}s)...`);
      }, 100);

      // Stop after duration
      setTimeout(() => {
        clearInterval(interval);
        onProgress?.(100, 'Finalizing video file...');
        if (recorder.state === 'recording') {
          recorder.stop();
        }
      }, totalMs);
    } catch (err) {
      reject(err);
    }
  });
}
