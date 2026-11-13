export type LoungeScreen = 'sanctuary' | 'excuses' | 'fakecall' | 'soundscape' | 'cornerchat';

export type ChatRoleId = 'confidant' | 'excuse-crafter' | 'smalltalk-coach';

export type ChatSpeedMode = 'balanced' | 'fast';

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
  modelLabel?: string;
}

export type ExcuseCategory =
  | 'all'
  | 'polite-departure'
  | 'sudden-errand'
  | 'pet-alibi'
  | 'low-key-honest';

export interface ExcuseSlip {
  id: string;
  category: Exclude<ExcuseCategory, 'all'>;
  headline: string;
  body: string;
  toneNote: string;
  isCustom?: boolean;
}

export interface BatteryLogEntry {
  id: string;
  label: string;
  delta: number;
  resultingLevel: number;
  timestamp: string;
}

export interface CallerPersona {
  id: string;
  name: string;
  relationship: string;
  phoneLabel: string;
  alibiTitle: string;
  scriptLines: string[];
}

export type FakeCallPhase = 'idle' | 'armed' | 'ringing' | 'connected';

export type BreathingPattern = '4-7-8' | 'box';

export interface SoundChannels {
  rain: number;
  cafe: number;
  vinyl: number;
  chords: number;
}

export interface SoundPreset {
  id: string;
  name: string;
  subtitle: string;
  channels: SoundChannels;
}
