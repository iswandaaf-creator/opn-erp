import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, FlatList, KeyboardAvoidingView, Platform, StatusBar } from 'react-native';
import { Layout, Text, Input, Button, Avatar, Spinner } from '@ui-kitten/components';
import api from '../services/api';
import { getUser } from '../services/auth';

export default function ChatScreen({ route, navigation }) {
    const { partnerId, partnerName } = route.params || {};
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const flatListRef = React.useRef(null);

    const fetchMessages = useCallback(async () => {
        if (!partnerId) return;
        setLoading(true);
        try {
            const [msgRes, user] = await Promise.all([
                api.get(`/chat/messages/${partnerId}`),
                getUser()
            ]);
            setMessages(msgRes.data || []);
            setCurrentUser(user);
        } catch (error) {
            console.error('Failed to fetch messages:', error);
        } finally {
            setLoading(false);
        }
    }, [partnerId]);

    useEffect(() => {
        fetchMessages();
        // Poll for new messages every 5 seconds
        const interval = setInterval(fetchMessages, 5000);
        return () => clearInterval(interval);
    }, [fetchMessages]);

    const sendMessage = async () => {
        if (!newMessage.trim() || sending) return;

        setSending(true);
        try {
            await api.post('/chat/messages', {
                receiverId: partnerId,
                content: newMessage.trim()
            });
            setNewMessage('');
            fetchMessages();
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

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' });
    };

    // Group messages by date
    const groupedMessages = messages.reduce((acc, msg) => {
        const dateKey = formatDate(msg.createdAt);
        if (!acc[dateKey]) {
            acc[dateKey] = [];
        }
        acc[dateKey].push(msg);
        return acc;
    }, {});

    const renderMessage = ({ item }) => {
        const isMe = item.senderId === currentUser?.id;

        return (
            <View style={[styles.messageRow, isMe ? styles.messageRowMe : styles.messageRowOther]}>
                {!isMe && (
                    <Avatar
                        size='small'
                        source={{ uri: `https://ui-avatars.com/api/?name=${partnerName}&background=3366FF&color=fff` }}
                        style={styles.messageAvatar}
                    />
                )}
                <View style={[styles.messageBubble, isMe ? styles.bubbleMe : styles.bubbleOther]}>
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

    const renderDateSeparator = (date) => (
        <View style={styles.dateSeparator}>
            <Text category='c1' appearance='hint'>{date}</Text>
        </View>
    );

    return (
        <Layout style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#3366FF" />

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
                    source={{ uri: `https://ui-avatars.com/api/?name=${partnerName}&background=0D47A1&color=fff` }}
                />
                <View style={styles.headerInfo}>
                    <Text category='h6' style={styles.headerName}>{partnerName}</Text>
                    <Text category='c1' style={styles.headerStatus}>Online</Text>
                </View>
            </View>

            {loading ? (
                <View style={styles.loadingContainer}>
                    <Spinner size='giant' />
                </View>
            ) : (
                <FlatList
                    ref={flatListRef}
                    data={messages}
                    renderItem={renderMessage}
                    keyExtractor={item => String(item.id)}
                    contentContainerStyle={styles.messagesList}
                    inverted={false}
                    onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
                    onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
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
        backgroundColor: '#3366FF',
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    messagesList: {
        padding: 16,
    },
    dateSeparator: {
        alignItems: 'center',
        marginVertical: 16,
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
        backgroundColor: '#3366FF',
        borderBottomRightRadius: 4,
    },
    bubbleOther: {
        backgroundColor: '#F0F0F0',
        borderBottomLeftRadius: 4,
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
