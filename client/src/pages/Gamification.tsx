import React, { useState } from 'react';

const Gamification: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Sustainability Challenges
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Participate in challenges, earn badges, and compete for sustainability
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Current Challenges
          </h3>
          <div className="space-y-3">
            <div className="p-3 bg-green-50 dark:bg-green-900 rounded-lg">
              <h4 className="font-medium text-green-800 dark:text-green-200">Energy Saver Challenge</h4>
              <p className="text-sm text-green-600 dark:text-green-300">Reduce energy consumption by 20%</p>
              <div className="mt-2 bg-green-200 dark:bg-green-800 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '65%' }}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Your Badges
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl">🌟</span>
              </div>
              <p className="text-xs mt-1 text-gray-600 dark:text-gray-400">Energy Star</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Gamification;