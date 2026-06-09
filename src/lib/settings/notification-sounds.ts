import type { NotificationSoundId } from "@/lib/settings/types";

export interface NotificationSoundOption {
  id: NotificationSoundId;
  name: string;
  description: string;
}

export const NOTIFICATION_SOUNDS: NotificationSoundOption[] = [
  { id: "ding", name: "Ding", description: "Klassik qisqa signal" },
  { id: "chime", name: "Chime", description: "Yumshoq jiringlash" },
  { id: "pop", name: "Pop", description: "Yengil pop tovushi" },
  { id: "bell", name: "Qo'ng'iroq", description: "Qo'ng'iroq ohangi" },
  { id: "digital", name: "Raqamli", description: "Zamonaviy beep" },
  { id: "whoosh", name: "Whoosh", description: "Tez o'tish tovushi" },
  { id: "marimba", name: "Marimba", description: "Ikki notali melodiya" },
  { id: "bubble", name: "Pufak", description: "Yengil pufak tovushi" },
  { id: "alert", name: "Ogohlantirish", description: "Diqqat signal" },
  { id: "melody", name: "Melodiya", description: "Uch notali ketma-ketlik" },
];

let audioContext: AudioContext | null = null;

function getAudioContext() {
  if (typeof window === "undefined") return null;
  if (!audioContext) {
    audioContext = new AudioContext();
  }
  if (audioContext.state === "suspended") {
    void audioContext.resume();
  }
  return audioContext;
}

function playTone(
  frequency: number,
  startTime: number,
  duration: number,
  type: OscillatorType,
  gain = 0.12,
) {
  const ctx = getAudioContext();
  if (!ctx) return;

  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, startTime);
  gainNode.gain.setValueAtTime(0.0001, startTime);
  gainNode.gain.exponentialRampToValueAtTime(gain, startTime + 0.02);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);
  oscillator.start(startTime);
  oscillator.stop(startTime + duration + 0.05);
}

function playSequence(
  notes: Array<{ freq: number; at: number; duration: number; type?: OscillatorType }>,
) {
  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;
  for (const note of notes) {
    playTone(note.freq, now + note.at, note.duration, note.type ?? "sine");
  }
}

export function playNotificationSound(soundId: NotificationSoundId) {
  switch (soundId) {
    case "ding":
      playSequence([{ freq: 880, at: 0, duration: 0.18 }]);
      break;
    case "chime":
      playSequence([
        { freq: 659, at: 0, duration: 0.2 },
        { freq: 988, at: 0.12, duration: 0.25 },
      ]);
      break;
    case "pop":
      playTone(520, getAudioContext()?.currentTime ?? 0, 0.08, "triangle", 0.16);
      break;
    case "bell":
      playSequence([
        { freq: 784, at: 0, duration: 0.35, type: "triangle" },
        { freq: 1175, at: 0.05, duration: 0.3, type: "sine" },
      ]);
      break;
    case "digital":
      playSequence([
        { freq: 1200, at: 0, duration: 0.06, type: "square" },
        { freq: 900, at: 0.08, duration: 0.06, type: "square" },
      ]);
      break;
    case "whoosh": {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const noise = ctx.createBufferSource();
      const buffer = ctx.createBuffer(1, ctx.sampleRate * 0.25, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i += 1) {
        data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
      }
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();
      noise.buffer = buffer;
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(1200, now);
      filter.frequency.exponentialRampToValueAtTime(400, now + 0.22);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.24);
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start(now);
      noise.stop(now + 0.26);
      break;
    }
    case "marimba":
      playSequence([
        { freq: 523, at: 0, duration: 0.14, type: "triangle" },
        { freq: 659, at: 0.1, duration: 0.14, type: "triangle" },
      ]);
      break;
    case "bubble":
      playSequence([
        { freq: 440, at: 0, duration: 0.1, type: "sine" },
        { freq: 660, at: 0.06, duration: 0.12, type: "sine" },
      ]);
      break;
    case "alert":
      playSequence([
        { freq: 740, at: 0, duration: 0.12, type: "square" },
        { freq: 740, at: 0.16, duration: 0.12, type: "square" },
      ]);
      break;
    case "melody":
      playSequence([
        { freq: 523, at: 0, duration: 0.12 },
        { freq: 659, at: 0.13, duration: 0.12 },
        { freq: 784, at: 0.26, duration: 0.18 },
      ]);
      break;
    default:
      playSequence([{ freq: 880, at: 0, duration: 0.18 }]);
  }
}
