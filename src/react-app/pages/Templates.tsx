import { useState } from 'react';
import { Eye, Download, Star, ArrowRight } from 'lucide-react';
import Layout from '@/react-app/components/Layout';
import { Link } from 'react-router';

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  image: string;
  featured: boolean;
}

const templates: Template[] = [
  {
    id: 'modern-professional',
    name: 'Modern Professional',
    description: 'Clean and contemporary design perfect for corporate roles and business professionals',
    category: 'Business',
    image: 'https://mocha-cdn.com/01997a9a-7bd6-7111-afb1-6efa798272a2/option1.png',
    featured: true,
  },
  {
    id: 'elegant-executive',
    name: 'Elegant Executive',
    description: 'Sophisticated layout ideal for senior-level positions and executive roles',
    category: 'Executive',
    image: 'https://mocha-cdn.com/01997a9a-7bd6-7111-afb1-6efa798272a2/option3.png',
    featured: true,
  },
  {
    id: 'creative-designer',
    name: 'Creative Designer',
    description: 'Bold and colorful template designed for creative professionals and designers',
    category: 'Creative',
    image: 'https://mocha-cdn.com/01997a9a-7bd6-7111-afb1-6efa798272a2/option5.png',
    featured: true,
  },
  {
    id: 'dynamic-professional',
    name: 'Dynamic Professional',
    description: 'Modern layout with accent colors perfect for marketing and sales professionals',
    category: 'Marketing',
    image: 'https://mocha-cdn.com/01997a9a-7bd6-7111-afb1-6efa798272a2/option4.png',
    featured: false,
  },
];

const categories = ['All', 'Business', 'Executive', 'Creative', 'Marketing', 'Technical'];

export default function Templates() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);

  const filteredTemplates = selectedCategory === 'All' 
    ? templates 
    : templates.filter(template => template.category === selectedCategory);

  const featuredTemplates = templates.filter(template => template.featured);

  return (
    <Layout title="Resume Templates">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Professional Resume Templates
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose from our collection of professionally designed, ATS-friendly resume templates. 
            Each template is crafted by career experts to help you stand out to employers.
          </p>
        </div>

        {/* Featured Templates */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Featured Templates</h2>
            <Link 
              to="/resume" 
              className="flex items-center space-x-2 text-purple-600 hover:text-purple-700 font-medium"
            >
              <span>Start Building</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredTemplates.map((template) => (
              <div
                key={template.id}
                className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100"
              >
                <div className="absolute top-4 left-4 z-10">
                  <div className="flex items-center space-x-1 bg-yellow-100 px-2 py-1 rounded-full">
                    <Star className="w-3 h-3 text-yellow-600 fill-current" />
                    <span className="text-xs font-medium text-yellow-800">Featured</span>
                  </div>
                </div>
                
                <div className="relative overflow-hidden">
                  <img
                    src={template.image}
                    alt={template.name}
                    className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setSelectedTemplate(template)}
                        className="flex-1 bg-white/90 backdrop-blur-sm text-gray-900 px-4 py-2 rounded-lg font-medium hover:bg-white transition-colors flex items-center justify-center space-x-2"
                      >
                        <Eye className="w-4 h-4" />
                        <span>Preview</span>
                      </button>
                      <Link
                        to="/resume"
                        className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2"
                      >
                        <Download className="w-4 h-4" />
                        <span>Use Template</span>
                      </Link>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{template.name}</h3>
                    <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full">
                      {template.category}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">{template.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* All Templates Grid */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">All Templates</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredTemplates.map((template) => (
              <div
                key={template.id}
                className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={template.image}
                    alt={template.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-2">
                    <button
                      onClick={() => setSelectedTemplate(template)}
                      className="bg-white/90 backdrop-blur-sm text-gray-900 px-3 py-2 rounded-lg font-medium hover:bg-white transition-colors flex items-center space-x-1"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Preview</span>
                    </button>
                    <Link
                      to="/resume"
                      className="bg-purple-600 text-white px-3 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center space-x-1"
                    >
                      <Download className="w-4 h-4" />
                      <span>Use</span>
                    </Link>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{template.name}</h3>
                    {template.featured && (
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    )}
                  </div>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                    {template.category}
                  </span>
                  <p className="text-gray-600 text-sm mt-2 leading-relaxed">{template.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-purple-600 to-violet-600 rounded-2xl p-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Create Your Perfect Resume?
          </h2>
          <p className="text-purple-100 mb-6 text-lg">
            Choose a template and let our AI help you create a compelling resume in minutes.
          </p>
          <Link
            to="/resume"
            className="inline-block bg-white text-purple-600 px-8 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors shadow-lg"
          >
            Start Building Your Resume
          </Link>
        </div>

        {/* Template Preview Modal */}
        {selectedTemplate && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-4xl max-h-[90vh] overflow-hidden">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{selectedTemplate.name}</h3>
                  <p className="text-gray-600">{selectedTemplate.description}</p>
                </div>
                <button
                  onClick={() => setSelectedTemplate(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
              <div className="p-6 overflow-y-auto max-h-[70vh]">
                <img
                  src={selectedTemplate.image}
                  alt={selectedTemplate.name}
                  className="w-full max-w-2xl mx-auto rounded-lg shadow-lg"
                />
              </div>
              <div className="p-6 border-t border-gray-200 flex space-x-4">
                <button
                  onClick={() => setSelectedTemplate(null)}
                  className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
                <Link
                  to="/resume"
                  className="flex-1 bg-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Use This Template</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
