/**
 * Prototype and Demo Datasets for Mid-Term Viva Presentation
 * NOTE: All data herein represents controlled academic demonstration datasets,
 * clearly distinguishing prototype baseline values from real-time dynamic calculations.
 */

export const DEMO_LOCATION_PRESETS = [
  {
    name: "Jaypee Institute of Information Technology (JIIT), Sector 62, Noida",
    lat: 28.6295,
    lon: 77.3725,
    description: "College campus institutional corridor adjacent to Fortis Hospital (Sector 62 Noida)",
  },
  {
    name: "Connaught Place Inner Circle (Central Delhi)",
    lat: 28.6315,
    lon: 77.2167,
    description: "High-density commercial roundabout with arterial convergence",
  },
  {
    name: "Delhi Gate Intersection (Jawaharlal Nehru Marg)",
    lat: 28.6380,
    lon: 77.2410,
    description: "Major junction adjacent to Lok Nayak Hospital & Old Delhi corridor",
  },
  {
    name: "Barakhamba Road Metro Station",
    lat: 28.6290,
    lon: 77.2270,
    description: "Transit hub corridor with elevated pedestrian & commuter traffic",
  },
  {
    name: "Janpath Central Crossing",
    lat: 28.6210,
    lon: 77.2180,
    description: "Major North-South avenue connecting Connaught Place to Rajpath",
  },
  {
    name: "India Gate C-Hexagon",
    lat: 28.6129,
    lon: 77.2295,
    description: "High-visibility public zone with multiple emergency access roads",
  },
];

export const INITIAL_ANALYTICS = {
  casesByType: [
    { name: "Accident / Collision", value: 38, color: "#ef4444" },
    { name: "Acute Medical / Cardiac", value: 29, color: "#f59e0b" },
    { name: "Severe Trauma / Fall", value: 18, color: "#3b82f6" },
    { name: "Fire / Industrial", value: 9, color: "#f97316" },
    { name: "Other / Unspecified", value: 6, color: "#8b5cf6" },
  ],
  casesBySeverity: [
    { name: "Critical (Tier 1)", value: 24, count: 24, color: "#ef4444" },
    { name: "High (Tier 2)", value: 42, count: 42, color: "#f59e0b" },
    { name: "Moderate (Tier 3)", value: 28, count: 28, color: "#3b82f6" },
    { name: "Low (Tier 4)", value: 6, count: 6, color: "#64748b" },
  ],
  responseTimeDistribution: [
    { range: "< 4 min", cases: 14 },
    { range: "4-6 min", cases: 32 },
    { range: "6-8 min", cases: 28 },
    { range: "8-10 min", cases: 16 },
    { range: "10-12 min", cases: 7 },
    { range: "> 12 min", cases: 3 },
  ],
  fleetUtilization: [
    { status: "Available", count: 8, color: "#10b981" },
    { status: "En Route", count: 2, color: "#3b82f6" },
    { status: "Assigned", count: 1, color: "#f59e0b" },
    { status: "At Hospital", count: 1, color: "#8b5cf6" },
    { status: "Offline", count: 1, color: "#64748b" },
  ],
  hospitalSelectionFrequency: [
    { name: "Lok Nayak (LNJP)", dispatches: 34 },
    { name: "Lady Hardinge", dispatches: 27 },
    { name: "General Williams", dispatches: 19 },
    { name: "Dr. R.P. Ophthalmic", dispatches: 12 },
    { name: "Northern Railway Hosp.", dispatches: 8 },
  ],
};

export const OPTIMIZATION_FACTORS = [
  {
    id: "distance",
    name: "Road Network Distance",
    weight: "35%",
    description: "Calculated along OSMnx drive graph topology using shortest path algorithm.",
    formula: "d(u, v) = \\sum_{(i,j) \\in P} length_{ij}",
    status: "Active (Implemented)",
  },
  {
    id: "congestion",
    name: "Hospital Bed Occupancy",
    weight: "30%",
    description: "Penalizes congested facilities to prevent emergency department bottle-necking.",
    formula: "Ratio = Occupied / Total",
    status: "Active (Implemented)",
  },
  {
    id: "severity",
    name: "Incident Triage Urgency",
    weight: "20%",
    description: "Escalates dispatch priority and filters trauma centers for Level-1 cases.",
    formula: "Urgency Multiplier \\in [1.0, 2.5]",
    status: "Development Phase",
  },
  {
    id: "specialization",
    name: "Clinical Specialty Match",
    weight: "15%",
    description: "Ensures cardiac/trauma/pediatric patients are routed to specialized emergency wings.",
    formula: "Match(req.type, hospital.specialty)",
    status: "Development Phase",
  },
];
