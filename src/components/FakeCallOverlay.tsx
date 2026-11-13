import {useEffect, useState} from 'react';
import {Mic, MicOff, Phone, PhoneOff, Volume2} from 'lucide-react';
import {CallerPersona, FakeCallPhase} from '../types/lounge';
import {soundEngine} from '../audio/soundEngine';

interface FakeCallOverlayProps {
  phase: FakeCallPhase;
  callerName: string;
  persona: CallerPersona;
  onAnswer: () => void;
  onHangUp: () => void;
}

export function FakeCallOverlay({
  phase,
  callerName,
  persona,
  onAnswer,
  onHangUp,
}: FakeCallOverlayProps) {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(false);

  // Soft ringtone chime while ringing
  useEffect(() => {
    if (phase !== 'ringing') return;
    soundEngine.playRingtonePulse();
    const chimeLoop = window.setInterval(() => {
      soundEngine.playRingtonePulse();
    }, 2200);
    return () => window.clearInterval(chimeLoop);
  }, [phase]);

  // Call duration timer when connected
  useEffect(() => {
    if (phase !== 'connected') {
      setElapsedSeconds(0);
      return;
    }
    const timer = window.setInterval(() => {
      setElapsedSeconds((s) => s + 1);
    }, 1000);
    return () => window.clearInterval(timer);
  }, [phase]);

  if (phase !== 'ringing' && phase !== 'connected') return null;

  const formatDuration = (total: number) => {
    const mins = Math.floor(total / 60);
    const secs = total % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-[#1B1B21] text-[#F7F5F0] flex flex-col justify-between px-6 py-10 sm:py-12"
      role="dialog"
      aria-modal="true"
      aria-label={`Simulated call from ${callerName}`}
    >
      {/* Top Caller Header */}
      <div className="max-w-md w-full mx-auto text-center pt-4">
        <p className="text-[12px] tracking-[0.06em] uppercase text-[#B1CDBE] font-semibold">
          {phase === 'ringing' ? persona.phoneLabel : 'Call Connected'}
        </p>
        <h2 className="font-serif text-[34px] sm:text-[40px] font-medium text-white mt-2">
          {callerName}
        </h2>
        <p className="text-[15px] text-[#C2C8C3] mt-1 tabular-nums">
          {phase === 'ringing' ? persona.relationship : formatDuration(elapsedSeconds)}
        </p>
      </div>

      {/* Center Content: Either subtle ring aura or live teleprompter script */}
      <div className="max-w-md w-full mx-auto my-auto py-6">
        {phase === 'ringing' ? (
          <div className="flex flex-col items-center justify-center py-10">
            <div className="w-24 h-24 rounded-full bg-[#303036] border border-[#728D80]/50 flex items-center justify-center">
              <span className="font-serif text-[32px] text-[#F7F5F0]">
                {callerName.charAt(0).toUpperCase()}
              </span>
            </div>
            <p className="text-[14px] text-[#C2C8C3] mt-6 italic">
              Alibi ready: {persona.alibiTitle}
            </p>
          </div>
        ) : (
          <div className="bg-[#25252C] border border-[#3B3B44] rounded-lg p-5 space-y-3">
            <p className="text-[11px] uppercase tracking-[0.06em] text-[#B1CDBE] font-bold">
              Your Spoken Lines · {persona.alibiTitle}
            </p>
            <div className="space-y-2.5 max-h-[38vh] overflow-y-auto pr-1">
              {persona.scriptLines.map((line, i) => (
                <p key={i} className="text-[15px] leading-relaxed text-[#F7F5F0]">
                  <span className="text-[#8FA89B] tabular-nums mr-2">{i + 1}.</span>“{line}”
                </p>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Phone Controls */}
      <div className="max-w-md w-full mx-auto pb-4">
        {phase === 'ringing' ? (
          <div className="flex items-center justify-around gap-6">
            <div className="flex flex-col items-center gap-2">
              <button
                type="button"
                onClick={onHangUp}
                aria-label="Decline call"
                className="tactile-press w-16 h-16 rounded-full bg-[#E07A5F] hover:bg-[#C86147] text-white flex items-center justify-center cursor-pointer"
              >
                <PhoneOff className="w-6 h-6" />
              </button>
              <span className="text-[13px] text-[#C2C8C3]">Decline</span>
            </div>

            <div className="flex flex-col items-center gap-2">
              <button
                type="button"
                onClick={onAnswer}
                aria-label="Answer call"
                className="tactile-press w-16 h-16 rounded-full bg-[#728D80] hover:bg-[#627B6E] text-white flex items-center justify-center cursor-pointer"
              >
                <Phone className="w-6 h-6" />
              </button>
              <span className="text-[13px] text-[#C2C8C3]">Answer</span>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4 max-w-[240px] mx-auto">
              <button
                type="button"
                onClick={() => setIsMuted((m) => !m)}
                className={`py-3 px-4 rounded-full border text-[13px] font-medium flex items-center justify-center gap-2 cursor-pointer min-h-[44px] ${
                  isMuted
                    ? 'bg-[#F7F5F0] text-[#1E1E24] border-[#F7F5F0]'
                    : 'bg-[#25252C] text-[#F7F5F0] border-[#3B3B44]'
                }`}
              >
                {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                {isMuted ? 'Muted' : 'Mute'}
              </button>
              <button
                type="button"
                onClick={() => setIsSpeaker((s) => !s)}
                className={`py-3 px-4 rounded-full border text-[13px] font-medium flex items-center justify-center gap-2 cursor-pointer min-h-[44px] ${
                  isSpeaker
                    ? 'bg-[#F7F5F0] text-[#1E1E24] border-[#F7F5F0]'
                    : 'bg-[#25252C] text-[#F7F5F0] border-[#3B3B44]'
                }`}
              >
                <Volume2 className="w-4 h-4" />
                Speaker
              </button>
            </div>

            <div className="flex justify-center">
              <button
                type="button"
                onClick={onHangUp}
                aria-label="End call"
                className="tactile-press inline-flex items-center gap-2 px-8 h-14 rounded-full bg-[#E07A5F] hover:bg-[#C86147] text-white font-semibold text-[15px] cursor-pointer"
              >
                <PhoneOff className="w-5 h-5" />
                End Call & Head Home
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
