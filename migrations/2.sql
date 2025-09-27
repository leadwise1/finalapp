
CREATE TABLE interview_sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT,
  job_title TEXT,
  interview_type TEXT,
  questions TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_interview_sessions_user_id ON interview_sessions(user_id);
