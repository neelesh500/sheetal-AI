import { motion } from 'framer-motion';
import { Brain, Factory, TreePine, Sun, Building2, Flame, Building } from 'lucide-react';
import AnimatedPage from '../components/AnimatedPage';
import AnimatedButton from '../components/AnimatedButton';
import { pinnData, albedoData, ndviData } from '../data/climateData';

const iconMap = {
  Sun, Factory, TreePine, Building2, Flame, Building,
};

export default function DriverAnalysis() {
  const drivers = pinnData.shapDrivers.map((d) => ({
    ...d,
    icon: iconMap[d.icon] || Sun,
  }));

  return (
    <AnimatedPage>
      <div className="container">
        <motion.div 
          className="header-section"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: '2rem' }}
        >
          <h2>SHAP Value Driver Analysis</h2>
          <p className="text-muted">
            Physics-Informed ML quantifies how LST, albedo, NDVI, impervious cover, and canyon geometry drive local heat stress in the Downtown District.
          </p>
        </motion.div>

        <div className="grid-2">
          <motion.div 
            className="glass-panel"
            style={{ padding: '2rem' }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
              <Brain className="text-accent-cyan" />
              <h3>AI Explanation (Downtown District)</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {drivers.map((driver, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + (i * 0.12) }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <driver.icon size={16} style={{ color: driver.color }} />
                      <span>{driver.name}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                      <span className="shap-badge">SHAP {driver.shap}</span>
                      <span style={{ color: driver.color, fontWeight: 'bold' }}>{driver.value}</span>
                    </div>
                  </div>
                  <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                    <motion.div 
                      style={{ height: '100%', background: driver.color, borderRadius: '4px' }}
                      initial={{ width: 0 }}
                      animate={{ width: driver.width }}
                      transition={{ duration: 1, delay: 0.5 + (i * 0.12), type: 'spring' }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div 
            style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            {/* PINN Model Card */}
            <div className="glass-panel" style={{ padding: '2rem' }}>
              <h3 style={{ marginBottom: '1rem' }}>Physics-Informed Neural Network</h3>
              <p className="text-muted" style={{ lineHeight: 1.6, marginBottom: '1rem' }}>
                {pinnData.description}
              </p>
              <div className="pinn-metrics-grid">
                {Object.entries(pinnData.modelMetrics).map(([key, val]) => (
                  <div key={key} className="pinn-metric">
                    <span className="pinn-metric-key">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                    <span className="pinn-metric-val">{val}</span>
                  </div>
                ))}
              </div>
              <div className="physics-constraints" style={{ marginTop: '1rem' }}>
                <span className="text-muted" style={{ fontSize: '0.875rem' }}>Embedded physics constraints:</span>
                <ul className="constraint-list">
                  {pinnData.physicsConstraints.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Albedo breakdown */}
            <div className="glass-panel" style={{ padding: '1.5rem' }}>
              <h3 style={{ marginBottom: '1rem' }}>Albedo by Surface Type</h3>
              <div className="surface-table">
                {albedoData.surfaceTypes.slice(0, 4).map((s) => (
                  <div key={s.surface} className="surface-row">
                    <span>{s.surface}</span>
                    <span className="surface-albedo">α = {s.albedo}</span>
                    <span className="surface-impact text-muted">{s.lstImpact}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* NDVI zones */}
            <div className="glass-panel" style={{ padding: '1.5rem' }}>
              <h3 style={{ marginBottom: '1rem' }}>NDVI & Canopy Impact</h3>
              <div className="surface-table">
                {ndviData.zones.slice(0, 4).map((z) => (
                  <div key={z.zone} className="surface-row">
                    <span>{z.zone}</span>
                    <span className="surface-albedo">NDVI {z.ndvi}</span>
                    <span className="surface-impact text-muted">{z.cooling}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '2rem', flex: 1 }}>
              <h3 style={{ marginBottom: '1rem' }}>AI Insights</h3>
              {pinnData.insights.map((insight, i) => (
                <p key={i} className="text-muted" style={{ lineHeight: 1.6, marginBottom: i < pinnData.insights.length - 1 ? '0.75rem' : 0 }}>
                  {insight}
                </p>
              ))}
            </div>

            <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ marginBottom: '0.25rem' }}>Ready to optimize?</h4>
                <p className="text-muted" style={{ fontSize: '0.875rem' }}>Simulate albedo & NDVI interventions in the digital twin.</p>
              </div>
              <AnimatedButton to="/simulator" variant="primary">
                Open Simulator
              </AnimatedButton>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatedPage>
  );
}
