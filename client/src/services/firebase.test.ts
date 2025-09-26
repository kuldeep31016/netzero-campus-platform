import { registerUser, loginUser, logoutUser, getCurrentUserProfile } from './firebase';

// Test the Firebase implementation
async function testFirebase() {
  try {
    console.log('Testing Firebase implementation...');
    
    // Test registration
    console.log('Testing user registration...');
    const userData = {
      email: 'test@example.com',
      password: 'password123',
      fullName: 'Test User',
      role: 'student' as const,
      department: 'Computer Science',
      studentId: 'CS123456'
    };
    
    const newUser = await registerUser(userData);
    console.log('Registration successful:', newUser);
    
    // Test login
    console.log('Testing user login...');
    const loggedInUser = await loginUser('test@example.com', 'password123');
    console.log('Login successful:', loggedInUser);
    
    // Test get current user
    console.log('Testing get current user...');
    const currentUser = await getCurrentUserProfile();
    console.log('Current user:', currentUser);
    
    // Test logout
    console.log('Testing user logout...');
    await logoutUser();
    console.log('Logout successful');
    
    // Verify logout
    const afterLogout = await getCurrentUserProfile();
    console.log('After logout:', afterLogout);
    
    console.log('All tests passed!');
  } catch (error) {
    console.error('Test failed:', error);
  }
}

// Run the test if this file is executed directly
if (typeof window !== 'undefined') {
  testFirebase();
}

export default testFirebase;