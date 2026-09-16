import pyodbc
import pandas as pd

# ==========================================
# 1. Connect to SQL Server
# ==========================================

connection = pyodbc.connect(
    "DRIVER={ODBC Driver 17 for SQL Server};"
    "SERVER=localhost;"
    "DATABASE=RoadSafetyDB;"
    "Trusted_Connection=yes;"
)

# ==========================================
# 2. Load data
# ==========================================

query = """
SELECT *
FROM external_data.indian_road_accidents
"""

df = pd.read_sql(query, connection)

connection.close()

print("Dataset:", df.shape)


# ==========================================
# 3. Severity distribution
# ==========================================

print("\n========== SEVERITY ==========")
print(df["accident_severity"].value_counts())
print(
    df["accident_severity"]
    .value_counts(normalize=True)
    .mul(100)
    .round(2)
)


# ==========================================
# 4. Severity vs Cause
# ==========================================

print("\n========== SEVERITY vs CAUSE ==========")

print(
    pd.crosstab(
        df["cause"],
        df["accident_severity"],
        normalize="index"
    ).round(3)
)


# ==========================================
# 5. Severity vs Weather
# ==========================================

print("\n========== SEVERITY vs WEATHER ==========")

print(
    pd.crosstab(
        df["weather"],
        df["accident_severity"],
        normalize="index"
    ).round(3)
)


# ==========================================
# 6. Severity vs Road Type
# ==========================================

print("\n========== SEVERITY vs ROAD TYPE ==========")

print(
    pd.crosstab(
        df["road_type"],
        df["accident_severity"],
        normalize="index"
    ).round(3)
)


# ==========================================
# 7. Severity vs Peak Hour
# ==========================================

print("\n========== SEVERITY vs PEAK HOUR ==========")

print(
    pd.crosstab(
        df["is_peak_hour"],
        df["accident_severity"],
        normalize="index"
    ).round(3)
)


# ==========================================
# 8. Severity vs Traffic Signal
# ==========================================

print("\n========== SEVERITY vs TRAFFIC SIGNAL ==========")

print(
    pd.crosstab(
        df["traffic_signal"],
        df["accident_severity"],
        normalize="index"
    ).round(3)
)


# ==========================================
# 9. Average numeric values by severity
# ==========================================

print("\n========== NUMERIC FEATURES ==========")

print(
    df.groupby("accident_severity")[
        [
            "hour",
            "lanes",
            "temperature",
            "casualties",
            "vehicles_involved"
        ]
    ].mean().round(2)
)