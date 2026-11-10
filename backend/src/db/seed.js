const { pool } = require('./index');

const sampleTasks = [
  {
    title: 'Complete SaaS Design System Audit',
    description: 'Review typography hierarchy, purple accent tokens (#7050DC), and mobile button tap targets.',
    priority: 'HIGH',
    completed: true,
  },
  {
    title: 'Implement Task Completion Analytics',
    description: 'Aggregate completed vs pending tasks for the Recharts dashboard visualization.',
    priority: 'HIGH',
    completed: false,
  },
  {
    title: 'Conduct Cross-Device Responsive QA',
    description: 'Ensure smooth drawer navigation transitions across tablet and mobile viewports.',
    priority: 'MEDIUM',
    completed: true,
  },
  {
    title: 'Optimize Express Query Connection Pool',
    description: 'Tune PostgreSQL pool parameters for high concurrency and sub-50ms query response times.',
    priority: 'MEDIUM',
    completed: false,
  },
  {
    title: 'Update Project Documentation & Setup Guide',
    description: 'Draft step-by-step instructions for database migrations, env configuration, and Next.js startup.',
    priority: 'LOW',
    completed: false,
  },
];

async function seedDB() {
  const client = await pool.connect();
  try {
    console.log('🌱 Checking existing tasks in PostgreSQL...');
    const countRes = await client.query('SELECT COUNT(*) FROM tasks');
    const count = parseInt(countRes.rows[0].count, 10);

    if (count > 0) {
      console.log(`ℹ️ Database already contains ${count} tasks. Skipping seed.`);
      return;
    }

    console.log('🌱 Seeding initial tasks into PostgreSQL...');
    for (const task of sampleTasks) {
      await client.query(
        `INSERT INTO tasks (title, description, priority, completed)
         VALUES ($1, $2, $3, $4)`,
        [task.title, task.description, task.priority, task.completed]
      );
    }
    console.log('✅ Successfully seeded sample tasks into PostgreSQL!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

if (require.main === module) {
  seedDB();
}

module.exports = { seedDB };
