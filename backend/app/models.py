from pydantic import BaseModel
from typing import List, Dict, Tuple

class BinData(BaseModel):
    bin_id: int
    level: int
    location: Tuple[float, float]

class SustainabilityMetrics(BaseModel):
    fuel_saved_liters: float
    co2_saved_kg: float
    cost_saved_rs: float

class SystemResponse(BaseModel):
    bins: List[BinData]
    predictions: Dict[int, int]
    anomalies: Dict[int, bool]
    optimized_route: List[BinData]
    sustainability: SustainabilityMetrics