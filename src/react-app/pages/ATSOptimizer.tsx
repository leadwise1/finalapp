import { useState } from 'react';
import { Search, CheckCircle, AlertCircle, Target, Download, Loader2 } from 'lucide-react';
import Layout from '@/react-app/components/Layout';
import type { ATSAnalysisType } from '@/shared/types';

export default function ATSOptimizer() {
  const [jobDescription, setJobDescription] = useState('');
  const [currentResume, setCurrentResume] = useState('');
  const [analysis, setAnalysis] = useState<ATSAnalysisType | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const analyzeATS = async () => {
    if (!jobDescription.trim() || !currentResume.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/ats/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobDescription,
          resume: currentResume,
        }),
      });

      if (!response.ok) throw new Error('Failed to analyze ATS compatibility');

      const result = await response.json();
      setAnalysis(result);
    } catch (error) {
      console.error('Error analyzing ATS:', error);
      alert('Failed to analyze ATS compatibility. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const downloadOptimizedResume = () => {
    if (!analysis?.optimizedResume) return;
    
    const blob = new Blob([analysis.optimizedResume], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ATS_Optimized_Resume.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Layout title="ATS Resume Optimizer">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-600 to-red-600 rounded-xl flex items-center justify-center">
                <Search className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">ATS Analysis</h2>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Description
                </label>
                <textarea
                  placeholder="Paste the complete job description here..."
                  rows={8}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Current Resume
                </label>
                <textarea
                  placeholder="Paste your current resume content here..."
                  rows={8}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  value={currentResume}
                  onChange={(e) => setCurrentResume(e.target.value)}
                />
              </div>

              <button
                onClick={analyzeATS}
                disabled={isLoading || !jobDescription.trim() || !currentResume.trim()}
                className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-4 rounded-xl font-semibold hover:from-orange-700 hover:to-red-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Analyzing ATS Compatibility...</span>
                  </div>
                ) : (
                  'Analyze ATS Compatibility'
                )}
              </button>
            </div>
          </div>

          {/* Results Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Analysis Results</h2>
              {analysis?.optimizedResume && (
                <button
                  onClick={downloadOptimizedResume}
                  className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Optimized</span>
                </button>
              )}
            </div>

            {analysis ? (
              <div className="space-y-6">
                {/* ATS Score */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                  <div className="flex items-center space-x-3 mb-4">
                    <Target className="w-8 h-8 text-blue-600" />
                    <h3 className="text-xl font-bold text-gray-900">ATS Compatibility Score</h3>
                  </div>
                  <div className="text-4xl font-bold text-blue-600 mb-2">{analysis.score}%</div>
                  <p className="text-gray-600">{analysis.scoreDescription}</p>
                </div>

                {/* Missing Keywords */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <AlertCircle className="w-5 h-5 text-orange-600 mr-2" />
                    Missing Keywords
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {analysis.missingKeywords.map((keyword, index) => (
                      <span
                        key={index}
                        className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Found Keywords */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                    Found Keywords
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {analysis.foundKeywords.map((keyword, index) => (
                      <span
                        key={index}
                        className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Recommendations */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommendations</h3>
                  <div className="space-y-3">
                    {analysis.recommendations.map((rec, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-4">
                        <p className="text-gray-800">{rec}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Optimized Resume Preview */}
                {analysis.optimizedResume && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Optimized Resume</h3>
                    <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
                      <pre className="whitespace-pre-wrap text-sm text-gray-800 leading-relaxed">
                        {analysis.optimizedResume}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-96 text-gray-500">
                <Search className="w-16 h-16 mb-4 opacity-50" />
                <p className="text-lg">ATS Analysis Results</p>
                <p className="text-sm">Submit your job description and resume for analysis</p>
              </div>
            )}
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-8 bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-8 border border-orange-100">
          <h3 className="text-xl font-bold text-gray-900 mb-4">About ATS Optimization</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Keyword Matching</h4>
              <p className="text-gray-600 text-sm">ATS systems scan for specific keywords from job descriptions. Our AI identifies missing keywords and suggests where to include them naturally.</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Format Optimization</h4>
              <p className="text-gray-600 text-sm">We analyze formatting elements that ATS systems prefer, including section headers, bullet points, and text structure.</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Content Enhancement</h4>
              <p className="text-gray-600 text-sm">Beyond keywords, we suggest improvements to make your experience more relevant and compelling to both ATS and human reviewers.</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
