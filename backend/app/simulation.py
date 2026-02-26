import random

NUM_BINS = 5

# City centers (used for bin distribution)
cities = {
    "bengaluru": (12.9716, 77.5946),
    "delhi": (28.6139, 77.2090),
    "hyderabad": (17.3850, 78.4867),
}

# 🔥 Separate depot locations per city
depots = {
    "bengaluru": (12.9352, 77.6245),
    "delhi": (28.7041, 77.1025),
    "hyderabad": (17.4500, 78.3800),
}

current_city = "bengaluru"

# Static bin locations
bin_locations = {}
history = {i: [] for i in range(NUM_BINS)}


def initialize_bins():
    global bin_locations
    base_lat, base_lon = cities[current_city]

    bin_locations = {
        i: (
            base_lat + random.uniform(-0.01, 0.01),
            base_lon + random.uniform(-0.01, 0.01),
        )
        for i in range(NUM_BINS)
    }


def set_city(city_name: str):
    global current_city, history
    if city_name in cities:
        current_city = city_name
        history = {i: [] for i in range(NUM_BINS)}
        initialize_bins()


# Initialize once
initialize_bins()


def generate_data():
    global history

    bins = []

    for i in range(NUM_BINS):
        lat, lon = bin_locations[i]
        level = random.randint(30, 120)

        history[i].append(level)
        if len(history[i]) > 50:
            history[i].pop(0)

        bins.append(
            {
                "bin_id": i,
                "level": level,
                "location": (lat, lon),
            }
        )

    return bins, history