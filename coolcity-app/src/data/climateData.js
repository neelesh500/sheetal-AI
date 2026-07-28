// Central climate & AIML data for CoolCity Dynamics prototype

export const cityOverview = {
  name: 'Metro Central District',
  population: '2.4M',
  areaKm2: 412,
  studyPeriod: 'Jun–Aug 2024',
  dataSources: ['ECOSTRESS L3', 'Landsat 8/9 OLI-TIRS', 'Sentinel-2 MSI', 'MODIS MCD43A3 Albedo'],
};

export const lstData = {
  title: 'Land Surface Temperature (LST)',
  abbreviation: 'LST',
  description:
    'LST measures the radiative skin temperature of the ground surface from thermal infrared satellite bands. It is a primary input for urban heat island detection and heat stress mapping.',
  unit: '°C',
  formula: 'LST = BT / [1 + (λ × BT / ρ) × ln(ε)] − 273.15',
  sources: ['ECOSTRESS (70 m)', 'Landsat 8 TIRS (100 m)', 'ASTER (90 m)'],
  cityStats: {
    mean: 38.2,
    max: 47.6,
    min: 28.4,
    ruralBaseline: 34.1,
    anomaly: '+4.1°C above rural',
  },
  zones: [
    { zone: 'Downtown Commercial', lst: 47.6, delta: '+4.2°C', impervious: 89 },
    { zone: 'Industrial East', lst: 45.8, delta: '+3.8°C', impervious: 78 },
    { zone: 'Residential Grid B', lst: 41.2, delta: '+1.5°C', impervious: 62 },
    { zone: 'Park Belt North', lst: 32.1, delta: '−2.0°C', impervious: 28 },
    { zone: 'Waterfront Corridor', lst: 29.4, delta: '−4.7°C', impervious: 15 },
  ],
  colorScale: [
    { label: '< 30°C', color: '#06b6d4' },
    { label: '30–35°C', color: '#10b981' },
    { label: '35–40°C', color: '#f59e0b' },
    { label: '40–45°C', color: '#f97316' },
    { label: '> 45°C', color: '#f43f5e' },
  ],
};

export const ndviData = {
  title: 'Normalized Difference Vegetation Index (NDVI)',
  abbreviation: 'NDVI',
  description:
    'NDVI quantifies vegetation health and canopy density using near-infrared and red reflectance. Low NDVI correlates with bare soil, asphalt, and built surfaces that amplify heat retention.',
  unit: 'index (−1 to +1)',
  formula: 'NDVI = (NIR − Red) / (NIR + Red)',
  sources: ['Sentinel-2 MSI (10 m)', 'Landsat 8 OLI (30 m)', 'MODIS MOD13Q1 (250 m)'],
  cityStats: {
    mean: 0.28,
    max: 0.72,
    min: 0.04,
    canopyCover: '18.4%',
    targetCanopy: '30% by 2030',
  },
  zones: [
    { zone: 'Central Park', ndvi: 0.72, canopy: 68, cooling: '−3.2°C LST' },
    { zone: 'Suburban Green Belt', ndvi: 0.58, canopy: 52, cooling: '−2.1°C LST' },
    { zone: 'Residential Grid B', ndvi: 0.31, canopy: 22, cooling: '−0.8°C LST' },
    { zone: 'Downtown Commercial', ndvi: 0.08, canopy: 4, cooling: '+0°C (baseline)' },
    { zone: 'Industrial East', ndvi: 0.04, canopy: 2, cooling: '+1.1°C vs city mean' },
  ],
  colorScale: [
    { label: '< 0.1 (bare/built)', color: '#78716c' },
    { label: '0.1–0.3 (sparse)', color: '#ca8a04' },
    { label: '0.3–0.5 (moderate)', color: '#84cc16' },
    { label: '0.5–0.7 (dense)', color: '#22c55e' },
    { label: '> 0.7 (very dense)', color: '#15803d' },
  ],
};

