import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ThermometerSun, Map, BarChart3, Sliders, BookOpen } from 'lucide-react';
import './Navbar.css';

export default function Navbar() {
  const location = useLocation();

  const navLinks = [
    { path: '/', label: 'Home', icon: ThermometerSun },
    { path: '/heatmap', label: 'Hotspots', icon: Map },
    { path: '/analysis', label: 'Drivers', icon: BarChart3 },
    { path: '/simulator', label: 'Simulator', icon: Sliders },
    { path: '/methodology', label: 'Methods', icon: BookOpen },
  ];

  return (
    <nav className="navbar glass-panel">
      <div className="nav-brand">
        <ThermometerSun className="brand-icon" />
        <span className="brand-text text-gradient-hot">CoolCity</span>
        <span className="brand-text">Dynamics</span>
      </div>
      
      <ul className="nav-links">
        {navLinks.map((link) => {
          const isActive = location.pathname === link.path;
          const Icon = link.icon;
          
          return (
            <li key={link.path}>
              <Link to={link.path} className={`nav-link ${isActive ? 'active' : ''}`}>
                <Icon size={18} />
                <span>{link.label}</span>
                {isActive && (
                  <motion.div 
                    layoutId="nav-indicator" 
                    className="nav-indicator"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
