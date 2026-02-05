import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, StatusBar } from 'react-native';
import { Layout, Text, Input, Button, Card, CheckBox, Spinner } from '@ui-kitten/components';
import api from '../services/api';

export default function CreateGroupScreen({ navigation }) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [users, setUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await api.get('/chat/users');
                setUsers(res.data || []);
            } catch (err) {
                console.error('Failed to fetch users:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const toggleUser = (userId) => {
        setSelectedUsers(prev =>
            prev.includes(userId)
                ? prev.filter(id => id !== userId)
                : [...prev, userId]
        );
    };

    const handleCreate = async () => {
        if (!name.trim()) {
            setError('Please enter a group name');
            return;
        }
        if (selectedUsers.length === 0) {
            setError('Please select at least one member');
            return;
        }

        setCreating(true);
        setError('');
        try {
            await api.post('/chat/groups', {
                name: name.trim(),
                description: description.trim(),
                memberIds: selectedUsers
            });
            navigation.goBack();
        } catch (err) {
            setError('Failed to create group');
            console.error('Create group error:', err);
        } finally {
            setCreating(false);
        }
    };

    // Get current date
    const today = new Date();
    const dateString = today.toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <Layout style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#00E096" />

            {/* Header */}
            <View style={styles.header}>
                <Button
                    appearance='ghost'
                    status='control'
                    size='small'
                    onPress={() => navigation.goBack()}
                >
                    ← Cancel
                </Button>
                <Text category='h6' style={styles.headerTitle}>Create Group</Text>
                <View style={{ width: 80 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text category='c1' appearance='hint' style={styles.date}>{dateString}</Text>

                {/* Group Info */}
                <Card style={styles.card}>
                    <Text category='h6' style={styles.cardTitle}>Group Information</Text>

                    <Input
                        label='Group Name'
                        placeholder='Enter group name'
                        value={name}
                        onChangeText={setName}
                        style={styles.input}
                        size='large'
                    />

                    <Input
                        label='Description (optional)'
                        placeholder='What is this group for?'
                        value={description}
                        onChangeText={setDescription}
                        style={styles.input}
                        size='large'
                        multiline
                        textStyle={{ minHeight: 64 }}
                    />
                </Card>

                {/* Member Selection */}
                <Card style={styles.card}>
                    <Text category='h6' style={styles.cardTitle}>
                        Select Members ({selectedUsers.length} selected)
                    </Text>

                    {loading ? (
                        <View style={styles.loadingContainer}>
                            <Spinner size='medium' />
                        </View>
                    ) : (
                        users.map(user => (
                            <View key={user.id} style={styles.userRow}>
                                <CheckBox
                                    checked={selectedUsers.includes(user.id)}
                                    onChange={() => toggleUser(user.id)}
                                >
                                    {() => (
                                        <View style={styles.userInfo}>
                                            <Text category='s1' style={styles.userName}>{user.fullName}</Text>
                                            <Text category='c1' appearance='hint'>{user.role}</Text>
                                        </View>
                                    )}
                                </CheckBox>
                            </View>
                        ))
                    )}
                </Card>

                {error ? (
                    <Text status='danger' style={styles.error}>{error}</Text>
                ) : null}

                <Button
                    style={styles.createButton}
                    status='success'
                    size='large'
                    onPress={handleCreate}
                    disabled={creating}
                >
                    {creating ? 'Creating...' : '+ Create Group'}
                </Button>
            </ScrollView>
        </Layout>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        backgroundColor: '#00E096',
        paddingTop: 48,
        paddingBottom: 16,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    headerTitle: {
        color: '#FFFFFF',
    },
    scrollContent: {
        padding: 16,
    },
    date: {
        marginBottom: 16,
    },
    card: {
        borderRadius: 12,
        marginBottom: 16,
    },
    cardTitle: {
        marginBottom: 16,
    },
    input: {
        marginBottom: 16,
    },
    loadingContainer: {
        padding: 20,
        alignItems: 'center',
    },
    userRow: {
        marginBottom: 12,
    },
    userInfo: {
        marginLeft: 8,
    },
    userName: {
        marginLeft: 8,
    },
    error: {
        textAlign: 'center',
        marginBottom: 16,
    },
    createButton: {
        borderRadius: 12,
        marginTop: 8,
    },
});
