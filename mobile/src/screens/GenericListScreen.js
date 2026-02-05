import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, Text, ActivityIndicator, Chip, useTheme, Surface, Avatar } from 'react-native-paper';
import api from '../services/api';
import { getUser } from '../services/auth';

const getEntityType = (title) => {
    if (title.includes('Quotations')) return 'QUOTATION';
    if (title.includes('Orders')) return 'ORDER';
    if (title.includes('Invoices')) return 'INVOICE';
    if (title.includes('Delivery')) return 'DELIVERY';
    if (title.includes('Payment')) return 'PAYMENT';
    return 'UNKNOWN';
};

export default function GenericListScreen({ route, navigation }) {
    const { colors } = useTheme();
    const { title, endpoint } = route.params;
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const currentUser = await getUser();
            const res = await api.get(endpoint);
            let filteredData = res.data;

            if (Array.isArray(filteredData)) {
                // Simple client-side filtering for security/privacy
                if (currentUser && currentUser.role !== 'admin' && currentUser.role !== 'owner') {
                    filteredData = filteredData.filter(item =>
                        item.userId === currentUser.id ||
                        item.salesPersonId === currentUser.id ||
                        (item.order && item.order.userId === currentUser.id) // For entities linked to order
                    );
                }
            }
            setData(filteredData);
        } catch (error) {
            console.error('Fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        navigation.setOptions({
            title,
            headerStyle: { backgroundColor: colors.surface },
            headerTintColor: colors.onSurface
        });
        fetchData();
    }, [endpoint]);

    const renderItem = ({ item }) => {
        // Dynamic rendering based on data shape
        const mainText = item.quotationNumber || item.orderNumber || item.deliveryNumber || item.invoiceNumber || item.paymentNumber || 'ID: ' + item.id.substring(0, 8);
        const subText = item.customerName || (item.invoice ? `Inv: ${item.invoice.invoiceNumber}` : '') || item.driverName || 'No Details';
        const date = item.createdAt || item.orderDate || item.shippingDate || item.invoiceDate || item.paymentDate;
        const amount = item.totalAmount || item.amount;
        const status = item.status || 'Draft';

        // Status Color Logic
        let statusColor = colors.secondaryContainer;
        let statusTextColor = colors.onSecondaryContainer;

        if (['CONFIRMED', 'PAID', 'DELIVERED', 'COMPLETED'].includes(status.toUpperCase())) {
            statusColor = '#E8F5E9'; // Light Green
            statusTextColor = '#1B5E20'; // Dark Green
        } else if (['CANCELLED', 'VOID', 'REJECTED'].includes(status.toUpperCase())) {
            statusColor = '#FFEBEE'; // Light Red
            statusTextColor = '#B71C1C'; // Dark Red
        }

        return (
            <Surface style={[styles.card, { backgroundColor: colors.surface }]} elevation={1} >
                <Card mode="contained" style={{ backgroundColor: colors.surface }} onPress={() => navigation.navigate('Document', { entityId: item.id, entityType: getEntityType(title) })}>
                    <Card.Content>
                        <View style={styles.row}>
                            <View style={styles.iconContainer}>
                                <Avatar.Icon size={40} icon="file-document-outline" style={{ backgroundColor: colors.primaryContainer }} color={colors.onPrimaryContainer} />
                            </View>
                            <View style={styles.infoContainer}>
                                <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>{mainText}</Text>
                                <Text variant="bodyMedium" style={{ color: colors.onSurfaceVariant }}>{subText}</Text>
                                <Text variant="bodySmall" style={{ color: colors.outline, marginTop: 4 }}>
                                    {date ? new Date(date).toLocaleDateString(undefined, { dateStyle: 'medium' }) : 'No Date'}
                                </Text>
                            </View>
                            <View style={styles.statusContainer}>
                                {amount && (
                                    <Text variant="titleSmall" style={{ color: colors.primary, fontWeight: 'bold', marginBottom: 8 }}>
                                        ${Number(amount).toLocaleString()}
                                    </Text>
                                )}
                                <Chip
                                    textStyle={{ color: statusTextColor, fontSize: 10, fontWeight: 'bold' }}
                                    style={{ backgroundColor: statusColor, height: 24, alignItems: 'center' }}
                                    compact
                                >
                                    {status}
                                </Chip>
                            </View>
                        </View>
                    </Card.Content>
                </Card>
            </Surface>
        );
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom', 'left', 'right']}>
            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator animating={true} size="large" color={colors.primary} />
                </View>
            ) : (
                <FlatList
                    data={data}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    contentContainerStyle={{ paddingBottom: 20 }}
                    refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchData} colors={[colors.primary]} />}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Avatar.Icon size={64} icon="database-off" style={{ backgroundColor: colors.surfaceVariant }} color={colors.outline} />
                            <Text variant="bodyLarge" style={{ marginTop: 16, color: colors.onSurfaceVariant }}>No records found.</Text>
                        </View>
                    }
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    card: {
        marginBottom: 12,
        borderRadius: 12,
        overflow: 'hidden',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        marginRight: 16,
    },
    infoContainer: {
        flex: 1,
    },
    statusContainer: {
        alignItems: 'flex-end',
        justifyContent: 'center',
        minWidth: 80,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 60,
    }
});
