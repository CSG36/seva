import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export type LanguageCode = 'en' | 'kn' | 'hi';
export type RequestedLanguage = LanguageCode | 'auto';

export interface HistoryTurn {
  role: 'user' | 'assistant';
  content: string;
}

export interface ServiceRecord {
  id: string;
  name: Record<LanguageCode, string>;
  category: Record<LanguageCode, string>;
  department: Record<LanguageCode, string>;
  description: Record<LanguageCode, string>;
  next_steps: Record<LanguageCode, string[]>;
  official_url: string;
  portal_label: string;
  keywords: string[];
  suggested_followups: Record<LanguageCode, string>;
}

interface KnowledgeBase {
  catalogue_metadata: Record<string, unknown>;
  services: ServiceRecord[];
}

export interface SourceItem {
  id: string;
  title: string;
  url: string;
  portal_label: string;
  department: string;
}

export interface RelatedServiceItem {
  id: string;
  name: string;
  category: string;
  description: string;
  official_url: string;
}

export interface ChatResponsePayload {
  answer: string;
  language: LanguageCode;
  detected_language: LanguageCode;
  translation_provider: string;
  sources: SourceItem[];
  related_services: RelatedServiceItem[];
  suggested_followups: string[];
  disclaimer: string;
}

function resolveKnowledgePath(): string {
  const currentDir = path.dirname(fileURLToPath(import.meta.url));
  const candidates = [
    path.resolve(process.cwd(), 'backend/knowledge/karnataka_services.json'),
    path.resolve(currentDir, '../backend/knowledge/karnataka_services.json'),
    path.resolve(currentDir, '../../backend/knowledge/karnataka_services.json'),
  ];
  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }
  return candidates[0];
}

let cachedKnowledge: KnowledgeBase | null = null;

export function getServices(): ServiceRecord[] {
  if (!cachedKnowledge) {
    const raw = fs.readFileSync(resolveKnowledgePath(), 'utf-8');
    cachedKnowledge = JSON.parse(raw) as KnowledgeBase;
  }
  return cachedKnowledge.services;
}

const SENSITIVE_PATTERNS: RegExp[] = [
  /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/,
  /\b(?:otp|one time password|pin|cvv|password|passcode|bank account|ifsc|aadhaar number)\b/i,
];

const ENGLISH_SYNONYMS: Record<string, string[]> = {
  ration: ['ahara', 'food', 'pds', 'bpl', 'apl', 'fair price'],
  card: ['ration', 'ahara'],
  certificate: ['seva sindhu', 'bengaluru urban', 'caste', 'income', 'birth', 'death'],
  scheme: ['seva sindhu', 'guarantee', 'welfare'],
  apply: ['seva sindhu', 'seva one', 'karnataka one'],
  bill: ['karnataka one', 'electricity', 'water', 'utility', 'municipal'],
  utility: ['karnataka one', 'bill'],
  bengaluru: ['bengaluru urban', 'district', 'citizen services'],
  bangalore: ['bengaluru urban', 'district', 'citizen services'],
  grievance: ['bengaluru urban', 'citizen services', 'sakala'],
  district: ['bengaluru urban district', 'deputy commissioner', 'notices', 'taluk'],
  portal: ['seva sindhu', 'seva one', 'karnataka one', 'ahara', 'bengaluru urban'],
  government: ['seva sindhu', 'seva one', 'karnataka one', 'bengaluru urban'],
  karnataka: ['seva sindhu', 'seva one', 'karnataka one', 'ahara'],
};

const TEMPLATES: Record<
  LanguageCode,
  {
    sensitive_warning: string;
    single_intro: string;
    multi_intro: string;
    general_intro: string;
    unverified: string;
    department_label: string;
    official_portal_label: string;
    next_steps_label: string;
    kannada_hint: string;
    default_followup: string;
    disclaimer: string;
  }
