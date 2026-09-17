import { useMemo, useState } from "react";
import "./Prediction.css";

/* =========================================================
   STATES + UNION TERRITORIES
   ========================================================= */

const regions = [
  "Rajasthan",
  "Punjab",
  "Haryana",
  "Gujarat",
  "Madhya Pradesh",
  "Uttar Pradesh",
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
];

/* =========================================================
   PROTOTYPE CALCULATION
   This will later be replaced by the FastAPI + ML result.
   ========================================================= */

function calculateRisk(values) {
  let score = 20;
  const factors = [];

  /* Visibility */
  if (values.visibility === "Below 1 km") {
    score += 24;
    factors.push("Very low visibility");
  } else if (values.visibility === "1–2 km") {
    score += 15;
    factors.push("Reduced visibility");
  } else if (values.visibility === "2–5 km") {
    score += 7;
    factors.push("Moderate visibility");
  }

  /* Weather */
  if (
    values.weather === "Fog" ||
    values.weather === "Heavy Rain"
  ) {
    score += 17;
    factors.push(values.weather);
  } else if (
    values.weather === "Rain" ||
    values.weather === "Dust"
  ) {
    score += 9;
    factors.push(values.weather);
  }

  /* Traffic */
  if (values.traffic === "Heavy") {
    score += 15;
    factors.push("Heavy traffic");
  } else if (values.traffic === "Moderate") {
    score += 7;
    factors.push("Moderate traffic");
  }

  /* Road */
  if (values.roadCondition === "Poor") {
    score += 17;
    factors.push("Poor road condition");
  } else if (values.roadCondition === "Fair") {
    score += 7;
    factors.push("Fair road condition");
  } else if (values.roadCondition === "Damaged") {
    score += 20;
    factors.push("Damaged road surface");
  }

  /* Time */
  if (values.time === "Night") {
    score += 10;
    factors.push("Night-time travel");
  } else if (values.time === "Evening") {
    score += 6;
    factors.push("Evening traffic");
  }

  /* Vehicle */
  if (
    values.vehicle === "Truck" ||
    values.vehicle === "Bus"
  ) {
    score += 5;
    factors.push(`${values.vehicle} movement`);
  }

  score = Math.min(score, 98);

  let level = "Low Risk";
  let description =
    "The selected conditions indicate comparatively lower road-risk signals.";

  if (score >= 70) {
    level = "High Risk";

    description =
      "Multiple road and environmental conditions indicate elevated accident-risk signals.";
  } else if (score >= 45) {
    level = "Moderate Risk";

    description =
      "Several conditions suggest that additional monitoring and preventive attention may be appropriate.";
  }

  return {
    score,
    level,
    description,
    factors:
      factors.length > 0
        ? factors.slice(0, 4)
        : ["No major elevated factors identified"],
  };
}

/* =========================================================
   RECOMMENDED ACTIONS
   ========================================================= */

function getRecommendedActions(values) {
  const actions = [];

  if (
    values.visibility === "Below 1 km" ||
    values.visibility === "1–2 km"
  ) {
    actions.push(
      "Increase visibility support using reflective signs and road markings."
    );
  }

  if (
    values.weather === "Fog" ||
    values.weather === "Heavy Rain"
  ) {
    actions.push(
      "Increase monitoring during adverse weather conditions."
    );
  }

  if (values.traffic === "Heavy") {
    actions.push(
      "Strengthen traffic management during peak movement."
    );
  }

  if (
    values.roadCondition === "Poor" ||
    values.roadCondition === "Damaged"
  ) {
    actions.push(
      "Inspect and repair the affected road segment."
    );
  }

  if (values.time === "Night") {
    actions.push(
      "Check roadway lighting and night-time visibility."
    );
  }

  if (actions.length === 0) {
    actions.push(
      "Continue regular monitoring and road safety inspection."
    );
  }

  return actions.slice(0, 4);
}

/* =========================================================
   COMPONENT
   ========================================================= */

