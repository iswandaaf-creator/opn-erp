import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { Card, Title, Paragraph, ActivityIndicator, Chip } from 'react-native-paper';
import api from '../services/api';

const getEntityType = (title) => {
    if (title.includes('Quotations')) return 'QUOTATION';
    if (title.includes('Orders')) return 'ORDER';
    if (title.includes('Invoices')) return 'INVOICE';
    if (title.includes('Delivery')) return 'DELIVERY';
    if (title.includes('Payment')) return 'PAYMENT';
    return 'UNKNOWN';
};

export default function GenericListScreen({ route, navigation }) {
    const { title, endpoint } = route.params;
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const res = await api.get(endpoint);
            setData(res.data);
        } catch (error) {
            console.error('Fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        navigation.setOptions({ title }); // Set header title
        fetchData();
    }, [endpoint]);

    const renderItem = ({ item }) => {
        // Dynamic rendering based on data shape
        const mainText = item.quotationNumber || item.orderNumber || item.deliveryNumber || item.invoiceNumber || item.paymentNumber || 'ID: ' + item.id.substring(0, 8);
        const subText = item.customerName || (item.invoice ? `Inv: ${item.invoice.invoiceNumber}` : '') || item.driverName || '';
        const date = item.createdAt || item.orderDate || item.shippingDate || item.invoiceDate || item.paymentDate;
        const amount = item.totalAmount || item.amount;
        const status = item.status;

        return (
            <Card style={styles.card} onPress={() => navigation.navigate('Document', { entityId: item.id, entityType: getEntityType(title) })}>
                <Card.Content>
                    <View style={styles.row}>
                        <View>
                            <Title>{mainText}</Title>
                            <Paragraph>{subText}</Paragraph>
                            <Paragraph style={styles.date}>{new Date(date).toLocaleDateString()}</Paragraph>
                        </View>
                        <View style={{ alignItems: 'flex-end' }}>
                            {amount && <Title style={{ color: '#2e7d32' }}>${Number(amount).toLocaleString()}</Title>}
                            {status && <Chip style={{ marginTop: 5 }}>{status}</Chip>}
                        </View>
                    </View>
                </Card.Content>
            </Card>
        );
    };

    return (
        <View style={styles.container}>
            {loading ? (
                <ActivityIndicator animating={true} style={{ marginTop: 50 }} />
            ) : (
                <FlatList
                    data={data}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchData} />}
                    ListEmptyComponent={<Paragraph style={{ textAlign: 'center', marginTop: 20 }}>No records found.</Paragraph>}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f5f5f5',
    },
    card: {
        marginBottom: 10,
        elevation: 1,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start'
    },
    date: {
        fontSize: 12,
        color: '#666',
        marginTop: 4
    }
});
