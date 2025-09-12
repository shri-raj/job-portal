import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
const ProtectedRoute: React.FC<{ children: React.ReactNode; roles?: string[] }> = ({ children, roles }) => {
    const { auth } = useAuth();

    if (!auth.isAuthenticated) {
        return <Navigate to="/login" />;
    }

    if (roles && auth.user && !roles.some(role => auth.user!.roles.includes(role))) {
        return <div className="p-8 text-center text-red-600">Access denied. Insufficient permissions.</div>;
    }

    return <>{children}</>;
};

export default ProtectedRoute;