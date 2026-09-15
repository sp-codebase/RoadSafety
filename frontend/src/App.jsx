import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import BlackSpots from "./pages/BlackSpots";
import Prediction from "./pages/Prediction";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <div className="app">

        {/* Sidebar */}
        <aside className="sidebar">

          <div className="logo">
            <div className="logo-icon">🛡️</div>

            <div>
              <h2>RoadSafe AI</h2>
              <p>Road Safety Intelligence</p>
            </div>
          </div>

          <nav className="navigation">

            <NavLink
  to="/"
  className={({ isActive }) =>
    isActive ? "nav-link active" : "nav-link"
  }
>
  <span>🏠</span>
  Dashboard
</NavLink>

<NavLink
  to="/black-spots"
  className={({ isActive }) =>
    isActive ? "nav-link active" : "nav-link"
  }
>
  <span>🗺️</span>
  Black Spots
</NavLink>

<NavLink
  to="/prediction"
  className={({ isActive }) =>
    isActive ? "nav-link active" : "nav-link"
  }
>
  <span>🤖</span>
  AI Prediction
</NavLink> 
          </nav>

          <div className="sidebar-footer">
            <p>AI-Powered Road Safety</p>
            <span>Team Ingenium</span>
          </div>

        </aside>

        {/* Main content */}
        <main className="main-content">

          <Routes>

            <Route
              path="/"
              element={<Dashboard />}
            />

            <Route
              path="/black-spots"
              element={<BlackSpots />}
            />

            <Route
              path="/prediction"
              element={<Prediction />}
            />

          </Routes>

        </main>

      </div>
    </BrowserRouter>
  );
}

export default App;
