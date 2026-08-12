import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Activity, TrendingUp, Zap, Clock } from 'lucide-react';
import AnimatedPage from '../components/AnimatedPage';
import AnimatedButton from '../components/AnimatedButton';
import './GenericModule.css'; // Reusing generic styles

export default function AiPrediction() {
    return (
        <AnimatedPage>
            <div className="module-container">
                <div className="module-header">
                    <div className="module-title-box">
                        <Brain size={28} className="module-main-icon text-accent-cyan" />
                        <div>
                            <h1>AI Heat Prediction Engine</h1>
                            <p>Neural network forecasting 48-hour peak temperatures using historical & runtime LST data.</p>
                        </div>
                    </div>
                </div>

                <div className="module-grid" style={{ marginTop: '2rem' }}>
                    <motion.div className="glass-panel" style={{ padding: '1.5rem' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem', color: 'var(--accent-orange)' }}>
                            <TrendingUp size={20} /> <h3 style={{ margin: 0 }}>48-Hour Forecast</h3>
                        </div>
                        <h2 style={{ fontSize: '2.5rem', margin: 0 }}>+2.4°C</h2>
                        <p className="text-muted">Expected average increase across urban heat zones.</p>
                    </motion.div>

                    <motion.div className="glass-panel" style={{ padding: '1.5rem' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem', color: 'var(--accent-emerald)' }}>
                            <Activity size={20} /> <h3 style={{ margin: 0 }}>Model Confidence</h3>
                        </div>
                        <h2 style={{ fontSize: '2.5rem', margin: 0 }}>94.2%</h2>
                        <p className="text-muted">Validated against last 72 hours of ground sensor data.</p>
                    </motion.div>

                    <motion.div className="glass-panel" style={{ padding: '1.5rem' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem', color: 'var(--accent-cyan)' }}>
                            <Zap size={20} /> <h3 style={{ margin: 0 }}>Peak Anomaly</h3>
                        </div>
                        <h2 style={{ fontSize: '2.5rem', margin: 0 }}>46.8°C</h2>
                        <p className="text-muted">Projected LST peak in high-density downtown grid.</p>
                    </motion.div>

                    <motion.div className="glass-panel" style={{ padding: '1.5rem' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem', color: 'var(--accent-rose)' }}>
                            <Clock size={20} /> <h3 style={{ margin: 0 }}>Critical Hours</h3>
                        </div>
                        <h2 style={{ fontSize: '2.5rem', margin: 0 }}>14:00 - 16:30</h2>
                        <p className="text-muted">Maximum thermal retention and radiation period.</p>
                    </motion.div>
                </div>

                <div className="glass-panel" style={{ padding: '0', marginTop: '2rem', overflow: 'hidden', position: 'relative' }}>
                    <div style={{ padding: '2rem', position: 'relative', zIndex: 2, background: 'linear-gradient(to bottom, rgba(3,7,18,0.9) 0%, rgba(3,7,18,0.4) 100%)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3>Deep Neural Network Topology</h3>
                            <span className="badge badge-success" style={{ animation: 'pulse 2s infinite' }}>● Live Inference</span>
                        </div>
                    </div>

                    {/* Real Image Placeholder */}
                    <div style={{ position: 'relative', height: '400px', width: '100%' }}>
                        <img
                            src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=1200"
                            alt="Neural Network"
                            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7, mixBlendMode: 'screen' }}
                        />

                        {/* Overlay scanline effect over image */}
                        <motion.div
                            animate={{ top: ['0%', '100%', '0%'] }}
                            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                            style={{ position: 'absolute', width: '100%', height: '5px', background: 'rgba(56, 189, 248, 0.8)', boxShadow: '0 0 20px rgba(56, 189, 248, 1)', zIndex: 3 }}
                        />

                        <div style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', background: 'rgba(0,0,0,0.8)', padding: '8px 20px', borderRadius: '30px', border: '1px solid rgba(56,189,248,0.3)', zIndex: 4, backdropFilter: 'blur(5px)' }}>
                            <p style={{ color: '#38bdf8', fontSize: '0.85rem', margin: 0, letterSpacing: '2px', fontWeight: 'bold' }}>TENSOR FLOW EDGE • REAL-TIME INFERENCE STREAM</p>
                        </div>
                    </div>
                </div>
            </div>
        </AnimatedPage>
    );
}
