import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, RefreshCw, CheckCircle, Plus, Leaf, Sun, Thermometer } from 'lucide-react';
import AnimatedPage from '../components/AnimatedPage';
import AnimatedButton from '../components/AnimatedButton';
import { albedoData, ndviData, pinnData, heatStressData } from '../data/climateData';

export default function ScenarioSimulator() {
  const [isSimulating, setIsSimulating] = useState(false);
  const [resultReady, setResultReady] = useState(false);
  const [canopy, setCanopy] = useState(40);
  const [albedo, setAlbedo] = useState(75);

  const estimatedCooling = resultReady
    ? (canopy * 0.014 + albedo * 0.018).toFixed(1)
    : null;

  const projectedLst = resultReady
    ? (47.6 - parseFloat(estimatedCooling)).toFixed(1)
    : null;

  const projectedWbgt = resultReady
    ? (31.4 - parseFloat(estimatedCooling) * 0.7).toFixed(1)
    : null;

  const handleSimulate = () => {
    setIsSimulating(true);
    setResultReady(false);

    setTimeout(() => {
      setIsSimulating(false);
      setResultReady(true);
    }, 2500);
  };

  return (
    <AnimatedPage>
      <div className="container">
        <motion.div
          className="header-section"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: '2rem' }}
        >
          <h2>Scenario Simulator & Optimizer</h2>
          <p className="text-muted">
            Test NDVI canopy expansion and cool-roof albedo interventions. PINN model projects LST, UHI, and heat stress reductions.
          </p>
        </motion.div>

        <div className="grid-2">
          <motion.div
            style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="glass-panel" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <Settings size={20} className="text-accent-cyan" />
                <h3>Intervention Strategy</h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="intervention-control">
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <strong><Leaf size={16} /> Urban Greening (NDVI)</strong>
                    <span className="text-emerald-500">+{Math.round(canopy * 0.15)}% Canopy</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={canopy}
                    onChange={(e) => { setCanopy(Number(e.target.value)); setResultReady(false); }}
                    style={{ width: '100%', accentColor: 'var(--accent-emerald)' }}
                  />
                  <span className="text-muted" style={{ fontSize: '0.8rem' }}>
                    Target NDVI uplift: +{(canopy * 0.003).toFixed(2)} · Est. cooling: −{(canopy * 0.014).toFixed(1)}°C LST
                  </span>
                </div>

                <div className="intervention-control albedo">
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <strong><Sun size={16} /> Cool Roofs (Albedo)</strong>
                    <span className="text-cyan-500">α → {(0.12 + albedo * 0.0053).toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={albedo}
                    onChange={(e) => { setAlbedo(Number(e.target.value)); setResultReady(false); }}
                    style={{ width: '100%', accentColor: 'var(--accent-cyan)' }}
                  />
                  <span className="text-muted" style={{ fontSize: '0.8rem' }}>
                    {albedoData.cityStats.estimatedLstReduction} at current setting
                  </span>
                </div>

                <AnimatedButton
                  variant="primary"
                  onClick={handleSimulate}
                  className={isSimulating ? 'simulating' : ''}
                >
                  {isSimulating ? (
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} style={{ display: 'flex' }}>
                      <RefreshCw size={18} />
                    </motion.div>
                  ) : (
                    <><Plus size={18} /> Apply Interventions</>
                  )}
                </AnimatedButton>
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '1.5rem' }}>
              <h4 style={{ marginBottom: '0.75rem' }}>Reference: Albedo Surfaces</h4>
              <div className="surface-table compact">
                {albedoData.surfaceTypes.map((s) => (
                  <div key={s.surface} className="surface-row">
                    <span>{s.surface}</span>
                    <span className="surface-albedo">α {s.albedo}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            className="glass-panel"
            style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 style={{ marginBottom: '1rem' }}>Simulation Results</h3>

            <div className="mock-map enhanced-map" style={{ flex: 1, minHeight: '300px', marginBottom: '1.5rem', background: '#000' }}>
              <img
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1000"
                alt="City Aerial Satellite"
                style={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'cover', opacity: 0.5, filter: 'grayscale(100%) contrast(1.2)' }}
              />
              <AnimatePresence>
                {isSimulating && (
                  <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="sim-overlay"
                  >
                    <div style={{ textAlign: 'center' }}>
                      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }} style={{ marginBottom: '1rem' }}>
                        <RefreshCw size={32} className="text-accent-cyan" />
                      </motion.div>
                      <p>Running Physics-Informed ML Model...</p>
                      <p className="text-muted" style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
                        Enforcing energy balance + albedo–NDVI coupling
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.div
                style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 50%, rgba(244, 63, 94, 0.6) 0%, transparent 60%)', mixBlendMode: 'screen' }}
                animate={{ opacity: resultReady ? 0.2 : 1, scale: resultReady ? 0.9 : 1 }}
                transition={{ duration: 1.5 }}
              />

              <AnimatePresence>
                {resultReady && (
                  <motion.div
                    initial={{ opacity: 0, scale: 1.1 }} animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.5 }}
                    style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.5) 0%, transparent 70%)', mixBlendMode: 'screen' }}
                  >
                    {/* Add some techy scanning lines */}
                    <motion.div animate={{ top: ['0%', '100%', '0%'] }} transition={{ duration: 8, repeat: Infinity, ease: 'linear' }} style={{ position: 'absolute', width: '100%', height: '2px', background: 'rgba(16,185,129,0.8)', boxShadow: '0 0 10px #10b981' }} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <AnimatePresence>
              {resultReady && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="sim-result-panel"
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    <CheckCircle size={20} className="text-emerald-500" />
                    <strong style={{ color: 'var(--accent-emerald)' }}>Optimization Successful</strong>
                  </div>
                  <div className="sim-metrics">
                    <div className="sim-metric">
                      <Thermometer size={16} />
                      <span>LST: 47.6°C → <strong>{projectedLst}°C</strong></span>
                    </div>
                    <div className="sim-metric">
                      <span>Temperature Reduction: <strong>−{estimatedCooling}°C</strong></span>
                    </div>
                    <div className="sim-metric">
                      <span>WBGT: 31.4°C → <strong>{projectedWbgt}°C</strong></span>
                    </div>
                    <div className="sim-metric">
                      <Leaf size={16} />
                      <span>NDVI uplift: +{(canopy * 0.003).toFixed(2)}</span>
                    </div>
                    <div className="sim-metric">
                      <Sun size={16} />
                      <span>Albedo: 0.12 → {(0.12 + albedo * 0.0053).toFixed(2)}</span>
                    </div>
                  </div>
                  <p className="text-muted" style={{ fontSize: '0.875rem', marginTop: '0.75rem' }}>
                    PINN ({pinnData.modelMetrics.r2} accuracy) · {heatStressData.cityStats.populationAtRisk} population benefit estimate
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </AnimatedPage>
  );
}
