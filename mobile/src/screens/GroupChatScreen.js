import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, FlatList, KeyboardAvoidingView, Platform, StatusBar } from 'react-native';
import { Layout, Text, Input, Button, Avatar, Spinner, Card } from '@ui-kitten/components';
import api from '../services/api';
import { getUser } from '../services/auth';

export default function GroupChatScreen({ route, navigation }) {
    const { groupId, groupName } = route.params || {};
    const [group, setGroup] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [showMembers, setShowMembers] = useState(false);

    const fetchData = useCallback(async () => {
        if (!groupId) return;
        setLoading(true);
        try {
            const [groupRes, msgRes, user] = await Promise.all([
                api.get(`/chat/groups/${groupId}`),
                api.get(`/chat/groups/${groupId}/messages`),
                getUser()
            ]);
            setGroup(groupRes.data);
            setMessages(msgRes.data || []);
            setCurrentUser(user);
        } catch (error) {
            console.error('Failed to fetch group data:', error);
        } finally {
            setLoading(false);
        }
    }, [groupId]);

    useEffect(() => {
        fetchData();
        // Poll for new messages every 5 seconds
        const interval = setInterval(fetchData, 5000);
        return () => clearInterval(interval);
    }, [fetchData]);

    const sendMessage = async () => {
        if (!newMessage.trim() || sending) return;

        setSending(true);
        try {
            await api.post(`/chat/groups/${groupId}/messages`, {
                content: newMessage.trim()
            });
            setNewMessage('');
            fetchData();
        } catch (error) {
            console.error('Failed to send message:', error);
        } finally {
            setSending(false);
        }
    };

    const formatTime = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    };

    const renderMessage = ({ item }) => {
        const isMe = item.senderId === currentUser?.id;
        const senderName = item.sender?.fullName || 'Unknown';

        return (
            <View style={[styles.messageRow, isMe ? styles.messageRowMe : styles.messageRowOther]}>
                {!isMe && (
                    <Avatar
                        size='small'
                        source={{ uri: `https://ui-avatars.com/api/?name=${senderName}&background=00E096&color=fff` }}
                        style={styles.messageAvatar}
                    />
                )}
                <View style={[styles.messageBubble, isMe ? styles.bubbleMe : styles.bubbleOther]}>
                    {!isMe && (
                        <Text category='c2' status='primary' style={styles.senderName}>{senderName}</Text>
                    )}
                    <Text style={isMe ? styles.messageTextMe : styles.messageTextOther}>
                        {item.content}
                    </Text>
                    <Text category='c2' style={[styles.messageTime, isMe ? styles.timeMe : styles.timeOther]}>
                        {formatTime(item.createdAt)}
                    </Text>
                </View>
            </View>
        );
    };

    const renderMember = ({ item }) => (
        <View style={styles.memberItem}>
            <Avatar
                size='small'
                source={{ uri: `https://ui-avatars.com/api/?name=${item.fullName}&background=3366FF&color=fff` }}
            />
            <Text category='s2' style={styles.memberName}>{item.fullName}</Text>
            <Text category='c1' appearance='hint'>{item.role}</Text>
        </View>
    );

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
                    ←
                </Button>
                <Avatar
                    size='medium'
                    source={{ uri: `https://ui-avatars.com/api/?name=${groupName}&background=00AA75&color=fff` }}
                />
                <View style={styles.headerInfo}>
                    <Text category='h6' style={styles.headerName}>{groupName}</Text>
                    <Text category='c1' style={styles.headerStatus}>
                        {group?.members?.length || 0} members
                    </Text>
                </View>
                <Button
                    appearance='ghost'
                    status='control'
                    size='small'
                    onPress={() => setShowMembers(!showMembers)}
                >
                    👥
                </Button>
            </View>

            {/* Members Panel */}
            {showMembers && group?.members && (
                <Card style={styles.membersCard}>
                    <Text category='h6' style={styles.membersTitle}>Group Members</Text>
                    <FlatList
                        data={group.members}
                        renderItem={renderMember}
                        keyExtractor={item => String(item.id)}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                    />
                </Card>
            )}

            {loading ? (
                <View style={styles.loadingContainer}>
                    <Spinner size='giant' />
                </View>
            ) : (
                <FlatList
                    data={messages}
                    renderItem={renderMessage}
                    keyExtractor={item => String(item.id)}
                    contentContainerStyle={styles.messagesList}
                    inverted={false}
                />
            )}

            {/* Input */}
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={0}
            >
                <View style={styles.inputContainer}>
                    <Input
                        placeholder='Type a message...'
                        value={newMessage}
                        onChangeText={setNewMessage}
                        style={styles.input}
                        size='large'
                        multiline
                    />
                    <Button
                        style={styles.sendButton}
                        status='success'
                        disabled={!newMessage.trim() || sending}
                        onPress={sendMessage}
                    >
                        {sending ? '...' : '→'}
                    </Button>
                </View>
            </KeyboardAvoidingView>
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
    },
    headerInfo: {
        marginLeft: 12,
        flex: 1,
    },
    headerName: {
        color: '#FFFFFF',
    },
    headerStatus: {
        color: 'rgba(255,255,255,0.8)',
    },
    membersCard: {
        margin: 16,
        borderRadius: 12,
    },
    membersTitle: {
        marginBottom: 12,
    },
    memberItem: {
        alignItems: 'center',
        marginRight: 16,
    },
    memberName: {
        marginTop: 4,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    messagesList: {
        padding: 16,
    },
    messageRow: {
        flexDirection: 'row',
        marginBottom: 12,
        alignItems: 'flex-end',
    },
    messageRowMe: {
        justifyContent: 'flex-end',
    },
    messageRowOther: {
        justifyContent: 'flex-start',
    },
    messageAvatar: {
        marginRight: 8,
    },
    messageBubble: {
        maxWidth: '75%',
        padding: 12,
        borderRadius: 16,
    },
    bubbleMe: {
        backgroundColor: '#00E096',
        borderBottomRightRadius: 4,
    },
    bubbleOther: {
        backgroundColor: '#F0F0F0',
        borderBottomLeftRadius: 4,
    },
    senderName: {
        marginBottom: 4,
    },
    messageTextMe: {
        color: '#FFFFFF',
    },
    messageTextOther: {
        color: '#333333',
    },
    messageTime: {
        marginTop: 4,
    },
    timeMe: {
        color: 'rgba(255,255,255,0.7)',
        textAlign: 'right',
    },
    timeOther: {
        color: '#999999',
    },
    inputContainer: {
        flexDirection: 'row',
        padding: 12,
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
        backgroundColor: '#FFFFFF',
        alignItems: 'flex-end',
    },
    input: {
        flex: 1,
        marginRight: 8,
        borderRadius: 20,
    },
    sendButton: {
        borderRadius: 20,
        paddingHorizontal: 16,
    },
});
