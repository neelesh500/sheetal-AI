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
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3>Deep Neural Network Topology</h3>
                        <span className="badge badge-success" style={{ animation: 'pulse 2s infinite' }}>● Live Inference</span>
                    </div>
                    <div style={{ position: 'relative', height: '350px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'radial-gradient(circle at center, #0a1128 0%, #030712 100%)', borderRadius: '12px', marginTop: '1rem', padding: '2rem 4rem', overflow: 'hidden', border: '1px solid rgba(6,182,212,0.1)' }}>

                        {/* Background Data Stream Effect */}
                        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundImage: 'linear-gradient(rgba(6,182,212,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.03) 1px, transparent 1px)', backgroundSize: '20px 20px', zIndex: 0 }} />

                        {/* Neural Network Nodes */}
                        {[[1, 2, 3, 4], [1, 2, 3, 4, 5, 6], [1, 2, 3, 4, 5], [1, 2, 3]].map((layer, layerIndex) => (
                            <div key={`layer-${layerIndex}`} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', zIndex: 1 }}>
                                {layer.map((node, nodeIndex) => (
                                    <motion.div
                                        key={`node-${layerIndex}-${nodeIndex}`}
                                        initial={{ opacity: 0, scale: 0 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: (layerIndex * 0.2) + (nodeIndex * 0.1), type: 'spring' }}
                                        style={{
                                            width: '24px', height: '24px',
                                            borderRadius: '50%',
                                            background: layerIndex === 0 ? 'rgba(56,189,248,0.2)' : layerIndex === 3 ? 'rgba(239,68,68,0.2)' : 'rgba(168,85,247,0.2)',
                                            border: `2px solid ${layerIndex === 0 ? '#38bdf8' : layerIndex === 3 ? '#ef4444' : '#a855f7'}`,
                                            boxShadow: `0 0 15px ${layerIndex === 0 ? 'rgba(56,189,248,0.5)' : layerIndex === 3 ? 'rgba(239,68,68,0.5)' : 'rgba(168,85,247,0.5)'}`,
                                            position: 'relative'
                                        }}
                                    >
                                        <motion.div
                                            animate={{ opacity: [0.2, 1, 0.2] }}
                                            transition={{ duration: 1.5 + Math.random(), repeat: Infinity, delay: Math.random() }}
                                            style={{ position: 'absolute', inset: '2px', borderRadius: '50%', background: 'white' }}
                                        />
                                    </motion.div>
                                ))}
                            </div>
                        ))}

                        {/* Connecting Lines (Simulated with absolute SVG) */}
                        <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none', opacity: 0.4 }}>
                            <g stroke="rgba(168,85,247,0.3)" strokeWidth="1.5" fill="none">
                                <motion.path d="M 120 100 Q 250 150 380 120 T 640 170" animate={{ strokeDashoffset: [1000, 0] }} strokeDasharray="5,5" transition={{ duration: 20, repeat: Infinity, ease: "linear" }} />
                                <motion.path d="M 120 180 Q 250 120 380 180 T 640 170" animate={{ strokeDashoffset: [1000, 0] }} strokeDasharray="5,5" transition={{ duration: 15, repeat: Infinity, ease: "linear" }} />
                                <motion.path d="M 120 260 Q 300 250 380 200 T 640 170" animate={{ strokeDashoffset: [1000, 0] }} strokeDasharray="5,5" transition={{ duration: 18, repeat: Infinity, ease: "linear" }} />
                            </g>
                        </svg>

                        <div style={{ position: 'absolute', bottom: '15px', left: '50%', transform: 'translateX(-50%)', background: 'rgba(0,0,0,0.6)', padding: '5px 15px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)' }}>
                            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.75rem', margin: 0, letterSpacing: '1px' }}>TENSOR FLOW EDGE • REAL-TIME INFERENCE STREAM</p>
                        </div>
                    </div>
                </div>
            </div>
        </AnimatedPage>
    );
}
