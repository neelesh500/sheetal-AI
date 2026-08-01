import React from 'react';
import { NavLink } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
    Globe, Satellite, Brain, Map, Thermometer, Wind, AlertTriangle, Database,
    Sliders, FileText, Bell, MapPin, Users, Code, BookOpen, Settings, Activity, LifeBuoy
} from 'lucide-react';
import './Sidebar.css';

// Reordered and grouped routes for high-end structure
export const routeCategories = [
    {
        title: "COMMAND CORE",
        routes: [
            { path: '/', label: '3D Earth & Dashboard', icon: Globe },
            { path: '/satellite', label: 'Satellite EO Feeds', icon: Satellite },
            { path: '/mapping', label: 'Thermal Target Mapping', icon: Map },
            { path: '/prediction', label: 'AI Heat Prediction', icon: Brain }
        ]
    },
    {
        title: "ANALYTICS & METRICS",
        routes: [
            { path: '/analytics', label: 'Thermal Analytics', icon: Thermometer },
            { path: '/simulator', label: 'Scenario Simulator', icon: Sliders },
            { path: '/datasets', label: 'Bhuvan/Landsat Datasets', icon: Database },
            { path: '/gis', label: 'GIS Integrations', icon: MapPin }
        ]
    },
    {
        title: "OPERATIONS",
        routes: [
            { path: '/alerts', label: 'Real-Time Alerts', icon: Bell },
            { path: '/mitigation', label: 'Cooling Deployment', icon: Wind },
            { path: '/impact', label: 'Climate Matrix', icon: AlertTriangle },
            { path: '/reports', label: 'Automated Reports', icon: FileText }
        ]
    },
    {
        title: "SYSTEM ARCHITECTURE",
        routes: [
            { path: '/logs', label: 'Telemetry Logs', icon: Activity },
            { path: '/api', label: 'API / Webhooks', icon: Code },
            { path: '/settings', label: 'Platform Settings', icon: Settings }
        ]
    },
    {
        title: "MISSION & SUPPORT",
        routes: [
            { path: '/team', label: 'Team & Mission', icon: Users },
            { path: '/docs', label: 'Docs & Procedures', icon: BookOpen },
            { path: '/support', label: 'Help & Support', icon: LifeBuoy }
        ]
    }
];

export const routesConfig = routeCategories.flatMap(c => c.routes);

export default function Sidebar() {
    const handleNavClick = (label) => {
        // Sound simulator effect via toast notification
        toast(`Initializing link to [ ${label.toUpperCase()} ]...`, { icon: '📡', style: { background: '#020617', color: '#00f0ff', border: '1px solid #00f0ff' } });
    };

    return (
        <div className="sidebar-container">
            <div className="sidebar-header">
                <div className="logo-container">
                    <h2 className="sidebar-logo">SHEETAL.AI</h2>
                    <div className="pulse-dot"></div>
                </div>
                <div className="sidebar-badge">ISRO <span>// BHARTIYA ANTARIKSH</span></div>
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
                                        onClick={() => handleNavClick(route.label)}
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
                    <span className="status-label">SYS_STATE:</span>
                    <span className="status-value">NOMINAL</span>
                </div>
                <div className="connection-bars">
                    <div className="bar full"></div>
                    <div className="bar full"></div>
                    <div className="bar full"></div>
                    <div className="bar half"></div>
                </div>
            </div>
        </div>
    );
}
