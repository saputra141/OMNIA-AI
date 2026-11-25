-- OMNIA AI - D1 Database Schema
-- Digunakan untuk menyimpan data user dan statistik sistem

DROP TABLE IF EXISTS users;
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT CHECK(role IN ('Admin', 'Editor', 'Viewer')) DEFAULT 'Viewer',
    status TEXT CHECK(status IN ('Active', 'Suspended')) DEFAULT 'Active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS system_stats;
CREATE TABLE system_stats (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Data Awal (Seed Data)
INSERT INTO users (name, email, role, status) VALUES 
('Administrator', 'admin@omnia.ai', 'Admin', 'Active'),
('Developer', 'dev@omnia.ai', 'Editor', 'Active');

INSERT INTO system_stats (key, value) VALUES 
('total_requests', '0'),
('server_health', 'Excellent'),
('last_maintenance', '2023-10-01');
