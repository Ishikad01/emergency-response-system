import os
import json
import math
import osmnx as ox

_cached_hospitals = None

def _assign_specialization(name: str) -> str:
    name_lower = name.lower()
    if "trauma" in name_lower or "casualty" in name_lower:
        return "Level-1 Trauma & Emergency"
    elif "eye" in name_lower or "dr. r. p." in name_lower:
        return "Ophthalmology & Trauma"
    elif "dental" in name_lower:
        return "Maxillofacial & Dental"
    elif "heart" in name_lower or "cardio" in name_lower:
        return "Cardiology & Intensive Care"
    elif "child" in name_lower or "pediatric" in name_lower or "kalawati" in name_lower:
        return "Pediatrics & Neonatal Care"
    elif "ayurvedic" in name_lower or "tibbia" in name_lower:
        return "General Medicine"
    elif "chest" in name_lower or "tb" in name_lower or "infectious" in name_lower:
        return "Pulmonology & Critical Care"
    else:
        return "Multi-Specialty Emergency"

def get_dynamic_hospitals():
    global _cached_hospitals
    if _cached_hospitals is not None:
        return _cached_hospitals

    try:
        # Same bounding box area as your routing engine (Central Delhi)
        # format: (west, south, east, north)
        bbox = (77.18, 28.58, 77.25, 28.66)
        
        # Query OpenStreetMap for all amenities tagged as 'hospital'
        tags = {"amenity": "hospital"}
        gdf = ox.features_from_bbox(bbox=bbox, tags=tags)
        
        hospitals = []
        # Predefined realistic variation for prototype demonstration
        capacities = [120, 180, 250, 90, 310, 140, 200, 160, 220, 85]
        occupancies = [70, 145, 190, 65, 260, 95, 150, 110, 175, 55]

        for idx, (osm_id, row) in enumerate(gdf.iterrows()):
            name = row.get("name")
            # Skip entries without a proper name
            if not name or (isinstance(name, float) and math.isnan(name)):
                continue
                
            # Get the geographic center (centroid) of the hospital polygon/point
            geom = row.geometry
            lat = geom.centroid.y
            lon = geom.centroid.x
            
            # Extract street address if available in OSM tags
            street = row.get("addr:street")
            city = row.get("addr:city", "New Delhi")
            address = f"{street}, {city}" if street and not (isinstance(street, float) and math.isnan(street)) else "Central Delhi, New Delhi"

            cap = capacities[idx % len(capacities)]
            occ = occupancies[idx % len(occupancies)]
            specialization = _assign_specialization(str(name))

            hospitals.append({
                "id": str(osm_id),
                "name": str(name),
                "address": str(address),
                "latitude": float(lat),
                "longitude": float(lon),
                "total_beds": cap,
                "occupied_beds": occ,
                "available_beds": cap - occ,
                "specialization": specialization,
                "emergency_capable": True,
                "status": "Operational",
                "phone": "+91 11 2323 " + str(1000 + (idx * 37) % 9000)
            })
            
        if hospitals:
            print(f"Successfully loaded {len(hospitals)} real hospitals from OpenStreetMap!")
            _cached_hospitals = hospitals
            return _cached_hospitals
    except Exception as e:
        print(f"OSM hospital fetch warning: {e}. Falling back to curated registry.")

    # Fallback registry if Overpass API is rate-limited
    _cached_hospitals = [
        {
            "id": "H1",
            "name": "Lok Nayak Jai Prakash Hospital (LNJP)",
            "address": "Jawaharlal Nehru Marg, Delhi Gate, New Delhi",
            "latitude": 28.6380,
            "longitude": 77.2410,
            "total_beds": 200,
            "occupied_beds": 170,
            "available_beds": 30,
            "specialization": "Multi-Specialty Emergency & Level-1 Trauma",
            "emergency_capable": True,
            "status": "Operational",
            "phone": "+91 11 2323 3000"
        },
        {
            "id": "H2",
            "name": "Lady Hardinge Medical College & Associated Hospitals",
            "address": "Shaheed Bhagat Singh Marg, Connaught Place, New Delhi",
            "latitude": 28.6320,
            "longitude": 77.2130,
            "total_beds": 120,
            "occupied_beds": 90,
            "available_beds": 30,
            "specialization": "Pediatrics, Gynecology & General Emergency",
            "emergency_capable": True,
            "status": "Operational",
            "phone": "+91 11 2336 3728"
        },
    ]
    return _cached_hospitals


