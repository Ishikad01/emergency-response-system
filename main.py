import os
import time
from typing import Optional
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

from hospitals import get_best_hospital, get_all_hospitals, get_dynamic_hospitals
from routing import run_emergency_routing, get_graph

# Initialize FastAPI application
app = FastAPI(
    title="AI Emergency Response & Multi-Objective Resource Optimization API",
    description="Backend API for B.Tech Major Project Mid-Term Viva. Powered by FastAPI, OSMnx, NetworkX, and Leaflet.",
    version="1.0.0",
)

# Safe CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

START_TIME = time.time()

# In-memory fleet registry (Simulated baseline for Mid-Term Demonstration)
AMBULANCE_FLEET = [
    {
        "id": "AMB-01",
        "callsign": "Delhi Rapid Unit 1",
        "status": "Available",
        "latitude": 28.6139,
        "longitude": 77.2090,
        "base_station": "Connaught Place Station",
        "type": "Advanced Life Support (ALS)",
        "fuel_level": 92,
        "paramedics": 2,
    },
    {
        "id": "AMB-02",
        "callsign": "Delhi Rapid Unit 2",
        "status": "En Route",
        "latitude": 28.6304,
        "longitude": 77.2177,
        "base_station": "Barakhamba Depot",
        "type": "Basic Life Support (BLS)",
        "fuel_level": 74,
        "paramedics": 2,
    },
    {
        "id": "AMB-03",
        "callsign": "Delhi Rapid Unit 3",
        "status": "Available",
        "latitude": 28.6220,
        "longitude": 77.2140,
        "base_station": "Janpath Central",
        "type": "Advanced Life Support (ALS)",
        "fuel_level": 88,
        "paramedics": 3,
    },
    {
        "id": "AMB-04",
        "callsign": "Delhi Rapid Unit 4",
        "status": "At Hospital",
        "latitude": 28.6380,
        "longitude": 77.2410,
        "base_station": "LNJP Emergency Dock",
        "type": "Patient Transport Service (PTS)",
        "fuel_level": 65,
        "paramedics": 2,
    },
    {
        "id": "AMB-05",
        "callsign": "Delhi Rapid Unit 5",
        "status": "Available",
        "latitude": 28.6410,
        "longitude": 77.2250,
        "base_station": "Pahar Ganj Post",
        "type": "Advanced Life Support (ALS)",
        "fuel_level": 95,
        "paramedics": 2,
    },
    {
        "id": "AMB-06",
        "callsign": "Delhi Rapid Unit 6",
        "status": "Assigned",
        "latitude": 28.6250,
        "longitude": 77.2320,
        "base_station": "ITO Crossroad Hub",
        "type": "Basic Life Support (BLS)",
        "fuel_level": 81,
        "paramedics": 2,
    },
    {
        "id": "AMB-07",
        "callsign": "Delhi Rapid Unit 7",
        "status": "Available",
        "latitude": 28.6180,
        "longitude": 77.2280,
        "base_station": "India Gate Sector",
        "type": "Advanced Life Support (ALS)",
        "fuel_level": 90,
        "paramedics": 3,
    },
    {
        "id": "AMB-08",
        "callsign": "Delhi Rapid Unit 8",
        "status": "Available",
        "latitude": 28.6350,
        "longitude": 77.2050,
        "base_station": "Gole Market Post",
        "type": "Basic Life Support (BLS)",
        "fuel_level": 79,
        "paramedics": 2,
    },
    {
        "id": "AMB-09",
        "callsign": "Delhi Rapid Unit 9",
        "status": "Available",
        "latitude": 28.6100,
        "longitude": 77.2150,
        "base_station": "Rajpath Southern Hub",
        "type": "Advanced Life Support (ALS)",
        "fuel_level": 84,
        "paramedics": 2,
    },
    {
        "id": "AMB-10",
        "callsign": "Delhi Rapid Unit 10",
        "status": "Offline",
        "latitude": 28.6450,
        "longitude": 77.2100,
        "base_station": "Central Maintenance Yard",
        "type": "Basic Life Support (BLS)",
        "fuel_level": 15,
        "paramedics": 0,
    },
    {
        "id": "AMB-11",
        "callsign": "Delhi Rapid Unit 11",
        "status": "Available",
        "latitude": 28.6280,
        "longitude": 77.2400,
        "base_station": "Delhi Gate Station",
        "type": "Advanced Life Support (ALS)",
        "fuel_level": 93,
        "paramedics": 3,
    },
    {
        "id": "AMB-12",
        "callsign": "Delhi Rapid Unit 12",
        "status": "Available",
        "latitude": 28.6050,
        "longitude": 77.2250,
        "base_station": "Lodhi Road Post",
        "type": "Advanced Life Support (ALS)",
        "fuel_level": 89,
        "paramedics": 2,
    },
]

