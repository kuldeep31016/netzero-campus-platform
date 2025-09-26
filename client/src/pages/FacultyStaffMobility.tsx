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
interface CommuteLog {
  id: string;
  date: string;
  employeeName: string;
  department: string;
  mode: 'car' | 'bus' | 'walking' | 'cycle' | 'ev';
  distance: number; // in km
  duration: number; // in minutes
}

interface EVChargingLog {
  id: string;
  date: string;
  employeeName: string;
  department: string;
  station: string;
  duration: number; // in minutes
  energyConsumed: number; // in kWh
}

interface VehicleServiceRecord {
  id: string;
  vehicleId: string;
  date: string;
  serviceType: string;
  cost: number;
  notes: string;
}

interface FuelUsageRecord {
  id: string;
  vehicleId: string;
  date: string;
  fuelType: string;
  quantity: number; // in liters
  cost: number;
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

const FacultyStaffMobility: React.FC = () => {
  const { userProfile } = useAuth();
  const [commuteLogs, setCommuteLogs] = useState<CommuteLog[]>([]);
  const [evChargingLogs, setEvChargingLogs] = useState<EVChargingLog[]>([]);
  const [vehicleServiceRecords, setVehicleServiceRecords] = useState<VehicleServiceRecord[]>([]);
  const [fuelUsageRecords, setFuelUsageRecords] = useState<FuelUsageRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('7d');

  // Colors for charts
  const COLORS = ['#ef4444', '#f59e0b', '#10b981', '#8b5cf6', '#3b82f6'];

  // Generate mock commute logs
  const generateCommuteLogs = useCallback((days: number): CommuteLog[] => {
    const logs: CommuteLog[] = [];
    const today = new Date();
    const employeeNames = ['John Smith', 'Emily Johnson', 'Michael Brown', 'Sarah Davis', 'David Wilson'];
    const modes: ('car' | 'bus' | 'walking' | 'cycle' | 'ev')[] = ['car', 'bus', 'walking', 'cycle', 'ev'];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // Generate 3-8 logs per day
      const logsPerDay = 3 + Math.floor(Math.random() * 6);
      
      for (let j = 0; j < logsPerDay; j++) {
        const mode = modes[Math.floor(Math.random() * modes.length)];
        const distance = 1 + Math.random() * 20; // 1-20 km
        const duration = distance * (mode === 'walking' ? 12 : mode === 'cycle' ? 4 : mode === 'bus' ? 8 : mode === 'car' ? 6 : 6);
        
        logs.push({
          id: `commute-${i}-${j}`,
          date: date.toISOString().split('T')[0],
          employeeName: employeeNames[Math.floor(Math.random() * employeeNames.length)],
          department: userProfile?.department || 'Unknown Department',
          mode,
          distance: parseFloat(distance.toFixed(2)),
          duration: parseFloat(duration.toFixed(0))
        });
      }
    }
    
    return logs;
  }, [userProfile?.department]);

