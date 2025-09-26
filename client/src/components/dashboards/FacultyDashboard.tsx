import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const FacultyDashboard: React.FC = () => {
  const { userProfile } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome, Prof. {userProfile?.fullName}!
        </h1>
        <p className="text-gray-600">Faculty Portal - {userProfile?.department}</p>
        <p className="text-sm text-gray-500">Employee ID: {userProfile?.employeeId}</p>
      </div>

      {/* Faculty-specific dashboard content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Department Energy Usage */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Dept. Energy Usage</p>
              <p className="text-2xl font-bold text-gray-900">1,245 kWh</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <span className="text-2xl">⚡</span>
            </div>
          </div>
          <p className="text-sm text-blue-600 mt-2">↓ 15% from last month</p>
        </div>

        {/* Student Participation */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Student Participation</p>
              <p className="text-2xl font-bold text-gray-900">87%</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <span className="text-2xl">👥</span>
            </div>
          </div>
          <p className="text-sm text-green-600 mt-2">↑ 23% this semester</p>
        </div>

        {/* Research Projects */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Projects</p>
              <p className="text-2xl font-bold text-gray-900">12</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <span className="text-2xl">🔬</span>
            </div>
          </div>
          <p className="text-sm text-purple-600 mt-2">3 new this month</p>
        </div>

        {/* Mobility Card */}
        <div 
          className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500 cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => navigate('/faculty-mobility')}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Mobility Dashboard</p>
              <p className="text-2xl font-bold text-gray-900">Transport</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <span className="text-2xl">🚗</span>
            </div>
          </div>
          <p className="text-sm text-orange-600 mt-2">View department data</p>
        </div>
      </div>

      {/* Faculty Tools */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Faculty Tools</h2>
          <div className="space-y-3">
            <button className="w-full text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
              <div className="flex items-center">
                <span className="text-blue-500 mr-3 text-xl">📊</span>
                <div>
                  <p className="font-medium">View Student Progress</p>
                  <p className="text-sm text-gray-600">Track individual student sustainability scores</p>
                </div>
              </div>
            </button>
            <button className="w-full text-left p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
              <div className="flex items-center">
                <span className="text-green-500 mr-3 text-xl">📝</span>
                <div>
                  <p className="font-medium">Create Challenges</p>
                  <p className="text-sm text-gray-600">Design sustainability challenges for students</p>
                </div>
              </div>
            </button>
            <button className="w-full text-left p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
              <div className="flex items-center">
                <span className="text-purple-500 mr-3 text-xl">🔬</span>
                <div>
                  <p className="font-medium">Research Dashboard</p>
                  <p className="text-sm text-gray-600">Access sustainability research tools</p>
                </div>
              </div>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Department Updates</h2>
          <div className="space-y-3">
            <div className="p-3 bg-gray-50 rounded">
              <div className="flex items-start">
                <span className="text-green-500 mr-3">✅</span>
                <div>
                  <p className="font-medium">Solar Panel Installation Complete</p>
                  <p className="text-sm text-gray-600">Engineering building now 40% solar powered</p>
                  <p className="text-xs text-gray-500">2 days ago</p>
                </div>
              </div>
            </div>
            <div className="p-3 bg-gray-50 rounded">
              <div className="flex items-start">
                <span className="text-blue-500 mr-3">📢</span>
                <div>
                  <p className="font-medium">New Sustainability Workshop</p>
                  <p className="text-sm text-gray-600">Registration open for faculty training</p>
                  <p className="text-xs text-gray-500">1 week ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyDashboard;