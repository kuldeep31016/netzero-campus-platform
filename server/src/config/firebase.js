const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
const initializeFirebase = () => {
  try {
    // For development, use environment variables instead of service account file
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
        projectId: process.env.FIREBASE_PROJECT_ID,
      });
      console.log('🔥 Firebase Admin SDK initialized');
    }
    
    return admin;
  } catch (error) {
    console.error('Firebase initialization error:', error.message);
    // Return mock admin for development if Firebase is not configured
    if (process.env.NODE_ENV === 'development') {
      console.warn('⚠️  Running without Firebase in development mode');
      return {
        auth: () => ({
          verifyIdToken: async () => ({ uid: 'dev-user', email: 'dev@example.com' })
        })
      };
    }
    throw error;
  }
};

const firebaseAdmin = initializeFirebase();

module.exports = firebaseAdmin;