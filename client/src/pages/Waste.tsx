import React, { useState } from 'react';

const Waste: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Waste Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track waste generation, recycling rates, and reduction goals
          </p>
        </div>
      </div>
      
      <div className="card p-8 text-center">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Waste Tracking Coming Soon
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          This page will contain waste generation tracking, recycling metrics, and sustainability goals.
        </p>
      </div>
    </div>
  );
};

export default Waste;