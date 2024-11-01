// AuthContext.js
import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [coachId, setCoachId] = useState(null);
    const [coachName, setCoachName] = useState('');

    useEffect(() => {
        // Load initial state from localStorage if available
        const token = localStorage.getItem('authToken');
        const storedCoachId = localStorage.getItem('coachId');
        const storedCoachName = localStorage.getItem('coachName');

        // Check if the token exists to set authenticated state
        if (token) {
            setIsAuthenticated(true);
            setCoachId(storedCoachId);
            setCoachName(storedCoachName);
        } else {
            // Ensures state resets if no token is found
            setIsAuthenticated(false);
            setCoachId(null);
            setCoachName('');
        }
    }, []); // Only run once on mount

    const login = (id, name) => {
        localStorage.setItem('authToken', 'true');
        localStorage.setItem('coachId', id);
        localStorage.setItem('coachName', name);
        setIsAuthenticated(true);
        setCoachId(id);
        setCoachName(name);
    };

    const logout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('coachId');
        localStorage.removeItem('coachName');
        setIsAuthenticated(false);
        setCoachId(null);
        setCoachName('');
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, coachId, coachName, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
