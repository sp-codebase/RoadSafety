import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestClassifier


# ==========================================
# 1. Load dataset
# ==========================================

DATA_PATH = r"C:\Users\sonal\OneDrive\Desktop\roadSafety-Project\data\clean_etp_accidents.csv"

df = pd.read_csv(DATA_PATH)

print("Dataset loaded successfully!")
print("Shape:", df.shape)


# ==========================================
# 2. Select features
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

print("\nTrain/Test split:")
print("Training:", X_train.shape)
print("Testing:", X_test.shape)


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
# 7. Complete ML Pipeline
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

print("\nTraining Random Forest...")

pipeline.fit(X_train, y_train)

print("Training completed successfully!")


# ==========================================
# 9. Basic prediction check
# ==========================================

predictions = pipeline.predict(X_test)



print("\nPrediction completed!")
print("Number of predictions:", len(predictions))

print("\nFirst 10 predictions:")
print(predictions[:10])


joblib.dump(pipeline, "etp_severity_pipeline.joblib")

print("\nModel pipeline saved successfully!")
print("Saved as: etp_severity_pipeline.joblib")

# print("\nStep 5 completed successfully!")