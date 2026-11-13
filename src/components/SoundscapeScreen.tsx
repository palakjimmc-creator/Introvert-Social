import {CloudRain, Coffee, Disc, Music, Pause, Play, VolumeX} from 'lucide-react';
import {SoundChannels, SoundPreset} from '../types/lounge';
import {SOUND_PRESETS} from '../data/loungeData';

interface SoundscapeScreenProps {
  isPlaying: boolean;
  channels: SoundChannels;
  activePresetId: string | null;
  onTogglePlay: () => void;
  onChangeChannel: (key: keyof SoundChannels, value: number) => void;
  onApplyPreset: (preset: SoundPreset) => void;
  onSilenceAll: () => void;
}

const CHANNEL_META: {
  key: keyof SoundChannels;
  label: string;
  description: string;
  Icon: typeof CloudRain;
}[] = [
  {
    key: 'rain',
    label: 'Rain on Bookshop Window',
    description: 'Soft band-filtered rainfall tapping steadily against timber glass.',
    Icon: CloudRain,
  },
  {
    key: 'cafe',
    label: 'Distant Espresso Bar',
    description: 'Warm, muffled room resonance from a quiet afternoon counter.',
    Icon: Coffee,
  },
  {
    key: 'vinyl',
    label: 'Vintage Vinyl Crackle',
    description: 'Gentle needle warmth and stochastic analog surface dust.',
    Icon: Disc,
  },
  {
    key: 'chords',
    label: 'Warm Lo-Fi Chord Pad',
    description: 'Slowly drifting electric piano voicings in low-pass filter.',
    Icon: Music,
  },
];

export function SoundscapeScreen({
  isPlaying,
  channels,
  activePresetId,
  onTogglePlay,
  onChangeChannel,
  onApplyPreset,
  onSilenceAll,
}: SoundscapeScreenProps) {
  return (
    <div className="space-y-8">
      {/* Soundscape Header */}
      <section className="bg-[#EFECE6] border border-[#E2DDD5] rounded-lg p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <p className="text-[12px] text-[#5A585F] mb-2">
            Corner Booth Acoustics · Synthesized In-Browser
          </p>
          <h1 className="font-serif text-[32px] sm:text-[38px] leading-[1.15] tracking-[-0.015em] font-semibold text-[#1E1E24] text-balance">
            Pull down the blinds on a{' '}
            <span className="italic font-medium text-[#486156]">noisy room.</span>
          </h1>
          <p className="text-[15px] leading-relaxed text-[#5A585F] mt-3 max-w-[56ch]">
            Blend synthesized rain, distant café murmur, vinyl dust, and mellow chord pads—generated
            directly in your browser with zero buffering or external streams.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onTogglePlay}
            className="tactile-press inline-flex items-center gap-2.5 rounded-full bg-[#728D80] hover:bg-[#627B6E] text-white px-6 py-3 text-[14px] font-semibold cursor-pointer whitespace-nowrap min-h-[44px]"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isPlaying ? 'Pause Soundscape' : 'Start Soundscape'}
          </button>

          {isPlaying && (
            <button
              type="button"
              onClick={onSilenceAll}
              className="tactile-press inline-flex items-center gap-2 rounded-full bg-[#F7F5F0] hover:bg-[#FFFFFF] border border-[#E2DDD5] text-[#5A585F] px-4 py-3 text-[13px] font-medium cursor-pointer whitespace-nowrap min-h-[44px]"
            >
              <VolumeX className="w-4 h-4" />
              Silence
            </button>
          )}
        </div>
      </section>

      {/* Curated Presets */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {SOUND_PRESETS.map((preset) => {
          const isSelected = activePresetId === preset.id;
          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => onApplyPreset(preset)}
              className={`tactile-press text-left p-5 rounded-md border transition-colors cursor-pointer ${
                isSelected
                  ? 'bg-[#FFFFFF] border-[#728D80] shadow-paper'
                  : 'bg-[#EFECE6] border-[#E2DDD5] hover:bg-[#FFFFFF]'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <h2 className="font-serif text-[20px] font-medium text-[#1E1E24]">
                  {preset.name}
                </h2>
                <span className="text-[12px] font-semibold text-[#486156]">
                  {isSelected ? 'Selected' : 'Load'}
                </span>
              </div>
              <p className="text-[14px] leading-relaxed text-[#5A585F] mt-2">
                {preset.subtitle}
              </p>
            </button>
          );
        })}
      </section>

      {/* Four Channel Mixer */}
      <section className="bg-[#EFECE6] border border-[#E2DDD5] rounded-lg p-6 sm:p-8">
        <div className="flex flex-wrap items-baseline justify-between gap-3 pb-5 mb-6 border-b border-dashed border-[#D2CBC1]">
          <h2 className="font-serif text-[24px] font-medium text-[#1E1E24]">
            Acoustic Channel Mixer
          </h2>
          <span className="text-[13px] text-[#5A585F]">
            {isPlaying ? 'Audio active in background' : 'Paused · Adjust sliders anytime'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {CHANNEL_META.map(({key, label, description, Icon}) => {
            const pct = Math.round(channels[key] * 100);
            return (
              <div
                key={key}
                className="bg-[#F7F5F0] border border-[#E2DDD5] rounded-md p-5 flex flex-col justify-between gap-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#EFECE6] border border-[#E2DDD5] flex items-center justify-center shrink-0 text-[#486156]">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <label
                        htmlFor={`slider-${key}`}
                        className="font-serif text-[18px] font-medium text-[#1E1E24] block"
                      >
                        {label}
                      </label>
                      <p className="text-[13px] text-[#5A585F] mt-0.5">{description}</p>
                    </div>
                  </div>
                  <span className="tabular-nums text-[14px] font-semibold text-[#486156] shrink-0">
                    {pct}%
                  </span>
                </div>

                <input
                  id={`slider-${key}`}
                  type="range"
                  min={0}
                  max={100}
                  value={pct}
                  onChange={(e) => onChangeChannel(key, Number(e.target.value) / 100)}
                  className="w-full accent-[#728D80] cursor-pointer h-2 rounded-lg"
                />
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
