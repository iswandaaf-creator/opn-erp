import React from 'react';
import { View, StyleSheet, ScrollView, StatusBar } from 'react-native';
import { Text, Card, Button, Avatar } from 'react-native-paper';

export default function DocumentScreen({ route, navigation }) {
    const { entityId, entityType } = route.params || {};

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Card style={styles.card}>
                    <Card.Content style={styles.cardContent}>
                        <Avatar.Icon
                            size={64}
                            icon="file-document-outline"
                            style={styles.icon}
                            color="#1976D2"
                        />
                        <Text variant="headlineSmall" style={styles.title}>
                            {entityType || 'Document'} Details
                        </Text>
                        <Text variant="bodyMedium" style={styles.id}>
                            ID: {entityId?.substring(0, 8) || 'N/A'}
                        </Text>
                    </Card.Content>
                </Card>

                <Card style={styles.infoCard}>
                    <Card.Content>
                        <Text variant="titleMedium" style={styles.sectionTitle}>
                            Document Information
                        </Text>
                        <View style={styles.infoRow}>
                            <Text style={styles.label}>Type:</Text>
                            <Text style={styles.value}>{entityType || 'Unknown'}</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Text style={styles.label}>Reference:</Text>
                            <Text style={styles.value}>{entityId?.substring(0, 8) || 'N/A'}</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Text style={styles.label}>Status:</Text>
                            <Text style={styles.value}>Active</Text>
                        </View>
                    </Card.Content>
                </Card>

                <Button
                    mode="outlined"
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                >
                    Go Back
                </Button>
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
    card: {
        borderRadius: 16,
        backgroundColor: '#FFFFFF',
        marginBottom: 16,
    },
    cardContent: {
        alignItems: 'center',
        paddingVertical: 24,
    },
    icon: {
        backgroundColor: '#E3F2FD',
        marginBottom: 16,
    },
    title: {
        fontWeight: 'bold',
        color: '#333333',
    },
    id: {
        color: '#666666',
        marginTop: 8,
    },
    infoCard: {
        borderRadius: 12,
        backgroundColor: '#FFFFFF',
        marginBottom: 16,
    },
    sectionTitle: {
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#333333',
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#EEEEEE',
    },
    label: {
        color: '#666666',
    },
    value: {
        fontWeight: '600',
        color: '#333333',
    },
    backButton: {
        marginTop: 8,
        borderRadius: 8,
    },
});
