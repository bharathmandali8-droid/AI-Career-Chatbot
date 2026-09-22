import { z } from 'zod';

export const sessionCreateSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  resumeContext: z.string().max(25000).optional(),
  jdContext: z.string().max(25000).optional(),
});

export const messagePostSchema = z.object({
  sessionId: z.string().uuid("Invalid Session ID format").optional(),
  message: z.string().min(1, "Message is required").max(5000, "Message length exceeded"),
  resumeText: z.string().max(25000).optional(),
  jobDescription: z.string().max(25000).optional(),
});

export const roadmapRequestSchema = z.object({
  currentSkills: z.string().min(1, "Current skills required").max(10000),
  targetRole: z.string().min(1, "Target role required").max(500),
});
