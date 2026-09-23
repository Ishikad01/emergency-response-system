import os
import networkx as nx
import osmnx as ox

G_DELHI = None
G_JIIT = None

JIIT_GRAPH_PATH = os.path.join(os.path.dirname(__file__), "cache", "jiit_sector62.graphml")


def get_graph():
  """Returns the Central Delhi drive network graph (7,103 nodes)."""
  global G_DELHI
  if G_DELHI is None:
    print("Loading Central Delhi road network graph...")
    bbox = (77.18, 28.58, 77.25, 28.66)
    try:
      G_DELHI = ox.graph_from_bbox(bbox=bbox, network_type="drive")
      print("OSM Central Delhi Graph loaded successfully!")
    except Exception as e:
      print(f"OSM download failed ({e}), using grid fallback.")
      grid = nx.grid_2d_graph(10, 10)
      G_DELHI = nx.convert_node_labels_to_integers(grid)
      for u, v, data in G_DELHI.edges(data=True):
        data["length"] = 1.0
  return G_DELHI


def get_jiit_graph():
  """Returns the Jaypee Institute of Information Technology (JIIT Sector 62 Noida) local graph."""
  global G_JIIT
  if G_JIIT is not None:
    return G_JIIT

  if os.path.exists(JIIT_GRAPH_PATH):
    print("Loading cached JIIT Sector 62 road graph...")
    try:
      G_JIIT = ox.load_graphml(JIIT_GRAPH_PATH)
      for u, v, d in G_JIIT.edges(data=True):
        if "length" in d:
          d["length"] = float(d["length"])
      print(f"JIIT graph loaded! Nodes: {len(G_JIIT.nodes)}, Edges: {len(G_JIIT.edges)}")
      return G_JIIT
    except Exception as e:
      print(f"Error loading cached JIIT graph: {e}. Downloading afresh...")

  print("Downloading road network for JIIT Sector 62, Noida...")
  lat, lon = 28.6295406, 77.3725048
  try:
    G_JIIT = ox.graph_from_point((lat, lon), dist=1500, network_type="drive")
    os.makedirs(os.path.dirname(JIIT_GRAPH_PATH), exist_ok=True)
    ox.save_graphml(G_JIIT, JIIT_GRAPH_PATH)
    print("JIIT graph downloaded and cached successfully!")
  except Exception as err:
    print(f"JIIT graph fetch error: {err}. Falling back to Delhi network.")
    return get_graph()

  return G_JIIT


def is_near_jiit(lat, lon):
  """Checks whether coordinates fall within the Noida Sector 62 / JIIT campus area."""
  return (28.58 <= lat <= 28.67) and (77.32 <= lon <= 77.42)


def find_nearest_node(graph, lat, lon):
  """Pure Python / Euclidean distance node finder. Fast and independent of scikit-learn."""
  best_node = None
  min_dist_sq = float("inf")
  for n, data in graph.nodes(data=True):
    n_lat = data.get("y") or data.get("lat")
    n_lon = data.get("x") or data.get("lon")
    if n_lat is not None and n_lon is not None:
      dist_sq = (float(n_lat) - lat) ** 2 + (float(n_lon) - lon) ** 2
      if dist_sq < min_dist_sq:
        min_dist_sq = dist_sq
        best_node = n
  return best_node


