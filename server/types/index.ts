export interface UserCareerContext {
  resumeText?: string;
  jobDescription?: string;
  targetRole?: string;
  experienceLevel?: 'Entry' | 'Mid' | 'Senior' | 'Lead' | 'Executive';
}

export interface ChatMessagePayload {
  sessionId?: string;
  message: string;
  context?: UserCareerContext;
}

export interface SkillRoadmapStep {
  phaseTitle: string;
  duration: string;
  topicsToMaster: string[];
  recommendedProjects: string[];
  learningResources?: { name: string; url?: string; type: 'Doc' | 'Course' | 'Book' }[];
}

export interface RoadmapResponseSchema {
  targetRole: string;
  currentSkillGap: string[];
  roadmap: SkillRoadmapStep[];
}

export interface AtsAuditResponseSchema {
  matchScore: number; // 0-100
  keyStrengths: string[];
  missingKeywords: string[];
  suggestedRewrites: { original: string; improved: string }[];
  overallSummary: string;
}
