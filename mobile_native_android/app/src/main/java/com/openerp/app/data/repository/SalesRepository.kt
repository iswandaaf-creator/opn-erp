package com.openerp.app.data.repository

import com.openerp.app.data.remote.ApiService
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class SalesRepository @Inject constructor(
    private val apiService: ApiService
) {
    suspend fun getQuotations(): List<Map<String, Any>> {
        return withContext(Dispatchers.IO) {
            try {
                apiService.getQuotations()
            } catch (e: Exception) {
                e.printStackTrace()
                emptyList()
            }
        }
    }
}
