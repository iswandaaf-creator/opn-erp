package com.openerp.app.presentation.navigation

sealed class Screen(val route: String) {
    object Login : Screen("login")
    object Dashboard : Screen("dashboard")
    object Products : Screen("products")
    object Sales : Screen("sales")
    object Orders : Screen("orders")
    object Profile : Screen("profile")
    object ChatList : Screen("chat_list")
    object ChatRoom : Screen("chat_room/{conversationId}/{conversationName}") {
        fun createRoute(conversationId: String, conversationName: String) = 
            "chat_room/$conversationId/$conversationName"
    }
    object EmailList : Screen("email_list")
    object EmailDetail : Screen("email_detail/{emailId}") {
        fun createRoute(emailId: String) = "email_detail/$emailId"
    }
    object ComposeEmail : Screen("compose_email")
}
