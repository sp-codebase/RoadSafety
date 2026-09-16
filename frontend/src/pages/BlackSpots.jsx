import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
} from "react-leaflet";
import { getHotspots } from "../api/api";
import "leaflet/dist/leaflet.css";

function BlackSpots() {
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    const fetchHotspots = async () => {
      try {
        const data = await getHotspots();

        const formattedLocations = data.hotspots.map((hotspot) => ({
  name:
    hotspot.city && hotspot.city !== "Nil"
      ? `${hotspot.city}, ${hotspot.state}`
      : hotspot.state,
  city: hotspot.city,
  state: hotspot.state,
  lat: hotspot.latitude,
  lng: hotspot.longitude,
  risk: hotspot.hotspot_score,
  accidents: hotspot.crash_count,
  killed: hotspot.total_killed,
  injured: hotspot.total_injured,
  priority: hotspot.risk_level,
}));

        setLocations(formattedLocations);
      } catch (error) {
        console.error("Error fetching hotspots:", error);
      }
    };

    fetchHotspots();
  }, []);

  return (
    <div className="black-spots">
      <div className="page-header">
        <div>
          <h1>Black Spot Intelligence</h1>
          <p>
            Identify accident-prone locations using historical accident patterns
          </p>
        </div>
      </div>

      <div className="map-layout">
        <div className="map-card">
          <MapContainer
            center={[26.9124, 75.7873]}
            zoom={5}
            className="map"
          >
            <TileLayer
              attribution="&copy; OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {locations.map((location) => (
              <CircleMarker
                key={`${location.name}-${location.lat}-${location.lng}`}
                center={[location.lat, location.lng]}
                radius={12}
              >
                <Popup>
                  <strong>{location.name}</strong>
                  <br />
                  City:{" "}
  {location.city && location.city !== "Nil"
    ? location.city
    : "Not specified"}
                  Risk Score: {location.risk}/100
                  <br />
                  Accidents: {location.accidents}
                  <br />
                  Fatalities: {location.killed}
                  <br />
                  Injuries: {location.injured}
                </Popup>
              </CircleMarker>
            ))}
          </MapContainer>
        </div>

        <div className="spot-list">
          <h2>High-Risk Locations</h2>
          <p>Potential black spots requiring attention</p>

          {locations.map((location) => (
            <div
              className="spot-item"
              key={`${location.name}-${location.lat}-${location.lng}`}
            >
              <div>
                <strong>{location.name}</strong>
                <span>{location.accidents} accidents</span>
              </div>

              <div className="risk-score">
                {location.risk}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default BlackSpots;