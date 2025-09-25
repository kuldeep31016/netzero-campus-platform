import React from 'react';

interface PerformantButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
}

const PerformantButton: React.FC<PerformantButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-2xl focus:outline-none focus:ring-2 focus:ring-offset-2 will-change-transform transition-transform duration-200 ease-out active:scale-95';
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 focus:ring-green-500 shadow-lg hover:shadow-xl',
    secondary: 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-900 hover:from-gray-200 hover:to-gray-300 focus:ring-gray-500 dark:from-gray-700 dark:to-gray-800 dark:text-gray-100 dark:hover:from-gray-600 dark:hover:to-gray-700',
    success: 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white hover:from-emerald-700 hover:to-emerald-800 focus:ring-emerald-500 shadow-lg hover:shadow-xl',
    danger: 'bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 focus:ring-red-500 shadow-lg hover:shadow-xl',
    outline: 'border-2 border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50 focus:ring-gray-500 dark:border-gray-600 dark:text-gray-300 dark:hover:border-gray-500 dark:hover:bg-gray-800'
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  return (
    <button
      className={combinedClasses}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <div className="animate-optimized-spin -ml-1 mr-3 h-5 w-5 border-2 border-white border-t-transparent rounded-full gpu-accelerated" />
      )}
      <span className={loading ? 'opacity-75' : ''}>{children}</span>
    </button>
  );
};

// Specialized button variants for common use cases
export const IconButton: React.FC<{
  icon: React.ReactNode;
  onClick?: () => void;
  className?: string;
  'aria-label'?: string;
}> = ({ icon, onClick, className = '', 'aria-label': ariaLabel }) => (
  <button
    onClick={onClick}
    className={`p-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 will-change-transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800 ${className}`}
    aria-label={ariaLabel}
  >
    {icon}
  </button>
);

export const FloatingActionButton: React.FC<{
  icon: React.ReactNode;
  onClick?: () => void;
  className?: string;
}> = ({ icon, onClick, className = '' }) => (
  <button
    onClick={onClick}
    className={`fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl shadow-2xl hover:shadow-3xl will-change-transform hover:scale-110 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 z-50 ${className}`}
  >
    {icon}
  </button>
);

export const PulseButton: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}> = ({ children, onClick, className = '' }) => (
  <button
    onClick={onClick}
    className={`relative inline-flex items-center px-6 py-3 text-base font-medium text-white bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl shadow-lg will-change-transform hover:scale-105 transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${className}`}
  >
    <span className="absolute inset-0 -z-10 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl animate-smooth-pulse opacity-75"></span>
    {children}
  </button>
);

export default PerformantButton;