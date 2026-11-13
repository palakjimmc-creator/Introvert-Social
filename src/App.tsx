import {useCallback, useEffect, useMemo, useState} from 'react';
import {
  Coffee,
  EyeOff,
  FileText,
  Headphones,
  MessageSquare,
  Pause,
  PhoneCall,
  Play,
  Volume2,
  X,
} from 'lucide-react';
import {
  BatteryLogEntry,
  CallerPersona,
  ChatMessage,
  ChatRoleId,
  ChatSpeedMode,
  ExcuseCategory,
  ExcuseSlip,
  FakeCallPhase,
  LoungeScreen,
  SoundChannels,
  SoundPreset,
} from './types/lounge';
import {
  BATTERY_STATUS_COPY,
  CALLER_PERSONAS,
  CURATED_EXCUSES,
  SOUND_PRESETS,
} from './data/loungeData';
import {soundEngine} from './audio/soundEngine';
import {SanctuaryScreen} from './components/SanctuaryScreen';
import {ExcusesScreen} from './components/ExcusesScreen';
import {FakeCallScreen} from './components/FakeCallScreen';
import {SoundscapeScreen} from './components/SoundscapeScreen';
import {CornerChatScreen} from './components/CornerChatScreen';
import {FakeCallOverlay} from './components/FakeCallOverlay';
import {ReadingDecoyOverlay} from './components/ReadingDecoyOverlay';

const STORAGE_KEYS = {
  battery: 'wallflower_battery_level',
  batteryLog: 'wallflower_battery_log',
  customExcuses: 'wallflower_custom_excuses',
  channels: 'wallflower_sound_channels',
  chatMessages: 'wallflower_corner_chat',
};

const NAV_ITEMS: {id: LoungeScreen; label: string; mobileLabel: string; Icon: typeof Coffee}[] = [
  {id: 'sanctuary', label: 'Sanctuary', mobileLabel: 'Sanctuary', Icon: Coffee},
  {id: 'excuses', label: 'Excuses', mobileLabel: 'Excuses', Icon: FileText},
  {id: 'fakecall', label: 'Fake Call', mobileLabel: 'Call', Icon: PhoneCall},
  {id: 'soundscape', label: 'Soundscape', mobileLabel: 'Audio', Icon: Headphones},
  {id: 'cornerchat', label: 'Corner Chat', mobileLabel: 'Chat', Icon: MessageSquare},
];

function formatTimeNow(): string {
  return new Date().toLocaleTimeString([], {hour: 'numeric', minute: '2-digit'});
}

