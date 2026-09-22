import React, { useState, useMemo } from 'react';
import { Cpu, Sliders, Layers, CheckCircle2, AlertCircle, ArrowRight, Activity, Sparkles } from 'lucide-react';
import { OPTIMIZATION_FACTORS } from '../data/mockData';

export default function OptimizationVisualizer({ hospitals = [] }) {
  const [weightDistance, setWeightDistance] = useState(0.7);
  const [weightCongestion, setWeightCongestion] = useState(3.0);
  const [selectedUrgency, setSelectedUrgency] = useState('Critical');

  // Interactive Live Scoring based on user-adjusted weights (re-ranks OSM hospitals)
  const rankedHospitals = useMemo(() => {
    if (!hospitals || hospitals.length === 0) return [];

    const urgencyMultiplier = selectedUrgency === 'Critical' ? 1.5 : selectedUrgency === 'High' ? 1.2 : 1.0;

    return hospitals.slice(0, 8).map((h) => {
      const dist = h.distance_km || 2.5;
      const totalBeds = h.total_beds || 150;
      const occupiedBeds = h.occupied_beds || 75;
      const congestionRatio = occupiedBeds / totalBeds;
      
      const score = (dist * weightDistance) + (congestionRatio * weightCongestion * urgencyMultiplier);
      return {
        ...h,
        calculatedScore: score.toFixed(3),
        congestionPercent: Math.round(congestionRatio * 100),
      };
    }).sort((a, b) => Number(a.calculatedScore) - Number(b.calculatedScore));
  }, [hospitals, weightDistance, weightCongestion, selectedUrgency]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Banner */}
      <div className="command-card" style={{
        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%)',
        border: '1px solid #334155',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '10px',
            backgroundColor: 'rgba(168, 85, 247, 0.15)',
            border: '1px solid rgba(168, 85, 247, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#c084fc',
          }}>
            <Cpu size={24} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Resource Optimization Engine</h2>
              <span className="badge badge-dev">Optimization Engine &bull; Development Phase</span>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Multi-objective cost formulation balancing response distance, hospital bed availability, and incident severity.
            </div>
          </div>
        </div>

        <div style={{
          padding: '8px 14px',
          borderRadius: '6px',
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          border: '1px solid var(--border-subtle)',
          textAlign: 'right',
        }}>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Current Backend Formulation</div>
          <div className="mono" style={{ fontSize: '0.85rem', color: '#38bdf8', fontWeight: 600 }}>
            Score = (d &times; 0.7) + (load &times; 3.0)
          </div>
        </div>
      </div>

      {/* Grid: Mathematical Model & Interactive Simulation */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Left Column: Factor Breakdown */}
        <div className="command-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Layers size={18} style={{ color: '#60a5fa' }} />
            <h3 style={{ fontSize: '0.98rem', fontWeight: 600 }}>Planned Multi-Objective Factors</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {OPTIMIZATION_FACTORS.map((factor) => (
              <div
                key={factor.id}
                style={{
                  padding: '12px 14px',
                  borderRadius: '6px',
                  backgroundColor: 'var(--bg-main)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-bright)' }}>
                    {factor.name}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span className="mono" style={{ fontSize: '0.75rem', color: '#38bdf8' }}>{factor.weight}</span>
                    <span className={factor.status.includes('Active') ? 'badge badge-operational' : 'badge badge-dev'} style={{ fontSize: '0.62rem' }}>
                      {factor.status.includes('Active') ? 'Active' : 'Dev'}
                    </span>
                  </div>
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', lineHeight: 1.35 }}>
                  {factor.description}
                </div>
              </div>
            ))}
          </div>

          <div style={{
            marginTop: '16px',
            padding: '12px',
            borderRadius: '6px',
            backgroundColor: 'rgba(56, 189, 248, 0.05)',
            border: '1px dashed rgba(56, 189, 248, 0.3)',
            fontSize: '0.73rem',
            color: '#94a3b8',
            lineHeight: 1.4,
          }}>
            <strong>Viva Architecture Note:</strong> For this mid-term prototype, the scoring equation in <code style={{ color: '#38bdf8' }}>hospitals.py</code> computes the weighted sum across real OpenStreetMap hospital nodes. The final phase will introduce a Pareto Multi-Objective Evolutionary Algorithm (NSGA-II) for dynamic fleet reallocation.
          </div>
        </div>

        {/* Right Column: Live Interactive Weight Tuning */}
        <div className="command-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sliders size={18} style={{ color: '#f59e0b' }} />
              <h3 style={{ fontSize: '0.98rem', fontWeight: 600 }}>Weight Parameter Tuning (Interactive)</h3>
            </div>
            <span className="badge badge-demo">Viva Simulator</span>
          </div>

          {/* Sliders */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '20px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '6px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Distance Penalty Weight (w₁)</span>
                <span className="mono" style={{ color: '#38bdf8', fontWeight: 700 }}>{weightDistance.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="2.0"
                step="0.05"
                value={weightDistance}
                onChange={(e) => setWeightDistance(parseFloat(e.target.value))}
                style={{ width: '100%', accentColor: '#38bdf8', cursor: 'pointer' }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '6px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Bed Congestion Ratio Weight (w₂)</span>
                <span className="mono" style={{ color: '#f59e0b', fontWeight: 700 }}>{weightCongestion.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="6.0"
                step="0.1"
                value={weightCongestion}
                onChange={(e) => setWeightCongestion(parseFloat(e.target.value))}
                style={{ width: '100%', accentColor: '#f59e0b', cursor: 'pointer' }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '6px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Emergency Severity Urgency Multiplier</span>
                <span className="mono" style={{ color: '#ec4899', fontWeight: 700 }}>{selectedUrgency}</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                {['Critical', 'High', 'Moderate'].map((urg) => (
                  <button
                    key={urg}
                    type="button"
                    onClick={() => setSelectedUrgency(urg)}
                    style={{
                      padding: '6px',
                      borderRadius: '5px',
                      border: '1px solid',
                      borderColor: selectedUrgency === urg ? '#ec4899' : 'var(--border-subtle)',
                      backgroundColor: selectedUrgency === urg ? 'rgba(236, 72, 153, 0.15)' : 'var(--bg-main)',
                      color: selectedUrgency === urg ? '#f472b6' : 'var(--text-secondary)',
                      fontSize: '0.74rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    {urg}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Dynamic Ranking Result */}
          <div>
            <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-bright)', marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>Dynamically Re-Ranked Facilities (Lowest Score = Best Choice):</span>
              <span className="mono" style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Top {rankedHospitals.length} evaluated</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '220px', overflowY: 'auto' }}>
              {rankedHospitals.map((h, rank) => (
                <div
                  key={h.id || rank}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    borderRadius: '5px',
                    backgroundColor: rank === 0 ? 'rgba(16, 185, 129, 0.12)' : 'var(--bg-main)',
                    border: `1px solid ${rank === 0 ? 'rgba(16, 185, 129, 0.4)' : 'var(--border-subtle)'}`,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      backgroundColor: rank === 0 ? '#10b981' : '#334155',
                      color: 'white',
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      {rank + 1}
                    </span>
                    <div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-bright)' }}>
                        {h.name}
                      </div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                        Dist: {h.distance_km || 2.5} km &bull; Load: {h.congestionPercent || 50}%
                      </div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span className="mono" style={{ fontSize: '0.85rem', fontWeight: 700, color: rank === 0 ? '#6ee7b7' : '#94a3b8' }}>
                      {h.calculatedScore}
                    </span>
                    {rank === 0 && (
                      <div style={{ fontSize: '0.62rem', color: '#10b981', fontWeight: 700 }}>OPTIMAL</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