function Prediction() {
  const [form, setForm] = useState({
    region: "Rajasthan",
    weather: "",
    visibility: "",
    traffic: "",
    roadCondition: "",
    vehicle: "",
    time: "",
  });

  const [prediction, setPrediction] = useState(null);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setPrediction(null);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const result = calculateRisk(form);

    setPrediction({
      ...result,
      actions: getRecommendedActions(form),
    });
  };

  const readiness = useMemo(() => {
    const requiredFields = [
      form.region,
      form.weather,
      form.visibility,
      form.traffic,
      form.roadCondition,
      form.vehicle,
      form.time,
    ];

    return Math.round(
      (requiredFields.filter(Boolean).length /
        requiredFields.length) *
        100
    );
  }, [form]);

  return (
    <div className="prediction-page">

      {/* ==================================================
          HEADER
         ================================================== */}

      <header className="prediction-header">

        <div className="prediction-header-copy">

          <div className="prediction-kicker">
            <span className="prediction-dot"></span>

            AI ROAD RISK ENGINE
          </div>

          <h1>
            Predict road risk
            <br />
            before it becomes a problem.
          </h1>

          <p>
            Analyse road, traffic and environmental conditions
            to understand the risk signals surrounding a road segment.
          </p>

        </div>

        <div className="prediction-status">

          <span className="status-ring"></span>

          <div>
            <strong>
              Analysis Engine
            </strong>

            <small>
              Ready for input
            </small>
          </div>

        </div>

      </header>

      {/* ==================================================
          MAIN
         ================================================== */}

      <section className="prediction-layout">

        {/* ==================================================
            FORM
           ================================================== */}

        <div className="prediction-form-card">

          <div className="form-card-heading">

            <div>
              <span className="section-label">
                ROAD CONDITIONS
              </span>

              <h2>
                Enter analysis inputs
              </h2>

              <p>
                Provide the current conditions for the road
                segment you want to analyse.
              </p>
            </div>

            <div className="form-progress">

              <strong>
                {readiness}%
              </strong>

              <span>
                Ready
              </span>

            </div>

          </div>

          <form onSubmit={handleSubmit}>

            {/* LOCATION */}

            <div className="form-section-title">
              LOCATION
            </div>

            <div className="form-group">

              <label htmlFor="region">
                State / Union Territory
              </label>

              <select
                id="region"
                name="region"
                value={form.region}
                onChange={handleChange}
              >

                {regions.map((region) => (
                  <option
                    key={region}
                    value={region}
                  >
                    {region}
                  </option>
                ))}

              </select>

            </div>

            {/* ENVIRONMENT */}

            <div className="form-section-title">
              ENVIRONMENT
            </div>

            <div className="form-two-column">

              <div className="form-group">

                <label htmlFor="weather">
                  Weather Condition
                </label>

                <select
                  id="weather"
                  name="weather"
                  value={form.weather}
                  onChange={handleChange}
                  required
                >

                  <option value="">
                    Select weather
                  </option>

                  <option>Clear</option>
                  <option>Cloudy</option>
                  <option>Rain</option>
                  <option>Heavy Rain</option>
                  <option>Fog</option>
                  <option>Dust</option>

                </select>

              </div>

              <div className="form-group">

                <label htmlFor="visibility">
                  Visibility
                </label>

                <select
                  id="visibility"
                  name="visibility"
                  value={form.visibility}
                  onChange={handleChange}
                  required
                >

                  <option value="">
                    Select visibility
                  </option>

                  <option>Below 1 km</option>
                  <option>1–2 km</option>
                  <option>2–5 km</option>
                  <option>5–10 km</option>
                  <option>Above 10 km</option>

                </select>

              </div>

            </div>

            {/* ROAD */}

            <div className="form-section-title">
              ROAD & TRAFFIC
            </div>

            <div className="form-two-column">

              <div className="form-group">

                <label htmlFor="roadCondition">
                  Road Condition
                </label>

                <select
                  id="roadCondition"
                  name="roadCondition"
                  value={form.roadCondition}
                  onChange={handleChange}
                  required
                >

                  <option value="">
                    Select condition
                  </option>

                  <option>Good</option>
                  <option>Fair</option>
                  <option>Poor</option>
                  <option>Damaged</option>

                </select>

              </div>

              <div className="form-group">

                <label htmlFor="traffic">
                  Traffic Density
                </label>

                <select
                  id="traffic"
                  name="traffic"
                  value={form.traffic}
                  onChange={handleChange}
                  required
                >

                  <option value="">
                    Select traffic
                  </option>

                  <option>Low</option>
                  <option>Moderate</option>
                  <option>Heavy</option>

                </select>

              </div>

            </div>

            {/* TRAVEL */}

            <div className="form-section-title">
              TRAVEL CONTEXT
            </div>

            <div className="form-two-column">

              <div className="form-group">

                <label htmlFor="vehicle">
                  Vehicle Type
                </label>

                <select
                  id="vehicle"
                  name="vehicle"
                  value={form.vehicle}
                  onChange={handleChange}
                  required
                >

                  <option value="">
                    Select vehicle
                  </option>

                  <option>Car</option>
                  <option>Motorcycle</option>
                  <option>Truck</option>
                  <option>Bus</option>
                  <option>Auto</option>
                  <option>Other</option>

                </select>

              </div>

              <div className="form-group">

                <label htmlFor="time">
                  Time of Occurrence
                </label>

                <select
                  id="time"
                  name="time"
                  value={form.time}
                  onChange={handleChange}
                  required
                >

                  <option value="">
                    Select time
                  </option>

                  <option>Morning</option>
                  <option>Afternoon</option>
                  <option>Evening</option>
                  <option>Night</option>

                </select>

              </div>

            </div>

            {/* BUTTON */}

            <button
              type="submit"
              className="predict-button"
            >

              <span className="button-pulse"></span>

              Analyse Road Risk

              <span className="button-arrow">
                →
              </span>

            </button>

          </form>

        </div>

        {/* ==================================================
            RESULT
           ================================================== */}

        <div className="prediction-result-panel">

          {!prediction ? (

            <div className="prediction-empty">

              <div className="road-radar">

                <span className="radar-ring ring-one"></span>
                <span className="radar-ring ring-two"></span>
                <span className="radar-ring ring-three"></span>

                <span className="radar-center"></span>

                <span className="radar-sweep"></span>

              </div>

              <span className="section-label">
                RISK ASSESSMENT
              </span>

              <h2>
                Ready for
                road conditions
              </h2>

              <p>
                Complete the inputs to generate a road-risk
                assessment and recommended safety actions.
              </p>

              <div className="empty-mini-stats">

                <div>
                  <strong>07</strong>
                  <span>Input factors</span>
                </div>

                <div>
                  <strong>AI</strong>
                  <span>Risk engine</span>
                </div>

                <div>
                  <strong>GPS</strong>
                  <span>Spatial context</span>
                </div>

              </div>

            </div>

          ) : (

            <div
              className={`prediction-result ${
                prediction.level === "High Risk"
                  ? "result-high"
                  : prediction.level === "Moderate Risk"
                  ? "result-medium"
                  : "result-low"
              }`}
            >

              {/* RESULT HEADER */}

              <div className="result-top">

                <div>

                  <span className="section-label">
                    RISK ASSESSMENT
                  </span>

                  <h2>
                    {prediction.level}
                  </h2>

                </div>

                <div className="result-region">
                  {form.region}
                </div>

              </div>

              {/* SCORE */}

              <div className="score-area">

                <div
                  className="score-circle"
                  style={{
                    "--score-angle": `${prediction.score * 3.6}deg`,
                  }}
                >

                  <div className="score-inner">

                    <strong>
                      {prediction.score}
                    </strong>

                    <span>
                      / 100
                    </span>

                  </div>

                </div>

                <div className="score-copy">

                  <span>
                    Current risk signal
                  </span>

                  <strong>
                    {prediction.score >= 70
                      ? "Elevated"
                      : prediction.score >= 45
                      ? "Moderate"
                      : "Controlled"}
                  </strong>

                  <p>
                    {prediction.description}
                  </p>

                </div>

              </div>

              {/* FACTORS */}

              <div className="result-section">

                <div className="result-section-heading">
                  KEY CONTRIBUTING FACTORS
                </div>

                <div className="factor-list">

                  {prediction.factors.map(
                    (factor, index) => (

                      <div
                        className="factor-item"
                        key={factor}
                      >

                        <span>
                          {String(
                            index + 1
                          ).padStart(2, "0")}
                        </span>

                        <strong>
                          {factor}
                        </strong>

                      </div>

                    )
                  )}

                </div>

              </div>

              {/* ACTIONS */}

              <div className="result-section">

                <div className="result-section-heading">
                  RECOMMENDED ACTIONS
                </div>

                <div className="action-list">

                  {prediction.actions.map(
                    (action, index) => (

                      <div
                        className="prediction-action"
                        key={action}
                      >

                        <span>
                          {String(
                            index + 1
                          ).padStart(2, "0")}
                        </span>

                        <p>
                          {action}
                        </p>

                      </div>

                    )
                  )}

                </div>

              </div>

              {/* CONDITIONS */}

              <div className="condition-strip">

                <div>
                  <span>
                    Weather
                  </span>

                  <strong>
                    {form.weather}
                  </strong>
                </div>

                <div>
                  <span>
                    Visibility
                  </span>

                  <strong>
                    {form.visibility}
                  </strong>
                </div>

                <div>
                  <span>
                    Traffic
                  </span>

                  <strong>
                    {form.traffic}
                  </strong>
                </div>

              </div>

            </div>

          )}

        </div>

      </section>

    </div>
  );
}

export default Prediction;
