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

// Initialize Firebase — guarded so a missing/invalid config (e.g. env vars
// not set on the deployment) can't crash the whole app at module load time.
// Callers see a clear error only when they actually try to use auth/db.
let firebaseApp: ReturnType<typeof initializeApp> | null = null;
let firebaseAuth: ReturnType<typeof getAuth> | null = null;
let firebaseDb: ReturnType<typeof getFirestore> | null = null;

if (firebaseConfig.apiKey) {
  try {
    firebaseApp = initializeApp(firebaseConfig);
    firebaseAuth = getAuth(firebaseApp);
    firebaseDb = getFirestore(firebaseApp);
  } catch (err) {
    console.error(
      'Firebase failed to initialize — check the REACT_APP_FIREBASE_* environment variables.',
      err,
    );
  }
} else {
  console.error(
    'Firebase config is missing (REACT_APP_FIREBASE_API_KEY not set). ' +
      'Set the REACT_APP_FIREBASE_* env vars, or set REACT_APP_USE_MOCK_AUTH=true to run without Firebase.',
  );
}

export const auth = firebaseAuth as ReturnType<typeof getAuth>;
export const db = firebaseDb as ReturnType<typeof getFirestore>;

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

// Listen to Firebase auth state changes (only when Firebase actually initialized)
if (auth) {
  firebaseOnAuthStateChanged(auth, async (firebaseUser) => {
    const userProfile = await firebaseUserToUserProfile(firebaseUser);
    notifyAuthListeners(userProfile);
  });
}

const requireFirebase = () => {
  if (!auth || !db) {
    throw new Error(
      'Firebase is not configured on this deployment. Set the REACT_APP_FIREBASE_* environment variables, or set REACT_APP_USE_MOCK_AUTH=true to use demo accounts.',
    );
  }
};

export const registerUser = async (userData: RegisterData): Promise<UserProfile> => {
  requireFirebase();
  try {
    // Create user with email and password
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      userData.email,
      userData.password
    );
    
    const { uid } = userCredential.user;
    
    // Create base user profile
    const baseUserProfile = {
      uid,
      email: userData.email,
      role: userData.role,
      fullName: userData.fullName,
      department: userData.department,
      createdAt: new Date()
    };
    
    // Add role-specific fields only if they exist
    const userProfile: UserProfile = {
      ...baseUserProfile,
      ...(userData.studentId && { studentId: userData.studentId }),
      ...(userData.employeeId && { employeeId: userData.employeeId })
    };
    
    // Save to Firestore (only save defined fields)
    const firestoreData: any = {
      uid,
      email: userData.email,
      role: userData.role,
      fullName: userData.fullName,
      department: userData.department,
      createdAt: new Date()
    };
    
    // Add role-specific fields only if they exist
    if (userData.studentId) {
      firestoreData.studentId = userData.studentId;
    }
    if (userData.employeeId) {
      firestoreData.employeeId = userData.employeeId;
    }
    
    await setDoc(doc(db, 'users', uid), firestoreData);
    
    return userProfile;
  } catch (error: any) {
    throw new Error(error.message || 'Registration failed');
  }
};

export const loginUser = async (email: string, password: string): Promise<UserProfile> => {
  requireFirebase();
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
  requireFirebase();
  try {
    await signOut(auth);
  } catch (error: any) {
    throw new Error(error.message || 'Logout failed');
  }
};

export const getCurrentUserProfile = async (): Promise<UserProfile | null> => {
  if (!auth || !auth.currentUser) return null;
  return firebaseUserToUserProfile(auth.currentUser);
};