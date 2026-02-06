import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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
import { AccountingDashboard } from './pages/accounting/AccountingDashboard';
import { SalesQuotationList } from './pages/sales/SalesQuotationList';
import { SalesInvoiceList } from './pages/sales/SalesInvoiceList';
import { SalesOrderList } from './pages/sales/SalesOrderList';
import { DeliveryList } from './pages/sales/DeliveryList';
import { PaymentList } from './pages/sales/PaymentList';
import { CreateSalesQuotation } from './pages/sales/CreateSalesQuotation';
import { CreateSalesOrder } from './pages/sales/CreateSalesOrder';
import { CreateSalesInvoice } from './pages/sales/CreateSalesInvoice';
import UserManagement from './pages/admin/UserManagement';
import SuperAdminDashboard from './pages/dashboard/SuperAdminDashboard';
import SettingsPage from './pages/settings/SettingsPage';
import Chat from './pages/chat/Chat';
import EmailPage from './pages/email/Email';

function App() {
  // Get user role from localStorage for settings page
  const getUserRole = () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      return user.role || 'staff';
    } catch {
      return 'staff';
    }
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route element={<DashboardLayout />}>
          {/* Manager & Standard Admin Dashboard (Restricted) */}
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['MANAGER', 'ADMIN', 'FINANCE', 'SALES', 'PPIC', 'PURCHASING', 'WAREHOUSE', 'QUALITY_CONTROL', 'EMPLOYEE', 'USER', 'CASHIER']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          {/* Super Admin & Owner "God Mode" Dashboard */}
          <Route path="/super-admin" element={
            <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'OWNER']}>
              <SuperAdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/pos" element={
            <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'OWNER', 'MANAGER', 'CASHIER']}>
              <SalesPoint />
            </ProtectedRoute>
          } />
          <Route path="/manufacturing/bom" element={
            <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'OWNER', 'MANAGER', 'PRODUCTION']}>
              <BOMList />
            </ProtectedRoute>
          } />
          <Route path="/manufacturing/orders" element={
            <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'OWNER', 'MANAGER', 'PRODUCTION']}>
              <WorkOrderList />
            </ProtectedRoute>
          } />
          <Route path="/buying/suppliers" element={
            <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'OWNER', 'MANAGER', 'PURCHASING']}>
              <SupplierList />
            </ProtectedRoute>
          } />
          <Route path="/buying/purchase-orders" element={
            <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'OWNER', 'MANAGER', 'PURCHASING']}>
              <PurchaseOrderList />
            </ProtectedRoute>
          } />
          <Route path="/inventory" element={
            <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'OWNER', 'MANAGER', 'INVENTORY', 'WAREHOUSE']}>
              <InventoryList />
            </ProtectedRoute>
          } />
          <Route path="/inventory/warehouse" element={
            <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'OWNER', 'MANAGER', 'INVENTORY', 'WAREHOUSE']}>
              <WarehouseDashboard />
            </ProtectedRoute>
          } />
          {/* Chat & Email Routes */}
          <Route path="/chat" element={
            <ProtectedRoute allowedRoles={['OWNER', 'MANAGER', 'CASHIER', 'KITCHEN', 'STAFF', 'FINANCE', 'WAREHOUSE']}>
              <Chat />
            </ProtectedRoute>
          } />
          <Route path="/email" element={
            <ProtectedRoute allowedRoles={['OWNER', 'MANAGER', 'FINANCE', 'WAREHOUSE']}>
              <EmailPage />
            </ProtectedRoute>
          } />
          <Route path="/inventory/material-requests" element={
            <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'OWNER', 'MANAGER', 'INVENTORY', 'WAREHOUSE', 'PRODUCTION']}>
              <MaterialRequests />
            </ProtectedRoute>
          } />
          <Route path="/inventory/goods-receipts" element={
            <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'OWNER', 'MANAGER', 'INVENTORY', 'WAREHOUSE']}>
              <GoodsReceipts />
            </ProtectedRoute>
          } />
          <Route path="/inventory/stock-ledger" element={
            <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'OWNER', 'MANAGER', 'INVENTORY', 'WAREHOUSE', 'ACCOUNTANT']}>
              <StockLedger />
            </ProtectedRoute>
          } />
          <Route path="/crm" element={
            <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'OWNER', 'MANAGER', 'SALES']}>
              <CRM />
            </ProtectedRoute>
          } />
          <Route path="/users" element={
            <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'OWNER']}>
              <UserManagement />
            </ProtectedRoute>
          } />
          <Route path="/hr" element={
            <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'OWNER', 'MANAGER', 'HR_ADMIN']}>
              <EmployeeList />
            </ProtectedRoute>
          } />
          <Route path="/accounting" element={
            <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'OWNER', 'MANAGER', 'ACCOUNTANT', 'FINANCE']}>
              <AccountingDashboard />
            </ProtectedRoute>
          } />
          <Route path="/accounting/journal" element={
            <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'OWNER', 'MANAGER', 'ACCOUNTANT', 'FINANCE']}>
              <AccountingJournal />
            </ProtectedRoute>
          } />
          <Route path="/sales/quotations" element={
            <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'OWNER', 'MANAGER', 'SALES']}>
              <SalesQuotationList />
            </ProtectedRoute>
          } />
          <Route path="/sales/orders" element={
            <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'OWNER', 'MANAGER', 'SALES']}>
              <SalesOrderList />
            </ProtectedRoute>
          } />
          <Route path="/sales/orders/create" element={
            <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'OWNER', 'MANAGER', 'SALES']}>
              <CreateSalesOrder />
            </ProtectedRoute>
          } />
          <Route path="/sales/invoices" element={
            <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'OWNER', 'MANAGER', 'ACCOUNTANT']}>
              <SalesInvoiceList />
            </ProtectedRoute>
          } />
          <Route path="/sales/invoices/create" element={
            <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'OWNER', 'MANAGER', 'ACCOUNTANT']}>
              <CreateSalesInvoice />
            </ProtectedRoute>
          } />
          <Route path="/sales/delivery" element={
            <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'OWNER', 'MANAGER', 'WAREHOUSE']}>
              <DeliveryList />
            </ProtectedRoute>
          } />
          <Route path="/sales/quotations/create" element={
            <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'OWNER', 'MANAGER', 'SALES']}>
              <CreateSalesQuotation />
            </ProtectedRoute>
          } />
          <Route path="/sales/payments" element={
            <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'OWNER', 'MANAGER', 'ACCOUNTANT']}>
              <PaymentList />
            </ProtectedRoute>
          } />
          <Route path="/manager" element={
            <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'OWNER', 'MANAGER']}>
              <Approvals />
            </ProtectedRoute>
          } />
          <Route path="/tasks" element={
            <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'OWNER', 'MANAGER', 'EMPLOYEE', 'USER']}>
              <TaskDashboard />
            </ProtectedRoute>
          } />
          <Route path="/settings" element={
            <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'OWNER', 'MANAGER', 'HR_ADMIN', 'INVENTORY', 'PRODUCTION', 'EMPLOYEE', 'USER', 'CASHIER', 'SALES', 'ACCOUNTANT']}>
              <SettingsPage userRole={getUserRole()} />
            </ProtectedRoute>
          } />
          <Route path="/settings-old" element={
            <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'OWNER', 'MANAGER', 'HR_ADMIN', 'INVENTORY', 'PRODUCTION']}>
              <Settings />
            </ProtectedRoute>
          } />
          <Route path="/dashboard" element={<Navigate to="/admin" replace />} />
          <Route path="/unauthorized" element={<div style={{ padding: 20 }}>Access Denied</div>} />
        </Route>

        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
