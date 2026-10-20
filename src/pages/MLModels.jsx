import React from 'react';
import { motion } from 'framer-motion';
import { Settings, CheckCircle2, ShieldCheck, ArrowRight, Zap, Database } from 'lucide-react';
import AnimatedPage from '../components/AnimatedPage';
import AnimatedButton from '../components/AnimatedButton';

export default function MLModels() {
    return (
        <AnimatedPage>
            <div className="page-container container" style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem 1.5rem' }}>
                <div className="section-header" style={{ marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Settings size={28} className="text-accent-cyan" />
                        <div>
                            <h2 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 700, color: '#f8fafc' }}>
                                Machine Learning Model Registry & Architecture
                            </h2>
                            <p className="text-muted" style={{ margin: '0.25rem 0 0', fontSize: '0.9rem' }}>
                                Factual status of production and benchmark models evaluated on verified historical Landsat-8/9 and ERA5 observations.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid-2">
                    {/* Active Production Model */}
                    <motion.div
                        className="glass-panel"
                        style={{ padding: '2rem', borderLeft: '4px solid var(--accent-emerald)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                <span className="badge badge-success" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <CheckCircle2 size={12} /> ACTIVE PRODUCTION MODEL
                                </span>
                                <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>v1.3.0-verified</span>
                            </div>

                            <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.3rem', color: '#f8fafc' }}>
                                Random Forest Regressor
                            </h3>
                            <p className="text-muted" style={{ fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                                100-tree supervised ensemble regressor fitted on 44 documented metropolitan observation nodes across 7 cities. Evaluated via rigorous Leave-One-City-Out (LOCO) geographic holdout validation to eliminate spatial data leakage.
                            </p>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
                                <div>
                                    <span className="text-muted" style={{ fontSize: '0.72rem', display: 'block' }}>HOLDOUT R²</span>
                                    <strong style={{ color: 'var(--accent-cyan)', fontSize: '1.1rem' }}>0.9871</strong>
                                </div>
                                <div>
                                    <span className="text-muted" style={{ fontSize: '0.72rem', display: 'block' }}>HOLDOUT RMSE</span>
                                    <strong style={{ color: '#f8fafc', fontSize: '1.1rem' }}>0.2298°C</strong>
                                </div>
                                <div>
                                    <span className="text-muted" style={{ fontSize: '0.72rem', display: 'block' }}>HOLDOUT MAE</span>
                                    <strong style={{ color: '#f8fafc', fontSize: '1.1rem' }}>0.1580°C</strong>
                                </div>
                            </div>

                            <div style={{ fontSize: '0.8rem', color: '#cbd5e1', lineHeight: 1.6 }}>
                                <div><strong>Hyperparameters:</strong> 100 Estimators · Max Depth 8 · Min Samples Split 3 · Seed 42</div>
                                <div><strong>Primary Features:</strong> NDVI, Canopy %, Impervious %, Albedo, 2m Air Temp, Coordinates</div>
                            </div>
                        </div>

                        <div style={{ marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                            <AnimatedButton to="/prediction" variant="primary" style={{ width: '100%', justifyContent: 'center' }}>
                                Open Prediction Engine <ArrowRight size={16} />
                            </AnimatedButton>
                        </div>
                    </motion.div>

                    {/* Benchmark Baseline Models */}
                    <motion.div
                        className="glass-panel"
                        style={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                <span className="badge badge-stable">BENCHMARK COMPARISONS</span>
                                <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Evaluated Baselines</span>
                            </div>

                            <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.3rem', color: '#f8fafc' }}>
                                Ridge & Persistence Baselines
                            </h3>
                            <p className="text-muted" style={{ fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                                Used as rigorous scientific counter-benchmarks to ensure that the ensemble model adds genuine predictive value beyond simple linear or mean climatological baselines.
                            </p>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '0.85rem 1rem', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                                        <strong>Ridge Linear Baseline (α=1.0)</strong>
                                        <span style={{ color: 'var(--accent-cyan)' }}>LOCO R² = 0.9845</span>
                                    </div>
                                    <div className="text-muted" style={{ fontSize: '0.78rem' }}>
                                        LOCO RMSE = 0.2518°C · MAE = 0.2029°C
                                    </div>
                                </div>

                                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '0.85rem 1rem', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                                        <strong>Mean Persistence Baseline (ȳ)</strong>
                                        <span style={{ color: 'var(--accent-rose)' }}>LOCO R² = -0.0169</span>
                                    </div>
                                    <div className="text-muted" style={{ fontSize: '0.78rem' }}>
                                        LOCO RMSE = 2.0386°C · MAE = 1.8416°C
                                    </div>
                                </div>
                            </div>

                            <div style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.5 }}>
                                The Random Forest outperforms the mean baseline by <strong>88.7% lower RMSE</strong> and improves holdout error over the linear baseline across complex urban canopies.
                            </div>
                        </div>

                        <div style={{ marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                            <AnimatedButton to="/docs" variant="secondary" style={{ width: '100%', justifyContent: 'center' }}>
                                Read Model Card & Methodology <ArrowRight size={16} />
                            </AnimatedButton>
                        </div>
                    </motion.div>
                </div>
            </div>
        </AnimatedPage>
    );
}
