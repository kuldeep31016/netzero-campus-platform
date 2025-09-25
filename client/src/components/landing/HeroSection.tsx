import React, { useState, useEffect } from 'react';

interface HeroSectionProps {
  onPortalSelect: (portal: 'student' | 'faculty' | 'admin') => void;
}

interface AnimatedCounterProps {
  value: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
}

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({ 
  value, 
  suffix = '', 
  prefix = '', 
  duration = 2000 
}) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationId: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      setCount(Math.floor(progress * value));
      
      if (progress < 1) {
        animationId = requestAnimationFrame(animate);
      }
    };

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [value, duration]);

  return <span>{prefix}{count.toLocaleString()}{suffix}</span>;
};

const HeroSection: React.FC<HeroSectionProps> = ({ onPortalSelect }) => {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50 overflow-hidden">
      {/* Enhanced Background Elements with Floating Animation */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-64 h-64 bg-green-200 rounded-full opacity-30 animate-subtle-float"></div>
        <div className="absolute top-40 right-20 w-64 h-64 bg-blue-200 rounded-full opacity-30 animate-subtle-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute -bottom-8 left-40 w-64 h-64 bg-emerald-200 rounded-full opacity-30 animate-subtle-float" style={{ animationDelay: '2s' }}></div>
        
        {/* Floating Particles */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-green-400 rounded-full animate-subtle-float opacity-60" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-blue-400 rounded-full animate-subtle-float opacity-60" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-emerald-400 rounded-full animate-subtle-float opacity-60" style={{ animationDelay: '2.5s' }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Two-Column Layout */}
        <div className="grid lg:grid-cols-2 gap-16 items-center min-h-screen">
          
          {/* Left Column - Content (60%) */}
          <div className="space-y-8 animate-fade-in-up">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-4 mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
                  Net <span className="text-green-600">Zero</span> Campus
                </h1>
                <p className="text-sm text-gray-500 font-medium">Sustainable Education Platform</p>
              </div>
            </div>

            {/* Main Heading */}
            <div className="space-y-6">
              <h2 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Revolutionizing
                <br />
                Campus <span className="text-green-600">Sustainability</span>
                <br />
                <span className="text-blue-600">Together</span>
              </h2>
              <p className="text-lg lg:text-xl text-gray-600 leading-relaxed max-w-xl">
                Connecting students, faculty, and administrators through 
                advanced sustainability tracking technology for accessible 
                environmental monitoring in educational communities.
              </p>
            </div>

            {/* Portal Buttons - Enhanced with better spacing */}
            <div className="flex flex-col sm:flex-row gap-4 pt-8">
              <button
                onClick={() => onPortalSelect('admin')}
                className="group relative inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl will-change-transform hover:scale-105 transition-all duration-200"
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                Admin Portal
              </button>

              <button
                onClick={() => onPortalSelect('faculty')}
                className="group relative inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl will-change-transform hover:scale-105 transition-all duration-200"
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Faculty Portal
              </button>

              <button
                onClick={() => onPortalSelect('student')}
                className="group relative inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl will-change-transform hover:scale-105 transition-all duration-200"
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Student Portal
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center space-x-8 pt-8 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-smooth-pulse"></div>
                <span>Real-time Monitoring</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-smooth-pulse" style={{ animationDelay: '0.5s' }}></div>
                <span>AI-Powered Insights</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-smooth-pulse" style={{ animationDelay: '1s' }}></div>
                <span>Secure & Reliable</span>
              </div>
            </div>
          </div>

          {/* Right Column - Visual Elements (40%) */}
          <div className="relative animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            
            {/* Floating Statistics Cards */}
            <div className="relative space-y-6">
              
              {/* Main Campus Illustration Placeholder */}
              <div className="relative bg-gradient-to-br from-green-100 to-blue-100 rounded-3xl p-8 shadow-lg backdrop-blur-sm border border-white/20">
                <div className="text-center space-y-6">
                  <div className="w-32 h-32 mx-auto bg-gradient-to-br from-green-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Smart Campus</h3>
                    <p className="text-gray-600">Real-time environmental monitoring</p>
                  </div>
                </div>
              </div>

              {/* Floating Stats Cards */}
              <div className="absolute -top-6 -right-6 bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/20 animate-subtle-float">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    <AnimatedCounter value={85} suffix="%" />
                  </div>
                  <p className="text-xs text-gray-600">Energy Saved</p>
                </div>
              </div>

              <div className="absolute -bottom-4 -left-6 bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/20 animate-subtle-float" style={{ animationDelay: '1s' }}>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    <AnimatedCounter value={12} suffix="k+" />
                  </div>
                  <p className="text-xs text-gray-600">Students</p>
                </div>
              </div>

              <div className="absolute top-1/2 -right-8 bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/20 animate-subtle-float" style={{ animationDelay: '0.5s' }}>
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-600">
                    <AnimatedCounter value={95} suffix="%" />
                  </div>
                  <p className="text-xs text-gray-600">Uptime</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Preview - Moved to bottom */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto pt-20 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
          <div className="text-center group hover:transform hover:scale-105 transition-transform duration-200">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg transition-shadow duration-200">
              <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Energy Tracking</h3>
            <p className="text-sm text-gray-600">Monitor real-time consumption</p>
          </div>

          <div className="text-center group hover:transform hover:scale-105 transition-transform duration-200">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg transition-shadow duration-200">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Water Conservation</h3>
            <p className="text-sm text-gray-600">Optimize water usage</p>
          </div>

          <div className="text-center group hover:transform hover:scale-105 transition-transform duration-200">
            <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg transition-shadow duration-200">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Waste Management</h3>
            <p className="text-sm text-gray-600">Reduce and recycle</p>
          </div>

          <div className="text-center group hover:transform hover:scale-105 transition-transform duration-200">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg transition-shadow duration-200">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">AI Insights</h3>
            <p className="text-sm text-gray-600">Smart recommendations</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;