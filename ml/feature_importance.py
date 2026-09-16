import joblib
import pandas as pd


# ==========================================
# 1. Load trained pipeline
# ==========================================

MODEL_PATH = "ml/indian_road_safety_model.joblib"

pipeline = joblib.load(MODEL_PATH)

print("Model loaded successfully!")


# ==========================================
# 2. Get preprocessor and Random Forest
# ==========================================

preprocessor = pipeline.named_steps["preprocessor"]
model = pipeline.named_steps["model"]


# ==========================================
# 3. Get transformed feature names
# ==========================================

feature_names = preprocessor.get_feature_names_out()


# ==========================================
# 4. Get feature importance
# ==========================================

importance = model.feature_importances_


# ==========================================
# 5. Create DataFrame
# ==========================================

importance_df = pd.DataFrame({
    "feature": feature_names,
    "importance": importance
})


# ==========================================
# 6. Sort
# ==========================================

importance_df = importance_df.sort_values(
    by="importance",
    ascending=False
)


# ==========================================
# 7. Display top 20
# ==========================================

print("\n==========================================")
print("TOP 20 FEATURE IMPORTANCES")
print("==========================================")

print(
    importance_df.head(20).to_string(index=False)
)