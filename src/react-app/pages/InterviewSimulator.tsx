import { useState, useRef, useEffect } from 'react';
import { Play, Square, Mic, MicOff, Video, VideoOff, RotateCcw, Download, Loader2 } from 'lucide-react';
import Layout from '@/react-app/components/Layout';
import type { InterviewSessionType } from '@/shared/types';

export default function InterviewSimulator() {
  const [isRecording, setIsRecording] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [sessionData, setSessionData] = useState({
    jobTitle: '',
    jobDescription: '',
    experience: '',
    interviewType: 'behavioral' as 'behavioral' | 'technical' | 'case' | 'cultural',
  });
  const [interviewSession, setInterviewSession] = useState<InterviewSessionType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  const startInterview = async () => {
    if (!sessionData.jobTitle || !sessionData.experience) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/interview/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sessionData),
      });

      if (!response.ok) throw new Error('Failed to start interview');

      const result = await response.json();
      setInterviewSession(result);
      setCurrentQuestion(result.questions[0]);
      setHasStarted(true);
    } catch (error) {
      console.error('Error starting interview:', error);
      alert('Failed to start interview. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getNextQuestion = async () => {
    if (!interviewSession) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/interview/next-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: interviewSession.id,
          currentQuestionIndex: interviewSession.currentQuestionIndex,
        }),
      });

      if (!response.ok) throw new Error('Failed to get next question');

      const result = await response.json();
      setCurrentQuestion(result.question);
      setInterviewSession(prev => prev ? { ...prev, currentQuestionIndex: prev.currentQuestionIndex + 1 } : null);
    } catch (error) {
      console.error('Error getting next question:', error);
      alert('Failed to get next question. Please try again.');
    } finally {
      setIsLoading(false);
    }
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
    }
  };

  const resetInterview = () => {
    setHasStarted(false);
    setInterviewSession(null);
    setCurrentQuestion('');
    setIsRecording(false);
    stopRecording();
  };

  const downloadRecording = () => {
    if (recordedChunksRef.current.length === 0) return;

    const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
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
        mediaRecorderRef.current.stream?.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  if (!hasStarted) {
    return (
      <Layout title="Interview Simulator">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <Video className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Interview Setup</h2>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Title
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
                  Your Experience Level
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
                <label className="flex items-center space-x-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={isVideoEnabled}
                    onChange={(e) => setIsVideoEnabled(e.target.checked)}
                    className="w-5 h-5 text-purple-600"
                  />
                  <Video className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-700">Enable Camera</span>
                </label>

                <label className="flex items-center space-x-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
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
      </Layout>
    );
  }

  return (
    <Layout title="Interview Simulator">
      <div className="max-w-6xl mx-auto">
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
                  </div>
                )}
              </div>

              {/* Recording Controls */}
              <div className="flex items-center justify-center space-x-4">
                {!isRecording ? (
                  <button
                    onClick={startRecording}
                    className="flex items-center space-x-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <Play className="w-5 h-5" />
                    <span>Start Recording</span>
                  </button>
                ) : (
                  <button
                    onClick={stopRecording}
                    className="flex items-center space-x-2 bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <Square className="w-5 h-5" />
                    <span>Stop Recording</span>
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
                disabled={isLoading}
                className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Loading...</span>
                  </div>
                ) : (
                  'Next Question'
                )}
              </button>

              {interviewSession && (
                <div className="text-sm text-gray-600 text-center">
                  Question {interviewSession.currentQuestionIndex + 1} of {interviewSession.questions.length}
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
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
