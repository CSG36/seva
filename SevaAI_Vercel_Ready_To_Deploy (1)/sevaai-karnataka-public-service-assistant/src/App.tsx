import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ArrowUpRight,
  CheckCircle2,
  Download,
  ExternalLink,
  Globe,
  Lock,
  Mic,
  MicOff,
  Send,
  ShieldCheck,
} from 'lucide-react';
import { ChatWorkspace } from './components/ChatWorkspace';
import { Header } from './components/Header';
import { ImageWithFallback } from './components/ImageWithFallback';
import { ServicesCatalog } from './components/ServicesCatalog';
import { TRANSLATIONS } from './i18n/translations';
import {
  fetchServices,
  getApiUrl,
  sendChatMessage,
  submitContactInquiry,
} from './lib/api';
import type {
  ChatLanguageMode,
  ChatMessage,
  LanguageCode,
  ServiceItem,
} from './types/seva';

const HERO_IMAGE = '/src/assets/images/vidhana_soudha_hero_1794987233719.jpg';
const GUIDANCE_IMAGE = '/src/assets/images/citizen_service_guidance_1794987234388.jpg';
const CIVIC_ACCESS_IMAGE = '/src/assets/images/karnataka_civic_access_1794987235366.jpg';

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

function getSpeechCtor(): (new () => SpeechRecognitionInstance) | null {
  if (typeof window === 'undefined') return null;
  const win = window as unknown as Record<string, unknown>;
  const ctor = win.SpeechRecognition || win.webkitSpeechRecognition;
  return typeof ctor === 'function' ? (ctor as new () => SpeechRecognitionInstance) : null;
}

