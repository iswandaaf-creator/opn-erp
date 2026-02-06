package com.openerp.app.domain.model

enum class UserRole(val displayName: String, val colorCode: String) {
    OWNER("Owner", "#1976D2"),
    SUPER_ADMIN("Super Admin", "#D32F2F"),
    ADMIN("Admin", "#C2185B"),
    MANAGER("Manager", "#9C27B0"),
    CASHIER("Cashier", "#4CAF50"),
    SALES("Sales", "#FF9800"),
    INVENTORY("Inventory", "#795548"),
    HR_ADMIN("HR", "#607D8B"),
    FINANCE("Finance", "#E91E63"),
    WAREHOUSE("Warehouse", "#5D4037"),
    PRODUCTION("Production", "#455A64"),
    EMPLOYEE("Employee", "#00BCD4"),
    USER("User", "#9E9E9E");

    companion object {
        fun fromString(role: String): UserRole {
            return values().find { it.name.equals(role, ignoreCase = true) } ?: STAFF
        }
    }
}

data class User(
    val id: String,
    val name: String,
    val email: String,
    val role: UserRole,
    val avatar: String? = null
)
