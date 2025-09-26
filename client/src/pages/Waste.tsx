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
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { useAuth } from '../contexts/AuthContext';

// Define the waste data structure
interface WasteData {
  date: string;
  building: string;
  wasteKg: number;
  recyclableKg: number;
  nonRecyclableKg: number;
  segregationRate: number;
  co2Avoided: number;
}

// Define leaderboard data structure
interface LeaderboardEntry {
  id: number;
  name: string;
  recyclingRate: number;
  ranking: number;
}

// Custom tooltip component for the chart
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    // Find the waste, recyclable, and non-recyclable values from payload
    const wasteData = payload.find((p: any) => p.dataKey === 'wasteKg');
    const recyclableData = payload.find((p: any) => p.dataKey === 'recyclableKg');
    const nonRecyclableData = payload.find((p: any) => p.dataKey === 'nonRecyclableKg');
    const co2Data = payload.find((p: any) => p.dataKey === 'co2Avoided');
    
    return (
      <div className="bg-white dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
        <p className="font-medium text-gray-900 dark:text-gray-100">{`Date: ${label}`}</p>
        {wasteData && (
          <p className="text-gray-700 dark:text-gray-300">
            Total Waste: {wasteData.value.toFixed(1)} kg
          </p>
        )}
        {recyclableData && (
          <p className="text-green-600 dark:text-green-400">
            Recyclable: {recyclableData.value.toFixed(1)} kg
          </p>
        )}
        {nonRecyclableData && (
          <p className="text-red-600 dark:text-red-400">
            Non-Recyclable: {nonRecyclableData.value.toFixed(1)} kg
          </p>
        )}
        {co2Data && (
          <p className="text-blue-600 dark:text-blue-400">
            CO₂ Avoided: {co2Data.value.toFixed(1)} kg
          </p>
        )}
      </div>
    );
  }
  return null;
};

