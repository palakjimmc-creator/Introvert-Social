import 'dotenv/config';
import express from 'express';
import path from 'path';
import {fileURLToPath} from 'url';
import {createServer as createViteServer} from 'vite';
import {Content, GoogleGenAI} from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

type ChatRoleId = 'confidant' | 'excuse-crafter' | 'smalltalk-coach';
type ChatSpeedMode = 'balanced' | 'fast';

interface ClientMessage {
  role: 'user' | 'model';
  text: string;
}

const SYSTEM_INSTRUCTIONS: Record<ChatRoleId, string> = {
  confidant:
    'You are the Corner Booth Confidant inside the Wallflower Lo-Fi Lounge—a calm, observant, dryly witty friend sitting across from an introvert at a quiet indie bookstore table. Keep responses warm, grounded, concise (2-4 sentences unless asked for more), and free of toxic positivity or clinical jargon. Help the user decompress, feel understood, and decide gently whether to stay or slip out.',
  'excuse-crafter':
    'You are the Pocket Excuse Tailor inside the Wallflower Lo-Fi Lounge. Your job is to craft polite, believable, zero-drama exit lines and follow-up text messages tailored to the user’s exact social setting. Keep excuses gracious, brief, and immediately usable—offer 1-2 crisp options they can read verbatim or copy into a text.',
  'smalltalk-coach':
    'You are the Low-Stakes Conversation Coach inside the Wallflower Lo-Fi Lounge. Give practical, low-energy conversational pivots, gentle boundary phrases, and easy open-ended questions that let the other person carry the talking while the user rests their voice. Keep advice short, warm, and immediately actionable.',
};

const MODEL_BY_SPEED: Record<ChatSpeedMode, string> = {
  balanced: 'gemini-4-hydrogen',
  fast: 'gemini-3.1-flash-lite',
};

function getAiClient(): GoogleGenAI {
  return new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

async function startServer() {
  const app = express();
  const port = Number(process.env.PORT) || 3000;

  app.use(express.json({limit: '1mb'}));

  app.post('/api/chat', async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
        res.status(500).json({
          error: 'GEMINI_API_KEY is not configured. Add your API key in Settings > Secrets.',
        });
        return;
      }

      const {
        message,
        history = [],
        roleId = 'confidant',
        speedMode = 'balanced',
        batteryLevel,
      } = req.body as {
        message?: string;
        history?: ClientMessage[];
        roleId?: ChatRoleId;
        speedMode?: ChatSpeedMode;
        batteryLevel?: number;
      };

      if (!message || typeof message !== 'string' || !message.trim()) {
        res.status(400).json({error: 'Please enter a message before sending.'});
        return;
      }

      const validRole: ChatRoleId =
        roleId in SYSTEM_INSTRUCTIONS ? roleId : 'confidant';
      const validSpeed: ChatSpeedMode =
        speedMode in MODEL_BY_SPEED ? speedMode : 'balanced';

      const baseInstruction = SYSTEM_INSTRUCTIONS[validRole];
      const batteryContext =
        typeof batteryLevel === 'number'
          ? `\n\nContext: The user currently rates their social battery at ${batteryLevel}%. Match your pacing and conciseness to that energy level.`
          : '';

      const formattedHistory: Content[] = Array.isArray(history)
        ? history
            .filter(
              (item) =>
                item &&
                (item.role === 'user' || item.role === 'model') &&
                typeof item.text === 'string' &&
                item.text.trim().length > 0
            )
            .map((item) => ({
              role: item.role,
              parts: [{text: item.text}],
            }))
        : [];

      const model = MODEL_BY_SPEED[validSpeed];
      const ai = getAiClient();

      const chat = ai.chats.create({
        model,
        config: {
          systemInstruction: `${baseInstruction}${batteryContext}`,
        },
        history: formattedHistory,
      });

      const response = await chat.sendMessage({message: message.trim()});
      const reply = (response.text ?? '').trim();

      if (!reply) {
        res.status(502).json({error: 'The companion returned an empty response. Please try again.'});
        return;
      }

      res.json({reply, model});
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : 'Unable to reach the Gemini corner companion right now.';
      console.error('[/api/chat] Error:', err);
      res.status(500).json({error: msg});
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: {middlewareMode: true},
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Wallflower Lo-Fi Lounge live on http://localhost:${port}`);
  });
}

void startServer();
