export interface UserCareerContext {
  resumeText?: string;
  jobDescription?: string;
  targetRole?: string;
  experienceLevel?: 'Entry' | 'Mid' | 'Senior' | 'Lead' | 'Executive';
}

export interface ChatMessage {
  id: string;
  session_id: string;
  role: 'user' | 'model' | 'system';
  message: string;
  metadata?: Record<string, any>;
  created_at: string;
}

export interface ChatSession {
  id: string;
  user_id: string;
  title: string;
  resume_context?: string | null;
  jd_context?: string | null;
  created_at: string;
  updated_at: string;
}

export interface SkillRoadmapStep {
  phaseTitle: string;
  duration: string;
  topicsToMaster: string[];
  recommendedProjects: string[];
  learningResources?: { name: string; url?: string; type: 'Doc' | 'Course' | 'Book' }[];
}

export interface RoadmapResponse {
  targetRole: string;
  currentSkillGap: string[];
  roadmap: SkillRoadmapStep[];
}

export interface AtsAuditResponse {
  matchScore: number;
  keyStrengths: string[];
  missingKeywords: string[];
  suggestedRewrites: { original: string; improved: string }[];
  overallSummary: string;
}