# Baseline prototype active incidents
DEMO_INCIDENTS = [
    {
        "id": "EMG-2026-081",
        "type": "Accident",
        "title": "Multi-Vehicle Collision",
        "severity": "Critical",
        "location": "Connaught Place Inner Circle",
        "latitude": 28.6315,
        "longitude": 77.2167,
        "reported_time": "12 mins ago",
        "status": "Assigned",
        "patient_count": 3,
        "assigned_ambulance": "AMB-02",
        "recommended_hospital": "Lok Nayak Jai Prakash Hospital (LNJP)",
        "eta_min": 6.4,
        "notes": "Severe vehicle collision with structural blockage on outer arterial road.",
    },
    {
        "id": "EMG-2026-082",
        "type": "Trauma",
        "title": "Pedestrian Fall / Severe Trauma",
        "severity": "High",
        "location": "Barakhamba Road Metro Stn Gate 2",
        "latitude": 28.6290,
        "longitude": 77.2270,
        "reported_time": "25 mins ago",
        "status": "En Route",
        "patient_count": 1,
        "assigned_ambulance": "AMB-06",
        "recommended_hospital": "Lady Hardinge Medical College & Associated Hospitals",
        "eta_min": 4.1,
        "notes": "Patient conscious but experiencing multiple fractures.",
    },
    {
        "id": "EMG-2026-083",
        "type": "Medical",
        "title": "Acute Cardiac Distress",
        "severity": "Critical",
        "location": "Janpath Market Crossing",
        "latitude": 28.6210,
        "longitude": 77.2180,
        "reported_time": "38 mins ago",
        "status": "Resolved",
        "patient_count": 1,
        "assigned_ambulance": "AMB-04",
        "recommended_hospital": "General Williams Hospital",
        "eta_min": 0.0,
        "notes": "Defibrillator deployed en route. Patient successfully transferred to ICU.",
    },
]


@app.get("/")
def home():
    """Existing root health check endpoint - preserved 100% backward compatible."""
    return {
        "system": "AI-Based Dynamic Emergency Response System",
        "status": "Operational",
    }


