from pydantic import BaseModel, Field
from typing import Dict, List, Any


# ==========================================
# Prediction Request
# ==========================================

class RiskPredictionRequest(BaseModel):

    day_of_week: int = Field(
        ...,
        description="Day of week code (1-7)"
    )

    month: int = Field(
        ...,
        description="Month code (1-12)"
    )

    hour: int = Field(
        ...,
        description="Hour of accident (0-23)"
    )

    is_weekend: int = Field(
        ...,
        description="1 if weekend, 0 otherwise"
    )

    accident_location: int = Field(
        ...,
        description="Accident location code"
    )

    chainage_km: float = Field(
        ...,
        description="Accident location chainage in kilometres"
    )

    road_side: int = Field(
        ...,
        description="Road-side code"
    )

    cause: int = Field(
        ...,
        description="Accident cause code"
    )

    road_feature: int = Field(
        ...,
        description="Road feature code"
    )

    road_condition: int = Field(
        ...,
        description="Road condition code"
    )

    weather_conditions: int = Field(
        ...,
        description="Weather condition code"
    )

    vehicle_type_v1: int = Field(
        ...,
        description="Vehicle type code for vehicle 1"
    )


# ==========================================
# Prediction Response
# ==========================================

class RiskPredictionResponse(BaseModel):

    predicted_severity_code: int

    predicted_severity_label: str

    risk_level: str

    risk_score: float

    probabilities: Dict[str, float]

    top_contributing_factors: List[Dict[str, Any]]

    preventive_recommendations: List[str]



# ==========================================
# Scenario Risk Assessment Request
# ==========================================

class ScenarioRiskRequest(BaseModel):

    road_type: str = Field(
        ...,
        description="Road type: Highway, Rural, or Urban"
    )

    weather: str = Field(
        ...,
        description="Weather: Clear, Fog, or Rain"
    )

    hour: int = Field(
        ...,
        ge=0,
        le=23,
        description="Hour of the scenario (0-23)"
    )

    lanes: int = Field(
        ...,
        ge=1,
        description="Number of road lanes"
    )

    traffic_signal: int = Field(
        ...,
        description="1 if traffic signal exists, 0 otherwise"
    )

    cause: str = Field(
        ...,
        description="Primary contributing condition"
    )

    is_peak_hour: int = Field(
        ...,
        description="1 if peak hour, 0 otherwise"
    )


# ==========================================
# Scenario Risk Assessment Response
# ==========================================

class ScenarioRiskResponse(BaseModel):

    risk_level: str

    score: int

    factors: List[str]

    recommendations: List[str]    