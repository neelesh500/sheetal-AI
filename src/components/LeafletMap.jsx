import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { RefreshCw, AlertTriangle, Layers } from 'lucide-react';
import api from '../services/api';

// Fix icon loading issue with Leaflet in React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

function MapViewSync({ lat, lon, zoom }) {
    const map = useMap();
    useEffect(() => {
        if (lat && lon) {
            map.setView([lat, lon], zoom);
        }
    }, [lat, lon, zoom, map]);
    return null;
}

export default function LeafletMap({ selectedRegion = null, onSelectNode = null }) {
    const [hotspots, setHotspots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [center, setCenter] = useState([22.5937, 78.9629]); // Geographic centroid of India

    const fetchHotspots = async () => {
        setLoading(true);
        setError(null);
        try {
            const resp = await api.getHotspots(selectedRegion);
            if (resp.status === 'success' && resp.data) {
                setHotspots(resp.data);
                if (resp.data.length > 0) {
                    setCenter([resp.data[0].latitude, resp.data[0].longitude]);
                }
            }
        } catch (err) {
            setError(err.message || 'Unable to load geospatial observation nodes');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHotspots();
    }, [selectedRegion]);

    const getMarkerColor = (lst) => {
        if (lst >= 50.0) return '#e11d48'; // Extreme skin heat (>50°C)
        if (lst >= 45.0) return '#f97316'; // High heat (45-50°C)
        if (lst >= 40.0) return '#f59e0b'; // Moderate (40-45°C)
        return '#10b981'; // Cool baseline (<40°C)
    };

    return (
        <div style={{ height: '480px', width: '100%', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', position: 'relative' }}>
            {error && (
                <div style={{
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    zIndex: 1000,
                    background: 'rgba(244, 63, 94, 0.9)',
                    color: '#fff',
                    padding: '0.5rem 0.75rem',
                    borderRadius: '6px',
                    fontSize: '0.8rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
                }}>
                    <AlertTriangle size={14} />
                    <span>Backend Offline</span>
                    <button
                        onClick={fetchHotspots}
                        style={{ background: '#fff', color: '#e11d48', border: 'none', borderRadius: '4px', padding: '0.2rem 0.5rem', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 'bold' }}
                    >
                        Retry
                    </button>
                </div>
            )}

            <MapContainer center={center} zoom={5} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />
                <MapViewSync lat={center[0]} lon={center[1]} zoom={5} />

                {hotspots.map((spot) => {
                    const color = getMarkerColor(spot.lst_celsius);
                    return (
                        <CircleMarker
                            key={spot.id}
                            center={[spot.latitude, spot.longitude]}
                            radius={14}
                            pathOptions={{ color: color, fillColor: color, fillOpacity: 0.65, weight: 2 }}
                            eventHandlers={{
                                click: () => {
                                    if (onSelectNode) onSelectNode(spot);
                                }
                            }}
                        >
                            <Popup>
                                <div style={{ color: '#0f172a', minWidth: '220px', fontSize: '0.85rem' }}>
                                    <strong style={{ fontSize: '0.95rem', display: 'block', borderBottom: '1px solid #cbd5e1', paddingBottom: '4px', marginBottom: '6px' }}>
                                        {spot.sub_zone} ({spot.region})
                                    </strong>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                                        <span style={{ color: '#64748b' }}>Satellite LST (Skin):</span>
                                        <strong style={{ color: '#e11d48' }}>{spot.lst_celsius.toFixed(1)}°C</strong>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                                        <span style={{ color: '#64748b' }}>Ambient Air Temp (2m):</span>
                                        <strong style={{ color: '#0284c7' }}>{spot.air_temp_2m_celsius.toFixed(1)}°C</strong>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                                        <span style={{ color: '#64748b' }}>Surface UHI Anomaly:</span>
                                        <strong style={{ color: '#f59e0b' }}>+{spot.uhi_surface_anomaly_celsius.toFixed(1)}°C</strong>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                                        <span style={{ color: '#64748b' }}>NDVI / Canopy %:</span>
                                        <span>{spot.ndvi.toFixed(2)} / {spot.canopy_cover_pct.toFixed(0)}%</span>
                                    </div>
                                    <div style={{ fontSize: '0.72rem', color: '#94a3b8', borderTop: '1px solid #e2e8f0', paddingTop: '4px', marginTop: '4px' }}>
                                        Sensor: {spot.satellite_sensor} · QA: Clear
                                    </div>
                                </div>
                            </Popup>
                        </CircleMarker>
                    );
                })}
            </MapContainer>
        </div>
    );
}