const Waste: React.FC = () => {
  const { userProfile } = useAuth();
  const [wasteData, setWasteData] = useState<WasteData[]>([]);
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

  // Waste reduction tips
  const wasteTips = [
    "Segregate waste at source → increases recycling by 40%",
    "Use reusable containers → reduces waste by 30% per student",
    "Compost organic waste → reduces landfill waste by 60%"
  ];

  // Colors for charts
  const COLORS = ['#ef4444', '#10b981', '#3b82f6'];

  // Generate mock data based on selected timeframe
  const generateMockData = useCallback((days: number, building: string): WasteData[] => {
    const data: WasteData[] = [];
    const today = new Date();
    
    // Check if we should show an alert (20% chance)
    const shouldShowAlert = Math.random() < 0.2;
    setShowAlert(shouldShowAlert);
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // Generate realistic mock data with variation
      const baseWaste = 100 + Math.random() * 200;
      const variation = Math.sin(i * 0.3) * 30;
      
      // Occasionally spike waste to trigger alerts
      const wasteKg = shouldShowAlert && i === 0 
        ? baseWaste + variation + 150 
        : baseWaste + variation;
      
      const recyclableKg = wasteKg * (0.3 + Math.random() * 0.4);
      const nonRecyclableKg = wasteKg - recyclableKg;
      const segregationRate = (recyclableKg / wasteKg) * 100;
      // CO2 avoided from recycling (approx. 0.5 kg CO2 per kg of recycled waste)
      const co2Avoided = recyclableKg * 0.5;
      
      data.push({
        date: date.toISOString().split('T')[0],
        building: building,
        wasteKg: Math.max(0, wasteKg),
        recyclableKg: Math.max(0, recyclableKg),
        nonRecyclableKg: Math.max(0, nonRecyclableKg),
        segregationRate: Math.max(0, Math.min(100, segregationRate)),
        co2Avoided: Math.max(0, co2Avoided)
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
      recyclingRate: 40 + Math.random() * 60,
      ranking: index + 1
    })).sort((a, b) => b.recyclingRate - a.recyclingRate)
      .map((entry, index) => ({
        ...entry,
        ranking: index + 1
      }));
  }, []);

  // Fetch waste data based on filters
  const fetchWasteData = useCallback(async () => {
    setLoading(true);
    try {
      // Determine number of days based on timeframe
      let days = 7;
      if (selectedTimeframe === '30d') days = 30;
      
      // Generate mock data
      const mockData = generateMockData(days, selectedBuilding);
      setWasteData(mockData);
      
      // Generate leaderboard data
      const leaderboard = generateLeaderboardData();
      setLeaderboardData(leaderboard);
    } catch (error) {
      console.error('Error fetching waste data:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedBuilding, selectedTimeframe, generateMockData, generateLeaderboardData]);

  useEffect(() => {
    fetchWasteData();
  }, [fetchWasteData]);

  // Calculate summary statistics
  const calculateTotalWaste = () => {
    return wasteData.reduce((sum, item) => sum + item.wasteKg, 0);
  };

  const calculateRecyclingRate = () => {
    if (wasteData.length === 0) return 0;
    const totalWaste = wasteData.reduce((sum, item) => sum + item.wasteKg, 0);
    const totalRecyclable = wasteData.reduce((sum, item) => sum + item.recyclableKg, 0);
    return totalWaste > 0 ? (totalRecyclable / totalWaste) * 100 : 0;
  };

  const calculateCO2Avoided = () => {
    return wasteData.reduce((sum, item) => sum + item.co2Avoided, 0);
  };

  const calculateWasteReductionScore = () => {
    const recyclingRate = calculateRecyclingRate();
    // Simple waste reduction score based on recycling rate
    return Math.min(100, Math.max(0, recyclingRate * 1.5));
  };

  // Format data for the chart
  const chartData = wasteData.map(item => ({
    date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    wasteKg: item.wasteKg,
    recyclableKg: item.recyclableKg,
    nonRecyclableKg: item.nonRecyclableKg,
    co2Avoided: item.co2Avoided
  }));

  // Prepare data for pie chart
  const pieData = wasteData.length > 0 ? [
    { name: 'Recyclable', value: wasteData.reduce((sum, item) => sum + item.recyclableKg, 0) },
    { name: 'Non-Recyclable', value: wasteData.reduce((sum, item) => sum + item.nonRecyclableKg, 0) }
  ] : [];

  // Calculate waste equivalence (trees saved)
  const calculateWasteEquivalence = () => {
    const co2Avoided = calculateCO2Avoided();
    // Assume one tree absorbs about 22 kg of CO2 per year
    const treesSaved = co2Avoided / 22;
    return treesSaved.toFixed(1);
  };

  // Find user's ranking
  const getUserRanking = () => {
    // For demo purposes, assume "Engineering" is the user's department
    const userEntry = leaderboardData.find(entry => entry.name === "Engineering");
    return userEntry ? userEntry.ranking : 0;
  };

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Waste Management Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Track waste generation, recycling rates, and reduction goals
        </p>
      </div>

      {/* Alert */}
      {showAlert && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
          <p className="font-bold">Waste Alert!</p>
          <p>Waste generation crossed the limit today. Consider reducing usage.</p>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="rounded-full bg-gray-100 p-3">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Waste Generated</p>
              <p className="text-2xl font-semibold text-gray-900">
                {calculateTotalWaste().toFixed(0)} <span className="text-sm">kg</span>
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
              <p className="text-sm font-medium text-gray-600">Recycling Rate</p>
              <p className="text-2xl font-semibold text-gray-900">
                {calculateRecyclingRate().toFixed(1)} <span className="text-sm">%</span>
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="rounded-full bg-blue-100 p-3">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">CO₂ Avoided</p>
              <p className="text-2xl font-semibold text-gray-900">
                {calculateCO2Avoided().toFixed(0)} <span className="text-sm">kg</span>
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
              <p className="text-sm font-medium text-gray-600">Waste Reduction Score</p>
              <p className="text-2xl font-semibold text-gray-900">
                {calculateWasteReductionScore().toFixed(0)} <span className="text-sm">/100</span>
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
            className="w-full input text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500"
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
            className="w-full input text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500"
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
            Waste Generation Trends
          </h3>
          
          {loading ? (
            <div className="h-64 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-500"></div>
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
                    tickFormatter={(value) => `${value} kg`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar
                    dataKey="wasteKg"
                    name="Total Waste"
                    fill="#6b7280"
                    stackId="a"
                  />
                  <Bar
                    dataKey="recyclableKg"
                    name="Recyclable Waste"
                    fill="#10b981"
                    stackId="a"
                  />
                  <Bar
                    dataKey="nonRecyclableKg"
                    name="Non-Recyclable Waste"
                    fill="#ef4444"
                    stackId="a"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-gray-400 dark:text-gray-500 mb-2">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">No data available</h3>
              <p className="text-gray-500 dark:text-gray-400 text-center max-w-md">
                There is no waste data for the selected filters. Try changing the building or date range.
              </p>
            </div>
          )}
        </div>

        {/* Waste Composition Pie Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Waste Composition
          </h3>
          {loading ? (
            <div className="h-64 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-500"></div>
            </div>
          ) : pieData.length > 0 && pieData[0].value + pieData[1].value > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} kg`, 'Weight']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-gray-400 dark:text-gray-500 mb-2">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">No data available</h3>
              <p className="text-gray-500 dark:text-gray-400 text-center max-w-md">
                There is no waste composition data for the selected filters.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Leaderboard and Waste Tips */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Leaderboard */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Recycling Leaderboard
          </h3>
          {getUserRanking() > 0 && (
            <div className="bg-green-50 rounded-lg p-3 mb-4 text-center">
              <p className="text-green-800 font-medium">
                You are ranked <span className="font-bold">#{getUserRanking()}</span> in recycling this week!
              </p>
            </div>
          )}
          <div className="space-y-3">
            {leaderboardData.slice(0, 5).map((entry) => (
              <div 
                key={entry.id} 
                className={`flex items-center justify-between p-3 rounded-lg ${
                  entry.name === "Engineering" 
                    ? "bg-green-100 border border-green-300" 
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
                  {entry.recyclingRate.toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Waste Reduction Tips */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            AI Waste Reduction Tips
          </h3>
          <div className="space-y-4">
            {wasteTips.map((tip, index) => (
              <div key={index} className="flex items-start p-3 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0 mt-1">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

export default Waste;