export const uhiData = {
  title: 'Urban Heat Island (UHI)',
  abbreviation: 'UHI',
  description:
    'UHI is the temperature difference between urban cores and surrounding rural reference areas. It arises from reduced albedo, impervious surfaces, anthropogenic heat, and limited evapotranspiration.',
  unit: '°C ΔT (urban − rural)',
  formula: 'UHI = LST_urban − LST_rural (same overpass time)',
  sources: ['ECOSTRESS day/night pairs', 'Landsat thermal composites', 'Ground weather stations'],
  cityStats: {
    daytimePeak: 4.2,
    nighttimePeak: 2.8,
    annualTrend: '+0.6°C/decade',
    worstHour: '14:00–16:00 local',
    ruralReference: 'Agricultural zone 12 km NW',
  },
  intensityZones: [
    { zone: 'Downtown Core', intensity: 4.2, class: 'Extreme', population: '142K' },
    { zone: 'Industrial East', intensity: 3.8, class: 'Severe', population: '38K' },
    { zone: 'Transit Hub South', intensity: 3.1, class: 'High', population: '67K' },
    { zone: 'Mid-density Residential', intensity: 1.5, class: 'Moderate', population: '310K' },
    { zone: 'Peri-urban Fringe', intensity: 0.4, class: 'Low', population: '89K' },
  ],
  colorScale: [
    { label: '< 1°C', color: '#10b981' },
    { label: '1–2°C', color: '#84cc16' },
    { label: '2–3°C', color: '#f59e0b' },
    { label: '3–4°C', color: '#f97316' },
    { label: '> 4°C', color: '#f43f5e' },
  ],
};

export const albedoData = {
  title: 'Surface Albedo',
  abbreviation: 'Albedo',
  description:
    'Albedo is the fraction of incoming solar radiation reflected by a surface (0–1). Low-albedo materials like asphalt and dark roofs absorb more energy, raising LST and amplifying UHI.',
  unit: 'reflectance (0–1)',
  formula: 'α = Reflected SW / Incident SW',
  sources: ['MODIS MCD43A3', 'Landsat surface reflectance', 'Field spectrometer validation'],
  cityStats: {
    cityMean: 0.14,
    ruralMean: 0.22,
    coolRoofPotential: '+0.35 albedo uplift',
    estimatedLstReduction: '−1.8°C per +0.20 albedo',
  },
  surfaceTypes: [
    { surface: 'Fresh asphalt', albedo: 0.05, lstImpact: '+3.5°C vs grass', area: '28%' },
    { surface: 'Dark concrete roof', albedo: 0.12, lstImpact: '+2.1°C vs grass', area: '34%' },
    { surface: 'Weathered concrete', albedo: 0.20, lstImpact: '+1.2°C vs grass', area: '18%' },
    { surface: 'Cool roof (white coating)', albedo: 0.65, lstImpact: '−2.8°C vs dark roof', area: '4%' },
    { surface: 'Grass / lawn', albedo: 0.23, lstImpact: 'baseline', area: '12%' },
    { surface: 'Tree canopy (summer)', albedo: 0.15, lstImpact: '−4°C shade effect', area: '4%' },
  ],
  colorScale: [
    { label: '< 0.10', color: '#1c1917' },
    { label: '0.10–0.20', color: '#57534e' },
    { label: '0.20–0.35', color: '#a8a29e' },
    { label: '0.35–0.55', color: '#d6d3d1' },
    { label: '> 0.55', color: '#f8fafc' },
  ],
};

export const pinnData = {
  title: 'Physics-Informed Machine Learning',
  abbreviation: 'PINN',
  description:
    'Physics-Informed Neural Networks embed energy balance and radiative transfer constraints into the loss function, ensuring predictions respect thermodynamic laws while learning from satellite and in-situ data.',
  architecture: '6-layer MLP + residual physics block',
  physicsConstraints: [
    'Surface energy balance: Rn = H + LE + G',
    'Stefan–Boltzmann longwave emission',
    'Albedo–LST coupling (α sensitivity)',
    'Evapotranspiration tied to NDVI & soil moisture',
  ],
  modelMetrics: {
    rmse: '1.2°C LST',
    r2: 0.91,
    mae: '0.9°C',
    shapFeatures: 14,
    trainingSamples: '48,200 pixels',
    validationPeriod: '2019–2023',
  },
  shapDrivers: [
    { name: 'Low Albedo (Dark Roofs)', value: '+1.8°C', shap: 0.42, icon: 'Sun', color: 'var(--accent-rose)', width: '85%' },
    { name: 'High Building Density', value: '+1.2°C', shap: 0.28, icon: 'Factory', color: 'var(--accent-amber)', width: '60%' },
    { name: 'NDVI Deficit (Low Vegetation)', value: '+1.0°C', shap: 0.24, icon: 'TreePine', color: 'var(--accent-amber)', width: '50%' },
    { name: 'Impervious Surface Ratio', value: '+0.8°C', shap: 0.19, icon: 'Building2', color: 'var(--accent-rose)', width: '40%' },
    { name: 'Anthropogenic Heat Flux', value: '+0.6°C', shap: 0.14, icon: 'Flame', color: 'var(--accent-amber)', width: '30%' },
    { name: 'Sky View Factor (Canyon)', value: '+0.5°C', shap: 0.11, icon: 'Building', color: 'var(--accent-cyan)', width: '25%' },
  ],
  insights: [
    'Replacing dark roofing with high-albedo (α > 0.55) surfaces yields the highest ROI for downtown LST reduction.',
    'A 15% canopy increase in Grid B reduces afternoon LST by ~1.4°C via evapotranspiration and shade.',
    'Combined cool roofs + urban greening can mitigate UHI by up to 2.7°C in the commercial core.',
    'PINN physics constraints reduce extrapolation error by 34% vs pure black-box ML on unseen interventions.',
  ],
};

