import numpy as np

def forecast(history):
    predictions = {}

    for bin_id, values in history.items():
        if len(values) < 5:
            predictions[bin_id] = values[-1]
        else:
            predictions[bin_id] = int(np.mean(values[-5:]))

    return predictions