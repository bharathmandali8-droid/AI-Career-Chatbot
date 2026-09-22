import { useState, useRef, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

export function useChatStream() {
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const { getToken } = useAuth();
  const {
    currentSession,
    setCurrentSession,
    setMessages,
    resumeText,
    jobDescription,
  } = useChat();

  const sendMessage = useCallback(
    async (userMessageText: string) => {
      if (!userMessageText.trim() || isStreaming) return;

      setError(null);
      setIsStreaming(true);
      setStreamingText('');

      const token = await getToken();
      const activeSessionId = currentSession?.id;

      // Optimistically add user message to chat UI
      const userMsgId = crypto.randomUUID();
      const userMsgObj = {
        id: userMsgId,
        session_id: activeSessionId || 'temp',
        role: 'user' as const,
        message: userMessageText,
        created_at: new Date().toISOString(),
      };

      setMessages(prev => [...prev, userMsgObj]);

      // Temporary placeholder for assistant streaming message
      const assistantMsgId = crypto.randomUUID();

      abortControllerRef.current = new AbortController();

      try {
        const response = await fetch(`${API_BASE}/chat`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: token ? `Bearer ${token}` : '',
            'x-guest-mode': token === 'demo-token-guest' ? 'true' : 'false',
          },
          body: JSON.stringify({
            sessionId: activeSessionId,
            message: userMessageText,
            resumeText: resumeText || undefined,
            jobDescription: jobDescription || undefined,
          }),
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.error || `Server responded with ${response.status}`);
        }

        const returnedSessionId = response.headers.get('X-Session-ID') || activeSessionId;

        if (!currentSession && returnedSessionId) {
          setCurrentSession({
            id: returnedSessionId,
            user_id: 'current-user',
            title: userMessageText.slice(0, 40) + (userMessageText.length > 40 ? '...' : ''),
            resume_context: resumeText || null,
            jd_context: jobDescription || null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });
        }

        if (!response.body) {
          throw new Error('ReadableStream not supported on response');
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let accumulatedText = '';
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n\n');
          buffer = lines.pop() || ''; // Keep incomplete trailing chunk in buffer

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed.startsWith('data: ')) continue;

            const dataContent = trimmed.replace(/^data:\s*/, '');
            if (dataContent === '[DONE]') {
              break;
            }

            try {
              const parsed = JSON.parse(dataContent);
              if (parsed.chunk) {
                accumulatedText += parsed.chunk;
                setStreamingText(accumulatedText);
              }
            } catch (err) {
              console.warn('Malformed SSE line:', trimmed);
            }
          }
        }

        // Commit final assistant message to chat state
        if (accumulatedText) {
          setMessages(prev => [
            ...prev,
            {
              id: assistantMsgId,
              session_id: returnedSessionId || 'temp',
              role: 'model',
              message: accumulatedText,
              created_at: new Date().toISOString(),
            },
          ]);
        }
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.error('Stream Error:', err);
          setError(err.message || 'Error connecting to AI Assistant stream');
        }
      } finally {
        setIsStreaming(false);
        setStreamingText('');
        abortControllerRef.current = null;
      }
    },
    [isStreaming, currentSession, resumeText, jobDescription, getToken, setCurrentSession, setMessages]
  );

  const stopStreaming = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsStreaming(false);
      setStreamingText('');
    }
  }, []);

  return {
    isStreaming,
    streamingText,
    error,
    sendMessage,
    stopStreaming,
  };
}
