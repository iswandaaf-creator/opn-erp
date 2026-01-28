import { useEffect, useState } from 'react';
import { OwnerDashboard } from './roles/OwnerDashboard';
import { ManagerDashboard } from './roles/ManagerDashboard';
import { StaffDashboard } from './roles/StaffDashboard';

export const AdminDashboard = () => {
    const [role, setRole] = useState('GUEST');

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            const user = JSON.parse(userStr);
            setRole(user.role || 'GUEST');
        }
    }, []);

    // Dispatcher
    switch (role) {
        case 'OWNER':
        case 'ADMIN':
            return <OwnerDashboard />;
        case 'MANAGER':
            return <ManagerDashboard />;
        case 'USER':
        case 'EMPLOYEE':
        case 'CASHIER':
            return <StaffDashboard />;
        default:
            // Fallback for Guests or unknown roles
            return <StaffDashboard />;
    }
};
