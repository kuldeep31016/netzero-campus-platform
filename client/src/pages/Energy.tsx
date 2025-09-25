import React, { useState, useEffect, useCallback } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
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
interface EnergyData {
  date: string;
  building: string;
  electricity: number;
  renewable: number;
  co2: number;
}

// Define leaderboard data structure
interface LeaderboardEntry {
  id: number;
  name: string;
  efficiency: number;
  ranking: number;
}

// Custom tooltip component for the chart
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    // Find the electricity, renewable, and co2 values from payload
    const electricityData = payload.find((p: any) => p.dataKey === 'electricity');
    const renewableData = payload.find((p: any) => p.dataKey === 'renewable');
    const co2Data = payload.find((p: any) => p.dataKey === 'co2');
    
    return (
      <div className="bg-white dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
        <p className="font-medium text-gray-900 dark:text-gray-100">{`Date: ${label}`}</p>
        {electricityData && (
          <p className="text-blue-600 dark:text-blue-400">
            Electricity: {electricityData.value.toFixed(1)} kWh
          </p>
        )}
        {renewableData && (
          <p className="text-green-600 dark:text-green-400">
            Renewable: {renewableData.value.toFixed(1)} kWh
          </p>
        )}
        {co2Data && (
          <p className="text-red-600 dark:text-red-400">
            CO₂: {co2Data.value.toFixed(1)} kg
          </p>
        )}
      </div>
    );
  }
  return null;
};

