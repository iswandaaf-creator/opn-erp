package com.openerp.app.data.local

import android.content.Context
import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import com.openerp.app.domain.model.User
import com.openerp.app.domain.model.UserRole
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map

val Context.dataStore: DataStore<Preferences> by preferencesDataStore(name = "session")

import javax.inject.Inject

class SessionManager @Inject constructor(private val context: Context) {
    
    companion object {
        private val USER_ID = stringPreferencesKey("user_id")
        private val USER_NAME = stringPreferencesKey("user_name")
        private val USER_EMAIL = stringPreferencesKey("user_email")
        private val USER_ROLE = stringPreferencesKey("user_role")
        private val USER_AVATAR = stringPreferencesKey("user_avatar")
    }

    suspend fun saveUser(user: User) {
        context.dataStore.edit { preferences ->
            preferences[USER_ID] = user.id
            preferences[USER_NAME] = user.name
            preferences[USER_EMAIL] = user.email
            preferences[USER_ROLE] = user.role.name
            user.avatar?.let { preferences[USER_AVATAR] = it }
        }
    }

    fun getUser(): Flow<User?> {
        return context.dataStore.data.map { preferences ->
            val id = preferences[USER_ID]
            val name = preferences[USER_NAME]
            val email = preferences[USER_EMAIL]
            val roleString = preferences[USER_ROLE]

            if (id != null && name != null && email != null && roleString != null) {
                User(
                    id = id,
                    name = name,
                    email = email,
                    role = UserRole.fromString(roleString),
                    avatar = preferences[USER_AVATAR]
                )
            } else {
                null
            }
        }
    }

    suspend fun clearSession() {
        context.dataStore.edit { preferences ->
            preferences.clear()
        }
    }
}
