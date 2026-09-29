-- Additive MelodyTix schema. Run scripts/migrate.ts, which applies these
-- statements individually and safely repeats them on later runs.

ALTER TABLE `user`
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE keranjang
  ADD COLUMN IF NOT EXISTS venue VARCHAR(180) NOT NULL DEFAULT 'Venue diumumkan segera',
  ADD COLUMN IF NOT EXISTS city VARCHAR(120) NOT NULL DEFAULT 'Indonesia',
  ADD COLUMN IF NOT EXISTS featured TINYINT(1) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS is_demo TINYINT(1) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS is_active TINYINT(1) NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS image_url VARCHAR(500) NULL;

ALTER TABLE pesanan
  ADD COLUMN IF NOT EXISTS user_id INT UNSIGNED NULL,
  ADD COLUMN IF NOT EXISTS event_id INT UNSIGNED NULL,
  ADD COLUMN IF NOT EXISTS proof_name VARCHAR(255) NULL,
  ADD COLUMN IF NOT EXISTS stock_reserved TINYINT(1) NOT NULL DEFAULT 0;

CREATE TABLE IF NOT EXISTS sessions (
  token_hash CHAR(64) NOT NULL PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL,
  expires_at DATETIME NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_sessions_user_id (user_id),
  KEY idx_sessions_expires_at (expires_at),
  CONSTRAINT fk_sessions_user FOREIGN KEY (user_id) REFERENCES `user`(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Existing orders have no IDs. Link only rows with exact legacy keys. Rows
-- that cannot be linked remain readable through their stored snapshot fields.
UPDATE pesanan p JOIN `user` u ON u.username = p.username
  SET p.user_id = u.id WHERE p.user_id IS NULL;
-- A title is not a stable key. Attach only names with one matching concert;
-- ambiguous historical orders retain their own snapshot for display.
UPDATE pesanan p JOIN (
    SELECT nama_konser, MIN(id) AS id FROM keranjang
    GROUP BY nama_konser HAVING COUNT(*) = 1
  ) k ON k.nama_konser = p.nama_konser
  SET p.event_id = k.id WHERE p.event_id IS NULL;
