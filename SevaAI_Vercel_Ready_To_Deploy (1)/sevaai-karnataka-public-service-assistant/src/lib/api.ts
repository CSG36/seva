import type { ChatApiResponse, ChatLanguageMode, LanguageCode, ServiceItem } from '../types/seva';

const API_BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, '');

export function getApiUrl(path: string): string {
  return `${API_BASE}${path}`;
}

export async function fetchServices(
  language: LanguageCode,
  category?: string,
  q?: string
): Promise<ServiceItem[]> {
  const params = new URLSearchParams({ language });
  if (category && category !== 'all') {
    params.set('category', category);
  }
  if (q && q.trim()) {
    params.set('q', q.trim());
  }

  const res = await fetch(getApiUrl(`/api/services?${params.toString()}`));
  if (!res.ok) {
    throw new Error(`Failed to load services (${res.status})`);
  }
  const data = (await res.json()) as { services: ServiceItem[] };
  return data.services;
}

export async function sendChatMessage(
  message: string,
  language: ChatLanguageMode,
  history: Array<{ role: 'user' | 'assistant'; content: string }>
): Promise<ChatApiResponse> {
  const res = await fetch(getApiUrl('/api/chat'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message,
      language,
      history: history.slice(-8),
    }),
  });

  if (!res.ok) {
    let detail = 'Unable to get a response right now.';
    try {
      const errBody = (await res.json()) as { detail?: string };
      if (errBody.detail) detail = errBody.detail;
    } catch {
      // ignore parse failure
    }
    throw new Error(detail);
  }

  return (await res.json()) as ChatApiResponse;
}

export async function submitContactInquiry(payload: {
  name: string;
  email: string;
  message: string;
}): Promise<{ status: string; message: string }> {
  const res = await fetch(getApiUrl('/api/contact'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    let detail = 'Please verify your contact details and try again.';
    try {
      const errBody = (await res.json()) as { detail?: string };
      if (errBody.detail) detail = errBody.detail;
    } catch {
      // ignore
    }
    throw new Error(detail);
  }
  return (await res.json()) as { status: string; message: string };
}
