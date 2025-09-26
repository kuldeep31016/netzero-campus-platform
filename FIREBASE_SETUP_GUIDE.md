# Firebase Setup Guide for Net Zero Campus

## Overview
This guide provides step-by-step instructions for setting up Firebase authentication and Firestore for the Net Zero Campus application.

## Prerequisites
- A Google account
- Node.js and npm installed
- The Net Zero Campus project code

## Step 1: Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter a project name (e.g., "Net Zero Campus")
4. Accept the terms and conditions
5. Disable Google Analytics (optional)
6. Click "Create project"

## Step 2: Register Your Web Application

1. In the Firebase Console, click the settings gear icon (Project settings)
2. Under "Your apps", click the web icon (</>)
3. Enter an app nickname (e.g., "Net Zero Campus Web")
4. Optionally, set up Firebase Hosting
5. Click "Register app"
6. Copy the Firebase configuration object - you'll need this later

## Step 3: Enable Authentication

1. In the Firebase Console, click "Authentication" in the left sidebar
2. Click the "Sign-in method" tab
3. Click "Email/Password"
4. Enable the first option ("Email/Password")
5. Click "Save"

## Step 4: Set Up Firestore Database

1. In the Firebase Console, click "Firestore Database" in the left sidebar
2. Click "Create database"
3. Select "Start in test mode" (for development only)
4. Choose a Cloud Firestore location
5. Click "Enable"

## Step 5: Configure Security Rules

1. In the Firebase Console, click "Firestore Database" in the left sidebar
2. Click the "Rules" tab
3. Replace the existing rules with the following:

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

4. Click "Publish"

## Step 6: Configure Environment Variables

1. Open the `client/.env` file in your project
2. Replace the placeholder values with your actual Firebase configuration:

```env
# Firebase Configuration - Replace with your actual Firebase project configuration
REACT_APP_FIREBASE_API_KEY=your_actual_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id

# Set this to 'false' to use real Firebase authentication
REACT_APP_USE_MOCK_AUTH=false

# API Configuration
REACT_APP_API_URL=http://localhost:5000/api
```

## Step 7: Install Dependencies

1. Open a terminal in the `client` directory
2. Run `npm install` to ensure all dependencies are installed

## Step 8: Test the Setup

1. Start the development server: `npm run start`
2. Open your browser to http://localhost:3000
3. Try registering a new user:
   - Click on any portal button (Student, Faculty, or Admin)
   - Fill out the registration form
   - Submit the form
4. Verify the user was created in Firestore:
   - Go to the Firebase Console
   - Click "Firestore Database"
   - Click "Data" tab
   - You should see a new user document in the "users" collection

## Troubleshooting

### 1. "Firebase: No Firebase App '[DEFAULT]' has been created" Error

This error occurs when the Firebase configuration is incorrect. Double-check that:

- All environment variables are correctly set in `.env`
- The `REACT_APP_USE_MOCK_AUTH` is set to `false`
- The Firebase configuration values match exactly what's in the Firebase Console

### 2. "Missing or insufficient permissions" Error

This error occurs when Firestore security rules are not properly configured. Ensure:

- You've updated the Firestore rules as described in Step 5
- The rules have been published
- You're using a properly authenticated user

### 3. Users Not Appearing in Firestore

If users are registering but not appearing in Firestore:

- Check the browser console for errors
- Verify that the Firestore rules allow write access
- Ensure the user is authenticated before attempting to write to Firestore

### 4. Environment Variables Not Loading

If environment variables don't seem to be loading:

- Restart the development server
- Ensure all variable names start with `REACT_APP_`
- Check for typos in the variable names

## Production Considerations

### 1. Security Rules

For production, you should enhance the Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read/write their own profile
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      allow create: if request.auth != null;
    }
    
    // Additional rules for other collections as needed
  }
}
```

### 2. Environment Variables

Never commit actual Firebase configuration to version control. Use environment variables or a separate configuration system for production.

### 3. Error Handling

Implement proper error handling in your application to gracefully handle Firebase errors and provide user-friendly messages.

## Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Authentication](https://firebase.google.com/docs/auth)
- [Cloud Firestore](https://firebase.google.com/docs/firestore)
- [Firebase Security Rules](https://firebase.google.com/docs/firestore/security/get-started)

## Support

If you encounter issues with the Firebase setup, please check:

1. The Firebase Console for any error messages
2. The browser's developer console for JavaScript errors
3. The terminal where you started the development server for any error messages