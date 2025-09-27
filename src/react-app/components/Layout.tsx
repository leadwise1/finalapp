import { Link } from 'react-router';
import { ArrowLeft } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
  showBackButton?: boolean;
}

export default function Layout({ children, title, showBackButton = true }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {showBackButton && (
                <Link
                  to="/"
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </Link>
              )}
            <Link to="/" className="flex items-center space-x-3">
                <img 
                  src="https://mocha-cdn.com/01997a9a-7bd6-7111-afb1-6efa798272a2/_(Logo).png" 
                  alt="LeadWise Foundation Logo" 
                  className="w-10 h-10 rounded-xl object-cover"
                />
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  LeadWise Foundation
                </h1>
              </Link>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 hidden sm:block">
              {title}
            </h2>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
