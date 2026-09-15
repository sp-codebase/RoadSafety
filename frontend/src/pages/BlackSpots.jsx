import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

function BlackSpots() {
  const locations = [
    {
      name: "NH-48, Jaipur",
      lat: 26.9124,
      lng: 75.7873,
      risk: 87,
      accidents: 42,
    },
    {
      name: "MI Road, Jaipur",
      lat: 26.9157,
      lng: 75.8081,
      risk: 81,
      accidents: 31,
    },
    {
      name: "Ajmer Road",
      lat: 26.9009,
      lng: 75.7527,
      risk: 69,
      accidents: 27,
    },
  ];

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
            zoom={12}
            className="map"
          >

            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {locations.map((location) => (
              <CircleMarker
                key={location.name}
                center={[location.lat, location.lng]}
                radius={12}
              >
                <Popup>
                  <strong>{location.name}</strong>
                  <br />
                  Risk Score: {location.risk}/100
                  <br />
                  Accidents: {location.accidents}
                </Popup>
              </CircleMarker>
            ))}

          </MapContainer>

        </div>

        <div className="spot-list">

          <h2>High-Risk Locations</h2>
          <p>Potential black spots requiring attention</p>

          {locations.map((location) => (
            <div className="spot-item" key={location.name}>

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
