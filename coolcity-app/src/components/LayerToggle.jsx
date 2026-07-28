import { motion } from 'framer-motion';

export default function LayerToggle({ layers, activeLayer, onChange }) {
  return (
    <div className="layer-toggle">
      {layers.map((layer) => (
        <button
          key={layer.id}
          className={`layer-btn ${activeLayer === layer.id ? 'active' : ''}`}
          onClick={() => onChange(layer.id)}
        >
          {layer.label}
          {activeLayer === layer.id && (
            <motion.div
              layoutId="layer-indicator"
              className="layer-indicator"
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />
          )}
        </button>
      ))}
    </div>
  );
}
