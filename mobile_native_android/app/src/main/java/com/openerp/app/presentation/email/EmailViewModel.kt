package com.openerp.app.presentation.email

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.openerp.app.data.local.SessionManager
import com.openerp.app.data.repository.EmailRepository
import com.openerp.app.domain.model.email.Email
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class EmailViewModel @Inject constructor(
    private val emailRepository: EmailRepository,
    private val sessionManager: SessionManager
) : ViewModel() {

    private val _emails = MutableStateFlow<List<Email>>(emptyList())
    val emails: StateFlow<List<Email>> = _emails.asStateFlow()

    private val _currentFolder = MutableStateFlow("inbox")
    val currentFolder: StateFlow<String> = _currentFolder.asStateFlow()

    init {
        loadEmails("inbox")
    }

    fun loadEmails(folder: String) {
        _currentFolder.value = folder
        viewModelScope.launch {
            _emails.value = emailRepository.getEmails(folder)
        }
    }

    fun sendEmail(to: String, subject: String, body: String) {
        viewModelScope.launch {
            emailRepository.sendEmail(to, subject, body)
            // If in Sent folder, reload
            if (_currentFolder.value == "sent") {
                loadEmails("sent")
            }
        }
    }

    fun getEmailById(id: String): Email? {
        return emailRepository.getEmailById(id)
    }
}
