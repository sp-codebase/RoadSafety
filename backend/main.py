"""
Road Safety Intelligence API
"""

import os
import joblib
import pandas as pd

from ml.risk_engine import assess_risk

from sqlalchemy import text
from backend.database import engine

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

from backend.schemas import (
    RiskPredictionRequest,
    RiskPredictionResponse,
    ScenarioRiskRequest,
    ScenarioRiskResponse
)

from ml.risk_engine import assess_risk


# ==========================================
# Create FastAPI application
# ==========================================

app = FastAPI(
    title="Road Safety Intelligence API",
    description="AI-based road safety and accident intelligence system",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",
],
       
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==========================================
# Load ML Pipeline
# ==========================================

BASE_DIR = os.path.dirname(
    os.path.dirname(
        os.path.abspath(__file__)
    )
)

MODEL_PATH = os.path.join(
    BASE_DIR,
    "etp_severity_pipeline.joblib"
)

model = None

try:
    model = joblib.load(MODEL_PATH)

    print("ML pipeline loaded successfully!")
    print("Model path:", MODEL_PATH)

except Exception as e:

    print("Failed to load ML pipeline.")
    print("Error:", e)


# ==========================================
# Health Check
# ==========================================

@app.get("/api/health")
def health_check():

    return {
        "status": "online",
        "model_loaded": model is not None
    }

# ==========================================
# Scenario-Based Risk Assessment
# ==========================================

@app.post("/api/risk-assessment")
def risk_assessment(req: ScenarioRiskRequest):

    try:

        result = assess_risk(
            road_type=req.road_type,
            weather=req.weather,
            hour=req.hour,
            lanes=req.lanes,
            traffic_signal=req.traffic_signal,
            cause=req.cause,
            is_peak_hour=req.is_peak_hour
        )

        return result

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=f"Risk assessment failed: {str(e)}"
        )

# ==========================================
# Accident Severity Prediction
# ==========================================

@app.post(
    "/api/predict-risk",
    response_model=RiskPredictionResponse
)
def predict_risk(req: RiskPredictionRequest):

    # --------------------------------------
    # Check model
    # --------------------------------------

    if model is None:

        raise HTTPException(
            status_code=503,
            detail="ML model is not loaded."
        )


    # --------------------------------------
    # Convert API input into model input
    # --------------------------------------

    input_data = pd.DataFrame([{

        "Day_of_Week": req.day_of_week,

        "Month": req.month,

        "Hour": req.hour,

        "IsWeekend": req.is_weekend,

        "Accident_Location_A": req.accident_location,

        "Accident_Location_A_Chainage_km": req.chainage_km,

        "Accident_Location_A_Chainage_km_RoadSide": req.road_side,

        "Causes_D": req.cause,

        "Road_Feature_E": req.road_feature,

        "Road_Condition_F": req.road_condition,

        "Weather_Conditions_H": req.weather_conditions,

        "Vehicle_Type_Involved_J_V1": req.vehicle_type_v1

    }])


    # --------------------------------------
    # Make prediction
    # --------------------------------------

    predicted_code = int(
        model.predict(input_data)[0]
    )


    # --------------------------------------
    # Get probabilities
    # --------------------------------------

    probabilities_array = model.predict_proba(
        input_data
    )[0]


    # --------------------------------------
    # Severity labels
    # --------------------------------------

    severity_labels = {

        1: "Fatal",

        2: "Grievous",

        3: "Minor",

        4: "No Injury"

    }


    predicted_label = severity_labels.get(
        predicted_code,
        "Unknown"
    )


    # --------------------------------------
    # Convert probabilities to dictionary
    # --------------------------------------

    probabilities = {}

    for code, probability in zip(
        model.classes_,
        probabilities_array
    ):

        label = severity_labels.get(
            int(code),
            f"Class {code}"
        )

        probabilities[label] = round(
            float(probability),
            4
        )


    # --------------------------------------
    # Basic risk level
    # --------------------------------------

    if predicted_code == 1:

        risk_level = "HIGH RISK"

    elif predicted_code == 2:

        risk_level = "MEDIUM RISK"

    elif predicted_code == 3:

        risk_level = "MEDIUM RISK"

    else:

        risk_level = "LOW RISK"


    # --------------------------------------
    # Temporary risk score
    # --------------------------------------

    risk_score = round(
        max(probabilities_array) * 100,
        2
    )


    # --------------------------------------
    # Temporary factors
    # --------------------------------------

    top_factors = []


    # --------------------------------------
    # Temporary recommendations
    # --------------------------------------

    recommendations = [
        "Prediction is based on historical Indian highway accident patterns."
    ]


    # --------------------------------------
    # Return response
    # --------------------------------------

    return {

        "predicted_severity_code": predicted_code,

        "predicted_severity_label": predicted_label,

        "risk_level": risk_level,

        "risk_score": risk_score,

        "probabilities": probabilities,

        "top_contributing_factors": top_factors,

        "preventive_recommendations": recommendations

    }


