import React, { useState, useEffect, useRef } from 'react';
import HeroSection from '../components/landing/HeroSection';
import AuthModal from '../components/auth/AuthModal';
import { UserRole } from '../services/firebase';

const Landing: React.FC = () => {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [energyCount, setEnergyCount] = useState(0);
  const [waterCount, setWaterCount] = useState(0);
  const [wasteCount, setWasteCount] = useState(0);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Counter animations
  useEffect(() => {
    const animateCounters = () => {
      const energyTarget = 847;
      const waterTarget = 1234;
      const wasteTarget = 45;
      
      let energyCurrent = 0;
      let waterCurrent = 0;
      let wasteCurrent = 0;

      const interval = setInterval(() => {
        if (energyCurrent < energyTarget) {
          energyCurrent += Math.ceil(energyTarget / 60);
          setEnergyCount(Math.min(energyCurrent, energyTarget));
        }
        if (waterCurrent < waterTarget) {
          waterCurrent += Math.ceil(waterTarget / 60);
          setWaterCount(Math.min(waterCurrent, waterTarget));
        }
        if (wasteCurrent < wasteTarget) {
          wasteCurrent += Math.ceil(wasteTarget / 60);
          setWasteCount(Math.min(wasteCurrent, wasteTarget));
        }

        if (energyCurrent >= energyTarget && waterCurrent >= waterTarget && wasteCurrent >= wasteTarget) {
          clearInterval(interval);
        }
      }, 50);

      return () => clearInterval(interval);
    };

    const timer = setTimeout(animateCounters, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Intersection Observer for animations
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in-up');
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('.animate-on-scroll');
    elements.forEach((el) => observerRef.current?.observe(el));

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  const handlePortalSelect = (portal: 'student' | 'faculty' | 'admin') => {
    setSelectedRole(portal as UserRole);
    setAuthModalOpen(true);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const getMinutesAgo = () => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - currentTime.getTime()) / 60000);
    return diff < 1 ? 'just now' : `${Math.max(2, diff)} minutes ago`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Enhanced Navigation Header */}
      <nav className="absolute top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 via-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-all duration-300">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <span className="text-xl font-bold text-gray-900">
                    Net <span className="text-green-600">Zero</span> Campus
                  </span>
                  <div className="text-xs text-gray-500">@ DSCE</div>
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <a href="#pillars" className="text-gray-700 hover:text-green-600 px-3 py-2 text-sm font-medium transform hover:scale-105 transition-all duration-200">
                  Pillars
                </a>
                <a href="#journey" className="text-gray-700 hover:text-green-600 px-3 py-2 text-sm font-medium transform hover:scale-105 transition-all duration-200">
                  Journey
                </a>
                <a href="#impact" className="text-gray-700 hover:text-green-600 px-3 py-2 text-sm font-medium transform hover:scale-105 transition-all duration-200">
                  Impact
                </a>
                <a href="#community" className="text-gray-700 hover:text-green-600 px-3 py-2 text-sm font-medium transform hover:scale-105 transition-all duration-200">
                  Community
                </a>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Keep existing */}
      <HeroSection onPortalSelect={handlePortalSelect} />

      {/* 4 Pillars of Sustainability */}
      <section id="pillars" className="py-20 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-50/30 to-blue-50/30"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 animate-on-scroll">
              Four Pillars of Campus Sustainability
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto animate-on-scroll">
              Our comprehensive approach to achieving net-zero campus through intelligent monitoring and community engagement.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Energy Efficiency */}
            <div className="group bg-gradient-to-br from-yellow-50 to-orange-50 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 animate-on-scroll">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-3xl flex items-center justify-center group-hover:rotate-6 transition-transform duration-300">
                  <span className="text-4xl">🔋</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Energy Efficiency</h3>
                <ul className="text-gray-600 space-y-2 text-left">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></div>
                    Smart grid monitoring
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></div>
                    Solar panel optimization
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></div>
                    LED lighting systems
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></div>
                    HVAC optimization
                  </li>
                </ul>
                <div className="mt-6 text-center">
                  <div className="text-3xl font-bold text-orange-600">78%</div>
                  <div className="text-sm text-gray-600">Efficiency achieved</div>
                </div>
              </div>
            </div>

            {/* Water Conservation */}
            <div className="group bg-gradient-to-br from-blue-50 to-cyan-50 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 animate-on-scroll">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-3xl flex items-center justify-center group-hover:rotate-6 transition-transform duration-300">
                  <span className="text-4xl">💧</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Water Conservation</h3>
                <ul className="text-gray-600 space-y-2 text-left">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                    Rainwater harvesting
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                    Usage tracking systems
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                    Leak detection alerts
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                    Greywater recycling
                  </li>
                </ul>
                <div className="mt-6 text-center">
                  <div className="text-3xl font-bold text-blue-600">65%</div>
                  <div className="text-sm text-gray-600">Water saved</div>
                </div>
              </div>
            </div>

            {/* Waste Management */}
            <div className="group bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 animate-on-scroll">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-3xl flex items-center justify-center group-hover:rotate-6 transition-transform duration-300">
                  <span className="text-4xl">♻️</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Waste Management</h3>
                <ul className="text-gray-600 space-y-2 text-left">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                    Segregation tracking
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                    Composting programs
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                    Recycling analytics
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                    Zero-waste goals
                  </li>
                </ul>
                <div className="mt-6 text-center">
                  <div className="text-3xl font-bold text-green-600">82%</div>
                  <div className="text-sm text-gray-600">Waste diverted</div>
                </div>
              </div>
            </div>

            {/* Green Mobility */}
            <div className="group bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 animate-on-scroll">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-purple-400 to-pink-500 rounded-3xl flex items-center justify-center group-hover:rotate-6 transition-transform duration-300">
                  <span className="text-4xl">🚶</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Green Mobility</h3>
                <ul className="text-gray-600 space-y-2 text-left">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                    Cycle tracking systems
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                    EV charging stations
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                    Carbon footprint calc
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                    Public transport links
                  </li>
                </ul>
                <div className="mt-6 text-center">
                  <div className="text-3xl font-bold text-purple-600">72%</div>
                  <div className="text-sm text-gray-600">Carbon reduced</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Campus Sustainability Journey Timeline */}
      <section id="journey" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 animate-on-scroll">
              Our Sustainability Journey
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto animate-on-scroll">
              Our roadmap and vision - planning the path to carbon neutrality through innovative technology.
            </p>
          </div>

          <div className="relative">
            {/* Timeline container with proper structure */}
            <div className="relative">
              {/* Horizontal timeline line positioned at the top */}
              <div className="relative hidden lg:block mb-16">
                {/* The main horizontal line */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 via-blue-400 via-purple-400 to-red-500"></div>
                
                {/* Four small circles positioned on the line */}
                <div className="relative flex justify-between items-center">
                  {/* Phase 1 circle */}
                  <div className="w-6 h-6 bg-green-500 rounded-full border-4 border-white shadow-lg z-10"></div>
                  {/* Phase 2 circle */}
                  <div className="w-6 h-6 bg-blue-500 rounded-full border-4 border-white shadow-lg z-10"></div>
                  {/* Phase 3 circle */}
                  <div className="w-6 h-6 bg-purple-500 rounded-full border-4 border-white shadow-lg z-10"></div>
                  {/* Phase 4 circle */}
                  <div className="w-6 h-6 bg-red-500 rounded-full border-4 border-white shadow-lg z-10"></div>
                </div>
              </div>
              
              {/* Content positioned below the timeline */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Phase 1 */}
                <div className="text-center animate-on-scroll">
                  {/* Large icon - only visible on mobile/tablet */}
                  <div className="relative lg:hidden mb-6">
                    <div className="w-20 h-20 mx-auto bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center shadow-xl">
                      <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">✓</span>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Phase 1: Baseline Assessment</h3>
                  <p className="text-gray-600 mb-2">In Development</p>
                  <p className="text-sm text-gray-500">Planning comprehensive audit of current energy, water, and waste patterns</p>
                </div>

                {/* Phase 2 */}
                <div className="text-center animate-on-scroll">
                  {/* Large icon - only visible on mobile/tablet */}
                  <div className="relative lg:hidden mb-6">
                    <div className="w-20 h-20 mx-auto bg-gradient-to-r from-blue-400 to-blue-500 rounded-full flex items-center justify-center shadow-xl">
                      <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                      </svg>
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">✓</span>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Phase 2: IoT Deployment</h3>
                  <p className="text-gray-600 mb-2">Planned</p>
                  <p className="text-sm text-gray-500">Future installation of smart sensors and monitoring systems campus-wide</p>
                </div>

                {/* Phase 3 */}
                <div className="text-center animate-on-scroll">
                  {/* Large icon - only visible on mobile/tablet */}
                  <div className="relative lg:hidden mb-6">
                    <div className="w-20 h-20 mx-auto bg-gradient-to-r from-purple-400 to-purple-500 rounded-full flex items-center justify-center shadow-xl">
                      <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center animate-pulse">
                      <span className="text-white text-sm font-bold">⚡</span>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Phase 3: Behavior Programs</h3>
                  <p className="text-gray-600 mb-2">Future Phase</p>
                  <p className="text-sm text-gray-500">Planned community engagement and gamification initiatives</p>
                </div>

                {/* Phase 4 */}
                <div className="text-center animate-on-scroll">
                  {/* Large icon - only visible on mobile/tablet */}
                  <div className="relative lg:hidden mb-6">
                    <div className="w-20 h-20 mx-auto bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center shadow-xl">
                      <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                      </svg>
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center animate-bounce">
                      <span className="text-white text-sm font-bold">🎯</span>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Phase 4: Net Zero Target</h3>
                  <p className="text-gray-600 mb-2">Vision 2026</p>
                  <p className="text-sm text-gray-500">Goal to achieve carbon neutrality across all campus operations</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Campus Zones Map */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 animate-on-scroll">
              Interactive Campus Sustainability Map
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto animate-on-scroll">
              Explore real-time sustainability performance across different campus zones with interactive hotspots.
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-3xl p-8 shadow-xl animate-on-scroll">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Campus Map Visualization */}
              <div className="lg:col-span-2">
                <div className="relative bg-white rounded-2xl p-8 shadow-lg min-h-96">
                  <div className="absolute inset-4 bg-gradient-to-br from-green-100 to-blue-100 rounded-xl flex items-center justify-center">
                    <div className="grid grid-cols-3 gap-4 w-full max-w-md">
                      {/* Academic Block A */}
                      <div className="group relative">
                        <div className="w-16 h-20 bg-green-400 rounded-lg shadow-lg cursor-pointer hover:scale-110 transition-all duration-300 flex items-center justify-center">
                          <span className="text-white text-xs font-bold">Block A</span>
                        </div>
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          85% efficient
                        </div>
                      </div>

                      {/* Library */}
                      <div className="group relative">
                        <div className="w-16 h-16 bg-blue-400 rounded-lg shadow-lg cursor-pointer hover:scale-110 transition-all duration-300 flex items-center justify-center">
                          <span className="text-white text-xs font-bold">Library</span>
                        </div>
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          92% efficient
                        </div>
                      </div>

                      {/* Lab Block */}
                      <div className="group relative">
                        <div className="w-16 h-20 bg-yellow-400 rounded-lg shadow-lg cursor-pointer hover:scale-110 transition-all duration-300 flex items-center justify-center">
                          <span className="text-white text-xs font-bold">Labs</span>
                        </div>
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          73% efficient
                        </div>
                      </div>

                      {/* Cafeteria */}
                      <div className="group relative">
                        <div className="w-16 h-12 bg-orange-400 rounded-lg shadow-lg cursor-pointer hover:scale-110 transition-all duration-300 flex items-center justify-center">
                          <span className="text-white text-xs font-bold">Cafe</span>
                        </div>
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          68% efficient
                        </div>
                      </div>

                      {/* Admin Block */}
                      <div className="group relative">
                        <div className="w-16 h-16 bg-purple-400 rounded-lg shadow-lg cursor-pointer hover:scale-110 transition-all duration-300 flex items-center justify-center">
                          <span className="text-white text-xs font-bold">Admin</span>
                        </div>
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          90% efficient
                        </div>
                      </div>

                      {/* Sports Complex */}
                      <div className="group relative">
                        <div className="w-16 h-16 bg-red-400 rounded-lg shadow-lg cursor-pointer hover:scale-110 transition-all duration-300 flex items-center justify-center">
                          <span className="text-white text-xs font-bold">Sports</span>
                        </div>
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          65% efficient
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute bottom-4 right-4 text-xs text-gray-500">
                    Click buildings for details
                  </div>
                </div>
              </div>

              {/* Zone Performance */}
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900">Zone Performance</h3>
                
                <div className="space-y-4">
                  <div className="bg-white rounded-xl p-4 shadow-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold">Academic Block A</span>
                      <span className="text-green-600 text-sm font-bold">85%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-400 h-2 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-4 shadow-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold">Library</span>
                      <span className="text-blue-600 text-sm font-bold">92%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-400 h-2 rounded-full" style={{ width: '92%' }}></div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-4 shadow-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold">Lab Block</span>
                      <span className="text-yellow-600 text-sm font-bold">73%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-yellow-400 h-2 rounded-full" style={{ width: '73%' }}></div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-4 shadow-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold">Admin Block</span>
                      <span className="text-purple-600 text-sm font-bold">90%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-400 h-2 rounded-full" style={{ width: '90%' }}></div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-4 shadow-lg">
                  <h4 className="font-semibold text-gray-900 mb-3">Legend</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-green-400 rounded mr-3"></div>
                      <span>Excellent (80%+)</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-yellow-400 rounded mr-3"></div>
                      <span>Good (60-79%)</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-red-400 rounded mr-3"></div>
                      <span>Needs Improvement (&lt;60%)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Leaderboard & Gamification Section */}
      <section className="py-20 bg-gradient-to-br from-purple-50 to-pink-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 animate-on-scroll">
              Sustainability Champions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto animate-on-scroll">
              Celebrating our eco-warriors and departments leading the charge towards carbon neutrality.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Department Leaderboard */}
            <div className="animate-on-scroll">
              <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                🏆 Top Departments by Energy Savings
              </h3>
              <div className="space-y-4">
                {[
                  { name: "Computer Science", savings: "23%", rank: 1, color: "from-yellow-400 to-orange-500", medal: "🥇" },
                  { name: "Environmental Science", savings: "21%", rank: 2, color: "from-gray-300 to-gray-400", medal: "🥈" },
                  { name: "Mechanical Engineering", savings: "19%", rank: 3, color: "from-yellow-600 to-yellow-700", medal: "🥉" },
                  { name: "Civil Engineering", savings: "17%", rank: 4, color: "from-blue-400 to-blue-500", medal: "🏅" },
                  { name: "Business Administration", savings: "15%", rank: 5, color: "from-purple-400 to-purple-500", medal: "🏅" }
                ].map((dept, index) => (
                  <div key={index} className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 bg-gradient-to-r ${dept.color} rounded-xl flex items-center justify-center text-white font-bold text-lg`}>
                          {dept.rank}
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900">{dept.name}</h4>
                          <p className="text-sm text-gray-600">Energy savings this month</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl font-bold text-green-600">{dept.savings}</span>
                        <span className="text-2xl">{dept.medal}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Student Eco-Warriors */}
            <div className="animate-on-scroll">
              <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                🌱 Student Eco-Warriors
              </h3>
              <div className="space-y-4">
                {[
                  { name: "Priya Sharma", points: "2,847", badges: ["💧", "♻️", "🔋"], level: "Sustainability Master" },
                  { name: "Rahul Kumar", points: "2,634", badges: ["🔋", "🚶", "💧"], level: "Green Champion" },
                  { name: "Ananya Patel", points: "2,521", badges: ["♻️", "🔋"], level: "Eco Warrior" },
                  { name: "Vikram Singh", points: "2,398", badges: ["🚶", "💧"], level: "Green Guardian" },
                  { name: "Sneha Reddy", points: "2,276", badges: ["💧", "♻️"], level: "Sustainability Advocate" }
                ].map((student, index) => (
                  <div key={index} className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                          {student.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900">{student.name}</h4>
                          <p className="text-sm text-gray-600">{student.level}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-purple-600">{student.points}</div>
                        <div className="text-sm text-gray-500">points</div>
                        <div className="flex space-x-1 mt-2">
                          {student.badges.map((badge, i) => (
                            <span key={i} className="text-lg">{badge}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Achievement Badges */}
              <div className="mt-8 bg-white rounded-2xl p-6 shadow-xl">
                <h4 className="font-bold text-gray-900 mb-4 text-center">🏆 Achievement Badges</h4>
                <div className="grid grid-cols-4 gap-4">
                  {[
                    { emoji: "💧", name: "Water Saver", desc: "50L+ saved" },
                    { emoji: "♻️", name: "Waste Warrior", desc: "10kg+ diverted" },
                    { emoji: "🔋", name: "Energy Expert", desc: "100kWh+ saved" },
                    { emoji: "🚶", name: "Green Walker", desc: "50km+ on foot" }
                  ].map((badge, index) => (
                    <div key={index} className="text-center group">
                      <div className="w-12 h-12 mx-auto mb-2 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <span className="text-lg">{badge.emoji}</span>
                      </div>
                      <div className="text-xs font-semibold text-gray-900">{badge.name}</div>
                      <div className="text-xs text-gray-500">{badge.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Before vs After Impact Showcase */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-blue-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4 animate-on-scroll">
              Transformational Impact: Before vs Today
            </h2>
            <p className="text-xl text-green-100 max-w-3xl mx-auto animate-on-scroll">
              Witness the remarkable journey of our campus sustainability transformation over the past year.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Energy Improvement */}
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 hover:scale-105 transition-all duration-500 animate-on-scroll">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-yellow-400 rounded-2xl flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Energy Consumption</h3>
                <div className="space-y-3">
                  <div className="bg-white/20 rounded-xl p-3">
                    <div className="text-sm text-green-100">Jan 2024</div>
                    <div className="text-2xl font-bold text-white">1,250 kWh</div>
                  </div>
                  <div className="flex justify-center">
                    <svg className="w-8 h-8 text-green-300 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  </div>
                  <div className="bg-white/30 rounded-xl p-3">
                    <div className="text-sm text-green-100">Today</div>
                    <div className="text-2xl font-bold text-green-300">847 kWh</div>
                    <div className="text-sm text-green-200">↓ 32% improvement</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Water Conservation */}
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 hover:scale-105 transition-all duration-500 animate-on-scroll">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-blue-400 rounded-2xl flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Water Usage</h3>
                <div className="space-y-3">
                  <div className="bg-white/20 rounded-xl p-3">
                    <div className="text-sm text-green-100">Jan 2024</div>
                    <div className="text-2xl font-bold text-white">1,845 L</div>
                  </div>
                  <div className="flex justify-center">
                    <svg className="w-8 h-8 text-blue-300 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  </div>
                  <div className="bg-white/30 rounded-xl p-3">
                    <div className="text-sm text-green-100">Today</div>
                    <div className="text-2xl font-bold text-blue-300">1,234 L</div>
                    <div className="text-sm text-blue-200">↓ 33% improvement</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Waste Reduction */}
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 hover:scale-105 transition-all duration-500 animate-on-scroll">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-green-400 rounded-2xl flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Waste Generation</h3>
                <div className="space-y-3">
                  <div className="bg-white/20 rounded-xl p-3">
                    <div className="text-sm text-green-100">Jan 2024</div>
                    <div className="text-2xl font-bold text-white">78 kg</div>
                  </div>
                  <div className="flex justify-center">
                    <svg className="w-8 h-8 text-green-300 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  </div>
                  <div className="bg-white/30 rounded-xl p-3">
                    <div className="text-sm text-green-100">Today</div>
                    <div className="text-2xl font-bold text-green-300">45 kg</div>
                    <div className="text-sm text-green-200">↓ 42% improvement</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Carbon Footprint */}
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 hover:scale-105 transition-all duration-500 animate-on-scroll">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-purple-400 rounded-2xl flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-4">CO₂ Emissions</h3>
                <div className="space-y-3">
                  <div className="bg-white/20 rounded-xl p-3">
                    <div className="text-sm text-green-100">Jan 2024</div>
                    <div className="text-2xl font-bold text-white">2.8 tons</div>
                  </div>
                  <div className="flex justify-center">
                    <svg className="w-8 h-8 text-purple-300 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  </div>
                  <div className="bg-white/30 rounded-xl p-3">
                    <div className="text-sm text-green-100">Today</div>
                    <div className="text-2xl font-bold text-purple-300">1.6 tons</div>
                    <div className="text-sm text-purple-200">↓ 43% improvement</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Overall Impact Summary */}
          <div className="mt-16 text-center animate-on-scroll">
            <div className="bg-white/20 backdrop-blur-md rounded-3xl p-8 inline-block border border-white/30">
              <h3 className="text-3xl font-bold text-white mb-4">🎉 Overall Campus Impact</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div>
                  <div className="text-4xl font-bold text-green-300">37%</div>
                  <div className="text-green-100">Average Resource Savings</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-blue-300">850+</div>
                  <div className="text-blue-100">Tons CO₂ Prevented</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-purple-300">₹2.3L</div>
                  <div className="text-purple-100">Cost Savings</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Stack & Innovation Hub */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 animate-on-scroll">
              Technology & Innovation Stack
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto animate-on-scroll">
              Powered by cutting-edge IoT sensors, AI analytics, and smart integrations for comprehensive sustainability monitoring.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* IoT Network Visualization */}
            <div className="animate-on-scroll">
              <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">IoT Sensor Network</h3>
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-100/20 to-purple-100/20"></div>
                <div className="relative">
                  <div className="grid grid-cols-3 gap-6">
                    {[
                      { icon: "📡", name: "Smart Meters", count: "45", color: "bg-blue-400" },
                      { icon: "🌡️", name: "Climate Sensors", count: "28", color: "bg-green-400" },
                      { icon: "💧", name: "Flow Meters", count: "32", color: "bg-cyan-400" },
                      { icon: "🔋", name: "Energy Monitors", count: "38", color: "bg-yellow-400" },
                      { icon: "🚮", name: "Waste Sensors", count: "15", color: "bg-orange-400" },
                      { icon: "🏢", name: "Building Hubs", count: "8", color: "bg-purple-400" }
                    ].map((sensor, index) => (
                      <div key={index} className="text-center group">
                        <div className={`w-16 h-16 mx-auto mb-3 ${sensor.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                          <span className="text-2xl">{sensor.icon}</span>
                        </div>
                        <h4 className="text-sm font-semibold text-gray-900">{sensor.name}</h4>
                        <div className="text-lg font-bold text-gray-700">{sensor.count}</div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-8 text-center">
                    <div className="inline-flex items-center px-6 py-3 bg-white rounded-2xl shadow-lg">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-3 animate-pulse"></div>
                      <span className="text-sm font-semibold text-gray-900">166 Active Sensors</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Technology Integrations */}
            <div className="animate-on-scroll">
              <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Smart Integrations</h3>
              <div className="space-y-6">
                {[
                  { 
                    icon: "🤖", 
                    name: "AI-Powered Analytics", 
                    desc: "Machine learning algorithms for predictive insights and optimization recommendations",
                    status: "Active"
                  },
                  { 
                    icon: "☁️", 
                    name: "Weather API Integration", 
                    desc: "Real-time weather data for energy and water consumption forecasting",
                    status: "Active"
                  },
                  { 
                    icon: "📱", 
                    name: "Mobile App Platform", 
                    desc: "iOS and Android apps for community engagement and real-time monitoring",
                    status: "Beta"
                  },
                  { 
                    icon: "🧮", 
                    name: "Carbon Calculator", 
                    desc: "Advanced algorithms for accurate carbon footprint measurement and tracking",
                    status: "Active"
                  },
                  { 
                    icon: "🔗", 
                    name: "Smart Grid Integration", 
                    desc: "Direct connection with campus power management systems",
                    status: "Coming Soon"
                  }
                ].map((tech, index) => (
                  <div key={index} className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-500 rounded-xl flex items-center justify-center">
                        <span className="text-2xl">{tech.icon}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-lg font-bold text-gray-900">{tech.name}</h4>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            tech.status === 'Active' ? 'bg-green-100 text-green-800' :
                            tech.status === 'Beta' ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {tech.status}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm">{tech.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Tech Stack Badges */}
              <div className="mt-8 bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-6">
                <h4 className="font-bold text-gray-900 mb-4 text-center">Built With</h4>
                <div className="grid grid-cols-3 gap-4">
                  {['React', 'Node.js', 'Firebase', 'TensorFlow', 'MongoDB', 'Docker'].map((tech, index) => (
                    <div key={index} className="text-center">
                      <div className="bg-white rounded-xl p-3 shadow-md hover:shadow-lg transition-shadow duration-300">
                        <span className="text-sm font-semibold text-gray-700">{tech}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sustainability Goals Progress (UN SDGs) */}
      <section id="sdg-goals" className="py-20 bg-gradient-to-br from-blue-50 to-green-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 animate-on-scroll">
              UN Sustainable Development Goals Progress
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto animate-on-scroll">
              Aligning our campus sustainability efforts with global goals for a better tomorrow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                number: 7, 
                title: "Affordable Clean Energy", 
                progress: 78, 
                color: "from-yellow-400 to-orange-500",
                icon: "⚡",
                achievements: ["Solar panels installed", "LED lighting 90% complete", "Smart grid deployed"]
              },
              { 
                number: 12, 
                title: "Responsible Consumption", 
                progress: 65, 
                color: "from-green-400 to-emerald-500",
                icon: "♻️",
                achievements: ["Waste segregation system", "Zero single-use plastics", "Sustainable procurement"]
              },
              { 
                number: 13, 
                title: "Climate Action", 
                progress: 72, 
                color: "from-blue-400 to-cyan-500",
                icon: "🌍",
                achievements: ["Carbon footprint tracking", "Tree plantation drive", "Climate awareness programs"]
              }
            ].map((goal, index) => (
              <div key={index} className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 animate-on-scroll">
                <div className="text-center mb-6">
                  <div className={`w-20 h-20 mx-auto mb-4 bg-gradient-to-r ${goal.color} rounded-full flex items-center justify-center`}>
                    <span className="text-3xl">{goal.icon}</span>
                  </div>
                  <div className="text-lg font-bold text-gray-600 mb-2">SDG {goal.number}</div>
                  <h3 className="text-xl font-bold text-gray-900">{goal.title}</h3>
                </div>

                {/* Circular Progress */}
                <div className="relative w-32 h-32 mx-auto mb-6">
                  <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                    <circle
                      cx="60"
                      cy="60"
                      r="50"
                      stroke="#e5e7eb"
                      strokeWidth="8"
                      fill="transparent"
                    />
                    <circle
                      cx="60"
                      cy="60"
                      r="50"
                      stroke="url(#gradient)"
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray={`${(goal.progress / 100) * 314} 314`}
                      strokeLinecap="round"
                      className="transition-all duration-1000 ease-out"
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#10B981" />
                        <stop offset="100%" stopColor="#3B82F6" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{goal.progress}%</div>
                      <div className="text-xs text-gray-600">Achieved</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  {goal.achievements.map((achievement, i) => (
                    <div key={i} className="flex items-center text-sm text-gray-600">
                      <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                      {achievement}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Impact Stories */}
      <section id="community" className="py-20 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 animate-on-scroll">
              Community Impact Stories
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto animate-on-scroll">
              Real stories from our campus community showcasing personal sustainability journeys and achievements.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Priya Sharma",
                role: "Computer Science Student",
                story: "How I reduced my carbon footprint by 30%",
                image: "👩‍🎓",
                impact: "Saved 245 kWh energy, 180L water",
                quote: "The gamification made sustainability fun and engaging. I never thought small actions could create such a big impact!"
              },
              {
                name: "Dr. Rajesh Kumar",
                role: "Environmental Science Faculty",
                story: "Leading by example in sustainable research",
                image: "👨‍🏫",
                impact: "Lab emissions reduced by 40%",
                quote: "Integrating sustainability into curriculum has inspired both students and fellow faculty to take action."
              },
              {
                name: "Anita Singh",
                role: "Campus Admin",
                story: "Transforming campus operations sustainably",
                image: "👩‍💼",
                impact: "Campus waste reduced by 55%",
                quote: "The real-time monitoring system helped us identify waste hotspots and implement targeted solutions."
              }
            ].map((story, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 animate-on-scroll">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center text-4xl">
                    {story.image}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{story.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{story.role}</p>
                  <h4 className="text-lg font-semibold text-blue-600">{story.story}</h4>
                </div>

                <div className="bg-white rounded-2xl p-4 mb-6 shadow-md">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600 mb-1">{story.impact}</div>
                    <div className="text-xs text-gray-600">Personal Impact This Year</div>
                  </div>
                </div>

                <blockquote className="text-gray-700 text-sm italic text-center">
                  "{story.quote}"
                </blockquote>

                <div className="flex justify-center mt-4">
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Awards & Recognition */}
      <section className="py-20 bg-gradient-to-br from-yellow-50 to-orange-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 animate-on-scroll">
              Awards & Recognition
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto animate-on-scroll">
              Our sustainability efforts have been recognized by leading organizations and institutions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Green Campus Certification 2024",
                organization: "National Green Tribunal",
                level: "Platinum",
                icon: "🏆",
                color: "from-yellow-400 to-yellow-600"
              },
              {
                title: "Best Sustainability Initiative",
                organization: "Karnataka State",
                level: "Winner",
                icon: "🥇",
                color: "from-blue-400 to-blue-600"
              },
              {
                title: "Carbon Neutral Campus",
                organization: "Ministry of Environment",
                level: "Certified",
                icon: "🌱",
                color: "from-green-400 to-green-600"
              },
              {
                title: "Innovation in EdTech",
                organization: "AICTE",
                level: "Excellence",
                icon: "🚀",
                color: "from-purple-400 to-purple-600"
              }
            ].map((award, index) => (
              <div key={index} className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 animate-on-scroll">
                <div className="text-center">
                  <div className={`w-20 h-20 mx-auto mb-6 bg-gradient-to-r ${award.color} rounded-full flex items-center justify-center shadow-lg`}>
                    <span className="text-4xl">{award.icon}</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{award.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{award.organization}</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold bg-gradient-to-r ${award.color} text-white`}>
                    {award.level}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center animate-on-scroll">
            <div className="bg-white rounded-3xl p-8 shadow-xl inline-block">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Media Coverage</h3>
              <div className="flex justify-center space-x-8">
                {['Times of India', 'The Hindu', 'Deccan Herald', 'News18'].map((media, index) => (
                  <div key={index} className="text-center">
                    <div className="w-12 h-12 mx-auto mb-2 bg-gray-100 rounded-xl flex items-center justify-center">
                      <span className="text-xs font-bold text-gray-600">{media.split(' ')[0]}</span>
                    </div>
                    <div className="text-xs text-gray-500">{media}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call-to-Action Hub */}
      <section className="py-20 bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4 animate-on-scroll">
              Join the Sustainability Movement
            </h2>
            <p className="text-xl text-green-100 max-w-3xl mx-auto animate-on-scroll">
              Take action today and be part of the solution. Multiple ways to contribute to our campus sustainability goals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Join Sustainability Club",
                description: "Connect with like-minded students and faculty",
                icon: "👥",
                color: "from-green-400 to-emerald-500",
                action: "Join Now"
              },
              {
                title: "Report Environmental Issues",
                description: "Help us identify and address campus issues",
                icon: "📋",
                color: "from-blue-400 to-cyan-500",
                action: "Report Issue"
              },
              {
                title: "Suggest Improvements",
                description: "Share your ideas for campus sustainability",
                icon: "💡",
                color: "from-yellow-400 to-orange-500",
                action: "Share Idea"
              },
              {
                title: "Download Mobile App",
                description: "Track your personal sustainability journey",
                icon: "📱",
                color: "from-purple-400 to-pink-500",
                action: "Download"
              }
            ].map((cta, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-500 transform hover:scale-105 animate-on-scroll">
                <div className="text-center">
                  <div className={`w-16 h-16 mx-auto mb-6 bg-gradient-to-r ${cta.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                    <span className="text-3xl">{cta.icon}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">{cta.title}</h3>
                  <p className="text-green-100 mb-6 text-sm">{cta.description}</p>
                  <button className={`bg-gradient-to-r ${cta.color} text-white px-6 py-3 rounded-2xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300`}>
                    {cta.action}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="bg-gray-900 text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-900/20 to-blue-900/20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 via-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <span className="text-2xl font-bold">
                    Net <span className="text-green-400">Zero</span> Campus
                  </span>
                  <div className="text-sm text-gray-400">@ DSCE</div>
                </div>
              </div>
              <p className="text-gray-400 max-w-md mb-6">
                Empowering educational institutions to achieve carbon neutrality through 
                smart monitoring, AI insights, and community engagement.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center hover:bg-green-700 transition-colors cursor-pointer">
                  <span className="text-white font-bold">f</span>
                </div>
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center hover:bg-blue-700 transition-colors cursor-pointer">
                  <span className="text-white font-bold">t</span>
                </div>
                <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center hover:bg-purple-700 transition-colors cursor-pointer">
                  <span className="text-white font-bold">in</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold mb-4 text-lg">Platform</h4>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#pillars" className="hover:text-green-400 transition-colors">4 Pillars</a></li>
                <li><a href="#journey" className="hover:text-green-400 transition-colors">Our Journey</a></li>
                <li><a href="#community" className="hover:text-green-400 transition-colors">Community</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors">API Docs</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4 text-lg">Contact & Support</h4>
              <ul className="space-y-3 text-gray-400">
                <li><a href="mailto:support@netzerocampus.edu" className="hover:text-green-400 transition-colors">support@netzerocampus.edu</a></li>
                <li><a href="tel:+918012345678" className="hover:text-green-400 transition-colors">+91 80 1234 5678</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">
                &copy; 2024 Net Zero Campus @ DSCE. All rights reserved. Built for a sustainable future.
              </p>
              <div className="mt-4 md:mt-0 flex items-center space-x-4 text-sm text-gray-400">
                <span>🌱 Carbon Neutral Website</span>
                <span>•</span>
                <span>♻️ Sustainably Hosted</span>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button 
          className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-full shadow-2xl flex items-center justify-center text-white font-bold text-2xl hover:scale-110 transition-all duration-300 animate-bounce"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          ↑
        </button>
      </div>

      {/* Authentication Modal - Keep existing */}
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