import { Hono } from "hono";
import { cors } from "hono/cors";
import { zValidator } from "@hono/zod-validator";
import OpenAI from "openai";
import {
  CreateResumeSchema,
  CreateCoverLetterSchema,
  CoachingMessageSchema,
  ATSAnalysisRequestSchema,
  LinkedInOptimizationRequestSchema,
  StartInterviewSchema,
} from "@/shared/types";

const app = new Hono<{ Bindings: Env }>();

app.use("*", cors());

// Initialize OpenAI client
function getOpenAIClient(env: Env) {
  return new OpenAI({
    apiKey: env.OPENAI_API_KEY,
  });
}

// Resume generation endpoint
app.post("/api/resume/generate", zValidator("json", CreateResumeSchema), async (c) => {
  try {
    const data = c.req.valid("json");
    const openai = getOpenAIClient(c.env);

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

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a professional resume writer with expertise in creating compelling resumes that get results. Format the resume with clear sections and use action verbs and quantifiable achievements where possible."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 1500,
      temperature: 0.7,
    });

    const resumeContent = completion.choices[0]?.message?.content || "Failed to generate resume content";

    // Store in database
    const dbResult = await c.env.DB.prepare(
      "INSERT INTO resumes (user_id, title, content, formatted_content, created_at, updated_at) VALUES (?, ?, ?, ?, datetime('now'), datetime('now'))"
    ).bind(
      'user_temp', // TODO: Replace with actual user ID when auth is implemented
      `${data.personalInfo.name} - Resume`,
      JSON.stringify(data),
      resumeContent
    ).run();

    return c.json({
      id: dbResult.meta.last_row_id,
      content: resumeContent,
      success: true
    });
  } catch (error) {
    console.error("Resume generation error:", error);
    return c.json({ error: "Failed to generate resume" }, 500);
  }
});

