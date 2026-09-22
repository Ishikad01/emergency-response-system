import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import {
  Navigation,
  Eye,
  EyeOff,
  Crosshair,
  RotateCcw,
  Maximize2,
  Layers,
  MapPin,
  Hospital as HospitalIcon,
  Shield,
  AlertTriangle,
} from 'lucide-react';
import RouteAnalysisCard from '../components/RouteAnalysisCard';

export default function MapRoutingPage({
  hospitals = [],
  ambulances = [],
  activeEmergency,
  routeData,
  onMapClickLocation,
  onClearRoute,
  onTriggerRouting,
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);

  // Layer toggles
  const [showHospitals, setShowHospitals] = useState(true);
  const [showAmbulances, setShowAmbulances] = useState(true);

  // Leaflet Layer Groups
  const hospitalLayerGroupRef = useRef(L.layerGroup());
  const ambulanceLayerGroupRef = useRef(L.layerGroup());
  const routeLayerGroupRef = useRef(L.layerGroup());
  const incidentMarkerRef = useRef(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Centered at Central Delhi (Connaught Place / India Gate corridor)
    const map = L.map(mapContainerRef.current, {
      zoomControl: false,
    }).setView([28.6280, 77.2200], 13);

    // Zoom control in top-right
    L.control.zoom({ position: 'topright' }).addTo(map);

    // High quality OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    hospitalLayerGroupRef.current.addTo(map);
    ambulanceLayerGroupRef.current.addTo(map);
    routeLayerGroupRef.current.addTo(map);

    // Click handler to pin incident or trigger routing
    map.on('click', (e) => {
      if (onMapClickLocation) {
        onMapClickLocation(e.latlng.lat, e.latlng.lng);
      }
    });

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Hospital Markers
  useEffect(() => {
    const layer = hospitalLayerGroupRef.current;
    layer.clearLayers();
    if (!showHospitals || !hospitals) return;

    hospitals.forEach((h) => {
      if (!h.latitude || !h.longitude) return;

      const hospitalIcon = L.divIcon({
        className: 'custom-hospital-icon',
        html: `
          <div style="
            width: 26px; height: 26px;
            background: #0284c7;
            border: 2px solid #ffffff;
            border-radius: 6px;
            display: flex; align-items: center; justify-content: center;
            color: white; font-weight: bold; font-size: 14px;
            box-shadow: 0 3px 8px rgba(0,0,0,0.5);
          ">+</div>
        `,
        iconSize: [26, 26],
        iconAnchor: [13, 13],
      });

      const marker = L.marker([h.latitude, h.longitude], { icon: hospitalIcon });
      marker.bindPopup(`
        <div style="font-family: inherit; font-size: 12px; line-height: 1.4;">
          <strong style="color: #38bdf8; font-size: 13px;">${h.name}</strong><br/>
          <span style="color: #94a3b8;">${h.address}</span><br/>
          <div style="margin-top: 6px; display: flex; gap: 8px;">
            <span style="background: rgba(16,185,129,0.2); color: #10b981; padding: 2px 6px; border-radius: 3px; font-weight: 600;">
              ${h.available_beds ?? 50} Beds Available
            </span>
            ${h.distance_km ? `<span style="color: #f59e0b; font-weight: 600;">${h.distance_km} km</span>` : ''}
          </div>
          <div style="margin-top: 4px; color: #a855f7; font-size: 11px;">
            ${h.specialization || 'Multi-Specialty'}
          </div>
        </div>
      `);
      layer.addLayer(marker);
    });
  }, [hospitals, showHospitals]);

  // Update Ambulance Markers
  useEffect(() => {
    const layer = ambulanceLayerGroupRef.current;
    layer.clearLayers();
    if (!showAmbulances || !ambulances) return;

    ambulances.forEach((a) => {
      if (!a.latitude || !a.longitude) return;

      const isAvailable = a.status === 'Available';
      const bgColor = isAvailable ? '#10b981' : '#f59e0b';

      const ambIcon = L.divIcon({
        className: 'custom-amb-icon',
        html: `
          <div style="
            width: 28px; height: 28px;
            background: ${bgColor};
            border: 2px solid #ffffff;
            border-radius: 50%;
            display: flex; align-items: center; justify-content: center;
            color: #0b111e; font-weight: bold; font-size: 11px;
            box-shadow: 0 3px 8px rgba(0,0,0,0.5);
          ">🚑</div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      const marker = L.marker([a.latitude, a.longitude], { icon: ambIcon });
      marker.bindPopup(`
        <div style="font-family: inherit; font-size: 12px; line-height: 1.4;">
          <strong style="color: ${bgColor}; font-size: 13px;">${a.id} &bull; ${a.callsign}</strong><br/>
          <span style="color: #cbd5e1;">Base: ${a.base_station}</span><br/>
          <div style="margin-top: 6px;">
            <span style="background: rgba(255,255,255,0.1); color: white; padding: 2px 6px; border-radius: 3px;">
              ${a.type}
            </span>
          </div>
          <div style="margin-top: 4px; font-weight: 600; color: ${isAvailable ? '#10b981' : '#fcd34d'};">
            Status: ${a.status} (Fuel: ${a.fuel_level || 90}%)
          </div>
        </div>
      `);
      layer.addLayer(marker);
    });
  }, [ambulances, showAmbulances]);

  // Update Incident & Route Polyline
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const routeLayer = routeLayerGroupRef.current;
    routeLayer.clearLayers();

    // 1. Plot Incident Marker
    if (activeEmergency && activeEmergency.latitude && activeEmergency.longitude) {
      if (incidentMarkerRef.current) {
        map.removeLayer(incidentMarkerRef.current);
      }

      const incidentIcon = L.divIcon({
        className: 'custom-pin-pulse',
        html: `
          <div style="
            width: 32px; height: 32px;
            background: #ef4444;
            border: 3px solid #ffffff;
            border-radius: 50%;
            display: flex; align-items: center; justify-content: center;
            color: white; font-weight: bold; font-size: 15px;
            box-shadow: 0 4px 12px rgba(239,68,68,0.7);
          ">⚠️</div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const marker = L.marker([activeEmergency.latitude, activeEmergency.longitude], {
        icon: incidentIcon,
        zIndexOffset: 1000,
      }).addTo(map);

      marker.bindPopup(`
        <div style="font-family: inherit; font-size: 12px;">
          <strong style="color: #ef4444; font-size: 13px;">🚨 Active Emergency</strong><br/>
          <span>${activeEmergency.title || activeEmergency.location}</span><br/>
          <span style="color: #f87171; font-weight: 600;">Severity: ${activeEmergency.severity}</span>
        </div>
      `).openPopup();

      incidentMarkerRef.current = marker;
    }

    // 2. Draw Polyline Route if available
    const pathCoords = routeData?.routing_details?.path_coordinates || routeData?.path_coordinates;
    const blockedCoords = routeData?.routing_details?.blocked_segment_coordinates;
    const hospitalCoords = routeData?.assigned_hospital;

    const allRoutePoints = [];

    if (pathCoords && pathCoords.length > 0) {
      // Primary Dynamic Route (Glowing Cyan Line)
      const primaryPolyline = L.polyline(pathCoords, {
        color: '#00e5ff',
        weight: 5,
        opacity: 0.9,
        lineCap: 'round',
        lineJoin: 'round',
      });
      primaryPolyline.bindPopup('<b>Dynamic Rescue Route</b><br/>Computed via NetworkX Dijkstra with simulated blockage bypass');
      routeLayer.addLayer(primaryPolyline);
      allRoutePoints.push(...pathCoords);

      // Pulse Glow backing line
      const glowPolyline = L.polyline(pathCoords, {
        color: '#38bdf8',
        weight: 10,
        opacity: 0.25,
      });
      routeLayer.addLayer(glowPolyline);
    }

    // 3. Draw Blocked Road Segment (Red Dashed Line)
    if (blockedCoords && blockedCoords.length === 2) {
      const blockedLine = L.polyline(blockedCoords, {
        color: '#ef4444',
        weight: 6,
        dashArray: '8, 8',
        opacity: 0.95,
      });
      blockedLine.bindPopup('<b>Simulated Road Obstacle</b><br/>Primary segment blocked; dynamic reroute active');
      routeLayer.addLayer(blockedLine);
      allRoutePoints.push(...blockedCoords);
    }

    // 4. Fit bounds if route exists
    if (allRoutePoints.length > 0) {
      map.fitBounds(L.latLngBounds(allRoutePoints), { padding: [50, 50] });
    }
  }, [activeEmergency, routeData]);

  // Actions
  const handleResetMap = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([28.6280, 77.2200], 13);
    }
  };

  const handleLocateEmergency = () => {
    if (mapInstanceRef.current && activeEmergency?.latitude) {
      mapInstanceRef.current.setView([activeEmergency.latitude, activeEmergency.longitude], 15);
    }
  };

  const handleFitRoute = () => {
    const pathCoords = routeData?.routing_details?.path_coordinates || routeData?.path_coordinates;
    if (mapInstanceRef.current && pathCoords && pathCoords.length > 0) {
      mapInstanceRef.current.fitBounds(L.latLngBounds(pathCoords), { padding: [50, 50] });
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '20px', height: 'calc(100vh - 110px)' }}>
      {/* Map Viewport Area */}
      <div style={{
        position: 'relative',
        borderRadius: '8px',
        overflow: 'hidden',
        border: '1px solid var(--border-active)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Floating Map Controls Toolbar */}
        <div style={{
          position: 'absolute',
          top: '14px',
          left: '14px',
          zIndex: 1000,
          display: 'flex',
          gap: '8px',
          backgroundColor: 'rgba(15, 23, 42, 0.88)',
          backdropFilter: 'blur(6px)',
          padding: '6px 8px',
          borderRadius: '6px',
          border: '1px solid var(--border-subtle)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
        }}>
          {/* Toggle Hospitals */}
          <button
            onClick={() => setShowHospitals(!showHospitals)}
            style={{
              background: showHospitals ? 'rgba(2, 132, 199, 0.25)' : 'transparent',
              border: `1px solid ${showHospitals ? '#0284c7' : 'transparent'}`,
              color: showHospitals ? '#38bdf8' : 'var(--text-muted)',
              padding: '6px 10px',
              borderRadius: '4px',
              fontSize: '0.74rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
            title="Toggle OpenStreetMap Hospitals"
          >
            {showHospitals ? <Eye size={13} /> : <EyeOff size={13} />}
            <span>Hospitals ({hospitals.length || 41})</span>
          </button>

          {/* Toggle Ambulances */}
          <button
            onClick={() => setShowAmbulances(!showAmbulances)}
            style={{
              background: showAmbulances ? 'rgba(16, 185, 129, 0.25)' : 'transparent',
              border: `1px solid ${showAmbulances ? '#10b981' : 'transparent'}`,
              color: showAmbulances ? '#6ee7b7' : 'var(--text-muted)',
              padding: '6px 10px',
              borderRadius: '4px',
              fontSize: '0.74rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
            title="Toggle Ambulance Fleet"
          >
            {showAmbulances ? <Eye size={13} /> : <EyeOff size={13} />}
            <span>Fleet ({ambulances.length || 12})</span>
          </button>

          {/* Locate Emergency */}
          {activeEmergency && (
            <button
              onClick={handleLocateEmergency}
              style={{
                background: 'rgba(239, 68, 68, 0.2)',
                border: '1px solid rgba(239, 68, 68, 0.5)',
                color: '#fca5a5',
                padding: '6px 10px',
                borderRadius: '4px',
                fontSize: '0.74rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
              title="Center on active incident"
            >
              <Crosshair size={13} />
              <span>Locate Incident</span>
            </button>
          )}

          {/* Fit Route */}
          {routeData && (
            <button
              onClick={handleFitRoute}
              style={{
                background: 'rgba(56, 189, 248, 0.2)',
                border: '1px solid rgba(56, 189, 248, 0.5)',
                color: '#7dd3fc',
                padding: '6px 10px',
                borderRadius: '4px',
                fontSize: '0.74rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
              title="Fit entire route bounds"
            >
              <Maximize2 size={13} />
              <span>Fit Route</span>
            </button>
          )}

          {/* Reset Map */}
          <button
            onClick={handleResetMap}
            style={{
              background: 'transparent',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-secondary)',
              padding: '6px 10px',
              borderRadius: '4px',
              fontSize: '0.74rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
            title="Reset map view to Central Delhi"
          >
            <RotateCcw size={13} />
            <span>Reset</span>
          </button>
        </div>

        {/* Map Container DOM */}
        <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />

        {/* Professional Map Legend (Bottom-Left) */}
        <div style={{
          position: 'absolute',
          bottom: '16px',
          left: '16px',
          zIndex: 1000,
          backgroundColor: 'rgba(15, 23, 42, 0.92)',
          backdropFilter: 'blur(8px)',
          padding: '10px 14px',
          borderRadius: '6px',
          border: '1px solid var(--border-subtle)',
          boxShadow: '0 4px 14px rgba(0,0,0,0.6)',
          fontSize: '0.72rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
        }}>
          <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Map Topology Legend
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#ef4444', fontSize: '13px' }}>●</span>
            <span style={{ color: 'var(--text-bright)' }}>Emergency Incident Pin</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#0284c7', fontSize: '13px' }}>●</span>
            <span style={{ color: 'var(--text-bright)' }}>OSM Hospital (41 in Delhi Grid)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#10b981', fontSize: '13px' }}>●</span>
            <span style={{ color: 'var(--text-bright)' }}>Emergency Ambulance</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ display: 'inline-block', width: '14px', height: '3px', backgroundColor: '#00e5ff', borderRadius: '2px' }} />
            <span style={{ color: '#38bdf8', fontWeight: 600 }}>Selected Primary Route</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ display: 'inline-block', width: '14px', height: '3px', borderTop: '2px dashed #ef4444' }} />
            <span style={{ color: '#f87171' }}>Simulated Blocked Road Segment</span>
          </div>
        </div>

        {/* Map Click Hint (Bottom-Right) */}
        <div style={{
          position: 'absolute',
          bottom: '16px',
          right: '16px',
          zIndex: 1000,
          backgroundColor: 'rgba(0, 0, 0, 0.65)',
          padding: '4px 10px',
          borderRadius: '4px',
          fontSize: '0.68rem',
          color: 'var(--text-muted)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
        }}>
          💡 Click anywhere on map to set custom incident
        </div>
      </div>

      {/* Right Column: Route Analysis Side Panel */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto' }}>
        <RouteAnalysisCard
          routeData={routeData}
          selectedHospital={routeData?.assigned_hospital}
          selectedAmbulance={routeData?.assigned_ambulance}
          onClearRoute={onClearRoute}
        />

        {/* Quick Route Optimizer Trigger */}
        <div className="command-card" style={{ padding: '14px' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-bright)', marginBottom: '8px' }}>
            Rapid Graph Routing Dispatch
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '12px', lineHeight: 1.4 }}>
            Clicking below executes Dijkstra shortest path routing from Janpath Station to Connaught Place Circle with automatic road blockage recalculation.
          </div>
          <button
            onClick={() => onTriggerRouting(28.6139, 77.2090, 28.6315, 77.2167)}
            className="btn btn-primary"
            style={{ width: '100%', fontSize: '0.8rem', padding: '9px' }}
          >
            <Navigation size={14} />
            <span>Recalculate Optimal Route</span>
          </button>
        </div>
      </div>
    </div>
  );
}
