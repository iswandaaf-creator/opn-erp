import React, { useState, useEffect, useRef } from 'react';
import {
    Box,
    Paper,
    Typography,
    List,
    ListItemButton,
    ListItemAvatar,
    ListItemText,
    Avatar,
    TextField,
    IconButton,
    Divider,
    Badge,
    useTheme,
    useMediaQuery,
    AppBar,
    Toolbar
} from '@mui/material';
import {
    Send as SendIcon,
    Search as SearchIcon,
    ArrowBack as ArrowBackIcon,
    MoreVert as MoreVertIcon,
    Phone as PhoneIcon,
    VideoCall as VideoCallIcon
} from '@mui/icons-material';
import type { Message, Conversation } from '../../data/mockData';
import { notificationService } from '../../services/notificationService';
import { chatService } from '../../services/chatService';
import FilePicker from '../../components/FilePicker';

const Chat = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
    const [messageText, setMessageText] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Get current user from local storage
    const userStr = localStorage.getItem('user');
    const currentUser = userStr ? JSON.parse(userStr) : { id: 'me' };

    useEffect(() => {
        // Initialize Chat Service
        chatService.initialize(currentUser.id);

        // Fetch initial conversations
        loadConversations();

        // Listen for new messages
        chatService.onNewMessage((message) => {
            // Update conversations state
            setConversations(prev => {
                const existingConv = prev.find(c =>
                    c.id === (message.isMe ? message.senderId : message.senderId) // simplified logic, normally depends on partner
                );

                if (existingConv) {
                    return prev.map(c => {
                        if (c.id === existingConv.id) {
                            return {
                                ...c,
                                messages: [...c.messages, message],
                                lastMessage: message.content,
                                timestamp: message.timestamp,
                                unreadCount: message.isMe ? 0 : c.unreadCount + 1
                            };
                        }
                        return c;
                    });
                } else {
                    // New conversation (refresh list or add)
                    loadConversations();
                    return prev;
                }
            });

            // Notification
            if (!message.isMe) {
                notificationService.notifyNewMessage('New Message', message.content);
            }
        });

        chatService.onUserStatus((status) => {
            // Handle online status updates
            // For now just console log or simple re-fetch
            console.log('User status update:', status);
        });

        return () => {
            chatService.disconnect();
        };
    }, []);

    const loadConversations = async () => {
        try {
            const data = await chatService.getConversations();
            setConversations(data);
        } catch (error) {
            console.error("Failed to load conversations", error);
        }
    };

    const selectedChat = conversations.find(c => c.id === selectedChatId);

    useEffect(() => {
        if (selectedChatId) {
            // Load messages for selected chat
            chatService.getMessages(selectedChatId).then(msgs => {
                setConversations(prev => prev.map(c => {
                    if (c.id === selectedChatId) {
                        return { ...c, messages: msgs, unreadCount: 0 };
                    }
                    return c;
                }));
            });
        }
    }, [selectedChatId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [selectedChat?.messages]);

    const handleSendMessage = async () => {
        if (!messageText.trim() || !selectedChatId) return;

        try {
            const tempId = Date.now().toString();
            // Optimistic update
            const newMessage: Message = {
                id: tempId,
                senderId: currentUser.id,
                content: messageText,
                timestamp: Date.now(),
                isMe: true,
                type: 'text'
            };

            setConversations(prev => prev.map(c => {
                if (c.id === selectedChatId) {
                    return {
                        ...c,
                        messages: [...c.messages, newMessage],
                        lastMessage: newMessage.content,
                        timestamp: newMessage.timestamp
                    };
                }
                return c;
            }));

            setMessageText('');

            await chatService.sendMessage(selectedChatId, newMessage.content);
            // Real update comes via socket or simple re-fetch if needed
        } catch (error) {
            console.error("Failed to send message", error);
            // Revert optimistic update ideally
        }
    };

    const handleFileSelected = (file: File) => {
        // Implement file upload logic here
    };

    const formatTime = (timestamp: number) => {
        return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const Sidebar = (
        <Box sx={{ width: '100%', height: '100%', borderRight: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
            <Box p={2}>
                <TextField
                    fullWidth
                    placeholder="Search chats..."
                    size="small"
                    InputProps={{
                        startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />
                    }}
                />
            </Box>
            <Divider />
            <List sx={{ overflow: 'auto', height: 'calc(100% - 70px)' }}>
                {conversations.map(chat => (
                    <React.Fragment key={chat.id}>
                        <ListItemButton
                            selected={selectedChatId === chat.id}
                            onClick={() => setSelectedChatId(chat.id)}
                            sx={{
                                borderLeft: selectedChatId === chat.id ? 4 : 0,
                                borderColor: 'primary.main',
                                bgcolor: selectedChatId === chat.id ? 'action.selected' : 'inherit'
                            }}
                        >
                            <ListItemAvatar>
                                <Badge
                                    color="success"
                                    variant="dot"
                                    invisible={false} // Use real status later
                                    overlap="circular"
                                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                >
                                    <Avatar>{chat.name[0]}</Avatar>
                                </Badge>
                            </ListItemAvatar>
                            <ListItemText
                                primary={
                                    <Box display="flex" justifyContent="space-between">
                                        <Typography variant="subtitle2" noWrap sx={{ maxWidth: 140 }}>
                                            {chat.name}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {formatTime(chat.timestamp)}
                                        </Typography>
                                    </Box>
                                }
                                secondary={
                                    <Box display="flex" justifyContent="space-between">
                                        <Typography variant="body2" color="text.secondary" noWrap sx={{ maxWidth: 180 }}>
                                            {chat.lastMessage}
                                        </Typography>
                                        {chat.unreadCount > 0 && (
                                            <Badge badgeContent={chat.unreadCount} color="primary" sx={{ ml: 1 }} />
                                        )}
                                    </Box>
                                }
                            />
                        </ListItemButton>
                        <Divider component="li" variant="inset" />
                    </React.Fragment>
                ))}
            </List>
        </Box>
    );

    const ChatArea = selectedChat ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <AppBar position="static" color="default" elevation={1} sx={{ bgcolor: 'background.paper' }}>
                <Toolbar>
                    {isMobile && (
                        <IconButton edge="start" onClick={() => setSelectedChatId(null)} sx={{ mr: 1 }}>
                            <ArrowBackIcon />
                        </IconButton>
                    )}
                    <Avatar sx={{ mr: 2 }}>{selectedChat.name[0]}</Avatar>
                    <Box flexGrow={1}>
                        <Typography variant="subtitle1" fontWeight="bold">
                            {selectedChat.name}
                        </Typography>
                    </Box>
                    <IconButton><PhoneIcon /></IconButton>
                    <IconButton><VideoCallIcon /></IconButton>
                    <IconButton><MoreVertIcon /></IconButton>
                </Toolbar>
            </AppBar>
            <Box sx={{ flexGrow: 1, p: 2, overflowY: 'auto', bgcolor: 'action.hover' }}>
                {selectedChat.messages.map((msg) => (
                    <Box
                        key={msg.id}
                        sx={{
                            display: 'flex',
                            justifyContent: msg.isMe ? 'flex-end' : 'flex-start',
                            mb: 2
                        }}
                    >
                        <Paper
                            elevation={1}
                            sx={{
                                p: 1.5,
                                bgcolor: msg.isMe ? 'primary.main' : 'background.paper',
                                color: msg.isMe ? 'primary.contrastText' : 'text.primary',
                                borderRadius: 2
                            }}
                        >
                            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>{msg.content}</Typography>
                        </Paper>
                    </Box>
                ))}
                <div ref={messagesEndRef} />
            </Box>
            <Paper elevation={3} sx={{ p: 2 }}>
                <Box display="flex" alignItems="center">
                    <FilePicker onFileSelected={handleFileSelected} />
                    <TextField
                        fullWidth
                        size="small"
                        placeholder="Type..."
                        value={messageText}
                        onChange={e => setMessageText(e.target.value)}
                        onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
                        sx={{ mx: 1 }}
                    />
                    <IconButton color="primary" onClick={handleSendMessage}><SendIcon /></IconButton>
                </Box>
            </Paper>
        </Box>
    ) : (
        <Box display="flex" justifyContent="center" alignItems="center" height="100%">
            <Typography color="text.secondary">Select a conversation</Typography>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex', height: 'calc(100vh - 100px)', bgcolor: 'background.paper', borderRadius: 2, overflow: 'hidden', boxShadow: 3 }}>
            <Box sx={{ width: isMobile ? '100%' : 350, display: isMobile && selectedChatId ? 'none' : 'block' }}>
                {Sidebar}
            </Box>
            <Box sx={{ flexGrow: 1, display: isMobile && !selectedChatId ? 'none' : 'block' }}>
                {ChatArea}
            </Box>
        </Box>
    );
};

export default Chat;
