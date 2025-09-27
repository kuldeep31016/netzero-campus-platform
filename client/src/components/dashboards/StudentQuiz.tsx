import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

// Types
interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: string;
}

interface QuizSet {
  id: string;
  title: string;
  module: 'Energy' | 'Water' | 'Waste' | 'Mobility';
  questions: Question[];
}

interface LeaderboardEntry {
  id: string;
  name: string;
  score: number;
  rank: number;
  date: Date;
}

interface QuizResult {
  correctAnswers: number;
  incorrectAnswers: number;
  score: number;
  totalQuestions: number;
  percentage: number;
}

// Mock data
const mockQuizSets: QuizSet[] = [
  {
    id: 'energy-1',
    title: 'Energy Conservation Basics',
    module: 'Energy',
    questions: [
      {
        id: 'q1',
        text: 'Which of the following is the most energy-efficient lighting option?',
        options: ['Incandescent bulbs', 'LED bulbs', 'Fluorescent bulbs', 'Halogen bulbs'],
        correctAnswer: 'LED bulbs'
      },
      {
        id: 'q2',
        text: 'What percentage of energy does a typical incandescent bulb waste as heat?',
        options: ['50%', '75%', '90%', '95%'],
        correctAnswer: '90%'
      },
      {
        id: 'q3',
        text: 'Which appliance typically uses the most energy in a household?',
        options: ['Refrigerator', 'Washing machine', 'Television', 'Computer'],
        correctAnswer: 'Refrigerator'
      },
      {
        id: 'q4',
        text: 'What is the primary benefit of using a smart thermostat?',
        options: ['Increased comfort', 'Energy savings', 'Remote control', 'All of the above'],
        correctAnswer: 'All of the above'
      },
      {
        id: 'q5',
        text: 'Which renewable energy source generates the most electricity globally?',
        options: ['Solar', 'Wind', 'Hydroelectric', 'Geothermal'],
        correctAnswer: 'Hydroelectric'
      }
    ]
  },
  {
    id: 'water-1',
    title: 'Water Conservation Quiz',
    module: 'Water',
    questions: [
      {
        id: 'q1',
        text: 'How much water can you save by taking a 5-minute shower instead of a bath?',
        options: ['10-15 gallons', '20-25 gallons', '30-35 gallons', '40+ gallons'],
        correctAnswer: '20-25 gallons'
      },
      {
        id: 'q2',
        text: 'What percentage of the Earth\'s water is freshwater?',
        options: ['1%', '3%', '10%', '25%'],
        correctAnswer: '3%'
      },
      {
        id: 'q3',
        text: 'Which of the following uses the most water in a typical home?',
        options: ['Toilet flushing', 'Showering', 'Laundry', 'Dishwashing'],
        correctAnswer: 'Toilet flushing'
      },
      {
        id: 'q4',
        text: 'How often should you check for leaks in your home?',
        options: ['Monthly', 'Quarterly', 'Annually', 'Only when you notice a problem'],
        correctAnswer: 'Monthly'
      },
      {
        id: 'q5',
        text: 'What is greywater?',
        options: [
          'Water from toilets',
          'Water from sinks, showers, and washing machines',
          'Rainwater',
          'Bottled water'
        ],
        correctAnswer: 'Water from sinks, showers, and washing machines'
      }
    ]
  },
  {
    id: 'waste-1',
    title: 'Waste Reduction Challenge',
    module: 'Waste',
    questions: [
      {
        id: 'q1',
        text: 'What does the "3 R\'s" of waste management stand for?',
        options: [
          'Reduce, Reuse, Recycle',
          'Remove, Replace, Rebuild',
          'Renew, Restore, Revive',
          'Refuse, Reduce, Reuse'
        ],
        correctAnswer: 'Reduce, Reuse, Recycle'
      },
      {
        id: 'q2',
        text: 'Which material takes the longest to decompose in a landfill?',
        options: ['Paper', 'Plastic bags', 'Aluminum cans', 'Glass'],
        correctAnswer: 'Glass'
      },
      {
        id: 'q3',
        text: 'What percentage of waste can be composted?',
        options: ['10-20%', '30-40%', '50-60%', '70-80%'],
        correctAnswer: '30-40%'
      },
      {
        id: 'q4',
        text: 'Which of the following is NOT considered hazardous waste?',
        options: ['Batteries', 'Paint', 'Newspaper', 'Motor oil'],
        correctAnswer: 'Newspaper'
      },
      {
        id: 'q5',
        text: 'What is the most effective way to reduce packaging waste?',
        options: [
          'Buy products with minimal packaging',
          'Recycle all packaging',
          'Burn packaging materials',
          'Bury packaging in landfills'
        ],
        correctAnswer: 'Buy products with minimal packaging'
      }
    ]
  },
  {
    id: 'mobility-1',
    title: 'Sustainable Transportation',
    module: 'Mobility',
    questions: [
      {
        id: 'q1',
        text: 'Which mode of transportation has the lowest carbon footprint per mile?',
        options: ['Walking', 'Cycling', 'Bus', 'Electric car'],
        correctAnswer: 'Walking'
      },
      {
        id: 'q2',
        text: 'What percentage of urban air pollution is caused by transportation?',
        options: ['20%', '30%', '40%', '50%'],
        correctAnswer: '30%'
      },
      {
        id: 'q3',
        text: 'How much CO2 is typically saved by carpooling with one other person?',
        options: ['10%', '20%', '30%', '50%'],
        correctAnswer: '50%'
      },
      {
        id: 'q4',
        text: 'What is the main benefit of using public transportation?',
        options: [
          'Reduced traffic congestion',
          'Lower emissions per person',
          'Cost savings',
          'All of the above'
        ],
        correctAnswer: 'All of the above'
      },
      {
        id: 'q5',
        text: 'Which of the following is considered a "green" vehicle?',
        options: [
          'Gasoline-powered car',
          'Diesel truck',
          'Electric vehicle',
          'Motorcycle'
        ],
        correctAnswer: 'Electric vehicle'
      }
    ]
  },
  {
    id: 'energy-2',
    title: 'Advanced Energy Concepts',
    module: 'Energy',
    questions: [
      {
        id: 'q1',
        text: 'What is the main component of natural gas?',
        options: ['Ethane', 'Propane', 'Methane', 'Butane'],
        correctAnswer: 'Methane'
      },
      {
        id: 'q2',
        text: 'Which country is the largest producer of solar energy?',
        options: ['United States', 'Germany', 'China', 'India'],
        correctAnswer: 'China'
      },
      {
        id: 'q3',
        text: 'What is the efficiency of a typical solar panel?',
        options: ['10-15%', '15-20%', '20-25%', '25-30%'],
        correctAnswer: '15-20%'
      },
      {
        id: 'q4',
        text: 'What is the main advantage of nuclear energy?',
        options: [
          'Zero emissions',
          'Abundant fuel supply',
          'High energy density',
          'All of the above'
        ],
        correctAnswer: 'All of the above'
      },
      {
        id: 'q5',
        text: 'Which energy storage technology is most commonly used in electric vehicles?',
        options: ['Lead-acid batteries', 'Nickel-metal hydride batteries', 'Lithium-ion batteries', 'Flow batteries'],
        correctAnswer: 'Lithium-ion batteries'
      }
    ]
  },
  {
    id: 'water-2',
    title: 'Water Quality and Treatment',
    module: 'Water',
    questions: [
      {
        id: 'q1',
        text: 'What is the primary source of drinking water for most cities?',
        options: ['Rivers', 'Lakes', 'Groundwater', 'Oceans'],
        correctAnswer: 'Groundwater'
      },
      {
        id: 'q2',
        text: 'Which of the following is a common method for water purification?',
        options: ['Boiling', 'Chlorination', 'Filtration', 'All of the above'],
        correctAnswer: 'All of the above'
      },
      {
        id: 'q3',
        text: 'What is the main cause of water scarcity?',
        options: [
          'Climate change',
          'Population growth',
          'Pollution',
          'All of the above'
        ],
        correctAnswer: 'All of the above'
      },
      {
        id: 'q4',
        text: 'What percentage of the human body is water?',
        options: ['40%', '50%', '60%', '70%'],
        correctAnswer: '60%'
      },
      {
        id: 'q5',
        text: 'Which water treatment process removes dissolved salts?',
        options: ['Filtration', 'Distillation', 'Desalination', 'Chlorination'],
        correctAnswer: 'Desalination'
      }
    ]
  },
  {
    id: 'waste-2',
    title: 'Circular Economy Principles',
    module: 'Waste',
    questions: [
      {
        id: 'q1',
        text: 'What is the main goal of a circular economy?',
        options: [
          'Maximize production',
          'Eliminate waste',
          'Increase consumption',
          'Reduce costs'
        ],
        correctAnswer: 'Eliminate waste'
      },
      {
        id: 'q2',
        text: 'Which of the following is an example of upcycling?',
        options: [
          'Turning plastic bottles into clothing',
          'Melting glass to make new bottles',
          'Compressing paper to make new paper',
          'Breaking down organic waste for compost'
        ],
        correctAnswer: 'Turning plastic bottles into clothing'
      },
      {
        id: 'q3',
        text: 'What is the concept of "extended producer responsibility"?',
        options: [
          'Producers must pay for disposal of their products',
          'Producers are responsible for the entire lifecycle of their products',
          'Producers must recycle all their packaging',
          'Producers must reduce their carbon footprint'
        ],
        correctAnswer: 'Producers are responsible for the entire lifecycle of their products'
      },
      {
        id: 'q4',
        text: 'Which sector generates the most waste globally?',
        options: ['Agriculture', 'Manufacturing', 'Construction', 'Households'],
        correctAnswer: 'Construction'
      },
      {
        id: 'q5',
        text: 'What is the main benefit of industrial symbiosis?',
        options: [
          'Reduced production costs',
          'Increased efficiency',
          'Waste reduction',
          'All of the above'
        ],
        correctAnswer: 'All of the above'
      }
    ]
  },
  {
    id: 'mobility-2',
    title: 'Urban Mobility Solutions',
    module: 'Mobility',
    questions: [
      {
        id: 'q1',
        text: 'What is the main advantage of bike-sharing systems?',
        options: [
          'Reduced traffic congestion',
          'Improved air quality',
          'Increased accessibility',
          'All of the above'
        ],
        correctAnswer: 'All of the above'
      },
      {
        id: 'q2',
        text: 'Which city is known for having the best public transportation system?',
        options: ['New York', 'Tokyo', 'London', 'Singapore'],
        correctAnswer: 'Tokyo'
      },
      {
        id: 'q3',
        text: 'What is the main challenge for electric vehicle adoption?',
        options: [
          'High purchase price',
          'Limited charging infrastructure',
          'Short driving range',
          'All of the above'
        ],
        correctAnswer: 'All of the above'
      },
      {
        id: 'q4',
        text: 'What is a "15-minute city" concept?',
        options: [
          'A city where everything is within a 15-minute walk or bike ride',
          'A city with 15-minute bus intervals',
          'A city with 15 public transportation lines',
          'A city that can be crossed in 15 minutes'
        ],
        correctAnswer: 'A city where everything is within a 15-minute walk or bike ride'
      },
      {
        id: 'q5',
        text: 'Which mode of transportation has the highest capacity?',
        options: ['Car', 'Bus', 'Train', 'Bicycle'],
        correctAnswer: 'Train'
      }
    ]
  },
  {
    id: 'energy-3',
    title: 'Energy Policy and Economics',
    module: 'Energy',
    questions: [
      {
        id: 'q1',
        text: 'What is the main driver of renewable energy growth?',
        options: [
          'Government subsidies',
          'Technological improvements',
          'Public awareness',
          'Decreasing costs'
        ],
        correctAnswer: 'Decreasing costs'
      },
      {
        id: 'q2',
        text: 'Which country has the highest carbon price?',
        options: ['Sweden', 'Germany', 'Canada', 'United Kingdom'],
        correctAnswer: 'Sweden'
      },
      {
        id: 'q3',
        text: 'What is the main goal of energy efficiency standards?',
        options: [
          'Reduce energy consumption',
          'Lower utility bills',
          'Reduce greenhouse gas emissions',
          'All of the above'
        ],
        correctAnswer: 'All of the above'
      },
      {
        id: 'q4',
        text: 'Which sector consumes the most energy globally?',
        options: ['Transportation', 'Industry', 'Residential', 'Commercial'],
        correctAnswer: 'Industry'
      },
      {
        id: 'q5',
        text: 'What is the main benefit of smart grids?',
        options: [
          'Improved reliability',
          'Better integration of renewables',
          'Demand response capabilities',
          'All of the above'
        ],
        correctAnswer: 'All of the above'
      }
    ]
  },
  {
    id: 'water-3',
    title: 'Water Governance and Management',
    module: 'Water',
    questions: [
      {
        id: 'q1',
        text: 'What is the main challenge for global water governance?',
        options: [
          'Transboundary water disputes',
          'Climate change impacts',
          'Population growth',
          'Pollution'
        ],
        correctAnswer: 'Transboundary water disputes'
      },
      {
        id: 'q2',
        text: 'Which international agreement governs the use of international waters?',
        options: [
          'Paris Agreement',
          'UN Watercourses Convention',
          'Kyoto Protocol',
          'Montreal Protocol'
        ],
        correctAnswer: 'UN Watercourses Convention'
      },
      {
        id: 'q3',
        text: 'What is the main principle of integrated water resources management?',
        options: [
          'Centralized management',
          'Sectoral approach',
          'Holistic approach',
          'Market-based approach'
        ],
        correctAnswer: 'Holistic approach'
      },
      {
        id: 'q4',
        text: 'Which organization is the main UN agency for water issues?',
        options: [
          'WHO',
          'UNEP',
          'UNESCO',
          'UN-Water'
        ],
        correctAnswer: 'UN-Water'
      },
      {
        id: 'q5',
        text: 'What is the main goal of water footprint assessment?',
        options: [
          'Measure water consumption',
          'Assess water pollution',
          'Evaluate water scarcity',
          'Quantify water use along supply chains'
        ],
        correctAnswer: 'Quantify water use along supply chains'
      }
    ]
  }
];

