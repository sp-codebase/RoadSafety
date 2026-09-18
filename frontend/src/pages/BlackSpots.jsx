import { useEffect, useState } from "react";
import { MapContainer,
   TileLayer, CircleMarker, Popup, useMap, } from "react-leaflet";
import { getHotspots } from "../api/api";
import "leaflet/dist/leaflet.css";



function RecenterMap({ userLocation }) {
  const map = useMap();

  if (userLocation) {
    map.setView(
      [userLocation.lat, userLocation.lng],
      13
    );
  }

  return null;
}

function BlackSpots() {
  const [locations, setLocations] = useState([]);
  const [userLocation, setUserLocation] = useState(null);

  const findMyLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        console.error("Location error:", error);
        alert("Unable to access your location.");
      },
    );
  };

  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371;

    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  const nearbyLocations = userLocation
    ? locations
        .map((location) => ({
          ...location,
          distance: calculateDistance(
            userLocation.lat,
            userLocation.lng,
            location.lat,
            location.lng,
          ),
        }))
        .filter((location) => location.distance <= 10)
        .sort((a, b) => a.distance - b.distance)
    : [];
    
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
          distance: userLocation
            ? calculateDistance(
                userLocation.lat,
                userLocation.lng,
                hotspot.latitude,
                hotspot.longitude,
              )
            : null,
        }));

        setLocations(formattedLocations);
      } catch (error) {
        console.error("Error fetching hotspots:", error);
      }
    };

    fetchHotspots();
  }, [userLocation]);

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
          <button
            type="button"
            onClick={findMyLocation}
            className="location-button"
          >
            📍 Find Black Spots Near Me
          </button>
          <MapContainer center={[26.9124, 75.7873]} zoom={5} className="map">

            <RecenterMap userLocation={userLocation} />
            <TileLayer
              attribution="&copy; OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {userLocation && (
              <CircleMarker
                center={[userLocation.lat, userLocation.lng]}
                radius={10}
                pathOptions={{ 
                  color: "red",
                  fillColor: "red",
                  fillOpacity: 0.8,
                }}
              >
                <Popup>
                  <strong>📍 Your Location</strong>
                </Popup>
              </CircleMarker>
            )}

            {locations.map((location) => (
              <CircleMarker
                key={`${location.name}-${location.lat}-${location.lng}`}
                center={[location.lat, location.lng]}
                radius={12}
                pathOptions={{ 
                  color: "blue",
                  fillColor: "blue",
                  fillOpacity: 0.3,
                }}
              >
                <Popup>
                  <strong>{location.name}</strong>
                  <br />
                  City:{" "}
                  {location.city && location.city !== "Nil"
                    ? location.city
                    : "Not specified"}
                  {location.distance !== null && (
                    <>
                      <br />
                      Distance: {location.distance.toFixed(2)} km
                    </>
                  )}
                  Risk Score: {location.risk}/100
                  <br />
                  Hotspot Level: {location.priority}
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
          {userLocation && (
            <div className="nearby-spots">
              <h2>Black Spots Near You</h2>
              <p>Locations within 10 km of your current position</p>

              {nearbyLocations.length === 0 ? (
                <p>No black spots found within 10 km.</p>
              ) : (
                nearbyLocations.map((location) => (
                  <div
                    className="spot-item"
                    key={`nearby-${location.name}-${location.lat}-${location.lng}`}
                  >
                    <div>
                      <strong>{location.name}</strong>
                      <span>📍 {location.distance.toFixed(2)} km away</span>
                    </div>

                    <div className="risk-score">{location.risk}
                      <small>Hotspot: {location.priority}</small>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

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

              <div className="risk-score">{location.risk}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default BlackSpots;
