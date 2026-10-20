# PROJECT AUDIT: SHEETAL.AI

**Audit Date**: October 2026  
**Auditor**: Full-Stack ML & Scientific Software Review Team  
**Repository**: `sheetal-ai`  
**Current System State**: Functional Prototype undergoing Full-Stack Hardening & Hackathon Readiness

---

## 1. Executive Summary

Sheetal AI is an urban heat island (UHI) mitigation analytics platform designed to analyze surface thermal radiance, ambient meteorological temperatures, and urban cooling interventions (vegetation canopy and cool-roof albedo). 

While the core concept, 3D visualization, and initial Random Forest training pipeline are strong, the repository contained significant scientific over-claims, nonfunctional placeholder components, terminology discrepancies (e.g., claiming "PINN", "TreeSHAP", and "Live Satellite Streams" when the actual implementation is an empirical Random Forest trained on historical Landsat-8/9 and ERA5 data), and a lack of automated test suites and robust CI/CD checks.

This audit provides a factual diagnosis of the repository and outlines the prioritized remediation plan.

---

## 2. Inventory & Architecture Overview

| Layer | Framework / Tech | Entry Points | Status |
| :--- | :--- | :--- | :--- |
| **Frontend** | React 19, Vite 8, React Router v7 (HashRouter), Three.js / React Three Fiber, Leaflet | `index.html`, `src/main.jsx`, `src/App.jsx` | Functional; builds cleanly; contains several placeholder pages and sci-fi mock buttons. |
| **Backend** | FastAPI, Uvicorn, Scikit-learn, Pandas, NumPy, Pydantic v2, Httpx, Joblib | `backend/main.py`, `backend/train_model.py` | Working API with model inference and historical CSV endpoints. Lacks `/health` standard endpoint and input rejection. |
| **ML Engine** | Scikit-Learn `RandomForestRegressor` (100 trees, depth 8) | `backend/train_model.py` -> `backend/lst_model.pkl` | Trained on 44 historical records across 7 metropolitan zones. Lacks leave-one-city-out validation and baseline comparison. |
| **Datasets** | CSV files (`historical_heat_dataset.csv`, `dataset_heat_mitigation.csv`) | `backend/` | Authentic historical Landsat-8/9 C2L2 Band 10 and ERA5 reanalysis. Lacks formal data dictionary and model card documentation. |
| **Database** | SQLite & PostgreSQL schema files | `database/sqlite_schema.sql`, `database/postgresql_schema.sql` | Well-designed DDLs present in `database/`, but currently uncoupled from backend runtime. |
| **Testing** | None (only an ad-hoc `test.js` Puppeteer script) | `test.js` | Zero automated unit/integration tests for backend routes or ML pipelines. |
| **CI/CD** | GitHub Pages deployment workflow | `.github/workflows/deploy.yml` | Builds frontend only; no backend linting, test execution, or health check verification. |

---

## 3. Key Findings & Diagnostic Observations

### 3.1 Scientific Honesty & Feature Claim Discrepancies
1. **Model Algorithm Overclaims**:
   - The UI and comments frequently claim "Physics-Informed Neural Network (PINN)", "Deep Learning", and "Convolutional Neural Network".
   - *Actual Implementation*: A classical `RandomForestRegressor` from Scikit-Learn.
   - *Fix*: Accurately designate the active model as "Empirical Random Forest Regressor". Move CNN, Vision Transformer, and PINN into a structured "Model Roadmap (Planned / Research Stage)" section.
2. **Feature Attribution Overclaims**:
   - The UI labels feature contributions as "TreeSHAP Feature Attribution Analysis" with static mock bars.
   - *Actual Implementation*: The code relies on Random Forest Mean Decrease in Impurity (Gini importance) without calculating actual SHAP values.
   - *Fix*: Relabel transparently as "Random Forest Feature Importance (MDI / Gini & Permutation Analysis)" and document the exact derivation.
3. **Satellite Data Source & Live Stream Claims**:
   - `SpaceDashboard.jsx`, `SatelliteFeeds.jsx`, and `Sidebar.jsx` claim "Live Satellite EO Feeds", "Live Uplink with ISRO Oceansat-3 & Landsat-9", and "ISRO // Bhartiya Antariksh".
   - *Actual Implementation*: Static historical raster/dataset observations from USGS/NASA Landsat 8/9 C2L2 and Copernicus ERA5 reanalysis (plus live weather via Open-Meteo REST API).
   - *Fix*: Relabel all satellite views as "Historical Satellite Catalog & Radiometric Reanalysis". Clarify that Open-Meteo provides live ambient weather, whereas satellite thermal skin temperature originates from historical catalogs.
