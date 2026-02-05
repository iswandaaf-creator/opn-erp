import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card, Avatar, ProgressBar, Chip } from 'react-native-paper';

export default function StaffDashboard({ stats, navigation }) {
    return (
        <View style={styles.container}>
            {/* Title */}
            <Text variant="headlineSmall" style={styles.title}>
                ☀️ Let's make today great!
            </Text>

            {/* Daily Goal */}
            <Card style={styles.goalCard}>
                <Card.Content>
                    <View style={styles.goalHeader}>
                        <Text variant="titleMedium" style={styles.goalTitle}>Daily Goal Progress</Text>
                        <Chip style={styles.goalChip} textStyle={styles.goalChipText}>75%</Chip>
                    </View>
                    <Text style={styles.goalSubtitle}>You're doing great! Keep it up!</Text>
                    <ProgressBar progress={0.75} color="#00C853" style={styles.progressBar} />
                    <View style={styles.goalStats}>
                        <Text style={styles.goalStatText}>Orders: {stats.orders || 0}</Text>
                        <Text style={styles.goalStatText}>Revenue: ${stats.revenue?.toLocaleString() || '0'}</Text>
                    </View>
                </Card.Content>
            </Card>

            {/* Quick Actions */}
            <Text variant="titleMedium" style={styles.sectionTitle}>Quick Actions</Text>

            <View style={styles.actionsGrid}>
                <Card style={[styles.quickAction, { backgroundColor: '#00C853' }]} onPress={() => navigation.navigate('SalesDashboard')}>
                    <Card.Content style={styles.quickActionContent}>
                        <Avatar.Icon size={48} icon="cart-plus" color="#FFFFFF" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }} />
                        <Text style={styles.quickActionText}>New Sale</Text>
                    </Card.Content>
                </Card>

                <Card style={[styles.quickAction, { backgroundColor: '#2962FF' }]} onPress={() => navigation.navigate('GenericList', { title: 'Orders', endpoint: '/orders' })}>
                    <Card.Content style={styles.quickActionContent}>
                        <Avatar.Icon size={48} icon="clipboard-list-outline" color="#FFFFFF" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }} />
                        <Text style={styles.quickActionText}>My Orders</Text>
                    </Card.Content>
                </Card>
            </View>

            <View style={styles.actionsGrid}>
                <Card style={[styles.quickAction, { backgroundColor: '#FF6D00' }]} onPress={() => navigation.navigate('GenericList', { title: 'Quotations', endpoint: '/sales/quotations' })}>
                    <Card.Content style={styles.quickActionContent}>
                        <Avatar.Icon size={48} icon="file-document-edit-outline" color="#FFFFFF" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }} />
                        <Text style={styles.quickActionText}>Quotations</Text>
                    </Card.Content>
                </Card>

                <Card style={[styles.quickAction, { backgroundColor: '#AA00FF' }]} onPress={() => navigation.navigate('GenericList', { title: 'Invoices', endpoint: '/sales/invoices' })}>
                    <Card.Content style={styles.quickActionContent}>
                        <Avatar.Icon size={48} icon="receipt" color="#FFFFFF" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }} />
                        <Text style={styles.quickActionText}>Invoices</Text>
                    </Card.Content>
                </Card>
            </View>

            {/* Motivation */}
            <Card style={styles.motivationCard}>
                <Card.Content>
                    <Text variant="titleMedium" style={styles.motivationTitle}>💡 Tip of the Day</Text>
                    <Text style={styles.motivationText}>
                        "Quality means doing it right when no one is looking." - Henry Ford
                    </Text>
                </Card.Content>
            </Card>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    title: {
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 16,
    },
    goalCard: {
        borderRadius: 16,
        backgroundColor: '#FFFFFF',
        marginBottom: 16,
    },
    goalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    goalTitle: {
        fontWeight: 'bold',
        color: '#333',
    },
    goalChip: {
        backgroundColor: '#00C853',
    },
    goalChipText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    goalSubtitle: {
        color: '#666',
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
    goalStatText: {
        color: '#666',
        fontWeight: '500',
    },
    sectionTitle: {
        fontWeight: 'bold',
        marginBottom: 12,
        color: '#333',
    },
    actionsGrid: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 12,
    },
    quickAction: {
        flex: 1,
        borderRadius: 16,
        elevation: 4,
    },
    quickActionContent: {
        alignItems: 'center',
        paddingVertical: 20,
    },
    quickActionText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        marginTop: 8,
        fontSize: 14,
    },
    motivationCard: {
        borderRadius: 16,
        backgroundColor: '#E3F2FD',
        marginTop: 8,
    },
    motivationTitle: {
        fontWeight: 'bold',
        color: '#1565C0',
        marginBottom: 8,
    },
    motivationText: {
        color: '#0D47A1',
        fontStyle: 'italic',
    },
});
