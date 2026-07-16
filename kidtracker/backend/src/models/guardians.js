import pool from '../db/pool.js';

export async function create({ name, email, passwordHash }) {
  const [result] = await pool.execute(
    'INSERT INTO guardians (name, email, password_hash) VALUES (?, ?, ?)',
    [name, email, passwordHash]
  );
  return result.insertId;
}

export async function findByEmail(email) {
  const [rows] = await pool.execute(
    'SELECT * FROM guardians WHERE email = ?',
    [email]
  );
  return rows[0] || null;
}

export async function findById(id) {
  const [rows] = await pool.execute(
    'SELECT id, name, email, created_at FROM guardians WHERE id = ?',
    [id]
  );
  return rows[0] || null;
}
