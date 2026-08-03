import React from 'react';
import { motion } from 'framer-motion';
import { Wind, ShieldAlert, Droplets, MapPin, Zap } from 'lucide-react';
import AnimatedPage from '../components/AnimatedPage';
import AnimatedButton from '../components/AnimatedButton';
import './GenericModule.css';

export default function MitigationPlan() {
    const strategies = [
        { id: 1, name: 'Cool Roof Deployment', impact: '-2.4°C LST', priority: 'High', coverage: '34%', icon: Zap },
        { id: 2, name: 'Urban Forest Corridors', impact: '-1.8°C LST', priority: 'Medium', coverage: '12%', icon: MapPin },
        { id: 3, name: 'Water Sprinkling Zones', impact: '-1.2°C LST', priority: 'Critical', coverage: '5%', icon: Droplets },
    ];

    return (
        <AnimatedPage>
            <div className="module-container">
                <div className="module-header">
                    <div className="module-title-box">
                        <Wind size={28} className="module-main-icon text-accent-emerald" />
                        <div>
                            <h1>Mitigation Action Plan</h1>
                            <p>Automated deployment recommendations for cooling urban microclimates.</p>
                        </div>
                    </div>
                    <div className="module-actions">
                        <AnimatedButton variant="primary" onClick={() => { }}>
                            Deploy All Autonomous Agents
                        </AnimatedButton>
                    </div>
                </div>

                <div className="glass-panel" style={{ padding: '2rem', marginTop: '2rem' }}>
                    <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <ShieldAlert className="text-amber-500" /> High-Priority Cooling Targets
                    </h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {strategies.map((strategy) => {
                            const Icon = strategy.icon;
                            return (
                                <motion.div
                                    key={strategy.id}
                                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.5rem', background: 'rgba(2, 6, 23, 0.6)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}
                                    whileHover={{ scale: 1.01, borderColor: 'rgba(16, 185, 129, 0.4)' }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div style={{ padding: '10px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px' }}>
                                            <Icon size={20} className="text-emerald-500" />
                                        </div>
                                        <div>
                                            <h4 style={{ margin: 0, fontSize: '1.1rem' }}>{strategy.name}</h4>
                                            <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b', marginTop: '4px' }}>Target Coverage: {strategy.coverage}</p>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ color: 'var(--accent-emerald)', fontWeight: 'bold' }}>{strategy.impact}</div>
                                            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Estimated Impact</div>
                                        </div>
                                        <span className={`badge ${strategy.priority === 'Critical' ? 'badge-critical' : strategy.priority === 'High' ? 'badge-warning' : 'badge-stable'}`}>
                                            {strategy.priority} Priority
                                        </span>
                                        <AnimatedButton variant="secondary" className="small-btn">Activate</AnimatedButton>
                                    </div>
                                </motion.div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </AnimatedPage>
    );
}
