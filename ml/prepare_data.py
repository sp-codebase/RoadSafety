import pandas as pd

from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder

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


# ==========================================
# 3. Create X and y
# ==========================================

X = df[features]
y = df[target]

# ==========================================
# 3.5 Train/Test Split
# ==========================================

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42,
    stratify=y
)

print("\nTrain/Test split completed!")

print("Training features:", X_train.shape)
print("Testing features:", X_test.shape)

print("Training target:", y_train.shape)
print("Testing target:", y_test.shape)


print("\nFeatures:")
print(X.columns.tolist())

print("\nTarget:")
print(target)

print("\nX shape:", X.shape)
print("y shape:", y.shape)


# ==========================================
# 4. Define feature types
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
# 5. Create preprocessing transformer
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


print("\nPreprocessing pipeline created successfully!")

print("\nCategorical features:")
for column in categorical_features:
    print("-", column)

print("\nNumeric features:")
for column in numeric_features:
    print("-", column)

# print("\nStep 3 completed successfully!")