function formatTimeNow(): string {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function App() {
  const [language, setLanguage] = useState<LanguageCode>('en');
  const [chatLanguage, setChatLanguage] = useState<ChatLanguageMode>('auto');
  const [activeView, setActiveView] = useState<'landing' | 'assistant'>('landing');

  const [services, setServices] = useState<ServiceItem[]>([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [servicesError, setServicesError] = useState<string | null>(null);

  const [heroQuestion, setHeroQuestion] = useState('');
  const [heroListening, setHeroListening] = useState(false);
  const [heroVoiceMessage, setHeroVoiceMessage] = useState<string | null>(null);
  const heroSpeechRef = useRef<SpeechRecognitionInstance | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isSending, setIsSending] = useState(false);

  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactError, setContactError] = useState<string | null>(null);
  const [contactSuccess, setContactSuccess] = useState<string | null>(null);
  const [contactSubmitting, setContactSubmitting] = useState(false);
  const [zipDownloading, setZipDownloading] = useState(false);
  const [zipStatus, setZipStatus] = useState<string | null>(null);

  const dict = TRANSLATIONS[language];

  const loadCatalogue = useCallback(async (lang: LanguageCode) => {
    setServicesLoading(true);
    setServicesError(null);
    try {
      const items = await fetchServices(lang);
      setServices(items);
    } catch {
      setServicesError('Unable to fetch services');
    } finally {
      setServicesLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadCatalogue(language);
  }, [language, loadCatalogue]);

  useEffect(() => {
    return () => {
      heroSpeechRef.current?.stop();
    };
  }, []);

  const handleLanguageSelect = (nextLang: LanguageCode) => {
    setLanguage(nextLang);
    if (chatLanguage !== 'auto') {
      setChatLanguage(nextLang);
    }
  };

  const handleSendChat = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (trimmed.length < 2 || isSending) return;

      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: trimmed,
        timestamp: formatTimeNow(),
      };

      const historySnapshot = messages
        .filter((m) => !m.isError)
        .map((m) => ({ role: m.role, content: m.content }));

      setMessages((prev) => [...prev, userMsg]);
      setActiveView('assistant');
      setIsSending(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });

      try {
        const effectiveLang: ChatLanguageMode =
          chatLanguage === 'auto' ? 'auto' : chatLanguage;
        const response = await sendChatMessage(trimmed, effectiveLang, historySnapshot);

        const assistantMsg: ChatMessage = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: response.answer,
          timestamp: formatTimeNow(),
          language: response.language,
          sources: response.sources,
          relatedServices: response.related_services,
          suggestedFollowups: response.suggested_followups,
          disclaimer: response.disclaimer,
        };
        setMessages((prev) => [...prev, assistantMsg]);
      } catch (err) {
        const errorText =
          err instanceof Error ? err.message : dict.chat.retryAction;
        setMessages((prev) => [
          ...prev,
          {
            id: `err-${Date.now()}`,
            role: 'assistant',
            content: errorText,
            timestamp: formatTimeNow(),
            isError: true,
          },
        ]);
      } finally {
        setIsSending(false);
      }
    },
    [chatLanguage, dict.chat.retryAction, isSending, messages]
  );

  const handleHeroSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = heroQuestion.trim();
    if (cleaned.length < 2) return;
    setHeroQuestion('');
    void handleSendChat(cleaned);
  };

  const handleHeroVoice = () => {
    if (heroListening && heroSpeechRef.current) {
      heroSpeechRef.current.stop();
      setHeroListening(false);
      return;
    }

    const SpeechCtor = getSpeechCtor();
    if (!SpeechCtor) {
      setHeroVoiceMessage(dict.hero.micUnsupported);
      setTimeout(() => setHeroVoiceMessage(null), 3500);
      return;
    }

    const recognition = new SpeechCtor();
    const localeMap: Record<LanguageCode, string> = {
      en: 'en-IN',
      kn: 'kn-IN',
      hi: 'hi-IN',
    };
    recognition.lang = localeMap[language];
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const transcript = event.results?.[0]?.[0]?.transcript ?? '';
      if (transcript) {
        setHeroQuestion((prev) => (prev ? `${prev} ${transcript}` : transcript));
      }
    };
    recognition.onerror = () => setHeroListening(false);
    recognition.onend = () => setHeroListening(false);

    heroSpeechRef.current = recognition;
    setHeroVoiceMessage(null);
    setHeroListening(true);
    recognition.start();
  };

  const handleExploreService = (svc: ServiceItem) => {
    const queryTemplates: Record<LanguageCode, string> = {
      en: `Tell me about ${svc.name} and how to use it.`,
      kn: `${svc.name} ಬಗ್ಗೆ ಮಾಹಿತಿ ನೀಡಿ ಮತ್ತು ಅದನ್ನು ಹೇಗೆ ಬಳಸುವುದು?`,
      hi: `${svc.name} के बारे में जानकारी दें और इसका उपयोग कैसे करें?`,
    };
    void handleSendChat(queryTemplates[language]);
  };

  const handleNavigateSection = (sectionId: string) => {
    if (activeView !== 'landing') {
      setActiveView('landing');
      setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
      }, 60);
    } else {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setContactError(null);
    setContactSuccess(null);

    const name = contactName.trim();
    const email = contactEmail.trim();
    const message = contactMessage.trim();

    if (name.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || message.length < 5) {
      setContactError(dict.contact.validationError);
      return;
    }

    setContactSubmitting(true);
    try {
      await submitContactInquiry({ name, email, message });
      setContactSuccess(dict.contact.successMessage);
      setContactName('');
      setContactEmail('');
      setContactMessage('');
    } catch (err) {
      setContactError(err instanceof Error ? err.message : dict.contact.validationError);
    } finally {
      setContactSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#0F172A]">
      <Header
        dict={dict}
        activeView={activeView}
        onNavigateSection={handleNavigateSection}
        onToggleAssistant={() =>
          setActiveView((prev) => (prev === 'landing' ? 'assistant' : 'landing'))
        }
      />

      {activeView === 'assistant' ? (
        <main className="flex-1">
          <ChatWorkspace
            dict={dict}
            uiLanguage={language}
            chatLanguage={chatLanguage}
            onChangeChatLanguage={setChatLanguage}
            messages={messages}
            isSending={isSending}
            onSendMessage={(txt) => void handleSendChat(txt)}
            onClearConversation={() => setMessages([])}
            onSelectServiceCard={handleExploreService}
            availableServices={services}
          />
        </main>
      ) : (
        <main className="flex-1">
          {/* 1. Hero Section */}
          <section id="home" className="py-12 sm:py-16 lg:py-20 bg-[#F8FAFC]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
                {/* Left column: Language switcher, headline, main question input, suggested questions */}
                <div className="lg:col-span-7 flex flex-col justify-center">
                  {/* Language Selector */}
                  <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-200">
                    <span className="text-xs sm:text-sm font-medium text-slate-600">
                      {dict.hero.kicker}
                    </span>

                    <div
                      role="group"
                      aria-label="Select interface language"
                      className="inline-flex items-center gap-1 p-1 bg-slate-200/70 rounded-lg"
                    >
                      {(['en', 'kn', 'hi'] as LanguageCode[]).map((code) => (
                        <button
                          key={code}
                          type="button"
                          onClick={() => handleLanguageSelect(code)}
                          className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer min-h-[36px] ${
                            language === code
                              ? 'bg-white text-[#0F1E36] shadow-sm'
                              : 'text-slate-600 hover:text-[#0F1E36]'
                          }`}
                        >
                          {dict.languageNames[code]}
                        </button>
                      ))}
                    </div>
                  </div>

                  <h1 className="mt-7 font-display text-3xl sm:text-5xl font-bold tracking-tight text-[#0F1E36] leading-[1.12] text-balance">
                    {dict.hero.heading}
                  </h1>

                  <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
                    {dict.hero.subheading}
                  </p>

                  {/* Main question input */}
                  <form onSubmit={handleHeroSubmit} className="mt-8">
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 p-2 bg-white border border-slate-200 rounded-xl shadow-sm focus-within:border-[#0F1E36] focus-within:ring-2 focus-within:ring-[#0F1E36]/15">
                      <input
                        type="text"
                        value={heroQuestion}
                        onChange={(e) => setHeroQuestion(e.target.value)}
                        maxLength={1000}
                        placeholder={dict.hero.inputPlaceholder}
                        aria-label={dict.hero.inputPlaceholder}
                        className="flex-1 px-3 py-2.5 text-sm sm:text-base bg-transparent text-slate-900 placeholder:text-slate-400 focus:outline-none min-h-[44px]"
                      />

                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={handleHeroVoice}
                          aria-label={heroListening ? dict.hero.micStop : dict.hero.micStart}
                          title={heroListening ? dict.hero.micStop : dict.hero.micStart}
                          className={`inline-flex items-center justify-center w-11 h-11 rounded-lg border transition-colors shrink-0 cursor-pointer ${
                            heroListening
                              ? 'bg-[#D97706] border-[#D97706] text-white'
                              : 'bg-[#F8FAFC] border-slate-200 text-slate-600 hover:text-[#0F1E36]'
                          }`}
                        >
                          {heroListening ? (
                            <MicOff className="w-4 h-4" />
                          ) : (
                            <Mic className="w-4 h-4" />
                          )}
                        </button>

                        <button
                          type="submit"
                          disabled={heroQuestion.trim().length < 2}
                          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#0F1E36] hover:bg-[#1A3154] disabled:opacity-60 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer min-h-[44px]"
                        >
                          <Send className="w-4 h-4" aria-hidden="true" />
                          <span>{dict.hero.sendButton}</span>
                        </button>
                      </div>
                    </div>

                    {heroVoiceMessage && (
                      <p className="mt-2 text-xs text-[#B45309]" role="status">
                        {heroVoiceMessage}
                      </p>
                    )}
                  </form>

                  {/* Suggested questions */}
                  <div className="mt-6">
                    <p className="text-xs font-medium text-slate-500">
                      {dict.hero.suggestedLabel}
                    </p>
                    <div className="mt-2.5 flex flex-wrap gap-2">
                      {dict.hero.suggestedQuestions.map((question) => (
                        <button
                          key={question}
                          type="button"
                          onClick={() => void handleSendChat(question)}
                          className="px-3.5 py-2 text-xs sm:text-sm font-medium text-[#0F1E36] bg-white border border-slate-200 hover:border-[#0F1E36] rounded-lg transition-colors text-left cursor-pointer"
                        >
                          {question}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right column: Civic landmark photograph */}
                <div className="lg:col-span-5 flex">
                  <div className="relative w-full min-h-[300px] lg:min-h-[440px] rounded-2xl overflow-hidden border border-slate-200 bg-slate-900">
                    <ImageWithFallback
                      src={HERO_IMAGE}
                      alt="Vidhana Soudha in Bengaluru, Karnataka"
                      fallbackLabel="Vidhana Soudha, Bengaluru"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/85 via-slate-950/45 to-transparent p-5">
                      <p className="text-xs sm:text-sm text-white/95 font-medium leading-snug">
                        {dict.hero.imageCaption}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 2. Popular Government Services */}
          <ServicesCatalog
            dict={dict}
            services={services}
            loading={servicesLoading}
            error={servicesError}
            onRetry={() => void loadCatalogue(language)}
            onExploreService={handleExploreService}
          />

          {/* 3. How SevaAI Works & Why Use SevaAI */}
          <section id="how-it-works" className="py-16 sm:py-20 bg-[#F8FAFC] border-t border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                <div className="lg:col-span-7">
                  <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#0F1E36] text-balance">
                    {dict.howItWorks.sectionTitle}
                  </h2>
                  <p className="mt-3 text-base text-slate-600 leading-relaxed">
                    {dict.howItWorks.sectionSubtitle}
                  </p>

                  <div className="mt-8 divide-y divide-slate-200 border-t border-b border-slate-200">
                    {dict.howItWorks.steps.map((step) => (
                      <div key={step.number} className="py-6 flex gap-4 sm:gap-6">
                        <span className="font-display text-lg font-bold text-[#B45309] tabular-nums shrink-0">
                          {step.number}
                        </span>
                        <div>
                          <h3 className="font-display text-base sm:text-lg font-semibold text-[#0F1E36]">
                            {step.title}
                          </h3>
                          <p className="mt-1.5 text-sm sm:text-base text-slate-600 leading-relaxed">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="lg:col-span-5">
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-slate-200 bg-white">
                    <ImageWithFallback
                      src={GUIDANCE_IMAGE}
                      alt="Citizen and service advisor reviewing government portal guidance in Bengaluru"
                      fallbackLabel="Citizen Facilitation Guidance"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>

              {/* Why Use SevaAI */}
              <div className="mt-16 pt-14 border-t border-slate-200 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                <div className="lg:col-span-5 order-2 lg:order-1">
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-slate-200 bg-white">
                    <ImageWithFallback
                      src={CIVIC_ACCESS_IMAGE}
                      alt="Karnataka digital public access courtyard"
                      fallbackLabel="Karnataka Civic Access"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <div className="lg:col-span-7 order-1 lg:order-2">
                  <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#0F1E36] text-balance">
                    {dict.howItWorks.whyTitle}
                  </h2>
                  <p className="mt-3 text-base text-slate-600 leading-relaxed">
                    {dict.howItWorks.whySubtitle}
                  </p>

                  <div className="mt-8 space-y-6">
                    {dict.howItWorks.benefits.map((benefit, idx) => {
                      const icons = [ShieldCheck, Globe, Lock];
                      const Icon = icons[idx % icons.length];
                      return (
                        <div
                          key={benefit.title}
                          className="p-5 bg-white border border-slate-200 rounded-xl flex items-start gap-4"
                        >
                          <div className="w-10 h-10 rounded-lg bg-[#0F1E36]/5 text-[#0F1E36] flex items-center justify-center shrink-0">
                            <Icon className="w-5 h-5" aria-hidden="true" />
                          </div>
                          <div>
                            <h3 className="font-display text-base font-semibold text-[#0F1E36]">
                              {benefit.title}
                            </h3>
                            <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                              {benefit.description}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 4. About & Contact + Download ZIP */}
          <section id="about" className="py-16 sm:py-20 bg-white border-t border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12">
              <div className="lg:col-span-6">
                <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#0F1E36] text-balance">
                  {dict.about.sectionTitle}
                </h2>
                <p className="mt-3 text-base text-slate-600 leading-relaxed">
                  {dict.about.sectionSubtitle}
                </p>

                <div className="mt-8 p-6 bg-[#F8FAFC] border border-slate-200 rounded-xl">
                  <h3 className="font-display text-base font-semibold text-[#0F1E36]">
                    {dict.about.architectureTitle}
                  </h3>
                  <ul className="mt-3 space-y-2.5 text-sm text-slate-700">
                    {dict.about.architecturePoints.map((point) => (
                      <li key={point} className="flex items-start gap-2.5">
                        <CheckCircle2
                          className="w-4 h-4 text-[#15803D] shrink-0 mt-0.5"
                          aria-hidden="true"
                        />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>


              </div>

              <div id="contact" className="lg:col-span-6">
                <div className="p-6 sm:p-8 bg-[#F8FAFC] border border-slate-200 rounded-2xl">
                  <h2 className="font-display text-2xl font-bold tracking-tight text-[#0F1E36]">
                    {dict.contact.sectionTitle}
                  </h2>
                  <p className="mt-2 text-sm sm:text-base text-slate-600 leading-relaxed">
                    {dict.contact.sectionSubtitle}
                  </p>

                  <form onSubmit={handleContactSubmit} className="mt-6 space-y-4" noValidate>
                    <div>
                      <label
                        htmlFor="contact-name"
                        className="block text-sm font-medium text-slate-700 mb-1.5"
                      >
                        {dict.contact.nameLabel}
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        placeholder={dict.contact.namePlaceholder}
                        className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-[#0F1E36] focus:ring-2 focus:ring-[#0F1E36]/15 min-h-[44px]"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="contact-email"
                        className="block text-sm font-medium text-slate-700 mb-1.5"
                      >
                        {dict.contact.emailLabel}
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        placeholder={dict.contact.emailPlaceholder}
                        className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-[#0F1E36] focus:ring-2 focus:ring-[#0F1E36]/15 min-h-[44px]"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="contact-message"
                        className="block text-sm font-medium text-slate-700 mb-1.5"
                      >
                        {dict.contact.messageLabel}
                      </label>
                      <textarea
                        id="contact-message"
                        rows={4}
                        value={contactMessage}
                        onChange={(e) => setContactMessage(e.target.value)}
                        placeholder={dict.contact.messagePlaceholder}
                        className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-[#0F1E36] focus:ring-2 focus:ring-[#0F1E36]/15"
                      />
                    </div>

                    {contactError && (
                      <p className="text-sm text-red-700 bg-red-50 border border-red-200 px-3.5 py-2.5 rounded-lg" role="alert">
                        {contactError}
                      </p>
                    )}

                    {contactSuccess && (
                      <p className="text-sm text-[#15803D] bg-emerald-50 border border-emerald-200 px-3.5 py-2.5 rounded-lg" role="status">
                        {contactSuccess}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={contactSubmitting}
                      className="px-5 py-2.5 text-sm font-semibold text-white bg-[#0F1E36] hover:bg-[#1A3154] disabled:opacity-60 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer min-h-[44px]"
                    >
                      {contactSubmitting
                        ? dict.contact.submittingButton
                        : dict.contact.submitButton}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </section>
        </main>
      )}

      {/* Footer */}
      <footer className="bg-[#0F1E36] text-slate-300 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-5">
            <span className="font-display text-lg font-bold text-white">SevaAI</span>
            <h3 className="mt-4 text-xs font-semibold text-[#FBBF24]">
              {dict.footer.disclaimerTitle}
            </h3>
            <p className="mt-1.5 text-xs sm:text-sm text-slate-300 leading-relaxed">
              {dict.footer.disclaimerBody}
            </p>
          </div>

          <div className="md:col-span-7">
            <h3 className="text-sm font-semibold text-white">{dict.footer.directoryTitle}</h3>
            <ul className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs sm:text-sm">
              {services.map((svc) => (
                <li key={svc.id}>
                  <a
                    href={svc.official_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                    <span className="truncate">{svc.name}</span>
                    <ArrowUpRight className="w-3 h-3 opacity-70 shrink-0" aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
            <span>{dict.footer.copyright}</span>
            <span>English · ಕನ್ನಡ · हिन्दी</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
