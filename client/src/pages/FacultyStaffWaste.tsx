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
interface WasteRecord {
  id: string;
  date: string;
  department: string;
  wasteKg: number;
  recyclableKg: number;
  landfillKg: number;
  compostKg: number;
  segregationRate: number;
}

// Define notification structure
interface WasteNotification {
  id: string;
  type: 'collection' | 'overflow';
  message: string;
  date: string;
  priority: 'low' | 'medium' | 'high';
}

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
        <p className="font-medium text-gray-900 dark:text-gray-100">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }}>
            {entry.name}: {entry.value.toFixed(2)} kg
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const FacultyStaffWaste: React.FC = () => {
  const { userProfile } = useAuth();
  const [wasteRecords, setWasteRecords] = useState<WasteRecord[]>([]);
  const [notifications, setNotifications] = useState<WasteNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('30d');
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [newRecord, setNewRecord] = useState({
    wasteKg: 0,
    recyclableKg: 0,
    landfillKg: 0,
    compostKg: 0
  });

  // Colors for charts
  const COLORS = ['#ef4444', '#10b981', '#f59e0b', '#8b5cf6'];

  // Generate mock waste data
  const generateMockData = useCallback((): { records: WasteRecord[], notifications: WasteNotification[] } => {
    const records: WasteRecord[] = [];
    const notifications: WasteNotification[] = [];
    const today = new Date();
    
    // Generate records for the past 30 days
    const days = timeframe === '30d' ? 30 : 7;
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // Generate realistic mock data with variation
      const baseWaste = 50 + Math.random() * 150;
      const variation = Math.sin(i * 0.3) * 20;
      
      const wasteKg = Math.max(0, baseWaste + variation);
      const recyclableKg = wasteKg * (0.3 + Math.random() * 0.3);
      const landfillKg = wasteKg * (0.4 + Math.random() * 0.2);
      const compostKg = wasteKg - recyclableKg - landfillKg;
      
      records.push({
        id: `record-${i + 1}`,
        date: date.toISOString().split('T')[0],
        department: userProfile?.department || 'Unknown Department',
        wasteKg: Math.max(0, wasteKg),
        recyclableKg: Math.max(0, recyclableKg),
        landfillKg: Math.max(0, landfillKg),
        compostKg: Math.max(0, compostKg),
        segregationRate: ((recyclableKg + compostKg) / wasteKg) * 100
      });
    }
    
    // Generate mock notifications
    notifications.push({
      id: 'notif-1',
      type: 'collection',
      message: 'Scheduled waste collection tomorrow at 9:00 AM',
      date: new Date().toISOString().split('T')[0],
      priority: 'medium'
    });
    
    if (records.length > 0 && records[records.length - 1].wasteKg > 150) {
      notifications.push({
        id: 'notif-2',
        type: 'overflow',
        message: 'Overflow detected in waste bin. Collection needed immediately.',
        date: new Date().toISOString().split('T')[0],
        priority: 'high'
      });
    }
    
    return { records, notifications };
  }, [timeframe, userProfile]);

  // Fetch data
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const { records, notifications } = generateMockData();
      setWasteRecords(records);
      setNotifications(notifications);
    } catch (error) {
      console.error('Error fetching waste data:', error);
    } finally {
      setLoading(false);
    }
  }, [generateMockData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Format data for charts
  const trendData = wasteRecords.map(record => ({
    date: new Date(record.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    wasteKg: record.wasteKg,
    recyclableKg: record.recyclableKg,
    landfillKg: record.landfillKg,
    compostKg: record.compostKg
  }));

  // Prepare data for composition pie chart
  const compositionData = wasteRecords.length > 0 ? [
    { name: 'Recyclable', value: wasteRecords.reduce((sum, record) => sum + record.recyclableKg, 0) / wasteRecords.length },
    { name: 'Landfill', value: wasteRecords.reduce((sum, record) => sum + record.landfillKg, 0) / wasteRecords.length },
    { name: 'Compost', value: wasteRecords.reduce((sum, record) => sum + record.compostKg, 0) / wasteRecords.length }
  ] : [];

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const today = new Date().toISOString().split('T')[0];
    const totalWaste = newRecord.wasteKg + newRecord.recyclableKg + newRecord.landfillKg + newRecord.compostKg;
    const segregationRate = totalWaste > 0 ? ((newRecord.recyclableKg + newRecord.compostKg) / totalWaste) * 100 : 0;
    
    const newWasteRecord: WasteRecord = {
      id: `record-${Date.now()}`,
      date: today,
      department: userProfile?.department || 'Unknown Department',
      wasteKg: newRecord.wasteKg,
      recyclableKg: newRecord.recyclableKg,
      landfillKg: newRecord.landfillKg,
      compostKg: newRecord.compostKg,
      segregationRate
    };
    
    setWasteRecords(prev => [newWasteRecord, ...prev]);
    setShowSubmitForm(false);
    setNewRecord({
      wasteKg: 0,
      recyclableKg: 0,
      landfillKg: 0,
      compostKg: 0
    });
  };

  // If user is not faculty, don't render the dashboard
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
            Waste Management Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track and manage waste for {userProfile?.department}
          </p>
        </div>
        
        <button 
          onClick={() => setShowSubmitForm(true)}
          className="mt-4 sm:mt-0 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
        >
          Submit Daily Waste Data
        </button>
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
            className="w-full input text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
          </select>
        </div>
      </div>

      {/* Notifications */}
      {notifications.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Waste Notifications
          </h3>
          <div className="space-y-3">
            {notifications.map(notification => (
              <div 
                key={notification.id} 
                className={`p-4 rounded-lg border-l-4 ${
                  notification.priority === 'high' ? 'bg-red-50 border-red-500' :
                  notification.priority === 'medium' ? 'bg-yellow-50 border-yellow-500' :
                  'bg-blue-50 border-blue-500'
                }`}
              >
                <div className="flex justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{notification.message}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      {notification.date}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    notification.priority === 'high' ? 'bg-red-100 text-red-800' :
                    notification.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {notification.type === 'collection' ? 'Collection' : 'Overflow'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Waste Generation Trends */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Waste Generation Trends
          </h3>
          
          {loading ? (
            <div className="h-64 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
            </div>
          ) : trendData.length > 0 ? (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={trendData}
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
                  <Bar dataKey="recyclableKg" name="Recyclable" fill="#10b981" stackId="a" />
                  <Bar dataKey="landfillKg" name="Landfill" fill="#ef4444" stackId="a" />
                  <Bar dataKey="compostKg" name="Compost" fill="#f59e0b" stackId="a" />
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
                There is no waste data for the selected timeframe.
              </p>
            </div>
          )}
        </div>

        {/* Waste Composition */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Average Waste Composition
          </h3>
          
          {loading ? (
            <div className="h-64 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
            </div>
          ) : compositionData.length > 0 && compositionData.some(item => item.value > 0) ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={compositionData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {compositionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${Number(value).toFixed(2)} kg`, 'Weight']} />
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
                There is no waste composition data available.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Waste Logs */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Recent Waste Logs
        </h3>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Waste (kg)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recyclable (kg)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Landfill (kg)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Compost (kg)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Segregation Rate</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {wasteRecords.slice(0, 10).map(record => (
                <tr key={record.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {record.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {record.wasteKg.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {record.recyclableKg.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {record.landfillKg.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {record.compostKg.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      record.segregationRate > 70 ? 'bg-green-100 text-green-800' :
                      record.segregationRate > 50 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {record.segregationRate.toFixed(1)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Submit Waste Data Modal */}
      {showSubmitForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Submit Daily Waste Data</h3>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="px-6 py-4 space-y-4">
                <div>
                  <label htmlFor="wasteKg" className="block text-sm font-medium text-gray-700">
                    General Waste (kg)
                  </label>
                  <input
                    type="number"
                    id="wasteKg"
                    value={newRecord.wasteKg}
                    onChange={(e) => setNewRecord({...newRecord, wasteKg: parseFloat(e.target.value) || 0})}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    min="0"
                    step="0.1"
                  />
                </div>
                <div>
                  <label htmlFor="recyclableKg" className="block text-sm font-medium text-gray-700">
                    Recyclable Waste (kg)
                  </label>
                  <input
                    type="number"
                    id="recyclableKg"
                    value={newRecord.recyclableKg}
                    onChange={(e) => setNewRecord({...newRecord, recyclableKg: parseFloat(e.target.value) || 0})}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    min="0"
                    step="0.1"
                  />
                </div>
                <div>
                  <label htmlFor="landfillKg" className="block text-sm font-medium text-gray-700">
                    Landfill Waste (kg)
                  </label>
                  <input
                    type="number"
                    id="landfillKg"
                    value={newRecord.landfillKg}
                    onChange={(e) => setNewRecord({...newRecord, landfillKg: parseFloat(e.target.value) || 0})}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    min="0"
                    step="0.1"
                  />
                </div>
                <div>
                  <label htmlFor="compostKg" className="block text-sm font-medium text-gray-700">
                    Compost Waste (kg)
                  </label>
                  <input
                    type="number"
                    id="compostKg"
                    value={newRecord.compostKg}
                    onChange={(e) => setNewRecord({...newRecord, compostKg: parseFloat(e.target.value) || 0})}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    min="0"
                    step="0.1"
                  />
                </div>
              </div>
              <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowSubmitForm(false)}
                  className="btn btn-secondary bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-md text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary bg-green-600 text-white hover:bg-green-700 px-4 py-2 rounded-md text-sm font-medium"
                >
                  Submit Data
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacultyStaffWaste;