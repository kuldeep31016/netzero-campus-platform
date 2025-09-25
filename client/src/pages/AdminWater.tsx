import React, { useState, useEffect, useCallback } from 'react';
import {
  BarChart,
  Bar,
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
  cost: number;
  status: 'pending' | 'approved' | 'rejected';
}

// Define department consumption data structure
interface DepartmentConsumption {
  name: string;
  totalUsage: number;
  recycled: number;
  efficiency: number;
}

const AdminWater: React.FC = () => {
  const { userProfile } = useAuth();
  const [waterRecords, setWaterRecords] = useState<WaterRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<WaterRecord[]>([]);
  const [departmentData, setDepartmentData] = useState<DepartmentConsumption[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedRecord, setSelectedRecord] = useState<WaterRecord | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    usageLiters: 0,
    recycledLiters: 0,
    efficiency: 0,
    status: 'pending' as 'pending' | 'approved' | 'rejected'
  });

  // Departments for filtering
  const departments = [
    'All Departments',
    'Computer Science',
    'Electrical Engineering',
    'Mechanical Engineering',
    'Civil Engineering',
    'Environmental Science',
    'Business Administration',
    'Architecture',
    'Management',
    'Research & Development',
    'Administration'
  ];

  const [departmentFilter, setDepartmentFilter] = useState('All Departments');

  // Generate mock water data
  const generateMockData = useCallback((): WaterRecord[] => {
    const users: { id: string; name: string; email: string; role: 'student' | 'faculty' | 'admin'; department: string }[] = [
      { id: '1', name: 'John Student', email: 'john@student.edu', role: 'student', department: 'Computer Science' },
      { id: '2', name: 'Jane Faculty', email: 'jane@faculty.edu', role: 'faculty', department: 'Electrical Engineering' },
      { id: '3', name: 'Bob Student', email: 'bob@student.edu', role: 'student', department: 'Mechanical Engineering' },
      { id: '4', name: 'Alice Faculty', email: 'alice@faculty.edu', role: 'faculty', department: 'Civil Engineering' },
      { id: '5', name: 'Charlie Admin', email: 'charlie@admin.edu', role: 'admin', department: 'Administration' },
      { id: '6', name: 'Diana Student', email: 'diana@student.edu', role: 'student', department: 'Environmental Science' },
      { id: '7', name: 'Eve Faculty', email: 'eve@faculty.edu', role: 'faculty', department: 'Business Administration' },
      { id: '8', name: 'Frank Student', email: 'frank@student.edu', role: 'student', department: 'Architecture' },
      { id: '9', name: 'Grace Faculty', email: 'grace@faculty.edu', role: 'faculty', department: 'Computer Science' },
      { id: '10', name: 'Henry Student', email: 'henry@student.edu', role: 'student', department: 'Civil Engineering' }
    ];

    const buildings = [
      'Hostel Block A',
      'Hostel Block B',
      'Hostel Block C',
      'Cafeteria',
      'Labs',
      'Library',
      'Administration Building',
      'Research Center',
      'Sports Complex',
      'Main Building'
    ];

    const records: WaterRecord[] = [];
    const today = new Date();

    // Generate records for the past 30 days for multiple users
    for (let i = 0; i < 100; i++) {
      const user = users[Math.floor(Math.random() * users.length)];
      const building = buildings[Math.floor(Math.random() * buildings.length)];
      const date = new Date(today);
      date.setDate(date.getDate() - Math.floor(Math.random() * 30));
      
      const usageLiters = 1000 + Math.random() * 2000;
      const recycledLiters = usageLiters * (0.1 + Math.random() * 0.4);
      const efficiency = (recycledLiters / usageLiters) * 100;
      
      records.push({
        id: `record-${i + 1}`,
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        role: user.role,
        department: user.department,
        building,
        date: date.toISOString().split('T')[0],
        usageLiters: Math.max(0, usageLiters),
        recycledLiters: Math.max(0, recycledLiters),
        efficiency: Math.max(0, Math.min(100, efficiency)),
        cost: usageLiters * 0.005,
        status: ['pending', 'approved', 'rejected'][Math.floor(Math.random() * 3)] as 'pending' | 'approved' | 'rejected'
      });
    }

    return records;
  }, []);

  // Generate department consumption data
  const generateDepartmentData = useCallback((records: WaterRecord[]): DepartmentConsumption[] => {
    const departmentMap: Record<string, DepartmentConsumption> = {};
    
    records.forEach(record => {
      if (!departmentMap[record.department]) {
        departmentMap[record.department] = {
          name: record.department,
          totalUsage: 0,
          recycled: 0,
          efficiency: 0
        };
      }
      
      departmentMap[record.department].totalUsage += record.usageLiters;
      departmentMap[record.department].recycled += record.recycledLiters;
      // Recalculate average efficiency
      departmentMap[record.department].efficiency = 
        departmentMap[record.department].totalUsage > 0 
          ? (departmentMap[record.department].recycled / departmentMap[record.department].totalUsage) * 100 
          : 0;
    });
    
    return Object.values(departmentMap);
  }, []);

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockData = generateMockData();
        setWaterRecords(mockData);
        setFilteredRecords(mockData);
        setDepartmentData(generateDepartmentData(mockData));
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [generateMockData, generateDepartmentData]);

  // Filter records based on search term, status, and department
  useEffect(() => {
    let result = [...waterRecords];
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(record => 
        record.userName.toLowerCase().includes(term) ||
        record.userEmail.toLowerCase().includes(term) ||
        record.department.toLowerCase().includes(term) ||
        record.building.toLowerCase().includes(term)
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(record => record.status === statusFilter);
    }
    
    // Apply department filter
    if (departmentFilter !== 'All Departments') {
      result = result.filter(record => record.department === departmentFilter);
    }
    
    setFilteredRecords(result);
  }, [searchTerm, statusFilter, departmentFilter, waterRecords]);

  // Handle record approval
  const handleApprove = (id: string) => {
    setWaterRecords(prev => 
      prev.map(record => 
        record.id === id ? { ...record, status: 'approved' } : record
      )
    );
    
    setFilteredRecords(prev => 
      prev.map(record => 
        record.id === id ? { ...record, status: 'approved' } : record
      )
    );
  };

  // Handle record rejection
  const handleReject = (id: string) => {
    setWaterRecords(prev => 
      prev.map(record => 
        record.id === id ? { ...record, status: 'rejected' } : record
      )
    );
    
    setFilteredRecords(prev => 
      prev.map(record => 
        record.id === id ? { ...record, status: 'rejected' } : record
      )
    );
  };

  // Handle record deletion
  const handleDelete = (id: string) => {
    setWaterRecords(prev => prev.filter(record => record.id !== id));
    setFilteredRecords(prev => prev.filter(record => record.id !== id));
  };

  // Open edit modal
  const openEditModal = (record: WaterRecord) => {
    setSelectedRecord(record);
    setEditForm({
      usageLiters: record.usageLiters,
      recycledLiters: record.recycledLiters,
      efficiency: record.efficiency,
      status: record.status
    });
    setShowEditModal(true);
  };

  // Handle edit form submission
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedRecord) {
      const updatedRecords = waterRecords.map(record => 
        record.id === selectedRecord.id 
          ? { 
              ...record, 
              usageLiters: editForm.usageLiters,
              recycledLiters: editForm.recycledLiters,
              efficiency: editForm.efficiency,
              status: editForm.status
            } 
          : record
      );
      
      setWaterRecords(updatedRecords);
      setFilteredRecords(updatedRecords);
      setShowEditModal(false);
      setSelectedRecord(null);
    }
  };

  // Export data as CSV
  const exportToCSV = () => {
    const headers = [
      'ID', 'User Name', 'User Email', 'Role', 'Department', 'Building', 
      'Date', 'Usage (Liters)', 'Recycled (Liters)', 'Efficiency (%)', 'Cost ($)', 'Status'
    ];
    
    const csvContent = [
      headers.join(','),
      ...filteredRecords.map(record => [
        record.id,
        record.userName,
        record.userEmail,
        record.role,
        record.department,
        record.building,
        record.date,
        record.usageLiters.toFixed(2),
        record.recycledLiters.toFixed(2),
        record.efficiency.toFixed(2),
        record.cost.toFixed(2),
        record.status
      ].map(field => `"${field}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'water_records.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export data as PDF (simplified implementation)
  const exportToPDF = () => {
    alert('PDF export functionality would be implemented here. In a real application, this would generate a PDF report of the water data.');
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
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FF6B6B', '#4ECDC4', '#1DD1A1', '#5F27CD'];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Check if user is admin
  if (!userProfile || userProfile.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You must be an administrator to view this page.</p>
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
            Water Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage water records and monitor consumption across departments
          </p>
        </div>
        
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button
            onClick={exportToCSV}
            className="btn btn-secondary bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-md text-sm font-medium"
          >
            Export CSV
          </button>
          <button
            onClick={exportToPDF}
            className="btn btn-secondary bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-md text-sm font-medium"
          >
            Export PDF
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="rounded-full bg-blue-100 p-3">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 15l-7-7-7 7" />
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
            <div className="rounded-full bg-green-100 p-3">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Approval</p>
              <p className="text-2xl font-semibold text-gray-900">
                {waterRecords.filter(r => r.status === 'pending').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="rounded-full bg-cyan-100 p-3">
              <svg className="w-6 h-6 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            <div className="rounded-full bg-purple-100 p-3">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Departments</p>
              <p className="text-2xl font-semibold text-gray-900">
                {departmentData.length}
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
            Water Consumption by Department
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={departmentData}
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  angle={-45} 
                  textAnchor="end" 
                  height={60}
                  tick={{ fontSize: 12 }}
                />
                <YAxis tickFormatter={(value) => `${value} L`} />
                <Tooltip 
                  formatter={(value) => [`${value} liters`, 'Consumption']}
                  labelFormatter={(label) => `Department: ${label}`}
                />
                <Legend />
                <Bar dataKey="totalUsage" name="Total Usage" fill="#3b82f6" />
                <Bar dataKey="recycled" name="Recycled Water" fill="#06b6d4" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Department Distribution Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Department Water Distribution
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={departmentData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="totalUsage"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {departmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} liters`, 'Consumption']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input
              type="text"
              placeholder="Search by name, email, department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
          
          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setDepartmentFilter('All Departments');
              }}
              className="w-full btn btn-secondary bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-md text-sm font-medium"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Water Records Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Water Records ({filteredRecords.length})
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-4 text-center text-sm text-gray-500">
                    No water records found
                  </td>
                </tr>
              ) : (
                filteredRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{record.userName}</div>
                      <div className="text-sm text-gray-500">{record.userEmail}</div>
                      <div className="text-xs text-gray-400 capitalize">{record.role}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {record.department}
                    </td>
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
                      {record.efficiency.toFixed(1)}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={record.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        {record.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApprove(record.id)}
                              className="text-green-600 hover:text-green-900"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleReject(record.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => openEditModal(record)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(record.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && selectedRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Edit Water Record</h3>
            </div>
            <form onSubmit={handleEditSubmit}>
              <div className="px-6 py-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">User</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedRecord.userName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Department</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedRecord.department}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Building</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedRecord.building}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedRecord.date}</p>
                </div>
                <div>
                  <label htmlFor="usageLiters" className="block text-sm font-medium text-gray-700">
                    Usage (Liters)
                  </label>
                  <input
                    type="number"
                    id="usageLiters"
                    value={editForm.usageLiters}
                    onChange={(e) => setEditForm({...editForm, usageLiters: parseFloat(e.target.value) || 0})}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    step="1"
                  />
                </div>
                <div>
                  <label htmlFor="recycledLiters" className="block text-sm font-medium text-gray-700">
                    Recycled (Liters)
                  </label>
                  <input
                    type="number"
                    id="recycledLiters"
                    value={editForm.recycledLiters}
                    onChange={(e) => setEditForm({...editForm, recycledLiters: parseFloat(e.target.value) || 0})}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    step="1"
                  />
                </div>
                <div>
                  <label htmlFor="efficiency" className="block text-sm font-medium text-gray-700">
                    Efficiency (%)
                  </label>
                  <input
                    type="number"
                    id="efficiency"
                    value={editForm.efficiency}
                    onChange={(e) => setEditForm({...editForm, efficiency: parseFloat(e.target.value) || 0})}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    step="0.1"
                    min="0"
                    max="100"
                  />
                </div>
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <select
                    id="status"
                    value={editForm.status}
                    onChange={(e) => setEditForm({...editForm, status: e.target.value as 'pending' | 'approved' | 'rejected'})}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>
              <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="btn btn-secondary bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-md text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminWater;