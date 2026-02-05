package com.openerp.app.presentation.email

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.openerp.app.data.local.MockEmails
import com.openerp.app.data.local.MockUsers
import com.openerp.app.data.local.SessionManager
import com.openerp.app.presentation.theme.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ComposeEmailScreen(
    onBackClick: () -> Unit,
    onSendClick: () -> Unit = {}
) {
    val context = LocalContext.current
    val sessionManager = remember { SessionManager(context) }
    var currentUser by remember { mutableStateOf<com.openerp.app.domain.model.User?>(null) }
    
    var selectedRecipient by remember { mutableStateOf("") }
    var subject by remember { mutableStateOf("") }
    var body by remember { mutableStateOf("") }
    var showRecipientMenu by remember { mutableStateOf(false) }
    
    val allUsers = MockUsers.getAllUsers()
    
    LaunchedEffect(Unit) {
        sessionManager.getUser().collect { user ->
            currentUser = user
        }
    }
    
    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Compose Email", fontWeight = FontWeight.Bold) },
                navigationIcon = {
                    IconButton(onClick = onBackClick) {
                        Icon(Icons.Default.Close, "Close")
                    }
                },
                actions = {
                    IconButton(onClick = {
                        if (currentUser != null && selectedRecipient.isNotEmpty()) {
                            val recipient = allUsers.find { it.email == selectedRecipient }
                            if (recipient != null) {
                                MockEmails.sendEmail(
                                    to = listOf(recipient),
                                    subject = subject.ifEmpty { "(No Subject)" },
                                    body = body,
                                    currentUser = currentUser!!
                                )
                                onSendClick()
                            }
                        }
                    }) {
                        Icon(Icons.Default.Send, "Send", tint = Color.White)
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = Primary,
                    titleContentColor = Color.White,
                    navigationIconContentColor = Color.White,
                    actionIconContentColor = Color.White
                )
            )
        }
    ) { paddingValues ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .verticalScroll(rememberScrollState())
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // To field
            ExposedDropdownMenuBox(
                expanded = showRecipientMenu,
                onExpandedChange = { showRecipientMenu = it }
            ) {
                OutlinedTextField(
                    value = selectedRecipient,
                    onValueChange = { selectedRecipient = it },
                    modifier = Modifier
                        .fillMaxWidth()
                        .menuAnchor(),
                    label = { Text("To") },
                    trailingIcon = {
                        ExposedDropdownMenuDefaults.TrailingIcon(expanded = showRecipientMenu)
                    },
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = Primary,
                        focusedLabelColor = Primary
                    )
                )
                ExposedDropdownMenu(
                    expanded = showRecipientMenu,
                    onDismissRequest = { showRecipientMenu = false }
                ) {
                    allUsers.forEach { user ->
                        DropdownMenuItem(
                            text = {
                                Column {
                                    Text(user.name, fontWeight = FontWeight.SemiBold)
                                    Text(
                                        user.email,
                                        style = MaterialTheme.typography.bodySmall,
                                        color = TextSecondary
                                    )
                                }
                            },
                            onClick = {
                                selectedRecipient = user.email
                                showRecipientMenu = false
                            }
                        )
                    }
                }
            }
            
            // Subject field
            OutlinedTextField(
                value = subject,
                onValueChange = { subject = it },
                modifier = Modifier.fillMaxWidth(),
                label = { Text("Subject") },
                colors = OutlinedTextFieldDefaults.colors(
                    focusedBorderColor = Primary,
                    focusedLabelColor = Primary
                )
            )
            
            // Body field
            OutlinedTextField(
                value = body,
                onValueChange = { body = it },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(300.dp),
                label = { Text("Message") },
                maxLines = 15,
                colors = OutlinedTextFieldDefaults.colors(
                    focusedBorderColor = Primary,
                    focusedLabelColor = Primary
                )
            )
            
            // Attachment button
            OutlinedButton(
                onClick = {},
                modifier = Modifier.fillMaxWidth()
            ) {
                Icon(Icons.Default.Add, null, modifier = Modifier.size(18.dp))
                Spacer(modifier = Modifier.width(8.dp))
                Text("Add Attachment")
            }
            
            // Save as draft button
            OutlinedButton(
                onClick = {
                    if (currentUser != null) {
                        val recipient = if (selectedRecipient.isNotEmpty()) {
                            allUsers.find { it.email == selectedRecipient }?.let { listOf(it) }
                        } else {
                            emptyList()
                        }
                        if (recipient != null) {
                            MockEmails.saveDraft(
                                to = recipient,
                                subject = subject,
                                body = body,
                                currentUser = currentUser!!
                            )
                            onBackClick()
                        }
                    }
                },
                modifier = Modifier.fillMaxWidth()
            ) {
                Icon(Icons.Default.Edit, null, modifier = Modifier.size(18.dp))
                Spacer(modifier = Modifier.width(8.dp))
                Text("Save as Draft")
            }
        }
    }
}
