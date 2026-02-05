package com.openerp.app.data.local

import com.openerp.app.domain.model.email.*
import com.openerp.app.domain.model.User

object MockEmails {
    private val users = MockUsers.getAllUsers()
    
    private val emails = mutableListOf(
        Email(
            id = "email_1",
            from = users[0], // Owner
            to = listOf(users[1]), // Manager
            subject = "Monthly Performance Review",
            body = "Hi Team,\n\nPlease review the monthly performance report attached. We've seen great improvements across all departments.\n\nKey highlights:\n- Sales up 22%\n- Customer satisfaction improved\n- New team members onboarded successfully\n\nLet's discuss in our next meeting.\n\nBest regards,\nJohn Owner",
            timestamp = System.currentTimeMillis() - 3600000,
            isRead = false,
            folder = EmailFolder.INBOX,
            priority = EmailPriority.HIGH,
            attachments = listOf(
                EmailAttachment(
                    id = "att_1",
                    fileName = "monthly_report.pdf",
                    fileSize = 2048000,
                    mimeType = "application/pdf",
                    url = ""
                )
            )
        ),
        Email(
            id = "email_2",
            from = users[1], // Manager
            to = listOf(users[2], users[3]), // Cashier, Kitchen
            cc = listOf(users[0]), // Owner
            subject = "Inventory Update Required",
            body = "Hello,\n\nWe need to update the inventory system by end of this week. Please coordinate with the warehouse team to ensure all counts are accurate.\n\nDeadline: Friday 5 PM\n\nThanks,\nAlice Manager",
            timestamp = System.currentTimeMillis() - 7200000,
            isRead = true,
            folder = EmailFolder.INBOX,
            priority = EmailPriority.NORMAL
        ),
        Email(
            id = "email_3",
            from = users[5], // Finance
            to = listOf(users[0]), // Owner
            subject = "Budget Approval Needed",
            body = "Dear Sir,\n\nAttached is the Q1 budget proposal for your review and approval.\n\nTotal budget: Rp 125M\nKey allocations:\n- Marketing: Rp 35M\n- Operations: Rp 55M\n- Technology: Rp 20M\n- Reserve: Rp 15M\n\nPlease approve at your earliest convenience.\n\nRegards,\nAnna Finance",
            timestamp = System.currentTimeMillis() - 86400000,
            isRead = true,
            folder = EmailFolder.INBOX,
            priority = EmailPriority.HIGH,
            isStarred = true
        ),
        Email(
            id = "email_4",
            from = users[0], // Current user
            to = listOf(users[1], users[2]), // Manager, Cashier
            subject = "Team Meeting - Friday 2 PM",
            body = "Hi All,\n\nScheduling our weekly team meeting for Friday at 2 PM.\n\nAgenda:\n1. Sales review\n2. Customer feedback\n3. Next week planning\n\nSee you there!\n\nJohn",
            timestamp = System.currentTimeMillis() - 172800000,
            isRead = true,
            folder = EmailFolder.SENT,
            priority = EmailPriority.NORMAL
        ),
        Email(
            id = "email_5",
            from = users[0], // Current user
            to = listOf(users[6]), // Warehouse
            subject = "Stock Check Request",
            body = "Bob,\n\nCan you please verify the current stock levels for:\n- Rice Premium 5kg\n- Cooking Oil 2L\n- Sugar 1kg\n\nWe're seeing some discrepancies in the system.\n\nThanks!",
            timestamp = System.currentTimeMillis() - 1000000,
            isRead = false,
            folder = EmailFolder.DRAFTS,
            priority = EmailPriority.NORMAL
        )
    )
    
    fun getEmails(folder: EmailFolder): List<Email> = 
        emails.filter { it.folder == folder }.sortedByDescending { it.timestamp }
    
    fun getAllEmails(): List<Email> = emails.sortedByDescending { it.timestamp }
    
    fun getEmailById(id: String): Email? = emails.find { it.id == id }
    
    fun getUnreadCount(folder: EmailFolder): Int = 
        emails.count { it.folder == folder && !it.isRead }
    
    fun markAsRead(emailId: String) {
        emails.find { it.id == emailId }?.let { email ->
            val index = emails.indexOf(email)
            emails[index] = email.copy(isRead = true)
        }
    }
    
    fun toggleStar(emailId: String) {
        emails.find { it.id == emailId }?.let { email ->
            val index = emails.indexOf(email)
            emails[index] = email.copy(isStarred = !email.isStarred)
        }
    }
    
    fun sendEmail(to: List<User>, subject: String, body: String, currentUser: User) {
        val newEmail = Email(
            id = "email_${System.currentTimeMillis()}",
            from = currentUser,
            to = to,
            subject = subject,
            body = body,
            timestamp = System.currentTimeMillis(),
            isRead = true,
            folder = EmailFolder.SENT
        )
        emails.add(newEmail)
    }
    
    fun saveDraft(to: List<User>, subject: String, body: String, currentUser: User) {
        val draftEmail = Email(
            id = "email_${System.currentTimeMillis()}",
            from = currentUser,
            to = to,
            subject = subject,
            body = body,
            timestamp = System.currentTimeMillis(),
            isRead = false,
            folder = EmailFolder.DRAFTS
        )
        emails.add(draftEmail)
    }
}
