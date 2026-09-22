import { ai, isGeminiConfigured } from '../lib/gemini.js';
import { Type, Schema } from '@google/genai';
import { RoadmapResponseSchema, AtsAuditResponseSchema } from '../types/index.js';

const roadmapSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    targetRole: { type: Type.STRING },
    currentSkillGap: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    roadmap: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          phaseTitle: { type: Type.STRING },
          duration: { type: Type.STRING },
          topicsToMaster: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          recommendedProjects: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
        },
        required: ["phaseTitle", "duration", "topicsToMaster", "recommendedProjects"],
      },
    },
  },
  required: ["targetRole", "currentSkillGap", "roadmap"],
};

export async function generateSkillRoadmap(currentSkills: string, targetRole: string): Promise<RoadmapResponseSchema> {
  if (!isGeminiConfigured()) {
    // Graceful fallback structured response for dev/demo mode
    return {
      targetRole,
      currentSkillGap: ["Advanced Distributed Systems", "Kubernetes & Service Mesh", "System Design at Scale"],
      roadmap: [
        {
          phaseTitle: "Phase 1: Fundamentals & Architectural Mastery",
          duration: "Weeks 1-4",
          topicsToMaster: ["Event-Driven Architecture", "TypeScript ESM & Node Microservices", "PostgreSQL Index Optimization"],
          recommendedProjects: ["High-Throughput SSE API Gateway", "Redis Caching Layer with Rate Limiter"],
        },
        {
          phaseTitle: "Phase 2: Modern AI & LLM Engineering",
          duration: "Weeks 5-8",
          topicsToMaster: ["Google Gemini SDK Integration", "Vector Embeddings & RAG", "Streaming Chat Architecture"],
          recommendedProjects: ["Spatial Studio AI Chatbot", "ATS Resume Scorer with Schema Enforcement"],
        },
        {
          phaseTitle: "Phase 3: Production Hardening & Cloud Scaling",
          duration: "Weeks 9-12",
          topicsToMaster: ["Docker & Kubernetes Orchestration", "CI/CD Deployment Pipelines", "Security & RLS Enforcement"],
          recommendedProjects: ["Multi-Tenant Supabase Postgres Infrastructure", "End-to-End Enterprise Deployment"],
        },
      ],
    };
  }

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: `Analyze current skills: "${currentSkills}" and build a step-by-step technical roadmap for transitioning into: "${targetRole}".`,
    config: {
      responseMimeType: "application/json",
      responseSchema: roadmapSchema,
      temperature: 0.2,
    },
  });

  return JSON.parse(response.text!);
}

const atsAuditSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    matchScore: { type: Type.NUMBER },
    keyStrengths: { type: Type.ARRAY, items: { type: Type.STRING } },
    missingKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
    suggestedRewrites: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          original: { type: Type.STRING },
          improved: { type: Type.STRING },
        },
        required: ["original", "improved"],
      },
    },
    overallSummary: { type: Type.STRING },
  },
  required: ["matchScore", "keyStrengths", "missingKeywords", "suggestedRewrites", "overallSummary"],
};

export async function generateAtsAudit(resumeText: string, jobDescription: string): Promise<AtsAuditResponseSchema> {
  if (!isGeminiConfigured()) {
    return {
      matchScore: 84,
      keyStrengths: [
        "Strong experience with React, TypeScript, and Node.js",
        "Proven background in real-time streaming architectures and API design",
        "Demonstrated ability with PostgreSQL and database optimizations",
      ],
      missingKeywords: ["Google Gemini API", "Vector Search / RAG", "Tailwind CSS v3 Glassmorphism"],
      suggestedRewrites: [
        {
          original: "Built backend services for the web application.",
          improved: "Engineered scalable Node.js Express microservices processing SSE streams, reducing API response latency by 35%.",
        },
        {
          original: "Updated database schemas and queries.",
          improved: "Optimized Supabase PostgreSQL indexing and implemented strict Row Level Security (RLS) policies across multi-tenant schemas.",
        },
      ],
      overallSummary: "High target compatibility. Incorporating specific LLM streaming metrics and Tailwind CSS design tokens will push your match score above 90%.",
    };
  }

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: `Perform an exhaustive ATS match audit comparing this Resume:\n"""\n${resumeText}\n"""\nagainst this Job Description:\n"""\n${jobDescription}\n"""`,
    config: {
      responseMimeType: "application/json",
      responseSchema: atsAuditSchema,
      temperature: 0.2,
    },
  });

  return JSON.parse(response.text!);
}
