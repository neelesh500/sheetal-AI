import React from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { ShieldCheck, Download, RefreshCw, Layers } from 'lucide-react';
import './GenericModule.css';

export default function GenericModule({ title, icon: Icon, description }) {
    const handleAction = (actionName) => {
        toast.success(`${actionName} executed successfully in ${title}.`, {
            style: { border: '1px solid #00f0ff', background: '#020617', color: '#00f0ff' }
        });
    };

    return (
        <div className="module-container">
            <div className="module-header">
                <div className="module-title-box">
                    {Icon && <Icon size={28} className="module-main-icon" />}
                    <div>
                        <h1>{title}</h1>
                        <p>{description || 'Advanced monitoring and analytics module for SHEETAL.AI infrastructure.'}</p>
                    </div>
                </div>
                <div className="module-actions">
                    <button onClick={() => handleAction('System Sync')} className="action-btn">
                        <RefreshCw size={16} /> Sync
                    </button>
                    <button onClick={() => handleAction('Data Export')} className="action-btn primary">
                        <Download size={16} /> Export
                    </button>
                </div>
            </div>

            <div className="module-grid">
                {[1, 2, 3, 4].map((i) => (
                    <motion.div
                        key={i}
                        className="module-card glass-panel"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        whileHover={{ y: -5, borderColor: 'rgba(0, 240, 255, 0.5)' }}
                    >
                        <div className="card-top">
                            <Layers size={20} className="text-accent-cyan" />
                            <span className="badge">Active</span>
                        </div>
                        <h3>Widget Panel {i}</h3>
                        <p className="text-muted">Real-time telemetry and advanced metric visualization for urban infrastructure.</p>
                        <button onClick={() => handleAction(`Widget ${i} Analysis`)} className="card-btn">
                            Analyze <ShieldCheck size={14} />
                        </button>
                    </motion.div>
                ))}
            </div>

            <div className="module-main-content glass-panel" style={{ padding: '2rem', marginTop: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h3 style={{ margin: 0, fontFamily: 'monospace', letterSpacing: '1px' }}>Global Feed Analytics</h3>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#0ea5e9', display: 'inline-block' }}></span>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#f43f5e', display: 'inline-block' }}></span>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981', display: 'inline-block' }}></span>
                    </div>
                </div>

                <div style={{ position: 'relative', height: '250px', display: 'flex', alignItems: 'flex-end', gap: '8px', padding: '1rem', background: '#090d16', borderRadius: '8px', overflow: 'hidden' }}>
                    {/* Background Grid */}
                    <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '40px 40px', zIndex: 0 }}></div>

                    {/* Animated Line Chart (SVG) */}
                    <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1, pointerEvents: 'none' }}>
                        <motion.path
                            d="M 0 200 C 100 100, 200 250, 300 150 S 500 200, 600 50 S 800 150, 1000 100 L 1000 250 L 0 250 Z"
                            fill="rgba(14, 165, 233, 0.1)"
                            stroke="rgba(14, 165, 233, 0.5)"
                            strokeWidth="2"
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 4, repeat: Infinity }}
                        />
                    </svg>

                    {/* Animated Data Bars */}
                    {[...Array(24)].map((_, i) => (
                        <motion.div
                            key={i}
                            animate={{ height: [`${20 + Math.random() * 40}%`, `${30 + Math.random() * 60}%`, `${20 + Math.random() * 40}%`] }}
                            transition={{ duration: 2 + Math.random() * 2, repeat: Infinity, ease: 'easeInOut', delay: i * 0.1 }}
                            style={{ flex: 1, backgroundColor: 'rgba(14, 165, 233, 0.8)', borderTop: '2px solid #38bdf8', borderRadius: '4px 4px 0 0', opacity: 0.8, zIndex: 2 }}
                        />
                    ))}

                    <div style={{ position: 'absolute', top: '10px', right: '15px', zIndex: 3 }}>
                        <span style={{ fontSize: '2rem', fontWeight: 'bold', color: '#38bdf8' }}>48,290</span>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8', textAlign: 'right' }}>Active Datapoints</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
