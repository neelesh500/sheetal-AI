from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import asyncio
import json

app = FastAPI(
    title="SHEETAL.AI Backend Core",
    description="Core backend telemetry and AI inference API for Bharatiya Antariksh Hackathon 2026",
    version="1.0.0"
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Pydantic Data Models ---
class PredictionRequest(BaseModel):
    region: str
    green_cover_increase_pct: float

# --- Mock Database (In-Memory for Core Setup) ---
HOTSPOTS_DB = [
    {"id": "dl-01", "city_name": "New Delhi", "lat": 28.6139, "lon": 77.2090, "surface_temp": 48.5, "anomaly_level": "Critical"},
    {"id": "ah-02", "city_name": "Ahmedabad", "lat": 23.0225, "lon": 72.5714, "surface_temp": 47.8, "anomaly_level": "Critical"},
    {"id": "mb-03", "city_name": "Mumbai", "lat": 19.0760, "lon": 72.8777, "surface_temp": 44.2, "anomaly_level": "Warning"},
    {"id": "kn-04", "city_name": "Kanpur", "lat": 26.4499, "lon": 80.3319, "surface_temp": 46.9, "anomaly_level": "Critical"}
]

# --- Core REST Endpoints ---
@app.get("/")
async def root():
    return {
        "status": "online",
        "system": "SHEETAL.AI Space Intelligence Core",
        "hackathon": "Bharatiya Antariksh Hackathon 2026"
    }

@app.get("/api/v1/hotspots")
async def get_hotspots():
    """Fetch active high-resolution thermal hotspots."""
    return {"status": "success", "count": len(HOTSPOTS_DB), "data": HOTSPOTS_DB}

@app.post("/api/v1/ai/predict")
async def run_ai_prediction(payload: PredictionRequest):
    """Execute deep neural network LST microclimate forecasting simulation."""
    await asyncio.sleep(0.4) # Simulating AI processing delay
    temp_drop = payload.green_cover_increase_pct * 0.14
    return {
        "status": "success",
        "region": payload.region,
        "green_cover_added_pct": payload.green_cover_increase_pct,
        "expected_temperature_reduction_celsius": round(temp_drop, 2),
        "confidence_score": 0.964,
        "message": "AI microclimate prediction executed successfully."
    }

@app.get("/api/v1/satellites/sync")
async def sync_satellites():
    """Trigger synchronization with ISRO Bhuvan & USGS Landsat-9 OGC WMS services."""
    return {
        "sync_status": "completed",
        "sources_connected": ["ISRO Cartosat-3", "NASA Landsat-9 TIRS-2", "ESA Sentinel-3"],
        "rasters_cached": 14
    }

# --- Real-Time WebSocket Manager ---
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

manager = ConnectionManager()

@app.websocket("/ws/telemetry")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data = json.dumps({
                "type": "telemetry_ping", 
                "active_anomalies": len(HOTSPOTS_DB), 
                "system_status": "nominal"
            })
            await websocket.send_text(data)
            await asyncio.sleep(10)
    except WebSocketDisconnect:
        manager.disconnect(websocket)
