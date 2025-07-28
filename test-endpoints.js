// Quick test script to verify endpoints
const testEndpoints = async () => {
  const baseUrl = 'http://localhost:8080';
  
  try {
    // Test ping endpoint
    const pingResponse = await fetch(`${baseUrl}/api/ping`);
    const pingData = await pingResponse.json();
    console.log('✓ Ping endpoint working:', pingData);
    
    // Test login endpoint
    const loginResponse = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        employeeId: 'AUTH001',
        password: 'auth123',
        role: 'authority'
      }),
    });
    
    const loginData = await loginResponse.json();
    
    if (loginResponse.ok) {
      console.log('✓ Login endpoint working:', loginData.success);
      console.log('✓ User role:', loginData.data?.user?.role);
      console.log('✓ Token provided:', !!loginData.data?.token);
    } else {
      console.log('✗ Login failed:', loginData.error);
    }
    
  } catch (error) {
    console.error('✗ Test failed:', error.message);
  }
};

testEndpoints();
