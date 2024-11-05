import React, { useEffect, useState, useContext } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import Clients from "./Clients";
import Coaches from "./Coaches";
import Sessions from "./Sessions";
import Home from "./Home";
import CoachDashboard from "./CoachDashboard"; 
import Login from "./Login";
import Navbar from "./Navbar";
import PrivateRoute from "./PrivateRoute";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function App() {
  const [clients, setClients] = useState([]);
  const [coaches, setCoaches] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const { isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      if (isAuthenticated) {
        try {
          const [clientsResponse, coachesResponse, sessionsResponse] = await Promise.all([
            fetch(`${BACKEND_URL}/clients`),
            fetch(`${BACKEND_URL}/coaches`),
            fetch(`${BACKEND_URL}/sessions`),
          ]);

          setClients(await clientsResponse.json());
          setCoaches(await coachesResponse.json());
          setSessions(await sessionsResponse.json());
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      } else {
        // Clear data if user is not authenticated
        setClients([]);
        setCoaches([]);
        setSessions([]);
      }
      setLoading(false); // Stop loading when data is fetched or user is not authenticated
    };

    fetchData();
  }, [isAuthenticated]); // Run only when authentication state changes

  return (
    <Router>
      <Navbar />
      {/* Loading Overlay */}
      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <h2>Loading, please wait...</h2>
        </div>
      )}
      <div className={`main-content ${loading ? '' : 'loaded'}`}>
        <Switch>
          <Route path="/login">
            <Login />
          </Route>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/clients">
            <Clients clients={clients} />
          </Route>
          <Route path="/coaches">
            <Coaches coaches={coaches} />
          </Route>
          <Route path="/sessions">
            <Sessions sessions={sessions} clients={clients} coaches={coaches} />
          </Route>
          <PrivateRoute
            path="/coach-dashboard"
            component={() => (
              <CoachDashboard clients={clients} sessions={sessions} coaches={coaches} />
            )}
          />
        </Switch>
      </div>
    </Router>
  );
}

export default App;