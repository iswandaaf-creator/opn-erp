import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { theme } from './theme';
import { Login } from './pages/auth/Login';
import { DashboardLayout } from './layouts/DashboardLayout';
import { AdminDashboard } from './pages/dashboard/AdminDashboard';
import { ProtectedRoute } from './components/ProtectedRoute';
import { SalesPoint } from './pages/sales/SalesPoint';
import { BOMList } from './pages/manufacturing/BOMList';
import { WorkOrderList } from './pages/manufacturing/WorkOrderList';
import { SupplierList } from './pages/buying/SupplierList';
import { PurchaseOrderList } from './pages/buying/PurchaseOrderList';
import { InventoryList } from './pages/inventory/InventoryList';
import WarehouseDashboard from './pages/inventory/WarehouseDashboard';
import MaterialRequests from './pages/inventory/MaterialRequests';
import GoodsReceipts from './pages/inventory/GoodsReceipts';
import StockLedger from './pages/inventory/StockLedger';
import { CRM } from './pages/crm/CRM';
import { Settings } from './pages/settings/Settings';
import { Approvals } from './pages/manager/Approvals';
import { TaskDashboard } from './pages/tasks/TaskDashboard';
import { UserList } from './pages/users/UserList';
import { EmployeeList } from './pages/employees/EmployeeList';
import { AccountingJournal } from './pages/accounting/AccountingJournal';
import { SuperAdminDashboard } from './pages/dashboard/SuperAdminDashboard';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />

          {/* Protected Routes */}
          <Route element={<DashboardLayout />}>
            <Route path="/admin" element={
              <ProtectedRoute allowedRoles={['OWNER', 'MANAGER', 'ADMIN', 'EMPLOYEE', 'USER', 'CASHIER']}>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/super-admin" element={
              <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
                <SuperAdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/pos" element={
              <ProtectedRoute allowedRoles={['OWNER', 'MANAGER']}>
                <SalesPoint />
              </ProtectedRoute>
            } />
            <Route path="/bom" element={
              <ProtectedRoute allowedRoles={['OWNER', 'MANAGER', 'ADMIN']}>
                <BOMList />
              </ProtectedRoute>
            } />
            <Route path="/work-orders" element={
              <ProtectedRoute allowedRoles={['OWNER', 'MANAGER', 'ADMIN']}>
                <WorkOrderList />
              </ProtectedRoute>
            } />
            <Route path="/buying/suppliers" element={
              <ProtectedRoute allowedRoles={['OWNER', 'MANAGER', 'ADMIN']}>
                <SupplierList />
              </ProtectedRoute>
            } />
            <Route path="/buying/orders" element={
              <ProtectedRoute allowedRoles={['OWNER', 'MANAGER', 'ADMIN']}>
                <PurchaseOrderList />
              </ProtectedRoute>
            } />
            <Route path="/inventory" element={
              <ProtectedRoute allowedRoles={['OWNER', 'MANAGER', 'INVENTORY']}>
                <InventoryList />
              </ProtectedRoute>
            } />
            <Route path="/inventory/dashboard" element={
              <ProtectedRoute allowedRoles={['OWNER', 'MANAGER', 'INVENTORY']}>
                <WarehouseDashboard />
              </ProtectedRoute>
            } />
            <Route path="/inventory/material-requests" element={
              <ProtectedRoute allowedRoles={['OWNER', 'MANAGER', 'INVENTORY', 'PRODUCTION']}>
                <MaterialRequests />
              </ProtectedRoute>
            } />
            <Route path="/inventory/goods-receipts" element={
              <ProtectedRoute allowedRoles={['OWNER', 'MANAGER', 'INVENTORY', 'PRODUCTION']}>
                <GoodsReceipts />
              </ProtectedRoute>
            } />
            <Route path="/inventory/stock-ledger" element={
              <ProtectedRoute allowedRoles={['OWNER', 'MANAGER', 'INVENTORY']}>
                <StockLedger />
              </ProtectedRoute>
            } />
            <Route path="/crm" element={
              <ProtectedRoute allowedRoles={['OWNER', 'MANAGER']}>
                <CRM />
              </ProtectedRoute>
            } />
            <Route path="/employees" element={
              <ProtectedRoute allowedRoles={['OWNER', 'HR_ADMIN']}>
                <EmployeeList />
              </ProtectedRoute>
            } />
            <Route path="/users" element={
              <ProtectedRoute allowedRoles={['OWNER', 'HR_ADMIN']}>
                <UserList />
              </ProtectedRoute>
            } />
            <Route path="/accounting" element={
              <ProtectedRoute allowedRoles={['OWNER', 'MANAGER']}>
                <AccountingJournal />
              </ProtectedRoute>
            } />
            <Route path="/manager" element={
              <ProtectedRoute allowedRoles={['OWNER', 'MANAGER']}>
                <Approvals />
              </ProtectedRoute>
            } />
            <Route path="/tasks" element={
              <ProtectedRoute allowedRoles={['OWNER', 'MANAGER', 'EMPLOYEE', 'USER']}>
                <TaskDashboard />
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute allowedRoles={['OWNER', 'MANAGER', 'HR_ADMIN', 'INVENTORY', 'PRODUCTION']}>
                <Settings />
              </ProtectedRoute>
            } />
            <Route path="/dashboard" element={<Navigate to="/admin" replace />} />
            <Route path="/unauthorized" element={<div style={{ padding: 20 }}>Access Denied</div>} />
          </Route>

          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
