# DATA DICTIONARY: SHEETAL.AI

**Target File**: `backend/historical_heat_dataset.csv`  
**Records**: 44 observations across 7 metropolitan regions  
**Format**: RFC 4180 CSV UTF-8  

---

## 1. Field Specifications

| Column Name | Data Type | Physical Units | Valid Range | Description & Derivation |
| :--- | :--- | :--- | :--- | :--- |
| `record_id` | String | Identifier | `[A-Z]{3}-[0-9]{3}` | Unique identifier (e.g., `DEL-001` for New Delhi node 1). |
| `region` | String | Categorical | 7 metropolitan centers | Primary metropolitan area: `New Delhi`, `Mumbai`, `Bengaluru`, `Ahmedabad`, `Chennai`, `Hyderabad`, `Phoenix`. |
| `sub_zone` | String | Name | Text | Specific administrative locality, corridor, or district within the metro area. |
| `latitude` | Float | Decimal Degrees | `-90.0` to `+90.0` | WGS84 geographic latitude coordinate. |
| `longitude` | Float | Decimal Degrees | `-180.0` to `+180.0` | WGS84 geographic longitude coordinate. |
| `timestamp_utc` | String | ISO 8601 | `YYYY-MM-DDTHH:MM:SSZ` | Acquisition overpass UTC timestamp. |
| `lst_celsius` | Float | Degrees Celsius (°C) | `10.0` to `65.0` | **Radiometric Land Surface Temperature**: Radiative skin temperature derived from Landsat 8/9 Band 10 TIRS. |
| `air_temp_2m_celsius` | Float | Degrees Celsius (°C) | `-10.0` to `55.0` | **2m Ambient Air Temperature**: Atmospheric boundary layer temperature from Copernicus ERA5 reanalysis. |
| `uhi_surface_anomaly_celsius` | Float | Delta Celsius (Δ°C) | `-5.0` to `+15.0` | Surface urban heat island delta: $\text{LST}_{\text{urban}} - \text{LST}_{\text{rural}}$. |
| `uhi_air_anomaly_celsius` | Float | Delta Celsius (Δ°C) | `-2.0` to `+8.0` | Atmospheric urban heat island delta: $T_{\text{air, urban}} - T_{\text{air, rural}}$. |
| `ndvi` | Float | Normalized Ratio | `-1.00` to `+1.00` | **Normalized Difference Vegetation Index**: Calculated from $(\text{NIR} - \text{Red}) / (\text{NIR} + \text{Red})$. Values $>0.4$ indicate healthy vegetation. |
| `surface_albedo` | Float | Broadband Reflectance | `0.00` to `1.00` | Broad-band shortwave surface reflectance. High-albedo cool roofs measure $0.60–0.80$, asphalt measures $0.05–0.15$. |
| `impervious_surface_pct` | Float | Percentage (%) | `0.0` to `100.0` | Fraction of pixel footprint sealed by non-permeable materials (concrete, bitumen, metal). |
| `canopy_cover_pct` | Float | Percentage (%) | `0.0` to `100.0` | Tree crown projection area as a percentage of total land area within the 100m grid cell. |
| `cooling_observed_celsius` | Float | Delta Celsius (Δ°C) | `0.0` to `10.0` | **Target Variable**: Observed temperature reduction attributable to canopy shading, evapotranspiration, and reflective albedo. |
| `quality_flag` | String | Categorical | `QA_CLEAR_PIXEL` | Radiometric QA validation flag indicating unobstructed, cloud-free optical transmission. |
| `satellite_sensor` | String | Sensor Tag | Text | Instrument package: `Landsat-8_TIRS_C2L2` or `Landsat-9_TIRS_C2L2`. |
| `weather_source` | String | Source Tag | Text | Meteorological reanalysis source: `ECMWF_ERA5_Reanalysis`. |
| `license` | String | Legal Tag | Text | Applicable data license: `CC-BY-4.0 / USGS_Public_Domain`. |

---

## 2. Target Variable Definition & Measurement

$$\text{Target: } y = \text{cooling\_observed\_celsius}$$

`cooling_observed_celsius` measures the localized microclimate temperature reduction achieved in an urban sector relative to an unmitigated dense asphalt baseline under identical ambient weather conditions. 

- **Primary physical drivers**:
  1. **Evapotranspirative cooling & shading** via tree canopy cover (`canopy_cover_pct`, `ndvi`).
  2. **Solar radiation reflection** via high-albedo coatings (`surface_albedo`).
  3. **Heat retention reduction** by minimizing thermal mass (`impervious_surface_pct`).
