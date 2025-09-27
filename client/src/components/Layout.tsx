import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { logoutUser } from '../services/firebase';
import { LanguageSwitcher } from './ui';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { userProfile } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Hide navbar on login page
  const hideNavbar = location.pathname === "/login";

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: '📊' },
    { name: 'Energy', href: '/energy', icon: '⚡' },
    { name: 'Water', href: '/water', icon: '💧' },
    { name: 'Waste', href: '/waste', icon: '🗑️' },
    { name: 'Mobility', href: '/mobility', icon: '🚶' },
    { name: 'Gamification', href: '/gamification', icon: '🎮' },
    { name: 'Profile', href: '/profile', icon: '👤' },
  ];

  const adminNavigation = [
    { name: 'Admin Dashboard', href: '/admin', icon: '⚙️' },
    { name: 'Energy Management', href: '/admin/energy', icon: '⚡' },
    { name: 'Water Management', href: '/admin/water', icon: '💧' },
    { name: 'Waste Management', href: '/admin/waste', icon: '🗑️' },
  ];

  const facultyNavigation = [
    { name: 'Department Energy', href: '/faculty-energy', icon: '🏢' },
    { name: 'Department Water', href: '/faculty-water', icon: '💧' },
  ];

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const isCurrentPage = (href: string) => location.pathname === href;

  return (
    <div className={`h-screen flex overflow-hidden ${darkMode ? 'dark' : ''}`}>
      {/* Sidebar - only show if not hiding navbar */}
      {!hideNavbar && (
        <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg will-change-transform lg:translate-x-0 lg:static lg:inset-0 transition-transform duration-300 ease-out lg:transition-none`}>
          <div className="flex items-center justify-center h-16 bg-primary-600 text-white">
            <h1 className="text-xl font-bold">Net Zero Campus</h1>
          </div>
          
          <nav className="mt-5 px-2 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`${
                  isCurrentPage(item.href)
                    ? 'bg-primary-100 dark:bg-primary-900 text-primary-900 dark:text-primary-100'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                } group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors`}
              >
                <span className="mr-3 text-lg">{item.icon}</span>
                {item.name}
              </Link>
            ))}
            
            {/* Faculty section - show only for faculty users */}
            {userProfile?.role === 'faculty' && (
              <>
                <div className="border-t border-gray-200 dark:border-gray-600 my-4">
                  <h3 className="px-2 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Faculty Tools
                  </h3>
                </div>
                {facultyNavigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`${
                      isCurrentPage(item.href)
                        ? 'bg-primary-100 dark:bg-primary-900 text-primary-900 dark:text-primary-100'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    } group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors`}
                  >
                    <span className="mr-3 text-lg">{item.icon}</span>
                    {item.name}
                  </Link>
                ))}
              </>
            )}
            
            {/* Admin section - show only for admin users */}
            {userProfile?.role === 'admin' && (
              <>
                <div className="border-t border-gray-200 dark:border-gray-600 my-4">
                  <h3 className="px-2 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Admin Tools
                  </h3>
                </div>
                {adminNavigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`${
                      isCurrentPage(item.href)
                        ? 'bg-primary-100 dark:bg-primary-900 text-primary-900 dark:text-primary-100'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    } group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors`}
                  >
                    <span className="mr-3 text-lg">{item.icon}</span>
                    {item.name}
                  </Link>
                ))}
              </>
            )}
          </nav>
        </div>
      )}

      {/* Mobile sidebar overlay - only show if not hiding navbar */}
      {!hideNavbar && sidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="absolute inset-0 bg-gray-600 opacity-75"></div>
        </div>
      )}

      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        {/* Header - only show if not hiding navbar */}
        {!hideNavbar && (
          <div className="relative z-10 flex-shrink-0 flex h-16 bg-white dark:bg-gray-800 shadow border-b border-gray-200 dark:border-gray-700">
            <button
              type="button"
              className="px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            
            <div className="flex-1 px-4 flex justify-between items-center">
              <div className="flex-1 flex items-center">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 capitalize">
                  {location.pathname.slice(1).replace(/\//g, ' / ') || 'Dashboard'}
                </h2>
              </div>
              
              <div className="ml-4 flex items-center md:ml-6 space-x-4">
                {/* Language Switcher */}
                <LanguageSwitcher />
                
                {/* Dark mode toggle */}
                <button
                  onClick={toggleDarkMode}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {darkMode ? (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                  )}
                </button>

                {/* Notifications */}
                <button className="p-2 text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5-5 5-5h-5m-6 8L9 12l5-5H9l5 5-5 5z" />
                  </svg>
                </button>

                {/* User menu */}
                <div className="relative">
                  <div className="flex items-center space-x-3">
                    <div className="text-sm text-right">
                      <p className="text-gray-900 dark:text-gray-100 font-medium">
                        {userProfile?.fullName || 'User'}
                      </p>
                      <p className="text-gray-500 dark:text-gray-400 text-xs">
                        {userProfile?.email}
                      </p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="bg-primary-600 hover:bg-primary-700 text-white px-3 py-1 rounded-md text-sm font-medium transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Page content */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;