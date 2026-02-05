import React from 'react';
import { View, StyleSheet, ScrollView, StatusBar } from 'react-native';
import { Text, Card, Avatar, Divider } from 'react-native-paper';

export default function SalesDashboardScreen({ navigation }) {
    const menuItems = [
        { title: 'Quotations', icon: 'file-document-edit', endpoint: '/sales/quotations' },
        { title: 'Sales Orders', icon: 'cart', endpoint: '/sales/orders' },
        { title: 'Delivery Orders', icon: 'truck-delivery', endpoint: '/sales/deliveries' },
        { title: 'Invoices', icon: 'receipt', endpoint: '/sales/invoices' },
        { title: 'Payments', icon: 'cash-register', endpoint: '/sales/payments' },
    ];

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text variant="titleLarge" style={styles.sectionTitle}>
                    Sales Documents
                </Text>

                {menuItems.map((item, index) => (
                    <Card
                        key={index}
                        style={styles.menuCard}
                        onPress={() => navigation.navigate('GenericList', {
                            title: item.title,
                            endpoint: item.endpoint
                        })}
                    >
                        <Card.Content style={styles.menuContent}>
                            <Avatar.Icon
                                size={48}
                                icon={item.icon}
                                style={styles.menuIcon}
                                color="#1976D2"
                            />
                            <View style={styles.menuTextContainer}>
                                <Text variant="titleMedium" style={styles.menuTitle}>
                                    {item.title}
                                </Text>
                                <Text variant="bodySmall" style={styles.menuSubtitle}>
                                    View and manage {item.title.toLowerCase()}
                                </Text>
                            </View>
                            <Avatar.Icon
                                size={24}
                                icon="chevron-right"
                                style={styles.chevron}
                                color="#999999"
                            />
                        </Card.Content>
                    </Card>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    scrollContent: {
        padding: 16,
    },
    sectionTitle: {
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#333333',
    },
    menuCard: {
        marginBottom: 12,
        borderRadius: 12,
        backgroundColor: '#FFFFFF',
    },
    menuContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    menuIcon: {
        backgroundColor: '#E3F2FD',
        marginRight: 12,
    },
    menuTextContainer: {
        flex: 1,
    },
    menuTitle: {
        fontWeight: '600',
        color: '#333333',
    },
    menuSubtitle: {
        color: '#666666',
    },
    chevron: {
        backgroundColor: 'transparent',
    },
});