const Energy: React.FC = () => {
  const { userProfile } = useAuth();
  const navigate = useNavigate();
  const [energyData, setEnergyData] = useState<EnergyData[]>([]);
  const [selectedBuilding, setSelectedBuilding] = useState('Main Building');
  const [selectedTimeframe, setSelectedTimeframe] = useState('7d');
  const [loading, setLoading] = useState(false);
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [showAlert, setShowAlert] = useState(false);

  // Building options
  const buildings = [
    'Main Building',
    'Hostel Block',
    'Engineering Block',
    'Science Block',
    'Library',
    'Cafeteria'
  ];

  // Timeframe options
  const timeframes = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' }
  ];

  // Eco-tips
  const ecoTips = [
    "Switch off lab equipment after 7 PM → save 12 kWh/day",
    "Using natural light reduces hostel electricity by 15%.",
    "Unplug chargers when not in use → save 0.5 kWh/day per charger"
  ];

  // Generate mock data based on selected timeframe
  const generateMockData = useCallback((days: number, building: string): EnergyData[] => {
    const data: EnergyData[] = [];
    const today = new Date();
    
    // Check if we should show an alert (20% chance)
    const shouldShowAlert = Math.random() < 0.2;
    setShowAlert(shouldShowAlert);
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // Generate realistic mock data with variation
      const baseElectricity = 800 + Math.random() * 400;
      const variation = Math.sin(i * 0.3) * 100;
      
      // Occasionally spike usage to trigger alerts
      const electricity = shouldShowAlert && i === 0 
        ? baseElectricity + variation + 300 
        : baseElectricity + variation;
      
      data.push({
        date: date.toISOString().split('T')[0],
        building: building,
        electricity: electricity,
        renewable: 150 + Math.random() * 250,
        co2: 200 + Math.random() * 150
      });
    }
    
    return data;
  }, []);

  // Generate mock leaderboard data
  const generateLeaderboardData = useCallback((): LeaderboardEntry[] => {
    const departments = [
      "Engineering",
      "Science",
      "Arts",
      "Business",
      "Medicine",
      "Law",
      "Hostel A",
      "Hostel B",
      "Hostel C",
      "Hostel D"
    ];
    
    return departments.map((dept, index) => ({
      id: index + 1,
      name: dept,
      efficiency: 70 + Math.random() * 30,
      ranking: index + 1
    })).sort((a, b) => b.efficiency - a.efficiency)
      .map((entry, index) => ({
        ...entry,
        ranking: index + 1
      }));
  }, []);

  // Fetch energy data based on filters
  const fetchEnergyData = useCallback(async () => {
    setLoading(true);
    try {
      // Determine number of days based on timeframe
      let days = 7;
      if (selectedTimeframe === '30d') days = 30;
      
      // Generate mock data
      const mockData = generateMockData(days, selectedBuilding);
      setEnergyData(mockData);
      
      // Generate leaderboard data
      const leaderboard = generateLeaderboardData();
      setLeaderboardData(leaderboard);
    } catch (error) {
      console.error('Error fetching energy data:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedBuilding, selectedTimeframe, generateMockData, generateLeaderboardData]);

  // Redirect admin users to admin energy dashboard
  useEffect(() => {
    if (userProfile?.role === 'admin') {
      navigate('/admin/energy');
    }
  }, [userProfile, navigate]);

  useEffect(() => {
    if (userProfile?.role !== 'admin') {
      fetchEnergyData();
    }
  }, [fetchEnergyData, userProfile]);

  // Calculate summary statistics
  const calculateTotalEnergyUsage = () => {
    return energyData.reduce((sum, item) => sum + item.electricity, 0);
  };

  const calculateRenewablePercentage = () => {
    if (energyData.length === 0) return 0;
    const totalEnergy = energyData.reduce((sum, item) => sum + item.electricity, 0);
    const totalRenewable = energyData.reduce((sum, item) => sum + item.renewable, 0);
    return totalEnergy > 0 ? (totalRenewable / totalEnergy) * 100 : 0;
  };

  const calculateTotalCO2 = () => {
    return energyData.reduce((sum, item) => sum + item.co2, 0);
  };

  const calculateEfficiencyScore = () => {
    const renewablePercentage = calculateRenewablePercentage();
    // Simple efficiency score based on renewable percentage
    return Math.min(100, Math.max(0, renewablePercentage * 1.2));
  };

  // Format data for the chart
  const chartData = energyData.map(item => ({
    date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    electricity: item.electricity,
    renewable: item.renewable,
    co2: item.co2
  }));

  // Calculate CO2 equivalence (trees needed to absorb CO2)
  const calculateCO2Equivalence = () => {
    const totalCO2 = calculateTotalCO2();
    // Assume one tree absorbs about 22 kg of CO2 per year
    const treesNeeded = totalCO2 / 22;
    return treesNeeded.toFixed(1);
  };

  // Find user's ranking
  const getUserRanking = () => {
    // For demo purposes, assume "Engineering" is the user's department
    const userEntry = leaderboardData.find(entry => entry.name === "Engineering");
    return userEntry ? userEntry.ranking : 0;
  };

  // If user is admin, don't render the student dashboard
  if (userProfile?.role === 'admin') {
    return null;
  }

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Energy Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Monitor and manage energy consumption across campus
        </p>
      </div>

      {/* Alert */}
      {showAlert && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
          <p className="font-bold">Energy Alert!</p>
          <p>Energy consumption crossed the limit today. Consider reducing usage.</p>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="rounded-full bg-blue-100 p-3">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Energy Usage</p>
              <p className="text-2xl font-semibold text-gray-900">
                {calculateTotalEnergyUsage().toFixed(0)} <span className="text-sm">kWh</span>
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="rounded-full bg-green-100 p-3">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">% from Renewable</p>
              <p className="text-2xl font-semibold text-gray-900">
                {calculateRenewablePercentage().toFixed(1)} <span className="text-sm">%</span>
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="rounded-full bg-red-100 p-3">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">CO₂ Emissions</p>
              <p className="text-2xl font-semibold text-gray-900">
                {calculateTotalCO2().toFixed(0)} <span className="text-sm">kg</span>
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="rounded-full bg-purple-100 p-3">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Efficiency Score</p>
              <p className="text-2xl font-semibold text-gray-900">
                {calculateEfficiencyScore().toFixed(0)} <span className="text-sm">/100</span>
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
            className="w-full input text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
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
            className="w-full input text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
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
            Energy Consumption Trends
          </h3>
          
          {loading ? (
            <div className="h-64 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
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
                    tickFormatter={(value) => `${value} kWh`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar
                    dataKey="electricity"
                    name="Electricity Usage"
                    fill="#3b82f6"
                    stackId="a"
                  />
                  <Bar
                    dataKey="renewable"
                    name="Renewable Energy"
                    fill="#10b981"
                    stackId="a"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-gray-400 dark:text-gray-500 mb-2">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">No data available</h3>
              <p className="text-gray-500 dark:text-gray-400 text-center max-w-md">
                There is no energy consumption data for the selected filters. Try changing the building or date range.
              </p>
            </div>
          )}
        </div>

        {/* Carbon Impact Widget */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Carbon Impact
          </h3>
          <div className="flex flex-col items-center justify-center h-full">
            <div className="text-5xl font-bold text-green-600 mb-2">
              {calculateCO2Equivalence()}
            </div>
            <p className="text-gray-600 text-center">
              trees needed to absorb this week's CO₂ emissions
            </p>
            <div className="mt-4 flex justify-center">
              <svg className="w-16 h-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Leaderboard and Eco-Tips */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Leaderboard */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Energy Efficiency Leaderboard
          </h3>
          {getUserRanking() > 0 && (
            <div className="bg-blue-50 rounded-lg p-3 mb-4 text-center">
              <p className="text-blue-800 font-medium">
                You are ranked <span className="font-bold">#{getUserRanking()}</span> this week!
              </p>
            </div>
          )}
          <div className="space-y-3">
            {leaderboardData.slice(0, 5).map((entry) => (
              <div 
                key={entry.id} 
                className={`flex items-center justify-between p-3 rounded-lg ${
                  entry.name === "Engineering" 
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
                <span className="font-semibold text-green-600">
                  {entry.efficiency.toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Eco-Tips */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            AI Eco-Tips
          </h3>
          <div className="space-y-4">
            {ecoTips.map((tip, index) => (
              <div key={index} className="flex items-start p-3 bg-green-50 rounded-lg">
                <div className="flex-shrink-0 mt-1">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

export default Energy;