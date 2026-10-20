import React, { useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { Satellite, Brain, Map, Wind, Activity, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import GlobeComponent from '../components/GlobeComponent';
import './SpaceDashboard.css';

function CameraRig({ activeHotspot }) {
    const { camera } = useThree();
    const vec = new THREE.Vector3();

    useFrame(() => {
        if (activeHotspot) {
            const radius = 6;
            const phi = (90 - activeHotspot.lat) * (Math.PI / 180);
            const theta = (activeHotspot.lng + 180) * (Math.PI / 180);
            const rotatedTheta = theta - Math.PI / 2;
            const x = -(radius * Math.sin(phi) * Math.cos(rotatedTheta));
            const z = (radius * Math.sin(phi) * Math.sin(rotatedTheta));
            const y = (radius * Math.cos(phi));

            vec.set(x, y, z);
            camera.position.lerp(vec, 0.05);
            camera.lookAt(0, 0, 0);
        }
    });
    return null;
}

const RegionalMapCanvas = ({ lat, lng }) => {
    const canvasRef = React.useRef(null);

    React.useEffect(() => {
        const mapCanvas = canvasRef.current;
        if (mapCanvas) {
            const mCtx = mapCanvas.getContext('2d');
            mCtx.clearRect(0, 0, mapCanvas.width, mapCanvas.height);

            // Background Grid
            mCtx.fillStyle = '#090d16';
            mCtx.fillRect(0, 0, mapCanvas.width, mapCanvas.height);

            mCtx.strokeStyle = 'rgba(6, 182, 212, 0.15)';
            mCtx.lineWidth = 1;
            for (let i = 0; i < mapCanvas.width; i += 20) {
                mCtx.beginPath(); mCtx.moveTo(i, 0); mCtx.lineTo(i, mapCanvas.height); mCtx.stroke();
            }
            for (let j = 0; j < mapCanvas.height; j += 20) {
                mCtx.beginPath(); mCtx.moveTo(0, j); mCtx.lineTo(mapCanvas.width, j); mCtx.stroke();
            }

            // Draw thermal heat representation
            const grad = mCtx.createRadialGradient(mapCanvas.width / 2, mapCanvas.height / 2, 10, mapCanvas.width / 2, mapCanvas.height / 2, 80);
            grad.addColorStop(0, 'rgba(239, 68, 68, 0.6)');
            grad.addColorStop(0.5, 'rgba(249, 115, 22, 0.4)');
            grad.addColorStop(1, 'transparent');
            mCtx.fillStyle = grad;
            mCtx.beginPath();
            mCtx.arc(mapCanvas.width / 2, mapCanvas.height / 2, 80, 0, Math.PI * 2);
            mCtx.fill();

            // Target crosshair in center
            mCtx.strokeStyle = '#06b6d4';
            mCtx.lineWidth = 2;
            mCtx.beginPath();
            mCtx.arc(mapCanvas.width / 2, mapCanvas.height / 2, 15, 0, Math.PI * 2);
            mCtx.stroke();

            mCtx.fillStyle = '#fff';
            mCtx.font = '10px sans-serif';
            mCtx.fillText(`LAT: ${lat.toFixed(2)} | LON: ${lng.toFixed(2)}`, 10, 20);
        }
    }, [lat, lng]);

    return <canvas ref={canvasRef} width="450" height="150" style={{ width: '100%', height: '100%', display: 'block' }} />;
};

export default function SpaceDashboard() {
    const [timeValue, setTimeValue] = useState(50);
    const [activeHotspot, setActiveHotspot] = useState(null);
    const navigate = useNavigate();

    const handleNavAction = (path) => {
        navigate(path);
    };

    const cards = [
        {
            id: 'eo-data',
            posClass: 'card-tl',
            icon: Satellite,
            title: 'Historical Satellite Catalog',
            badge: 'Landsat 8/9 C2L2',
            badgeClass: 'badge-stable',
            desc: 'Curated multispectral radiance from NASA/USGS Landsat-8/9 Band 10 TIRS and Copernicus ERA5 reanalysis.',
            btnText: 'View Dataset Catalog',
            path: '/datasets'
        },
        {
            id: 'ai-pred',
            posClass: 'card-tr',
            icon: Brain,
            title: 'AI Prediction Engine',
            badge: 'Random Forest',
            badgeClass: 'badge-warning',
            desc: 'Empirical Random Forest regression forecasting urban cooling potential (LOCO R²=0.9871, RMSE=0.23°C).',
            btnText: 'Open Prediction Engine',
            path: '/prediction',
            accent: true
        },
        {
            id: 'hotspot',
            posClass: 'card-bl',
            icon: Map,
            title: 'Active Heat Hotspots',
            badge: '44 Validated Nodes',
            badgeClass: 'badge-critical',
            desc: 'Documented metropolitan sectors experiencing severe urban heat island anomalies relative to rural baselines.',
            btnText: 'Explore Heat Map',
            path: '/mapping'
        },
        {
            id: 'mitigation',
            posClass: 'card-br',
            icon: Wind,
            title: 'Intervention Simulator',
            badge: 'Scenario Modeling',
            badgeClass: 'badge-stable',
            desc: 'Simulate urban interventions: cool roofs (albedo uplift) and tree canopy expansions with exportable reports.',
            btnText: 'Launch Simulator',
            path: '/simulator'
        }
    ];

    return (
        <div className="space-dashboard-container">
            {/* Background & Screen FX */}
            <div className="curved-screen-overlay">
                <div className="scanline" />
            </div>

            {/* 3D Scene */}
            <div className="scene-container">
                <Canvas camera={{ position: [0, 0, 7], fov: 45 }}>
                    <React.Suspense fallback={null}>
                        <GlobeComponent onHotspotClick={setActiveHotspot} />
                    </React.Suspense>
                    <CameraRig activeHotspot={activeHotspot} />
                    <OrbitControls
                        enableZoom={true}
                        enablePan={false}
                        enableDamping={true}
                        dampingFactor={0.05}
                        autoRotate={!activeHotspot}
                        autoRotateSpeed={0.5}
                        minDistance={3}
                        maxDistance={12}
                    />
                </Canvas>
            </div>

            {/* Holographic Overlays */}
            <div className="data-cards-overlay">
                <AnimatePresence>
                    {cards.map((card, index) => {
                        const Icon = card.icon;
                        return (
                            <motion.div
                                key={card.id}
                                className={`data-card ${card.posClass}`}
                                initial={{ opacity: 0, scale: 0.8, y: index > 1 ? 30 : -30 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: index * 0.2 + 0.3, type: 'spring' }}
                                whileHover={{ y: -5 }}
                            >
                                <div className="card-header">
                                    <Icon size={24} className="card-icon" />
                                    <div className="card-title">{card.title}</div>
                                    <span className={`badge ${card.badgeClass}`}>{card.badge}</span>
                                </div>
                                <div className="card-content">
                                    {card.desc}
                                </div>
                                <button
                                    className="action-button card-action-btn"
                                    onClick={() => handleNavAction(card.path)}
                                >
                                    {card.btnText}
                                </button>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>

            {/* Hotspot Modal Overlay */}
            <AnimatePresence>
                {activeHotspot && (
                    <motion.div
                        className="hotspot-modal"
                        initial={{ opacity: 0, scale: 0.9, x: '-50%', y: '-50%' }}
                        animate={{ opacity: 1, scale: 1, x: '-50%', y: '-50%' }}
                        exit={{ opacity: 0, scale: 0.9, x: '-50%', y: '-50%' }}
                    >
                        <div className="modal-header">
                            <h3>🗺️ Observation Node: {activeHotspot.name}</h3>
                            <button className="close-btn" onClick={() => setActiveHotspot(null)}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className="modal-content">
                            <p><strong>Coordinates:</strong> {activeHotspot.lat.toFixed(4)}° N, {activeHotspot.lng.toFixed(4)}° E</p>
                            <p><strong>Satellite LST (Skin):</strong> <span style={{ color: 'var(--accent-orange, #f97316)', fontWeight: 'bold' }}>{activeHotspot.temp}</span></p>
                            {activeHotspot.airTemp && (
                                <p><strong>Ambient Air Temp (2m):</strong> <span style={{ color: '#38bdf8', fontWeight: 'bold' }}>{activeHotspot.airTemp}</span></p>
                            )}
                            <p><strong>Surface UHI Anomaly:</strong> <span className={`badge-critical ${activeHotspot.anomaly?.includes('Critical') || activeHotspot.anomaly?.includes('Warning') ? 'warning' : 'stable'}`}>{activeHotspot.anomaly}</span></p>
                            <p style={{ marginTop: '8px' }}><strong>Empirical Notes:</strong> {activeHotspot.desc}</p>

                            <div style={{ marginTop: '16px', background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.08)', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
                                <div style={{ fontSize: '0.75rem', color: '#a1a1aa', marginBottom: '6px', fontWeight: 600, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span>🛰️ SATELLITE RASTER FOOTPRINT</span>
                                    <span style={{ fontSize: '0.65rem', background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '4px' }}>TIRS Res: 100m</span>
                                </div>
                                <div style={{ position: 'relative', width: '100%', height: '150px', background: '#050505', borderRadius: '6px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }}>
                                    <RegionalMapCanvas lat={activeHotspot.lat} lng={activeHotspot.lng} />
                                </div>
                            </div>

                            <div className="modal-actions">
                                <button className="holo-btn primary modal-btn" onClick={() => handleNavAction('/simulator')}>Simulate Interventions</button>
                                <button className="holo-btn modal-btn" onClick={() => handleNavAction('/mapping')}>Inspect in Heat Map</button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Bottom Controls */}
            <motion.div
                className="bottom-controls"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 1.0 }}
            >
                <div className="timeline-container">
                    <Activity size={20} className="card-icon" />
                    <span className="time-label">HISTORICAL OVERPASS CATALOG</span>
                    <input
                        type="range"
                        className="timeline-slider"
                        min="0" max="100"
                        value={timeValue}
                        onChange={(e) => setTimeValue(e.target.value)}
                    />
                    <span className="time-label">2022–2024</span>
                </div>

                <div className="nav-buttons">
                    <button className="holo-btn primary" onClick={() => handleNavAction('/mapping')}>Heat Map</button>
                    <button className="holo-btn" onClick={() => handleNavAction('/prediction')}>AI Prediction</button>
                    <button className="holo-btn" onClick={() => handleNavAction('/datasets')}>Dataset Catalog</button>
                </div>
            </motion.div>
        </div>
    );
}
