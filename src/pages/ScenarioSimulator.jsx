import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, RefreshCw, CheckCircle, Plus, Leaf, Sun, Thermometer, Download, FileText, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import AnimatedPage from '../components/AnimatedPage';
import AnimatedButton from '../components/AnimatedButton';
import { albedoData } from '../data/climateData';
import api from '../services/api';

export default function ScenarioSimulator() {
  const [isSimulating, setIsSimulating] = useState(false);
  const [comparisonReport, setComparisonReport] = useState(null);
  const [canopy, setCanopy] = useState(30);
  const [albedo, setAlbedo] = useState(60); // 0.60
  const [baselineRegion, setBaselineRegion] = useState('New Delhi');
  const [baselineAirTemp, setBaselineAirTemp] = useState(42.0);

  const handleSimulate = async () => {
    setIsSimulating(true);

    try {
      const payload = {
        baseline_region: baselineRegion,
        baseline_latitude: 28.6139,
        baseline_longitude: 77.2090,
        baseline_air_temp: baselineAirTemp,
        baseline_canopy_pct: 12.0,
        baseline_albedo: 0.16,
        baseline_impervious_pct: 78.0,
        scenarios: [
          {
            scenario_id: 'sc-custom',
            name: 'User Custom Scenario',
            canopy_cover_pct: canopy,
            surface_albedo: albedo / 100.0
          },
          {
            scenario_id: 'sc-cool-roofs',
            name: 'Targeted Cool Roofs Initiative',
            canopy_cover_pct: 12.0,
            surface_albedo: 0.65
          },
          {
            scenario_id: 'sc-urban-forestry',
            name: 'Urban Tree Canopy Corridors',
            canopy_cover_pct: 35.0,
            surface_albedo: 0.18
          }
        ]
      };

      const res = await api.compareInterventions(payload);
      if (res.status === 'success' && res.report) {
        setComparisonReport(res.report);
        toast.success("Intervention scenarios calculated using Random Forest engine.");
      }
    } catch (err) {
      console.error("Comparison error:", err);
      toast.error(err.message || "Failed to compare interventions");
    } finally {
      setIsSimulating(false);
    }
  };

  const exportReportJson = () => {
    if (!comparisonReport) return;
    const blob = new Blob([JSON.stringify(comparisonReport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `sheetal_ai_intervention_report_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Reproducible report exported.");
  };

  return (
    <AnimatedPage>
      <div className="container" style={{ maxWidth: '1400px', margin: '0 auto', padding: '1.5rem 1rem' }}>
        <motion.div
          className="header-section"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: '2rem' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 700, color: '#f8fafc' }}>
                Intervention Scenario Simulator & Comparison
              </h2>
              <p className="text-muted" style={{ margin: '0.25rem 0 0', maxWidth: '850px', fontSize: '0.9rem' }}>
                Quantify the microclimate cooling delta achieved by tree canopy expansion and reflective cool-roof coatings against documented metropolitan baselines.
              </p>
            </div>
            {comparisonReport && (
              <button
                onClick={exportReportJson}
                style={{
                  background: 'rgba(56, 189, 248, 0.15)',
                  color: '#38bdf8',
                  border: '1px solid rgba(56, 189, 248, 0.4)',
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  cursor: 'pointer'
                }}
              >
                <Download size={16} /> Export Scenario Report (JSON)
              </button>
            )}
          </div>
        </motion.div>

        <div className="grid-2">
          {/* Controls Panel */}
          <motion.div
            style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="glass-panel" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                <Settings size={20} className="text-accent-cyan" />
                <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Baseline & Scenario Parameters</h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.4rem' }}>
                    Metropolitan Baseline Context:
                  </label>
                  <select
                    value={baselineRegion}
                    onChange={(e) => setBaselineRegion(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.5rem 0.75rem',
                      background: 'rgba(15, 23, 42, 0.9)',
                      color: '#f8fafc',
                      border: '1px solid #334155',
                      borderRadius: '6px',
                      fontSize: '0.85rem'
                    }}
                  >
                    <option value="New Delhi">New Delhi (Baseline: 42.0°C, 12% Canopy, 0.16 Albedo)</option>
                    <option value="Mumbai">Mumbai (Baseline: 36.5°C, 15% Canopy, 0.14 Albedo)</option>
                    <option value="Ahmedabad">Ahmedabad (Baseline: 44.0°C, 8% Canopy, 0.15 Albedo)</option>
                    <option value="Bengaluru">Bengaluru (Baseline: 34.0°C, 24% Canopy, 0.18 Albedo)</option>
                  </select>
                </div>

                <div className="intervention-control">
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                    <strong><Leaf size={16} /> Target Tree Canopy Cover</strong>
                    <span className="text-emerald-500">{canopy}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="60"
                    value={canopy}
                    onChange={(e) => setCanopy(Number(e.target.value))}
                    style={{ width: '100%', accentColor: 'var(--accent-emerald)' }}
                  />
                  <span className="text-muted" style={{ fontSize: '0.78rem' }}>
                    Delta vs baseline: +{canopy - 12}% canopy cover
                  </span>
                </div>

                <div className="intervention-control albedo">
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                    <strong><Sun size={16} /> Surface Albedo (Roofing & Pavements)</strong>
                    <span className="text-cyan-500">α = {(albedo / 100).toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="15"
                    max="80"
                    value={albedo}
                    onChange={(e) => setAlbedo(Number(e.target.value))}
                    style={{ width: '100%', accentColor: 'var(--accent-cyan)' }}
                  />
                  <span className="text-muted" style={{ fontSize: '0.78rem' }}>
                    High-reflectance cool roofs range from 0.60 to 0.75
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
                    <><Plus size={18} /> Run Intervention Comparison</>
                  )}
                </AnimatedButton>
              </div>
            </div>

            {/* Reference Table */}
            <div className="glass-panel" style={{ padding: '1.5rem' }}>
              <h4 style={{ marginBottom: '0.75rem', fontSize: '0.95rem' }}>Empirical Albedo Benchmarks</h4>
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

          {/* Results Comparison View */}
          <motion.div
            className="glass-panel"
            style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 style={{ margin: '0 0 1rem', fontSize: '1.1rem' }}>Scenario Comparison Results</h3>

            {!comparisonReport ? (
              <div style={{
                flex: 1,
                minHeight: '340px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                color: '#94a3b8',
                border: '1px dashed rgba(255,255,255,0.1)',
                borderRadius: '8px',
                padding: '2rem'
              }}>
                <Thermometer size={36} className="text-accent-cyan" style={{ marginBottom: '1rem', opacity: 0.7 }} />
                <p style={{ margin: 0, fontWeight: 600 }}>No active simulation run.</p>
                <p style={{ margin: '0.5rem 0 1.25rem', fontSize: '0.85rem', maxWidth: '380px' }}>
                  Adjust parameters on the left and click "Run Intervention Comparison" to evaluate scenarios against the verified Random Forest model.
                </p>
                <AnimatedButton variant="primary" onClick={handleSimulate}>
                  Run Baseline Comparison
                </AnimatedButton>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {/* Baseline Summary Card */}
                <div style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  padding: '1rem 1.25rem',
                  borderRadius: '8px',
                  fontSize: '0.85rem'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                    <span className="text-muted">Baseline Metro & Air Temp:</span>
                    <strong>{comparisonReport.baseline.region} ({comparisonReport.baseline.air_temp_2m_celsius}°C)</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span className="text-muted">Initial Natural Cooling:</span>
                    <strong style={{ color: 'var(--accent-emerald)' }}>-{comparisonReport.baseline.initial_cooling_celsius}°C</strong>
                  </div>
                </div>

                {/* Scenario Cards */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {comparisonReport.scenarios.map((sc) => (
                    <div
                      key={sc.scenario_id}
                      style={{
                        background: 'rgba(15, 23, 42, 0.7)',
                        border: '1px solid rgba(56, 189, 248, 0.2)',
                        borderRadius: '8px',
                        padding: '1rem 1.25rem'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <strong style={{ color: '#f8fafc', fontSize: '0.95rem' }}>{sc.scenario_name}</strong>
                        <span className="badge badge-stable" style={{ fontSize: '0.72rem' }}>
                          Net Δ: -{sc.net_additional_cooling_celsius}°C
                        </span>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', fontSize: '0.8rem', color: '#cbd5e1' }}>
                        <div>
                          <span className="text-muted" style={{ display: 'block', fontSize: '0.72rem' }}>POST-MITIGATION AIR</span>
                          <strong style={{ color: '#38bdf8', fontSize: '1rem' }}>{sc.projected_air_temp_celsius}°C</strong>
                        </div>
                        <div>
                          <span className="text-muted" style={{ display: 'block', fontSize: '0.72rem' }}>CANOPY UPLIFT</span>
                          <strong style={{ color: 'var(--accent-emerald)' }}>+{sc.canopy_delta_pct}%</strong>
                        </div>
                        <div>
                          <span className="text-muted" style={{ display: 'block', fontSize: '0.72rem' }}>ALBEDO UPLIFT</span>
                          <strong style={{ color: 'var(--accent-cyan)' }}>+{sc.albedo_delta}</strong>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Methodology & Assumptions Footer */}
                <div style={{ background: 'rgba(2, 6, 23, 0.5)', padding: '0.85rem 1rem', borderRadius: '6px', fontSize: '0.75rem', color: '#94a3b8' }}>
                  <strong>Assumptions & Scientific Methodology:</strong>
                  <ul style={{ margin: '0.35rem 0 0', paddingLeft: '1.2rem', lineHeight: 1.5 }}>
                    {comparisonReport.methodology.assumptions.map((a, i) => (
                      <li key={i}>{a}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </AnimatedPage>
  );
}
