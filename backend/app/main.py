from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import asyncio
import json
import logging

from .routes import router
from .config import settings
from . import simulation
from .forecasting import forecast
from .anomaly import detect_anomalies
from .optimization import optimize_route
from .sustainability import calculate_savings
from .predictive_maintenance import generate_maintenance_data
from .traffic_intelligence import generate_traffic_data
from .resource_ai import generate_resource_data

# ---------------------------------------------------
# Logging
# ---------------------------------------------------

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("urbanmind")

# ---------------------------------------------------
# App Initialization
# ---------------------------------------------------

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION
)

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)

# ===================================================
# SMART WASTE ROUTING WEBSOCKET
# ===================================================

@app.websocket("/ws")
async def waste_websocket(websocket: WebSocket):
    await websocket.accept()

    try:
        while True:
            logger.info("Streaming waste routing data...")

            # Generate simulated bin data
            bins, history = simulation.generate_data()

            # AI Forecasting
            predictions = forecast(history)

            # Anomaly Detection
            anomalies = detect_anomalies(history)
            anomalies = {k: bool(v) for k, v in anomalies.items()}

            # Overflow bins
            overflow_bins = [
                b for b in bins
                if predictions[b["bin_id"]] > 100
            ]

            # Dynamic depot
            depot = simulation.depots[simulation.current_city]

            # Route optimization
            if overflow_bins:
                route, total_distance = optimize_route(
                    overflow_bins,
                    depot
                )
            else:
                route, total_distance = [], 0

            # Sustainability calculation
            savings = calculate_savings(total_distance)

            # Alerts generation
            alerts = []

            for b in bins:
                bin_id = b["bin_id"]
                level = b["level"]
                predicted = predictions[bin_id]
                anomaly = anomalies.get(bin_id, False)

                if predicted > 100:
                    alerts.append({
                        "bin_id": bin_id,
                        "type": "critical",
                        "message": "Overflow predicted"
                    })

                elif level > 80:
                    alerts.append({
                        "bin_id": bin_id,
                        "type": "warning",
                        "message": "High fill level"
                    })

                if anomaly:
                    alerts.append({
                        "bin_id": bin_id,
                        "type": "anomaly",
                        "message": "Abnormal activity detected"
                    })

            payload = {
                "bins": bins,
                "predictions": predictions,
                "anomalies": anomalies,
                "optimized_route": route,
                "route_distance": total_distance,
                "depot": depot,
                "alerts": alerts,
                "sustainability": savings,
            }

            await websocket.send_text(json.dumps(payload))
            await asyncio.sleep(settings.UPDATE_INTERVAL)

    except WebSocketDisconnect:
        logger.info("Waste routing client disconnected safely.")


# ===================================================
# PREDICTIVE MAINTENANCE WEBSOCKET
# ===================================================

@app.websocket("/ws/maintenance")
async def maintenance_websocket(websocket: WebSocket):
    await websocket.accept()

    try:
        while True:
            logger.info("Streaming predictive maintenance data...")

            assets, history = generate_maintenance_data()

            alerts = []

            for asset in assets:
                if asset["health_score"] < 30:
                    alerts.append({
                        "type": "critical",
                        "message": f"{asset['name']} critical failure risk"
                    })

                elif asset["health_score"] < 50:
                    alerts.append({
                        "type": "warning",
                        "message": f"{asset['name']} maintenance required"
                    })

                if asset["failure_probability"] > 0.7:
                    alerts.append({
                        "type": "anomaly",
                        "message": f"{asset['name']} abnormal vibration detected"
                    })

            payload = {
                "assets": assets,
                "alerts": alerts,
                "history": history   # 🔥 ADD THIS
            }

            await websocket.send_text(json.dumps(payload))
            await asyncio.sleep(2)

    except WebSocketDisconnect:
        logger.info("Maintenance client disconnected safely.")
        

@app.websocket("/ws/traffic")
async def traffic_websocket(websocket: WebSocket):
    await websocket.accept()

    try:
        while True:
            logger.info("Streaming traffic intelligence data...")

            zones, history = generate_traffic_data()

            alerts = []

            for zone in zones:
                if zone["traffic_density"] > 0.8:
                    alerts.append({
                        "type": "critical",
                        "message": f"{zone['zone_name']} heavy congestion detected"
                    })

                if zone["footfall"] > 700:
                    alerts.append({
                        "type": "anomaly",
                        "message": f"{zone['zone_name']} abnormal crowd surge"
                    })

            payload = {
                "zones": zones,
                "alerts": alerts
            }

            await websocket.send_text(json.dumps(payload))
            await asyncio.sleep(2)

    except WebSocketDisconnect:
        logger.info("Traffic client disconnected safely.")
        
@app.websocket("/ws/resource")
async def resource_websocket(websocket: WebSocket):
    await websocket.accept()

    try:
        while True:
            logger.info("Streaming water & energy data...")

            wards = generate_resource_data()

            alerts = []

            for ward in wards:

                if ward["leak_detected"]:
                    alerts.append({
                        "type": "critical",
                        "message": f"{ward['ward_name']} water leak detected"
                    })

                if ward["power_spike"]:
                    alerts.append({
                        "type": "warning",
                        "message": f"{ward['ward_name']} abnormal power surge"
                    })

                if ward["sustainability_index"] < 40:
                    alerts.append({
                        "type": "anomaly",
                        "message": f"{ward['ward_name']} low sustainability index"
                    })

            payload = {
                "wards": wards,
                "alerts": alerts
            }

            await websocket.send_text(json.dumps(payload))
            await asyncio.sleep(2)

    except WebSocketDisconnect:
        logger.info("Resource AI client disconnected safely.")