def calculate_savings(route_length):
    fuel_saved = route_length * 0.2
    co2_saved = fuel_saved * 2.31
    cost_saved = fuel_saved * 100

    return {
        "fuel_saved_liters": round(fuel_saved, 2),
        "co2_saved_kg": round(co2_saved, 2),
        "cost_saved_rs": round(cost_saved, 2)
    }