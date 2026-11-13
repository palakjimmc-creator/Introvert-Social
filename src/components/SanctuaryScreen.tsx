import {useEffect, useMemo, useState} from 'react';
import {Wind, PhoneOutgoing, FileText, RotateCcw} from 'lucide-react';
import {BatteryLogEntry, BreathingPattern, LoungeScreen} from '../types/lounge';
import {QUICK_BATTERY_EVENTS} from '../data/loungeData';
import {EditorialImage} from './EditorialImage';
import {SocialBatteryWidget} from './SocialBatteryWidget';

interface SanctuaryScreenProps {
  batteryLevel: number;
  batteryLog: BatteryLogEntry[];
  onSetBattery: (nextLevel: number, reason: string) => void;
  onNavigate: (screen: LoungeScreen) => void;
  breathFocusToken: number;
}

interface BreathPhase {
  label: string;
  cue: string;
  seconds: number;
  targetScale: number;
}

const PATTERN_PHASES: Record<BreathingPattern, BreathPhase[]> = {
  '4-7-8': [
    {label: 'Inhale', cue: 'Draw air in gently through your nose.', seconds: 4, targetScale: 1.24},
    {label: 'Hold', cue: 'Let your shoulders drop away from your ears.', seconds: 7, targetScale: 1.24},
    {label: 'Exhale', cue: 'Release slowly, as if cooling hot tea.', seconds: 8, targetScale: 0.92},
  ],
  box: [
    {label: 'Inhale', cue: 'Count four unhurried beats in.', seconds: 4, targetScale: 1.22},
    {label: 'Hold', cue: 'Rest in the quiet top of the breath.', seconds: 4, targetScale: 1.22},
    {label: 'Exhale', cue: 'Let the room soften around you.', seconds: 4, targetScale: 0.92},
    {label: 'Rest', cue: 'Wait comfortably before the next breath.', seconds: 4, targetScale: 0.92},
  ],
};

