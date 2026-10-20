import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Stars, useTexture } from '@react-three/drei';
import * as THREE from 'three';

import api from '../services/api';

export default function GlobeComponent({ onHotspotClick }) {
    const earthRef = useRef();
    const cloudsRef = useRef();

    // Load local texture specifically to fix 'blue ball' UI issue
    const [colorMap] = useTexture([`${import.meta.env.BASE_URL}earth-blue-marble.jpg`]);

    // Calculate 3D position from Lat/Lng
    const getPositionFromLatLng = (lat, lng, radius) => {
        const phi = (90 - lat) * (Math.PI / 180);
        const theta = (lng + 180) * (Math.PI / 180);
        const x = -(radius * Math.sin(phi) * Math.cos(theta));
        const z = (radius * Math.sin(phi) * Math.sin(theta));
        const y = (radius * Math.cos(phi));
        return new THREE.Vector3(x, y, z);
    };

    const [hotspots, setHotspots] = React.useState([]);

    React.useEffect(() => {
        api.getHotspots()
            .then(data => {
                if (data.status === 'success' && data.data) {
                    setHotspots(data.data);
                }
            })
            .catch(err => console.error("Could not load backend hotspots:", err));
    }, []);

    useFrame((state) => {
        if (cloudsRef.current) {
            cloudsRef.current.rotation.y += 0.001;
        }
    });

    const handleGlobeClick = (e) => {
        e.stopPropagation();
        if (onHotspotClick && e.uv) {
            // Reverse calculate Lat/Lng from UV coordinates
            const lng = (e.uv.x * 360) - 180;
            const lat = (e.uv.y * 180) - 90;

            // Find nearest authentic historical hotspot node
            let closest = null;
            let minDist = Infinity;
            for (const spot of hotspots) {
                const dLat = (spot.latitude || spot.lat) - lat;
                const dLng = (spot.longitude || spot.lng) - lng;
                const dist = Math.sqrt(dLat * dLat + dLng * dLng);
                if (dist < minDist) {
                    minDist = dist;
                    closest = spot;
                }
            }

            if (closest && minDist < 25) {
                onHotspotClick({
                    id: closest.id || closest.record_id,
                    name: `${closest.sub_zone} (${closest.region})`,
                    lat: closest.latitude || closest.lat,
                    lng: closest.longitude || closest.lng,
                    temp: `${closest.lst_celsius.toFixed(1)}°C (LST)`,
                    airTemp: `${closest.air_temp_2m_celsius.toFixed(1)}°C (Air)`,
                    anomaly: `+${closest.uhi_surface_anomaly_celsius.toFixed(1)}°C UHI`,
                    desc: `Sensor: ${closest.satellite_sensor || 'Landsat-8/9 TIRS'}. Surface LST: ${closest.lst_celsius.toFixed(1)}°C vs Ambient Air: ${closest.air_temp_2m_celsius.toFixed(1)}°C.`
                });
            } else {
                onHotspotClick({
                    id: `global-${lat.toFixed(1)}-${lng.toFixed(1)}`,
                    name: `Global Sector (${lat.toFixed(2)}°, ${lng.toFixed(2)}°)`,
                    lat: lat,
                    lng: lng,
                    temp: 'Nominal Ocean/Rural Basemap',
                    anomaly: 'Baseline (0.0°C)',
                    desc: 'Clear sky multispectral baseline radiance outside monitored metropolitan clusters.'
                });
            }
        }
    };

    return (
        <group>
            <ambientLight intensity={0.5} />
            <directionalLight position={[5, 3, 5]} intensity={1} />
            <pointLight position={[-5, -3, -5]} color="#a1a1aa" intensity={0.2} distance={20} />

            {/* Space Background Elements */}
            <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={0.5} />

            {/* The Earth */}
            <group ref={earthRef} rotation={[0, -Math.PI / 2, 0]}>

                {/* Solid Globe with Texture - Clickable Anywhere */}
                <Sphere args={[2.5, 64, 64]} onClick={handleGlobeClick} onPointerOver={(e) => { document.body.style.cursor = 'crosshair'; }} onPointerOut={(e) => { document.body.style.cursor = 'auto'; }}>
                    <meshStandardMaterial
                        map={colorMap}
                        roughness={0.8}
                        metalness={0.2}
                    />
                </Sphere>

                {/* Wireframe Overlay / Gridlines */}
                <Sphere args={[2.51, 32, 32]}>
                    <meshBasicMaterial
                        color="#ffffff"
                        wireframe={true}
                        transparent
                        opacity={0.02}
                    />
                </Sphere>

                {/* Fixed Hotspots */}
                {hotspots.map((spot) => {
                    const lat = spot.latitude || spot.lat;
                    const lng = spot.longitude || spot.lng;
                    const pos = getPositionFromLatLng(lat, lng, 2.52);
                    return (
                        <mesh
                            key={spot.id || spot.record_id}
                            position={pos}
                            onClick={(e) => {
                                e.stopPropagation();
                                if (onHotspotClick) onHotspotClick({
                                    id: spot.id || spot.record_id,
                                    name: `${spot.sub_zone} (${spot.region})`,
                                    lat: lat,
                                    lng: lng,
                                    temp: `${Number(spot.lst_celsius).toFixed(1)}°C (LST)`,
                                    airTemp: `${Number(spot.air_temp_2m_celsius).toFixed(1)}°C (Air)`,
                                    anomaly: `+${Number(spot.uhi_surface_anomaly_celsius).toFixed(1)}°C UHI`,
                                    desc: `Sensor: ${spot.satellite_sensor || 'Landsat-8/9 TIRS'}. Surface LST: ${Number(spot.lst_celsius).toFixed(1)}°C vs Ambient Air: ${Number(spot.air_temp_2m_celsius).toFixed(1)}°C.`
                                });
                            }}
                            onPointerOver={(e) => { document.body.style.cursor = 'pointer'; e.stopPropagation(); }}
                            onPointerOut={(e) => { document.body.style.cursor = 'auto'; }}
                        >
                            <sphereGeometry args={[0.04, 16, 16]} />
                            <meshBasicMaterial color="#ef4444" />
                            {/* Halos */}
                            <mesh>
                                <sphereGeometry args={[0.08, 16, 16]} />
                                <meshBasicMaterial color="#ef4444" transparent opacity={0.3} blending={THREE.AdditiveBlending} />
                            </mesh>
                        </mesh>
                    );
                })}

                {/* Data Stream Lines (Curves around planet) */}
                {Array.from({ length: 3 }).map((_, i) => {
                    const radius = 2.7 + Math.random() * 0.3;
                    return (
                        <mesh key={`ring-${i}`} rotation={[Math.random() * Math.PI, Math.random() * Math.PI, 0]}>
                            <torusGeometry args={[radius, 0.001, 16, 100]} />
                            <meshBasicMaterial color="#cbd5e1" transparent opacity={0.1} />
                        </mesh>
                    );
                })}
            </group>

            {/* Atmospheric Glow */}
            <Sphere args={[2.65, 64, 64]} ref={cloudsRef}>
                <meshBasicMaterial
                    color="#e0f2fe"
                    transparent
                    opacity={0.05}
                    side={THREE.BackSide}
                    blending={THREE.AdditiveBlending}
                />
            </Sphere>
        </group>
    );
}
