import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
  userId: string;
  userName: string;
  userEmail: string;
  role: 'student' | 'faculty' | 'admin';
  department: string;
  building: string;
  date: string;
  wasteKg: number;
  recyclableKg: number;
  nonRecyclableKg: number;
  segregationRate: number;
  co2Avoided: number;
  status: 'pending' | 'approved' | 'rejected';
}

// Define department consumption data structure
interface DepartmentWasteData {
  name: string;
  totalWaste: number;
  recyclable: number;
  nonRecyclable: number;
  segregationRate: number;
  co2Avoided: number;
}

// Define waste collection schedule
interface CollectionSchedule {
  id: string;
  building: string;
  department: string;
  date: string;
  time: string;
  assignedTo: string;
  status: 'pending' | 'completed' | 'cancelled';
}

// Define staff report
interface StaffReport {
  id: string;
  staffName: string;
  date: string;
  building: string;
  wasteCollected: number;
  issuesReported: string;
  status: 'submitted' | 'reviewed';
}

// Define schedule form interface (without id)
interface ScheduleForm {
  building: string;
  department: string;
  date: string;
  time: string;
  assignedTo: string;
}

// Define report form interface (without id)
interface ReportForm {
  staffName: string;
  building: string;
  wasteCollected: number;
  issuesReported: string;
}

