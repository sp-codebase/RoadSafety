import pandas as pd

from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix
)


# ==========================================
# 1. Load dataset
# ==========================================

DATA_PATH = r"C:\Users\sonal\OneDrive\Desktop\roadSafety-Project\data\clean_etp_accidents.csv"

df = pd.read_csv(DATA_PATH)

print("Dataset loaded successfully!")
print("Shape:", df.shape)


# ==========================================
# 2. Features and target
# ==========================================

features = [
    "Day_of_Week",
    "Month",
    "Hour",
    "IsWeekend",
    "Accident_Location_A",
    "Accident_Location_A_Chainage_km",
    "Accident_Location_A_Chainage_km_RoadSide",
    "Causes_D",
    "Road_Feature_E",
    "Road_Condition_F",
    "Weather_Conditions_H",
    "Vehicle_Type_Involved_J_V1"
]

target = "Accident_Severity_C"

X = df[features]
y = df[target]


# ==========================================
# 3. Train/Test Split
# ==========================================

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42,
    stratify=y
)


# ==========================================
# 4. Feature types
# ==========================================

numeric_features = [
    "Hour",
    "Accident_Location_A_Chainage_km"
]

categorical_features = [
    "Day_of_Week",
    "Month",
    "IsWeekend",
    "Accident_Location_A",
    "Accident_Location_A_Chainage_km_RoadSide",
    "Causes_D",
    "Road_Feature_E",
    "Road_Condition_F",
    "Weather_Conditions_H",
    "Vehicle_Type_Involved_J_V1"
]


# ==========================================
# 5. Preprocessor
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
# 6. Random Forest
# ==========================================

model = RandomForestClassifier(
    n_estimators=300,
    random_state=42,
    class_weight="balanced",
    n_jobs=-1
)


# ==========================================
# 7. Complete pipeline
# ==========================================

pipeline = Pipeline(
    steps=[
        ("preprocessor", preprocessor),
        ("model", model)
    ]
)


# ==========================================
# 8. Train
# ==========================================

print("\nTraining model...")

pipeline.fit(X_train, y_train)

print("Training completed!")


# ==========================================
# 9. Predict test data
# ==========================================

y_pred = pipeline.predict(X_test)


# ==========================================
# 10. Accuracy
# ==========================================

accuracy = accuracy_score(y_test, y_pred)

print("\n==========================================")
print("MODEL ACCURACY")
print("==========================================")

print(f"Accuracy: {accuracy:.4f}")
print(f"Accuracy: {accuracy * 100:.2f}%")


# ==========================================
# 11. Classification Report
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
# 12. Confusion Matrix
# ==========================================

print("\n==========================================")
print("CONFUSION MATRIX")
print("==========================================")

cm = confusion_matrix(y_test, y_pred)

print(cm)


# print("\nStep 6 evaluation completed!")