> = {
  en: {
    sensitive_warning:
      'For your security, please do not share sensitive personal details such as Aadhaar numbers, OTPs, passwords, or bank account details. SevaAI never collects personal credentials or submits government applications on your behalf. Please visit the official Government of Karnataka portals directly using verified links.',
    single_intro:
      'Based on the verified Karnataka government service catalogue, here is the relevant official portal:',
    multi_intro:
      'Multiple verified Karnataka government portals match your question. Please review the options below:',
    general_intro: 'Here are the verified official Government of Karnataka portals in our directory:',
    unverified:
      'I could not verify specific details for your exact request in our current Karnataka service catalogue. To avoid inaccurate guidance, SevaAI does not guess eligibility rules, fees, document lists, or deadlines. Please check the official Karnataka government portals below for authoritative information:',
    department_label: 'Department',
    official_portal_label: 'Official Portal',
    next_steps_label: 'Recommended next steps',
    kannada_hint: 'Can you explain this in Kannada?',
    default_followup: 'Where can I find ration-card services?',
    disclaimer:
      'Verified guidance from official Karnataka government portal records. Confirm details directly on the official portal.',
  },
  kn: {
    sensitive_warning:
      'ನಿಮ್ಮ ಸುರಕ್ಷತೆಗಾಗಿ ದಯವಿಟ್ಟು ಆಧಾರ್ ಸಂಖ್ಯೆ, OTP, ಪಾಸ್‌ವರ್ಡ್ ಅಥವಾ ಬ್ಯಾಂಕ್ ಖಾತೆ ವಿವರಗಳಂತಹ ಸೂಕ್ಷ್ಮ ವೈಯಕ್ತಿಕ ಮಾಹಿತಿಯನ್ನು ಹಂಚಿಕೊಳ್ಳಬೇಡಿ. SevaAI ವೈಯಕ್ತಿಕ ದಾಖಲೆಗಳನ್ನು ಸಂಗ್ರಹಿಸುವುದಿಲ್ಲ ಅಥವಾ ನಿಮ್ಮ ಪರವಾಗಿ ಅರ್ಜಿಗಳನ್ನು ಸಲ್ಲಿಸುವುದಿಲ್ಲ. ದಯವಿಟ್ಟು ಕೆಳಗಿನ ಅಧಿಕೃತ ಸರ್ಕಾರಿ ಪೋರ್ಟಲ್‌ಗಳನ್ನು ನೇರವಾಗಿ ಬಳಸಿ.',
    single_intro: 'ಪರಿಶೀಲಿಸಲಾದ ಕರ್ನಾಟಕ ಸರ್ಕಾರಿ ಸೇವಾ ಪಟ್ಟಿಯ ಪ್ರಕಾರ, ಸಂಬಂಧಿತ ಅಧಿಕೃತ ಪೋರ್ಟಲ್ ಮಾಹಿತಿ ಇಲ್ಲಿದೆ:',
    multi_intro: 'ನಿಮ್ಮ ಪ್ರಶ್ನೆಗೆ ಸಂಬಂಧಿಸಿದಂತೆ ಕರ್ನಾಟಕ ಸರ್ಕಾರದ ಹಲವು ಅಧಿಕೃತ ಪೋರ್ಟಲ್‌ಗಳು ಕಂಡುಬಂದಿವೆ:',
    general_intro: 'ನಮ್ಮ ಪಟ್ಟಿಯಲ್ಲಿರುವ ಕರ್ನಾಟಕ ಸರ್ಕಾರದ ಪರಿಶೀಲಿತ ಅಧಿಕೃತ ಪೋರ್ಟಲ್‌ಗಳು ಇಲ್ಲಿವೆ:',
    unverified:
      'ಪ್ರಸ್ತುತ ಕರ್ನಾಟಕ ಸೇವಾ ಪಟ್ಟಿಯಲ್ಲಿ ನಿಮ್ಮ ನಿರ್ದಿಷ್ಟ ಪ್ರಶ್ನೆಗೆ ಖಚಿತ ಮಾಹಿತಿ ಕಂಡುಬಂದಿಲ್ಲ. ತಪ್ಪು ಮಾಹಿತಿಯನ್ನು ತಪ್ಪಿಸಲು SevaAI ಶುಲ್ಕ, ಅರ್ಹತೆ ಅಥವಾ ದಾಖಲೆ ನಿಯಮಗಳನ್ನು ಊಹಿಸುವುದಿಲ್ಲ. ದಯವಿಟ್ಟು ಅಧಿಕೃತ ಮಾಹಿತಿಗಾಗಿ ಕೆಳಗಿನ ಕರ್ನಾಟಕ ಸರ್ಕಾರದ ಪೋರ್ಟಲ್‌ಗಳನ್ನು ಪರಿಶೀಲಿಸಿ:',
    department_label: 'ಇಲಾಖೆ',
    official_portal_label: 'ಅಧಿಕೃತ ಪೋರ್ಟಲ್',
    next_steps_label: 'ಮುಂದಿನ ಹಂತಗಳು',
    kannada_hint: 'ಸೇವಾ ಸಿಂಧು ಪೋರ್ಟಲ್ ಹೇಗೆ ಬಳಸುವುದು?',
    default_followup: 'ಕರ್ನಾಟಕದಲ್ಲಿ ರೇಷನ್ ಕಾರ್ಡ್ ಸೇವೆಗಳು ಎಲ್ಲಿ ಸಿಗುತ್ತವೆ?',
    disclaimer:
      'ಕರ್ನಾಟಕ ಸರ್ಕಾರದ ಪರಿಶೀಲಿತ ಪೋರ್ಟಲ್ ದಾಖಲೆಗಳಿಂದ ಪಡೆದ ಮಾಹಿತಿ. ದಯವಿಟ್ಟು ಅಧಿಕೃತ ಪೋರ್ಟಲ್‌ನಲ್ಲಿ ವಿವರಗಳನ್ನು ದೃಢೀಕರಿಸಿ.',
  },
  hi: {
    sensitive_warning:
      'आपकी सुरक्षा के लिए कृपया आधार नंबर, OTP, पासवर्ड या बैंक खाता विवरण जैसी संवेदनशील व्यक्तिगत जानकारी साझा न करें। SevaAI व्यक्तिगत विवरण एकत्र नहीं करता और न ही आपकी ओर से आवेदन जमा करता है। कृपया नीचे दिए गए आधिकारिक कर्नाटक सरकारी पोर्टल का सीधे उपयोग करें।',
    single_intro: 'सत्यापित कर्नाटक सरकारी सेवा सूची के अनुसार, संबंधित आधिकारिक पोर्टल की जानकारी यहां है:',
    multi_intro: 'आपके प्रश्न से जुड़े कई सत्यापित कर्नाटक सरकारी पोर्टल उपलब्ध हैं। कृपया नीचे दिए गए विकल्प देखें:',
    general_intro: 'हमारी निर्देशिका में उपलब्ध सत्यापित कर्नाटक सरकारी पोर्टल इस प्रकार हैं:',
    unverified:
      'वर्तमान कर्नाटक सेवा निर्देशिका में आपके सटीक प्रश्न के लिए सत्यापित जानकारी नहीं मिल सकी। गलत जानकारी से बचने के लिए SevaAI पात्रता नियम, शुल्क, समय-सीमा या दस्तावेज़ सूची का अनुमान नहीं लगाता। कृपया प्रामाणिक जानकारी के लिए नीचे दिए गए आधिकारिक कर्नाटक पोर्टल देखें:',
    department_label: 'विभाग',
    official_portal_label: 'आधिकारिक पोर्टल',
    next_steps_label: 'अगले कदम',
    kannada_hint: 'सेवा सिंधु पोर्टल कैसे उपयोग करें?',
    default_followup: 'कर्नाटक में राशन कार्ड की सेवाएं कहां मिलेंगी?',
    disclaimer:
      'आधिकारिक कर्नाटक सरकारी पोर्टल रिकॉर्ड पर आधारित सत्यापित मार्गदर्शन। कृपया आधिकारिक पोर्टल पर विवरण की पुष्टि करें।',
  },
};

