import { useState } from "react";

function Prediction() {
  const [formData, setFormData] = useState({
    road_type: "",
    weather: "",
    hour: "",
    lanes: "",
    traffic_signal: "",
    cause: "",
    is_peak_hour: "",
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
      const response = await fetch(
        "http://localhost:8000/api/risk-assessment",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            road_type: formData.road_type,
            weather: formData.weather,
            hour: Number(formData.hour),
            lanes: Number(formData.lanes),
            traffic_signal: Number(formData.traffic_signal),
            cause: formData.cause,
            is_peak_hour: Number(formData.is_peak_hour),
          }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Risk assessment failed.");
      }

      const data = await response.json();

      setPrediction(data);
    } catch (err) {
      console.error("Risk assessment error:", err);
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
            Assess road accident risk based on current road and environmental
            conditions
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
            <div className="form-group">
              <label>Weather Condition</label>

              <select
                name="weather"
                value={formData.weather}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Select weather
                </option>

                <option value="Clear">Clear</option>
                <option value="Rain">Rain</option>
                <option value="Fog">Fog</option>
              </select>
            </div>

            <div className="form-group">
              <label>Road Type</label>

              <select
                name="road_type"
                value={formData.road_type}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Select road type
                </option>

                <option value="Urban">Urban</option>
                <option value="Rural">Rural</option>
                <option value="Highway">Highway</option>
              </select>
            </div>

            <div className="form-group">
              <label>Number of Lanes</label>

              <select
                name="lanes"
                value={formData.lanes}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Select number of lanes
                </option>

                <option value="1">1 Lane</option>
                <option value="2">2 Lanes</option>
                <option value="3">3 Lanes</option>
                <option value="4">4 Lanes</option>
                <option value="5">5 Lanes</option>
                <option value="6">6 Lanes</option>
              </select>
            </div>

            <div className="form-group">
              <label>Traffic Signal</label>

              <select
                name="traffic_signal"
                value={formData.traffic_signal}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Select traffic signal status
                </option>

                <option value="1">Present</option>
                <option value="0">Not Present</option>
              </select>
            </div>

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

                <option value="Distraction">Distraction</option>
                <option value="Drunk Driving">Drunk Driving</option>
                <option value="Overspeeding">Overspeeding</option>
                <option value="Poor Road">Poor Road</option>
                <option value="Weather">Weather</option>
              </select>
            </div>

            <div className="form-group">
              <label>Peak Hour</label>

              <select
                name="is_peak_hour"
                value={formData.is_peak_hour}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Select peak hour status
                </option>

                <option value="1">Yes</option>
                <option value="0">No</option>
              </select>
            </div>

            <button type="submit" className="predict-button" disabled={loading}>
              {loading ? "⏳ Assessing Risk..." : "🤖 Predict Accident Risk"} 
            </button>
          </form>
        </div>

        {/* Prediction Result */}

        <div className="result-card">
          {!prediction ? (
            <div className="empty-result">
              <div className="result-icon">🤖</div>

              <h2>Risk Assessment</h2>

              <p>
                Enter the road conditions and click the prediction button to
                analyze accident risk.
              </p>
            </div>
          ) : (
            <div className="prediction-result">
              <div className="result-icon">⚠️</div>

              <p className="result-label">Risk Assessment</p>

              <h2>{prediction.risk_level}</h2>

              <div className="risk-number">
                {prediction.score}
                <span>/10 risk score</span>
              </div>

              <div className="risk-bar">
                <div
                  className="risk-fill"
                  style={{ width: `${prediction.score * 10}%` }}
                ></div>
              </div>

              <div className="result-advice">
                <strong>Risk Factors</strong>

                <ul>
                  {prediction.factors.map((factor, index) => (
                    <li key={index}>{factor}</li>
                  ))}
                </ul>
              </div>

              <div className="result-advice">
                <strong>Recommended Actions</strong>

                <ul>
                  {prediction.recommendations.map((recommendation, index) => (
                    <li key={index}>{recommendation}</li>
                  ))}
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
