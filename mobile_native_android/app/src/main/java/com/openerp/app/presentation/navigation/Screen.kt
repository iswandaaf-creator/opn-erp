package com.openerp.app.presentation.navigation

sealed class Screen(val route: String) {
    object Login : Screen("login")
    object Dashboard : Screen("dashboard")
    object Products : Screen("products")
    object Sales : Screen("sales")
    object Orders : Screen("orders")
    object Profile : Screen("profile")
}
