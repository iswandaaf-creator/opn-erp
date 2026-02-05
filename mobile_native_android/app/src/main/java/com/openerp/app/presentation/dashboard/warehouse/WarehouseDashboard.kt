package com.openerp.app.presentation.dashboard.warehouse

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.openerp.app.domain.model.User
import com.openerp.app.presentation.theme.*

val WarehouseColor = Color(0xFF795548)
val WarehouseColorLight = Color(0xFFA1887F)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun WarehouseDashboard(user: User, onLogout: () -> Unit) {
    Scaffold(
        topBar = {
            Box(Modifier.fillMaxWidth().background(brush = Brush.horizontalGradient(listOf(WarehouseColor, WarehouseColorLight)))) {
                CenterAlignedTopAppBar(
                    title = {
                        Column(horizontalAlignment = Alignment.CenterHorizontally) {
                            Text("Warehouse Dashboard", fontWeight = FontWeight.Bold, color = Color.White)
                            Text("Welcome, ${user.name}", style = MaterialTheme.typography.bodySmall, color = Color.White.copy(alpha = 0.9f))
                        }
                    },
                    colors = TopAppBarDefaults.centerAlignedTopAppBarColors(containerColor = Color.Transparent),
                    actions = { IconButton(onClick = onLogout) { Icon(Icons.Default.ExitToApp, "Logout", tint = Color.White) } }
                )
            }
        }
    ) { paddingValues ->
        LazyColumn(
            modifier = Modifier.fillMaxSize().background(Background).padding(paddingValues).padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            item { RoleBadge(user, WarehouseColor) }
            item { Text("Inventory Overview", style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Bold) }
            item {
                Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                    StatCard("Total Items", "1,248", Icons.Default.Home, WarehouseColor, null, Modifier.weight(1f))
                    StatCard("Low Stock", "23", Icons.Default.Warning, Error, null, Modifier.weight(1f))
                }
            }
            item {
                Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                    StatCard("Incoming", "45", Icons.Default.Add, Success, null, Modifier.weight(1f))
                    StatCard("Outgoing", "32", Icons.Default.Clear, Warning, null, Modifier.weight(1f))
                }
            }
            item { Text("Recent Activity", style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Bold) }
            item { InventoryCard("Rice Premium 5kg", "Stock: 150", "+20 units", true) }
            item { InventoryCard("Cooking Oil 2L", "Stock: 45", "-15 units", false) }
            item { InventoryCard("Sugar 1kg", "Stock: 12", "LOW STOCK", false) }
            item { Text("Quick Actions", style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Bold) }
            item { ActionCard("Stock Check", Icons.Default.Search, WarehouseColor) {} }
            item { ActionCard("Receive Goods", Icons.Default.Add, Success) {} }
            item { ActionCard("Issue Goods", Icons.Default.Clear, Warning) {} }
            item { ActionCard("Chat with Team", Icons.Default.Email, Secondary) {} }
        }
    }
}

@Composable
private fun InventoryCard(item: String, stock: String, change: String, isIncrease: Boolean) {
    Card(modifier = Modifier.fillMaxWidth().shadow(4.dp, RoundedCornerShape(16.dp)), shape = RoundedCornerShape(16.dp)) {
        Row(
            modifier = Modifier.fillMaxWidth().padding(16.dp),
            horizontalArrangement = Arrangement.SpaceBetween, verticalAlignment = Alignment.CenterVertically
        ) {
            Row(horizontalArrangement = Arrangement.spacedBy(12.dp), verticalAlignment = Alignment.CenterVertically) {
                Box(
                    Modifier.size(40.dp).clip(CircleShape).background(WarehouseColor.copy(0.2f)),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(Icons.Default.Home, null, tint = WarehouseColor, modifier = Modifier.size(20.dp))
                }
                Column {
                    Text(item, style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.SemiBold)
                    Text(stock, style = MaterialTheme.typography.bodySmall, color = TextSecondary)
                }
            }
            Card(
                colors = CardDefaults.cardColors(
                    containerColor = if (change == "LOW STOCK") Error else if (isIncrease) Success else Warning
                ),
                shape = RoundedCornerShape(8.dp)
            ) {
                Text(change, modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp), style = MaterialTheme.typography.labelSmall, fontWeight = FontWeight.Bold, color = Color.White)
            }
        }
    }
}

@Composable
private fun RoleBadge(user: User, color: Color) {
    Card(modifier = Modifier.fillMaxWidth().shadow(4.dp, RoundedCornerShape(16.dp)), shape = RoundedCornerShape(16.dp)) {
        Row(
            modifier = Modifier.fillMaxWidth().background(brush = Brush.horizontalGradient(listOf(color.copy(0.1f), color.copy(0.05f)))).padding(16.dp),
            horizontalArrangement = Arrangement.SpaceBetween, verticalAlignment = Alignment.CenterVertically
        ) {
            Row(horizontalArrangement = Arrangement.spacedBy(12.dp), verticalAlignment = Alignment.CenterVertically) {
                Box(Modifier.size(48.dp).clip(CircleShape).background(color.copy(0.2f)), contentAlignment = Alignment.Center) {
                    Text(user.name.first().toString(), style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Bold, color = color)
                }
                Column {
                    Text(user.name, style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
                    Text(user.email, style = MaterialTheme.typography.bodySmall, color = TextSecondary)
                }
            }
            Card(colors = CardDefaults.cardColors(containerColor = color), shape = RoundedCornerShape(8.dp)) {
                Text(user.role.displayName, modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp), style = MaterialTheme.typography.labelMedium, fontWeight = FontWeight.Bold, color = Color.White)
            }
        }
    }
}

@Composable
private fun StatCard(title: String, value: String, icon: androidx.compose.ui.graphics.vector.ImageVector, color: Color, trend: String?, modifier: Modifier = Modifier) {
    Card(modifier = modifier.shadow(6.dp, RoundedCornerShape(20.dp)), shape = RoundedCornerShape(20.dp)) {
        Box(Modifier.fillMaxWidth().background(brush = Brush.verticalGradient(listOf(color.copy(0.08f), color.copy(0.02f))))) {
            Column(Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
                Box(Modifier.size(48.dp).clip(CircleShape).background(color.copy(0.15f)), contentAlignment = Alignment.Center) {
                    Icon(icon, null, tint = color, modifier = Modifier.size(24.dp))
                }
                Text(value, style = MaterialTheme.typography.headlineMedium, fontWeight = FontWeight.Bold)
                Text(title, style = MaterialTheme.typography.bodySmall, color = TextSecondary)
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun ActionCard(text: String, icon: androidx.compose.ui.graphics.vector.ImageVector, color: Color, onClick: () -> Unit) {
    Card(onClick = onClick, modifier = Modifier.fillMaxWidth().shadow(4.dp, RoundedCornerShape(16.dp)), shape = RoundedCornerShape(16.dp)) {
        Row(
            modifier = Modifier.fillMaxWidth().background(brush = Brush.horizontalGradient(listOf(color.copy(0.1f), color.copy(0.05f)))).padding(20.dp),
            horizontalArrangement = Arrangement.SpaceBetween, verticalAlignment = Alignment.CenterVertically
        ) {
            Row(horizontalArrangement = Arrangement.spacedBy(12.dp), verticalAlignment = Alignment.CenterVertically) {
                Icon(icon, null, tint = color)
                Text(text, style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.SemiBold)
            }
            Icon(Icons.Default.ArrowForward, null, tint = color)
        }
    }
}