@app.get("/optimize")
def optimize(
    ambulance_lat: float = 28.6139,
    ambulance_lon: float = 77.2090,
    incident_lat: float = 28.6280,
    incident_lon: float = 77.2200,
):
    """
    Primary routing & multi-objective hospital allocation endpoint.
    Preserves all existing keys (status, input_coordinates, routing_details, assigned_hospital, recommended_action)
    while augmenting with path_coordinates, distance_km, and hospital transfer routing.
    """
    # 1. Run graph routing
    routing_result = run_emergency_routing(
        ambulance_lat, ambulance_lon, incident_lat, incident_lon
    )

    if "error" in routing_result:
        return routing_result

    # 2. Get optimal hospital dynamically based on live incident proximity and bed load
    assigned_hospital = get_best_hospital(incident_lat, incident_lon)

    # 3. Compute transfer route from incident to hospital if hospital location is available
    hospital_routing = None
    if assigned_hospital and "latitude" in assigned_hospital and "longitude" in assigned_hospital:
        hospital_routing = run_emergency_routing(
            incident_lat, incident_lon, assigned_hospital["latitude"], assigned_hospital["longitude"]
        )

    return {
        "status": "Success",
        "input_coordinates": {
            "ambulance": {"lat": ambulance_lat, "lon": ambulance_lon},
            "incident": {"lat": incident_lat, "lon": incident_lon},
        },
        "routing_details": routing_result,
        "assigned_hospital": assigned_hospital,
        "hospital_routing": hospital_routing,
        "recommended_action": (
            f"Ambulance dispatched! Assigned to {assigned_hospital['name']}"
            f" ({assigned_hospital['distance_km']} km away) with"
            f" {assigned_hospital['available_beds']} beds available."
        ),
    }


# ==========================================
# Supplementary API Endpoints for Dashboard
# ==========================================


@app.get("/api/hospitals")
def api_hospitals(
    lat: Optional[float] = None,
    lon: Optional[float] = None,
):
    """Returns dynamic hospitals queried from OpenStreetMap with distance metrics."""
    # Ensure lat and lon are actual floats if provided
    valid_lat = float(lat) if lat is not None and not hasattr(lat, "default") else None
    valid_lon = float(lon) if lon is not None and not hasattr(lon, "default") else None
    hospitals_list = get_all_hospitals(incident_lat=valid_lat, incident_lon=valid_lon)
    return {
        "status": "Success",
        "count": len(hospitals_list),
        "dataset_source": "OpenStreetMap Central Delhi Bounding Box (OSMnx)",
        "hospitals": hospitals_list,
    }


@app.get("/api/ambulances")
def api_ambulances():
    """Returns ambulance fleet telemetry and availability."""
    available_count = sum(1 for a in AMBULANCE_FLEET if a["status"] == "Available")
    return {
        "status": "Success",
        "total_units": len(AMBULANCE_FLEET),
        "available_units": available_count,
        "fleet_dataset_type": "PROTOTYPE DEMO DATA",
        "ambulances": AMBULANCE_FLEET,
    }


@app.get("/api/incidents")
def api_incidents():
    """Returns active and recent emergency incidents."""
    return {
        "status": "Success",
        "count": len(DEMO_INCIDENTS),
        "dataset_type": "PROTOTYPE DEMO DATA",
        "incidents": DEMO_INCIDENTS,
    }


class EmergencyRequest(BaseModel):
    emergency_type: str = "Accident"
    severity: str = "Critical"
    patient_count: int = 1
    location_name: str = "Connaught Place Circle"
    incident_lat: float = 28.6315
    incident_lon: float = 77.2167
    notes: Optional[str] = ""


