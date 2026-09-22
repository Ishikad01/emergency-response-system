import React, { useState } from 'react';
import { Ambulance, Shield, Battery, Users, MapPin, CheckCircle2, AlertCircle, Wrench, Navigation } from 'lucide-react';

export default function ResourcesPage({ ambulances = [], onDispatchAmbulance }) {
  const [filterStatus, setFilterStatus] = useState('ALL');

  const filteredAmbulances = ambulances.filter((a) => {
    return filterStatus === 'ALL' || a.status?.toUpperCase() === filterStatus;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Available': return <span className="badge badge-operational">Available</span>;
      case 'Assigned': return <span className="badge badge-high">Assigned</span>;
      case 'En Route': return <span className="badge badge-critical">En Route</span>;
      case 'At Hospital': return <span className="badge badge-dev">At Hospital</span>;
      case 'Offline': return <span className="badge badge-low">Offline / Maintenance</span>;
      default: return <span className="badge badge-low">{status}</span>;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Available': return '#10b981';
      case 'Assigned': return '#f59e0b';
      case 'En Route': return '#ef4444';
      case 'At Hospital': return '#a855f7';
      default: return '#64748b';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Ambulance size={22} style={{ color: '#10b981' }} />
            Ambulance Fleet & Field Resources
          </h2>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Telemetry status of emergency mobile units &bull; <span className="badge badge-demo">Simulated Fleet Telematics</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          {['ALL', 'AVAILABLE', 'ASSIGNED', 'EN ROUTE', 'OFFLINE'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              style={{
                padding: '6px 12px',
                borderRadius: '5px',
                fontSize: '0.74rem',
                fontWeight: 600,
                cursor: 'pointer',
                border: '1px solid',
                borderColor: filterStatus === st ? '#10b981' : 'var(--border-subtle)',
                backgroundColor: filterStatus === st ? 'rgba(16, 185, 129, 0.15)' : 'var(--bg-card)',
                color: filterStatus === st ? '#10b981' : 'var(--text-secondary)',
              }}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Ambulance Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))',
        gap: '16px',
      }}>
        {filteredAmbulances.map((amb) => {
          const color = getStatusColor(amb.status);
          const isAvailable = amb.status === 'Available';

          return (
            <div
              key={amb.id}
              className="command-card"
              style={{
                borderLeft: `4px solid ${color}`,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '16px',
              }}
            >
              {/* Card Top */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '6px',
                      backgroundColor: `${color}20`,
                      color: color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                    }}>
                      🚑
                    </div>
                    <div>
                      <div className="mono" style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--text-bright)' }}>
                        {amb.id}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                        {amb.callsign}
                      </div>
                    </div>
                  </div>
                  {getStatusBadge(amb.status)}
                </div>

                {/* Specs */}
                <div style={{
                  padding: '10px',
                  borderRadius: '5px',
                  backgroundColor: 'var(--bg-main)',
                  border: '1px solid var(--border-subtle)',
                  marginTop: '10px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                  fontSize: '0.75rem',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Base Post:</span>
                    <span style={{ color: 'var(--text-bright)', fontWeight: 500 }}>{amb.base_station}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Capability:</span>
                    <span style={{ color: '#93c5fd', fontWeight: 600 }}>{amb.type}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Fuel / Battery:</span>
                    <span className="mono" style={{ color: amb.fuel_level > 50 ? '#6ee7b7' : '#f87171', fontWeight: 600 }}>
                      {amb.fuel_level || 85}%
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>GPS Position:</span>
                    <span className="mono" style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>
                      {amb.latitude?.toFixed(4)}, {amb.longitude?.toFixed(4)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Footer / Action */}
              <div style={{ marginTop: '14px', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  <Users size={12} />
                  <span>Crew: {amb.paramedics || 2} Paramedics</span>
                </div>

                {isAvailable ? (
                  <button
                    onClick={() => {
                      if (onDispatchAmbulance) onDispatchAmbulance(amb);
                    }}
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '0.72rem', padding: '4px 10px' }}
                  >
                    <Navigation size={12} />
                    <span>Select for Route</span>
                  </button>
                ) : (
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                    {amb.status === 'Offline' ? 'In Maintenance' : 'Active Mission'}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
