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

// Define data structures
interface TripData {
  date: string;
  car: number;
  cycle: number;
  ev: number;
  bus: number;
  walking: number;
}

interface PeakHourData {
  hour: string;
  trips: number;
}

interface EVStation {
  id: string;
  location: string;
  status: 'available' | 'occupied' | 'maintenance';
  usageToday: number;
}

interface VehicleData {
  id: string;
  type: string;
  fuelType: string;
  usage: number;
  co2Emission: number;
}

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
        <p className="font-medium text-gray-900 dark:text-gray-100">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const AdminMobility: React.FC = () => {
  const { userProfile } = useAuth();
  const [tripData, setTripData] = useState<TripData[]>([]);
  const [peakHourData, setPeakHourData] = useState<PeakHourData[]>([]);
  const [evStations, setEvStations] = useState<EVStation[]>([]);
  const [vehicleData, setVehicleData] = useState<VehicleData[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('7d');
  const [exportData, setExportData] = useState<any[]>([]);

  // Colors for charts
  const COLORS = ['#ef4444', '#10b981', '#3b82f6', '#f59e0b', '#8b5cf6'];

  // Generate mock trip data
  const generateTripData = useCallback((days: number): TripData[] => {
    const data: TripData[] = [];
    const today = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // Generate realistic mock data with variation
      const baseTrips = 500 + Math.random() * 500;
      const variation = Math.sin(i * 0.5) * 100;
      
      const totalTrips = Math.max(0, baseTrips + variation);
      
      data.push({
        date: date.toISOString().split('T')[0],
        car: totalTrips * (0.4 + Math.random() * 0.1),
        cycle: totalTrips * (0.15 + Math.random() * 0.1),
        ev: totalTrips * (0.05 + Math.random() * 0.05),
        bus: totalTrips * (0.2 + Math.random() * 0.1),
        walking: totalTrips * (0.2 + Math.random() * 0.1)
      });
    }
    
    return data;
  }, []);

  // Generate mock peak hour data
  const generatePeakHourData = useCallback((): PeakHourData[] => {
    const hours = ['6AM', '7AM', '8AM', '9AM', '10AM', '11AM', '12PM', '1PM', '2PM', '3PM', '4PM', '5PM', '6PM', '7PM', '8PM'];
    return hours.map(hour => ({
      hour,
      trips: 200 + Math.random() * 300 + (hour === '8AM' || hour === '5PM' ? 200 : 0)
    }));
  }, []);

  // Generate mock EV stations data
  const generateEVStations = useCallback((): EVStation[] => {
    const locations = [
      'Main Parking Lot',
      'Engineering Building',
      'Science Block',
      'Library',
      'Sports Complex',
      'Student Dormitory'
    ];
    
    return locations.map((location, index) => ({
      id: `ev-${index + 1}`,
      location,
      status: ['available', 'occupied', 'maintenance'][Math.floor(Math.random() * 3)] as 'available' | 'occupied' | 'maintenance',
      usageToday: Math.floor(Math.random() * 50)
    }));
  }, []);

  // Generate mock vehicle data
  const generateVehicleData = useCallback((): VehicleData[] => {
    const types = ['Campus Shuttle', 'Maintenance Truck', 'Delivery Van', 'Security Patrol', 'Admin Vehicle'];
    const fuelTypes = ['Gasoline', 'Diesel', 'Hybrid', 'Electric'];
    
    return types.map((type, index) => ({
      id: `vehicle-${index + 1}`,
      type,
      fuelType: fuelTypes[Math.floor(Math.random() * fuelTypes.length)],
      usage: 50 + Math.random() * 150,
      co2Emission: 20 + Math.random() * 80
    }));
  }, []);

  // Fetch data
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Determine number of days based on timeframe
      let days = 7;
      if (timeframe === '30d') days = 30;
      
      // Generate mock data
      const trips = generateTripData(days);
      const peaks = generatePeakHourData();
      const stations = generateEVStations();
      const vehicles = generateVehicleData();
      
      setTripData(trips);
      setPeakHourData(peaks);
      setEvStations(stations);
      setVehicleData(vehicles);
      
      // Prepare export data
      const exportTrips = trips.map(trip => ({
        date: trip.date,
        car: trip.car,
        cycle: trip.cycle,
        ev: trip.ev,
        bus: trip.bus,
        walking: trip.walking,
        total: trip.car + trip.cycle + trip.ev + trip.bus + trip.walking
      }));
      
      setExportData(exportTrips);
    } catch (error) {
      console.error('Error fetching mobility data:', error);
    } finally {
      setLoading(false);
    }
  }, [timeframe, generateTripData, generatePeakHourData, generateEVStations, generateVehicleData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Calculate KPIs
  const calculateTotalTrips = () => {
    return tripData.reduce((sum, day) => sum + day.car + day.cycle + day.ev + day.bus + day.walking, 0);
  };

  const calculateSustainablePercentage = () => {
    if (tripData.length === 0) return 0;
    
    const totalTrips = tripData.reduce((sum, day) => sum + day.car + day.cycle + day.ev + day.bus + day.walking, 0);
    const sustainableTrips = tripData.reduce((sum, day) => sum + day.cycle + day.ev + day.bus + day.walking, 0);
    
    return totalTrips > 0 ? (sustainableTrips / totalTrips) * 100 : 0;
  };

  const calculateCO2Emissions = () => {
    // Simplified calculation: assume car trips emit 0.2 kg CO2 each
    const carTrips = tripData.reduce((sum, day) => sum + day.car, 0);
    return carTrips * 0.2; // kg CO2
  };

  const calculateParkingUsage = () => {
    // Simplified calculation: assume 80% of car trips use parking
    const carTrips = tripData.reduce((sum, day) => sum + day.car, 0);
    return carTrips * 0.8;
  };

  const calculateCO2Savings = () => {
    // Simplified calculation: assume sustainable trips save 0.15 kg CO2 each compared to car trips
    const sustainableTrips = tripData.reduce((sum, day) => sum + day.cycle + day.ev + day.bus + day.walking, 0);
    return sustainableTrips * 0.15; // kg CO2 saved
  };

  // Format data for charts
  const modeShareData = tripData.map(day => ({
    date: new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    car: day.car,
    cycle: day.cycle,
    ev: day.ev,
    bus: day.bus,
    walking: day.walking
  }));

  // Prepare data for mode share pie chart
  const modeSharePieData = tripData.length > 0 ? [
    { name: 'Car', value: tripData.reduce((sum, day) => sum + day.car, 0) },
    { name: 'Cycle', value: tripData.reduce((sum, day) => sum + day.cycle, 0) },
    { name: 'EV', value: tripData.reduce((sum, day) => sum + day.ev, 0) },
    { name: 'Bus', value: tripData.reduce((sum, day) => sum + day.bus, 0) },
    { name: 'Walking', value: tripData.reduce((sum, day) => sum + day.walking, 0) }
  ] : [];

  // Export to JSON
  const exportToJSON = () => {
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'mobility-data.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  // If user is not admin, don't render the dashboard
  if (userProfile?.role !== 'admin') {
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
            Monitor campus transportation and sustainability metrics
          </p>
        </div>
        
        {/* Export Controls */}
        <div className="flex gap-2 mt-4 sm:mt-0">
          <button 
            onClick={exportToJSON}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            Export JSON
          </button>
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

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="rounded-full bg-blue-100 p-3">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Campus Trips</p>
              <p className="text-2xl font-semibold text-gray-900">
                {calculateTotalTrips().toFixed(0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="rounded-full bg-green-100 p-3">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">% Sustainable Transport</p>
              <p className="text-2xl font-semibold text-gray-900">
                {calculateSustainablePercentage().toFixed(1)} <span className="text-sm">%</span>
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="rounded-full bg-red-100 p-3">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Transport CO₂ Emissions</p>
              <p className="text-2xl font-semibold text-gray-900">
                {calculateCO2Emissions().toFixed(0)} <span className="text-sm">kg</span>
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="rounded-full bg-purple-100 p-3">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Parking Lot Usage</p>
              <p className="text-2xl font-semibold text-gray-900">
                {calculateParkingUsage().toFixed(0)} <span className="text-sm">spaces</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mode Share Trends */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Mode Share Trends
          </h3>
          
          {loading ? (
            <div className="h-64 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : modeShareData.length > 0 ? (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={modeShareData}
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
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="car" name="Car" fill="#ef4444" stackId="a" />
                  <Bar dataKey="cycle" name="Cycle" fill="#10b981" stackId="a" />
                  <Bar dataKey="ev" name="EV" fill="#3b82f6" stackId="a" />
                  <Bar dataKey="bus" name="Bus" fill="#f59e0b" stackId="a" />
                  <Bar dataKey="walking" name="Walking" fill="#8b5cf6" stackId="a" />
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
                There is no mobility data for the selected timeframe.
              </p>
            </div>
          )}
        </div>

        {/* Peak Travel Times */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Peak Travel Times
          </h3>
          
          {loading ? (
            <div className="h-64 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : peakHourData.length > 0 ? (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={peakHourData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" strokeOpacity={0.5} />
                  <XAxis 
                    dataKey="hour" 
                    stroke="#666" 
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    stroke="#666" 
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="trips" 
                    name="Trips" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-gray-400 dark:text-gray-500 mb-2">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">No data available</h3>
              <p className="text-gray-500 dark:text-gray-400 text-center max-w-md">
                There is no peak travel time data available.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* CO2 Savings and Mode Share Pie Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CO2 Savings */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            CO₂ Savings from Sustainable Initiatives
          </h3>
          
          <div className="flex flex-col items-center justify-center h-64">
            <div className="text-5xl font-bold text-green-600 mb-2">
              {calculateCO2Savings().toFixed(0)} <span className="text-2xl">kg</span>
            </div>
            <p className="text-gray-600 text-center">
              CO₂ saved by choosing sustainable transport options
            </p>
            <div className="mt-4 flex justify-center">
              <svg className="w-16 h-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Mode Share Pie Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Transport Mode Share
          </h3>
          
          {loading ? (
            <div className="h-64 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : modeSharePieData.length > 0 && modeSharePieData.some(item => item.value > 0) ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={modeSharePieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {modeSharePieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} trips`, 'Trips']} />
                  <Legend />
                </PieChart>
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
                There is no mode share data available.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* EV Charging Stations */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          EV Charging Stations
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {evStations.map(station => (
            <div key={station.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <h4 className="font-medium text-gray-900">{station.location}</h4>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  station.status === 'available' ? 'bg-green-100 text-green-800' :
                  station.status === 'occupied' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {station.status.charAt(0).toUpperCase() + station.status.slice(1)}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-2">Usage today: {station.usageToday} sessions</p>
              
              <div className="mt-3 flex gap-2">
                <button className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded hover:bg-blue-200">
                  View Details
                </button>
                <button className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded hover:bg-gray-200">
                  Manage
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Campus Vehicle Fuel Usage */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Campus Vehicle Fuel Usage
        </h3>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fuel Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usage (L)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CO₂ Emission (kg)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {vehicleData.map(vehicle => (
                <tr key={vehicle.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{vehicle.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vehicle.fuelType}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vehicle.usage.toFixed(1)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vehicle.co2Emission.toFixed(1)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button className="text-blue-600 hover:text-blue-900">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminMobility;