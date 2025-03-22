import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Wallet, 
  ArrowRight, 
  Building2, 
  DollarSign, 
  Users, 
  BarChart, 
  MessageSquare,
  Shield
} from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Wallet className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">StayManager</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
              >
                Sign in
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center"
              >
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
              <span className="block">Simplify Your Property</span>
              <span className="block text-blue-600">Management & Finances</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Streamline your property operations, track expenses, and boost revenue with our all-in-one management solution.
            </p>
            <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
              <div className="rounded-xl shadow">
                <Link
                  to="/register"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
                >
                  Start Free Trial
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Everything you need to manage your properties
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              Powerful tools to help you take control of your property management tasks
            </p>
          </div>

          <div className="mt-20">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="pt-6">
                <div className="flow-root rounded-2xl shadow-[4px_4px_10px_rgba(0,0,0,0.1),-4px_-4px_10px_rgba(255,255,255,0.9)] px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-xl shadow-lg">
                        <Building2 className="h-6 w-6 text-blue-600" />
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Property Management</h3>
                    <p className="mt-5 text-base text-gray-500">
                      Efficiently manage multiple properties, track occupancy, and handle maintenance requests.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <div className="flow-root rounded-2xl shadow-[4px_4px_10px_rgba(0,0,0,0.1),-4px_-4px_10px_rgba(255,255,255,0.9)] px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-green-100 rounded-xl shadow-lg">
                        <DollarSign className="h-6 w-6 text-green-600" />
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Financial Tracking</h3>
                    <p className="mt-5 text-base text-gray-500">
                      Monitor revenue, expenses, and generate detailed financial reports with ease.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <div className="flow-root rounded-2xl shadow-[4px_4px_10px_rgba(0,0,0,0.1),-4px_-4px_10px_rgba(255,255,255,0.9)] px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-purple-100 rounded-xl shadow-lg">
                        <Users className="h-6 w-6 text-purple-600" />
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Staff Management</h3>
                    <p className="mt-5 text-base text-gray-500">
                      Manage staff schedules, track performance, and streamline communication.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <div className="flow-root rounded-2xl shadow-[4px_4px_10px_rgba(0,0,0,0.1),-4px_-4px_10px_rgba(255,255,255,0.9)] px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-yellow-100 rounded-xl shadow-lg">
                        <BarChart className="h-6 w-6 text-yellow-600" />
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Analytics & Reports</h3>
                    <p className="mt-5 text-base text-gray-500">
                      Get insights with detailed analytics and customizable reports.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <div className="flow-root rounded-2xl shadow-[4px_4px_10px_rgba(0,0,0,0.1),-4px_-4px_10px_rgba(255,255,255,0.9)] px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-red-100 rounded-xl shadow-lg">
                        <MessageSquare className="h-6 w-6 text-red-600" />
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">AI Assistant</h3>
                    <p className="mt-5 text-base text-gray-500">
                      Get instant help with our AI-powered chatbot for quick assistance.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <div className="flow-root rounded-2xl shadow-[4px_4px_10px_rgba(0,0,0,0.1),-4px_-4px_10px_rgba(255,255,255,0.9)] px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-indigo-100 rounded-xl shadow-lg">
                        <Shield className="h-6 w-6 text-indigo-600" />
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Secure & Reliable</h3>
                    <p className="mt-5 text-base text-gray-500">
                      Enterprise-grade security to protect your sensitive data.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to get started?</span>
            <span className="block text-blue-200">Start your free trial today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-xl shadow">
              <Link
                to="/register"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-xl text-blue-600 bg-white hover:bg-blue-50"
              >
                Get started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="mt-8 border-t border-gray-200 pt-8 md:flex md:items-center md:justify-between">
            <div className="flex space-x-6 md:order-2">
              <a href="#" className="text-gray-400 hover:text-gray-500">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-500">
                Terms of Service
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-500">
                Contact Us
              </a>
            </div>
            <p className="mt-8 text-base text-gray-400 md:mt-0 md:order-1">
              © 2024 StayManager. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;