4. **Mocked Metrics & Hardcoded Claims**:
   - `climateData.js` hardcodes "PINN R² 0.91, RMSE 1.2°C" on the Home dashboard, while `model_metadata.json` shows the Random Forest metrics.
   - *Fix*: Unify frontend metric displays with real metadata served dynamically by `api.getModelInfo()`.

### 3.2 Machine Learning Validation Gaps
1. **Split Strategy Limitations**:
   - Current training uses standard 5-fold cross-validation on 44 samples. Because samples from the same city share geographic and climatic correlation, random KFold creates spatial autocorrelation risk.
   - *Fix*: Implement GroupKFold / Leave-One-City-Out (LOCO) cross-validation and compare against baseline models (Mean Baseline, Ridge Linear Baseline).
2. **Missing Out-of-Distribution Input Rejection**:
   - The API accepted inputs without bounds checking on physical feasibility (e.g., negative albedo or impossible canopy coverage).
   - *Fix*: Implement strict Pydantic range validation and defensive domain bounding.
3. **No Explicit Fallback Indicator**:
   - When the model is absent, a heuristic formula is used silently without setting `mode: "heuristic_fallback"`.
   - *Fix*: Explicitly flag response metadata with `mode: "trained_model"` or `mode: "heuristic_fallback"` and detailed explanation.

### 3.3 Functional Gaps & Placeholder Modules
1. **Nonfunctional Buttons & Fake Toasts**:
   - Buttons like "Initialize Network", "Deploy Model", "Sync Orbital", "Send Drone Grid", and "Deploy All Autonomous Agents" produced synthetic toast popups rather than real operations.
   - *Fix*: Convert nonfunctional actions into functional workflows or explicitly mark them as "Roadmap / Exploration Mode" with clear status badges.
2. **Missing Standard Health Endpoint**:
   - Backend only has `/` root endpoint and lacks `/health` with structured diagnostic payload.
   - *Fix*: Implement `/health` and `/api/v1/health` returning database, model, and dataset health.
3. **Intervention Comparison & Export**:
   - Users had no direct way to compare a documented baseline against an intervention scenario with exported reports.
   - *Fix*: Implement an intervention comparison calculator and structured export (JSON/CSV) for reproducible reporting.

---

## 4. Prioritized Action Plan

| Priority | Phase | Task Description | Target Deliverables |
| :---: | :--- | :--- | :--- |
| **P0** | **ML & Scientific Honesty** | Refactor training and evaluation pipelines with Leave-One-City-Out CV, baseline comparisons, and honest metrics. | `backend/train_model.py`, `backend/evaluate_model.py`, `backend/model_metadata.json` |
| **P0** | **Backend Hardening** | Add `/health`, out-of-distribution input rejection, fallback transparency, and `/api/v1/interventions/compare`. | `backend/main.py` |
| **P0** | **Dataset Provenance** | Document dataset provenance, schema, and limitations. | `DATA_SOURCES.md`, `DATA_DICTIONARY.md`, `docs/MODEL_CARD.md` |
| **P1** | **Core Workflows** | Harden Heat Map, Dataset Catalog, Validated Prediction, and Scenario Comparison. | `HeatMap.jsx`, `AiPrediction.jsx`, `ScenarioSimulator.jsx`, `DatasetCatalog.jsx` |
| **P1** | **UI De-Mocking** | Replace fake claims ("PINN", "TreeSHAP", "Live Satellites") with honest labels and a clean "Model Roadmap". | `Sidebar.jsx`, `SpaceDashboard.jsx`, `DriverAnalysis.jsx`, `DeepLearning.jsx`, `MLModels.jsx`, `SatelliteFeeds.jsx` |
| **P1** | **Automated Testing** | Implement Pytest suite covering backend endpoints, ML evaluation, validation splits, and edge cases. | `backend/tests/` |
| **P2** | **CI/CD & Deployment** | Add CI workflow testing backend + building frontend; add `.env.example`, database initialization, deployment docs. | `.github/workflows/ci.yml`, `README.md`, `database/init_db.py` |
| **P2** | **Reporting** | Generate final factual implementation report. | `IMPLEMENTATION_REPORT.md` |

Implementation starts immediately without waiting for approval.
