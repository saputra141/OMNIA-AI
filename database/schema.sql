CREATE TABLE IF NOT EXISTS video_tasks (
    id TEXT PRIMARY KEY,
    prompt TEXT NOT NULL,
    provider TEXT NOT NULL,
    status TEXT DEFAULT 'pending', -- pending, processing, completed, failed
    result_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT
);
