import React from 'react'
import { useAuth } from '../Components/AuthProvider'
import { Outlet } from 'react-router-dom';
import UnAuthorized from '../Components/UnAuthorized';

const AdminRoutes = () => {

    const {role} = useAuth();

     return role === "Admin" ? <Outlet /> : <UnAuthorized />;
}

export default AdminRoutes
