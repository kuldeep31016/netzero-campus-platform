import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

const StudentDashboard: React.FC = () => {
  const { userProfile } = useAuth();

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome, {userProfile?.fullName}!
        </h1>
        <p className="text-gray-600">Student Portal - {userProfile?.department}</p>
        <p className="text-sm text-gray-500">Student ID: {userProfile?.studentId}</p>
      </div>

      {/* Student-specific dashboard content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
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

        {/* Sustainability Score */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Sustainability Score</p>
              <p className="text-2xl font-bold text-gray-900">85/100</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <span className="text-2xl">🌱</span>
            </div>
          </div>
          <p className="text-sm text-purple-600 mt-2">↑ 5 points this week</p>
        </div>
      </div>

      {/* Student Activities */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Your Recent Activities</h2>
        <div className="space-y-3">
          <div className="flex items-center p-3 bg-gray-50 rounded">
            <span className="text-green-500 mr-3">🎯</span>
            <div>
              <p className="font-medium">Completed Energy Conservation Challenge</p>
              <p className="text-sm text-gray-600">Earned 50 points</p>
            </div>
          </div>
          <div className="flex items-center p-3 bg-gray-50 rounded">
            <span className="text-blue-500 mr-3">♻️</span>
            <div>
              <p className="font-medium">Participated in Waste Reduction Workshop</p>
              <p className="text-sm text-gray-600">2 days ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;