import { useEffect, useRef, useState } from 'react';
import {
  ArrowUpRight,
  Check,
  Copy,
  Mic,
  MicOff,
  Send,
  ShieldAlert,
  Trash2,
} from 'lucide-react';
import type { UiDictionary } from '../i18n/translations';
import type { ChatLanguageMode, ChatMessage, LanguageCode, ServiceItem } from '../types/seva';

interface ChatWorkspaceProps {
  dict: UiDictionary;
  uiLanguage: LanguageCode;
  chatLanguage: ChatLanguageMode;
  onChangeChatLanguage: (lang: ChatLanguageMode) => void;
  messages: ChatMessage[];
  isSending: boolean;
  onSendMessage: (text: string) => void;
  onClearConversation: () => void;
  onSelectServiceCard: (service: ServiceItem) => void;
  availableServices: ServiceItem[];
}

interface SpeechRecognitionInstance {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}

function getSpeechRecognitionConstructor(): (new () => SpeechRecognitionInstance) | null {
  if (typeof window === 'undefined') return null;
  const win = window as unknown as Record<string, unknown>;
  const ctor = win.SpeechRecognition || win.webkitSpeechRecognition;
  return typeof ctor === 'function' ? (ctor as new () => SpeechRecognitionInstance) : null;
}

function renderFormattedText(content: string) {
  const lines = content.split('\n');
  return (
    <div className="space-y-1.5 text-sm sm:text-[15px] leading-relaxed">
      {lines.map((line, index) => {
        const trimmed = line.trim();
        if (!trimmed) {
          return <div key={index} className="h-1" />;
        }
        if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
          return (
            <p key={index} className="font-display font-semibold text-[#0F1E36] pt-1">
              {trimmed.slice(2, -2)}
            </p>
          );
        }
        const urlMatch = trimmed.match(/(https?:\/\/[^\s]+)/);
        if (urlMatch) {
          const url = urlMatch[1];
          const before = trimmed.slice(0, urlMatch.index);
          const after = trimmed.slice((urlMatch.index ?? 0) + url.length);
          return (
            <p key={index}>
              {before}
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-[#15803D] underline underline-offset-2 hover:text-[#166534] break-all"
              >
                {url}
              </a>
              {after}
            </p>
          );
        }
        return <p key={index}>{trimmed}</p>;
      })}
    </div>
  );
}

