package com.openerp.app.presentation.dashboard

import androidx.compose.runtime.Composable
import com.openerp.app.domain.model.User
import com.openerp.app.domain.model.UserRole
import com.openerp.app.presentation.dashboard.owner.OwnerDashboard
import com.openerp.app.presentation.dashboard.manager.ManagerDashboard
import com.openerp.app.presentation.dashboard.cashier.CashierDashboard
import com.openerp.app.presentation.dashboard.kitchen.KitchenDashboard
import com.openerp.app.presentation.dashboard.staff.StaffDashboard
import com.openerp.app.presentation.dashboard.finance.FinanceDashboard
import com.openerp.app.presentation.dashboard.warehouse.WarehouseDashboard

@Composable
fun DashboardRouter(
    user: User,
    onLogout: () -> Unit,
    onChatClick: () -> Unit = {}
) {
    when (user.role) {
        UserRole.OWNER -> OwnerDashboard(user, onLogout, onChatClick)
        UserRole.MANAGER -> ManagerDashboard(user, onLogout, onChatClick)
        UserRole.CASHIER -> CashierDashboard(user, onLogout, onChatClick)
        UserRole.KITCHEN -> KitchenDashboard(user, onLogout, onChatClick)
        UserRole.STAFF -> StaffDashboard(user, onLogout, onChatClick)
        UserRole.FINANCE -> FinanceDashboard(user, onLogout, onChatClick)
        UserRole.WAREHOUSE -> WarehouseDashboard(user, onLogout, onChatClick)
    }
}
