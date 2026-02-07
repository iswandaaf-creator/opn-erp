import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, StatusBar } from 'react-native';
import { Layout, Text, Card, Input, Button, Avatar, Spinner, Divider } from '@ui-kitten/components';
import api from '../services/api';

export default function ChatListScreen({ navigation }) {
    const [conversations, setConversations] = useState([]);
    const [groups, setGroups] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('personal'); // 'personal' | 'groups'

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [convRes, groupRes, usersRes] = await Promise.all([
                api.get('/chat/conversations'),
                api.get('/chat/groups'),
                api.get('/chat/users'),
            ]);
            setConversations(convRes.data || []);
            setGroups(groupRes.data || []);
            setUsers(usersRes.data || []);
        } catch (error) {
            console.error('Failed to fetch chat data:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
        const unsubscribe = navigation.addListener('focus', fetchData);
        return unsubscribe;
    }, [navigation, fetchData]);

    // Get current date
    const today = new Date();
    const dateString = today.toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const filteredConversations = conversations.filter(conv =>
        conv.partnerName?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredGroups = groups.filter(group =>
        group.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredUsers = users.filter(user =>
        user.fullName?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const renderConversation = ({ item }) => (
        <Card
            style={styles.chatCard}
            onPress={() => navigation.navigate('Chat', {
                partnerId: item.partnerId,
                partnerName: item.partnerName
            })}
        >
            <View style={styles.chatContent}>
                <Avatar
                    size='medium'
                    source={{ uri: `https://ui-avatars.com/api/?name=${item.partnerName}&background=3366FF&color=fff` }}
                />
                <View style={styles.chatInfo}>
                    <Text category='s1'>{item.partnerName}</Text>
                    <Text category='c1' appearance='hint' numberOfLines={1}>
                        {item.lastMessage || 'Start conversation...'}
                    </Text>
                </View>
                <Text category='c2' appearance='hint'>
                    {item.lastMessageAt ? new Date(item.lastMessageAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : ''}
                </Text>
            </View>
        </Card>
    );

    const renderGroup = ({ item }) => (
        <Card
            style={styles.chatCard}
            status='info'
            onPress={() => navigation.navigate('GroupChat', {
                groupId: item.id,
                groupName: item.name
            })}
        >
            <View style={styles.chatContent}>
                <Avatar
                    size='medium'
                    source={{ uri: `https://ui-avatars.com/api/?name=${item.name}&background=00E096&color=fff` }}
                />
                <View style={styles.chatInfo}>
                    <Text category='s1'>{item.name}</Text>
                    <Text category='c1' appearance='hint' numberOfLines={1}>
                        {item.description || `${item.members?.length || 0} members`}
                    </Text>
                </View>
                <Text>👥</Text>
            </View>
        </Card>
    );

    const renderUser = ({ item }) => (
        <Card
            style={styles.chatCard}
            onPress={() => navigation.navigate('Chat', {
                partnerId: item.id,
                partnerName: item.fullName
            })}
        >
            <View style={styles.chatContent}>
                <Avatar
                    size='medium'
                    source={{ uri: `https://ui-avatars.com/api/?name=${item.fullName}&background=FFAA00&color=fff` }}
                />
                <View style={styles.chatInfo}>
                    <Text category='s1'>{item.fullName}</Text>
                    <Text category='c1' appearance='hint'>{item.role}</Text>
                </View>
                <Text>💬</Text>
            </View>
        </Card>
    );

    return (
        <Layout style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#3366FF" />

            {/* Header */}
            <View style={styles.header}>
                <Text category='h5' style={styles.headerTitle}>💬 Messages</Text>
                <Text category='c1' style={styles.headerDate}>{dateString}</Text>
            </View>

            {/* Search */}
            <Input
                placeholder='Search conversations...'
                value={searchQuery}
                onChangeText={setSearchQuery}
                style={styles.searchInput}
                size='large'
            />

            {/* Tabs */}
            <View style={styles.tabContainer}>
                <Button
                    size='small'
                    status={activeTab === 'personal' ? 'primary' : 'basic'}
                    onPress={() => setActiveTab('personal')}
                    style={styles.tabButton}
                >
                    Personal
                </Button>
                <Button
                    size='small'
                    status={activeTab === 'groups' ? 'primary' : 'basic'}
                    onPress={() => setActiveTab('groups')}
                    style={styles.tabButton}
                >
                    Groups
                </Button>
                <Button
                    size='small'
                    status={activeTab === 'users' ? 'primary' : 'basic'}
                    onPress={() => setActiveTab('users')}
                    style={styles.tabButton}
                >
                    All Users
                </Button>
            </View>

            {loading ? (
                <View style={styles.loadingContainer}>
                    <Spinner size='giant' />
                </View>
            ) : (
                <>
                    {activeTab === 'personal' && (
                        <FlatList
                            data={filteredConversations}
                            renderItem={renderConversation}
                            keyExtractor={item => String(item.partnerId)}
                            contentContainerStyle={styles.listContent}
                            ListEmptyComponent={
                                <View style={styles.emptyContainer}>
                                    <Text category='h1'>💬</Text>
                                    <Text appearance='hint'>No conversations yet</Text>
                                    <Text category='c1' appearance='hint'>Start chatting with a colleague!</Text>
                                </View>
                            }
                            refreshControl={
                                <RefreshControl refreshing={loading} onRefresh={fetchData} colors={['#3366FF']} />
                            }
                        />
                    )}

                    {activeTab === 'groups' && (
                        <>
                            <Button
                                style={styles.createButton}
                                status='success'
                                onPress={() => navigation.navigate('CreateGroup')}
                            >
                                + Create New Group
                            </Button>
                            <FlatList
                                data={filteredGroups}
                                renderItem={renderGroup}
                                keyExtractor={item => String(item.id)}
                                contentContainerStyle={styles.listContent}
                                ListEmptyComponent={
                                    <View style={styles.emptyContainer}>
                                        <Text category='h1'>👥</Text>
                                        <Text appearance='hint'>No groups yet</Text>
                                        <Text category='c1' appearance='hint'>Create a group for your project!</Text>
                                    </View>
                                }
                                refreshControl={
                                    <RefreshControl refreshing={loading} onRefresh={fetchData} colors={['#3366FF']} />
                                }
                            />
                        </>
                    )}

                    {activeTab === 'users' && (
                        <FlatList
                            data={filteredUsers}
                            renderItem={renderUser}
                            keyExtractor={item => String(item.id)}
                            contentContainerStyle={styles.listContent}
                            ListEmptyComponent={
                                <View style={styles.emptyContainer}>
                                    <Text category='h1'>👤</Text>
                                    <Text appearance='hint'>No users found</Text>
                                </View>
                            }
                            refreshControl={
                                <RefreshControl refreshing={loading} onRefresh={fetchData} colors={['#3366FF']} />
                            }
                        />
                    )}
                </>
            )}
        </Layout>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        backgroundColor: '#3366FF',
        paddingTop: 48,
        paddingBottom: 16,
        paddingHorizontal: 16,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
    },
    headerTitle: {
        color: '#FFFFFF',
    },
    headerDate: {
        color: 'rgba(255,255,255,0.8)',
        marginTop: 4,
    },
    searchInput: {
        margin: 16,
        borderRadius: 12,
    },
    tabContainer: {
        flexDirection: 'row',
        marginHorizontal: 16,
        marginBottom: 8,
        gap: 8,
    },
    tabButton: {
        flex: 1,
        borderRadius: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContent: {
        padding: 16,
        paddingTop: 8,
    },
    chatCard: {
        marginBottom: 12,
        borderRadius: 12,
    },
    chatContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    chatInfo: {
        flex: 1,
        marginLeft: 12,
    },
    emptyContainer: {
        alignItems: 'center',
        paddingTop: 60,
    },
    createButton: {
        marginHorizontal: 16,
        marginBottom: 8,
        borderRadius: 12,
    },
});
