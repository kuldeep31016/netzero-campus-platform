import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HeroSection from '../components/landing/HeroSection';
import AuthModal from '../components/auth/AuthModal';
import InteractiveCampusMap from '../components/InteractiveCampusMap';
import { UserRole } from '../services/firebase';

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [selectedBuilding, setSelectedBuilding] = useState<any>(null);

  const handlePortalSelect = (portal: 'student' | 'faculty' | 'admin') => {
    setSelectedRole(portal as UserRole);
    setAuthModalOpen(true);
  };

  const handleBuildingClick = (building: any) => {
    setSelectedBuilding(building);
  };

  return (
    <div className="min-h-screen">
      {/* Navigation Header - Optimized for smooth scrolling */}
      <nav className="absolute top-0 left-0 right-0 z-20 bg-transparent will-change-transform">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-600 rounded-xl flex items-center justify-center will-change-transform hover:scale-105 transition-transform duration-200">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="ml-3 text-xl font-bold text-gray-900">
                  Net <span className="text-green-600">Zero</span> Campus
                </span>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <a href="#about" className="text-gray-700 hover:text-green-600 px-3 py-2 text-sm font-medium will-change-transform hover:scale-105 transition-all duration-200">
                  About
                </a>
                <a href="#features" className="text-gray-700 hover:text-green-600 px-3 py-2 text-sm font-medium will-change-transform hover:scale-105 transition-all duration-200">
                  Features
                </a>
                <a href="#impact" className="text-gray-700 hover:text-green-600 px-3 py-2 text-sm font-medium will-change-transform hover:scale-105 transition-all duration-200">
                  Impact
                </a>
                <a href="#contact" className="text-gray-700 hover:text-green-600 px-3 py-2 text-sm font-medium will-change-transform hover:scale-105 transition-all duration-200">
                  Contact
                </a>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <HeroSection onPortalSelect={handlePortalSelect} />

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Comprehensive Sustainability Platform
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Advanced monitoring, AI-powered insights, and gamification to drive 
              environmental consciousness across your campus.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="group bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-8 shadow-lg will-change-transform hover:scale-[1.02] transition-transform duration-300 ease-out opacity-0 animate-fade-in-up" style={{animationDelay: '0.1s'}}>
              <div className="w-14 h-14 bg-green-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-200">
                <svg className="w-8 h-8 text-white group-hover:rotate-3 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Real-time Monitoring</h3>
              <p className="text-gray-600">
                Track energy consumption, water usage, waste generation, and carbon emissions 
                across all campus facilities with live data updates.
              </p>
            </div>

            <div className="group bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-8 shadow-lg will-change-transform hover:scale-[1.02] transition-transform duration-300 ease-out opacity-0 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
              <div className="w-14 h-14 bg-blue-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-200">
                <svg className="w-8 h-8 text-white group-hover:rotate-3 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">AI-Powered Insights</h3>
              <p className="text-gray-600">
                Get personalized recommendations and predictive analytics to optimize 
                resource usage and achieve sustainability goals faster.
              </p>
            </div>

            <div className="group bg-gradient-to-br from-purple-50 to-pink-100 rounded-2xl p-8 shadow-lg will-change-transform hover:scale-[1.02] transition-transform duration-300 ease-out opacity-0 animate-fade-in-up" style={{animationDelay: '0.3s'}}>
              <div className="w-14 h-14 bg-purple-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-200">
                <svg className="w-8 h-8 text-white group-hover:rotate-3 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Gamification & Rewards</h3>
              <p className="text-gray-600">
                Engage your community with challenges, leaderboards, and achievement 
                badges that make sustainability fun and competitive.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Campus Sustainability Map */}
      <section id="campus-map" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Interactive Campus Sustainability Map
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore real-time sustainability metrics across different campus buildings. 
              Click on any building to see detailed energy, water, waste, and mobility data.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Interactive Campus Map */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-3xl p-8 shadow-xl">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">DSCE Campus Layout</h3>
                <InteractiveCampusMap onBuildingClick={handleBuildingClick} />
              </div>
            </div>

            {/* Building Details Panel */}
            <div className="space-y-6">
              {/* Currently Selected Building */}
              <div className="bg-white rounded-3xl p-6 shadow-xl">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Building Details</h3>
                {selectedBuilding ? (
                  <div className="space-y-4">
                    <div className="text-center pb-4 border-b">
                      <h4 className="text-lg font-semibold text-gray-900">{selectedBuilding.name}</h4>
                      <p className="text-sm text-gray-500">Building {selectedBuilding.id}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{selectedBuilding.energy}</div>
                        <div className="text-xs text-gray-600">kWh/day</div>
                        <div className="text-xs text-green-600">Energy</div>
                      </div>
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{selectedBuilding.water}</div>
                        <div className="text-xs text-gray-600">Liters/day</div>
                        <div className="text-xs text-blue-600">Water</div>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">{selectedBuilding.waste}</div>
                        <div className="text-xs text-gray-600">kg/day</div>
                        <div className="text-xs text-purple-600">Waste</div>
                      </div>
                      <div className="text-center p-3 bg-orange-50 rounded-lg">
                        <div className="text-2xl font-bold text-orange-600">{selectedBuilding.mobility}</div>
                        <div className="text-xs text-gray-600">users/day</div>
                        <div className="text-xs text-orange-600">Mobility</div>
                      </div>
                    </div>
                    <div className="pt-4">
                      <div className="text-sm font-semibold mb-2">Efficiency Score</div>
                      <div className="bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-green-400 to-blue-500 rounded-full h-2 transition-all duration-500" 
                          style={{width: `${Math.max(20, 100 - (selectedBuilding.energy / 10))}%`}}
                        ></div>
                      </div>
                      <div className="text-right text-xs text-gray-500 mt-1">
                        {Math.max(20, 100 - Math.floor(selectedBuilding.energy / 10))}/100
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m0 0h2M7 16h6M7 8h6" />
                    </svg>
                    <p>Click on any building in the map to see detailed metrics</p>
                  </div>
                )}
              </div>

              {/* Top Performers */}
              <div className="bg-white rounded-3xl p-6 shadow-xl">
                <h3 className="text-xl font-bold text-gray-900 mb-4">🏆 Top Performers</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div>
                      <div className="font-semibold text-gray-900">Library (B4)</div>
                      <div className="text-sm text-green-600">Most Energy Efficient</div>
                    </div>
                    <div className="text-2xl">🥇</div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div>
                      <div className="font-semibold text-gray-900">Admin Block (B7)</div>
                      <div className="text-sm text-blue-600">Best Water Conservation</div>
                    </div>
                    <div className="text-2xl">🥈</div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <div>
                      <div className="font-semibold text-gray-900">Arts & Science (B1)</div>
                      <div className="text-sm text-purple-600">Lowest Waste Generation</div>
                    </div>
                    <div className="text-2xl">🥉</div>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-white rounded-3xl p-6 shadow-xl">
                <h3 className="text-xl font-bold text-gray-900 mb-4">📊 Campus Overview</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Buildings</span>
                    <span className="font-bold text-lg">7</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Daily Energy (kWh)</span>
                    <span className="font-bold text-lg text-green-600">2,847</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Water Usage (L)</span>
                    <span className="font-bold text-lg text-blue-600">4,126</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Waste Generated (kg)</span>
                    <span className="font-bold text-lg text-purple-600">156</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Daily Commuters</span>
                    <span className="font-bold text-lg text-orange-600">3,240</span>
                  </div>
                </div>
              </div>

              {/* Sustainability Score */}
              <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-3xl p-6 shadow-xl">
                <h3 className="text-xl font-bold mb-4">🌱 Sustainability Score</h3>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">87/100</div>
                  <div className="text-green-100">Excellent Performance!</div>
                  <div className="mt-4 bg-white/20 rounded-full h-2">
                    <div className="bg-white rounded-full h-2" style={{width: '87%'}}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Suggestions Panel */}
          <div className="mt-12 bg-white rounded-3xl p-8 shadow-xl">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">💡 AI-Powered Suggestions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <span className="text-yellow-600 mr-2">⚡</span>
                  <h4 className="font-semibold text-gray-900">Energy Optimization</h4>
                </div>
                <p className="text-sm text-gray-600">Engineering Block (B3) consumes 30% more energy than average. Consider LED retrofit.</p>
              </div>
              
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <span className="text-blue-600 mr-2">💧</span>
                  <h4 className="font-semibold text-gray-900">Water Conservation</h4>
                </div>
                <p className="text-sm text-gray-600">Install smart water meters in Cafeteria (B5) to reduce consumption by 15%.</p>
              </div>
              
              <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <span className="text-green-600 mr-2">♻️</span>
                  <h4 className="font-semibold text-gray-900">Waste Reduction</h4>
                </div>
                <p className="text-sm text-gray-600">Implement composting program in Sports Complex (B6) to reduce waste by 25%.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Statistics */}
      <section id="impact" className="py-20 bg-gradient-to-r from-green-600 to-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Making a Real Impact
            </h2>
            <p className="text-xl text-green-100 max-w-3xl mx-auto">
              Join thousands of educational institutions already using our platform 
              to build a sustainable future.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center stagger-container">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 will-change-transform hover:scale-105 transition-transform duration-300">
              <div className="text-4xl font-bold text-white mb-2 animate-subtle-float">500+</div>
              <div className="text-green-100">Educational Institutions</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 will-change-transform hover:scale-105 transition-transform duration-300">
              <div className="text-4xl font-bold text-white mb-2 animate-subtle-float" style={{animationDelay: '0.5s'}}>2.3M</div>
              <div className="text-green-100">kWh Energy Saved</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 will-change-transform hover:scale-105 transition-transform duration-300">
              <div className="text-4xl font-bold text-white mb-2 animate-subtle-float" style={{animationDelay: '1s'}}>1.8M</div>
              <div className="text-green-100">Liters Water Conserved</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 will-change-transform hover:scale-105 transition-transform duration-300">
              <div className="text-4xl font-bold text-white mb-2 animate-subtle-float" style={{animationDelay: '1.5s'}}>850</div>
              <div className="text-green-100">Tons CO₂ Reduced</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="ml-3 text-xl font-bold">
                  Net <span className="text-green-400">Zero</span> Campus
                </span>
              </div>
              <p className="text-gray-400 max-w-md">
                Empowering educational institutions to achieve carbon neutrality through 
                smart monitoring, AI insights, and community engagement.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Platform</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-green-400 transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors">Integration</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors">API Docs</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-green-400 transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Net Zero Campus. All rights reserved. Built for a sustainable future.</p>
          </div>
        </div>
      </footer>

      {/* Authentication Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultRole={selectedRole}
        hideRoleSelection={true}
      />
    </div>
  );
};

export default Landing;