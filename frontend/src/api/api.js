const API_BASE_URL = "http://127.0.0.1:8000";

export async function getHotspots() {
  const response = await fetch(`${API_BASE_URL}/api/hotspots`);

  if (!response.ok) {
    throw new Error("Failed to fetch hotspots");
  }

  return response.json();
}

export async function getLocations(state = "") {
  const url = state
    ? `${API_BASE_URL}/api/locations?state=${encodeURIComponent(state)}`
    : `${API_BASE_URL}/api/locations`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch locations");
  }

  return response.json();
}

export async function predictRisk(predictionData) {
  const response = await fetch(`${API_BASE_URL}/api/predict-risk`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(predictionData),
  });

  if (!response.ok) {
    throw new Error("Failed to predict risk");
  }

  return response.json();
}