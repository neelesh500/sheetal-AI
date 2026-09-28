import React from 'react';

export default function MLModels() {
    return (
        <div className="page-container container">
            <div className="section-header">
                <h2>Machine Learning Models</h2>
                <div className="pulse-dot"></div>
            </div>

            <div className="glass-panel" style={{ padding: '2rem' }}>
                <h3 style={{ color: 'var(--accent-cyan)', marginBottom: '1rem' }}>Available Models</h3>
                <div className="grid-2">
                    <div className="concept-card glass-panel">
                        <div className="concept-card-header">
                            <h3>XGBoost Regressor</h3>
                        </div>
                        <p className="concept-desc">Optimized for structured tabular data. Predicts thermal anomalies across various terrains with high precision.</p>
                        <button className="layer-btn">Deploy Model</button>
                    </div>

                    <div className="concept-card glass-panel">
                        <div className="concept-card-header">
                            <h3>Random Forest</h3>
                        </div>
                        <p className="concept-desc">Ensemble learning method for classification and regression of urban heat islands.</p>
                        <button className="layer-btn">Deploy Model</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