export function SanctuaryScreen({
  batteryLevel,
  batteryLog,
  onSetBattery,
  onNavigate,
  breathFocusToken,
}: SanctuaryScreenProps) {
  const [pattern, setPattern] = useState<BreathingPattern>('4-7-8');
  const [isBreathing, setIsBreathing] = useState(false);
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(PATTERN_PHASES['4-7-8'][0].seconds);
  const [cyclesCompleted, setCyclesCompleted] = useState(0);

  const phases = useMemo(() => PATTERN_PHASES[pattern], [pattern]);
  const currentPhase = phases[phaseIdx % phases.length];

  useEffect(() => {
    if (breathFocusToken > 0) {
      const el = document.getElementById('breathing-sanctuary');
      el?.scrollIntoView({behavior: 'smooth', block: 'center'});
      setIsBreathing(true);
    }
  }, [breathFocusToken]);

  useEffect(() => {
    setPhaseIdx(0);
    setSecondsLeft(PATTERN_PHASES[pattern][0].seconds);
  }, [pattern]);

  useEffect(() => {
    if (!isBreathing) return;
    const timer = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev > 1) return prev - 1;
        const nextIdx = (phaseIdx + 1) % phases.length;
        if (nextIdx === 0) {
          setCyclesCompleted((c) => c + 1);
          onSetBattery(Math.min(100, batteryLevel + 5), 'Completed breathing cycle');
        }
        setPhaseIdx(nextIdx);
        return phases[nextIdx].seconds;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [isBreathing, phaseIdx, phases, batteryLevel, onSetBattery]);

  const handleResetBreath = () => {
    setIsBreathing(false);
    setPhaseIdx(0);
    setSecondsLeft(phases[0].seconds);
  };

  return (
    <div className="space-y-10">
      {/* Hero Editorial Spread */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-7 flex flex-col justify-between bg-[#EFECE6] border border-[#E2DDD5] rounded-lg p-6 sm:p-8">
          <div>
            <p className="text-[12px] text-[#5A585F] mb-3">
              Corner Booth · Quiet Respite · Social Ledger
            </p>
            <h1 className="font-serif text-[32px] sm:text-[42px] leading-[1.15] tracking-[-0.02em] font-semibold text-[#1E1E24] text-balance mb-4">
              Pull up a chair in the quiet corner—{' '}
              <span className="italic font-medium text-[#486156]">no small talk required.</span>
            </h1>
            <p className="text-[16px] leading-[1.65] text-[#5A585F] max-w-[54ch]">
              Keep an honest eye on your social reserves, pace your breath between conversations,
              or slip cleanly out the side door whenever the room gets too loud.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 mt-7 pt-5 border-t border-[#E2DDD5]">
            <button
              type="button"
              onClick={() => {
                setIsBreathing(true);
                document.getElementById('breathing-sanctuary')?.scrollIntoView({behavior: 'smooth', block: 'center'});
              }}
              className="tactile-press inline-flex items-center gap-2 rounded-full bg-[#728D80] hover:bg-[#627B6E] text-white px-5 py-2.5 text-[14px] font-semibold cursor-pointer whitespace-nowrap min-h-[44px]"
            >
              <Wind className="w-4 h-4" />
              Take a Breath
            </button>
            <button
              type="button"
              onClick={() => onNavigate('fakecall')}
              className="tactile-press inline-flex items-center gap-2 rounded-full bg-[#E07A5F] hover:bg-[#C86147] text-white px-5 py-2.5 text-[14px] font-semibold cursor-pointer whitespace-nowrap min-h-[44px]"
            >
              <PhoneOutgoing className="w-4 h-4" />
              Emergency Exit Call
            </button>
            <button
              type="button"
              onClick={() => onNavigate('excuses')}
              className="tactile-press inline-flex items-center gap-2 rounded-full bg-[#EFECE6] hover:bg-[#E7E2DA] border border-[#D2CBC1] text-[#1E1E24] px-5 py-2.5 text-[14px] font-medium cursor-pointer whitespace-nowrap min-h-[44px]"
            >
              <FileText className="w-4 h-4 text-[#5A585F]" />
              Browse Excuse Slips
            </button>
          </div>
        </div>

        <div className="lg:col-span-5 flex flex-col">
          <EditorialImage
            src="/src/assets/images/sanctuary_corner_booth_1794549784641.jpg"
            alt="Quiet corner booth in a bookstore cafe with warm lamp and linen notebook"
            aspectClass="aspect-[4/3] lg:aspect-auto lg:h-full min-h-[240px]"
            fallbackTitle="Corner Booth · Rainy Evening"
            className="h-full"
          />
        </div>
      </section>

      {/* Social Battery Barometer & Quick Events */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-5">
          <SocialBatteryWidget level={batteryLevel} onSetLevel={onSetBattery} />

          <div className="bg-[#EFECE6] border border-[#E2DDD5] rounded-md p-5">
            <div className="flex items-center justify-between gap-2 mb-3">
              <h3 className="font-serif text-[20px] font-medium text-[#1E1E24]">
                What just happened in the room?
              </h3>
              <span className="text-[12px] text-[#5A585F]">Tap to adjust</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {QUICK_BATTERY_EVENTS.map((evt) => {
                const isDrain = evt.delta < 0;
                return (
                  <button
                    key={evt.id}
                    type="button"
                    onClick={() =>
                      onSetBattery(
                        Math.max(0, Math.min(100, batteryLevel + evt.delta)),
                        evt.label
                      )
                    }
                    className="tactile-press flex items-center justify-between gap-3 px-4 py-3 rounded-md bg-[#F7F5F0] hover:bg-[#FFFFFF] border border-[#E2DDD5] text-left cursor-pointer min-h-[44px]"
                  >
                    <span className="text-[14px] font-medium text-[#1E1E24]">{evt.label}</span>
                    <span
                      className={`tabular-nums text-[13px] font-semibold whitespace-nowrap ${
                        isDrain ? 'text-[#C86147]' : 'text-[#486156]'
                      }`}
                    >
                      {evt.delta > 0 ? `+${evt.delta}%` : `${evt.delta}%`}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Quiet Ledger Log */}
        <div className="lg:col-span-5 bg-[#EFECE6] border border-[#E2DDD5] rounded-md p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-baseline justify-between mb-3">
              <h3 className="font-serif text-[20px] font-medium text-[#1E1E24]">
                Evening Ledger
              </h3>
              <span className="text-[12px] text-[#5A585F] tabular-nums">
                {batteryLog.length} entries
              </span>
            </div>
            <div className="divide-y divide-[#E2DDD5]">
              {batteryLog.slice(0, 5).map((entry) => (
                <div key={entry.id} className="py-2.5 flex items-baseline justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[14px] text-[#1E1E24] truncate">{entry.label}</p>
                    <p className="text-[12px] text-[#5A585F]">{entry.timestamp}</p>
                  </div>
                  <div className="text-right shrink-0 tabular-nums">
                    <span
                      className={`text-[13px] font-semibold ${
                        entry.delta < 0 ? 'text-[#C86147]' : 'text-[#486156]'
                      }`}
                    >
                      {entry.delta > 0 ? `+${entry.delta}%` : entry.delta === 0 ? 'Check-in' : `${entry.delta}%`}
                    </span>
                    <p className="text-[11px] text-[#5A585F]">{entry.resultingLevel}% left</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="text-[12px] italic text-[#5A585F] mt-4 pt-3 border-t border-[#E2DDD5]">
            Stored quietly in your browser; never shared with the party host.
          </p>
        </div>
      </section>

      {/* Breathing Sanctuary */}
      <section
        id="breathing-sanctuary"
        className="bg-[#EFECE6] border border-[#E2DDD5] rounded-lg p-6 sm:p-8"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-dashed border-[#D2CBC1]">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.05em] text-[#5A585F]">
              Breathing Pacer
            </p>
            <h2 className="font-serif text-[26px] font-medium text-[#1E1E24] mt-1">
              Step away to the coatroom for sixty seconds
            </h2>
          </div>

          <div className="inline-flex items-center gap-1 p-1 rounded-full bg-[#F7F5F0] border border-[#E2DDD5] self-start">
            <button
              type="button"
              onClick={() => setPattern('4-7-8')}
              className={`px-3.5 py-1.5 rounded-full text-[13px] font-medium transition-colors cursor-pointer whitespace-nowrap min-h-[36px] ${
                pattern === '4-7-8'
                  ? 'bg-[#728D80] text-white'
                  : 'text-[#5A585F] hover:text-[#1E1E24]'
              }`}
            >
              4-7-8 Unwind
            </button>
            <button
              type="button"
              onClick={() => setPattern('box')}
              className={`px-3.5 py-1.5 rounded-full text-[13px] font-medium transition-colors cursor-pointer whitespace-nowrap min-h-[36px] ${
                pattern === 'box'
                  ? 'bg-[#728D80] text-white'
                  : 'text-[#5A585F] hover:text-[#1E1E24]'
              }`}
            >
              4-4-4-4 Box
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center pt-7">
          <div className="md:col-span-5 flex flex-col items-center justify-center py-4">
            <div className="relative w-48 h-48 flex items-center justify-center">
              <div
                className="absolute inset-0 rounded-full border border-[#728D80]/30 bg-[#728D80]/10 transition-transform duration-1000 ease-out"
                style={{
                  transform: `scale(${isBreathing ? currentPhase.targetScale : 1})`,
                }}
              />
              <div
                className="relative w-36 h-36 rounded-full bg-[#F7F5F0] border border-[#728D80]/50 shadow-paper flex flex-col items-center justify-center text-center transition-transform duration-1000 ease-out"
                style={{
                  transform: `scale(${isBreathing ? (currentPhase.targetScale + 1) / 2 : 1})`,
                }}
              >
                <span className="font-serif italic text-[19px] text-[#1E1E24]">
                  {isBreathing ? currentPhase.label : 'Ready'}
                </span>
                <span className="tabular-nums text-[28px] font-semibold text-[#486156] leading-tight mt-0.5">
                  {secondsLeft}s
                </span>
              </div>
            </div>
          </div>

          <div className="md:col-span-7 space-y-5">
            <div>
              <p className="font-serif text-[22px] text-[#1E1E24] leading-snug">
                {isBreathing
                  ? currentPhase.cue
                  : 'Start the pacer whenever the room feels three decibels too brisk.'}
              </p>
              <p className="text-[14px] text-[#5A585F] mt-2 tabular-nums">
                Completed cycles this session: {cyclesCompleted} · Each cycle restores +5% social battery
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setIsBreathing((prev) => !prev)}
                className="tactile-press rounded-full bg-[#728D80] hover:bg-[#627B6E] text-white px-6 py-2.5 text-[14px] font-semibold cursor-pointer whitespace-nowrap min-h-[44px]"
              >
                {isBreathing ? 'Pause Pacer' : 'Begin Breathing'}
              </button>
              <button
                type="button"
                onClick={handleResetBreath}
                className="tactile-press inline-flex items-center gap-2 rounded-full bg-[#F7F5F0] hover:bg-[#FFFFFF] border border-[#E2DDD5] text-[#1E1E24] px-5 py-2.5 text-[14px] font-medium cursor-pointer whitespace-nowrap min-h-[44px]"
              >
                <RotateCcw className="w-4 h-4 text-[#5A585F]" />
                Reset
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
