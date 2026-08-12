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

            <div className="module-main-content glass-panel" style={{ padding: '0', marginTop: '2rem', overflow: 'hidden' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 2rem', background: 'rgba(2, 6, 23, 0.6)' }}>
                    <h3 style={{ margin: 0, fontFamily: 'monospace', letterSpacing: '1px' }}>Global Feed Analytics</h3>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#0ea5e9', display: 'inline-block' }}></span>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#f43f5e', display: 'inline-block' }}></span>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981', display: 'inline-block' }}></span>
                    </div>
                </div>

                <div style={{ position: 'relative', height: '400px', width: '100%', background: '#090d16' }}>
                    <img
                        src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200"
                        alt="Data Dashboard"
                        style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.65, mixBlendMode: 'luminosity' }}
                    />

                    <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(14,165,233,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(14,165,233,0.1) 1px, transparent 1px)', backgroundSize: '40px 40px', zIndex: 1 }}></div>

                    <div style={{ position: 'absolute', top: '20px', left: '20px', background: 'rgba(0,0,0,0.7)', padding: '15px 20px', borderRadius: '12px', zIndex: 2, border: '1px solid rgba(14,165,233,0.3)', backdropFilter: 'blur(5px)' }}>
                        <span style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#38bdf8', display: 'block', lineHeight: 1 }}>48,290</span>
                        <p style={{ margin: '5px 0 0 0', fontSize: '0.85rem', color: '#94a3b8', letterSpacing: '1px' }}>ACTIVE SENSOR NODES</p>
                    </div>

                    <div style={{ position: 'absolute', bottom: '20px', right: '20px', background: 'rgba(0,0,0,0.7)', padding: '15px 20px', borderRadius: '12px', zIndex: 2, border: '1px solid rgba(244,63,94,0.3)', backdropFilter: 'blur(5px)' }}>
                        <span style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#f43f5e', display: 'block', lineHeight: 1 }}>+12.4%</span>
                        <p style={{ margin: '5px 0 0 0', fontSize: '0.85rem', color: '#94a3b8', letterSpacing: '1px' }}>THERMAL DELTA SHIFT</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