def calculate_edge_width_and_area(edge_data):
  """
  Calculates road width (m) and surface area (m^2) for a road edge.
  Adheres to Indian Road Congress (IRC:86-1983 / IRC:73-1980) urban standards.
  Evaluates real-time ambulance bypass feasibility.
  """
  # 1. Check explicit OSM width attribute
  width = None
  raw_width = edge_data.get("width")
  if raw_width:
    try:
      if isinstance(raw_width, list):
        raw_width = raw_width[0]
      width = float(str(raw_width).replace("m", "").strip())
    except (ValueError, TypeError):
      width = None

  # 2. Check explicit lanes attribute (IRC standard: 3.5m per lane)
  if width is None:
    raw_lanes = edge_data.get("lanes")
    if raw_lanes:
      try:
        if isinstance(raw_lanes, list):
          raw_lanes = raw_lanes[0]
        lanes = float(raw_lanes)
        width = max(3.5, lanes * 3.5)
      except (ValueError, TypeError):
        width = None

  # 3. Infer from IRC urban road hierarchy if tags are missing
  if width is None:
    hw = edge_data.get("highway", "residential")
    if isinstance(hw, list):
      hw = hw[0]
    hw = str(hw).lower()

    if "motorway" in hw or "trunk" in hw:
      width = 14.0  # Dual carriageway / Expressway (min 14m)
    elif "primary" in hw:
      width = 10.5  # 3-4 lane arterial corridor (10.5m)
    elif "secondary" in hw:
      width = 7.5   # 2-lane sub-arterial road (7.5m)
    elif "tertiary" in hw:
      width = 7.0   # 2 standard lanes (7.0m)
    elif "residential" in hw or "unclassified" in hw:
      width = 5.5   # 2 intermediate residential lanes (5.5m)
    elif "living_street" in hw or "service" in hw:
      width = 3.5   # Single access lane (3.5m)
    else:
      width = 6.0

  length = float(edge_data.get("length", 50.0))
  area = round(length * width, 1)

  # 4. Determine Ambulance Bypass Feasibility
  # Standard ambulance width = 2.1m (mirror-to-mirror ~2.4m)
  # Minimum width for bypass alongside stalled passenger car (car ~1.8m + ambulance ~2.1m + buffer ~1.1m) = 5.0m
  if width >= 7.0:
    bypass_code = "FEASIBLE"
    bypass_status = "Bypass Feasible"
    bypass_desc = f"Width {width}m allows emergency overtaking across adjacent lane or shoulder."
  elif width >= 5.0:
    bypass_code = "RESTRICTED"
    bypass_status = "Restricted Bypass"
    bypass_desc = f"Width {width}m allows tight squeeze bypass with speed reduction (<15 km/h)."
  else:
    bypass_code = "IMPOSSIBLE"
    bypass_status = "Bypass Impossible"
    bypass_desc = f"Narrow choke point ({width}m). Stationary vehicles block path; reroute required."

  return {
      "width_m": round(width, 1),
      "length_m": round(length, 1),
      "area_m2": area,
      "bypass_code": bypass_code,
      "bypass_status": bypass_status,
      "bypass_desc": bypass_desc,
  }


