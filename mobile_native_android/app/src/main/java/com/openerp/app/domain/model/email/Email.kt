package com.openerp.app.domain.model.email

import com.openerp.app.domain.model.User

enum class EmailFolder {
    INBOX, SENT, DRAFTS, TRASH
}

enum class EmailPriority {
    LOW, NORMAL, HIGH
}

data class EmailAttachment(
    val id: String,
    val fileName: String,
    val fileSize: Long,
    val mimeType: String,
    val url: String
)

data class Email(
    val id: String,
    val from: User,
    val to: List<User>,
    val cc: List<User> = emptyList(),
    val subject: String,
    val body: String,
    val timestamp: Long = System.currentTimeMillis(),
    val isRead: Boolean = false,
    val isStarred: Boolean = false,
    val folder: EmailFolder = EmailFolder.INBOX,
    val priority: EmailPriority = EmailPriority.NORMAL,
    val attachments: List<EmailAttachment> = emptyList(),
    val replyTo: String? = null
)
