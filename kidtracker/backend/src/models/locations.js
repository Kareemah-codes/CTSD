import pool from '../db/pool.js';

// timestampMs: the raw `timestamp` field from the MQTT payload (Unix ms, per api-contract.md)
export async function insert({ deviceId, lat, lng, speed, battery, timestampMs }) {
  const recordedAt = new Date(timestampMs);
  const [result] = await pool.execute(
    `INSERT INTO locations (device_id, lat, lng, speed, battery, timestamp_ms, recorded_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [deviceId, lat, lng, speed ?? null, battery ?? null, timestampMs, recordedAt]
  );
  return result.insertId;
}

export async function latestForDevice(deviceId) {
  const [rows] = await pool.execute(
    `SELECT * FROM locations WHERE device_id = ?
     ORDER BY recorded_at DESC LIMIT 1`,
    [deviceId]
  );
  return rows[0] || null;
}

export async function history(deviceId, from, to) {
  const [rows] = await pool.execute(
    `SELECT lat, lng, speed, battery, recorded_at FROM locations
     WHERE device_id = ? AND recorded_at BETWEEN ? AND ?
     ORDER BY recorded_at ASC`,
    [deviceId, from, to]
  );
  return rows;
}
