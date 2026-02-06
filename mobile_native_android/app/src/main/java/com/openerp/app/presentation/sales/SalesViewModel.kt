package com.openerp.app.presentation.sales

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.openerp.app.data.repository.SalesRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class SalesViewModel @Inject constructor(
    private val salesRepository: SalesRepository
) : ViewModel() {

    private val _quotations = MutableStateFlow<List<Map<String, Any>>>(emptyList())
    val quotations: StateFlow<List<Map<String, Any>>> = _quotations.asStateFlow()

    private val _isLoading = MutableStateFlow(false)
    val isLoading: StateFlow<Boolean> = _isLoading.asStateFlow()

    init {
        loadQuotations()
    }

    fun loadQuotations() {
        viewModelScope.launch {
            _isLoading.value = true
            _quotations.value = salesRepository.getQuotations()
            _isLoading.value = false
        }
    }
}
