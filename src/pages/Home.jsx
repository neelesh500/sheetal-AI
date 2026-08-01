import { motion } from 'framer-motion';
import { ArrowRight, Thermometer, ShieldCheck, Zap, Satellite, Leaf, Sun, Brain, AlertTriangle } from 'lucide-react';
import AnimatedPage from '../components/AnimatedPage';
import AnimatedButton from '../components/AnimatedButton';
import MetricCard from '../components/MetricCard';
import ConceptCard from '../components/ConceptCard';
import { homeMetrics, conceptCards, cityOverview } from '../data/climateData';
import './Home.css';

const conceptIcons = {
  LST: Thermometer,
  NDVI: Leaf,
  UHI: AlertTriangle,
  Albedo: Sun,
  PINN: Brain,
  'Heat Stress': ShieldCheck,
};

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <AnimatedPage>
      <div className="container hero-section">
        <motion.div 
          className="hero-content"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={itemVariants} className="badge">
            <span className="pulse"></span> AIML Powered Heat Mitigation
          </motion.div>
          
          <motion.h1 variants={itemVariants} className="hero-title">
            Cooling Cities with <br />
            <span className="text-gradient-cool">Physics-Informed AI</span>
          </motion.h1>
          
          <motion.p variants={itemVariants} className="hero-subtitle">
            Fuse LST, NDVI, UHI, and albedo satellite layers with Physics-Informed ML to map heat stress, explain drivers, and optimize cooling interventions for {cityOverview.name}.
          </motion.p>
          
          <motion.div variants={itemVariants} className="hero-actions">
            <AnimatedButton to="/heatmap" variant="primary">
              Launch Heat Map <ArrowRight size={18} />
            </AnimatedButton>
            <AnimatedButton to="/methodology" variant="secondary">
              Read Methodology
            </AnimatedButton>
          </motion.div>
        </motion.div>

        <motion.div 
          className="hero-visual"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="abstract-globe glass-panel">
            <div className="globe-glow"></div>
            <div className="globe-overlay"></div>
            <div className="floating-card c1 glass-panel">
              <Thermometer size={20} className="text-rose-500" /> LST 47.6°C Peak
            </div>
            <div className="floating-card c2 glass-panel">
              <Leaf size={20} className="text-emerald-500" /> NDVI 0.28 City Avg
            </div>
            <div className="floating-card c3 glass-panel">
              <Zap size={20} className="text-amber-500" /> PINN R² 0.91
            </div>
            <div className="floating-card c4 glass-panel">
              <AlertTriangle size={20} className="text-rose-500" /> UHI +4.2°C
            </div>
          </div>
        </motion.div>
      </div>

      {/* City Metrics Strip */}
      <div className="container metrics-section">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="section-header">
            <Satellite size={20} className="text-accent-cyan" />
            <div>
              <h2>Live City Climate Snapshot</h2>
              <p className="text-muted">{cityOverview.name} · {cityOverview.studyPeriod} · {cityOverview.dataSources.join(', ')}</p>
            </div>
          </div>
          <div className="metrics-grid">
            {homeMetrics.map((m, i) => (
              <MetricCard key={m.label} {...m} delay={0.1 * i} />
            ))}
          </div>
        </motion.div>
      </div>

      {/* Core Data Layers */}
      <div className="container concepts-section">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="section-header">
            <Brain size={20} className="text-accent-cyan" />
            <div>
              <h2>Core Data Layers & Methods</h2>
              <p className="text-muted">Satellite-derived indicators fused into heat stress maps and Physics-Informed ML models.</p>
            </div>
          </div>
          <div className="concepts-grid">
            {conceptCards.map((card, i) => {
              const Icon = conceptIcons[card.abbreviation];
              return (
                <div key={card.id} className="concept-card-wrapper">
                  {Icon && <Icon size={18} className="concept-card-icon" />}
                  <ConceptCard {...card} delay={0.05 * i} />
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </AnimatedPage>
  );
}
