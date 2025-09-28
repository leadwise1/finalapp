import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Briefcase, Users, BookOpen, MessageCircle, Home, Brain } from 'lucide-react';

// Import your AI component (make sure this path is correct)
// import FreeCareerAI from './components/CareerAI';

// Placeholder AI component if you haven't created the file yet
const FreeCareerAI = () => (
  <div className="min-h-screen bg-purple-50 py-8">
    <div className="max-w-4xl mx-auto px-4">
      <h1 className="text-3xl font-bold text-center mb-8">AI Coaching Features</h1>
      <div className="bg-white rounded-lg p-6 shadow">
        <p>Your AI features are working here!</p>
        {/* Your actual AI component content goes here */}
      </div>
    </div>
  </div>
);

// Home Page Component
const HomePage = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    {/* Hero Section */}
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-purple-900 mb-6">
          Welcome to <span className="text-blue-600">CareerWise</span>
        </h1>
        <p className="text-xl text-purple-600 mb-8 max-w-2xl mx-auto">
          Empowering underrepresented individuals with free career development tools, 
          AI-powered coaching, and resources to build successful careers.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/ai-coaching"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-medium inline-flex items-center justify-center gap-2 transition-colors"
          >
            <Brain className="w-5 h-5" />
            Try AI Coaching
          </Link>
          <Link
            to="/resources"
            className="bg-white hover:bg-purple-50 text-blue-600 px-8 py-4 rounded-lg text-lg font-medium inline-flex items-center justify-center gap-2 border border-blue-600 transition-colors"
          >
            <BookOpen className="w-5 h-5" />
            Browse Resources
          </Link>
        </div>
      </div>
    </div>

    {/* Features Section */}
    <div className="max-w-7xl mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
        Everything You Need to Advance Your Career
      </h2>
      <div className="grid md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <Brain className="w-12 h-12 text-blue-600 mb-4" />
          <h3 className="text-xl font-semibold mb-2">AI-Powered Tools</h3>
          <p className="text-gray-600">
            Resume analysis, cover letter generation, and interview preparation powered by AI.
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <Users className="w-12 h-12 text-green-600 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Community Support</h3>
          <p className="text-gray-600">
            Connect with mentors and peers who understand your journey and challenges.
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <BookOpen className="w-12 h-12 text-purple-600 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Learning Resources</h3>
          <p className="text-gray-600">
            Access free courses, guides, and materials tailored for career advancement.
          </p>
        </div>
      </div>
    </div>
  </div>
);

// About Page Component
const AboutPage = () => (
  <div className="min-h-screen bg-gray-50 py-12">
    <div className="max-w-4xl mx-auto px-4">
      <h1 className="text-4xl font-bold text-center text-gray-900 mb-8">About CareerWise</h1>
      <div className="bg-white rounded-lg p-8 shadow-sm">
        <div className="prose max-w-none">
          <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
          <p className="text-gray-600 mb-6">
            CareerWise is dedicated to breaking down barriers in career development for 
            underrepresented individuals. We believe everyone deserves access to the tools, 
            resources, and support needed to build a successful career.
          </p>
          
          <h2 className="text-2xl font-semibold mb-4">What We Offer</h2>
          <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
            <li>Free AI-powered resume analysis and optimization</li>
            <li>Personalized cover letter generation</li>
            <li>Interview preparation tools and practice questions</li>
            <li>Career guidance and mentorship connections</li>
            <li>Professional development resources</li>
          </ul>

          <h2 className="text-2xl font-semibold mb-4">Why We're Different</h2>
          <p className="text-gray-600">
            Unlike other career platforms, CareerWise is completely free and designed 
            specifically with the needs of underrepresented communities in mind. We understand 
            the unique challenges you face and provide tools that actually work for your situation.
          </p>
        </div>
      </div>
    </div>
  </div>
);

