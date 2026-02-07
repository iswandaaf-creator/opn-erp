package com.openerp.app.domain.model.chat

import com.openerp.app.domain.model.User

enum class MessageType {
    TEXT, IMAGE, VIDEO, DOCUMENT, AUDIO
}

enum class MessageStatus {
    SENDING, SENT, DELIVERED, READ
}

data class Attachment(
    val id: String,
    val type: MessageType,
    val url: String,
    val fileName: String,
    val fileSize: Long,
    val thumbnailUrl: String? = null
)

data class Message(
    val id: String,
    val conversationId: String,
    val sender: User,
    val content: String,
    val type: MessageType = MessageType.TEXT,
    val attachment: Attachment? = null,
    val timestamp: Long = System.currentTimeMillis(),
    val status: MessageStatus = MessageStatus.SENT,
    val isMe: Boolean = false
)

data class Conversation(
    val id: String,
    val name: String,
    val participants: List<User>,
    val lastMessage: Message?,
    val unreadCount: Int = 0,
    val isGroup: Boolean = false,
    val avatarUrl: String? = null
)
