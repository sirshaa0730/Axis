# JARVIS — Planetary Emergency Intelligence System

> AI-assisted planetary emergency command and intelligence system.

## Architecture (Locked)
```
JARVIS/
├── apps/
│   ├── web/                         # SvelteKit Command Center
│   ├── analyser/                    # Modular Python Backend (FastAPI, PydanticAI)
│   └── native/                      # Dioxus / Rust Client
├── packages/
│   ├── api-contracts/               # Shared Schemas & Contracts
│   ├── ui/                          # Shared UI
│   └── config/                      # Shared Configs
├── docs/                            # Documentation
├── scripts/                         # Utilities
├── package.json
├── turbo.json
└── README.md
```

## Running the Web Command Center
```bash
cd apps/web
npm install
npm run dev
```
