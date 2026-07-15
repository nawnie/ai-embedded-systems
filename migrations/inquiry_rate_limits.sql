CREATE TABLE IF NOT EXISTS inquiry_rate_limits (
  scope TEXT NOT NULL,
  subject_hash TEXT NOT NULL,
  window_started_at INTEGER NOT NULL,
  request_count INTEGER NOT NULL DEFAULT 0 CHECK (request_count >= 0),
  expires_at INTEGER NOT NULL,
  PRIMARY KEY (scope, subject_hash, window_started_at)
);

CREATE INDEX IF NOT EXISTS inquiry_rate_limits_expires_at_idx
  ON inquiry_rate_limits (expires_at);
