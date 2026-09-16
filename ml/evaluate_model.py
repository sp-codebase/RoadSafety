import pyodbc
import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix
)


# ==========================================
# 1. Load trained model
# ==========================================

MODEL_PATH = "ml/indian_road_safety_model.joblib"

pipeline = joblib.load(MODEL_PATH)

print("Model loaded successfully!")


# ==========================================
# 2. Connect to SQL Server
# ==========================================

connection = pyodbc.connect(
    "DRIVER={ODBC Driver 17 for SQL Server};"
    "SERVER=localhost;"
    "DATABASE=RoadSafetyDB;"
    "Trusted_Connection=yes;"
)

print("SQL Server connected successfully!")


# ==========================================
# 3. Load dataset from SQL Server
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
# 4. Features and target
# ==========================================

features = [
    "city",
    "state",
    "latitude",
    "longitude",
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
# 5. Create SAME train/test split
# ==========================================

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42,
    stratify=y
)

print("\nTest data:", X_test.shape)


# ==========================================
# 6. Predict
# ==========================================

print("\nGenerating predictions...")

y_pred = pipeline.predict(X_test)

print("Prediction completed!")


# ==========================================
# 7. Accuracy
# ==========================================

accuracy = accuracy_score(y_test, y_pred)

print("\n==========================================")
print("MODEL ACCURACY")
print("==========================================")

print(f"Accuracy: {accuracy:.4f}")
print(f"Accuracy: {accuracy * 100:.2f}%")


# ==========================================
# 8. Classification Report
# ==========================================

print("\n==========================================")
print("CLASSIFICATION REPORT")
print("==========================================")

print(
    classification_report(
        y_test,
        y_pred,
        digits=4
    )
)


# ==========================================
# 9. Confusion Matrix
# ==========================================

print("\n==========================================")
print("CONFUSION MATRIX")
print("==========================================")

labels = ["Minor", "Major", "Fatal"]

cm = confusion_matrix(
    y_test,
    y_pred,
    labels=labels
)

print("\n              Predicted")
print("              Minor  Major  Fatal")

print(f"Actual Minor  {cm[0][0]:5}  {cm[0][1]:5}  {cm[0][2]:5}")
print(f"Actual Major  {cm[1][0]:5}  {cm[1][1]:5}  {cm[1][2]:5}")
print(f"Actual Fatal  {cm[2][0]:5}  {cm[2][1]:5}  {cm[2][2]:5}")