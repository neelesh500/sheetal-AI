import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Layers, Cpu, Clock, Calendar, CheckCircle, ArrowRight } from 'lucide-react';
import AnimatedPage from '../components/AnimatedPage';
import AnimatedButton from '../components/AnimatedButton';

export default function DeepLearning() {
    const roadmapArchitectures = [
        {
            title: "U-Net CNN Semantic Segmentation",
            stage: "Research Feasibility",
            timeline: "Phase 2 Roadmap",
            desc: "Designed for high-resolution (sub-30m) land-cover feature extraction directly from multispectral satellite optical rasters.",
            statusBadge: "Planned",
            badgeClass: "badge-warning"
        },
        {
            title: "Vision Transformer (ViT) Spatial Attention",
            stage: "Architecture Design",
            timeline: "Phase 3 Roadmap",
            desc: "Self-attention mechanisms over contiguous urban grids to model thermal advection corridors across varying aerodynamic surface roughness.",
            statusBadge: "Planned",
            badgeClass: "badge-warning"
        },
        {
            title: "Physics-Informed Neural Network (PINN)",
            stage: "Loss Formulation",
            timeline: "Phase 3 Roadmap",
            desc: "Enforcing surface energy balance partial differential equations (Rn = H + λE + G) directly inside neural network loss functions.",
            statusBadge: "Research Phase",
            badgeClass: "badge-critical"
        },
        {
            title: "Long Short-Term Memory (LSTM) Recurrent Net",
            stage: "Data Collection",
            timeline: "Phase 2 Roadmap",
            desc: "Multi-decadal time-series forecasting of microclimate warming trends using sequential ERA5 and MODIS composites.",
            statusBadge: "Planned",
            badgeClass: "badge-warning"
        }
    ];

    return (
        <AnimatedPage>
            <div className="page-container container" style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem 1.5rem' }}>
                <div className="section-header" style={{ marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Brain size={28} className="text-accent-cyan" />
                        <div>
                            <h2 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 700, color: '#f8fafc' }}>
                                Model Architecture Roadmap (Planned Deep Learning)
                            </h2>
                            <p className="text-muted" style={{ margin: '0.25rem 0 0', fontSize: '0.9rem' }}>
                                Transparent disclosure: Sheetal AI currently operates an empirical Random Forest regressor. The deep learning architectures below represent our structured research and development milestones.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="glass-panel" style={{ padding: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                        <div>
                            <h3 style={{ color: 'var(--accent-cyan)', margin: 0, fontSize: '1.2rem' }}>
                                Research & Development Pipelines
                            </h3>
                            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                                Scheduled for integration as satellite training datasets scale beyond N=1,000 grids
                            </span>
                        </div>
                        <AnimatedButton to="/ml-models" variant="secondary" className="small-btn">
                            View Active Production Model <ArrowRight size={14} />
                        </AnimatedButton>
                    </div>

                    <div className="grid-2">
                        {roadmapArchitectures.map((arch, idx) => (
                            <motion.div
                                key={idx}
                                className="concept-card glass-panel"
                                style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                            >
                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                                        <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#f8fafc' }}>{arch.title}</h3>
                                        <span className={`badge ${arch.badgeClass}`} style={{ fontSize: '0.7rem' }}>
                                            {arch.statusBadge}
                                        </span>
                                    </div>
                                    <p className="concept-desc" style={{ color: '#94a3b8', fontSize: '0.85rem', lineHeight: 1.5 }}>
                                        {arch.desc}
                                    </p>
                                </div>

                                <div style={{ marginTop: '1.25rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', color: '#cbd5e1' }}>
                                    <span>Milestone: <strong>{arch.timeline}</strong></span>
                                    <span style={{ color: 'var(--accent-cyan)' }}>Stage: {arch.stage}</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </AnimatedPage>
    );
}
