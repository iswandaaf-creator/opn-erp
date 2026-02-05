import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card, Avatar, ProgressBar } from 'react-native-paper';

export default function ManagerDashboard({ stats, navigation }) {
    return (
        <View style={styles.container}>
            {/* Title */}
            <Text variant="headlineSmall" style={styles.title}>
                📊 Manager Dashboard
            </Text>
            <Text style={styles.subtitle}>Team Performance & Operations</Text>

            {/* Stats Cards */}
            <View style={styles.statsRow}>
                <Card style={[styles.statCard, { backgroundColor: '#E8F5E9' }]}>
                    <Card.Content style={styles.statContent}>
                        <Avatar.Icon size={40} icon="account-group" color="#388E3C" style={{ backgroundColor: '#C8E6C9' }} />
                        <Text variant="labelMedium" style={styles.statLabel}>Team Orders</Text>
                        <Text variant="headlineSmall" style={[styles.statValue, { color: '#388E3C' }]}>
                            {stats.orders || 0}
                        </Text>
                    </Card.Content>
                </Card>

                <Card style={[styles.statCard, { backgroundColor: '#E3F2FD' }]}>
                    <Card.Content style={styles.statContent}>
                        <Avatar.Icon size={40} icon="currency-usd" color="#1976D2" style={{ backgroundColor: '#BBDEFB' }} />
                        <Text variant="labelMedium" style={styles.statLabel}>Team Revenue</Text>
                        <Text variant="headlineSmall" style={[styles.statValue, { color: '#1976D2' }]}>
                            ${stats.revenue?.toLocaleString() || '0'}
                        </Text>
                    </Card.Content>
                </Card>
            </View>

            {/* Team Performance */}
            <Text variant="titleMedium" style={styles.sectionTitle}>Team Performance</Text>

            <Card style={styles.performanceCard}>
                <Card.Content>
                    <View style={styles.performanceRow}>
                        <Text style={styles.performanceLabel}>Daily Target</Text>
                        <Text style={styles.performanceValue}>75%</Text>
                    </View>
                    <ProgressBar progress={0.75} color="#388E3C" style={styles.progressBar} />

                    <View style={[styles.performanceRow, { marginTop: 16 }]}>
                        <Text style={styles.performanceLabel}>Weekly Goal</Text>
                        <Text style={styles.performanceValue}>60%</Text>
                    </View>
                    <ProgressBar progress={0.60} color="#1976D2" style={styles.progressBar} />
                </Card.Content>
            </Card>

            {/* Quick Actions */}
            <Text variant="titleMedium" style={styles.sectionTitle}>Manage</Text>

            <Card style={styles.actionCard} onPress={() => navigation.navigate('SalesDashboard')}>
                <Card.Content style={styles.actionContent}>
                    <Avatar.Icon size={48} icon="chart-box" color="#1976D2" style={{ backgroundColor: '#E3F2FD' }} />
                    <View style={styles.actionText}>
                        <Text variant="titleMedium" style={styles.actionTitle}>Sales Reports</Text>
                        <Text variant="bodySmall" style={styles.actionSubtitle}>View team sales performance</Text>
                    </View>
                    <Avatar.Icon size={24} icon="chevron-right" color="#999" style={{ backgroundColor: 'transparent' }} />
                </Card.Content>
            </Card>

            <Card style={styles.actionCard} onPress={() => navigation.navigate('GenericList', { title: 'Orders', endpoint: '/orders' })}>
                <Card.Content style={styles.actionContent}>
                    <Avatar.Icon size={48} icon="clipboard-check" color="#388E3C" style={{ backgroundColor: '#E8F5E9' }} />
                    <View style={styles.actionText}>
                        <Text variant="titleMedium" style={styles.actionTitle}>Approve Orders</Text>
                        <Text variant="bodySmall" style={styles.actionSubtitle}>Review pending approvals</Text>
                    </View>
                    <Avatar.Icon size={24} icon="chevron-right" color="#999" style={{ backgroundColor: 'transparent' }} />
                </Card.Content>
            </Card>

            <Card style={styles.actionCard} onPress={() => navigation.navigate('GenericList', { title: 'Quotations', endpoint: '/sales/quotations' })}>
                <Card.Content style={styles.actionContent}>
                    <Avatar.Icon size={48} icon="file-document-edit" color="#F57C00" style={{ backgroundColor: '#FFF3E0' }} />
                    <View style={styles.actionText}>
                        <Text variant="titleMedium" style={styles.actionTitle}>Quotations</Text>
                        <Text variant="bodySmall" style={styles.actionSubtitle}>Manage team quotations</Text>
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
    performanceCard: {
        borderRadius: 12,
        backgroundColor: '#FFFFFF',
        marginBottom: 12,
    },
    performanceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    performanceLabel: {
        color: '#666',
    },
    performanceValue: {
        fontWeight: 'bold',
        color: '#333',
    },
    progressBar: {
        height: 8,
        borderRadius: 4,
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
