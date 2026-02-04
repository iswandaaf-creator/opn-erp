import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Title, Paragraph, Button, ActivityIndicator } from 'react-native-paper';
import api from '../services/api';
import { logout } from '../services/auth';

export default function DashboardScreen({ navigation }) {
    const [stats, setStats] = useState({ orders: 0, revenue: 0 });
    const [loading, setLoading] = useState(true);

    const fetchStats = async () => {
        try {
            const res = await api.get('/orders');
            if (Array.isArray(res.data)) {
                const orderCount = res.data.length;
                const totalRevenue = res.data.reduce((sum, order) => sum + Number(order.totalAmount), 0);
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
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Title>Overview</Title>
                <Button mode="text" onPress={handleLogout}>Logout</Button>
            </View>

            {loading ? (
                <ActivityIndicator animating={true} style={{ marginTop: 50 }} />
            ) : (
                <>
                    <Card style={styles.card}>
                        <Card.Content>
                            <Title>Total Revenue</Title>
                            <Paragraph style={styles.value}>${stats.revenue.toFixed(2)}</Paragraph>
                        </Card.Content>
                    </Card>

                    <Card style={styles.card}>
                        <Card.Content>
                            <Title>Active Orders</Title>
                            <Paragraph style={styles.value}>{stats.orders}</Paragraph>
                        </Card.Content>
                    </Card>

                    <Button
                        mode="contained"
                        onPress={() => navigation.navigate('SalesDashboard')}
                        style={styles.actionBtn}
                        icon="chart-line"
                    >
                        Sales & Distribution
                    </Button>

                    <Button
                        mode="outlined"
                        onPress={fetchStats}
                        style={styles.refreshBtn}
                        icon="refresh"
                    >
                        Refresh Data
                    </Button>
                </>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        marginTop: 20,
    },
    card: {
        marginBottom: 15,
        elevation: 2,
    },
    value: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1976d2',
        marginTop: 10,
    },
    refreshBtn: {
        marginTop: 10,
    },
    actionBtn: {
        marginTop: 20,
        backgroundColor: '#1976d2',
        paddingVertical: 5
    }
});
