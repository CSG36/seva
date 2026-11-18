import {
  readJsonBody,
  sendJson,
  type ServerlessRequest,
  type ServerlessResponse,
} from './_shared';

export default async function handler(req: ServerlessRequest, res: ServerlessResponse) {
  if (req.method !== 'POST') {
    return sendJson(res, 405, { detail: 'Method not allowed' });
  }

  try {
    const body = await readJsonBody(req);
    const name = typeof body.name === 'string' ? body.name.trim() : '';
    const email = typeof body.email === 'string' ? body.email.trim() : '';
    const message = typeof body.message === 'string' ? body.message.trim() : '';

    if (name.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || message.length < 5) {
      return sendJson(res, 422, {
        detail: 'Please provide a valid name, email address, and message (at least 5 characters).',
      });
    }

    return sendJson(res, 200, {
      status: 'received',
      message: 'Your details passed validation. This demo does not store or send contact messages.',
    });
  } catch {
    return sendJson(res, 400, { detail: 'Invalid JSON request payload.' });
  }
}
