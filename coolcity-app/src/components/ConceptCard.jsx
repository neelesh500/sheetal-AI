import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

export default function ConceptCard({ title, abbreviation, description, formula, sources, cityStats, delay = 0 }) {
  const [expanded, setExpanded] = useState(false);

  const statEntries = cityStats ? Object.entries(cityStats) : [];

  return (
    <motion.div
      className="concept-card glass-panel"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <div className="concept-card-header">
        <span className="concept-abbr">{abbreviation}</span>
        <h3>{title}</h3>
      </div>
      <p className="text-muted concept-desc">{description}</p>

      {formula && (
        <code className="concept-formula">{formula}</code>
      )}

      <button className="concept-expand-btn" onClick={() => setExpanded(!expanded)}>
        {expanded ? 'Hide details' : 'Show city data'}
        <ChevronDown size={16} style={{ transform: expanded ? 'rotate(180deg)' : 'none', transition: '0.2s' }} />
      </button>

      {expanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="concept-details"
        >
          {statEntries.length > 0 && (
            <div className="concept-stats-grid">
              {statEntries.map(([key, val]) => (
                <div key={key} className="concept-stat">
                  <span className="concept-stat-key">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                  <span className="concept-stat-val">{val}</span>
                </div>
              ))}
            </div>
          )}
          {sources && (
            <div className="concept-sources">
              <span className="text-muted">Data sources:</span>
              <div className="source-tags">
                {sources.map((s) => (
                  <span key={s} className="source-tag">{s}</span>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}
