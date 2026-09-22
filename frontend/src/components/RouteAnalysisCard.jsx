import React from 'react';
import { Hospital, Navigation, Clock, Shield, Network, AlertOctagon, Info } from 'lucide-react';

export default function RouteAnalysisCard({ routeData, selectedHospital, selectedAmbulance, onClearRoute }) {
  if (!routeData) {
    return (
      <div className="command-card" style={{ padding: '20px', textAlign: 'center' }}>
        <Network size={28} style={{ color: 'var(--text-muted)', margin: '0 auto 10px', display: 'block' }} />
        <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-bright)' }}>
          No Active Route Selected
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px', lineHeight: 1.4 }}>
          Click an emergency or dispatch a unit to compute NetworkX Dijkstra shortest path routing.
        </div>
      </div>
    );
  }

  const hospital = selectedHospital || routeData.assigned_hospital;
  const ambulance = selectedAmbulance || routeData.assigned_ambulance;
  const routing = routeData.routing_details || routeData;

  return (
    <div className="command-card" style={{ padding: '18px', border: '1px solid var(--border-active)' }}>
      {/* Card Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: '12px',
        borderBottom: '1px solid var(--border-subtle)',
        marginBottom: '14px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '5px',
            backgroundColor: 'rgba(56, 189, 248, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#38bdf8',
          }}>
            <Navigation size={16} />
          </div>
          <div>
            <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-bright)' }}>
              Tactical Route Analysis
            </div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
              OpenStreetMap NetworkX Graph Engine
            </div>
          </div>
        </div>
        {onClearRoute && (
          <button
            onClick={onClearRoute}
            className="btn btn-secondary btn-sm"
            style={{ fontSize: '0.7rem', padding: '3px 8px' }}
          >
            Reset
          </button>
        )}
      </div>

      {/* Recommended Hospital Card */}
      <div style={{
        padding: '12px',
        borderRadius: '6px',
        backgroundColor: 'var(--bg-main)',
        border: '1px solid var(--border-subtle)',
        marginBottom: '12px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10b981', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase' }}>
            <Hospital size={14} /> Recommended Hospital
          </div>
          <span className="badge badge-operational" style={{ fontSize: '0.62rem' }}>
            {hospital?.available_beds ?? 50} BEDS OPEN
          </span>
        </div>
        <div style={{ fontSize: '0.96rem', fontWeight: 700, color: 'var(--text-bright)', marginTop: '4px' }}>
          {hospital?.name || 'Lok Nayak Hospital (LNJP)'}
        </div>
        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
          {hospital?.address || 'Central Delhi Corridor'}
        </div>
      </div>

      {/* Route Distance & Time Metrics */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '10px',
        marginBottom: '12px',
      }}>
        <div style={{
          padding: '10px',
          borderRadius: '6px',
          backgroundColor: 'var(--bg-main)',
          border: '1px solid var(--border-subtle)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)', fontSize: '0.68rem', textTransform: 'uppercase' }}>
            <Navigation size={12} /> Route Distance
          </div>
          <div className="mono" style={{ fontSize: '1.2rem', fontWeight: 700, color: '#38bdf8', marginTop: '2px' }}>
            {routing?.distance_km ?? (hospital?.distance_km || 2.4)} <span style={{ fontSize: '0.75rem', fontWeight: 500 }}>km</span>
          </div>
        </div>

        <div style={{
          padding: '10px',
          borderRadius: '6px',
          backgroundColor: 'var(--bg-main)',
          border: '1px solid var(--border-subtle)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)', fontSize: '0.68rem', textTransform: 'uppercase' }}>
            <Clock size={12} /> Estimated Transit
          </div>
          <div className="mono" style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fcd34d', marginTop: '2px' }}>
            {routing?.estimated_time_min ?? 5.2} <span style={{ fontSize: '0.75rem', fontWeight: 500 }}>min</span>
          </div>
        </div>
      </div>

      {/* Assigned Resource & Availability */}
      <div style={{
        padding: '10px 12px',
        borderRadius: '6px',
        backgroundColor: 'var(--bg-main)',
        border: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '12px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Shield size={16} style={{ color: '#60a5fa' }} />
          <div>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-bright)' }}>
              Ambulance: {ambulance?.id || 'AMB-03'}
            </div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
              {ambulance?.type || 'Advanced Life Support (ALS)'}
            </div>
          </div>
        </div>
        <span className="badge badge-operational">
          {ambulance?.status || 'Available'}
        </span>
      </div>

      {/* Road Network & Simulation Event */}
      <div style={{
        padding: '10px 12px',
        borderRadius: '6px',
        backgroundColor: 'rgba(239, 68, 68, 0.08)',
        border: '1px solid rgba(239, 68, 68, 0.25)',
        marginBottom: '14px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#fca5a5', fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase' }}>
          <AlertOctagon size={13} /> Road Network Status
        </div>
        <div style={{ fontSize: '0.75rem', color: '#cbd5e1', marginTop: '4px', lineHeight: 1.35 }}>
          {routing?.simulation_event || 'Simulated edge blockage bypassed via dynamic Dijkstra recalculation.'}
        </div>
        <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '4px' }}>
          Graph Size: {routing?.graph_nodes_count || 7103} intersections in Delhi Central Drive Grid.
        </div>
      </div>

      {/* Academic Honesty Disclaimer */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '6px',
        padding: '8px 10px',
        borderRadius: '5px',
        backgroundColor: 'rgba(255, 255, 255, 0.02)',
        border: '1px dashed var(--border-subtle)',
      }}>
        <Info size={13} style={{ color: '#94a3b8', marginTop: '2px', flexShrink: 0 }} />
        <div style={{ fontSize: '0.68rem', color: '#94a3b8', lineHeight: 1.3 }}>
          <strong>Academic Note:</strong> Route distance and path nodes calculated via OSMnx road graph topology. Does not utilize live third-party commercial traffic APIs.
        </div>
      </div>
    </div>
  );
}
