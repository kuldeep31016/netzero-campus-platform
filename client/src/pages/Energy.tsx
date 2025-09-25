import React, { useState, useEffect } from 'react';
// TODO: Re-enable when Redux store is properly configured
// import { useSelector, useDispatch } from 'react-redux';
// import { RootState, AppDispatch } from '../store/store';

interface EnergyData {
  id: string;
  date: string;
  electricityUsage: number;
  renewableEnergy: number;
  carbonEmissions: number;
  cost: number;
  building: string;
  department: string;
}

const Energy: React.FC = () => {
  // TODO: Re-enable when Redux store is properly configured
  // const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(false);
  const [energyData, setEnergyData] = useState<EnergyData[]>([]);
  const [selectedBuilding, setSelectedBuilding] = useState('all');
  const [dateRange, setDateRange] = useState('7d');
  const [showAddModal, setShowAddModal] = useState(false);

  const [newReading, setNewReading] = useState({
    electricityUsage: '',
    renewableEnergy: '',
    building: '',
    department: '',
    date: new Date().toISOString().split('T')[0]
  });

  const buildings = [
    'Main Building',
    'Engineering Block',
    'Science Block',
    'Library',
    'Cafeteria',
    'Sports Complex',
    'Dormitory A',
    'Dormitory B'
  ];

  useEffect(() => {
    fetchEnergyData();
  }, [selectedBuilding, dateRange]);

  const fetchEnergyData = async () => {
    setLoading(true);
    try {
      // Mock data - replace with actual API call
      const mockData: EnergyData[] = [
        {
          id: '1',
          date: '2024-01-15',
          electricityUsage: 1250.5,
          renewableEnergy: 320.2,
          carbonEmissions: 425.3,
          cost: 187.50,
          building: 'Main Building',
          department: 'Administration'
        },
        {
          id: '2',
          date: '2024-01-14',
          electricityUsage: 1180.3,
          renewableEnergy: 298.5,
          carbonEmissions: 402.1,
          cost: 173.20,
          building: 'Engineering Block',
          department: 'Engineering'
        },
        // Add more mock data...
      ];
      setEnergyData(mockData);
    } catch (error) {
      console.error('Error fetching energy data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddReading = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // API call to add new reading
      console.log('Adding new reading:', newReading);
      
      // Reset form and close modal
      setNewReading({
        electricityUsage: '',
        renewableEnergy: '',
        building: '',
        department: '',
        date: new Date().toISOString().split('T')[0]
      });
      setShowAddModal(false);
      fetchEnergyData();
    } catch (error) {
      console.error('Error adding reading:', error);
    }
  };

  const calculateTotalUsage = () => {
    return energyData.reduce((sum, item) => sum + item.electricityUsage, 0);
  };

  const calculateTotalRenewable = () => {
    return energyData.reduce((sum, item) => sum + item.renewableEnergy, 0);
  };

  const calculateTotalEmissions = () => {
    return energyData.reduce((sum, item) => sum + item.carbonEmissions, 0);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Energy Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track electricity consumption and renewable energy usage
          </p>
        </div>
        
        <div className="mt-4 sm:mt-0 flex items-center space-x-4">
          <select
            value={selectedBuilding}
            onChange={(e) => setSelectedBuilding(e.target.value)}
            className="input text-sm"
          >
            <option value="all">All Buildings</option>
            {buildings.map(building => (
              <option key={building} value={building}>{building}</option>
            ))}
          </select>
          
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="input text-sm"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          
          <button
            onClick={() => setShowAddModal(true)}
            className="btn btn-primary btn-sm"
          >
            Add Reading
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900 rounded-md flex items-center justify-center">
                <span className="text-yellow-600 dark:text-yellow-400 text-lg">⚡</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Usage</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {calculateTotalUsage().toFixed(1)} kWh
              </p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-md flex items-center justify-center">
                <span className="text-green-600 dark:text-green-400 text-lg">🌱</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Renewable Energy</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {calculateTotalRenewable().toFixed(1)} kWh
              </p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-red-100 dark:bg-red-900 rounded-md flex items-center justify-center">
                <span className="text-red-600 dark:text-red-400 text-lg">💨</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">CO₂ Emissions</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {calculateTotalEmissions().toFixed(1)} kg
              </p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-md flex items-center justify-center">
                <span className="text-blue-600 dark:text-blue-400 text-lg">📊</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Efficiency</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {((calculateTotalRenewable() / calculateTotalUsage()) * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Energy Consumption Trends
        </h3>
        <div className="h-64 bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center justify-center">
          <p className="text-gray-500 dark:text-gray-400">
            Energy consumption chart will be rendered here
          </p>
        </div>
      </div>

      {/* Data Table */}
      <div className="card overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Recent Readings
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Building
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Electricity (kWh)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Renewable (kWh)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  CO₂ Emissions (kg)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Cost ($)
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {energyData.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {new Date(item.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {item.building}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {item.electricityUsage.toFixed(1)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 dark:text-green-400">
                    {item.renewableEnergy.toFixed(1)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 dark:text-red-400">
                    {item.carbonEmissions.toFixed(1)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    ${item.cost.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Reading Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" onClick={() => setShowAddModal(false)}>
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl will-change-transform transition-transform duration-300 ease-out sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleAddReading}>
                <div className="px-6 pt-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                    Add Energy Reading
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="form-group">
                      <label className="form-label">Date</label>
                      <input
                        type="date"
                        value={newReading.date}
                        onChange={(e) => setNewReading({...newReading, date: e.target.value})}
                        className="input"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Building</label>
                      <select
                        value={newReading.building}
                        onChange={(e) => setNewReading({...newReading, building: e.target.value})}
                        className="input"
                        required
                      >
                        <option value="">Select Building</option>
                        {buildings.map(building => (
                          <option key={building} value={building}>{building}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Department</label>
                      <input
                        type="text"
                        value={newReading.department}
                        onChange={(e) => setNewReading({...newReading, department: e.target.value})}
                        className="input"
                        placeholder="Department name"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Electricity Usage (kWh)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={newReading.electricityUsage}
                        onChange={(e) => setNewReading({...newReading, electricityUsage: e.target.value})}
                        className="input"
                        placeholder="0.0"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Renewable Energy (kWh)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={newReading.renewableEnergy}
                        onChange={(e) => setNewReading({...newReading, renewableEnergy: e.target.value})}
                        className="input"
                        placeholder="0.0"
                      />
                    </div>
                  </div>
                </div>

                <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Add Reading
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

export default Energy;