export const heatStressData = {
  title: 'Heat Stress Maps',
  abbreviation: 'Heat Stress',
  description:
    'Heat stress indices combine temperature, humidity, and radiation exposure to estimate human thermal discomfort and health risk. Maps integrate LST, land cover, and population density.',
  indices: [
    { name: 'WBGT', full: 'Wet Bulb Globe Temperature', unit: '°C', threshold: '> 28°C = high risk' },
    { name: 'UTCI', full: 'Universal Thermal Climate Index', unit: '°C', threshold: '> 32°C = strong heat stress' },
    { name: 'HI', full: 'Heat Index (apparent temp)', unit: '°C', threshold: '> 39°C = danger' },
  ],
  cityStats: {
    populationAtRisk: '890K',
    peakWbgt: 31.4,
    peakUtci: 38.2,
    peakHi: 44.6,
    vulnerableZones: 12,
  },
  riskZones: [
    { zone: 'Downtown Commercial District', lst: 47.6, wbgt: 31.4, utci: 38.2, hi: 44.6, risk: 'Extreme', exposed: '142K' },
    { zone: 'Industrial Zone East', lst: 45.8, wbgt: 30.1, utci: 36.8, hi: 42.3, risk: 'High', exposed: '38K' },
    { zone: 'Transit Hub South', lst: 43.2, wbgt: 29.2, utci: 35.1, hi: 40.8, risk: 'High', exposed: '67K' },
    { zone: 'Residential Grid B', lst: 41.2, wbgt: 27.8, utci: 33.4, hi: 38.5, risk: 'Moderate', exposed: '210K' },
    { zone: 'School District West', lst: 40.8, wbgt: 27.5, utci: 32.9, hi: 37.9, risk: 'Moderate', exposed: '45K' },
    { zone: 'Park Belt North', lst: 32.1, wbgt: 24.1, utci: 28.6, hi: 32.4, risk: 'Low', exposed: '12K' },
  ],
  colorScale: [
    { label: 'Low', color: '#10b981' },
    { label: 'Moderate', color: '#f59e0b' },
    { label: 'High', color: '#f97316' },
    { label: 'Extreme', color: '#f43f5e' },
  ],
};

export const mapLayers = [
  { id: 'lst', label: 'LST', data: lstData, gradient: 'linear-gradient(135deg, #06b6d4, #10b981, #f59e0b, #f43f5e)' },
  { id: 'ndvi', label: 'NDVI', data: ndviData, gradient: 'linear-gradient(135deg, #78716c, #ca8a04, #84cc16, #15803d)' },
  { id: 'uhi', label: 'UHI', data: uhiData, gradient: 'linear-gradient(135deg, #10b981, #f59e0b, #f43f5e)' },
  { id: 'albedo', label: 'Albedo', data: albedoData, gradient: 'linear-gradient(135deg, #1c1917, #57534e, #d6d3d1, #f8fafc)' },
  { id: 'heatstress', label: 'Heat Stress', data: heatStressData, gradient: 'linear-gradient(135deg, #10b981, #f59e0b, #f97316, #f43f5e)' },
];

export const homeMetrics = [
  { label: 'Mean LST', value: '38.2°C', delta: '+4.1°C vs rural', color: 'var(--accent-rose)' },
  { label: 'UHI Peak', value: '4.2°C', delta: 'Downtown core', color: 'var(--accent-amber)' },
  { label: 'City NDVI', value: '0.28', delta: '18.4% canopy', color: 'var(--accent-emerald)' },
  { label: 'Mean Albedo', value: '0.14', delta: 'Below rural (0.22)', color: 'var(--accent-cyan)' },
  { label: 'At-Risk Population', value: '890K', delta: 'WBGT > 28°C', color: 'var(--accent-rose)' },
  { label: 'PINN Accuracy', value: 'R² 0.91', delta: 'RMSE 1.2°C', color: 'var(--accent-cyan)' },
];

export const conceptCards = [
  { id: 'lst', ...lstData, link: '/heatmap' },
  { id: 'ndvi', ...ndviData, link: '/heatmap' },
  { id: 'uhi', ...uhiData, link: '/heatmap' },
  { id: 'albedo', ...albedoData, link: '/analysis' },
  { id: 'pinn', ...pinnData, link: '/methodology' },
  { id: 'heatstress', ...heatStressData, link: '/heatmap' },
];
