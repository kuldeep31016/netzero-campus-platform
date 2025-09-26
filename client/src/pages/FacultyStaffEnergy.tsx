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

// Define the energy data structure
interface EnergyRecord {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  role: 'student' | 'faculty' | 'admin';
  department: string;
  building: string;
  date: string;
  electricity: number;
  renewable: number;
  co2: number;
  cost: number;
  status: 'pending' | 'approved' | 'rejected';
}

// Define department consumption data structure
interface DepartmentConsumption {
  name: string;
  totalConsumption: number;
  renewable: number;
  co2: number;
}

const FacultyStaffEnergy: React.FC = () => {
  const { userProfile } = useAuth();
  const [energyRecords, setEnergyRecords] = useState<EnergyRecord[]>([]);
  const [departmentData, setDepartmentData] = useState<DepartmentConsumption[]>([]);
  const [loading, setLoading] = useState(true);
  const [requestForm, setRequestForm] = useState({
    building: '',
    description: '',
    estimatedConsumption: 0
  });
  const [showRequestModal, setShowRequestModal] = useState(false);

  // Buildings for request form
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

  // Generate mock energy data for the user's department
  const generateMockData = useCallback((): EnergyRecord[] => {
    if (!userProfile) return [];
    
    const department = userProfile.department || 'Computer Science';
    const records: EnergyRecord[] = [];
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
        electricity: 200 + Math.random() * 800,
        renewable: 30 + Math.random() * 300,
        co2: 80 + Math.random() * 300,
        cost: (200 + Math.random() * 800) * 0.12,
        status: ['pending', 'approved', 'rejected'][Math.floor(Math.random() * 3)] as 'pending' | 'approved' | 'rejected'
      });
    }

    return records;
  }, [userProfile]);

  // Generate department consumption data
  const generateDepartmentData = useCallback((records: EnergyRecord[]): DepartmentConsumption[] => {
    if (records.length === 0 || !userProfile) return [];
    
    const department = userProfile.department || 'Computer Science';
    const departmentRecords = records.filter(record => record.department === department);
    
    if (departmentRecords.length === 0) return [];
    
    const consumption: DepartmentConsumption = {
      name: department,
      totalConsumption: departmentRecords.reduce((sum, record) => sum + record.electricity, 0),
      renewable: departmentRecords.reduce((sum, record) => sum + record.renewable, 0),
      co2: departmentRecords.reduce((sum, record) => sum + record.co2, 0)
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
        setEnergyRecords(mockData);
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

  // Handle request form submission
  const handleRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real application, this would send the request to the backend
    console.log('Energy request submitted:', requestForm);
    
    // Reset form and close modal
    setRequestForm({
      building: '',
      description: '',
      estimatedConsumption: 0
    });
    setShowRequestModal(false);
    
    // Show success message
    alert('Energy request submitted successfully!');
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
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
            Department Energy Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Monitor energy consumption for {userProfile.department}
          </p>
        </div>
        
        <div className="mt-4 sm:mt-0">
          <button
            onClick={() => setShowRequestModal(true)}
            className="btn btn-primary bg-green-600 text-white hover:bg-green-700 px-4 py-2 rounded-md text-sm font-medium"
          >
            Submit Energy Request
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
                {energyRecords.length}
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
              <p className="text-sm font-medium text-gray-600">Total Consumption</p>
              <p className="text-2xl font-semibold text-gray-900">
                {energyRecords.reduce((sum, record) => sum + record.electricity, 0).toFixed(0)} <span className="text-sm">kWh</span>
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="rounded-full bg-yellow-100 p-3">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg. Daily Usage</p>
              <p className="text-2xl font-semibold text-gray-900">
                {energyRecords.length > 0 
                  ? (energyRecords.reduce((sum, record) => sum + record.electricity, 0) / energyRecords.length).toFixed(0) 
                  : 0} <span className="text-sm">kWh</span>
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="rounded-full bg-purple-100 p-3">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">% Renewable</p>
              <p className="text-2xl font-semibold text-gray-900">
                {energyRecords.length > 0 
                  ? ((energyRecords.reduce((sum, record) => sum + record.renewable, 0) / 
                      energyRecords.reduce((sum, record) => sum + record.electricity, 0)) * 100).toFixed(1) 
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
            Energy Consumption Trend
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={energyRecords
                  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                  .map(record => ({
                    date: record.date,
                    electricity: record.electricity,
                    renewable: record.renewable
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
                <YAxis tickFormatter={(value) => `${value} kWh`} />
                <Tooltip 
                  formatter={(value) => [`${value} kWh`, 'Consumption']}
                  labelFormatter={(label) => `Date: ${label}`}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="electricity" 
                  name="Electricity Usage" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="renewable" 
                  name="Renewable Energy" 
                  stroke="#10b981" 
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
            Energy Sources Distribution
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'Electricity', value: energyRecords.reduce((sum, record) => sum + record.electricity, 0) },
                    { name: 'Renewable', value: energyRecords.reduce((sum, record) => sum + record.renewable, 0) }
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
                  <Cell key="cell-1" fill="#10b981" />
                </Pie>
                <Tooltip formatter={(value) => [`${value} kWh`, 'Consumption']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Energy Records Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Recent Energy Records ({energyRecords.length})
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
                  Electricity (kWh)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Renewable (kWh)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  CO₂ (kg)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {energyRecords.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                    No energy records found
                  </td>
                </tr>
              ) : (
                energyRecords
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
                        {record.electricity.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {record.renewable.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {record.co2.toFixed(2)}
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

      {/* Request Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Submit Energy Request</h3>
            </div>
            <form onSubmit={handleRequestSubmit}>
              <div className="px-6 py-4 space-y-4">
                <div>
                  <label htmlFor="building" className="block text-sm font-medium text-gray-700">
                    Building
                  </label>
                  <select
                    id="building"
                    value={requestForm.building}
                    onChange={(e) => setRequestForm({...requestForm, building: e.target.value})}
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
                    value={requestForm.description}
                    onChange={(e) => setRequestForm({...requestForm, description: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    rows={3}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="estimatedConsumption" className="block text-sm font-medium text-gray-700">
                    Estimated Consumption (kWh)
                  </label>
                  <input
                    type="number"
                    id="estimatedConsumption"
                    value={requestForm.estimatedConsumption}
                    onChange={(e) => setRequestForm({...requestForm, estimatedConsumption: parseFloat(e.target.value) || 0})}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    min="0"
                    step="0.1"
                    required
                  />
                </div>
              </div>
              <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowRequestModal(false)}
                  className="btn btn-secondary bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-md text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary bg-green-600 text-white hover:bg-green-700 px-4 py-2 rounded-md text-sm font-medium"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacultyStaffEnergy;