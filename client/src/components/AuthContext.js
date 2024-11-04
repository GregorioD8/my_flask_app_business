// AuthContext.js
import React, { createContext, useState, useEffect, useCallback } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [coachId, setCoachId] = useState(null);
    const [coachName, setCoachName] = useState('');

    useEffect(() => {
        // Check if there's an existing token and set auth state
        const token = localStorage.getItem('authToken');
        const storedCoachId = localStorage.getItem('coachId');
        const storedCoachName = localStorage.getItem('coachName');

        if (token) {
            setIsAuthenticated(true);
            setCoachId(storedCoachId);
            setCoachName(storedCoachName);
        }
    }, []); // Run once on mount to initialize auth state

    const login = useCallback((id, name) => {
        localStorage.setItem('authToken', 'true');
        localStorage.setItem('coachId', id);
        localStorage.setItem('coachName', name);
        setIsAuthenticated(true);
        setCoachId(id);
        setCoachName(name);
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('coachId');
        localStorage.removeItem('coachName');
        setIsAuthenticated(false);
        setCoachId(null);
        setCoachName('');
    }, []);
    
    // Define context values with login and logout functions
    return (
        <AuthContext.Provider value={{ isAuthenticated, coachId, coachName, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};