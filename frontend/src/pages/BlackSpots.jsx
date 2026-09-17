import React, { useMemo, useState } from "react";
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
  Rajasthan: [26.9, 75.8],
  Punjab: [30.9, 75.8],
  Haryana: [29.0, 76.1],
  "Uttar Pradesh": [26.8, 80.9],
  "Madhya Pradesh": [23.5, 77.4],
  Gujarat: [22.3, 71.9],
};

const connectedStates = [
  "Rajasthan",
  "Punjab",
  "Haryana",
  "Uttar Pradesh",
  "Madhya Pradesh",
  "Gujarat",
];

/* =========================================================
   PROTOTYPE HOTSPOT DATA
========================================================= */

const hotspotData = [
  /* =========================
     RAJASTHAN
  ========================= */

  {
    id: 1,
    state: "Rajasthan",
    city: "Jaipur",
    location: "NH-48 Jaipur",
    lat: 26.9124,
    lng: 75.7873,
    roadType: "National Highway",
    cause: "Overspeeding",
    risk: 91,
    recent: 42,
    previous: 37,
  },
  {
    id: 2,
    state: "Rajasthan",
    city: "Jaipur",
    location: "MI Road",
    lat: 26.9157,
    lng: 75.8013,
    roadType: "Urban Road",
    cause: "Heavy Traffic",
    risk: 84,
    recent: 31,
    previous: 27,
  },
  {
    id: 3,
    state: "Rajasthan",
    city: "Jaipur",
    location: "Ajmer Road",
    lat: 26.8908,
    lng: 75.7441,
    roadType: "State Highway",
    cause: "Poor Road Conditions",
    risk: 61,
    recent: 24,
    previous: 17,
  },
  {
    id: 4,
    state: "Rajasthan",
    city: "Jaipur",
    location: "Tonk Road",
    lat: 26.8467,
    lng: 75.8056,
    roadType: "Urban Road",
    cause: "Traffic Congestion",
    risk: 43,
    recent: 11,
    previous: 18,
  },
  {
    id: 5,
    state: "Rajasthan",
    city: "Jaipur",
    location: "Agra Road Junction",
    lat: 26.9451,
    lng: 75.8613,
    roadType: "Junction",
    cause: "Intersection Conflict",
    risk: 55,
    recent: 16,
    previous: 15,
  },
  {
    id: 6,
    state: "Rajasthan",
    city: "Kota",
    location: "Kota Road Corridor",
    lat: 25.2138,
    lng: 75.8648,
    roadType: "Highway",
    cause: "Overspeeding",
    risk: 76,
    recent: 26,
    previous: 20,
  },
  {
    id: 7,
    state: "Rajasthan",
    city: "Jodhpur",
    location: "Jodhpur Road Segment",
    lat: 26.2389,
    lng: 73.0243,
    roadType: "State Highway",
    cause: "Poor Visibility",
    risk: 39,
    recent: 8,
    previous: 14,
  },
  {
    id: 8,
    state: "Rajasthan",
    city: "Jaipur",
    location: "Jaipur Ring Road East",
    lat: 26.8617,
    lng: 75.9137,
    roadType: "Ring Road",
    cause: "Lane Discipline",
    risk: 54,
    recent: 18,
    previous: 12,
  },
  {
    id: 9,
    state: "Rajasthan",
    city: "Alwar",
    location: "Alwar Highway Segment",
    lat: 27.553,
    lng: 76.6346,
    roadType: "Highway",
    cause: "Heavy Traffic",
    risk: 51,
    recent: 16,
    previous: 10,
  },

  /* =========================
     HARYANA
  ========================= */

  {
    id: 10,
    state: "Haryana",
    city: "Gurugram",
    location: "NH-48 Gurugram",
    lat: 28.4595,
    lng: 77.0266,
    roadType: "National Highway",
    cause: "Heavy Traffic",
    risk: 88,
    recent: 39,
    previous: 34,
  },
  {
    id: 11,
    state: "Haryana",
    city: "Faridabad",
    location: "Mathura Road",
    lat: 28.4089,
    lng: 77.3178,
    roadType: "Urban Highway",
    cause: "Lane Discipline",
    risk: 72,
    recent: 28,
    previous: 23,
  },
  {
    id: 12,
    state: "Haryana",
    city: "Panipat",
    location: "Panipat Highway",
    lat: 29.3909,
    lng: 76.9635,
    roadType: "National Highway",
    cause: "Overspeeding",
    risk: 79,
    recent: 25,
    previous: 21,
  },
  {
    id: 13,
    state: "Haryana",
    city: "Hisar",
    location: "Hisar Bypass",
    lat: 29.1492,
    lng: 75.7217,
    roadType: "Bypass",
    cause: "Poor Road Conditions",
    risk: 48,
    recent: 14,
    previous: 12,
  },
  {
    id: 25,
    state: "Haryana",
    city: "Rohtak",
    location: "Rohtak Bypass",
    lat: 28.8955,
    lng: 76.6066,
    roadType: "Bypass",
    cause: "Heavy Traffic",
    risk: 63,
    recent: 21,
    previous: 17,
  },
  {
    id: 26,
    state: "Haryana",
    city: "Karnal",
    location: "Karnal NH Corridor",
    lat: 29.6857,
    lng: 76.9905,
    roadType: "National Highway",
    cause: "Overspeeding",
    risk: 73,
    recent: 24,
    previous: 19,
  },
  {
    id: 27,
    state: "Haryana",
    city: "Ambala",
    location: "Ambala Highway Junction",
    lat: 30.3782,
    lng: 76.7767,
    roadType: "Highway Junction",
    cause: "Intersection Conflict",
    risk: 52,
    recent: 14,
    previous: 13,
  },

  /* =========================
     PUNJAB
  ========================= */

  {
    id: 14,
    state: "Punjab",
    city: "Ludhiana",
    location: "Ludhiana Bypass",
    lat: 30.901,
    lng: 75.8573,
    roadType: "Bypass",
    cause: "Heavy Traffic",
    risk: 81,
    recent: 32,
    previous: 27,
  },
  {
    id: 15,
    state: "Punjab",
    city: "Amritsar",
    location: "Amritsar Highway",
    lat: 31.634,
    lng: 74.8723,
    roadType: "National Highway",
    cause: "Overspeeding",
    risk: 74,
    recent: 27,
    previous: 22,
  },
  {
    id: 16,
    state: "Punjab",
    city: "Jalandhar",
    location: "Jalandhar Junction",
    lat: 31.326,
    lng: 75.5762,
    roadType: "Junction",
    cause: "Intersection Conflict",
    risk: 56,
    recent: 15,
    previous: 12,
  },
  {
    id: 17,
    state: "Punjab",
    city: "Bathinda",
    location: "Bathinda Road",
    lat: 30.211,
    lng: 74.9455,
    roadType: "State Highway",
    cause: "Poor Visibility",
    risk: 44,
    recent: 10,
    previous: 15,
  },
  {
    id: 28,
    state: "Punjab",
    city: "Patiala",
    location: "Patiala Bypass",
    lat: 30.3398,
    lng: 76.3869,
    roadType: "Bypass",
    cause: "Lane Discipline",
    risk: 62,
    recent: 19,
    previous: 14,
  },
  {
    id: 29,
    state: "Punjab",
    city: "Mohali",
    location: "Mohali Junction",
    lat: 30.7046,
    lng: 76.7179,
    roadType: "Urban Junction",
    cause: "Heavy Traffic",
    risk: 69,
    recent: 25,
    previous: 20,
  },
  {
    id: 30,
    state: "Punjab",
    city: "Hoshiarpur",
    location: "Hoshiarpur Highway",
    lat: 31.5143,
    lng: 75.9115,
    roadType: "State Highway",
    cause: "Poor Road Conditions",
    risk: 47,
    recent: 13,
    previous: 11,
  },

  /* =========================
     UTTAR PRADESH
  ========================= */

  {
    id: 18,
    state: "Uttar Pradesh",
    city: "Agra",
    location: "Agra-Lucknow Expressway",
    lat: 27.1767,
    lng: 78.0081,
    roadType: "Expressway",
    cause: "Overspeeding",
    risk: 86,
    recent: 35,
    previous: 28,
  },
  {
    id: 19,
    state: "Uttar Pradesh",
    city: "Mathura",
    location: "Mathura Highway",
    lat: 27.4924,
    lng: 77.6737,
    roadType: "National Highway",
    cause: "Heavy Traffic",
    risk: 68,
    recent: 23,
    previous: 20,
  },
  {
    id: 20,
    state: "Uttar Pradesh",
    city: "Meerut",
    location: "Meerut Bypass",
    lat: 28.9845,
    lng: 77.7064,
    roadType: "Bypass",
    cause: "Lane Discipline",
    risk: 53,
    recent: 16,
    previous: 11,
  },
  {
    id: 31,
    state: "Uttar Pradesh",
    city: "Lucknow",
    location: "Lucknow Ring Road",
    lat: 26.8467,
    lng: 80.9462,
    roadType: "Ring Road",
    cause: "Heavy Traffic",
    risk: 78,
    recent: 30,
    previous: 24,
  },
  {
    id: 32,
    state: "Uttar Pradesh",
    city: "Kanpur",
    location: "Kanpur Highway Corridor",
    lat: 26.4499,
    lng: 80.3319,
    roadType: "National Highway",
    cause: "Overspeeding",
    risk: 74,
    recent: 27,
    previous: 22,
  },
  {
    id: 33,
    state: "Uttar Pradesh",
    city: "Meerut",
    location: "Delhi-Meerut Corridor",
    lat: 28.9845,
    lng: 77.7064,
    roadType: "Expressway",
    cause: "Lane Discipline",
    risk: 59,
    recent: 18,
    previous: 13,
  },

  /* =========================
     MADHYA PRADESH
  ========================= */

  {
    id: 21,
    state: "Madhya Pradesh",
    city: "Indore",
    location: "Indore Bypass",
    lat: 22.7196,
    lng: 75.8577,
    roadType: "Bypass",
    cause: "Heavy Traffic",
    risk: 77,
    recent: 29,
    previous: 24,
  },
  {
    id: 22,
    state: "Madhya Pradesh",
    city: "Bhopal",
    location: "Bhopal Highway",
    lat: 23.2599,
    lng: 77.4126,
    roadType: "National Highway",
    cause: "Poor Road Conditions",
    risk: 58,
    recent: 18,
    previous: 15,
  },
  {
    id: 34,
    state: "Madhya Pradesh",
    city: "Gwalior",
    location: "Gwalior Bypass",
    lat: 26.2183,
    lng: 78.1828,
    roadType: "Bypass",
    cause: "Overspeeding",
    risk: 66,
    recent: 22,
    previous: 17,
  },
  {
    id: 35,
    state: "Madhya Pradesh",
    city: "Ujjain",
    location: "Ujjain Highway Junction",
    lat: 23.1765,
    lng: 75.7885,
    roadType: "Highway Junction",
    cause: "Intersection Conflict",
    risk: 49,
    recent: 14,
    previous: 12,
  },
  {
    id: 36,
    state: "Madhya Pradesh",
    city: "Sagar",
    location: "Sagar Highway",
    lat: 23.8388,
    lng: 78.7378,
    roadType: "State Highway",
    cause: "Poor Visibility",
    risk: 46,
    recent: 15,
    previous: 10,
  },

  /* =========================
     GUJARAT
  ========================= */

  {
    id: 23,
    state: "Gujarat",
    city: "Ahmedabad",
    location: "Ahmedabad Ring Road",
    lat: 23.0225,
    lng: 72.5714,
    roadType: "Ring Road",
    cause: "Heavy Traffic",
    risk: 83,
    recent: 34,
    previous: 29,
  },
  {
    id: 24,
    state: "Gujarat",
    city: "Vadodara",
    location: "Vadodara Expressway",
    lat: 22.3072,
    lng: 73.1812,
    roadType: "Expressway",
    cause: "Overspeeding",
    risk: 71,
    recent: 22,
    previous: 18,
  },
  {
    id: 37,
    state: "Gujarat",
    city: "Surat",
    location: "Surat Outer Ring Road",
    lat: 21.1702,
    lng: 72.8311,
    roadType: "Ring Road",
    cause: "Heavy Traffic",
    risk: 76,
    recent: 28,
    previous: 23,
  },
  {
    id: 38,
    state: "Gujarat",
    city: "Rajkot",
    location: "Rajkot Highway Corridor",
    lat: 22.3039,
    lng: 70.8022,
    roadType: "National Highway",
    cause: "Overspeeding",
    risk: 67,
    recent: 20,
    previous: 15,
  },
  {
    id: 39,
    state: "Gujarat",
    city: "Palanpur",
    location: "Palanpur Highway",
    lat: 24.1717,
    lng: 72.4382,
    roadType: "Highway",
    cause: "Poor Road Conditions",
    risk: 42,
    recent: 9,
    previous: 13,
  },
];