// Cover letter generation endpoint
app.post("/api/cover-letter/generate", zValidator("json", CreateCoverLetterSchema), async (c) => {
  try {
    const data = c.req.valid("json");
    const openai = getOpenAIClient(c.env);

    const toneInstructions = {
      professional: "Use a formal, professional tone",
      enthusiastic: "Use an enthusiastic and energetic tone",
      creative: "Use a creative and engaging tone"
    };

    const prompt = `Write a compelling cover letter for the following job application:

Job Title: ${data.jobTitle}
Company: ${data.companyName}
Job Description: ${data.jobDescription}

Applicant's Experience/Background: ${data.personalExperience}

Tone: ${toneInstructions[data.tone]}

Create a personalized cover letter that highlights relevant experience, shows enthusiasm for the role, and demonstrates knowledge of the company. The letter should be professional, concise, and compelling.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an expert career coach and professional writer specializing in creating compelling cover letters that get interviews. Write personalized, engaging cover letters that highlight the candidate's strengths and fit for the role."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 1000,
      temperature: 0.7,
    });

    const coverLetterContent = completion.choices[0]?.message?.content || "Failed to generate cover letter content";

    // Store in database
    const dbResult = await c.env.DB.prepare(
      "INSERT INTO cover_letters (user_id, job_title, company_name, content, created_at, updated_at) VALUES (?, ?, ?, ?, datetime('now'), datetime('now'))"
    ).bind(
      'user_temp', // TODO: Replace with actual user ID when auth is implemented
      data.jobTitle,
      data.companyName,
      coverLetterContent
    ).run();

    return c.json({
      id: dbResult.meta.last_row_id,
      content: coverLetterContent,
      success: true
    });
  } catch (error) {
    console.error("Cover letter generation error:", error);
    return c.json({ error: "Failed to generate cover letter" }, 500);
  }
});

// Career coaching chat endpoint
app.post("/api/coaching/chat", zValidator("json", CoachingMessageSchema), async (c) => {
  try {
    const message = c.req.valid("json");
    const openai = getOpenAIClient(c.env);

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are Coach Leo, an expert career coach with years of experience helping professionals advance their careers. You provide personalized advice on career development, job search strategies, interview preparation, salary negotiation, and professional growth. Be supportive, actionable, and encouraging in your responses."
        },
        {
          role: "user",
          content: message.content
        }
      ],
      max_tokens: 800,
      temperature: 0.8,
    });

    const response = completion.choices[0]?.message?.content || "I apologize, but I'm having trouble generating a response right now. Please try again.";

    return c.json({
      role: "assistant",
      content: response,
      timestamp: new Date().toISOString(),
      success: true
    });
  } catch (error) {
    console.error("Coaching chat error:", error);
    return c.json({ error: "Failed to get coaching response" }, 500);
  }
});

// Get user's resumes
app.get("/api/resumes", async (c) => {
  try {
    const result = await c.env.DB.prepare(
      "SELECT * FROM resumes WHERE user_id = ? ORDER BY created_at DESC"
    ).bind('user_temp').all();

    return c.json(result.results);
  } catch (error) {
    return c.json({ error: "Failed to fetch resumes" }, 500);
  }
});

// Get user's cover letters
app.get("/api/cover-letters", async (c) => {
  try {
    const result = await c.env.DB.prepare(
      "SELECT * FROM cover_letters WHERE user_id = ? ORDER BY created_at DESC"
    ).bind('user_temp').all();

    return c.json(result.results);
  } catch (error) {
    return c.json({ error: "Failed to fetch cover letters" }, 500);
  }
});

// ATS Resume Analysis endpoint
app.post("/api/ats/analyze", zValidator("json", ATSAnalysisRequestSchema), async (c) => {
  try {
    const { jobDescription, resume } = c.req.valid("json");
    const openai = getOpenAIClient(c.env);

    const prompt = `Analyze this resume against the job description for ATS (Applicant Tracking System) compatibility:

JOB DESCRIPTION:
${jobDescription}

CURRENT RESUME:
${resume}

Please provide:
1. An ATS compatibility score (0-100)
2. A brief description of the score
3. Missing keywords that should be added
4. Keywords that are already present
5. Specific recommendations for improvement
6. An optimized version of the resume

Format your response as JSON with the following structure:
{
  "score": number,
  "scoreDescription": "string",
  "missingKeywords": ["keyword1", "keyword2"],
  "foundKeywords": ["keyword1", "keyword2"],
  "recommendations": ["recommendation1", "recommendation2"],
  "optimizedResume": "full optimized resume text"
}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an expert ATS and resume optimization specialist. Analyze resumes for keyword density, ATS compatibility, and provide actionable improvements. Always respond with valid JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 2000,
      temperature: 0.3,
    });

    const responseText = completion.choices[0]?.message?.content || "";
    
    try {
      const analysisResult = JSON.parse(responseText);
      return c.json(analysisResult);
    } catch (parseError) {
      // Fallback if JSON parsing fails
      return c.json({
        score: 75,
        scoreDescription: "Analysis completed with moderate ATS compatibility",
        missingKeywords: ["relevant keywords", "industry terms"],
        foundKeywords: ["experience", "skills", "education"],
        recommendations: ["Add more relevant keywords from the job description", "Improve formatting for ATS readability"],
        optimizedResume: "Please resubmit for a complete optimized version"
      });
    }
  } catch (error) {
    console.error("ATS analysis error:", error);
    return c.json({ error: "Failed to analyze ATS compatibility" }, 500);
  }
});

