import { Router, Response } from 'express';
import { z } from 'zod';
import { ai, isGeminiConfigured } from '../lib/gemini.js';
import { supabaseAdmin, isSupabaseConfigured } from '../lib/supabase.js';
import { authenticateUser, AuthenticatedRequest } from '../middleware/auth.js';
import { chatRateLimiter } from '../middleware/rateLimiter.js';
import { generateSkillRoadmap, generateAtsAudit } from '../services/roadmapService.js';
import { sessionCreateSchema, messagePostSchema, roadmapRequestSchema } from '../middleware/validation.js';

const router = Router();

// In-memory demo fallback store when Supabase is not connected
const memorySessions = new Map<string, any>();
const memoryMessages = new Map<string, any[]>();

// 1. Create a new session
router.post('/session', authenticateUser, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { title, resumeContext, jdContext } = sessionCreateSchema.parse(req.body);

    const sessionTitle = title || 'New Career Consultation';

    if (isSupabaseConfigured()) {
      const { data, error } = await supabaseAdmin
        .from('chat_sessions')
        .insert({
          user_id: userId,
          title: sessionTitle,
          resume_context: resumeContext || null,
          jd_context: jdContext || null,
        })
        .select()
        .single();

      if (error || !data) {
        res.status(500).json({ error: error?.message || 'Failed to create chat session' });
        return;
      }

      res.status(201).json(data);
      return;
    }

    // Memory Fallback
    const sessionId = crypto.randomUUID();
    const newSession = {
      id: sessionId,
      user_id: userId,
      title: sessionTitle,
      resume_context: resumeContext || null,
      jd_context: jdContext || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    memorySessions.set(sessionId, newSession);
    memoryMessages.set(sessionId, []);

    res.status(201).json(newSession);
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Invalid session payload' });
  }
});

// 2. Get session history list
router.get('/history', authenticateUser, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;

    if (isSupabaseConfigured()) {
      const { data, error } = await supabaseAdmin
        .from('chat_sessions')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });

      if (error) {
        res.status(500).json({ error: error.message });
        return;
      }

      res.json(data || []);
      return;
    }

    // Memory Fallback
    const sessions = Array.from(memorySessions.values())
      .filter(s => s.user_id === userId)
      .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());

    res.json(sessions);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 3. Get single session and its messages
router.get('/session/:id', authenticateUser, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const sessionId = req.params.id;

    if (isSupabaseConfigured()) {
      const { data: session, error: sErr } = await supabaseAdmin
        .from('chat_sessions')
        .select('*')
        .eq('id', sessionId)
        .eq('user_id', userId)
        .single();

      if (sErr || !session) {
        res.status(404).json({ error: 'Session not found' });
        return;
      }

      const { data: messages, error: mErr } = await supabaseAdmin
        .from('chat_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });

      if (mErr) {
        res.status(500).json({ error: mErr.message });
        return;
      }

      res.json({ session, messages: messages || [] });
      return;
    }

    // Memory Fallback
    const session = memorySessions.get(sessionId);
    if (!session || session.user_id !== userId) {
      res.status(404).json({ error: 'Session not found' });
      return;
    }

    const messages = memoryMessages.get(sessionId) || [];
    res.json({ session, messages });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 4. Delete session
router.delete('/session/:id', authenticateUser, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const sessionId = req.params.id;

    if (isSupabaseConfigured()) {
      const { error } = await supabaseAdmin
        .from('chat_sessions')
        .delete()
        .eq('id', sessionId)
        .eq('user_id', userId);

      if (error) {
        res.status(500).json({ error: error.message });
        return;
      }

      res.json({ success: true, message: 'Session deleted successfully' });
      return;
    }

    // Memory Fallback
    memorySessions.delete(sessionId);
    memoryMessages.delete(sessionId);
    res.json({ success: true, message: 'Session deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 5. Main SSE Streaming Endpoint
router.post('/', authenticateUser, chatRateLimiter, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { sessionId: incomingSessionId, message, resumeText, jobDescription } = messagePostSchema.parse(req.body);

    let sessionId: string;
    let resumeCtx = resumeText || null;
    let jdCtx = jobDescription || null;

    // Create session if not provided
    if (!incomingSessionId) {
      const autoTitle = message.slice(0, 40) + (message.length > 40 ? '...' : '');

      if (isSupabaseConfigured()) {
        const { data: sessionData, error: sessionErr } = await supabaseAdmin
          .from('chat_sessions')
          .insert({
            user_id: userId,
            title: autoTitle,
            resume_context: resumeCtx,
            jd_context: jdCtx,
          })
          .select()
          .single();

        if (sessionErr || !sessionData) {
          res.status(500).json({ error: 'Failed to create chat session in database' });
          return;
        }
        sessionId = sessionData.id;
      } else {
        sessionId = crypto.randomUUID();
        const newSession = {
          id: sessionId,
          user_id: userId,
          title: autoTitle,
          resume_context: resumeCtx,
          jd_context: jdCtx,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        memorySessions.set(sessionId, newSession);
        memoryMessages.set(sessionId, []);
      }
    } else {
      sessionId = incomingSessionId;
      // If session already exists, fetch existing context if not passed
      if (isSupabaseConfigured()) {
        const { data: existingSession } = await supabaseAdmin
          .from('chat_sessions')
          .select('resume_context, jd_context')
          .eq('id', sessionId)
          .single();
        if (existingSession) {
          if (!resumeCtx) resumeCtx = existingSession.resume_context;
          if (!jdCtx) jdCtx = existingSession.jd_context;
        }
      } else {
        const existingSession = memorySessions.get(sessionId);
        if (existingSession) {
          if (!resumeCtx) resumeCtx = existingSession.resume_context;
          if (!jdCtx) jdCtx = existingSession.jd_context;
        }
      }
    }

    // Save user message to database / memory
    const userMsgObj = {
      id: crypto.randomUUID(),
      session_id: sessionId,
      user_id: userId,
      role: 'user',
      message: message,
      created_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured()) {
      await supabaseAdmin.from('chat_messages').insert({
        session_id: sessionId,
        user_id: userId,
        role: 'user',
        message: message,
      });

      // Update session updated_at
      await supabaseAdmin
        .from('chat_sessions')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', sessionId);
    } else {
      const msgs = memoryMessages.get(sessionId) || [];
      msgs.push(userMsgObj);
      memoryMessages.set(sessionId, msgs);

      const sess = memorySessions.get(sessionId);
      if (sess) {
        sess.updated_at = new Date().toISOString();
        memorySessions.set(sessionId, sess);
      }
    }

    // Fetch historical messages for context
    let history: { role: string; message: string }[] = [];

    if (isSupabaseConfigured()) {
      const { data: dbHistory } = await supabaseAdmin
        .from('chat_messages')
        .select('role, message')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true })
        .limit(10);
      history = dbHistory || [];
    } else {
      const msgs = memoryMessages.get(sessionId) || [];
      history = msgs.slice(-10).map(m => ({ role: m.role, message: m.message }));
    }

    // Setup SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Session-ID', sessionId);

    // Build system prompt
    let systemInstruction = `You are an elite, world-class Career Coach, Senior Software Engineering Mentor, Professional Resume Strategist, and Applicant Tracking System (ATS) Specialist.

Core Directives:
1. Grounding & Accuracy: Base your advice explicitly on the provided Resume and Target Job Description context when available.
2. Anti-Hallucination: Do not make up qualifications or past metrics.
3. Actionable Advice: Provide concrete, impactful rewrites (Action Verb + Context + Measurable Result format).
4. Tone: Empathetic, direct, highly professional, and encouraging.
5. Markdown & Code: Format technical recommendations cleanly with syntax highlighting and clear headings.`;

    if (resumeCtx) {
      systemInstruction += `\n\n[USER RESUME CONTEXT]:\n${resumeCtx}`;
    }
    if (jdCtx) {
      systemInstruction += `\n\n[TARGET JOB DESCRIPTION]:\n${jdCtx}`;
    }

    let fullAssistantResponse = '';

    if (isGeminiConfigured()) {
      const contents = history.map(h => ({
        role: h.role === 'user' ? 'user' : 'model',
        parts: [{ text: h.message }]
      }));

      const responseStream = await ai.models.generateContentStream({
        model: 'gemini-2.5-flash',
        contents: contents,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7,
        }
      });

      for await (const chunk of responseStream) {
        const text = chunk.text;
        if (text) {
          fullAssistantResponse += text;
          res.write(`data: ${JSON.stringify({ chunk: text, sessionId })}\n\n`);
        }
      }
    } else {
      // Demo streaming fallback when API key is missing
      const mockResponseParts = [
        "### 🌟 Career & ATS Strategy Insight\n\n",
        "Based on your profile and target job description, here are high-impact actionable steps:\n\n",
        "1. **Highlight Core Real-Time Architecture Skills**: Emphasize your experience with modern streaming patterns (SSE, Async Iterators) and high-throughput systems.\n\n",
        "2. **ATS Bullet Point Formula Rewrite**:\n",
        "   > *\"Architected a real-time SSE streaming backend using Node.js Express & Google Gemini 2.5 Flash, reducing prompt latency by 45% for multi-tenant users.\"*\n\n",
        "3. **Skill Roadmap Target**: Master Vector Embeddings, PostgreSQL RLS policies, and spatial glass UI design tokens.\n\n",
        "```typescript\n// Example: Type-Safe SSE Stream Handling\nconst eventSource = new EventSource('/api/chat');\neventSource.onmessage = (event) => {\n  const { chunk } = JSON.parse(event.data);\n  appendTokenToUI(chunk);\n};\n```\n\n",
        "Feel free to ask me to generate a complete ATS score audit or a tailored step-by-step learning roadmap!"
      ];

      for (const part of mockResponseParts) {
        fullAssistantResponse += part;
        res.write(`data: ${JSON.stringify({ chunk: part, sessionId })}\n\n`);
        await new Promise(r => setTimeout(r, 120));
      }
    }

    // Persist model response to DB or memory
    if (isSupabaseConfigured()) {
      await supabaseAdmin.from('chat_messages').insert({
        session_id: sessionId,
        user_id: userId,
        role: 'model',
        message: fullAssistantResponse,
      });
    } else {
      const msgs = memoryMessages.get(sessionId) || [];
      msgs.push({
        id: crypto.randomUUID(),
        session_id: sessionId,
        user_id: userId,
        role: 'model',
        message: fullAssistantResponse,
        created_at: new Date().toISOString(),
      });
      memoryMessages.set(sessionId, msgs);
    }

    res.write(`data: [DONE]\n\n`);
    res.end();
  } catch (error: any) {
    console.error('Chat Error:', error);
    if (!res.headersSent) {
      res.status(400).json({ error: error.message || 'An error occurred during chat processing' });
    } else {
      res.write(`data: ${JSON.stringify({ error: 'Stream interrupted' })}\n\n`);
      res.end();
    }
  }
});

// 6. Generate Skill Roadmap endpoint
router.post('/roadmap', authenticateUser, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { currentSkills, targetRole } = roadmapRequestSchema.parse(req.body);
    const roadmap = await generateSkillRoadmap(currentSkills, targetRole);
    res.json(roadmap);
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Failed to generate skill roadmap' });
  }
});

// 7. Generate ATS Audit endpoint
router.post('/ats-audit', authenticateUser, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { resumeText, jobDescription } = req.body;
    if (!resumeText || !jobDescription) {
      res.status(400).json({ error: 'Both resumeText and jobDescription are required for ATS audit' });
      return;
    }
    const audit = await generateAtsAudit(resumeText, jobDescription);
    res.json(audit);
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Failed to generate ATS audit' });
  }
});

export default router;
