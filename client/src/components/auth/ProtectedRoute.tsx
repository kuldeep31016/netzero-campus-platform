import React, { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../services/firebase';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: 'admin' | 'faculty' | 'student';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole 
}) => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking auth state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center space-y-4">
          <div className="spinner w-12 h-12"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!currentUser) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // For now, we'll assume all authenticated users can access protected routes
  // In a full implementation, you would check custom claims or user roles
  // from your backend API or Firebase custom claims
  
  // TODO: Implement role-based access control
  // if (requiredRole && userRole !== requiredRole) {
  //   return <Navigate to="/unauthorized" replace />;
  // }

  return <>{children}</>;
};

export default ProtectedRoute;