import random

ZONES = [
    "Central Market",
    "Metro Station",
    "Tech Park",
    "Mall Junction",
    "Bus Terminal"
]

history = {i: [] for i in range(len(ZONES))}


def generate_traffic_data():
    global history

    results = []

    for i, zone in enumerate(ZONES):

        traffic_density = round(random.uniform(0.2, 0.95), 2)
        footfall = random.randint(100, 800)

        # 🔥 ADD THIS
        avg_speed = round(random.uniform(20, 60), 1)

        history[i].append(traffic_density)
        if len(history[i]) > 50:
            history[i].pop(0)

        results.append({
            "zone_id": i,
            "zone_name": zone,
            "traffic_density": traffic_density,
            "footfall": footfall,
            "avg_speed": avg_speed  # 🔥 IMPORTANT
        })

    return results, history