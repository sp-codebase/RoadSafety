import React, { useEffect, useMemo, useState } from "react";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./BlackSpots.css";

/* =========================================================
   RAJASTHAN + CONNECTED STATES
========================================================= */

const stateCenters = {
  "All": [24.6, 74.8],
  Rajasthan: [26.9, 75.8],
  Punjab: [30.9, 75.8],
  Haryana: [29.0, 76.1],
  "Uttar Pradesh": [26.8, 80.9],
  "Madhya Pradesh": [23.5, 77.4],
  Gujarat: [22.3, 71.9],
};

const connectedStates = [
  "All",
  "Maharashtra",
  "Uttar Pradesh",
  "Madhya Pradesh",
  "Tamil Nadu",
  "Karnataka",
  "Rajasthan",
  "Andhra Pradesh",
  "Telangana",
  "Punjab",
  "Haryana",
  "West Bengal",
  "Gujarat",
  "Delhi",
  "Chhattisgarh",
  "Uttarakhand",
  "Kerala",
  "Bihar",
  "Jammu and Kashmir",
  "Himachal Pradesh",
  "Assam",
  "Goa",
  "Chandigarh",
  "Jharkhand",
  "Odisha",
  "Nagaland",
  "Manipur",
  "Sikkim",
  "Meghalaya",
  "Mizoram",
];
/* =========================================================
   MAP CONTROLLER
========================================================= */

function MapController({ center, focusSpot ,zoom}) {
  const map = useMap();

  React.useEffect(() => {
    if (focusSpot) {
      map.flyTo(
        [focusSpot.lat, focusSpot.lng],
        14,
        {
          duration: 1.1,
        }
      );
    } else {
      map.flyTo(center, zoom, {
        duration: 1.1,
      });
    }
  }, [center, focusSpot, map, zoom]);

  return null;
}

/* =========================================================
   HELPERS
========================================================= */

function getHotspotStatus(item) {
  if (item.risk >= 80) {
    return {
      key: "critical",
      label: "Critical",
      color: "#dc2626",
    };
  }

  if (item.risk >= 70) {
    return {
      key: "high",
      label: "High Risk",
      color: "#f97316",
    };
  }

  if (item.risk >= 45) {
    return {
      key: "watch",
      label: "Watch Area",
      color: "#eab308",
    };
  }

  return {
    key: "monitored",
    label: "Monitored",
    color: "#16a34a",
  };
}

function getStatusReason(item) {
  const status = getHotspotStatus(item);

  if (status.key === "critical") {
    return `Very high risk (${item.risk}/100) with concentrated accident activity.`;
  }

  if (status.key === "high") {
    return `Elevated risk (${item.risk}/100) requiring focused corrective action.`;
  }

  if (status.key === "watch") {
    return `Moderate risk with relatively stable accident activity.`;
  }

  return `Current activity is comparatively lower and suitable for routine monitoring.`;
}

function getProblems(item) {
  switch (item.cause) {
    case "Overspeeding":
      return [
        "High-speed movement is increasing accident severity risk.",
        "Speed compliance needs closer monitoring.",
        "The road segment may require stronger speed-control measures.",
      ];

    case "Heavy Traffic":
      return [
        "High traffic volume can create frequent conflict points.",
        "Lane capacity may be insufficient during peak periods.",
        "Junction or corridor management needs review.",
      ];

    case "Poor Road Conditions":
      return [
        "Damaged pavement can reduce vehicle stability.",
        "Road defects may increase sudden braking and swerving.",
        "Engineering inspection is required for the affected segment.",
      ];

    case "Poor Visibility":
      return [
        "Low visibility can reduce driver reaction time.",
        "Lighting and reflective road guidance may be insufficient.",
        "Night-time or weather-related visibility needs monitoring.",
      ];

    case "Intersection Conflict":
      return [
        "Multiple traffic movements may be creating conflict points.",
        "Turning and crossing movements require review.",
        "Signal timing and lane guidance may need improvement.",
      ];

    case "Lane Discipline":
      return [
        "Unsafe lane changes can increase side-impact conflicts.",
        "Lane markings and directional guidance may need improvement.",
        "Enforcement may be required during busy periods.",
      ];

    case "Traffic Congestion":
      return [
        "Repeated congestion can increase sudden braking and lane conflicts.",
        "Peak-hour traffic flow needs closer observation.",
        "Road capacity and junction management should be reviewed.",
      ];

    default:
      return [
        "Historical accident concentration requires investigation.",
        "Field conditions should be reviewed.",
        "Continued monitoring is recommended.",
      ];
  }
}

