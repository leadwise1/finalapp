import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { cors } from "hono/cors";
import OpenAI from "openai";
import type { Env } from "./.env.d";
import {
  CreateResumeSchema,
  CreateCoverLetterSchema,
  CoachingMessageSchema,
  ATSAnalysisRequestSchema,
  LinkedInOptimizationRequestSchema,
  StartInterviewSchema,
} from "../shared/types";


// --- TYPE DEFINITIONS for API responses ---

// Defines the structure of the data returned by the Gemini API
interface GeminiResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
  }>;
}

// Defines the parameters needed for a Gemini API call
type GeminiGenerateParams = {
  contents: Array<{ role: string; parts: Array<{ text: string }> }>;
  generationConfig?: {
    temperature?: number;
    maxOutputTokens?: number;
  };
};


// --- HELPER FUNCTIONS for AI calls ---

/**
 * Makes a direct API call to Google's Gemini API.
 */
async function callGeminiAPI(
  env: Env,
  params: GeminiGenerateParams
): Promise<{ content: string } | { error: string }> {
  const apiKey = env.GEMINI_API_KEY;
  if (!apiKey) return { error: "Gemini API key not configured" };

  try {
    // UPDATED: Changed model to the more stable 'gemini-pro'
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + apiKey,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(params)
      }
    );

    if (!response.ok) {
      console.error("Gemini API Error Response:", await response.text());
      return { error: `Gemini error: ${response.statusText || response.status}` };
    }

    const data = (await response.json()) as GeminiResponse;
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    return { content: text };
  } catch (e) {
    console.error("Gemini fetch failed:", e);
    return { error: "Gemini API call failed" };
  }
}

/**
 * Returns an initialized OpenAI client.
 */
function getOpenAIClient(env: Env) {
  return new OpenAI({
    apiKey: env.OPENAI_API_KEY,
  });
}

/**
 * Centralized logic to try Gemini first and fallback to OpenAI.
 */
async function generateWithFallback(
  env: Env,
  geminiParams: GeminiGenerateParams,
  openaiParams: {
    systemPrompt: string;
    prompt: string;
    max_tokens: number;
    temperature: number;
  }
): Promise<{ content: string; usedModel: 'gemini' | 'openai'; error?: string }> {
  // Try Gemini first
  const geminiResult = await callGeminiAPI(env, geminiParams);
  if ("content" in geminiResult && geminiResult.content.trim()) {
    return { content: geminiResult.content, usedModel: "gemini" };
  }
  console.log("Gemini failed or returned empty. Falling back to OpenAI.");

  // Fallback to OpenAI
  try {
    const openai = getOpenAIClient(env);
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: openaiParams.systemPrompt },
        { role: "user", content: openaiParams.prompt }
      ],
      max_tokens: openaiParams.max_tokens,
      temperature: openaiParams.temperature,
    });
    const content = completion.choices[0]?.message?.content || "";
    if (content) {
       return { content, usedModel: "openai" };
    }
    return { content: "", usedModel: "openai", error: "OpenAI also returned empty content." };
  } catch (e) {
    console.error("OpenAI Fallback Error:", e);
    return { content: "", usedModel: "openai", error: "AI fallback failed completely" };
  }
}


// --- HONO APP INITIALIZATION ---
const app = new Hono<{ Bindings: Env }>();
app.use("*", cors());


// --- API ENDPOINTS ---

