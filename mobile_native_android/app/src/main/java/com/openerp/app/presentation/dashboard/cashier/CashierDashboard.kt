package com.openerp.app.presentation.dashboard.cashier

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

val CashierColor = Color(0xFF4CAF50)
val CashierColorLight = Color(0xFF81C784)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CashierDashboard(user: User, onLogout: () -> Unit, onChatClick: () -> Unit = {}, onEmailClick: () -> Unit = {}) {
    Scaffold(
        topBar = {
            Box(Modifier.fillMaxWidth().background(brush = Brush.horizontalGradient(listOf(CashierColor, CashierColorLight)))) {
                CenterAlignedTopAppBar(
                    title = {
                        Column(horizontalAlignment = Alignment.CenterHorizontally) {
                            Text("Cashier Dashboard", fontWeight = FontWeight.Bold, color = Color.White)
                            Text("Welcome, ${user.name}", style = MaterialTheme.typography.bodySmall, color = Color.White.copy(alpha = 0.9f))
                        }
                    },
                    colors = TopAppBarDefaults.centerAlignedTopAppBarColors(containerColor = Color.Transparent),
                    actions = { IconButton(onClick = onLogout) { Icon(Icons.Default.ExitToApp, "Logout", tint = Color.White) } }
                )
            }
        },
        floatingActionButton = {
            ExtendedFloatingActionButton(
                onClick = {},
                containerColor = CashierColor,
                contentColor = Color.White
            ) {
                Icon(Icons.Default.Add, null)
                Spacer(Modifier.width(8.dp))
                Text("New Sale", fontWeight = FontWeight.Bold)
            }
        }
    ) { paddingValues ->
        LazyColumn(
            modifier = Modifier.fillMaxSize().background(Background).padding(paddingValues).padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            item { RoleBadge(user, CashierColor) }
            item { Text("Today's Sales", style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Bold) }
            item {
                Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                    StatCard("Sales", "Rp 2.8M", Icons.Default.ShoppingCart, CashierColor, "+18%", Modifier.weight(1f))
                    StatCard("Orders", "47", Icons.Default.List, Primary, "+5", Modifier.weight(1f))
                }
            }
            item {
                Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                    StatCard("Cash", "Rp 1.2M", Icons.Default.Star, Warning, null, Modifier.weight(1f))
                    StatCard("Digital", "Rp 1.6M", Icons.Default.Phone, Secondary, null, Modifier.weight(1f))
                }
            }
            item { Text("Quick Actions", style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Bold) }
            item { ActionCard("View Orders", Icons.Default.List, Primary) {} }
            item { ActionCard("Daily Report", Icons.Default.DateRange, CashierColor) {} }
            item { ActionCard("Chat Support", Icons.Default.Email, Secondary) { onChatClick() } }
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
                Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                    Text(title, style = MaterialTheme.typography.bodySmall, color = TextSecondary)
                    if (trend != null) Text(trend, style = MaterialTheme.typography.bodySmall, color = Success, fontWeight = FontWeight.SemiBold)
                }
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
