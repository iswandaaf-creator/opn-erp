import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Text, Card, Button, ActivityIndicator, useTheme, Avatar, FAB, Surface, IconButton } from 'react-native-paper';
import api from '../services/api';
import { logout, getUser } from '../services/auth';

export default function DashboardScreen({ navigation }) {
    const { colors } = useTheme();
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

                // Client-side filtering: If not admin, show only own orders
                // Assumes orders have 'userId' or 'salesPersonId' matching user.id
                // Adjust field name based on actual backend response
                if (currentUser && currentUser.role !== 'admin' && currentUser.role !== 'owner') {
                    orders = orders.filter(order => order.userId === currentUser.id || order.salesPersonId === currentUser.id);
                }

                const orderCount = orders.length;
                const totalRevenue = orders.reduce((sum, order) => sum + Number(order.totalAmount || 0), 0);
                setStats({ orders: orderCount, revenue: totalRevenue });
            }
        } catch (error) {
            console.error('Failed to fetch stats', error);
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
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={[styles.header, { backgroundColor: colors.primary }]}>
                <View style={styles.userInfo}>
                    <Avatar.Text
                        size={48}
                        label={user ? user.name.substring(0, 2).toUpperCase() : 'U'}
                        style={{ backgroundColor: colors.primaryContainer }}
                        color={colors.onPrimaryContainer}
                    />
                    <View style={{ marginLeft: 15 }}>
                        <Text variant="titleMedium" style={{ color: colors.onPrimary, fontWeight: 'bold' }}>
                            Hello, {user ? user.name : 'User'}
                        </Text>
                        <Text variant="bodySmall" style={{ color: colors.onPrimary, opacity: 0.8 }}>
                            {user ? user.role : 'Staff'} • {new Date().toLocaleDateString()}
                        </Text>
                    </View>
                </View>
                <IconButton icon="logout" iconColor={colors.onPrimary} onPress={handleLogout} />
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchStats} colors={[colors.primary]} />}
            >
                <Text variant="headlineSmall" style={[styles.sectionTitle, { color: colors.onSurface }]}>Overview</Text>

                <View style={styles.statsContainer}>
                    <Surface style={[styles.statCard, { backgroundColor: colors.secondaryContainer }]} elevation={2}>
                        <IconButton icon="cash" size={30} iconColor={colors.onSecondaryContainer} />
                        <View>
                            <Text variant="labelMedium" style={{ color: colors.onSecondaryContainer }}>Revenue</Text>
                            <Text variant="headlineMedium" style={{ color: colors.onSecondaryContainer, fontWeight: 'bold' }}>
                                ${stats.revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </Text>
                        </View>
                    </Surface>

                    <Surface style={[styles.statCard, { backgroundColor: colors.primaryContainer }]} elevation={2}>
                        <IconButton icon="shopping" size={30} iconColor={colors.onPrimaryContainer} />
                        <View>
                            <Text variant="labelMedium" style={{ color: colors.onPrimaryContainer }}>Active Orders</Text>
                            <Text variant="headlineMedium" style={{ color: colors.onPrimaryContainer, fontWeight: 'bold' }}>
                                {stats.orders}
                            </Text>
                        </View>
                    </Surface>
                </View>

                <Text variant="headlineSmall" style={[styles.sectionTitle, { color: colors.onSurface, marginTop: 24 }]}>Quick Actions</Text>

                <View style={styles.actionsGrid}>
                    <Card
                        style={[styles.actionCard, { backgroundColor: colors.surface }]}
                        onPress={() => navigation.navigate('SalesDashboard')}
                        mode="elevated"
                    >
                        <Card.Content style={styles.actionContent}>
                            <Avatar.Icon size={48} icon="chart-box-outline" style={{ backgroundColor: colors.elevation.level2 }} color={colors.primary} />
                            <Text variant="titleMedium" style={{ marginTop: 12, fontWeight: '600' }}>Sales & Orders</Text>
                            <Text variant="bodySmall" style={{ color: colors.secondary }}>Manage transactions</Text>
                        </Card.Content>
                    </Card>

                    <Card
                        style={[styles.actionCard, { backgroundColor: colors.surface }]}
                        onPress={() => navigation.navigate('Document', { title: 'Recent Orders', endpoint: '/orders' })} // Example nav
                        mode="elevated"
                    >
                        <Card.Content style={styles.actionContent}>
                            <Avatar.Icon size={48} icon="clipboard-list-outline" style={{ backgroundColor: colors.elevation.level2 }} color={colors.secondary} />
                            <Text variant="titleMedium" style={{ marginTop: 12, fontWeight: '600' }}>Recent List</Text>
                            <Text variant="bodySmall" style={{ color: colors.secondary }}>View latest entries</Text>
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
    },
    header: {
        paddingTop: 60, // Safe area top
        paddingBottom: 30,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        elevation: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    scrollContent: {
        padding: 20,
        paddingTop: 30,
    },
    sectionTitle: {
        fontWeight: 'bold',
        marginBottom: 16,
    },
    statsContainer: {
        gap: 16,
    },
    statCard: {
        borderRadius: 16,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    actionsGrid: {
        flexDirection: 'row',
        gap: 16,
        flexWrap: 'wrap',
    },
    actionCard: {
        flex: 1,
        minWidth: '45%',
        borderRadius: 16,
    },
    actionContent: {
        alignItems: 'center',
        paddingVertical: 10,
    }
});
