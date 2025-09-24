import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import StudentDashboard from '../components/dashboards/StudentDashboard';
import FacultyDashboard from '../components/dashboards/FacultyDashboard';
import AdminDashboard from '../components/dashboards/AdminDashboard';

const Dashboard: React.FC = () => {
  const { userProfile, loading: authLoading } = useAuth();
  
  // Show loading state while authentication is being checked
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  // Get the user's role from the authentication context
  const role = userProfile?.role || 'student';

  // Render the appropriate dashboard based on user role
  const renderDashboard = () => {
    switch (role) {
      case 'student':
        return <StudentDashboard />;
      case 'faculty':
        return <FacultyDashboard />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return <StudentDashboard />;
    }
  };

  return renderDashboard();
};

export default Dashboard;