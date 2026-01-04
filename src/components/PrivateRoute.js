// PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ role, children }) => {


    const token = localStorage.getItem('token');  // JWT token from login
    const userRole = localStorage.getItem('role');  // Role saved after login (admin/client)

    console.log('Token:', token);
    console.log('UserRole:', userRole);


    if (!token) {
        // If no token is found, redirect to login page
        return <Navigate to="/login" />;
    }

    if (userRole !== role) {
        // If the user's role does not match the required role, redirect to unauthorized page or home
        return <Navigate to="/unauthorized" />;
    }

    // If the user is authenticated and the role matches, render the requested page
    return children;
};

export default PrivateRoute;
