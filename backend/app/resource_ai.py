import random

WARDS = [
    "Ward 1 - Residential",
    "Ward 2 - Commercial",
    "Ward 3 - Industrial",
    "Ward 4 - Tech Zone",
    "Ward 5 - Mixed Use"
]

# Store sustainability history for trend charts
history = {i: [] for i in range(len(WARDS))}


def generate_resource_data():
    global history

    results = []

    for i, ward in enumerate(WARDS):

        # Simulated consumption values
        water_usage = random.randint(3000, 9000)      # KL
        energy_usage = random.randint(5000, 15000)    # kWh

        # AI-based event detection
        leak_detected = random.random() < 0.15
        power_spike = random.random() < 0.20

        # Simulated carbon emission calculation
        carbon_emission = round(energy_usage * 0.0009, 2)

        # Sustainability index logic (AI weighted score)
        sustainability_index = round(
            100 - (
                (water_usage / 10000) * 40 +
                (energy_usage / 20000) * 40 +
                (carbon_emission / 10) * 20
            ),
            2
        )

        # Clamp minimum value
        if sustainability_index < 0:
            sustainability_index = 0

        # Store history for charts
        history[i].append(sustainability_index)
        if len(history[i]) > 50:
            history[i].pop(0)

        results.append({
            "ward_id": i,
            "ward_name": ward,
            "water_usage": water_usage,
            "energy_usage": energy_usage,
            "carbon_emission": carbon_emission,
            "sustainability_index": sustainability_index,
            "leak_detected": leak_detected,
            "power_spike": power_spike
        })

    return results