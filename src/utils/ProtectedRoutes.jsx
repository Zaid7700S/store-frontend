import React from 'react'
import {Outlet , Navigate,useLocation} from "react-router-dom"

const ProtectedRoutes = () => {

    const location = useLocation();
    const token = localStorage.getItem("accessToken");

    const isAuthenticated = token;

    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
    
  
}

export default ProtectedRoutes
