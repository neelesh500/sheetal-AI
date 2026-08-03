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

                <div className="glass-panel" style={{ padding: '2rem', marginTop: '2rem' }}>
                    <h3>Deep Neural Network Topology</h3>
                    <div style={{ height: '300px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: '#090d16', borderRadius: '12px', marginTop: '1rem', border: '1px dashed rgba(255,255,255,0.1)' }}>
                        <Activity size={40} className="text-accent-cyan" style={{ opacity: 0.3, marginBottom: '1rem' }} />
                        <p style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'monospace' }}>[ RECURRENT NEURAL NETWORK VISUALIZATION RENDERER ]</p>
                        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem', marginTop: '0.5rem' }}>Stream Connected • Tensor Flow Edge Initialized</p>
                    </div>
                </div>
            </div>
        </AnimatedPage>
    );
}