// Resume generation
app.post("/api/resume/generate", zValidator("json", CreateResumeSchema), async (c) => {
  const data = c.req.valid("json");
  const prompt = `Generate a professional resume based on the following information:
    Personal Information:
    - Name: ${data.personalInfo.name}
    - Email: ${data.personalInfo.email}
    - Phone: ${data.personalInfo.phone}
    - Location: ${data.personalInfo.location}
    - Summary: ${data.personalInfo.summary}
    Experience:
    ${data.experience.map(exp => `- ${exp.title} at ${exp.company} (${exp.duration}): ${exp.description}`).join('\n')}
    Education:
    ${data.education.map(edu => `- ${edu.degree} from ${edu.institution} (${edu.year})`).join('\n')}
    Skills: ${data.skills.join(', ')}
    Please format this as a professional resume with clear sections and compelling language that highlights achievements and impact.`;
  const systemPrompt = "You are a professional resume writer with expertise in creating compelling resumes that get results. Format the resume with clear sections and use action verbs and quantifiable achievements where possible.";

  const geminiParams: GeminiGenerateParams = {
    contents: [{ role: "user", parts: [{ text: `${systemPrompt}\n\n${prompt}` }] }],
    generationConfig: { temperature: 0.7, maxOutputTokens: 1500 },
  };

  const aiResult = await generateWithFallback(c.env, geminiParams, {
    systemPrompt,
    prompt,
    max_tokens: 1500,
    temperature: 0.7,
  });

  if (aiResult.error || !aiResult.content) {
    return c.json({ error: aiResult.error || "Failed to generate resume content" }, 500);
  }

  const dbResult = await c.env.careerwise_db.prepare(
    "INSERT INTO resumes (user_id, title, content, formatted_content, created_at, updated_at) VALUES (?, ?, ?, ?, datetime('now'), datetime('now'))"
  ).bind('user_temp', `${data.personalInfo.name} - Resume`, JSON.stringify(data), aiResult.content).run();

  return c.json({
    id: dbResult.meta.last_row_id,
    content: aiResult.content,
    usedModel: aiResult.usedModel,
    success: true
  });
});


// Cover letter generation
app.post("/api/cover-letter/generate", zValidator("json", CreateCoverLetterSchema), async (c) => {
    const data = c.req.valid("json");
    const toneInstructions: Record<string, string> = {
      professional: "Use a formal, professional tone",
      enthusiastic: "Use an enthusiastic and energetic tone",
      creative: "Use a creative and engaging tone"
    };
    const prompt = `Write a compelling cover letter for the following job application:
        Job Title: ${data.jobTitle}
        Company: ${data.companyName}
        Job Description: ${data.jobDescription}
        Applicant's Experience/Background: ${data.personalExperience}
        Tone: ${toneInstructions[data.tone] || toneInstructions.professional}
        Create a personalized cover letter that highlights relevant experience, shows enthusiasm for the role, and demonstrates knowledge of the company. The letter should be professional, concise, and compelling.`;
    const systemPrompt = "You are an expert career coach and professional writer specializing in creating compelling cover letters that get interviews. Write personalized, engaging cover letters that highlight the candidate's strengths and fit for the role.";

    const geminiParams: GeminiGenerateParams = {
      contents: [{ role: "user", parts: [{ text: `${systemPrompt}\n\n${prompt}` }] }],
      generationConfig: { temperature: 0.7, maxOutputTokens: 1000 },
    };

    const aiResult = await generateWithFallback(c.env, geminiParams, {
        systemPrompt,
        prompt,
        max_tokens: 1000,
        temperature: 0.7,
    });

    if (aiResult.error || !aiResult.content) {
        return c.json({ error: aiResult.error || "Failed to generate cover letter" }, 500);
    }

    const dbResult = await c.env.careerwise_db.prepare(
        "INSERT INTO cover_letters (user_id, job_title, company_name, content, created_at, updated_at) VALUES (?, ?, ?, ?, datetime('now'), datetime('now'))"
    ).bind('user_temp', data.jobTitle, data.companyName, aiResult.content).run();

    return c.json({
        id: dbResult.meta.last_row_id,
        content: aiResult.content,
        usedModel: aiResult.usedModel,
        success: true
    });
});

