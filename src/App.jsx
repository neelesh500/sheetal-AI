import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Layout
import MainLayout from './components/MainLayout';

// Pages
import SpaceDashboard from './pages/SpaceDashboard';
import GenericModule from './pages/GenericModule';
import { routesConfig } from './components/Sidebar';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<SpaceDashboard />} />
        {routesConfig.filter(r => r.path !== '/').map(route => (
          <Route
            key={route.path}
            path={route.path}
            element={<GenericModule title={route.label} icon={route.icon} />}
          />
        ))}
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