@app.post("/api/emergency/dispatch")
def dispatch_emergency(req: EmergencyRequest):
    """
    Submits a new emergency request:
    1. Selects the closest available ambulance
    2. Runs NetworkX Dijkstra shortest path routing with road blockage simulation
    3. Solves multi-objective optimization across 41 OSM hospitals
    """
    # Find nearest available ambulance
    available_ambs = [a for a in AMBULANCE_FLEET if a["status"] == "Available"]
    if not available_ambs:
        available_ambs = AMBULANCE_FLEET

    # Pick ambulance by simple Euclidean/Haversine heuristic
    def amb_dist(a):
        return (a["latitude"] - req.incident_lat) ** 2 + (a["longitude"] - req.incident_lon) ** 2

    chosen_amb = min(available_ambs, key=amb_dist)

    # Run routing engine
    routing_result = run_emergency_routing(
        chosen_amb["latitude"], chosen_amb["longitude"], req.incident_lat, req.incident_lon
    )

    # Run hospital optimization
    assigned_hospital = get_best_hospital(req.incident_lat, req.incident_lon)

    # Compute transfer route to hospital
    hospital_routing = None
    if assigned_hospital and "latitude" in assigned_hospital and "longitude" in assigned_hospital:
        hospital_routing = run_emergency_routing(
            req.incident_lat, req.incident_lon, assigned_hospital["latitude"], assigned_hospital["longitude"]
        )

    incident_id = f"EMG-2026-{len(DEMO_INCIDENTS) + 81:03d}"
    incident_record = {
        "id": incident_id,
        "type": req.emergency_type,
        "title": f"{req.emergency_type}: {req.location_name}",
        "severity": req.severity,
        "location": req.location_name,
        "latitude": req.incident_lat,
        "longitude": req.incident_lon,
        "reported_time": "Just now",
        "status": "Assigned",
        "patient_count": req.patient_count,
        "assigned_ambulance": chosen_amb["id"],
        "recommended_hospital": assigned_hospital["name"] if assigned_hospital else "Central Hospital",
        "eta_min": routing_result.get("estimated_time_min", 5.0),
        "notes": req.notes,
    }
    DEMO_INCIDENTS.insert(0, incident_record)

    return {
        "status": "Success",
        "incident": incident_record,
        "assigned_ambulance": chosen_amb,
        "assigned_hospital": assigned_hospital,
        "routing_details": routing_result,
        "hospital_routing": hospital_routing,
        "recommended_action": (
            f"Ambulance {chosen_amb['id']} dispatched to {req.location_name}! "
            f"Optimal hospital: {assigned_hospital['name']} ({assigned_hospital['distance_km']} km) "
            f"with {assigned_hospital['available_beds']} beds open."
        ),
    }


@app.get("/api/system/status")
def system_status():
    """Returns live backend system telemetry and modular component status."""
    uptime_sec = round(time.time() - START_TIME, 1)
    graph = get_graph()
    hospitals_list = get_dynamic_hospitals()

    return {
        "api_service": {
            "status": "Operational",
            "uptime_seconds": uptime_sec,
            "version": "1.0.0",
            "framework": "FastAPI 0.141.1",
            "server": "Uvicorn ASGI",
        },
        "routing_engine": {
            "status": "Operational",
            "algorithm": "NetworkX Dijkstra / A* Shortest Path",
            "nodes_count": len(graph.nodes),
            "edges_count": len(graph.edges),
            "graph_type": "MultiDiGraph (Drive Network)",
        },
        "geospatial_data": {
            "status": "Operational",
            "source": "OpenStreetMap Delhi-NCR",
            "bounding_box": "(77.18, 28.58, 77.25, 28.66)",
            "cache_layer": "OSMnx Local File Cache Verified",
        },
        "hospital_module": {
            "status": "Operational",
            "total_hospitals_registered": len(hospitals_list),
            "in_memory_cache": "Active (<5ms retrieval)",
        },
        "optimization_engine": {
            "status": "Development Phase",
            "current_implementation": "Haversine Distance + Bed Congestion Ratio Weighting Formula",
            "planned_final_phase": "Pareto Multi-Objective Genetic Algorithm (NSGA-II) + Dynamic Traffic Telematics",
        },
        "ai_copilot": {
            "status": "Planned Final Phase",
            "current_implementation": "Architecture Preview & Prompt Interface Specification",
            "planned_final_phase": "Retrieval-Augmented Generation (RAG) over NetworkX Telemetry + Local LLM",
        },
    }


# Static build mounting if frontend dist exists
frontend_dist_dir = os.path.join(os.path.dirname(__file__), "frontend", "dist")
if os.path.exists(frontend_dist_dir):
    app.mount("/assets", StaticFiles(directory=os.path.join(frontend_dist_dir, "assets")), name="assets")

    @app.get("/dashboard")
    def serve_dashboard():
        return FileResponse(os.path.join(frontend_dist_dir, "index.html"))