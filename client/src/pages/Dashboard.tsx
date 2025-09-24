import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

interface DashboardStats {
  energyConsumption: number;
  energySaved: number;
  waterUsage: number;
  waterSaved: number;
  wasteGenerated: number;
  wasteRecycled: number;
  carbonEmissions: number;
  carbonOffset: number;
}

interface ChartDataPoint {
  date: string;
  energy: number;
  water: number;
  waste: number;
  carbon: number;
}

type UserRole = 'student' | 'faculty' | 'admin';

const Dashboard: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const role = (searchParams.get('role') as UserRole) || 'student';
  // const { stats, chartData, loading, error } = useSelector((state: RootState) => state.dashboard);
  
  const [dateRange, setDateRange] = useState('7d');
  const [selectedMetric, setSelectedMetric] = useState('energy');
  const [loading, setLoading] = useState(false);
  
  // Mock user data
  const currentUser = { displayName: 'Demo User', email: 'demo@example.com' };
  
  // Mock stats data
  const stats = {
    energyConsumption: 1250.5,
    energySaved: 180.2,
    waterUsage: 850.0,
    waterSaved: 95.5,
    wasteGenerated: 45.8,
    wasteRecycled: 38.2,
    carbonEmissions: 425.3,
    carbonOffset: 67.8
  };

  useEffect(() => {
    fetchDashboardData();
  }, [dateRange]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Mock API call - replace with actual API calls
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Dashboard data fetched for date range:', dateRange);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard: React.FC<{
    title: string;
    value: number;
    unit: string;
    change: number;
    icon: string;
    color: string;
  }> = ({ title, value, unit, change, icon, color }) => (
    <div className="card p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {value.toLocaleString()} {unit}
          </p>
          <p className={`text-sm ${change >= 0 ? 'text-red-600' : 'text-green-600'} flex items-center mt-1`}>
            <span className="mr-1">
              {change >= 0 ? '↑' : '↓'}
            </span>
            {Math.abs(change)}% vs last period
          </p>
        </div>
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center bg-${color}-100 dark:bg-${color}-900`}>
          <span className="text-2xl">{icon}</span>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="spinner w-8 h-8"></div>
      </div>
    );
  }

  const getRoleInfo = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return {
          title: 'Admin Dashboard',
          subtitle: 'System-wide sustainability oversight',
          name: 'Admin User',
          email: 'admin@campus.edu',
          color: 'green'
        };
      case 'faculty':
        return {
          title: 'Faculty Dashboard',
          subtitle: 'Department and course sustainability management',
          name: 'Prof. Faculty',
          email: 'faculty@campus.edu',
          color: 'blue'
        };
      case 'student':
      default:
        return {
          title: 'Student Dashboard',
          subtitle: 'Personal sustainability tracking',
          name: 'Student User',
          email: 'student@campus.edu',
          color: 'emerald'
        };
    }
  };

  const roleInfo = getRoleInfo(role);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center space-x-3">
            <div className={`w-12 h-12 bg-gradient-to-r from-${roleInfo.color}-500 to-${roleInfo.color}-600 rounded-xl flex items-center justify-center`}>
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {role === 'admin' && (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                )}
                {role === 'faculty' && (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                )}
                {role === 'student' && (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                )}
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                {roleInfo.title}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {roleInfo.subtitle}
              </p>
            </div>
          </div>
          <div className="mt-3 flex items-center space-x-4 text-sm text-gray-500">
            <span className="flex items-center">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
              {roleInfo.name}
            </span>
            <span>{roleInfo.email}</span>
            <button 
              onClick={() => navigate('/')}
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Switch Portal
            </button>
          </div>
        </div>
        
        <div className="mt-4 sm:mt-0 flex items-center space-x-4">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="input text-sm"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          
          <button className="btn btn-primary btn-sm">
            Export Report
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Energy Consumption"
          value={stats?.energyConsumption || 0}
          unit="kWh"
          change={5.2}
          icon="⚡"
          color="yellow"
        />
        <StatCard
          title="Water Usage"
          value={stats?.waterUsage || 0}
          unit="L"
          change={-3.1}
          icon="💧"
          color="blue"
        />
        <StatCard
          title="Waste Generated"
          value={stats?.wasteGenerated || 0}
          unit="kg"
          change={-8.4}
          icon="🗑️"
          color="gray"
        />
        <StatCard
          title="Carbon Emissions"
          value={stats?.carbonEmissions || 0}
          unit="kg CO₂"
          change={-12.6}
          icon="🌱"
          color="green"
        />
      </div>

      {/* Chart Section */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Sustainability Trends
          </h2>
          <div className="flex items-center space-x-2">
            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              {[
                { key: 'energy', label: 'Energy', color: 'yellow' },
                { key: 'water', label: 'Water', color: 'blue' },
                { key: 'waste', label: 'Waste', color: 'gray' },
                { key: 'carbon', label: 'Carbon', color: 'green' }
              ].map((metric) => (
                <button
                  key={metric.key}
                  onClick={() => setSelectedMetric(metric.key)}
                  className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                    selectedMetric === metric.key
                      ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                  }`}
                >
                  {metric.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Chart placeholder - will be replaced with actual charts */}
        <div className="h-64 bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center justify-center">
          <p className="text-gray-500 dark:text-gray-400">
            Chart for {selectedMetric} will be rendered here
          </p>
        </div>
      </div>

      {/* Quick Actions & Goals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Quick Actions
          </h3>
          <div className="space-y-3">
            <button className="w-full text-left p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <div className="flex items-center">
                <span className="text-lg mr-3">📊</span>
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">Log Energy Reading</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Update your energy consumption data</p>
                </div>
              </div>
            </button>
            
            <button className="w-full text-left p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <div className="flex items-center">
                <span className="text-lg mr-3">🎯</span>
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">View Challenges</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Check active sustainability challenges</p>
                </div>
              </div>
            </button>
            
            <button className="w-full text-left p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <div className="flex items-center">
                <span className="text-lg mr-3">🤖</span>
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">Get AI Recommendations</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Personalized sustainability tips</p>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Goals Progress */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Monthly Goals
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Energy Reduction</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">78%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '78%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Water Conservation</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">92%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '92%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Waste Reduction</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">65%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '65%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;