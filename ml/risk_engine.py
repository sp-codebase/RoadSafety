# ==========================================
# Road Safety Scenario Risk Engine
# ==========================================

def assess_risk(
    road_type,
    weather,
    hour,
    lanes,
    traffic_signal,
    cause,
    is_peak_hour
):
    """
    Scenario-based road safety assessment.

    This is NOT a prediction that an accident will happen.
    It evaluates whether the supplied conditions contain
    historically relevant higher-risk factors.
    """

    score = 0
    factors = []
    recommendations = []


    # ==========================================
    # 1. Road type
    # ==========================================

    if road_type == "Highway":
        score += 2
        factors.append("Highway environment")
        recommendations.append(
            "Maintain a safe speed and adequate following distance."
        )

    elif road_type == "Rural":
        score += 1
        factors.append("Rural road environment")


    # ==========================================
    # 2. Weather
    # ==========================================

    if weather == "Rain":
        score += 2
        factors.append("Rainy conditions")
        recommendations.append(
            "Reduce speed and increase following distance on wet roads."
        )

    elif weather == "Fog":
        score += 2
        factors.append("Foggy conditions")
        recommendations.append(
            "Use appropriate lights and increase visibility distance."
        )


    # ==========================================
    # 3. Time
    # ==========================================

    if hour >= 18 or hour <= 5:
        score += 1
        factors.append("Low-light/night-time period")
        recommendations.append(
            "Exercise additional caution during low-light conditions."
        )


    # ==========================================
    # 4. Lanes
    # ==========================================

    if lanes >= 4:
        score += 1
        factors.append("Multi-lane road")


    # ==========================================
    # 5. Traffic signal
    # ==========================================

    if traffic_signal == 0:
        score += 1
        factors.append("No traffic signal")


    # ==========================================
    # 6. Cause
    # ==========================================

    if cause == "Overspeeding":
        score += 2
        factors.append("Overspeeding")
        recommendations.append(
            "Reduce speed and follow the posted speed limit."
        )

    elif cause == "Drunk Driving":
        score += 2
        factors.append("Drunk-driving condition")
        recommendations.append(
            "Never drive under the influence of alcohol or drugs."
        )

    elif cause == "Poor Road":
        score += 1
        factors.append("Poor road condition")
        recommendations.append(
            "Reduce speed and watch for road-surface hazards."
        )

    elif cause == "Distraction":
        score += 1
        factors.append("Driver distraction")
        recommendations.append(
            "Avoid mobile-phone use and other distractions while driving."
        )

    elif cause == "Weather":
        score += 1
        factors.append("Weather-related condition")


    # ==========================================
    # 7. Peak hour
    # ==========================================

    if is_peak_hour == 1:
        score += 1
        factors.append("Peak-hour period")
        recommendations.append(
            "Allow extra travel time and maintain safe spacing."
        )


    # ==========================================
    # 8. Convert score to risk level
    # ==========================================

    if score >= 7:
        risk_level = "Elevated"

    elif score >= 4:
        risk_level = "Moderate"

    else:
        risk_level = "Lower"


    # ==========================================
    # 9. Remove duplicate recommendations
    # ==========================================

    recommendations = list(dict.fromkeys(recommendations))


    # ==========================================
    # 10. Return result
    # ==========================================

    return {
        "risk_level": risk_level,
        "score": score,
        "factors": factors,
        "recommendations": recommendations
    }