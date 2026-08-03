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
                            <div className="scanline" style={{ position: 'absolute', width: '100%', height: '4px', background: 'rgba(6,182,212,0.8)', boxShadow: '0 0 10px rgba(6,182,212,1)', top: 0, animation: 'scanline-vertical 3s linear infinite' }} />

                            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                                <Globe size={48} className="text-accent-cyan" style={{ opacity: 0.3, margin: '0 auto 10px' }} />
                                <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)', letterSpacing: '2px' }}>AWAITING SWATH PASS OVER TARGET...</p>
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
                            <span className="badge badge-warning">Buffering...</span>
                        </div>
                        <div style={{ position: 'relative', width: '100%', height: '300px', backgroundColor: '#090d16', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundImage: 'radial-gradient(circle at center, #1e293b 0%, #0f172a 100%)' }}></div>

                            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                                <Play size={40} className="text-amber-500" style={{ opacity: 0.8, margin: '0 auto 10px', filter: 'blur(1px)' }} />
                                <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)', letterSpacing: '2px' }}>PROCESSING TIRS STREAM...</p>
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
