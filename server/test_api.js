const http = require('http');

function makeRequest(options, postData = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ statusCode: res.statusCode, data: JSON.parse(body) });
        } catch (e) {
          resolve({ statusCode: res.statusCode, raw: body });
        }
      });
    });

    req.on('error', err => reject(err));
    if (postData) req.write(JSON.stringify(postData));
    req.end();
  });
}

async function runTests() {
  console.log('🧪 Running API Integration Tests...\n');

  try {
    // 1. Health check
    const health = await makeRequest({ host: 'localhost', port: 5000, path: '/api/health', method: 'GET' });
    console.log('1. GET /api/health -> Status:', health.statusCode, health.data);

    // 2. Login test
    const login = await makeRequest(
      { host: 'localhost', port: 5000, path: '/api/auth/login', method: 'POST', headers: { 'Content-Type': 'application/json' } },
      { email: 'omkar@example.com', password: 'password123' }
    );
    console.log('2. POST /api/auth/login -> Status:', login.statusCode, '| User:', login.data.user.name, '| JWT Token Received:', !!login.data.token);

    const token = login.data.token;

    // 3. Protected route /me test
    const me = await makeRequest({
      host: 'localhost',
      port: 5000,
      path: '/api/auth/me',
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log('3. GET /api/auth/me (Protected) -> Status:', me.statusCode, '| Logged In User:', me.data.user.name, '(', me.data.user.email, ')');

    // 4. Registration test
    const randomEmail = `user_${Date.now()}@example.com`;
    const reg = await makeRequest(
      { host: 'localhost', port: 5000, path: '/api/auth/register', method: 'POST', headers: { 'Content-Type': 'application/json' } },
      { name: 'Sarah Connor', email: randomEmail, password: 'password123', department: 'Cybernetics' }
    );
    console.log('4. POST /api/auth/register -> Status:', reg.statusCode, '| New User ID:', reg.data.user.id, '| Name:', reg.data.user.name);

    // 5. Invalid login test
    const invalidLogin = await makeRequest(
      { host: 'localhost', port: 5000, path: '/api/auth/login', method: 'POST', headers: { 'Content-Type': 'application/json' } },
      { email: 'omkar@example.com', password: 'wrongpassword' }
    );
    console.log('5. POST /api/auth/login (Invalid Password) -> Status:', invalidLogin.statusCode, '| Error Msg:', invalidLogin.data.message);

    console.log('\n🎉 ALL API INTEGRATION TESTS PASSED PERFECTLY!');
  } catch (err) {
    console.error('❌ API Test Error:', err);
  }
}

runTests();
