import React from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  // TODO: Add actual authentication check when Firebase is configured
  // For now, just render the children
  return <>{children}</>;
};

export default ProtectedRoute;