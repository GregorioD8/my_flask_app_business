import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem('authToken') !== null);
    const [coachId, setCoachId] = useState(localStorage.getItem('coachId') || null);
    const [coachName, setCoachName] = useState(localStorage.getItem('coachName') || '');

    const login = (id, name) => {
        localStorage.setItem('authToken', true);
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
        setCoachName(null);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, coachId, coachName, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};