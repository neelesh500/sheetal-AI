import { useState } from 'react';
import { motion } from 'framer-motion';
import { Layers, MapPin, Maximize, Users, Droplets, Thermometer, Filter, ShieldCheck, ExternalLink } from 'lucide-react';
import AnimatedPage from '../components/AnimatedPage';
import AnimatedButton from '../components/AnimatedButton';
import LayerToggle from '../components/LayerToggle';
import MapLegend from '../components/MapLegend';
import MetricCard from '../components/MetricCard';
import LeafletMap from '../components/LeafletMap';
import {
  mapLayers,
  lstData,
  heatStressData,
  uhiData,
  ndviData,
  cityOverview,
} from '../data/climateData';

const riskColors = {
  Extreme: 'text-rose-500',
  High: 'text-rose-500',
  Severe: 'text-rose-500',
  Moderate: 'text-amber-500',
  Low: 'text-emerald-500',
};

const REGIONS = ['ALL', 'New Delhi', 'Mumbai', 'Bengaluru', 'Ahmedabad', 'Chennai', 'Hyderabad', 'Phoenix'];

export default function HeatMap() {
  const [activeLayer, setActiveLayer] = useState('lst');
  const [selectedRegion, setSelectedRegion] = useState('ALL');
  const [selectedNode, setSelectedNode] = useState(null);
  const layer = mapLayers.find((l) => l.id === activeLayer);
  const anomalies = heatStressData.riskZones;

  const layerStats = {
    lst: [
      { label: 'Mean LST (Skin)', value: `${lstData.cityStats.mean}°C`, delta: lstData.cityStats.anomaly, color: 'var(--accent-rose)' },
      { label: 'Peak Skin LST', value: `${lstData.cityStats.max}°C`, delta: 'Industrial/Dense Asphalt', color: 'var(--accent-rose)' },
      { label: 'Rural Baseline', value: `${lstData.cityStats.ruralBaseline}°C`, delta: 'Vegetated reference', color: 'var(--accent-emerald)' },
    ],
    ndvi: [
      { label: 'City Mean NDVI', value: ndviData.cityStats.mean.toString(), delta: ndviData.cityStats.canopyCover + ' canopy', color: 'var(--accent-emerald)' },
      { label: 'Dense Vegetation', value: ndviData.cityStats.max.toString(), delta: 'Urban forest zones', color: 'var(--accent-emerald)' },
      { label: 'Built Surface', value: ndviData.cityStats.min.toString(), delta: 'High imperviousness', color: 'var(--accent-amber)' },
    ],
    uhi: [
      { label: 'Surface UHI Peak', value: `+${uhiData.cityStats.daytimePeak}°C`, delta: uhiData.cityStats.worstHour, color: 'var(--accent-rose)' },
      { label: 'Nighttime Retention', value: `+${uhiData.cityStats.nighttimePeak}°C`, delta: 'Thermal inertia', color: 'var(--accent-amber)' },
      { label: 'Reference Baseline', value: 'Rural Sector', delta: uhiData.cityStats.ruralReference, color: 'var(--accent-emerald)' },
    ],
    albedo: [
      { label: 'City Mean Albedo', value: '0.14', delta: 'Asphalt & dark roofing', color: 'var(--accent-amber)' },
      { label: 'Cool Roof Target', value: '0.65', delta: '+0.51 albedo uplift', color: 'var(--accent-cyan)' },
      { label: 'Estimated Cooling', value: '−1.8°C', delta: 'Per +0.20 albedo uplift', color: 'var(--accent-emerald)' },
    ],
    heatstress: [
      { label: 'At-Risk Population', value: heatStressData.cityStats.populationAtRisk, delta: 'WBGT > 28°C threshold', color: 'var(--accent-rose)' },
      { label: 'Peak WBGT', value: `${heatStressData.cityStats.peakWbgt}°C`, delta: 'High thermal stress', color: 'var(--accent-rose)' },
      { label: 'Monitored Sectors', value: '44 Nodes', delta: '7 Metropolitan Areas', color: 'var(--accent-cyan)' },
    ],
  };

  return (
    <AnimatedPage>
      <div className="container" style={{ maxWidth: '1400px', margin: '0 auto', padding: '1.5rem 1rem' }}>
        <motion.div
          className="header-section"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: '1.5rem' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 700, color: '#f8fafc' }}>
                Geospatial Thermal Observation Mapping
              </h2>
              <p className="text-muted" style={{ margin: '0.35rem 0 0', maxWidth: '850px', fontSize: '0.9rem' }}>
                Verified georeferenced observations from USGS/NASA Landsat-8/9 C2L2 Band 10 thermal radiance and Copernicus ERA5 reanalysis across metropolitan heat corridors.
              </p>
            </div>

            {/* Metro Filter Pills */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <Filter size={16} className="text-muted" />
              <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>REGION:</span>
              {REGIONS.map((r) => (
                <button
                  key={r}
                  onClick={() => setSelectedRegion(r)}
                  style={{
                    background: selectedRegion === r ? 'var(--accent-cyan)' : 'rgba(255, 255, 255, 0.05)',
                    color: selectedRegion === r ? '#020617' : '#e2e8f0',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '6px',
                    padding: '0.3rem 0.65rem',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        <LayerToggle layers={mapLayers} activeLayer={activeLayer} onChange={setActiveLayer} />

        <div className="layer-stats-row">
          {(layerStats[activeLayer] || []).map((s, i) => (
            <MetricCard key={s.label} {...s} delay={i * 0.05} />
          ))}
        </div>

        <div className="grid-2" style={{ marginTop: '1.5rem' }}>
          <motion.div
            className="glass-panel map-panel"
            style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            key={activeLayer}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: 0 }}>{layer?.data.title} Map Layer</h3>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                  Filter: {selectedRegion} · Source: Landsat 8/9 C2L2 Band 10 TIRS & ERA5
                </span>
              </div>
              <span className="badge badge-stable" style={{ fontSize: '0.72rem' }}>
                Verified Georeferenced
              </span>
            </div>

            <LeafletMap selectedRegion={selectedRegion} onSelectNode={setSelectedNode} />

            <MapLegend
              title={`${layer?.data.title} (${layer?.data.unit || '°C'})`}
              colorScale={layer?.data.colorScale}
              unit={layer?.data.unit}
            />

            {/* Selected Node Details Bar */}
            {selectedNode && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  background: 'rgba(15, 23, 42, 0.85)',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  borderRadius: '6px',
                  padding: '0.85rem 1rem',
                  fontSize: '0.85rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '0.5rem'
                }}
              >
                <div>
                  <strong>{selectedNode.sub_zone}</strong> ({selectedNode.region}) —
                  <span style={{ color: '#fb7185', fontWeight: 'bold', marginLeft: '6px' }}>
                    Skin LST: {selectedNode.lst_celsius.toFixed(1)}°C
                  </span> |
                  <span style={{ color: '#38bdf8', marginLeft: '6px' }}>
                    Air Temp (2m): {selectedNode.air_temp_2m_celsius.toFixed(1)}°C
                  </span> |
                  <span style={{ color: '#f59e0b', marginLeft: '6px' }}>
                    UHI Δ: +{selectedNode.uhi_surface_anomaly_celsius.toFixed(1)}°C
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <AnimatedButton to={`/prediction`} variant="secondary" className="small-btn">
                    Predict Cooling
                  </AnimatedButton>
                </div>
              </motion.div>
            )}
          </motion.div>

          <motion.div
            style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="glass-panel" style={{ padding: '1.5rem' }}>
              <h3 style={{ marginBottom: '0.5rem' }}>Documented Heat Stress Anomalies</h3>
              <p className="text-muted" style={{ fontSize: '0.875rem', marginBottom: '1rem' }}>
                Monitored sectors ranked by radiometric LST skin temperature, WBGT index, and exposed urban population.
              </p>
              <ul className="anomaly-list">
                {anomalies.map((item, i) => (
                  <motion.li
                    key={i}
                    className="anomaly-item glass-panel"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + (i * 0.08) }}
                    whileHover={{ scale: 1.01, background: 'rgba(30, 41, 59, 0.8)' }}
                  >
                    <div className="anomaly-main">
                      <MapPin size={16} className={riskColors[item.risk] || 'text-amber-500'} />
                      <div>
                        <strong>{item.zone}</strong>
                        <span className="anomaly-meta text-muted">
                          <Users size={12} /> {item.exposed} exposed · {item.risk} risk
                        </span>
                      </div>
                    </div>
                    <div className="anomaly-metrics">
                      <span title="Land Surface Temperature (Radiometric Skin)"><Thermometer size={12} /> {item.lst}°C</span>
                      <span title="Wet Bulb Globe Temperature"><Droplets size={12} /> WBGT {item.wbgt}°C</span>
                      <span className={item.risk === 'Extreme' || item.risk === 'High' ? 'text-gradient-hot' : ''}>
                        UTCI {item.utci}°C
                      </span>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </div>

            <div className="glass-panel cta-panel" style={{ padding: '1.5rem' }}>
              <h3 style={{ marginBottom: '0.5rem' }}>Next Step: Analyze Drivers</h3>
              <p className="text-muted" style={{ marginBottom: '1rem' }}>
                Use empirical Random Forest feature importance (MDI) to quantify albedo, NDVI, and impervious surface contributions across corridors.
              </p>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <AnimatedButton to="/analytics" variant="primary">
                  Inspect Feature Drivers
                </AnimatedButton>
                <AnimatedButton to="/simulator" variant="secondary">
                  Simulate Scenarios
                </AnimatedButton>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatedPage>
  );
}