export default function App() {
  const [activeScreen, setActiveScreen] = useState<LoungeScreen>('sanctuary');
  const [breathFocusToken, setBreathFocusToken] = useState(0);
  const [isDecoyOpen, setIsDecoyOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Social Battery State
  const [batteryLevel, setBatteryLevel] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.battery);
      if (saved !== null) {
        const parsed = Number(saved);
        if (!Number.isNaN(parsed)) return Math.max(0, Math.min(100, parsed));
      }
    } catch {
      // ignore storage errors
    }
    return 40;
  });

  const [batteryLog, setBatteryLog] = useState<BatteryLogEntry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.batteryLog);
      if (saved) return JSON.parse(saved) as BatteryLogEntry[];
    } catch {
      // ignore storage errors
    }
    return [
      {
        id: 'init-1',
        label: 'Arrived at the gathering',
        delta: -20,
        resultingLevel: 60,
        timestamp: 'Earlier',
      },
      {
        id: 'init-2',
        label: 'Sustained small talk by the coat rack',
        delta: -20,
        resultingLevel: 40,
        timestamp: 'Just now',
      },
    ];
  });

  // Custom Excuses State
  const [customExcuses, setCustomExcuses] = useState<ExcuseSlip[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.customExcuses);
      if (saved) return JSON.parse(saved) as ExcuseSlip[];
    } catch {
      // ignore storage errors
    }
    return [];
  });

  // Fake Call State
  const [selectedPersona, setSelectedPersona] = useState<CallerPersona>(CALLER_PERSONAS[0]);
  const [customCallerName, setCustomCallerName] = useState('');
  const [delaySeconds, setDelaySeconds] = useState(10);
  const [callPhase, setCallPhase] = useState<FakeCallPhase>('idle');
  const [countdownRemaining, setCountdownRemaining] = useState(0);

  // Soundscape State
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [activePresetId, setActivePresetId] = useState<string | null>(SOUND_PRESETS[0].id);
  const [channels, setChannels] = useState<SoundChannels>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.channels);
      if (saved) return JSON.parse(saved) as SoundChannels;
    } catch {
      // ignore storage errors
    }
    return SOUND_PRESETS[0].channels;
  });

  // Corner Chat State
  const [chatRoleId, setChatRoleId] = useState<ChatRoleId>('confidant');
  const [chatSpeedMode, setChatSpeedMode] = useState<ChatSpeedMode>('balanced');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.chatMessages);
      if (saved) return JSON.parse(saved) as ChatMessage[];
    } catch {
      // ignore storage errors
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.battery, String(batteryLevel));
    } catch {
      // ignore
    }
  }, [batteryLevel]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.batteryLog, JSON.stringify(batteryLog));
    } catch {
      // ignore
    }
  }, [batteryLog]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.customExcuses, JSON.stringify(customExcuses));
    } catch {
      // ignore
    }
  }, [customExcuses]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.channels, JSON.stringify(channels));
    } catch {
      // ignore
    }
  }, [channels]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.chatMessages, JSON.stringify(chatMessages));
    } catch {
      // ignore
    }
  }, [chatMessages]);

  useEffect(() => {
    return () => {
      soundEngine.stop();
    };
  }, []);

  const notify = useCallback((message: string) => {
    setToastMessage(message);
  }, []);

  useEffect(() => {
    if (!toastMessage) return;
    const timer = window.setTimeout(() => setToastMessage(null), 2400);
    return () => window.clearTimeout(timer);
  }, [toastMessage]);

  const handleSetBattery = useCallback((nextLevel: number, reason: string) => {
    const clamped = Math.max(0, Math.min(100, nextLevel));
    setBatteryLevel((prev) => {
      const delta = clamped - prev;
      const entry: BatteryLogEntry = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        label: reason,
        delta,
        resultingLevel: clamped,
        timestamp: formatTimeNow(),
      };
      setBatteryLog((log) => [entry, ...log].slice(0, 12));
      return clamped;
    });
  }, []);

  const allExcuses = useMemo(
    () => [...customExcuses, ...CURATED_EXCUSES],
    [customExcuses]
  );

  const handleAddCustomExcuse = (
    headline: string,
    body: string,
    category: Exclude<ExcuseCategory, 'all'>
  ) => {
    const newSlip: ExcuseSlip = {
      id: `custom-${Date.now()}`,
      category,
      headline,
      body,
      toneNote: 'Personal note saved to your pocket notebook.',
      isCustom: true,
    };
    setCustomExcuses((prev) => [newSlip, ...prev]);
  };

  const handleDeleteCustomExcuse = (id: string) => {
    setCustomExcuses((prev) => prev.filter((item) => item.id !== id));
    notify('Removed slip from notebook.');
  };

  // Fake Call Countdown Loop
  useEffect(() => {
    if (callPhase !== 'armed') return;
    if (countdownRemaining <= 0) {
      setCallPhase('ringing');
      return;
    }
    const timer = window.setTimeout(() => {
      setCountdownRemaining((prev) => {
        if (prev <= 1) {
          setCallPhase('ringing');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearTimeout(timer);
  }, [callPhase, countdownRemaining]);

  const handleArmCall = () => {
    setCountdownRemaining(delaySeconds);
    setCallPhase('armed');
    notify(`Fake call armed for ${delaySeconds} seconds.`);
  };

  const handleCancelCall = () => {
    setCallPhase('idle');
    setCountdownRemaining(0);
    notify('Scheduled call canceled.');
  };

  const handleTriggerInstant = () => {
    setCountdownRemaining(0);
    setCallPhase('ringing');
  };

  // Soundscape Handlers
  const handleTogglePlay = () => {
    if (isAudioPlaying) {
      soundEngine.stop();
      setIsAudioPlaying(false);
    } else {
      soundEngine.start(channels);
      setIsAudioPlaying(true);
    }
  };

  const handleChangeChannel = (key: keyof SoundChannels, value: number) => {
    const updated = {...channels, [key]: value};
    setChannels(updated);
    setActivePresetId(null);
    if (isAudioPlaying) {
      soundEngine.updateChannels(updated);
    }
  };

  const handleApplyPreset = (preset: SoundPreset) => {
    setChannels(preset.channels);
    setActivePresetId(preset.id);
    if (!isAudioPlaying) {
      soundEngine.start(preset.channels);
      setIsAudioPlaying(true);
    } else {
      soundEngine.updateChannels(preset.channels);
    }
    notify(`Loaded "${preset.name}" soundscape.`);
  };

  const handleSilenceAll = () => {
    soundEngine.stop();
    setIsAudioPlaying(false);
  };

  // Irish Exit Decoy Trigger
  const handleEnterDecoy = () => {
    if (isAudioPlaying) {
      soundEngine.stop();
      setIsAudioPlaying(false);
    }
    if (callPhase === 'ringing' || callPhase === 'connected') {
      setCallPhase('idle');
    }
    setIsDecoyOpen(true);
  };

  const handleTakeABreathCTA = () => {
    setActiveScreen('sanctuary');
    setBreathFocusToken((t) => t + 1);
  };

  const batteryStatus = BATTERY_STATUS_COPY(batteryLevel);
  const effectiveCallerName = customCallerName.trim() || selectedPersona.name;

  return (
    <div className="min-h-screen bg-[#F7F5F0] text-[#1E1E24] flex flex-col pb-24 md:pb-12">
      {/* Desktop & Mobile Top Bar (Strict 3-Zone Contract on Desktop) */}
      <header className="sticky top-0 z-30 bg-[#F7F5F0]/95 backdrop-blur-sm border-b border-[#E2DDD5]">
        <div className="max-w-[1040px] mx-auto px-4 sm:px-8 h-14 md:h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Single-line Brand Wordmark */}
          <button
            type="button"
            onClick={() => setActiveScreen('sanctuary')}
            className="font-serif text-[20px] sm:text-[22px] font-semibold tracking-tight text-[#1E1E24] whitespace-nowrap shrink-0 cursor-pointer text-left"
          >
            Wallflower Lounge
          </button>

          {/* Zone 2: 4 Single-line Text Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-7" aria-label="Lounge screens">
            {NAV_ITEMS.map(({id, label}) => {
              const isActive = activeScreen === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setActiveScreen(id)}
                  className={`text-[14px] whitespace-nowrap shrink-0 py-1.5 border-b-2 transition-colors cursor-pointer ${
                    isActive
                      ? 'border-[#728D80] text-[#1E1E24] font-semibold'
                      : 'border-transparent text-[#5A585F] hover:text-[#1E1E24] font-medium'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Single Primary Action */}
          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={handleTakeABreathCTA}
              className="tactile-press rounded-full bg-[#728D80] hover:bg-[#627B6E] text-white px-4 py-2 text-[13px] font-semibold whitespace-nowrap shrink-0 cursor-pointer min-h-[40px]"
            >
              Take a Breath
            </button>
          </div>
        </div>
      </header>

      {/* Peripheral Status Strip (Real interactive status, no fake telemetry) */}
      <div className="border-b border-[#E2DDD5] bg-[#EFECE6]/70">
        <div className="max-w-[1040px] mx-auto px-4 sm:px-8 py-2.5 flex flex-wrap items-center justify-between gap-3 text-[13px]">
          <div className="flex items-center gap-2 text-[#5A585F]">
            <span>Social Battery:</span>
            <button
              type="button"
              onClick={() => setActiveScreen('sanctuary')}
              className={`font-semibold tabular-nums cursor-pointer hover:underline ${
                batteryStatus.low ? 'text-[#C86147]' : 'text-[#486156]'
              }`}
            >
              {batteryLevel}% — {batteryStatus.title}
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {callPhase === 'armed' && (
              <div className="flex items-center gap-2 text-[#C86147] font-medium tabular-nums">
                <span>Incoming call in {countdownRemaining}s</span>
                <button
                  type="button"
                  onClick={handleCancelCall}
                  className="text-[#5A585F] hover:text-[#1E1E24] underline cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            )}

            {isAudioPlaying && (
              <div className="flex items-center gap-2 text-[#486156] font-medium">
                <Volume2 className="w-3.5 h-3.5" />
                <span>Ambient Soundscape Playing</span>
                <button
                  type="button"
                  onClick={handleTogglePlay}
                  aria-label="Pause ambient soundscape"
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#FFFFFF] border border-[#E2DDD5] text-[#1E1E24] text-[12px] cursor-pointer"
                >
                  <Pause className="w-3 h-3" />
                  Pause
                </button>
              </div>
            )}

            {!isAudioPlaying && callPhase !== 'armed' && (
              <button
                type="button"
                onClick={handleTogglePlay}
                className="inline-flex items-center gap-1.5 text-[#5A585F] hover:text-[#1E1E24] cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 text-[#728D80]" />
                <span>Play Rain & Cafe Hum</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Workspace */}
      <main className="flex-1 w-full max-w-[1040px] mx-auto px-4 sm:px-8 py-8 sm:py-10">
        {activeScreen === 'sanctuary' && (
          <SanctuaryScreen
            batteryLevel={batteryLevel}
            batteryLog={batteryLog}
            onSetBattery={handleSetBattery}
            onNavigate={setActiveScreen}
            breathFocusToken={breathFocusToken}
          />
        )}

        {activeScreen === 'excuses' && (
          <ExcusesScreen
            excuses={allExcuses}
            onAddCustomExcuse={handleAddCustomExcuse}
            onDeleteCustomExcuse={handleDeleteCustomExcuse}
            onNotify={notify}
          />
        )}

        {activeScreen === 'fakecall' && (
          <FakeCallScreen
            selectedPersona={selectedPersona}
            onSelectPersona={setSelectedPersona}
            customCallerName={customCallerName}
            onChangeCustomCallerName={setCustomCallerName}
            delaySeconds={delaySeconds}
            onChangeDelaySeconds={setDelaySeconds}
            callPhase={callPhase}
            countdownRemaining={countdownRemaining}
            onArmCall={handleArmCall}
            onCancelCall={handleCancelCall}
            onTriggerInstant={handleTriggerInstant}
          />
        )}

        {activeScreen === 'soundscape' && (
          <SoundscapeScreen
            isPlaying={isAudioPlaying}
            channels={channels}
            activePresetId={activePresetId}
            onTogglePlay={handleTogglePlay}
            onChangeChannel={handleChangeChannel}
            onApplyPreset={handleApplyPreset}
            onSilenceAll={handleSilenceAll}
          />
        )}

        {activeScreen === 'cornerchat' && (
          <CornerChatScreen
            batteryLevel={batteryLevel}
            messages={chatMessages}
            roleId={chatRoleId}
            speedMode={chatSpeedMode}
            onChangeRole={setChatRoleId}
            onChangeSpeedMode={setChatSpeedMode}
            onAppendMessages={(newMsgs) =>
              setChatMessages((prev) => [...prev, ...newMsgs])
            }
            onClearHistory={() => {
              setChatMessages([]);
              notify('Cleared corner booth thread.');
            }}
          />
        )}
      </main>

      {/* Quiet Editorial Footer */}
      <footer className="max-w-[1040px] w-full mx-auto px-4 sm:px-8 pt-4 pb-6 border-t border-[#E2DDD5] flex flex-wrap items-center justify-between gap-3 text-[13px] text-[#5A585F]">
        <p className="font-serif italic">
          Wallflower Lo-Fi Lounge — Keep your corner seat as long as you need.
        </p>
        <button
          type="button"
          onClick={handleEnterDecoy}
          className="text-[#486156] hover:underline cursor-pointer"
        >
          Switch to Reading Decoy
        </button>
      </footer>

      {/* Mobile Fixed Bottom Tab Bar (Within 15% sticky height cap) */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#F7F5F0]/95 backdrop-blur-md border-t border-[#E2DDD5] grid grid-cols-5 h-14"
        aria-label="Mobile lounge navigation"
      >
        {NAV_ITEMS.map(({id, mobileLabel, Icon}) => {
          const isActive = activeScreen === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => setActiveScreen(id)}
              className={`flex flex-col items-center justify-center gap-0.5 cursor-pointer min-h-[44px] ${
                isActive ? 'text-[#486156] font-semibold' : 'text-[#5A585F]'
              }`}
            >
              <Icon className="w-[18px] h-[18px]" strokeWidth={isActive ? 2.2 : 1.75} />
              <span className="text-[11px] leading-none">{mobileLabel}</span>
            </button>
          );
        })}
      </nav>

      {/* Floating "Irish Exit" Speed Dial Pill */}
      {!isDecoyOpen && callPhase !== 'ringing' && callPhase !== 'connected' && (
        <button
          type="button"
          onClick={handleEnterDecoy}
          aria-label="Irish Exit: Switch immediately to reading article decoy"
          className="tactile-press fixed bottom-18 right-4 md:bottom-6 md:right-6 z-40 inline-flex items-center gap-2 rounded-full bg-[#1E1E24] hover:bg-[#303036] text-[#F7F5F0] px-4 py-2.5 shadow-paper text-[13px] font-semibold cursor-pointer min-h-[44px]"
        >
          <EyeOff className="w-4 h-4 text-[#B1CDBE]" />
          <span>Irish Exit</span>
        </button>
      )}

      {/* Toast Confirmation Pill */}
      {toastMessage && (
        <div
          role="status"
          className="fixed bottom-20 left-1/2 -translate-x-1/2 md:bottom-6 z-40 bg-[#FFFFFF] border border-[#E2DDD5] shadow-paper rounded-full px-4 py-2 flex items-center gap-2.5 text-[13px] text-[#1E1E24]"
        >
          <span>{toastMessage}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            aria-label="Dismiss notification"
            className="text-[#5A585F] hover:text-[#1E1E24] cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Full-Screen Overlays */}
      <FakeCallOverlay
        phase={callPhase}
        callerName={effectiveCallerName}
        persona={selectedPersona}
        onAnswer={() => setCallPhase('connected')}
        onHangUp={() => setCallPhase('idle')}
      />

      <ReadingDecoyOverlay
        isOpen={isDecoyOpen}
        onExitDecoy={() => setIsDecoyOpen(false)}
      />
    </div>
  );
}
