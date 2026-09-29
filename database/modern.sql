-- Additive PostgreSQL migration. Safe to run again after the initial setup.

ALTER TABLE "user"
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- MySQL's prior utf8mb4_unicode_ci uniqueness was case-insensitive.
CREATE UNIQUE INDEX IF NOT EXISTS uq_user_username_ci ON "user" (LOWER(username));
CREATE UNIQUE INDEX IF NOT EXISTS uq_user_email_ci ON "user" (LOWER(email));

ALTER TABLE keranjang
  ADD COLUMN IF NOT EXISTS venue VARCHAR(180) NOT NULL DEFAULT 'Venue diumumkan segera',
  ADD COLUMN IF NOT EXISTS city VARCHAR(120) NOT NULL DEFAULT 'Indonesia',
  ADD COLUMN IF NOT EXISTS featured SMALLINT NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS is_demo SMALLINT NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS is_active SMALLINT NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS image_url VARCHAR(500);

ALTER TABLE pesanan
  ADD COLUMN IF NOT EXISTS user_id INTEGER,
  ADD COLUMN IF NOT EXISTS event_id INTEGER,
  ADD COLUMN IF NOT EXISTS proof_name VARCHAR(255),
  ADD COLUMN IF NOT EXISTS stock_reserved SMALLINT NOT NULL DEFAULT 0;

CREATE TABLE IF NOT EXISTS sessions (
  token_hash CHAR(64) PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions (user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions (expires_at);

-- Link imported historical orders only by stable username, and link a
-- concert title only when precisely one matching concert exists.
UPDATE pesanan AS p SET user_id = u.id
  FROM "user" AS u
  WHERE p.user_id IS NULL AND u.username = p.username;

UPDATE pesanan AS p SET event_id = k.id
  FROM (
    SELECT nama_konser, MIN(id) AS id FROM keranjang
    GROUP BY nama_konser HAVING COUNT(*) = 1
  ) AS k
  WHERE p.event_id IS NULL AND k.nama_konser = p.nama_konser;
