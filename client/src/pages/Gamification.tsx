import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

// Define types for our gamification features
interface LeaderboardEntry {
  id: string;
  name: string;
  value: number;
  unit: string;
  rank: number;
}

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  earned: boolean;
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  category: string;
  progress: number;
  target: number;
  reward: number;
  deadline: string;
}

interface ImpactWidget {
  id: string;
  title: string;
  description: string;
  icon: string;
  value: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string;
  points: number;
}

const Gamification: React.FC = () => {
  const { userProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('leaderboards');

  // Mock data for leaderboards
  const energyLeaderboard: LeaderboardEntry[] = [
    { id: '1', name: 'Alpha Hostel', value: 245, unit: 'kWh saved', rank: 1 },
    { id: '2', name: 'Beta Hostel', value: 220, unit: 'kWh saved', rank: 2 },
    { id: '3', name: 'Gamma Hostel', value: 200, unit: 'kWh saved', rank: 3 },
    { id: '4', name: 'You', value: 185, unit: 'kWh saved', rank: 4 },
  ];

  const waterLeaderboard: LeaderboardEntry[] = [
    { id: '1', name: 'Computer Science', value: 1250, unit: 'L saved', rank: 1 },
    { id: '2', name: 'Mechanical', value: 1100, unit: 'L saved', rank: 2 },
    { id: '3', name: 'Electrical', value: 980, unit: 'L saved', rank: 3 },
    { id: '4', name: 'You', value: 850, unit: 'L saved', rank: 5 },
  ];

  const mobilityLeaderboard: LeaderboardEntry[] = [
    { id: '1', name: 'Sarah Johnson', value: 15, unit: 'cycling trips', rank: 1 },
    { id: '2', name: 'Mike Chen', value: 12, unit: 'cycling trips', rank: 2 },
    { id: '3', name: 'Emma Wilson', value: 10, unit: 'cycling trips', rank: 3 },
    { id: '4', name: 'You', value: 8, unit: 'cycling trips', rank: 4 },
  ];

  const wasteLeaderboard: LeaderboardEntry[] = [
    { id: '1', name: 'Delta Hostel', value: 95, unit: '% segregation', rank: 1 },
    { id: '2', name: 'Epsilon Hostel', value: 92, unit: '% segregation', rank: 2 },
    { id: '3', name: 'Zeta Hostel', value: 89, unit: '% segregation', rank: 3 },
    { id: '4', name: 'You', value: 87, unit: '% segregation', rank: 4 },
  ];

  // Mock data for badges
  const badges: Badge[] = [
    { id: '1', name: 'Green Champion', description: 'Consistently reduced energy usage', icon: '🌱', color: 'bg-green-100 text-green-800', earned: true },
    { id: '2', name: 'Water Saver', description: 'Saved 500L of water this month', icon: '💧', color: 'bg-blue-100 text-blue-800', earned: true },
    { id: '3', name: 'Cycle Hero', description: 'Cycled to campus 10 times', icon: '🚴', color: 'bg-purple-100 text-purple-800', earned: true },
    { id: '4', name: 'Waste Warrior', description: 'Perfect waste segregation for a week', icon: '♻️', color: 'bg-yellow-100 text-yellow-800', earned: false },
    { id: '5', name: 'Eco Pioneer', description: 'First to complete 5 challenges', icon: '⭐', color: 'bg-indigo-100 text-indigo-800', earned: false },
    { id: '6', name: 'Sustainability Master', description: 'Completed all monthly challenges', icon: '🏆', color: 'bg-red-100 text-red-800', earned: false },
  ];

  // Mock data for challenges
  const challenges: Challenge[] = [
    { id: '1', title: 'Water Warrior', description: 'Reduce water use by 5 liters/day', category: 'Water', progress: 3, target: 7, reward: 50, deadline: '2023-06-15' },
    { id: '2', title: 'Cycle Champion', description: 'Cycle to class 3 times this week', category: 'Mobility', progress: 2, target: 3, reward: 75, deadline: '2023-06-12' },
    { id: '3', title: 'Energy Saver', description: 'Turn off lights when leaving rooms', category: 'Energy', progress: 5, target: 7, reward: 30, deadline: '2023-06-18' },
    { id: '4', title: 'Waste Wizard', description: 'Segregate waste perfectly for 5 days', category: 'Waste', progress: 2, target: 5, reward: 60, deadline: '2023-06-20' },
    { id: '5', title: 'Eco Explorer', description: 'Attend 2 sustainability workshops', category: 'Learning', progress: 1, target: 2, reward: 40, deadline: '2023-06-25' },
  ];

  // Mock data for impact widgets
  const impactWidgets: ImpactWidget[] = [
    { id: '1', title: 'Carbon Saved', description: 'Total CO₂ avoided', icon: '🌍', value: '120kg' },
    { id: '2', title: 'Water Saved', description: 'Total water conserved', icon: '🚰', value: '1,500L' },
    { id: '3', title: 'Waste Diverted', description: 'Total waste recycled', icon: '🗑️', value: '85kg' },
    { id: '4', title: 'Trees Equivalent', description: 'Equivalent to planting', icon: '🌳', value: '12 trees' },
  ];

  // Mock data for achievements
  const achievements: Achievement[] = [
    { id: '1', title: 'First Challenge', description: 'Completed your first sustainability challenge', date: '2023-05-15', points: 25 },
    { id: '2', title: 'Energy Saver', description: 'Reduced energy usage by 15%', date: '2023-05-22', points: 50 },
    { id: '3', title: 'Cycling Pro', description: 'Cycled to campus 5 times in a week', date: '2023-06-01', points: 75 },
    { id: '4', title: 'Water Conservation', description: 'Saved 200L of water in a week', date: '2023-06-08', points: 40 },
  ];

  // Function to get rank badge color
  const getRankBadgeColor = (rank: number) => {
    switch (rank) {
      case 1: return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 2: return 'bg-gray-100 text-gray-800 border-gray-300';
      case 3: return 'bg-amber-100 text-amber-800 border-amber-300';
      default: return 'bg-blue-100 text-blue-800 border-blue-300';
    }
  };

  // Function to get rank medal
  const getRankMedal = (rank: number) => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return '🏅';
    }
  };

  // Function to get category color
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Energy': return 'bg-green-100 text-green-800';
      case 'Water': return 'bg-blue-100 text-blue-800';
      case 'Waste': return 'bg-yellow-100 text-yellow-800';
      case 'Mobility': return 'bg-purple-100 text-purple-800';
      case 'Learning': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-purple-50 to-blue-50 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Gamification Center
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Earn points, compete with peers, and make a real impact
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <div className="bg-white rounded-xl shadow-md p-4 flex items-center">
            <div className="p-2 bg-yellow-100 rounded-full mr-3">
              <span className="text-xl">⭐</span>
            </div>
            <div>
              <p className="text-sm text-gray-600">Your Points</p>
              <p className="text-xl font-bold text-gray-900">1,250</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {['leaderboards', 'challenges', 'badges', 'achievements'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 px-1 text-sm font-medium border-b-2 ${
                activeTab === tab
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {/* Leaderboards Tab */}
        {activeTab === 'leaderboards' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Energy Leaderboard */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="mr-2">⚡</span> Energy Savers - This Week
              </h2>
              <div className="space-y-3">
                {energyLeaderboard.map(entry => (
                  <div 
                    key={entry.id} 
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      entry.name === 'You' 
                        ? 'bg-purple-50 border border-purple-200' 
                        : 'bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center">
                      <span className="mr-3 text-lg">{getRankMedal(entry.rank)}</span>
                      <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3 ${
                        getRankBadgeColor(entry.rank)
                      } border`}>
                        {entry.rank}
                      </span>
                      <span className="font-medium">{entry.name}</span>
                    </div>
                    <span className="text-gray-600">{entry.value} {entry.unit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Water Leaderboard */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="mr-2">💧</span> Water Conservation - This Month
              </h2>
              <div className="space-y-3">
                {waterLeaderboard.map(entry => (
                  <div 
                    key={entry.id} 
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      entry.name === 'You' 
                        ? 'bg-purple-50 border border-purple-200' 
                        : 'bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center">
                      <span className="mr-3 text-lg">{getRankMedal(entry.rank)}</span>
                      <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3 ${
                        getRankBadgeColor(entry.rank)
                      } border`}>
                        {entry.rank}
                      </span>
                      <span className="font-medium">{entry.name}</span>
                    </div>
                    <span className="text-gray-600">{entry.value} {entry.unit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Mobility Leaderboard */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="mr-2">🚴</span> Cycling Champions - This Month
              </h2>
              <div className="space-y-3">
                {mobilityLeaderboard.map(entry => (
                  <div 
                    key={entry.id} 
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      entry.name === 'You' 
                        ? 'bg-purple-50 border border-purple-200' 
                        : 'bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center">
                      <span className="mr-3 text-lg">{getRankMedal(entry.rank)}</span>
                      <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3 ${
                        getRankBadgeColor(entry.rank)
                      } border`}>
                        {entry.rank}
                      </span>
                      <span className="font-medium">{entry.name}</span>
                    </div>
                    <span className="text-gray-600">{entry.value} {entry.unit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Waste Leaderboard */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="mr-2">♻️</span> Waste Segregation - This Week
              </h2>
              <div className="space-y-3">
                {wasteLeaderboard.map(entry => (
                  <div 
                    key={entry.id} 
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      entry.name === 'You' 
                        ? 'bg-purple-50 border border-purple-200' 
                        : 'bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center">
                      <span className="mr-3 text-lg">{getRankMedal(entry.rank)}</span>
                      <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3 ${
                        getRankBadgeColor(entry.rank)
                      } border`}>
                        {entry.rank}
                      </span>
                      <span className="font-medium">{entry.name}</span>
                    </div>
                    <span className="text-gray-600">{entry.value} {entry.unit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Challenges Tab */}
        {activeTab === 'challenges' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Active Challenges</h2>
                <div className="space-y-4">
                  {challenges.map(challenge => (
                    <div key={challenge.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center">
                            <h3 className="font-semibold text-gray-900">{challenge.title}</h3>
                            <span className={`ml-2 text-xs px-2 py-1 rounded-full ${getCategoryColor(challenge.category)}`}>
                              {challenge.category}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{challenge.description}</p>
                        </div>
                        <span className="text-sm text-gray-500">Due: {challenge.deadline}</span>
                      </div>
                      <div className="mt-3">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progress: {challenge.progress}/{challenge.target}</span>
                          <span className="font-semibold text-green-600">+{challenge.reward} pts</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full" 
                            style={{ width: `${(challenge.progress / challenge.target) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {/* Impact Widgets */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <span className="mr-2">✨</span> Your Impact
                </h2>
                <div className="space-y-4">
                  {impactWidgets.map(widget => (
                    <div 
                      key={widget.id} 
                      className="flex items-center p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-100"
                    >
                      <span className="text-2xl mr-3">{widget.icon}</span>
                      <div>
                        <h3 className="font-semibold text-gray-900">{widget.title}</h3>
                        <p className="text-sm text-gray-700">{widget.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Personal Stats */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Your Stats</h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Challenges Completed</span>
                    <span className="font-semibold">12</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Current Streak</span>
                    <span className="font-semibold">7 days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Badges Earned</span>
                    <span className="font-semibold">3/6</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Badges Tab */}
        {activeTab === 'badges' && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Your Badges</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {badges.map(badge => (
                <div 
                  key={badge.id} 
                  className={`${badge.earned ? badge.color : 'bg-gray-100 text-gray-400'} rounded-lg p-4 text-center border ${
                    badge.earned ? 'border-gray-200' : 'border-gray-300'
                  }`}
                >
                  <div className="text-3xl mb-2">{badge.icon}</div>
                  <div className="font-semibold text-sm">{badge.name}</div>
                  <div className="text-xs mt-1 opacity-75">{badge.description}</div>
                  {!badge.earned && (
                    <div className="mt-2 text-xs text-gray-500">Locked</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Achievements Tab */}
        {activeTab === 'achievements' && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Your Achievements</h2>
            <div className="space-y-4">
              {achievements.map(achievement => (
                <div key={achievement.id} className="flex items-center p-4 border border-gray-200 rounded-lg">
                  <div className="p-3 bg-yellow-100 rounded-full mr-4">
                    <span className="text-xl">🏆</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{achievement.title}</h3>
                    <p className="text-sm text-gray-600">{achievement.description}</p>
                    <div className="flex items-center mt-1">
                      <span className="text-xs text-gray-500">{achievement.date}</span>
                      <span className="mx-2 text-gray-300">•</span>
                      <span className="text-xs font-semibold text-green-600">+{achievement.points} points</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Gamification;