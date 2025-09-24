import React, { useState } from 'react';

const Admin: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Admin Panel
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage users, monitor system-wide metrics, and configure settings
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-md flex items-center justify-center">
                <span className="text-blue-600 dark:text-blue-400 text-lg">👥</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Users</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">1,247</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-md flex items-center justify-center">
                <span className="text-green-600 dark:text-green-400 text-lg">🏢</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Buildings</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">8</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900 rounded-md flex items-center justify-center">
                <span className="text-yellow-600 dark:text-yellow-400 text-lg">⚡</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Energy Sensors</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">24</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-md flex items-center justify-center">
                <span className="text-purple-600 dark:text-purple-400 text-lg">🎯</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Goals</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">12</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card p-8 text-center">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Admin Dashboard Coming Soon
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          This page will contain user management, system configuration, reports generation, and advanced analytics.
        </p>
      </div>
    </div>
  );
};

export default Admin;