def run_emergency_routing(
    ambulance_lat, ambulance_lon, incident_lat, incident_lon
):
  try:
    # Select graph: JIIT Sector 62 local network or Central Delhi regional network
    if is_near_jiit(ambulance_lat, ambulance_lon) or is_near_jiit(incident_lat, incident_lon):
      graph = get_jiit_graph()
      sector_name = "Jaypee Institute of Information Technology (JIIT Sector 62 Noida)"
    else:
      graph = get_graph()
      sector_name = "Central Delhi Dispatch Grid"

    # 1. Safely pick source and target nodes using Euclidean nearest neighbor
    source_node = find_nearest_node(graph, ambulance_lat, ambulance_lon)
    incident_node = find_nearest_node(graph, incident_lat, incident_lon)

    if source_node is None or incident_node is None:
      nodes = list(graph.nodes())
      source_node, incident_node = nodes[0], nodes[min(1, len(nodes)-1)]

    if source_node == incident_node:
      return {
          "error": (
              "Ambulance and incident locations map to the exact same node."
          )
      }

    # 2. Find path with automatic fallback to undirected graph if one-way constraints isolate nodes
    try:
      normal_path = nx.shortest_path(
          graph, source=source_node, target=incident_node, weight="length"
      )
    except nx.NetworkXNoPath:
      try:
        normal_path = nx.shortest_path(
            graph.to_undirected(), source=source_node, target=incident_node, weight="length"
        )
      except nx.NetworkXNoPath:
        normal_path = [source_node, incident_node]

    # 3. Simulate road blockage
    blocked_edge_info = None
    removed_edge = None
    if len(normal_path) > 1:
      u, v = normal_path[0], normal_path[1]
      if graph.has_edge(u, v):
        edge_data = graph.get_edge_data(u, v)
        removed_edge = (u, v, edge_data)
        graph.remove_edge(u, v)
        blocked_edge_info = f"Blocked road segment between node {u} and {v}"

    # 4. Recalculate dynamic alternative path
    try:
      dynamic_path = nx.shortest_path(
          graph, source=source_node, target=incident_node, weight="length"
      )
    except nx.NetworkXNoPath:
      try:
        dynamic_path = nx.shortest_path(
            graph.to_undirected(), source=source_node, target=incident_node, weight="length"
        )
      except nx.NetworkXNoPath:
        dynamic_path = normal_path

    # Restore the removed edge so base graph is non-destructively preserved
    if removed_edge:
      ru, rv, rdata = removed_edge
      if isinstance(rdata, dict):
        for k, attrs in rdata.items():
          graph.add_edge(ru, rv, key=k, **attrs)
      else:
        graph.add_edge(ru, rv)

    # 5. Extract GPS coordinates, Road Width, Road Area, and Bypass Feasibility
    path_coordinates = []
    total_distance_m = 0.0
    total_road_area_m2 = 0.0
    widths = []
    choke_points = []

    if isinstance(dynamic_path, list) and dynamic_path != ["All paths blocked"]:
      for n in dynamic_path:
        matched_node = n
        if matched_node not in graph.nodes and str(n) in graph.nodes:
          matched_node = str(n)
        elif matched_node not in graph.nodes and isinstance(n, str) and n.isdigit() and int(n) in graph.nodes:
          matched_node = int(n)

        if matched_node in graph.nodes:
          node_data = graph.nodes[matched_node]
          lat = node_data.get("y") or node_data.get("lat")
          lon = node_data.get("x") or node_data.get("lon")
          if lat is not None and lon is not None:
            path_coordinates.append([float(lat), float(lon)])

      for u, v in zip(dynamic_path[:-1], dynamic_path[1:]):
        edge_data = graph.get_edge_data(u, v) or graph.get_edge_data(v, u)
        if edge_data:
          primary_edge = list(edge_data.values())[0] if isinstance(edge_data, dict) else edge_data
          metrics = calculate_edge_width_and_area(primary_edge)
          
          total_distance_m += metrics["length_m"]
          total_road_area_m2 += metrics["area_m2"]
          widths.append(metrics["width_m"])

          if metrics["bypass_code"] == "IMPOSSIBLE":
            choke_points.append({
                "nodes": [u, v],
                "width_m": metrics["width_m"],
                "length_m": metrics["length_m"],
                "area_m2": metrics["area_m2"],
            })

    # Summary metrics
    distance_km = round(total_distance_m / 1000.0, 2)
    estimated_time_min = round(max(1.0, (distance_km / 35.0) * 60.0), 1)
    avg_width_m = round(sum(widths) / len(widths), 1) if widths else 7.0
    min_width_m = min(widths) if widths else 5.5

    # Overall route bypass feasibility
    if choke_points:
      overall_bypass = "RESTRICTED / CHOKE POINT DETECTED"
      bypass_status_code = "CHOKE_POINT"
      bypass_recommendation = f"{len(choke_points)} narrow bottleneck segment(s) detected (min width: {min_width_m}m). If blocked by stopped vehicles, bypass is impossible and automated reroute is mandatory."
    elif avg_width_m >= 7.0:
      overall_bypass = "BYPASS FEASIBLE"
      bypass_status_code = "FEASIBLE"
      bypass_recommendation = f"Route road width ({avg_width_m}m avg) provides adequate multi-lane / shoulder clearance for emergency overtaking."
    else:
      overall_bypass = "RESTRICTED BYPASS"
      bypass_status_code = "RESTRICTED"
      bypass_recommendation = f"Intermediate width ({avg_width_m}m). Ambulance can squeeze past traffic with speed penalty (<15 km/h)."

    blocked_coordinates = None
    if removed_edge:
      bu, bv, _ = removed_edge
      if bu in graph.nodes and bv in graph.nodes:
        b_u_data = graph.nodes[bu]
        b_v_data = graph.nodes[bv]
        blocked_coordinates = [
            [float(b_u_data.get("y", 28.6)), float(b_u_data.get("x", 77.2))],
            [float(b_v_data.get("y", 28.6)), float(b_v_data.get("x", 77.2))],
        ]

    return {
        "source_node": source_node,
        "incident_node": incident_node,
        "simulation_event": blocked_edge_info,
        "rescue_path_length": (
            len(dynamic_path) if isinstance(dynamic_path, list) else 0
        ),
        "graph_nodes_count": len(graph.nodes),
        "sector": sector_name,
        "path_coordinates": path_coordinates,
        "distance_km": distance_km,
        "estimated_time_min": estimated_time_min,
        "blocked_segment_coordinates": blocked_coordinates,
        # Real-Time Road Width, Area & Bypass Calculations
        "road_width_avg_m": avg_width_m,
        "road_width_min_m": min_width_m,
        "road_area_total_m2": round(total_road_area_m2, 1),
        "bypass_feasibility": overall_bypass,
        "bypass_status_code": bypass_status_code,
        "bypass_recommendation": bypass_recommendation,
        "choke_points_count": len(choke_points),
    }

  except Exception as e:
    return {"error": f"Routing calculation failed: {str(e)}"}