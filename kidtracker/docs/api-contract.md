# KidTracker API Contract

## MQTT

**Topic scheme:**
```
kidtracker/{deviceId}/location
```

- `{deviceId}` — string identifier matching `children.device_id` in MySQL.
- Backend subscribes to the wildcard `kidtracker/+/location` (Day 4) so any device
  publishing under this scheme is picked up without a code change per device.

**Payload (frozen — do not change shape without bumping a version field):**
```json
{
  "deviceId": "esp32-001",
  "lat": 51.6752,
  "lng": -1.2245,
  "timestamp": 1737000000000,
  "battery": 87,
  "speed": 4.2
}
```

| Field       | Type   | Notes                                      |
|-------------|--------|---------------------------------------------|
| deviceId    | string | Must match a known device                   |
| lat         | number | -90 to 90                                    |
| lng         | number | -180 to 180                                  |
| timestamp   | number | Unix ms, set by device (or backend fallback) |
| battery     | number | 0–100, percent                               |
| speed       | number | m/s, optional (default 0 if absent)          |

## REST (stubbed now, filled in from Day 3 onward)

- `GET /health` → `{ status: "ok" }`
- `POST /auth/register`
- `POST /auth/login`
- Children, geofences, alerts CRUD — see Day 2/5 sections of the build plan.
