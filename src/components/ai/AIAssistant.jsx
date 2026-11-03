import { useEffect, useRef, useState } from 'react';
import {
  Bot,
  Mic,
  MicOff,
  Send,
  Sparkles,
  Trash2,
  RotateCcw,
  X,
  Volume2,
} from 'lucide-react';
import useAIStore from '../../store/aiStore';
import useAIContext from '../../hooks/useAIContext';

const AVATAR_GRADIENT = 'bg-gradient-to-br from-navy-700 to-navy-900';

function renderContent(text) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <span key={i} className="font-semibold text-navy-900 dark:text-navy-100">
          {part.slice(2, -2)}
        </span>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-4 py-3">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-1.5 w-1.5 animate-bounce rounded-full bg-neutral-400 dark:bg-neutral-500"
          style={{ animationDelay: `${i * 150}ms` }}
        />
      ))}
    </div>
  );
}

function MessageBubble({ message }) {
  const isAI = message.role === 'ai';
  return (
    <div className={`flex w-full gap-2 ${isAI ? 'justify-start' : 'justify-end'}`}>
      {isAI && (
        <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white ${AVATAR_GRADIENT}`}>
          <Bot size={15} />
        </div>
      )}
      <div className="flex max-w-[82%] flex-col">
        <div
          className={`rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed shadow-sm ${
            isAI
              ? 'rounded-tl-sm bg-navy-50 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-100'
              : 'rounded-tr-sm bg-navy-700 text-white'
          }`}
        >
          <div className="whitespace-pre-wrap">{renderContent(message.content)}</div>
        </div>
        {message.sources?.length > 0 && (
          <div className="mt-1 flex flex-wrap gap-1.5">
            {message.sources.map((s, i) => (
              <a
                key={i}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-neutral-200 px-2 py-0.5 text-[11px] text-neutral-500 hover:border-navy-400 hover:text-navy-700 dark:border-neutral-700 dark:text-neutral-400"
              >
                {s.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function AIConversation({ hint, isTyping }) {
  const { messages, suggested, send } = useAIStore();
  const scrollRef = useRef(null);
  const showSuggestions = messages.filter((m) => m.role === 'user').length === 0;

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, isTyping, showSuggestions]);

  return (
    <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
      {hint && (
        <div className="rounded-xl border border-navy-100 bg-navy-50/60 px-3 py-2 text-[11.5px] text-neutral-600 dark:border-neutral-700 dark:bg-neutral-800/60 dark:text-neutral-300">
          <span className="font-semibold text-navy-800 dark:text-navy-200">{hint.title}.</span>{' '}
          {hint.guildText}
        </div>
      )}

      {messages.map((m) => (
        <MessageBubble key={m.id} message={m} />
      ))}

      {isTyping && <TypingDots />}

      {showSuggestions && (
        <div className="flex flex-wrap gap-2 pt-1">
          {suggested.map((q) => (
            <button
              key={q.id}
              onClick={() => send(q.label)}
              className="rounded-full border border-navy-200 bg-white px-3 py-1.5 text-left text-[11.5px] text-navy-800 transition hover:border-navy-400 hover:bg-navy-50 disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:border-navy-500"
              disabled={isTyping}
            >
              {q.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function AIPanel({ onClose }) {
  const [draft, setDraft] = useState('');
  const [voiceGetting, setVoiceGetting] = useState(false);
  const { hint } = useAIContext();
  const { isTyping, error, send, clear, retry } = useAIStore();

  const submit = () => {
    if (!draft.trim() || isTyping) return;
    send(draft);
    setDraft('');
  };

  const toggleVoice = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setVoiceGetting((v) => !v);
    }
  };

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-2xl dark:border-neutral-700 dark:bg-neutral-900">
      {/* Header */}
      <div className={`flex items-center gap-3 px-4 py-3 text-white ${AVATAR_GRADIENT}`}>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/25">
          <Sparkles size={17} />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold leading-tight">TRANSPRICE AI</p>
          <p className="flex items-center gap-1 text-[11px] text-white/75">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Online · Transport Assistant
          </p>
        </div>
        <button
          onClick={clear}
          title="Clear conversation"
          className="rounded-lg p-1.5 text-white/75 transition hover:bg-white/15 hover:text-white"
        >
          <Trash2 size={15} />
        </button>
        <button
          onClick={onClose}
          title="Close"
          className="rounded-lg p-1.5 text-white/75 transition hover:bg-white/15 hover:text-white"
        >
          <X size={17} />
        </button>
      </div>

      {/* Error banner */}
      {error && (
        <div className="flex items-center gap-2 border-b border-red-200 bg-red-50 px-4 py-2 text-xs text-red-700 dark:border-red-800/50 dark:bg-red-950/40 dark:text-red-300">
          <span className="flex-1">{error}</span>
          <button
            onClick={retry}
            className="flex items-center gap-1 rounded-md px-2 py-1 font-medium text-red-700 hover:bg-red-100 dark:text-red-300 dark:hover:bg-red-900/50"
          >
            <RotateCcw size={12} /> Retry
          </button>
        </div>
      )}

      <AIConversation hint={hint} isTyping={isTyping} />

      {/* Footer */}
      <div className="border-t border-neutral-200 p-3 dark:border-neutral-700">
        <div className="flex items-end gap-2">
          <button
            onClick={toggleVoice}
            title="Voice input (coming soon)"
            className="rounded-xl border border-neutral-200 p-2.5 text-neutral-500 transition hover:border-navy-300 hover:text-navy-700 dark:border-neutral-700 dark:text-neutral-400"
          >
            {voiceGetting ? <MicOff size={15} /> : <Mic size={15} />}
          </button>
          <div className="flex flex-1 items-center gap-2 rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 focus-within:border-navy-400 dark:border-neutral-700 dark:bg-neutral-800">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') submit();
              }}
              placeholder="Ask about fares, routes or fuel…"
              className="w-full bg-transparent text-[13px] text-neutral-900 outline-none placeholder:text-neutral-400 dark:text-neutral-100"
            />
            {voiceGetting && (
              <span className="no-wrap shrink-0 text-[10px] font-medium uppercase tracking-wide text-rose-500">
                Listening…
              </span>
            )}
          </div>
          <button
            onClick={submit}
            disabled={!draft.trim() || isTyping}
            className={`flex items-center justify-center rounded-xl p-2.5 text-white transition disabled:opacity-40 ${AVATAR_GRADIENT}`}
            title="Send"
          >
            <Send size={15} />
          </button>
        </div>
        <p className="mt-2 flex items-center gap-1 text-[10px] text-neutral-400 dark:text-neutral-500">
          <Volume2 size={11} /> AI answers may not be 100% accurate. Always confirm fares with the operator.
        </p>
      </div>
    </div>
  );
}

export default function AIAssistant() {
  const { isOpen, isTyping, open, close } = useAIStore();

  return (
    <div className="fixed bottom-5 right-5 z-[100] flex flex-col items-end gap-3">
      {isOpen && (
        <div className="h-[560px] max-h-[calc(100vh-7rem)] w-[380px] max-w-[calc(100vw-2.5rem)]">
          <AIPanel onClose={close} />
        </div>
      )}
      <button
        onClick={isOpen ? close : open}
        disabled={isTyping}
        aria-label="Open TransPrice AI assistant"
        className={`relative flex h-14 w-14 items-center justify-center rounded-full text-white shadow-xl transition-all hover:scale-105 active:scale-95 ${AVATAR_GRADIENT} disabled:opacity-80`}
      >
        {!isOpen && (
          <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500" />
          </span>
        )}
        {isOpen ? <X size={22} /> : <Bot size={24} />}
      </button>
    </div>
  );
}