// Resources Page Component
const ResourcesPage = () => (
  <div className="min-h-screen bg-purple-50 py-12">
    <div className="max-w-6xl mx-auto px-4">
      <h1 className="text-4xl font-bold text-center text-purple-900 mb-8">Career Resources</h1>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Resume Resources */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-purple-200">
          <div className="flex items-center gap-3 mb-4">
            <Briefcase className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-semibold">Resume Building</h3>
          </div>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• Resume templates for different industries</li>
            <li>• ATS optimization tips</li>
            <li>• Action verb lists</li>
            <li>• Common resume mistakes to avoid</li>
          </ul>
          <Link
            to="/ai-coaching"
            className="mt-4 inline-block text-blue-600 hover:text-blue-700 font-medium text-sm"
          >
            Try AI Resume Analysis →
          </Link>
        </div>

        {/* Interview Resources */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-purple-200">
          <div className="flex items-center gap-3 mb-4">
            <MessageCircle className="w-6 h-6 text-green-600" />
            <h3 className="text-lg font-semibold">Interview Prep</h3>
          </div>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• Common interview questions</li>
            <li>• STAR method examples</li>
            <li>• Salary negotiation tips</li>
            <li>• Follow-up email templates</li>
          </ul>
          <Link
            to="/ai-coaching"
            className="mt-4 inline-block text-green-600 hover:text-green-700 font-medium text-sm"
          >
            Get Interview Questions →
          </Link>
        </div>

        {/* Networking Resources */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-6 h-6 text-purple-600" />
            <h3 className="text-lg font-semibold">Networking</h3>
          </div>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• LinkedIn optimization guide</li>
            <li>• Networking event strategies</li>
            <li>• Cold outreach templates</li>
            <li>• Building professional relationships</li>
          </ul>
          <Link
            to="/community"
            className="mt-4 inline-block text-purple-600 hover:text-purple-700 font-medium text-sm"
          >
            Join Community →
          </Link>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-blue-600 text-white p-8 rounded-lg mt-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Ready to Accelerate Your Career?</h2>
        <p className="mb-6">Start with our free AI-powered tools and take the first step toward your dream job.</p>
        <Link
          to="/ai-coaching"
          className="bg-white text-blue-600 hover:bg-purple-100 px-6 py-3 rounded-lg font-medium inline-flex items-center gap-2 transition-colors"
        >
          <Brain className="w-5 h-5" />
          Get Started Now
        </Link>
      </div>
    </div>
  </div>
);

// Community Page Component
const CommunityPage = () => (
  <div className="min-h-screen bg-gray-50 py-12">
    <div className="max-w-4xl mx-auto px-4">
      <h1 className="text-4xl font-bold text-center text-purple-900 mb-8">Community</h1>
      <div className="bg-white rounded-lg p-8 shadow-sm text-center">
        <Users className="w-16 h-16 text-blue-600 mx-auto mb-6" />
        <h2 className="text-2xl font-semibold mb-4">Connect & Grow Together</h2>
        <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
          Join our supportive community of professionals who understand your journey. 
          Get advice, share experiences, and build meaningful connections that will help 
          advance your career.
        </p>
        
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <div className="p-6 border border-gray-200 rounded-lg">
            <h3 className="text-lg font-semibold mb-3">Mentorship Program</h3>
            <p className="text-gray-600 text-sm mb-4">
              Get paired with experienced professionals in your field for personalized guidance.
            </p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm transition-colors">
              Apply for Mentorship
            </button>
          </div>
          
          <div className="p-6 border border-purple-200 rounded-lg">
            <h3 className="text-lg font-semibold mb-3">Discussion Groups</h3>
            <p className="text-purple-600 text-sm mb-4">
              Join industry-specific groups to discuss trends, share opportunities, and network.
            </p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm transition-colors">
              Join Discussions
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Navigation Component
const Navigation = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/', name: 'Home', icon: Home },
    { path: '/ai-coaching', name: 'AI Coaching', icon: Brain },
    { path: '/resources', name: 'Resources', icon: BookOpen },
    { path: '/community', name: 'Community', icon: Users },
    { path: '/about', name: 'About', icon: Briefcase },
  ];

  return (
    <nav className="bg-white shadow-sm border-b border-purple-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <Briefcase className="w-8 h-8 text-blue-600" />
              <span className="text-xl font-bold text-purple-900">CareerWise</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-purple-600 hover:text-purple-900 hover:bg-purple-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* Mobile Navigation Button */}
          <div className="md:hidden flex items-center">
            <button className="text-gray-600 hover:text-gray-900 p-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

// Main App Component
function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/ai-coaching" element={<FreeCareerAI />} />
          <Route path="/resources" element={<ResourcesPage />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/about" element={<AboutPage />} />
          {/* Catch-all route for 404 */}
          <Route path="*" element={
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">404 - Page Not Found</h1>
                <p className="text-gray-600 mb-8">The page you're looking for doesn't exist.</p>
                <Link to="/" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg">
                  Go Home
                </Link>
              </div>
            </div>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;