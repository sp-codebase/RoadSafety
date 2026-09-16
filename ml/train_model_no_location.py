import pyodbc
import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestClassifier


# ==========================================
# 1. Connect to SQL Server
# ==========================================

connection = pyodbc.connect(
    "DRIVER={ODBC Driver 17 for SQL Server};"
    "SERVER=localhost;"
    "DATABASE=RoadSafetyDB;"
    "Trusted_Connection=yes;"
)

print("SQL Server connected successfully!")


# ==========================================
# 2. Load dataset
# ==========================================

query = """
SELECT *
FROM external_data.indian_road_accidents
"""

df = pd.read_sql(query, connection)

connection.close()

print("Dataset loaded successfully!")
print("Shape:", df.shape)


# ==========================================
# 3. Select features
# ==========================================

# Latitude and longitude intentionally removed
features = [
    "city",
    "state",
    "hour",
    "day_of_week",
    "is_weekend",
    "road_type",
    "lanes",
    "traffic_signal",
    "weather",
    "temperature",
    "cause",
    "is_peak_hour"
]

target = "accident_severity"

X = df[features]
y = df[target]


# ==========================================
# 4. Train/Test Split
# ==========================================

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42,
    stratify=y
)

print("\nTrain/Test split:")
print("Training:", X_train.shape)
print("Testing:", X_test.shape)


# ==========================================
# 5. Feature types
# ==========================================

numeric_features = [
    "hour",
    "lanes",
    "temperature"
]

categorical_features = [
    "city",
    "state",
    "day_of_week",
    "is_weekend",
    "road_type",
    "traffic_signal",
    "weather",
    "cause",
    "is_peak_hour"
]


# ==========================================
# 6. Preprocessor
# ==========================================

preprocessor = ColumnTransformer(
    transformers=[
        (
            "categorical",
            OneHotEncoder(handle_unknown="ignore"),
            categorical_features
        ),
        (
            "numeric",
            "passthrough",
            numeric_features
        )
    ]
)


# ==========================================
# 7. Random Forest
# ==========================================

model = RandomForestClassifier(
    n_estimators=300,
    random_state=42,
    class_weight="balanced",
    n_jobs=-1
)


# ==========================================
# 8. Pipeline
# ==========================================

pipeline = Pipeline(
    steps=[
        ("preprocessor", preprocessor),
        ("model", model)
    ]
)


# ==========================================
# 9. Train
# ==========================================

print("\nTraining Random Forest without coordinates...")

pipeline.fit(X_train, y_train)

print("Training completed successfully!")


# ==========================================
# 10. Prediction
# ==========================================

predictions = pipeline.predict(X_test)

print("\nPrediction completed!")
print("Number of predictions:", len(predictions))


# ==========================================
# 11. Save Model B
# ==========================================

MODEL_PATH = "ml/indian_road_safety_model_no_location.joblib"

joblib.dump(pipeline, MODEL_PATH)

print("\nModel saved successfully!")
print("Saved as:", MODEL_PATH)