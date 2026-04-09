import axios from 'axios';

const testBackend = async () => {
  try {
    console.log('Testing backend server...\n');
    
    // Test 1: Check if server is running
    console.log('1. Testing server root endpoint...');
    try {
      const rootResponse = await axios.get('http://localhost:3002/');
      console.log('✅ Server is running');
      console.log('Response:', rootResponse.data.message);
    } catch (error) {
      console.log('❌ Server is not running or not accessible');
      console.log('Error:', error.message);
      return;
    }
    
    // Test 2: Test learning routes
    console.log('\n2. Testing learning routes...');
    try {
      const projectsResponse = await axios.get('http://localhost:3002/api/learning/projects/test-user');
      console.log('✅ Learning routes are working');
      console.log('Projects count:', projectsResponse.data.projects.length);
    } catch (error) {
      console.log('❌ Learning routes are not working');
      console.log('Error:', error.response?.data || error.message);
    }
    
    // Test 3: Test delete route with fake IDs
    console.log('\n3. Testing delete directory route...');
    try {
      const deleteResponse = await axios.delete('http://localhost:3002/api/learning/project/fake-id/directory/fake-dir-id');
      console.log('✅ Delete route is accessible');
      console.log('Response:', deleteResponse.data);
    } catch (error) {
      if (error.response?.status === 404) {
        console.log('✅ Delete route is working (returned 404 for fake IDs as expected)');
        console.log('Error message:', error.response.data.message);
      } else {
        console.log('❌ Delete route has issues');
        console.log('Error:', error.response?.data || error.message);
      }
    }
    
    console.log('\n=== Test Complete ===');
  } catch (error) {
    console.error('Test failed:', error.message);
  }
};

testBackend();