export function ChatWorkspace({
  dict,
  uiLanguage,
  chatLanguage,
  onChangeChatLanguage,
  messages,
  isSending,
  onSendMessage,
  onClearConversation,
  onSelectServiceCard,
  availableServices,
}: ChatWorkspaceProps) {
  const [input, setInput] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [voiceNote, setVoiceNote] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const scrollEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    scrollEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, isSending]);

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = input.trim();
    if (!cleaned || isSending) return;
    setInput('');
    onSendMessage(cleaned);
  };

  const handleCopy = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId((curr) => (curr === id ? null : curr)), 2000);
    } catch {
      // Clipboard unavailable
    }
  };

  const handleVoiceToggle = () => {
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    const SpeechCtor = getSpeechRecognitionConstructor();
    if (!SpeechCtor) {
      setVoiceNote(dict.hero.micUnsupported);
      setTimeout(() => setVoiceNote(null), 3500);
      return;
    }

    const recognition = new SpeechCtor();
    const speechLocaleMap: Record<LanguageCode, string> = {
      en: 'en-IN',
      kn: 'kn-IN',
      hi: 'hi-IN',
    };
    const activeSpeechLang = chatLanguage === 'auto' ? uiLanguage : chatLanguage;
    recognition.lang = speechLocaleMap[activeSpeechLang];
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const transcript = event.results?.[0]?.[0]?.transcript ?? '';
      if (transcript) {
        setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
      }
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
    setVoiceNote(null);
    setIsListening(true);
    recognition.start();
  };

  const languageModes: Array<{ code: ChatLanguageMode; label: string }> = [
    { code: 'auto', label: dict.languageNames.auto },
    { code: 'en', label: dict.languageNames.en },
    { code: 'kn', label: dict.languageNames.kn },
    { code: 'hi', label: dict.languageNames.hi },
  ];

  return (
    <section
      aria-label={dict.chat.title}
      className="py-6 sm:py-10 bg-[#F8FAFC] min-h-[calc(100vh-4rem)]"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col min-h-[76vh]">
          {/* Workspace top toolbar */}
          <div className="px-4 sm:px-6 py-4 bg-[#0F1E36] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="font-display text-lg sm:text-xl font-bold tracking-tight">
                {dict.chat.title}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-0.5">{dict.chat.subtitle}</p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <div
                role="group"
                aria-label={dict.chat.languageLabel}
                className="flex items-center gap-1 p-1 bg-white/10 rounded-lg"
              >
                {languageModes.map((mode) => (
                  <button
                    key={mode.code}
                    type="button"
                    onClick={() => onChangeChatLanguage(mode.code)}
                    className={`px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      chatLanguage === mode.code
                        ? 'bg-white text-[#0F1E36]'
                        : 'text-slate-200 hover:text-white'
                    }`}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>

              {messages.length > 0 && (
                <button
                  type="button"
                  onClick={onClearConversation}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 hover:text-white bg-white/10 hover:bg-white/15 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer min-h-[36px]"
                >
                  <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                  {dict.chat.clearButton}
                </button>
              )}
            </div>
          </div>

          {/* Conversation thread */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-[#F8FAFC]">
            {messages.length === 0 ? (
              <div className="max-w-2xl mx-auto py-8 text-center">
                <h2 className="font-display text-xl font-semibold text-[#0F1E36]">
                  {dict.chat.welcomeTitle}
                </h2>
                <p className="mt-2 text-sm sm:text-base text-slate-600 leading-relaxed">
                  {dict.chat.welcomeBody}
                </p>

                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                  {dict.chat.starterPrompts.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => onSendMessage(prompt)}
                      className="p-3.5 text-sm text-slate-800 bg-white border border-slate-200 hover:border-[#0F1E36] rounded-xl transition-colors text-left cursor-pointer"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[90%] sm:max-w-[80%] rounded-2xl px-4 py-3.5 ${
                      msg.role === 'user'
                        ? 'bg-[#0F1E36] text-white'
                        : msg.isError
                          ? 'bg-red-50 border border-red-200 text-red-900'
                          : 'bg-white border border-slate-200 text-slate-800'
                    }`}
                  >
                    {msg.role === 'user' ? (
                      <p className="text-sm sm:text-[15px] leading-relaxed whitespace-pre-wrap">
                        {msg.content}
                      </p>
                    ) : (
                      <div>
                        {renderFormattedText(msg.content)}

                        {/* Official source links */}
                        {msg.sources && msg.sources.length > 0 && (
                          <div className="mt-4 pt-3 border-t border-slate-200">
                            <p className="text-xs font-semibold text-slate-500">
                              {dict.chat.sourcesHeading}
                            </p>
                            <div className="mt-2 flex flex-col gap-1.5">
                              {msg.sources.map((src) => (
                                <a
                                  key={src.id}
                                  href={src.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center justify-between gap-2 px-3 py-2 text-xs sm:text-sm font-medium text-[#15803D] bg-[#F8FAFC] border border-slate-200 hover:border-[#15803D] rounded-lg transition-colors"
                                >
                                  <span className="truncate">
                                    {src.title} · {src.portal_label}
                                  </span>
                                  <ArrowUpRight className="w-4 h-4 shrink-0" aria-hidden="true" />
                                </a>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Related services quick selector */}
                        {msg.relatedServices && msg.relatedServices.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-slate-200">
                            <p className="text-xs font-semibold text-slate-500">
                              {dict.chat.relatedHeading}
                            </p>
                            <div className="mt-2 flex flex-wrap gap-2">
                              {msg.relatedServices.map((rel) => {
                                const fullSvc = availableServices.find((s) => s.id === rel.id);
                                return (
                                  <button
                                    key={rel.id}
                                    type="button"
                                    onClick={() => {
                                      if (fullSvc) onSelectServiceCard(fullSvc);
                                    }}
                                    className="px-3 py-1.5 text-xs font-medium text-[#0F1E36] bg-[#F1F5F9] hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                                  >
                                    {rel.name}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Follow-up suggestions */}
                        {msg.suggestedFollowups && msg.suggestedFollowups.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-slate-200">
                            <p className="text-xs font-semibold text-slate-500">
                              {dict.chat.followupsHeading}
                            </p>
                            <div className="mt-2 flex flex-wrap gap-2">
                              {msg.suggestedFollowups.map((followup) => (
                                <button
                                  key={followup}
                                  type="button"
                                  disabled={isSending}
                                  onClick={() => onSendMessage(followup)}
                                  className="px-3 py-1.5 text-xs font-medium text-[#0F1E36] bg-white border border-slate-200 hover:border-[#0F1E36] rounded-lg transition-colors text-left cursor-pointer disabled:opacity-50"
                                >
                                  {followup}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Message actions row */}
                        <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between gap-4">
                          <span className="text-xs text-slate-400 tabular-nums">{msg.timestamp}</span>
                          <button
                            type="button"
                            onClick={() => handleCopy(msg.id, msg.content)}
                            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-[#0F1E36] cursor-pointer py-1"
                          >
                            {copiedId === msg.id ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-[#15803D]" aria-hidden="true" />
                                <span className="text-[#15803D]">{dict.chat.copiedLabel}</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                                <span>{dict.chat.copyButton}</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {msg.role === 'user' && (
                    <span className="mt-1 text-xs text-slate-400 tabular-nums">{msg.timestamp}</span>
                  )}
                </div>
              ))
            )}

            {isSending && (
              <div className="flex items-start">
                <div className="bg-white border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-600 flex items-center gap-2">
                  <span className="inline-flex gap-1" aria-hidden="true">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0F1E36] animate-bounce" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0F1E36] animate-bounce [animation-delay:120ms]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0F1E36] animate-bounce [animation-delay:240ms]" />
                  </span>
                  <span>{dict.chat.typingLabel}</span>
                </div>
              </div>
            )}

            <div ref={scrollEndRef} />
          </div>

          {/* Input composer & privacy banner */}
          <div className="border-t border-slate-200 bg-white p-4 sm:px-6">
            <div className="mb-2.5 flex items-start gap-2 text-xs text-slate-600">
              <ShieldAlert className="w-4 h-4 text-[#B45309] shrink-0 mt-0.5" aria-hidden="true" />
              <span>{dict.chat.privacyBanner}</span>
            </div>

            {voiceNote && (
              <p className="mb-2 text-xs text-[#B45309]" role="status">
                {voiceNote}
              </p>
            )}

            <form onSubmit={handleSubmit} className="flex items-center gap-2.5">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                maxLength={1000}
                placeholder={dict.chat.inputPlaceholder}
                aria-label={dict.chat.inputPlaceholder}
                className="flex-1 px-4 py-2.5 text-sm bg-[#F8FAFC] border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0F1E36] focus:ring-2 focus:ring-[#0F1E36]/15 min-h-[44px]"
              />

              <button
                type="button"
                onClick={handleVoiceToggle}
                aria-label={isListening ? dict.hero.micStop : dict.hero.micStart}
                title={isListening ? dict.hero.micStop : dict.hero.micStart}
                className={`inline-flex items-center justify-center w-11 h-11 rounded-xl border transition-colors shrink-0 cursor-pointer ${
                  isListening
                    ? 'bg-[#D97706] border-[#D97706] text-white'
                    : 'bg-white border-slate-200 text-slate-600 hover:text-[#0F1E36] hover:border-slate-300'
                }`}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              <button
                type="submit"
                disabled={isSending || input.trim().length < 2}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#0F1E36] hover:bg-[#1A3154] disabled:opacity-50 rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer min-h-[44px]"
              >
                <Send className="w-4 h-4" aria-hidden="true" />
                <span>{dict.chat.sendButton}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
