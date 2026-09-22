import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import { ChatSession } from '../types/chat';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

export function useChatHistory() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { getToken, user } = useAuth();
  const {
    currentSession,
    setCurrentSession,
    setMessages,
    setResumeText,
    setJobDescription,
  } = useChat();

  const fetchHistory = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const token = await getToken();
      const res = await fetch(`${API_BASE}/chat/history`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'x-guest-mode': token === 'demo-token-guest' ? 'true' : 'false',
        },
      });

      if (!res.ok) throw new Error('Failed to load session history');

      const data = await res.json();
      setSessions(data || []);
    } catch (err: any) {
      console.error('Fetch history error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user, getToken]);

  const loadSession = useCallback(
    async (sessionId: string) => {
      setLoading(true);
      setError(null);
      try {
        const token = await getToken();
        const res = await fetch(`${API_BASE}/chat/session/${sessionId}`, {
          headers: {
            Authorization: token ? `Bearer ${token}` : '',
            'x-guest-mode': token === 'demo-token-guest' ? 'true' : 'false',
          },
        });

        if (!res.ok) throw new Error('Failed to load session');

        const { session, messages } = await res.json();
        setCurrentSession(session);
        setMessages(messages || []);
        if (session.resume_context) setResumeText(session.resume_context);
        if (session.jd_context) setJobDescription(session.jd_context);
      } catch (err: any) {
        console.error('Load session error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [getToken, setCurrentSession, setMessages, setResumeText, setJobDescription]
  );

  const createNewSession = useCallback(() => {
    setCurrentSession(null);
    setMessages([]);
  }, [setCurrentSession, setMessages]);

  const deleteSession = useCallback(
    async (sessionId: string) => {
      try {
        const token = await getToken();
        const res = await fetch(`${API_BASE}/chat/session/${sessionId}`, {
          method: 'DELETE',
          headers: {
            Authorization: token ? `Bearer ${token}` : '',
            'x-guest-mode': token === 'demo-token-guest' ? 'true' : 'false',
          },
        });

        if (!res.ok) throw new Error('Failed to delete session');

        setSessions(prev => prev.filter(s => s.id !== sessionId));
        if (currentSession?.id === sessionId) {
          setCurrentSession(null);
          setMessages([]);
        }
      } catch (err: any) {
        console.error('Delete session error:', err);
        setError(err.message);
      }
    },
    [getToken, currentSession, setCurrentSession, setMessages]
  );

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return {
    sessions,
    loading,
    error,
    fetchHistory,
    loadSession,
    createNewSession,
    deleteSession,
  };
}
