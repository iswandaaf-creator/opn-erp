import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card, Button, ProgressBar } from '@ui-kitten/components';

const QuickAction = ({ title, icon, status, onPress }) => (
    <Card style={[styles.quickAction]} status={status} onPress={onPress}>
        <View style={styles.quickActionContent}>
            <View style={[styles.iconContainer, { backgroundColor: getIconBgColor(status) }]}>
                <Text category='h5'>{icon}</Text>
            </View>
            <Text category='s2' style={styles.quickActionText}>{title}</Text>
        </View>
    </Card>
);

const getIconBgColor = (status) => {
    switch (status) {
        case 'primary': return '#3366FF';
        case 'success': return '#00E096';
        case 'info': return '#0095FF';
        case 'warning': return '#FFAA00';
        case 'danger': return '#FF3D71';
        default: return '#8F9BB3';
    }
};

export default function StaffDashboard({ stats, navigation }) {
    return (
        <View style={styles.container}>
            <Text category='h5' style={styles.title}>☀️ Let's make today great!</Text>

            {/* Daily Goal */}
            <Card style={styles.goalCard} status='success'>
                <View style={styles.goalHeader}>
                    <Text category='h6'>Daily Goal Progress</Text>
                    <Button size='tiny' status='success'>75%</Button>
                </View>
                <Text appearance='hint' style={styles.goalSubtitle}>You're doing great! Keep it up!</Text>
                <ProgressBar progress={0.75} status='success' style={styles.progressBar} />
                <View style={styles.goalStats}>
                    <Text category='c1'>Orders: {stats.orders || 0}</Text>
                    <Text category='c1'>Revenue: ${stats.revenue?.toLocaleString() || '0'}</Text>
                </View>
            </Card>

            {/* Quick Actions */}
            <Text category='h6' style={styles.sectionTitle}>Quick Actions</Text>

            <View style={styles.actionsGrid}>
                <QuickAction
                    title="New Sale"
                    icon="🛒"
                    status="success"
                    onPress={() => navigation.navigate('SalesDashboard')}
                />
                <QuickAction
                    title="My Orders"
                    icon="📋"
                    status="primary"
                    onPress={() => navigation.navigate('GenericList', { title: 'Orders', endpoint: '/orders' })}
                />
            </View>

            <View style={styles.actionsGrid}>
                <QuickAction
                    title="Quotations"
                    icon="📝"
                    status="warning"
                    onPress={() => navigation.navigate('GenericList', { title: 'Quotations', endpoint: '/sales/quotations' })}
                />
                <QuickAction
                    title="Chat"
                    icon="💬"
                    status="info"
                    onPress={() => navigation.navigate('ChatList')}
                />
            </View>

            {/* Motivation */}
            <Card style={styles.motivationCard} status='info'>
                <Text category='h6' style={styles.motivationTitle}>💡 Tip of the Day</Text>
                <Text category='p2' appearance='hint' style={styles.motivationText}>
                    "Quality means doing it right when no one is looking." - Henry Ford
                </Text>
            </Card>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    title: {
        marginBottom: 16,
    },
    goalCard: {
        borderRadius: 16,
        marginBottom: 16,
    },
    goalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    goalSubtitle: {
        marginBottom: 12,
    },
    progressBar: {
        height: 10,
        borderRadius: 5,
    },
    goalStats: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 12,
    },
    sectionTitle: {
        marginBottom: 12,
    },
    actionsGrid: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 12,
    },
    quickAction: {
        flex: 1,
        borderRadius: 16,
    },
    quickActionContent: {
        alignItems: 'center',
        paddingVertical: 8,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    quickActionText: {
        marginTop: 4,
        textAlign: 'center',
    },
    motivationCard: {
        borderRadius: 16,
        marginTop: 8,
    },
    motivationTitle: {
        marginBottom: 8,
    },
    motivationText: {
        fontStyle: 'italic',
    },
});