  // Generate mock EV charging logs
  const generateEVChargingLogs = useCallback((days: number): EVChargingLog[] => {
    const logs: EVChargingLog[] = [];
    const today = new Date();
    const employeeNames = ['John Smith', 'Emily Johnson', 'Michael Brown', 'Sarah Davis', 'David Wilson'];
    const stations = ['Main Parking', 'Science Building', 'Library', 'Engineering Block'];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // Generate 0-3 logs per day (not everyone charges EV)
      const logsPerDay = Math.floor(Math.random() * 4);
      
      for (let j = 0; j < logsPerDay; j++) {
        const duration = 30 + Math.random() * 90; // 30-120 minutes
        const energyConsumed = duration * 0.1; // 0.1 kWh per minute
        
        logs.push({
          id: `ev-${i}-${j}`,
          date: date.toISOString().split('T')[0],
          employeeName: employeeNames[Math.floor(Math.random() * employeeNames.length)],
          department: userProfile?.department || 'Unknown Department',
          station: stations[Math.floor(Math.random() * stations.length)],
          duration: parseFloat(duration.toFixed(0)),
          energyConsumed: parseFloat(energyConsumed.toFixed(2))
        });
      }
    }
    
    return logs;
  }, [userProfile?.department]);

  // Generate mock vehicle service records
  const generateVehicleServiceRecords = useCallback((): VehicleServiceRecord[] => {
    const records: VehicleServiceRecord[] = [];
    const vehicleIds = ['VH-001', 'VH-002', 'VH-003', 'VH-004'];
    const serviceTypes = ['Oil Change', 'Tire Rotation', 'Brake Inspection', 'Engine Tune-up', 'Battery Replacement'];
    const today = new Date();
    
    // Generate 5-10 service records
    const recordCount = 5 + Math.floor(Math.random() * 6);
    
    for (let i = 0; i < recordCount; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - Math.floor(Math.random() * 30)); // Within last 30 days
      
      records.push({
        id: `service-${i}`,
        vehicleId: vehicleIds[Math.floor(Math.random() * vehicleIds.length)],
        date: date.toISOString().split('T')[0],
        serviceType: serviceTypes[Math.floor(Math.random() * serviceTypes.length)],
        cost: 50 + Math.random() * 300, // $50-$350
        notes: 'Routine maintenance'
      });
    }
    
    return records;
  }, []);

  // Generate mock fuel usage records
  const generateFuelUsageRecords = useCallback((): FuelUsageRecord[] => {
    const records: FuelUsageRecord[] = [];
    const vehicleIds = ['VH-001', 'VH-002', 'VH-003', 'VH-004'];
    const fuelTypes = ['Gasoline', 'Diesel', 'Hybrid'];
    const today = new Date();
    
    // Generate 8-15 fuel usage records
    const recordCount = 8 + Math.floor(Math.random() * 8);
    
    for (let i = 0; i < recordCount; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - Math.floor(Math.random() * 30)); // Within last 30 days
      
      const quantity = 20 + Math.random() * 80; // 20-100 liters
      const cost = quantity * (2 + Math.random() * 2); // $2-4 per liter
      
      records.push({
        id: `fuel-${i}`,
        vehicleId: vehicleIds[Math.floor(Math.random() * vehicleIds.length)],
        date: date.toISOString().split('T')[0],
        fuelType: fuelTypes[Math.floor(Math.random() * fuelTypes.length)],
        quantity: parseFloat(quantity.toFixed(2)),
        cost: parseFloat(cost.toFixed(2))
      });
    }
    
    return records;
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
      const commutes = generateCommuteLogs(days);
      const evLogs = generateEVChargingLogs(days);
      const serviceRecords = generateVehicleServiceRecords();
      const fuelRecords = generateFuelUsageRecords();
      
      setCommuteLogs(commutes);
      setEvChargingLogs(evLogs);
      setVehicleServiceRecords(serviceRecords);
      setFuelUsageRecords(fuelRecords);
    } catch (error) {
      console.error('Error fetching mobility data:', error);
    } finally {
      setLoading(false);
    }
  }, [timeframe, generateCommuteLogs, generateEVChargingLogs, generateVehicleServiceRecords, generateFuelUsageRecords]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Format data for charts
  const commuteTrendData = commuteLogs.map(log => ({
    date: new Date(log.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    distance: log.distance,
    duration: log.duration
  }));

  // Prepare data for mode distribution pie chart
  const modeDistribution = [
    { name: 'Car', value: commuteLogs.filter(log => log.mode === 'car').length },
    { name: 'Bus', value: commuteLogs.filter(log => log.mode === 'bus').length },
    { name: 'Walking', value: commuteLogs.filter(log => log.mode === 'walking').length },
    { name: 'Cycle', value: commuteLogs.filter(log => log.mode === 'cycle').length },
    { name: 'EV', value: commuteLogs.filter(log => log.mode === 'ev').length }
  ].filter(item => item.value > 0);

  // Calculate KPIs
  const calculateTotalCommutes = () => {
    return commuteLogs.length;
  };

  const calculateAvgDistance = () => {
    if (commuteLogs.length === 0) return 0;
    const totalDistance = commuteLogs.reduce((sum, log) => sum + log.distance, 0);
    return totalDistance / commuteLogs.length;
  };

  const calculateEVUsage = () => {
    const evLogs = evChargingLogs.length;
    const totalCommutes = commuteLogs.length;
    return totalCommutes > 0 ? (evLogs / totalCommutes) * 100 : 0;
  };

  const calculateTotalFuelCost = () => {
    return fuelUsageRecords.reduce((sum, record) => sum + record.cost, 0);
  };

  // Filter data by department
  const departmentCommuteLogs = commuteLogs.filter(log => log.department === userProfile?.department);
  const departmentEVLogs = evChargingLogs.filter(log => log.department === userProfile?.department);
  const departmentFuelRecords = fuelUsageRecords.filter(record => {
    // For demo purposes, we'll assume all vehicles belong to the department
    return true;
  });

  // If user is not faculty or staff, don't render the dashboard
  if (userProfile?.role !== 'faculty') {
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
            Department: {userProfile?.department}
          </p>
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
              <p className="text-sm font-medium text-gray-600">Total Commutes</p>
              <p className="text-2xl font-semibold text-gray-900">
                {calculateTotalCommutes()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="rounded-full bg-green-100 p-3">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg. Distance</p>
              <p className="text-2xl font-semibold text-gray-900">
                {calculateAvgDistance().toFixed(1)} <span className="text-sm">km</span>
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="rounded-full bg-purple-100 p-3">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">% EV Usage</p>
              <p className="text-2xl font-semibold text-gray-900">
                {calculateEVUsage().toFixed(1)} <span className="text-sm">%</span>
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="rounded-full bg-yellow-100 p-3">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Fuel Costs</p>
              <p className="text-2xl font-semibold text-gray-900">
                ${calculateTotalFuelCost().toFixed(0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Commute Trends */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Department Commute Trends
          </h3>
          
          {loading ? (
            <div className="h-64 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : departmentCommuteLogs.length > 0 ? (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={commuteTrendData}
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
                  <Bar dataKey="distance" name="Distance (km)" fill="#3b82f6" />
                  <Bar dataKey="duration" name="Duration (min)" fill="#10b981" />
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
                There is no commute data for your department in the selected timeframe.
              </p>
            </div>
          )}
        </div>

        {/* Mode Distribution */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Transport Mode Distribution
          </h3>
          
          {loading ? (
            <div className="h-64 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : modeDistribution.length > 0 && modeDistribution.some(item => item.value > 0) ? (
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
            <div className="h-64 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-gray-400 dark:text-gray-500 mb-2">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">No data available</h3>
              <p className="text-gray-500 dark:text-gray-400 text-center max-w-md">
                There is no mode distribution data available.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* EV Charging Logs */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          EV Charging Usage Logs
        </h3>
        
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : departmentEVLogs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Station</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration (min)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Energy (kWh)</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {departmentEVLogs.map(log => (
                  <tr key={log.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(log.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {log.employeeName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {log.station}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {log.duration}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {log.energyConsumed}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No EV charging logs available for your department
          </div>
        )}
      </div>

      {/* Vehicle Service Records */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Vehicle Service Records
        </h3>
        
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : vehicleServiceRecords.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cost ($)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {vehicleServiceRecords.map(record => (
                  <tr key={record.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {record.vehicleId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(record.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {record.serviceType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {record.cost.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {record.notes}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No vehicle service records available
          </div>
        )}
      </div>

      {/* Fuel Usage Records */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Fuel Usage Records
        </h3>
        
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : fuelUsageRecords.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fuel Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity (L)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cost ($)</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {fuelUsageRecords.map(record => (
                  <tr key={record.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {record.vehicleId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(record.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {record.fuelType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {record.quantity.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {record.cost.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No fuel usage records available
          </div>
        )}
      </div>

      {/* Notifications Section */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Notifications
        </h3>
        
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">Service Schedule Reminder</h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>Vehicle VH-002 is due for maintenance next week. Schedule your service appointment.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">High Fuel Consumption Alert</h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>Vehicle VH-001 has exceeded average fuel consumption by 15% this month. Consider driver training or vehicle inspection.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">EV Initiative Success</h3>
                <div className="mt-2 text-sm text-green-700">
                  <p>Your department's EV adoption rate has increased by 25% this quarter. Keep up the great work!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyStaffMobility;
