"""
SHEETAL.AI - Authentic Machine Learning Training & Evaluation Pipeline
======================================================================
Trains an empirical Random Forest regression model on authentic historical
multispectral satellite (Landsat-8/9 C2L2 Band 10 TIRS) and atmospheric reanalysis
(Copernicus ERA5) observations across metropolitan heat corridors.

Outputs:
  - backend/lst_model.pkl: Trained Scikit-Learn RandomForestRegressor
  - backend/model_metadata.json: Reproducible evaluation metrics (LOCO & 5-Fold, Baselines)
"""

import json
import os
from datetime import datetime, timezone
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.linear_model import Ridge
from sklearn.dummy import DummyRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.model_selection import KFold, LeaveOneGroupOut, cross_val_predict
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


def load_dataset(csv_path: str = DATASET_PATH) -> pd.DataFrame:
    if not os.path.exists(csv_path):
        raise FileNotFoundError(f"Historical dataset not found at {csv_path}")
    df = pd.read_csv(csv_path)
    print(f"[Dataset] Loaded {len(df)} authentic records from {csv_path}")
    print(f"[Dataset] Regions covered: {df['region'].unique().tolist()}")
    return df


def train_and_evaluate(df: pd.DataFrame):
    X = df[FEATURES]
    y = df[TARGET]
    groups = df["region"]

    # 1. 5-Fold Cross Validation
    kf = KFold(n_splits=5, shuffle=True, random_state=42)
    rf_model = RandomForestRegressor(
        n_estimators=100,
        max_depth=8,
        min_samples_split=3,
        random_state=42
    )
    ridge_model = Ridge(alpha=1.0, random_state=42)
    dummy_model = DummyRegressor(strategy="mean")

    y_cv_pred_rf = cross_val_predict(rf_model, X, y, cv=kf)
    y_cv_pred_ridge = cross_val_predict(ridge_model, X, y, cv=kf)
    y_cv_pred_dummy = cross_val_predict(dummy_model, X, y, cv=kf)

    cv_5fold = {
        "random_forest": {
            "r2_score": round(float(r2_score(y, y_cv_pred_rf)), 4),
            "rmse_celsius": round(float(np.sqrt(mean_squared_error(y, y_cv_pred_rf))), 4),
            "mae_celsius": round(float(mean_absolute_error(y, y_cv_pred_rf)), 4)
        },
        "ridge_linear_baseline": {
            "r2_score": round(float(r2_score(y, y_cv_pred_ridge)), 4),
            "rmse_celsius": round(float(np.sqrt(mean_squared_error(y, y_cv_pred_ridge))), 4),
            "mae_celsius": round(float(mean_absolute_error(y, y_cv_pred_ridge)), 4)
        },
        "mean_persistence_baseline": {
            "r2_score": round(float(r2_score(y, y_cv_pred_dummy)), 4),
            "rmse_celsius": round(float(np.sqrt(mean_squared_error(y, y_cv_pred_dummy))), 4),
            "mae_celsius": round(float(mean_absolute_error(y, y_cv_pred_dummy)), 4)
        }
    }

    # 2. Leave-One-City-Out (LOCO) Group Validation
    logo = LeaveOneGroupOut()
    y_loco_rf = cross_val_predict(rf_model, X, y, cv=logo, groups=groups)
    y_loco_ridge = cross_val_predict(ridge_model, X, y, cv=logo, groups=groups)
    y_loco_dummy = cross_val_predict(dummy_model, X, y, cv=logo, groups=groups)

    loco_validation = {
        "random_forest": {
            "r2_score": round(float(r2_score(y, y_loco_rf)), 4),
            "rmse_celsius": round(float(np.sqrt(mean_squared_error(y, y_loco_rf))), 4),
            "mae_celsius": round(float(mean_absolute_error(y, y_loco_rf)), 4)
        },
        "ridge_linear_baseline": {
            "r2_score": round(float(r2_score(y, y_loco_ridge)), 4),
            "rmse_celsius": round(float(np.sqrt(mean_squared_error(y, y_loco_ridge))), 4),
            "mae_celsius": round(float(mean_absolute_error(y, y_loco_ridge)), 4)
        },
        "mean_persistence_baseline": {
            "r2_score": round(float(r2_score(y, y_loco_dummy)), 4),
            "rmse_celsius": round(float(np.sqrt(mean_squared_error(y, y_loco_dummy))), 4),
            "mae_celsius": round(float(mean_absolute_error(y, y_loco_dummy)), 4)
        }
    }

    # 3. City-by-City Error Breakdown (from LOCO holdout predictions)
    city_error_breakdown = {}
    for region_name in df["region"].unique():
        mask = df["region"] == region_name
        y_true_city = y[mask]
        y_pred_city = y_loco_rf[mask]
        city_error_breakdown[region_name] = {
            "samples_count": int(mask.sum()),
            "rmse_celsius": round(float(np.sqrt(mean_squared_error(y_true_city, y_pred_city))), 4),
            "mae_celsius": round(float(mean_absolute_error(y_true_city, y_pred_city)), 4),
            "r2_score": round(float(r2_score(y_true_city, y_pred_city)), 4) if len(y_true_city) > 1 else None
        }

    # 4. Fit Final Production Model on all 44 records
    final_model = RandomForestRegressor(
        n_estimators=100,
        max_depth=8,
        min_samples_split=3,
        random_state=42
    )
    final_model.fit(X, y)

    # Feature importances (MDI / Gini)
    feature_importances = {
        feat: round(float(imp), 4)
        for feat, imp in zip(FEATURES, final_model.feature_importances_)
    }

    # Save model weights
    joblib.dump(final_model, MODEL_OUTPUT_PATH)
    print(f"\n[Artifact] Model weights saved to: {MODEL_OUTPUT_PATH}")

    # Build comprehensive metadata dictionary
    metadata = {
        "model_name": "RandomForestRegressor (Historical Thermal Mitigation)",
        "model_version": "1.3.0-verified",
        "algorithm": "Random Forest Regressor (Scikit-Learn)",
        "trained_at_utc": datetime.now(timezone.utc).isoformat(),
        "random_seed": 42,
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
        "hyperparameters": {
            "n_estimators": 100,
            "max_depth": 8,
            "min_samples_split": 3,
            "random_state": 42
        },
        "evaluation": {
            "primary_validation_strategy": "Leave-One-City-Out (LOCO) Group Cross-Validation",
            "r2_score": loco_validation["random_forest"]["r2_score"],
            "rmse_celsius": loco_validation["random_forest"]["rmse_celsius"],
            "mae_celsius": loco_validation["random_forest"]["mae_celsius"],
            "baseline_mean_cooling": round(float(y.mean()), 4),
            "baseline_std_cooling": round(float(y.std()), 4),
            "five_fold_cv": cv_5fold,
            "leave_one_city_out_cv": loco_validation,
            "city_error_breakdown": city_error_breakdown
        },
        "feature_importances": feature_importances,
        "scientific_notes": [
            "Active model is a classical Random Forest Regressor; no deep neural networks or PINNs are utilized for inference.",
            "Trained on empirical observational deltas between unmitigated asphalt/concrete and vegetated/high-albedo zones.",
            "LST skin temperature derived from Landsat-8/9 Band 10 TIRS with radiative atmospheric correction.",
            "Ambient air temperature (2m) derived from Copernicus ECMWF ERA5 reanalysis.",
            "Leave-One-City-Out cross validation ensures spatial holdout integrity across all 7 metropolitan sectors without geographic train/test leakage."
        ],
        "limitations": [
            "Sample size is limited to 44 documented metropolitan observations.",
            "Microclimate variations smaller than 100m (Landsat TIRS sensor resolution) are averaged.",
            "Model should not be extrapolated outside temperate to subtropical urban climates without local retraining."
        ]
    }

    with open(METADATA_OUTPUT_PATH, "w") as f:
        json.dump(metadata, f, indent=2)
    print(f"[Artifact] Model metadata card saved to: {METADATA_OUTPUT_PATH}")

    return metadata


if __name__ == "__main__":
    data = load_dataset()
    train_and_evaluate(data)
