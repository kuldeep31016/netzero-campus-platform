import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const StudentDashboard: React.FC = () => {
  const { userProfile } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome, {userProfile?.fullName}!
        </h1>
        <p className="text-gray-600">Student Portal - {userProfile?.department}</p>
        <p className="text-sm text-gray-500">Student ID: {userProfile?.studentId}</p>
      </div>

      {/* Resource Usage Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Energy Consumption Card */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Your Energy Usage</p>
              <p className="text-2xl font-bold text-gray-900">24.5 kWh</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <span className="text-2xl">⚡</span>
            </div>
          </div>
          <p className="text-sm text-green-600 mt-2">↓ 12% from last month</p>
        </div>

        {/* Water Usage Card */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Your Water Usage</p>
              <p className="text-2xl font-bold text-gray-900">156 L</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <span className="text-2xl">💧</span>
            </div>
          </div>
          <p className="text-sm text-blue-600 mt-2">↓ 8% from last month</p>
        </div>

        {/* Waste Card */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Waste Segregated</p>
              <p className="text-2xl font-bold text-gray-900">85%</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <span className="text-2xl">♻️</span>
            </div>
          </div>
          <p className="text-sm text-yellow-600 mt-2">↑ 5% from last week</p>
        </div>

        {/* Mobility Card */}
        <div 
          className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500 cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => navigate('/student-mobility')}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Mobility Tracker</p>
              <p className="text-2xl font-bold text-gray-900">Track Commute</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <span className="text-2xl">🚴</span>
            </div>
          </div>
          <p className="text-sm text-orange-600 mt-2">View your impact</p>
        </div>
      </div>

      {/* Resource Usage Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Energy Usage Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Energy Usage Trend</h2>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <div className="text-5xl mb-4">⚡</div>
              <p className="text-gray-600">Energy usage chart would appear here</p>
            </div>
          </div>
        </div>

        {/* Water Usage Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Water Usage Trend</h2>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <div className="text-5xl mb-4">💧</div>
              <p className="text-gray-600">Water usage chart would appear here</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Your Recent Activity</h2>
        <div className="space-y-3">
          <div className="flex items-center p-3 bg-gray-50 rounded">
            <span className="text-green-500 mr-3">✅</span>
            <div>
              <p className="font-medium">Completed Energy Conservation Challenge</p>
              <p className="text-sm text-gray-600">2 days ago</p>
            </div>
          </div>
          <div className="flex items-center p-3 bg-gray-50 rounded">
            <span className="text-blue-500 mr-3">♻️</span>
            <div>
              <p className="font-medium">Participated in Waste Reduction Workshop</p>
              <p className="text-sm text-gray-600">1 week ago</p>
            </div>
          </div>
          <div className="flex items-center p-3 bg-gray-50 rounded">
            <span className="text-orange-500 mr-3">🚴</span>
            <div>
              <p className="font-medium">Logged 3 cycling trips this week</p>
              <p className="text-sm text-gray-600">3 days ago</p>
            </div>
          </div>
        </div>
        <div className="mt-4 text-center">
          <button 
            onClick={() => navigate('/gamification')}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
          >
            View All Gamification Features
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;