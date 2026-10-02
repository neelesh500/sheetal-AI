import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Fix icon loading issue with Leaflet in React
import L from 'leaflet';
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
        map.setView([lat, lon], zoom);
    }, [lat, lon, zoom, map]);
    return null;
}

export default function LeafletMap() {
    const [hotspots, setHotspots] = useState([]);
    const [center, setCenter] = useState([20.5937, 78.9629]); // Center on India

    useEffect(() => {
        fetch('http://localhost:8000/api/v1/hotspots')
            .then(res => res.json())
            .then(data => {
                if (data.status === 'success' && data.data) {
                    setHotspots(data.data);
                    // Set center to first hotspot if available
                    if (data.data.length > 0) {
                        setCenter([data.data[0].lat, data.data[0].lng]);
                    }
                }
            })
            .catch(err => console.error("Error fetching map hotspots:", err));
    }, []);

    return (
        <div style={{ height: '400px', width: '100%', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
            <MapContainer center={center} zoom={4} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />
                <MapViewSync lat={center[0]} lon={center[1]} zoom={4} />

                {hotspots.map((spot, i) => (
                    <CircleMarker
                        key={i}
                        center={[spot.lat, spot.lng]}
                        radius={18}
                        pathOptions={{ color: '#f43f5e', fillColor: '#ef4444', fillOpacity: 0.6 }}
                    >
                        <Popup>
                            <strong style={{ color: '#111' }}>{spot.name}</strong><br />
                            <span style={{ color: '#ef4444' }}>Temp: {spot.temp}</span><br />
                            {spot.anomaly}
                        </Popup>
                    </CircleMarker>
                ))}
            </MapContainer>
        </div>
    );
}
