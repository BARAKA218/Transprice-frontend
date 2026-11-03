import { create } from 'zustand';
import { sendMessage } from '../services/aiService';

const WELCOME_MESSAGE = {
  id: 'welcome',
  role: 'ai',
  content:
    'Muraho 👋 I am **TRANSPRICE AI**, your transport pricing assistant for Rwanda. I can help you find verified fares, route options, fuel news and pricing insights across the country.',
  createdAt: 'demo',
};

let messageSeq = 0;

const nextId = () => `msg-${Date.now()}-${messageSeq++}`;

function buildSuggested() {
  return [
    { id: 'q1', label: 'How much is transport from Kigali to Muhanga?' },
    { id: 'q2', label: 'Find the cheapest transport option.' },
    { id: 'q3', label: 'Compare motorcycle and taxi prices.' },
    { id: 'q4', label: 'Explain this transport price.' },
    { id: 'q5', label: 'Show popular routes.' },
    { id: 'q6', label: "Give me today's transport insights." },
  ];
}

const useAIStore = create((set, get) => ({
  isOpen: false,
  isTyping: false,
  messages: [WELCOME_MESSAGE],
  suggested: buildSuggested(),
  error: null,
  context: {},

  open: () => set({ isOpen: true, error: null }),
  close: () => set({ isOpen: false }),

  openWith: async (content, context) => {
    set((s) => ({ isOpen: true, context: context || s.context, error: null }));
    const text = content.trim();
    if (text) await get().send(text);
  },

  setContext: (context) => set({ context }),

  send: async (content) => {
    const text = content.trim();
    if (!text || get().isTyping) return;

    const userMessage = { id: nextId(), role: 'user', content: text, createdAt: new Date().toISOString() };
    set((s) => ({
      messages: [...s.messages, userMessage],
      isTyping: true,
      error: null,
    }));

    try {
      const { context, messages } = get();
      const history = messages
        .filter((m) => m.role === 'ai' && m.id !== 'welcome')
        .map((m) => ({ role: 'assistant', content: m.content }));

      const reply = await sendMessage({ prompt: text, messages: history, context });

      set((s) => ({
        messages: [
          ...s.messages,
          { id: nextId(), role: 'ai', content: reply.text, sources: reply.sources || [], createdAt: new Date().toISOString() },
        ],
        isTyping: false,
      }));
    } catch (err) {
      set((s) => ({
        isTyping: false,
        error: err?.message || 'Something went wrong. Please try again later.',
        messages: [
          ...s.messages,
          { id: nextId(), role: 'ai', content: 'I had a problem reaching the AI service. Please check your connection and try again.', createdAt: new Date().toISOString() },
        ],
      }));
    }
  },

  clear: () =>
    set({
      messages: [WELCOME_MESSAGE],
      suggested: buildSuggested(),
      error: null,
    }),

  retry: async () => {
    const { messages } = get();
    const lastUser = [...messages].reverse().find((m) => m.role === 'user');
    if (lastUser) await get().send(lastUser.content);
  },

  removeMessage: (id) =>
    set((s) => ({ messages: s.messages.filter((m) => m.id !== id) })),
}));

export default useAIStore;