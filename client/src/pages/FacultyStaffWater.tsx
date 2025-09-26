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

// Define the water data structure
interface WaterRecord {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  role: 'student' | 'faculty' | 'admin';
  department: string;
  building: string;
  date: string;
  usageLiters: number;
  recycledLiters: number;
  efficiency: number;
  status: 'pending' | 'approved' | 'rejected';
}

// Define department consumption data structure
interface DepartmentWaterConsumption {
  name: string;
  totalUsage: number;
  recycled: number;
  efficiency: number;
}

const FacultyStaffWater: React.FC = () => {
  const { userProfile } = useAuth();
  const [waterRecords, setWaterRecords] = useState<WaterRecord[]>([]);
  const [departmentData, setDepartmentData] = useState<DepartmentWaterConsumption[]>([]);
  const [loading, setLoading] = useState(true);
  const [reportForm, setReportForm] = useState({
    building: '',
    description: '',
    estimatedUsage: 0
  });
  const [showReportModal, setShowReportModal] = useState(false);

  // Buildings for report form
  const buildings = [
    'Main Building',
    'Engineering Block',
    'Science Block',
    'Library',
    'Cafeteria',
    'Sports Complex',
    'Dormitory A',
    'Dormitory B',
    'Administration Building',
    'Research Center'
  ];

  // Generate mock water data for the user's department
  const generateMockData = useCallback((): WaterRecord[] => {
    if (!userProfile) return [];
    
    const department = userProfile.department || 'Computer Science';
    const records: WaterRecord[] = [];
    const today = new Date();

    // Generate records for the past 30 days
    for (let i = 0; i < 50; i++) {
      const building = buildings[Math.floor(Math.random() * buildings.length)];
      const date = new Date(today);
      date.setDate(date.getDate() - Math.floor(Math.random() * 30));
      
      records.push({
        id: `record-${i + 1}`,
        userId: userProfile.uid,
        userName: userProfile.fullName,
        userEmail: userProfile.email,
        role: userProfile.role as 'faculty' | 'admin',
        department,
        building,
        date: date.toISOString().split('T')[0],
        usageLiters: 1000 + Math.random() * 2000,
        recycledLiters: 200 + Math.random() * 800,
        efficiency: 60 + Math.random() * 40,
        status: ['pending', 'approved', 'rejected'][Math.floor(Math.random() * 3)] as 'pending' | 'approved' | 'rejected'
      });
    }

    return records;
  }, [userProfile]);

  // Generate department consumption data
  const generateDepartmentData = useCallback((records: WaterRecord[]): DepartmentWaterConsumption[] => {
    if (records.length === 0 || !userProfile) return [];
    
    const department = userProfile.department || 'Computer Science';
    const departmentRecords = records.filter(record => record.department === department);
    
    if (departmentRecords.length === 0) return [];
    
    const consumption: DepartmentWaterConsumption = {
      name: department,
      totalUsage: departmentRecords.reduce((sum, record) => sum + record.usageLiters, 0),
      recycled: departmentRecords.reduce((sum, record) => sum + record.recycledLiters, 0),
      efficiency: departmentRecords.reduce((sum, record) => sum + record.efficiency, 0) / departmentRecords.length
    };
    
    return [consumption];
  }, [userProfile]);

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockData = generateMockData();
        setWaterRecords(mockData);
        setDepartmentData(generateDepartmentData(mockData));
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userProfile && userProfile.role === 'faculty') {
      fetchData();
    }
  }, [generateMockData, generateDepartmentData, userProfile]);

  // Handle report form submission
  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real application, this would send the report to the backend
    console.log('Water usage report submitted:', reportForm);
    
    // Reset form and close modal
    setReportForm({
      building: '',
      description: '',
      estimatedUsage: 0
    });
    setShowReportModal(false);
    
    // Show success message
    alert('Water usage report submitted successfully!');
  };

  // Status badge component
  const StatusBadge: React.FC<{ status: 'pending' | 'approved' | 'rejected' }> = ({ status }) => {
    const statusStyles = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    
    const statusText = {
      pending: 'Pending',
      approved: 'Approved',
      rejected: 'Rejected'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[status]}`}>
        {statusText[status]}
      </span>
    );
  };

  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Check if user has the correct role
  if (!userProfile || userProfile.role !== 'faculty') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You must be a faculty member to view this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Department Water Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Monitor water consumption for {userProfile.department}
          </p>
        </div>
        
        <div className="mt-4 sm:mt-0">
          <button
            onClick={() => setShowReportModal(true)}
            className="btn btn-primary bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium"
          >
            Submit Water Report
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="rounded-full bg-blue-100 p-3">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Records</p>
              <p className="text-2xl font-semibold text-gray-900">
                {waterRecords.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="rounded-full bg-blue-100 p-3">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4 4 0 003 15z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Usage</p>
              <p className="text-2xl font-semibold text-gray-900">
                {waterRecords.reduce((sum, record) => sum + record.usageLiters, 0).toFixed(0)} <span className="text-sm">liters</span>
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
              <p className="text-sm font-medium text-gray-600">Recycled Water</p>
              <p className="text-2xl font-semibold text-gray-900">
                {waterRecords.reduce((sum, record) => sum + record.recycledLiters, 0).toFixed(0)} <span className="text-sm">liters</span>
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="rounded-full bg-teal-100 p-3">
              <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg. Efficiency</p>
              <p className="text-2xl font-semibold text-gray-900">
                {waterRecords.length > 0 
                  ? (waterRecords.reduce((sum, record) => sum + record.efficiency, 0) / waterRecords.length).toFixed(1) 
                  : 0} <span className="text-sm">%</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Consumption Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Water Consumption Trend
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={waterRecords
                  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                  .map(record => ({
                    date: record.date,
                    usageLiters: record.usageLiters,
                    recycledLiters: record.recycledLiters
                  }))}
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  angle={-45} 
                  textAnchor="end" 
                  height={60}
                  tick={{ fontSize: 10 }}
                />
                <YAxis tickFormatter={(value) => `${value} L`} />
                <Tooltip 
                  formatter={(value) => [`${value} liters`, 'Consumption']}
                  labelFormatter={(label) => `Date: ${label}`}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="usageLiters" 
                  name="Water Usage" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="recycledLiters" 
                  name="Recycled Water" 
                  stroke="#06b6d4" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Department Distribution Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Water Usage Distribution
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'Total Usage', value: waterRecords.reduce((sum, record) => sum + record.usageLiters, 0) },
                    { name: 'Recycled Water', value: waterRecords.reduce((sum, record) => sum + record.recycledLiters, 0) }
                  ]}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  <Cell key="cell-0" fill="#3b82f6" />
                  <Cell key="cell-1" fill="#06b6d4" />
                </Pie>
                <Tooltip formatter={(value) => [`${value} liters`, 'Consumption']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Water Records Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Recent Water Records ({waterRecords.length})
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Building
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usage (L)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Recycled (L)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Efficiency (%)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {waterRecords.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                    No water records found
                  </td>
                </tr>
              ) : (
                waterRecords
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .slice(0, 10)
                  .map((record) => (
                    <tr key={record.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {record.building}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {record.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {record.usageLiters.toFixed(0)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {record.recycledLiters.toFixed(0)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {record.efficiency.toFixed(1)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={record.status} />
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Submit Water Usage Report</h3>
            </div>
            <form onSubmit={handleReportSubmit}>
              <div className="px-6 py-4 space-y-4">
                <div>
                  <label htmlFor="building" className="block text-sm font-medium text-gray-700">
                    Building
                  </label>
                  <select
                    id="building"
                    value={reportForm.building}
                    onChange={(e) => setReportForm({...reportForm, building: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    required
                  >
                    <option value="">Select a building</option>
                    {buildings.map(building => (
                      <option key={building} value={building}>{building}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    id="description"
                    value={reportForm.description}
                    onChange={(e) => setReportForm({...reportForm, description: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    rows={3}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="estimatedUsage" className="block text-sm font-medium text-gray-700">
                    Estimated Usage (liters)
                  </label>
                  <input
                    type="number"
                    id="estimatedUsage"
                    value={reportForm.estimatedUsage}
                    onChange={(e) => setReportForm({...reportForm, estimatedUsage: parseFloat(e.target.value) || 0})}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    min="0"
                    step="1"
                    required
                  />
                </div>
              </div>
              <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowReportModal(false)}
                  className="btn btn-secondary bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-md text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium"
                >
                  Submit Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacultyStaffWater;