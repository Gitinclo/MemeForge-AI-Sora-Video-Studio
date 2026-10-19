import React, { useState } from 'react';
import {
  MessageSquare,
  Wand2,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  Brain,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  isUser: boolean;
  text: string;
  thinkingSteps?: string[] | null;
  timestamp: string;
}

interface AiDirectorChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyTextToMeme?: (top: string, bottom: string) => void;
}

export const AiDirectorChatModal: React.FC<AiDirectorChatModalProps> = ({
  isOpen,
  onClose,
  onApplyTextToMeme,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      isUser: false,
      text: "Yo! I'm your AI Meme Copilot & Co-Director. Tell me what scene you're working on, or ask for punchlines, font pairing advice, or viral TikTok pacing!",
      timestamp: 'Just now',
    },
  ]);
  const [input, setInput] = useState('');
  const [role, setRole] = useState('Meme Lord');
  const [deepThinking, setDeepThinking] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedThinkingId, setExpandedThinkingId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSend = async (textToSend = input) => {
    if (!textToSend.trim() || isLoading) return;
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      isUser: true,
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat-director', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages,
          role,
          deepThinking,
        }),
      });
      const data = await res.json();
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        isUser: false,
        text: data.reply || 'Check the top text setup vs bottom punchline contrast!',
        thinkingSteps: data.thinkingSteps || null,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (e: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          isUser: false,
          text: 'Pro-tip: Increase font size, add a heavy black text outline, and make the bottom text punchy!',
          timestamp: 'Just now',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col h-[650px] max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-purple-500/10 via-amber-500/10 to-indigo-500/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-purple-600 to-amber-500 text-white flex items-center justify-center shadow-lg">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>AI Co-Director &amp; Comedy Copilot</span>
              </h3>
              <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                <span>Persona:</span>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="bg-slate-950 text-amber-400 font-bold border border-slate-800 rounded px-1.5 py-0.5 text-[11px] focus:outline-none"
                >
                  <option value="Meme Lord">Meme Lord 👑</option>
                  <option value="Film Director">Film Director 🎬</option>
                  <option value="Viral Growth Marketer">Viral Marketer 📈</option>
                  <option value="Stand-up Comic">Stand-up Comic 🎤</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Thinking Mode Toggle */}
            <button
              onClick={() => setDeepThinking(!deepThinking)}
              className={`px-2 py-1 rounded-xl text-[10px] font-bold border flex items-center gap-1 transition-all ${
                deepThinking
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm'
                  : 'bg-slate-950 text-slate-500 border-slate-800'
              }`}
            >
              <Brain className="w-3 h-3 text-amber-400" />
              Thinking: {deepThinking ? 'HIGH' : 'OFF'}
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Message Thread */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${m.isUser ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-center gap-1.5 text-[10px] text-slate-500 mb-1 px-1">
                <span>{m.isUser ? 'You' : `${role} AI`}</span>
                <span>•</span>
                <span>{m.timestamp}</span>
              </div>

              {/* Thinking accordion if present */}
              {!m.isUser && m.thinkingSteps && m.thinkingSteps.length > 0 && (
                <div className="mb-1.5 max-w-[85%] rounded-xl bg-amber-500/10 border border-amber-500/20 p-2 text-xs">
                  <button
                    onClick={() =>
                      setExpandedThinkingId(expandedThinkingId === m.id ? null : m.id)
                    }
                    className="flex items-center justify-between w-full text-amber-300 font-bold text-[11px]"
                  >
                    <span className="flex items-center gap-1.5">
                      <Brain className="w-3.5 h-3.5" />
                      Gemini Thought Process ({m.thinkingSteps.length} steps)
                    </span>
                    {expandedThinkingId === m.id ? (
                      <ChevronUp className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5" />
                    )}
                  </button>
                  {expandedThinkingId === m.id && (
                    <div className="mt-2 space-y-1 text-slate-300 text-[11px] border-t border-amber-500/20 pt-1.5">
                      {m.thinkingSteps.map((step, idx) => (
                        <div key={idx} className="flex items-start gap-1.5">
                          <span className="text-amber-400 font-mono">•</span>
                          <span>{step}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div
                className={`p-3.5 rounded-2xl text-xs max-w-[85%] leading-relaxed ${
                  m.isUser
                    ? 'bg-amber-500 text-slate-950 font-semibold rounded-br-none shadow-md shadow-amber-500/10'
                    : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-bl-none shadow-sm'
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-slate-500 p-2">
              <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
              <span>{role} is analyzing viral dynamics...</span>
            </div>
          )}
        </div>

        {/* Suggestion Chips */}
        <div className="px-4 py-2 border-t border-slate-800/80 bg-slate-950/60 flex gap-1.5 overflow-x-auto scrollbar-none">
          {[
            'Give me 3 punchy jokes for this image',
            'Make it sound like Gen-Z slang',
            'Corporate meeting sarcasm idea',
            'How to pace a 5-second video cut?',
          ].map((promptText) => (
            <button
              key={promptText}
              onClick={() => handleSend(promptText)}
              className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 hover:border-amber-400/80 text-[11px] text-slate-300 hover:text-white whitespace-nowrap transition-colors"
            >
              {promptText}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-slate-800 bg-slate-950 flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSend();
            }}
            placeholder={`Ask ${role} for captions, punchlines, or pacing...`}
            className="flex-1 px-3.5 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isLoading}
            className="p-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-all disabled:opacity-40"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