function getActionPlan(item) {
  const actions = [];

  switch (item.cause) {
    case "Overspeeding":
      actions.push(
        "Deploy speed monitoring or radar enforcement.",
        "Review speed-limit signage and road markings.",
        "Increase patrol coverage during peak hours."
      );
      break;

    case "Heavy Traffic":
      actions.push(
        "Review traffic signal timing and lane capacity.",
        "Monitor congestion during peak periods.",
        "Evaluate junction redesign or traffic diversion."
      );
      break;

    case "Poor Road Conditions":
      actions.push(
        "Inspect pavement and damaged road sections.",
        "Repair potholes and restore lane markings.",
        "Schedule engineering inspection for surface issues."
      );
      break;

    case "Poor Visibility":
      actions.push(
        "Improve street lighting and reflective signage.",
        "Review visibility during fog or low-light conditions.",
        "Increase warning signage near the affected segment."
      );
      break;

    case "Intersection Conflict":
      actions.push(
        "Review intersection signal timing.",
        "Improve turning guidance and lane markings.",
        "Evaluate pedestrian and turning movement conflicts."
      );
      break;

    case "Lane Discipline":
      actions.push(
        "Improve lane markings and directional signs.",
        "Increase enforcement at high-conflict periods.",
        "Review merge and lane-changing zones."
      );
      break;

    case "Traffic Congestion":
      actions.push(
        "Monitor peak-hour congestion.",
        "Review junction capacity and traffic flow.",
        "Coordinate traffic management during busy periods."
      );
      break;

    default:
      actions.push(
        "Conduct field inspection.",
        "Review historical accident activity.",
        "Continue targeted monitoring."
      );
  }

  const status = getHotspotStatus(item);

  if (status.key === "critical") {
    actions.unshift("Priority intervention required.");
  }

  if (status.key === "high") {
    actions.unshift("Focused corrective action recommended.");
  }

  if (status.key === "watch") {
    actions.push(
      "Continue observation and review new accident activity."
    );
  }

  if (status.key === "monitored") {
    actions.push(
      "Continue routine monitoring for new accident activity."
    );
  }

  return actions;
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function BlackSpots() {
  const [hotspotData, setHotspotData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHotspots = async () => {
      try {
       const response = await fetch(
  `${import.meta.env.VITE_API_URL}/api/hotspots`
);
        if (!response.ok) {
          throw new Error("Failed to fetch hotspots");
        }

        const data = await response.json();

        const formattedHotspots = data.hotspots.map((spot) => ({
          id: spot.cluster_id,
          state: spot.state,
          city: spot.city,

          location:
            spot.city && spot.city !== "Nil"
              ? `${spot.city} Cluster ${spot.cluster_id}`
              : `Cluster ${spot.cluster_id}`,

          lat: spot.latitude,
          lng: spot.longitude,

          // Analytical hotspot information from DBSCAN backend data
          roadType: "Historical Accident Hotspot",
          cause: "Historical Accident Concentration",

          // Historical DBSCAN hotspot score
          risk: Math.round(spot.hotspot_score),

          // Total crashes inside the cluster
          crashCount: spot.crash_count,

          // Accident impact information
          totalKilled: spot.total_killed,
          totalInjured: spot.total_injured,
          fatalitiesPer100: spot.fatalities_per_100_crashes,

          // Backend risk classification
          riskLevel: spot.risk_level,
        }));

        setHotspotData(formattedHotspots);
      } catch (err) {
        console.error("Error fetching hotspots:", err);
        setError("Unable to load hotspot data");
      } finally {
        setLoading(false);
      }
    };

    fetchHotspots();
  }, []);

  const [selectedState, setSelectedState] =
    useState("All");

  const [statusFilter, setStatusFilter] =
    useState("all");

  const [search, setSearch] =
    useState("");

  const [selectedSpot, setSelectedSpot] =
    useState(null);

  const [focusSpot, setFocusSpot] =
    useState(null);

  /* =======================================================
     STATE DATA
  ======================================================= */

  const stateSpots = useMemo(() => {
    return hotspotData.filter(
  (item) =>
    selectedState === "All" ||
    item.state === selectedState
);
  }, [hotspotData, selectedState]);



const mapCenter = useMemo(() => {
  if (selectedState === "All") {
    return [22.5, 79.0];
  }

  if (stateCenters[selectedState]) {
    return stateCenters[selectedState];
  }

  if (stateSpots.length > 0) {
    const avgLat =
      stateSpots.reduce((sum, spot) => sum + Number(spot.lat), 0) /
      stateSpots.length;

    const avgLng =
      stateSpots.reduce((sum, spot) => sum + Number(spot.lng), 0) /
      stateSpots.length;

    return [avgLat, avgLng];
  }

  return [22.5, 79.0];
}, [selectedState, stateSpots]);


  /* =======================================================
     FILTERED DATA
  ======================================================= */

  const filteredSpots = useMemo(() => {
    const query = search.toLowerCase().trim();

    return stateSpots.filter((item) => {
      const status = getHotspotStatus(item);

      const matchesStatus =
        statusFilter === "all" ||
        status.key === statusFilter;

      const searchableText =
        `${item.location} ${item.city} ${item.cause} ${item.roadType}`.toLowerCase();

      const matchesSearch =
        query === "" ||
        searchableText.includes(query);

      return matchesStatus && matchesSearch;
    });
  }, [
    stateSpots,
    statusFilter,
    search,
  ]);

  /* =======================================================
     STATS
  ======================================================= */

  const stats = useMemo(() => {
    const critical = stateSpots.filter(
      (item) =>
        getHotspotStatus(item).key === "critical"
    ).length;

    const high = stateSpots.filter(
      (item) =>
        getHotspotStatus(item).key === "high"
    ).length;

    const watch = stateSpots.filter(
      (item) =>
        getHotspotStatus(item).key === "watch"
    ).length;

    const averageRisk =
      stateSpots.length > 0
        ? Math.round(
            stateSpots.reduce(
              (sum, item) =>
                sum + item.risk,
              0
            ) / stateSpots.length
          )
        : 0;

    return {
      total: stateSpots.length,
      critical,
      high,
      watch,
      averageRisk,
    };
  }, [stateSpots]);

  /* =======================================================
     VIEW IN MAP
  ======================================================= */

  const handleViewInMap = (event, spot) => {
    event.stopPropagation();

    setSelectedSpot(spot);
    setFocusSpot(spot);

    window.setTimeout(() => {
      const mapElement =
        document.querySelector(
          ".blackspots-map-wrapper"
        );

      if (mapElement) {
        mapElement.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }, 80);
  };

  /* =======================================================
     MARKER CLICK
  ======================================================= */

  const handleMarkerClick = (spot) => {
    setSelectedSpot(spot);
    setFocusSpot(spot);

    window.setTimeout(() => {
      const details =
        document.querySelector(
          ".selected-hotspot-panel"
        );

      if (details) {
        details.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 100);
  };

  /* =======================================================
     STATE CHANGE
  ======================================================= */

  const handleStateChange = (e) => {
    const nextState = e.target.value;

    setSelectedState(nextState);
    setStatusFilter("all");
    setSearch("");
    setSelectedSpot(null);
    setFocusSpot(null);
  };

  return (
    <div className="black-spots-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="blackspots-header">

        <div>
          <div className="page-eyebrow">
            ROAD SAFETY INTELLIGENCE
          </div>

          <h1>
            Black Spots & Hotspot Intelligence
          </h1>

          <p>
            Identify high-risk road segments,
            emerging hotspots and areas requiring
            targeted safety intervention.
          </p>
        </div>

        <div className="state-selector-box">

          <span>
            State / Region
          </span>

          <select
            value={selectedState}
            onChange={handleStateChange}
          >
            {connectedStates.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>

        </div>

      </div>

      {/* =================================================
          MAP GUIDE
      ================================================= */}

      <div className="map-reading-strip">

        <div>
          <strong>
            How to read the map
          </strong>

          <span>
            Select a hotspot and use "View in Map"
            to inspect its problems and recommended actions.
          </span>
        </div>

        <div className="map-status-guide">

          <span>
            <i className="guide-dot critical"></i>
            Critical
          </span>

          <span>
            <i className="guide-dot high"></i>
            High Risk
          </span>

          <span>
            <i className="guide-dot watch"></i>
            Watch
          </span>

          <span>
            <i className="guide-dot monitored"></i>
            Monitored
          </span>

        </div>

      </div>

      {/* =================================================
          SUMMARY
      ================================================= */}

      <div className="blackspots-summary">

        <div className="summary-card">
          <span>Total Hotspots</span>

          <strong>
            {stats.total}
          </strong>

          <small>
            {selectedState}
          </small>
        </div>

        <div className="summary-card danger">
          <span>Critical</span>

          <strong>
            {stats.critical}
          </strong>

          <small>
            Priority intervention
          </small>
        </div>

        <div className="summary-card orange">
          <span>High Risk</span>

          <strong>
            {stats.high}
          </strong>

          <small>
            Focused corrective action
          </small>
        </div>

        <div className="summary-card yellow">
          <span>Watch Areas</span>

          <strong>
            {stats.watch}
          </strong>

          <small>
            Continue observation
          </small>
        </div>

        <div className="summary-card green">
          <span>Avg. Risk</span>

          <strong>
            {stats.averageRisk}/100
          </strong>

          <small>
            Current state profile
          </small>
        </div>

      </div>

      {/* =================================================
          LOADING / ERROR
      ================================================= */}

      {loading && (
        <div className="no-hotspots">
          <strong>
            Loading hotspot data...
          </strong>

          <span>
            Fetching accident hotspot information from the server.
          </span>
        </div>
      )}

      {error && !loading && (
        <div className="no-hotspots">
          <strong>
            Unable to load hotspot data
          </strong>

          <span>
            Please make sure the FastAPI backend is running.
          </span>
        </div>
      )}

      {/* =================================================
          MAIN GRID
      ================================================= */}

      <div className="blackspots-main-grid">

        {/* =================================================
            MAP
        ================================================= */}

        <div className="blackspots-map-card">

          <div className="card-heading">

            <div>
              <span className="card-kicker">
                GEOGRAPHICAL INTELLIGENCE
              </span>

                <h2>
  {selectedState === "All"
    ? "India Accident Hotspots"
    : `${selectedState} Accident Hotspots`}
</h2>
            </div>

            <div className="map-count">
              {filteredSpots.length} areas
            </div>

          </div>

          <div className="blackspots-map-wrapper">

            <MapContainer
              center={mapCenter}
              zoom={7}
              scrollWheelZoom={true}
              className="blackspots-map"
            >

              <MapController
                center={mapCenter}
                focusSpot={focusSpot}
                  zoom={selectedState === "All" ? 5 : 7}
              />

              <TileLayer
                attribution="&copy; OpenStreetMap contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {filteredSpots.map((spot) => {

                const status =
                  getHotspotStatus(spot);

                return (
                  <CircleMarker
                    key={spot.id}
                    center={[
                      spot.lat,
                      spot.lng,
                    ]}
                    radius={Math.max(
                      8,
                      Math.min(
                        18,
                        spot.risk / 5
                      )
                    )}
                    pathOptions={{
                      color: status.color,
                      fillColor: status.color,
                      fillOpacity: 0.72,
                      weight: 3,
                    }}
                    eventHandlers={{
                      click: () =>
                        handleMarkerClick(spot),
                    }}
                  >

                    <Popup>

                      <div className="map-popup">

                        <strong>
                          {spot.location}
                        </strong>

                        <span>
                          {spot.city},{" "}
                          {spot.state}
                        </span>

                        <hr />

                        <div>
                          <b>Risk:</b>{" "}
                          {spot.risk}/100
                        </div>

                        <div>
                          <b>Status:</b>{" "}
                          {status.label}
                        </div>

                        <div>
                          <b>Hotspot Type:</b>{" "}
                          {spot.cause}
                        </div>

                        <button
                          className="popup-details-btn"
                          onClick={() =>
                            handleMarkerClick(spot)
                          }
                        >
                          View Problems & Actions
                        </button>

                      </div>

                    </Popup>

                  </CircleMarker>
                );
              })}

            </MapContainer>

            {/* MAP LEGEND */}

            <div className="blackspots-map-legend">

              <strong>
                Risk Status
              </strong>

              <span>
                <i className="legend-dot critical"></i>
                Critical
              </span>

              <span>
                <i className="legend-dot high"></i>
                High Risk
              </span>

              <span>
                <i className="legend-dot watch"></i>
                Watch
              </span>

              <span>
                <i className="legend-dot monitored"></i>
                Monitored
              </span>

            </div>

          </div>

        </div>

        {/* =================================================
            INTELLIGENCE PANEL
        ================================================= */}

        <div className="blackspots-intelligence-card">

          <div className="card-heading">

            <div>
              <span className="card-kicker">
                INTELLIGENCE PANEL
              </span>

              <h2>
                Risk Areas
              </h2>
            </div>

          </div>

          {/* SEARCH */}

          <div className="hotspot-search">

            <input
              type="text"
              placeholder="Search location, city or hotspot type..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>

          {/* FILTER */}

          <div className="status-filter-row">

            <button
              className={
                statusFilter === "all"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setStatusFilter("all")
              }
            >
              All
            </button>

            <button
              className={
                statusFilter === "critical"
                  ? "active critical-btn"
                  : ""
              }
              onClick={() =>
                setStatusFilter("critical")
              }
            >
              Critical
            </button>

            <button
              className={
                statusFilter === "high"
                  ? "active high-btn"
                  : ""
              }
              onClick={() =>
                setStatusFilter("high")
              }
            >
              High
            </button>

            <button
              className={
                statusFilter === "watch"
                  ? "active watch-btn"
                  : ""
              }
              onClick={() =>
                setStatusFilter("watch")
              }
            >
              Watch
            </button>

            <button
              className={
                statusFilter === "monitored"
                  ? "active monitored-btn"
                  : ""
              }
              onClick={() =>
                setStatusFilter("monitored")
              }
            >
              Monitored
            </button>

          </div>

          {/* LOCATION LIST */}

          <div className="hotspot-list">

            {filteredSpots.length === 0 ? (

              <div className="no-hotspots">

                <strong>
                  No hotspot found
                </strong>

                <span>
                  Try another search or status filter.
                </span>

              </div>

            ) : (

              filteredSpots.map((spot) => {

                const status =
                  getHotspotStatus(spot);

                return (
                  <div
                    key={spot.id}
                    className={`hotspot-list-item ${
                      selectedSpot?.id === spot.id
                        ? "selected"
                        : ""
                    }`}
                  >

                    <div className="hotspot-item-top">

                      <div>

                        <strong>
                          {spot.location}
                        </strong>

                        <span>
                          {spot.city},{" "}
                          {spot.state}
                        </span>

                      </div>

                      <span
                        className="hotspot-status"
                        style={{
                          color: status.color,
                        }}
                      >
                        {status.label}
                      </span>

                    </div>

                    <div className="hotspot-item-data">

                      <span>
                        Risk
                        <b>
                          {spot.risk}
                        </b>
                      </span>

                      <span>
                        Crashes
                        <b>
                          {spot.crashCount}
                        </b>
                      </span>

                    </div>

                    <div className="hotspot-item-bottom">

                      <span>
                        {spot.cause}
                      </span>

                      <span>
                        {spot.roadType}
                      </span>

                    </div>

                    {/* VIEW IN MAP */}

                    <button
                      type="button"
                      className="view-map-button"
                      onClick={(event) =>
                        handleViewInMap(
                          event,
                          spot
                        )
                      }
                    >
                      <span>
                        ⌖
                      </span>

                      View in Map
                    </button>

                  </div>
                );
              })
            )}

          </div>

        </div>

      </div>

      {/* =================================================
          DETAILS
          ONLY AFTER VIEW IN MAP / MARKER CLICK
      ================================================= */}

      {selectedSpot && (

        <div className="selected-hotspot-panel">

          <div className="selected-hotspot-heading">

            <div>

              <span className="card-kicker">
                HOTSPOT DETAILS
              </span>

              <h2>
                {selectedSpot.location}
              </h2>

              <p>
                {selectedSpot.city},{" "}
                {selectedSpot.state}
                {" • "}
                {selectedSpot.roadType}
              </p>

            </div>

            <button
              type="button"
              onClick={() => {
                setSelectedSpot(null);
                setFocusSpot(null);
              }}
            >
              Close
            </button>

          </div>

          {/* TOP DETAILS */}

          <div className="selected-hotspot-grid">

            <div className="detail-box">

              <span>
                Status
              </span>

              <strong
                style={{
                  color:
                    getHotspotStatus(
                      selectedSpot
                    ).color,
                }}
              >
                {
                  getHotspotStatus(
                    selectedSpot
                  ).label
                }
              </strong>

              <small>
                {getStatusReason(
                  selectedSpot
                )}
              </small>

            </div>

            <div className="detail-box risk-detail">

              <span>
                Risk Score
              </span>

              <strong>
                {selectedSpot.risk}/100
              </strong>

              <small>
                DBSCAN historical hotspot score
              </small>

            </div>

            <div className="detail-box">

              <span>
                Accident Count
              </span>

              <strong>
                {selectedSpot.crashCount}
              </strong>

              <small>
                Total accidents within this DBSCAN cluster.
              </small>

            </div>

            <div className="detail-box">

              <span>
                Fatalities
              </span>

              <strong>
                {selectedSpot.totalKilled}
              </strong>

              <small>
                Total deaths within this DBSCAN cluster.
              </small>

            </div>

            <div className="detail-box">

              <span>
                Injuries
              </span>

              <strong>
                {selectedSpot.totalInjured}
              </strong>

              <small>
                Total injuries within this DBSCAN cluster.
              </small>

            </div>

            <div className="detail-box">

              <span>
                Fatalities / 100 Crashes
              </span>

              <strong>
                {Number(
                  selectedSpot.fatalitiesPer100
                ).toFixed(2)}
              </strong>

              <small>
                Fatalities relative to cluster accident count.
              </small>

            </div>

            <div className="detail-box">

              <span>
                Hotspot Type
              </span>

              <strong>
                {selectedSpot.cause}
              </strong>

              <small>
                Based on historical accident clustering.
              </small>

            </div>

          </div>

          {/* =================================================
              WHAT'S WRONG
          ================================================= */}

          <div className="problem-section">

            <div className="section-title">

              <span className="card-kicker">
                RISK DIAGNOSIS
              </span>

              <h3>
                What's wrong at this location?
              </h3>

            </div>

            <div className="problem-list">

              {getProblems(selectedSpot).map(
                (problem, index) => (

                  <div
                    className="problem-item"
                    key={index}
                  >

                    <span>
                      !
                    </span>

                    <p>
                      {problem}
                    </p>

                  </div>

                )
              )}

            </div>

          </div>

          {/* =================================================
              RECOMMENDED ACTION
          ================================================= */}

          <div className="action-plan-box">

            <div className="section-title">

              <span className="card-kicker">
                RECOMMENDED ACTION
              </span>

              <h3>
                What should authorities do?
              </h3>

            </div>

            <div className="action-plan-list">

              {getActionPlan(selectedSpot).map(
                (action, index) => (

                  <div
                    className="action-plan-item"
                    key={index}
                  >

                    <span>
                      {index + 1}
                    </span>

                    <p>
                      {action}
                    </p>

                  </div>

                )
              )}

            </div>

          </div>

        </div>
      )}

      {/* =================================================
          STATUS EXPLANATION
      ================================================= */}

      <div className="status-explanation-panel">

        <div>

          <span className="status-big-dot critical"></span>

          <div>

            <strong>
              Critical
            </strong>

            <small>
              Very high risk + concentrated
              accident activity
            </small>

          </div>

        </div>

        <div>

          <span className="status-big-dot high"></span>

          <div>

            <strong>
              High Risk
            </strong>

            <small>
              Elevated risk requiring focused
              intervention
            </small>

          </div>

        </div>

        <div>

          <span className="status-big-dot watch"></span>

          <div>

            <strong>
              Watch
            </strong>

            <small>
              Moderate/stable activity requiring
              observation
            </small>

          </div>

        </div>

        <div>

          <span className="status-big-dot monitored"></span>

          <div>

            <strong>
              Monitored
            </strong>

            <small>
              Lower or declining activity
            </small>

          </div>

        </div>

      </div>

    </div>
  );
}