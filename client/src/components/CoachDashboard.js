import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "./AuthContext";
import SessionForm from "./SessionForm";
import Calendar from "./Calendar";
import MockPaymentForm from "./MockPaymentForm";

const CoachDashboard = () => {
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
  const { coachId } = useContext(AuthContext); // Get the logged-in coach's ID
  const [sessions, setSessions] = useState([]);
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState("");
  const [refreshPage, setRefreshPage] = useState(false);
  const [paymentSession, setPaymentSession] = useState(null);
  const [loading, setLoading] = useState(true); // New loading state

  // Fetch clients and sessions based on the logged-in coach
  useEffect(() => {
    if (coachId) {
      setLoading(true); // Start loading
      const fetchClientsAndSessions = async () => {
        try {
          const clientsResponse = await fetch(`${BACKEND_URL}/coaches/${coachId}/clients_with_sessions`);
          const clientsData = await clientsResponse.json();
          setClients(clientsData);

          const url = selectedClient
            ? `${BACKEND_URL}/coaches/${coachId}/sessions?client_id=${selectedClient}`
            : `${BACKEND_URL}/coaches/${coachId}/sessions`;

          const sessionsResponse = await fetch(url);
          const sessionsData = await sessionsResponse.json();
          setSessions(sessionsData);
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setLoading(false); // Stop loading when data is fetched
        }
      };

      fetchClientsAndSessions();
    }
  }, [coachId, selectedClient, refreshPage, BACKEND_URL]);

  const handleClientChange = (e) => {
    setSelectedClient(e.target.value);
  };

  const handleUpdateNotes = (sessionId) => {
    const newNotes = prompt("Enter new notes:");
    if (!newNotes || newNotes.trim() === "") {
      alert("Notes cannot be empty.");
      return;
    }
    fetch(`${BACKEND_URL}/sessions/${sessionId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ notes: newNotes }),
    })
      .then((res) => res.json())
      .then(() => setRefreshPage(!refreshPage));
  };

  const handleDeleteSession = (sessionId) => {
    fetch(`${BACKEND_URL}/sessions/${sessionId}`, {
      method: "DELETE",
    }).then((res) => {
      if (res.status === 204) {
        setRefreshPage(!refreshPage);
      } else {
        console.error("Failed to delete session");
      }
    });
  };

  const handlePayment = (sessionId) => {
    const session = sessions.find((session) => session.id === sessionId);
    setPaymentSession(session);
  };

  const handlePaymentSubmit = (sessionId) => {
    fetch(`${BACKEND_URL}/sessions/${sessionId}/pay`, {
      method: "POST",
    })
      .then((res) => {
        if (res.status === 200) {
          setSessions((prevSessions) =>
            prevSessions.map((session) =>
              session.id === sessionId ? { ...session, paid: true } : session
            )
          );
          setPaymentSession(null); // Close payment form on success
        }
      })
      .catch((error) => console.error("Error processing payment:", error));
  };

  const handleCancelPayment = () => {
    setPaymentSession(null);
  };

  // Submit button style to match the update button
  const submitButtonStyle = {
    padding: "10px 15px",
    backgroundColor: "#468B90", // Match this to the Update button's color
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
  };

  if (loading) {
    return (
      <div className="loading-overlay">
        <div className="loading-spinner"></div>
        <h2>Loading Dashboard...</h2>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Coach Dashboard</h1>

      {/* Client Select Dropdown */}
      <div className="row">
        <div className="col-md-4 mb-3">
          <label htmlFor="clientSelect" className="form-label">Select Client</label>
          <select
            id="clientSelect"
            className="form-select"
            onChange={handleClientChange}
            value={selectedClient}
          >
            <option value="" label="All Clients" />
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Form and Calendar Layout */}
      <div className="row">
      <div id="add-session-card" className="col-md-3">
          <h2>Add Session</h2>
          <SessionForm
            onSubmitSuccess={() => setRefreshPage(!refreshPage)}
            selectedCoach={coachId}
            selectedClient={selectedClient}
            clients={clients}
            submitButtonStyle={submitButtonStyle}
          />
        </div>
        <div className="col-md-9">
          <h2>Session Calendar</h2>
          <Calendar sessions={sessions} />
        </div>
      </div>

      {/* Sessions Table */}
      <h2 className="mt-4">Scheduled Sessions</h2>
      <div className="sessions-scroll">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Client Name</th>
              <th>Time</th>
              <th>Notes</th>
              <th>Payment Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sessions.length === 0 ? (
              <tr>
                <td colSpan="5">No sessions scheduled.</td>
              </tr>
            ) : (
              sessions.map((session, i) => (
                <tr key={i}>
                  <td>{session.client_name}</td>
                  <td>{session.date.split(" ")[0]} {session.date.split(" ")[1]}</td>
                  <td>{session.notes}</td>
                  <td>{session.paid ? "Paid" : "Unpaid"}</td>
                  <td>
                    <button className="btn-update" onClick={() => handleUpdateNotes(session.id)}>
                      Update
                    </button>
                    <button className="btn-delete" onClick={() => handleDeleteSession(session.id)}>
                      Delete
                    </button>
                    {!session.paid && (
                      <button className="btn-pay" onClick={() => handlePayment(session.id)}>
                        Pay
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {paymentSession && (
        <MockPaymentForm
          session={paymentSession}
          onPaymentSubmit={handlePaymentSubmit}
          onCancel={handleCancelPayment}
        />
      )}

      <footer className="dashboard-footer">
        &copy; 2024 Etherheal LLC. All rights reserved.
      </footer>
    </div>
  );
};

export default CoachDashboard;