// Career coaching chat
app.post("/api/coaching/chat", zValidator("json", CoachingMessageSchema), async (c) => {
    const message = c.req.valid("json");
    const systemPrompt = "You are Coach Leo, an expert career coach with years of experience helping professionals advance their careers. You provide personalized advice on career development, job search strategies, interview preparation, salary negotiation, and professional growth. Be supportive, actionable, and encouraging in your responses.";
    const geminiParams: GeminiGenerateParams = {
        contents: [{ role: "user", parts: [{ text: `${systemPrompt}\n\n${message.content}` }] }],
        generationConfig: { temperature: 0.8, maxOutputTokens: 800 },
    };

    const aiResult = await generateWithFallback(c.env, geminiParams, {
        systemPrompt,
        prompt: message.content,
        max_tokens: 800,
        temperature: 0.8,
    });
    
    return c.json({
        role: "assistant",
        content: aiResult.content,
        usedModel: aiResult.usedModel,
        timestamp: new Date().toISOString(),
        success: !aiResult.error,
        error: aiResult.error
    });
});

// ATS Resume Analysis
app.post("/api/ats/analyze", zValidator("json", ATSAnalysisRequestSchema), async (c) => {
  const { jobDescription, resume } = c.req.valid("json");
  const prompt = `Analyze this resume against the job description for ATS (Applicant Tracking System) compatibility:
    JOB DESCRIPTION:
    ${jobDescription}
    CURRENT RESUME:
    ${resume}
    Format your response as JSON with the following structure:
    {
      "score": number,
      "scoreDescription": "string",
      "missingKeywords": ["keyword1", "keyword2"],
      "foundKeywords": ["keyword1", "keyword2"],
      "recommendations": ["recommendation1", "recommendation2"],
      "optimizedResume": "full optimized resume text"
    }`;
  const systemPrompt = "You are an expert ATS and resume optimization specialist. Analyze resumes for keyword density, ATS compatibility, and provide actionable improvements. Always respond with valid JSON.";
  
  const geminiParams: GeminiGenerateParams = {
    contents: [{ role: "user", parts: [{ text: `${systemPrompt}\n\n${prompt}` }] }],
    generationConfig: { temperature: 0.3, maxOutputTokens: 2000 },
  };

  const aiResult = await generateWithFallback(c.env, geminiParams, {
    systemPrompt,
    prompt,
    max_tokens: 2000,
    temperature: 0.3,
  });
  
  try {
    const analysisResult = JSON.parse(aiResult.content);
    return c.json({ ...analysisResult, usedModel: aiResult.usedModel, error: aiResult.error });
  } catch {
    return c.json({
        score: 0,
        scoreDescription: "Analysis failed because the AI response could not be parsed.",
        missingKeywords: [],
        foundKeywords: [],
        recommendations: ["Please try again. If the issue persists, the AI might be having trouble with the input provided."],
        optimizedResume: "N/A",
        usedModel: aiResult.usedModel,
        error: aiResult.error || "AI response was not valid JSON"
    });
  }
});

// LinkedIn Profile Optimization
app.post("/api/linkedin/optimize", zValidator("json", LinkedInOptimizationRequestSchema), async (c) => {
  const data = c.req.valid("json");
  const prompt = `Optimize this LinkedIn profile for better visibility and professional impact:
    CURRENT PROFILE:
    Headline: ${data.currentProfile.headline}
    Summary: ${data.currentProfile.summary}
    Experience: ${data.currentProfile.experience}
    Skills: ${data.currentProfile.skills}
    TARGET ROLE: ${data.targetRole}
    INDUSTRY: ${data.industry}
    CAREER GOALS: ${data.careerGoals}
    Please provide an optimized headline, summary, skills, recommendations, and content strategy in a valid JSON format.`;
  const systemPrompt = "You are a LinkedIn optimization expert and personal branding specialist. Create compelling, professional profiles that attract recruiters and opportunities. Always respond with valid JSON.";
  const geminiParams: GeminiGenerateParams = {
    contents: [{ role: "user", parts: [{ text: `${systemPrompt}\n\n${prompt}` }] }],
    generationConfig: { temperature: 0.4, maxOutputTokens: 1500 },
  };
  const aiResult = await generateWithFallback(c.env, geminiParams, {
    systemPrompt,
    prompt,
    max_tokens: 1500,
    temperature: 0.4,
  });
  try {
    const optimizationResult = JSON.parse(aiResult.content);
    return c.json({ ...optimizationResult, usedModel: aiResult.usedModel, error: aiResult.error });
  } catch {
    return c.json({
      optimizedHeadline: "Optimization failed. Please try again.",
      optimizedSummary: "Could not generate summary.",
      suggestedSkills: [],
      recommendations: [],
      contentStrategy: [],
      usedModel: aiResult.usedModel,
      error: aiResult.error || "AI response could not be parsed as JSON"
    });
  }
});