const mockLeaderboard: LeaderboardEntry[] = [
  { id: '1', name: 'Alex Johnson', score: 95, rank: 1, date: new Date('2023-05-15') },
  { id: '2', name: 'Taylor Smith', score: 92, rank: 2, date: new Date('2023-05-14') },
  { id: '3', name: 'Jordan Williams', score: 88, rank: 3, date: new Date('2023-05-13') },
  { id: '4', name: 'Casey Brown', score: 85, rank: 4, date: new Date('2023-05-12') },
  { id: '5', name: 'Morgan Davis', score: 82, rank: 5, date: new Date('2023-05-11') },
  { id: '6', name: 'Riley Miller', score: 79, rank: 6, date: new Date('2023-05-10') },
  { id: '7', name: 'Quinn Wilson', score: 76, rank: 7, date: new Date('2023-05-09') },
  { id: '8', name: 'Parker Moore', score: 73, rank: 8, date: new Date('2023-05-08') },
  { id: '9', name: 'Drew Taylor', score: 70, rank: 9, date: new Date('2023-05-07') },
  { id: '10', name: 'Skyler Anderson', score: 68, rank: 10, date: new Date('2023-05-06') }
];

const StudentQuiz: React.FC = () => {
  const { userProfile } = useAuth();
  const [quizSets] = useState<QuizSet[]>(mockQuizSets);
  const [selectedQuiz, setSelectedQuiz] = useState<QuizSet | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [showResults, setShowResults] = useState(false);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [leaderboard] = useState<LeaderboardEntry[]>(mockLeaderboard);
  const [userRank, setUserRank] = useState<number | null>(null);

  // Reset quiz when selected quiz changes
  useEffect(() => {
    if (selectedQuiz) {
      setCurrentQuestionIndex(0);
      setAnswers({});
      setShowResults(false);
      setResult(null);
    }
  }, [selectedQuiz]);

  const handleAnswerSelect = (option: string) => {
    setAnswers(prev => ({
      ...prev,
      [selectedQuiz?.questions[currentQuestionIndex].id || '']: option
    }));
  };

  const handleNextQuestion = () => {
    if (selectedQuiz && currentQuestionIndex < selectedQuiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmitQuiz = () => {
    if (!selectedQuiz) return;

    let correctAnswers = 0;
    selectedQuiz.questions.forEach(question => {
      if (answers[question.id] === question.correctAnswer) {
        correctAnswers++;
      }
    });

    const totalQuestions = selectedQuiz.questions.length;
    const score = Math.round((correctAnswers / totalQuestions) * 100);
    
    setResult({
      correctAnswers,
      incorrectAnswers: totalQuestions - correctAnswers,
      score,
      totalQuestions,
      percentage: score
    });

    setShowResults(true);
    
    // Update leaderboard (mock implementation)
    const newUserRank = score >= 90 ? 1 : score >= 80 ? 3 : score >= 70 ? 5 : 10;
    setUserRank(newUserRank);
  };

  const handleRestartQuiz = () => {
    setSelectedQuiz(null);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setShowResults(false);
    setResult(null);
    setUserRank(null);
  };

  const progress = selectedQuiz 
    ? Math.round(((currentQuestionIndex + 1) / selectedQuiz.questions.length) * 100) 
    : 0;

  // Conditional rendering based on user role
  if (userProfile?.role !== 'student') {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Student Quiz</h2>
        <p className="text-gray-600">This section is only available for students.</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Sustainability Quiz Challenge</h2>
      
      {!selectedQuiz ? (
        // Quiz Selection View
        <div>
          <p className="text-gray-600 mb-6">
            Test your knowledge on sustainability topics! Select a quiz below to get started.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {quizSets.map(quiz => (
              <div 
                key={quiz.id}
                className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer bg-gradient-to-br from-green-50 to-blue-50"
                onClick={() => setSelectedQuiz(quiz)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{quiz.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {quiz.questions.length} questions • {quiz.module}
                    </p>
                  </div>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                    {quiz.module}
                  </span>
                </div>
                <div className="mt-4 flex items-center">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${Math.random() * 40 + 60}%` }}
                    ></div>
                  </div>
                  <span className="ml-2 text-xs text-gray-500">Popular</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : showResults && result ? (
        // Results View
        <div>
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">{selectedQuiz.title}</h3>
            <div className="inline-block bg-gradient-to-r from-green-400 to-blue-500 text-white px-6 py-8 rounded-xl shadow-lg">
              <p className="text-lg mb-2">Your Score</p>
              <p className="text-5xl font-bold">{result.score}%</p>
              <p className="mt-2">
                {result.correctAnswers} correct out of {result.totalQuestions} questions
              </p>
            </div>
            
            {/* Badges */}
            <div className="mt-6">
              {result.percentage >= 90 && (
                <div className="inline-flex items-center bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full mr-2">
                  <span className="text-xl mr-2">🏆</span>
                  <span className="font-semibold">Quiz Master</span>
                </div>
              )}
              {userRank && userRank <= 3 && (
                <div className="inline-flex items-center bg-purple-100 text-purple-800 px-4 py-2 rounded-full">
                  <span className="text-xl mr-2">🌟</span>
                  <span className="font-semibold">Sustainability Pro</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-green-50 p-6 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">Correct Answers</h4>
              <p className="text-3xl font-bold text-green-600">{result.correctAnswers}</p>
            </div>
            <div className="bg-red-50 p-6 rounded-lg">
              <h4 className="font-semibold text-red-800 mb-2">Incorrect Answers</h4>
              <p className="text-3xl font-bold text-red-600">{result.incorrectAnswers}</p>
            </div>
          </div>
          
          <div className="flex justify-center space-x-4">
            <button
              onClick={handleRestartQuiz}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Take Another Quiz
            </button>
          </div>
          
          {/* Leaderboard */}
          <div className="mt-10">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Quiz Leaderboard</h3>
            <div className="bg-gray-50 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-3 px-4 text-left text-gray-600 font-semibold">Rank</th>
                    <th className="py-3 px-4 text-left text-gray-600 font-semibold">Name</th>
                    <th className="py-3 px-4 text-left text-gray-600 font-semibold">Score</th>
                    <th className="py-3 px-4 text-left text-gray-600 font-semibold">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((entry) => (
                    <tr 
                      key={entry.id} 
                      className={`border-b border-gray-200 ${entry.name === userProfile?.fullName ? 'bg-blue-50 font-medium' : ''}`}
                    >
                      <td className="py-3 px-4">
                        {entry.rank <= 3 ? (
                          <span className="font-bold text-yellow-600">#{entry.rank}</span>
                        ) : (
                          <span className="text-gray-600">#{entry.rank}</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {entry.name}
                        {entry.name === userProfile?.fullName && (
                          <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">You</span>
                        )}
                      </td>
                      <td className="py-3 px-4 font-medium">{entry.score}%</td>
                      <td className="py-3 px-4 text-gray-600">
                        {entry.date.toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {userRank && (
              <div className="mt-4 text-center text-gray-600">
                <p>
                  {userRank <= 3 
                    ? `Congratulations! You're ranked #${userRank} on the leaderboard!` 
                    : `Keep practicing to improve your rank!`}
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        // Quiz Taking View
        <div>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-800">{selectedQuiz.title}</h3>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
              {selectedQuiz.module}
            </span>
          </div>
          
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Question {currentQuestionIndex + 1} of {selectedQuiz.questions.length}</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-green-400 to-blue-500 h-3 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
          
          {/* Question */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h4 className="text-lg font-medium text-gray-800 mb-4">
              {selectedQuiz.questions[currentQuestionIndex].text}
            </h4>
            
            <div className="space-y-3">
              {selectedQuiz.questions[currentQuestionIndex].options.map((option, index) => (
                <button
                  key={index}
                  className={`w-full text-left p-4 rounded-lg border transition-colors ${
                    answers[selectedQuiz.questions[currentQuestionIndex].id] === option
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-green-300 hover:bg-green-50'
                  }`}
                  onClick={() => handleAnswerSelect(option)}
                >
                  <div className="flex items-center">
                    <div className={`w-6 h-6 rounded-full border mr-3 flex items-center justify-center ${
                      answers[selectedQuiz.questions[currentQuestionIndex].id] === option
                        ? 'border-green-500 bg-green-500'
                        : 'border-gray-300'
                    }`}>
                      {answers[selectedQuiz.questions[currentQuestionIndex].id] === option && (
                        <span className="text-white text-sm">✓</span>
                      )}
                    </div>
                    <span>{option}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
          
          {/* Navigation */}
          <div className="flex justify-between">
            <button
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
              className={`px-5 py-2 rounded-lg ${
                currentQuestionIndex === 0
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Previous
            </button>
            
            {currentQuestionIndex < selectedQuiz.questions.length - 1 ? (
              <button
                onClick={handleNextQuestion}
                disabled={!answers[selectedQuiz.questions[currentQuestionIndex].id]}
                className={`px-5 py-2 rounded-lg ${
                  !answers[selectedQuiz.questions[currentQuestionIndex].id]
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmitQuiz}
                disabled={!answers[selectedQuiz.questions[currentQuestionIndex].id]}
                className={`px-5 py-2 rounded-lg ${
                  !answers[selectedQuiz.questions[currentQuestionIndex].id]
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                Submit Quiz
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentQuiz;