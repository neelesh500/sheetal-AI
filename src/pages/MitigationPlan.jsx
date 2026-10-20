import React from 'react';
import { motion } from 'framer-motion';
import { Wind, ShieldAlert, Droplets, MapPin, Zap, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AnimatedPage from '../components/AnimatedPage';
import AnimatedButton from '../components/AnimatedButton';
import './GenericModule.css';

export default function MitigationPlan() {
    const navigate = useNavigate();

    const strategies = [
        {
            id: 1,
            name: 'Cool Roof Deployment (Albedo Uplift)',
            impact: '−2.4°C LST',
            priority: 'High',
            coverage: '34% Industrial/Commercial',
            desc: 'Application of high-solar-reflectance elastomeric coatings (α ≥ 0.65) to dark concrete and corrugated metal roofs.',
            icon: Zap
        },
        {
            id: 2,
            name: 'Urban Tree Canopy Expansion',
            impact: '−1.8°C LST',
            priority: 'Medium',
            coverage: '15% Street Corridors',
            desc: 'Continuous street tree planting and pocket woodlands to maximize shading and active evapotranspiration.',
            icon: MapPin
        },
        {
            id: 3,
            name: 'Permeable Pavement & Bioswales',
            impact: '−1.2°C LST',
            priority: 'Targeted',
            coverage: '8% Parking & Walkways',
            desc: 'Replacing impervious bitumen with porous pavers to enable groundwater infiltration and evaporative cooling.',
            icon: Droplets
        },
    ];

    return (
        <AnimatedPage>
            <div className="module-container" style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem 1.5rem' }}>
                <div className="module-header">
                    <div className="module-title-box">
                        <Wind size={28} className="module-main-icon text-accent-emerald" />
                        <div>
                            <h1 style={{ fontSize: '1.8rem', fontWeight: 700, margin: 0, color: '#f8fafc' }}>
                                Urban Heat Mitigation Strategies
                            </h1>
                            <p className="text-muted" style={{ margin: '0.25rem 0 0', fontSize: '0.9rem' }}>
                                Evidence-based cooling recommendations derived from empirical satellite observations and cross-validated modeling.
                            </p>
                        </div>
                    </div>
                    <div className="module-actions">
                        <AnimatedButton to="/simulator" variant="primary">
                            Open Scenario Simulator <ArrowRight size={16} />
                        </AnimatedButton>
                    </div>
                </div>

                <div className="glass-panel" style={{ padding: '2rem', marginTop: '2rem' }}>
                    <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.15rem' }}>
                        <ShieldAlert className="text-amber-500" /> Prioritized Cooling Interventions
                    </h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {strategies.map((strategy) => {
                            const Icon = strategy.icon;
                            return (
                                <motion.div
                                    key={strategy.id}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        padding: '1.25rem 1.5rem',
                                        background: 'rgba(2, 6, 23, 0.6)',
                                        borderRadius: '8px',
                                        border: '1px solid rgba(255,255,255,0.06)',
                                        flexWrap: 'wrap',
                                        gap: '1rem'
                                    }}
                                    whileHover={{ scale: 1.005, borderColor: 'rgba(16, 185, 129, 0.4)' }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', flex: 1, minWidth: '280px' }}>
                                        <div style={{ padding: '10px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px', marginTop: '2px' }}>
                                            <Icon size={20} className="text-emerald-500" />
                                        </div>
                                        <div>
                                            <h4 style={{ margin: 0, fontSize: '1.05rem', color: '#f8fafc' }}>{strategy.name}</h4>
                                            <p style={{ margin: '0.25rem 0', fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.5 }}>
                                                {strategy.desc}
                                            </p>
                                            <span style={{ fontSize: '0.78rem', color: '#cbd5e1' }}>
                                                Target: <strong>{strategy.coverage}</strong>
                                            </span>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ color: 'var(--accent-emerald)', fontWeight: 'bold', fontSize: '1.1rem' }}>{strategy.impact}</div>
                                            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Empirical Reduction</div>
                                        </div>
                                        <span className={`badge ${strategy.priority === 'Critical' ? 'badge-critical' : strategy.priority === 'High' ? 'badge-warning' : 'badge-stable'}`}>
                                            {strategy.priority} Priority
                                        </span>
                                        <AnimatedButton
                                            to="/simulator"
                                            variant="secondary"
                                            className="small-btn"
                                        >
                                            Simulate
                                        </AnimatedButton>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </AnimatedPage>
    );
}
