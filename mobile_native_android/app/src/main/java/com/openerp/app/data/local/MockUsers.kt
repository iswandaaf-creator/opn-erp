package com.openerp.app.data.local

import com.openerp.app.domain.model.User
import com.openerp.app.domain.model.UserRole

object MockUsers {
    private val users = listOf(
        User(
            id = "1",
            name = "John Owner",
            email = "owner@openerp.com",
            role = UserRole.OWNER
        ),
        User(
            id = "2",
            name = "Sarah Manager",
            email = "manager@openerp.com",
            role = UserRole.MANAGER
        ),
        User(
            id = "3",
            name = "Mike Cashier",
            email = "cashier@openerp.com",
            role = UserRole.CASHIER
        ),
        User(
            id = "4",
            name = "Chef Kitchen",
            email = "kitchen@openerp.com",
            role = UserRole.KITCHEN
        ),
        User(
            id = "5",
            name = "Tom Staff",
            email = "staff@openerp.com",
            role = UserRole.STAFF
        ),
        User(
            id = "6",
            name = "Anna Finance",
            email = "finance@openerp.com",
            role = UserRole.FINANCE
        ),
        User(
            id = "7",
            name = "Bob Warehouse",
            email = "warehouse@openerp.com",
            role = UserRole.WAREHOUSE
        )
    )

    fun getAllUsers() = users

    fun authenticate(email: String, password: String): User? {
        // Simple mock authentication - in production, this would call backend API
        return users.find { it.email.equals(email, ignoreCase = true) }
    }
}
