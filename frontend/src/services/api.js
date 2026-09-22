/**
 * Centralized API Service for Emergency Response Command Center
 * Connects to FastAPI Backend at http://127.0.0.1:8000
 */

export const API_BASE_URL = 'http://127.0.0.1:8000';

async function fetchJson(url, options = {}) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP Error ${response.status}: ${response.statusText}`);
    }
    return await response.json();
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new Error('Request timed out while contacting emergency dispatch backend.');
    }
    throw err;
  }
}

export const api = {
  /** Health check endpoint (GET /) */
  async checkHealth() {
    return await fetchJson(`${API_BASE_URL}/`);
  },

  /** Dynamic hospital registry with distance metrics (GET /api/hospitals) */
  async getHospitals(incidentLat = null, incidentLon = null) {
    let url = `${API_BASE_URL}/api/hospitals`;
    if (incidentLat !== null && incidentLon !== null) {
      url += `?lat=${incidentLat}&lon=${incidentLon}`;
    }
    return await fetchJson(url);
  },

  /** Fleet telemetry and availability (GET /api/ambulances) */
  async getAmbulances() {
    return await fetchJson(`${API_BASE_URL}/api/ambulances`);
  },

  /** Active and recent incidents (GET /api/incidents) */
  async getIncidents() {
    return await fetchJson(`${API_BASE_URL}/api/incidents`);
  },

  /** Primary routing and multi-objective optimization (GET /optimize) */
  async optimizeRoute(ambLat, ambLon, incLat, incLon) {
    const url = `${API_BASE_URL}/optimize?ambulance_lat=${ambLat}&ambulance_lon=${ambLon}&incident_lat=${incLat}&incident_lon=${incLon}`;
    return await fetchJson(url);
  },

  /** Dispatch new emergency incident (POST /api/emergency/dispatch) */
  async dispatchEmergency(data) {
    return await fetchJson(`${API_BASE_URL}/api/emergency/dispatch`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /** Technical status & modular architecture health (GET /api/system/status) */
  async getSystemStatus() {
    return await fetchJson(`${API_BASE_URL}/api/system/status`);
  },
};
