package com.openerp.app.presentation.navigation

import androidx.compose.runtime.*
import androidx.compose.ui.platform.LocalContext
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.openerp.app.data.local.SessionManager
import com.openerp.app.domain.model.User
import com.openerp.app.presentation.auth.LoginScreen
import com.openerp.app.presentation.dashboard.DashboardRouter
import kotlinx.coroutines.launch

@Composable
fun AppNavigation() {
    val navController = rememberNavController()
    val context = LocalContext.current
    val sessionManager = remember { SessionManager(context) }
    val scope = rememberCoroutineScope()
    
    var currentUser by remember { mutableStateOf<User?>(null) }
    
    LaunchedEffect(Unit) {
        sessionManager.getUser().collect { user ->
            currentUser = user
        }
    }

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
            currentUser?.let { user ->
                DashboardRouter(
                    user = user,
                    onLogout = {
                        scope.launch {
                            sessionManager.clearSession()
                            navController.navigate(Screen.Login.route) {
                                popUpTo(Screen.Dashboard.route) { inclusive = true }
                            }
                        }
                    }
                )
            }
        }
    }
}
