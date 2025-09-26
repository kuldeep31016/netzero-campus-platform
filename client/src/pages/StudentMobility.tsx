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

// Define the commute data structure
interface CommuteRecord {
  id: string;
  date: string;
  mode: 'walking' | 'cycling' | 'bus' | 'car' | 'ev';
  distance: number; // in km
  duration: number; // in minutes
  co2Saved: number; // in kg
}

// Define leaderboard entry structure
interface LeaderboardEntry {
  id: string;
  name: string;
  cyclingTrips: number;
  co2Saved: number;
  ranking: number;
}

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
        <p className="font-medium text-gray-900 dark:text-gray-100">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }}>
            {entry.name}: {typeof entry.value === 'number' ? entry.value.toFixed(2) : entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const StudentMobility: React.FC = () => {
  const { userProfile } = useAuth();
  const [commuteRecords, setCommuteRecords] = useState<CommuteRecord[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('7d');
  const [showCommuteForm, setShowCommuteForm] = useState(false);
  const [newCommute, setNewCommute] = useState({
    mode: 'walking' as 'walking' | 'cycling' | 'bus' | 'car' | 'ev',
    distance: 0,
    duration: 0
  });

  // Colors for charts
  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

  // Mode options
  const modeOptions = [
    { value: 'walking', label: 'Walking', icon: '🚶', color: 'bg-green-100 text-green-800' },
    { value: 'cycling', label: 'Cycling', icon: '🚴', color: 'bg-blue-100 text-blue-800' },
    { value: 'bus', label: 'Bus', icon: '🚌', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'car', label: 'Car', icon: '🚗', color: 'bg-red-100 text-red-800' },
    { value: 'ev', label: 'Electric Vehicle', icon: '⚡', color: 'bg-purple-100 text-purple-800' }
  ];

  // Eco-tips
  const ecoTips = [
    "Cycling 10km to campus saves ~2kg CO₂ compared to driving",
    "Taking the bus instead of driving reduces your carbon footprint by 75%",
    "Walking produces zero emissions and improves your health"
  ];

  // Calculate CO2 savings based on mode of transport
  const calculateCO2Savings = (mode: string, distance: number): number => {
    // CO2 emissions in kg per km
    const co2PerKm: Record<string, number> = {
      walking: 0,
      cycling: 0,
      bus: 0.05, // 50g per km
      car: 0.2,  // 200g per km
      ev: 0.08   // 80g per km (assuming grid electricity)
    };
    
    // Average car emits 0.2 kg CO2 per km
    const carEmission = distance * 0.2;
    const alternativeEmission = distance * (co2PerKm[mode] || 0);
    
    return Math.max(0, carEmission - alternativeEmission);
  };

  // Generate mock commute data
  const generateMockData = useCallback((): { records: CommuteRecord[], leaderboard: LeaderboardEntry[] } => {
    const records: CommuteRecord[] = [];
    const today = new Date();
    
    // Generate records for the past days
    const days = timeframe === '7d' ? 7 : 30;
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // Randomly select a mode of transport
      const modes: ('walking' | 'cycling' | 'bus' | 'car' | 'ev')[] = ['walking', 'cycling', 'bus', 'car', 'ev'];
      const mode = modes[Math.floor(Math.random() * modes.length)];
      
      // Generate realistic data
      const distance = 1 + Math.random() * 15; // 1-15 km
      const duration = distance * (mode === 'walking' ? 12 : mode === 'cycling' ? 4 : mode === 'bus' ? 8 : mode === 'car' ? 6 : 6);
      const co2Saved = calculateCO2Savings(mode, distance);
      
      records.push({
        id: `commute-${i + 1}`,
        date: date.toISOString().split('T')[0],
        mode,
        distance: parseFloat(distance.toFixed(2)),
        duration: parseFloat(duration.toFixed(0)),
        co2Saved: parseFloat(co2Saved.toFixed(2))
      });
    }
    
    // Generate mock leaderboard
    const leaderboard: LeaderboardEntry[] = [
      { id: '1', name: 'Alex Johnson', cyclingTrips: 15, co2Saved: 45.2, ranking: 1 },
      { id: '2', name: 'Taylor Smith', cyclingTrips: 12, co2Saved: 38.7, ranking: 2 },
      { id: '3', name: 'Jordan Williams', cyclingTrips: 10, co2Saved: 32.1, ranking: 3 },
      { id: '4', name: 'Casey Brown', cyclingTrips: 8, co2Saved: 28.5, ranking: 4 },
      { id: '5', name: 'Morgan Davis', cyclingTrips: 7, co2Saved: 25.3, ranking: 5 }
    ];
    
    return { records, leaderboard };
  }, [timeframe]);

  // Fetch data
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const { records, leaderboard } = generateMockData();
      setCommuteRecords(records);
      setLeaderboard(leaderboard);
    } catch (error) {
      console.error('Error fetching mobility data:', error);
    } finally {
      setLoading(false);
    }
  }, [generateMockData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Format data for charts
  const commuteData = commuteRecords.map(record => ({
    date: new Date(record.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    distance: record.distance,
    duration: record.duration,
    co2Saved: record.co2Saved
  }));

  // Prepare data for mode distribution pie chart
  const modeDistribution = modeOptions.map(mode => {
    const count = commuteRecords.filter(record => record.mode === mode.value).length;
    return {
      name: mode.label,
      value: count
    };
  }).filter(item => item.value > 0);

  // Calculate summary statistics
  const calculateTotalTrips = () => {
    return commuteRecords.length;
  };

  const calculateTotalDistance = () => {
    return commuteRecords.reduce((sum, record) => sum + record.distance, 0);
  };

  const calculateTotalCO2Saved = () => {
    return commuteRecords.reduce((sum, record) => sum + record.co2Saved, 0);
  };

  const calculateCyclingTrips = () => {
    return commuteRecords.filter(record => record.mode === 'cycling').length;
  };

  // Calculate impact metrics
  const calculateTreesEquivalent = () => {
    const co2Saved = calculateTotalCO2Saved();
    // Assume one tree absorbs about 22 kg of CO2 per year
    return co2Saved / 22;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const today = new Date().toISOString().split('T')[0];
    const co2Saved = calculateCO2Savings(newCommute.mode, newCommute.distance);
    
    const newCommuteRecord: CommuteRecord = {
      id: `commute-${Date.now()}`,
      date: today,
      mode: newCommute.mode,
      distance: newCommute.distance,
      duration: newCommute.duration,
      co2Saved: parseFloat(co2Saved.toFixed(2))
    };
    
    setCommuteRecords(prev => [newCommuteRecord, ...prev]);
    setShowCommuteForm(false);
    setNewCommute({
      mode: 'walking',
      distance: 0,
      duration: 0
    });
  };

  // If user is not student, don't render the dashboard
  if (userProfile?.role !== 'student') {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Access Denied</h2>
          <p className="text-gray-600 dark:text-gray-400">You do not have permission to view this dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Mobility Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track your sustainable commute and environmental impact
          </p>
        </div>
        
        <button 
          onClick={() => setShowCommuteForm(true)}
          className="mt-4 sm:mt-0 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
        >
          Log Today's Commute
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="rounded-full bg-blue-100 p-3">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Trips</p>
              <p className="text-2xl font-semibold text-gray-900">
                {calculateTotalTrips()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="rounded-full bg-green-100 p-3">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Distance Traveled</p>
              <p className="text-2xl font-semibold text-gray-900">
                {calculateTotalDistance().toFixed(1)} <span className="text-sm">km</span>
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="rounded-full bg-red-100 p-3">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">CO₂ Saved</p>
              <p className="text-2xl font-semibold text-gray-900">
                {calculateTotalCO2Saved().toFixed(1)} <span className="text-sm">kg</span>
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="rounded-full bg-purple-100 p-3">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Cycling Trips</p>
              <p className="text-2xl font-semibold text-gray-900">
                {calculateCyclingTrips()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Timeframe
          </label>
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="w-full input text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
          </select>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Commute Summary */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Commute Summary
          </h3>
          
          {loading ? (
            <div className="h-64 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : commuteData.length > 0 ? (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={commuteData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="distance" name="Distance (km)" fill="#3b82f6" />
                  <Bar dataKey="duration" name="Duration (min)" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">
              No commute data available
            </div>
          )}
        </div>

        {/* CO2 Savings */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            CO₂ Savings Over Time
          </h3>
          
          {loading ? (
            <div className="h-64 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : commuteData.length > 0 ? (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={commuteData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="co2Saved" 
                    name="CO₂ Saved (kg)" 
                    stroke="#ef4444" 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">
              No CO₂ savings data available
            </div>
          )}
        </div>

        {/* Mode Distribution */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Mode Distribution
          </h3>
          
          {loading ? (
            <div className="h-64 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : modeDistribution.length > 0 ? (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={modeDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {modeDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">
              No mode distribution data available
            </div>
          )}
        </div>

        {/* Impact Widget */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Your Environmental Impact
          </h3>
          
          <div className="flex flex-col items-center justify-center h-full py-8">
            <div className="text-center">
              <div className="text-5xl mb-4">🚴</div>
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-2">
                Your cycling this week
              </p>
              <div className="text-2xl font-bold text-green-600 mb-4">
                = avoided {calculateTotalCO2Saved().toFixed(1)}kg CO₂
              </div>
              <div className="text-lg text-gray-700 dark:text-gray-300">
                = planting {calculateTreesEquivalent().toFixed(1)} trees
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Leaderboard and Eco-tips */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Leaderboard */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Cycling Leaderboard - This Month
          </h3>
          
          <div className="space-y-4">
            {leaderboard.map((entry) => (
              <div 
                key={entry.id} 
                className={`flex items-center p-4 rounded-lg border ${
                  entry.id === '1' ? 'border-yellow-200 bg-yellow-50' : 
                  entry.id === '2' ? 'border-gray-200 bg-gray-50' : 
                  entry.id === '3' ? 'border-amber-200 bg-amber-50' : 
                  'border-gray-100'
                }`}
              >
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  entry.ranking === 1 ? 'bg-yellow-500 text-white' :
                  entry.ranking === 2 ? 'bg-gray-400 text-white' :
                  entry.ranking === 3 ? 'bg-amber-600 text-white' :
                  'bg-gray-200 text-gray-700'
                }`}>
                  {entry.ranking}
                </div>
                <div className="ml-4 flex-grow">
                  <h4 className="font-medium text-gray-900 dark:text-gray-100">{entry.name}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {entry.cyclingTrips} trips • {entry.co2Saved.toFixed(1)}kg CO₂ saved
                  </p>
                </div>
                <div className="text-lg">
                  {entry.ranking === 1 ? '🥇' : entry.ranking === 2 ? '🥈' : entry.ranking === 3 ? '🥉' : '🏅'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Eco-tips */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Eco-Tips for Sustainable Commuting
          </h3>
          
          <div className="space-y-4">
            {ecoTips.map((tip, index) => (
              <div key={index} className="flex items-start p-4 bg-green-50 rounded-lg border border-green-100">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <p className="ml-3 text-gray-700 dark:text-gray-300">{tip}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Log Commute Modal */}
      {showCommuteForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-900">Log Today's Commute</h3>
                <button 
                  onClick={() => setShowCommuteForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mode of Transport
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {modeOptions.map((mode) => (
                        <button
                          key={mode.value}
                          type="button"
                          onClick={() => setNewCommute({...newCommute, mode: mode.value as any})}
                          className={`p-3 rounded-lg border text-center ${
                            newCommute.mode === mode.value
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          <div className="text-2xl mb-1">{mode.icon}</div>
                          <div className="text-sm font-medium">{mode.label}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Distance (km)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      value={newCommute.distance || ''}
                      onChange={(e) => setNewCommute({...newCommute, distance: parseFloat(e.target.value) || 0})}
                      className="w-full input text-sm bg-white border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Duration (minutes)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={newCommute.duration || ''}
                      onChange={(e) => setNewCommute({...newCommute, duration: parseInt(e.target.value) || 0})}
                      className="w-full input text-sm bg-white border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowCommuteForm(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    Save Commute
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentMobility;
