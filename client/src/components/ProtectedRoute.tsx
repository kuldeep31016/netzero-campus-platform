import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../services/firebase';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole | UserRole[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { user, userProfile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-optimized-spin rounded-full h-32 w-32 border-b-2 border-green-500 gpu-accelerated"></div>
      </div>
    );
  }

  if (!user || !userProfile) {
    return <Navigate to="/login" replace />;
  }

  // Check if requiredRole is an array or a single role
  if (requiredRole) {
    if (Array.isArray(requiredRole)) {
      // If it's an array, check if user's role is in the array
      if (!requiredRole.includes(userProfile.role)) {
        return <Navigate to="/dashboard" replace />;
      }
    } else {
      // If it's a single role, check if it matches user's role
      if (userProfile.role !== requiredRole) {
        return <Navigate to="/dashboard" replace />;
      }
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;