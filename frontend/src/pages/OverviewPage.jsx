import React from 'react';
import {
  AlertTriangle,
  Ambulance,
  Building2,
  Clock,
  Plus,
  Play,
  MapPin,
  TrendingUp,
  Activity,
  ArrowRight,
  ShieldAlert,
  ChevronRight,
} from 'lucide-react';

export default function OverviewPage({
  incidents = [],
  ambulances = [],
  hospitalsCount = 41,
  onNewEmergencyClick,
  onSelectEmergency,
  onQuickDemoRun,
  onNavigateTab,
}) {
  const activeEmergenciesCount = incidents.filter(i => i.status !== 'Resolved').length;
  const availableAmbsCount = ambulances.filter(a => a.status === 'Available').length;
  const totalAmbsCount = ambulances.length || 12;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Top Banner & Quick Viva Demo Action */}
      <div className="command-card" style={{
        background: 'linear-gradient(135deg, #131d33 0%, #0d1424 100%)',
        border: '1px solid var(--border-active)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        padding: '20px 24px',
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge badge-demo">Evaluation Prototype</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Central Delhi Dispatch Grid</span>
          </div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: '6px', color: 'var(--text-bright)' }}>
            Operational Command & Dispatch Dashboard
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px', maxWidth: '640px' }}>
            AI-driven multi-objective optimization balancing emergency response distance, dynamic OSMnx road network obstacles, and hospital bed congestion.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={onQuickDemoRun}
            className="btn btn-primary"
            style={{ padding: '10px 16px' }}
          >
            <Play size={15} />
            <span>Trigger Viva Demo Incident</span>
          </button>
          <button
            onClick={onNewEmergencyClick}
            className="btn btn-secondary"
            style={{ padding: '10px 16px' }}
          >
            <Plus size={15} />
            <span>New Incident Form</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '16px',
      }}>
        {/* KPI 1: Active Emergencies */}
        <div className="command-card" style={{ borderLeft: '4px solid #ef4444' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
              Active Emergencies
            </span>
            <span className="badge badge-demo">Demo Data</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
            <span className="mono" style={{ fontSize: '2rem', fontWeight: 700, color: '#fca5a5' }}>
              {String(activeEmergenciesCount).padStart(2, '0')}
            </span>
            <span style={{ fontSize: '0.75rem', color: '#f87171', display: 'flex', alignItems: 'center', gap: '3px' }}>
              <TrendingUp size={12} /> +2 since last hour
            </span>
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            2 Critical &bull; 1 En Route to Hospital
          </div>
        </div>

        {/* KPI 2: Available Ambulances */}
        <div className="command-card" style={{ borderLeft: '4px solid #10b981' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
              Available Ambulances
            </span>
            <span className="badge badge-demo">Demo Data</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
            <span className="mono" style={{ fontSize: '2rem', fontWeight: 700, color: '#6ee7b7' }}>
              {String(availableAmbsCount).padStart(2, '0')} <span style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>/ {totalAmbsCount}</span>
            </span>
            <span className="badge badge-operational" style={{ fontSize: '0.65rem' }}>
              {Math.round((availableAmbsCount / totalAmbsCount) * 100)}% Ready
            </span>
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            7 ALS Units &bull; 5 BLS Units Stationed
          </div>
        </div>

        {/* KPI 3: Hospitals Available */}
        <div className="command-card" style={{ borderLeft: '4px solid #38bdf8' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
              Hospitals Available
            </span>
            <span className="badge badge-operational" style={{ fontSize: '0.62rem' }}>OSM Live Query</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
            <span className="mono" style={{ fontSize: '2rem', fontWeight: 700, color: '#38bdf8' }}>
              {hospitalsCount}
            </span>
            <span style={{ fontSize: '0.75rem', color: '#7dd3fc' }}>
              Central Delhi Grid
            </span>
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            Real-time OSMnx bounding box extraction
          </div>
        </div>

        {/* KPI 4: Avg Response Time */}
        <div className="command-card" style={{ borderLeft: '4px solid #f59e0b' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
              Avg. Response Time
            </span>
            <span className="badge badge-demo">Demo Data</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
            <span className="mono" style={{ fontSize: '2rem', fontWeight: 700, color: '#fcd34d' }}>
              08:42 <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>min</span>
            </span>
            <span style={{ fontSize: '0.72rem', color: '#10b981' }}>
              -1.4m via Dijkstra
            </span>
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            Optimal route obstacle rerouting active
          </div>
        </div>
      </div>

      {/* Two Column Layout: Active Incidents & Fleet Telemetry */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.7fr 1fr', gap: '20px' }}>
        {/* Active Emergency Feed */}
        <div className="command-card">
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px',
            paddingBottom: '12px',
            borderBottom: '1px solid var(--border-subtle)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertTriangle size={18} style={{ color: '#ef4444' }} />
              <h3 style={{ fontSize: '0.98rem', fontWeight: 600 }}>Active Emergency Priority Queue</h3>
            </div>
            <button
              onClick={() => onNavigateTab('requests')}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.74rem' }}
            >
              <span>View All</span>
              <ChevronRight size={13} />
            </button>
          </div>

          {/* Incidents List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {incidents.slice(0, 4).map((inc) => (
              <div
                key={inc.id}
                onClick={() => onSelectEmergency(inc)}
                style={{
                  padding: '12px 14px',
                  borderRadius: '6px',
                  backgroundColor: 'var(--bg-main)',
                  border: '1px solid var(--border-subtle)',
                  cursor: 'pointer',
                  transition: 'border-color 0.15s, transform 0.1s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = '#3b82f6'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className={inc.severity === 'Critical' ? 'badge badge-critical' : inc.severity === 'High' ? 'badge badge-high' : 'badge badge-moderate'}>
                      {inc.severity}
                    </span>
                    <span className="mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {inc.id}
                    </span>
                    <span style={{ fontSize: '0.86rem', fontWeight: 600, color: 'var(--text-bright)' }}>
                      {inc.title || inc.location}
                    </span>
                  </div>
                  <span className="badge badge-operational" style={{ fontSize: '0.62rem' }}>
                    {inc.status}
                  </span>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '0.75rem',
                  color: 'var(--text-muted)',
                  marginTop: '4px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <span>📍 {inc.location}</span>
                    <span>🚑 Unit: <strong style={{ color: '#93c5fd' }}>{inc.assigned_ambulance || 'AMB-02'}</strong></span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#f59e0b', fontWeight: 600 }}>
                    <Clock size={12} /> {inc.eta_min ? `${inc.eta_min} min` : '5.4 min'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Fleet Glance & System Core */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Quick Fleet Readiness */}
          <div className="command-card">
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '14px',
              paddingBottom: '10px',
              borderBottom: '1px solid var(--border-subtle)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Ambulance size={17} style={{ color: '#10b981' }} />
                <h3 style={{ fontSize: '0.92rem', fontWeight: 600 }}>Fleet Deployment</h3>
              </div>
              <button
                onClick={() => onNavigateTab('resources')}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.72rem' }}
              >
                Manage
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {ambulances.slice(0, 5).map((amb) => (
                <div
                  key={amb.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 10px',
                    borderRadius: '5px',
                    backgroundColor: 'var(--bg-main)',
                    fontSize: '0.76rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="mono" style={{ fontWeight: 700, color: 'var(--text-bright)' }}>
                      {amb.id}
                    </span>
                    <span style={{ color: 'var(--text-muted)' }}>{amb.base_station}</span>
                  </div>
                  <span className={
                    amb.status === 'Available' ? 'badge badge-operational' :
                    amb.status === 'En Route' ? 'badge badge-critical' :
                    amb.status === 'Assigned' ? 'badge badge-high' : 'badge badge-low'
                  } style={{ fontSize: '0.62rem' }}>
                    {amb.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Engine Telemetry */}
          <div className="command-card" style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-bright)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Activity size={14} style={{ color: '#38bdf8' }} />
              Graph Engine Specification
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', lineHeight: 1.45 }}>
              Delhi-NCR network graph loaded with <strong>7,103 nodes</strong> and drive network topology. Recalculates alternative paths in &lt;100ms when road blockages occur.
            </div>
            <button
              onClick={() => onNavigateTab('map')}
              className="btn btn-secondary btn-sm"
              style={{ width: '100%', marginTop: '12px', fontSize: '0.75rem' }}
            >
              <MapPin size={13} />
              <span>Open Tactical Routing Map</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
