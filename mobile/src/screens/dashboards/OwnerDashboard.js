import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card, Avatar, Surface, Divider } from 'react-native-paper';

export default function OwnerDashboard({ stats, navigation }) {
    return (
        <View style={styles.container}>
            {/* Title */}
            <Text variant="headlineSmall" style={styles.title}>
                🏢 Owner Command Center
            </Text>
            <Text style={styles.subtitle}>Real-time Financials & System Health</Text>

            {/* Stats Cards */}
            <View style={styles.statsRow}>
                <Card style={[styles.statCard, { backgroundColor: '#E3F2FD' }]}>
                    <Card.Content style={styles.statContent}>
                        <Avatar.Icon size={40} icon="cash" color="#1976D2" style={{ backgroundColor: '#BBDEFB' }} />
                        <Text variant="labelMedium" style={styles.statLabel}>Revenue</Text>
                        <Text variant="headlineSmall" style={[styles.statValue, { color: '#1976D2' }]}>
                            ${stats.revenue?.toLocaleString() || '0'}
                        </Text>
                    </Card.Content>
                </Card>

                <Card style={[styles.statCard, { backgroundColor: '#E8F5E9' }]}>
                    <Card.Content style={styles.statContent}>
                        <Avatar.Icon size={40} icon="trending-up" color="#388E3C" style={{ backgroundColor: '#C8E6C9' }} />
                        <Text variant="labelMedium" style={styles.statLabel}>Profit</Text>
                        <Text variant="headlineSmall" style={[styles.statValue, { color: '#388E3C' }]}>
                            ${Math.floor(stats.revenue * 0.3)?.toLocaleString() || '0'}
                        </Text>
                    </Card.Content>
                </Card>
            </View>

            <View style={styles.statsRow}>
                <Card style={[styles.statCard, { backgroundColor: '#F3E5F5' }]}>
                    <Card.Content style={styles.statContent}>
                        <Avatar.Icon size={40} icon="account-group" color="#7B1FA2" style={{ backgroundColor: '#E1BEE7' }} />
                        <Text variant="labelMedium" style={styles.statLabel}>Customers</Text>
                        <Text variant="headlineSmall" style={[styles.statValue, { color: '#7B1FA2' }]}>
                            {stats.orders || 0}
                        </Text>
                    </Card.Content>
                </Card>

                <Card style={[styles.statCard, { backgroundColor: '#FFF3E0' }]}>
                    <Card.Content style={styles.statContent}>
                        <Avatar.Icon size={40} icon="alert-circle" color="#E65100" style={{ backgroundColor: '#FFE0B2' }} />
                        <Text variant="labelMedium" style={styles.statLabel}>Alerts</Text>
                        <Text variant="headlineSmall" style={[styles.statValue, { color: '#E65100' }]}>
                            0
                        </Text>
                    </Card.Content>
                </Card>
            </View>

            {/* Management Actions */}
            <Text variant="titleMedium" style={styles.sectionTitle}>Management</Text>

            <Card style={styles.actionCard} onPress={() => navigation.navigate('SalesDashboard')}>
                <Card.Content style={styles.actionContent}>
                    <Avatar.Icon size={48} icon="chart-line" color="#1976D2" style={{ backgroundColor: '#E3F2FD' }} />
                    <View style={styles.actionText}>
                        <Text variant="titleMedium" style={styles.actionTitle}>Sales & Revenue</Text>
                        <Text variant="bodySmall" style={styles.actionSubtitle}>View all sales documents</Text>
                    </View>
                    <Avatar.Icon size={24} icon="chevron-right" color="#999" style={{ backgroundColor: 'transparent' }} />
                </Card.Content>
            </Card>

            <Card style={styles.actionCard} onPress={() => navigation.navigate('GenericList', { title: 'All Orders', endpoint: '/orders' })}>
                <Card.Content style={styles.actionContent}>
                    <Avatar.Icon size={48} icon="clipboard-list" color="#388E3C" style={{ backgroundColor: '#E8F5E9' }} />
                    <View style={styles.actionText}>
                        <Text variant="titleMedium" style={styles.actionTitle}>Order Management</Text>
                        <Text variant="bodySmall" style={styles.actionSubtitle}>Track all order status</Text>
                    </View>
                    <Avatar.Icon size={24} icon="chevron-right" color="#999" style={{ backgroundColor: 'transparent' }} />
                </Card.Content>
            </Card>

            <Card style={styles.actionCard} onPress={() => navigation.navigate('GenericList', { title: 'Invoices', endpoint: '/sales/invoices' })}>
                <Card.Content style={styles.actionContent}>
                    <Avatar.Icon size={48} icon="receipt" color="#7B1FA2" style={{ backgroundColor: '#F3E5F5' }} />
                    <View style={styles.actionText}>
                        <Text variant="titleMedium" style={styles.actionTitle}>Invoices & Payments</Text>
                        <Text variant="bodySmall" style={styles.actionSubtitle}>Financial transactions</Text>
                    </View>
                    <Avatar.Icon size={24} icon="chevron-right" color="#999" style={{ backgroundColor: 'transparent' }} />
                </Card.Content>
            </Card>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    title: {
        fontWeight: 'bold',
        color: '#333',
    },
    subtitle: {
        color: '#666',
        marginBottom: 20,
    },
    statsRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 12,
    },
    statCard: {
        flex: 1,
        borderRadius: 16,
    },
    statContent: {
        alignItems: 'center',
        paddingVertical: 16,
    },
    statLabel: {
        color: '#666',
        marginTop: 8,
    },
    statValue: {
        fontWeight: 'bold',
    },
    sectionTitle: {
        fontWeight: 'bold',
        marginTop: 16,
        marginBottom: 12,
        color: '#333',
    },
    actionCard: {
        marginBottom: 12,
        borderRadius: 12,
        backgroundColor: '#FFFFFF',
    },
    actionContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    actionText: {
        flex: 1,
        marginLeft: 12,
    },
    actionTitle: {
        fontWeight: '600',
        color: '#333',
    },
    actionSubtitle: {
        color: '#666',
    },
});
