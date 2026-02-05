package com.openerp.app.presentation.navigation

import androidx.compose.runtime.Composable
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.openerp.app.presentation.auth.LoginScreen
import com.openerp.app.presentation.dashboard.DashboardScreen

@Composable
fun AppNavigation() {
    val navController = rememberNavController()

    NavHost(
        navController = navController,
        startDestination = Screen.Login.route
    ) {
        composable(Screen.Login.route) {
            LoginScreen(
                onLoginSuccess = {
                    navController.navigate(Screen.Dashboard.route) {
                        popUpTo(Screen.Login.route) { inclusive = true }
                    }
                }
            )
        }

        composable(Screen.Dashboard.route) {
            DashboardScreen(
                onNavigateToProducts = { navController.navigate(Screen.Products.route) },
                onNavigateToSales = { navController.navigate(Screen.Sales.route) },
                onNavigateToOrders = { navController.navigate(Screen.Orders.route) },
            )
        }

        // Add more screens here...
    }
}
