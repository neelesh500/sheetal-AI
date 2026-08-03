import React from 'react';

export default class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch() {}

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: '#020617', color: '#e2e8f0', padding: '1rem', textAlign: 'center' }}>
          <div>
            <h1 style={{ marginBottom: '0.5rem' }}>Unable to load dashboard</h1>
            <p style={{ color: '#94a3b8' }}>Please refresh the page. If the issue persists, check network connectivity and deployment configuration.</p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
