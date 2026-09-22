import React from 'react';
import {
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend
} from 'recharts';
import { BarChart3, PieChart as PieIcon, Activity, Clock, ShieldCheck, Info } from 'lucide-react';
import { INITIAL_ANALYTICS } from '../data/mockData';

export default function AnalyticsPage() {
  const { casesByType, casesBySeverity, responseTimeDistribution, fleetUtilization, hospitalSelectionFrequency } = INITIAL_ANALYTICS;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <BarChart3 size={22} style={{ color: '#38bdf8' }} />
            Operational Telemetry & Performance Analytics
          </h2>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Empirical metrics across emergency triage, routing transit distributions, and resource loading.
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span className="badge badge-demo">Prototype / Demo Dataset</span>
        </div>
      </div>

      {/* Academic Disclaimer Alert */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '12px 16px',
        borderRadius: '6px',
        backgroundColor: 'rgba(56, 189, 248, 0.08)',
        border: '1px solid rgba(56, 189, 248, 0.25)',
        fontSize: '0.76rem',
        color: '#bae6fd',
      }}>
        <Info size={16} style={{ color: '#38bdf8', flexShrink: 0 }} />
        <span>
          <strong>Academic Honesty Notice:</strong> The analytics visualizers below render controlled simulation datasets designed for the mid-term viva evaluation. They demonstrate the reporting architecture that will ingest real telemetry logs in the production deployment.
        </span>
      </div>

      {/* Row 1: Cases by Type & Cases by Severity */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Cases by Emergency Type */}
        <div className="command-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Activity size={16} style={{ color: '#ef4444' }} />
              <h3 style={{ fontSize: '0.92rem', fontWeight: 600 }}>Emergency Incidents by Category</h3>
            </div>
            <span className="badge badge-demo">Sample: 100 cases</span>
          </div>

          <div style={{ height: '240px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={casesByType} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} interval={0} angle={-15} textAnchor="end" />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#131b2e', borderColor: '#2b3b5f', color: '#f1f5f9', fontSize: '12px' }}
                />
                <Bar dataKey="value" name="Cases" fill="#38bdf8" radius={[4, 4, 0, 0]}>
                  {casesByType.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color || '#38bdf8'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Cases by Severity Pie */}
        <div className="command-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <PieIcon size={16} style={{ color: '#f59e0b' }} />
              <h3 style={{ fontSize: '0.92rem', fontWeight: 600 }}>Triage Severity Distribution</h3>
            </div>
            <span className="badge badge-demo">Sample: 100 cases</span>
          </div>

          <div style={{ height: '240px', width: '100%', display: 'flex', alignItems: 'center' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={casesBySeverity}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {casesBySeverity.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#131b2e', borderColor: '#2b3b5f', color: '#f1f5f9', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 2: Response Time Distribution & Hospital Frequency */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Response Time Distribution */}
        <div className="command-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={16} style={{ color: '#10b981' }} />
              <h3 style={{ fontSize: '0.92rem', fontWeight: 600 }}>Response Time Distribution (Minutes)</h3>
            </div>
            <span className="badge badge-demo">Dijkstra Routing</span>
          </div>

          <div style={{ height: '240px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={responseTimeDistribution} margin={{ top: 10, right: 10, left: -20, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="range" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#131b2e', borderColor: '#2b3b5f', color: '#f1f5f9', fontSize: '12px' }}
                />
                <Bar dataKey="cases" name="Incidents" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Hospital Selection Frequency */}
        <div className="command-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={16} style={{ color: '#60a5fa' }} />
              <h3 style={{ fontSize: '0.92rem', fontWeight: 600 }}>Facility Allocation Frequency</h3>
            </div>
            <span className="badge badge-demo">Multi-Objective Solves</span>
          </div>

          <div style={{ height: '240px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hospitalSelectionFrequency} layout="vertical" margin={{ top: 10, right: 20, left: 40, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis type="number" stroke="#64748b" fontSize={11} />
                <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={11} width={110} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#131b2e', borderColor: '#2b3b5f', color: '#f1f5f9', fontSize: '12px' }}
                />
                <Bar dataKey="dispatches" name="Allocations" fill="#3b82f6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
