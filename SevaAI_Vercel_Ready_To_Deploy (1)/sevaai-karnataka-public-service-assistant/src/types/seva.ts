export type LanguageCode = 'en' | 'kn' | 'hi';
export type ChatLanguageMode = LanguageCode | 'auto';

export interface ServiceItem {
  id: string;
  name: string;
  category: string;
  category_key: string;
  department: string;
  description: string;
  official_url: string;
  portal_label: string;
  next_steps: string[];
  suggested_followup: string;
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

export interface ChatApiResponse {
  answer: string;
  language: LanguageCode;
  detected_language: LanguageCode;
  translation_provider: string;
  sources: SourceItem[];
  related_services: RelatedServiceItem[];
  suggested_followups: string[];
  disclaimer: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  language?: LanguageCode;
  sources?: SourceItem[];
  relatedServices?: RelatedServiceItem[];
  suggestedFollowups?: string[];
  disclaimer?: string;
  isError?: boolean;
}
