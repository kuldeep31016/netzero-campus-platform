import React from 'react';

interface SkeletonProps {
  className?: string;
  animate?: boolean;
  style?: React.CSSProperties;
}

const Skeleton: React.FC<SkeletonProps> = ({ className = '', animate = true, style }) => {
  return (
    <div
      className={`bg-gray-200 dark:bg-gray-700 rounded ${animate ? 'animate-shimmer' : ''} ${className}`}
      style={style}
    />
  );
};

// Skeleton components for different UI elements
export const CardSkeleton: React.FC = () => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg animate-shimmer">
    <div className="flex items-center mb-4">
      <Skeleton className="w-12 h-12 rounded-2xl mr-4" />
      <div className="flex-1">
        <Skeleton className="h-4 w-3/4 mb-2" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
    <div className="space-y-2">
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-5/6" />
      <Skeleton className="h-3 w-4/5" />
    </div>
  </div>
);

export const ChartSkeleton: React.FC = () => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg animate-shimmer">
    <Skeleton className="h-6 w-1/3 mb-6" />
    <div className="flex items-end justify-between h-48">
      {[...Array(7)].map((_, i) => (
        <Skeleton
          key={i}
          className="w-8 bg-gray-200 dark:bg-gray-700"
          style={{ height: `${Math.random() * 100 + 50}px` }}
        />
      ))}
    </div>
    <div className="flex justify-between mt-4">
      <Skeleton className="h-3 w-12" />
      <Skeleton className="h-3 w-12" />
      <Skeleton className="h-3 w-12" />
      <Skeleton className="h-3 w-12" />
    </div>
  </div>
);

export const StatCardSkeleton: React.FC = () => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg animate-shimmer">
    <div className="flex items-center justify-between mb-4">
      <Skeleton className="w-10 h-10 rounded-2xl" />
      <Skeleton className="w-16 h-6 rounded-full" />
    </div>
    <Skeleton className="h-8 w-20 mb-2" />
    <Skeleton className="h-4 w-full" />
  </div>
);

export const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg animate-shimmer">
    <Skeleton className="h-6 w-1/4 mb-6" />
    <div className="space-y-3">
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="flex space-x-4">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/4" />
        </div>
      ))}
    </div>
  </div>
);

export const ButtonSkeleton: React.FC = () => (
  <Skeleton className="h-10 w-24 rounded-lg animate-shimmer" />
);

export const HeaderSkeleton: React.FC = () => (
  <div className="mb-8 animate-shimmer">
    <Skeleton className="h-8 w-1/3 mb-3" />
    <Skeleton className="h-4 w-2/3" />
  </div>
);

export const DashboardSkeleton: React.FC = () => (
  <div className="p-6 space-y-6">
    <HeaderSkeleton />
    
    {/* Stats Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => (
        <StatCardSkeleton key={i} />
      ))}
    </div>

    {/* Charts Grid */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <ChartSkeleton />
      <ChartSkeleton />
    </div>

    {/* Table */}
    <TableSkeleton />
  </div>
);

export default Skeleton;