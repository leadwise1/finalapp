import { useState } from 'react';
import { FileText, MessageCircle, BarChart3, Loader2, CheckCircle, AlertCircle, Brain, Zap } from 'lucide-react';

interface CareerCoachProps {
  question?: string;
}

interface ResumeAnalysis {
  overallScore: number;
  atsCompatibility: number;
  strengths: string[];
  improvements: string[];
  keywordsSuggested: string[];
  technicalSkillsFound: string[];
  softSkillsFound: string[];
  recommendations: string[];
}

interface InterviewQuestion {
  question: string;
  tip: string;
  category: string;
}

interface InterviewPrep {
  questions: InterviewQuestion[];
  tips: string[];
  questionsToAsk: string[];
}

interface Results {
  resumeAnalysis?: ResumeAnalysis;
  coverLetter?: string;
  interviewPrep?: InterviewPrep;
}

const CareerCoach: React.FC<CareerCoachProps> = () => {
  const [activeTab, setActiveTab] = useState('resume');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Results>({});
  const [error, setError] = useState('');

  // Client-side AI analysis (no API needed)
  const analyzeResumeClientSide = (resumeText: string): ResumeAnalysis => {
    const text = resumeText.toLowerCase();
    
    const technicalSkills = [
      'javascript', 'python', 'java', 'react', 'node.js', 'sql', 'html', 'css',
      'machine learning', 'data analysis', 'project management', 'agile', 'scrum'
    ];
    
    const softSkills = [
      'leadership', 'communication', 'teamwork', 'problem solving', 'analytical',
      'creative', 'organizational', 'time management', 'adaptable', 'collaborative'
    ];

    const foundTechnical = technicalSkills.filter(skill => text.includes(skill));
    const foundSoft = softSkills.filter(skill => text.includes(skill));
    
    const wordCount = resumeText.split(' ').length;
    const hasContactInfo = /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/.test(resumeText) || /@/.test(resumeText);
    const hasExperience = text.includes('experience') || text.includes('worked') || text.includes('employed');
    const hasEducation = text.includes('education') || text.includes('degree') || text.includes('university');
    
    let score = 50;
    score += foundTechnical.length * 5;
    score += foundSoft.length * 3;
    score += hasContactInfo ? 10 : 0;
    score += hasExperience ? 15 : 0;
    score += hasEducation ? 10 : 0;
    score += wordCount > 200 ? 10 : 0;
    
    score = Math.min(score, 100);

    return {
      overallScore: score,
      atsCompatibility: Math.max(score - 10, 60),
      strengths: [
        ...foundTechnical.slice(0, 3).map(skill => `Strong ${skill} skills mentioned`),
        hasExperience ? 'Clear work experience presented' : 'Professional background included',
        hasContactInfo ? 'Contact information provided' : 'Basic information included'
      ].filter(Boolean),
      improvements: [
        foundTechnical.length < 3 ? 'Add more technical skills relevant to your field' : null,
        foundSoft.length < 2 ? 'Include more soft skills and interpersonal abilities' : null,
        wordCount < 200 ? 'Expand resume content for better detail' : null,
        !hasContactInfo ? 'Add complete contact information' : null
      ].filter(Boolean) as string[],
      keywordsSuggested: [
        'professional', 'experienced', 'skilled', 'proficient', 'accomplished',
        'results-driven', 'detail-oriented', 'innovative'
      ],
      technicalSkillsFound: foundTechnical,
      softSkillsFound: foundSoft,
      recommendations: [
        'Use action verbs to describe achievements',
        'Quantify results with numbers and percentages',
        'Tailor resume to specific job descriptions',
        'Keep formatting consistent and professional'
      ]
    };
  };

  const generateCoverLetterTemplate = (jobTitle: string, companyName: string, userBackground: string): string => {
    const templates = {
      tech: `Dear Hiring Manager,

I am writing to express my strong interest in the ${jobTitle} position at ${companyName}. With my background in ${userBackground}, I am excited about the opportunity to contribute to your team's continued success.

In my previous experience, I have developed strong skills that directly align with your requirements. My background in ${userBackground} has equipped me with the technical expertise and problem-solving abilities that would be valuable in this role.

I am particularly drawn to ${companyName} because of its reputation for innovation and commitment to excellence. I would welcome the opportunity to discuss how my skills and enthusiasm can contribute to your team's goals.

Thank you for considering my application. I look forward to hearing from you.

Sincerely,
[Your Name]`,

      business: `Dear Hiring Manager,

I am pleased to submit my application for the ${jobTitle} position at ${companyName}. My background in ${userBackground} has prepared me well for this opportunity, and I am eager to bring my skills and dedication to your organization.

Throughout my career, I have consistently demonstrated the ability to deliver results and work effectively in team environments. My experience with ${userBackground} has given me insights that would be directly applicable to the challenges and opportunities in this role.

${companyName}'s commitment to excellence and innovation aligns perfectly with my professional values and career aspirations. I am confident that my background and enthusiasm make me a strong candidate for this position.

I would appreciate the opportunity to discuss how I can contribute to your team's success. Thank you for your time and consideration.

Best regards,
[Your Name]`,

      general: `Dear Hiring Team,

I am writing to apply for the ${jobTitle} position at ${companyName}. With my experience in ${userBackground}, I believe I would be a valuable addition to your team.

My background has provided me with a strong foundation in problem-solving, communication, and collaborative work. I am particularly interested in this opportunity because it aligns with my career goals and allows me to leverage my existing skills while continuing to grow professionally.

I am impressed by ${companyName}'s mission and values, and I would be honored to contribute to your organization's continued success. My dedication to excellence and continuous learning would make me a committed team member.

Thank you for considering my application. I look forward to the possibility of discussing this opportunity further.

Sincerely,
[Your Name]`
    };

    const bg = userBackground.toLowerCase();
    if (bg.includes('software') || bg.includes('tech') || bg.includes('developer') || bg.includes('programming')) {
      return templates.tech;
    } else if (bg.includes('business') || bg.includes('management') || bg.includes('marketing') || bg.includes('sales')) {
      return templates.business;
    } else {
      return templates.general;
    }
  };

  const generateInterviewQuestions = (jobTitle: string): InterviewPrep => {
    const questionBank = {
      general: [
        {
          question: "Tell me about yourself.",
          tip: "Focus on professional background, key skills, and what you're looking for in your next role.",
          category: "Introduction"
        },
        {
          question: "Why are you interested in this position?",
          tip: "Connect your skills and goals with the company's mission and the specific role requirements.",
          category: "Motivation"
        },
        {
          question: "What are your greatest strengths?",
          tip: "Choose strengths relevant to the job and provide specific examples.",
          category: "Strengths"
        },
        {
          question: "Describe a challenge you overcame.",
          tip: "Use the STAR method: Situation, Task, Action, Result.",
          category: "Problem Solving"
        },
        {
          question: "Where do you see yourself in 5 years?",
          tip: "Show ambition while demonstrating commitment to growing with the company.",
          category: "Goals"
        }
      ],
      tech: [
        {
          question: "Describe your experience with specific technology.",
          tip: "Provide concrete examples and discuss projects you've worked on.",
          category: "Technical"
        },
        {
          question: "How do you stay updated with new technologies?",
          tip: "Mention specific resources, communities, or learning practices you use.",
          category: "Learning"
        }
      ]
    };

    const jobLower = jobTitle.toLowerCase();
    let selectedQuestions = [...questionBank.general];

    if (jobLower.includes('developer') || jobLower.includes('engineer') || jobLower.includes('programmer')) {
      selectedQuestions = [...selectedQuestions, ...questionBank.tech];
    }

    return {
      questions: selectedQuestions,
      tips: [
        "Research the company thoroughly before the interview",
        "Prepare specific examples using the STAR method",
        "Have thoughtful questions ready to ask the interviewer",
        "Practice your answers out loud beforehand"
      ],
      questionsToAsk: [
        "What does a typical day look like in this role?",
        "What are the biggest challenges facing the team right now?",
        "How do you measure success in this position?"
      ]
    };
  };

  const ResumeAnalyzer = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
        <div className="flex items-center gap-3 mb-4">
          <Brain className="w-6 h-6 text-blue-600" />
          <h3 className="text-xl font-semibold text-gray-800">AI Resume Analyzer</h3>
          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">FREE</span>
        </div>
        
        <textarea
          className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          placeholder="Paste your resume content here..."
          id="resumeText"
        />
        
        <button
          onClick={() => {
            const element = document.getElementById('resumeText') as HTMLTextAreaElement;
            const resumeText = element?.value || '';
            if (!resumeText.trim()) {
              setError('Please enter your resume content');
              return;
            }
            setError('');
            setLoading(true);
            
            setTimeout(() => {
              const analysis = analyzeResumeClientSide(resumeText);
              setResults((prev: Results) => ({ ...prev, resumeAnalysis: analysis }));
              setLoading(false);
            }, 1500);
          }}
          disabled={loading}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <BarChart3 className="w-4 h-4" />}
          {loading ? 'Analyzing Resume...' : 'Analyze My Resume'}
        </button>
        
        {error && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}
      </div>

      {results.resumeAnalysis && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h4 className="text-lg font-semibold mb-6 text-gray-800 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            Resume Analysis Results
          </h4>
          
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-blue-800">Overall Score</span>
                <span className="text-xl font-bold text-blue-900">{results.resumeAnalysis.overallScore}/100</span>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-3">
                <div 
                  className="bg-blue-600 h-3 rounded-full transition-all duration-1000" 
                  style={{ width: `${results.resumeAnalysis.overallScore}%` }}
                ></div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-green-800">ATS Compatibility</span>
                <span className="text-xl font-bold text-green-900">{results.resumeAnalysis.atsCompatibility}/100</span>
              </div>
              <div className="w-full bg-green-200 rounded-full h-3">
                <div 
                  className="bg-green-600 h-3 rounded-full transition-all duration-1000" 
                  style={{ width: `${results.resumeAnalysis.atsCompatibility}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h5 className="font-medium text-green-800 mb-3">Strengths</h5>
              <ul className="space-y-2">
                {results.resumeAnalysis.strengths.map((strength: string, index: number) => (
                  <li key={index} className="text-green-700 text-sm flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    {strength}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
              <h5 className="font-medium text-orange-800 mb-3">Improvements</h5>
              <ul className="space-y-2">
                {results.resumeAnalysis.improvements.map((improvement: string, index: number) => (
                  <li key={index} className="text-orange-700 text-sm flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                    {improvement}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const CoverLetterGenerator = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-50 to-teal-50 p-6 rounded-xl border border-green-100">
        <div className="flex items-center gap-3 mb-4">
          <FileText className="w-6 h-6 text-green-600" />
          <h3 className="text-xl font-semibold text-gray-800">Cover Letter Generator</h3>
          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">FREE</span>
        </div>
        
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Job Title *</label>
            <input
              type="text"
              id="jobTitle"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="e.g., Software Engineer"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Company Name *</label>
            <input
              type="text"
              id="companyName"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="e.g., Microsoft"
            />
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Your Background *</label>
          <textarea
            id="userBackground"
            className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 resize-none"
            placeholder="Brief description of your relevant experience, skills, and qualifications..."
          />
        </div>
        
        <button
          onClick={() => {
            const jobTitleElement = document.getElementById('jobTitle') as HTMLInputElement;
            const companyNameElement = document.getElementById('companyName') as HTMLInputElement;
            const userBackgroundElement = document.getElementById('userBackground') as HTMLTextAreaElement;
            
            const jobTitle = jobTitleElement?.value || '';
            const companyName = companyNameElement?.value || '';
            const userBackground = userBackgroundElement?.value || '';
            
            if (!jobTitle || !companyName || !userBackground) {
              setError('Please fill in all required fields');
              return;
            }
            
            setError('');
            setLoading(true);
            
            setTimeout(() => {
              const coverLetter = generateCoverLetterTemplate(jobTitle, companyName, userBackground);
              setResults((prev: Results) => ({ ...prev, coverLetter }));
              setLoading(false);
            }, 1000);
          }}
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
          {loading ? 'Generating...' : 'Generate Cover Letter'}
        </button>
      </div>

      {results.coverLetter && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-800">Generated Cover Letter</h4>
            <button
              onClick={() => navigator.clipboard.writeText(results.coverLetter!)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
            >
              Copy to Clipboard
            </button>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <pre className="whitespace-pre-wrap text-sm text-gray-800 font-sans leading-relaxed">
              {results.coverLetter}
            </pre>
          </div>
        </div>
      )}
    </div>
  );

  const InterviewPrep = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-100">
        <div className="flex items-center gap-3 mb-4">
          <MessageCircle className="w-6 h-6 text-purple-600" />
          <h3 className="text-xl font-semibold text-gray-800">Interview Preparation</h3>
          <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium">FREE</span>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
          <input
            type="text"
            id="interviewJobTitle"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            placeholder="e.g., Marketing Manager"
          />
        </div>
        
        <button
          onClick={() => {
            const element = document.getElementById('interviewJobTitle') as HTMLInputElement;
            const jobTitle = element?.value || 'General Position';
            setLoading(true);
            
            setTimeout(() => {
              const interviewPrep = generateInterviewQuestions(jobTitle);
              setResults((prev: Results) => ({ ...prev, interviewPrep }));
              setLoading(false);
            }, 800);
          }}
          disabled={loading}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <MessageCircle className="w-4 h-4" />}
          {loading ? 'Preparing Questions...' : 'Get Interview Questions'}
        </button>
      </div>

      {results.interviewPrep && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Interview Questions</h4>
          <div className="space-y-4">
            {results.interviewPrep.questions.map((q: InterviewQuestion, index: number) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h5 className="font-medium text-gray-800 mb-2">{q.question}</h5>
                <p className="text-sm text-gray-700">
                  <strong>Tip:</strong> {q.tip}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const tabs = [
    { id: 'resume', name: 'Resume Analysis', icon: BarChart3, component: ResumeAnalyzer },
    { id: 'cover', name: 'Cover Letter', icon: FileText, component: CoverLetterGenerator },
    { id: 'interview', name: 'Interview Prep', icon: MessageCircle, component: InterviewPrep },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">CareerWise AI Assistant</h1>
          <p className="text-gray-600">Free AI-powered career tools for everyone</p>
        </div>

        <div className="flex flex-wrap justify-center mb-8 border-b border-gray-200">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.name}
              </button>
            );
          })}
        </div>

        <div className="max-w-4xl mx-auto">
          {tabs.find(tab => tab.id === activeTab)?.component()}
        </div>
      </div>
    </div>
  );
};

export default CareerCoach;