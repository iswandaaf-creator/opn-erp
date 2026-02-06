package com.openerp.app.presentation.chat

import android.net.Uri
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import com.openerp.app.presentation.theme.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun FilePickerButton(
    onFileSelected: (Uri) -> Unit
) {
    var showBottomSheet by remember { mutableStateOf(false) }
    
    // Image picker
    val imagePickerLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.GetContent()
    ) { uri: Uri? ->
        uri?.let { onFileSelected(it) }
    }
    
    // Video picker
    val videoPickerLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.GetContent()
    ) { uri: Uri? ->
        uri?.let { onFileSelected(it) }
    }
    
    // Document picker
    val documentPickerLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.GetContent()
    ) { uri: Uri? ->
        uri?.let { onFileSelected(it) }
    }
    
    IconButton(onClick = { showBottomSheet = true }) {
        Icon(
            Icons.Default.Add,
            contentDescription = "Attach file",
            tint = Primary
        )
    }
    
    if (showBottomSheet) {
        ModalBottomSheet(
            onDismissRequest = { showBottomSheet = false }
        ) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(16.dp),
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                Text(
                    "Share File",
                    style = MaterialTheme.typography.titleLarge,
                    modifier = Modifier.padding(bottom = 8.dp)
                )
                
                // Image option - Using Person icon and standard Green color
                FileTypeOption(
                    icon = Icons.Default.Person,
                    title = "Photos",
                    subtitle = "Share images from gallery",
                    color = Color.Green
                ) {
                    showBottomSheet = false
                    imagePickerLauncher.launch("image/*")
                }
                
                // Video option - Using PlayArrow icon and standard Blue color
                FileTypeOption(
                    icon = Icons.Default.PlayArrow,
                    title = "Videos",
                    subtitle = "Share video files",
                    color = Color.Blue
                ) {
                    showBottomSheet = false
                    videoPickerLauncher.launch("video/*")
                }
                
                // Document option - Using List icon and Color(0xFFFF9800) (Orange)
                FileTypeOption(
                    icon = Icons.Default.List,
                    title = "Documents",
                    subtitle = "PDF, Word, Excel, etc.",
                    color = Color(0xFFFF9800)
                ) {
                    showBottomSheet = false
                    documentPickerLauncher.launch("*/*")
                }
                
                Spacer(modifier = Modifier.height(16.dp))
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun FileTypeOption(
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    title: String,
    subtitle: String,
    color: Color,
    onClick: () -> Unit
) {
    Card(
        onClick = onClick,
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(
            containerColor = Surface
        )
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            Box(
                modifier = Modifier
                    .size(48.dp)
                    .background(color.copy(alpha = 0.1f), RoundedCornerShape(12.dp)),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    icon,
                    contentDescription = null,
                    tint = color,
                    modifier = Modifier.size(24.dp)
                )
            }
            
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    title,
                    style = MaterialTheme.typography.titleMedium,
                    color = TextPrimary
                )
                Text(
                    subtitle,
                    style = MaterialTheme.typography.bodySmall,
                    color = TextSecondary
                )
            }
            
            Icon(
                Icons.Default.ArrowForward,
                contentDescription = null,
                tint = TextSecondary
            )
        }
    }
}
