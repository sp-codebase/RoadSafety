import pandas as pd

df = pd.read_csv("road_accidents_properly_cleaned (1).csv")

print("Shape:", df.shape)

print("\nColumns:")
print(df.columns.tolist())

print("\nAccident Severity:")
print(df["accident_severity"].value_counts(dropna=False))

print("\nRisk Score:")
print(df["risk_score"].value_counts(dropna=False).sort_index())

print("\nMissing values:")
print(df.isnull().sum())

print("\nDuplicate rows:", df.duplicated().sum())