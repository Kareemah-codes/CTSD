-- infra/mysql/init.sql
-- Runs automatically on first boot of an EMPTY mysql_data volume.
-- If you've already started the mysql container before, reset with:
--   docker compose down -v && docker compose up -d

USE kidtracker;

CREATE TABLE IF NOT EXISTS guardians (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(100) NOT NULL,
  email         VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS children (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  guardian_id INT UNSIGNED NOT NULL,
  name        VARCHAR(100) NOT NULL,
  device_id   VARCHAR(64) NOT NULL UNIQUE,   -- matches deviceId in MQTT payload
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (guardian_id) REFERENCES guardians(id) ON DELETE CASCADE
);

-- No FK to children on purpose: the device may publish before it's registered
-- in the app, and ingestion should never drop location data over that.
CREATE TABLE IF NOT EXISTS locations (
  id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  device_id     VARCHAR(64) NOT NULL,
  lat           DECIMAL(10, 7) NOT NULL,        -- -90..90, ~1cm precision
  lng           DECIMAL(10, 7) NOT NULL,        -- -180..180
  speed         DECIMAL(6, 2) NULL,             -- m/s, per api-contract.md
  battery       TINYINT UNSIGNED NULL,          -- 0-100 %
  timestamp_ms  BIGINT UNSIGNED NOT NULL,        -- raw value as sent by device
  recorded_at   DATETIME(3) NOT NULL,            -- timestamp_ms converted to DATETIME
  created_at    TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP(3), -- when the backend inserted it
  INDEX idx_device_time (device_id, recorded_at)
);

CREATE TABLE IF NOT EXISTS geofences (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  child_id   INT UNSIGNED NOT NULL,
  name       VARCHAR(100) NOT NULL,
  center_lat DECIMAL(10, 7) NOT NULL,
  center_lng DECIMAL(10, 7) NOT NULL,
  radius_m   INT UNSIGNED NOT NULL,
  active     BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS alerts (
  id           BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  child_id     INT UNSIGNED NOT NULL,
  geofence_id  INT UNSIGNED NOT NULL,
  type         ENUM('EXIT', 'ENTER') NOT NULL DEFAULT 'EXIT',
  lat          DECIMAL(10, 7) NOT NULL,
  lng          DECIMAL(10, 7) NOT NULL,
  acknowledged BOOLEAN DEFAULT FALSE,
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE,
  FOREIGN KEY (geofence_id) REFERENCES geofences(id) ON DELETE CASCADE,
  INDEX idx_child_created (child_id, created_at)
);
