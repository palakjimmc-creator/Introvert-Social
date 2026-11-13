import {FormEvent, useEffect, useRef, useState} from 'react';
import {MessageSquare, RotateCcw, Send} from 'lucide-react';
import {ChatMessage, ChatRoleId, ChatSpeedMode} from '../types/lounge';

interface CornerChatScreenProps {
  batteryLevel: number;
  messages: ChatMessage[];
  roleId: ChatRoleId;
  speedMode: ChatSpeedMode;
  onChangeRole: (roleId: ChatRoleId) => void;
  onChangeSpeedMode: (mode: ChatSpeedMode) => void;
  onAppendMessages: (newMessages: ChatMessage[]) => void;
  onClearHistory: () => void;
}

const CHAT_ROLES: {id: ChatRoleId; label: string; description: string}[] = [
  {
    id: 'confidant',
    label: 'Corner Confidant',
    description: 'Calm, dryly witty bookstore friend to help you decompress.',
  },
  {
    id: 'excuse-crafter',
    label: 'Excuse Tailor',
    description: 'Crafts polite, custom departure lines for your exact situation.',
  },
  {
    id: 'smalltalk-coach',
    label: 'Quiet Pivot Coach',
    description: 'Low-energy questions and gentle boundaries for tricky circles.',
  },
];

const STARTER_PROMPTS: Record<ChatRoleId, string[]> = {
  confidant: [
    'The party just got twice as loud—talk me down for a minute.',
    'Should I stay twenty more minutes or slip out right now?',
  ],
  'excuse-crafter': [
    'Draft a gracious two-line text to leave a dinner party early.',
    'Give me a believable excuse to skip the noisy after-party.',
  ],
  'smalltalk-coach': [
    'Give me two low-energy questions so someone else does the talking.',
    'How do I politely step away from a circle without feeling rude?',
  ],
};

