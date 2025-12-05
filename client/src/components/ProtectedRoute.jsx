import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // We will need to install this!

const ProtectedRoute = ({ allowedRoles }) => {
  const token = localStorage.getItem('token');

  // 1. Check if token exists
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    // 2. Decode the token to find the user's role
    // (We need to make sure your backend actually includes the 'role' in the token!)
    const decoded = jwtDecode(token);
    const userRole = decoded.user.role; // Assuming structure is { user: { role: 'admin' } }

    // 3. Check if the user's role is in the list of allowed roles
    if (allowedRoles && !allowedRoles.includes(userRole)) {
      // If they are an 'admin' trying to access 'superadmin' page:
      return <Navigate to="/unauthorized" replace />; 
    }

    // 4. If all checks pass, render the child components (The actual page)
    return <Outlet />;

  } catch (error) {
    // If token is invalid/expired
    localStorage.removeItem('token');
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;