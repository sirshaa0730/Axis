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

---

## 📜 Commit History & Changelog

| Commit Hash | Type | Description |
| :--- | :--- | :--- |
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

