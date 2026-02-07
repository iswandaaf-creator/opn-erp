package com.openerp.app.data.repository

import com.openerp.app.data.remote.ApiService
import com.openerp.app.data.remote.SocketManager
import com.openerp.app.domain.model.chat.Conversation
import com.openerp.app.domain.model.chat.Message
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.withContext
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class ChatRepository @Inject constructor(
    private val apiService: ApiService,
    private val socketManager: SocketManager
) {
    suspend fun getConversations(): List<Conversation> {
        return withContext(Dispatchers.IO) {
            try {
                apiService.getConversations()
            } catch (e: Exception) {
                emptyList()
            }
        }
    }

    suspend fun getMessages(partnerId: String): List<Message> {
        return withContext(Dispatchers.IO) {
            try {
                apiService.getMessages(partnerId)
            } catch (e: Exception) {
                emptyList()
            }
        }
    }

    suspend fun sendMessage(partnerId: String, content: String): Message? {
        return withContext(Dispatchers.IO) {
            try {
                val msg = apiService.sendMessage(mapOf(
                    "receiverId" to partnerId,
                    "content" to content
                ))
                // Also emit to socket for immediate update if needed, but API response is enough for confirmation
                // socketManager.emit("sendMessage", ...)
                msg
            } catch (e: Exception) {
                null
            }
        }
    }

    fun observeNewMessages(): Flow<Message> {
        return socketManager.on("newMessage").map { 
             // Convert 'it' (JSONObject or Map) to Message
             // For now assuming Gson/Moshi auto-convert or manual parsing
             // This part needs careful handling of the socket payload
             it as Message 
        }
    }
}
