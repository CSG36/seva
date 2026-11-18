import {
  buildChatResponse,
  type HistoryTurn,
  type RequestedLanguage,
} from '../server/assistantEngine';
import {
  readJsonBody,
  sendJson,
  type ServerlessRequest,
  type ServerlessResponse,
} from './_shared';

const VALID_REQ_LANGS = new Set<RequestedLanguage>(['en', 'kn', 'hi', 'auto']);

export default async function handler(req: ServerlessRequest, res: ServerlessResponse) {
  if (req.method !== 'POST') {
    return sendJson(res, 405, { detail: 'Method not allowed' });
  }

  try {
    const body = await readJsonBody(req);
    const message = typeof body.message === 'string' ? body.message.trim() : '';
    const rawLang = typeof body.language === 'string' ? (body.language as RequestedLanguage) : 'auto';
    const language: RequestedLanguage = VALID_REQ_LANGS.has(rawLang) ? rawLang : 'auto';

    if (message.length < 2 || message.length > 1000) {
      return sendJson(res, 422, {
        detail: 'Message must be between 2 and 1000 characters.',
      });
    }

    const rawHistory = Array.isArray(body.history) ? body.history.slice(-10) : [];
    const history: HistoryTurn[] = rawHistory
      .filter(
        (turn: unknown): turn is HistoryTurn =>
          Boolean(
            turn &&
              typeof turn === 'object' &&
              ((turn as HistoryTurn).role === 'user' || (turn as HistoryTurn).role === 'assistant') &&
              typeof (turn as HistoryTurn).content === 'string'
          )
      )
      .map((turn: HistoryTurn) => ({
        role: turn.role,
        content: turn.content.slice(0, 1500),
      }));

    const payload = buildChatResponse(message, language, history);
    return sendJson(res, 200, payload);
  } catch {
    return sendJson(res, 500, {
      detail: 'Unable to process your request right now. Please try again shortly.',
    });
  }
}
