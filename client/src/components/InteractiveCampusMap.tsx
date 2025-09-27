import React, { useState } from 'react';

interface Building {
  id: string;
  name: string;
  coordinates: string; // SVG path coordinates
  energy: number;
  water: number;
  waste: number;
  mobility: number;
}

interface InteractiveCampusMapProps {
  onBuildingClick: (building: Building) => void;
}

const InteractiveCampusMap: React.FC<InteractiveCampusMapProps> = ({ onBuildingClick }) => {
  const [selectedMetric, setSelectedMetric] = useState<'energy' | 'water' | 'waste' | 'mobility'>('energy');
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);

  // Campus buildings based on typical DSCE layout - will be refined based on your actual map.jpeg
  const buildings: Building[] = [
    {
      id: 'B1',
      name: 'Arts, Science & Commerce Block',
      coordinates: 'M120,180 L280,180 L280,280 L120,280 Z',
      energy: 420,
      water: 65,
      waste: 12,
      mobility: 180
    },
    {
      id: 'B2',
      name: 'Dr. Premchandra Sagar Auditorium',
      coordinates: 'M320,140 L480,140 L480,200 L320,200 Z',
      energy: 280,
      water: 45,
      waste: 8,
      mobility: 120
    },
    {
      id: 'B3',
      name: 'Engineering Block',
      coordinates: 'M500,160 L680,160 L680,300 L500,300 Z',
      energy: 580,
      water: 85,
      waste: 18,
      mobility: 250
    },
    {
      id: 'B4',
      name: 'Central Library',
      coordinates: 'M150,320 L280,320 L280,420 L150,420 Z',
      energy: 220,
      water: 35,
      waste: 6,
      mobility: 150
    },
    {
      id: 'B5',
      name: 'Student Cafeteria',
      coordinates: 'M320,350 L450,350 L450,420 L320,420 Z',
      energy: 380,
      water: 95,
      waste: 25,
      mobility: 300
    },
    {
      id: 'B6',
      name: 'Sports Complex',
      coordinates: 'M500,340 L680,340 L680,480 L500,480 Z',
      energy: 320,
      water: 55,
      waste: 15,
      mobility: 200
    },
    {
      id: 'B7',
      name: 'Administrative Block',
      coordinates: 'M120,450 L280,450 L280,520 L120,520 Z',
      energy: 180,
      water: 25,
      waste: 5,
      mobility: 80
    }
  ];

  const getColorByMetric = (building: Building) => {
    const value = building[selectedMetric];
    // Color logic based on metric values
    if (selectedMetric === 'energy') {
      return value > 400 ? '#ef4444' : value > 300 ? '#f59e0b' : '#10b981';
    }
    if (selectedMetric === 'water') {
      return value > 60 ? '#ef4444' : value > 40 ? '#f59e0b' : '#3b82f6';
    }
    if (selectedMetric === 'waste') {
      return value > 15 ? '#ef4444' : value > 10 ? '#f59e0b' : '#8b5cf6';
    }
    if (selectedMetric === 'mobility') {
      return value > 100 ? '#ef4444' : value > 80 ? '#f59e0b' : '#06b6d4';
    }
    return '#6b7280';
  };

  const handleBuildingClick = (building: Building) => {
    setSelectedBuilding(building);
    onBuildingClick(building);
  };

  return (
    <div className="w-full">
      {/* Metric Toggle Buttons */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button 
          onClick={() => setSelectedMetric('energy')}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
            selectedMetric === 'energy' 
              ? 'bg-green-500 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-green-500 hover:text-white'
          }`}
        >
          🔋 Energy
        </button>
        <button 
          onClick={() => setSelectedMetric('water')}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
            selectedMetric === 'water' 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-blue-500 hover:text-white'
          }`}
        >
          💧 Water
        </button>
        <button 
          onClick={() => setSelectedMetric('waste')}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
            selectedMetric === 'waste' 
              ? 'bg-purple-500 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-purple-500 hover:text-white'
          }`}
        >
          🗑️ Waste
        </button>
        <button 
          onClick={() => setSelectedMetric('mobility')}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
            selectedMetric === 'mobility' 
              ? 'bg-orange-500 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-orange-500 hover:text-white'
          }`}
        >
          🚗 Mobility
        </button>
      </div>

      {/* Interactive Campus Map */}
      <div className="relative bg-white rounded-2xl overflow-hidden shadow-lg">
        <svg viewBox="0 0 800 600" className="w-full h-full">
          {/* Background Campus Image - Your actual map.jpeg */}
          <image 
            href="/images/map.jpeg" 
            x="0" 
            y="0" 
            width="800" 
            height="600" 
            opacity="0.6"
            preserveAspectRatio="xMidYMid slice"
          />
          
          {/* Clickable Building Polygons */}
          {buildings.map((building) => (
            <path
              key={building.id}
              d={building.coordinates}
              fill={getColorByMetric(building)}
              fillOpacity="0.7"
              stroke="#ffffff"
              strokeWidth="2"
              className="cursor-pointer transition-all duration-200 hover:fill-opacity-90 hover:stroke-width-3"
              onClick={() => handleBuildingClick(building)}
              onMouseEnter={(e) => {
                // Show tooltip on hover
                const rect = e.currentTarget.getBoundingClientRect();
                // Tooltip implementation here
              }}
            />
          ))}
          
          {/* Building Labels with calculated positions */}
          <text x="200" y="230" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold" className="pointer-events-none drop-shadow-lg">B1</text>
          <text x="400" y="170" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold" className="pointer-events-none drop-shadow-lg">B2</text>
          <text x="590" y="230" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold" className="pointer-events-none drop-shadow-lg">B3</text>
          <text x="215" y="370" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold" className="pointer-events-none drop-shadow-lg">B4</text>
          <text x="385" y="385" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold" className="pointer-events-none drop-shadow-lg">B5</text>
          <text x="590" y="410" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold" className="pointer-events-none drop-shadow-lg">B6</text>
          <text x="200" y="485" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold" className="pointer-events-none drop-shadow-lg">B7</text>
        </svg>
        
        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 text-xs">
          <h4 className="font-bold mb-2">Current View: {selectedMetric.charAt(0).toUpperCase() + selectedMetric.slice(1)}</h4>
          <div className="space-y-1">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
              <span>Low Usage</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-yellow-500 rounded mr-2"></div>
              <span>Moderate</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded mr-2"></div>
              <span>High Usage</span>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Building Info */}
      {selectedBuilding && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
          <h3 className="font-bold text-lg">{selectedBuilding.name}</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
            <div>
              <span className="text-sm text-gray-600">Energy:</span>
              <span className="font-semibold ml-2">{selectedBuilding.energy} kWh</span>
            </div>
            <div>
              <span className="text-sm text-gray-600">Water:</span>
              <span className="font-semibold ml-2">{selectedBuilding.water} L</span>
            </div>
            <div>
              <span className="text-sm text-gray-600">Waste:</span>
              <span className="font-semibold ml-2">{selectedBuilding.waste} kg</span>
            </div>
            <div>
              <span className="text-sm text-gray-600">Mobility:</span>
              <span className="font-semibold ml-2">{selectedBuilding.mobility} users</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InteractiveCampusMap;