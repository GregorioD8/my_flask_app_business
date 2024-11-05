import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { AuthContext } from './AuthContext';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const { isAuthenticated } = useContext(AuthContext); // Check if the user is logged in

  return (
    <Route
      {...rest}
      render={props =>
        isAuthenticated ? ( // Check if user is authenticated
          <Component {...props} /> // Render component if authenticated
        ) : (
          <Redirect to="/login" /> // Redirect to login if not authenticated
        )
      }
    />
  );
};

export default PrivateRoute;