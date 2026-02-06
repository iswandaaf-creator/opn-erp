package com.openerp.app.presentation.chat

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.openerp.app.data.local.SessionManager
import com.openerp.app.data.repository.ChatRepository
import com.openerp.app.domain.model.chat.Conversation
import com.openerp.app.domain.model.chat.Message
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class ChatViewModel @Inject constructor(
    private val chatRepository: ChatRepository,
    private val sessionManager: SessionManager
) : ViewModel() {

    private val _conversations = MutableStateFlow<List<Conversation>>(emptyList())
    val conversations: StateFlow<List<Conversation>> = _conversations.asStateFlow()

    private val _messages = MutableStateFlow<List<Message>>(emptyList())
    val messages: StateFlow<List<Message>> = _messages.asStateFlow()

    private val _currentUserId = MutableStateFlow<String?>(null)

    init {
        viewModelScope.launch {
            sessionManager.getUser().collect { user ->
                _currentUserId.value = user?.id
                if (user != null) {
                    loadConversations()
                    observeNewMessages()
                }
            }
        }
    }

    fun loadConversations() {
        viewModelScope.launch {
            _conversations.value = chatRepository.getConversations()
        }
    }

    fun loadMessages(partnerId: String) {
        viewModelScope.launch {
            _messages.value = chatRepository.getMessages(partnerId)
        }
    }

    fun sendMessage(partnerId: String, content: String) {
        viewModelScope.launch {
             // Optimistic update could go here
             chatRepository.sendMessage(partnerId, content)?.let { sentMsg ->
                 _messages.value += sentMsg
                 // Also update conversation last message if needed
                 loadConversations() 
             }
        }
    }

    private fun observeNewMessages() {
        viewModelScope.launch {
            chatRepository.observeNewMessages().collect { message ->
                // Check if message belongs to current chat
                // For simplicity, just appending if we are in that chat
                // In real app, check conversation/partner ID
                _messages.value += message
                loadConversations()
            }
        }
    }
}
