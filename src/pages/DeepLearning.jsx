import React from 'react';

export default function DeepLearning() {
    return (
        <div className="page-container container">
            <div className="section-header">
                <h2>Deep Learning Capabilities</h2>
                <div className="pulse-dot"></div>
            </div>

            <div className="glass-panel" style={{ padding: '2rem' }}>
                <h3 style={{ color: 'var(--accent-primary)', marginBottom: '1rem' }}>Neural Networks</h3>
                <div className="grid-2">
                    <div className="concept-card glass-panel">
                        <div className="concept-card-header">
                            <h3>Convolutional Neural Net (CNN)</h3>
                        </div>
                        <p className="concept-desc">Used for high-resolution satellite imagery segmentation and feature extraction (e.g., U-Net architectures).</p>
                        <button className="layer-btn">Initialize Network</button>
                    </div>

                    <div className="concept-card glass-panel">
                        <div className="concept-card-header">
                            <h3>Transformer (Vision)</h3>
                        </div>
                        <p className="concept-desc">State-of-the-art spatial attention mechanism for temporal tracking of thermal phenomena.</p>
                        <button className="layer-btn">Initialize Network</button>
                    </div>

                    <div className="concept-card glass-panel">
                        <div className="concept-card-header">
                            <h3>LSTM</h3>
                        </div>
                        <p className="concept-desc">Time-series forecasting for climate variations over multiple decades.</p>
                        <button className="layer-btn">Initialize Network</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
