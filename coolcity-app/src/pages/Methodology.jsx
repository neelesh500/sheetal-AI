import { motion } from 'framer-motion';
import { BookOpen, Thermometer, Leaf, AlertTriangle, Sun, Brain, ShieldCheck } from 'lucide-react';
import AnimatedPage from '../components/AnimatedPage';
import AnimatedButton from '../components/AnimatedButton';
import MapLegend from '../components/MapLegend';
import {
  lstData,
  ndviData,
  uhiData,
  albedoData,
  pinnData,
  heatStressData,
  cityOverview,
} from '../data/climateData';

const sections = [
  { id: 'lst', icon: Thermometer, data: lstData, zones: lstData.zones, zoneKey: 'lst', zoneLabel: 'LST (°C)' },
  { id: 'ndvi', icon: Leaf, data: ndviData, zones: ndviData.zones, zoneKey: 'ndvi', zoneLabel: 'NDVI' },
  { id: 'uhi', icon: AlertTriangle, data: uhiData, zones: uhiData.intensityZones, zoneKey: 'intensity', zoneLabel: 'UHI (°C)' },
  { id: 'albedo', icon: Sun, data: albedoData, zones: albedoData.surfaceTypes, zoneKey: 'albedo', zoneLabel: 'Albedo (α)' },
  { id: 'pinn', icon: Brain, data: pinnData, zones: null },
  { id: 'heatstress', icon: ShieldCheck, data: heatStressData, zones: heatStressData.riskZones, zoneKey: 'wbgt', zoneLabel: 'WBGT (°C)' },
];

export default function Methodology() {
  return (
    <AnimatedPage>
      <div className="container methodology-page">
        <motion.div
          className="header-section"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: '2rem' }}
        >
          <div className="section-header">
            <BookOpen size={24} className="text-accent-cyan" />
            <div>
              <h2>Methodology & Data Dictionary</h2>
              <p className="text-muted">
                Technical reference for satellite layers, heat stress indices, and Physics-Informed ML used in {cityOverview.name} ({cityOverview.studyPeriod}).
              </p>
            </div>
          </div>
        </motion.div>

        <div className="methodology-toc glass-panel">
          <span className="text-muted">Jump to:</span>
          {sections.map((s) => (
            <a key={s.id} href={`#${s.id}`} className="toc-link">{s.data.abbreviation}</a>
          ))}
        </div>

        {sections.map((section, idx) => {
          const Icon = section.icon;
          const { data } = section;

          return (
            <motion.section
              key={section.id}
              id={section.id}
              className="methodology-section glass-panel"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * idx }}
            >
              <div className="methodology-section-header">
                <Icon size={22} className="text-accent-cyan" />
                <div>
                  <h3>{data.title}</h3>
                  <span className="methodology-abbr">{data.abbreviation}</span>
                </div>
              </div>

              <p className="text-muted methodology-desc">{data.description}</p>

              {data.formula && (
                <div className="methodology-formula-block">
                  <span className="text-muted">Formula</span>
                  <code>{data.formula}</code>
                </div>
              )}

              {data.unit && (
                <p className="methodology-unit"><strong>Unit:</strong> {data.unit}</p>
              )}

              {data.sources && (
                <div className="concept-sources" style={{ marginTop: '1rem' }}>
                  <span className="text-muted">Data sources:</span>
                  <div className="source-tags">
                    {data.sources.map((s) => (
                      <span key={s} className="source-tag">{s}</span>
                    ))}
                  </div>
                </div>
              )}

              {data.cityStats && (
                <div className="concept-stats-grid" style={{ marginTop: '1.25rem' }}>
                  {Object.entries(data.cityStats).map(([key, val]) => (
                    <div key={key} className="concept-stat">
                      <span className="concept-stat-key">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                      <span className="concept-stat-val">{val}</span>
                    </div>
                  ))}
                </div>
              )}

              {data.physicsConstraints && (
                <div className="physics-constraints" style={{ marginTop: '1.25rem' }}>
                  <span className="text-muted">Physics constraints in PINN loss:</span>
                  <ul className="constraint-list">
                    {data.physicsConstraints.map((c) => (
                      <li key={c}>{c}</li>
                    ))}
                  </ul>
                </div>
              )}

              {data.indices && (
                <div className="indices-grid" style={{ marginTop: '1.25rem' }}>
                  {data.indices.map((idx) => (
                    <div key={idx.name} className="index-card">
                      <strong>{idx.name}</strong>
                      <span className="text-muted">{idx.full}</span>
                      <span>Unit: {idx.unit}</span>
                      <span className="index-threshold">{idx.threshold}</span>
                    </div>
                  ))}
                </div>
              )}

              {section.zones && (
                <div className="methodology-table-wrap" style={{ marginTop: '1.25rem' }}>
                  <table className="methodology-table">
                    <thead>
                      <tr>
                        <th>{section.id === 'albedo' ? 'Surface' : 'Zone'}</th>
                        <th>{section.zoneLabel}</th>
                        {section.id === 'heatstress' && (
                          <>
                            <th>LST (°C)</th>
                            <th>UTCI (°C)</th>
                            <th>Risk</th>
                          </>
                        )}
                        {section.id === 'uhi' && <th>Class</th>}
                        {section.id === 'ndvi' && <th>Canopy %</th>}
                        {section.id === 'lst' && <th>Δ vs Rural</th>}
                        {section.id === 'albedo' && <th>LST Impact</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {section.zones.map((row) => (
                        <tr key={row.zone || row.surface}>
                          <td>{row.zone || row.surface}</td>
                          <td>{row[section.zoneKey]}</td>
                          {section.id === 'heatstress' && (
                            <>
                              <td>{row.lst}</td>
                              <td>{row.utci}</td>
                              <td><span className={`risk-badge risk-${row.risk.toLowerCase()}`}>{row.risk}</span></td>
                            </>
                          )}
                          {section.id === 'uhi' && <td>{row.class}</td>}
                          {section.id === 'ndvi' && <td>{row.canopy}%</td>}
                          {section.id === 'lst' && <td>{row.delta}</td>}
                          {section.id === 'albedo' && <td>{row.lstImpact}</td>}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {data.colorScale && (
                <div style={{ marginTop: '1.25rem', maxWidth: 400 }}>
                  <MapLegend title={`${data.abbreviation} Color Scale`} colorScale={data.colorScale} unit={data.unit} />
                </div>
              )}
            </motion.section>
          );
        })}

        <motion.div
          className="glass-panel methodology-cta"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          style={{ padding: '2rem', textAlign: 'center', marginTop: '2rem' }}
        >
          <h3>Explore the Data Interactively</h3>
          <p className="text-muted" style={{ margin: '0.75rem 0 1.25rem' }}>
            View multi-layer heat maps, run SHAP driver analysis, and simulate cooling interventions.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <AnimatedButton to="/heatmap" variant="primary">Open Heat Maps</AnimatedButton>
            <AnimatedButton to="/analysis" variant="secondary">Run Analysis</AnimatedButton>
          </div>
        </motion.div>
      </div>
    </AnimatedPage>
  );
}
