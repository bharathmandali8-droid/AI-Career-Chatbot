import React, { createContext, useContext, useState } from 'react';
import { ChatMessage, ChatSession, AtsAuditResponse, RoadmapResponse } from '../types/chat';

interface ChatContextType {
  currentSession: ChatSession | null;
  setCurrentSession: (session: ChatSession | null) => void;
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  resumeText: string;
  setResumeText: (text: string) => void;
  jobDescription: string;
  setJobDescription: (text: string) => void;
  targetRole: string;
  setTargetRole: (role: string) => void;
  atsAudit: AtsAuditResponse | null;
  setAtsAudit: (audit: AtsAuditResponse | null) => void;
  roadmap: RoadmapResponse | null;
  setRoadmap: (roadmap: RoadmapResponse | null) => void;
  isContextModalOpen: boolean;
  setIsContextModalOpen: (open: boolean) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [resumeText, setResumeText] = useState<string>('');
  const [jobDescription, setJobDescription] = useState<string>('');
  const [targetRole, setTargetRole] = useState<string>('');
  const [atsAudit, setAtsAudit] = useState<AtsAuditResponse | null>(null);
  const [roadmap, setRoadmap] = useState<RoadmapResponse | null>(null);
  const [isContextModalOpen, setIsContextModalOpen] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);

  return (
    <ChatContext.Provider
      value={{
        currentSession,
        setCurrentSession,
        messages,
        setMessages,
        resumeText,
        setResumeText,
        jobDescription,
        setJobDescription,
        targetRole,
        setTargetRole,
        atsAudit,
        setAtsAudit,
        roadmap,
        setRoadmap,
        isContextModalOpen,
        setIsContextModalOpen,
        isSidebarOpen,
        setIsSidebarOpen,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) throw new Error('useChat must be used within ChatProvider');
  return context;
};
