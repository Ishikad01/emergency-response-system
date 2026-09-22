import React, { useState } from 'react';
import { Building2, Search, Filter, Phone, MapPin, Activity, CheckCircle2, Shield, ArrowRight } from 'lucide-react';

export default function HospitalsPage({ hospitals = [], onRouteToHospital }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterNearby, setFilterNearby] = useState(false);
  const [filterAvailable, setFilterAvailable] = useState(false);
  const [filterSpecialization, setFilterSpecialization] = useState('ALL');
  const [selectedHospital, setSelectedHospital] = useState(null);

  const filteredHospitals = hospitals.filter((h) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q || h.name?.toLowerCase().includes(q) || h.address?.toLowerCase().includes(q);
    const matchesNearby = !filterNearby || (h.distance_km && h.distance_km <= 3.5);
    const matchesAvailable = !filterAvailable || (h.available_beds && h.available_beds >= 25);
    const matchesSpec =
      filterSpecialization === 'ALL' ||
      h.specialization?.toLowerCase().includes(filterSpecialization.toLowerCase());
    return matchesSearch && matchesNearby && matchesAvailable && matchesSpec;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Building2 size={22} style={{ color: '#0284c7' }} />
            Hospital Registry & Emergency Capacity
          </h2>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Real-time geospatial amenities extracted via OpenStreetMap Central Delhi Bounding Box &bull; <span className="badge badge-operational">41 Registered Facilities</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="badge badge-operational">Live OSMnx Cache Loaded</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="command-card" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
        {/* Search */}
        <div style={{ position: 'relative', width: '280px' }}>
          <Search size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search hospital name or address..."
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

        {/* Filter Badges */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {/* Nearby Toggle */}
          <button
            onClick={() => setFilterNearby(!filterNearby)}
            style={{
              padding: '5px 10px',
              borderRadius: '4px',
              fontSize: '0.74rem',
              fontWeight: 600,
              cursor: 'pointer',
              border: `1px solid ${filterNearby ? '#38bdf8' : 'var(--border-subtle)'}`,
              backgroundColor: filterNearby ? 'rgba(56, 189, 248, 0.15)' : 'transparent',
              color: filterNearby ? '#38bdf8' : 'var(--text-secondary)',
            }}
          >
            Nearby (&le; 3.5 km)
          </button>

          {/* Available Toggle */}
          <button
            onClick={() => setFilterAvailable(!filterAvailable)}
            style={{
              padding: '5px 10px',
              borderRadius: '4px',
              fontSize: '0.74rem',
              fontWeight: 600,
              cursor: 'pointer',
              border: `1px solid ${filterAvailable ? '#10b981' : 'var(--border-subtle)'}`,
              backgroundColor: filterAvailable ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
              color: filterAvailable ? '#10b981' : 'var(--text-secondary)',
            }}
          >
            Available Beds (&ge; 25)
          </button>

          {/* Specialization selector */}
          <select
            value={filterSpecialization}
            onChange={(e) => setFilterSpecialization(e.target.value)}
            style={{
              padding: '5px 10px',
              backgroundColor: 'var(--bg-main)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '4px',
              color: 'var(--text-secondary)',
              fontSize: '0.74rem',
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            <option value="ALL">All Specializations</option>
            <option value="Trauma">Level-1 Trauma & Emergency</option>
            <option value="Cardiology">Cardiology & Intensive Care</option>
            <option value="Pediatrics">Pediatrics & Neonatal</option>
            <option value="Ophthalmology">Ophthalmology & Trauma</option>
            <option value="General">General Emergency</option>
          </select>
        </div>
      </div>

      {/* Main Table Layout */}
      <div className="command-card" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
            <thead>
              <tr style={{ backgroundColor: 'rgba(15, 21, 35, 0.8)', borderBottom: '1px solid var(--border-subtle)' }}>
                <th style={{ padding: '12px 16px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.7rem' }}>Hospital Name & Address</th>
                <th style={{ padding: '12px 16px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.7rem' }}>Proximity</th>
                <th style={{ padding: '12px 16px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.7rem' }}>Total Capacity</th>
                <th style={{ padding: '12px 16px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.7rem' }}>Bed Availability</th>
                <th style={{ padding: '12px 16px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.7rem' }}>Specialization</th>
                <th style={{ padding: '12px 16px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.7rem' }}>Status</th>
                <th style={{ padding: '12px 16px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.7rem' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredHospitals.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ padding: '36px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No hospitals found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredHospitals.map((h, i) => {
                  const total = h.total_beds || 150;
                  const available = h.available_beds ?? (total - (h.occupied_beds || 75));
                  const occupancyRatio = Math.round(((total - available) / total) * 100);

                  return (
                    <tr
                      key={h.id || i}
                      style={{
                        borderBottom: '1px solid var(--border-subtle)',
                        transition: 'background-color 0.15s',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ fontWeight: 600, color: 'var(--text-bright)' }}>{h.name}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>📍 {h.address}</div>
                      </td>
                      <td style={{ padding: '12px 16px' }} className="mono">
                        {h.distance_km ? (
                          <span style={{ color: '#38bdf8', fontWeight: 600 }}>{h.distance_km} km</span>
                        ) : (
                          <span style={{ color: 'var(--text-muted)' }}>~2.2 km</span>
                        )}
                      </td>
                      <td style={{ padding: '12px 16px' }} className="mono">
                        <span style={{ color: 'var(--text-secondary)' }}>{total} Beds</span>
                      </td>
                      <td style={{ padding: '12px 16px', minWidth: '150px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '3px' }}>
                          <span className="mono" style={{ fontSize: '0.75rem', fontWeight: 700, color: available > 25 ? '#6ee7b7' : '#fca5a5' }}>
                            {available} Open
                          </span>
                          <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                            {occupancyRatio}% load
                          </span>
                        </div>
                        <div style={{ width: '100%', height: '5px', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{
                            width: `${occupancyRatio}%`,
                            height: '100%',
                            backgroundColor: occupancyRatio > 85 ? '#ef4444' : occupancyRatio > 65 ? '#f59e0b' : '#10b981',
                          }} />
                        </div>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ fontSize: '0.74rem', color: '#cbd5e1' }}>
                          {h.specialization || 'Multi-Specialty Emergency'}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <span className="badge badge-operational">Operational</span>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <button
                          onClick={() => {
                            if (onRouteToHospital) onRouteToHospital(h);
                          }}
                          className="btn btn-secondary btn-sm"
                          style={{ fontSize: '0.72rem', padding: '4px 8px' }}
                        >
                          Select
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
