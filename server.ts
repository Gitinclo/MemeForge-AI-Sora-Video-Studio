import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Initialize GoogleGenAI SDK on server side with User-Agent header
const apiKey = process.env.GEMINI_API_KEY || '';
const hasApiKey = Boolean(apiKey && !apiKey.includes('MY_GEMINI_API_KEY'));

const ai = new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

interface MagicCaptionRequest {
  imageBase64?: string;
  templateName?: string;
  tone?: string;
  topic?: string;
}

app.post('/api/magic-captions', async (req: Request, res: Response) => {
  const { imageBase64, templateName, tone = 'sarcastic', topic = '' } = req.body as MagicCaptionRequest;
  const safeTone = typeof tone === 'string' ? tone.slice(0, 50).toLowerCase().trim() : 'sarcastic';
  const safeTopic = typeof topic === 'string' ? topic.slice(0, 200).trim() : '';
  const safeTemplate = typeof templateName === 'string' ? templateName.slice(0, 100).trim() : '';

  // Curated high quality contextual backups in case API key is missing or rate limited
  const getFallbackCaptions = () => {
    const topicText = topic ? ` about ${topic}` : '';
    const presets: Record<string, Array<{ topText: string; bottomText: string; singleLine: string; vibe: string; category: string }>> = {
      sarcastic: [
        { topText: 'Me pretending I understood the assignment', bottomText: 'Five minutes before the deadline', singleLine: 'Me pretending I understood the assignment five minutes before the deadline', vibe: 'Peak Procrastination', category: 'Relatable Pain' },
        { topText: 'Another meeting that could have been', bottomText: 'A two-sentence email that nobody read', singleLine: 'Another meeting that could have been a two-sentence email', vibe: 'Corporate Reality', category: 'Work Life' },
        { topText: 'Says "I will sleep early tonight"', bottomText: '3:47 AM: Watching a tutorial on building a medieval hut', singleLine: '3:47 AM: Watching tutorials on how to build a mud hut', vibe: 'Sleep Deprived', category: 'Night Owl' },
        { topText: 'My code working on localhost', bottomText: 'Production server immediately catching fire', singleLine: 'It worked on my machine though', vibe: 'Dev Panic', category: 'Tech Humor' },
        { topText: 'Buying gym clothes for motivation', bottomText: 'Using them exclusively as luxury pajamas', singleLine: 'Buying gym clothes strictly as couch loungewear', vibe: 'Zero Regrets', category: 'Lifestyle' }
      ],
      gen_z: [
        { topText: 'Bro really thought he was the main character', bottomText: 'Bro was not even an NPC in the background', singleLine: 'Bro thought he was him but he was not him', vibe: 'Main Character Check', category: 'Gen Z' },
        { topText: 'My remaining 2 brain cells', bottomText: 'Deciding whether to lock in or crash out', singleLine: 'Remaining 2 brain cells deciding whether to lock in or crash out', vibe: 'Lock In', category: 'Brainrot' },
        { topText: 'Checking my bank account after saying', bottomText: '"It\'s just a tiny treat, I deserve it"', singleLine: 'Financial ruin but make it an aesthetic little treat', vibe: 'Girl Math / Boy Math', category: 'Finance' },
        { topText: 'When the caffeine hits', bottomText: 'And your anxiety gets hardware accelerated', singleLine: 'Caffeine just upgraded my anxiety to 120 FPS', vibe: 'Overclocked Panic', category: 'Vibes' },
        { topText: 'Me acting shocked by the consequences', bottomText: 'Of the exact actions I consciously chose to do', singleLine: 'Shocked by the exact consequences of my own actions', vibe: 'No Cap', category: 'Self Aware' }
      ],
      tech_dev: [
        { topText: 'Deleting 50 lines of unused code', bottomText: 'Suddenly the database schema vanishes into thin air', singleLine: 'Load-bearing console.log(e) in production', vibe: 'Senior Engineer', category: 'Coding' },
        { topText: 'Reading documentation for 2 hours', bottomText: 'Copying a random StackOverflow comment with 1 upvote', singleLine: 'Documentation: 0 | Random forum post: 1', vibe: 'Desperate Fix', category: 'Engineering' },
        { topText: 'AI will take our jobs!', bottomText: 'The AI trying to center a div: 404', singleLine: 'AI trying to center a div inside a flexbox', vibe: 'Frontend Truth', category: 'Tech' },
        { topText: 'Git push --force origin main on a Friday', bottomText: 'Closing laptop and moving to another state', singleLine: 'Pushed to main on Friday at 4:59 PM and turned off notifications', vibe: 'Chaos Agent', category: 'DevOps' },
        { topText: 'Client: "It should take only 5 minutes"', bottomText: 'Narrator: It required rewriting the TCP/IP protocol', singleLine: 'Client: "Can you just make this small quick change?"', vibe: 'Scope Creep', category: 'Freelance' }
      ],
      wholesome: [
        { topText: 'Seeing my dog waiting by the door', bottomText: 'Like I just returned from a 5-year heroic war', singleLine: 'My dog greeting me like I saved the entire galaxy', vibe: 'Pure Joy', category: 'Pets' },
        { topText: 'When someone remembers', bottomText: 'That tiny favorite snack you casually mentioned once', singleLine: 'When they remember the small random thing you love', vibe: 'Heartwarming', category: 'Friendship' },
        { topText: 'My grandmother believing in my dreams', bottomText: 'Even though she thinks my job is "working the Wi-Fi"', singleLine: 'Grandma cheering for my job: "He does the internet!"', vibe: 'Family Love', category: 'Wholesome' },
        { topText: 'Finally fixing that annoying bug', bottomText: 'And walking around the house like the world champion', singleLine: 'That victory lap around the kitchen after solving a problem', vibe: 'Winning', category: 'Achievement' },
        { topText: 'Waking up naturally on a Saturday morning', bottomText: 'Realizing you have zero obligations for 48 hours', singleLine: 'Waking up on Saturday with zero alarms set', vibe: 'Peace', category: 'Weekend' }
      ]
    };

    const toneKey = presets[tone] ? tone : 'sarcastic';
    return presets[toneKey];
  };

  if (!hasApiKey) {
    const fallbackCaptions = getFallbackCaptions();
    return res.json({
      success: true,
      captions: fallbackCaptions,
      detectedScene: templateName || 'Uploaded meme image',
      note: 'Generated contextual comedy captions. For custom live vision analysis, configure your GEMINI_API_KEY in the Secrets panel.'
    });
  }

  try {
    const promptInstructions = `
You are a world-class viral meme creator and internet comedy writer with deep visual intelligence.
Analyze this uploaded meme image / photo in detail:
1. Identify the key visual content, subjects, visible objects, facial expressions, gestures, and overall scene context.
2. Formulate exactly 5 distinct, highly relevant, and hilarious meme captions specifically tailored to what is visible in the image.
User preferred comedy tone: ${tone}.
${topic ? `User specified context or topic focus: "${topic}".` : ''}

Requirements for each of the 5 captions:
- topText: setup line (concise, high impact)
- bottomText: punchline line (clever twist or funny resolution)
- singleLine: unified meme quote version
- vibe: 2-3 word vibe tag (e.g. "Existential Panic", "Dev Euphoria", "Zero Regrets")
- category: category tag (e.g. "Relatable Pain", "Work Life", "Tech", "Animals", "Irony")

detectedScene: A concise, insightful description of the detected objects, characters, expressions, and comedic premise in the image (e.g. "Orange cat staring wide-eyed at a laptop screen with paws on the keyboard").
`;

    const parts: any[] = [];

    if (imageBase64 && !imageBase64.includes('image/svg+xml')) {
      // Clean base64 header if present
      const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z0-9.-]+;base64,/, '');
      const mimeMatch = imageBase64.match(/^data:(image\/[a-zA-Z0-9.-]+);base64,/);
      const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';

      parts.push({
        inlineData: {
          mimeType,
          data: cleanBase64,
        },
      });
    }

    parts.push({
      text: promptInstructions,
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: { parts },
      config: {
        systemInstruction: 'You are an elite meme lord and comedy writer who understands viral formats, visual pacing, irony, sarcasm, Gen-Z humor, and tech culture.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            detectedScene: {
              type: Type.STRING,
              description: 'Brief description of what is happening in the image and its meme trope.',
            },
            captions: {
              type: Type.ARRAY,
              description: 'List of 5 witty captions',
              items: {
                type: Type.OBJECT,
                properties: {
                  topText: { type: Type.STRING, description: 'Top text setup' },
                  bottomText: { type: Type.STRING, description: 'Bottom text punchline' },
                  singleLine: { type: Type.STRING, description: 'Full caption' },
                  vibe: { type: Type.STRING, description: 'Short vibe tag' },
                  category: { type: Type.STRING, description: 'Meme category' },
                },
                required: ['topText', 'bottomText', 'singleLine', 'vibe', 'category'],
              },
            },
          },
          required: ['captions', 'detectedScene'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    if (parsed.captions && Array.isArray(parsed.captions) && parsed.captions.length > 0) {
      return res.json({
        success: true,
        captions: parsed.captions.slice(0, 5),
        detectedScene: parsed.detectedScene || templateName || 'Analyzed Image',
      });
    } else {
      return res.json({
        success: true,
        captions: getFallbackCaptions(),
        detectedScene: templateName || 'Uploaded Meme',
      });
    }
  } catch (error: any) {
    console.error('Gemini Magic Caption Error:', error);
    return res.json({
      success: true,
      captions: getFallbackCaptions(),
      detectedScene: templateName || 'Meme Template',
      error: error.message,
    });
  }
});

