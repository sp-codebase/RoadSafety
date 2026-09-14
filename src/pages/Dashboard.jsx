import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function Dashboard() {
  // Demo data for now.
  // Later this will come from the FastAPI backend.
  const accidentData = [
    { year: "2019", accidents: 180 },
    { year: "2020", accidents: 140 },
    { year: "2021", accidents: 210 },
    { year: "2022", accidents: 260 },
    { year: "2023", accidents: 235 },
    { year: "2024", accidents: 310 },
  ];

  return (
    <div className="dashboard">

      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1>Road Safety Overview</h1>
          <p>
            AI-powered insights from historical accident data
          </p>
        </div>
      </div>


      {/* Statistics Cards */}
      <div className="stats-grid">

        <div className="stat-card">
          <div className="stat-icon">🚗</div>

          <div>
            <p>Total Accidents</p>
            <h2>1,284</h2>
          </div>
        </div>


        <div className="stat-card">
          <div className="stat-icon">⚠️</div>

          <div>
            <p>Fatalities</p>
            <h2>246</h2>
          </div>
        </div>


        <div className="stat-card">
          <div className="stat-icon">📍</div>

          <div>
            <p>Black Spots</p>
            <h2>37</h2>
          </div>
        </div>


        <div className="stat-card">
          <div className="stat-icon">🤖</div>

          <div>
            <p>High Risk Zones</p>
            <h2>18</h2>
          </div>
        </div>

      </div>


      {/* Dashboard Lower Section */}
      <div className="dashboard-grid">


        {/* Accident Chart */}
        <div className="chart-card">

          <h2>Accident Trends</h2>

          <p>
            Historical accident distribution
          </p>

          <div className="real-chart">

            <ResponsiveContainer
              width="100%"
              height={280}
            >

              <LineChart data={accidentData}>

                <CartesianGrid
                  strokeDasharray="3 3"
                />

                <XAxis
                  dataKey="year"
                />

                <YAxis />

                <Tooltip />

                <Line
                  type="monotone"
                  dataKey="accidents"
                  stroke="#2f6fed"
                  strokeWidth={3}
                  dot={{ r: 5 }}
                />

              </LineChart>

            </ResponsiveContainer>

          </div>

        </div>


        {/* High Risk Locations */}
        <div className="risk-card">

          <h2>High-Risk Locations</h2>

          <p>
            Locations requiring attention
          </p>


          <div className="location">

            <div>
              <strong>NH-48, Jaipur</strong>
              <span>42 accidents</span>
            </div>

            <b className="high">
              87
            </b>

          </div>


          <div className="location">

            <div>
              <strong>MI Road, Jaipur</strong>
              <span>31 accidents</span>
            </div>

            <b className="high">
              81
            </b>

          </div>


          <div className="location">

            <div>
              <strong>Ajmer Road</strong>
              <span>27 accidents</span>
            </div>

            <b className="medium">
              69
            </b>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;
