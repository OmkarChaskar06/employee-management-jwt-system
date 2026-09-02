const bcrypt = require('bcryptjs');
const { dbAsync } = require('./database');

async function seedDatabase() {
  console.log('🌱 Seeding SQLite database with default test credentials...');

  try {
    const saltRounds = 10;
    const commonPassword = await bcrypt.hash('password123', saltRounds);

    const defaultUsers = [
      {
        name: 'Omkar',
        email: 'omkar@example.com',
        password: commonPassword,
        role: 'Senior Software Engineer',
        department: 'Engineering',
        bio: 'Lead Developer specializing in Full-Stack web architecture & security.'
      },
      {
        name: 'Alice Smith',
        email: 'alice@example.com',
        password: commonPassword,
        role: 'Product Manager',
        department: 'Product Development',
        bio: 'Overseeing modern UX & employee management feature roadmaps.'
      },
      {
        name: 'Bob Manager',
        email: 'bob@example.com',
        password: commonPassword,
        role: 'HR Director',
        department: 'Human Resources',
        bio: 'Managing corporate compliance, security policies, and team operations.'
      }
    ];

    for (const u of defaultUsers) {
      const existing = await dbAsync.get('SELECT id FROM users WHERE LOWER(email) = ?', [u.email.toLowerCase()]);
      if (!existing) {
        await dbAsync.run(
          'INSERT INTO users (name, email, password, role, department, bio) VALUES (?, ?, ?, ?, ?, ?)',
          [u.name, u.email, u.password, u.role, u.department, u.bio]
        );
        console.log(`✅ Seeded user: ${u.name} (${u.email})`);
      } else {
        console.log(`ℹ️ User already exists: ${u.email}`);
      }
    }

    console.log('🎉 Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error during database seeding:', error);
  }
}

// Execute if run directly
if (require.main === module) {
  seedDatabase().then(() => process.exit(0));
}

module.exports = { seedDatabase };
