package com.openerp.app.data.repository

import com.openerp.app.data.local.SessionManager
import com.openerp.app.data.remote.ApiService
import com.openerp.app.data.remote.SocketManager
import com.openerp.app.domain.model.User
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class AuthRepository @Inject constructor(
    private val apiService: ApiService,
    private val sessionManager: SessionManager,
    private val socketManager: SocketManager
) {
    suspend fun login(email: String, password: String): User? {
        return withContext(Dispatchers.IO) {
            try {
                val user = apiService.login(mapOf("email" to email, "password" to password))
                sessionManager.saveUser(user)
                socketManager.connect(user.id)
                user
            } catch (e: Exception) {
                e.printStackTrace()
                null
            }
        }
    }

    fun logout() {
        sessionManager.clearSession()
        socketManager.disconnect()
    }
}