# ==========================================
# Potential Hotspots
# ==========================================

@app.get("/api/hotspots")
def get_hotspots(
    state: str | None = Query(
        default=None,
        description="Filter hotspots by state"
    ),
    city: str | None = Query(
        default=None,
        description="Filter hotspots by city"
    )
):

    query = text("""
            
        WITH cluster_locations AS (

            SELECT
                cluster_id,
                state_ut,
                "Million_Plus_City",
                COUNT(*) AS location_crashes

            FROM clean.news_crashes_with_clusters

            WHERE cluster_id <> -1

            GROUP BY
                cluster_id,
                state_ut,
                "Million_Plus_City"
        ),

        ranked_locations AS (

            SELECT
                cluster_id,
                state_ut,
                "Million_Plus_City",

                ROW_NUMBER() OVER (
                    PARTITION BY cluster_id
                    ORDER BY
                        location_crashes DESC,
                        CASE
                            WHEN "Million_Plus_City" = 'Nil' THEN 1
                            ELSE 0
                        END,
                        "Million_Plus_City"
                ) AS location_rank

            FROM cluster_locations
        )

        SELECT
            c.cluster_id,

            r.state_ut AS state,

            r."Million_Plus_City" AS city,

            COUNT(*) AS crash_count,

            SUM(c."Killed") AS total_killed,

            SUM(c."Injured") AS total_injured,

            CAST(
                SUM(c."Killed") * 100.0
                / NULLIF(COUNT(*), 0)
                AS DECIMAL(10,2)
            ) AS fatalities_per_100_crashes,

            CAST(AVG(c.latitude) AS FLOAT) AS latitude,

            CAST(AVG(c.longitude) AS FLOAT) AS longitude

           FROM clean.news_crashes_with_clusters AS c

           INNER JOIN ranked_locations AS r
            ON c.cluster_id = r.cluster_id
            AND r.location_rank = 1

           WHERE c.cluster_id <> -1

           GROUP BY
            c.cluster_id,
            r.state_ut,
            r."Million_Plus_City"

            ORDER BY
            crash_count DESC
    
    """)

    try:

        with engine.connect() as connection:

            result = connection.execute(query)

            hotspots = []

            for row in result:

                hotspots.append({
                    "cluster_id": int(row.cluster_id),
                    "state": row.state,
                    "city": row.city,
                    "crash_count": int(row.crash_count),
                    "total_killed": int(row.total_killed or 0),
                    "total_injured": int(row.total_injured or 0),
                    "fatalities_per_100_crashes": float(
                        row.fatalities_per_100_crashes or 0
                    ),
                    "latitude": float(row.latitude),
                    "longitude": float(row.longitude)
                })

                # --------------------------------------
        # Calculate hotspot priority score
        # --------------------------------------

        hotspots_df = pd.DataFrame(hotspots)

        hotspots_df["crash_percentile"] = (
            hotspots_df["crash_count"]
            .rank(pct=True) * 100
        )

        hotspots_df["fatality_percentile"] = (
            hotspots_df["total_killed"]
            .rank(pct=True) * 100
        )

        hotspots_df["injury_percentile"] = (
            hotspots_df["total_injured"]
            .rank(pct=True) * 100
        )

        hotspots_df["hotspot_score"] = (
            hotspots_df["crash_percentile"] * 0.50
            + hotspots_df["fatality_percentile"] * 0.30
            + hotspots_df["injury_percentile"] * 0.20
        )

        # --------------------------------------
        # Assign hotspot risk level
        # --------------------------------------

        def get_hotspot_risk(score):

            if score > 70:
                return "HIGH"

            elif score >= 40:
                return "MEDIUM"

            else:
                return "LOW"

        hotspots_df["risk_level"] = (
            hotspots_df["hotspot_score"]
            .apply(get_hotspot_risk)
        )

                # --------------------------------------
        # Apply State / City filters
        # AFTER global scoring
        # --------------------------------------

        if state is not None:
            state = state.strip()
            hotspots_df = hotspots_df[
                hotspots_df["state"].str.strip().str.lower()
                == state.lower()
            ]

        if city is not None:
            city = city.strip()
            hotspots_df = hotspots_df[
                hotspots_df["city"].str.strip().str.lower()
                == city.lower()
            ]

        # --------------------------------------
        # Prepare final response
        # --------------------------------------

        final_hotspots = []

        for _, hotspot in hotspots_df.iterrows():

            final_hotspots.append({
                "cluster_id": int(hotspot["cluster_id"]),
                "state": hotspot["state"],
                "city": hotspot["city"],
                "crash_count": int(hotspot["crash_count"]),
                "total_killed": int(hotspot["total_killed"]),
                "total_injured": int(hotspot["total_injured"]),
                "fatalities_per_100_crashes": float(
                    hotspot["fatalities_per_100_crashes"]
                ),
                "latitude": float(hotspot["latitude"]),
                "longitude": float(hotspot["longitude"]),
                "hotspot_score": round(
                    float(hotspot["hotspot_score"]),
                    2
                ),
                "risk_level": hotspot["risk_level"]
            })

        return {
            "total_hotspots": len(final_hotspots),
            "hotspots": final_hotspots
        }
    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch hotspot data: {str(e)}"
        )



