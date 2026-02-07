import React from 'react';
import { View, StyleSheet, ScrollView, StatusBar } from 'react-native';
import { Layout, Text, Card, Divider } from '@ui-kitten/components';

const SalesCard = ({ title, subtitle, icon, onPress, status }) => (
    <Card style={styles.card} status={status} onPress={onPress}>
        <View style={styles.cardContent}>
            <View style={[styles.iconContainer, { backgroundColor: getIconBgColor(status) }]}>
                <Text category='h5'>{icon}</Text>
            </View>
            <View style={styles.cardText}>
                <Text category='s1'>{title}</Text>
                <Text category='c1' appearance='hint'>{subtitle}</Text>
            </View>
            <Text appearance='hint'>→</Text>
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

export default function SalesDashboardScreen({ navigation }) {
    // Get current date
    const today = new Date();
    const dateString = today.toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <Layout style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Header */}
                <Text category='h5' style={styles.title}>📊 Sales Dashboard</Text>
                <Text category='c1' appearance='hint' style={styles.date}>{dateString}</Text>

                <Divider style={styles.divider} />

                {/* Sales Documents */}
                <Text category='h6' style={styles.sectionTitle}>Sales Documents</Text>

                <SalesCard
                    title="Quotations"
                    subtitle="Create and manage quotes"
                    icon="📝"
                    status="primary"
                    onPress={() => navigation.navigate('GenericList', {
                        title: 'Quotations',
                        endpoint: '/sales/quotations'
                    })}
                />

                <SalesCard
                    title="Sales Orders"
                    subtitle="Track your sales orders"
                    icon="🛒"
                    status="success"
                    onPress={() => navigation.navigate('GenericList', {
                        title: 'Sales Orders',
                        endpoint: '/sales/orders'
                    })}
                />

                <SalesCard
                    title="Delivery Orders"
                    subtitle="Manage deliveries"
                    icon="🚚"
                    status="info"
                    onPress={() => navigation.navigate('GenericList', {
                        title: 'Delivery Orders',
                        endpoint: '/sales/delivery-orders'
                    })}
                />

                <SalesCard
                    title="Invoices"
                    subtitle="View and create invoices"
                    icon="💰"
                    status="warning"
                    onPress={() => navigation.navigate('GenericList', {
                        title: 'Invoices',
                        endpoint: '/sales/invoices'
                    })}
                />

                <Divider style={styles.divider} />

                {/* Orders */}
                <Text category='h6' style={styles.sectionTitle}>Orders</Text>

                <SalesCard
                    title="All Orders"
                    subtitle="View all order history"
                    icon="📋"
                    status="basic"
                    onPress={() => navigation.navigate('GenericList', {
                        title: 'All Orders',
                        endpoint: '/orders'
                    })}
                />
            </ScrollView>
        </Layout>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        padding: 16,
    },
    title: {
        marginBottom: 4,
    },
    date: {
        marginBottom: 16,
    },
    divider: {
        marginVertical: 16,
    },
    sectionTitle: {
        marginBottom: 12,
    },
    card: {
        marginBottom: 12,
        borderRadius: 12,
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    cardText: {
        flex: 1,
    },
});
