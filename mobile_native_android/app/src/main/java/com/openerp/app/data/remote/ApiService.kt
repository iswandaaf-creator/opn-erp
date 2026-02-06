package com.openerp.app.data.remote

import com.openerp.app.domain.model.chat.Conversation
import com.openerp.app.domain.model.chat.Message
import com.openerp.app.domain.model.email.Email
import com.openerp.app.domain.model.User
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.Path
import retrofit2.http.Query

interface ApiService {
    @POST("auth/login")
    suspend fun login(@Body credentials: Map<String, String>): com.openerp.app.data.remote.dto.LoginResponse

    @GET("chat/conversations")
    suspend fun getConversations(): List<Conversation>

    @GET("chat/messages/{partnerId}")
    suspend fun getMessages(@Path("partnerId") partnerId: String): List<Message>

    @POST("chat/messages")
    suspend fun sendMessage(@Body message: Map<String, String>): Message

    @GET("emails/{folder}")
    suspend fun getEmails(@Path("folder") folder: String): List<Email>

    @POST("emails")
    suspend fun sendEmail(@Body email: Map<String, Any>): Email

    @GET("sales/quotations")
    suspend fun getQuotations(): List<Map<String, Any>> // Using Map for MVP, ideally strict DTO
}
