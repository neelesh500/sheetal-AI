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
                        <div style={{ position: 'relative', width: '100%', height: '300px', backgroundColor: '#000', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <img
                                src="https://images.unsplash.com/photo-1542361345-89e58247f2d5?auto=format&fit=crop&q=80&w=1000"
                                alt="Cyberpunk HUD Thermal Map"
                                style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'sepia(1) hue-rotate(180deg) saturate(3) brightness(1.2)', opacity: 0.9 }}
                            />

                            {/* Radar Sweep / Satellite Pass */}
                            <motion.div
                                animate={{ top: ['-10%', '110%'] }}
                                transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
                                style={{ position: 'absolute', width: '100%', height: '40px', background: 'linear-gradient(to bottom, transparent, rgba(6,182,212,0.2), rgba(6,182,212,0.6))', boxShadow: '0 5px 20px rgba(6,182,212,0.5)', top: 0, zIndex: 2 }}
                            />

                            {/* Sci-Fi HUD Crosshair */}
                            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '60px', height: '60px', border: '2px solid rgba(6,182,212,0.5)', borderRadius: '50%', zIndex: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <motion.div animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: 'linear' }} style={{ width: '80%', height: '80%', border: '1px dashed #06b6d4', borderRadius: '50%' }} />
                            </div>

                            <div style={{ position: 'absolute', bottom: '15px', right: '15px', textAlign: 'right', background: 'rgba(0,0,0,0.8)', padding: '8px 12px', borderRadius: '8px', border: '1px solid rgba(6,182,212,0.3)', backdropFilter: 'blur(4px)', zIndex: 4 }}>
                                <p style={{ fontSize: '0.75rem', color: '#06b6d4', margin: 0, fontFamily: 'monospace', fontWeight: 'bold' }}>TARGET LOCK ACQUIRED</p>
                                <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.8)', margin: 0, fontFamily: 'monospace' }}>UPLINK: ACTIVE • SECTOR 7</p>
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
                        <div style={{ position: 'relative', width: '100%', height: '300px', backgroundColor: '#000', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>

                            <img
                                src="https://images.unsplash.com/photo-1533577116850-9cb66cddb69b?auto=format&fit=crop&q=80&w=800"
                                alt="Thermal map"
                                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6, filter: 'hue-rotate(320deg) contrast(1.5)' }}
                            />

                            <div style={{ position: 'absolute', top: '15px', left: '15px', background: 'rgba(0,0,0,0.7)', padding: '8px 12px', borderRadius: '8px', backdropFilter: 'blur(4px)' }}>
                                <p style={{ fontSize: '0.8rem', color: '#f59e0b', margin: 0, fontWeight: 'bold' }}>TIRS-2 THERMAL FEED</p>
                                <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.8)', margin: 0, fontFamily: 'monospace' }}>100m SPATIAL RADIOMETRY</p>
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
