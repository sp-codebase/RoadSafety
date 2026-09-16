from risk_engine import assess_risk


result = assess_risk(
    road_type="Highway",
    weather="Rain",
    hour=18,
    lanes=4,
    traffic_signal=0,
    cause="Overspeeding",
    is_peak_hour=1
)


print("Risk Level:", result["risk_level"])
print("Score:", result["score"])

print("\nFactors:")

for factor in result["factors"]:
    print("-", factor)


print("\nRecommendations:")

for recommendation in result["recommendations"]:
    print("-", recommendation)