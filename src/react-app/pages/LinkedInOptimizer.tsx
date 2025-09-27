import { useState } from 'react';
import { Linkedin, User, Briefcase, Star, Download, Loader2 } from 'lucide-react';
import Layout from '@/react-app/components/Layout';
import type { LinkedInOptimizationType } from '@/shared/types';

export default function LinkedInOptimizer() {
  const [formData, setFormData] = useState({
    currentProfile: {
      headline: '',
      summary: '',
      experience: '',
      skills: '',
    },
    targetRole: '',
    industry: '',
    careerGoals: '',
  });
  const [optimization, setOptimization] = useState<LinkedInOptimizationType | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const optimizeProfile = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/linkedin/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to optimize LinkedIn profile');

      const result = await response.json();
      setOptimization(result);
    } catch (error) {
      console.error('Error optimizing LinkedIn profile:', error);
      alert('Failed to optimize LinkedIn profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const downloadOptimization = () => {
    if (!optimization) return;
    
    const content = `OPTIMIZED LINKEDIN PROFILE

HEADLINE:
${optimization.optimizedHeadline}

SUMMARY:
${optimization.optimizedSummary}

KEY RECOMMENDATIONS:
${optimization.recommendations.join('\n')}

SUGGESTED SKILLS:
${optimization.suggestedSkills.join(', ')}

CONTENT STRATEGY:
${optimization.contentStrategy.join('\n')}
`;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'LinkedIn_Profile_Optimization.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Layout title="LinkedIn Profile Optimizer">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
                <Linkedin className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Profile Information</h2>
            </div>

            <div className="space-y-6">
              {/* Current Profile */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Current LinkedIn Profile</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Headline
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Senior Software Engineer at Google"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={formData.currentProfile.headline}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        currentProfile: { ...prev.currentProfile, headline: e.target.value }
                      }))}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Summary/About Section
                    </label>
                    <textarea
                      placeholder="Paste your current LinkedIn summary..."
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={formData.currentProfile.summary}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        currentProfile: { ...prev.currentProfile, summary: e.target.value }
                      }))}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Key Experience & Achievements
                    </label>
                    <textarea
                      placeholder="Describe your most relevant work experience and achievements..."
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={formData.currentProfile.experience}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        currentProfile: { ...prev.currentProfile, experience: e.target.value }
                      }))}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Skills
                    </label>
                    <input
                      type="text"
                      placeholder="List your key skills (comma-separated)"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={formData.currentProfile.skills}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        currentProfile: { ...prev.currentProfile, skills: e.target.value }
                      }))}
                    />
                  </div>
                </div>
              </div>

              {/* Target Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Optimization Goals</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Target Role/Position
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Product Manager, Data Scientist, Marketing Director"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={formData.targetRole}
                      onChange={(e) => setFormData(prev => ({ ...prev, targetRole: e.target.value }))}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Target Industry
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Technology, Healthcare, Finance, Consulting"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={formData.industry}
                      onChange={(e) => setFormData(prev => ({ ...prev, industry: e.target.value }))}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Career Goals & Aspirations
                    </label>
                    <textarea
                      placeholder="Describe your career goals and what you want to achieve..."
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={formData.careerGoals}
                      onChange={(e) => setFormData(prev => ({ ...prev, careerGoals: e.target.value }))}
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={optimizeProfile}
                disabled={isLoading || !formData.targetRole || !formData.currentProfile.headline}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Optimizing Profile...</span>
                  </div>
                ) : (
                  'Optimize LinkedIn Profile'
                )}
              </button>
            </div>
          </div>

          {/* Results Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Optimization Results</h2>
              {optimization && (
                <button
                  onClick={downloadOptimization}
                  className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </button>
              )}
            </div>

            {optimization ? (
              <div className="space-y-6">
                {/* Optimized Headline */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <User className="w-5 h-5 text-blue-600 mr-2" />
                    Optimized Headline
                  </h3>
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                    <p className="text-gray-800 font-medium">{optimization.optimizedHeadline}</p>
                  </div>
                </div>

                {/* Optimized Summary */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <Briefcase className="w-5 h-5 text-blue-600 mr-2" />
                    Optimized Summary
                  </h3>
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-100 max-h-64 overflow-y-auto">
                    <p className="text-gray-800 whitespace-pre-wrap">{optimization.optimizedSummary}</p>
                  </div>
                </div>

                {/* Suggested Skills */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <Star className="w-5 h-5 text-blue-600 mr-2" />
                    Suggested Skills to Add
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {optimization.suggestedSkills.map((skill, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Recommendations */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Recommendations</h3>
                  <div className="space-y-3">
                    {optimization.recommendations.map((rec, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-4">
                        <p className="text-gray-800">{rec}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Content Strategy */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Content Strategy</h3>
                  <div className="space-y-3">
                    {optimization.contentStrategy.map((strategy, index) => (
                      <div key={index} className="bg-green-50 rounded-lg p-4 border border-green-100">
                        <p className="text-gray-800">{strategy}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-96 text-gray-500">
                <Linkedin className="w-16 h-16 mb-4 opacity-50" />
                <p className="text-lg">Profile Optimization Results</p>
                <p className="text-sm">Complete the form to get personalized recommendations</p>
              </div>
            )}
          </div>
        </div>

        {/* LinkedIn Tips */}
        <div className="mt-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100">
          <h3 className="text-xl font-bold text-gray-900 mb-4">LinkedIn Optimization Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Professional Photo</h4>
              <p className="text-gray-600 text-sm">Use a high-quality headshot with good lighting. Profiles with photos get 21x more views.</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Keyword Rich</h4>
              <p className="text-gray-600 text-sm">Include industry keywords in your headline and summary to improve searchability.</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Regular Activity</h4>
              <p className="text-gray-600 text-sm">Post content, comment, and engage regularly to increase your visibility in feeds.</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Network Building</h4>
              <p className="text-gray-600 text-sm">Connect with colleagues, industry professionals, and thought leaders in your field.</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
