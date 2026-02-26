from sklearn.ensemble import IsolationForest
import numpy as np

def detect_anomalies(history):
    anomalies = {}

    for bin_id, values in history.items():
        if len(values) < 10:
            anomalies[bin_id] = False
            continue

        X = np.array(values).reshape(-1, 1)
        model = IsolationForest(contamination=0.1)
        model.fit(X)
        prediction = model.predict([[values[-1]]])

        anomalies[bin_id] = bool(prediction[0] == -1)

    return anomalies