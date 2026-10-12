/**
 * SHEETAL.AI - Centralized API Service
 * Manages communication with the backend analytics engine.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

class ApiService {
    constructor(baseUrl) {
        this.baseUrl = baseUrl.replace(/\/+$/, '');
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), options.timeout || 8000);

        try {
            const response = await fetch(url, {
                ...options,
                signal: controller.signal,
                headers: {
                    'Content-Type': 'application/json',
                    ...(options.headers || {})
                }
            });
            clearTimeout(timeoutId);

            if (!response.ok) {
                const errorBody = await response.text().catch(() => '');
                throw new Error(`HTTP ${response.status}: ${errorBody || response.statusText}`);
            }

            return await response.json();
        } catch (err) {
            clearTimeout(timeoutId);
            if (err.name === 'AbortError') {
                throw new Error(`Request timeout: Backend did not respond within ${options.timeout || 8000}ms.`);
            }
            throw err;
        }
    }

    /**
     * Health / Status Check
     */
    async getStatus() {
        return this.request('/');
    }

    /**
     * Fetch authentic historical hotspot nodes with satellite LST and 2m air temp
     */
    async getHotspots(region = null, fetchLiveAirTemp = false) {
        let query = '';
        const params = [];
        if (region) params.push(`region=${encodeURIComponent(region)}`);
        if (fetchLiveAirTemp) params.push(`fetch_live_air_temp=true`);
        if (params.length > 0) query = `?${params.join('&')}`;

        return this.request(`/api/v1/hotspots${query}`);
    }

    /**
     * Fetch reproducible ML model metadata card and evaluation metrics
     */
    async getModelInfo() {
        return this.request('/api/v1/ai/model-info');
    }

    /**
     * Run empirical thermal mitigation prediction
     */
    async predictCooling(payload) {
        return this.request('/api/v1/ai/predict', {
            method: 'POST',
            body: JSON.stringify(payload)
        });
    }

    /**
     * Helper to construct WebSocket URL for telemetry stream
     */
    getTelemetryWsUrl() {
        const wsProto = this.baseUrl.startsWith('https') ? 'wss' : 'ws';
        const cleanHost = this.baseUrl.replace(/^https?:\/\//, '');
        return `${wsProto}://${cleanHost}/ws/telemetry`;
    }
}

export const api = new ApiService(API_BASE_URL);
export default api;
