import React, { useEffect, useState, useContext } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { AuthContext } from "./AuthContext"; // Import AuthContext
import Clients from "./Clients";
import Coaches from "./Coaches";
import Sessions from "./Sessions";
import Home from "./Home";
import CoachDashboard from "./CoachDashboard";
import Login from "./Login";
import Navbar from "./Navbar";
import PrivateRoute from "./PrivateRoute";

function App() {
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  const [clients, setClients] = useState([]);
  const [coaches, setCoaches] = useState([]);
  const [sessions, setSessions] = useState([]);
  const { isAuthenticated } = useContext(AuthContext); // Access isAuthenticated

  useEffect(() => {
    if (isAuthenticated) { // Fetch data only if authenticated
      fetch(`${BACKEND_URL}/clients`)
        .then(response => response.json())
        .then(data => setClients(data))
        .catch(error => console.error("Error fetching clients:", error));

      fetch(`${BACKEND_URL}/coaches`)
        .then(response => response.json())
        .then(data => setCoaches(data))
        .catch(error => console.error("Error fetching coaches:", error));

      fetch(`${BACKEND_URL}/sessions`)
        .then(response => response.json())
        .then(data => setSessions(data))
        .catch(error => console.error("Error fetching sessions:", error));
    } else {
      // Clear the data when logged out to avoid data leakage
      setClients([]);
      setCoaches([]);
      setSessions([]);
    }
  }, [isAuthenticated, BACKEND_URL]); // Dependency array includes isAuthenticated

  return (
    <Router>
      <Navbar />
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
            <CoachDashboard
              clients={clients}
              sessions={sessions}
              coaches={coaches}
            />
          )}
        />
      </Switch>
    </Router>
  );
}

export default App;