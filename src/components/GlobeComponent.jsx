import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Stars, useTexture } from '@react-three/drei';
import * as THREE from 'three';

export default function GlobeComponent({ onHotspotClick }) {
    const earthRef = useRef();
    const cloudsRef = useRef();

    // Load local texture specifically to fix 'blue ball' UI issue
    const [colorMap] = useTexture([`${import.meta.env.BASE_URL}earth-blue-marble.jpg`]);

    // Calculate 3D position from Lat/Lng
    const getPositionFromLatLng = (lat, lng, radius) => {
        const phi = (90 - lat) * (Math.PI / 180);
        const theta = (lng + 180) * (Math.PI / 180);

        // We want India to be roughly facing the camera initially. The Three.js sphere coords:
        // This maps standard lat/lng to a sphere but we might have to adjust rotation to match the texture map.
        // ThreeJS SphereGeometry default UV mapping usually requires this mapping or similar.
        const x = -(radius * Math.sin(phi) * Math.cos(theta));
        const z = (radius * Math.sin(phi) * Math.sin(theta));
        const y = (radius * Math.cos(phi));
        return new THREE.Vector3(x, y, z);
    };

    const hotspots = [
        { id: 'dl', name: 'New Delhi (India)', lat: 28.6139, lng: 77.2090, temp: '48.5°C', anomaly: 'Critical (+7.2°C)', desc: 'High concrete density trapping solar radiation in South Asia.' },
        { id: 'phx', name: 'Phoenix, Arizona (USA)', lat: 33.4484, lng: -112.0740, temp: '49.2°C', anomaly: 'Critical (+8.0°C)', desc: 'Desert urban heat island amplified by extensive asphalt sprawl.' },
        { id: 'cai', name: 'Cairo (Egypt)', lat: 30.0444, lng: 31.2357, temp: '47.0°C', anomaly: 'Critical (+6.5°C)', desc: 'Arid climate combined with high urban density and low vegetation.' },
        { id: 'ath', name: 'Athens (Greece)', lat: 37.9838, lng: 23.7275, temp: '45.5°C', anomaly: 'Warning (+5.2°C)', desc: 'Mediterranean basin heat trap affecting southern Europe.' },
        { id: 'tok', name: 'Tokyo (Japan)', lat: 35.6762, lng: 139.6503, temp: '41.8°C', anomaly: 'Warning (+4.0°C)', desc: 'Metropolitan anthropogenic heat emissions from dense HVAC and transport.' },
        { id: 'sao', name: 'São Paulo (Brazil)', lat: -23.5505, lng: -46.6333, temp: '39.4°C', anomaly: 'Moderate (+3.1°C)', desc: 'Rapid urbanization reducing green canopy across the plateau.' },
        { id: 'lag', name: 'Lagos (Nigeria)', lat: 6.5244, lng: 3.3792, temp: '42.1°C', anomaly: 'Warning (+4.6°C)', desc: 'Coastal equatorial heat stress and rapid infrastructural expansion.' }
    ];

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

            // Generate standard microclimate text as requested
            const isWarningZone = lat > -20 && lat < 40;

            onHotspotClick({
                id: `dynamic-${Math.random().toString(36).substr(2, 9)}`,
                name: `Global Grid Sector (${lat.toFixed(2)}°, ${lng.toFixed(2)}°)`,
                lat: lat,
                lng: lng,
                temp: (34 + Math.abs(lat * 0.28)).toFixed(1) + '°C',
                anomaly: isWarningZone ? 'Warning (+4.1°C)' : 'Nominal (+1.0°C)',
                desc: 'Multispectral thermal infrared sensors detect standard urban thermal radiance.'
            });
        }
    };

    return (
        <group>
            <ambientLight intensity={0.2} />
            <directionalLight position={[5, 3, 5]} intensity={1.5} />
            <pointLight position={[-5, -3, -5]} color="#00f0ff" intensity={0.5} distance={20} />

            {/* Space Background Elements */}
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

            {/* The Earth */}
            <group ref={earthRef} rotation={[0, -Math.PI / 2, 0]}>

                {/* Solid Globe with Texture - Clickable Anywhere */}
                <Sphere args={[2.5, 64, 64]} onClick={handleGlobeClick} onPointerOver={(e) => { document.body.style.cursor = 'crosshair'; }} onPointerOut={(e) => { document.body.style.cursor = 'auto'; }}>
                    <meshStandardMaterial
                        map={colorMap}
                        roughness={0.6}
                        metalness={0.1}
                    />
                </Sphere>

                {/* Wireframe Overlay / Gridlines */}
                <Sphere args={[2.51, 32, 32]}>
                    <meshBasicMaterial
                        color="#00f0ff"
                        wireframe={true}
                        transparent
                        opacity={0.05}
                    />
                </Sphere>

                {/* Fixed Hotspots */}
                {hotspots.map((spot) => {
                    const pos = getPositionFromLatLng(spot.lat, spot.lng, 2.52);
                    return (
                        <mesh
                            key={spot.id}
                            position={pos}
                            onClick={(e) => {
                                e.stopPropagation();
                                if (onHotspotClick) onHotspotClick(spot);
                            }}
                            onPointerOver={(e) => { document.body.style.cursor = 'pointer'; e.stopPropagation(); }}
                            onPointerOut={(e) => { document.body.style.cursor = 'auto'; }}
                        >
                            <sphereGeometry args={[0.06, 16, 16]} />
                            <meshBasicMaterial color="#ff2200" />
                            {/* Halos */}
                            <mesh>
                                <sphereGeometry args={[0.1, 16, 16]} />
                                <meshBasicMaterial color="#ff5500" transparent opacity={0.5} blending={THREE.AdditiveBlending} />
                            </mesh>
                            <pointLight distance={2} intensity={2} color="#ff0000" />
                        </mesh>
                    );
                })}

                {/* Data Stream Lines (Curves around planet) */}
                {Array.from({ length: 6 }).map((_, i) => {
                    const radius = 2.7 + Math.random() * 0.3;
                    return (
                        <mesh key={`ring-${i}`} rotation={[Math.random() * Math.PI, Math.random() * Math.PI, 0]}>
                            <torusGeometry args={[radius, 0.002, 16, 100]} />
                            <meshBasicMaterial color="#00f0ff" transparent opacity={0.3} />
                        </mesh>
                    );
                })}
            </group>

            {/* Atmospheric Glow */}
            <Sphere args={[2.65, 64, 64]} ref={cloudsRef}>
                <meshBasicMaterial
                    color="#00aaff"
                    transparent
                    opacity={0.1}
                    side={THREE.BackSide}
                    blending={THREE.AdditiveBlending}
                />
            </Sphere>
        </group>
    );
}
