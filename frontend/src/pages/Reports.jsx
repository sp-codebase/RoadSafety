import React, { useEffect, useMemo, useState } from "react";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import "./Reports.css";


/* =====================================================
   STATES / UTs
===================================================== */

const ALL_STATES = [
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


/* =====================================================
   CSV PARSER
===================================================== */

function parseCSV(text) {
  const rows = [];

  let row = [];
  let field = "";
  let insideQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];

    if (char === '"') {
      if (
        insideQuotes &&
        text[i + 1] === '"'
      ) {
        field += '"';
        i++;
      } else {
        insideQuotes = !insideQuotes;
      }
    }

    else if (
      char === "," &&
      !insideQuotes
    ) {
      row.push(field);
      field = "";
    }

    else if (
      char === "\n" &&
      !insideQuotes
    ) {
      row.push(field);
      rows.push(row);

      row = [];
      field = "";
    }

    else if (char !== "\r") {
      field += char;
    }
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  if (!rows.length) {
    return [];
  }

  const headers = rows[0].map((header) =>
    header.trim()
  );

  return rows
    .slice(1)
    .filter((values) =>
      values.some(
        (value) =>
          String(value).trim() !== ""
      )
    )
    .map((values) => {
      const object = {};

      headers.forEach((header, index) => {
        object[header] =
          values[index] !== undefined
            ? values[index].trim()
            : "";
      });

      return object;
    });
}


/* =====================================================
   HELPERS
===================================================== */

function numberValue(value) {
  const num = Number(value);

  return Number.isFinite(num)
    ? num
    : 0;
}


function normalize(value) {
  return String(value || "")
    .trim()
    .toLowerCase();
}


function titleCase(value) {
  return String(value || "")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    );
}


/* =====================================================
   COMPONENT
===================================================== */

