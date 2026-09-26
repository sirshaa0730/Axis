# JARVIS — Planetary Emergency Intelligence System (Axis)

> **JARVIS** is an operational planetary emergency command and intelligence system built for high-stakes environmental hazard response, disaster simulation, and geospatial monitoring.

---

## 🏛️ System Architecture (Locked Turborepo)

```
JARVIS/
│
├── apps/
│   ├── web/                         🌐 SvelteKit Frontend + Three.js / WebGL + HTML5 Canvas
│   ├── analyser/                    🧠 Modular Python Backend (FastAPI, WebSockets, PydanticAI)
│   └── native/                      🦀 Rust / Dioxus Native Desktop Client
│
├── packages/
│   ├── api-contracts/               📦 Shared TypeScript / Pydantic Schemas & Contracts
│   ├── ui/                          🎨 Shared Design Tokens & Component Library
│   └── config/                      ⚙️ Shared Tooling & Linter Configurations
│
├── docs/                            📚 Architecture, Decisions & Demonstration Walkthroughs
├── package.json
└── turbo.json
```

---

## 🚀 Core Implemented Capabilities

### 1. Incidents Operational Workstation (`INCIDENTS` Tab)
- **Operational Threat Header & Severity Filter Bar**: Compact illuminated filter buttons for `ALL (7)`, `CRITICAL (2)`, `HIGH (3)`, `MODERATE (1)`, and `LOW (1)` with real-time reactive filtering.
- **Search & Multi-Mode Sorting**: Real-time text search across names, countries, and sectors; hazard type filter dropdown; and sorting by severity, date, and exposure.
- **Horizontal Incident Carousel**: Smooth scroll strip with navigation arrows, hazard category badges, exposure counts, and active glowing selection states.
- **Left Incident Detail Inspector**: Dynamic 4-tab breakdown:
  - `OVERVIEW`: Primary KPI metric cards, narrative summary, and projected risk alerts.
  - `IMPACT`: Population exposure bars, utility/infrastructure outage meters, and hospital capacities.
  - `FORECAST`: 72-hour inundation trend curves and hydrologic crest peak warnings.
  - `RESPONSE`: Deployed emergency units and command triggers (*Run Impact Analysis*, *Simulate Scenario*, *Assign Resources*).
- **Geospatial Intelligence Hero Map**:
  - Interactive HTML5 Canvas vector map with cartographic satellite terrain.
  - Animated glowing cyan flood extent polygon with dynamic wave caustics and fringe highlights.
  - Red pulsing radar hotspots with multi-ring dissipation.
  - Purple shaded affected district boundaries and cyan neon river channels.
  - Key city beacons (`Dhaka`, `Comilla`, `Chittagong`) with dark badge labels.
  - Dynamic overlay controls (`+`, `−`, `⊙` Recenter, `≡` Layer Overlays).
  - Lower-right Mini-Map with global locator reticle.
  - Bottom Temporal Timeline scrubber (`-24h` to `+72h`).

### 2. Living AI Intelligence Core (JARVIS 3D WebGL)
- **Heartbeat-Synchronized Kinetics**: Unified physiological double-beat waveform ($40\text{ BPM}$ resting to $77\text{ BPM}$ acceleration).
- **Dynamic State Engine**: `IDLE`, `LISTENING`, `THINKING`, `ANALYSING`, `SIMULATING`, `RESPONDING`.
- **Gaussian Shockwave Propagation**: Core pulses propagate outward radially, driving kinetic surges across surrounding orbital gimbals and particle rings.
- **Contextual Disclosure**: On-demand query cards and analytical panels that open contextually rather than cluttering the screen.

### 3. Planetary Command Center & 3D Globe
- **Orbital Canopy Viewport**: Curved glass cockpit HUD frame with real-time UTC clock and status indicators.
- **Interactive 3D Earth Globe**: Multi-layered Three.js sphere with photorealistic day/night atmospheric shaders, rotating cloud layers, and geolocated hazard pins.
- **On-Demand Scenario Drawer**: Slide-up simulation panel for running climate and hazard disruption parameter sweeps.

