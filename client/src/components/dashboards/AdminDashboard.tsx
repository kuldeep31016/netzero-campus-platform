import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
  const { userProfile } = useAuth();
  const navigate = useNavigate();

  // Function to handle navigation to different dashboards
  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Administrator Dashboard
        </h1>
        <p className="text-gray-600">Welcome, {userProfile?.fullName}</p>
        <p className="text-sm text-gray-500">Employee ID: {userProfile?.employeeId} | {userProfile?.department}</p>
      </div>

      {/* Admin-specific dashboard content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Campus-wide Energy */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Campus Energy</p>
              <p className="text-2xl font-bold text-gray-900">25.4 MW</p>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <span className="text-2xl">⚡</span>
            </div>
          </div>
          <p className="text-sm text-red-600 mt-2">↓ 18% from last year</p>
        </div>

        {/* Total Users */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">15,847</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <span className="text-2xl">👥</span>
            </div>
          </div>
          <p className="text-sm text-purple-600 mt-2">↑ 235 this month</p>
        </div>

        {/* Cost Savings */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Cost Savings</p>
              <p className="text-2xl font-bold text-gray-900">₹2.4M</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <span className="text-2xl">💰</span>
            </div>
          </div>
          <p className="text-sm text-green-600 mt-2">↑ 12% this quarter</p>
        </div>
      </div>

      {/* Admin Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Resource Management</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button 
              className="p-4 bg-red-50 hover:bg-red-100 rounded-lg transition-colors text-left"
              onClick={() => handleNavigation('/admin/energy')}
            >
              <div className="flex items-center">
                <span className="text-red-500 mr-3 text-xl">⚡</span>
                <div>
                  <p className="font-medium">Energy</p>
                  <p className="text-sm text-gray-600">Monitor consumption</p>
                </div>
              </div>
            </button>
            <button 
              className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-left"
              onClick={() => handleNavigation('/admin/water')}
            >
              <div className="flex items-center">
                <span className="text-blue-500 mr-3 text-xl">💧</span>
                <div>
                  <p className="font-medium">Water</p>
                  <p className="text-sm text-gray-600">Track usage & conservation</p>
                </div>
              </div>
            </button>
            <button 
              className="p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors text-left"
              onClick={() => handleNavigation('/admin/waste')}
            >
              <div className="flex items-center">
                <span className="text-green-500 mr-3 text-xl">🗑️</span>
                <div>
                  <p className="font-medium">Waste</p>
                  <p className="text-sm text-gray-600">Manage recycling</p>
                </div>
              </div>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">System Management</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors text-left">
              <div className="flex items-center">
                <span className="text-purple-500 mr-3 text-xl">👤</span>
                <div>
                  <p className="font-medium">User Management</p>
                  <p className="text-sm text-gray-600">Manage users & roles</p>
                </div>
              </div>
            </button>
            <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-left">
              <div className="flex items-center">
                <span className="text-blue-500 mr-3 text-xl">📊</span>
                <div>
                  <p className="font-medium">Analytics</p>
                  <p className="text-sm text-gray-600">View detailed reports</p>
                </div>
              </div>
            </button>
            <button className="p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors text-left">
              <div className="flex items-center">
                <span className="text-green-500 mr-3 text-xl">⚙️</span>
                <div>
                  <p className="font-medium">System Settings</p>
                  <p className="text-sm text-gray-600">Configure platform</p>
                </div>
              </div>
            </button>
            <button 
              className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors text-left"
              onClick={() => handleNavigation('/admin/mobility')}
            >
              <div className="flex items-center">
                <span className="text-purple-500 mr-3 text-xl">🚗</span>
                <div>
                  <p className="font-medium">Mobility</p>
                  <p className="text-sm text-gray-600">Transport & emissions</p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <div className="space-y-3">
          <div className="p-3 bg-gray-50 rounded">
            <div className="flex items-start">
              <span className="text-green-500 mr-3">✅</span>
              <div>
                <p className="font-medium">New Faculty Registration</p>
                <p className="text-sm text-gray-600">Dr. Sarah Johnson joined Engineering Dept.</p>
                <p className="text-xs text-gray-500">2 hours ago</p>
              </div>
            </div>
          </div>
          <div className="p-3 bg-gray-50 rounded">
            <div className="flex items-start">
              <span className="text-blue-500 mr-3">📈</span>
              <div>
                <p className="font-medium">Energy Milestone Achieved</p>
                <p className="text-sm text-gray-600">Campus reached 25% renewable energy</p>
                <p className="text-xs text-gray-500">1 day ago</p>
              </div>
            </div>
          </div>
          <div className="p-3 bg-gray-50 rounded">
            <div className="flex items-start">
              <span className="text-purple-500 mr-3">🚨</span>
              <div>
                <p className="font-medium">System Alert</p>
                <p className="text-sm text-gray-600">Database backup completed successfully</p>
                <p className="text-xs text-gray-500">2 days ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;