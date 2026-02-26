import math

def distance(p1, p2):
    return math.sqrt((p1[0] - p2[0])**2 + (p1[1] - p2[1])**2)

def optimize_route(bins, depot):
    if not bins:
        return [], 0

    remaining = bins.copy()
    route = []
    current_location = depot
    total_distance = 0

    while remaining:
        nearest = min(
            remaining,
            key=lambda x: distance(current_location, x["location"])
        )

        total_distance += distance(current_location, nearest["location"])
        route.append(nearest)
        current_location = nearest["location"]
        remaining.remove(nearest)

    # Return to depot
    total_distance += distance(current_location, depot)

    return route, total_distance