### 4. Multi-Hazard Intelligence Analysis Workstation (`ANALYSIS` Tab)
- **Data-Driven Visualizations Across All 5 Hazard Scenarios**:
  - `Flood`: Inundated haor basin polygons with dynamic breathing alpha, neon cyan river network (Surma, Kushiyara, Jamuna, Padma, Lower Meghna), Dhaka HQ pulsing beacon, Sylhet Sector Alpha critical inundation alert, and infrastructure scours.
  - `Cyclone`: Counter-clockwise rotating logarithmic spiral cloud bands, central calm storm eye (958 hPa), concentric wind field rings (`Cat 4 Eyewall >215 km/h`, `Cat 3 Storm 185 km/h`, `Gale-Force >90 km/h`), trajectory path with forward waypoints and widening cone of uncertainty towards Chittagong landfall, and coastal overwash surge alert ribbon (`+4.5m`).
  - `Wildfire`: Active glowing jagged fire perimeters with pulsating embers, MODIS/VIIRS thermal infrared hotspot detections, semi-transparent smoke plume drifting downwind (ENE), directional wind vectors (`42 km/h WSW`), mandatory evacuation perimeter, and Highway 16 closure notice.
  - `Earthquake`: Epicenter crosshair (`M 7.4`, 18km depth), concentric expanding P and S seismic shockwaves with decaying alpha, active crustal fault rupture trace, aftershock cluster scatter, Shindo intensity gradient contours (`Shindo 7`, `Shindo 6+`, `Shindo 5+`, `Shindo 4`), coastal tsunami advisory ribbon (`1.2m - 2.8m`), and Shika Nuclear Plant monitored status.
  - `Multi-Hazard (Compound Cascade)`: Physical cascade interaction across the Bengal Delta—approaching intense cyclone vortex from the South pushing a `+4.2m` marine surge into coastal inlets meeting upstream transboundary monsoon river deluge pouring south from Sylhet & Assam. The confluence at Meghna Estuary forms a hydraulic dam blocking river drainage and causing compound delta backwater inundation, accompanied by grid substation failure flash nodes and severed arterial bridges.
- **Cinematic Smooth Camera Transitions**: Frame-by-frame linear interpolation (`camLng`, `camLat`, `camSpanLng`, `camSpanLat`) gliding smoothly between geographic locations.
- **Synchronized State & Domain Analytics Cards**:
  - Dynamic 6-card Metrics Strip: domain units, numbers, and subtitles.
  - Predictive Analytics Cards:
    - *Projection*: `IMPACT PROJECTION` / `LANDFALL PROJECTION` / `FIRE SPREAD PROJECTION` / `AFTERSHOCK PROJECTION` / `CASCADE PROJECTION`.
    - *Forecast*: `RAINFALL FORECAST` / `WIND SPEED FORECAST` / `FIRE WEATHER INDEX (FWI)` / `PEAK GROUND ACCELERATION` / `COMPOUND FORCING FORECAST`.
    - *Infrastructure*: `INFRASTRUCTURE IMPACT` / `MARITIME & PORT EXPOSURE` / `PERIMETER ASSET EXPOSURE` / `STRUCTURAL INTEGRITY LOSS` / `CRITICAL INFRASTRUCTURE CASCADE`.
- **Explainable Risk Drivers**: Interactive breakdown modal with weighted scoring algorithms, factor descriptions, and historical benchmark comparisons.

---

## 📜 Commit History & Changelog

| Commit Hash | Type | Description |
| :--- | :--- | :--- |
| `HEAD` | `feat(scenarios)` | Implement high-fidelity What-If Simulation & Scenario Intelligence workstation with multi-hazard counterfactual engine, timeline scrubber, and comparison matrix |
| `caa4aae` | `feat(analysis)` | Implement data-driven hazard visualizations across all 5 hazard types (Flood, Cyclone, Wildfire, Earthquake, Multi-Hazard) |
| `63748cf` | `fix(analysis)` | Establish authoritative layout hierarchy with independent hero map container, sibling insights cards, and dynamic autoScale |
| `9056253` | `feat(analysis)` | Implement high-fidelity Multi-Hazard Intelligence Analysis workstation with geospatial hero map, predictive charts, and explainable risk drivers |
| `d6a0b35` | `docs` | Document planetary intelligence workstation, system features, and commit history |
| `6149cca` | `feat(intelligence)` | Wire View All incidents navigation and contextual simulate scenario trigger in right intelligence panel |
| `957d4da` | `feat(incidents)` | Implement high-fidelity Incidents operational workstation with geospatial hero map, carousel, tabs, and filters |
| `fdc951d` | `feat` | JARVIS Central Intelligence - Heartbeat-Synchronized 3D AI Core and Planetary HUD |

---

## 🛠️ Local Development & Quick Start

### Web Command Center
```bash
cd apps/web
npm install
npm run dev -- --port 5180
```
Open [http://localhost:5180](http://localhost:5180) in your browser.

### Backend Analyser Service
```bash
cd apps/analyser
python -m venv venv
venv\Scripts\activate   # Windows
pip install -r requirements.txt
uvicorn app.api.main:app --reload --port 8000
```

