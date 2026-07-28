import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Layout
import Navbar from './components/Navbar';

// Pages
import Home from './pages/Home';
import HeatMap from './pages/HeatMap';
import DriverAnalysis from './pages/DriverAnalysis';
import ScenarioSimulator from './pages/ScenarioSimulator';
import Methodology from './pages/Methodology';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/heatmap" element={<HeatMap />} />
        <Route path="/analysis" element={<DriverAnalysis />} />
        <Route path="/simulator" element={<ScenarioSimulator />} />
        <Route path="/methodology" element={<Methodology />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <Router>
      <Navbar />
      <AnimatedRoutes />
    </Router>
  );
}

export default App;
