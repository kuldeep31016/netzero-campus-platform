import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const StudentDashboard: React.FC = () => {
  const { userProfile } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {t('dashboard.welcome')}, {userProfile?.fullName}!
        </h1>
        <p className="text-gray-600">{t('dashboard.student_portal')} - {userProfile?.department}</p>
        <p className="text-sm text-gray-500">{t('dashboard.student_id')}: {userProfile?.studentId}</p>
      </div>

      {/* Resource Usage Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Energy Consumption Card */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{t('dashboard.energy_usage')}</p>
              <p className="text-2xl font-bold text-gray-900">24.5 {t('common.kwh_unit')}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <span className="text-2xl">⚡</span>
            </div>
          </div>
          <p className="text-sm text-green-600 mt-2">↓ 12% {t('common.days_ago')}</p>
        </div>

        {/* Water Usage Card */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{t('dashboard.water_usage')}</p>
              <p className="text-2xl font-bold text-gray-900">156 {t('common.liters_unit')}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <span className="text-2xl">💧</span>
            </div>
          </div>
          <p className="text-sm text-blue-600 mt-2">↓ 8% {t('common.days_ago')}</p>
        </div>

        {/* Waste Card */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{t('dashboard.waste_segregated')}</p>
              <p className="text-2xl font-bold text-gray-900">85{t('common.percent_unit')}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <span className="text-2xl">♻️</span>
            </div>
          </div>
          <p className="text-sm text-yellow-600 mt-2">↑ 5% {t('common.days_ago')}</p>
        </div>

        {/* Mobility Card */}
        <div 
          className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500 cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => navigate('/student-mobility')}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{t('dashboard.mobility_tracker')}</p>
              <p className="text-2xl font-bold text-gray-900">{t('dashboard.track_commute')}</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <span className="text-2xl">🚴</span>
            </div>
          </div>
          <p className="text-sm text-orange-600 mt-2">{t('dashboard.view_your_impact')}</p>
        </div>
      </div>

      {/* Resource Usage Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Energy Usage Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">{t('dashboard.energy_trend')}</h2>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <div className="text-5xl mb-4">⚡</div>
              <p className="text-gray-600">Energy usage chart would appear here</p>
            </div>
          </div>
        </div>

        {/* Water Usage Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">{t('dashboard.water_trend')}</h2>
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
        <h2 className="text-xl font-semibold mb-4">{t('dashboard.recent_activity')}</h2>
        <div className="space-y-3">
          <div className="flex items-center p-3 bg-gray-50 rounded">
            <span className="text-green-500 mr-3">✅</span>
            <div>
              <p className="font-medium">{t('dashboard.completed_energy_challenge')}</p>
              <p className="text-sm text-gray-600">2 {t('common.days_ago')}</p>
            </div>
          </div>
          <div className="flex items-center p-3 bg-gray-50 rounded">
            <span className="text-blue-500 mr-3">♻️</span>
            <div>
              <p className="font-medium">{t('dashboard.participated_waste_workshop')}</p>
              <p className="text-sm text-gray-600">1 {t('common.weeks_ago')}</p>
            </div>
          </div>
          <div className="flex items-center p-3 bg-gray-50 rounded">
            <span className="text-orange-500 mr-3">🚴</span>
            <div>
              <p className="font-medium">{t('dashboard.logged_cycling_trips')}</p>
              <p className="text-sm text-gray-600">3 {t('common.days_ago')}</p>
            </div>
          </div>
        </div>
        <div className="mt-4 text-center">
          <button 
            onClick={() => navigate('/gamification')}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
          >
            {t('dashboard.view_all_gamification')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;