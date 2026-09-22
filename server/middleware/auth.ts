import { Request, Response, NextFunction } from 'express';
import { supabaseAdmin, isSupabaseConfigured } from '../lib/supabase.js';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email?: string;
  };
}

export const authenticateUser = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // Allow demo user for unauthenticated / preview testing if configured
      if (!isSupabaseConfigured() || req.headers['x-guest-mode'] === 'true') {
        req.user = {
          id: '00000000-0000-0000-0000-000000000000',
          email: 'demo@careerassistant.ai',
        };
        return next();
      }

      res.status(401).json({ error: 'Missing or invalid Authorization header' });
      return;
    }

    const token = authHeader.split(' ')[1];

    if (token === 'demo-token-guest' || !isSupabaseConfigured()) {
      req.user = {
        id: '00000000-0000-0000-0000-000000000000',
        email: 'demo@careerassistant.ai',
      };
      return next();
    }

    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !user) {
      res.status(401).json({ error: 'Invalid authentication token' });
      return;
    }

    req.user = {
      id: user.id,
      email: user.email,
    };

    next();
  } catch (err: any) {
    console.error('Auth Middleware Error:', err);
    res.status(401).json({ error: 'Authentication failed' });
  }
};
