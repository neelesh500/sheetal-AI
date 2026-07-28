import { useState } from 'react';
import { motion } from 'framer-motion';
import { Layers, MapPin, Maximize, Users, Droplets, Thermometer } from 'lucide-react';
import AnimatedPage from '../components/AnimatedPage';
import AnimatedButton from '../components/AnimatedButton';
import LayerToggle from '../components/LayerToggle';
import MapLegend from '../components/MapLegend';
import MetricCard from '../components/MetricCard';
import SatelliteAnalysisMap from '../components/SatelliteAnalysisMap';
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

export default function HeatMap() {
  const [activeLayer, setActiveLayer] = useState('lst');
  const layer = mapLayers.find((l) => l.id === activeLayer);
  const anomalies = heatStressData.riskZones;

  const layerStats = {
    lst: [
      { label: 'Mean LST', value: `${lstData.cityStats.mean}°C`, delta: lstData.cityStats.anomaly, color: 'var(--accent-rose)' },
      { label: 'Peak LST', value: `${lstData.cityStats.max}°C`, delta: 'Downtown Commercial', color: 'var(--accent-rose)' },
      { label: 'Rural Baseline', value: `${lstData.cityStats.min}°C`, delta: 'Park Belt reference', color: 'var(--accent-emerald)' },
    ],
    ndvi: [
      { label: 'City NDVI', value: ndviData.cityStats.mean.toString(), delta: ndviData.cityStats.canopyCover + ' canopy', color: 'var(--accent-emerald)' },
      { label: 'Dense Vegetation', value: ndviData.cityStats.max.toString(), delta: 'Central Park', color: 'var(--accent-emerald)' },
      { label: 'Built Surface', value: ndviData.cityStats.min.toString(), delta: 'Industrial East', color: 'var(--accent-amber)' },
    ],
    uhi: [
      { label: 'Daytime Peak', value: `+${uhiData.cityStats.daytimePeak}°C`, delta: uhiData.cityStats.worstHour, color: 'var(--accent-rose)' },
      { label: 'Nighttime Peak', value: `+${uhiData.cityStats.nighttimePeak}°C`, delta: 'Nocturnal retention', color: 'var(--accent-amber)' },
      { label: 'Trend', value: uhiData.cityStats.annualTrend, delta: 'Long-term increase', color: 'var(--accent-rose)' },
    ],
    albedo: [
      { label: 'City Mean', value: '0.14', delta: 'Below rural (0.22)', color: 'var(--accent-amber)' },
      { label: 'Cool Roof Potential', value: '+0.35', delta: 'Albedo uplift', color: 'var(--accent-cyan)' },
      { label: 'LST Reduction', value: '−1.8°C', delta: 'Per +0.20 albedo', color: 'var(--accent-emerald)' },
    ],
    heatstress: [
      { label: 'At-Risk Population', value: heatStressData.cityStats.populationAtRisk, delta: 'WBGT > 28°C', color: 'var(--accent-rose)' },
      { label: 'Peak WBGT', value: `${heatStressData.cityStats.peakWbgt}°C`, delta: 'Extreme threshold', color: 'var(--accent-rose)' },
      { label: 'Vulnerable Zones', value: heatStressData.cityStats.vulnerableZones.toString(), delta: 'Require intervention', color: 'var(--accent-amber)' },
    ],
  };

  return (
    <AnimatedPage>
      <div className="container">
        <motion.div
          className="header-section"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: '1.5rem' }}
        >
          <h2>Urban Heat & Stress Maps</h2>
          <p className="text-muted">
            Multi-layer viewer: LST from ECOSTRESS & Landsat 8, NDVI canopy, UHI intensity, albedo, and composite heat stress indices for {cityOverview.name}.
          </p>
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
              <h3>{layer?.data.title} Scan</h3>
              <AnimatedButton variant="secondary" className="small-btn" onClick={() => alert(`Full screen satellite search display toggled!`)}>
                <Maximize size={16} /> Expand
              </AnimatedButton>
            </div>

            <SatelliteAnalysisMap />

            <MapLegend
              title={layer?.data.title}
              colorScale={layer?.data.colorScale}
              unit={layer?.data.unit}
            />
          </motion.div>

          <motion.div
            style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="glass-panel" style={{ padding: '1.5rem' }}>
              <h3 style={{ marginBottom: '0.5rem' }}>Heat Stress Anomalies</h3>
              <p className="text-muted" style={{ fontSize: '0.875rem', marginBottom: '1rem' }}>
                Zones ranked by LST, WBGT, UTCI, and exposed population.
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
                      <span title="Land Surface Temperature"><Thermometer size={12} /> {item.lst}°C</span>
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
                Use SHAP + Physics-Informed ML to quantify albedo, NDVI, and impervious surface contributions.
              </p>
              <AnimatedButton to="/analysis" variant="primary">
                Run SHAP Analysis
              </AnimatedButton>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatedPage >
  );
}
