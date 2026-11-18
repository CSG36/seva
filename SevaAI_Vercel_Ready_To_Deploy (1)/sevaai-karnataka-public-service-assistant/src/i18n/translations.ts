import type { LanguageCode } from '../types/seva';

export interface UiDictionary {
  nav: {
    home: string;
    services: string;
    howItWorks: string;
    about: string;
    contact: string;
    openAssistant: string;
    backToHome: string;
  };
  languageNames: {
    en: string;
    kn: string;
    hi: string;
    auto: string;
  };
  hero: {
    kicker: string;
    heading: string;
    subheading: string;
    inputPlaceholder: string;
    sendButton: string;
    micStart: string;
    micStop: string;
    micUnsupported: string;
    suggestedLabel: string;
    suggestedQuestions: string[];
    imageCaption: string;
  };
  services: {
    sectionTitle: string;
    sectionSubtitle: string;
    searchPlaceholder: string;
    allCategories: string;
    visitPortal: string;
    askAssistant: string;
    emptyState: string;
    errorState: string;
    retryButton: string;
    loadingState: string;
  };
  chat: {
    title: string;
    subtitle: string;
    welcomeTitle: string;
    welcomeBody: string;
    inputPlaceholder: string;
    sendButton: string;
    clearButton: string;
    copyButton: string;
    copiedLabel: string;
    sourcesHeading: string;
    relatedHeading: string;
    followupsHeading: string;
    privacyBanner: string;
    typingLabel: string;
    retryAction: string;
    languageLabel: string;
    starterPrompts: string[];
  };
  howItWorks: {
    sectionTitle: string;
    sectionSubtitle: string;
    steps: Array<{ number: string; title: string; description: string }>;
    whyTitle: string;
    whySubtitle: string;
    benefits: Array<{ title: string; description: string }>;
  };
  about: {
    sectionTitle: string;
    sectionSubtitle: string;
    architectureTitle: string;
    architecturePoints: string[];
    downloadTitle: string;
    downloadDescription: string;
    downloadButton: string;
  };
  contact: {
    sectionTitle: string;
    sectionSubtitle: string;
    nameLabel: string;
    namePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    messageLabel: string;
    messagePlaceholder: string;
    submitButton: string;
    submittingButton: string;
    validationError: string;
    successMessage: string;
  };
  footer: {
    directoryTitle: string;
    disclaimerTitle: string;
    disclaimerBody: string;
    copyright: string;
  };
}

