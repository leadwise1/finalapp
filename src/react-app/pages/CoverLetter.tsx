import { useState } from 'react';
import { FileText, Download, Loader2 } from 'lucide-react';
import Layout from '@/react-app/components/Layout';
import type { CreateCoverLetterType } from '@/shared/types';

export default function CoverLetter() {
  const [formData, setFormData] = useState<CreateCoverLetterType>({
    jobTitle: '',
    companyName: '',
    jobDescription: '',
    personalExperience: '',
    tone: 'professional',
  });
  const [generatedLetter, setGeneratedLetter] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const generateCoverLetter = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/cover-letter/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to generate cover letter');

      const result = await response.json();
      setGeneratedLetter(result.content);
    } catch (error) {
      console.error('Error generating cover letter:', error);
      alert('Failed to generate cover letter. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const downloadLetter = () => {
    const blob = new Blob([generatedLetter], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${formData.companyName.replace(/\s+/g, '_')}_Cover_Letter.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Layout title="Cover Letter Generator">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Cover Letter Details</h2>
            </div>

            <div className="space-y-6">
              {/* Job Information */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Title
                </label>
                <input
                  type="text"
                  placeholder="e.g., Senior Software Engineer"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  value={formData.jobTitle}
                  onChange={(e) => setFormData(prev => ({ ...prev, jobTitle: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  placeholder="e.g., Google"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  value={formData.companyName}
                  onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Description
                </label>
                <textarea
                  placeholder="Paste the job description here..."
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  value={formData.jobDescription}
                  onChange={(e) => setFormData(prev => ({ ...prev, jobDescription: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Experience & Background
                </label>
                <textarea
                  placeholder="Describe your relevant experience, skills, and achievements..."
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  value={formData.personalExperience}
                  onChange={(e) => setFormData(prev => ({ ...prev, personalExperience: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tone
                </label>
                <select
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  value={formData.tone}
                  onChange={(e) => setFormData(prev => ({ ...prev, tone: e.target.value as 'professional' | 'enthusiastic' | 'creative' }))}
                >
                  <option value="professional">Professional</option>
                  <option value="enthusiastic">Enthusiastic</option>
                  <option value="creative">Creative</option>
                </select>
              </div>

              <button
                onClick={generateCoverLetter}
                disabled={isLoading || !formData.jobTitle || !formData.companyName || !formData.personalExperience}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Generating Cover Letter...</span>
                  </div>
                ) : (
                  'Generate Cover Letter'
                )}
              </button>
            </div>
          </div>

          {/* Preview Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Cover Letter Preview</h2>
              {generatedLetter && (
                <button
                  onClick={downloadLetter}
                  className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </button>
              )}
            </div>

            {generatedLetter ? (
              <div className="prose max-w-none">
                <pre className="whitespace-pre-wrap text-sm text-gray-800 leading-relaxed">
                  {generatedLetter}
                </pre>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-96 text-gray-500">
                <FileText className="w-16 h-16 mb-4 opacity-50" />
                <p className="text-lg">Your cover letter will appear here</p>
                <p className="text-sm">Fill out the form and click "Generate Cover Letter"</p>
              </div>
            )}
          </div>
        </div>

        {/* Tips Section */}
        <div className="mt-8 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-100">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Tips for a Great Cover Letter</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Be Specific</h4>
              <p className="text-gray-600 text-sm">Include specific examples of your achievements and how they relate to the job requirements.</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Show Research</h4>
              <p className="text-gray-600 text-sm">Demonstrate knowledge about the company and explain why you want to work there specifically.</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Keep it Concise</h4>
              <p className="text-gray-600 text-sm">Aim for one page and focus on the most relevant information for the position.</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Call to Action</h4>
              <p className="text-gray-600 text-sm">End with a professional closing that invites further conversation.</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