export function detectLanguage(text: string): LanguageCode {
  if (/[\u0C80-\u0CFF]/.test(text)) {
    return 'kn';
  }
  if (/[\u0900-\u097F]/.test(text)) {
    return 'hi';
  }
  const lowered = text.toLowerCase();
  if (lowered.includes('in kannada') || (lowered.includes('kannada') && (lowered.includes('explain') || lowered.includes('tell')))) {
    return 'kn';
  }
  if (lowered.includes('in hindi') || (lowered.includes('hindi') && (lowered.includes('explain') || lowered.includes('tell')))) {
    return 'hi';
  }
  return 'en';
}

export function containsSensitiveData(text: string): boolean {
  return SENSITIVE_PATTERNS.some((pattern) => pattern.test(text));
}

function tokenize(text: string): string[] {
  const matches = text.toLowerCase().match(/[\p{L}\p{N}_]+/gu) ?? [];
  return matches.filter((tok) => tok.length >= 2);
}

function isGeneralOverviewQuery(text: string): boolean {
  const lowered = text.toLowerCase();
  const phrases = [
    'karnataka government service',
    'karnataka government services',
    'which official portal',
    'all portals',
    'available services',
    'how can i apply for a karnataka',
    'ಸರ್ಕಾರಿ ಸೇವೆ',
    'ಯಾವ ಪೋರ್ಟಲ್',
    'सरकारी सेवा',
    'कौन सा पोर्टल',
  ];
  return phrases.some((p) => lowered.includes(p));
}

