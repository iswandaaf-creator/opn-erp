import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, StatusBar } from 'react-native';
import { Text, Card, Button, ActivityIndicator, IconButton, Avatar } from 'react-native-paper';
import api from '../services/api';
import { logout, getUser } from '../services/auth';

export default function DashboardScreen({ navigation }) {
    const [stats, setStats] = useState({ orders: 0, revenue: 0 });
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    const fetchStats = async () => {
        setLoading(true);
        try {
            const currentUser = await getUser();
            setUser(currentUser);

            const res = await api.get('/orders');
            if (Array.isArray(res.data)) {
                let orders = res.data;

                if (currentUser && currentUser.role !== 'admin' && currentUser.role !== 'owner') {
                    orders = orders.filter(order =>
                        order.userId === currentUser.id || order.salesPersonId === currentUser.id
                    );
                }

                const orderCount = orders.length;
                const totalRevenue = orders.reduce((sum, order) => sum + Number(order.totalAmount || 0), 0);
                setStats({ orders: orderCount, revenue: totalRevenue });
            }
        } catch (error) {
            console.error('Failed to fetch stats:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const handleLogout = async () => {
        await logout();
        navigation.replace('Login');
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#1976D2" />

            {/* Header */}
            <View style={styles.header}>
                <View style={styles.userInfo}>
                    <Avatar.Text
                        size={48}
                        label={user ? user.name?.substring(0, 2).toUpperCase() : 'U'}
                        style={styles.avatar}
                    />
                    <View style={styles.userTextContainer}>
                        <Text variant="titleMedium" style={styles.userName}>
                            Hello, {user ? user.name : 'User'}
                        </Text>
                        <Text variant="bodySmall" style={styles.userRole}>
                            {user ? user.role : 'Staff'} • {new Date().toLocaleDateString()}
                        </Text>
                    </View>
                </View>
                <IconButton
                    icon="logout"
                    iconColor="#FFFFFF"
                    onPress={handleLogout}
                    size={24}
                />
            </View>

            {/* Content */}
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl
                        refreshing={loading}
                        onRefresh={fetchStats}
                        colors={['#1976D2']}
                    />
                }
            >
                <Text variant="titleLarge" style={styles.sectionTitle}>Overview</Text>

                {/* Stats Cards */}
                <Card style={styles.statCard}>
                    <Card.Content style={styles.statContent}>
                        <IconButton icon="cash" size={32} iconColor="#388E3C" />
                        <View>
                            <Text variant="labelMedium" style={styles.statLabel}>Revenue</Text>
                            <Text variant="headlineSmall" style={styles.statValue}>
                                ${stats.revenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </Text>
                        </View>
                    </Card.Content>
                </Card>

                <Card style={styles.statCard}>
                    <Card.Content style={styles.statContent}>
                        <IconButton icon="cart" size={32} iconColor="#1976D2" />
                        <View>
                            <Text variant="labelMedium" style={styles.statLabel}>Active Orders</Text>
                            <Text variant="headlineSmall" style={styles.statValue}>
                                {stats.orders}
                            </Text>
                        </View>
                    </Card.Content>
                </Card>

                <Text variant="titleLarge" style={[styles.sectionTitle, { marginTop: 24 }]}>
                    Quick Actions
                </Text>

                {/* Action Cards */}
                <View style={styles.actionsRow}>
                    <Card
                        style={styles.actionCard}
                        onPress={() => navigation.navigate('SalesDashboard')}
                    >
                        <Card.Content style={styles.actionContent}>
                            <IconButton icon="chart-box" size={40} iconColor="#1976D2" />
                            <Text variant="titleSmall" style={styles.actionTitle}>Sales</Text>
                        </Card.Content>
                    </Card>

                    <Card
                        style={styles.actionCard}
                        onPress={() => navigation.navigate('GenericList', {
                            title: 'Recent Orders',
                            endpoint: '/orders'
                        })}
                    >
                        <Card.Content style={styles.actionContent}>
                            <IconButton icon="clipboard-list" size={40} iconColor="#D32F2F" />
                            <Text variant="titleSmall" style={styles.actionTitle}>Orders</Text>
                        </Card.Content>
                    </Card>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    header: {
        backgroundColor: '#1976D2',
        paddingTop: 48,
        paddingBottom: 24,
        paddingHorizontal: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        backgroundColor: '#0D47A1',
    },
    userTextContainer: {
        marginLeft: 12,
    },
    userName: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    userRole: {
        color: 'rgba(255,255,255,0.8)',
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 32,
    },
    sectionTitle: {
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#333333',
    },
    statCard: {
        marginBottom: 12,
        borderRadius: 12,
        backgroundColor: '#FFFFFF',
    },
    statContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statLabel: {
        color: '#666666',
    },
    statValue: {
        fontWeight: 'bold',
        color: '#333333',
    },
    actionsRow: {
        flexDirection: 'row',
        gap: 12,
    },
    actionCard: {
        flex: 1,
        borderRadius: 12,
        backgroundColor: '#FFFFFF',
    },
    actionContent: {
        alignItems: 'center',
        paddingVertical: 16,
    },
    actionTitle: {
        fontWeight: '600',
        marginTop: 8,
    },
});
