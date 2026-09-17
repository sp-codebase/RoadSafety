import { useMemo, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  Cell,
} from "recharts";

import "./Dashboard.css";

function Dashboard() {
  const [period, setPeriod] = useState("6");

  const yearlyData = {
    6: [
      { year: "2019", accidents: 820 },
      { year: "2020", accidents: 760 },
      { year: "2021", accidents: 910 },
      { year: "2022", accidents: 1040 },
      { year: "2023", accidents: 1170 },
      { year: "2024", accidents: 1284 },
    ],
    5: [
      { year: "2020", accidents: 760 },
      { year: "2021", accidents: 910 },
      { year: "2022", accidents: 1040 },
      { year: "2023", accidents: 1170 },
      { year: "2024", accidents: 1284 },
    ],
    3: [
      { year: "2022", accidents: 1040 },
      { year: "2023", accidents: 1170 },
      { year: "2024", accidents: 1284 },
    ],
  };

  const monthlyData = [
    { month: "Jan", accidents: 84 },
    { month: "Feb", accidents: 92 },
    { month: "Mar", accidents: 101 },
    { month: "Apr", accidents: 96 },
    { month: "May", accidents: 110 },
    { month: "Jun", accidents: 104 },
    { month: "Jul", accidents: 118 },
    { month: "Aug", accidents: 112 },
    { month: "Sep", accidents: 107 },
    { month: "Oct", accidents: 126 },
    { month: "Nov", accidents: 115 },
    { month: "Dec", accidents: 119 },
  ];

  const causeData = [
    { cause: "Speed", value: 34 },
    { cause: "Traffic", value: 27 },
    { cause: "Road", value: 21 },
    { cause: "Weather", value: 11 },
    { cause: "Other", value: 7 },
  ];

  const severityData = [
    { name: "Fatal", value: 246 },
    { name: "Serious", value: 412 },
    { name: "Minor", value: 626 },
  ];

  const chartData = useMemo(() => {
    return period === "1" ? monthlyData : yearlyData[period];
  }, [period]);

  return (
    <div className="dashboard">

      {/* ==================================================
          HERO
         ================================================== */}

      <section className="dashboard-hero">

        <div className="hero-grid-lines"></div>

        <div className="hero-copy">

          <div className="hero-kicker-wrap">
            <span className="hero-kicker-dot"></span>

            <span className="hero-kicker">
              ROAD SAFETY INTELLIGENCE
            </span>

            <span className="hero-live">
              LIVE ANALYTICS
            </span>
          </div>

          <h1>
            Safer roads.
            <br />
            Smarter decisions.
          </h1>

          <p>
            Explore accident patterns, discover risk factors,
            and turn road data into actionable safety intelligence.
          </p>

          <div className="hero-stats-mini">
            <div>
              <strong>20K+</strong>
              <span>Records</span>
            </div>

            <div>
              <strong>GPS</strong>
              <span>Location Data</span>
            </div>

            <div>
              <strong>24</strong>
              <span>Data Fields</span>
            </div>
          </div>

        </div>

        <div className="hero-road-scene">

          <div className="road-vignette"></div>

          <div className="road-horizon-glow"></div>

          <div className="road-scan-line"></div>

          <div className="road-light road-light-one"></div>
          <div className="road-light road-light-two"></div>
          <div className="road-light road-light-three"></div>

          <div className="vehicle vehicle-one"></div>
          <div className="vehicle vehicle-two"></div>
          <div className="vehicle vehicle-three"></div>

          <div className="hero-road-topbar">
            <span>HIGHWAY INTELLIGENCE</span>

            <span className="road-status">
              ● SYSTEM ACTIVE
            </span>
          </div>

          <div className="road-data-card">
            <span>FIELD CONDITIONS</span>

            <div className="road-data-row">
              <strong>Road Network</strong>
              <span>Monitoring</span>
            </div>

            <div className="road-data-row">
              <strong>Traffic Flow</strong>
              <span>Analysing</span>
            </div>

            <div className="road-data-row">
              <strong>Risk Signals</strong>
              <span>Detecting</span>
            </div>
          </div>

          <div className="road-lane lane-left"></div>
          <div className="road-lane lane-center"></div>
          <div className="road-lane lane-right"></div>

        </div>

      </section>

      {/* ==================================================
          HEADER
         ================================================== */}

      <div className="dashboard-header">

        <div className="dashboard-heading">

          <span className="section-label">
            OVERVIEW
          </span>

          <h2>
            Road Safety Overview
          </h2>

          <p>
            A visual summary of accident patterns and safety indicators.
          </p>

        </div>

        <div className="dashboard-filter">

          <label htmlFor="period">
            Analysis Period
          </label>

          <select
            id="period"
            value={period}
            onChange={(event) => setPeriod(event.target.value)}
          >
            <option value="6">Last 6 Years</option>
            <option value="5">Last 5 Years</option>
            <option value="3">Last 3 Years</option>
            <option value="1">Last Year</option>
          </select>

        </div>

      </div>

      {/* ==================================================
          STATS
         ================================================== */}

      <section className="stats-grid">

        <div className="stat-card stat-green">
          <div className="stat-number">01</div>

          <div className="stat-content">
            <span>Total Accidents</span>
            <strong>1,284</strong>
            <small>Recorded incidents</small>
          </div>

          <div className="stat-accent"></div>
        </div>

        <div className="stat-card stat-red">
          <div className="stat-number">02</div>

          <div className="stat-content">
            <span>Casualties</span>
            <strong>246</strong>
            <small>Reported outcomes</small>
          </div>

          <div className="stat-accent"></div>
        </div>

        <div className="stat-card stat-orange">
          <div className="stat-number">03</div>

          <div className="stat-content">
            <span>High-Risk Zones</span>
            <strong>18</strong>
            <small>Areas needing attention</small>
          </div>

          <div className="stat-accent"></div>
        </div>

        <div className="stat-card stat-dark">
          <div className="stat-number">04</div>

          <div className="stat-content">
            <span>Records Analysed</span>
            <strong>20K+</strong>
            <small>Available data records</small>
          </div>

          <div className="stat-accent"></div>
        </div>

      </section>

      {/* ==================================================
          TREND + SEVERITY
         ================================================== */}

      <section className="dashboard-main-grid">

        <div className="dashboard-card trend-card">

          <div className="card-heading">

            <div>
              <span className="section-label">
                ACCIDENT TREND
              </span>

              <h3>
                {period === "1"
                  ? "Monthly accident pattern"
                  : "Year-wise accident pattern"}
              </h3>
            </div>

            <span className="chart-badge">
              {period === "1"
                ? "12 MONTHS"
                : `${period} YEARS`}
            </span>

          </div>

          <div className="chart-wrapper">

            <ResponsiveContainer width="100%" height={310}>
              <LineChart
                data={chartData}
                margin={{
                  top: 15,
                  right: 15,
                  left: 0,
                  bottom: 5,
                }}
              >

                <CartesianGrid
                  strokeDasharray="4 5"
                  vertical={false}
                  stroke="#e9e8e3"
                />

                <XAxis
                  dataKey={
                    period === "1"
                      ? "month"
                      : "year"
                  }
                  tickLine={false}
                  axisLine={false}
                  tick={{
                    fill: "#7b847e",
                    fontSize: 11,
                  }}
                />

                <YAxis
                  tickLine={false}
                  axisLine={false}
                  width={45}
                  tick={{
                    fill: "#7b847e",
                    fontSize: 11,
                  }}
                />

                <Tooltip />

                <Line
                  type="monotone"
                  dataKey="accidents"
                  stroke="#4f7460"
                  strokeWidth={3}
                  dot={{
                    r: 4,
                    fill: "#ffffff",
                    stroke: "#4f7460",
                    strokeWidth: 2,
                  }}
                  activeDot={{
                    r: 7,
                  }}
                />

              </LineChart>
            </ResponsiveContainer>

          </div>

        </div>

        <div className="dashboard-card severity-card">

          <div className="card-heading">

            <div>
              <span className="section-label">
                SEVERITY
              </span>

              <h3>
                Accident outcomes
              </h3>
            </div>

          </div>

          <div className="severity-total">
            <strong>1,284</strong>
            <span>Total recorded incidents</span>
          </div>

          <div className="severity-list">

            {severityData.map((item, index) => (
              <div
                className="severity-row"
                key={item.name}
              >

                <div className="severity-label">

                  <span>
                    {item.name}
                  </span>

                  <strong>
                    {item.value}
                  </strong>

                </div>

                <div className="severity-bar">

                  <div
                    className={`severity-fill severity-${index}`}
                    style={{
                      width: `${(item.value / 1284) * 100}%`,
                    }}
                  />

                </div>

              </div>
            ))}

          </div>

          <div className="severity-note">
            Distribution of recorded accident outcomes
          </div>

        </div>

      </section>

      {/* ==================================================
          WHY + WHEN
         ================================================== */}

      <section className="dashboard-lower-grid">

        <div className="dashboard-card cause-card">

          <div className="card-heading">

            <div>
              <span className="section-label">
                WHY ACCIDENTS HAPPEN
              </span>

              <h3>
                Major contributing factors
              </h3>
            </div>

            <span className="small-card-label">
              FACTORS
            </span>

          </div>

          <div className="cause-chart">

            <ResponsiveContainer width="100%" height={285}>

              <BarChart
                data={causeData}
                margin={{
                  top: 10,
                  right: 10,
                  left: -20,
                  bottom: 10,
                }}
              >

                <CartesianGrid
                  strokeDasharray="4 5"
                  vertical={false}
                  stroke="#e9e8e3"
                />

                <XAxis
                  dataKey="cause"
                  tickLine={false}
                  axisLine={false}
                  tick={{
                    fill: "#7b847e",
                    fontSize: 11,
                  }}
                />

                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{
                    fill: "#7b847e",
                    fontSize: 11,
                  }}
                />

                <Tooltip />

                <Bar
                  dataKey="value"
                  radius={[8, 8, 0, 0]}
                >
                  {causeData.map((entry, index) => (
                    <Cell
                      key={`cause-${index}`}
                      fill={
                        index === 0
                          ? "#9d604d"
                          : "#6e8877"
                      }
                    />
                  ))}
                </Bar>

              </BarChart>

            </ResponsiveContainer>

          </div>

        </div>

        <div className="dashboard-card time-card">

          <div className="card-heading">

            <div>
              <span className="section-label">
                WHEN RISK RISES
              </span>

              <h3>
                Peak accident periods
              </h3>
            </div>

          </div>

          <div className="time-insights">

            <div className="time-item">

              <div className="time-number">
                01
              </div>

              <div>
                <span>Morning</span>

                <strong>
                  07:00 – 10:00
                </strong>

                <small>
                  Commuter movement
                </small>
              </div>

            </div>

            <div className="time-item time-highlight">

              <div className="time-number">
                02
              </div>

              <div>
                <span>Evening</span>

                <strong>
                  17:00 – 21:00
                </strong>

                <small>
                  Higher traffic movement
                </small>
              </div>

            </div>

            <div className="time-item">

              <div className="time-number">
                03
              </div>

              <div>
                <span>Weekend</span>

                <strong>
                  Saturday – Sunday
                </strong>

                <small>
                  Changing traffic patterns
                </small>
              </div>

            </div>

          </div>

        </div>

      </section>

      {/* ==================================================
          ROAD SAFETY SHOWCASE
         ================================================== */}

      <section className="safety-showcase">

        <div className="safety-road-image">

          <div className="safety-road-glow"></div>

          <div className="safety-road-lines"></div>

          <div className="safety-road-label">
            <span>ROAD ENVIRONMENT</span>

            <strong>
              Infrastructure,
              traffic & surroundings
            </strong>
          </div>

        </div>

        <div className="safety-content">

          <span className="section-label section-label-light">
            SAFETY INTELLIGENCE
          </span>

          <h3>
            From patterns
            <br />
            to practical action.
          </h3>

          <p>
            Understanding accident data means connecting location,
            timing, traffic movement and contributing factors to
            identify where preventive attention may be needed.
          </p>

          <div className="safety-points">

            <div>
              <span>WHERE</span>

              <strong>
                Identify accident-prone areas
              </strong>
            </div>

            <div>
              <span>WHEN</span>

              <strong>
                Understand peak-risk periods
              </strong>
            </div>

            <div>
              <span>WHY</span>

              <strong>
                Explore contributing factors
              </strong>
            </div>

          </div>

        </div>

      </section>

      {/* ==================================================
          DATASET SNAPSHOT
         ================================================== */}

      <section className="dataset-strip">

        <div className="dataset-heading">

          <span className="section-label">
            DATASET SNAPSHOT
          </span>

          <h3>
            Built for deeper road-safety analysis
          </h3>

        </div>

        <div className="dataset-items">

          <div>
            <strong>20,000+</strong>
            <span>Accident records</span>
          </div>

          <div>
            <strong>GPS</strong>
            <span>Location information</span>
          </div>

          <div>
            <strong>24</strong>
            <span>Analytical fields</span>
          </div>

        </div>

      </section>

    </div>
  );
}

export default Dashboard;