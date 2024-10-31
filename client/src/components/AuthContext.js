// AuthContext.js
import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [coachId, setCoachId] = useState(null);
    const [coachName, setCoachName] = useState('');

    useEffect(() => {
        // Initialize state from localStorage if available
        const token = localStorage.getItem('authToken');
        const storedCoachId = localStorage.getItem('coachId');
        const storedCoachName = localStorage.getItem('coachName');

        if (token) {
            setIsAuthenticated(true);
            setCoachId(storedCoachId);
            setCoachName(storedCoachName);
        }
    }, []); 

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