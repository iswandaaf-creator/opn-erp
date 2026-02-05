package com.openerp.app.domain.model

enum class UserRole(val displayName: String, val colorCode: String) {
    OWNER("Owner", "#1976D2"),
    MANAGER("Manager", "#9C27B0"),
    CASHIER("Cashier", "#4CAF50"),
    KITCHEN("Kitchen", "#FF9800"),
    STAFF("Staff", "#00BCD4"),
    FINANCE("Finance", "#E91E63"),
    WAREHOUSE("Warehouse", "#795548");

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
