import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, isSupabaseClientConfigured } from '../lib/supabaseClient';

interface UserSession {
  id: string;
  email: string;
  token: string;
  isGuest?: boolean;
}

interface AuthContextType {
  user: UserSession | null;
  loading: boolean;
  loginAsGuest: () => void;
  signOut: () => Promise<void>;
  getToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      if (!isSupabaseClientConfigured()) {
        // Auto sign-in as demo guest user for immediate testing preview
        setUser({
          id: '00000000-0000-0000-0000-000000000000',
          email: 'demo.engineer@careerassistant.ai',
          token: 'demo-token-guest',
          isGuest: true,
        });
        setLoading(false);
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          token: session.access_token,
        });
      } else {
        // Default to demo guest user for effortless onboarding
        setUser({
          id: '00000000-0000-0000-0000-000000000000',
          email: 'demo.engineer@careerassistant.ai',
          token: 'demo-token-guest',
          isGuest: true,
        });
      }

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            token: session.access_token,
          });
        } else {
          setUser({
            id: '00000000-0000-0000-0000-000000000000',
            email: 'demo.engineer@careerassistant.ai',
            token: 'demo-token-guest',
            isGuest: true,
          });
        }
        setLoading(false);
      });

      setLoading(false);

      return () => {
        subscription.unsubscribe();
      };
    };

    initAuth();
  }, []);

  const loginAsGuest = () => {
    setUser({
      id: '00000000-0000-0000-0000-000000000000',
      email: 'demo.engineer@careerassistant.ai',
      token: 'demo-token-guest',
      isGuest: true,
    });
  };

  const signOut = async () => {
    if (isSupabaseClientConfigured()) {
      await supabase.auth.signOut();
    }
    setUser({
      id: '00000000-0000-0000-0000-000000000000',
      email: 'demo.engineer@careerassistant.ai',
      token: 'demo-token-guest',
      isGuest: true,
    });
  };

  const getToken = async (): Promise<string | null> => {
    if (user?.isGuest || !isSupabaseClientConfigured()) {
      return 'demo-token-guest';
    }
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token || null;
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginAsGuest, signOut, getToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
