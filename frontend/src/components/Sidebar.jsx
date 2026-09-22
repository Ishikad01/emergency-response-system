import React from 'react';
import {
  LayoutDashboard,
  AlertTriangle,
  MapPin,
  Building2,
  Ambulance,
  BarChart3,
  Cpu,
  Bot,
  Activity,
  Radio,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'requests', label: 'Emergency Requests', icon: AlertTriangle, badge: '3' },
  { id: 'map', label: 'Map & Routing', icon: MapPin, highlight: true },
  { id: 'hospitals', label: 'Hospitals', icon: Building2, count: '41' },
  { id: 'resources', label: 'Resources', icon: Ambulance, count: '12' },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'optimization', label: 'Resource Optimization', icon: Cpu, tag: 'Dev' },
  { id: 'copilot', label: 'Emergency Copilot', icon: Bot, tag: 'AI' },
  { id: 'system', label: 'System Status', icon: Activity },
];

export default function Sidebar({ activeTab, setActiveTab, backendStatus, onNewEmergencyClick }) {
  return (
    <aside style={{
      width: '280px',
      minWidth: '280px',
      backgroundColor: 'var(--bg-sidebar)',
      borderRight: '1px solid var(--border-subtle)',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      zIndex: 20,
    }}>
      {/* Brand Header */}
      <div style={{
        padding: '20px 18px',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
      }}>
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '8px',
          backgroundColor: 'rgba(239, 68, 68, 0.15)',
          border: '1px solid rgba(239, 68, 68, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ef4444',
        }}>
          <Radio size={22} className="pulse-red" />
        </div>
        <div>
          <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-bright)', letterSpacing: '0.01em' }}>
            EMERGENCY OPS
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 500 }}>
            COMMAND CENTER v1.0
          </div>
        </div>
      </div>

      {/* Quick Action Button */}
      <div style={{ padding: '14px 16px' }}>
        <button
          onClick={onNewEmergencyClick}
          className="btn btn-primary"
          style={{ width: '100%', padding: '10px 14px', fontSize: '0.85rem' }}
        >
          <AlertTriangle size={16} />
          <span>New Emergency Request</span>
        </button>
      </div>

      {/* Navigation List */}
      <nav style={{ flex: 1, overflowY: 'auto', padding: '6px 12px' }}>
        <div style={{
          fontSize: '0.68rem',
          textTransform: 'uppercase',
          color: 'var(--text-muted)',
          letterSpacing: '0.08em',
          fontWeight: 600,
          padding: '8px 8px 6px',
        }}>
          Operations Menu
        </div>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 12px',
                marginBottom: '3px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: isActive ? 'rgba(59, 130, 246, 0.14)' : 'transparent',
                color: isActive ? '#60a5fa' : 'var(--text-secondary)',
                fontWeight: isActive ? 600 : 500,
                fontSize: '0.86rem',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s ease',
                borderLeft: isActive ? '3px solid #3b82f6' : '3px solid transparent',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.04)';
                  e.currentTarget.style.color = 'var(--text-bright)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }
              }}
            >
              <Icon size={18} style={{ color: isActive ? '#60a5fa' : 'var(--text-muted)' }} />
              <span style={{ flex: 1 }}>{item.label}</span>
              
              {item.badge && (
                <span className="badge badge-critical" style={{ fontSize: '0.65rem', padding: '1px 6px' }}>
                  {item.badge}
                </span>
              )}
              {item.count && (
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                  {item.count}
                </span>
              )}
              {item.tag && (
                <span className={item.tag === 'Dev' ? 'badge badge-dev' : 'badge badge-planned'} style={{ fontSize: '0.62rem', padding: '1px 5px' }}>
                  {item.tag}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer / System Status */}
      <div style={{
        padding: '16px',
        borderTop: '1px solid var(--border-subtle)',
        backgroundColor: 'rgba(10, 14, 24, 0.6)',
      }}>
        {/* Project Branding */}
        <div style={{ marginBottom: '10px' }}>
          <div style={{ fontSize: '0.74rem', fontWeight: 600, color: 'var(--text-bright)', lineHeight: 1.3 }}>
            AI Emergency Response System
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
            <span className="badge badge-demo">Mid-Term Prototype</span>
            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>B.Tech Viva</span>
          </div>
        </div>

        {/* Live Backend Connection Indicator */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 10px',
          borderRadius: '5px',
          backgroundColor: backendStatus === 'connected' ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)',
          border: `1px solid ${backendStatus === 'connected' ? 'rgba(16, 185, 129, 0.25)' : 'rgba(239, 68, 68, 0.25)'}`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {backendStatus === 'connected' ? (
              <CheckCircle2 size={14} style={{ color: '#10b981' }} />
            ) : (
              <XCircle size={14} style={{ color: '#ef4444' }} />
            )}
            <span style={{ fontSize: '0.72rem', fontWeight: 600, color: backendStatus === 'connected' ? '#6ee7b7' : '#fca5a5' }}>
              {backendStatus === 'connected' ? 'FastAPI :8000' : 'Backend Offline'}
            </span>
          </div>
          <span style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: backendStatus === 'connected' ? '#10b981' : '#ef4444',
            boxShadow: backendStatus === 'connected' ? '0 0 8px #10b981' : '0 0 8px #ef4444',
          }} />
        </div>
      </div>
    </aside>
  );
}
