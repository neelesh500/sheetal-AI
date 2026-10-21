import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Brain, TreePine, Sun, Building2, Flame, Building, RefreshCw, ShieldCheck } from 'lucide-react';
import AnimatedPage from '../components/AnimatedPage';
import AnimatedButton from '../components/AnimatedButton';
import { LoadingState, ErrorState } from '../components/StateAlerts';
import { albedoData } from '../data/climateData';
import api from '../services/api';

// Icon map by feature key
const FEATURE_META = {
  ndvi: { label: 'NDVI (Vegetation Index)', icon: TreePine, color: '#10b981' },
  canopy_cover_pct: { label: 'Urban Tree Canopy Cover (%)', icon: TreePine, color: '#34d399' },
  impervious_surface_pct: { label: 'Impervious Surface Fraction (%)', icon: Building2, color: '#f59e0b' },
  surface_albedo: { label: 'Surface Albedo (Reflectance)', icon: Sun, color: '#38bdf8' },
  air_temp_2m_celsius: { label: 'Ambient Air Temp (2m ERA5)', icon: Flame, color: '#f87171' },
  latitude: { label: 'Latitude (Geographic Position)', icon: Building, color: '#a78bfa' },
  longitude: { label: 'Longitude (Geographic Position)', icon: Building, color: '#7c3aed' },
};

function buildDrivers(featureImportances) {
  const total = Object.values(featureImportances).reduce((a, b) => a + b, 0);
  return Object.entries(featureImportances)
    .sort(([, a], [, b]) => b - a)
    .map(([key, importance]) => {
      const meta = FEATURE_META[key] || { label: key, icon: Brain, color: '#94a3b8' };
      const pct = total > 0 ? (importance / total) * 100 : 0;
      return {
        key,
        name: meta.label,
        icon: meta.icon,
        color: meta.color,
        shap: importance,
        pct,
        width: `${Math.min(pct * 1.5, 100).toFixed(1)}%`,
        value: `${pct.toFixed(1)}% MDI`
      };
    });
}

export default function DriverAnalysis() {
  const [drivers, setDrivers] = useState([]);
  const [modelMeta, setModelMeta] = useState(null);
  const [cityBreakdown, setCityBreakdown] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const resp = await api.getModelInfo();
      if (resp.status === 'success' && resp.data) {
        const data = resp.data;
        const importances = data.feature_importances || {};
        setDrivers(buildDrivers(importances));
        setModelMeta(data);
        setCityBreakdown(data.evaluation?.city_error_breakdown || null);
      } else {
        throw new Error('Malformed model-info response');
      }
    } catch (err) {
      setError(err.message || 'Cannot connect to backend model registry');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  return (
    <AnimatedPage>
      <div className="container" style={{ maxWidth: '1400px', margin: '0 auto', padding: '1.5rem 1rem' }}>
        <motion.div
          className="header-section"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: '2rem' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Brain size={26} className="text-accent-cyan" />
              <div>
                <h2 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 700, color: '#f8fafc' }}>
                  Empirical Feature Importance & Driver Analysis
                </h2>
                <p className="text-muted" style={{ margin: '0.25rem 0 0', fontSize: '0.9rem' }}>
                  Real MDI (Mean Decrease in Impurity) importances from the trained RandomForestRegressor.
                </p>
              </div>
            </div>
            <button
              onClick={loadData}
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '0.4rem 0.75rem', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem' }}
            >
              <RefreshCw size={13} className={loading ? 'animate-spin' : ''} /> Refresh
            </button>
          </div>
        </motion.div>

        {loading ? (
          <LoadingState message="Fetching feature importances from trained Random Forest weights..." />
        ) : error ? (
          <ErrorState title="Model Registry Unavailable" message={error} onRetry={loadData} />
        ) : (
          <div className="grid-2">
            {/* Driver Bars */}
            <motion.div
              className="glass-panel"
              style={{ padding: '2rem' }}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Brain className="text-accent-cyan" />
                  <h3 style={{ margin: 0, fontSize: '1.15rem' }}>Variance Reduction (MDI Importance)</h3>
                </div>
                <span className="badge badge-success" style={{ fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <ShieldCheck size={11} /> Live from Backend
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {drivers.map((driver, i) => {
                  const Icon = driver.icon;
                  return (
                    <motion.div
                      key={driver.key}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + i * 0.08 }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Icon size={16} style={{ color: driver.color }} />
                          <span style={{ fontSize: '0.88rem', color: '#f8fafc' }}>{driver.name}</span>
                        </div>
                        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.72rem', color: '#64748b', fontFamily: 'monospace' }}>
                            Gini={driver.shap.toFixed(4)}
                          </span>
                          <span style={{ color: driver.color, fontWeight: 700, fontSize: '0.85rem' }}>
                            {driver.value}
                          </span>
                        </div>
                      </div>
                      <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                        <motion.div
                          style={{ height: '100%', background: driver.color, borderRadius: '4px' }}
                          initial={{ width: 0 }}
                          animate={{ width: `${driver.pct.toFixed(1)}%` }}
                          transition={{ duration: 1.2, delay: 0.3 + i * 0.08, type: 'spring' }}
                        />
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <div style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <strong style={{ fontSize: '0.85rem', color: '#f8fafc' }}>Scientific Interpretation:</strong>
                <p className="text-muted" style={{ fontSize: '0.8rem', margin: '0.4rem 0 0', lineHeight: 1.5 }}>
                  NDVI and Canopy Cover collectively drive <strong style={{ color: '#10b981' }}>
                    {drivers.filter(d => ['ndvi', 'canopy_cover_pct'].includes(d.key)).reduce((a, b) => a + b.pct, 0).toFixed(1)}%
                  </strong> of thermal mitigation variance. Impervious surface is the dominant heat amplifier at <strong style={{ color: '#f59e0b' }}>
                    {drivers.find(d => d.key === 'impervious_surface_pct')?.pct.toFixed(1) || '—'}%
                  </strong> contribution.
                </p>
              </div>
            </motion.div>

            <motion.div
              style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              {/* LOCO City Error Breakdown */}
              {cityBreakdown && (
                <div className="glass-panel" style={{ padding: '1.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3 style={{ margin: 0, fontSize: '1.1rem' }}>LOCO Holdout Error by City</h3>
                    <span className="badge badge-stable" style={{ fontSize: '0.72rem' }}>Leave-One-City-Out</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    {Object.entries(cityBreakdown).map(([city, stats]) => (
                      <div key={city} style={{ display: 'grid', gridTemplateColumns: '130px 1fr 1fr 1fr', gap: '0.5rem', alignItems: 'center', padding: '0.5rem 0.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: '6px', fontSize: '0.8rem' }}>
                        <span style={{ color: '#f8fafc', fontWeight: 600 }}>{city}</span>
                        <span style={{ color: '#94a3b8' }}>N={stats.samples_count}</span>
                        <span style={{ color: '#38bdf8' }}>RMSE: {stats.rmse_celsius}°C</span>
                        <span style={{ color: stats.r2_score >= 0.98 ? '#10b981' : '#f59e0b' }}>R²={stats.r2_score.toFixed(4)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

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
                  <p className="text-muted" style={{ margin: '0.2rem 0 0', fontSize: '0.8rem' }}>Apply feature adjustments in the Scenario Simulator.</p>
                </div>
                <AnimatedButton to="/simulator" variant="primary">Open Simulator</AnimatedButton>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </AnimatedPage>
  );
}
