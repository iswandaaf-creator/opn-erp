import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card, Button, ProgressBar } from '@ui-kitten/components';

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

export default function ManagerDashboard({ stats, navigation }) {
    return (
        <View style={styles.container}>
            <Text category='h5' style={styles.title}>📊 Manager Dashboard</Text>
            <Text appearance='hint' style={styles.subtitle}>Team Performance & Operations</Text>

            {/* Stats */}
            <View style={styles.statsRow}>
                <Card style={[styles.statCard, styles.successCard]}>
                    <View style={styles.statContent}>
                        <Text category='c1'>Team Orders</Text>
                        <Text category='h4' status='success'>{stats.orders || 0}</Text>
                    </View>
                </Card>

                <Card style={[styles.statCard, styles.primaryCard]}>
                    <View style={styles.statContent}>
                        <Text category='c1'>Team Revenue</Text>
                        <Text category='h4' status='primary'>${stats.revenue?.toLocaleString() || '0'}</Text>
                    </View>
                </Card>
            </View>

            {/* Performance */}
            <Text category='h6' style={styles.sectionTitle}>Team Performance</Text>

            <Card style={styles.performanceCard}>
                <View style={styles.progressRow}>
                    <Text category='s2'>Daily Target</Text>
                    <Text category='s2' status='success'>75%</Text>
                </View>
                <ProgressBar progress={0.75} status='success' style={styles.progressBar} />

                <View style={[styles.progressRow, { marginTop: 16 }]}>
                    <Text category='s2'>Weekly Goal</Text>
                    <Text category='s2' status='primary'>60%</Text>
                </View>
                <ProgressBar progress={0.6} status='primary' style={styles.progressBar} />
            </Card>

            {/* Actions */}
            <Text category='h6' style={styles.sectionTitle}>Manage</Text>

            <ActionCard
                title="Sales Reports"
                subtitle="View team sales performance"
                icon="📈"
                onPress={() => navigation.navigate('SalesDashboard')}
            />

            <ActionCard
                title="Approve Orders"
                subtitle="Review pending approvals"
                icon="✅"
                onPress={() => navigation.navigate('GenericList', { title: 'Orders', endpoint: '/orders' })}
            />

            <ActionCard
                title="Team Chat"
                subtitle="Communicate with team"
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
    successCard: {
        borderLeftWidth: 4,
        borderLeftColor: '#00E096',
    },
    primaryCard: {
        borderLeftWidth: 4,
        borderLeftColor: '#3366FF',
    },
    statContent: {
        alignItems: 'center',
    },
    sectionTitle: {
        marginTop: 16,
        marginBottom: 12,
    },
    performanceCard: {
        borderRadius: 12,
        marginBottom: 12,
    },
    progressRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    progressBar: {
        borderRadius: 4,
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
