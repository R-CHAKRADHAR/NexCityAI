import random

NUM_ASSETS = 6

assets = [
    "Streetlight A",
    "Streetlight B",
    "Traffic Signal 1",
    "Traffic Signal 2",
    "Water Pump 1",
    "Smart Pole 3"
]

history = {i: [] for i in range(NUM_ASSETS)}


def generate_maintenance_data():
    global history

    results = []

    for i in range(NUM_ASSETS):
        health = random.randint(30, 100)
        vibration = round(random.uniform(0.1, 1.5), 2)
        temperature = random.randint(25, 80)

        failure_probability = round(
            (100 - health) / 100 + random.uniform(0, 0.2),
            2
        )

        if failure_probability > 1:
            failure_probability = 1

        history[i].append(health)
        if len(history[i]) > 50:
            history[i].pop(0)

        results.append({
            "asset_id": i,
            "name": assets[i],
            "health_score": health,
            "vibration": vibration,
            "temperature": temperature,
            "failure_probability": failure_probability
        })

    return results, history