# Firebase Implementation Summary

## Overview
This document summarizes the Firebase authentication implementation for the Net Zero Campus Platform. The implementation provides a flexible authentication system that supports both real Firebase authentication and mock authentication for development purposes.

## Key Features Implemented

### 1. Conditional Authentication System
- **Real Firebase Authentication**: When `REACT_APP_USE_MOCK_AUTH=false`
- **Mock Authentication**: When `REACT_APP_USE_MOCK_AUTH=true` (for development)

### 2. User Roles
- Student
- Faculty
- Admin

### 3. Authentication Operations
- User Registration
- User Login
- User Logout
- Auth State Monitoring
- User Profile Management

## File Structure

```
src/services/
├── firebase.ts          # Main authentication service (conditional implementation)
├── firebase.real.ts     # Real Firebase implementation
└── firebase.test.ts     # Test file for verification
```

## Implementation Details

### firebase.ts
This is the main authentication service that conditionally uses either the real Firebase implementation or the mock implementation based on the `REACT_APP_USE_MOCK_AUTH` environment variable.

### firebase.real.ts
This file contains the complete Firebase v9 SDK implementation:

1. **Firebase Initialization**
   - Configuration using environment variables
   - Authentication and Firestore service initialization

2. **User Registration**
   - Creates user with email and password
   - Stores user profile in Firestore
   - Handles role-based data storage

3. **User Login**
   - Authenticates user with email and password
   - Retrieves user profile from Firestore

4. **User Logout**
   - Signs out the current user

5. **Auth State Monitoring**
   - Listens to authentication state changes
   - Syncs with Firestore user profiles

### Environment Variables
The following environment variables are required for real Firebase authentication:

```env
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_USE_MOCK_AUTH=false
```

## User Data Structure

Users are stored in Firestore with the following structure:

```typescript
interface UserProfile {
  uid: string;
  email: string;
  role: 'student' | 'faculty' | 'admin';
  fullName: string;
  department: string;
  studentId?: string;      // Only for students
  employeeId?: string;     // Only for faculty/admin
  createdAt: Date;
}
```

## Security Rules

For production use, implement the following Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read/write their own profile
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Testing

A test file (`firebase.test.ts`) is included to verify the implementation:

```typescript
import { registerUser, loginUser, logoutUser, getCurrentUserProfile } from './firebase';

// Test functions
testFirebase(); // Runs registration, login, get current user, and logout operations
```

## Development vs Production

### Development Mode
- Set `REACT_APP_USE_MOCK_AUTH=true`
- No Firebase account required
- Data stored in memory (resets on refresh)
- Useful for UI development and testing

### Production Mode
- Set `REACT_APP_USE_MOCK_AUTH=false`
- Requires Firebase project setup
- Data stored in Firestore
- Full authentication and security features

## Integration with Existing Code

The implementation is fully compatible with the existing authentication context and components:

1. **AuthContext.tsx**: Automatically works with the new implementation
2. **AuthModal.tsx**: No changes required
3. **ProtectedRoute.tsx**: No changes required
4. **Landing.tsx**: No changes required

## Verification

The development server has been successfully started and the application is running at http://localhost:3000. The Firebase authentication system is ready for use with a real Firebase project.