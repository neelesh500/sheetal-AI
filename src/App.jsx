import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Layout
import MainLayout from './components/MainLayout';

// Pages
import SpaceDashboard from './pages/SpaceDashboard';
import GenericModule from './pages/GenericModule';
import HeatMap from './pages/HeatMap';
import DriverAnalysis from './pages/DriverAnalysis';
import ScenarioSimulator from './pages/ScenarioSimulator';
import Methodology from './pages/Methodology';
import Home from './pages/Home';
import SatelliteFeeds from './pages/SatelliteFeeds';
import AiPrediction from './pages/AiPrediction';
import MitigationPlan from './pages/MitigationPlan';
import { routesConfig } from './components/Sidebar';

const componentsMap = {
  '/mapping': HeatMap,
  '/analytics': DriverAnalysis,
  '/simulator': ScenarioSimulator,
  '/docs': Methodology,
  '/satellite': SatelliteFeeds,
  '/prediction': AiPrediction,
  '/mitigation': MitigationPlan
};

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<SpaceDashboard />} />

        {/* Legacy mappings from older app connections */}
        <Route path="/heatmap" element={<HeatMap />} />
        <Route path="/analysis" element={<DriverAnalysis />} />
        <Route path="/methodology" element={<Methodology />} />
        <Route path="/home" element={<Home />} />
        <Route path="/scenario" element={<ScenarioSimulator />} />

        {routesConfig.filter(r => r.path !== '/').map(route => {
          const ComponentToRender = componentsMap[route.path] || GenericModule;
          return (
            <Route
              key={route.path}
              path={route.path}
              element={<ComponentToRender title={route.label} icon={route.icon} />}
            />
          );
        })}
        {/* Fallback 404 */}
        <Route path="*" element={<GenericModule title="404 - Not Found" description="The requested module does not exist in the platform registry." />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <Router>
      <MainLayout>
        <AnimatedRoutes />
      </MainLayout>
    </Router>
  );
}

export default App;
