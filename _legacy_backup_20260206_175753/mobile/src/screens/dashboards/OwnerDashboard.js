import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card, Button } from '@ui-kitten/components';

const StatCard = ({ title, value, icon, status }) => (
    <Card style={styles.statCard} status={status}>
        <View style={styles.statContent}>
            <Text category='c1' appearance='hint'>{title}</Text>
            <Text category='h4' style={styles.statValue}>{value}</Text>
        </View>
    </Card>
);

const ActionCard = ({ title, subtitle, icon, onPress }) => (
    <Card style={styles.actionCard} onPress={onPress}>
        <View style={styles.actionContent}>
            <View style={styles.iconContainer}>
                <Text category='h5'>{icon}</Text>
            </View>
            <View style={styles.actionText}>
                <Text category='s1'>{title}</Text>
                <Text category='c1' appearance='hint'>{subtitle}</Text>
            </View>
            <Text appearance='hint'>→</Text>
        </View>
    </Card>
);

export default function OwnerDashboard({ stats, navigation }) {
    return (
        <View style={styles.container}>
            <Text category='h5' style={styles.title}>🏢 Owner Command Center</Text>
            <Text appearance='hint' style={styles.subtitle}>Real-time Financials & System Health</Text>

            {/* Stats Grid */}
            <View style={styles.statsRow}>
                <StatCard
                    title="Revenue"
                    value={`$${stats.revenue?.toLocaleString() || '0'}`}
                    status="primary"
                />
                <StatCard
                    title="Profit"
                    value={`$${Math.floor(stats.revenue * 0.3)?.toLocaleString() || '0'}`}
                    status="success"
                />
            </View>

            <View style={styles.statsRow}>
                <StatCard
                    title="Orders"
                    value={stats.orders || 0}
                    status="info"
                />
                <StatCard
                    title="Alerts"
                    value="0"
                    status="warning"
                />
            </View>

            {/* Management Actions */}
            <Text category='h6' style={styles.sectionTitle}>Management</Text>

            <ActionCard
                title="Sales & Revenue"
                subtitle="View all sales documents"
                icon="📊"
                onPress={() => navigation.navigate('SalesDashboard')}
            />

            <ActionCard
                title="Order Management"
                subtitle="Track all order status"
                icon="📋"
                onPress={() => navigation.navigate('GenericList', { title: 'All Orders', endpoint: '/orders' })}
            />

            <ActionCard
                title="Invoices & Payments"
                subtitle="Financial transactions"
                icon="💰"
                onPress={() => navigation.navigate('GenericList', { title: 'Invoices', endpoint: '/sales/invoices' })}
            />

            <ActionCard
                title="Team Chat"
                subtitle="Communicate with your team"
                icon="💬"
                onPress={() => navigation.navigate('ChatList')}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    title: {
        marginBottom: 4,
    },
    subtitle: {
        marginBottom: 20,
    },
    statsRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 12,
    },
    statCard: {
        flex: 1,
        borderRadius: 12,
    },
    statContent: {
        alignItems: 'center',
    },
    statValue: {
        marginTop: 8,
    },
    sectionTitle: {
        marginTop: 16,
        marginBottom: 12,
    },
    actionCard: {
        marginBottom: 12,
        borderRadius: 12,
    },
    actionContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 8,
        backgroundColor: '#E4E9F2',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    actionText: {
        flex: 1,
    },
});
