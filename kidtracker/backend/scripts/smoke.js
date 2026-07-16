import * as guardians from '../src/models/guardians.js';
import * as locations from '../src/models/locations.js';
import pool from '../src/db/pool.js';

const g = await guardians.findByEmail('guardian@test.com');
console.log('Guardian:', g?.email);

const id = await locations.insert({
  deviceId: 'ESP32-TEST-001',
  lat: 6.5158,       // UNILAG, roughly
  lng: 3.3898,
  speed: 0,
  battery: 87,
  timestampMs: Date.now(),
});
console.log('Inserted location id:', id);

const latest = await locations.latestForDevice('ESP32-TEST-001');
console.log('Latest:', latest.lat, latest.lng, latest.recorded_at);

await pool.end();
