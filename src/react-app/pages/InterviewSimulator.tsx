import { useState, useRef, useEffect } from 'react';
import { Play, Square, Mic, MicOff, Video, VideoOff, RotateCcw, Download, Loader2, CheckCircle, ArrowRight } from 'lucide-react';

// Types
interface InterviewSessionType {
  currentQuestionIndex: number;
  questions: string[];
  sessionId: string;
}

interface SessionData {
  jobTitle: string;
  jobDescription: string;
  experience: string;
  interviewType: 'behavioral' | 'technical' | 'case' | 'cultural';
}

export default function InterviewSimulator() {
  const [isRecording, setIsRecording] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [sessionData, setSessionData] = useState<SessionData>({
    jobTitle: '',
    jobDescription: '',
    experience: '',
    interviewType: 'behavioral',
  });
  const [interviewSession, setInterviewSession] = useState<InterviewSessionType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  // Generate interview questions based on job type and experience
  const generateInterviewQuestions = (data: SessionData): string[] => {
    const questionBank = {
      behavioral: [
        "Tell me about yourself and what brings you to this role.",
        "Describe a time when you had to overcome a significant challenge at work.",
        "Give me an example of when you had to work with a difficult team member.",
        "Tell me about a time when you failed and what you learned from it.",
        "Describe a situation where you had to adapt to change quickly.",
        "Give me an example of when you went above and beyond your job duties.",
        "Tell me about a time when you had to make a difficult decision with limited information.",
        "Describe a situation where you had to influence someone without direct authority.",
        "Give me an example of when you received constructive feedback and how you handled it.",
        "Tell me about your greatest professional achievement."
      ],
      technical: [
        "Walk me through your approach to solving complex technical problems.",
        "Describe your experience with the key technologies mentioned in the job description.",
        "How do you stay current with new technologies and industry trends?",
        "Tell me about a time when you had to debug a particularly challenging issue.",
        "Describe your experience with system design and architecture decisions.",
        "How do you ensure code quality and maintainability in your projects?",
        "Walk me through your testing methodology and quality assurance practices.",
        "Describe a time when you had to optimize performance in a system you built.",
        "How do you approach learning new programming languages or frameworks?",
        "Tell me about your experience with collaborative development and version control."
      ],
      case: [
        "How would you approach entering a new market with this product?",
        "Walk me through how you'd analyze declining user engagement metrics.",
        "How would you prioritize features for our next product release?",
        "Describe your approach to identifying and solving operational inefficiencies.",
        "How would you handle a situation where a key client is considering leaving?",
        "Walk me through your process for making data-driven decisions.",
        "How would you approach cost reduction while maintaining quality?",
        "Describe how you'd launch a new initiative across multiple departments.",
        "How would you handle competing priorities from different stakeholders?",
        "Walk me through your approach to risk assessment for new projects."
      ],
      cultural: [
        "What type of work environment brings out your best performance?",
        "How do you handle disagreements with colleagues or supervisors?",
        "Describe your ideal team dynamic and collaboration style.",
        "What motivates you most in your professional life?",
        "How do you maintain work-life balance during busy periods?",
        "Tell me about a time when you had to adapt to a new company culture.",
        "How do you prefer to receive and give feedback?",
        "Describe your approach to professional development and continuous learning.",
        "What role do you typically take on in team projects?",
        "How do you handle stress and pressure in the workplace?"
      ]
    };

    // Get questions for the selected type
    let questions = [...questionBank[data.interviewType]];
    
    // Customize first question based on job title
    if (data.jobTitle) {
      questions[0] = `Tell me about yourself and what interests you about this ${data.jobTitle} position.`;
    }

    // Shuffle and return first 8 questions
    return questions.sort(() => 0.5 - Math.random()).slice(0, 8);
  };

  const startInterview = async () => {
    if (!sessionData.jobTitle || !sessionData.experience) return;

    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const questions = generateInterviewQuestions(sessionData);
      const session: InterviewSessionType = {
        currentQuestionIndex: 0,
        questions,
        sessionId: Date.now().toString()
      };
      
      setInterviewSession(session);
      setCurrentQuestion(questions[0]);
      setHasStarted(true);
      setIsLoading(false);
    }, 1000);
  };

  const getNextQuestion = () => {
    if (!interviewSession) return;

    const nextIndex = interviewSession.currentQuestionIndex + 1;
    if (nextIndex < interviewSession.questions.length) {
      setCurrentQuestion(interviewSession.questions[nextIndex]);
      setInterviewSession(prev => prev ? { 
        ...prev, 
        currentQuestionIndex: nextIndex 
      } : null);
    } else {
      // Interview completed
      setCurrentQuestion("Thank you for completing the interview practice! Review your recordings and practice areas for improvement.");
    }
  };

  // Generate feedback based on question type and user context
  const generateFeedback = (questionIndex: number) => {
    const feedbackTemplates = {
      behavioral: [
        "Great job! For behavioral questions, remember to use the STAR method: Situation, Task, Action, Result. Be specific about your role and the outcome.",
        "Good answer! Try to quantify your achievements when possible. Numbers and percentages make your examples more compelling.",
        "Nice response! Consider preparing 3-4 detailed examples you can adapt to different behavioral questions.",
      ],
      technical: [
        "Excellent technical explanation! Remember to explain your thought process clearly and consider edge cases.",
        "Good approach! Don't forget to discuss trade-offs and alternative solutions you considered.",
        "Solid answer! Consider mentioning specific tools or technologies you'd use and why.",
      ],
      case: [
        "Great analytical thinking! Structure your approach clearly: understand the problem, gather data, analyze, and recommend.",
        "Good framework! Remember to state your assumptions clearly and think about potential risks.",
        "Nice problem-solving approach! Consider how you'd measure success and iterate on your solution.",
      ],
      cultural: [
        "Authentic answer! Show how your values align with the company culture and role requirements.",
        "Good self-awareness! Provide specific examples that demonstrate your cultural fit.",
        "Great insight! Connect your answer to how you'd contribute to the team and company success.",
      ]
    };

    const templates = feedbackTemplates[sessionData.interviewType];
    const randomFeedback = templates[questionIndex % templates.length];
    
    return `${randomFeedback}\n\nAdditional tips:\n• Maintain good eye contact with the camera\n• Speak at a steady pace\n• Use specific examples from your experience\n• End with a question about the role or company`;
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: isVideoEnabled,
        audio: isAudioEnabled,
      });

      if (videoRef.current && isVideoEnabled) {
        videoRef.current.srcObject = stream;
      }

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      recordedChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Failed to start recording. Please check your camera and microphone permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);

      // Generate feedback for current question
      if (interviewSession) {
        const feedback = generateFeedback(interviewSession.currentQuestionIndex);
        setFeedback(feedback);
        setShowFeedback(true);
      }

      // Stop all tracks
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    }
  };

  const resetInterview = () => {
    setHasStarted(false);
    setInterviewSession(null);
    setCurrentQuestion('');
    setIsRecording(false);
    setFeedback('');
    setShowFeedback(false);
    
    // Stop recording if active
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      stopRecording();
    }
  };

  const downloadRecording = () => {
    if (recordedChunksRef.current.length === 0) return;

    const blob = new Blob(recordedChunksRef.current, { 
      type: isVideoEnabled ? 'video/webm' : 'audio/webm' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `interview_practice_${Date.now()}.webm`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current) {
        const stream = mediaRecorderRef.current.stream;
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
        }
      }
    };
  }, []);

  if (!hasStarted) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <Video className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Interview Practice Simulator</h2>
                <p className="text-gray-600">Prepare for your next interview with AI-powered practice sessions</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g., Senior Product Manager"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  value={sessionData.jobTitle}
                  onChange={(e) => setSessionData(prev => ({ ...prev, jobTitle: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Description (Optional)
                </label>
                <textarea
                  placeholder="Paste job description for more targeted questions..."
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  value={sessionData.jobDescription}
                  onChange={(e) => setSessionData(prev => ({ ...prev, jobDescription: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Experience Level *
                </label>
                <textarea
                  placeholder="Describe your relevant experience and background..."
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  value={sessionData.experience}
                  onChange={(e) => setSessionData(prev => ({ ...prev, experience: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Interview Type
                </label>
                <select
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  value={sessionData.interviewType}
                  onChange={(e) => setSessionData(prev => ({ ...prev, interviewType: e.target.value as any }))}
                >
                  <option value="behavioral">Behavioral Interview</option>
                  <option value="technical">Technical Interview</option>
                  <option value="case">Case Study Interview</option>
                  <option value="cultural">Cultural Fit Interview</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex items-center space-x-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="checkbox"
                    checked={isVideoEnabled}
                    onChange={(e) => setIsVideoEnabled(e.target.checked)}
                    className="w-5 h-5 text-purple-600"
                  />
                  <Video className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-700">Enable Camera</span>
                </label>

                <label className="flex items-center space-x-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="checkbox"
                    checked={isAudioEnabled}
                    onChange={(e) => setIsAudioEnabled(e.target.checked)}
                    className="w-5 h-5 text-purple-600"
                  />
                  <Mic className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-700">Enable Microphone</span>
                </label>
              </div>

              <button
                onClick={startInterview}
                disabled={isLoading || !sessionData.jobTitle || !sessionData.experience}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 rounded-xl font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Preparing Interview...</span>
                  </div>
                ) : (
                  'Start Interview Practice'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Video/Audio Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Practice Session</h2>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setIsVideoEnabled(!isVideoEnabled)}
                    className={`p-3 rounded-lg transition-colors ${
                      isVideoEnabled ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {isVideoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                  </button>
                  <button
                    onClick={() => setIsAudioEnabled(!isAudioEnabled)}
                    className={`p-3 rounded-lg transition-colors ${
                      isAudioEnabled ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {isAudioEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Video Preview */}
              <div className="bg-gray-900 rounded-lg mb-6 h-80 flex items-center justify-center">
                {isVideoEnabled ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="text-gray-400 text-center">
                    <Video className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>Camera is disabled</p>
                    <p className="text-sm mt-2">Enable camera for video practice</p>
                  </div>
                )}
              </div>

              {/* Recording Controls */}
              <div className="flex items-center justify-center space-x-4">
                {!isRecording ? (
                  <button
                    onClick={startRecording}
                    disabled={!isAudioEnabled && !isVideoEnabled}
                    className="flex items-center space-x-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Play className="w-5 h-5" />
                    <span>Start Recording Answer</span>
                  </button>
                ) : (
                  <button
                    onClick={stopRecording}
                    className="flex items-center space-x-2 bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <Square className="w-5 h-5" />
                    <span>Stop & Get Feedback</span>
                  </button>
                )}

                {recordedChunksRef.current.length > 0 && (
                  <button
                    onClick={downloadRecording}
                    className="flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Download className="w-5 h-5" />
                    <span>Download</span>
                  </button>
                )}

                <button
                  onClick={resetInterview}
                  className="flex items-center space-x-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <RotateCcw className="w-5 h-5" />
                  <span>Reset</span>
                </button>
              </div>
            </div>

            {/* Feedback Section */}
            {showFeedback && feedback && (
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 mt-6">
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <h3 className="text-lg font-semibold text-gray-900">AI Feedback</h3>
                </div>
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <pre className="whitespace-pre-wrap text-sm text-gray-800 font-sans">
                    {feedback}
                  </pre>
                </div>
                <button
                  onClick={() => setShowFeedback(false)}
                  className="mt-4 text-sm text-blue-600 hover:text-blue-700"
                >
                  Dismiss feedback
                </button>
              </div>
            )}
          </div>

          {/* Question Panel */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Interview Questions</h2>

            {currentQuestion && (
              <div className="bg-purple-50 rounded-lg p-6 mb-6 border border-purple-100">
                <h3 className="font-semibold text-purple-900 mb-3">Current Question:</h3>
                <p className="text-gray-800 leading-relaxed">{currentQuestion}</p>
              </div>
            )}

            <div className="space-y-4">
              <button
                onClick={getNextQuestion}
                disabled={isRecording || !interviewSession}
                className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <ArrowRight className="w-4 h-4" />
                Next Question
              </button>

              {interviewSession && (
                <div className="text-sm text-gray-600 text-center">
                  Question {Math.min(interviewSession.currentQuestionIndex + 1, interviewSession.questions.length)} of {interviewSession.questions.length}
                </div>
              )}
            </div>

            {/* Tips */}
            <div className="mt-8 bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Interview Tips</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Use the STAR method (Situation, Task, Action, Result)</li>
                <li>• Maintain eye contact with the camera</li>
                <li>• Speak clearly and at a moderate pace</li>
                <li>• Take a moment to think before answering</li>
                <li>• Ask clarifying questions if needed</li>
                <li>• Practice your elevator pitch</li>
              </ul>
            </div>

            {/* Interview Type Info */}
            <div className="mt-6 bg-blue-50 rounded-lg p-4 border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-2">
                {sessionData.interviewType.charAt(0).toUpperCase() + sessionData.interviewType.slice(1)} Interview
              </h4>
              <p className="text-sm text-blue-800">
                {sessionData.interviewType === 'behavioral' && 'Focus on past experiences and how you handled specific situations.'}
                {sessionData.interviewType === 'technical' && 'Demonstrate your technical knowledge and problem-solving approach.'}
                {sessionData.interviewType === 'case' && 'Think analytically and structure your approach to business problems.'}
                {sessionData.interviewType === 'cultural' && 'Show how you align with company values and team dynamics.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}