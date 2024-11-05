import React, { useState, useEffect } from 'react';
import CoachCard from './CoachCard';

function CoachesSection() {
  const [coaches, setCoaches] = useState([]);
  const [error, setError] = useState(null);
  const FRONTEND_URL = process.env.REACT_APP_FRONTEND_URL;
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    fetch(`${BACKEND_URL}/coaches`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch coaches');
        }
        return response.json();
      })
      .then((data) => setCoaches(data))
      .catch((error) => setError(error.message));
  }, [BACKEND_URL]);

  if (error) {
    return <div>Error loading coaches: {error}</div>;
  }

  return (
    <section className="coaches-section">
      <div className="container">
        <h2>Meet Our Coaches</h2>
        <div className="row">
          {coaches.map((coach) => (
            <CoachCard key={coach.id} coach={coach} FRONTEND_URL={FRONTEND_URL} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default CoachesSection;