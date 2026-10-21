import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import {
    Globe, Satellite, Brain, Map, Thermometer, Wind, Database,
    Sliders, BookOpen, Settings
} from 'lucide-react';
import './Sidebar.css';
import api from '../services/api';

export const routeCategories = [
    {
        title: "CORE WORKFLOWS",
        routes: [
            { path: '/', label: '3D Earth & Hotspots', icon: Globe },
            { path: '/mapping', label: 'Thermal Heat Map', icon: Map },
            { path: '/datasets', label: 'Dataset Provenance', icon: Database },
            { path: '/prediction', label: 'Validated Prediction', icon: Brain },
            { path: '/simulator', label: 'Intervention Simulator', icon: Sliders }
        ]
    },
    {
        title: "SCIENTIFIC ANALYTICS",
        routes: [
            { path: '/analytics', label: 'Feature Drivers (MDI)', icon: Thermometer },
            { path: '/satellite', label: 'Satellite Thermal Catalog', icon: Satellite },
            { path: '/mitigation', label: 'Cooling Strategies', icon: Wind },
            { path: '/docs', label: 'Methodology & Data Card', icon: BookOpen }
        ]
    },
    {
        title: "MODEL ARCHITECTURE & ROADMAP",
        routes: [
            { path: '/ml-models', label: 'Active Random Forest Card', icon: Settings },
            { path: '/deep-learning', label: 'Planned Architectures', icon: Brain },
            { path: '/voice-command', label: 'Voice Accessibility', icon: Wind }
        ]
    }
];

export const routesConfig = routeCategories.flatMap(c => c.routes);

export default function Sidebar() {
    const [apiStatus, setApiStatus] = useState('checking');
    const [modelReady, setModelReady] = useState(false);
    const [recordCount, setRecordCount] = useState(0);

    useEffect(() => {
        const checkStatus = async () => {
            try {
                const data = await api.getStatus();
                if (data && typeof data.status === 'string') {
                    const nextStatus = data.status === 'online' ? 'online' : 'degraded';
                    setApiStatus(nextStatus);
                    setModelReady(data.ml_ready ?? false);
                    setRecordCount(data.records_count ?? 0);
                } else {
                    setApiStatus('degraded');
                }
            } catch {
                setApiStatus('offline');
            }
        };

        checkStatus();
        const interval = setInterval(checkStatus, 15000); // check every 15s
        return () => clearInterval(interval);
    }, []);

    const statusColor = apiStatus === 'online' ? 'var(--accent-emerald)' : apiStatus === 'degraded' ? '#f59e0b' : '#f43f5e';
    const statusText = apiStatus === 'online' ? 'ONLINE' : apiStatus === 'degraded' ? 'DEGRADED' : 'OFFLINE';

    return (
        <div className="sidebar-container">
            <div className="sidebar-header">
                <div className="logo-container">
                    <h2 className="sidebar-logo">SHEETAL.AI</h2>
                    <div className="pulse-dot"></div>
                </div>
                <div className="sidebar-badge">CLIMATE AI <span>// URBAN LAB</span></div>
            </div>

            <div className="sidebar-nav">
                {routeCategories.map((category, catIndex) => (
                    <div className="nav-category" key={catIndex}>
                        <div className="category-title">{category.title}</div>
                        <div className="category-routes">
                            {category.routes.map((route) => {
                                const Icon = route.icon;
                                return (
                                    <NavLink
                                        key={route.path}
                                        to={route.path}
                                        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                                    >
                                        <div className="nav-item-icon-wrapper">
                                            <Icon size={16} />
                                        </div>
                                        <span>{route.label}</span>
                                        <div className="nav-hover-fx"></div>
                                    </NavLink>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            <div className="sidebar-footer">
                <div className="system-status">
                    <span className="status-label">API_STATE:</span>
                    <span className="status-value" style={{ color: statusColor }}>{statusText}</span>
                </div>
                {apiStatus === 'online' && (
                    <div style={{ fontSize: '0.68rem', color: '#475569', marginTop: '3px' }}>
                        ML: {modelReady ? '✓ Loaded' : '✗ Missing'} · N={recordCount} nodes
                    </div>
                )}
                {apiStatus === 'offline' && (
                    <div style={{ fontSize: '0.68rem', color: '#f43f5e', marginTop: '3px' }}>
                        Run: python -m uvicorn main:app
                    </div>
                )}
                <div className="connection-bars">
                    <div className={`bar ${apiStatus !== 'offline' ? 'full' : ''}`}></div>
                    <div className={`bar ${apiStatus !== 'offline' ? 'full' : ''}`}></div>
                    <div className={`bar ${apiStatus === 'online' ? 'full' : ''}`}></div>
                    <div className={`bar ${apiStatus === 'online' && modelReady ? 'full' : ''}`}></div>
                </div>
            </div>
        </div>
    );
}
