import React, { useState } from 'react';
import { AlertTriangle, Search, Filter, Plus, Clock, Shield, Hospital, Navigation, ArrowRight } from 'lucide-react';

export default function EmergencyRequestsPage({
  incidents = [],
  onSelectEmergency,
  onNewEmergencyClick,
  onViewOnMap,
}) {
  const [filterSeverity, setFilterSeverity] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredIncidents = incidents.filter((inc) => {
    const matchesSeverity = filterSeverity === 'ALL' || inc.severity?.toUpperCase() === filterSeverity;
    const matchesStatus = filterStatus === 'ALL' || inc.status?.toUpperCase() === filterStatus;
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      !query ||
      inc.id?.toLowerCase().includes(query) ||
      inc.title?.toLowerCase().includes(query) ||
      inc.location?.toLowerCase().includes(query) ||
      inc.type?.toLowerCase().includes(query);
    return matchesSeverity && matchesStatus && matchesSearch;
  });

  const getSeverityBadge = (sev) => {
    switch (sev?.toLowerCase()) {
      case 'critical': return <span className="badge badge-critical">{sev}</span>;
      case 'high': return <span className="badge badge-high">{sev}</span>;
      case 'moderate': return <span className="badge badge-moderate">{sev}</span>;
      default: return <span className="badge badge-low">{sev}</span>;
    }
  };

  const getStatusBadge = (st) => {
    switch (st?.toLowerCase()) {
      case 'resolved': return <span className="badge badge-operational">{st}</span>;
      case 'assigned': return <span className="badge badge-high">{st}</span>;
      case 'en route': return <span className="badge badge-critical">{st}</span>;
      default: return <span className="badge badge-moderate">{st}</span>;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <AlertTriangle size={22} style={{ color: '#ef4444' }} />
            Emergency Incident Priority Queue
          </h2>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Real-time incident dispatching and multi-facility hospital routing &bull; <span className="badge badge-demo">Simulated Stream</span>
          </div>
        </div>

        <button onClick={onNewEmergencyClick} className="btn btn-primary">
          <Plus size={16} />
          <span>New Emergency Request</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="command-card" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
        {/* Search */}
        <div style={{ position: 'relative', width: '280px' }}>
          <Search size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by ID, location, type..."
            style={{
              width: '100%',
              padding: '7px 10px 7px 32px',
              backgroundColor: 'var(--bg-main)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '6px',
              color: 'var(--text-bright)',
              fontSize: '0.8rem',
              outline: 'none',
            }}
          />
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Severity:</span>
            {['ALL', 'CRITICAL', 'HIGH', 'MODERATE'].map((s) => (
              <button
                key={s}
                onClick={() => setFilterSeverity(s)}
                style={{
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: '1px solid',
                  borderColor: filterSeverity === s ? '#38bdf8' : 'var(--border-subtle)',
                  backgroundColor: filterSeverity === s ? 'rgba(56, 189, 248, 0.15)' : 'transparent',
                  color: filterSeverity === s ? '#38bdf8' : 'var(--text-secondary)',
                }}
              >
                {s}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Status:</span>
            {['ALL', 'ASSIGNED', 'EN ROUTE', 'RESOLVED'].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                style={{
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: '1px solid',
                  borderColor: filterStatus === st ? '#10b981' : 'var(--border-subtle)',
                  backgroundColor: filterStatus === st ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
                  color: filterStatus === st ? '#10b981' : 'var(--text-secondary)',
                }}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table of Emergencies */}
      <div className="command-card" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
            <thead>
              <tr style={{ backgroundColor: 'rgba(15, 21, 35, 0.8)', borderBottom: '1px solid var(--border-subtle)' }}>
                <th style={{ padding: '12px 16px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.7rem' }}>Emergency ID</th>
                <th style={{ padding: '12px 16px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.7rem' }}>Type & Description</th>
                <th style={{ padding: '12px 16px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.7rem' }}>Severity</th>
                <th style={{ padding: '12px 16px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.7rem' }}>Location</th>
                <th style={{ padding: '12px 16px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.7rem' }}>Time</th>
                <th style={{ padding: '12px 16px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.7rem' }}>Status</th>
                <th style={{ padding: '12px 16px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.7rem' }}>Assigned Resource</th>
                <th style={{ padding: '12px 16px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.7rem' }}>Assigned Hospital</th>
                <th style={{ padding: '12px 16px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.7rem' }}>ETA</th>
                <th style={{ padding: '12px 16px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.7rem' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredIncidents.length === 0 ? (
                <tr>
                  <td colSpan="10" style={{ padding: '36px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No emergency incidents match current filter criteria.
                  </td>
                </tr>
              ) : (
                filteredIncidents.map((inc) => (
                  <tr
                    key={inc.id}
                    onClick={() => onSelectEmergency(inc)}
                    style={{
                      borderBottom: '1px solid var(--border-subtle)',
                      cursor: 'pointer',
                      transition: 'background-color 0.15s',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <td style={{ padding: '12px 16px' }} className="mono">
                      <span style={{ color: '#38bdf8', fontWeight: 600 }}>{inc.id}</span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ fontWeight: 600, color: 'var(--text-bright)' }}>{inc.title || inc.type}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{inc.type} &bull; {inc.patient_count || 1} patient(s)</div>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      {getSeverityBadge(inc.severity)}
                    </td>
                    <td style={{ padding: '12px 16px', color: 'var(--text-bright)' }}>
                      {inc.location}
                    </td>
                    <td style={{ padding: '12px 16px', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                      {inc.reported_time || 'Recent'}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      {getStatusBadge(inc.status)}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span className="mono" style={{ color: '#93c5fd', fontWeight: 600 }}>
                        {inc.assigned_ambulance || 'Pending'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', color: '#cbd5e1' }}>
                      {inc.recommended_hospital || 'Calculating...'}
                    </td>
                    <td style={{ padding: '12px 16px' }} className="mono">
                      <span style={{ color: '#fcd34d', fontWeight: 600 }}>
                        {inc.eta_min ? `${inc.eta_min} min` : '5.4 min'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onViewOnMap) onViewOnMap(inc);
                        }}
                        className="btn btn-secondary btn-sm"
                        style={{ fontSize: '0.72rem', padding: '4px 8px' }}
                      >
                        Route
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