const AdminWaste: React.FC = () => {
  const { userProfile } = useAuth();
  const [wasteRecords, setWasteRecords] = useState<WasteRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<WasteRecord[]>([]);
  const [departmentData, setDepartmentData] = useState<DepartmentWasteData[]>([]);
  const [collectionSchedules, setCollectionSchedules] = useState<CollectionSchedule[]>([]);
  const [staffReports, setStaffReports] = useState<StaffReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [timeframeFilter, setTimeframeFilter] = useState('all'); // New state for timeframe filter
  const [buildingFilter, setBuildingFilter] = useState('all'); // New state for building filter
  const [selectedRecord, setSelectedRecord] = useState<WasteRecord | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [editForm, setEditForm] = useState({
    wasteKg: 0,
    recyclableKg: 0,
    nonRecyclableKg: 0,
    segregationRate: 0,
    co2Avoided: 0,
    status: 'pending' as 'pending' | 'approved' | 'rejected'
  });
  
  const [scheduleForm, setScheduleForm] = useState<ScheduleForm>({
    building: '',
    department: '',
    date: '',
    time: '',
    assignedTo: ''
  });
  
  const [reportForm, setReportForm] = useState<ReportForm>({
    staffName: '',
    building: '',
    wasteCollected: 0,
    issuesReported: ''
  });

  // Departments for filtering
  const departments = useMemo(() => [
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
  ], []);

  const [departmentFilter, setDepartmentFilter] = useState('All Departments');

  // Buildings for scheduling and filtering
  const buildings = useMemo(() => [
    'All Buildings',
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
  ], []);

  // Staff members for assignment
  const staffMembers = useMemo(() => [
    'John Waste Collector',
    'Jane Recycling Specialist',
    'Bob Sanitation Worker',
    'Alice Environmental Officer',
    'Charlie Waste Manager'
  ], []);

  // Generate mock waste data
  const generateMockData = useCallback((): { 
    wasteRecords: WasteRecord[], 
    schedules: CollectionSchedule[], 
    reports: StaffReport[] 
  } => {
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

    const records: WasteRecord[] = [];
    const schedules: CollectionSchedule[] = [];
    const reports: StaffReport[] = [];
    const today = new Date();

    // Generate records for the past 60 days for multiple users
    for (let i = 0; i < 150; i++) {
      const user = users[Math.floor(Math.random() * users.length)];
      const building = buildings[Math.floor(Math.random() * buildings.length)];
      const date = new Date(today);
      date.setDate(date.getDate() - Math.floor(Math.random() * 60));
      
      const wasteKg = 50 + Math.random() * 200;
      const recyclableKg = wasteKg * (0.3 + Math.random() * 0.4);
      const nonRecyclableKg = wasteKg - recyclableKg;
      const segregationRate = (recyclableKg / wasteKg) * 100;
      // CO2 avoided from recycling (approx. 0.5 kg CO2 per kg of recycled waste)
      const co2Avoided = recyclableKg * 0.5;
      
      records.push({
        id: `record-${i + 1}`,
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        role: user.role,
        department: user.department,
        building,
        date: date.toISOString().split('T')[0],
        wasteKg: Math.max(0, wasteKg),
        recyclableKg: Math.max(0, recyclableKg),
        nonRecyclableKg: Math.max(0, nonRecyclableKg),
        segregationRate: Math.max(0, Math.min(100, segregationRate)),
        co2Avoided: Math.max(0, co2Avoided),
        status: ['pending', 'approved', 'rejected'][Math.floor(Math.random() * 3)] as 'pending' | 'approved' | 'rejected'
      });
    }

    // Generate collection schedules
    for (let i = 0; i < 20; i++) {
      const building = buildings[Math.floor(Math.random() * buildings.length)];
      const department = departments[Math.floor(Math.random() * (departments.length - 1)) + 1]; // Skip "All Departments"
      const date = new Date(today);
      date.setDate(date.getDate() + Math.floor(Math.random() * 14)); // Next 14 days
      
      schedules.push({
        id: `schedule-${i + 1}`,
        building,
        department,
        date: date.toISOString().split('T')[0],
        time: `${Math.floor(8 + Math.random() * 8)}:${Math.random() > 0.5 ? '00' : '30'}`,
        assignedTo: staffMembers[Math.floor(Math.random() * staffMembers.length)],
        status: ['pending', 'completed', 'cancelled'][Math.floor(Math.random() * 3)] as 'pending' | 'completed' | 'cancelled'
      });
    }

    // Generate staff reports
    for (let i = 0; i < 15; i++) {
      const staffName = staffMembers[Math.floor(Math.random() * staffMembers.length)];
      const building = buildings[Math.floor(Math.random() * buildings.length)];
      const date = new Date(today);
      date.setDate(date.getDate() - Math.floor(Math.random() * 7)); // Last 7 days
      
      reports.push({
        id: `report-${i + 1}`,
        staffName,
        date: date.toISOString().split('T')[0],
        building,
        wasteCollected: 100 + Math.random() * 400,
        issuesReported: Math.random() > 0.7 ? 'Low segregation rate in cafeteria' : '',
        status: ['submitted', 'reviewed'][Math.floor(Math.random() * 2)] as 'submitted' | 'reviewed'
      });
    }

    return { wasteRecords: records, schedules, reports };
  }, [buildings, departments, staffMembers]); // Added missing dependencies

  // Generate department waste data
  const generateDepartmentData = useCallback((records: WasteRecord[]): DepartmentWasteData[] => {
    const departmentMap: Record<string, DepartmentWasteData> = {};
    
    records.forEach(record => {
      if (!departmentMap[record.department]) {
        departmentMap[record.department] = {
          name: record.department,
          totalWaste: 0,
          recyclable: 0,
          nonRecyclable: 0,
          segregationRate: 0,
          co2Avoided: 0
        };
      }
      
      departmentMap[record.department].totalWaste += record.wasteKg;
      departmentMap[record.department].recyclable += record.recyclableKg;
      departmentMap[record.department].nonRecyclable += record.nonRecyclableKg;
      departmentMap[record.department].co2Avoided += record.co2Avoided;
    });
    
    // Calculate average segregation rate for each department
    Object.values(departmentMap).forEach(dept => {
      if (dept.totalWaste > 0) {
        dept.segregationRate = (dept.recyclable / dept.totalWaste) * 100;
      }
    });
    
    return Object.values(departmentMap);
  }, []);

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const { wasteRecords: mockRecords, schedules: mockSchedules, reports: mockReports } = generateMockData();
        setWasteRecords(mockRecords);
        setFilteredRecords(mockRecords);
        setDepartmentData(generateDepartmentData(mockRecords));
        setCollectionSchedules(mockSchedules);
        setStaffReports(mockReports);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [generateMockData, generateDepartmentData]);

  // Filter records based on search term, status, department, timeframe, and building
  useEffect(() => {
    let result = [...wasteRecords];
    
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
    
    // Apply building filter
    if (buildingFilter !== 'all' && buildingFilter !== 'All Buildings') {
      result = result.filter(record => record.building === buildingFilter);
    }
    
    // Apply timeframe filter
    if (timeframeFilter !== 'all') {
      const today = new Date();
      const filterDays = timeframeFilter === '7' ? 7 : 30;
      const cutoffDate = new Date(today);
      cutoffDate.setDate(today.getDate() - filterDays);
      
      result = result.filter(record => {
        const recordDate = new Date(record.date);
        return recordDate >= cutoffDate;
      });
    }
    
    setFilteredRecords(result);
    setDepartmentData(generateDepartmentData(result)); // Update department data based on filtered records
  }, [searchTerm, statusFilter, departmentFilter, buildingFilter, timeframeFilter, wasteRecords, generateDepartmentData]);

  // Handle record approval
  const handleApprove = (id: string) => {
    setWasteRecords(prev => 
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
    setWasteRecords(prev => 
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
    setWasteRecords(prev => prev.filter(record => record.id !== id));
    setFilteredRecords(prev => prev.filter(record => record.id !== id));
  };

  // Open edit modal
  const openEditModal = (record: WasteRecord) => {
    setSelectedRecord(record);
    setEditForm({
      wasteKg: record.wasteKg,
      recyclableKg: record.recyclableKg,
      nonRecyclableKg: record.nonRecyclableKg,
      segregationRate: record.segregationRate,
      co2Avoided: record.co2Avoided,
      status: record.status
    });
    setShowEditModal(true);
  };

  // Handle edit form submission
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedRecord) {
      const updatedRecords = wasteRecords.map(record => 
        record.id === selectedRecord.id 
          ? { 
              ...record, 
              wasteKg: editForm.wasteKg,
              recyclableKg: editForm.recyclableKg,
              nonRecyclableKg: editForm.nonRecyclableKg,
              segregationRate: editForm.segregationRate,
              co2Avoided: editForm.co2Avoided,
              status: editForm.status
            } 
          : record
      );
      
      setWasteRecords(updatedRecords);
      setFilteredRecords(updatedRecords);
      setDepartmentData(generateDepartmentData(updatedRecords));
      setShowEditModal(false);
      setSelectedRecord(null);
    }
  };

  // Handle schedule form submission
  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newSchedule: CollectionSchedule = {
      id: `schedule-${Date.now()}`,
      building: scheduleForm.building,
      department: scheduleForm.department,
      date: scheduleForm.date,
      time: scheduleForm.time,
      assignedTo: scheduleForm.assignedTo,
      status: 'pending'
    };
    
    setCollectionSchedules(prev => [...prev, newSchedule]);
    setScheduleForm({
      building: '',
      department: '',
      date: '',
      time: '',
      assignedTo: ''
    });
    setShowScheduleModal(false);
  };

  // Handle report form submission
  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newReport: StaffReport = {
      id: `report-${Date.now()}`,
      staffName: reportForm.staffName,
      date: new Date().toISOString().split('T')[0],
      building: reportForm.building,
      wasteCollected: reportForm.wasteCollected,
      issuesReported: reportForm.issuesReported,
      status: 'submitted'
    };
    
    setStaffReports(prev => [...prev, newReport]);
    setReportForm({
      staffName: '',
      building: '',
      wasteCollected: 0,
      issuesReported: ''
    });
    setShowReportModal(false);
  };

  // Export data as CSV
  const exportToCSV = () => {
    const headers = [
      'ID', 'User Name', 'User Email', 'Role', 'Department', 'Building', 
      'Date', 'Waste (kg)', 'Recyclable (kg)', 'Non-Recyclable (kg)', 'Segregation Rate (%)', 'CO2 Avoided (kg)', 'Status'
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
        record.wasteKg.toFixed(2),
        record.recyclableKg.toFixed(2),
        record.nonRecyclableKg.toFixed(2),
        record.segregationRate.toFixed(2),
        record.co2Avoided.toFixed(2),
        record.status
      ].map(field => `"${field}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'waste_records.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export data as PDF (simplified implementation)
  const exportToPDF = () => {
    alert('PDF export functionality would be implemented here. In a real application, this would generate a PDF report of the waste data.');
  };

  // Status badge component
  const StatusBadge: React.FC<{ status: 'pending' | 'approved' | 'rejected' | 'completed' | 'cancelled' | 'submitted' | 'reviewed' }> = ({ status }) => {
    const statusStyles = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-gray-100 text-gray-800',
      submitted: 'bg-blue-100 text-blue-800',
      reviewed: 'bg-purple-100 text-purple-800'
    };
    
    const statusText = {
      pending: 'Pending',
      approved: 'Approved',
      rejected: 'Rejected',
      completed: 'Completed',
      cancelled: 'Cancelled',
      submitted: 'Submitted',
      reviewed: 'Reviewed'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[status]}`}>
        {statusText[status]}
      </span>
    );
  };

  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FF6B6B', '#4ECDC4', '#1DD1A1', '#5F27CD'];

  // Generate forecast data (next 7 days)
  const generateForecastData = () => {
    const forecast = [];
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      
      // Calculate average daily waste from existing data
      const avgDailyWaste = wasteRecords.length > 0 
        ? wasteRecords.reduce((sum, record) => sum + record.wasteKg, 0) / wasteRecords.length 
        : 150;
      
      // Add some variation to the forecast
      const variation = 0.8 + Math.random() * 0.4; // 80-120% of average
      const forecastedWaste = avgDailyWaste * variation;
      
      forecast.push({
        date: date.toISOString().split('T')[0],
        waste: forecastedWaste,
        recyclable: forecastedWaste * 0.4, // 40% recyclable
        nonRecyclable: forecastedWaste * 0.6 // 60% non-recyclable
      });
    }
    
    return forecast;
  };

  // Get alerts for low segregation or high cafeteria waste
  const getAlerts = () => {
    const alerts = [];
    
    // Check for low segregation rates (< 30%)
    const lowSegregationRecords = wasteRecords.filter(record => record.segregationRate < 30);
    if (lowSegregationRecords.length > 0) {
      alerts.push({
        id: 'low-segregation',
        type: 'warning',
        message: `Low segregation rate detected in ${lowSegregationRecords.length} records. Average segregation rate is below 30%.`
      });
    }
    
    // Check for high cafeteria waste
    const cafeteriaRecords = wasteRecords.filter(record => 
      record.building.includes('Cafeteria') && record.wasteKg > 200
    );
    if (cafeteriaRecords.length > 5) {
      alerts.push({
        id: 'high-cafeteria',
        type: 'warning',
        message: `High waste generation detected in Cafeteria. ${cafeteriaRecords.length} records exceed 200kg.`
      });
    }
    
    return alerts;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
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

  const alerts = getAlerts();
  const forecastData = generateForecastData();

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Waste Management Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage waste records, collection schedules, and monitor waste reduction across departments
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

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">Alerts</h3>
              <div className="mt-2 text-sm text-yellow-700">
                <ul className="list-disc pl-5 space-y-1">
                  {alerts.map(alert => (
                    <li key={alert.id}>{alert.message}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="rounded-full bg-green-100 p-3">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Waste Collected</p>
              <p className="text-2xl font-semibold text-gray-900">
                {filteredRecords.reduce((sum, record) => sum + record.wasteKg, 0).toFixed(0)} <span className="text-sm">kg</span>
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="rounded-full bg-blue-100 p-3">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Segregation Rate</p>
              <p className="text-2xl font-semibold text-gray-900">
                {filteredRecords.length > 0 
                  ? (filteredRecords.reduce((sum, record) => sum + record.segregationRate, 0) / filteredRecords.length).toFixed(1) 
                  : 0} <span className="text-sm">%</span>
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
              <p className="text-sm font-medium text-gray-600">Waste Reduction</p>
              <p className="text-2xl font-semibold text-gray-900">
                {filteredRecords.length > 0 
                  ? (((filteredRecords[0]?.wasteKg || 0) - (filteredRecords[filteredRecords.length - 1]?.wasteKg || 0)) / (filteredRecords[0]?.wasteKg || 1) * 100).toFixed(1) 
                  : 0} <span className="text-sm">%</span>
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="rounded-full bg-teal-100 p-3">
              <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 104 0 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012 2v2.945M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">CO₂ Avoided</p>
              <p className="text-2xl font-semibold text-gray-900">
                {filteredRecords.reduce((sum, record) => sum + record.co2Avoided, 0).toFixed(0)} <span className="text-sm">kg</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Waste Generation Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Daily Waste Generation by Building
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={filteredRecords
                  .slice(0, 20)
                  .map(record => ({
                    building: record.building,
                    waste: record.wasteKg,
                    recyclable: record.recyclableKg,
                    nonRecyclable: record.nonRecyclableKg
                  }))}
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="building" 
                  angle={-45} 
                  textAnchor="end" 
                  height={60}
                  tick={{ fontSize: 10 }}
                />
                <YAxis tickFormatter={(value) => `${value} kg`} />
                <Tooltip 
                  formatter={(value) => [`${value} kg`, 'Waste']}
                  labelFormatter={(label) => `Building: ${label}`}
                />
                <Legend />
                <Bar dataKey="recyclable" name="Recyclable" fill="#10b981" />
                <Bar dataKey="nonRecyclable" name="Non-Recyclable" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Waste Distribution Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Waste Distribution by Department
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
                  dataKey="totalWaste"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {departmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} kg`, 'Waste']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Forecast Chart */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Waste Generation Forecast (Next 7 Days)
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={forecastData}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
              />
              <YAxis tickFormatter={(value) => `${value} kg`} />
              <Tooltip 
                formatter={(value) => [`${value} kg`, 'Waste']}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="waste" 
                name="Total Waste" 
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line 
                type="monotone" 
                dataKey="recyclable" 
                name="Recyclable" 
                stroke="#10b981" 
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line 
                type="monotone" 
                dataKey="nonRecyclable" 
                name="Non-Recyclable" 
                stroke="#ef4444" 
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input
              type="text"
              placeholder="Search by name, email, department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Timeframe</label>
            <select
              value={timeframeFilter}
              onChange={(e) => setTimeframeFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="all">All Time</option>
              <option value="7">Last 7 Days</option>
              <option value="30">Last 30 Days</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Building</label>
            <select
              value={buildingFilter}
              onChange={(e) => setBuildingFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {buildings.map(building => (
                <option key={building} value={building === 'All Buildings' ? 'all' : building}>{building}</option>
              ))}
            </select>
          </div>
          
          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setTimeframeFilter('all');
                setBuildingFilter('all');
                setDepartmentFilter('All Departments');
              }}
              className="w-full btn btn-secondary bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-md text-sm font-medium"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Waste Records Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Waste Records ({filteredRecords.length})
          </h3>
          <div className="mt-2 sm:mt-0">
            <button
              onClick={() => setShowScheduleModal(true)}
              className="btn btn-primary bg-green-600 text-white hover:bg-green-700 px-4 py-2 rounded-md text-sm font-medium"
            >
              Assign Collection Schedule
            </button>
          </div>
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
                  Waste (kg)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Recyclable (kg)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Segregation (%)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  CO₂ Avoided (kg)
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
                  <td colSpan={10} className="px-6 py-4 text-center text-sm text-gray-500">
                    No waste records found
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
                      {record.wasteKg.toFixed(0)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {record.recyclableKg.toFixed(0)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {record.segregationRate.toFixed(1)}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {record.co2Avoided.toFixed(0)}
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

      {/* Collection Schedules */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Collection Schedules ({collectionSchedules.length})
          </h3>
          <div className="mt-2 sm:mt-0">
            <button
              onClick={() => setShowScheduleModal(true)}
              className="btn btn-primary bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium"
            >
              Add Schedule
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Building
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assigned To
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
              {collectionSchedules.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                    No collection schedules found
                  </td>
                </tr>
              ) : (
                collectionSchedules.map((schedule) => (
                  <tr key={schedule.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {schedule.building}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {schedule.department}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {schedule.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {schedule.time}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {schedule.assignedTo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={schedule.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            const updatedSchedules = collectionSchedules.map(s => 
                              s.id === schedule.id ? { ...s, status: 'completed' } : s
                            ) as CollectionSchedule[];
                            setCollectionSchedules(updatedSchedules);
                          }}
                          className="text-green-600 hover:text-green-900"
                        >
                          Complete
                        </button>
                        <button
                          onClick={() => {
                            const updatedSchedules = collectionSchedules.filter(s => s.id !== schedule.id);
                            setCollectionSchedules(updatedSchedules);
                          }}
                          className="text-red-600 hover:text-red-900"
                        >
                          Cancel
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

      {/* Staff Reports */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Staff Reports ({staffReports.length})
          </h3>
          <div className="mt-2 sm:mt-0">
            <button
              onClick={() => setShowReportModal(true)}
              className="btn btn-primary bg-purple-600 text-white hover:bg-purple-700 px-4 py-2 rounded-md text-sm font-medium"
            >
              Submit Report
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Staff Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Building
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Waste Collected (kg)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Issues Reported
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
              {staffReports.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                    No staff reports found
                  </td>
                </tr>
              ) : (
                staffReports.map((report) => (
                  <tr key={report.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {report.staffName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {report.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {report.building}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {report.wasteCollected.toFixed(0)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {report.issuesReported || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={report.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            const updatedReports = staffReports.map(r => 
                              r.id === report.id ? { ...r, status: 'reviewed' } : r
                            ) as StaffReport[];
                            setStaffReports(updatedReports);
                          }}
                          className="text-purple-600 hover:text-purple-900"
                        >
                          Review
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
              <h3 className="text-lg font-medium text-gray-900">Edit Waste Record</h3>
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
                  <label htmlFor="wasteKg" className="block text-sm font-medium text-gray-700">
                    Total Waste (kg)
                  </label>
                  <input
                    type="number"
                    id="wasteKg"
                    value={editForm.wasteKg}
                    onChange={(e) => setEditForm({...editForm, wasteKg: parseFloat(e.target.value) || 0})}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    step="0.1"
                  />
                </div>
                <div>
                  <label htmlFor="recyclableKg" className="block text-sm font-medium text-gray-700">
                    Recyclable (kg)
                  </label>
                  <input
                    type="number"
                    id="recyclableKg"
                    value={editForm.recyclableKg}
                    onChange={(e) => setEditForm({...editForm, recyclableKg: parseFloat(e.target.value) || 0})}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    step="0.1"
                  />
                </div>
                <div>
                  <label htmlFor="segregationRate" className="block text-sm font-medium text-gray-700">
                    Segregation Rate (%)
                  </label>
                  <input
                    type="number"
                    id="segregationRate"
                    value={editForm.segregationRate}
                    onChange={(e) => setEditForm({...editForm, segregationRate: parseFloat(e.target.value) || 0})}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    step="0.1"
                    min="0"
                    max="100"
                  />
                </div>
                <div>
                  <label htmlFor="co2Avoided" className="block text-sm font-medium text-gray-700">
                    CO₂ Avoided (kg)
                  </label>
                  <input
                    type="number"
                    id="co2Avoided"
                    value={editForm.co2Avoided}
                    onChange={(e) => setEditForm({...editForm, co2Avoided: parseFloat(e.target.value) || 0})}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    step="0.1"
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
                  className="btn btn-primary bg-green-600 text-white hover:bg-green-700 px-4 py-2 rounded-md text-sm font-medium"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Schedule Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Assign Collection Schedule</h3>
            </div>
            <form onSubmit={handleScheduleSubmit}>
              <div className="px-6 py-4 space-y-4">
                <div>
                  <label htmlFor="building" className="block text-sm font-medium text-gray-700">
                    Building
                  </label>
                  <select
                    id="building"
                    value={scheduleForm.building}
                    onChange={(e) => setScheduleForm({...scheduleForm, building: e.target.value})}
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
                  <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                    Department
                  </label>
                  <select
                    id="department"
                    value={scheduleForm.department}
                    onChange={(e) => setScheduleForm({...scheduleForm, department: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    required
                  >
                    <option value="">Select a department</option>
                    {departments.filter(dept => dept !== 'All Departments').map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                    Date
                  </label>
                  <input
                    type="date"
                    id="date"
                    value={scheduleForm.date}
                    onChange={(e) => setScheduleForm({...scheduleForm, date: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="time" className="block text-sm font-medium text-gray-700">
                    Time
                  </label>
                  <input
                    type="time"
                    id="time"
                    value={scheduleForm.time}
                    onChange={(e) => setScheduleForm({...scheduleForm, time: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="assignedTo" className="block text-sm font-medium text-gray-700">
                    Assigned To
                  </label>
                  <select
                    id="assignedTo"
                    value={scheduleForm.assignedTo}
                    onChange={(e) => setScheduleForm({...scheduleForm, assignedTo: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    required
                  >
                    <option value="">Select staff member</option>
                    {staffMembers.map(staff => (
                      <option key={staff} value={staff}>{staff}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowScheduleModal(false)}
                  className="btn btn-secondary bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-md text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium"
                >
                  Assign Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Submit Staff Report</h3>
            </div>
            <form onSubmit={handleReportSubmit}>
              <div className="px-6 py-4 space-y-4">
                <div>
                  <label htmlFor="staffName" className="block text-sm font-medium text-gray-700">
                    Staff Name
                  </label>
                  <select
                    id="staffName"
                    value={reportForm.staffName}
                    onChange={(e) => setReportForm({...reportForm, staffName: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    required
                  >
                    <option value="">Select staff member</option>
                    {staffMembers.map(staff => (
                      <option key={staff} value={staff}>{staff}</option>
                    ))}
                  </select>
                </div>
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
                  <label htmlFor="wasteCollected" className="block text-sm font-medium text-gray-700">
                    Waste Collected (kg)
                  </label>
                  <input
                    type="number"
                    id="wasteCollected"
                    value={reportForm.wasteCollected}
                    onChange={(e) => setReportForm({...reportForm, wasteCollected: parseFloat(e.target.value) || 0})}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    step="0.1"
                    min="0"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="issuesReported" className="block text-sm font-medium text-gray-700">
                    Issues Reported
                  </label>
                  <textarea
                    id="issuesReported"
                    value={reportForm.issuesReported}
                    onChange={(e) => setReportForm({...reportForm, issuesReported: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    rows={3}
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
                  className="btn btn-primary bg-purple-600 text-white hover:bg-purple-700 px-4 py-2 rounded-md text-sm font-medium"
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

export default AdminWaste;
