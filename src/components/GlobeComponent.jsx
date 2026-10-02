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

    const [hotspots, setHotspots] = React.useState([]);

    React.useEffect(() => {
        fetch('http://localhost:8000/api/v1/hotspots')
            .then(res => res.json())
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
