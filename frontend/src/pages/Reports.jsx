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

const ALL_STATES = [
  "All India","Andhra Pradesh","Arunachal Pradesh","Assam","Bihar",
  "Chhattisgarh","Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand",
  "Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya",
  "Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu",
  "Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal",
  "Andaman and Nicobar Islands","Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu","Delhi","Jammu and Kashmir",
  "Ladakh","Lakshadweep","Puducherry",
];

function numberValue(value) {
  const num = Number(value);
  return Number.isFinite(num) ? num : 0;
}

function normalize(value) {
  return String(value || "").trim().toLowerCase();
}

export default function Reports() {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedState, setSelectedState] = useState("All India");
  const [selectedYear, setSelectedYear] = useState("All Years");
  const [reportGenerated, setReportGenerated] = useState(false);

  useEffect(() => {
    async function loadReportData() {
      try {
        setLoading(true);
        setError("");

        const apiBase =
          import.meta.env.VITE_API_URL || "http://localhost:8001";

        const response = await fetch(`${apiBase}/api/reports`);

        if (!response.ok) {
          throw new Error("Reports API could not be loaded.");
        }

        const data = await response.json();
        console.log("Reports API data:", data);
        setReportData(data);
      } catch (err) {
        console.error("Reports API error:", err);
        setError("Report data could not be loaded from the FastAPI backend.");
      } finally {
        setLoading(false);
      }
    }

    loadReportData();
  }, []);

  const availableYears = ["All Years", "2024", "2023", "2022", "2021", "2020"];

  const datasetStates = useMemo(() => {
    if (!reportData?.state_accidents) return [];
    return reportData.state_accidents
      .map((item) => item.state)
      .filter(Boolean)
      .sort();
  }, [reportData]);

  const selectedStateData = useMemo(() => {
    if (!reportData?.state_accidents) return null;

    if (selectedState === "All India") {
      const rows = reportData.state_accidents;
      const total = (year) =>
        rows.reduce(
          (sum, item) => sum + numberValue(item[`accidents_${year}`]),
          0
        );

      return {
        accidents_2020: total("2020"),
        accidents_2021: total("2021"),
        accidents_2022: total("2022"),
        accidents_2023: total("2023"),
        accidents_2024: total("2024"),
      };
    }

    return (
      reportData.state_accidents.find(
        (item) => normalize(item.state) === normalize(selectedState)
      ) || null
    );
  }, [reportData, selectedState]);

  const summary = useMemo(() => {
    if (!selectedStateData) {
      return {
        accidents: 0,
        casualties: 0,
        fatal: 0,
        highRisk: 0,
      };
    }

    if (selectedYear === "All Years") {
      return {
        accidents: ["2020","2021","2022","2023","2024"].reduce(
          (sum, year) =>
            sum + numberValue(selectedStateData[`accidents_${year}`]),
          0
        ),
        casualties: 0,
        fatal: 0,
        highRisk: 0,
      };
    }

    return {
      accidents: numberValue(
        selectedStateData[`accidents_${selectedYear}`]
      ),
      casualties: 0,
      fatal: 0,
      highRisk: 0,
    };
  }, [selectedStateData, selectedYear]);

  const monthlyData = useMemo(() => {
    const months = [
      "Jan","Feb","Mar","Apr","May","Jun",
      "Jul","Aug","Sep","Oct","Nov","Dec",
    ];
    const counts = Array(12).fill(0);

    if (!reportData?.monthly_activity) {
      return months.map((month) => ({ month, accidents: 0 }));
    }

    reportData.monthly_activity.forEach((item) => {
      const matches =
        selectedState === "All India" ||
        normalize(item.state) === normalize(selectedState);

      if (!matches) return;

      const month = numberValue(item.month);
      if (month >= 1 && month <= 12) {
        counts[month - 1] += numberValue(item.accidents);
      }
    });

    return months.map((month, index) => ({
      month,
      accidents: counts[index],
    }));
  }, [reportData, selectedState]);

  const greySpots = useMemo(() => {
    if (!reportData?.grey_spots) return [];

    return reportData.grey_spots
      .filter(
        (item) =>
          selectedState === "All India" ||
          normalize(item.state) === normalize(selectedState)
      )
      .sort(
        (a, b) =>
          numberValue(b.grey_score) - numberValue(a.grey_score)
      )
      .slice(0, 6);
  }, [reportData, selectedState]);

  const vehicleData = useMemo(() => {
    if (!reportData?.vehicle_analysis) return [];

    const totals = {
      "Bicycles": 0,
      "Two Wheelers": 0,
      "Auto Rickshaws": 0,
      "Cars / Taxis / Vans": 0,
      "Trucks / Lorries": 0,
      "Buses": 0,
      "Other Non-Motor Vehicles": 0,
      "Others": 0,
    };

    reportData.vehicle_analysis.forEach((row) => {
      totals["Bicycles"] += numberValue(row.bicycles);
      totals["Two Wheelers"] += numberValue(row.two_wheelers);
      totals["Auto Rickshaws"] += numberValue(row.auto_rickshaws);
      totals["Cars / Taxis / Vans"] += numberValue(row.cars_taxis_vans);
      totals["Trucks / Lorries"] += numberValue(row.trucks_lorries);
      totals["Buses"] += numberValue(row.buses);
      totals["Other Non-Motor Vehicles"] += numberValue(row.other_non_motor);
      totals["Others"] += numberValue(row.others);
    });

    return Object.entries(totals)
      .map(([vehicle, accidents]) => ({ vehicle, accidents }))
      .filter((item) => item.accidents > 0)
      .sort((a, b) => b.accidents - a.accidents);
  }, [reportData]);

  const collisionData = useMemo(() => {
    if (!reportData?.collision_analysis) return [];

    return reportData.collision_analysis
      .map((item) => ({
        type: item.collision_type,
        accidents: numberValue(item.accidents_2024),
        killed: numberValue(item.killed_2024),
        injured: numberValue(item.injured_2024),
        change: numberValue(item.change_accidents),
      }))
      .filter((item) => item.type)
      .sort((a, b) => b.accidents - a.accidents);
  }, [reportData]);

  const violationData = useMemo(() => {
    if (!reportData?.violation_analysis) return [];

    return reportData.violation_analysis
      .map((item) => ({
        category: item.category,
        accidents: numberValue(item.accidents_2024),
        killed: numberValue(item.killed_2024),
        injured: numberValue(item.injured_2024),
        change: numberValue(item.change_accidents),
      }))
      .filter((item) => item.category)
      .sort((a, b) => b.accidents - a.accidents);
  }, [reportData]);

  const handleGenerate = () => {
    setReportGenerated(false);
    setTimeout(() => setReportGenerated(true), 200);
  };

  const handlePrint = () => window.print();

  const handleExport = () => {
    const rows = reportData?.state_accidents || [];
    if (!rows.length) return;

    const headers = Object.keys(rows[0]);
    const escapeCSV = (value) =>
      `"${String(value ?? "").replaceAll('"', '""')}"`;

    const csv = [
      headers.map(escapeCSV).join(","),
      ...rows.map((row) =>
        headers.map((header) => escapeCSV(row[header])).join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `road-safety-${selectedState
      .toLowerCase()
      .replaceAll(" ", "-")}-${selectedYear}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="reports-page">
        <section className="reports-header">
          <div>
            <span className="reports-eyebrow">ROAD SAFETY REPORTING</span>
            <h1>Safety Reports</h1>
            <p>Loading accident analytics...</p>
          </div>
        </section>
      </div>
    );
  }

  if (error) {
    return (
      <div className="reports-page">
        <section className="reports-header">
          <div>
            <span className="reports-eyebrow">ROAD SAFETY REPORTING</span>
            <h1>Safety Reports</h1>
            <p>{error}</p>
          </div>
        </section>
      </div>
    );
  }

  const activeState = selectedState === "All India" ? "India" : selectedState;

  return (
    <div className="reports-page">
      <section className="reports-header">
        <div>
          <span className="reports-eyebrow">ROAD SAFETY REPORTING</span>
          <h1>Safety Reports</h1>
          <p>
            Data-driven accident reporting for state-wise and year-wise analysis.
          </p>
        </div>

        <div className="report-header-status">
          <span className="status-dot"></span>
          {reportData?.state_accidents?.length?.toLocaleString() || 0} states covered
        </div>
      </section>

      <section className="report-filter-card">
        <div className="report-filter-title">
          <div className="report-filter-icon">📋</div>
          <div>
            <strong>Report Parameters</strong>
            <span>Select the reporting scope</span>
          </div>
        </div>

        <div className="report-filter-fields">
          <div className="report-field">
            <label>State / Union Territory</label>
            <select
              value={selectedState}
              onChange={(event) => {
                setSelectedState(event.target.value);
                setReportGenerated(false);
              }}
            >
              {ALL_STATES.map((state) => {
                const hasData =
                  state === "All India" ||
                  datasetStates.some(
                    (item) => normalize(item) === normalize(state)
                  );

                return (
                  <option key={state} value={state}>
                    {state}
                    {!hasData ? " — No dataset records" : ""}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="report-field">
            <label>Reporting Year</label>
            <select
              value={selectedYear}
              onChange={(event) => {
                setSelectedYear(event.target.value);
                setReportGenerated(false);
              }}
            >
              {availableYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <button className="generate-report-btn" onClick={handleGenerate}>
            <span>✦</span>
            Generate Report
          </button>
        </div>
      </section>

      {reportGenerated && (
        <div className="report-generated-banner">
          <div>
            <span className="generated-icon">✓</span>
            <div>
              <strong>Report updated from dataset</strong>
              <p>Filters applied to the available reporting data.</p>
            </div>
          </div>
          <span>{summary.accidents.toLocaleString()} accidents</span>
        </div>
      )}

      <section className="report-document-header">
        <div>
          <span>ROAD SAFETY INTELLIGENCE</span>
          <h2>{activeState} Safety Summary</h2>
          <p>Reporting period: {selectedYear}</p>
        </div>

        <div className="report-actions">
          <button onClick={handlePrint} className="secondary-report-btn">
            🖨 Print
          </button>
          <button onClick={handleExport} className="primary-report-btn">
            ↓ Export Data
          </button>
        </div>
      </section>

      <section className="report-stat-grid">
        <div className="report-stat orange">
          <div className="report-stat-icon">🚗</div>
          <div>
            <span>Total Accidents</span>
            <strong>{summary.accidents.toLocaleString()}</strong>
            <small>Selected reporting scope</small>
          </div>
        </div>

        <div className="report-stat green">
          <div className="report-stat-icon">👥</div>
          <div>
            <span>Casualties</span>
            <strong>{summary.casualties.toLocaleString()}</strong>
            <small>Not available in current summary API</small>
          </div>
        </div>

        <div className="report-stat red">
          <div className="report-stat-icon">🚨</div>
          <div>
            <span>Fatal Accidents</span>
            <strong>{summary.fatal.toLocaleString()}</strong>
            <small>Severity aggregation pending</small>
          </div>
        </div>

        <div className="report-stat yellow">
          <div className="report-stat-icon">⚠️</div>
          <div>
            <span>High Risk Records</span>
            <strong>{summary.highRisk.toLocaleString()}</strong>
            <small>Risk aggregation pending</small>
          </div>
        </div>
      </section>

     {/* GREY SPOT / EMERGING RISK */}
<section className="report-content-grid">
  <div className="report-card large">
    <div className="report-card-heading">
      <div>
        <span>EMERGING RISK INTELLIGENCE</span>
        <h3>Grey Spot / Emerging Risk</h3>
      </div>
      <div className="report-chip">AI ANALYTICS</div>
    </div>

    {greySpots.length === 0 ? (
      <p>No emerging-risk locations available.</p>
    ) : (
      <div className="vehicle-list">
        {greySpots.map((item, index) => {
          const score = Math.min(
            numberValue(item.grey_spot_score),
            100
          );

          const maxScore = Math.max(
            ...greySpots.map((row) =>
              numberValue(row.grey_spot_score)
            ),
            1
          );

          return (
            <div
              className="vehicle-row"
              key={`${item.state}-${index}`}
            >
              <div className="vehicle-name">
                <span>{index + 1}</span>

                <div>
                  <strong>{item.state || "Unknown State"}</strong>
                  <small>{item.status || "WATCH"}</small>
                </div>
              </div>

              <div className="vehicle-bar">
                <div
                  style={{
                    width: `${(score / maxScore) * 100}%`,
                  }}
                ></div>
              </div>

              <strong>{score.toFixed(1)}</strong>
            </div>
          );
        })}
      </div>
    )}

    <p style={{ marginTop: 18 }}>
      Grey Spot is an analytical emerging-risk indicator based on
      recent accident trends and historical hotspot activity. It is
      not an official government designation.
    </p>
  </div>

  {/* GREY SPOT DETAILS */}
  <div className="report-card large">
    <div className="report-card-heading">
      <div>
        <span>RISK SIGNALS</span>
        <h3>How the Grey Spot Signal Works</h3>
      </div>
      <div className="report-chip">DECISION SUPPORT</div>
    </div>

    {greySpots.length > 0 ? (
      (() => {
        const top = greySpots[0];

        return (
          <div>
            <div className="report-summary-box">
              <strong>{top.state}</strong>
              <p>
                Current Status: <strong>{top.status}</strong>
              </p>
              <p>
                Grey Spot Score:{" "}
                <strong>
                  {numberValue(top.grey_spot_score).toFixed(1)} / 100
                </strong>
              </p>
            </div>

            <div style={{ marginTop: 20 }}>
              <div className="action-item">
                <strong>Recent Accident Trend</strong>
                <span>
                  {numberValue(top.change_percent).toFixed(1)}%
                  change from 2023 to 2024
                </span>
              </div>

              <div className="action-item">
                <strong>2024 Accidents</strong>
                <span>
                  {numberValue(top.accidents_2024).toLocaleString()}
                </span>
              </div>

              <div className="action-item">
                <strong>Historical Hotspots</strong>
                <span>{top.hotspot_count} detected clusters</span>
              </div>

              <div className="action-item">
                <strong>Hotspot Crash Records</strong>
                <span>
                  {numberValue(top.hotspot_crashes).toLocaleString()}
                </span>
              </div>
            </div>

            <p style={{ marginTop: 18 }}>
              A higher score indicates stronger emerging-risk signals
              in the available historical and recent accident data.
            </p>
          </div>
        );
      })()
    ) : (
      <p>No Grey Spot details available.</p>
    )}
  </div>
</section> 

      {/* MONTHLY + SEVERITY */}
      <section className="report-content-grid">
        <div className="report-card large">
          <div className="report-card-heading">
            <div>
              <span>TREND SUMMARY</span>
              <h3>Monthly Accident Activity</h3>
            </div>
            <div className="report-chip">{activeState}</div>
          </div>

          <div className="report-chart">
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={monthlyData}>
                <CartesianGrid
                  stroke="#edf0ed"
                  strokeDasharray="4 4"
                  vertical={false}
                />
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} axisLine={false} tickLine={false} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="accidents"
                  name="Accidents"
                  stroke="#c85d46"
                  strokeWidth={3}
                  dot={{ r: 3.5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="report-card">
          <div className="report-card-heading">
            <div>
              <span>SEVERITY SUMMARY</span>
              <h3>Accident Classification</h3>
            </div>
          </div>

          <div className="severity-report">
            <div className="severity-total">
              <strong>{summary.accidents.toLocaleString()}</strong>
              <span>Total selected cases</span>
            </div>
            <p>
              This report reflects real data from our system. Any numbers not
  yet available are marked as pending, not estimated or guessed
            </p>
          </div>
        </div>
      </section>

      {/* COLLISION + VEHICLE */}
      <section className="report-content-grid">
        <div className="report-card">
          <div className="report-card-heading">
            <div>
              <span>ACCIDENT PATTERNS</span>
              <h3>Major Collision Patterns</h3>
            </div>
          </div>

          {collisionData.length === 0 ? (
            <p>No collision data available.</p>
          ) : (
            <div className="vehicle-list">
              {collisionData.slice(0, 6).map((item, index) => {
                const maxValue = Math.max(
                  ...collisionData.map((row) => row.accidents),
                  1
                );

                return (
                  <div className="vehicle-row" key={item.type}>
                    <div className="vehicle-name">
                      <span>{index + 1}</span>
                      {item.type}
                    </div>
                    <div className="vehicle-bar">
                      <div
                        style={{
                          width: `${(item.accidents / maxValue) * 100}%`,
                        }}
                      ></div>
                    </div>
                    <strong>{item.accidents.toLocaleString()}</strong>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="report-card">
          <div className="report-card-heading">
            <div>
              <span>VEHICLE ANALYSIS</span>
              <h3>Vehicle Type Distribution</h3>
            </div>
          </div>

          {vehicleData.length === 0 ? (
            <p>No vehicle data available.</p>
          ) : (
            <div className="vehicle-list">
              {vehicleData.slice(0, 6).map((item, index) => {
                const maxValue = Math.max(
                  ...vehicleData.map((row) => row.accidents),
                  1
                );

                return (
                  <div className="vehicle-row" key={item.vehicle}>
                    <div className="vehicle-name">
                      <span>{index + 1}</span>
                      {item.vehicle}
                    </div>
                    <div className="vehicle-bar">
                      <div
                        style={{
                          width: `${(item.accidents / maxValue) * 100}%`,
                        }}
                      ></div>
                    </div>
                    <strong>{item.accidents.toLocaleString()}</strong>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      

      {/* TRAFFIC VIOLATIONS */}
      <section className="report-content-grid">
        <div className="report-card">
          <div className="report-card-heading">
            <div>
              <span>TRAFFIC BEHAVIOUR</span>
              <h3>Traffic Violation Analysis</h3>
            </div>
          </div>

          {violationData.length === 0 ? (
            <p>No violation data available.</p>
          ) : (
            <div className="vehicle-list">
              {violationData.slice(0, 6).map((item, index) => {
                const maxValue = Math.max(
                  ...violationData.map((row) => row.accidents),
                  1
                );

                return (
                  <div className="vehicle-row" key={item.category}>
                    <div className="vehicle-name">
                      <span>{index + 1}</span>
                      {item.category}
                    </div>
                    <div className="vehicle-bar">
                      <div
                        style={{
                          width: `${(item.accidents / maxValue) * 100}%`,
                        }}
                      ></div>
                    </div>
                    <strong>{item.accidents.toLocaleString()}</strong>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* CURRENT FILTER */}
      <section className="report-summary-box">
        <div className="summary-mark">i</div>
        <div>
          <span>REPORT SUMMARY</span>
          <h3>Current Filter</h3>
          <p>
            State: <strong>{activeState}</strong> · Year:{" "}
            <strong>{selectedYear}</strong> · Matching accident records:{" "}
            <strong>{summary.accidents.toLocaleString()}</strong>
          </p>
        </div>
      </section>

      {/* DATA AVAILABILITY */}
      <section className="report-summary-box">
        <div className="summary-mark">i</div>
        <div>
          <span>DATA AVAILABILITY</span>
          <h3>Current dataset coverage</h3>
          <p>
            This report reflects live data returned by the RoadSafe AI backend.
  Metrics not yet aggregated at the source are marked as pending,
  rather than estimated or filled in.
          </p>
        </div>
      </section>

      <footer className="reports-footer">
        <span>RoadSafe AI • Road Safety Intelligence</span>
        <span>Source: reporting datasets connected to FastAPI</span>
      </footer>
    </div>
  );
}
