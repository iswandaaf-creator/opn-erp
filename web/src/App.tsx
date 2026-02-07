import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { LoginPage } from './pages/auth/LoginPage';
import { DashboardHome } from './pages/dashboard/DashboardHome';

import { UsersPage } from './pages/users/UsersPage';
import { RolesPage } from './pages/roles/RolesPage';
import { ProductsPage } from './pages/inventory/ProductsPage';
import { EmployeesPage } from './pages/hr/EmployeesPage';
import { AttendancePage } from './pages/hr/AttendancePage';
import { PosPage } from './pages/sales/PosPage';
import { AccountingPage } from './pages/accounting/AccountingPage';
import { ManufacturingPage } from './pages/manufacturing/ManufacturingPage';
import { ProjectsPage } from './pages/projects/ProjectsPage';
import { CrmPage } from './pages/crm/CrmPage';
import { SupportAdminPage } from './pages/support/SupportAdminPage';
import { SettingsPage } from './pages/settings/SettingsPage';

const ProtectedRoute = ({ children }: { children: React.ReactElement }) => {
  const { token, isLoading } = useAuth();

  if (isLoading) return <div>Loading...</div>;
  if (!token) return <Navigate to="/login" replace />;

  return children;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route path="/dashboard" element={
        <ProtectedRoute>
          <DashboardLayout />
        </ProtectedRoute>
      }>
        <Route index element={<DashboardHome />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="roles" element={<RolesPage />} />
        <Route path="inventory" element={<ProductsPage />} />
        <Route path="hr/employees" element={<EmployeesPage />} />
        <Route path="hr/attendance" element={<AttendancePage />} />
        <Route path="sales" element={<PosPage />} />
        <Route path="accounting" element={<AccountingPage />} />
        <Route path="manufacturing" element={<ManufacturingPage />} />
        <Route path="projects" element={<ProjectsPage />} />
        <Route path="crm" element={<CrmPage />} />
        <Route path="support" element={<SupportAdminPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
