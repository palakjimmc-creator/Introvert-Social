import {Clock, PhoneCall, PhoneOff, Sparkles} from 'lucide-react';
import {CallerPersona, FakeCallPhase} from '../types/lounge';
import {CALLER_PERSONAS} from '../data/loungeData';

interface FakeCallScreenProps {
  selectedPersona: CallerPersona;
  onSelectPersona: (persona: CallerPersona) => void;
  customCallerName: string;
  onChangeCustomCallerName: (name: string) => void;
  delaySeconds: number;
  onChangeDelaySeconds: (seconds: number) => void;
  callPhase: FakeCallPhase;
  countdownRemaining: number;
  onArmCall: () => void;
  onCancelCall: () => void;
  onTriggerInstant: () => void;
}

const DELAY_OPTIONS = [
  {seconds: 0, label: 'Immediate'},
  {seconds: 10, label: '10 sec'},
  {seconds: 30, label: '30 sec'},
  {seconds: 60, label: '60 sec'},
];

export function FakeCallScreen({
  selectedPersona,
  onSelectPersona,
  customCallerName,
  onChangeCustomCallerName,
  delaySeconds,
  onChangeDelaySeconds,
  callPhase,
  countdownRemaining,
  onArmCall,
  onCancelCall,
  onTriggerInstant,
}: FakeCallScreenProps) {
  const effectiveCaller = customCallerName.trim() || selectedPersona.name;

  return (
    <div className="space-y-8">
      {/* Header Card */}
      <section className="bg-[#EFECE6] border border-[#E2DDD5] rounded-lg p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <p className="text-[12px] text-[#5A585F] mb-2">
              Emergency Exit · Simulated Incoming Call
            </p>
            <h1 className="font-serif text-[32px] sm:text-[38px] leading-[1.15] tracking-[-0.015em] font-semibold text-[#1E1E24] text-balance">
              Cue a polite interruption,{' '}
              <span className="italic font-medium text-[#C86147]">right on schedule.</span>
            </h1>
            <p className="text-[15px] leading-relaxed text-[#5A585F] mt-3 max-w-[58ch]">
              Choose a caller identity and countdown timer. Slip your phone onto the table—when the
              ringtone chimes, answer to reveal a realistic alibi script for walking cleanly out the door.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {callPhase === 'armed' ? (
              <button
                type="button"
                onClick={onCancelCall}
                className="tactile-press inline-flex items-center gap-2 rounded-full bg-[#EFECE6] hover:bg-[#FFFFFF] border border-[#D2CBC1] text-[#C86147] px-5 py-2.5 text-[14px] font-semibold cursor-pointer whitespace-nowrap min-h-[44px]"
              >
                <PhoneOff className="w-4 h-4" />
                Cancel Countdown ({countdownRemaining}s)
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={delaySeconds === 0 ? onTriggerInstant : onArmCall}
                  className="tactile-press inline-flex items-center gap-2 rounded-full bg-[#E07A5F] hover:bg-[#C86147] text-white px-6 py-2.5 text-[14px] font-semibold cursor-pointer whitespace-nowrap min-h-[44px]"
                >
                  <PhoneCall className="w-4 h-4" />
                  {delaySeconds === 0 ? 'Ring Phone Now' : `Arm ${delaySeconds}s Timer`}
                </button>
                {delaySeconds !== 0 && (
                  <button
                    type="button"
                    onClick={onTriggerInstant}
                    className="tactile-press inline-flex items-center gap-2 rounded-full bg-[#F7F5F0] hover:bg-[#FFFFFF] border border-[#E2DDD5] text-[#1E1E24] px-4 py-2.5 text-[13px] font-medium cursor-pointer whitespace-nowrap min-h-[44px]"
                  >
                    Test Ring Now
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      {/* Main Configurator Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-6">
          {/* Caller Persona Selection */}
          <div className="bg-[#EFECE6] border border-[#E2DDD5] rounded-md p-6">
            <h2 className="font-serif text-[22px] font-medium text-[#1E1E24] mb-4">
              1. Choose Caller Persona
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {CALLER_PERSONAS.map((persona) => {
                const isSelected = selectedPersona.id === persona.id;
                return (
                  <button
                    key={persona.id}
                    type="button"
                    onClick={() => onSelectPersona(persona)}
                    className={`tactile-press text-left p-4 rounded-md border transition-colors cursor-pointer min-h-[44px] ${
                      isSelected
                        ? 'bg-[#FFFFFF] border-[#728D80] shadow-paper'
                        : 'bg-[#F7F5F0] border-[#E2DDD5] hover:bg-[#FFFFFF]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-serif text-[17px] font-medium text-[#1E1E24]">
                        {persona.name}
                      </span>
                      <span
                        className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 ${
                          isSelected ? 'border-[#728D80] bg-[#728D80]' : 'border-[#D2CBC1] bg-[#F7F5F0]'
                        }`}
                      >
                        {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </span>
                    </div>
                    <p className="text-[12px] text-[#5A585F] mt-1">{persona.relationship}</p>
                    <p className="text-[13px] italic text-[#486156] mt-2">{persona.alibiTitle}</p>
                  </button>
                );
              })}
            </div>

            <div className="mt-5 pt-5 border-t border-[#E2DDD5]">
              <label
                htmlFor="custom-caller-name"
                className="block text-[13px] font-semibold text-[#1E1E24] mb-1.5"
              >
                Optional Custom Caller Display Name
              </label>
              <input
                id="custom-caller-name"
                type="text"
                value={customCallerName}
                onChange={(e) => onChangeCustomCallerName(e.target.value)}
                placeholder={`Leave blank to show "${selectedPersona.name}"`}
                className="w-full rounded-md bg-[#FFFFFF] border border-[#E2DDD5] focus:border-[#728D80] focus:outline-none px-3.5 py-2.5 text-[14px] text-[#1E1E24] placeholder:italic placeholder:text-[#5A585F]/70"
              />
            </div>
          </div>

          {/* Delay Timer Selector */}
          <div className="bg-[#EFECE6] border border-[#E2DDD5] rounded-md p-6">
            <div className="flex items-center justify-between gap-2 mb-4">
              <h2 className="font-serif text-[22px] font-medium text-[#1E1E24]">
                2. Delay Before Ringing
              </h2>
              <Clock className="w-4 h-4 text-[#5A585F]" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {DELAY_OPTIONS.map((opt) => {
                const isSelected = delaySeconds === opt.seconds;
                return (
                  <button
                    key={opt.seconds}
                    type="button"
                    onClick={() => onChangeDelaySeconds(opt.seconds)}
                    className={`tactile-press py-3 px-4 rounded-full text-[14px] font-medium border cursor-pointer whitespace-nowrap min-h-[44px] tabular-nums ${
                      isSelected
                        ? 'bg-[#728D80] border-[#728D80] text-white'
                        : 'bg-[#F7F5F0] border-[#E2DDD5] text-[#1E1E24] hover:bg-[#FFFFFF]'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
            <p className="text-[13px] text-[#5A585F] mt-3">
              You can browse other lounge screens while the countdown runs quietly in the side margin.
            </p>
          </div>
        </div>

        {/* Teleprompter Preview */}
        <div className="lg:col-span-5 bg-[#EFECE6] border border-[#E2DDD5] rounded-md p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-[11px] font-bold uppercase tracking-[0.05em] text-[#5A585F]">
                Spoken Alibi Teleprompter
              </span>
              <Sparkles className="w-4 h-4 text-[#728D80]" />
            </div>

            <h3 className="font-serif text-[24px] font-medium text-[#1E1E24]">
              {selectedPersona.alibiTitle}
            </h3>
            <p className="text-[13px] text-[#5A585F] mt-1">
              Caller shown on screen: <span className="font-semibold text-[#1E1E24]">{effectiveCaller}</span>
            </p>

            <div className="border-t border-dashed border-[#D2CBC1] my-5" />

            <p className="text-[12px] uppercase tracking-[0.04em] font-semibold text-[#5A585F] mb-3">
              Lines to read aloud once answered:
            </p>
            <ol className="space-y-3">
              {selectedPersona.scriptLines.map((line, i) => (
                <li
                  key={i}
                  className="bg-[#FFFFFF] border border-[#E2DDD5] rounded-md p-3.5 text-[14px] leading-relaxed text-[#1E1E24]"
                >
                  <span className="text-[#728D80] font-semibold tabular-nums mr-2">
                    0{i + 1}.
                  </span>
                  “{line}”
                </li>
              ))}
            </ol>
          </div>

          <p className="text-[12px] italic text-[#5A585F] mt-5 pt-4 border-t border-[#E2DDD5]">
            Tip: Nod twice with mild concern while looking at your shoes—nobody ever questions a radiator emergency.
          </p>
        </div>
      </section>
    </div>
  );
}