def is_near_jiit(lat, lon):
  """Checks whether coordinates fall within the Noida Sector 62 / JIIT campus area."""
  return (28.58 <= lat <= 28.67) and (77.32 <= lon <= 77.42)


def get_jiit_hospitals():
  """Loads real hospitals around Jaypee Institute of Information Technology (Sector 62, Noida)."""
  cache_file = os.path.join(os.path.dirname(__file__), "cache", "jiit_hospitals.json")
  if os.path.exists(cache_file):
    try:
      with open(cache_file, "r") as f:
        return json.load(f)
    except Exception as e:
      print(f"Error reading JIIT hospitals cache: {e}")

  return [
      {
          "id": "JIIT_H_FORTIS",
          "name": "Fortis Hospital, Sector 62",
          "address": "B-22, Sector 62, Noida, Uttar Pradesh",
          "latitude": 28.6183686,
          "longitude": 77.3735841,
          "total_beds": 250,
          "occupied_beds": 165,
          "available_beds": 85,
          "specialization": "Multi-Specialty Emergency & Level-1 Trauma",
          "emergency_capable": True,
          "status": "Operational",
          "phone": "+91 120 430 0222",
      },
      {
          "id": "JIIT_H_SHANTI",
          "name": "Shanti Gopal Hospital",
          "address": "Mall Road, Ahinsa Khand 2, Indirapuram, Ghaziabad",
          "latitude": 28.6418,
          "longitude": 77.3793,
          "total_beds": 120,
          "occupied_beds": 75,
          "available_beds": 45,
          "specialization": "General Emergency & Intensive Care",
          "emergency_capable": True,
          "status": "Operational",
          "phone": "+91 120 477 7000",
      },
  ]


def haversine_distance(lat1, lon1, lat2, lon2):
  """Calculates the great-circle distance between two GPS points in kilometers."""
  R = 6371.0  # Earth radius in kilometers
  dlat = math.radians(lat2 - lat1)
  dlon = math.radians(lon2 - lon1)
  a = (
      math.sin(dlat / 2) ** 2
      + math.cos(math.radians(lat1))
      * math.cos(math.radians(lat2))
      * math.sin(dlon / 2) ** 2
  )
  c = 2 * math.asin(math.sqrt(a))
  return R * c


def get_best_hospital(incident_lat, incident_lon):
  if is_near_jiit(incident_lat, incident_lon):
    hospitals_list = get_jiit_hospitals()
  else:
    hospitals_list = get_dynamic_hospitals()

  best = None
  min_score = float("inf")

  for h in hospitals_list:
    available_beds = h["total_beds"] - h["occupied_beds"]
    if available_beds <= 0:
      continue

    distance_km = haversine_distance(
        incident_lat, incident_lon, h["latitude"], h["longitude"]
    )

    congestion_ratio = h["occupied_beds"] / h["total_beds"]
    score = (distance_km * 0.7) + (congestion_ratio * 3.0)

    if score < min_score:
      min_score = score
      best = {
          "hospital_id": h["id"],
          "name": h["name"],
          "address": h["address"],
          "available_beds": available_beds,
          "distance_km": round(distance_km, 2),
          "latitude": h["latitude"],
          "longitude": h["longitude"],
          "specialization": h.get("specialization", "Multi-Specialty Emergency"),
          "score": round(score, 3),
      }

  return best


def get_all_hospitals(incident_lat=None, incident_lon=None):
  """Returns all dynamic hospitals with calculated distances if coordinates are provided."""
  if incident_lat is not None and incident_lon is not None and is_near_jiit(incident_lat, incident_lon):
    hospitals_list = get_jiit_hospitals()
  else:
    hospitals_list = get_dynamic_hospitals()

  results = []
  for h in hospitals_list:
    item = dict(h)
    if incident_lat is not None and incident_lon is not None:
      dist = haversine_distance(
          incident_lat, incident_lon, h["latitude"], h["longitude"]
      )
      item["distance_km"] = round(dist, 2)
    else:
      item["distance_km"] = None
    results.append(item)

  if incident_lat is not None and incident_lon is not None:
    results.sort(key=lambda x: (x["distance_km"] if x["distance_km"] is not None else 99999))
  return results