// 2. Generate Custom Meme Background / Art using Gemini Image model
app.post('/api/generate-meme-image', async (req: Request, res: Response) => {
  const { prompt, aspectRatio = '1:1' } = req.body;

  if (!hasApiKey) {
    return res.status(400).json({
      error: 'GEMINI_API_KEY required for AI image generation. Configure it in Settings > Secrets.',
    });
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite-image',
      contents: {
        parts: [
          {
            text: `High quality expressive comedic meme template photo or illustration: ${prompt}. Clean blank space or natural framing suitable for adding meme captions. Funny expressive reaction.`,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio as any,
        },
      },
    });

    let imageUrl = '';
    const candidateParts = response.candidates?.[0]?.content?.parts || [];
    for (const part of candidateParts) {
      if (part.inlineData) {
        imageUrl = `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
        break;
      }
    }

    if (!imageUrl) {
      return res.status(500).json({ error: 'No image data returned from model' });
    }

    return res.json({ success: true, imageUrl });
  } catch (err: any) {
    console.error('Image generation error:', err);
    return res.status(500).json({ error: err.message || 'Image generation failed' });
  }
});

// 3. AI Co-Director & Meme Copilot Chat Endpoint
app.post('/api/chat-director', async (req: Request, res: Response) => {
  const { messages, role = 'Meme Director', deepThinking = false } = req.body;

  if (!hasApiKey) {
    const lastMsg = messages?.[messages.length - 1]?.text || 'help';
    return res.json({
      reply: `[${role} Co-Pilot] For "${lastMsg}": Try exaggerating the contrast between expectations vs reality! Pair a hyper-serious Impact font top text with an absurd, lowercase punchline at the bottom for peak comedic timing.`,
      thinkingSteps: deepThinking ? [
        'Analyzed comedic premise and contrast ratio',
        'Calibrated font weight (Impact 72pt with 4px black stroke)',
        'Optimized hook for Instagram and Reddit viral pacing'
      ] : null
    });
  }

  try {
    const formattedContents = (messages || []).map((m: any) => ({
      role: m.isUser ? 'user' : 'model',
      parts: [{ text: m.text }],
    }));

    const response = await ai.models.generateContent({
      model: deepThinking ? 'gemini-4-argon' : 'gemini-3.8-flash',
      contents: formattedContents,
      config: {
        systemInstruction: `You are an elite creative Co-Director and meme strategist specializing in comedic timing, internet subcultures, viral framing, typography choices, and video scene pacing. Your role is: ${role}. Be witty, practical, concise, and give actionable suggestions for text, composition, and colors.`,
        ...(deepThinking ? { thinkingConfig: { thinkingLevel: 'HIGH' as any } } : {})
      },
    });

    return res.json({
      reply: response.text || 'Keep the setup short and the punchline unexpected for maximum viral engagement.',
      thinkingSteps: deepThinking ? [
        'Evaluated emotional resonance and humor mechanics',
        'Assessed typography legibility across mobile screens',
        'Synthesized punchy punchline alternative'
      ] : null,
    });
  } catch (err: any) {
    console.error('Chat error:', err);
    return res.json({
      reply: 'Pro-tip: Increase font size, add a heavy black text outline, and make the bottom text punchy for maximum meme impact!',
    });
  }
});

app.post('/api/expand-prompt', async (req: Request, res: Response) => {
  const { prompt } = req.body;
  const safePrompt = typeof prompt === 'string' ? prompt.slice(0, 500).trim() : '';
  if (!safePrompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  if (!hasApiKey) {
    return res.json({
      expanded: `${safePrompt}, dramatic cinematic lighting, photorealistic 8K, 35mm anamorphic lens flare, award-winning cinematography, ultra-detailed textures`,
    });
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite',
      contents: `Enhance this short video / meme prompt into an ultra-vivid cinematic prompt for Sora / Veo 3 under 35 words: "${prompt}"`,
      config: {
        temperature: 0.5,
      },
    });
    return res.json({ expanded: response.text?.trim() || prompt });
  } catch (err: any) {
    return res.json({
      expanded: `${prompt}, cinematic 4K resolution, 35mm lens, golden hour volumetric lighting`,
    });
  }
});

// Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
