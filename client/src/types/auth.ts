export interface User {
  id: string;
  email: string;
  displayName: string;
  role: 'admin' | 'faculty' | 'student';
  department: string;
  profilePicture?: string;
  preferences: {
    notifications: boolean;
    theme: 'light' | 'dark' | 'auto';
    language: string;
  };
  sustainabilityProfile: {
    totalPoints: number;
    level: number;
    badges: Badge[];
    achievements: Achievement[];
    goals: Goal[];
  };
  isActive: boolean;
  lastLogin: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Badge {
  name: string;
  description: string;
  imageUrl: string;
  earnedAt: Date;
}

export interface Achievement {
  title: string;
  description: string;
  points: number;
  completedAt: Date;
}

export interface Goal {
  type: 'energy' | 'water' | 'waste' | 'mobility';
  target: number;
  current: number;
  deadline: Date;
  status: 'active' | 'completed' | 'expired';
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  displayName: string;
  department: string;
  role?: 'admin' | 'faculty' | 'student';
}