export default function Reports() {

  const [records, setRecords] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [selectedState, setSelectedState] =
    useState("All India");

  const [selectedYear, setSelectedYear] =
    useState("All Years");

  const [reportGenerated, setReportGenerated] =
    useState(false);


  /* ===================================================
     LOAD CSV
  =================================================== */

  useEffect(() => {

    async function loadData() {

      try {

        setLoading(true);
        setError("");

        const response = await fetch(
          "/road_accidents_properly_cleaned.csv"
        );

        if (!response.ok) {
          throw new Error(
            "Dataset file could not be loaded."
          );
        }

        const csvText =
          await response.text();

        const parsedData =
          parseCSV(csvText);

        if (!parsedData.length) {
          throw new Error(
            "Dataset contains no usable records."
          );
        }

        setRecords(parsedData);

      } catch (err) {

        console.error(
          "Report dataset error:",
          err
        );

        setError(
          "Dataset load nahi ho paya. Check karo ki CSV file frontend/public ke andar hai."
        );

      } finally {

        setLoading(false);

      }

    }

    loadData();

  }, []);


  /* ===================================================
     AVAILABLE YEARS
  =================================================== */

  const availableYears = useMemo(() => {

    const years = new Set();

    records.forEach((record) => {

      const year =
        String(record.date || "")
          .slice(0, 4);

      if (/^\d{4}$/.test(year)) {
        years.add(year);
      }

    });

    return [
      "All Years",
      ...Array.from(years).sort(
        (a, b) => Number(b) - Number(a)
      ),
    ];

  }, [records]);


  /* ===================================================
     DATASET STATES
  =================================================== */

  const datasetStates = useMemo(() => {

    const states = new Set();

    records.forEach((record) => {

      const state =
        String(record.state || "")
          .trim();

      if (state) {
        states.add(state);
      }

    });

    return Array.from(states).sort();

  }, [records]);


  /* ===================================================
     FILTERED DATA
  =================================================== */

  const filteredRecords = useMemo(() => {

    return records.filter((record) => {

      const stateMatch =
        selectedState === "All India" ||
        normalize(record.state) ===
          normalize(selectedState);

      const year =
        String(record.date || "")
          .slice(0, 4);

      const yearMatch =
        selectedYear === "All Years" ||
        year === selectedYear;

      return stateMatch && yearMatch;

    });

  }, [
    records,
    selectedState,
    selectedYear,
  ]);


  /* ===================================================
     SUMMARY
  =================================================== */

  const summary = useMemo(() => {

    let casualties = 0;

    let fatal = 0;

    let major = 0;

    let minor = 0;

    let highRisk = 0;

    let riskSum = 0;

    let riskCount = 0;


    filteredRecords.forEach((record) => {

      casualties += numberValue(
        record.casualties
      );


      const severity =
        normalize(
          record.accident_severity
        );

      if (severity === "fatal") {
        fatal++;
      }

      else if (severity === "major") {
        major++;
      }

      else if (severity === "minor") {
        minor++;
      }


      const risk =
        numberValue(
          record.risk_score
        );

      if (risk > 0) {

        riskSum += risk;
        riskCount++;

      }

      if (risk >= 0.70) {
        highRisk++;
      }

    });


    const averageRisk =
      riskCount > 0
        ? riskSum / riskCount
        : 0;


    return {
      accidents:
        filteredRecords.length,

      casualties,

      fatal,

      major,

      minor,

      highRisk,

      averageRisk,
    };

  }, [filteredRecords]);


  /* ===================================================
     MONTHLY DATA
  =================================================== */

  const monthlyData = useMemo(() => {

    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const counts =
      Array.from(
        { length: 12 },
        () => 0
      );


    filteredRecords.forEach((record) => {

      const month =
        Number(
          String(record.date || "")
            .slice(5, 7)
        );

      if (
        month >= 1 &&
        month <= 12
      ) {
        counts[month - 1]++;
      }

    });


    return monthNames.map(
      (month, index) => ({
        month,
        accidents: counts[index],
      })
    );

  }, [filteredRecords]);


  /* ===================================================
     CAUSES
  =================================================== */

  const causeData = useMemo(() => {

    const map = new Map();

    filteredRecords.forEach((record) => {

      const cause =
        titleCase(
          normalize(record.cause)
        );

      if (!cause) return;

      map.set(
        cause,
        (map.get(cause) || 0) + 1
      );

    });


    const total =
      filteredRecords.length || 1;


    return Array.from(map.entries())
      .map(([name, count]) => ({
        name,
        accidents: count,
        percentage:
          Number(
            ((count / total) * 100)
              .toFixed(1)
          ),
      }))
      .sort(
        (a, b) =>
          b.accidents - a.accidents
      )
      .slice(0, 5);

  }, [filteredRecords]);


  /* ===================================================
     WEATHER
  =================================================== */

  const weatherData = useMemo(() => {

    const map = new Map();

    filteredRecords.forEach((record) => {

      const weather =
        titleCase(
          normalize(record.weather)
        );

      if (!weather) return;

      map.set(
        weather,
        (map.get(weather) || 0) + 1
      );

    });


    return Array.from(map.entries())
      .map(([weather, accidents]) => ({
        weather,
        accidents,
      }))
      .sort(
        (a, b) =>
          b.accidents - a.accidents
      );

  }, [filteredRecords]);


  /* ===================================================
     TIME DATA
  =================================================== */

  const timeData = useMemo(() => {

    const buckets = [
      {
        label: "00–04",
        min: 0,
        max: 4,
        count: 0,
      },
      {
        label: "04–08",
        min: 4,
        max: 8,
        count: 0,
      },
      {
        label: "08–12",
        min: 8,
        max: 12,
        count: 0,
      },
      {
        label: "12–16",
        min: 12,
        max: 16,
        count: 0,
      },
      {
        label: "16–20",
        min: 16,
        max: 20,
        count: 0,
      },
      {
        label: "20–24",
        min: 20,
        max: 24,
        count: 0,
      },
    ];


    filteredRecords.forEach((record) => {

      const hour =
        numberValue(record.hour);

      const bucket =
        buckets.find(
          (item) =>
            hour >= item.min &&
            hour < item.max
        );

      if (bucket) {
        bucket.count++;
      }

      else if (hour >= 20) {
        buckets[5].count++;
      }

    });


    return buckets.map((bucket) => ({
      time: bucket.label,
      accidents: bucket.count,
    }));

  }, [filteredRecords]);


  /* ===================================================
     SEVERITY
  =================================================== */

  const severityData = useMemo(() => {

    const total =
      filteredRecords.length || 1;

    return [
      {
        label: "Fatal",
        value: summary.fatal,
        percentage:
          Number(
            (
              (summary.fatal / total) *
              100
            ).toFixed(1)
          ),
        className:
          "fatal-bar",
      },

      {
        label: "Major",
        value: summary.major,
        percentage:
          Number(
            (
              (summary.major / total) *
              100
            ).toFixed(1)
          ),
        className:
          "major-bar",
      },

      {
        label: "Minor",
        value: summary.minor,
        percentage:
          Number(
            (
              (summary.minor / total) *
              100
            ).toFixed(1)
          ),
        className:
          "minor-bar",
      },
    ];

  }, [
    filteredRecords.length,
    summary,
  ]);


  /* ===================================================
     VEHICLES INVOLVED
  =================================================== */

  const vehicleData = useMemo(() => {

    const buckets = {
      "1 Vehicle": 0,
      "2 Vehicles": 0,
      "3 Vehicles": 0,
      "4+ Vehicles": 0,
    };


    filteredRecords.forEach((record) => {

      const vehicles =
        numberValue(
          record.vehicles_involved
        );

      if (vehicles <= 1) {
        buckets["1 Vehicle"]++;
      }

      else if (vehicles === 2) {
        buckets["2 Vehicles"]++;
      }

      else if (vehicles === 3) {
        buckets["3 Vehicles"]++;
      }

      else {
        buckets["4+ Vehicles"]++;
      }

    });


    return Object.entries(buckets)
      .map(
        ([type, accidents]) => ({
          type,
          accidents,
        })
      );

  }, [filteredRecords]);


  /* ===================================================
     HANDLERS
  =================================================== */

  function handleGenerate() {

    setReportGenerated(false);

    setTimeout(() => {
      setReportGenerated(true);
    }, 200);

  }


  function handlePrint() {
    window.print();
  }


  function escapeCSV(value) {

    return `"${String(value ?? "")
      .replaceAll('"', '""')}"`;

  }


  function handleExport() {

    if (!filteredRecords.length) {
      return;
    }


    const headers =
      Object.keys(
        filteredRecords[0]
      );


    const csvRows = [
      headers
        .map(escapeCSV)
        .join(","),

      ...filteredRecords.map(
        (record) =>
          headers
            .map(
              (header) =>
                escapeCSV(
                  record[header]
                )
            )
            .join(",")
      ),
    ];


    const csv =
      csvRows.join("\n");


    const blob =
      new Blob(
        [csv],
        {
          type:
            "text/csv;charset=utf-8;",
        }
      );


    const url =
      URL.createObjectURL(blob);


    const link =
      document.createElement("a");

    link.href = url;

    link.download =
      `road-safety-${selectedState
        .toLowerCase()
        .replaceAll(" ", "-")}-${selectedYear}.csv`;

    document.body.appendChild(link);

    link.click();

    link.remove();

    URL.revokeObjectURL(url);

  }


  /* ===================================================
     LOADING
  =================================================== */

  if (loading) {

    return (
      <div className="reports-page">

        <section className="reports-header">

          <div>

            <span className="reports-eyebrow">
              ROAD SAFETY REPORTING
            </span>

            <h1>
              Safety Reports
            </h1>

            <p>
              Loading accident dataset...
            </p>

          </div>

        </section>

        <div className="report-summary-box">

          <div className="summary-mark">
            ...
          </div>

          <div>
            <strong>
              Loading  accident records
            </strong>

            <p>
              Please wait while the report
              dataset is being prepared.
            </p>
          </div>

        </div>

      </div>
    );

  }


  /* ===================================================
     ERROR
  =================================================== */

  if (error) {

    return (
      <div className="reports-page">

        <section className="reports-header">

          <div>

            <span className="reports-eyebrow">
              ROAD SAFETY REPORTING
            </span>

            <h1>
              Safety Reports
            </h1>

            <p>
              Dataset connection required.
            </p>

          </div>

        </section>


        <div className="report-summary-box">

          <div className="summary-mark">
            !
          </div>

          <div>

            <strong>
              Dataset load error
            </strong>

            <p>
              {error}
            </p>

            <p>
              Required file:
              <br />
              frontend/public/road_accidents_properly_cleaned.csv
            </p>

          </div>

        </div>

      </div>
    );

  }


  const activeState =
    selectedState === "All India"
      ? "India"
      : selectedState;


  return (
    <div className="reports-page">


      {/* =================================================
          HEADER
      ================================================= */}

      <section className="reports-header">

        <div>

          <span className="reports-eyebrow">
            ROAD SAFETY REPORTING
          </span>

          <h1>
            Safety Reports
          </h1>

          <p>
            Data-driven accident reporting for
            state-wise and year-wise analysis.
          </p>

        </div>


        <div className="report-header-status">

          <span className="status-dot"></span>

          {records.length.toLocaleString()} records loaded

        </div>

      </section>


      {/* =================================================
          FILTERS
      ================================================= */}

      <section className="report-filter-card">

        <div className="report-filter-title">

          <div className="report-filter-icon">
            📋
          </div>

          <div>

            <strong>
              Report Parameters
            </strong>

            <span>
              Select the actual reporting scope
            </span>

          </div>

        </div>


        <div className="report-filter-fields">

          <div className="report-field">

            <label>
              State / Union Territory
            </label>

            <select
              value={selectedState}
              onChange={(event) => {
                setSelectedState(
                  event.target.value
                );
                setReportGenerated(false);
              }}
            >

              {ALL_STATES.map((state) => {

                const hasData =
                  state === "All India" ||
                  datasetStates.some(
                    (item) =>
                      normalize(item) ===
                      normalize(state)
                  );

                return (
                  <option
                    key={state}
                    value={state}
                  >
                    {state}
                    {!hasData
                      ? " — No dataset records"
                      : ""}
                  </option>
                );

              })}

            </select>

          </div>


          <div className="report-field">

            <label>
              Reporting Year
            </label>

            <select
              value={selectedYear}
              onChange={(event) => {
                setSelectedYear(
                  event.target.value
                );
                setReportGenerated(false);
              }}
            >

              {availableYears.map(
                (year) => (
                  <option
                    key={year}
                    value={year}
                  >
                    {year}
                  </option>
                )
              )}

            </select>

          </div>


          <button
            className="generate-report-btn"
            onClick={handleGenerate}
          >
            <span>✦</span>
            Generate Report
          </button>

        </div>

      </section>


      {/* =================================================
          STATUS
      ================================================= */}

      {reportGenerated && (
        <div className="report-generated-banner">

          <div>

            <span className="generated-icon">
              ✓
            </span>

            <div>

              <strong>
                Report updated from dataset
              </strong>

              <p>
                Filters applied to actual accident records.
              </p>

            </div>

          </div>

          <span>
            {filteredRecords.length.toLocaleString()} records
          </span>

        </div>
      )}


      {/* =================================================
          DOCUMENT HEADER
      ================================================= */}

      <section className="report-document-header">

        <div>

          <span>
            ROAD SAFETY INTELLIGENCE
          </span>

          <h2>
            {activeState} Safety Summary
          </h2>

          <p>
            Reporting period: {selectedYear}
          </p>

        </div>


        <div className="report-actions">

          <button
            onClick={handlePrint}
            className="secondary-report-btn"
          >
            🖨 Print
          </button>

          <button
            onClick={handleExport}
            className="primary-report-btn"
            disabled={!filteredRecords.length}
          >
            ↓ Export Data
          </button>

        </div>

      </section>


      {/* =================================================
          NO DATA
      ================================================= */}

      {filteredRecords.length === 0 ? (

        <div className="report-summary-box">

          <div className="summary-mark">
            —
          </div>

          <div>

            <span>
              NO MATCHING RECORDS
            </span>

            <h3>
              No accident records found for
              {" "}
              {activeState}
              {" "}
              /{" "}
              {selectedYear}.
            </h3>

            <p>
              This does not mean the state has no
              accidents overall. It means the current
              dataset does not contain matching records
              for this filter.
            </p>

          </div>

        </div>

      ) : (

        <>


          {/* =================================================
              STATS
          ================================================= */}

          <section className="report-stat-grid">

            <div className="report-stat orange">

              <div className="report-stat-icon">
                🚗
              </div>

              <div>

                <span>
                  Total Accidents
                </span>

                <strong>
                  {summary.accidents.toLocaleString()}
                </strong>

                <small>
                  Actual filtered records
                </small>

              </div>

            </div>


            <div className="report-stat green">

              <div className="report-stat-icon">
                👥
              </div>

              <div>

                <span>
                  Casualties
                </span>

                <strong>
                  {summary.casualties.toLocaleString()}
                </strong>

                <small>
                  Sum of recorded casualties
                </small>

              </div>

            </div>


            <div className="report-stat red">

              <div className="report-stat-icon">
                🚨
              </div>

              <div>

                <span>
                  Fatal Accidents
                </span>

                <strong>
                  {summary.fatal.toLocaleString()}
                </strong>

                <small>
                  Fatal severity records
                </small>

              </div>

            </div>


            <div className="report-stat yellow">

              <div className="report-stat-icon">
                ⚠️
              </div>

              <div>

                <span>
                  High Risk Records
                </span>

                <strong>
                  {summary.highRisk.toLocaleString()}
                </strong>

                <small>
                  Risk score ≥ 0.70
                </small>

              </div>

            </div>

          </section>


          {/* =================================================
              SECONDARY METRICS
          ================================================= */}

          <div className="report-summary-box">

            <div className="summary-mark">
              AI
            </div>

            <div>

              <span>
                RISK OVERVIEW
              </span>

              <h3>
                Average recorded risk score:{" "}
                {summary.averageRisk.toFixed(2)}
              </h3>

              <p>
                Black spot count is intentionally not
                fabricated here. Final black-spot numbers
                should come from the DBSCAN backend.
              </p>

            </div>

          </div>


          {/* =================================================
              MONTHLY + SEVERITY
          ================================================= */}

          <section className="report-content-grid">


            <div className="report-card large">

              <div className="report-card-heading">

                <div>

                  <span>
                    TREND SUMMARY
                  </span>

                  <h3>
                    Monthly Accident Activity
                  </h3>

                </div>

                <div className="report-chip">
                  {activeState}
                </div>

              </div>


              <div className="report-chart">

                <ResponsiveContainer
                  width="100%"
                  height={320}
                >

                  <LineChart
                    data={monthlyData}
                    margin={{
                      left: -15,
                      right: 15,
                      top: 10,
                      bottom: 0,
                    }}
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
                        fill: "#78817d",
                        fontSize: 11,
                      }}
                    />

                    <YAxis
                      allowDecimals={false}
                      axisLine={false}
                      tickLine={false}
                      tick={{
                        fill: "#78817d",
                        fontSize: 11,
                      }}
                    />

                    <Tooltip />

                    <Line
                      type="monotone"
                      dataKey="accidents"
                      name="Accidents"
                      stroke="#c85d46"
                      strokeWidth={3}
                      dot={{
                        r: 3.5,
                      }}
                      activeDot={{
                        r: 7,
                      }}
                    />

                  </LineChart>

                </ResponsiveContainer>

              </div>

            </div>


            <div className="report-card">

              <div className="report-card-heading">

                <div>

                  <span>
                    SEVERITY SUMMARY
                  </span>

                  <h3>
                    Accident Classification
                  </h3>

                </div>

              </div>


              <div className="severity-report">

                <div className="severity-total">

                  <strong>
                    {summary.accidents.toLocaleString()}
                  </strong>

                  <span>
                    Total filtered cases
                  </span>

                </div>


                <div className="severity-bars">

                  {severityData.map(
                    (item) => (

                      <div
                        className="severity-item"
                        key={item.label}
                      >

                        <div className="severity-item-top">

                          <span>
                            {item.label}
                          </span>

                          <strong>
                            {item.value}
                            {" "}
                            ({item.percentage}%)
                          </strong>

                        </div>

                        <div className="severity-progress">

                          <div
                            className={item.className}
                            style={{
                              width: `${item.percentage}%`,
                            }}
                          ></div>

                        </div>

                      </div>

                    )
                  )}

                </div>

              </div>

            </div>

          </section>


          {/* =================================================
              CAUSE + WEATHER
          ================================================= */}

          <section className="report-content-grid">


            <div className="report-card">

              <div className="report-card-heading">

                <div>

                  <span>
                    CONTRIBUTING FACTORS
                  </span>

                  <h3>
                    Leading Accident Causes
                  </h3>

                </div>

              </div>


              <div className="cause-report-list">

                {causeData.map(
                  (cause, index) => (

                    <div
                      className="cause-report-row"
                      key={cause.name}
                    >

                      <div className="cause-name">

                        <span>
                          {index + 1}
                        </span>

                        {cause.name}

                      </div>


                      <div className="cause-bar">

                        <div
                          style={{
                            width: `${Math.min(
                              cause.percentage * 2.5,
                              100
                            )}%`,
                          }}
                        ></div>

                      </div>


                      <strong>
                        {cause.percentage}%
                      </strong>

                    </div>

                  )
                )}

              </div>

            </div>


            <div className="report-card">

              <div className="report-card-heading">

                <div>

                  <span>
                    ENVIRONMENT
                  </span>

                  <h3>
                    Weather Conditions
                  </h3>

                </div>

              </div>


              <ResponsiveContainer
                width="100%"
                height={300}
              >

                <BarChart
                  data={weatherData}
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
                      fill: "#78817d",
                      fontSize: 10,
                    }}
                  />

                  <YAxis
                    allowDecimals={false}
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fill: "#78817d",
                      fontSize: 10,
                    }}
                  />

                  <Tooltip />

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
              TIME + VEHICLE
          ================================================= */}

          <section className="report-content-grid">


            <div className="report-card">

              <div className="report-card-heading">

                <div>

                  <span>
                    TIME INTELLIGENCE
                  </span>

                  <h3>
                    Accident Activity by Time
                  </h3>

                </div>

              </div>


              <ResponsiveContainer
                width="100%"
                height={290}
              >

                <BarChart
                  data={timeData}
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
                      fill: "#78817d",
                      fontSize: 10,
                    }}
                  />

                  <YAxis
                    allowDecimals={false}
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fill: "#78817d",
                      fontSize: 10,
                    }}
                  />

                  <Tooltip />

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


            <div className="report-card">

              <div className="report-card-heading">

                <div>

                  <span>
                    VEHICLE INVOLVEMENT
                  </span>

                  <h3>
                    Vehicles Involved per Accident
                  </h3>

                </div>

              </div>


              <div className="vehicle-list">

                {vehicleData.map(
                  (vehicle, index) => {

                    const maxValue =
                      Math.max(
                        ...vehicleData.map(
                          (item) =>
                            item.accidents
                        ),
                        1
                      );


                    return (
                      <div
                        className="vehicle-row"
                        key={vehicle.type}
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
                              width: `${
                                (vehicle.accidents /
                                  maxValue) *
                                100
                              }%`,
                            }}
                          ></div>

                        </div>


                        <strong>
                          {vehicle.accidents}
                        </strong>

                      </div>
                    );

                  }
                )}

              </div>

            </div>

          </section>


          {/* =================================================
              DATA AVAILABILITY
          ================================================= */}

          <section className="report-summary-box">

            <div className="summary-mark">
              i
            </div>

            <div>

              <span>
                DATA AVAILABILITY
              </span>

              <h3>
                Current dataset coverage
              </h3>

              <p>
                Visibility values are not populated in the
                current cleaned CSV, so no visibility-based
                report metric is being invented. Black spot
                totals should come from the existing DBSCAN
                backend.
              </p>

            </div>

          </section>


          {/* =================================================
              ACTIONS
          ================================================= */}

          <section className="report-content-grid">

            <div className="report-card action-card">

              <div className="report-card-heading">

                <div>

                  <span>
                    SAFETY RESPONSE
                  </span>

                  <h3>
                    Recommended Actions
                  </h3>

                </div>

              </div>


              <div className="action-list">

                <div className="action-item">

                  <span>
                    01
                  </span>

                  <div>

                    <strong>
                      Monitor repeated accident locations
                    </strong>

                    <p>
                      Review locations where accident
                      activity remains concentrated.
                    </p>

                  </div>

                </div>


                <div className="action-item">

                  <span>
                    02
                  </span>

                  <div>

                    <strong>
                      Review leading accident causes
                    </strong>

                    <p>
                      Use the filtered cause distribution
                      to identify the areas needing attention.
                    </p>

                  </div>

                </div>


                <div className="action-item">

                  <span>
                    03
                  </span>

                  <div>

                    <strong>
                      Inspect severe accident patterns
                    </strong>

                    <p>
                      Give additional attention to fatal
                      and major severity records.
                    </p>

                  </div>

                </div>

                <div className="action-item">

                  <span>
                    04
                  </span>

                  <div>

                    <strong>
                      Combine report with DBSCAN hotspots
                    </strong>

                    <p>
                      Use the existing backend hotspot
                      output for location-specific action.
                    </p>

                  </div>

                </div>

              </div>

            </div>


            <div className="report-card">

              <div className="report-card-heading">

                <div>

                  <span>
                    REPORT SUMMARY
                  </span>

                  <h3>
                    Current Filter
                  </h3>

                </div>

              </div>


              <div className="severity-report">

                <div className="severity-total">

                  <strong>
                    {filteredRecords.length.toLocaleString()}
                  </strong>

                  <span>
                    Matching accident records
                  </span>

                </div>


                <div className="action-list">

                  <div className="action-item">

                    <span>
                      STATE
                    </span>

                    <div>
                      <strong>
                        {activeState}
                      </strong>

                      <p>
                        Selected geographical scope.
                      </p>
                    </div>

                  </div>


                  <div className="action-item">

                    <span>
                      YEAR
                    </span>

                    <div>
                      <strong>
                        {selectedYear}
                      </strong>

                      <p>
                        Selected reporting period.
                      </p>
                    </div>

                  </div>


                  <div className="action-item">

                    <span>
                      RISK
                    </span>

                    <div>
                      <strong>
                        {summary.highRisk}
                        {" "}
                        high-risk records
                      </strong>

                      <p>
                        Based on risk_score ≥ 0.70.
                      </p>
                    </div>

                  </div>

                </div>

              </div>

            </div>

          </section>

        </>

      )}


      {/* =================================================
          FOOTER
      ================================================= */}

      <footer className="reports-footer">

        <span>
          RoadSafe AI • Road Safety Intelligence
        </span>

        <span>
          Source: cleaned accident dataset
        </span>

      </footer>

    </div>
  );
}