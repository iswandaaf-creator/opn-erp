import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, StatusBar } from 'react-native';
import { Layout, Text, Card, Button, Spinner, Divider } from '@ui-kitten/components';
import api from '../services/api';

export default function DocumentScreen({ route, navigation }) {
    const { entityType, entityId } = route.params || {};
    const [document, setDocument] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDocument = async () => {
            setLoading(true);
            try {
                const endpoint = entityType === 'orders' ? '/orders' : `/sales/${entityType}`;
                const res = await api.get(`${endpoint}/${entityId}`);
                setDocument(res.data);
            } catch (error) {
                console.error('Failed to fetch document:', error);
            } finally {
                setLoading(false);
            }
        };

        if (entityType && entityId) {
            fetchDocument();
        }
    }, [entityType, entityId]);

    // Get current date
    const today = new Date();
    const dateString = today.toLocaleDateString('id-ID', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
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

    if (loading) {
        return (
            <Layout style={styles.loadingContainer}>
                <Spinner size='giant' />
            </Layout>
        );
    }

    if (!document) {
        return (
            <Layout style={styles.emptyContainer}>
                <Text category='h1'>📄</Text>
                <Text category='s1' appearance='hint'>Document not found</Text>
            </Layout>
        );
    }

    return (
        <Layout style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Header */}
                <Card status={getStatusColor(document.status)} style={styles.headerCard}>
                    <Text category='h5'>{document.documentNumber || `#${document.id}`}</Text>
                    <View style={styles.headerRow}>
                        <Button size='tiny' status={getStatusColor(document.status)}>
                            {document.status || 'N/A'}
                        </Button>
                        <Text category='c1' appearance='hint'>{dateString}</Text>
                    </View>
                </Card>

                <Divider style={styles.divider} />

                {/* Details */}
                <Text category='h6' style={styles.sectionTitle}>Details</Text>

                <Card style={styles.detailCard}>
                    {document.customerName && (
                        <View style={styles.detailRow}>
                            <Text category='c1' appearance='hint'>Customer</Text>
                            <Text category='s2'>{document.customerName}</Text>
                        </View>
                    )}

                    {document.totalAmount !== undefined && (
                        <View style={styles.detailRow}>
                            <Text category='c1' appearance='hint'>Total Amount</Text>
                            <Text category='h6' status='primary'>
                                ${Number(document.totalAmount).toLocaleString()}
                            </Text>
                        </View>
                    )}

                    {document.createdAt && (
                        <View style={styles.detailRow}>
                            <Text category='c1' appearance='hint'>Created</Text>
                            <Text category='s2'>
                                {new Date(document.createdAt).toLocaleDateString('id-ID', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </Text>
                        </View>
                    )}

                    {document.description && (
                        <View style={styles.detailRow}>
                            <Text category='c1' appearance='hint'>Description</Text>
                            <Text category='p2'>{document.description}</Text>
                        </View>
                    )}
                </Card>

                {/* Actions */}
                <View style={styles.actions}>
                    <Button
                        style={styles.actionButton}
                        status='basic'
                        onPress={() => navigation.goBack()}
                    >
                        Back to List
                    </Button>
                </View>
            </ScrollView>
        </Layout>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
    scrollContent: {
        padding: 16,
    },
    headerCard: {
        borderRadius: 12,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 12,
    },
    divider: {
        marginVertical: 16,
    },
    sectionTitle: {
        marginBottom: 12,
    },
    detailCard: {
        borderRadius: 12,
    },
    detailRow: {
        marginBottom: 12,
    },
    actions: {
        marginTop: 24,
    },
    actionButton: {
        borderRadius: 8,
    },
});
