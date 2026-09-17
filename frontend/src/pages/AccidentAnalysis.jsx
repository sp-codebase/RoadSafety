import React, { useMemo, useState } from "react";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

import "./AccidentAnalysis.css";


/* =====================================================
   STATES / UTs
===================================================== */

const STATES = [
  "All India",
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
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

const YEARS = [
  "All Years",
  "2025",
  "2024",
  "2023",
  "2022",
];


/* =====================================================
   DEMO STATE SUMMARY
   Later replace with FastAPI data
===================================================== */

const STATE_SUMMARY = {

  "All India": {
    accidents: 1284,
    casualties: 1542,
    fatal: 168,
    major: 402,
    blackSpots: 18,
  },

  Rajasthan: {
    accidents: 246,
    casualties: 298,
    fatal: 29,
    major: 72,
    blackSpots: 6,
  },

  Punjab: {
    accidents: 182,
    casualties: 216,
    fatal: 22,
    major: 58,
    blackSpots: 5,
  },

  Haryana: {
    accidents: 194,
    casualties: 231,
    fatal: 25,
    major: 64,
    blackSpots: 7,
  },

  "Uttar Pradesh": {
    accidents: 286,
    casualties: 347,
    fatal: 38,
    major: 91,
    blackSpots: 9,
  },

  "Madhya Pradesh": {
    accidents: 225,
    casualties: 271,
    fatal: 31,
    major: 70,
    blackSpots: 7,
  },

  Gujarat: {
    accidents: 212,
    casualties: 254,
    fatal: 26,
    major: 63,
    blackSpots: 6,
  },
};


/* =====================================================
   MONTHLY DATA
===================================================== */

const MONTHLY_DATA = [
  {
    month: "Jan",
    accidents: 92,
    casualties: 108,
  },
  {
    month: "Feb",
    accidents: 86,
    casualties: 101,
  },
  {
    month: "Mar",
    accidents: 98,
    casualties: 117,
  },
  {
    month: "Apr",
    accidents: 91,
    casualties: 108,
  },
  {
    month: "May",
    accidents: 103,
    casualties: 124,
  },
  {
    month: "Jun",
    accidents: 108,
    casualties: 131,
  },
  {
    month: "Jul",
    accidents: 113,
    casualties: 136,
  },
  {
    month: "Aug",
    accidents: 109,
    casualties: 130,
  },
  {
    month: "Sep",
    accidents: 104,
    casualties: 124,
  },
  {
    month: "Oct",
    accidents: 121,
    casualties: 146,
  },
  {
    month: "Nov",
    accidents: 132,
    casualties: 158,
  },
  {
    month: "Dec",
    accidents: 127,
    casualties: 159,
  },
];


/* =====================================================
   CAUSE DATA
===================================================== */

const CAUSE_DATA = [
  {
    name: "Overspeeding",
    value: 31,
  },
  {
    name: "Poor Road",
    value: 22,
  },
  {
    name: "Distraction",
    value: 18,
  },
  {
    name: "Weather",
    value: 16,
  },
  {
    name: "Drunk Driving",
    value: 13,
  },
];


/* =====================================================
   SEVERITY
===================================================== */

const SEVERITY_DATA = [
  {
    name: "Minor",
    value: 58,
  },
  {
    name: "Major",
    value: 29,
  },
  {
    name: "Fatal",
    value: 13,
  },
];


/* =====================================================
   WEATHER
===================================================== */

const WEATHER_DATA = [
  {
    weather: "Clear",
    accidents: 41,
  },
  {
    weather: "Rain",
    accidents: 23,
  },
  {
    weather: "Fog",
    accidents: 21,
  },
  {
    weather: "Cloudy",
    accidents: 15,
  },
];


/* =====================================================
   TIME
===================================================== */

const TIME_DATA = [
  {
    time: "00–04",
    accidents: 82,
  },
  {
    time: "04–08",
    accidents: 104,
  },
  {
    time: "08–12",
    accidents: 188,
  },
  {
    time: "12–16",
    accidents: 214,
  },
  {
    time: "16–20",
    accidents: 312,
  },
  {
    time: "20–24",
    accidents: 384,
  },
];


/* =====================================================
   VEHICLE
===================================================== */

const VEHICLE_DATA = [
  {
    type: "Cars",
    value: 34,
  },
  {
    type: "Bikes",
    value: 29,
  },
  {
    type: "Trucks",
    value: 16,
  },
  {
    type: "Buses",
    value: 9,
  },
  {
    type: "Other",
    value: 12,
  },
];


/* =====================================================
   PIE COLORS
===================================================== */

const PIE_COLORS = [
  "#d94f4f",
  "#e99445",
  "#e2bc55",
];


/* =====================================================
   TOOLTIP
===================================================== */

const tooltipStyle = {
  backgroundColor: "#ffffff",
  border: "1px solid #e5e8e6",
  borderRadius: "12px",
};


/* =====================================================
   STAT CARD
===================================================== */

function StatCard({
  icon,
  title,
  value,
  subtitle,
  className,
}) {
  return (
    <div
      className={`analysis-stat ${className || ""}`}
    >

      <div className="analysis-stat-icon">
        {icon}
      </div>

      <div className="analysis-stat-content">

        <span>
          {title}
        </span>

        <strong>
          {value}
        </strong>

        <small>
          {subtitle}
        </small>

      </div>

    </div>
  );
}


/* =====================================================
   INSIGHT CARD
===================================================== */

function InsightCard({
  icon,
  title,
  description,
}) {
  return (
    <div className="analysis-insight">

      <div className="analysis-insight-icon">
        {icon}
      </div>

      <div>

        <h4>
          {title}
        </h4>

        <p>
          {description}
        </p>

      </div>

    </div>
  );
}


/* =====================================================
   MAIN COMPONENT
===================================================== */

export default function AccidentAnalysis() {

  const [selectedState, setSelectedState] =
    useState("All India");

  const [selectedYear, setSelectedYear] =
    useState("All Years");


  /* ===================================================
     STATE SUMMARY
  =================================================== */

  const stats = useMemo(() => {

    return (
      STATE_SUMMARY[selectedState] ||
      STATE_SUMMARY["All India"]
    );

  }, [selectedState]);


  /* ===================================================
     MONTHLY DATA
  =================================================== */

  const monthlyData = useMemo(() => {

    if (selectedState === "All India") {
      return MONTHLY_DATA;
    }

    const multiplier = {
      Rajasthan: 0.82,
      Punjab: 0.74,
      Haryana: 0.79,
      "Uttar Pradesh": 1.08,
      "Madhya Pradesh": 0.90,
      Gujarat: 0.86,
    }[selectedState] || 0.72;

    return MONTHLY_DATA.map((item) => ({
      month: item.month,

      accidents: Math.round(
        item.accidents * multiplier
      ),

      casualties: Math.round(
        item.casualties * multiplier
      ),
    }));

  }, [selectedState]);


  return (
    <div className="accident-page">


      {/* =================================================
          PAGE HEADER
      ================================================= */}

      <section className="analysis-hero">

        <div>

          <div className="analysis-label">
            ROAD SAFETY INTELLIGENCE
          </div>

          <h1>
            Accident Analysis
          </h1>

          <p>
            Understand where, when and why road accidents
            occur through data-driven analysis.
          </p>

        </div>


        <div className="analysis-view-badge">

          <span className="analysis-pulse"></span>

          Analytical Dashboard

        </div>

      </section>



      {/* =================================================
          FILTER SECTION
      ================================================= */}

      <section className="analysis-control-panel">

        <div className="control-heading">

          <div className="control-heading-icon">
            🔎
          </div>

          <div>

            <strong>
              Explore Accident Data
            </strong>

            <span>
              Filter the analysis by state and year
            </span>

          </div>

        </div>


        <div className="control-fields">

          <div className="control-field">

            <label>
              State / Union Territory
            </label>

            <select
              value={selectedState}
              onChange={(e) =>
                setSelectedState(e.target.value)
              }
            >

              {STATES.map((state) => (
                <option
                  key={state}
                  value={state}
                >
                  {state}
                </option>
              ))}

            </select>

          </div>


          <div className="control-field">

            <label>
              Year
            </label>

            <select
              value={selectedYear}
              onChange={(e) =>
                setSelectedYear(e.target.value)
              }
            >

              {YEARS.map((year) => (
                <option
                  key={year}
                  value={year}
                >
                  {year}
                </option>
              ))}

            </select>

          </div>


          <div className="selected-filter-box">

            <small>
              CURRENT VIEW
            </small>

            <strong>
              {selectedState === "All India"
                ? "India"
                : selectedState}
            </strong>

            <span>
              {selectedYear}
            </span>

          </div>

        </div>

      </section>



      {/* =================================================
          KPI SECTION
      ================================================= */}

      <section className="analysis-stats">

        <StatCard
          icon="🚗"
          title="Total Accidents"
          value={stats.accidents.toLocaleString()}
          subtitle="Recorded events"
          className="stat-orange"
        />

        <StatCard
          icon="👥"
          title="Casualties"
          value={stats.casualties.toLocaleString()}
          subtitle="People affected"
          className="stat-green"
        />

        <StatCard
          icon="🚨"
          title="Fatal Accidents"
          value={stats.fatal}
          subtitle="Fatal severity cases"
          className="stat-red"
        />

        <StatCard
          icon="📍"
          title="Black Spots"
          value={stats.blackSpots}
          subtitle="Areas requiring attention"
          className="stat-yellow"
        />

      </section>



      {/* =================================================
          MAIN ANALYTICS ROW
      ================================================= */}

      <section className="analysis-two-column">


        {/* TREND */}

        <div className="analysis-panel large-panel">

          <div className="panel-heading">

            <div>

              <span>
                TREND ANALYSIS
              </span>

              <h2>
                Monthly Accident Activity
              </h2>

            </div>

            <div className="panel-chip">
              {selectedState === "All India"
                ? "India"
                : selectedState}
            </div>

          </div>


          <div className="chart-container">

            <ResponsiveContainer
              width="100%"
              height={360}
            >

              <LineChart
                data={monthlyData}
              >

                <CartesianGrid
                  stroke="#edf0ed"
                  strokeDasharray="4 4"
                  vertical={false}
                />

                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: "#7c8581",
                    fontSize: 12,
                  }}
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: "#7c8581",
                    fontSize: 12,
                  }}
                />

                <Tooltip
                  contentStyle={tooltipStyle}
                />

                <Legend
                  verticalAlign="top"
                  align="right"
                  height={30}
                />

                <Line
                  type="monotone"
                  dataKey="accidents"
                  name="Accidents"
                  stroke="#c85d46"
                  strokeWidth={3}
                  dot={{
                    r: 4,
                  }}
                  activeDot={{
                    r: 7,
                  }}
                />

                <Line
                  type="monotone"
                  dataKey="casualties"
                  name="Casualties"
                  stroke="#4f856f"
                  strokeWidth={3}
                  dot={{
                    r: 4,
                  }}
                  activeDot={{
                    r: 7,
                  }}
                />

              </LineChart>

            </ResponsiveContainer>

          </div>

        </div>


        {/* SEVERITY */}

        <div className="analysis-panel severity-panel">

          <div className="panel-heading">

            <div>

              <span>
                SEVERITY
              </span>

              <h2>
                Accident Severity
              </h2>

            </div>

          </div>


          <div className="severity-chart">

            <ResponsiveContainer
              width="100%"
              height={265}
            >

              <PieChart>

                <Pie
                  data={SEVERITY_DATA}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={95}
                  paddingAngle={4}
                >

                  {SEVERITY_DATA.map(
                    (item, index) => (
                      <Cell
                        key={item.name}
                        fill={
                          PIE_COLORS[index]
                        }
                      />
                    )
                  )}

                </Pie>

                <Tooltip
                  contentStyle={tooltipStyle}
                />

              </PieChart>

            </ResponsiveContainer>


            <div className="severity-center">

              <strong>
                100%
              </strong>

              <span>
                Distribution
              </span>

            </div>

          </div>


          <div className="severity-list">

            {SEVERITY_DATA.map(
              (item, index) => (

                <div
                  key={item.name}
                  className="severity-row"
                >

                  <div>

                    <i
                      style={{
                        background:
                          PIE_COLORS[index],
                      }}
                    ></i>

                    {item.name}

                  </div>

                  <strong>
                    {item.value}%
                  </strong>

                </div>

              )
            )}

          </div>

        </div>

      </section>



      {/* =================================================
          SECOND ANALYTICS ROW
      ================================================= */}

      <section className="analysis-two-column">


        {/* CAUSES */}

        <div className="analysis-panel">

          <div className="panel-heading">

            <div>

              <span>
                ROOT CAUSE ANALYSIS
              </span>

              <h2>
                Major Accident Causes
              </h2>

            </div>

          </div>


          <ResponsiveContainer
            width="100%"
            height={330}
          >

            <BarChart
              data={CAUSE_DATA}
              layout="vertical"
              margin={{
                left: 15,
                right: 25,
              }}
            >

              <CartesianGrid
                stroke="#edf0ed"
                strokeDasharray="4 4"
                horizontal={false}
              />

              <XAxis
                type="number"
                domain={[0, 40]}
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: "#7c8581",
                  fontSize: 11,
                }}
              />

              <YAxis
                type="category"
                dataKey="name"
                width={100}
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: "#59635f",
                  fontSize: 11,
                }}
              />

              <Tooltip
                contentStyle={tooltipStyle}
              />

              <Bar
                dataKey="value"
                name="Share"
                fill="#4f856f"
                radius={[
                  0,
                  8,
                  8,
                  0,
                ]}
              />

            </BarChart>

          </ResponsiveContainer>

        </div>



        {/* WEATHER */}

        <div className="analysis-panel">

          <div className="panel-heading">

            <div>

              <span>
                ENVIRONMENT
              </span>

              <h2>
                Weather Conditions
              </h2>

            </div>

          </div>


          <ResponsiveContainer
            width="100%"
            height={330}
          >

            <BarChart
              data={WEATHER_DATA}
            >

              <CartesianGrid
                stroke="#edf0ed"
                strokeDasharray="4 4"
                vertical={false}
              />

              <XAxis
                dataKey="weather"
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: "#707a76",
                  fontSize: 11,
                }}
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: "#707a76",
                  fontSize: 11,
                }}
              />

              <Tooltip
                contentStyle={tooltipStyle}
              />

              <Bar
                dataKey="accidents"
                name="Accidents"
                fill="#c85d46"
                radius={[
                  8,
                  8,
                  0,
                  0,
                ]}
              />

            </BarChart>

          </ResponsiveContainer>

        </div>

      </section>



      {/* =================================================
          TIME + VEHICLES
      ================================================= */}

      <section className="analysis-bottom-grid">


        {/* TIME */}

        <div className="analysis-panel">

          <div className="panel-heading">

            <div>

              <span>
                TIME INTELLIGENCE
              </span>

              <h2>
                Accident Activity by Time
              </h2>

            </div>

          </div>


          <ResponsiveContainer
            width="100%"
            height={300}
          >

            <BarChart
              data={TIME_DATA}
            >

              <CartesianGrid
                stroke="#edf0ed"
                strokeDasharray="4 4"
                vertical={false}
              />

              <XAxis
                dataKey="time"
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: "#707a76",
                  fontSize: 11,
                }}
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: "#707a76",
                  fontSize: 11,
                }}
              />

              <Tooltip
                contentStyle={tooltipStyle}
              />

              <Bar
                dataKey="accidents"
                name="Accidents"
                fill="#d2aa4c"
                radius={[
                  8,
                  8,
                  0,
                  0,
                ]}
              />

            </BarChart>

          </ResponsiveContainer>

        </div>



        {/* VEHICLE */}

        <div className="analysis-panel">

          <div className="panel-heading">

            <div>

              <span>
                VEHICLE INTELLIGENCE
              </span>

              <h2>
                Vehicle Involvement
              </h2>

            </div>

          </div>


          <div className="vehicle-list">

            {VEHICLE_DATA.map(
              (vehicle, index) => (

                <div
                  key={vehicle.type}
                  className="vehicle-row"
                >

                  <div className="vehicle-name">

                    <span>
                      {index + 1}
                    </span>

                    {vehicle.type}

                  </div>


                  <div className="vehicle-bar">

                    <div
                      style={{
                        width: `${vehicle.value * 2.2}%`,
                      }}
                    ></div>

                  </div>


                  <strong>
                    {vehicle.value}%
                  </strong>

                </div>

              )
            )}

          </div>

        </div>

      </section>



      {/* =================================================
          SAFETY INSIGHTS
      ================================================= */}

      <section className="insights-section">

        <div className="insights-heading">

          <div>

            <span>
              SAFETY INTELLIGENCE
            </span>

            <h2>
              What the data is telling us
            </h2>

          </div>

          <p>
            Use these patterns for further investigation
            and road-safety planning.
          </p>

        </div>


        <div className="insights-grid">

          <InsightCard
            icon="🌙"
            title="High Activity Window"
            description="Evening and late-night periods show stronger accident activity in the displayed analysis."
          />

          <InsightCard
            icon="⚠️"
            title="Leading Causes"
            description="Overspeeding, poor road conditions and distraction are important contributing factors in the current analysis."
          />

          <InsightCard
            icon="🌫️"
            title="Visibility Risk"
            description="Low-visibility conditions such as fog should be considered when evaluating accident risk."
          />

          <InsightCard
            icon="📍"
            title="Area Monitoring"
            description={`The current view is focused on ${selectedState === "All India" ? "India" : selectedState}.`}
          />

        </div>

      </section>



      {/* =================================================
          DATA FOOTER
      ================================================= */}

      <div className="analysis-data-footer">

        <div>
          <strong>
            Analysis dimensions
          </strong>

          <span>
            State • Date • Time • Weather • Visibility •
            Cause • Severity • Vehicles • Casualties
          </span>
        </div>

        <div className="footer-status">
          ● Data analysis view
        </div>

      </div>

    </div>
  );
}