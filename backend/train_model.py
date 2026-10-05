import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import r2_score, mean_squared_error
import joblib
import os

print("Generating realistic synthetic dataset for Heat Mitigation...")
# List of real cities with lat/lon
cities = [
    {"city": "New Delhi", "lat": 28.6139, "lon": 77.2090, "base_temp": 40.0},
    {"city": "Phoenix", "lat": 33.4484, "lon": -112.0740, "base_temp": 42.0},
    {"city": "Cairo", "lat": 30.0444, "lon": 31.2357, "base_temp": 39.0},
    {"city": "Athens", "lat": 37.9838, "lon": 23.7275, "base_temp": 35.0},
    {"city": "Tokyo", "lat": 35.6762, "lon": 139.6503, "base_temp": 33.0},
    {"city": "Mumbai", "lat": 19.0760, "lon": 72.8777, "base_temp": 35.0},
    {"city": "Dubai", "lat": 25.2048, "lon": 55.2708, "base_temp": 41.0},
    {"city": "Riyadh", "lat": 24.7136, "lon": 46.6753, "base_temp": 43.0},
    {"city": "Dallas", "lat": 32.7767, "lon": -96.7970, "base_temp": 38.0},
    {"city": "Madrid", "lat": 40.4168, "lon": -3.7038, "base_temp": 36.0}
]

# Generate rows
data = []
np.random.seed(42)

for city in cities:
    for _ in range(30): # 30 samples per city with varying conditions
        current_temp = city["base_temp"] + np.random.normal(0, 3)
        green_cover_pct = np.random.uniform(5, 50)
        
        # Physics-informed simulation formula:
        # Higher green cover provides cooling. Higher temp means more potential cooling from evaporation.
        true_cooling = (green_cover_pct * 0.12) + (current_temp * 0.05) - 1.5
        noise = np.random.normal(0, 0.4)
        
        temp_drop = max(0.1, true_cooling + noise) # ensuring drop is positive
        
        data.append({
            "region": city["city"],
            "lat": city["lat"],
            "lon": city["lon"],
            "current_temp": round(current_temp, 2),
            "green_cover_increase_pct": round(green_cover_pct, 2),
            "temp_drop": round(temp_drop, 2)
        })

df = pd.DataFrame(data)
csv_path = "dataset_heat_mitigation.csv"
df.to_csv(csv_path, index=False)
print(f"Dataset generated and saved to {csv_path} (Shape: {df.shape})")

# Feature selection
X = df[['lat', 'lon', 'current_temp', 'green_cover_increase_pct']]
y = df['temp_drop']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

print("Training RandomForest Regressor...")
model = RandomForestRegressor(n_estimators=100, random_state=42, max_depth=10)
model.fit(X_train, y_train)

y_pred = model.predict(X_test)
r2 = r2_score(y_test, y_pred)
mse = mean_squared_error(y_test, y_pred)

print("-" * 30)
print(f"Model Evaluation Metrics:")
print(f"R2 Score: {r2:.4f} (Accuracy explained by physics params)")
print(f"MSE: {mse:.4f}")
print("-" * 30)

model_path = "lst_model.pkl"
joblib.dump(model, model_path)
print(f"Trained model saved to {model_path}")
