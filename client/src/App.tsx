import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import './styles/globals.css';
import './styles/animations.css';

// Import actual page components
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Energy from './pages/Energy';
import Water from './pages/Water';
import Waste from './pages/Waste';
import Mobility from './pages/Mobility';
import Gamification from './pages/Gamification';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import AdminWater from './pages/AdminWater';
import AdminWaste from './pages/AdminWaste';
import AdminDashboard from './components/dashboards/AdminDashboard';
import FacultyStaffEnergy from './pages/FacultyStaffEnergy';
import FacultyStaffWater from './pages/FacultyStaffWater';
import AdminMobility from './pages/AdminMobility';
import FacultyStaffWaste from './pages/FacultyStaffWaste';
import StudentMobility from './pages/StudentMobility';
import FacultyStaffMobility from './pages/FacultyStaffMobility';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Landing />} />
              <Route path="/" element={<Landing />} />
              
              {/* Protected Routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </ProtectedRoute>
              } />
              
              <Route path="/energy" element={
                <ProtectedRoute>
                  <Layout>
                    <Energy />
                  </Layout>
                </ProtectedRoute>
              } />
              
              <Route path="/water" element={
                <ProtectedRoute>
                  <Layout>
                    <Water />
                  </Layout>
                </ProtectedRoute>
              } />
              
              <Route path="/waste" element={
                <ProtectedRoute>
                  <Layout>
                    <Waste />
                  </Layout>
                </ProtectedRoute>
              } />
              
              <Route path="/mobility" element={
                <ProtectedRoute>
                  <Layout>
                    <Mobility />
                  </Layout>
                </ProtectedRoute>
              } />
              
              <Route path="/student-mobility" element={
                <ProtectedRoute requiredRole="student">
                  <Layout>
                    <StudentMobility />
                  </Layout>
                </ProtectedRoute>
              } />
              
              <Route path="/gamification" element={
                <ProtectedRoute>
                  <Layout>
                    <Gamification />
                  </Layout>
                </ProtectedRoute>
              } />
              
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Layout>
                    <Profile />
                  </Layout>
                </ProtectedRoute>
              } />
              
              {/* Faculty Routes */}
              <Route path="/faculty-energy" element={
                <ProtectedRoute requiredRole="faculty">
                  <Layout>
                    <FacultyStaffEnergy />
                  </Layout>
                </ProtectedRoute>
              } />
              
              <Route path="/faculty-water" element={
                <ProtectedRoute requiredRole="faculty">
                  <Layout>
                    <FacultyStaffWater />
                  </Layout>
                </ProtectedRoute>
              } />
              
              <Route path="/faculty-waste" element={
                <ProtectedRoute requiredRole="faculty">
                  <Layout>
                    <FacultyStaffWaste />
                  </Layout>
                </ProtectedRoute>
              } />
              
              <Route path="/faculty-mobility" element={
                <ProtectedRoute requiredRole="faculty">
                  <Layout>
                    <FacultyStaffMobility />
                  </Layout>
                </ProtectedRoute>
              } />
              
              {/* Admin Routes */}
              <Route path="/admin" element={
                <ProtectedRoute requiredRole="admin">
                  <Layout>
                    <AdminDashboard />
                  </Layout>
                </ProtectedRoute>
              } />
              
              <Route path="/admin/energy" element={
                <ProtectedRoute requiredRole="admin">
                  <Layout>
                    <Admin />
                  </Layout>
                </ProtectedRoute>
              } />
              
              <Route path="/admin/water" element={
                <ProtectedRoute requiredRole="admin">
                  <Layout>
                    <AdminWater />
                  </Layout>
                </ProtectedRoute>
              } />
              
              <Route path="/admin/waste" element={
                <ProtectedRoute requiredRole="admin">
                  <Layout>
                    <AdminWaste />
                  </Layout>
                </ProtectedRoute>
              } />
              
              <Route path="/admin/mobility" element={
                <ProtectedRoute requiredRole="admin">
                  <Layout>
                    <AdminMobility />
                  </Layout>
                </ProtectedRoute>
              } />
              
              {/* Catch all route */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
            
            {/* Global Toast Notifications - Temporarily removed until react-hot-toast is imported */}
            {/*
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                className: 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white',
                success: {
                  iconTheme: {
                    primary: '#22c55e',
                    secondary: '#ffffff',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#ffffff',
                  },
                },
              }}
            />
            */}
          </div>
        </Router>
      </AuthProvider>
  );
}

export default App;