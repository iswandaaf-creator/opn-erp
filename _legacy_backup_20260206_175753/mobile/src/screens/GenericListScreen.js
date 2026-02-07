import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, StatusBar } from 'react-native';
import { Layout, Text, Card, Button, Input, Spinner, Divider } from '@ui-kitten/components';
import api from '../services/api';
import { getUser } from '../services/auth';

export default function GenericListScreen({ route, navigation }) {
    const { title, endpoint } = route.params || {};
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchData = async () => {
        setLoading(true);
        try {
            const user = await getUser();
            const res = await api.get(endpoint);
            let items = Array.isArray(res.data) ? res.data : [];

            // Filter based on role
            if (user && user.role !== 'admin' && user.role !== 'owner') {
                items = items.filter(item =>
                    item.userId === user.id || item.salesPersonId === user.id || item.assignedTo === user.id
                );
            }

            setData(items);
        } catch (error) {
            console.error('Failed to fetch data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [endpoint]);

    const filteredData = data.filter(item => {
        const searchLower = searchQuery.toLowerCase();
        return (
            (item.name && item.name.toLowerCase().includes(searchLower)) ||
            (item.documentNumber && item.documentNumber.toLowerCase().includes(searchLower)) ||
            (item.customerName && item.customerName.toLowerCase().includes(searchLower))
        );
    });

    const getStatusColor = (status) => {
        const statusMap = {
            'pending': 'warning',
            'approved': 'success',
            'completed': 'success',
            'draft': 'basic',
            'cancelled': 'danger',
        };
        return statusMap[status?.toLowerCase()] || 'basic';
    };

    // Get current date
    const today = new Date();
    const dateString = today.toLocaleDateString('id-ID', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });

    const renderItem = ({ item }) => (
        <Card
            style={styles.itemCard}
            status={getStatusColor(item.status)}
            onPress={() => navigation.navigate('Document', {
                entityType: endpoint?.split('/').pop() || 'document',
                entityId: item.id
            })}
        >
            <View style={styles.itemContent}>
                <View style={styles.itemHeader}>
                    <Text category='s1'>
                        {item.documentNumber || item.name || `#${item.id}`}
                    </Text>
                    <Button size='tiny' status={getStatusColor(item.status)}>
                        {item.status || 'N/A'}
                    </Button>
                </View>
                <Text category='c1' appearance='hint' style={styles.itemSubtitle}>
                    {item.customerName || item.description || 'No description'}
                </Text>
                {item.totalAmount !== undefined && (
                    <Text category='s2' status='primary' style={styles.itemAmount}>
                        ${Number(item.totalAmount).toLocaleString()}
                    </Text>
                )}
                <Text category='c2' appearance='hint'>
                    {item.createdAt ? new Date(item.createdAt).toLocaleDateString('id-ID') : ''}
                </Text>
            </View>
        </Card>
    );

    return (
        <Layout style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text category='h5'>{title || 'List'}</Text>
                    <Text category='c1' appearance='hint'>{dateString}</Text>
                </View>
                <Text category='c1' appearance='hint'>{filteredData.length} items</Text>
            </View>

            {/* Search */}
            <Input
                placeholder='Search...'
                value={searchQuery}
                onChangeText={setSearchQuery}
                style={styles.searchInput}
                size='large'
            />

            {loading ? (
                <View style={styles.loadingContainer}>
                    <Spinner size='giant' />
                </View>
            ) : filteredData.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text category='h1'>📋</Text>
                    <Text category='s1' appearance='hint'>No items found</Text>
                </View>
            ) : (
                <FlatList
                    data={filteredData}
                    renderItem={renderItem}
                    keyExtractor={item => String(item.id)}
                    contentContainerStyle={styles.listContent}
                    ItemSeparatorComponent={() => <View style={styles.separator} />}
                    refreshControl={
                        <RefreshControl
                            refreshing={loading}
                            onRefresh={fetchData}
                            colors={['#3366FF']}
                        />
                    }
                />
            )}
        </Layout>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        paddingTop: 8,
    },
    searchInput: {
        marginHorizontal: 16,
        marginBottom: 8,
        borderRadius: 12,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContent: {
        padding: 16,
        paddingTop: 8,
    },
    separator: {
        height: 12,
    },
    itemCard: {
        borderRadius: 12,
    },
    itemContent: {
        gap: 4,
    },
    itemHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    itemSubtitle: {
        marginTop: 4,
    },
    itemAmount: {
        marginTop: 8,
    },
});
