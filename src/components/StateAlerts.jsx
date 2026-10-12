import React from 'react';
import { AlertTriangle, RefreshCw, Database, Radio } from 'lucide-react';
import AnimatedButton from './AnimatedButton';

export function LoadingState({ message = 'Accessing telemetry and satellite data streams...' }) {
    return (
        <div className="glass-panel" style={{
            padding: '3rem 2rem',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
            minHeight: '260px'
        }}>
            <div style={{ position: 'relative' }}>
                <RefreshCw size={36} className="text-accent-cyan" style={{ animation: 'spin 1.8s linear infinite' }} />
                <Radio size={16} className="text-rose-500" style={{ position: 'absolute', top: -4, right: -4, animation: 'pulse 1.2s infinite' }} />
            </div>
            <div>
                <h4 style={{ margin: '0 0 0.5rem', color: '#f8fafc', fontWeight: 600 }}>Syncing Atmospheric & Satellite Stream</h4>
                <p className="text-muted" style={{ margin: 0, fontSize: '0.875rem' }}>{message}</p>
            </div>
        </div>
    );
}

export function ErrorState({ title = 'Backend Service Disconnected', message, onRetry }) {
    return (
        <div className="glass-panel" style={{
            padding: '2.5rem 2rem',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem',
            borderColor: 'rgba(244, 63, 94, 0.3)',
            background: 'rgba(244, 63, 94, 0.05)',
            minHeight: '260px'
        }}>
            <div style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                background: 'rgba(244, 63, 94, 0.15)',
                display: 'grid',
                placeItems: 'center',
                color: '#f43f5e'
            }}>
                <AlertTriangle size={26} />
            </div>
            <div>
                <h4 style={{ margin: '0 0 0.5rem', color: '#f43f5e', fontWeight: 600 }}>{title}</h4>
                <p className="text-muted" style={{ margin: 0, maxWidth: '480px', fontSize: '0.875rem', lineHeight: 1.5 }}>
                    {message || 'Unable to establish connection with the SHEETAL.AI analytics engine at VITE_API_BASE_URL. Please ensure the backend is running.'}
                </p>
            </div>
            {onRetry && (
                <button
                    onClick={onRetry}
                    className="btn btn-secondary"
                    style={{
                        marginTop: '0.5rem',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        cursor: 'pointer'
                    }}
                >
                    <RefreshCw size={15} /> Reconnect to Backend
                </button>
            )}
        </div>
    );
}

export function EmptyState({ title = 'No Sensor Nodes Detected', message = 'No historical or live observation records match the current filter criteria.', onReset }) {
    return (
        <div className="glass-panel" style={{
            padding: '2.5rem 2rem',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem',
            minHeight: '240px'
        }}>
            <Database size={36} className="text-muted" />
            <div>
                <h4 style={{ margin: '0 0 0.5rem', color: '#f8fafc', fontWeight: 600 }}>{title}</h4>
                <p className="text-muted" style={{ margin: 0, fontSize: '0.875rem' }}>{message}</p>
            </div>
            {onReset && (
                <button onClick={onReset} className="btn btn-secondary" style={{ marginTop: '0.5rem' }}>
                    Reset Query Filter
                </button>
            )}
        </div>
    );
}

export default { LoadingState, ErrorState, EmptyState };
