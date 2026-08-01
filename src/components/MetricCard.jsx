import { motion } from 'framer-motion';

export default function MetricCard({ label, value, delta, color, delay = 0 }) {
  return (
    <motion.div
      className="metric-card glass-panel"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ scale: 1.02, borderColor: 'rgba(255,255,255,0.2)' }}
    >
      <span className="metric-label">{label}</span>
      <span className="metric-value" style={{ color: color || 'var(--text-main)' }}>{value}</span>
      {delta && <span className="metric-delta text-muted">{delta}</span>}
    </motion.div>
  );
}
