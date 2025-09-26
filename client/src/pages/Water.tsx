import React, { useState, useEffect, useCallback } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

// Define the data structure according to requirements
interface WaterData {
  date: string;
  building: string;
  usageLiters: number;
  recycledLiters: number;
  efficiency: number;
}

// Define leaderboard data structure
interface LeaderboardEntry {
  id: number;
  name: string;
  conservation: number;
  ranking: number;
}

// Custom tooltip component for the chart
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    // Find the usage, recycled, and efficiency values from payload
    const usageData = payload.find((p: any) => p.dataKey === 'usageLiters');
    const recycledData = payload.find((p: any) => p.dataKey === 'recycledLiters');
    const efficiencyData = payload.find((p: any) => p.dataKey === 'efficiency');
    
    return (
      <div className="bg-white dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
        <p className="font-medium text-gray-900 dark:text-gray-100">{`Date: ${label}`}</p>
        {usageData && (
          <p className="text-blue-600 dark:text-blue-400">
            Usage: {usageData.value.toFixed(0)} liters
          </p>
        )}
        {recycledData && (
          <p className="text-cyan-600 dark:text-cyan-400">
            Recycled: {recycledData.value.toFixed(0)} liters
          </p>
        )}
        {efficiencyData && (
          <p className="text-teal-600 dark:text-teal-400">
            Efficiency: {efficiencyData.value.toFixed(1)}%
          </p>
        )}
      </div>
    );
  }
  return null;
};

