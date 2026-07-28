import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Satellite, Zap, AlertTriangle, ShieldCheck, RefreshCw, Compass } from 'lucide-react';
import './SatelliteAnalysisMap.css';

const STAGES = {
  IDLE: 'idle',
  ORBITING: 'orbiting',
  BEAMING: 'beaming',
  ACTIVATING: 'activating',
  ZOOMED: 'zoomed'
};

const ZONES_DATA = [
  {
    key: 'delhi',
    name: 'Delhi NCR',
    x: 200,
    y: 115,
    lat: '28.6139° N',
    lon: '77.2090° E',
    lst: '49.4°C',
    anomaly: '+5.8°C vs baseline',
    risk: 'Extreme',
    confidence: '96.4%',
    suggestions: 'Enforce cool-roof mandates across residential corridors. Plan pocket woodlands in dense commercial pockets.'
  },
  {
    key: 'mumbai',
    name: 'Mumbai Industrial',
    x: 130,
    y: 290,
    lat: '19.0760° N',
    lon: '72.8777° E',
    lst: '43.2°C',
    anomaly: '+4.1°C vs baseline',
    risk: 'High',
    confidence: '91.8%',
    suggestions: 'Install permeable grass-pavements on cargo terminals to support evaporation. Connect shoreline green belts.'
  },
  {
    key: 'bengaluru',
    name: 'Bengaluru Tech Park',
    x: 180,
    y: 375,
    lat: '12.9716° N',
    lon: '77.5946° E',
    lst: '39.8°C',
    anomaly: '+2.6°C vs baseline',
    risk: 'Moderate',
    confidence: '89.2%',
    suggestions: 'Increase canopy shading by 15% around major tech parks. Save lake wetland buffers to prevent local dry domes.'
  },
  {
    key: 'chennai',
    name: 'Chennai Port Zone',
    x: 215,
    y: 370,
    lat: '13.0827° N',
    lon: '80.2707° E',
    lst: '45.1°C',
    anomaly: '+4.9°C vs baseline',
    risk: 'Severe',
    confidence: '94.1%',
    suggestions: 'Apply solar-reflective coatings to port storage roofs. Implement variable canopy grids on shipping yard walkways.'
  }
];