export function CornerChatScreen({
  batteryLevel,
  messages,
  roleId,
  speedMode,
  onChangeRole,
  onChangeSpeedMode,
  onAppendMessages,
  onClearHistory,
}: CornerChatScreenProps) {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const sendMessage = async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed || isLoading) return;

    setErrorMessage(null);
    const now = new Date().toLocaleTimeString([], {hour: 'numeric', minute: '2-digit'});
    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      text: trimmed,
      timestamp: now,
    };

    const priorHistory = messages.map((m) => ({role: m.role, text: m.text}));
    onAppendMessages([userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          message: trimmed,
          history: priorHistory,
          roleId,
          speedMode,
          batteryLevel,
        }),
      });

      const data = (await response.json()) as {
        reply?: string;
        model?: string;
        error?: string;
      };

      if (!response.ok || !data.reply) {
        throw new Error(data.error || 'Could not reach the corner booth companion.');
      }

      const modelMsg: ChatMessage = {
        id: `m-${Date.now()}`,
        role: 'model',
        text: data.reply,
        timestamp: new Date().toLocaleTimeString([], {hour: 'numeric', minute: '2-digit'}),
        modelLabel: data.model,
      };
      onAppendMessages([modelMsg]);
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : 'Something went awry reaching the companion.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    void sendMessage(input);
  };

  const activeRole = CHAT_ROLES.find((r) => r.id === roleId) ?? CHAT_ROLES[0];

  return (
    <div className="space-y-6">
      {/* Header & Role/Speed Controls */}
      <section className="bg-[#EFECE6] border border-[#E2DDD5] rounded-lg p-6 sm:p-7">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5">
          <div>
            <p className="text-[12px] text-[#5A585F] mb-2">
              Corner Booth Chat · Multi-Turn Companion
            </p>
            <h1 className="font-serif text-[30px] sm:text-[36px] leading-[1.15] tracking-[-0.015em] font-semibold text-[#1E1E24] text-balance">
              Quiet counsel across the{' '}
              <span className="italic font-medium text-[#486156]">corner table.</span>
            </h1>
            <p className="text-[15px] leading-relaxed text-[#5A585F] mt-2 max-w-[58ch]">
              {activeRole.description}
            </p>
          </div>

          {/* Model Speed Selector */}
          <div className="inline-flex items-center gap-1 p-1 rounded-full bg-[#F7F5F0] border border-[#E2DDD5] self-start shrink-0">
            <button
              type="button"
              onClick={() => onChangeSpeedMode('balanced')}
              className={`px-3.5 py-1.5 rounded-full text-[13px] font-medium transition-colors cursor-pointer whitespace-nowrap min-h-[36px] ${
                speedMode === 'balanced'
                  ? 'bg-[#728D80] text-white'
                  : 'text-[#5A585F] hover:text-[#1E1E24]'
              }`}
            >
              Thoughtful (Hydrogen)
            </button>
            <button
              type="button"
              onClick={() => onChangeSpeedMode('fast')}
              className={`px-3.5 py-1.5 rounded-full text-[13px] font-medium transition-colors cursor-pointer whitespace-nowrap min-h-[36px] ${
                speedMode === 'fast'
                  ? 'bg-[#728D80] text-white'
                  : 'text-[#5A585F] hover:text-[#1E1E24]'
              }`}
            >
              Quick Whisper (Lite)
            </button>
          </div>
        </div>

        {/* Role System Instruction Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-5 pt-5 border-t border-[#E2DDD5]">
          <div className="flex flex-wrap items-center gap-2">
            {CHAT_ROLES.map((role) => {
              const isSelected = role.id === roleId;
              return (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => onChangeRole(role.id)}
                  className={`tactile-press px-3.5 py-2 rounded-full text-[13px] font-medium border cursor-pointer whitespace-nowrap min-h-[40px] ${
                    isSelected
                      ? 'bg-[#1E1E24] border-[#1E1E24] text-[#F7F5F0]'
                      : 'bg-[#F7F5F0] border-[#E2DDD5] text-[#5A585F] hover:text-[#1E1E24]'
                  }`}
                >
                  {role.label}
                </button>
              );
            })}
          </div>

          {messages.length > 0 && (
            <button
              type="button"
              onClick={onClearHistory}
              className="inline-flex items-center gap-1.5 text-[13px] text-[#5A585F] hover:text-[#C86147] cursor-pointer py-1.5 px-2"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Clear Thread
            </button>
          )}
        </div>
      </section>

      {/* Scrollable Conversation Thread */}
      <section className="bg-[#EFECE6] border border-[#E2DDD5] rounded-lg overflow-hidden flex flex-col">
        <div
          ref={scrollRef}
          className="p-5 sm:p-7 space-y-4 h-[400px] sm:h-[440px] overflow-y-auto"
          aria-live="polite"
        >
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto py-6">
              <div className="w-11 h-11 rounded-full bg-[#F7F5F0] border border-[#E2DDD5] flex items-center justify-center text-[#486156] mb-3">
                <MessageSquare className="w-5 h-5" strokeWidth={1.75} />
              </div>
              <h2 className="font-serif text-[22px] font-medium text-[#1E1E24]">
                The seat across from you is open.
              </h2>
              <p className="text-[14px] text-[#5A585F] mt-1.5">
                Start with a quick note below or ask for a tailored excuse, exit timing, or a quiet sanity check.
              </p>

              <div className="flex flex-col gap-2 w-full mt-5">
                {STARTER_PROMPTS[roleId].map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => void sendMessage(prompt)}
                    className="tactile-press text-left px-4 py-3 rounded-md bg-[#F7F5F0] hover:bg-[#FFFFFF] border border-[#E2DDD5] text-[13px] text-[#1E1E24] cursor-pointer"
                  >
                    “{prompt}”
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((msg) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] sm:max-w-[75%] rounded-lg px-4 py-3 text-[15px] leading-relaxed whitespace-pre-wrap ${
                      isUser
                        ? 'bg-[#728D80] text-white'
                        : 'bg-[#FFFFFF] border border-[#E2DDD5] text-[#1E1E24] shadow-paper'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[11px] text-[#5A585F] mt-1 px-1 tabular-nums">
                    {isUser ? 'You' : activeRole.label} · {msg.timestamp}
                    {msg.modelLabel ? ` · ${msg.modelLabel}` : ''}
                  </span>
                </div>
              );
            })
          )}

          {isLoading && (
            <div className="flex flex-col items-start">
              <div className="bg-[#FFFFFF] border border-[#E2DDD5] rounded-lg px-4 py-3 text-[14px] italic text-[#5A585F]">
                Writing a quiet reply…
              </div>
            </div>
          )}
        </div>

        {errorMessage && (
          <div className="mx-5 sm:mx-7 mb-3 px-4 py-2.5 rounded-md bg-[#FDF0EC] border border-[#E07A5F]/40 text-[13px] text-[#C86147]">
            {errorMessage}
          </div>
        )}

        {/* Composer */}
        <form
          onSubmit={handleSubmit}
          className="p-4 sm:p-5 bg-[#F7F5F0] border-t border-[#E2DDD5] flex items-center gap-3"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Quietly type what’s happening in the room..."
            disabled={isLoading}
            className="flex-1 rounded-full bg-[#FFFFFF] border border-[#E2DDD5] focus:border-[#728D80] focus:outline-none px-4 py-2.5 text-[14px] text-[#1E1E24] placeholder:italic placeholder:text-[#5A585F]/70 min-h-[44px]"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="tactile-press inline-flex items-center gap-2 rounded-full bg-[#728D80] hover:bg-[#627B6E] disabled:opacity-50 text-white px-5 py-2.5 text-[14px] font-semibold cursor-pointer whitespace-nowrap min-h-[44px]"
          >
            <Send className="w-4 h-4" />
            <span>Send</span>
          </button>
        </form>
      </section>
    </div>
  );
}