const Water: React.FC = () => {
  const { userProfile } = useAuth();
  const navigate = useNavigate();
  const [waterData, setWaterData] = useState<WaterData[]>([]);
  const [selectedBuilding, setSelectedBuilding] = useState('Hostel Block A');
  const [selectedTimeframe, setSelectedTimeframe] = useState('7d');
  const [loading, setLoading] = useState(false);
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertBuilding, setAlertBuilding] = useState('');

  // Building options
  const buildings = [
    'Hostel Block A',
    'Hostel Block B',
    'Hostel Block C',
    'Cafeteria',
    'Labs',
    'Library',
    'Administration'
  ];

  // Timeframe options
  const timeframes = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' }
  ];

  // Water-saving tips
  const waterTips = [
    "Fixing a leaking tap saves 500 liters/month",
    "Shorter showers = 20% less water use",
    "Turn off tap while brushing → save 6 liters/minute"
  ];

  // Generate mock data based on selected timeframe
  const generateMockData = useCallback((days: number, building: string): WaterData[] => {
    const data: WaterData[] = [];
    const today = new Date();
    
    // Check if we should show an alert (15% chance)
    const shouldShowAlert = Math.random() < 0.15;
    if (shouldShowAlert) {
      setShowAlert(true);
      setAlertBuilding(building);
    } else {
      setShowAlert(false);
    }
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // Generate realistic mock data with variation
      const baseUsage = 1500 + Math.random() * 1000;
      const variation = Math.sin(i * 0.4) * 200;
      
      // Occasionally spike usage to trigger alerts
      const usageLiters = shouldShowAlert && i === 0 && building === 'Hostel Block C'
        ? baseUsage + variation + 1000 
        : baseUsage + variation;
      
      const recycledLiters = usageLiters * (0.2 + Math.random() * 0.3);
      const efficiency = (recycledLiters / usageLiters) * 100;
      
      data.push({
        date: date.toISOString().split('T')[0],
        building: building,
        usageLiters: Math.max(0, usageLiters),
        recycledLiters: Math.max(0, recycledLiters),
        efficiency: Math.max(0, Math.min(100, efficiency))
      });
    }
    
    return data;
  }, []);

  // Generate mock leaderboard data
  const generateLeaderboardData = useCallback((): LeaderboardEntry[] => {
    const departments = [
      "Hostel Block A",
      "Hostel Block B",
      "Hostel Block C",
      "Cafeteria",
      "Labs",
      "Library",
      "Administration",
      "Engineering",
      "Science",
      "Arts"
    ];
    
    return departments.map((dept, index) => ({
      id: index + 1,
      name: dept,
      conservation: 60 + Math.random() * 40,
      ranking: index + 1
    })).sort((a, b) => b.conservation - a.conservation)
      .map((entry, index) => ({
        ...entry,
        ranking: index + 1
      }));
  }, []);

  // Fetch water data based on filters
  const fetchWaterData = useCallback(async () => {
    setLoading(true);
    try {
      // Determine number of days based on timeframe
      let days = 7;
      if (selectedTimeframe === '30d') days = 30;
      
      // Generate mock data
      const mockData = generateMockData(days, selectedBuilding);
      setWaterData(mockData);
      
      // Generate leaderboard data
      const leaderboard = generateLeaderboardData();
      setLeaderboardData(leaderboard);
    } catch (error) {
      console.error('Error fetching water data:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedBuilding, selectedTimeframe, generateMockData, generateLeaderboardData]);

  // Redirect admin users to admin water dashboard
  useEffect(() => {
    if (userProfile?.role === 'admin') {
      // Removed redirect so admins can access student dashboard too
      // navigate('/admin/water');
    }
  }, [userProfile, navigate]);

  useEffect(() => {
    // Removed the condition so admins can also see the dashboard
    fetchWaterData();
  }, [fetchWaterData, userProfile]);

  // Calculate summary statistics
  const calculateTotalWaterUsage = () => {
    return waterData.reduce((sum, item) => sum + item.usageLiters, 0);
  };

  const calculateRecycledPercentage = () => {
    if (waterData.length === 0) return 0;
    const totalUsage = waterData.reduce((sum, item) => sum + item.usageLiters, 0);
    const totalRecycled = waterData.reduce((sum, item) => sum + item.recycledLiters, 0);
    return totalUsage > 0 ? (totalRecycled / totalUsage) * 100 : 0;
  };

  const calculatePerStudentUsage = () => {
    if (waterData.length === 0) return 0;
    const totalUsage = waterData.reduce((sum, item) => sum + item.usageLiters, 0);
    // Assume 100 students per building for calculation
    const studentCount = 100;
    const days = waterData.length;
    return days > 0 ? totalUsage / (studentCount * days) : 0;
  };

  const calculateWaterEfficiencyScore = () => {
    const recycledPercentage = calculateRecycledPercentage();
    // Simple efficiency score based on recycled percentage
    return Math.min(100, Math.max(0, recycledPercentage * 1.5));
  };

  // Format data for the chart
  const chartData = waterData.map(item => ({
    date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    usageLiters: item.usageLiters,
    recycledLiters: item.recycledLiters,
    efficiency: item.efficiency
  }));

  // Calculate water saved equivalence (bottles)
  const calculateWaterEquivalence = () => {
    const totalRecycled = waterData.reduce((sum, item) => sum + item.recycledLiters, 0);
    // Assume one bottle is 500ml (0.5 liters)
    const bottlesSaved = totalRecycled / 0.5;
    return bottlesSaved.toFixed(0);
  };

  // Find user's ranking
  const getUserRanking = () => {
    // For demo purposes, assume "Hostel Block A" is the user's building
    const userEntry = leaderboardData.find(entry => entry.name === "Hostel Block A");
    return userEntry ? userEntry.ranking : 0;
  };

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Water Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Monitor water consumption and conservation efforts
        </p>
      </div>

      {/* Alert */}
      {showAlert && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
          <p className="font-bold">Water Alert!</p>
          <p>Possible leakage in {alertBuilding}. Please check water systems.</p>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="rounded-full bg-blue-100 p-3">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4 4 0 003 15z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Water Usage</p>
              <p className="text-2xl font-semibold text-gray-900">
                {calculateTotalWaterUsage().toFixed(0)} <span className="text-sm">liters</span>
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="rounded-full bg-cyan-100 p-3">
              <svg className="w-6 h-6 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">% Recycled Water</p>
              <p className="text-2xl font-semibold text-gray-900">
                {calculateRecycledPercentage().toFixed(1)} <span className="text-sm">%</span>
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="rounded-full bg-teal-100 p-3">
              <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Per Student Usage</p>
              <p className="text-2xl font-semibold text-gray-900">
                {calculatePerStudentUsage().toFixed(0)} <span className="text-sm">liters/day</span>
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="rounded-full bg-indigo-100 p-3">
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Water Efficiency Score</p>
              <p className="text-2xl font-semibold text-gray-900">
                {calculateWaterEfficiencyScore().toFixed(0)} <span className="text-sm">/100</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Building
          </label>
          <select
            value={selectedBuilding}
            onChange={(e) => setSelectedBuilding(e.target.value)}
            className="w-full input text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {buildings.map(building => (
              <option key={building} value={building}>{building}</option>
            ))}
          </select>
        </div>
        
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Timeframe
          </label>
          <select
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value)}
            className="w-full input text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {timeframes.map(timeframe => (
              <option key={timeframe.value} value={timeframe.value}>{timeframe.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Water Consumption Trends
          </h3>
          
          {loading ? (
            <div className="h-64 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : chartData.length > 0 ? (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" strokeOpacity={0.5} />
                  <XAxis 
                    dataKey="date" 
                    stroke="#666" 
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    stroke="#666" 
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => `${value} L`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar
                    dataKey="usageLiters"
                    name="Water Usage"
                    fill="#3b82f6"
                    stackId="a"
                  />
                  <Bar
                    dataKey="recycledLiters"
                    name="Recycled Water"
                    fill="#06b6d4"
                    stackId="a"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-gray-400 dark:text-gray-500 mb-2">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4 4 0 003 15z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">No data available</h3>
              <p className="text-gray-500 dark:text-gray-400 text-center max-w-md">
                There is no water consumption data for the selected filters. Try changing the building or date range.
              </p>
            </div>
          )}
        </div>

        {/* Conservation Impact Widget */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Conservation Impact
          </h3>
          <div className="flex flex-col items-center justify-center h-full">
            <div className="text-5xl font-bold text-blue-600 mb-2">
              {calculateWaterEquivalence()}
            </div>
            <p className="text-gray-600 text-center">
              water bottles saved this week 💧
            </p>
            <div className="mt-4 flex justify-center">
              <svg className="w-16 h-16 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4 4 0 003 15z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Leaderboard and Water-Saving Tips */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Leaderboard */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Water Conservation Leaderboard
          </h3>
          {getUserRanking() > 0 && (
            <div className="bg-blue-50 rounded-lg p-3 mb-4 text-center">
              <p className="text-blue-800 font-medium">
                You are ranked <span className="font-bold">#{getUserRanking()}</span> in water efficiency this week!
              </p>
            </div>
          )}
          <div className="space-y-3">
            {leaderboardData.slice(0, 5).map((entry) => (
              <div 
                key={entry.id} 
                className={`flex items-center justify-between p-3 rounded-lg ${
                  entry.name === "Hostel Block A" 
                    ? "bg-blue-100 border border-blue-300" 
                    : "bg-gray-50"
                }`}
              >
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                    entry.ranking === 1 ? "bg-yellow-100 text-yellow-800" :
                    entry.ranking === 2 ? "bg-gray-200 text-gray-800" :
                    entry.ranking === 3 ? "bg-amber-100 text-amber-800" :
                    "bg-gray-100 text-gray-800"
                  }`}>
                    {entry.ranking}
                  </div>
                  <span className="font-medium">{entry.name}</span>
                </div>
                <span className="font-semibold text-blue-600">
                  {entry.conservation.toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Water-Saving Tips */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            AI Water-Saving Tips
          </h3>
          <div className="space-y-4">
            {waterTips.map((tip, index) => (
              <div key={index} className="flex items-start p-3 bg-blue-50 rounded-lg">
                <div className="flex-shrink-0 mt-1">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="ml-3 text-gray-700">{tip}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Water;