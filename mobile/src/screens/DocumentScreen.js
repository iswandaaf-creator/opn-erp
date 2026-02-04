import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, Linking } from 'react-native';
import { Card, Title, Paragraph, Button, IconButton, ActivityIndicator } from 'react-native-paper';
import api from '../services/api';

export default function DocumentScreen({ route, navigation }) {
    const { entityId, entityType } = route.params;
    const [docs, setDocs] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchDocs = async () => {
        try {
            const res = await api.get(`/documents/list/${entityType}/${entityId}`);
            setDocs(res.data);
        } catch (error) {
            console.error('Fetch docs error:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDocs();
    }, [entityId]);

    const handleDownload = (id) => {
        // In mobile, we might open browser for download
        // Assuming backend URL + /documents/download/:id
        const downloadUrl = `${api.defaults.baseURL}/documents/download/${id}`;
        Linking.openURL(downloadUrl);
    };

    return (
        <View style={styles.container}>
            <Title style={{ marginBottom: 20 }}>Attachments</Title>
            {loading ? (
                <ActivityIndicator animating={true} />
            ) : (
                <FlatList
                    data={docs}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <Card style={styles.card}>
                            <Card.Title
                                title={item.originalName}
                                subtitle={`${(item.size / 1024).toFixed(1)} KB`}
                                left={(props) => <IconButton {...props} icon="file" />}
                                right={(props) => <IconButton {...props} icon="download" onPress={() => handleDownload(item.id)} />}
                            />
                        </Card>
                    )}
                    ListEmptyComponent={<Paragraph>No attachments found.</Paragraph>}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    card: {
        marginBottom: 10,
        elevation: 2
    }
});
