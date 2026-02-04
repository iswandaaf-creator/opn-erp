import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Title, Button, Avatar } from 'react-native-paper';

export default function SalesDashboardScreen({ navigation }) {
    const menus = [
        { title: 'Quotations', icon: 'file-document-outline', color: '#2196f3', route: 'GenericList', params: { title: 'Sales Quotations', endpoint: '/sales/quotations' } },
        { title: 'Sales Orders', icon: 'receipt', color: '#00bcd4', route: 'GenericList', params: { title: 'Sales Orders', endpoint: '/sales/orders' } },
        { title: 'Deliveries', icon: 'truck-delivery', color: '#ff9800', route: 'GenericList', params: { title: 'Delivery Orders', endpoint: '/sales/delivery' } },
        { title: 'Invoices', icon: 'currency-usd', color: '#f44336', route: 'GenericList', params: { title: 'Sales Invoices', endpoint: '/sales/invoices' } },
        { title: 'Payments', icon: 'cash-multiple', color: '#4caf50', route: 'GenericList', params: { title: 'Customer Payments', endpoint: '/sales/payments' } },
    ];

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Title>Sales & Distribution</Title>
            </View>

            <View style={styles.grid}>
                {menus.map((item, index) => (
                    <Card
                        key={index}
                        style={styles.card}
                        onPress={() => navigation.navigate(item.route, item.params)}
                    >
                        <Card.Content style={styles.cardContent}>
                            <Avatar.Icon size={48} icon={item.icon} style={{ backgroundColor: item.color }} />
                            <Title style={styles.cardTitle}>{item.title}</Title>
                        </Card.Content>
                    </Card>
                ))}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f5f5f5',
    },
    header: {
        marginBottom: 20,
        marginTop: 10,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    card: {
        width: '48%',
        marginBottom: 16,
        elevation: 2,
    },
    cardContent: {
        alignItems: 'center',
        paddingVertical: 20,
    },
    cardTitle: {
        marginTop: 10,
        fontSize: 16,
        textAlign: 'center',
    }
});
