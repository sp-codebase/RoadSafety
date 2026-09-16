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
# 1. Load both models
# ==========================================

model_a = joblib.load(
    "ml/indian_road_safety_model.joblib"
)

model_b = joblib.load(
    "ml/indian_road_safety_model_no_location.joblib"
)

print("Both models loaded successfully!")


# ==========================================
# 2. Load dataset
# ==========================================

connection = pyodbc.connect(
    "DRIVER={ODBC Driver 17 for SQL Server};"
    "SERVER=localhost;"
    "DATABASE=RoadSafetyDB;"
    "Trusted_Connection=yes;"
)

query = """
SELECT *
FROM external_data.indian_road_accidents
"""

df = pd.read_sql(query, connection)

connection.close()

print("Dataset loaded:", df.shape)


# ==========================================
# 3. Model A features
# ==========================================

features_a = [
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


# ==========================================
# 4. Model B features
# ==========================================

features_b = [
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


# ==========================================
# 5. SAME train/test split
# ==========================================

X_a = df[features_a]
X_b = df[features_b]
y = df[target]

X_a_train, X_a_test, y_train, y_test = train_test_split(
    X_a,
    y,
    test_size=0.20,
    random_state=42,
    stratify=y
)

X_b_train, X_b_test, _, _ = train_test_split(
    X_b,
    y,
    test_size=0.20,
    random_state=42,
    stratify=y
)


# ==========================================
# 6. Predictions
# ==========================================

print("\nGenerating Model A predictions...")
pred_a = model_a.predict(X_a_test)

print("Generating Model B predictions...")
pred_b = model_b.predict(X_b_test)


# ==========================================
# 7. Accuracy comparison
# ==========================================

accuracy_a = accuracy_score(y_test, pred_a)
accuracy_b = accuracy_score(y_test, pred_b)

print("\n==========================================")
print("ACCURACY COMPARISON")
print("==========================================")

print(f"Model A - With Location:    {accuracy_a:.4f} ({accuracy_a * 100:.2f}%)")
print(f"Model B - Without Location: {accuracy_b:.4f} ({accuracy_b * 100:.2f}%)")


# ==========================================
# 8. Model A report
# ==========================================

print("\n==========================================")
print("MODEL A - WITH LOCATION")
print("==========================================")

print(
    classification_report(
        y_test,
        pred_a,
        labels=["Minor", "Major", "Fatal"],
        digits=4
    )
)


# ==========================================
# 9. Model B report
# ==========================================

print("\n==========================================")
print("MODEL B - WITHOUT LOCATION")
print("==========================================")

print(
    classification_report(
        y_test,
        pred_b,
        labels=["Minor", "Major", "Fatal"],
        digits=4
    )
)


# ==========================================
# 10. Confusion matrices
# ==========================================

labels = ["Minor", "Major", "Fatal"]

cm_a = confusion_matrix(
    y_test,
    pred_a,
    labels=labels
)

cm_b = confusion_matrix(
    y_test,
    pred_b,
    labels=labels
)


print("\n==========================================")
print("MODEL A CONFUSION MATRIX")
print("==========================================")

print("              Minor  Major  Fatal")
print(f"Actual Minor  {cm_a[0][0]:5}  {cm_a[0][1]:5}  {cm_a[0][2]:5}")
print(f"Actual Major  {cm_a[1][0]:5}  {cm_a[1][1]:5}  {cm_a[1][2]:5}")
print(f"Actual Fatal  {cm_a[2][0]:5}  {cm_a[2][1]:5}  {cm_a[2][2]:5}")


print("\n==========================================")
print("MODEL B CONFUSION MATRIX")
print("==========================================")

print("              Minor  Major  Fatal")
print(f"Actual Minor  {cm_b[0][0]:5}  {cm_b[0][1]:5}  {cm_b[0][2]:5}")
print(f"Actual Major  {cm_b[1][0]:5}  {cm_b[1][1]:5}  {cm_b[1][2]:5}")
print(f"Actual Fatal  {cm_b[2][0]:5}  {cm_b[2][1]:5}  {cm_b[2][2]:5}")