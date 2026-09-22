import React, { useState } from 'react';
import { X, AlertTriangle, Send, CheckCircle2, Navigation, Hospital, Shield, Compass } from 'lucide-react';
import { DEMO_LOCATION_PRESETS } from '../data/mockData';

export default function NewEmergencyModal({ isOpen, onClose, onDispatchSuccess }) {
  const [emergencyType, setEmergencyType] = useState('Accident');
  const [severity, setSeverity] = useState('Critical');
  const [patientCount, setPatientCount] = useState(2);
  const [selectedPresetIndex, setSelectedPresetIndex] = useState(0);
  const [customLat, setCustomLat] = useState(DEMO_LOCATION_PRESETS[0].lat);
  const [customLon, setCustomLon] = useState(DEMO_LOCATION_PRESETS[0].lon);
  const [locationName, setLocationName] = useState(DEMO_LOCATION_PRESETS[0].name);
  const [notes, setNotes] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [dispatchResult, setDispatchResult] = useState(null);

  if (!isOpen) return null;

  const handlePresetChange = (idx) => {
    setSelectedPresetIndex(idx);
    if (idx >= 0 && idx < DEMO_LOCATION_PRESETS.length) {
      setCustomLat(DEMO_LOCATION_PRESETS[idx].lat);
      setCustomLon(DEMO_LOCATION_PRESETS[idx].lon);
      setLocationName(DEMO_LOCATION_PRESETS[idx].name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);

    // Validation
    if (!locationName.trim()) {
      setErrorMsg('Please specify an incident location or select a preset.');
      return;
    }
    if (isNaN(customLat) || isNaN(customLon) || customLat < 28.0 || customLat > 29.0 || customLon < 76.5 || customLon > 78.0) {
      setErrorMsg('Coordinates must fall within the Delhi-NCR bounding zone (Lat: ~28.6, Lon: ~77.2).');
      return;
    }
    if (patientCount < 1) {
      setErrorMsg('Patient count must be at least 1.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        emergency_type: emergencyType,
        severity,
        patient_count: Number(patientCount),
        location_name: locationName,
        incident_lat: Number(customLat),
        incident_lon: Number(customLon),
        notes: notes || 'Dispatched via Command Center console.',
      };

      const res = await onDispatchSuccess(payload);
      setDispatchResult(res);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to dispatch emergency request.');
    } finally {
      setLoading(false);
    }
  };

  const handleDone = () => {
    setDispatchResult(null);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-active)',
        borderRadius: '10px',
        width: '100%',
        maxWidth: '620px',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)',
      }}>
        {/* Modal Header */}
        <div style={{
          padding: '18px 24px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '6px',
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ef4444',
            }}>
              <AlertTriangle size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>New Emergency Incident</h3>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                Triage classification & dynamic hospital routing
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '4px',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '24px' }}>
          {dispatchResult ? (
            /* Analysis & Dispatch Response Card */
            <div>
              <div style={{
                padding: '16px',
                borderRadius: '8px',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
              }}>
                <CheckCircle2 size={24} style={{ color: '#10b981', marginTop: '2px', flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#6ee7b7' }}>
                    Incident Triaged & Dispatched Successfully
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#cbd5e1', marginTop: '4px' }}>
                    {dispatchResult.recommended_action}
                  </div>
                </div>
              </div>

              {/* Breakdown Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '12px',
                marginBottom: '20px',
              }}>
                <div style={{
                  padding: '14px',
                  borderRadius: '6px',
                  backgroundColor: 'var(--bg-main)',
                  border: '1px solid var(--border-subtle)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#38bdf8', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>
                    <Shield size={14} /> Assigned Resource
                  </div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, marginTop: '6px', color: 'var(--text-bright)' }}>
                    {dispatchResult.assigned_ambulance?.id || 'AMB-01'}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    {dispatchResult.assigned_ambulance?.type || 'Advanced Life Support (ALS)'}
                  </div>
                </div>

                <div style={{
                  padding: '14px',
                  borderRadius: '6px',
                  backgroundColor: 'var(--bg-main)',
                  border: '1px solid var(--border-subtle)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10b981', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>
                    <Hospital size={14} /> Optimal Hospital
                  </div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, marginTop: '6px', color: 'var(--text-bright)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {dispatchResult.assigned_hospital?.name || 'Local Hospital'}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#6ee7b7', marginTop: '2px' }}>
                    {dispatchResult.assigned_hospital?.available_beds} beds available &bull; {dispatchResult.assigned_hospital?.distance_km} km
                  </div>
                </div>

                <div style={{
                  padding: '14px',
                  borderRadius: '6px',
                  backgroundColor: 'var(--bg-main)',
                  border: '1px solid var(--border-subtle)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#f59e0b', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>
                    <Navigation size={14} /> Route ETA & Distance
                  </div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, marginTop: '6px', color: 'var(--text-bright)' }}>
                    {dispatchResult.routing_details?.estimated_time_min || 5.2} min
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Network distance: {dispatchResult.routing_details?.distance_km || 1.8} km
                  </div>
                </div>

                <div style={{
                  padding: '14px',
                  borderRadius: '6px',
                  backgroundColor: 'var(--bg-main)',
                  border: '1px solid var(--border-subtle)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ef4444', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>
                    <Compass size={14} /> Road Simulation
                  </div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, marginTop: '6px', color: '#fca5a5' }}>
                    Dynamic Reroute Active
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    {dispatchResult.routing_details?.simulation_event || 'Dijkstra shortest path computed'}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleDone}
                className="btn btn-primary"
                style={{ width: '100%', padding: '12px' }}
              >
                View Live Route on Tactical Map
              </button>
            </div>
          ) : (
            /* Emergency Form */
            <form onSubmit={handleSubmit}>
              {errorMsg && (
                <div style={{
                  padding: '10px 14px',
                  borderRadius: '6px',
                  backgroundColor: 'var(--red-bg)',
                  border: '1px solid var(--red-border)',
                  color: '#fca5a5',
                  fontSize: '0.8rem',
                  marginBottom: '16px',
                }}>
                  {errorMsg}
                </div>
              )}

              {/* Emergency Type & Severity */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Emergency Classification
                  </label>
                  <select
                    value={emergencyType}
                    onChange={(e) => setEmergencyType(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      backgroundColor: 'var(--bg-main)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '6px',
                      color: 'var(--text-bright)',
                      fontSize: '0.85rem',
                      outline: 'none',
                    }}
                  >
                    <option value="Accident">Accident / Collision</option>
                    <option value="Medical">Medical / Acute Cardiac</option>
                    <option value="Trauma">Severe Trauma / Fall</option>
                    <option value="Fire">Fire / Industrial Incident</option>
                    <option value="Other">Other Emergency</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Triage Severity Level
                  </label>
                  <select
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      backgroundColor: 'var(--bg-main)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '6px',
                      color: severity === 'Critical' ? '#f87171' : severity === 'High' ? '#fbbf24' : 'var(--text-bright)',
                      fontWeight: 600,
                      fontSize: '0.85rem',
                      outline: 'none',
                    }}
                  >
                    <option value="Critical">CRITICAL - Immediate Threat</option>
                    <option value="High">HIGH - Urgent Care Needed</option>
                    <option value="Moderate">MODERATE - Semi-Urgent</option>
                    <option value="Low">LOW - Non-Emergency</option>
                  </select>
                </div>
              </div>

              {/* Patient Count */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Casualties / Patient Count
                </label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={patientCount}
                  onChange={(e) => setPatientCount(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    backgroundColor: 'var(--bg-main)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '6px',
                    color: 'var(--text-bright)',
                    fontSize: '0.85rem',
                    outline: 'none',
                  }}
                  required
                />
              </div>

              {/* Location Presets */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Incident Location Preset (Delhi Central Grid)
                </label>
                <select
                  value={selectedPresetIndex}
                  onChange={(e) => handlePresetChange(Number(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    backgroundColor: 'var(--bg-main)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '6px',
                    color: 'var(--text-bright)',
                    fontSize: '0.85rem',
                    outline: 'none',
                  }}
                >
                  {DEMO_LOCATION_PRESETS.map((loc, i) => (
                    <option key={i} value={i}>{loc.name}</option>
                  ))}
                </select>
              </div>

              {/* Custom Lat / Lon */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                    Incident Latitude (OSM node anchor)
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    value={customLat}
                    onChange={(e) => setCustomLat(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      backgroundColor: 'var(--bg-main)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '5px',
                      color: 'var(--text-bright)',
                      fontSize: '0.82rem',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                    Incident Longitude (OSM node anchor)
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    value={customLon}
                    onChange={(e) => setCustomLon(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      backgroundColor: 'var(--bg-main)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '5px',
                      color: 'var(--text-bright)',
                      fontSize: '0.82rem',
                    }}
                  />
                </div>
              </div>

              {/* Location Name */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Location Landmark / Description
                </label>
                <input
                  type="text"
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  placeholder="e.g. Connaught Place Inner Circle Block B"
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    backgroundColor: 'var(--bg-main)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '6px',
                    color: 'var(--text-bright)',
                    fontSize: '0.85rem',
                  }}
                  required
                />
              </div>

              {/* Additional Notes */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Field Notes & Triage Telemetry
                </label>
                <textarea
                  rows="3"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Severe impact, structural damage blocking eastbound lane..."
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    backgroundColor: 'var(--bg-main)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '6px',
                    color: 'var(--text-bright)',
                    fontSize: '0.85rem',
                    resize: 'none',
                  }}
                />
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={onClose}
                  className="btn btn-secondary"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? (
                    <span>Optimizing Route...</span>
                  ) : (
                    <>
                      <Send size={15} />
                      <span>Analyze & Dispatch Emergency</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
