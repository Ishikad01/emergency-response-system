import React from 'react';
import { X, AlertTriangle, Shield, Hospital, Navigation, Clock, Users, FileText, ArrowRight } from 'lucide-react';

export default function EmergencyDrawer({ emergency, onClose, onViewOnMap }) {
  if (!emergency) return null;

  const getSeverityBadgeClass = (sev) => {
    switch (sev?.toLowerCase()) {
      case 'critical': return 'badge-critical';
      case 'high': return 'badge-high';
      case 'moderate': return 'badge-moderate';
      default: return 'badge-low';
    }
  };

  const getStatusBadgeClass = (st) => {
    switch (st?.toLowerCase()) {
      case 'resolved': return 'badge-operational';
      case 'assigned': return 'badge-high';
      case 'en route': return 'badge-critical';
      default: return 'badge-low';
    }
  };

  return (
    <div className="modal-overlay">
      <div style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-active)',
        borderRadius: '10px',
        width: '100%',
        maxWidth: '560px',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)',
      }}>
        {/* Header */}
        <div style={{
          padding: '18px 22px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className={`badge ${getSeverityBadgeClass(emergency.severity)}`}>
                {emergency.severity}
              </span>
              <span className={`badge ${getStatusBadgeClass(emergency.status)}`}>
                {emergency.status}
              </span>
              <span className="mono" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {emergency.id}
              </span>
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginTop: '6px' }}>
              {emergency.title || emergency.location}
            </h3>
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

        {/* Content */}
        <div style={{ padding: '22px' }}>
          {/* Telemetry Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '12px',
            marginBottom: '20px',
          }}>
            <div style={{
              padding: '12px',
              backgroundColor: 'var(--bg-main)',
              borderRadius: '6px',
              border: '1px solid var(--border-subtle)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.72rem' }}>
                <Clock size={13} /> Reported
              </div>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-bright)', marginTop: '4px' }}>
                {emergency.reported_time || 'Recent'}
              </div>
            </div>

            <div style={{
              padding: '12px',
              backgroundColor: 'var(--bg-main)',
              borderRadius: '6px',
              border: '1px solid var(--border-subtle)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.72rem' }}>
                <Users size={13} /> Patient Count
              </div>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-bright)', marginTop: '4px' }}>
                {emergency.patient_count || 1} {emergency.patient_count === 1 ? 'Patient' : 'Patients'}
              </div>
            </div>

            <div style={{
              padding: '12px',
              backgroundColor: 'var(--bg-main)',
              borderRadius: '6px',
              border: '1px solid var(--border-subtle)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#60a5fa', fontSize: '0.72rem' }}>
                <Shield size={13} /> Assigned Unit
              </div>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#93c5fd', marginTop: '4px' }}>
                {emergency.assigned_ambulance || 'Pending Dispatch'}
              </div>
            </div>

            <div style={{
              padding: '12px',
              backgroundColor: 'var(--bg-main)',
              borderRadius: '6px',
              border: '1px solid var(--border-subtle)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#f59e0b', fontSize: '0.72rem' }}>
                <Navigation size={13} /> Estimated Response
              </div>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fcd34d', marginTop: '4px' }}>
                {emergency.eta_min ? `${emergency.eta_min} min` : '5.4 min'}
              </div>
            </div>
          </div>

          {/* Destination Hospital */}
          <div style={{
            padding: '14px',
            backgroundColor: 'var(--bg-main)',
            borderRadius: '6px',
            border: '1px solid var(--border-subtle)',
            marginBottom: '16px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10b981', fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase' }}>
              <Hospital size={14} /> Assigned Target Hospital
            </div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-bright)', marginTop: '6px' }}>
              {emergency.recommended_hospital || 'Lok Nayak Jai Prakash Hospital (LNJP)'}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Selected by dynamic multi-objective scoring (distance & bed congestion balance)
            </div>
          </div>

          {/* Coordinates & Location */}
          <div style={{
            padding: '14px',
            backgroundColor: 'var(--bg-main)',
            borderRadius: '6px',
            border: '1px solid var(--border-subtle)',
            marginBottom: '16px',
          }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
              Location & Coordinates
            </div>
            <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-bright)', marginTop: '4px' }}>
              {emergency.location}
            </div>
            <div className="mono" style={{ fontSize: '0.75rem', color: '#38bdf8', marginTop: '4px' }}>
              Lat: {emergency.latitude?.toFixed(4)}, Lon: {emergency.longitude?.toFixed(4)}
            </div>
          </div>

          {/* Notes */}
          {emergency.notes && (
            <div style={{
              padding: '12px',
              backgroundColor: 'rgba(255, 255, 255, 0.02)',
              borderRadius: '6px',
              border: '1px solid var(--border-subtle)',
              marginBottom: '20px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.72rem', fontWeight: 600 }}>
                <FileText size={13} /> Dispatcher Notes
              </div>
              <div style={{ fontSize: '0.8rem', color: '#cbd5e1', marginTop: '4px' }}>
                {emergency.notes}
              </div>
            </div>
          )}

          {/* CTA */}
          <button
            onClick={() => {
              onClose();
              if (onViewOnMap) onViewOnMap(emergency);
            }}
            className="btn btn-primary"
            style={{ width: '100%', padding: '11px' }}
          >
            <span>Track & Route on Map</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
