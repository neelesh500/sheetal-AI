-- ============================================================================
-- PROJECT: Sheetal-AI (AI-driven Urban Analytics)
-- TARGET DATABASE: SQLite (3+)
-- AUTHOR: Senior Database Architect
-- DESCRIPTION: DDL Script for production-ready schema tracking urban heat 
--              islands, geospatial variations, and time-series environment logs.
-- ============================================================================

-- Enable Foreign Key constraints enforcement in the SQLite current connection context
PRAGMA foreign_keys = ON;

-- ============================================================================
-- 1. TABLES DEFINITIONS
-- ============================================================================

-- USERS & ROLES
CREATE TABLE users (
    user_id TEXT PRIMARY KEY DEFAULT (
        lower(hex(randomblob(4))) || '-' ||
        lower(hex(randomblob(2))) || '-4' ||
        substr(lower(hex(randomblob(2))), 2, 3) || '-' ||
        substr('89ab', abs(random() % 4) + 1, 1) || substr(lower(hex(randomblob(2))), 2, 3) || '-' ||
        lower(hex(randomblob(6)))
    ),
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'standard' CHECK(role IN ('admin', 'researcher', 'standard')),
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- GEOSPATIAL_NODES (Tracking Target Urban Zones)
CREATE TABLE geospatial_nodes (
    node_id TEXT PRIMARY KEY DEFAULT (
        lower(hex(randomblob(4))) || '-' ||
        lower(hex(randomblob(2))) || '-4' ||
        substr(lower(hex(randomblob(2))), 2, 3) || '-' ||
        substr('89ab', abs(random() % 4) + 1, 1) || substr(lower(hex(randomblob(2))), 2, 3) || '-' ||
        lower(hex(randomblob(6)))
    ),
    zone_name TEXT NOT NULL UNIQUE,
    latitude REAL NOT NULL CHECK (latitude BETWEEN -90.0 AND 90.0),
    longitude REAL NOT NULL CHECK (longitude BETWEEN -180.0 AND 180.0),
    surface_type TEXT NOT NULL CHECK (surface_type IN ('asphalt', 'concrete', 'green_cover')),
    current_heat_index REAL DEFAULT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ENVIRONMENTAL_METRICS (Time-series data for AI analysis)
CREATE TABLE environmental_metrics (
    metric_id INTEGER PRIMARY KEY AUTOINCREMENT,
    node_id TEXT NOT NULL,
    recorded_at TEXT NOT NULL,
    temperature_celsius REAL NOT NULL,
    humidity_percentage REAL NOT NULL CHECK (humidity_percentage BETWEEN 0.0 AND 100.0),
    albedo_value REAL NOT NULL CHECK (albedo_value BETWEEN 0.00 AND 1.00),
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (node_id) REFERENCES geospatial_nodes (node_id) ON DELETE CASCADE
);

-- AI_INFERENCE_LOGS (Storing Sheetal-AI analysis outputs)
CREATE TABLE ai_inference_logs (
    inference_id TEXT PRIMARY KEY DEFAULT (
        lower(hex(randomblob(4))) || '-' ||
        lower(hex(randomblob(2))) || '-4' ||
        substr(lower(hex(randomblob(2))), 2, 3) || '-' ||
        substr('89ab', abs(random() % 4) + 1, 1) || substr(lower(hex(randomblob(2))), 2, 3) || '-' ||
        lower(hex(randomblob(6)))
    ),
    node_id TEXT NOT NULL,
    model_version TEXT NOT NULL,
    predicted_heat_risk TEXT NOT NULL CHECK (predicted_heat_risk IN ('low', 'medium', 'high')),
    confidence_score REAL NOT NULL CHECK (confidence_score BETWEEN 0.0 AND 1.0),
    mitigation_suggestion TEXT DEFAULT NULL,
    executed_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (node_id) REFERENCES geospatial_nodes (node_id) ON DELETE CASCADE
);


-- ============================================================================
-- 2. PERFORMANCE & OPERATIONAL INDEXES
-- ============================================================================

-- Composite index for fast time-series analytical queries by node and time window
CREATE INDEX idx_metrics_node_recorded_at 
    ON environmental_metrics (node_id, recorded_at DESC);

-- Composite index for scanning AI outputs over time for specific zones
CREATE INDEX idx_inference_node_executed_at 
    ON ai_inference_logs (node_id, executed_at DESC);

-- Secondary indexing to optimize search, lookup and sorting
CREATE INDEX idx_users_email ON users (email);
CREATE INDEX idx_geospatial_coordinates ON geospatial_nodes (latitude, longitude);


-- ============================================================================
-- 3. AUTOMATIC UPDATE TRIGGERS FOR AUDIT COLUMNS
-- ============================================================================

-- Trigger to maintain updated_at column for users
CREATE TRIGGER trg_users_updated_at AFTER UPDATE ON users
BEGIN
    UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE user_id = NEW.user_id;
END;

-- Trigger to maintain updated_at column for geospatial_nodes
CREATE TRIGGER trg_geospatial_nodes_updated_at AFTER UPDATE ON geospatial_nodes
BEGIN
    UPDATE geospatial_nodes SET updated_at = CURRENT_TIMESTAMP WHERE node_id = NEW.node_id;
END;

-- Trigger to maintain updated_at column for environmental_metrics
CREATE TRIGGER trg_environmental_metrics_updated_at AFTER UPDATE ON environmental_metrics
BEGIN
    UPDATE environmental_metrics SET updated_at = CURRENT_TIMESTAMP WHERE metric_id = NEW.metric_id;
END;

-- Trigger to maintain updated_at column for ai_inference_logs
CREATE TRIGGER trg_ai_inference_logs_updated_at AFTER UPDATE ON ai_inference_logs
BEGIN
    UPDATE ai_inference_logs SET updated_at = CURRENT_TIMESTAMP WHERE inference_id = NEW.inference_id;
END;
