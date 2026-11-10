const http = require('http');

const BASE_URL = 'http://localhost:5000/api';

function request(path, options = {}, body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(BASE_URL + path);
    const reqOptions = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    };

    const req = http.request(reqOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({ status: res.statusCode, body: json });
        } catch (e) {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });

    req.on('error', reject);

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function runTests() {
  console.log('🧪 Running TaskFlow Backend Integration Test Suite...\n');
  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      failed++;
    }
  }

  try {
    // 1. Health check
    const health = await request('/health');
    assert(health.status === 200 && health.body.success === true, 'GET /api/health returns 200 and healthy DB');

    // 2. Summary stats
    const summary = await request('/tasks/stats/summary');
    assert(summary.status === 200 && summary.body.data.total >= 0, 'GET /api/tasks/stats/summary returns real database counts');

    // 3. Create task
    const testTask = {
      title: 'Automated CI Test Task',
      description: 'Verifying end-to-end CRUD persistence',
      priority: 'HIGH',
    };
    const created = await request('/tasks', { method: 'POST' }, testTask);
    assert(created.status === 201 && created.body.data.title === testTask.title, 'POST /api/tasks creates task with 201 Created');
    const taskId = created.body.data.id;

    // 4. Get task by ID
    const getById = await request(`/tasks/${taskId}`);
    assert(getById.status === 200 && getById.body.data.id === taskId, `GET /api/tasks/${taskId} returns created task`);

    // 5. Update task
    const updated = await request(`/tasks/${taskId}`, { method: 'PUT' }, {
      title: 'Automated CI Test Task (Updated)',
      priority: 'MEDIUM',
    });
    assert(updated.status === 200 && updated.body.data.title.includes('(Updated)'), `PUT /api/tasks/${taskId} updates task title and priority`);

    // 6. Toggle completion
    const toggled = await request(`/tasks/${taskId}/complete`, { method: 'PATCH' }, { completed: true });
    assert(toggled.status === 200 && toggled.body.data.completed === true, `PATCH /api/tasks/${taskId}/complete marks task as completed`);

    // 7. Delete task
    const deleted = await request(`/tasks/${taskId}`, { method: 'DELETE' });
    assert(deleted.status === 200 && deleted.body.data.id === taskId, `DELETE /api/tasks/${taskId} removes task`);

    // 8. Confirm deleted task returns 404
    const notFound = await request(`/tasks/${taskId}`);
    assert(notFound.status === 404, `GET /api/tasks/${taskId} returns 404 Not Found after deletion`);

    // 9. Validation checks: Reject empty title
    const emptyTitle = await request('/tasks', { method: 'POST' }, { title: '', priority: 'LOW' });
    assert(emptyTitle.status === 400, 'POST /api/tasks rejects empty title with 400 Bad Request');

    // 10. Validation checks: Reject invalid priority
    const invalidPriority = await request('/tasks', { method: 'POST' }, { title: 'Test', priority: 'INVALID_PRIORITY' });
    assert(invalidPriority.status === 400, 'POST /api/tasks rejects invalid priority with 400 Bad Request');

    console.log(`\n📊 Test Results: ${passed} Passed, ${failed} Failed`);
    if (failed > 0) process.exit(1);
  } catch (err) {
    console.error('❌ Test execution error:', err);
    process.exit(1);
  }
}

runTests();
