# Sheetal-AI Web & Urban Analytics - Database Schema Documentation

This directory contains the production-ready DDL (Data Definition Language) SQL schemas designed for **Sheetal-AI**, an AI-driven urban analytics project tracking urban heat islands, geospatial variations, and environment logs.

The schemas have been fully customized and optimized for both **PostgreSQL (13+)** and **SQLite (3+)** to match their respective native behaviors.

---

## Directory Structure
- `postgresql_schema.sql` - Core schema targeting high-throughput production PostgreSQL servers.
- `sqlite_schema.sql` - Portable database schema perfect for lightweight deployments, local developer setups, and embedded runtimes.

---

## 1. Schema Overview

The database contains 4 main entities to manage users, target zones (nodes), environmental time-series monitoring, and AI inference outputs:

```
                  ┌──────────────────────┐
                  │        users         │
                  └──────────────────────┘
                                
                  ┌──────────────────────┐
                  │   geospatial_nodes   │
                  └──────┬────────────┬──┘
                         │ 1          │ 1
                         │            │
                         ▼ ON DELETE  ▼ ON DELETE
                         │ CASCADE    │ CASCADE
                       * │            │ *
      ┌──────────────────┴───┐     ┌──┴───────────────────┐
      │environmental_metrics │     │  ai_inference_logs   │
      └──────────────────────┘     └──────────────────────┘
```

### Table Details:
1. **`users`**:
   - Manages user accounts and privileges (`admin`, `researcher`, `standard`).
   - Audit trail using `created_at` and `updated_at`.
2. **`geospatial_nodes`**:
   - Tracks urban zones (parks, streets, parking lots).
   - Records metadata such as `surface_type` (`asphalt`, `concrete`, `green_cover`), GPS coordinates, and historical heat index rankings.
3. **`environmental_metrics`**:
   - High-frequency time-series table logging temperature, humidity, and albedo (solar reflectivity ratio, limited between 0 and 1).
   - Fast analytic lookups using `node_id` & `recorded_at`.
4. **`ai_inference_logs`**:
   - Records predictions made by Sheetal-AI models (`predicted_heat_risk`: `low`, `medium`, `high`), confidence score, and suggested mitigation plan.

---

## 2. Key Architecture Design Decisions

### UUIDs for Primary Keys
- **PostgreSQL**: Implemented using the native `UUID` type, populated using the modern `gen_random_uuid()` function (built-in since PostgreSQL 13, avoiding legacy extension imports).
- **SQLite**: Simulated using a custom pure-SQL RFC-compliant UUIDv4 generator expression:
  ```sql
  lower(hex(randomblob(4))) || '-' ||
  lower(hex(randomblob(2))) || '-4' ||
  substr(lower(hex(randomblob(2))), 2, 3) || '-' ||
  substr('89ab', abs(random() % 4) + 1, 1) || ...
  ```

### Data Categorization (Enums & Checks)
- **PostgreSQL**: Uses native `CREATE TYPE ... AS ENUM` for types like `user_role`, `urban_surface_type`, and `heat_risk_level`. This reduces storage footprint (stored internally as integer OIDs) and optimizes index searches.
- **SQLite**: Implements standard SQLite `CHECK` constraints on `TEXT` columns to enforce strict data boundary checks at the database layer (e.g. `CHECK(role IN ('admin', 'researcher', 'standard'))`).

### Auditing & Automation Triggers
- Automatic `updated_at` timestamps on modification:
  - **PostgreSQL**: Uses an event trigger executing a PL/pgSQL function (`BEFORE UPDATE ON ... EXECUTE FUNCTION update_updated_at_column()`).
  - **SQLite**: Implements individual `AFTER UPDATE` triggers queryable directly inside SQLite's database engine.

---

## 3. Indexing & Time-Series Optimization

Time-series environmental data and AI logs scale exponentially. To keep retrieval latency low:
1. **Composite Index (`idx_metrics_node_recorded_at`)**:
   - Index fields: `(node_id, recorded_at DESC)`.
   - **Rationale**: Real-time dashboards require queries of the sort: "Fetch temperature records for node X in the last 24 hours". This index allows the query planner to execute a localized Index Range Scan without sorting.
2. **Composite Index (`idx_inference_node_executed_at`)**:
   - Index fields: `(node_id, executed_at DESC)`.
   - **Rationale**: For comparing AI trends over weeks/months on specific hotspots.
3. **Zone Lookup Index (`idx_geospatial_coordinates`)**:
   - Index fields: `(latitude, longitude)`.
   - **Rationale**: Spatial/bounding-box queries (finding nearby nodes to a user's location) are resolved instantly.

---

## 4. Referential Integrity
- All children entities (`environmental_metrics` and `ai_inference_logs`) point to `geospatial_nodes` with `ON DELETE CASCADE`.
- Deleting a zone (e.g. if zoning changes or sensor is decommissioned) automatically cleans up billions of metrics and inference logs, maintaining database consistency without manual cleanups.
