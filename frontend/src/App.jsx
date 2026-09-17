import {
  BrowserRouter,
  Routes,
  Route,
  NavLink,
} from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import BlackSpots from "./pages/BlackSpots";
import Prediction from "./pages/Prediction";
import AccidentAnalysis from "./pages/AccidentAnalysis";
import Reports from "./pages/Reports";

import "./App.css";

function App() {
  return (
    <BrowserRouter>

      <div className="app">

        {/* ================= SIDEBAR ================= */}

        <aside className="sidebar">

          <div className="logo">

            <div className="logo-icon">
              🛡️
            </div>

            <div>
              <h2>
                RoadSafe AI
              </h2>

              <p>
                Road Safety Intelligence
              </p>
            </div>

          </div>


          <nav className="navigation">

            {/* DASHBOARD */}

            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                isActive
                  ? "nav-link active"
                  : "nav-link"
              }
            >
              <span>🏠</span>
              Dashboard
            </NavLink>


            {/* BLACK SPOTS */}

            <NavLink
              to="/black-spots"
              className={({ isActive }) =>
                isActive
                  ? "nav-link active"
                  : "nav-link"
              }
            >
              <span>🗺️</span>
              Black Spots
            </NavLink>


            {/* ACCIDENT ANALYSIS */}

            <NavLink
              to="/accident-analysis"
              className={({ isActive }) =>
                isActive
                  ? "nav-link active"
                  : "nav-link"
              }
            >
              <span>📊</span>
              Accident Analysis
            </NavLink>


            {/* AI PREDICTION */}

            <NavLink
              to="/prediction"
              className={({ isActive }) =>
                isActive
                  ? "nav-link active"
                  : "nav-link"
              }
            >
              <span>🤖</span>
              AI Prediction
            </NavLink>


            {/* REPORTS */}

            <NavLink
              to="/reports"
              className={({ isActive }) =>
                isActive
                  ? "nav-link active"
                  : "nav-link"
              }
            >
              <span>📄</span>
              Reports
            </NavLink>

          </nav>


          <div className="sidebar-footer">

            <p>
              AI-Powered Road Safety
            </p>

            <span>
              Team Ingenium
            </span>

          </div>

        </aside>


        {/* ================= MAIN ================= */}

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
              path="/accident-analysis"
              element={<AccidentAnalysis />}
            />

            <Route
              path="/prediction"
              element={<Prediction />}
            />

            <Route
              path="/reports"
              element={<Reports />}
            />

          </Routes>

        </main>

      </div>

    </BrowserRouter>
  );
}

export default App;