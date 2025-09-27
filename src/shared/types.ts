import z from "zod";

// Resume related schemas
export const ResumeSchema = z.object({
  id: z.number(),
  user_id: z.string(),
  title: z.string(),
  content: z.string(),
  formatted_content: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const CreateResumeSchema = z.object({
  personalInfo: z.object({
    name: z.string(),
    email: z.string(),
    phone: z.string(),
    location: z.string(),
    summary: z.string(),
  }),
  experience: z.array(z.object({
    title: z.string(),
    company: z.string(),
    duration: z.string(),
    description: z.string(),
  })),
  education: z.array(z.object({
    degree: z.string(),
    institution: z.string(),
    year: z.string(),
  })),
  skills: z.array(z.string()),
});

// Cover Letter schemas
export const CoverLetterSchema = z.object({
  id: z.number(),
  user_id: z.string(),
  job_title: z.string(),
  company_name: z.string(),
  content: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const CreateCoverLetterSchema = z.object({
  jobTitle: z.string(),
  companyName: z.string(),
  jobDescription: z.string(),
  personalExperience: z.string(),
  tone: z.enum(['professional', 'enthusiastic', 'creative']),
});

// Coaching Session schemas
export const CoachingSessionSchema = z.object({
  id: z.number(),
  user_id: z.string(),
  topic: z.string(),
  messages: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const CoachingMessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string(),
  timestamp: z.string(),
});

export const StartCoachingSchema = z.object({
  topic: z.string(),
  initialQuestion: z.string(),
});

// Type exports
export type ResumeType = z.infer<typeof ResumeSchema>;
export type CreateResumeType = z.infer<typeof CreateResumeSchema>;
export type CoverLetterType = z.infer<typeof CoverLetterSchema>;
export type CreateCoverLetterType = z.infer<typeof CreateCoverLetterSchema>;
export type CoachingSessionType = z.infer<typeof CoachingSessionSchema>;
export type CoachingMessageType = z.infer<typeof CoachingMessageSchema>;
export type StartCoachingType = z.infer<typeof StartCoachingSchema>;

// ATS Analysis schemas
export const ATSAnalysisSchema = z.object({
  score: z.number(),
  scoreDescription: z.string(),
  missingKeywords: z.array(z.string()),
  foundKeywords: z.array(z.string()),
  recommendations: z.array(z.string()),
  optimizedResume: z.string().optional(),
});

export const ATSAnalysisRequestSchema = z.object({
  jobDescription: z.string(),
  resume: z.string(),
});

// LinkedIn Optimization schemas
export const LinkedInOptimizationSchema = z.object({
  optimizedHeadline: z.string(),
  optimizedSummary: z.string(),
  suggestedSkills: z.array(z.string()),
  recommendations: z.array(z.string()),
  contentStrategy: z.array(z.string()),
});

export const LinkedInOptimizationRequestSchema = z.object({
  currentProfile: z.object({
    headline: z.string(),
    summary: z.string(),
    experience: z.string(),
    skills: z.string(),
  }),
  targetRole: z.string(),
  industry: z.string(),
  careerGoals: z.string(),
});

// Interview Simulation schemas
export const InterviewSessionSchema = z.object({
  id: z.number(),
  user_id: z.string(),
  job_title: z.string(),
  interview_type: z.string(),
  questions: z.array(z.string()),
  currentQuestionIndex: z.number(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const StartInterviewSchema = z.object({
  jobTitle: z.string(),
  jobDescription: z.string().optional(),
  experience: z.string(),
  interviewType: z.enum(['behavioral', 'technical', 'case', 'cultural']),
});

// Type exports
export type ATSAnalysisType = z.infer<typeof ATSAnalysisSchema>;
export type ATSAnalysisRequestType = z.infer<typeof ATSAnalysisRequestSchema>;
export type LinkedInOptimizationType = z.infer<typeof LinkedInOptimizationSchema>;
export type LinkedInOptimizationRequestType = z.infer<typeof LinkedInOptimizationRequestSchema>;
export type InterviewSessionType = z.infer<typeof InterviewSessionSchema>;
export type StartInterviewType = z.infer<typeof StartInterviewSchema>;
