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

            <div className="module-main-content glass-panel">
                <div className="placeholder-chart">
                    <p>Interactive Visualization Area</p>
                    <span>Awaiting Data Stream...</span>
                </div>
            </div>
        </div>
    );
}
