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

const getLayerVisuals = (spot, layer) => {
    switch (layer) {
        case 'ndvi': {
            const val = spot.ndvi ?? 0;
            let color = '#78716c';
            if (val >= 0.70) color = '#15803d';
            else if (val >= 0.50) color = '#22c55e';
            else if (val >= 0.30) color = '#84cc16';
            else if (val >= 0.10) color = '#ca8a04';
            return {
                color,
                strokeColor: color,
                primaryLabel: 'NDVI Index',
                primaryValue: val.toFixed(2),
                secondaryLabel: 'Canopy Cover',
                secondaryValue: `${spot.canopy_cover_pct != null ? spot.canopy_cover_pct.toFixed(0) : '0'}%`,
            };
        }
        case 'uhi': {
            const val = spot.uhi_surface_anomaly_celsius ?? 0;
            let color = '#10b981';
            if (val >= 4.0) color = '#f43f5e';
            else if (val >= 3.0) color = '#f97316';
            else if (val >= 2.0) color = '#f59e0b';
            else if (val >= 1.0) color = '#84cc16';
            return {
                color,
                strokeColor: color,
                primaryLabel: 'Surface UHI Anomaly',
                primaryValue: `+${val.toFixed(1)}°C`,
                secondaryLabel: 'Atmospheric UHI',
                secondaryValue: `+${(spot.uhi_air_anomaly_celsius ?? 0).toFixed(1)}°C`,
            };
        }
        case 'albedo': {
            const val = spot.surface_albedo ?? 0;
            let color = '#1c1917';
            if (val >= 0.55) color = '#f8fafc';
            else if (val >= 0.35) color = '#d6d3d1';
            else if (val >= 0.20) color = '#a8a29e';
            else if (val >= 0.10) color = '#57534e';
            return {
                color,
                strokeColor: color === '#1c1917' ? '#94a3b8' : color,
                primaryLabel: 'Surface Albedo',
                primaryValue: val.toFixed(2),
                secondaryLabel: 'Impervious Surface',
                secondaryValue: `${spot.impervious_surface_pct != null ? spot.impervious_surface_pct.toFixed(0) : '0'}%`,
            };
        }
        case 'heatstress': {
            const lst = spot.lst_celsius ?? 0;
            let color = '#10b981';
            let risk = 'Low';
            if (lst >= 50.0) { color = '#f43f5e'; risk = 'Extreme'; }
            else if (lst >= 45.0) { color = '#f97316'; risk = 'High'; }
            else if (lst >= 40.0) { color = '#f59e0b'; risk = 'Moderate'; }
            return {
                color,
                strokeColor: color,
                primaryLabel: 'Heat Stress Risk',
                primaryValue: risk,
                secondaryLabel: 'Skin LST',
                secondaryValue: `${lst.toFixed(1)}°C`,
            };
        }
        case 'lst':
        default: {
            const val = spot.lst_celsius ?? 0;
            let color = '#06b6d4';
            if (val >= 45.0) color = '#f43f5e';
            else if (val >= 40.0) color = '#f97316';
            else if (val >= 35.0) color = '#f59e0b';
            else if (val >= 30.0) color = '#10b981';
            return {
                color,
                strokeColor: color,
                primaryLabel: 'Satellite LST (Skin)',
                primaryValue: `${val.toFixed(1)}°C`,
                secondaryLabel: 'Ambient Air (2m)',
                secondaryValue: `${(spot.air_temp_2m_celsius ?? 0).toFixed(1)}°C`,
            };
        }
    }
};

export default function LeafletMap({ selectedRegion = null, onSelectNode = null, activeLayer = 'lst' }) {
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
                    const visual = getLayerVisuals(spot, activeLayer);
                    return (
                        <CircleMarker
                            key={`${spot.id}-${activeLayer}`}
                            center={[spot.latitude, spot.longitude]}
                            radius={14}
                            pathOptions={{
                                color: visual.strokeColor || visual.color,
                                fillColor: visual.color,
                                fillOpacity: 0.75,
                                weight: 2
                            }}
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

                                    {/* Active Layer Highlight Card */}
                                    <div style={{
                                        background: 'rgba(15, 23, 42, 0.06)',
                                        borderLeft: `4px solid ${visual.color}`,
                                        padding: '6px 8px',
                                        marginBottom: '8px',
                                        borderRadius: '0 4px 4px 0'
                                    }}>
                                        <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#64748b', fontWeight: 700, display: 'block' }}>
                                            LAYER: {activeLayer.toUpperCase()}
                                        </span>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2px' }}>
                                            <span style={{ fontWeight: 600 }}>{visual.primaryLabel}:</span>
                                            <strong style={{ color: visual.color, fontSize: '0.95rem' }}>{visual.primaryValue}</strong>
                                        </div>
                                        {visual.secondaryLabel && (
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2px' }}>
                                                <span style={{ fontSize: '0.78rem', color: '#64748b' }}>{visual.secondaryLabel}:</span>
                                                <span style={{ fontSize: '0.78rem', fontWeight: 600 }}>{visual.secondaryValue}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Full Observation Metrics */}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                                        <span style={{ color: '#64748b' }}>Satellite LST (Skin):</span>
                                        <strong style={{ color: '#e11d48' }}>{spot.lst_celsius?.toFixed(1)}°C</strong>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                                        <span style={{ color: '#64748b' }}>Ambient Air Temp (2m):</span>
                                        <strong style={{ color: '#0284c7' }}>{spot.air_temp_2m_celsius?.toFixed(1)}°C</strong>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                                        <span style={{ color: '#64748b' }}>Surface UHI Anomaly:</span>
                                        <strong style={{ color: '#f59e0b' }}>+{spot.uhi_surface_anomaly_celsius?.toFixed(1)}°C</strong>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                                        <span style={{ color: '#64748b' }}>NDVI / Canopy %:</span>
                                        <span>{spot.ndvi?.toFixed(2)} / {spot.canopy_cover_pct != null ? spot.canopy_cover_pct.toFixed(0) : '0'}%</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                                        <span style={{ color: '#64748b' }}>Surface Albedo:</span>
                                        <span>{spot.surface_albedo != null ? spot.surface_albedo.toFixed(2) : 'N/A'}</span>
                                    </div>
                                    <div style={{ fontSize: '0.72rem', color: '#94a3b8', borderTop: '1px solid #e2e8f0', paddingTop: '4px', marginTop: '4px' }}>
                                        Sensor: {spot.satellite_sensor || 'Landsat-8/9'} · QA: Clear
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