// LinkedIn Profile Optimization endpoint
app.post("/api/linkedin/optimize", zValidator("json", LinkedInOptimizationRequestSchema), async (c) => {
  try {
    const data = c.req.valid("json");
    const openai = getOpenAIClient(c.env);

    const prompt = `Optimize this LinkedIn profile for better visibility and professional impact:

CURRENT PROFILE:
Headline: ${data.currentProfile.headline}
Summary: ${data.currentProfile.summary}
Experience: ${data.currentProfile.experience}
Skills: ${data.currentProfile.skills}

TARGET ROLE: ${data.targetRole}
INDUSTRY: ${data.industry}
CAREER GOALS: ${data.careerGoals}

Please provide:
1. An optimized headline that's compelling and keyword-rich
2. An optimized summary/about section
3. Suggested skills to add or emphasize
4. Key recommendations for profile improvement
5. Content strategy suggestions for posts and engagement

Format as JSON:
{
  "optimizedHeadline": "string",
  "optimizedSummary": "string",
  "suggestedSkills": ["skill1", "skill2"],
  "recommendations": ["rec1", "rec2"],
  "contentStrategy": ["strategy1", "strategy2"]
}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a LinkedIn optimization expert and personal branding specialist. Create compelling, professional profiles that attract recruiters and opportunities. Always respond with valid JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 1500,
      temperature: 0.4,
    });

    const responseText = completion.choices[0]?.message?.content || "";
    
    try {
      const optimizationResult = JSON.parse(responseText);
      return c.json(optimizationResult);
    } catch (parseError) {
      // Fallback if JSON parsing fails
      return c.json({
        optimizedHeadline: `${data.targetRole} | ${data.industry} Professional`,
        optimizedSummary: "Optimized summary would appear here with relevant keywords and compelling narrative that showcases your value proposition and career achievements.",
        suggestedSkills: ["Leadership", "Strategic Planning", "Data Analysis", "Project Management"],
        recommendations: ["Add a professional headshot", "Engage with industry content regularly", "Connect with industry professionals"],
        contentStrategy: ["Share industry insights and trends", "Comment thoughtfully on posts", "Publish articles about your expertise"]
      });
    }
  } catch (error) {
    console.error("LinkedIn optimization error:", error);
    return c.json({ error: "Failed to optimize LinkedIn profile" }, 500);
  }
});

// Interview Simulation endpoints
app.post("/api/interview/start", zValidator("json", StartInterviewSchema), async (c) => {
  try {
    const data = c.req.valid("json");
    const openai = getOpenAIClient(c.env);

    const interviewTypePrompts = {
      behavioral: "behavioral interview questions using the STAR method",
      technical: "technical questions relevant to the role",
      case: "case study and problem-solving questions",
      cultural: "cultural fit and company values questions"
    };

    const prompt = `Generate 10 realistic ${interviewTypePrompts[data.interviewType]} for this position:

Job Title: ${data.jobTitle}
${data.jobDescription ? `Job Description: ${data.jobDescription}` : ''}
Candidate Experience: ${data.experience}

Create questions that are:
1. Relevant to the role and experience level
2. Progressively challenging
3. Industry-appropriate
4. Realistic for actual interviews

Return as a JSON array of questions: ["question1", "question2", ...]`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an expert interview coach and HR professional. Create realistic, challenging interview questions that help candidates prepare effectively. Always respond with valid JSON array format."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 1000,
      temperature: 0.6,
    });

    const responseText = completion.choices[0]?.message?.content || "";
    
    let questions: string[];
    try {
      questions = JSON.parse(responseText);
    } catch (parseError) {
      // Fallback questions based on interview type
      const fallbackQuestions = {
        behavioral: [
          "Tell me about yourself and your background.",
          "Describe a challenging situation you faced at work and how you handled it.",
          "Give me an example of a time when you had to work with a difficult team member.",
          "Tell me about a time when you had to meet a tight deadline.",
          "Describe a situation where you had to adapt to significant changes."
        ],
        technical: [
          "Walk me through your technical experience and expertise.",
          "How do you approach problem-solving in your technical work?",
          "Describe a challenging technical project you've worked on.",
          "How do you stay updated with the latest technology trends?",
          "Explain a complex technical concept to someone non-technical."
        ],
        case: [
          "How would you approach analyzing this business problem?",
          "Walk me through your problem-solving methodology.",
          "What factors would you consider when making this decision?",
          "How would you prioritize these competing objectives?",
          "What data would you need to solve this challenge?"
        ],
        cultural: [
          "What type of work environment do you thrive in?",
          "How do you handle feedback and criticism?",
          "Describe your ideal team dynamic.",
          "What motivates you in your work?",
          "How do you maintain work-life balance?"
        ]
      };
      questions = fallbackQuestions[data.interviewType] || fallbackQuestions.behavioral;
    }

    // Store interview session in database
    const dbResult = await c.env.DB.prepare(
      "INSERT INTO interview_sessions (user_id, job_title, interview_type, questions, created_at, updated_at) VALUES (?, ?, ?, ?, datetime('now'), datetime('now'))"
    ).bind(
      'user_temp',
      data.jobTitle,
      data.interviewType,
      JSON.stringify(questions)
    ).run();

    return c.json({
      id: dbResult.meta.last_row_id,
      user_id: 'user_temp',
      job_title: data.jobTitle,
      interview_type: data.interviewType,
      questions,
      currentQuestionIndex: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Interview start error:", error);
    return c.json({ error: "Failed to start interview session" }, 500);
  }
});

app.post("/api/interview/next-question", async (c) => {
  try {
    const { sessionId, currentQuestionIndex } = await c.req.json();
    
    // Get session from database
    const session = await c.env.DB.prepare(
      "SELECT * FROM interview_sessions WHERE id = ?"
    ).bind(sessionId).first();

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
  } catch (error) {
    console.error("Next question error:", error);
    return c.json({ error: "Failed to get next question" }, 500);
  }
});

export default app;
