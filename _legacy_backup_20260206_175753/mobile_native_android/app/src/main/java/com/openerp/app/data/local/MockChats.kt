package com.openerp.app.data.local

import com.openerp.app.domain.model.chat.*
import com.openerp.app.domain.model.UserRole

object MockChats {
    private val users = MockUsers.getAllUsers()
    
    private val conversations = listOf(
        Conversation(
            id = "conv_1",
            name = "Team Chat",
            participants = users,
            lastMessage = Message(
                id = "msg_1",
                conversationId = "conv_1",
                sender = users[1], // Manager
                content = "Great job on today's sales!",
                isMe = false
            ),
            unreadCount = 3,
            isGroup = true
        ),
        Conversation(
            id = "conv_2",
            name = "Sales Team",
            participants = users.filter { it.role == UserRole.CASHIER || it.role == UserRole.MANAGER },
            lastMessage = Message(
                id = "msg_2",
                conversationId = "conv_2",
                sender = users[2], // Cashier
                content = "Need help with inventory count",
                isMe = false
            ),
            unreadCount = 1,
            isGroup = true
        ),
        Conversation(
            id = "conv_3",
            name = users[0].name, // Owner (direct chat)
            participants = listOf(users[0]),
            lastMessage = Message(
                id = "msg_3",
                conversationId = "conv_3",
                sender = users[0],
                content = "Please review the monthly report",
                isMe = false
            ),
            unreadCount = 0,
            isGroup = false
        )
    )
    
    private val messages = mutableMapOf(
        "conv_1" to mutableListOf(
            Message(
                id = "msg_1_1",
                conversationId = "conv_1",
                sender = users[1],
                content = "Good morning team!",
                timestamp = System.currentTimeMillis() - 3600000,
                isMe = false
            ),
            Message(
                id = "msg_1_2",
                conversationId = "conv_1",
                sender = users[0],
                content = "Morning! Ready for a productive day",
                timestamp = System.currentTimeMillis() - 3500000,
                isMe = true
            ),
            Message(
                id = "msg_1_3",
                conversationId = "conv_1",
                sender = users[2],
                content = "Sales are looking good today",
                timestamp = System.currentTimeMillis() - 3400000,
                isMe = false
            ),
            Message(
                id = "msg_1_4",
                conversationId = "conv_1",
                sender = users[1],
                content = "Great job on today's sales!",
                timestamp = System.currentTimeMillis() - 1000,
                isMe = false
            )
        ),
        "conv_2" to mutableListOf(
            Message(
                id = "msg_2_1",
                conversationId = "conv_2",
                sender = users[2],
                content = "Need help with inventory count",
                timestamp = System.currentTimeMillis() - 300000,
                isMe = false
            )
        ),
        "conv_3" to mutableListOf(
            Message(
                id = "msg_3_1",
                conversationId = "conv_3",
                sender = users[0],
                content = "Please review the monthly report",
                timestamp = System.currentTimeMillis() - 7200000,
                isMe = false
            ),
            Message(
                id = "msg_3_2",
                conversationId = "conv_3",
                sender = users[0],
                content = "Will do, checking it now",
                timestamp = System.currentTimeMillis() - 7100000,
                isMe = true
            )
        )
    )
    
    fun getConversations(): List<Conversation> = conversations
    
    fun getMessages(conversationId: String): List<Message> = 
        messages[conversationId]?.toList() ?: emptyList()
    
    fun sendMessage(conversationId: String, content: String, currentUser: com.openerp.app.domain.model.User) {
        val newMessage = Message(
            id = "msg_${System.currentTimeMillis()}",
            conversationId = conversationId,
            sender = currentUser,
            content = content,
            timestamp = System.currentTimeMillis(),
            isMe = true
        )
        messages[conversationId]?.add(newMessage)
    }
}
