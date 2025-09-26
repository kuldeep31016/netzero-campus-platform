import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  onAuthStateChanged as firebaseOnAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc
} from 'firebase/firestore';

// Types
export type UserRole = 'student' | 'faculty' | 'admin';

export interface UserProfile {
  uid: string;
  email: string;
  role: UserRole;
  fullName: string;
  department: string;
  studentId?: string;
  employeeId?: string;
  createdAt: Date;
}

export interface RegisterData {
  email: string;
  password: string;
  fullName: string;
  role: UserRole;
  department: string;
  studentId?: string;
  employeeId?: string;
}

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Auth state listeners
const authListeners: ((user: UserProfile | null) => void)[] = [];

const notifyAuthListeners = (user: UserProfile | null) => {
  authListeners.forEach(callback => callback(user));
};

export const onAuthStateChanged = (callback: (user: UserProfile | null) => void) => {
  authListeners.push(callback);
  
  // Return unsubscribe function
  return () => {
    const index = authListeners.indexOf(callback);
    if (index > -1) {
      authListeners.splice(index, 1);
    }
  };
};

// Convert Firebase user to our UserProfile
const firebaseUserToUserProfile = async (firebaseUser: FirebaseUser | null): Promise<UserProfile | null> => {
  if (!firebaseUser) return null;
  
  // Get user profile from Firestore
  const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
  
  if (userDoc.exists()) {
    const userData = userDoc.data();
    return {
      uid: firebaseUser.uid,
      email: firebaseUser.email || '',
      role: userData.role,
      fullName: userData.fullName,
      department: userData.department,
      studentId: userData.studentId,
      employeeId: userData.employeeId,
      createdAt: userData.createdAt?.toDate() || new Date()
    };
  }
  
  return null;
};

// Listen to Firebase auth state changes
firebaseOnAuthStateChanged(auth, async (firebaseUser) => {
  const userProfile = await firebaseUserToUserProfile(firebaseUser);
  notifyAuthListeners(userProfile);
});

export const registerUser = async (userData: RegisterData): Promise<UserProfile> => {
  try {
    // Create user with email and password
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      userData.email,
      userData.password
    );
    
    const { uid } = userCredential.user;
    
    // Save user profile to Firestore
    const userProfile: UserProfile = {
      uid,
      email: userData.email,
      role: userData.role,
      fullName: userData.fullName,
      department: userData.department,
      studentId: userData.studentId,
      employeeId: userData.employeeId,
      createdAt: new Date()
    };
    
    // Save to Firestore
    await setDoc(doc(db, 'users', uid), {
      ...userProfile,
      createdAt: new Date()
    });
    
    return userProfile;
  } catch (error: any) {
    throw new Error(error.message || 'Registration failed');
  }
};

export const loginUser = async (email: string, password: string): Promise<UserProfile> => {
  try {
    // Sign in with email and password
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    // Get user profile
    const userProfile = await firebaseUserToUserProfile(userCredential.user);
    
    if (!userProfile) {
      throw new Error('User profile not found');
    }
    
    return userProfile;
  } catch (error: any) {
    throw new Error(error.message || 'Login failed');
  }
};

export const logoutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error: any) {
    throw new Error(error.message || 'Logout failed');
  }
};

export const getCurrentUserProfile = async (): Promise<UserProfile | null> => {
  if (!auth.currentUser) return null;
  return firebaseUserToUserProfile(auth.currentUser);
};