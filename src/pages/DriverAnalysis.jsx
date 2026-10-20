import { motion } from 'framer-motion';
import { Brain, Factory, TreePine, Sun, Building2, Flame, Building, ShieldCheck } from 'lucide-react';
import AnimatedPage from '../components/AnimatedPage';
import AnimatedButton from '../components/AnimatedButton';
import { empiricalMlData, albedoData, ndviData } from '../data/climateData';

const iconMap = {
  Sun, Factory, TreePine, Building2, Flame, Building,
};

export default function DriverAnalysis() {
  const drivers = empiricalMlData.shapDrivers.map((d) => ({
    ...d,
    icon: iconMap[d.icon] || Sun,
  }));

  return (
    <AnimatedPage>
      <div className="container" style={{ maxWidth: '1400px', margin: '0 auto', padding: '1.5rem 1rem' }}>
        <motion.div
          className="header-section"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: '2rem' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <Brain size={26} className="text-accent-cyan" />
            <h2 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 700, color: '#f8fafc' }}>
              Empirical Feature Importance & Driver Analysis
            </h2>
          </div>
          <p className="text-muted" style={{ margin: 0, maxWidth: '850px', lineHeight: 1.6, fontSize: '0.9rem' }}>
            Empirical feature attributions derived from the Leave-One-City-Out validated Random Forest regressor, quantifying the contribution of NDVI, canopy coverage, impervious surface, and albedo across monitored urban corridors.
          </p>
        </motion.div>

        <div className="grid-2">
          {/* Driver Bars */}
          <motion.div
            className="glass-panel"
            style={{ padding: '2rem' }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Brain className="text-accent-cyan" />
                <h3 style={{ margin: 0, fontSize: '1.15rem' }}>Variance Reduction (MDI Importance)</h3>
              </div>
              <span className="badge badge-stable" style={{ fontSize: '0.72rem' }}>
                Random Forest MDI
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {drivers.map((driver, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + (i * 0.1) }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <driver.icon size={16} style={{ color: driver.color }} />
                      <span style={{ fontSize: '0.9rem', color: '#f8fafc' }}>{driver.name}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                      <span className="shap-badge" style={{ fontSize: '0.75rem' }}>
                        Weight {(driver.shap * 100).toFixed(1)}%
                      </span>
                      <span style={{ color: driver.color, fontWeight: 'bold', fontSize: '0.85rem' }}>
                        {driver.value}
                      </span>
                    </div>
                  </div>
                  <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                    <motion.div
                      style={{ height: '100%', background: driver.color, borderRadius: '4px' }}
                      initial={{ width: 0 }}
                      animate={{ width: driver.width }}
                      transition={{ duration: 1, delay: 0.4 + (i * 0.1), type: 'spring' }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>

            <div style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <strong style={{ fontSize: '0.85rem', color: '#f8fafc' }}>Scientific Interpretation:</strong>
              <p className="text-muted" style={{ fontSize: '0.8rem', margin: '0.4rem 0 0', lineHeight: 1.5 }}>
                Mean Decrease in Impurity (MDI) indicates that vegetated canopy cover and NDVI together drive over 71% of thermal mitigation variance, followed by impervious surface fraction (26%).
              </p>
            </div>
          </motion.div>

          <motion.div
            style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            {/* Active Model Specification */}
            <div className="glass-panel" style={{ padding: '1.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.15rem' }}>Active Model Specification</h3>
                <span className="badge badge-success" style={{ fontSize: '0.72rem' }}>Production Model</span>
              </div>
              <p className="text-muted" style={{ lineHeight: 1.6, marginBottom: '1rem', fontSize: '0.85rem' }}>
                {empiricalMlData.description}
              </p>
              <div className="pinn-metrics-grid">
                {Object.entries(empiricalMlData.modelMetrics).map(([key, val]) => (
                  <div key={key} className="pinn-metric">
                    <span className="pinn-metric-key">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                    <span className="pinn-metric-val">{val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Albedo breakdown */}
            <div className="glass-panel" style={{ padding: '1.5rem' }}>
              <h3 style={{ marginBottom: '0.75rem', fontSize: '1.05rem' }}>Albedo Reflectance by Surface</h3>
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

            {/* CTA */}
            <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h4 style={{ margin: 0, fontSize: '0.95rem' }}>Simulate Interventions</h4>
                <p className="text-muted" style={{ margin: '0.2rem 0 0', fontSize: '0.8rem' }}>Apply these feature adjustments in the Scenario Simulator.</p>
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