# ==========================================
# State and City Locations
# ==========================================

@app.get("/api/locations")
def get_locations(
    state: str | None = Query(
        default=None,
        description="Get cities for a selected state"
    )
):

    try:

        with engine.connect() as connection:

            # --------------------------------------
            # Get states
            # --------------------------------------

            state_query = text("""
                SELECT DISTINCT
                    state_ut
                FROM clean.news_crashes_with_clusters
                WHERE state_ut IS NOT NULL
                  AND LTRIM(RTRIM(state_ut)) <> ''
                ORDER BY state_ut
            """)

            state_result = connection.execute(state_query)

            states = [
                row.state_ut.strip()
                for row in state_result
                if row.state_ut
            ]


            # --------------------------------------
            # Get cities
            # --------------------------------------

            cities = []

            if state is not None:

                state = state.strip()

                city_query = text("""
                    SELECT DISTINCT
                        Million_Plus_City
                    FROM clean.news_crashes_with_clusters
                    WHERE state_ut = :state
                      AND Million_Plus_City IS NOT NULL
                      AND LTRIM(RTRIM(Million_Plus_City)) <> ''
                      AND LTRIM(RTRIM(Million_Plus_City)) <> 'Nil'
                    ORDER BY Million_Plus_City
                """)

                city_result = connection.execute(
                    city_query,
                    {"state": state}
                )

                cities = [
                    row.Million_Plus_City.strip()
                    for row in city_result
                    if row.Million_Plus_City
                ]


        return {
            "states": states,
            "cities": cities
        }


    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch location data: {str(e)}"
        )
    