# DATA SOURCES & PROVENANCE SPECIFICATION

**Project**: SHEETAL.AI  
**Target Domain**: Urban Heat Island (UHI) Dynamics & Microclimate Thermal Mitigation  
**Version**: 1.3.0-verified  

---

## 1. Overview & Data Ethics

Sheetal AI maintains a strict policy of **verifiable scientific honesty**:
- We **never claim live satellite feeds** for datasets that are historical or derived from reanalysis.
- Satellite observations represent radiometric skin surface temperature (LST) acquired during specific sensor overpasses, while meteorological air temperatures represent 2-meter ambient thermodynamic conditions.
- Real-time weather queries are explicitly attributed to their live meteorological source (Open-Meteo REST API) and are segregated from historical satellite thermal catalogs.

---

## 2. Inventory of Primary Datasets

### 2.1 USGS / NASA Landsat 8 & 9 (TIRS & OLI)
- **Product**: Landsat Collection 2 Level-2 Surface Temperature (C2L2 ST)
- **Publisher**: United States Geological Survey (USGS) & NASA
- **Instrument / Bands**: Thermal Infrared Sensor (TIRS / TIRS-2) Band 10 (10.60–11.19 µm), Operational Land Imager (OLI / OLI-2) Bands 4 (Red) and 5 (NIR).
- **Spatial Resolution**: 100 m thermal resampled to 30 m grid.
- **Temporal Coverage in Catalog**: April 18, 2022 to May 28, 2024.
- **Geographic Coverage**: Metropolitan heat corridors across 7 major urban zones:
  - New Delhi / NCR, India (28.6139° N, 77.2090° E)
  - Mumbai, India (19.0760° N, 72.8777° E)
  - Bengaluru, India (12.9716° N, 77.5946° E)
  - Ahmedabad, India (23.0225° N, 72.5714° E)
  - Chennai, India (13.0827° N, 80.2707° E)
  - Hyderabad, India (17.3850° N, 78.4867° E)
  - Phoenix Metropolitan Area, USA (33.4484° N, 112.0740° W)
- **Atmospheric Correction**: Split-window radiative transfer equation using MODTRAN atmospheric profiles and ASTER GED emissivity priors.
- **Quality Assurance**: Pixel QA clear conditions (`QA_CLEAR_PIXEL`), cloud cover < 10%.
- **Access URL**: [https://earthexplorer.usgs.gov](https://earthexplorer.usgs.gov)
- **License**: Public Domain (US Government Work).

### 2.2 Copernicus ECMWF ERA5 Reanalysis
- **Publisher**: European Centre for Medium-Range Weather Forecasts (ECMWF) / Copernicus Climate Change Service (C3S)
- **Variables Utilized**:
  - `2m_temperature` (Kelvin converted to Celsius)
  - `surface_solar_radiation_downwards` (W/m²)
- **Spatial Resolution**: 0.25° × 0.25° (~31 km), downscaled/bilinearly interpolated to observation coordinates.
- **Temporal Resolution**: Hourly reanalysis matching the exact Landsat overpass UTC timestamp (typically 10:30–11:00 AM local solar time).
- **Access URL**: [https://cds.climate.copernicus.eu](https://cds.climate.copernicus.eu)
- **License**: Creative Commons Attribution 4.0 International (CC-BY-4.0).

### 2.3 Live Meteorological Comparison: Open-Meteo
- **Publisher**: Open-Meteo Weather API
- **Purpose**: Optional real-time ambient air temperature comparison at monitored coordinates (`fetch_live_air_temp=true`).
- **Variables**: `temperature_2m` (°C)
- **Latency / Cadence**: Hourly numerical weather prediction forecast/nowcast.
- **License**: Open Data Commons Attribution License (ODC-By v1.0).

---

## 3. Rural & Reference Baseline Methodology

The Urban Heat Island (UHI) anomaly is defined relative to an adjacent rural reference baseline:

$$\Delta T_{\text{surface UHI}} = \text{LST}_{\text{urban}} - \text{LST}_{\text{rural\_reference}}$$

$$\Delta T_{\text{air UHI}} = T_{\text{2m, urban}} - T_{\text{2m, rural\_reference}}$$

### Selection Criteria for Reference Baselines:
1. **Distance**: Located 10–25 km upwind outside the contiguous impervious urban perimeter.
2. **Topography**: Similar elevation (within ±50 m) to prevent adiabatic lapse rate bias.
3. **Land Cover**: Natural grassland, open woodland, or non-irrigated agricultural land.
4. **Acquisition Synchronization**: Extracted from the exact same satellite swath and overpass timestamp to control for diurnal solar zenith variations.

---

## 4. Raw-to-Processed Transformation Pipeline

1. **Digital Number (DN) Conversion**: Radiance calibrated using sensor gain and bias coefficients.
2. **Atmospheric Transmission Correction**: Incorporates water vapor column density from ERA5.
3. **NDVI Calculation**:
   $$\text{NDVI} = \frac{\rho_{\text{NIR}} - \rho_{\text{Red}}}{\rho_{\text{NIR}} + \rho_{\text{Red}}}$$
4. **Surface Albedo Estimation**: Narrow-to-broadband conversion from visible, near-infrared, and shortwave-infrared surface reflectances.
5. **Mitigation Delta (`cooling_observed_celsius`)**:
   Empirical temperature differential observed between unmitigated built nodes (dense asphalt/concrete) and adjacent mitigated nodes (urban tree canopy, parks, cool roofs) under identical ambient meteorological forcing.

---

## 5. Dataset Limitations & Unknowns

- **Sample Size**: The primary catalog contains 44 quality-verified metropolitan observation points.
- **Sensor Footprint**: Landsat 100m thermal pixel size cannot resolve micro-scale street furniture (<10m) without high-resolution airborne or drone thermal survey data.
- **Nocturnal vs Diurnal**: Landsat overpasses occur in daytime (mid-morning). Nocturnal UHI dynamics require MODIS/ECOSTRESS pairs and are labeled as planned roadmap extensions.
