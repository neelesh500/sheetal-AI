-- ============================================================================
-- PROJECT: Sheetal-AI (AI-driven Urban Analytics)
-- TARGET DATABASE: PostgreSQL (13+)
-- AUTHOR: Senior Database Architect
-- DESCRIPTION: DDL Script for production-ready schema tracking urban heat 
--              islands, geospatial variations, and time-series environment logs.
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- 1. CUSTOM TYPES / ENUMS
-- ============================================================================

-- User Roles
CREATE TYPE user_role AS ENUM ('admin', 'researcher', 'standard');

-- AI predicted level of heat risk
CREATE TYPE heat_risk_level AS ENUM ('low', 'medium', 'high');

-- Surface types for urban zone mapping
CREATE TYPE urban_surface_type AS ENUM ('asphalt', 'concrete', 'green_cover');


-- ============================================================================
-- 2. AUDIT TRIGGER FOR UPDATED_AT TIMESTAMP
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';


-- ============================================================================
-- 3. TABLES DEFINITIONS
-- ============================================================================

-- USERS & ROLES
CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'standard',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- GEOSPATIAL_NODES (Tracking Target Urban Zones)
CREATE TABLE geospatial_nodes (
    node_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    zone_name VARCHAR(100) NOT NULL UNIQUE,
    latitude DECIMAL(9, 6) NOT NULL CHECK (latitude BETWEEN -90.0 AND 90.0),
    longitude DECIMAL(9, 6) NOT NULL CHECK (longitude BETWEEN -180.0 AND 180.0),
    surface_type urban_surface_type NOT NULL,
    current_heat_index DECIMAL(5, 2) DEFAULT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ENVIRONMENTAL_METRICS (Time-series data for AI analysis)
CREATE TABLE environmental_metrics (
    metric_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    node_id UUID NOT NULL REFERENCES geospatial_nodes(node_id) ON DELETE CASCADE,
    recorded_at TIMESTAMP WITH TIME ZONE NOT NULL,
    temperature_celsius DECIMAL(5, 2) NOT NULL,
    humidity_percentage DECIMAL(5, 2) NOT NULL CHECK (humidity_percentage BETWEEN 0.0 AND 100.0),
    albedo_value DECIMAL(3, 2) NOT NULL CHECK (albedo_value BETWEEN 0.00 AND 1.00),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- AI_INFERENCE_LOGS (Storing Sheetal-AI analysis outputs)
CREATE TABLE ai_inference_logs (
    inference_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    node_id UUID NOT NULL REFERENCES geospatial_nodes(node_id) ON DELETE CASCADE,
    model_version VARCHAR(50) NOT NULL,
    predicted_heat_risk heat_risk_level NOT NULL,
    confidence_score DOUBLE PRECISION NOT NULL CHECK (confidence_score BETWEEN 0.0 AND 1.0),
    mitigation_suggestion TEXT DEFAULT NULL,
    executed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);


-- ============================================================================
-- 4. PERFORMANCE & OPERATIONAL INDEXES
-- ============================================================================

-- Composite index for fast time-series analytical queries by node and time window
CREATE INDEX idx_metrics_node_recorded_at 
    ON environmental_metrics (node_id, recorded_at DESC);

-- Composite index for scanning AI outputs over time for specific zones
CREATE INDEX idx_inference_node_executed_at 
    ON ai_inference_logs (node_id, executed_at DESC);

-- Secondary indexing to optimize search, lookup and sorting
CREATE INDEX idx_users_email_role ON users (email, role);
CREATE INDEX idx_geospatial_coordinates ON geospatial_nodes (latitude, longitude);


-- ============================================================================
-- 5. AUTOMATIC UPDATE TRIGGER ASSIGNMENTS
-- ============================================================================

-- Assign update triggers to maintain updated_at column
CREATE TRIGGER trg_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_geospatial_nodes_updated_at
    BEFORE UPDATE ON geospatial_nodes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_environmental_metrics_updated_at
    BEFORE UPDATE ON environmental_metrics
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_ai_inference_logs_updated_at
    BEFORE UPDATE ON ai_inference_logs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