export function searchServices(query: string, history?: HistoryTurn[]): ServiceRecord[] {
  const services = getServices();
  const tokens = tokenize(query);
  const expanded = new Set<string>(tokens);
  for (const tok of tokens) {
    for (const syn of ENGLISH_SYNONYMS[tok] ?? []) {
      for (const sTok of tokenize(syn)) {
        expanded.add(sTok);
      }
    }
  }

  if (history && tokens.length <= 5) {
    const recentUserText = history
      .filter((t) => t.role === 'user')
      .slice(-4)
      .map((t) => t.content)
      .join(' ');
    for (const rTok of tokenize(recentUserText)) {
      expanded.add(rTok);
    }
  }

  const loweredQuery = query.toLowerCase();
  const scored: Array<{ score: number; svc: ServiceRecord }> = [];

  for (const svc of services) {
    let score = 0;
    const namesAll = Object.values(svc.name).join(' ').toLowerCase();
    const categoriesAll = Object.values(svc.category).join(' ').toLowerCase();
    const descriptionsAll = Object.values(svc.description).join(' ').toLowerCase();
    const keywordsAll = svc.keywords.join(' ').toLowerCase();

    for (const kw of svc.keywords) {
      if (loweredQuery.includes(kw.toLowerCase())) {
        score += 12;
      }
    }

    for (const tok of expanded) {
      if (namesAll.includes(tok)) score += 8;
      if (categoriesAll.includes(tok)) score += 6;
      if (keywordsAll.includes(tok)) score += 5;
      if (descriptionsAll.includes(tok)) score += 2;
    }

    if (score > 0) {
      scored.push({ score, svc });
    }
  }

  scored.sort((a, b) => b.score - a.score);
  if (scored.length > 1 && scored[0].score >= 12) {
    const threshold = Math.max(8, scored[0].score * 0.5);
    return scored.filter((entry) => entry.score >= threshold).map((entry) => entry.svc);
  }
  return scored.map((entry) => entry.svc);
}

function formatServiceBlock(svc: ServiceRecord, lang: LanguageCode): string {
  const t = TEMPLATES[lang];
  const steps = svc.next_steps[lang].map((step, i) => `${i + 1}. ${step}`).join('\n');
  return [
    `**${svc.name[lang]}**`,
    `${t.department_label}: ${svc.department[lang]}`,
    svc.description[lang],
    `${t.official_portal_label}: ${svc.official_url}`,
    `${t.next_steps_label}:`,
    steps,
  ].join('\n');
}

export function buildChatResponse(
  message: string,
  requestedLanguage: RequestedLanguage = 'auto',
  history: HistoryTurn[] = []
): ChatResponsePayload {
  const services = getServices();
  const detected = detectLanguage(message);
  const targetLang: LanguageCode = requestedLanguage === 'auto' ? detected : requestedLanguage;
  const t = TEMPLATES[targetLang];

  if (containsSensitiveData(message)) {
    const fallbackPortal = services[1] ?? services[0];
    return {
      answer: t.sensitive_warning,
      language: targetLang,
      detected_language: detected,
      translation_provider: 'verified-catalogue-template',
      sources: [
        {
          id: fallbackPortal.id,
          title: fallbackPortal.name[targetLang],
          url: fallbackPortal.official_url,
          portal_label: fallbackPortal.portal_label,
          department: fallbackPortal.department[targetLang],
        },
      ],
      related_services: [],
      suggested_followups: [t.default_followup],
      disclaimer: t.sensitive_warning,
    };
  }

  let matches = searchServices(message, history);
  const overview = isGeneralOverviewQuery(message);
  let intro = t.single_intro;

  if (matches.length === 0 && overview) {
    matches = services.slice(0, 4);
    intro = t.general_intro;
  } else if (matches.length === 0) {
    const fallbackServices = services.slice(0, 3);
    const fallbackText = [
      t.unverified,
      '',
      ...fallbackServices.map((s) => `- ${s.name[targetLang]}: ${s.official_url}`),
    ].join('\n');

    return {
      answer: fallbackText,
      language: targetLang,
      detected_language: detected,
      translation_provider: 'verified-catalogue-template',
      sources: fallbackServices.map((s) => ({
        id: s.id,
        title: s.name[targetLang],
        url: s.official_url,
        portal_label: s.portal_label,
        department: s.department[targetLang],
      })),
      related_services: fallbackServices.map((s) => ({
        id: s.id,
        name: s.name[targetLang],
        category: s.category[targetLang],
        description: s.description[targetLang],
        official_url: s.official_url,
      })),
      suggested_followups: [t.kannada_hint, t.default_followup],
      disclaimer: t.disclaimer,
    };
  } else if (matches.length > 1) {
    intro = overview ? t.general_intro : t.multi_intro;
    matches = matches.slice(0, 3);
  }

  const answer = [intro, '', ...matches.map((svc) => `${formatServiceBlock(svc, targetLang)}\n`)]
    .join('\n')
    .trim();

  return {
    answer,
    language: targetLang,
    detected_language: detected,
    translation_provider: 'verified-catalogue-template',
    sources: matches.map((s) => ({
      id: s.id,
      title: s.name[targetLang],
      url: s.official_url,
      portal_label: s.portal_label,
      department: s.department[targetLang],
    })),
    related_services: matches.slice(0, 3).map((s) => ({
      id: s.id,
      name: s.name[targetLang],
      category: s.category[targetLang],
      description: s.description[targetLang],
      official_url: s.official_url,
    })),
    suggested_followups: matches
      .map((s) => s.suggested_followups[targetLang])
      .filter(Boolean)
      .slice(0, 3),
    disclaimer: t.disclaimer,
  };
}
