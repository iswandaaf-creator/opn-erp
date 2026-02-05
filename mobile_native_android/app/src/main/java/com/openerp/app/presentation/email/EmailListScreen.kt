package com.openerp.app.presentation.email

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import com.openerp.app.data.local.MockEmails
import com.openerp.app.domain.model.email.Email
import com.openerp.app.domain.model.email.EmailFolder
import com.openerp.app.presentation.theme.*
import java.text.SimpleDateFormat
import java.util.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun EmailListScreen(
    onBackClick: () -> Unit,
    onEmailClick: (String) -> Unit,
    onComposeClick: () -> Unit
) {
    var selectedFolder by remember { mutableStateOf(EmailFolder.INBOX) }
    var emails by remember { mutableStateOf(MockEmails.getEmails(selectedFolder)) }
    
    LaunchedEffect(selectedFolder) {
        emails = MockEmails.getEmails(selectedFolder)
    }
    
    Scaffold(
        topBar = {
            CenterAlignedTopAppBar(
                title = { Text("Email", fontWeight = FontWeight.Bold) },
                navigationIcon = {
                    IconButton(onClick = onBackClick) {
                        Icon(Icons.Default.ArrowBack, "Back")
                    }
                },
                actions = {
                    IconButton(onClick = {}) {
                        Icon(Icons.Default.Search, "Search")
                    }
                },
                colors = TopAppBarDefaults.centerAlignedTopAppBarColors(
                    containerColor = Primary,
                    titleContentColor = Color.White,
                    navigationIconContentColor = Color.White,
                    actionIconContentColor = Color.White
                )
            )
        },
        floatingActionButton = {
            FloatingActionButton(
                onClick = onComposeClick,
                containerColor = Primary
            ) {
                Icon(Icons.Default.Edit, "Compose", tint = Color.White)
            }
        }
    ) { paddingValues ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .background(Background)
                .padding(paddingValues)
        ) {
            // Folder tabs
            ScrollableTabRow(
                selectedTabIndex = EmailFolder.values().indexOf(selectedFolder),
                containerColor = Color.White,
                contentColor = Primary,
                edgePadding = 0.dp
            ) {
                EmailFolder.values().forEach { folder ->
                    val unreadCount = MockEmails.getUnreadCount(folder)
                    Tab(
                        selected = selectedFolder == folder,
                        onClick = { selectedFolder = folder },
                        text = {
                            Row(
                                horizontalArrangement = Arrangement.spacedBy(4.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Text(folder.name.lowercase().capitalize())
                                if (unreadCount > 0 && folder != EmailFolder.SENT) {
                                    Box(
                                        modifier = Modifier
                                            .size(20.dp)
                                            .clip(CircleShape)
                                            .background(Error),
                                        contentAlignment = Alignment.Center
                                    ) {
                                        Text(
                                            unreadCount.toString(),
                                            style = MaterialTheme.typography.labelSmall,
                                            color = Color.White
                                        )
                                    }
                                }
                            }
                        }
                    )
                }
            }
            
            // Email list
            if (emails.isEmpty()) {
                Box(
                    modifier = Modifier.fillMaxSize(),
                    contentAlignment = Alignment.Center
                ) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Icon(
                            Icons.Default.Email,
                            contentDescription = null,
                            modifier = Modifier.size(64.dp),
                            tint = TextSecondary.copy(alpha = 0.3f)
                        )
                        Spacer(modifier = Modifier.height(16.dp))
                        Text(
                            "No emails in ${selectedFolder.name.lowercase()}",
                            style = MaterialTheme.typography.bodyLarge,
                            color = TextSecondary
                        )
                    }
                }
            } else {
                LazyColumn {
                    items(emails) { email ->
                        EmailItem(
                            email = email,
                            onClick = { onEmailClick(email.id) }
                        )
                        Divider(color = TextSecondary.copy(alpha = 0.1f))
                    }
                }
            }
        }
    }
}

@Composable
fun EmailItem(
    email: Email,
    onClick: () -> Unit
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clickable(onClick = onClick)
            .background(if (!email.isRead) Primary.copy(alpha = 0.05f) else Color.White)
            .padding(16.dp),
        verticalAlignment = Alignment.Top,
        horizontalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        // Avatar
        Box(
            modifier = Modifier
                .size(48.dp)
                .clip(CircleShape)
                .background(Secondary.copy(alpha = 0.2f)),
            contentAlignment = Alignment.Center
        ) {
            Text(
                email.from.name.first().toString(),
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.Bold,
                color = Secondary
            )
        }
        
        // Content
        Column(
            modifier = Modifier.weight(1f),
            verticalArrangement = Arrangement.spacedBy(4.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    email.from.name,
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = if (!email.isRead) FontWeight.Bold else FontWeight.Normal,
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis,
                    modifier = Modifier.weight(1f)
                )
                Text(
                    formatEmailTime(email.timestamp),
                    style = MaterialTheme.typography.bodySmall,
                    color = TextSecondary
                )
            }
            
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    email.subject,
                    style = MaterialTheme.typography.bodyMedium,
                    fontWeight = if (!email.isRead) FontWeight.SemiBold else FontWeight.Normal,
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis,
                    modifier = Modifier.weight(1f)
                )
                
                if (email.isStarred) {
                    Icon(
                        Icons.Default.Star,
                        contentDescription = "Starred",
                        tint = Warning,
                        modifier = Modifier.size(16.dp)
                    )
                }
                
                if (email.attachments.isNotEmpty()) {
                    Icon(
                        Icons.Default.Settings,
                        contentDescription = "Has attachments",
                        tint = TextSecondary,
                        modifier = Modifier.size(16.dp)
                    )
                }
            }
            
            Text(
                email.body.replace("\n", " "),
                style = MaterialTheme.typography.bodySmall,
                color = TextSecondary,
                maxLines = 2,
                overflow = TextOverflow.Ellipsis
            )
        }
    }
}

private fun formatEmailTime(timestamp: Long): String {
    val now = System.currentTimeMillis()
    val diff = now - timestamp
    
    return when {
        diff < 3600000 -> "${diff / 60000}m"
        diff < 86400000 -> "${diff / 3600000}h"
        diff < 172800000 -> "Yesterday"
        else -> SimpleDateFormat("MMM dd", Locale.getDefault()).format(Date(timestamp))
    }
}
