"""
SHEETAL.AI - SQLite Database Initializer & Seeder
=================================================
Initializes backend/sheetal.db with the production SQLite schema and seeds
geospatial nodes from the authentic historical heat dataset.
"""

import os
import sqlite3
import pandas as pd

BASE_DIR = os.path.dirname(__file__)
DB_PATH = os.path.join(BASE_DIR, "sheetal.db")
SCHEMA_PATH = os.path.join(BASE_DIR, "..", "database", "sqlite_schema.sql")
CSV_PATH = os.path.join(BASE_DIR, "historical_heat_dataset.csv")


def initialize_database():
    print(f"[Database] Initializing SQLite database at: {DB_PATH}")
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # Read and execute schema
    if os.path.exists(SCHEMA_PATH):
        with open(SCHEMA_PATH, "r", encoding="utf-8") as f:
            schema_sql = f.read()
        cursor.executescript(schema_sql)
        print("[Database] Executed DDL schema successfully.")
    else:
        print(f"[Database] Warning: Schema file not found at {SCHEMA_PATH}")

    # Seed from CSV if geospatial_nodes is empty
    cursor.execute("SELECT COUNT(*) FROM geospatial_nodes")
    count = cursor.fetchone()[0]

    if count == 0 and os.path.exists(CSV_PATH):
        df = pd.read_csv(CSV_PATH)
        for _, row in df.iterrows():
            node_id = str(row["record_id"])
            zone_name = f"{row['sub_zone']} ({row['region']})"
            lat = float(row["latitude"])
            lon = float(row["longitude"])
            surface_type = "asphalt" if row["impervious_surface_pct"] > 60 else "green_cover" if row["canopy_cover_pct"] > 30 else "concrete"
            heat_index = float(row["lst_celsius"])

            cursor.execute("""
                INSERT OR IGNORE INTO geospatial_nodes 
                (node_id, zone_name, latitude, longitude, surface_type, current_heat_index)
                VALUES (?, ?, ?, ?, ?, ?)
            """, (node_id, zone_name, lat, lon, surface_type, heat_index))

        conn.commit()
        print(f"[Database] Seeded {len(df)} nodes from {CSV_PATH} into geospatial_nodes.")
    else:
        print(f"[Database] geospatial_nodes table already has {count} records.")

    conn.close()
    return DB_PATH


if __name__ == "__main__":
    initialize_database()
