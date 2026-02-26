from fastapi import APIRouter
from .simulation import generate_data
from .forecasting import forecast
from .anomaly import detect_anomalies
from .optimization import optimize_route
from .sustainability import calculate_savings
from .simulation import set_city
router = APIRouter()

@router.get("/health")
def health_check():
    return {"status": "UrbanMind AI backend running"}

@router.get("/simulate")
def simulate_once():
    bins, history = generate_data()
    predictions = forecast(history)
    anomalies = detect_anomalies(history)

    overflow_bins = [b for b in bins if predictions[b["bin_id"]] > 100]
    route = optimize_route(overflow_bins) if overflow_bins else []

    route_length = len(route) * 0.5
    savings = calculate_savings(route_length)

    return {
        "bins": bins,
        "predictions": predictions,
        "anomalies": anomalies,
        "optimized_route": route,
        "sustainability": savings
    }

@router.post("/set-city/{city_name}")
def change_city(city_name: str):
    set_city(city_name)
    return {"message": f"City changed to {city_name}"}