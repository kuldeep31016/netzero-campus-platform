# How to Use Firebase Authentication in Net Zero Campus

## Overview
This document explains how to use the Firebase authentication system in the Net Zero Campus application. The implementation supports both real Firebase authentication and mock authentication for development.

## Setting Up Firebase Authentication

### 1. Configure Environment Variables

Update the `client/.env` file with your Firebase configuration:

```env
# Firebase Configuration - Replace with your actual Firebase project configuration
# Get these from: https://console.firebase.google.com/
REACT_APP_FIREBASE_API_KEY=your_actual_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id

# Set this to 'true' to use mock authentication (no Firebase required)
# Set this to 'false' to use real Firebase authentication
REACT_APP_USE_MOCK_AUTH=false

# API Configuration
REACT_APP_API_URL=http://localhost:5000/api
```

### 2. Choose Authentication Mode

#### Development Mode (Mock Authentication)
- Set `REACT_APP_USE_MOCK_AUTH=true`
- No Firebase account required
- Useful for UI development and testing
- Data is stored in memory and resets on refresh

#### Production Mode (Real Firebase)
- Set `REACT_APP_USE_MOCK_AUTH=false`
- Requires a Firebase project setup
- Data is stored in Firestore
- Full authentication and security features

## Using Authentication in Components

### 1. Accessing Authentication State

Use the `useAuth` hook to access authentication state:

```typescript
import { useAuth } from '../contexts/AuthContext';

const MyComponent = () => {
  const { user, userProfile, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!user) {
    return <div>Please log in</div>;
  }
  
  return (
    <div>
      <h1>Welcome, {userProfile?.fullName}!</h1>
      <p>Your role: {userProfile?.role}</p>
    </div>
  );
};
```

### 2. Registering New Users

Use the `registerUser` function to register new users:

```typescript
import { registerUser } from '../services/firebase';

const handleRegistration = async () => {
  try {
    const userData = {
      email: 'user@example.com',
      password: 'password123',
      fullName: 'John Doe',
      role: 'student', // or 'faculty' or 'admin'
      department: 'Computer Science',
      studentId: 'CS123456' // Required for students
      // employeeId: 'EMP123456' // Required for faculty/admin
    };
    
    const newUser = await registerUser(userData);
    console.log('User registered:', newUser);
  } catch (error) {
    console.error('Registration failed:', error);
  }
};
```

### 3. Logging In Users

Use the `loginUser` function to authenticate existing users:

```typescript
import { loginUser } from '../services/firebase';

const handleLogin = async () => {
  try {
    const user = await loginUser('user@example.com', 'password123');
    console.log('User logged in:', user);
  } catch (error) {
    console.error('Login failed:', error);
  }
};
```

### 4. Logging Out Users

Use the `logoutUser` function to log out the current user:

```typescript
import { logoutUser } from '../services/firebase';

const handleLogout = async () => {
  try {
    await logoutUser();
    console.log('User logged out');
  } catch (error) {
    console.error('Logout failed:', error);
  }
};
```

## Role-Based Access Control

The application supports three user roles:
- `student`
- `faculty`
- `admin`

### Protecting Routes

Use the `ProtectedRoute` component to protect routes:

```typescript
import ProtectedRoute from './components/ProtectedRoute';

// Protect a route for all authenticated users
<Route path="/dashboard" element={
  <ProtectedRoute>
    <Dashboard />
  </ProtectedRoute>
} />

// Protect a route for specific roles only
<Route path="/admin" element={
  <ProtectedRoute requiredRole="admin">
    <AdminPanel />
  </ProtectedRoute>
} />
```

### Conditional Rendering Based on Role

```typescript
import { useAuth } from '../contexts/AuthContext';

const MyComponent = () => {
  const { userProfile } = useAuth();
  
  return (
    <div>
      {userProfile?.role === 'admin' && (
        <div>Admin-only content</div>
      )}
      
      {userProfile?.role === 'faculty' && (
        <div>Faculty-only content</div>
      )}
      
      {userProfile?.role === 'student' && (
        <div>Student-only content</div>
      )}
    </div>
  );
};
```

## Testing the Authentication System

### 1. Using Mock Authentication (Development)

When `REACT_APP_USE_MOCK_AUTH=true`:

- Use any email and password to log in
- Demo credentials are available:
  - Student: student@university.edu
  - Faculty: faculty@university.edu
  - Admin: admin@university.edu

### 2. Using Real Firebase Authentication

When `REACT_APP_USE_MOCK_AUTH=false`:

- Users must register with a valid email and password
- Firebase will enforce password strength requirements
- User data will be stored in Firestore

## Troubleshooting

### 1. Authentication Not Working

- Check that `REACT_APP_USE_MOCK_AUTH` is set correctly
- Verify Firebase configuration values in `.env`
- Ensure Firebase project has email/password authentication enabled
- Check browser console for error messages

### 2. Firestore Permission Errors

- Verify Firestore security rules are properly configured
- Ensure user is authenticated before accessing Firestore
- Check that the user has permission to read/write their own profile

### 3. Environment Variables Not Loading

- Restart the development server after changing `.env`
- Ensure environment variables are prefixed with `REACT_APP_`
- Check for typos in variable names

## Security Best Practices

1. **Never expose Firebase configuration** in client-side code for production
2. **Use Firebase security rules** to protect data in Firestore
3. **Validate user input** before sending to Firebase
4. **Handle errors gracefully** without exposing sensitive information
5. **Use HTTPS** in production environments

## Further Reading

- [Firebase Authentication Documentation](https://firebase.google.com/docs/auth)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase JavaScript SDK](https://firebase.google.com/docs/reference/js)