import { useState } from "react";

function Prediction() {
  const [prediction, setPrediction] = useState(null);

  const handlePrediction = (event) => {
    event.preventDefault();

    // Demo prediction for now
    setPrediction({
      score: 82,
      level: "High Risk",
      message: "This combination of road conditions shows elevated accident risk.",
    });
  };

  return (
    <div className="prediction-page">

      <div className="page-header">
        <div>
          <h1>AI Risk Prediction</h1>
          <p>
            Estimate accident risk based on road and environmental conditions
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

            <div className="form-group">
              <label>Weather Condition</label>

              <select defaultValue="">
                <option value="" disabled>
                  Select weather
                </option>
                <option>Clear</option>
                <option>Rainy</option>
                <option>Foggy</option>
                <option>Cloudy</option>
              </select>
            </div>

            <div className="form-group">
              <label>Road Surface</label>

              <select defaultValue="">
                <option value="" disabled>
                  Select road surface
                </option>
                <option>Dry</option>
                <option>Wet</option>
                <option>Damaged</option>
                <option>Under Construction</option>
              </select>
            </div>

            <div className="form-group">
              <label>Junction Type</label>

              <select defaultValue="">
                <option value="" disabled>
                  Select junction type
                </option>
                <option>Not a Junction</option>
                <option>Crossroad</option>
                <option>T-Junction</option>
                <option>Roundabout</option>
              </select>
            </div>

            <div className="form-group">
              <label>Vehicle Type</label>

              <select defaultValue="">
                <option value="" disabled>
                  Select vehicle type
                </option>
                <option>Car</option>
                <option>Motorcycle</option>
                <option>Truck</option>
                <option>Bus</option>
                <option>Other</option>
              </select>
            </div>

            <div className="form-group">
              <label>Time of Occurrence</label>

              <select defaultValue="">
                <option value="" disabled>
                  Select time
                </option>
                <option>Morning</option>
                <option>Afternoon</option>
                <option>Evening</option>
                <option>Night</option>
              </select>
            </div>

            <button type="submit" className="predict-button">
              🤖 Predict Accident Risk
            </button>

          </form>

        </div>


        {/* Prediction Result */}

        <div className="result-card">

          {!prediction ? (
            <div className="empty-result">

              <div className="result-icon">🤖</div>

              <h2>Risk Prediction</h2>

              <p>
                Enter the road conditions and click the prediction button
                to analyze accident risk.
              </p>

            </div>
          ) : (
            <div className="prediction-result">

              <div className="result-icon">⚠️</div>

              <p className="result-label">Predicted Risk</p>

              <h2>{prediction.level}</h2>

              <div className="risk-number">
                {prediction.score}
                <span>/100</span>
              </div>

              <p>{prediction.message}</p>

              <div className="risk-bar">
                <div
                  className="risk-fill"
                  style={{ width: `${prediction.score}%` }}
                ></div>
              </div>

              <div className="result-advice">
                <strong>Recommended Action</strong>
                <p>
                  Consider increased monitoring and road safety measures
                  at this location.
                </p>
              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}

export default Prediction;
