import { Link } from 'react-router';
import { FileText, Download, Sparkles, Menu, ChevronDown, User } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-violet-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-purple-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img 
                src="https://mocha-cdn.com/01997a9a-7bd6-7111-afb1-6efa798272a2/_(Logo).png" 
                alt="LeadWise Foundation Logo" 
                className="w-10 h-10 rounded-xl object-cover"
              />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
                LeadWise Foundation
              </h1>
            </div>
            
            {/* Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              <Link to="#features" className="text-gray-600 hover:text-purple-600 transition-colors font-medium">
                Features
              </Link>
              <Link to="/coaching" className="text-gray-600 hover:text-purple-600 transition-colors font-medium">
                Coaching
              </Link>
              <Link to="/career-ai" className="text-gray-600 hover:text-purple-600 transition-colors font-medium">
                Career AI
              </Link>
              <Link to="#dashboard" className="text-gray-600 hover:text-purple-600 transition-colors font-medium">
                Dashboard
              </Link>
              <Link to="#pricing" className="text-gray-600 hover:text-purple-600 transition-colors font-medium">
                Pricing
              </Link>
              <Link to="/templates" className="text-gray-600 hover:text-purple-600 transition-colors font-medium">
                Templates
              </Link>
            </nav>

            <div className="flex items-center space-x-4">
              <Link
                to="/templates"
                className="hidden sm:inline-block text-purple-600 hover:text-purple-700 transition-colors font-medium"
              >
                View Templates
              </Link>
              <Link
                to="/coaching"
                className="bg-gradient-to-r from-purple-600 to-violet-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:from-purple-700 hover:to-violet-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Get Started
              </Link>
              <button className="lg:hidden p-2">
                <Menu className="w-6 h-6 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main>
        <section className="relative py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Column - Content */}
              <div>
                {/* Badge */}
                <div className="flex items-center space-x-2 mb-8">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  <span className="text-purple-600 font-medium">
                    Build Your Career Foundation with AI-Powered Resumes
                  </span>
                </div>

                {/* Main Headline */}
                <h2 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                  <span className="block bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
                    Empowering Your Career Journey
                  </span>
                  <span className="block text-4xl lg:text-5xl mt-2">
                    with Intelligent Guidance
                  </span>
                </h2>

                {/* Subtitle */}
                <p className="text-xl text-gray-600 mb-8 max-w-2xl leading-relaxed">
                  Unlock your potential with AI-powered coaching, personalized strategies, and human-centric support designed to propel your career forward.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 mb-12">
                  <Link
                    to="/resume"
                    className="bg-gradient-to-r from-purple-600 to-violet-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-purple-700 hover:to-violet-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-center"
                  >
                    Start Building Resume
                  </Link>
                  <Link
                    to="/templates"
                    className="bg-white text-purple-600 px-8 py-4 rounded-xl font-semibold border-2 border-purple-200 hover:bg-purple-50 hover:border-purple-300 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-center"
                  >
                    View Templates
                  </Link>
                </div>

                {/* Trust Badge */}
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>Trusted by 10,000+ professionals worldwide</span>
                </div>
              </div>

              {/* Right Column - Illustration */}
              <div className="relative lg:pl-8">
                <div className="relative">
                  {/* Background Elements */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-violet-600 rounded-3xl transform rotate-6 opacity-20"></div>
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-violet-700 rounded-3xl transform rotate-3 opacity-30"></div>
                  
                  {/* Main Content Area */}
                  <div className="relative bg-gradient-to-br from-purple-500 to-violet-600 rounded-3xl p-8 shadow-2xl">
                    {/* AI Robot Illustration Placeholder */}
                    <div className="flex items-center justify-center mb-6">
                      <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg">
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-violet-600 rounded-full flex items-center justify-center">
                          <Sparkles className="w-8 h-8 text-white" />
                        </div>
                      </div>
                    </div>
                    
                    {/* Interface Elements */}
                    <div className="space-y-4">
                      <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                          <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                          <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                        </div>
                        <div className="text-white font-semibold text-lg">COACH LEO</div>
                        <div className="text-white/80 text-sm">AI Career Assistant</div>
                      </div>
                      
                      <div className="bg-white/15 backdrop-blur-sm rounded-lg p-3">
                        <div className="text-white text-sm font-medium mb-2">Resume Analysis</div>
                        <div className="space-y-1">
                          <div className="bg-white/20 rounded h-2"></div>
                          <div className="bg-white/20 rounded h-2 w-3/4"></div>
                          <div className="bg-white/20 rounded h-2 w-1/2"></div>
                        </div>
                      </div>
                      
                      <div className="bg-white/15 backdrop-blur-sm rounded-lg p-3">
                        <div className="text-white text-sm font-medium">Interview Prep</div>
                        <div className="text-white/80 text-xs mt-1">95% Success Rate</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            
          </div>
        </section>

        {/* Feature Cards */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* AI Content Generation */}
              <div className="text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-100 to-violet-100 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Sparkles className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">AI Content Generation</h3>
                <p className="text-gray-600 leading-relaxed">
                  Get personalized suggestions for resume bullet points, cover letters, and professional summaries powered by advanced AI.
                </p>
              </div>

              {/* Professional Templates */}
              <div className="text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-100 to-violet-100 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  <FileText className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Professional Templates</h3>
                <p className="text-gray-600 leading-relaxed">
                  Choose from modern, ATS-friendly resume templates designed by career experts and optimized for various industries.
                </p>
              </div>

              {/* Instant Export */}
              <div className="text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-100 to-violet-100 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Download className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Instant Export</h3>
                <p className="text-gray-600 leading-relaxed">
                  Download your resume as PDF or Word document in seconds, formatted perfectly for any application process.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* AI-Powered Career Coaching Section */}
        <section id="ai-coaching" className="py-20 bg-gradient-to-br from-purple-50 to-violet-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Discover Your Path with AI-Powered Career Coaching
              </h2>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto">
                Our innovative app integrates cutting-edge AI with invaluable human insights to provide a comprehensive career coaching experience.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
              {/* Resume Builders & Optimizers */}
              <div className="bg-white rounded-2xl p-8 shadow-xl border border-purple-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-violet-600 rounded-2xl mb-6">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Resume Builders & Optimizers</h3>
                <p className="text-gray-600">
                  Utilize AI to analyze job descriptions, suggest keywords, and generate customized summaries and bullet points to ensure your resume is ATS-friendly.
                </p>
              </div>

              {/* Cover Letter Generators */}
              <div className="bg-white rounded-2xl p-8 shadow-xl border border-purple-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl mb-6">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Cover Letter Generators</h3>
                <p className="text-gray-600">
                  Create tailored cover letters that perfectly match specific job postings, helping you stand out to recruiters.
                </p>
              </div>

              {/* Automated Applications */}
              <div className="bg-white rounded-2xl p-8 shadow-xl border border-purple-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl mb-6">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Automated Applications</h3>
                <p className="text-gray-600">
                  Streamline your job search by automating the process of finding and applying to multiple job postings.
                </p>
              </div>

              {/* Profile Optimization */}
              <div className="bg-white rounded-2xl p-8 shadow-xl border border-purple-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl mb-6">
                  <User className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Profile Optimization</h3>
                <p className="text-gray-600">
                  Receive AI-driven suggestions to enhance your professional social media profiles, like LinkedIn, increasing your visibility with recruiters.
                </p>
              </div>

              {/* Creative Professional Coaching */}
              <div className="bg-white rounded-2xl p-8 shadow-xl border border-purple-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-pink-600 to-purple-600 rounded-2xl mb-6">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Creative Professional Coaching</h3>
                <p className="text-gray-600">
                  Get specialized AI coaching for writers, designers, marketers, and other creatives, assisting with portfolio development, personal branding, and freelance pricing strategies.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Human-Centric Features Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Integrating AI with Human-Centric Features
              </h2>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto">
                We believe the most successful platforms merge AI efficiency with the irreplaceable human element of coaching.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
              {/* Human-in-the-Loop Model */}
              <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-8 border border-purple-100">
                <h3 className="text-xl font-bold text-gray-900 mb-4">"Human-in-the-Loop" Model</h3>
                <p className="text-gray-700">
                  Access a premium tier that connects you with human coaches for nuanced emotional support and complex strategy sessions, while AI handles administrative tasks and initial diagnostics.
                </p>
              </div>

              {/* Community & Peer Mentoring */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Community & Peer Mentoring</h3>
                <p className="text-gray-700">
                  Foster social learning through forums, private groups, and leaderboards. Our AI can automatically match you with peer mentors in your industry and suggest discussion topics.
                </p>
              </div>

              {/* Authenticity Prompts */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-100">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Authenticity Prompts</h3>
                <p className="text-gray-700">
                  Develop your unique voice. After AI drafts content like a cover letter, the app will prompt you with questions to help you infuse your personal story and voice.
                </p>
              </div>

              {/* Emotional Intelligence Training */}
              <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-8 border border-orange-100">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Emotional Intelligence (EI) Training</h3>
                <p className="text-gray-700">
                  Move beyond basic interview prep to include EI development. AI can analyze your tone and sentiment during mock interviews, providing targeted feedback on communication and emotion management in the workplace.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Hyper-Personalization Section */}
        <section className="py-20 bg-gradient-to-br from-purple-50 to-violet-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Hyper-Personalization & Predictive Analytics
              </h2>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto">
                Leverage generative AI for dynamic and predictive guidance that goes beyond traditional career tools.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
              {/* Predictive Career Pathing */}
              <div className="bg-white rounded-2xl p-8 shadow-xl border border-purple-100">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple-600 to-violet-600 rounded-xl mb-4">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Predictive Career Pathing</h3>
                <p className="text-gray-700">
                  Our AI analyzes your profile and market data to predict future career paths and opportunities, helping you identify the skills needed to achieve your goals.
                </p>
              </div>

              {/* AI-Powered Narrative Builder */}
              <div className="bg-white rounded-2xl p-8 shadow-xl border border-purple-100">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl mb-4">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">AI-Powered Narrative Builder</h3>
                <p className="text-gray-700">
                  Articulate your personal story. The app can record you speaking about your career and use AI to transform your spoken narrative into a compelling summary for your resume or LinkedIn profile.
                </p>
              </div>

              {/* "What-If" Career Scenarios */}
              <div className="bg-white rounded-2xl p-8 shadow-xl border border-purple-100">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl mb-4">
                  <ChevronDown className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">"What-If" Career Scenarios</h3>
                <p className="text-gray-700">
                  Explore hypothetical career changes with personalized insights on what it would take to pivot into a new role. AI analyzes your existing skills against new field requirements and provides a clear plan.
                </p>
              </div>

              {/* Dynamic Interview Preparation */}
              <div className="bg-white rounded-2xl p-8 shadow-xl border border-purple-100">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-orange-600 to-red-600 rounded-xl mb-4">
                  <Menu className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Dynamic Interview Preparation</h3>
                <p className="text-gray-700">
                  Beyond standard mock interviews, our AI creates realistic, emotionally charged interview simulations based on specific job descriptions, adapting its questions and persona based on your performance.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* All Tools Section */}
        <section id="features" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Complete Career Toolkit
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Everything you need to advance your career, powered by AI and backed by human expertise.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Resume Builder */}
              <Link
                to="/resume"
                className="group block bg-white rounded-2xl p-8 border-2 border-transparent hover:border-purple-200 transition-all duration-300 hover:shadow-xl transform hover:-translate-y-2"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-violet-600 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Smart Resume Builder</h3>
                <p className="text-gray-600 mb-6">
                  Create professional, ATS-optimized resumes with AI-powered content suggestions.
                </p>
                <div className="text-purple-600 font-semibold group-hover:text-violet-600 transition-colors">
                  Build Resume →
                </div>
              </Link>

              {/* Cover Letter */}
              <Link
                to="/cover-letter"
                className="group block bg-white rounded-2xl p-8 border-2 border-transparent hover:border-purple-200 transition-all duration-300 hover:shadow-xl transform hover:-translate-y-2"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Cover Letter AI</h3>
                <p className="text-gray-600 mb-6">
                  Generate personalized cover letters that match job descriptions perfectly.
                </p>
                <div className="text-green-600 font-semibold group-hover:text-emerald-600 transition-colors">
                  Write Letter →
                </div>
              </Link>

              {/* Career Coaching */}
              <Link
                to="/coaching"
                className="group block bg-white rounded-2xl p-8 border-2 border-transparent hover:border-purple-200 transition-all duration-300 hover:shadow-xl transform hover:-translate-y-2"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">AI Career Coach</h3>
                <p className="text-gray-600 mb-6">
                  Get personalized career advice and strategic guidance from Coach Leo.
                </p>
                <div className="text-blue-600 font-semibold group-hover:text-indigo-600 transition-colors">
                  Start Coaching →
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-purple-600 to-violet-600">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Transform Your Career?
            </h2>
            <p className="text-xl text-purple-100 mb-8">
              Join thousands of professionals who have accelerated their careers with Coach LeoWise.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/resume"
                className="inline-block bg-white text-purple-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Start Building Your Resume
              </Link>
              <Link
                to="/coaching"
                className="inline-block bg-purple-700 text-white px-8 py-4 rounded-xl font-semibold border-2 border-purple-400 hover:bg-purple-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Get AI Coaching
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-purple-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img 
                src="https://mocha-cdn.com/01997a9a-7bd6-7111-afb1-6efa798272a2/_(Logo).png" 
                alt="LeadWise Foundation Logo" 
                className="w-8 h-8 rounded-lg object-cover"
              />
              <span className="text-xl font-bold">LeadWise Foundation</span>
            </div>
            <p className="text-purple-200">
              © 2024 LeadWise Foundation. Empowering careers worldwide.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}