// Interview Simulation
app.post("/api/interview/start", zValidator("json", StartInterviewSchema), async (c) => {
  const data = c.req.valid("json");
  const interviewTypePrompts: Record<string, string> = {
    behavioral: "behavioral interview questions using the STAR method",
    technical: "technical questions relevant to the role",
    case: "case study and problem-solving questions",
    cultural: "cultural fit and company values questions"
  };
  const prompt = `Generate 10 realistic ${interviewTypePrompts[data.interviewType] || interviewTypePrompts.behavioral} for this position:
    Job Title: ${data.jobTitle}
    ${data.jobDescription ? `Job Description: ${data.jobDescription}` : ''}
    Candidate Experience: ${data.experience}
    Return as a JSON array of questions: ["question1", "question2", ...]`;
  const systemPrompt = "You are an expert interview coach and HR professional. Create realistic, challenging interview questions that help candidates prepare effectively. Always respond with valid JSON array format.";
  const geminiParams: GeminiGenerateParams = {
    contents: [{ role: "user", parts: [{ text: `${systemPrompt}\n\n${prompt}` }] }],
    generationConfig: { temperature: 0.6, maxOutputTokens: 1000 },
  };
  const aiResult = await generateWithFallback(c.env, geminiParams, {
    systemPrompt,
    prompt,
    max_tokens: 1000,
    temperature: 0.6,
  });
  let questions: string[] = [];
  try {
    questions = JSON.parse(aiResult.content);
  } catch {
    questions = [
      "Tell me about a time you faced a challenge at work.",
      "What are your biggest strengths?",
      "Why are you interested in this role?"
    ];
  }
  const dbResult = await c.env.careerwise_db.prepare(
    "INSERT INTO interview_sessions (user_id, job_title, interview_type, questions, created_at, updated_at) VALUES (?, ?, ?, ?, datetime('now'), datetime('now'))"
  ).bind('user_temp', data.jobTitle, data.interviewType, JSON.stringify(questions)).run();
  return c.json({
    id: dbResult.meta.last_row_id,
    user_id: 'user_temp',
    job_title: data.jobTitle,
    interview_type: data.interviewType,
    questions,
    currentQuestionIndex: 0,
    usedModel: aiResult.usedModel,
    error: aiResult.error,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });
});


// --- Database query endpoints (no changes needed) ---

app.get("/api/resumes", async (c) => {
  const result = await c.env.careerwise_db.prepare("SELECT * FROM resumes WHERE user_id = ? ORDER BY created_at DESC").bind('user_temp').all();
  return c.json(result.results);
});

app.get("/api/cover-letters", async (c) => {
    const result = await c.env.careerwise_db.prepare("SELECT * FROM cover_letters WHERE user_id = ? ORDER BY created_at DESC").bind('user_temp').all();
    return c.json(result.results);
});

app.post("/api/interview/next-question", async (c) => {
  const { sessionId, currentQuestionIndex } = await c.req.json();
  const session = await c.env.careerwise_db.prepare("SELECT * FROM interview_sessions WHERE id = ?").bind(sessionId).first();
  if (!session) {
    return c.json({ error: "Interview session not found" }, 404);
  }
  const questions = JSON.parse(session.questions as string);
  const nextIndex = currentQuestionIndex + 1;
  if (nextIndex >= questions.length) {
    return c.json({
      question: "Interview completed! Great job practicing. Review your responses and keep practicing to improve your confidence.",
      isComplete: true
    });
  }
  return c.json({
    question: questions[nextIndex],
    isComplete: false
  });
});

export default app;