import {
  getServices,
  searchServices,
  type LanguageCode,
} from '../server/assistantEngine';
import { sendJson, type ServerlessRequest, type ServerlessResponse } from './_shared';

const VALID_LANGS = new Set<LanguageCode>(['en', 'kn', 'hi']);

export default function handler(req: ServerlessRequest, res: ServerlessResponse) {
  if (req.method !== 'GET') {
    return sendJson(res, 405, { detail: 'Method not allowed' });
  }

  try {
    const url = new URL(req.url || '/api/services', 'http://localhost');
    const langRaw =
      (typeof req.query?.language === 'string' ? req.query.language : url.searchParams.get('language')) ||
      'en';
    const language: LanguageCode = VALID_LANGS.has(langRaw as LanguageCode)
      ? (langRaw as LanguageCode)
      : 'en';

    const categoryRaw =
      (typeof req.query?.category === 'string' ? req.query.category : url.searchParams.get('category')) ||
      '';
    const qRaw =
      (typeof req.query?.q === 'string' ? req.query.q : url.searchParams.get('q')) || '';

    const category = categoryRaw.trim();
    const q = qRaw.trim();

    let items = getServices();
    if (category && category.toLowerCase() !== 'all') {
      const catLow = category.toLowerCase();
      items = items.filter(
        (s) =>
          s.category.en.toLowerCase().includes(catLow) ||
          s.category[language].toLowerCase().includes(catLow) ||
          s.id.toLowerCase() === catLow
      );
    }

    if (q) {
      const matchedIds = new Set(searchServices(q).map((s) => s.id));
      items = items.filter((s) => matchedIds.has(s.id));
    }

    const formatted = items.map((s) => ({
      id: s.id,
      name: s.name[language],
      category: s.category[language],
      category_key: s.category.en,
      department: s.department[language],
      description: s.description[language],
      official_url: s.official_url,
      portal_label: s.portal_label,
      next_steps: s.next_steps[language],
      suggested_followup: s.suggested_followups[language],
    }));

    return sendJson(res, 200, { services: formatted, count: formatted.length, language });
  } catch {
    return sendJson(res, 500, { detail: 'Failed to load verified Karnataka services catalogue.' });
  }
}
