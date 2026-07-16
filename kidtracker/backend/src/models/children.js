import pool from '../db/pool.js';

// TODO: create({ guardianId, name, deviceId }) -> returns insertId
// Same shape as guardians.create above — one INSERT, parameterized, return result.insertId

// TODO: findByDeviceId(deviceId) -> returns row or null
// Needed by the MQTT handler on Day 4 to map an incoming device_id to a child.

// TODO: listByGuardian(guardianId) -> returns array of rows
// Used by the dashboard to show a guardian's children.

// TODO: findById(id) -> returns row or null

// Bring this back if you want a check on any of these — same pattern as
// guardians.js and locations.js, just different table/columns.
