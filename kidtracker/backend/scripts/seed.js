import bcrypt from 'bcrypt';
import pool from '../src/db/pool.js';

async function seed() {
  const passwordHash = await bcrypt.hash('password123', 10);

  const [g] = await pool.execute(
    `INSERT INTO guardians (name, email, password_hash) VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE name = VALUES(name)`,
    ['Test Guardian', 'guardian@test.com', passwordHash]
  );

  let guardianId = g.insertId;
  if (!guardianId) {
    const [rows] = await pool.execute(
      'SELECT id FROM guardians WHERE email = ?',
      ['guardian@test.com']
    );
    guardianId = rows[0].id;
  }

  await pool.execute(
    `INSERT INTO children (guardian_id, name, device_id) VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE name = VALUES(name)`,
    [guardianId, 'Test Child', 'ESP32-TEST-001']
  );

  console.log('Seeded: guardian@test.com / password123, child device ESP32-TEST-001');
  await pool.end();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
