package com.openerp.app.data.repository

import com.openerp.app.data.remote.ApiService
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class InventoryRepository @Inject constructor(
    private val apiService: ApiService
) {
    // For MVP, if backend doesn't have exact endpoint, return mock or try a generic one
    // Ideally backend should have GET /inventory/products
    suspend fun getProducts(): List<Map<String, Any>> {
        return withContext(Dispatchers.IO) {
            try {
                // apiService.getProducts() 
                // Using empty list or mock for now as ApiService doesn't have it yet
                emptyList() 
            } catch (e: Exception) {
                e.printStackTrace()
                emptyList()
            }
        }
    }
}