export default function SatelliteAnalysisMap() {
  const [searchQuery, setSearchQuery] = useState('');
  const [stage, setStage] = useState(STAGES.IDLE);
  const [currentTarget, setCurrentTarget] = useState(null);
  const [orbitProgress, setOrbitProgress] = useState(0);

  // Default coordinates of the India map dots
  const mapPoints = [
    { id: 1, x: 210, y: 40, label: 'Kashmir Grid' },
    { id: 2, x: 170, y: 90, label: 'Punjab Grid' },
    { id: 3, x: 300, y: 150, label: 'UP East' },
    { id: 4, x: 400, y: 170, label: 'Assam Hills' },
    { id: 5, x: 340, y: 220, label: 'Bengal Basin' },
    { id: 6, x: 280, y: 250, label: 'Deccan North' },
    { id: 7, x: 130, y: 200, label: 'Gujarat Plains' },
    { id: 8, x: 150, y: 310, label: 'Maharashtra Coast' },
    { id: 9, x: 220, y: 330, label: 'Andhra Plain' },
    { id: 10, x: 190, y: 430, label: 'Kanyakumari Tip' }
  ];

  // Connections to draw the cyber map grid look
  const mapLines = [
    [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8], [8, 10], [9, 10], [8, 9], [6, 9], [3, 6], [2, 7], [1, 3]
  ];

  const handleScanTrigger = (e) => {
    if (e) e.preventDefault();
    const query = searchQuery.toLowerCase().trim();
    
    // Find closest match or default to Delhi
    let found = ZONES_DATA.find(z => query.includes(z.key) || z.name.toLowerCase().includes(query));
    if (!found) {
      found = ZONES_DATA[0]; // Fallback to Delhi
    }
    
    setSearchQuery(found.name);
    setCurrentTarget(found);
    setStage(STAGES.ORBITING);
  };

  // State machine sequence controller
  useEffect(() => {
    if (stage === STAGES.ORBITING) {
      const timer = setTimeout(() => {
        setStage(STAGES.BEAMING);
      }, 1800);
      return () => clearTimeout(timer);
    } 
    
    if (stage === STAGES.BEAMING) {
      const timer = setTimeout(() => {
        setStage(STAGES.ACTIVATING);
      }, 1500);
      return () => clearTimeout(timer);
    }

    if (stage === STAGES.ACTIVATING) {
      const timer = setTimeout(() => {
        setStage(STAGES.ZOOMED);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [stage]);

  const handleReset = () => {
    setStage(STAGES.IDLE);
    setCurrentTarget(null);
    setSearchQuery('');
  };

  // Determine viewport translation properties in zoomed state
  const getZoomStyle = () => {
    if (stage === STAGES.ZOOMED && currentTarget) {
      // Zoom factor 2.2, centered on the coordinates shift
      const dx = (250 - currentTarget.x) * 2.2;
      const dy = (200 - currentTarget.y) * 2.2;
      return {
        transform: `scale(2.2) translate(${dx / 2.2}px, ${dy / 2.2}px)`,
        transformOrigin: `${currentTarget.x}px ${currentTarget.y}px`
      };
    }
    return {
      transform: 'scale(1) translate(0px, 0px)',
      transformOrigin: '250px 200px'
    };
  };

  return (
    <div className="satellite-map-container">
      {/* Background Cyber Grid */}
      <div className="satellite-map-grid" />

      {/* Cyber Coordinates overlay */}
      <div className="map-coords-display">
        {stage === STAGES.ZOOMED && currentTarget ? (
          <>
            <div>LAT: {currentTarget.lat}</div>
            <div>LON: {currentTarget.lon}</div>
            <div>STATUS: PINNED ZONE</div>
          </>
        ) : (
          <>
            <div>SYS: SHEETAL-AI SATELLITE</div>
            <div>ORBIT: 472KM SUN-SYNC</div>
            <div>MODE: SCANDETECT</div>
          </>
        )}
      </div>

      {/* Status indicator badge */}
      <div className={`map-status-pill ${stage === STAGES.IDLE ? 'status-idle' : 'status-active'}`}>
        {stage === STAGES.IDLE && (
          <>
            <span className="pulse" style={{ backgroundColor: 'var(--accent-emerald)', width: 8, height: 8, borderRadius: '50%', display: 'inline-block' }}></span>
            SYSTEM READY
          </>
        )}
        {stage === STAGES.ORBITING && (
          <>
            <RefreshCw size={12} className="animate-spin" />
            SATELLITE ORBITING...
          </>
        )}
        {stage === STAGES.BEAMING && (
          <>
            <Zap size={12} className="text-rose-500" />
            TARGET LOCK: BEAM STRIKE
          </>
        )}
        {stage === STAGES.ACTIVATING && (
          <>
            <AlertTriangle size={12} className="text-orange-500 animate-bounce" />
            THERMAL ACTIVATION
          </>
        )}
        {stage === STAGES.ZOOMED && (
          <>
            <ShieldCheck size={12} className="text-rose-500" />
            LIVE ANALYSIS IN PROGRESS
          </>
        )}
      </div>

      {/* Target Analysis Floating Card (Glassmorphism) */}
      <AnimatePresence>
        {stage === STAGES.ZOOMED && currentTarget && (
          <motion.div
            initial={{ opacity: 0, x: -30, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -30, scale: 0.95 }}
            transition={{ type: 'spring', damping: 20 }}
            className="glass-panel target-analysis-overlay"
          >
            <div className="target-analysis-header">
              <Compass size={16} className="text-rose-500 animate-pulse" />
              <strong style={{ fontSize: '0.9rem' }}>{currentTarget.name}</strong>
            </div>
            <div className="target-analysis-body">
              <div className="stat-item-row">
                <span className="stat-item-label">Land Surface Temp</span>
                <span className="stat-item-value text-gradient-hot">{currentTarget.lst}</span>
              </div>
              <div className="stat-item-row">
                <span className="stat-item-label">Thermal Anomaly</span>
                <span className="stat-item-value" style={{ color: 'var(--accent-rose)' }}>{currentTarget.anomaly}</span>
              </div>
              <div className="stat-item-row">
                <span className="stat-item-label">Heat Stress Risk</span>
                <span className="stat-item-value" style={{ color: 'var(--accent-rose)', fontWeight: 'bold' }}>{currentTarget.risk}</span>
              </div>
              <div className="stat-item-row">
                <span className="stat-item-label">AI Confidence</span>
                <span className="stat-item-value text-accent-cyan">{currentTarget.confidence}</span>
              </div>
              <div style={{ marginTop: '10px', fontSize: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '10px' }}>
                <div style={{ color: 'var(--accent-cyan)', fontWeight: '600', marginBottom: '4px' }}>AI MITIGATION PLAN:</div>
                <div className="text-muted" style={{ lineHeight: '1.4' }}>{currentTarget.suggestions}</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Map Viewport Area */}
      <div className="map-viewport-wrapper">
        <svg
          viewBox="0 0 500 500"
          className="futuristic-india-map"
          style={getZoomStyle()}
        >
          <defs>
            <radialGradient id="hotspot-grad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#f43f5e" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="laser-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#f43f5e" stopOpacity="0" />
              <stop offset="20%" stopColor="#f43f5e" stopOpacity="0.4" />
              <stop offset="80%" stopColor="#f43f5e" stopOpacity="1" />
              <stop offset="100%" stopColor="#fff" stopOpacity="1" />
            </linearGradient>
          </defs>

          {/* India abstract mesh background lines */}
          {mapLines.map(([p1, p2], idx) => {
            const pt1 = mapPoints.find(p => p.id === p1);
            const pt2 = mapPoints.find(p => p.id === p2);
            return (
              <line
                key={`line-${idx}`}
                x1={pt1.x}
                y1={pt1.y}
                x2={pt2.x}
                y2={pt2.y}
                className="map-mesh-line"
              />
            );
          })}

          {/* Main India outer boundary silhouette (glowing vector mockup) */}
          <path
            d="M 210,40 L 250,70 L 260,95 L 300,105 L 300,150 L 330,175 L 340,220 L 320,240 L 290,250 L 270,300 L 230,350 L 220,380 L 195,445 L 180,410 L 160,370 L 140,320 L 130,290 L 115,245 L 80,195 L 110,175 L 150,150 L 170,90 Z"
            fill="none"
            className="map-boundary"
          />

          {/* Mesh Nodes (Cities & Stations points) */}
          {mapPoints.map(pt => (
            <g key={`point-${pt.id}`}>
              <circle cx={pt.x} cy={pt.y} r="3" className="map-node" />
              <motion.circle
                cx={pt.x}
                cy={pt.y}
                r="6"
                className="map-node-pulse"
                animate={{ scale: [1, 2.2, 1], opacity: [0.6, 0, 0.6] }}
                transition={{ duration: 3, repeat: Infinity, delay: pt.id * 0.2 }}
              />
            </g>
          ))}

          {/* Active target zones markers */}
          {ZONES_DATA.map(zone => (
            <g key={`zone-marker-${zone.key}`} style={{ cursor: 'pointer' }} onClick={() => {
              setSearchQuery(zone.name);
              setCurrentTarget(zone);
              setStage(STAGES.ORBITING);
            }}>
              {/* If zoomed/active show strong thermal orange/red overlay */}
              {stage === STAGES.ZOOMED && currentTarget?.key === zone.key ? (
                <>
                  <motion.circle
                    cx={zone.x}
                    cy={zone.y}
                    r="32"
                    fill="url(#hotspot-grad)"
                    initial={{ scale: 0.1, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 80 }}
                  />
                  <motion.circle
                    cx={zone.x}
                    cy={zone.y}
                    r="8"
                    fill="#f43f5e"
                    filter="drop-shadow(0 0 6px #f43f5e)"
                  />
                  <motion.circle
                    cx={zone.x}
                    cy={zone.y}
                    r="18"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="1.5"
                    animate={{ scale: [1, 1.8, 1], opacity: [0.7, 0.1, 0.7] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </>
              ) : (
                <>
                  <circle cx={zone.x} cy={zone.y} r="4.5" fill="#e11d48" opacity="0.8" />
                  <circle cx={zone.x} cy={zone.y} r="8" fill="none" stroke="#f43f5e" strokeWidth="0.8" opacity="0.5" />
                </>
              )}
            </g>
          ))}

          {/* Animation Step A: Orbiting Satellite rendering */}
          {(stage === STAGES.ORBITING || stage === STAGES.BEAMING || stage === STAGES.ACTIVATING || stage === STAGES.ZOOMED) && (
            <motion.g
              initial={{ x: 420, y: -20 }}
              animate={stage === STAGES.ORBITING 
                ? { x: 250, y: 40 }
                : { x: 250, y: 40 } // Lock overhead
              }
              transition={{ duration: 1.6, ease: "easeOut" }}
            >
              {/* Satellite representation structure */}
              <circle cx="0" cy="0" r="8" fill="#e2e8f0" filter="drop-shadow(0 0 5px #38bdf8)" />
              {/* Wings (Solar Panels) */}
              <rect x="-24" y="-3" width="16" height="6" fill="#0284c7" rx="1" />
              <rect x="8" y="-3" width="16" height="6" fill="#0284c7" rx="1" />
              {/* Scanning lens */}
              <circle cx="0" cy="5" r="2.5" fill="#f43f5e" />
              <line x1="-8" y1="0" x2="8" y2="0" stroke="#94a3b8" strokeWidth="1" />

              {/* Animation Step B: Beam Strike */}
              {stage === STAGES.BEAMING && currentTarget && (
                <motion.line
                  x1="0"
                  y1="5"
                  x2={currentTarget.x - 250} // relative coordinates calculated from group translation
                  y2={currentTarget.y - 40}
                  className="satellite-laser-beam"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: [0.8, 1, 0.9, 1] }}
                  transition={{ duration: 1.2, ease: "easeInOut" }}
                />
              )}
            </motion.g>
          )}
        </svg>
      </div>

      {/* Search Input bar trigger overlay */}
      <form onSubmit={handleScanTrigger} className="map-search-overlay">
        <div style={{ display: 'flex', alignItems: 'center', flex: 1, position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', color: 'var(--text-muted)' }} />
          <input
            type="text"
            className="map-search-input"
            style={{ paddingLeft: '40px' }}
            placeholder="Search heat zone (e.g., Delhi, Mumbai, Bengaluru, Chennai)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button type="submit" className="map-trigger-btn">
            <Satellite size={16} /> SHEETAL SCAN
          </button>
          {(stage !== STAGES.IDLE) && (
            <button type="button" onClick={handleReset} className="map-reset-btn">
              Reset
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