/* =========================================================
   MAP CONTROLLER
========================================================= */

function MapController({ center, focusSpot }) {
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
      map.flyTo(center, 7, {
        duration: 1.1,
      });
    }
  }, [center, focusSpot, map]);

  return null;
}

/* =========================================================
   HELPERS
========================================================= */

function getActivityChange(item) {
  if (!item.previous) return 0;

  return Math.round(
    ((item.recent - item.previous) /
      item.previous) *
      100
  );
}

function getHotspotStatus(item) {
  const change = getActivityChange(item);

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

  if (change >= 20 && item.risk >= 45) {
    return {
      key: "emerging",
      label: "Emerging Hotspot",
      color: "#9ca3af",
    };
  }

  if (item.risk >= 45 && change > -20) {
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
  const change = getActivityChange(item);
  const status = getHotspotStatus(item);

  if (status.key === "critical") {
    return `Very high risk (${item.risk}/100) with concentrated accident activity.`;
  }

  if (status.key === "high") {
    return `Elevated risk (${item.risk}/100) requiring focused corrective action.`;
  }

  if (status.key === "emerging") {
    return `Recent accident activity increased by ${change}% compared with the previous period.`;
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
        "Recent accident activity requires investigation.",
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
        "Review recent accident activity.",
        "Continue targeted monitoring."
      );
  }

  const status = getHotspotStatus(item);

  if (status.key === "critical") {
    actions.unshift(
      "Priority intervention required."
    );
  }

  if (status.key === "high") {
    actions.unshift(
      "Focused corrective action recommended."
    );
  }

  if (status.key === "emerging") {
    actions.unshift(
      "Early intervention recommended before risk escalates."
    );
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
  const [selectedState, setSelectedState] =
    useState("Rajasthan");

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
      (item) => item.state === selectedState
    );
  }, [selectedState]);

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
        getHotspotStatus(item).key ===
        "critical"
    ).length;

    const high = stateSpots.filter(
      (item) =>
        getHotspotStatus(item).key ===
        "high"
    ).length;

    const emerging = stateSpots.filter(
      (item) =>
        getHotspotStatus(item).key ===
        "emerging"
    ).length;

    const watch = stateSpots.filter(
      (item) =>
        getHotspotStatus(item).key ===
        "watch"
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
      emerging,
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
            <i className="guide-dot emerging"></i>
            Emerging
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

        <div className="summary-card gray">
          <span>Emerging</span>

          <strong>
            {stats.emerging}
          </strong>

          <small>
            Activity increasing
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
                {selectedState} Accident Hotspots
              </h2>
            </div>

            <div className="map-count">
              {filteredSpots.length} areas
            </div>

          </div>

          <div className="blackspots-map-wrapper">

            <MapContainer
              center={stateCenters[selectedState]}
              zoom={7}
              scrollWheelZoom={true}
              className="blackspots-map"
            >

              <MapController
                center={stateCenters[selectedState]}
                focusSpot={focusSpot}
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
                          <b>Cause:</b>{" "}
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
                <i className="legend-dot emerging"></i>
                Emerging
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
              placeholder="Search location, city or cause..."
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
                statusFilter === "emerging"
                  ? "active emerging-btn"
                  : ""
              }
              onClick={() =>
                setStatusFilter("emerging")
              }
            >
              Emerging
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

                const change =
                  getActivityChange(spot);

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
                        Recent
                        <b>
                          {spot.recent}
                        </b>
                      </span>

                      <span
                        className={
                          change > 0
                            ? "trend-up"
                            : change < 0
                            ? "trend-down"
                            : ""
                        }
                      >
                        {change > 0
                          ? "↑"
                          : change < 0
                          ? "↓"
                          : "→"}{" "}
                        {Math.abs(change)}%
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
                Current prototype risk profile
              </small>

            </div>

            <div className="detail-box">

              <span>
                Accident Activity
              </span>

              <strong>
                {selectedSpot.recent}
              </strong>

              <small>
                Previous period:{" "}
                {selectedSpot.previous}
                {" • "}
                {getActivityChange(
                  selectedSpot
                ) > 0
                  ? "Increasing"
                  : getActivityChange(
                      selectedSpot
                    ) < 0
                  ? "Declining"
                  : "Stable"}
              </small>

            </div>

            <div className="detail-box">

              <span>
                Primary Cause
              </span>

              <strong>
                {selectedSpot.cause}
              </strong>

              <small>
                Main risk factor associated
                with this hotspot.
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
          <span className="status-big-dot emerging"></span>

          <div>
            <strong>
              Emerging
            </strong>

            <small>
              Recent accident activity increasing
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
