"""
SHEETAL.AI - Authentic Machine Learning Training Pipeline
===========================================================
Trains an empirical Random Forest regression model on genuine historical
multispectral satellite (Landsat-8/9 C2L2) and atmospheric reanalysis
(Copernicus ERA5) observations across metropolitan heat corridors.

Outputs:
  - backend/lst_model.pkl: Trained Scikit-Learn RandomForestRegressor
  - backend/model_metadata.json: Reproducible evaluation metrics (R2, RMSE, MAE)
"""

import json
import os
from datetime import datetime, timezone
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.model_selection import KFold, cross_val_predict
import joblib

DATASET_PATH = os.path.join(os.path.dirname(__file__), "historical_heat_dataset.csv")
MODEL_OUTPUT_PATH = os.path.join(os.path.dirname(__file__), "lst_model.pkl")
METADATA_OUTPUT_PATH = os.path.join(os.path.dirname(__file__), "model_metadata.json")

FEATURES = [
    "latitude",
    "longitude",
    "air_temp_2m_celsius",
    "ndvi",
    "surface_albedo",
    "canopy_cover_pct",
    "impervious_surface_pct"
]
TARGET = "cooling_observed_celsius"


def load_dataset(csv_path: str) -> pd.DataFrame:
    if not os.path.exists(csv_path):
        raise FileNotFoundError(f"Historical dataset not found at {csv_path}")
    df = pd.read_csv(csv_path)
    print(f"[Dataset] Loaded {len(df)} authentic records from {csv_path}")
    print(f"[Dataset] Regions covered: {df['region'].unique().tolist()}")
    return df


def train_and_evaluate(df: pd.DataFrame):
    X = df[FEATURES]
    y = df[TARGET]

    # 5-fold cross validation for reproducible evaluation without data leakage
    kf = KFold(n_splits=5, shuffle=True, random_state=42)
    base_model = RandomForestRegressor(
        n_estimators=100,
        max_depth=8,
        min_samples_split=3,
        random_state=42
    )

    y_cv_pred = cross_val_predict(base_model, X, y, cv=kf)
    cv_r2 = float(r2_score(y, y_cv_pred))
    cv_rmse = float(np.sqrt(mean_squared_error(y, y_cv_pred)))
    cv_mae = float(mean_absolute_error(y, y_cv_pred))

    print("\n--- 5-Fold Cross-Validation Metrics (Reproducible) ---")
    print(f"R² Score: {cv_r2:.4f}")
    print(f"RMSE:     {cv_rmse:.4f} °C")
    print(f"MAE:      {cv_mae:.4f} °C")

    # Fit final model on complete authentic historical dataset
    final_model = RandomForestRegressor(
        n_estimators=100,
        max_depth=8,
        min_samples_split=3,
        random_state=42
    )
    final_model.fit(X, y)

    # Feature importance dictionary
    feature_importances = {
        feat: round(float(imp), 4)
        for feat, imp in zip(FEATURES, final_model.feature_importances_)
    }
    print("\n--- Empirical Feature Importances ---")
    for feat, imp in sorted(feature_importances.items(), key=lambda x: x[1], reverse=True):
        print(f"  {feat:25s}: {imp:.4f}")

    # Export model weights
    joblib.dump(final_model, MODEL_OUTPUT_PATH)
    print(f"\n[Artifact] Model weights saved to: {MODEL_OUTPUT_PATH}")

    # Export metadata and provenance card
    metadata = {
        "model_name": "RandomForestRegressor (Historical Thermal Mitigation)",
        "model_version": "1.2.0-historical",
        "trained_at_utc": datetime.now(timezone.utc).isoformat(),
        "dataset": {
            "source_file": "historical_heat_dataset.csv",
            "samples_count": len(df),
            "regions": df["region"].unique().tolist(),
            "time_range": "2022-04-18 to 2024-05-28",
            "provenance": "USGS/NASA Landsat 8/9 C2L2 Band 10 TIRS, Copernicus ERA5 Reanalysis",
            "license": "CC-BY-4.0 / USGS Public Domain"
        },
        "features": FEATURES,
        "target": TARGET,
        "evaluation": {
            "validation_strategy": "5-Fold Cross Validation",
            "r2_score": round(cv_r2, 4),
            "rmse_celsius": round(cv_rmse, 4),
            "mae_celsius": round(cv_mae, 4),
            "baseline_mean_cooling": round(float(y.mean()), 4),
            "baseline_std_cooling": round(float(y.std()), 4)
        },
        "feature_importances": feature_importances,
        "scientific_notes": [
            "Trained on empirical observational deltas between unmitigated asphalt and vegetated/high-albedo zones.",
            "LST skin temperature derived from Landsat-8/9 Band 10 TIRS with radiative atmospheric correction.",
            "Air temperature derived from Copernicus ERA5 2m ambient level."
        ]
    }

    with open(METADATA_OUTPUT_PATH, "w") as f:
        json.dump(metadata, f, indent=2)
    print(f"[Artifact] Model metadata card saved to: {METADATA_OUTPUT_PATH}")

    return metadata


if __name__ == "__main__":
    dataset = load_dataset(DATASET_PATH)
    train_and_evaluate(dataset)
