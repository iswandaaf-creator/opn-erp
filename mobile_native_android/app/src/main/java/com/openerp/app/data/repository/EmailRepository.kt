package com.openerp.app.data.repository

import com.openerp.app.data.remote.ApiService
import com.openerp.app.domain.model.email.Email
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class EmailRepository @Inject constructor(
    private val apiService: ApiService
) {
    private val _emailCache = mutableMapOf<String, Email>()

    suspend fun getEmails(folder: String): List<Email> {
        return withContext(Dispatchers.IO) {
            try {
                val emails = apiService.getEmails(folder)
                emails.forEach { _emailCache[it.id] = it }
                emails
            } catch (e: Exception) {
                emptyList()
            }
        }
    }
    
    fun getEmailById(id: String): Email? {
        return _emailCache[id]
    }

    suspend fun sendEmail(to: String, subject: String, body: String): Email? {
        return withContext(Dispatchers.IO) {
            try {
                apiService.sendEmail(mapOf(
                    "to" to to,
                    "subject" to subject,
                    "body" to body
                ))
            } catch (e: Exception) {
                null
            }
        }
    }
}