export const TRANSLATIONS: Record<LanguageCode, UiDictionary> = {
  en: {
    nav: {
      home: 'Home',
      services: 'Government Services',
      howItWorks: 'How It Works',
      about: 'About',
      contact: 'Contact',
      openAssistant: 'Open Assistant',
      backToHome: 'Overview',
    },
    languageNames: {
      en: 'English',
      kn: 'ಕನ್ನಡ',
      hi: 'हिन्दी',
      auto: 'Auto-detect',
    },
    hero: {
      kicker: 'Government of Karnataka Digital Directory Guide',
      heading: 'Your Gateway to Karnataka Government Services',
      subheading:
        'Understand government services, find official resources and get guidance in your preferred language.',
      inputPlaceholder: 'Ask about Seva Sindhu, ration cards, Karnataka One, or Bengaluru Urban services...',
      sendButton: 'Ask SevaAI',
      micStart: 'Speak your question',
      micStop: 'Stop voice input',
      micUnsupported: 'Voice input is not supported in this browser.',
      suggestedLabel: 'Common citizen questions:',
      suggestedQuestions: [
        'How can I access Seva Sindhu?',
        'Where can I find ration-card services?',
        'How do I locate Bengaluru Urban citizen services?',
        'ಕನ್ನಡದಲ್ಲಿ ಸರ್ಕಾರಿ ಸೇವೆಗಳ ಬಗ್ಗೆ ತಿಳಿಸಿ.',
      ],
      imageCaption: 'Vidhana Soudha, Bengaluru — Verified guidance to official state citizen portals.',
    },
    services: {
      sectionTitle: 'Popular Government Services',
      sectionSubtitle:
        'Verified official Karnataka public-service portals. Every link opens the authoritative government domain directly.',
      searchPlaceholder: 'Filter portals by name, department, or service...',
      allCategories: 'All Services',
      visitPortal: 'Visit Official Portal',
      askAssistant: 'Explore in Assistant',
      emptyState: 'No verified service portal matched your current filter. Try clearing the search query.',
      errorState: 'Unable to load the service catalogue right now.',
      retryButton: 'Try Again',
      loadingState: 'Loading verified service directory...',
    },
    chat: {
      title: 'SevaAI Citizen Assistant',
      subtitle: 'Ask in English, Kannada, or Hindi. Responses use only verified Karnataka portal records.',
      welcomeTitle: 'Welcome to SevaAI',
      welcomeBody:
        'Ask which Karnataka government portal handles your requirement, how to navigate Seva Sindhu, Ahara, Karnataka One, Seva One, or Bengaluru Urban services.',
      inputPlaceholder: 'Type your question in English, ಕನ್ನಡ, or हिन्दी...',
      sendButton: 'Send',
      clearButton: 'Clear Conversation',
      copyButton: 'Copy Answer',
      copiedLabel: 'Copied',
      sourcesHeading: 'Official Portal Sources',
      relatedHeading: 'Related Services',
      followupsHeading: 'Suggested Next Questions',
      privacyBanner:
        'Privacy & Safety: Never enter Aadhaar numbers, OTPs, passwords, or bank account details. SevaAI does not submit applications.',
      typingLabel: 'Checking verified Karnataka portal records...',
      retryAction: 'Please try sending your question again.',
      languageLabel: 'Reply Language',
      starterPrompts: [
        'Where can I apply for a Karnataka government service?',
        'Where can I find ration-card services?',
        'ಕನ್ನಡದಲ್ಲಿ ಸರ್ಕಾರಿ ಸೇವೆಗಳ ಬಗ್ಗೆ ತಿಳಿಸಿ.',
        'मुझे कर्नाटक सरकारी सेवाओं के बारे में जानकारी चाहिए।',
      ],
    },
    howItWorks: {
      sectionTitle: 'How SevaAI Works',
      sectionSubtitle:
        'Designed for ordinary citizens, students, and senior citizens to locate authentic government portals without confusion.',
      steps: [
        {
          number: '01.',
          title: 'Ask in Your Preferred Language',
          description:
            'Write or select a question in English, Kannada, or Hindi. SevaAI detects script automatically or uses your selected language.',
        },
        {
          number: '02.',
          title: 'Verified Catalogue Matching',
          description:
            'Your question is matched strictly against verified Government of Karnataka portal records—never fabricated schemes or unverified links.',
        },
        {
          number: '03.',
          title: 'Clear Steps & Direct Official Links',
          description:
            'Receive plain-language guidance, department attribution, and direct links to Seva Sindhu, Ahara, Karnataka One, Seva One, or Bengaluru Urban.',
        },
      ],
      whyTitle: 'Why Use SevaAI',
      whySubtitle: 'Built around public-information accuracy, accessibility, and citizen privacy.',
      benefits: [
        {
          title: 'Zero Fabricated Rules or Fees',
          description:
            'If specific eligibility rules, fees, or document checklists are not verified in the catalogue, SevaAI tells you plainly and directs you to the official portal.',
        },
        {
          title: 'True Trilingual Accessibility',
          description:
            'Navigation, service cards, and assistant guidance work natively in English, Kannada Unicode, and Hindi without broken characters.',
        },
        {
          title: 'Privacy-First Design',
          description:
            'No Aadhaar numbers, OTPs, or login credentials are ever requested or stored. All official transactions happen only on government websites.',
        },
      ],
    },
    about: {
      sectionTitle: 'About SevaAI & Cloud Architecture',
      sectionSubtitle:
        'An open digital public-service navigation platform built for reliability, low-cost serverless scale on AWS, and transparent civic guidance.',
      architectureTitle: 'Production AWS & Full-Stack Design',
      architecturePoints: [
        'React + Vite + Tailwind CSS frontend packaged for AWS Amplify Hosting.',
        'FastAPI + Pydantic backend with Mangum adapter deployed via AWS SAM to Amazon API Gateway and AWS Lambda.',
        'Optional Amazon Translate and Amazon Bedrock integration with deterministic verified fallback when paid AI services are disabled.',
      ],
      downloadTitle: 'Complete Project Package',
      downloadDescription:
        'Download the full codebase including the React frontend, FastAPI + Mangum backend, verified Karnataka JSON knowledge base, SAM template, and Amplify configuration.',
      downloadButton: 'Download Project ZIP',
    },
    contact: {
      sectionTitle: 'Citizen Feedback & Contact',
      sectionSubtitle: 'Report an outdated portal link or suggest an official Karnataka department portal for verification.',
      nameLabel: 'Your Name',
      namePlaceholder: 'Enter your name',
      emailLabel: 'Email Address',
      emailPlaceholder: 'you@example.com',
      messageLabel: 'Message or Portal Suggestion',
      messagePlaceholder: 'Share feedback or mention an official .gov.in / .nic.in portal...',
      submitButton: 'Send Feedback',
      submittingButton: 'Sending...',
      validationError: 'Please provide a valid name, email address, and a message of at least 5 characters.',
      successMessage: 'Your details passed validation. This demo does not store or send contact messages.',
    },
    footer: {
      directoryTitle: 'Verified Karnataka Portals',
      disclaimerTitle: 'Public Information Disclaimer',
      disclaimerBody:
        'SevaAI is an informational public-service navigation assistant and is not an official application submission portal. Always verify eligibility, fees, required documents, and deadlines directly on the official Government of Karnataka portal before applying.',
      copyright: 'SevaAI · Karnataka Public Service Navigation Assistant',
    },
  },
  kn: {
    nav: {
      home: 'ಮುಖಪುಟ',
      services: 'ಸರ್ಕಾರಿ ಸೇವೆಗಳು',
      howItWorks: 'ಕಾರ್ಯವಿಧಾನ',
      about: 'ಮಾಹಿತಿ',
      contact: 'ಸಂಪರ್ಕಿಸಿ',
      openAssistant: 'ಸಹಾಯಕ ತೆರೆಯಿರಿ',
      backToHome: 'ಅವಲೋಕನ',
    },
    languageNames: {
      en: 'English',
      kn: 'ಕನ್ನಡ',
      hi: 'हिन्दी',
      auto: 'ಸ್ವಯಂ ಪತ್ತೆ',
    },
    hero: {
      kicker: 'ಕರ್ನಾಟಕ ಸರ್ಕಾರಿ ಸೇವೆಗಳ ಡಿಜಿಟಲ್ ಮಾರ್ಗದರ್ಶಿ',
      heading: 'ಕರ್ನಾಟಕ ಸರ್ಕಾರಿ ಸೇವೆಗಳಿಗೆ ನಿಮ್ಮ ಪ್ರವೇಶದ್ವಾರ',
      subheading:
        'ಸರ್ಕಾರಿ ಸೇವೆಗಳನ್ನು ಸುಲಭವಾಗಿ ಅರ್ಥಮಾಡಿಕೊಳ್ಳಿ, ಅಧಿಕೃತ ಪೋರ್ಟಲ್‌ಗಳನ್ನು ಹುಡುಕಿ ಮತ್ತು ನಿಮ್ಮ ಭಾಷೆಯಲ್ಲಿ ಮಾರ್ಗದರ್ಶನ ಪಡೆಯಿರಿ.',
      inputPlaceholder: 'ಸೇವಾ ಸಿಂಧು, ರೇಷನ್ ಕಾರ್ಡ್, ಕರ್ನಾಟಕ ಒನ್ ಅಥವಾ ಬೆಂಗಳೂರು ನಗರ ಸೇವೆಗಳ ಬಗ್ಗೆ ಕೇಳಿ...',
      sendButton: 'SevaAI ಕೇಳಿ',
      micStart: 'ಧ್ವನಿಯ ಮೂಲಕ ಕೇಳಿ',
      micStop: 'ಧ್ವನಿ ಇನ್‌ಪುಟ್ ನಿಲ್ಲಿಸಿ',
      micUnsupported: 'ಈ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಧ್ವನಿ ಇನ್‌ಪುಟ್ ಬೆಂಬಲಿತವಾಗಿಲ್ಲ.',
      suggestedLabel: 'ಸಾಮಾನ್ಯ ನಾಗರಿಕ ಪ್ರಶ್ನೆಗಳು:',
      suggestedQuestions: [
        'ಸೇವಾ ಸಿಂಧು ಪೋರ್ಟಲ್ ಅನ್ನು ಹೇಗೆ ಬಳಸುವುದು?',
        'ಕರ್ನಾಟಕದಲ್ಲಿ ರೇಷನ್ ಕಾರ್ಡ್ ಸೇವೆಗಳು ಎಲ್ಲಿ ಸಿಗುತ್ತವೆ?',
        'ಬೆಂಗಳೂರು ನಗರ ನಾಗರಿಕ ಸೇವೆಗಳನ್ನು ಹೇಗೆ ಹುಡುಕುವುದು?',
        'ಕನ್ನಡದಲ್ಲಿ ಸರ್ಕಾರಿ ಸೇವೆಗಳ ಬಗ್ಗೆ ತಿಳಿಸಿ.',
      ],
      imageCaption: 'ವಿಧಾನಸೌಧ, ಬೆಂಗಳೂರು — ಅಧಿಕೃತ ರಾಜ್ಯ ನಾಗರಿಕ ಪೋರ್ಟಲ್‌ಗಳಿಗೆ ಪರಿಶೀಲಿತ ಮಾರ್ಗದರ್ಶನ.',
    },
    services: {
      sectionTitle: 'ಜನಪ್ರಿಯ ಸರ್ಕಾರಿ ಸೇವೆಗಳು',
      sectionSubtitle:
        'ಕರ್ನಾಟಕ ಸರ್ಕಾರದ ಪರಿಶೀಲಿತ ಅಧಿಕೃತ ಪೋರ್ಟಲ್‌ಗಳು. ಪ್ರತಿ ಲಿಂಕ್ ನೇರವಾಗಿ ಅಧಿಕೃತ ಸರ್ಕಾರಿ ವೆಬ್‌ಸೈಟ್ ತೆರೆಯುತ್ತದೆ.',
      searchPlaceholder: 'ಹೆಸರು, ಇಲಾಖೆ ಅಥವಾ ಸೇವೆಯ ಮೂಲಕ ಹುಡುಕಿ...',
      allCategories: 'ಎಲ್ಲಾ ಸೇವೆಗಳು',
      visitPortal: 'ಅಧಿಕೃತ ಪೋರ್ಟಲ್ ತೆರೆಯಿರಿ',
      askAssistant: 'ಸಹಾಯಕದಲ್ಲಿ ಕೇಳಿ',
      emptyState: 'ನಿಮ್ಮ ಹುಡುಕಾಟಕ್ಕೆ ಯಾವುದೇ ಪರಿಶೀಲಿತ ಪೋರ್ಟಲ್ ಕಂಡುಬಂದಿಲ್ಲ.',
      errorState: 'ಸೇವಾ ಪಟ್ಟಿಯನ್ನು ಲೋಡ್ ಮಾಡಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ.',
      retryButton: 'ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ',
      loadingState: 'ಪರಿಶೀಲಿತ ಸೇವಾ ಪಟ್ಟಿಯನ್ನು ಲೋಡ್ ಮಾಡಲಾಗುತ್ತಿದೆ...',
    },
    chat: {
      title: 'SevaAI ನಾಗರಿಕ ಸಹಾಯಕ',
      subtitle: 'ಇಂಗ್ಲಿಷ್, ಕನ್ನಡ ಅಥವಾ ಹಿಂದಿಯಲ್ಲಿ ಕೇಳಿ. ಉತ್ತರಗಳು ಪರಿಶೀಲಿತ ಕರ್ನಾಟಕ ಪೋರ್ಟಲ್ ಮಾಹಿತಿಯನ್ನು ಮಾತ್ರ ಬಳಸುತ್ತವೆ.',
      welcomeTitle: 'SevaAI ಗೆ ಸ್ವಾಗತ',
      welcomeBody:
        'ಸೇವಾ ಸಿಂಧು, ಆಹಾರ (ರೇಷನ್ ಕಾರ್ಡ್), ಕರ್ನಾಟಕ ಒನ್, ಸೇವಾ ಒನ್ ಅಥವಾ ಬೆಂಗಳೂರು ನಗರ ಸೇವೆಗಳ ಬಗ್ಗೆ ನಿಮ್ಮ ಪ್ರಶ್ನೆಯನ್ನು ಕೇಳಿ.',
      inputPlaceholder: 'ನಿಮ್ಮ ಪ್ರಶ್ನೆಯನ್ನು ಕನ್ನಡ, English, ಅಥವಾ हिन्दी ಯಲ್ಲಿ ಟೈಪ್ ಮಾಡಿ...',
      sendButton: 'ಕಳುಹಿಸಿ',
      clearButton: 'ಸಂಭಾಷಣೆ ತೆರವುಗೊಳಿಸಿ',
      copyButton: 'ಉತ್ತರ ನಕಲಿಸಿ',
      copiedLabel: 'ನಕಲಿಸಲಾಗಿದೆ',
      sourcesHeading: 'ಅಧಿಕೃತ ಪೋರ್ಟಲ್ ಮೂಲಗಳು',
      relatedHeading: 'ಸಂಬಂಧಿತ ಸೇವೆಗಳು',
      followupsHeading: 'ಮುಂದಿನ ಸಲಹೆ ಪ್ರಶ್ನೆಗಳು',
      privacyBanner:
        'ಗೌಪ್ಯತೆ ಮತ್ತು ಸುರಕ್ಷತೆ: ಆಧಾರ್ ಸಂಖ್ಯೆ, OTP, ಪಾಸ್‌ವರ್ಡ್ ಅಥವಾ ಬ್ಯಾಂಕ್ ವಿವರಗಳನ್ನು ಎಂದಿಗೂ ನಮೂದಿಸಬೇಡಿ. SevaAI ಅರ್ಜಿಗಳನ್ನು ಸಲ್ಲಿಸುವುದಿಲ್ಲ.',
      typingLabel: 'ಪರಿಶೀಲಿತ ಕರ್ನಾಟಕ ಪೋರ್ಟಲ್ ದಾಖಲೆಗಳನ್ನು ಪರಿಶೀಲಿಸಲಾಗುತ್ತಿದೆ...',
      retryAction: 'ದಯವಿಟ್ಟು ನಿಮ್ಮ ಪ್ರಶ್ನೆಯನ್ನು ಮತ್ತೆ ಕಳುಹಿಸಿ.',
      languageLabel: 'ಉತ್ತರದ ಭಾಷೆ',
      starterPrompts: [
        'ಕರ್ನಾಟಕ ಸರ್ಕಾರಿ ಸೇವೆಗೆ ಎಲ್ಲಿ ಅರ್ಜಿ ಸಲ್ಲಿಸಬಹುದು?',
        'ಕರ್ನಾಟಕದಲ್ಲಿ ರೇಷನ್ ಕಾರ್ಡ್ ಸೇವೆಗಳು ಎಲ್ಲಿ ಸಿಗುತ್ತವೆ?',
        'ಕನ್ನಡದಲ್ಲಿ ಸರ್ಕಾರಿ ಸೇವೆಗಳ ಬಗ್ಗೆ ತಿಳಿಸಿ.',
        'ಬೆಂಗಳೂರು ನಗರ ನಾಗರಿಕ ಸೇವೆಗಳು ಎಲ್ಲಿವೆ?',
      ],
    },
    howItWorks: {
      sectionTitle: 'SevaAI ಹೇಗೆ ಕೆಲಸ ಮಾಡುತ್ತದೆ',
      sectionSubtitle:
        'ಸಾಮಾನ್ಯ ನಾಗರಿಕರು, ವಿದ್ಯಾರ್ಥಿಗಳು ಮತ್ತು ಹಿರಿಯ ನಾಗರಿಕರು ಅಧಿಕೃತ ಸರ್ಕಾರಿ ಪೋರ್ಟಲ್‌ಗಳನ್ನು ಸುಲಭವಾಗಿ ತಲುಪಲು ವಿನ್ಯಾಸಗೊಳಿಸಲಾಗಿದೆ.',
      steps: [
        {
          number: '01.',
          title: 'ನಿಮ್ಮ ಭಾಷೆಯಲ್ಲಿ ಕೇಳಿ',
          description:
            'ಕನ್ನಡ, ಇಂಗ್ಲಿಷ್ ಅಥವಾ ಹಿಂದಿಯಲ್ಲಿ ಪ್ರಶ್ನೆ ಕೇಳಿ. SevaAI ನಿಮ್ಮ ಭಾಷೆಯನ್ನು ಸ್ವಯಂಚಾಲಿತವಾಗಿ ಗುರುತಿಸುತ್ತದೆ.',
        },
        {
          number: '02.',
          title: 'ಪರಿಶೀಲಿತ ಪೋರ್ಟಲ್ ಹುಡುಕಾಟ',
          description:
            'ನಿಮ್ಮ ಪ್ರಶ್ನೆಯನ್ನು ಕರ್ನಾಟಕ ಸರ್ಕಾರದ ಪರಿಶೀಲಿತ ಪೋರ್ಟಲ್ ದಾಖಲೆಗಳೊಂದಿಗೆ ಮಾತ್ರ ಹೊಂದಿಸಲಾಗುತ್ತದೆ.',
        },
        {
          number: '03.',
          title: 'ಸ್ಪಷ್ಟ ಹಂತಗಳು ಮತ್ತು ಅಧಿಕೃತ ಲಿಂಕ್‌ಗಳು',
          description:
            'ಸೇವಾ ಸಿಂಧು, ಆಹಾರ, ಕರ್ನಾಟಕ ಒನ್, ಸೇವಾ ಒನ್ ಮತ್ತು ಬೆಂಗಳೂರು ನಗರ ಪೋರ್ಟಲ್‌ಗಳಿಗೆ ನೇರ ಅಧಿಕೃತ ಲಿಂಕ್ ಪಡೆಯಿರಿ.',
        },
      ],
      whyTitle: 'SevaAI ಏಕೆ ಬಳಸಬೇಕು',
      whySubtitle: 'ಸಾರ್ವಜನಿಕ ಮಾಹಿತಿ ನಿಖರತೆ, ಸುಲಭ ಪ್ರವೇಶ ಮತ್ತು ನಾಗರಿಕರ ಗೌಪ್ಯತೆಗಾಗಿ ನಿರ್ಮಿಸಲಾಗಿದೆ.',
      benefits: [
        {
          title: 'ಸುಳ್ಳು ನಿಯಮಗಳು ಅಥವಾ ಶುಲ್ಕಗಳಿಲ್ಲ',
          description:
            'ಪೋರ್ಟಲ್ ದಾಖಲೆಯಲ್ಲಿ ಶುಲ್ಕ ಅಥವಾ ಅರ್ಹತೆ ಮಾಹಿತಿ ಲಭ್ಯವಿಲ್ಲದಿದ್ದರೆ, SevaAI ನೇರವಾಗಿ ಅಧಿಕೃತ ಪೋರ್ಟಲ್‌ಗೆ ಮಾರ್ಗದರ್ಶನ ನೀಡುತ್ತದೆ.',
        },
        {
          title: 'ತ್ರಿಭಾಷಾ ಯೂನಿಕೋಡ್ ಬೆಂಬಲ',
          description:
            'ಸಂಪೂರ್ಣ ಇಂಟರ್‌ಫೇಸ್ ಮತ್ತು ಉತ್ತರಗಳು ಕನ್ನಡ, ಇಂಗ್ಲಿಷ್ ಮತ್ತು ಹಿಂದಿಯಲ್ಲಿ ಸ್ಪಷ್ಟವಾಗಿ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತವೆ.',
        },
        {
          title: 'ಗೌಪ್ಯತೆ-ಮೊದಲು ವಿನ್ಯಾಸ',
          description:
            'ಆಧಾರ್, OTP ಅಥವಾ ಬ್ಯಾಂಕ್ ಮಾಹಿತಿಯನ್ನು ಎಂದಿಗೂ ಕೇಳುವುದಿಲ್ಲ. ಎಲ್ಲಾ ಅರ್ಜಿಗಳು ಅಧಿಕೃತ ಸರ್ಕಾರಿ ವೆಬ್‌ಸೈಟ್‌ಗಳಲ್ಲಿಯೇ ನಡೆಯುತ್ತವೆ.',
        },
      ],
    },
    about: {
      sectionTitle: 'SevaAI ಮತ್ತು ಕ್ಲೌಡ್ ವಿನ್ಯಾಸದ ಬಗ್ಗೆ',
      sectionSubtitle:
        'AWS ನಲ್ಲಿ ವಿಶ್ವಾಸಾರ್ಹ ಮತ್ತು ಕಡಿಮೆ ವೆಚ್ಚದ ಸಾರ್ವಜನಿಕ-ಸೇವಾ ಮಾರ್ಗದರ್ಶನಕ್ಕಾಗಿ ನಿರ್ಮಿಸಲಾದ ವೇದಿಕೆ.',
      architectureTitle: 'AWS ಮತ್ತು ಫುಲ್-ಸ್ಟ್ಯಾಕ್ ವಿನ್ಯಾಸ',
      architecturePoints: [
        'AWS Amplify Hosting ಗಾಗಿ ಸಿದ್ಧಪಡಿಸಲಾದ React + Vite + Tailwind CSS ಮುಂಭಾಗ.',
        'AWS SAM ಮೂಲಕ Amazon API Gateway ಮತ್ತು AWS Lambda ನಲ್ಲಿ ಚಲಿಸುವ FastAPI + Mangum ಬ್ಯಾಕೆಂಡ್.',
        'ಐಚ್ಛಿಕ Amazon Translate ಮತ್ತು Amazon Bedrock ಬೆಂಬಲದೊಂದಿಗೆ ವಿಶ್ವಾಸಾರ್ಹ ಸ್ಥಳೀಯ ಟೆಂಪ್ಲೇಟ್ ಬ್ಯಾಕಪ್.',
      ],
      downloadTitle: 'ಸಂಪೂರ್ಣ ಪ್ರಾಜೆಕ್ಟ್ ಪ್ಯಾಕೇಜ್',
      downloadDescription:
        'React ಮುಂಭಾಗ, FastAPI + Mangum ಬ್ಯಾಕೆಂಡ್, ಕರ್ನಾಟಕ ಸೇವಾ JSON ದಾಖಲೆ, SAM ಟೆಂಪ್ಲೇಟ್ ಮತ್ತು Amplify ಕಾನ್ಫಿಗರೇಶನ್ ಅನ್ನು ZIP ಆಗಿ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ.',
      downloadButton: 'ಪ್ರಾಜೆಕ್ಟ್ ZIP ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ',
    },
    contact: {
      sectionTitle: 'ನಾಗರಿಕ ಪ್ರತಿಕ್ರಿಯೆ ಮತ್ತು ಸಂಪರ್ಕ',
      sectionSubtitle: 'ಹಳೆಯ ಲಿಂಕ್ ಅಥವಾ ಹೊಸ ಅಧಿಕೃತ ಕರ್ನಾಟಕ ಇಲಾಖಾ ಪೋರ್ಟಲ್ ಕುರಿತು ಮಾಹಿತಿ ಹಂಚಿಕೊಳ್ಳಿ.',
      nameLabel: 'ನಿಮ್ಮ ಹೆಸರು',
      namePlaceholder: 'ನಿಮ್ಮ ಹೆಸರನ್ನು ನಮೂದಿಸಿ',
      emailLabel: 'ಇಮೇಲ್ ವಿಳಾಸ',
      emailPlaceholder: 'you@example.com',
      messageLabel: 'ಸಂದೇಶ ಅಥವಾ ಸಲಹೆ',
      messagePlaceholder: 'ಅಧಿಕೃತ .gov.in / .nic.in ಪೋರ್ಟಲ್ ಅಥವಾ ಪ್ರತಿಕ್ರಿಯೆಯನ್ನು ಬರೆಯಿರಿ...',
      submitButton: 'ಪ್ರತಿಕ್ರಿಯೆ ಕಳುಹಿಸಿ',
      submittingButton: 'ಕಳುಹಿಸಲಾಗುತ್ತಿದೆ...',
      validationError: 'ದಯವಿಟ್ಟು ಮಾನ್ಯವಾದ ಹೆಸರು, ಇಮೇಲ್ ಮತ್ತು ಕನಿಷ್ಠ 5 ಅಕ್ಷರಗಳ ಸಂದೇಶವನ್ನು ನಮೂದಿಸಿ.',
      successMessage: 'ನಿಮ್ಮ ವಿವರಗಳನ್ನು ಪರಿಶೀಲಿಸಲಾಗಿದೆ. ಈ ಡೆಮೊ ಸಂಪರ್ಕ ಸಂದೇಶಗಳನ್ನು ಸಂಗ್ರಹಿಸುವುದಿಲ್ಲ ಅಥವಾ ಕಳುಹಿಸುವುದಿಲ್ಲ.',
    },
    footer: {
      directoryTitle: 'ಪರಿಶೀಲಿತ ಕರ್ನಾಟಕ ಪೋರ್ಟಲ್‌ಗಳು',
      disclaimerTitle: 'ಸಾರ್ವಜನಿಕ ಮಾಹಿತಿ ಸೂಚನೆ',
      disclaimerBody:
        'SevaAI ಕೇವಲ ಮಾಹಿತಿ ಮತ್ತು ಪೋರ್ಟಲ್ ಮಾರ್ಗದರ್ಶನ ಸಹಾಯಕವಾಗಿದೆ; ಇದು ಅಧಿಕೃತ ಅರ್ಜಿ ಸಲ್ಲಿಸುವ ವೇದಿಕೆಯಲ್ಲ. ಅರ್ಜಿ ಸಲ್ಲಿಸುವ ಮೊದಲು ಅಧಿಕೃತ ಕರ್ನಾಟಕ ಸರ್ಕಾರದ ಪೋರ್ಟಲ್‌ನಲ್ಲಿ ವಿವರಗಳನ್ನು ದೃಢೀಕರಿಸಿ.',
      copyright: 'SevaAI · ಕರ್ನಾಟಕ ಸಾರ್ವಜನಿಕ ಸೇವಾ ಮಾರ್ಗದರ್ಶಿ',
    },
  },
  hi: {
    nav: {
      home: 'होम',
      services: 'सरकारी सेवाएं',
      howItWorks: 'यह कैसे काम करता है',
      about: 'परिचय',
      contact: 'संपर्क',
      openAssistant: 'सहायक खोलें',
      backToHome: 'अवलोकन',
    },
    languageNames: {
      en: 'English',
      kn: 'ಕನ್ನಡ',
      hi: 'हिन्दी',
      auto: 'स्वतः पहचान',
    },
    hero: {
      kicker: 'कर्नाटक सरकार डिजिटल सेवा निर्देशिका मार्गदर्शक',
      heading: 'कर्नाटक सरकारी सेवाओं का आपका प्रवेश द्वार',
      subheading:
        'सरकारी सेवाओं को सरल भाषा में समझें, आधिकारिक पोर्टल खोजें और अपनी पसंदीदा भाषा में मार्गदर्शन पाएं।',
      inputPlaceholder: 'सेवा सिंधु, राशन कार्ड, कर्नाटक वन या बेंगलुरु शहरी सेवाओं के बारे में पूछें...',
      sendButton: 'SevaAI से पूछें',
      micStart: 'बोलकर प्रश्न पूछें',
      micStop: 'वॉयस इनपुट बंद करें',
      micUnsupported: 'इस ब्राउज़र में वॉयस इनपुट समर्थित नहीं है।',
      suggestedLabel: 'सामान्य नागरिक प्रश्न:',
      suggestedQuestions: [
        'सेवा सिंधु पोर्टल कैसे उपयोग करें?',
        'कर्नाटक में राशन कार्ड की सेवाएं कहां मिलेंगी?',
        'बेंगलुरु शहरी नागरिक सेवाएं कहां देखें?',
        'मुझे कर्नाटक सरकारी सेवाओं के बारे में जानकारी चाहिए।',
      ],
      imageCaption: 'विधान सौध, बेंगलुरु — आधिकारिक राज्य नागरिक पोर्टलों के लिए सत्यापित मार्गदर्शन।',
    },
    services: {
      sectionTitle: 'लोकप्रिय सरकारी सेवाएं',
      sectionSubtitle:
        'कर्नाटक सरकार के सत्यापित आधिकारिक पोर्टल। प्रत्येक लिंक सीधे आधिकारिक सरकारी वेबसाइट खोलता है।',
      searchPlaceholder: 'नाम, विभाग या सेवा के अनुसार खोजें...',
      allCategories: 'सभी सेवाएं',
      visitPortal: 'आधिकारिक पोर्टल खोलें',
      askAssistant: 'सहायक में पूछें',
      emptyState: 'आपके फ़िल्टर से कोई सत्यापित सेवा पोर्टल नहीं मिला।',
      errorState: 'अभी सेवा निर्देशिका लोड नहीं हो सकी।',
      retryButton: 'पुनः प्रयास करें',
      loadingState: 'सत्यापित सेवा निर्देशिका लोड हो रही है...',
    },
    chat: {
      title: 'SevaAI नागरिक सहायक',
      subtitle: 'अंग्रेज़ी, कन्नड़ या हिंदी में पूछें। उत्तर केवल सत्यापित कर्नाटक पोर्टल रिकॉर्ड पर आधारित हैं।',
      welcomeTitle: 'SevaAI में आपका स्वागत है',
      welcomeBody:
        'सेवा सिंधु, आहार (राशन कार्ड), कर्नाटक वन, सेवा वन या बेंगलुरु शहरी सेवाओं से जुड़ा कोई भी प्रश्न पूछें।',
      inputPlaceholder: 'अपना प्रश्न हिन्दी, English, या ಕನ್ನಡ में लिखें...',
      sendButton: 'भेजें',
      clearButton: 'चैट साफ़ करें',
      copyButton: 'उत्तर कॉपी करें',
      copiedLabel: 'कॉपी किया गया',
      sourcesHeading: 'आधिकारिक पोर्टल स्रोत',
      relatedHeading: 'संबंधित सेवाएं',
      followupsHeading: 'सुझाए गए अगले प्रश्न',
      privacyBanner:
        'गोपनीयता एवं सुरक्षा: आधार नंबर, OTP, पासवर्ड या बैंक विवरण कभी दर्ज न करें। SevaAI आवेदन जमा नहीं करता।',
      typingLabel: 'सत्यापित कर्नाटक पोर्टल रिकॉर्ड जांचे जा रहे हैं...',
      retryAction: 'कृपया अपना प्रश्न पुनः भेजने का प्रयास करें।',
      languageLabel: 'उत्तर भाषा',
      starterPrompts: [
        'कर्नाटक सरकारी सेवा के लिए आवेदन कहां करें?',
        'कर्नाटक में राशन कार्ड की सेवाएं कहां मिलेंगी?',
        'मुझे कर्नाटक सरकारी सेवाओं के बारे में जानकारी चाहिए।',
        'बेंगलुरु शहरी जिला पोर्टल कौन सा है?',
      ],
    },
    howItWorks: {
      sectionTitle: 'SevaAI कैसे काम करता है',
      sectionSubtitle:
        'सामान्य नागरिकों, छात्रों और वरिष्ठ नागरिकों को बिना भ्रम के प्रामाणिक सरकारी पोर्टलों तक पहुंचाने के लिए बनाया गया है।',
      steps: [
        {
          number: '01.',
          title: 'अपनी भाषा में प्रश्न पूछें',
          description:
            'अंग्रेज़ी, कन्नड़ या हिंदी में प्रश्न लिखें। SevaAI लिपि को स्वतः पहचानता है या आपकी चुनी हुई भाषा का उपयोग करता है।',
        },
        {
          number: '02.',
          title: 'सत्यापित पोर्टल मिलान',
          description:
            'आपका प्रश्न केवल सत्यापित कर्नाटक सरकारी पोर्टल रिकॉर्ड से मिलाया जाता है—कोई मनगढ़ंत योजना या लिंक नहीं।',
        },
        {
          number: '03.',
          title: 'सरल मार्गदर्शन और आधिकारिक लिंक',
          description:
            'सेवा सिंधु, आहार, कर्नाटक वन, सेवा वन और बेंगलुरु शहरी पोर्टल के सीधे आधिकारिक लिंक और अगले कदम प्राप्त करें।',
        },
      ],
      whyTitle: 'SevaAI का उपयोग क्यों करें',
      whySubtitle: 'सटीक जन-सूचना, सहज पहुंच और नागरिक गोपनीयता पर केंद्रित।',
      benefits: [
        {
          title: 'कोई मनगढ़ंत शुल्क या नियम नहीं',
          description:
            'यदि किसी नियम, शुल्क या दस्तावेज़ की जानकारी निर्देशिका में सत्यापित नहीं है, तो SevaAI स्पष्ट रूप से आधिकारिक पोर्टल पर जाने का सुझाव देता है।',
        },
        {
          title: 'सच्ची त्रिभाषी सहायता',
          description:
            'पूरा इंटरफ़ेस और चैट उत्तर अंग्रेज़ी, कन्नड़ और हिंदी यूनिकोड में साफ़ और सटीक रूप से काम करते हैं।',
        },
        {
          title: 'गोपनीयता-प्रथम सुरक्षा',
          description:
            'कभी भी आधार, OTP या पासवर्ड नहीं मांगा जाता। सभी आवेदन केवल आधिकारिक सरकारी वेबसाइटों पर होते हैं।',
        },
      ],
    },
    about: {
      sectionTitle: 'SevaAI और क्लाउड आर्किटेक्चर के बारे में',
      sectionSubtitle:
        'AWS पर विश्वसनीय सर्वरलेस स्केल और पारदर्शी नागरिक मार्गदर्शन के लिए निर्मित जन-सेवा प्लेटफॉर्म।',
      architectureTitle: 'AWS और फुल-स्टैक संरचना',
      architecturePoints: [
        'AWS Amplify Hosting के लिए निर्मित React + Vite + Tailwind CSS फ्रंटएंड।',
        'AWS SAM के माध्यम से Amazon API Gateway और AWS Lambda पर Mangum के साथ FastAPI बैकएंड।',
        'वैकल्पिक Amazon Translate और Amazon Bedrock समर्थन, बिना पेड सेवा के भी पूर्ण कार्यक्षमता।',
      ],
      downloadTitle: 'पूर्ण प्रोजेक्ट पैकेज',
      downloadDescription:
        'React फ्रंटएंड, FastAPI + Mangum बैकएंड, सत्यापित कर्नाटक JSON डेटाबेस, SAM टेम्पलेट और Amplify कॉन्फ़िगरेशन वाला पूरा ZIP डाउनलोड करें।',
      downloadButton: 'प्रोजेक्ट ZIP डाउनलोड करें',
    },
    contact: {
      sectionTitle: 'नागरिक प्रतिक्रिया और संपर्क',
      sectionSubtitle: 'किसी पुराने लिंक की सूचना दें या सत्यापन के लिए किसी आधिकारिक कर्नाटक पोर्टल का सुझाव दें।',
      nameLabel: 'आपका नाम',
      namePlaceholder: 'अपना नाम लिखें',
      emailLabel: 'ईमेल पता',
      emailPlaceholder: 'you@example.com',
      messageLabel: 'संदेश या पोर्टल सुझाव',
      messagePlaceholder: 'आधिकारिक .gov.in / .nic.in पोर्टल या अपनी प्रतिक्रिया लिखें...',
      submitButton: 'प्रतिक्रिया भेजें',
      submittingButton: 'भेजा जा रहा है...',
      validationError: 'कृपया मान्य नाम, ईमेल और कम से कम 5 अक्षरों का संदेश दर्ज करें।',
      successMessage: 'आपके विवरण मान्य हैं। यह डेमो संपर्क संदेशों को संग्रहीत या भेजता नहीं है।',
    },
    footer: {
      directoryTitle: 'सत्यापित कर्नाटक पोर्टल',
      disclaimerTitle: 'सार्वजनिक सूचना अस्वीकरण',
      disclaimerBody:
        'SevaAI केवल एक सूचनात्मक जन-सेवा मार्गदर्शक सहायक है और आधिकारिक आवेदन जमा करने का पोर्टल नहीं है। आवेदन से पहले आधिकारिक कर्नाटक सरकारी पोर्टल पर विवरण की पुष्टि अवश्य करें।',
      copyright: 'SevaAI · कर्नाटक जन-सेवा मार्गदर्शक सहायक',
    },
  },
};
