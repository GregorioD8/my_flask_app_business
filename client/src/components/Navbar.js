// Navbar.js
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from './AuthContext';

const Navbar = () => {
    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
    const { isAuthenticated, coachName, logout } = useContext(AuthContext);

    const handleLogout = () => {
        fetch(`${BACKEND_URL}/logout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        })
        .then((res) => {
            if (res.ok) {
                logout();
                window.location.href = '/login';
            } else {
                alert("Failed to log out. Please try again.");
            }
        })
        .catch((error) => {
            console.error("Error during logout:", error);
            alert("An error occurred while logging out. Please try again.");
        });
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">Home</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        {isAuthenticated && (
                            <li className="nav-item">
                                <Link className="nav-link" to="/coach-dashboard">Dashboard</Link>
                            </li>
                        )}
                    </ul>
                    <ul className="navbar-nav">
                        {isAuthenticated ? (
                            <li className="nav-item">
                                <button 
                                    className="btn btn-outline-danger" 
                                    onClick={handleLogout}
                                >
                                    Logout {coachName}
                                </button>
                            </li>
                        ) : (
                            <li className="nav-item">
                                <Link className="nav-link" to="/login">Login</Link>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;