import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Mobility: React.FC = () => {
  const { userProfile } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Mobility & Transportation
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Monitor campus transportation and promote sustainable mobility
          </p>
        </div>
      </div>
      
      <div className="card p-8 text-center">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Mobility Tracking
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Track your sustainable commute and environmental impact
        </p>
        
        {userProfile?.role === 'student' ? (
          <button
            onClick={() => navigate('/student-mobility')}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            Go to Your Personal Mobility Dashboard
          </button>
        ) : userProfile?.role === 'faculty' ? (
          <button
            onClick={() => navigate('/faculty-mobility')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Go to Department Mobility Dashboard
          </button>
        ) : userProfile?.role === 'admin' ? (
          <button
            onClick={() => navigate('/admin/mobility')}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
          >
            Go to Admin Mobility Dashboard
          </button>
        ) : (
          <p className="text-gray-600 dark:text-gray-400">
            Mobility tracking dashboards are available for students, faculty/staff, and admin members.
          </p>
        )}
      </div>
    </div>
  );
};

export default Mobility;