import React, { useState } from 'react';

const Mobility: React.FC = () => {
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
          Mobility Tracking Coming Soon
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          This page will contain transportation tracking, carbon footprint from commuting, and sustainable transport options.
        </p>
      </div>
    </div>
  );
};

export default Mobility;