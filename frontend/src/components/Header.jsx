import React, { useState, useEffect } from 'react';
import { ShieldAlert, Clock, User, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

export default function Header({ backendStatus, onRefreshTelemetry }) {
  const [timeStr, setTimeStr] = useState('');
  const [dateStr, setDateStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setDateStr(now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header style={{
      height: '64px',
      backgroundColor: 'var(--bg-sidebar)',
      borderBottom: '1px solid var(--border-subtle)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      zIndex: 10,
    }}>
      {/* Left Title & Status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.05rem', fontWeight: 700, letterSpacing: '-0.01em', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldAlert size={20} style={{ color: '#ef4444' }} />
            Emergency Response Command Center
          </h1>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            Delhi-NCR Dispatch Grid &bull; OSMnx Multi-Objective Resource Optimizer
          </div>
        </div>

        {/* Global Operational Badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 10px',
          borderRadius: '20px',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          marginLeft: '12px',
        }}>
          <span style={{
            width: '7px',
            height: '7px',
            borderRadius: '50%',
            backgroundColor: '#10b981',
            boxShadow: '0 0 6px #10b981',
          }} />
          <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#6ee7b7', letterSpacing: '0.04em' }}>
            GRID ACTIVE
          </span>
        </div>
      </div>

      {/* Right Controls, Clock, Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        {/* Refresh Telemetry */}
        <button
          onClick={onRefreshTelemetry}
          title="Refresh live system telemetry"
          style={{
            background: 'transparent',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-secondary)',
            padding: '6px 10px',
            borderRadius: '6px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.75rem',
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-bright)'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
        >
          <RefreshCw size={13} />
          <span>Sync</span>
        </button>

        {/* Live Clock */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '5px 12px',
          backgroundColor: 'rgba(0, 0, 0, 0.25)',
          borderRadius: '6px',
          border: '1px solid var(--border-subtle)',
        }}>
          <Clock size={14} style={{ color: 'var(--text-muted)' }} />
          <div style={{ textAlign: 'right' }}>
            <div className="mono" style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-bright)' }}>
              {timeStr || '00:00:00'}
            </div>
            <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>
              {dateStr || 'Local Time'}
            </div>
          </div>
        </div>

        {/* User / Operator Profile Placeholder */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          paddingLeft: '12px',
          borderLeft: '1px solid var(--border-subtle)',
        }}>
          <div style={{
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            backgroundColor: 'rgba(59, 130, 246, 0.15)',
            border: '1px solid rgba(59, 130, 246, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#60a5fa',
          }}>
            <User size={18} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-bright)', lineHeight: 1.2 }}>
              Officer I. Duggal
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
              <span className="badge badge-demo" style={{ fontSize: '0.6rem', padding: '1px 4px' }}>
                WATCH COMMANDER &bull; DEMO
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
