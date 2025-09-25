import { 
  onAuthStateChanged as realOnAuthStateChanged,
  registerUser as realRegisterUser,
  loginUser as realLoginUser,
  logoutUser as realLogoutUser,
  getCurrentUserProfile as realGetCurrentUserProfile,
  auth as realAuth,
  db as realDb,
  UserProfile as RealUserProfile,
  RegisterData as RealRegisterData,
  UserRole as RealUserRole
} from './firebase.real';

// Types
export type UserRole = RealUserRole;
export type UserProfile = RealUserProfile;
export type RegisterData = RealRegisterData;

// Check if we should use mock authentication
const useMockAuth = process.env.REACT_APP_USE_MOCK_AUTH === 'true';

// Mock user database
const mockUsers: UserProfile[] = [];
let currentUser: UserProfile | null = null;

// Auth state listeners
const authListeners: ((user: UserProfile | null) => void)[] = [];

const notifyAuthListeners = (user: UserProfile | null) => {
  currentUser = user;
  authListeners.forEach(callback => callback(user));
};

export const onAuthStateChanged = useMockAuth ? 
  (callback: (user: UserProfile | null) => void) => {
    authListeners.push(callback);
    // Immediately call with current state
    callback(currentUser);
    
    // Return unsubscribe function
    return () => {
      const index = authListeners.indexOf(callback);
      if (index > -1) {
        authListeners.splice(index, 1);
      }
    };
  } : realOnAuthStateChanged;

export const registerUser = useMockAuth ? 
  async (userData: RegisterData): Promise<UserProfile> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if user already exists
    const existingUser = mockUsers.find(user => user.email === userData.email);
    if (existingUser) {
      throw new Error('auth/email-already-in-use');
    }
    
    // Create new user
    const { password, ...profileData } = userData;
    const newUser: UserProfile = {
      uid: Math.random().toString(36).substr(2, 9),
      ...profileData,
      createdAt: new Date()
    };
    
    mockUsers.push(newUser);
    notifyAuthListeners(newUser);
    
    return newUser;
  } : realRegisterUser;

export const loginUser = useMockAuth ? 
  async (email: string, password: string): Promise<UserProfile> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Find user
    const user = mockUsers.find(u => u.email === email);
    if (!user) {
      throw new Error('auth/user-not-found');
    }
    
    // In a real app, you'd verify the password
    // For mock purposes, we'll just succeed
    notifyAuthListeners(user);
    
    return user;
  } : realLoginUser;

export const logoutUser = useMockAuth ? 
  async (): Promise<void> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    notifyAuthListeners(null);
  } : realLogoutUser;

export const getCurrentUserProfile = useMockAuth ? 
  async (): Promise<UserProfile | null> => {
    return currentUser;
  } : realGetCurrentUserProfile;

// Initialize with some demo users for testing (only in mock mode)
if (useMockAuth) {
  const demoUsers: UserProfile[] = [
    {
      uid: 'demo-student-1',
      email: 'student@university.edu',
      role: 'student',
      fullName: 'John Student',
      department: 'Computer Science',
      studentId: 'CS2024001',
      createdAt: new Date()
    },
    {
      uid: 'demo-faculty-1',
      email: 'faculty@university.edu',
      role: 'faculty',
      fullName: 'Dr. Jane Professor',
      department: 'Environmental Science',
      employeeId: 'FAC001',
      createdAt: new Date()
    },
    {
      uid: 'demo-admin-1',
      email: 'admin@university.edu',
      role: 'admin',
      fullName: 'Admin User',
      department: 'Administration',
      employeeId: 'ADM001',
      createdAt: new Date()
    }
  ];

  mockUsers.push(...demoUsers);

  console.log('🔧 Using mock authentication for development');
  console.log('💡 Demo credentials:');
  console.log('- Student: student@university.edu');
  console.log('- Faculty: faculty@university.edu'); 
  console.log('- Admin: admin@university.edu');
  console.log('(Any password will work in mock mode)');
}

// Export Firebase services
export const auth = useMockAuth ? null : realAuth;
export const db = useMockAuth ? null : realDb;