package com.openerp.app.presentation.navigation

import androidx.compose.runtime.*
import androidx.compose.ui.platform.LocalContext
import androidx.navigation.NavType
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import androidx.navigation.navArgument
import com.openerp.app.data.local.SessionManager
import com.openerp.app.domain.model.User
import com.openerp.app.presentation.auth.LoginScreen
import com.openerp.app.presentation.dashboard.DashboardRouter
import com.openerp.app.presentation.chat.ChatListScreen
import com.openerp.app.presentation.chat.ChatRoomScreen
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
                    },
                    onChatClick = {
                        navController.navigate(Screen.ChatList.route)
                    }
                )
            }
        }
        
        composable(Screen.ChatList.route) {
            ChatListScreen(
                onBackClick = { navController.popBackStack() },
                onConversationClick = { conversationId ->
                    val conversations = com.openerp.app.data.local.MockChats.getConversations()
                    val conversation = conversations.find { it.id == conversationId }
                    conversation?.let {
                        navController.navigate(
                            Screen.ChatRoom.createRoute(conversationId, it.name)
                        )
                    }
                }
            )
        }
        
        composable(
            route = Screen.ChatRoom.route,
            arguments = listOf(
                navArgument("conversationId") { type = NavType.StringType },
                navArgument("conversationName") { type = NavType.StringType }
            )
        ) { backStackEntry ->
            val conversationId = backStackEntry.arguments?.getString("conversationId") ?: ""
            val conversationName = backStackEntry.arguments?.getString("conversationName") ?: ""
            
            ChatRoomScreen(
                conversationId = conversationId,
                conversationName = conversationName,
                onBackClick = { navController.popBackStack() }
            )
        }
    }
}
