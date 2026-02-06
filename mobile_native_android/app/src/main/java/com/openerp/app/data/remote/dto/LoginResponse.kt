package com.openerp.app.data.remote.dto

import com.google.gson.annotations.SerializedName
import com.openerp.app.domain.model.User

data class LoginResponse(
    @SerializedName("access_token")
    val accessToken: String,
    
    @SerializedName("user")
    val user: User
)
