import { useState, useRef, useEffect } from 'react';
import { Send, MessageCircle, User, Bot, Loader2 } from 'lucide-react';
import Layout from '@/react-app/components/Layout';
import type { CoachingMessageType } from '@/shared/types';

export default function Coaching() {
  const [messages, setMessages] = useState<CoachingMessageType[]>([
    {
      role: 'assistant',
      content: "Hello! I'm Coach Leo, your AI career coach. I'm here to help you with career development, job search strategies, interview preparation, resume advice, and any other professional goals you have. What would you like to discuss today?",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: CoachingMessageType = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/coaching/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userMessage),
      });

      if (!response.ok) throw new Error('Failed to get coaching response');

      const result = await response.json();
      setMessages(prev => [...prev, result]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: CoachingMessageType = {
        role: 'assistant',
        content: "I apologize, but I'm having trouble connecting right now. Please try again in a moment.",
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const quickQuestions = [
    "How do I negotiate a higher salary?",
    "What should I include in my LinkedIn profile?",
    "How do I prepare for a job interview?",
    "How can I switch careers successfully?",
    "What are some good questions to ask in an interview?",
    "How do I handle gaps in my employment history?",
  ];

  const handleQuickQuestion = (question: string) => {
    setInputMessage(question);
  };

  return (
    <Layout title="AI Career Coach">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Coach Leo</h2>
                <p className="text-purple-100">Your AI Career Coach</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="h-96 overflow-y-auto p-6 space-y-4 bg-gray-50">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex items-start space-x-3 ${
                  message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    message.role === 'user'
                      ? 'bg-blue-600'
                      : 'bg-gradient-to-r from-purple-600 to-pink-600'
                  }`}
                >
                  {message.role === 'user' ? (
                    <User className="w-4 h-4 text-white" />
                  ) : (
                    <Bot className="w-4 h-4 text-white" />
                  )}
                </div>
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white border border-gray-200 text-gray-800'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  <p
                    className={`text-xs mt-2 ${
                      message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                    }`}
                  >
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3">
                  <div className="flex items-center space-x-2">
                    <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
                    <span className="text-sm text-gray-600">Coach Leo is thinking...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions */}
          {messages.length === 1 && (
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Quick Questions to Get Started:</h3>
              <div className="flex flex-wrap gap-2">
                {quickQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickQuestion(question)}
                    className="text-xs bg-white hover:bg-gray-50 border border-gray-200 rounded-full px-3 py-2 text-gray-700 hover:text-purple-600 transition-colors"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Message Input */}
          <div className="p-6 border-t border-gray-200 bg-white">
            <div className="flex items-end space-x-4">
              <div className="flex-1">
                <textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about your career..."
                  rows={2}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                />
              </div>
              <button
                onClick={sendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-3 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Coaching Topics */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-shadow">
            <h3 className="font-semibold text-gray-900 mb-2">Career Planning</h3>
            <p className="text-sm text-gray-600">Goal setting, career transitions, and strategic planning for long-term success.</p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-shadow">
            <h3 className="font-semibold text-gray-900 mb-2">Interview Prep</h3>
            <p className="text-sm text-gray-600">Practice questions, STAR method, and strategies to ace your interviews.</p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-shadow">
            <h3 className="font-semibold text-gray-900 mb-2">Salary Negotiation</h3>
            <p className="text-sm text-gray-600">Research strategies, negotiation tactics, and compensation discussions.</p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-shadow">
            <h3 className="font-semibold text-gray-900 mb-2">LinkedIn Optimization</h3>
            <p className="text-sm text-gray-600">Profile enhancement, networking strategies, and personal branding.</p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-shadow">
            <h3 className="font-semibold text-gray-900 mb-2">Skill Development</h3>
            <p className="text-sm text-gray-600">Identifying skill gaps and creating learning plans for career growth.</p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-shadow">
            <h3 className="font-semibold text-gray-900 mb-2">Job Search Strategy</h3>
            <p className="text-sm text-gray-600">Finding opportunities, application strategies, and follow-up techniques.</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
