"""
SHEETAL.AI - Standalone ML Evaluation & Baseline Comparison Script
==================================================================
Runs reproducible geographic holdout (Leave-One-City-Out) validation and
5-fold CV comparing the production Random Forest against Linear and
Persistence Baselines.
"""

import os
import json
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.linear_model import Ridge
from sklearn.dummy import DummyRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.model_selection import KFold, LeaveOneGroupOut, cross_val_predict

BASE_DIR = os.path.dirname(__file__)
DATASET_PATH = os.path.join(BASE_DIR, "historical_heat_dataset.csv")

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


def run_evaluation():
    if not os.path.exists(DATASET_PATH):
        raise FileNotFoundError(f"Missing {DATASET_PATH}")

    df = pd.read_csv(DATASET_PATH)
    X = df[FEATURES]
    y = df[TARGET]
    groups = df["region"]

    # Models
    rf = RandomForestRegressor(n_estimators=100, max_depth=8, min_samples_split=3, random_state=42)
    ridge = Ridge(alpha=1.0, random_state=42)
    dummy = DummyRegressor(strategy="mean")

    # 1. 5-Fold Cross Validation
    kf = KFold(n_splits=5, shuffle=True, random_state=42)
    y_5f_rf = cross_val_predict(rf, X, y, cv=kf)
    y_5f_ridge = cross_val_predict(ridge, X, y, cv=kf)
    y_5f_dummy = cross_val_predict(dummy, X, y, cv=kf)

    # 2. Leave-One-City-Out (LOCO) Group Validation
    logo = LeaveOneGroupOut()
    y_loco_rf = cross_val_predict(rf, X, y, cv=logo, groups=groups)
    y_loco_ridge = cross_val_predict(ridge, X, y, cv=logo, groups=groups)
    y_loco_dummy = cross_val_predict(dummy, X, y, cv=logo, groups=groups)

    results = {
        "dataset_samples": len(df),
        "cities_count": int(df["region"].nunique()),
        "five_fold": {
            "Random Forest": {
                "r2": float(r2_score(y, y_5f_rf)),
                "rmse": float(np.sqrt(mean_squared_error(y, y_5f_rf))),
                "mae": float(mean_absolute_error(y, y_5f_rf))
            },
            "Ridge Linear Baseline": {
                "r2": float(r2_score(y, y_5f_ridge)),
                "rmse": float(np.sqrt(mean_squared_error(y, y_5f_ridge))),
                "mae": float(mean_absolute_error(y, y_5f_ridge))
            },
            "Mean Persistence Baseline": {
                "r2": float(r2_score(y, y_5f_dummy)),
                "rmse": float(np.sqrt(mean_squared_error(y, y_5f_dummy))),
                "mae": float(mean_absolute_error(y, y_5f_dummy))
            }
        },
        "loco": {
            "Random Forest": {
                "r2": float(r2_score(y, y_loco_rf)),
                "rmse": float(np.sqrt(mean_squared_error(y, y_loco_rf))),
                "mae": float(mean_absolute_error(y, y_loco_rf))
            },
            "Ridge Linear Baseline": {
                "r2": float(r2_score(y, y_loco_ridge)),
                "rmse": float(np.sqrt(mean_squared_error(y, y_loco_ridge))),
                "mae": float(mean_absolute_error(y, y_loco_ridge))
            },
            "Mean Persistence Baseline": {
                "r2": float(r2_score(y, y_loco_dummy)),
                "rmse": float(np.sqrt(mean_squared_error(y, y_loco_dummy))),
                "mae": float(mean_absolute_error(y, y_loco_dummy))
            }
        },
        "city_breakdown": {}
    }

    for region in sorted(df["region"].unique()):
        mask = df["region"] == region
        y_city = y[mask]
        y_pred = y_loco_rf[mask]
        results["city_breakdown"][region] = {
            "count": int(mask.sum()),
            "rmse": float(np.sqrt(mean_squared_error(y_city, y_pred))),
            "mae": float(mean_absolute_error(y_city, y_pred)),
            "r2": float(r2_score(y_city, y_pred)) if len(y_city) > 1 else None
        }

    return results


if __name__ == "__main__":
    res = run_evaluation()
    print("=== MODEL EVALUATION REPORT ===")
    print(f"Sample Count: {res['dataset_samples']} across {res['cities_count']} metropolitan regions\n")
    print("1. Leave-One-City-Out (Geographic Holdout) Validation:")
    for m, vals in res["loco"].items():
        print(f"   {m:25s} | R²: {vals['r2']:.4f} | RMSE: {vals['rmse']:.4f} °C | MAE: {vals['mae']:.4f} °C")
    print("\n2. 5-Fold Cross Validation:")
    for m, vals in res["five_fold"].items():
        print(f"   {m:25s} | R²: {vals['r2']:.4f} | RMSE: {vals['rmse']:.4f} °C | MAE: {vals['mae']:.4f} °C")
    print("\n3. City-by-City Holdout Breakdown (Random Forest):")
    for c, stats in res["city_breakdown"].items():
        r2_str = f"{stats['r2']:.4f}" if stats['r2'] is not None else "N/A"
        print(f"   {c:15s} (n={stats['count']}): RMSE={stats['rmse']:.4f} °C | MAE={stats['mae']:.4f} °C | R²={r2_str}")
