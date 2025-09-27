import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import StudentQuiz from '../components/dashboards/StudentQuiz';
import { useTranslation } from 'react-i18next';

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

// Define type for quiz leaderboard
interface QuizLeaderboardEntry {
  id: string;
  name: string;
  score: number;
  quiz: string;
  date: Date;
  rank: number;
}

const Gamification: React.FC = () => {
  const { userProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('leaderboards');
  const { t } = useTranslation();

  // Mock data for leaderboards
  const energyLeaderboard: LeaderboardEntry[] = [
    { id: '1', name: 'Alpha Hostel', value: 245, unit: t('common.kwh_unit') + ' ' + t('dashboard.kwh_saved'), rank: 1 },
    { id: '2', name: 'Beta Hostel', value: 220, unit: t('common.kwh_unit') + ' ' + t('dashboard.kwh_saved'), rank: 2 },
    { id: '3', name: 'Gamma Hostel', value: 200, unit: t('common.kwh_unit') + ' ' + t('dashboard.kwh_saved'), rank: 3 },
    { id: '4', name: 'You', value: 185, unit: t('common.kwh_unit') + ' ' + t('dashboard.kwh_saved'), rank: 4 },
  ];

  const waterLeaderboard: LeaderboardEntry[] = [
    { id: '1', name: 'Computer Science', value: 1250, unit: t('common.liters_unit') + ' ' + t('gamification.water_saved'), rank: 1 },
    { id: '2', name: 'Mechanical', value: 1100, unit: t('common.liters_unit') + ' ' + t('gamification.water_saved'), rank: 2 },
    { id: '3', name: 'Electrical', value: 980, unit: t('common.liters_unit') + ' ' + t('gamification.water_saved'), rank: 3 },
    { id: '4', name: 'You', value: 850, unit: t('common.liters_unit') + ' ' + t('gamification.water_saved'), rank: 5 },
  ];

  const mobilityLeaderboard: LeaderboardEntry[] = [
    { id: '1', name: 'Sarah Johnson', value: 15, unit: t('common.trips_unit'), rank: 1 },
    { id: '2', name: 'Mike Chen', value: 12, unit: t('common.trips_unit'), rank: 2 },
    { id: '3', name: 'Emma Wilson', value: 10, unit: t('common.trips_unit'), rank: 3 },
    { id: '4', name: 'You', value: 8, unit: t('common.trips_unit'), rank: 4 },
  ];

  const wasteLeaderboard: LeaderboardEntry[] = [
    { id: '1', name: 'Delta Hostel', value: 95, unit: t('common.percent_unit') + ' ' + t('gamification.waste_diverted'), rank: 1 },
    { id: '2', name: 'Epsilon Hostel', value: 92, unit: t('common.percent_unit') + ' ' + t('gamification.waste_diverted'), rank: 2 },
    { id: '3', name: 'Zeta Hostel', value: 89, unit: t('common.percent_unit') + ' ' + t('gamification.waste_diverted'), rank: 3 },
    { id: '4', name: 'You', value: 87, unit: t('common.percent_unit') + ' ' + t('gamification.waste_diverted'), rank: 4 },
  ];

  // Mock data for quiz leaderboard
  const quizLeaderboard: QuizLeaderboardEntry[] = [
    { id: '1', name: 'Alex Johnson', score: 95, quiz: 'Energy Conservation Basics', date: new Date('2023-05-15'), rank: 1 },
    { id: '2', name: 'Taylor Smith', score: 92, quiz: 'Water Conservation Quiz', date: new Date('2023-05-14'), rank: 2 },
    { id: '3', name: 'Jordan Williams', score: 88, quiz: 'Waste Reduction Challenge', date: new Date('2023-05-13'), rank: 3 },
    { id: '4', name: 'Casey Brown', score: 85, quiz: 'Sustainable Transportation', date: new Date('2023-05-12'), rank: 4 },
    { id: '5', name: 'Morgan Davis', score: 82, quiz: 'Advanced Energy Concepts', date: new Date('2023-05-11'), rank: 5 },
    { id: '6', name: 'Riley Miller', score: 79, quiz: 'Water Quality and Treatment', date: new Date('2023-05-10'), rank: 6 },
    { id: '7', name: 'Quinn Wilson', score: 76, quiz: 'Circular Economy Principles', date: new Date('2023-05-09'), rank: 7 },
    { id: '8', name: 'Parker Moore', score: 73, quiz: 'Urban Mobility Solutions', date: new Date('2023-05-08'), rank: 8 },
    { id: '9', name: 'Drew Taylor', score: 70, quiz: 'Energy Policy and Economics', date: new Date('2023-05-07'), rank: 9 },
    { id: '10', name: 'Skyler Anderson', score: 68, quiz: 'Water Governance and Management', date: new Date('2023-05-06'), rank: 10 },
  ];

  // Mock data for badges
  const badges: Badge[] = [
    { id: '1', name: t('gamification.badges'), description: t('gamification.earn_points'), icon: '🌱', color: 'bg-green-100 text-green-800', earned: true },
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
    { id: '1', title: t('gamification.carbon_saved'), description: 'Total CO₂ avoided', icon: '🌍', value: '120kg' },
    { id: '2', title: t('gamification.water_saved'), description: 'Total water conserved', icon: '🚰', value: '1,500L' },
    { id: '3', title: t('gamification.waste_diverted'), description: 'Total waste recycled', icon: '🗑️', value: '85kg' },
    { id: '4', title: t('gamification.trees_equivalent'), description: 'Equivalent to planting', icon: '🌳', value: '12 trees' },
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
            {t('gamification.center')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {t('gamification.earn_points')}
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <div className="bg-white rounded-xl shadow-md p-4 flex items-center">
            <div className="p-2 bg-yellow-100 rounded-full mr-3">
              <span className="text-xl">⭐</span>
            </div>
            <div>
              <p className="text-sm text-gray-600">{t('gamification.your_points')}</p>
              <p className="text-xl font-bold text-gray-900">1,250</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[t('gamification.leaderboards'), t('gamification.challenges'), t('gamification.badges'), t('gamification.achievements'), t('gamification.quiz')].map((tab, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(['leaderboards', 'challenges', 'badges', 'achievements', 'quiz'][index])}
              className={`py-4 px-1 text-sm font-medium border-b-2 ${
                activeTab === ['leaderboards', 'challenges', 'badges', 'achievements', 'quiz'][index]
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab}
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
                <span className="mr-2">⚡</span> {t('gamification.energy_savers')}
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
                <span className="mr-2">💧</span> {t('gamification.water_conservation')}
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
                <span className="mr-2">🚴</span> {t('gamification.cycling_champions')}
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
                <span className="mr-2">♻️</span> {t('gamification.waste_segregation')}
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

            {/* Quiz Leaderboard */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="mr-2">🏆</span> {t('gamification.quiz_champions')}
              </h2>
              <div className="space-y-3">
                {quizLeaderboard.map(entry => (
                  <div 
                    key={entry.id} 
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      entry.name === userProfile?.fullName 
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
                      <div>
                        <span className="font-medium">{entry.name}</span>
                        <p className="text-xs text-gray-500 truncate max-w-[120px]">{entry.quiz}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-semibold">{entry.score}%</span>
                      <p className="text-xs text-gray-500">
                        {entry.date.toLocaleDateString()}
                      </p>
                    </div>
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
                <h2 className="text-xl font-bold text-gray-900 mb-4">{t('gamification.active_challenges')}</h2>
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
                  <span className="mr-2">✨</span> {t('gamification.your_impact')}
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
                <h2 className="text-xl font-bold text-gray-900 mb-4">{t('gamification.your_stats')}</h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('gamification.challenges_completed')}</span>
                    <span className="font-semibold">12</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('gamification.current_streak')}</span>
                    <span className="font-semibold">7 {t('common.days_ago')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('gamification.badges_earned')}</span>
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
            <h2 className="text-xl font-bold text-gray-900 mb-4">{t('gamification.your_badges')}</h2>
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
                    <div className="mt-2 text-xs text-gray-500">{t('gamification.locked')}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Achievements Tab */}
        {activeTab === 'achievements' && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">{t('gamification.your_achievements')}</h2>
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

        {/* Quiz Tab */}
        {activeTab === 'quiz' && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <StudentQuiz />
          </div>
        )}
      </div>
    </div>
  );
};

export default Gamification;