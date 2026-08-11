import React, { Suspense, lazy } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Layout (MainLayout ko directly import karenge kyunki ye pehla load hota hai)
import MainLayout from './components/MainLayout';
import { routesConfig } from './components/Sidebar';

// Pages Lazy Loading (Code Splitting - Ab ye alag file chunks me server se fetch honge)
const SpaceDashboard = lazy(() => import('./pages/SpaceDashboard'));
const GenericModule = lazy(() => import('./pages/GenericModule'));
const HeatMap = lazy(() => import('./pages/HeatMap'));
const DriverAnalysis = lazy(() => import('./pages/DriverAnalysis'));
const ScenarioSimulator = lazy(() => import('./pages/ScenarioSimulator'));
const Methodology = lazy(() => import('./pages/Methodology'));
const Home = lazy(() => import('./pages/Home'));
const SatelliteFeeds = lazy(() => import('./pages/SatelliteFeeds'));
const AiPrediction = lazy(() => import('./pages/AiPrediction'));
const MitigationPlan = lazy(() => import('./pages/MitigationPlan'));

// Simple loading fallback custom loading UI ke liye
const PageLoader = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', minHeight: '50vh', color: '#00c2ff' }}>
    <div className="loader-element">Loading Module...</div>
  </div>
);

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
        <Route path="/" element={<Suspense fallback={<PageLoader />}><SpaceDashboard /></Suspense>} />

        {/* Legacy mappings from older app connections */}
        <Route path="/heatmap" element={<Suspense fallback={<PageLoader />}><HeatMap /></Suspense>} />
        <Route path="/analysis" element={<Suspense fallback={<PageLoader />}><DriverAnalysis /></Suspense>} />
        <Route path="/methodology" element={<Suspense fallback={<PageLoader />}><Methodology /></Suspense>} />
        <Route path="/home" element={<Suspense fallback={<PageLoader />}><Home /></Suspense>} />
        <Route path="/scenario" element={<Suspense fallback={<PageLoader />}><ScenarioSimulator /></Suspense>} />

        {routesConfig.filter(r => r.path !== '/').map(route => {
          const ComponentToRender = componentsMap[route.path] || GenericModule;
          return (
            <Route
              key={route.path}
              path={route.path}
              element={
                <Suspense fallback={<PageLoader />}>
                  <ComponentToRender title={route.label} icon={route.icon} />
                </Suspense>
              }
            />
          );
        })}
        {/* Fallback 404 */}
        <Route path="*" element={
          <Suspense fallback={<PageLoader />}>
            <GenericModule title="404 - Not Found" description="The requested module does not exist in the platform registry." />
          </Suspense>
        } />
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
