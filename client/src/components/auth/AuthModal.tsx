import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser, loginUser, UserRole, RegisterData } from '../../services/firebase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultRole?: UserRole;
  hideRoleSelection?: boolean;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, defaultRole = 'student', hideRoleSelection = false }) => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true); // Start with login mode
  const [selectedRole, setSelectedRole] = useState<UserRole>(defaultRole);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    department: '',
    studentId: '',
    employeeId: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  // Update selectedRole when defaultRole changes
  useEffect(() => {
    setSelectedRole(defaultRole);
  }, [defaultRole]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const userProfile = await loginUser(formData.email, formData.password);
        
        // Check if user's role matches the selected portal
        if (hideRoleSelection && userProfile.role !== selectedRole) {
          throw new Error(`This account is registered as ${userProfile.role.toUpperCase()}. Please use the ${userProfile.role.charAt(0).toUpperCase() + userProfile.role.slice(1)} Portal instead.`);
        }
        
        onClose();
        navigate('/dashboard');
      } else {
        // Registration validation
        if (formData.password !== formData.confirmPassword) {
          throw new Error('Passwords do not match');
        }
        if (selectedRole === 'student' && !formData.studentId) {
          throw new Error('Student ID is required');
        }
        if ((selectedRole === 'faculty' || selectedRole === 'admin') && !formData.employeeId) {
          throw new Error(`${selectedRole === 'faculty' ? 'Employee ID' : 'Admin ID'} is required`);
        }
        if (!formData.department) {
          throw new Error('Department is required');
        }
        if (!formData.fullName) {
          throw new Error('Full name is required');
        }

        const registerData: RegisterData = {
          email: formData.email,
          password: formData.password,
          fullName: formData.fullName,
          role: selectedRole,
          department: formData.department,
          ...(selectedRole === 'student' ? { studentId: formData.studentId } : { employeeId: formData.employeeId })
        };

        await registerUser(registerData);
        setRegistrationSuccess(true);
        setIsLogin(true); // Switch to login mode
        setFormData({
          email: formData.email, // Keep the email for convenience
          password: '',
          confirmPassword: '',
          fullName: '',
          department: '',
          studentId: '',
          employeeId: ''
        });
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      setError(err.message || 'An error occurred during authentication');
    } finally {
      setLoading(false);
    }
  };

  const getRoleInfo = (role: UserRole) => {
    switch (role) {
      case 'student':
        return {
          color: 'bg-green-600',
          hoverColor: 'hover:bg-green-700',
          bgColor: 'bg-green-50',
          textColor: 'text-green-600',
          borderColor: 'border-green-200'
        };
      case 'faculty':
        return {
          color: 'bg-blue-600',
          hoverColor: 'hover:bg-blue-700',
          bgColor: 'bg-blue-50',
          textColor: 'text-blue-600',
          borderColor: 'border-blue-200'
        };
      case 'admin':
        return {
          color: 'bg-purple-600',
          hoverColor: 'hover:bg-purple-700',
          bgColor: 'bg-purple-50',
          textColor: 'text-purple-600',
          borderColor: 'border-purple-200'
        };
    }
  };

  const roleInfo = getRoleInfo(selectedRole);
  const departments = [
    'Computer Science', 'Electrical Engineering', 'Mechanical Engineering',
    'Civil Engineering', 'Environmental Science', 'Business Administration',
    'Architecture', 'Management', 'Research & Development', 'Administration'
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-optimized flex items-center justify-center z-50 will-change-contents">
      <div className={`bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto ${roleInfo.bgColor} border-2 ${roleInfo.borderColor} will-change-transform animate-fade-in-up`}>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className={`text-2xl font-bold ${roleInfo.textColor}`}>
              {isLogin ? 'Sign In' : 'Register'} as {selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}
            </h2>
            {hideRoleSelection && (
              <p className="text-sm text-gray-600 mt-1">
                You are accessing the <span className={`font-semibold ${roleInfo.textColor}`}>
                  {selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)} Portal
                </span>
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Role Selection - Only show if not hidden */}
        {!isLogin && !hideRoleSelection && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Role</label>
            <div className="grid grid-cols-3 gap-2">
              {(['student', 'faculty', 'admin'] as UserRole[]).map((role) => {
                const info = getRoleInfo(role);
                return (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setSelectedRole(role)}
                    className={`p-2 rounded text-sm font-medium transition-colors ${
                      selectedRole === role
                        ? `${info.color} text-white`
                        : `border ${info.borderColor} ${info.textColor} hover:${info.bgColor}`
                    }`}
                  >
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {registrationSuccess && isLogin && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            🎉 Registration successful! Please sign in with your credentials.
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Full Name (Registration only) */}
          {!isLogin && (
            <div className="mb-4">
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required={!isLogin}
              />
            </div>
          )}

          {/* Email */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          {/* Password */}
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              required
              minLength={6}
            />
          </div>

          {/* Confirm Password (Registration only) */}
          {!isLogin && (
            <div className="mb-4">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required={!isLogin}
                minLength={6}
              />
            </div>
          )}

          {/* Department (Registration only) */}
          {!isLogin && (
            <div className="mb-4">
              <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
                Department
              </label>
              <select
                id="department"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required={!isLogin}
              >
                <option value="">Select Department</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
          )}

          {/* Student/Employee ID (Registration only) */}
          {!isLogin && (
            <div className="mb-4">
              <label 
                htmlFor={selectedRole === 'student' ? 'studentId' : 'employeeId'} 
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {selectedRole === 'student' ? 'Student ID' : selectedRole === 'faculty' ? 'Employee ID' : 'Admin ID'}
              </label>
              <input
                type="text"
                id={selectedRole === 'student' ? 'studentId' : 'employeeId'}
                value={selectedRole === 'student' ? formData.studentId : formData.employeeId}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  [selectedRole === 'student' ? 'studentId' : 'employeeId']: e.target.value 
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required={!isLogin}
              />
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 rounded-md text-white font-medium transition-colors ${
              loading ? 'bg-gray-400' : `${roleInfo.color} ${roleInfo.hoverColor}`
            }`}
          >
            {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Register')}
          </button>
        </form>

        {/* Toggle between Login and Register */}
        <div className="mt-4 text-center">
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
              setRegistrationSuccess(false);
              // Only reset form data when switching modes if we're not showing success message
              if (!registrationSuccess) {
                setFormData({
                  email: isLogin ? formData.email : '', // Keep email when switching to register
                  password: '',
                  confirmPassword: '',
                  fullName: '',
                  department: '',
                  studentId: '',
                  employeeId: ''
                });
              }
            }}
            className={`text-sm ${roleInfo.textColor} hover:underline`}
          >
            {isLogin ? "Don't have an account? Register" : "Already have an account? Sign In"}
          </button>
          
          {hideRoleSelection && isLogin && (
            <p className="text-xs text-gray-500 mt-2">
              Only {selectedRole} accounts can access this portal
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;