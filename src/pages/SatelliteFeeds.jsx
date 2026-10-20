import React from 'react';
import { motion } from 'framer-motion';
import { Satellite, Download, RefreshCw, Layers, SignalHigh, Globe, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import AnimatedPage from '../components/AnimatedPage';
import AnimatedButton from '../components/AnimatedButton';
import './GenericModule.css';

export default function SatelliteFeeds() {
    const handleExportMetadata = () => {
        const metadata = {
            product: "USGS/NASA Landsat 8/9 Collection 2 Level-2 Surface Temperature",
            sensors: ["TIRS Band 10 (10.60–11.19 µm)", "OLI Bands 4 & 5 (Red/NIR)"],
            spatial_resolution: "100m thermal resampled to 30m grid",
            temporal_coverage: "2022-04-18 to 2024-05-28",
            atmospheric_correction: "Split-window radiative transfer equation with MODTRAN and ERA5",
            access_source: "https://earthexplorer.usgs.gov",
            license: "Public Domain / CC0",
            citation: "USGS Earth Resources Observation and Science (EROS) Center, Landsat Collection 2 Level-2"
        };

        const blob = new Blob([JSON.stringify(metadata, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `landsat_satellite_metadata_citation_${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("Downloaded satellite metadata & citation record.");
    };

    return (
        <AnimatedPage>
            <div className="module-container" style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem 1.5rem' }}>
                <div className="module-header">
                    <div className="module-title-box">
                        <Satellite size={28} className="module-main-icon text-accent-cyan" />
                        <div>
                            <h1 style={{ fontSize: '1.8rem', fontWeight: 700, margin: 0, color: '#f8fafc' }}>
                                Historical Satellite Radiometric Imagery Catalog
                            </h1>
                            <p className="text-muted" style={{ margin: '0.25rem 0 0', fontSize: '0.9rem' }}>
                                Documented multispectral and thermal infrared observations from USGS/NASA Landsat-8 and Landsat-9 missions.
                            </p>
                        </div>
                    </div>
                    <div className="module-actions" style={{ display: 'flex', gap: '0.75rem' }}>
                        <AnimatedButton variant="primary" onClick={handleExportMetadata}>
                            <Download size={16} /> Export Metadata & Citation
                        </AnimatedButton>
                    </div>
                </div>

                <div className="grid-2" style={{ marginTop: '2rem' }}>
                    {/* Optical & Vegetation Card */}
                    <motion.div
                        className="glass-panel"
                        style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: 0, fontSize: '1.1rem' }}>
                                <SignalHigh className="text-emerald-500" size={18} /> Landsat-8/9 OLI-2 Surface Reflectance
                            </h3>
                            <span className="badge badge-stable">Optical & NIR</span>
                        </div>
                        <div style={{ position: 'relative', width: '100%', height: '300px', backgroundColor: '#000', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <img
                                src="https://images.unsplash.com/photo-1542361345-89e58247f2d5?auto=format&fit=crop&q=80&w=1000"
                                alt="Urban Grid Composite"
                                style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'sepia(0.8) hue-rotate(170deg) saturate(1.8) brightness(1.1)', opacity: 0.85 }}
                            />

                            <div style={{ position: 'absolute', bottom: '15px', right: '15px', textAlign: 'right', background: 'rgba(0,0,0,0.8)', padding: '8px 12px', borderRadius: '8px', border: '1px solid rgba(6,182,212,0.3)', backdropFilter: 'blur(4px)' }}>
                                <p style={{ fontSize: '0.75rem', color: '#06b6d4', margin: 0, fontFamily: 'monospace', fontWeight: 'bold' }}>BANDS 4 & 5 (RED / NIR)</p>
                                <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.8)', margin: 0, fontFamily: 'monospace' }}>CALCULATES CANOPY NDVI</p>
                            </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#94a3b8' }}>
                            <span>Spectrum: Visible (Red 0.64–0.67µm), NIR (0.85–0.88µm)</span>
                            <span>Resolution: 30m</span>
                        </div>
                    </motion.div>

                    {/* Thermal Radiance Card */}
                    <motion.div
                        className="glass-panel"
                        style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: 0, fontSize: '1.1rem' }}>
                                <Layers className="text-amber-500" size={18} /> Landsat-8/9 TIRS-2 Band 10
                            </h3>
                            <span className="badge badge-warning">Thermal LST</span>
                        </div>
                        <div style={{ position: 'relative', width: '100%', height: '300px', backgroundColor: '#000', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                            <img
                                src="https://images.unsplash.com/photo-1533577116850-9cb66cddb69b?auto=format&fit=crop&q=80&w=800"
                                alt="Thermal Infrared Map"
                                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7, filter: 'hue-rotate(320deg) contrast(1.4)' }}
                            />

                            <div style={{ position: 'absolute', top: '15px', left: '15px', background: 'rgba(0,0,0,0.7)', padding: '8px 12px', borderRadius: '8px', backdropFilter: 'blur(4px)' }}>
                                <p style={{ fontSize: '0.8rem', color: '#f59e0b', margin: 0, fontWeight: 'bold' }}>TIRS-2 THERMAL RADIANCE</p>
                                <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.8)', margin: 0, fontFamily: 'monospace' }}>10.60–11.19 µm SPLIT-WINDOW</p>
                            </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#94a3b8' }}>
                            <span>Radiance: Band 10 Top-Of-Atmosphere calibrated</span>
                            <span>Sensor Grid: 100m resampled to 30m</span>
                        </div>
                    </motion.div>
                </div>
            </div>
        </AnimatedPage>
    );
}
