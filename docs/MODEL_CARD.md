# MODEL CARD: SHEETAL.AI THERMAL MITIGATION REGRESSOR

**Model Identifier**: `RandomForestRegressor (Historical Thermal Mitigation)`  
**Model Version**: `1.3.0-verified`  
**Model Type**: Supervised Ensemble Regression (Random Forest)  
**Implementation**: `scikit-learn.ensemble.RandomForestRegressor`  
**Model Weights File**: `backend/lst_model.pkl`  
**Metadata & Card**: `backend/model_metadata.json`  

---

## 1. Intended Use

### Primary Intended Uses
- Estimating urban microclimate cooling potential (°C reduction in ambient/surface heat) based on urban forestry canopy expansion, NDVI vegetation indexing, and cool-roof albedo uplifts.
- Supporting municipal urban planners and climate resilience engineers with empirical scenario comparisons.

### Out-of-Scope & Misuse
- **Not a dynamic numerical weather prediction (NWP) model**: The model predicts empirical thermal mitigation deltas; it does not solve navier-stokes atmospheric advection or predict precipitation.
- **Not a real-time thermal camera**: Does not ingest live uncalibrated drone camera video feeds.
- **Geographic Extrapolation Limits**: Not validated for polar, arctic, or equatorial rainforest biomes.

---

## 2. Model Architecture & Hyperparameters

| Parameter | Value | Rationale |
| :--- | :--- | :--- |
| **Algorithm** | Random Forest Regressor | Captures non-linear coupling between albedo, canopy shading, and impervious cover without overfitting on tabular climate records. |
| **Number of Estimators** | 100 | Sufficient variance reduction while maintaining fast CPU inference (<10ms). |
| **Maximum Depth** | 8 | Constrains tree depth to prevent memorization of the 44 training nodes. |
| **Minimum Samples Split** | 3 | Prevents isolated single-sample leaves. |
| **Random Seed** | 42 | Ensures 100% reproducible cross-validation and training splits. |

---

## 3. Training & Validation Data

- **Input Features (7)**:
  1. `latitude` (WGS84 decimal degrees)
  2. `longitude` (WGS84 decimal degrees)
  3. `air_temp_2m_celsius` (ambient meteorological forcing, °C)
  4. `ndvi` (vegetation index, [-1, 1])
  5. `surface_albedo` (broadband shortwave reflectance, [0, 1])
  6. `canopy_cover_pct` (urban tree canopy projection, [0, 100]%)
  7. `impervious_surface_pct` (sealed surface fraction, [0, 100]%)
- **Target Feature**: `cooling_observed_celsius` (°C thermal mitigation delta)
- **Observations**: 44 authentic historical observation nodes across 7 metropolitan sectors (New Delhi, Mumbai, Bengaluru, Ahmedabad, Chennai, Hyderabad, Phoenix).

---

## 4. Evaluation Strategy & Benchmark Results

### 4.1 Leave-One-City-Out (LOCO) Geographic Holdout Validation
To ensure that spatial autocorrelation does not cause data leakage, the model was evaluated by holding out each metropolitan region in turn:

| Model / Baseline | R² Score | RMSE (°C) | MAE (°C) |
| :--- | :---: | :---: | :---: |
| **Sheetal AI Random Forest (1.3.0)** | **0.9871** | **0.2298** | **0.1580** |
| Ridge Linear Baseline ($\alpha=1.0$) | 0.9845 | 0.2518 | 0.2029 |
| Mean Persistence Baseline ($\bar{y}$) | -0.0169 | 2.0386 | 1.8416 |

### 4.2 Standard 5-Fold Cross Validation
| Model / Baseline | R² Score | RMSE (°C) | MAE (°C) |
| :--- | :---: | :---: | :---: |
| **Sheetal AI Random Forest (1.3.0)** | **0.9823** | **0.2686** | **0.1737** |
| Ridge Linear Baseline | 0.9923 | 0.1770 | 0.1492 |
| Mean Persistence Baseline | -0.0238 | 2.0455 | 1.8634 |

### 4.3 Error Breakdown by City (LOCO Holdout)
| Region | Sample Size ($n$) | RMSE (°C) | MAE (°C) | Holdout R² |
| :--- | :---: | :---: | :---: | :---: |
| **New Delhi** | 12 | 0.2553 | 0.1726 | 0.9823 |
| **Mumbai** | 6 | 0.3271 | 0.2250 | 0.9754 |
| **Bengaluru** | 7 | 0.1207 | 0.1027 | 0.9967 |
| **Ahmedabad** | 5 | 0.1686 | 0.1328 | 0.9876 |
| **Chennai** | 5 | 0.1068 | 0.0805 | 0.9979 |
| **Hyderabad** | 5 | 0.2290 | 0.1848 | 0.9868 |
| **Phoenix** | 4 | 0.2900 | 0.2048 | 0.9696 |

---

## 5. Feature Importances (MDI / Gini Impurity)

The empirical contribution of each feature to variance reduction in the 100-tree forest:
- **NDVI (`ndvi`)**: 38.74%
- **Tree Canopy Cover (`canopy_cover_pct`)**: 32.45%
- **Impervious Surface (`impervious_surface_pct`)**: 26.06%
- **Surface Albedo (`surface_albedo`)**: 1.93%
- **Ambient Air Temperature (`air_temp_2m_celsius`)**: 0.35%
- **Geographic Coordinates (`latitude`, `longitude`)**: 0.49%

Vegetation indices and canopy cover combined account for **>71%** of empirical cooling variance.

---

## 6. Model Limitations & Scientific Caveats

1. **Sample Size Disclosures**: The model is trained on $N=44$ curated high-confidence observational nodes.
2. **Resolution Limitations**: Satellite radiance represents 100m sensor cells; local microclimatic variations within 10–20m corridors are averaged.
3. **Causal Attribution**: The model reflects observed correlations across urban zones. Causal claims regarding intervention outcomes assume standard aerodynamic roughness and boundary layer conditions.
4. **Fallback Mechanism**: When the model artifact is missing or disabled, the engine automatically uses an explicit heuristic baseline ($0.08^\circ\text{C}$ per % canopy $+ 2.5 \times \text{NDVI}$) marked clearly with `mode: "heuristic_fallback"`.
