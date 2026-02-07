import { useEffect, useState } from 'react';
import { OwnerDashboard } from './roles/OwnerDashboard';
import { ManagerDashboard } from './roles/ManagerDashboard';
import { StaffDashboard } from './roles/StaffDashboard';

// Role-Based Dashboards
import { AccountingDashboard } from '../accounting/AccountingDashboard';
import WarehouseDashboard from '../inventory/WarehouseDashboard';
import { ManufacturingDashboard } from './roles/ManufacturingDashboard';
import { ProcurementDashboard } from './roles/ProcurementDashboard';
import { SalesAdminDashboard } from './roles/SalesAdminDashboard';
import { QualityDashboard } from './roles/QualityDashboard';

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
        // High Level Management
        case 'OWNER':
        case 'SUPER_ADMIN': // Super Admin can see Owner dashboard for now
            return <OwnerDashboard />;
        case 'MANAGER':
        case 'ADMIN':
            return <ManagerDashboard />;

        // Department Heads / Staff
        case 'PPIC':
        case 'PRODUCTION':
            return <ManufacturingDashboard />;

        case 'PURCHASING':
            return <ProcurementDashboard />;

        case 'WAREHOUSE':
        case 'INVENTORY':
            return <WarehouseDashboard />;

        case 'QUALITY_CONTROL':
            return <QualityDashboard />;

        case 'SALES':
        case 'SALES_ADMIN':
            return <SalesAdminDashboard />;

        case 'FINANCE':
        case 'ACCOUNTANT':
            return <AccountingDashboard />;

        // General Staff
        case 'USER':
        case 'EMPLOYEE':
        case 'CASHIER':
            return <StaffDashboard />;

        default:
            // Fallback for Guests or unknown roles
            return <StaffDashboard />;
    }
};
