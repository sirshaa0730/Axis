"""JARVIS FastAPI Backend Application Entrypoint."""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="JARVIS Planetary Emergency Intelligence API",
    version="1.0.0",
    description="Mission-control emergency intelligence API"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health_check():
    return {"status": "online", "system": "JARVIS Planetary Emergency Intelligence"}
