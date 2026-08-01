export default function MapLegend({ title, colorScale, unit }) {
  return (
    <div className="map-legend">
      <div className="map-legend-header">
        <span className="map-legend-title">{title}</span>
        {unit && <span className="map-legend-unit text-muted">{unit}</span>}
      </div>
      <div className="map-legend-bar">
        {colorScale.map((item, i) => (
          <div
            key={i}
            className="map-legend-segment"
            style={{ background: item.color }}
            title={item.label}
          />
        ))}
      </div>
      <div className="map-legend-labels">
        <span>{colorScale[0]?.label}</span>
        <span>{colorScale[colorScale.length - 1]?.label}</span>
      </div>
    </div>
  );
}
