import { useState } from "react";

function Prediction() {
  const [formData, setFormData] = useState({
    day_of_week: "",
    month: "",
    hour: "",
    is_weekend: "",
    accident_location: "",
    chainage_km: "",
    road_side: "",
    cause: "",
    road_feature: "",
    road_condition: "",
    weather_conditions: "",
    vehicle_type_v1: "",
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handlePrediction = async (event) => {
    event.preventDefault();

    setError("");
    setPrediction(null);
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8001/api/predict-risk", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          day_of_week: Number(formData.day_of_week),
          month: Number(formData.month),
          hour: Number(formData.hour),
          is_weekend: Number(formData.is_weekend),
          accident_location: Number(formData.accident_location),
          chainage_km: Number(formData.chainage_km),
          road_side: Number(formData.road_side),
          cause: Number(formData.cause),
          road_feature: Number(formData.road_feature),
          road_condition: Number(formData.road_condition),
          weather_conditions: Number(formData.weather_conditions),
          vehicle_type_v1: Number(formData.vehicle_type_v1),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Prediction failed.");
      }

      const data = await response.json();

      setPrediction(data);
    } catch (err) {
      console.error("Prediction error:", err);
      setError(err.message || "Unable to connect to the Road Safety API.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="prediction-page">
      <div className="page-header">
        <div>
          <h1>Road Safety Risk Assessment</h1>
          <p>
            Predict accident severity based on road, environmental, and vehicle
            conditions.
          </p>
        </div>
      </div>

      <div className="prediction-layout">
        {/* Prediction Form */}

        <div className="prediction-card">
          <h2>Enter Road Conditions</h2>

          <p className="card-description">
            Provide the conditions for the location you want to analyze.
          </p>

          <form onSubmit={handlePrediction}>
            {error && <p className="error-message">{error}</p>}

            {/* Day of Week */}

            <div className="form-group">
              <label>Day of Week</label>

              <select
                name="day_of_week"
                value={formData.day_of_week}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Select day
                </option>

                <option value="1">Monday</option>
                <option value="2">Tuesday</option>
                <option value="3">Wednesday</option>
                <option value="4">Thursday</option>
                <option value="5">Friday</option>
                <option value="6">Saturday</option>
                <option value="7">Sunday</option>
              </select>
            </div>

            {/* Month */}

            <div className="form-group">
              <label>Month</label>

              <select
                name="month"
                value={formData.month}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Select month
                </option>

                <option value="1">January</option>
                <option value="2">February</option>
                <option value="3">March</option>
                <option value="4">April</option>
                <option value="5">May</option>
                <option value="6">June</option>
                <option value="7">July</option>
                <option value="8">August</option>
                <option value="9">September</option>
                <option value="10">October</option>
                <option value="11">November</option>
                <option value="12">December</option>
              </select>
            </div>

            {/* Hour */}

            <div className="form-group">
              <label>Hour of Occurrence</label>

              <input
                type="number"
                name="hour"
                value={formData.hour}
                onChange={handleChange}
                min="0"
                max="23"
                placeholder="Enter hour (0-23)"
                required
              />
            </div>

            {/* Weekend */}

            <div className="form-group">
              <label>Weekend</label>

              <select
                name="is_weekend"
                value={formData.is_weekend}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Select weekend status
                </option>

                <option value="1">Yes</option>
                <option value="0">No</option>
              </select>
            </div>

            {/* Accident Location */}

            <div className="form-group">
              <label>Accident Location</label>

              <select
                name="accident_location"
                value={formData.accident_location}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Select accident location
                </option>

                <option value="1">Urban</option>
                <option value="2">Rural</option>
              </select>
            </div>

            {/* Chainage */}

            <div className="form-group">
              <label>Chainage (km)</label>

              <input
                type="number"
                name="chainage_km"
                value={formData.chainage_km}
                onChange={handleChange}
                min="0"
                step="0.1"
                placeholder="Enter chainage in km"
                required
              />
            </div>

            {/* Road Side */}

            <div className="form-group">
              <label>Road Side</label>

              <select
                name="road_side"
                value={formData.road_side}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Select road side
                </option>

                <option value="1">LHS</option>
                <option value="2">RHS</option>
              </select>
            </div>

            {/* Primary Cause */}

            <div className="form-group">
              <label>Primary Cause</label>

              <select
                name="cause"
                value={formData.cause}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Select primary cause
                </option>

                <option value="1">Drunken</option>
                <option value="2">Overspeeding</option>
                <option value="3">Vehicle out of control</option>
                <option value="4">Other cause category (Code 4)</option>
                <option value="5">Other cause category (Code 5)</option>
                <option value="6">Other cause category (Code 6)</option>
                <option value="8">Other cause category (Code 8)</option>
              </select>
            </div>

            {/* Road Feature */}

            <div className="form-group">
              <label>Road Feature</label>

              <select
                name="road_feature"
                value={formData.road_feature}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Select road feature
                </option>

                <option value="1">Single lane</option>
                <option value="2">Two lanes</option>
                <option value="3">Three+ lanes, no central divider</option>
                <option value="4">Four+ lanes, with central divider</option>
              </select>
            </div>

            {/* Road Condition */}

            <div className="form-group">
              <label>Road Condition</label>

              <select
                name="road_condition"
                value={formData.road_condition}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Select road condition
                </option>

                <option value="1">Straight Road</option>
                <option value="2">Slight Curve</option>
                <option value="3">Sharp Curve</option>
                <option value="4">Flat Road</option>
                <option value="5">Gentle Incline</option>
                <option value="6">Steep Incline</option>
                <option value="7">Hump</option>
                <option value="8">Dip</option>
              </select>
            </div>

            {/* Weather */}

            <div className="form-group">
              <label>Weather Condition</label>

              <select
                name="weather_conditions"
                value={formData.weather_conditions}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Select weather condition
                </option>

                <option value="1">Fine</option>
                <option value="2">Mist/Fog</option>
                <option value="3">Cloud</option>
                <option value="4">Light Rain</option>
                <option value="5">Heavy Rain</option>
                <option value="6">Hail/Sleet</option>
                <option value="7">Snow</option>
                <option value="8">Strong Wind</option>
                <option value="9">Dust Storm</option>
                <option value="10">Very Hot</option>
                <option value="11">Very Cold</option>
                <option value="12">Other</option>
              </select>
            </div>

            {/* Vehicle Type */}

            <div className="form-group">
              <label>Vehicle Type</label>

              <select
                name="vehicle_type_v1"
                value={formData.vehicle_type_v1}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Select vehicle type
                </option>

                <option value="1">Car/Jeep/Van</option>
                <option value="2">SUV</option>
                <option value="3">Bus</option>
                <option value="4">Mini Bus</option>
                <option value="5">Truck</option>
                <option value="6">Two Wheeler</option>
                <option value="7">Three Wheeler</option>
                <option value="8">Cycle</option>
                <option value="9">Pedestrian</option>
                <option value="10">Tractor</option>
                <option value="11">Unknown</option>
                <option value="12">Animal</option>
                <option value="14">LCV</option>
                <option value="15">MAV</option>
              </select>
            </div>

            {/* Submit Button */}

            <button type="submit" className="predict-button" disabled={loading}>
              {loading ? "⏳ Predicting..." : "🤖 Predict Accident Severity"}
            </button>
          </form>
        </div>

        {/* Prediction Result */}

        <div className="result-card">
          {!prediction ? (
            <div className="empty-result">
              <div className="result-icon">🤖</div>

              <h2>AI Prediction</h2>

              <p>
                Enter the road conditions and click the prediction button to
                predict accident severity.
              </p>
            </div>
          ) : (
            <div className="prediction-result">
              <div className="result-icon">🤖</div>

              <p className="result-label">AI Prediction</p>

              <h2>{prediction.predicted_severity_label}</h2>

              <p>
                Predicted accident severity based on the conditions provided.
              </p>

              <div className="risk-number">
                {prediction.risk_score}
                <span>% confidence</span>
              </div>

              <div className="risk-bar">
                <div
                  className="risk-fill"
                  style={{
                    width: `${prediction.risk_score}%`,
                  }}
                ></div>
              </div>

              <p className="result-label">
                Risk Level: <strong>{prediction.risk_level}</strong>
              </p>

              <div className="result-advice">
                <strong>Prediction Probabilities</strong>

                <ul>
                  {Object.entries(prediction.probabilities).map(
                    ([severity, probability]) => (
                      <li key={severity}>
                        {severity}: {(probability * 100).toFixed(1)}%
                      </li>
                    ),
                  )}
                </ul>
              </div>

              <div className="result-advice">
                <strong>Recommended Actions</strong>

                <ul>
                  {prediction.preventive_recommendations.map(
                    (recommendation, index) => (
                      <li key={index}>{recommendation}</li>
                    ),
                  )}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Prediction;
