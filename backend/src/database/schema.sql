-- SQLite database schema for UK railway stations

CREATE TABLE IF NOT EXISTS stations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    crs TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_stations_crs ON stations(crs);
CREATE INDEX IF NOT EXISTS idx_stations_category ON stations(category);
CREATE INDEX IF NOT EXISTS idx_stations_name ON stations(name);

-- Full-text search index (optional, for future use)
CREATE VIRTUAL TABLE IF NOT EXISTS stations_fts USING fts5(
    crs,
    name,
    description,
    content='stations',
    content_rowid='id'
);

