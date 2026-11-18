import fs from 'node:fs';
import path from 'node:path';
import express from 'express';
import dotenv from 'dotenv';
import JSZip from 'jszip';
import { createServer as createViteServer } from 'vite';
import {
  buildChatResponse,
  getServices,
  searchServices,
  type HistoryTurn,
  type LanguageCode,
  type RequestedLanguage,
} from './server/assistantEngine.ts';

dotenv.config();

const PORT = Number(process.env.PORT || 3000);
const VALID_LANGS = new Set<LanguageCode>(['en', 'kn', 'hi']);
const VALID_REQ_LANGS = new Set<RequestedLanguage>(['en', 'kn', 'hi', 'auto']);

const ZIP_EXCLUDED_DIRS = new Set(['node_modules', 'dist', '.git', '.venv', '__pycache__', '.pytest_cache', '.aws-sam']);

function addDirToZip(zip: JSZip, rootDir: string, currentDir: string) {
  const entries = fs.readdirSync(currentDir, { withFileTypes: true });
  for (const entry of entries) {
    if (ZIP_EXCLUDED_DIRS.has(entry.name)) continue;
    const fullPath = path.join(currentDir, entry.name);
    const relPath = path.relative(rootDir, fullPath).replace(/\\/g, '/');
    if (entry.isDirectory()) {
      addDirToZip(zip, rootDir, fullPath);
    } else if (entry.isFile() && !entry.name.startsWith('.env') || entry.name === '.env.example') {
      zip.file(relPath, fs.readFileSync(fullPath));
    }
  }
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '64kb' }));

  const healthPayload = () => ({
    status: 'ok',
    service: 'sevaai-preview-server',
    services_loaded: getServices().length,
    supported_languages: ['en', 'kn', 'hi'],
    amazon_translate_enabled: process.env.ENABLE_AMAZON_TRANSLATE === 'true',
    amazon_bedrock_enabled: process.env.ENABLE_AMAZON_BEDROCK === 'true',
  });

  app.get('/health', (_req, res) => {
    res.json(healthPayload());
  });

  app.get('/api/health', (_req, res) => {
    res.json(healthPayload());
  });

  app.get('/api/services', (req, res) => {
    try {
      const langParam = String(req.query.language || 'en') as LanguageCode;
      const language: LanguageCode = VALID_LANGS.has(langParam) ? langParam : 'en';
      const category = typeof req.query.category === 'string' ? req.query.category.trim() : '';
      const q = typeof req.query.q === 'string' ? req.query.q.trim() : '';

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

      res.json({ services: formatted, count: formatted.length, language });
    } catch {
      res.status(500).json({ detail: 'Failed to load verified Karnataka services catalogue.' });
    }
  });

  app.post('/api/chat', (req, res) => {
    try {
      const body = req.body ?? {};
      const message = typeof body.message === 'string' ? body.message.trim() : '';
      const rawLang = typeof body.language === 'string' ? (body.language as RequestedLanguage) : 'auto';
      const language: RequestedLanguage = VALID_REQ_LANGS.has(rawLang) ? rawLang : 'auto';

      if (message.length < 2 || message.length > 1000) {
        return res.status(422).json({
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
      return res.json(payload);
    } catch {
      return res.status(500).json({
        detail: 'Unable to process your request right now. Please try again shortly.',
      });
    }
  });

  app.post('/api/contact', (req, res) => {
    const body = req.body ?? {};
    const name = typeof body.name === 'string' ? body.name.trim() : '';
    const email = typeof body.email === 'string' ? body.email.trim() : '';
    const message = typeof body.message === 'string' ? body.message.trim() : '';

    if (name.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || message.length < 5) {
      return res.status(422).json({
        detail: 'Please provide a valid name, email address, and message (at least 5 characters).',
      });
    }

    return res.json({
      status: 'received',
      message: 'Your details passed validation. This demo does not store or send contact messages.',
    });
  });

  app.get('/api/download-project', async (_req, res) => {
    try {
      const zip = new JSZip();
      addDirToZip(zip, process.cwd(), process.cwd());
      const buffer = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });
      res.setHeader('Content-Type', 'application/zip');
      res.setHeader('Content-Disposition', 'attachment; filename="sevaai-karnataka-platform.zip"');
      res.send(buffer);
    } catch {
      res.status(500).json({ detail: 'Could not generate project archive.' });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SevaAI server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
