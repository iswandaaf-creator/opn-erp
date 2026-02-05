import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, StatusBar } from 'react-native';
import { Card, Text, ActivityIndicator, Chip, Avatar } from 'react-native-paper';
import api from '../services/api';
import { getUser } from '../services/auth';

const getEntityType = (title) => {
    if (title?.includes('Quotations')) return 'QUOTATION';
    if (title?.includes('Orders')) return 'ORDER';
    if (title?.includes('Invoices')) return 'INVOICE';
    if (title?.includes('Delivery')) return 'DELIVERY';
    if (title?.includes('Payment')) return 'PAYMENT';
    return 'UNKNOWN';
};

export default function GenericListScreen({ route, navigation }) {
    const { title, endpoint } = route.params || {};
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        try {
            const currentUser = await getUser();
            const res = await api.get(endpoint);
            let filteredData = res.data;

            if (Array.isArray(filteredData)) {
                if (currentUser && currentUser.role !== 'admin' && currentUser.role !== 'owner') {
                    filteredData = filteredData.filter(item =>
                        item.userId === currentUser.id ||
                        item.salesPersonId === currentUser.id ||
                        (item.order && item.order.userId === currentUser.id)
                    );
                }
            }
            setData(filteredData || []);
        } catch (error) {
            console.error('Fetch error:', error);
            setData([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (title) {
            navigation.setOptions({ title });
        }
        fetchData();
    }, [endpoint]);

    const getStatusColor = (status) => {
        const upperStatus = (status || '').toUpperCase();
        if (['CONFIRMED', 'PAID', 'DELIVERED', 'COMPLETED'].includes(upperStatus)) {
            return { bg: '#E8F5E9', text: '#1B5E20' };
        }
        if (['CANCELLED', 'VOID', 'REJECTED'].includes(upperStatus)) {
            return { bg: '#FFEBEE', text: '#B71C1C' };
        }
        return { bg: '#E3F2FD', text: '#1565C0' };
    };

    const renderItem = ({ item }) => {
        const mainText = item.quotationNumber || item.orderNumber || item.deliveryNumber ||
            item.invoiceNumber || item.paymentNumber || `ID: ${item.id?.substring(0, 8)}`;
        const subText = item.customerName || (item.invoice ? `Inv: ${item.invoice.invoiceNumber}` : '') ||
            item.driverName || 'No Details';
        const date = item.createdAt || item.orderDate || item.shippingDate ||
            item.invoiceDate || item.paymentDate;
        const amount = item.totalAmount || item.amount;
        const status = item.status || 'Draft';
        const colors = getStatusColor(status);

        return (
            <Card
                style={styles.card}
                onPress={() => navigation.navigate('Document', {
                    entityId: item.id,
                    entityType: getEntityType(title)
                })}
            >
                <Card.Content style={styles.cardContent}>
                    <Avatar.Icon
                        size={40}
                        icon="file-document"
                        style={styles.avatar}
                        color="#1976D2"
                    />
                    <View style={styles.infoContainer}>
                        <Text variant="titleMedium" style={styles.mainText}>{mainText}</Text>
                        <Text variant="bodyMedium" style={styles.subText}>{subText}</Text>
                        <Text variant="bodySmall" style={styles.dateText}>
                            {date ? new Date(date).toLocaleDateString() : 'No Date'}
                        </Text>
                    </View>
                    <View style={styles.rightContainer}>
                        {amount && (
                            <Text variant="titleSmall" style={styles.amount}>
                                ${Number(amount).toLocaleString()}
                            </Text>
                        )}
                        <Chip
                            textStyle={{ color: colors.text, fontSize: 10, fontWeight: 'bold' }}
                            style={[styles.chip, { backgroundColor: colors.bg }]}
                            compact
                        >
                            {status}
                        </Chip>
                    </View>
                </Card.Content>
            </Card>
        );
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#1976D2" />
                </View>
            ) : (
                <FlatList
                    data={data}
                    keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContent}
                    refreshControl={
                        <RefreshControl
                            refreshing={loading}
                            onRefresh={fetchData}
                            colors={['#1976D2']}
                        />
                    }
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Avatar.Icon size={64} icon="database-off" style={styles.emptyIcon} />
                            <Text variant="bodyLarge" style={styles.emptyText}>
                                No records found.
                            </Text>
                        </View>
                    }
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    listContent: {
        padding: 16,
        paddingBottom: 32,
    },
    card: {
        marginBottom: 12,
        borderRadius: 12,
        backgroundColor: '#FFFFFF',
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        backgroundColor: '#E3F2FD',
        marginRight: 12,
    },
    infoContainer: {
        flex: 1,
    },
    mainText: {
        fontWeight: 'bold',
        color: '#333333',
    },
    subText: {
        color: '#666666',
    },
    dateText: {
        color: '#999999',
        marginTop: 4,
    },
    rightContainer: {
        alignItems: 'flex-end',
    },
    amount: {
        color: '#1976D2',
        fontWeight: 'bold',
        marginBottom: 8,
    },
    chip: {
        height: 24,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 60,
    },
    emptyIcon: {
        backgroundColor: '#EEEEEE',
    },
    emptyText: {
        marginTop: 16,
        color: '#666666',
    },
});
