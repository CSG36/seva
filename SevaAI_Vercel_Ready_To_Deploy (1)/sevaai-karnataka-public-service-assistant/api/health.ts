import { getServices } from '../server/assistantEngine';
import { sendJson, type ServerlessRequest, type ServerlessResponse } from './_shared';

export default function handler(req: ServerlessRequest, res: ServerlessResponse) {
  if (req.method !== 'GET') {
    return sendJson(res, 405, { detail: 'Method not allowed' });
  }

  try {
    return sendJson(res, 200, {
      status: 'ok',
      service: 'sevaai-vercel-api',
      services_loaded: getServices().length,
      supported_languages: ['en', 'kn', 'hi'],
      amazon_translate_enabled: false,
      amazon_bedrock_enabled: false,
    });
  } catch {
    return sendJson(res, 500, { detail: 'Failed to inspect knowledge base.' });
  }
}
