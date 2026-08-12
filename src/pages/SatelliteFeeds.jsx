import React from 'react';
import { motion } from 'framer-motion';
import { Satellite, Download, RefreshCw, Layers, SignalHigh, Globe, Play } from 'lucide-react';
import AnimatedPage from '../components/AnimatedPage';
import AnimatedButton from '../components/AnimatedButton';
import './GenericModule.css';

export default function SatelliteFeeds() {
    return (
        <AnimatedPage>
            <div className="module-container">
                <div className="module-header">
                    <div className="module-title-box">
                        <Satellite size={28} className="module-main-icon text-accent-cyan" />
                        <div>
                            <h1>Live Satellite EO Feeds</h1>
                            <p>Real-time multispectral streaming from ISRO Oceansat-3 & NASA Landsat-9.</p>
                        </div>
                    </div>
                    <div className="module-actions">
                        <AnimatedButton variant="secondary" onClick={() => { }}>
                            <RefreshCw size={16} /> Sync Orbital
                        </AnimatedButton>
                        <AnimatedButton variant="primary" onClick={() => { }}>
                            <Download size={16} /> Export Raster
                        </AnimatedButton>
                    </div>
                </div>

                <div className="grid-2" style={{ marginTop: '2rem' }}>
                    <motion.div
                        className="glass-panel"
                        style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <SignalHigh className="text-emerald-500" size={18} /> ISRO Oceansat-3
                            </h3>
                            <span className="badge badge-stable">Live Uplink</span>
                        </div>
                        <div style={{ position: 'relative', width: '100%', height: '300px', backgroundColor: '#090d16', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }}>
                            {/* Scanning effect */}
                            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(rgba(6,182,212,0.1) 1px, transparent 1px) 0 0 / 20px 20px, linear-gradient(90deg, rgba(6,182,212,0.1) 1px, transparent 1px) 0 0 / 20px 20px' }}></div>

                            {/* Radar Sweep / Satellite Pass */}
                            <motion.div
                                animate={{ top: ['-10%', '110%'] }}
                                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                                style={{ position: 'absolute', width: '100%', height: '40px', background: 'linear-gradient(to bottom, transparent, rgba(16,185,129,0.4), rgba(16,185,129,0.8))', boxShadow: '0 5px 15px rgba(16,185,129,0.5)', top: 0 }}
                            />

                            {/* Data points popping up */}
                            <div style={{ position: 'absolute', width: '100%', height: '100%', padding: '20px' }}>
                                {[...Array(8)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
                                        transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
                                        style={{
                                            position: 'absolute',
                                            left: `${20 + Math.random() * 60}%`,
                                            top: `${10 + Math.random() * 80}%`,
                                            width: '8px', height: '8px',
                                            backgroundColor: '#10b981',
                                            borderRadius: '50%',
                                            boxShadow: '0 0 10px #10b981'
                                        }}
                                    />
                                ))}
                            </div>

                            <div style={{ position: 'absolute', bottom: '10px', right: '10px', textAlign: 'right' }}>
                                <p style={{ fontSize: '0.7rem', color: '#10b981', margin: 0, fontFamily: 'monospace' }}>OCM-3 SWATH ACTIVE</p>
                                <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', margin: 0, fontFamily: 'monospace' }}>LAT: 28.6139° N, LNG: 77.2090° E</p>
                            </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#64748b' }}>
                            <span>Spectrum: VIS-NIR, TIR</span>
                            <span>Resolution: 360m</span>
                        </div>
                    </motion.div>

                    <motion.div
                        className="glass-panel"
                        style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Layers className="text-amber-500" size={18} /> NASA Landsat-9
                            </h3>
                            <span className="badge badge-warning" style={{ animation: 'pulse 1.5s infinite' }}>Streaming</span>
                        </div>
                        <div style={{ position: 'relative', width: '100%', height: '300px', backgroundColor: '#090d16', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: '4px', padding: '20px' }}>

                            {/* Animated Thermal Equalizer / Heat intensity stream */}
                            {[...Array(20)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    animate={{
                                        height: [`${10 + Math.random() * 30}%`, `${40 + Math.random() * 60}%`, `${10 + Math.random() * 30}%`],
                                        backgroundColor: ['#f59e0b', '#ef4444', '#f59e0b']
                                    }}
                                    transition={{ duration: 1.5 + Math.random(), repeat: Infinity, ease: 'easeInOut' }}
                                    style={{
                                        width: '12px',
                                        backgroundColor: '#f59e0b',
                                        borderRadius: '2px 2px 0 0',
                                        boxShadow: '0 0 10px rgba(239,68,68,0.4)',
                                        opacity: 0.8
                                    }}
                                />
                            ))}

                            <div style={{ position: 'absolute', top: '15px', left: '15px' }}>
                                <p style={{ fontSize: '0.8rem', color: '#f59e0b', margin: 0, fontWeight: 'bold' }}>TIRS-2 THERMAL FEED</p>
                                <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', margin: 0, fontFamily: 'monospace' }}>100m SPATIAL RADIOMETRY</p>
                            </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#64748b' }}>
                            <span>Spectrum: OLI-2, TIRS-2</span>
                            <span>Resolution: 30m / 100m</span>
                        </div>
                    </motion.div>
                </div>
            </div>
            {/* Adding basic keyframe here safely */}
            <style>{`
                @keyframes scanline-vertical {
                    0% { top: -10%; }
                    100% { top: 110%; }
                }
            `}</style>
        </AnimatedPage>
    );
}
