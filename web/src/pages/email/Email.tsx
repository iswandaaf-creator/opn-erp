import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    List,
    ListItemButton,
    ListItemText,
    ListItemIcon,
    ListItemAvatar,
    Avatar,
    IconButton,
    Divider,
    Fab,
    Dialog,
    TextField,
    Button,
    AppBar,
    Toolbar,
    useTheme,
    useMediaQuery,
    Chip
} from '@mui/material';
import {
    Inbox as InboxIcon,
    Send as SendIcon,
    Drafts as DraftsIcon,
    Delete as DeleteIcon,
    Star as StarIcon,
    StarBorder as StarBorderIcon,
    Add as AddIcon,
    ArrowBack as ArrowBackIcon,
    AttachFile as AttachFileIcon,
    Reply as ReplyIcon,
    Forward as ForwardIcon,
    MoreVert as MoreVertIcon
} from '@mui/icons-material';
import type { Email } from '../../data/mockData'; // Interface only
import { emailService } from '../../services/emailService';
import { notificationService } from '../../services/notificationService';
import FilePicker from '../../components/FilePicker';

const EmailPage = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const [emails, setEmails] = useState<Email[]>([]);
    const [currentFolder, setCurrentFolder] = useState<'inbox' | 'sent' | 'drafts' | 'trash'>('inbox');
    const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
    const [composeOpen, setComposeOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        loadEmails();
    }, [currentFolder]);

    const loadEmails = async () => {
        try {
            let data: Email[] = [];
            switch (currentFolder) {
                case 'inbox': data = await emailService.getInbox(); break;
                case 'sent': data = await emailService.getSent(); break;
                case 'drafts': data = await emailService.getDrafts(); break;
                case 'trash': data = await emailService.getTrash(); break;
            }
            setEmails(data);
        } catch (error) {
            console.error("Failed to load emails", error);
        }
    };

    const handleSendEmail = async (to: string, subject: string, body: string, attachments: File[]) => {
        try {
            await emailService.sendEmail(to, subject, body, attachments);
            setComposeOpen(false);
            notificationService.showNotification('Email Sent', { body: `To: ${to}` });
            if (currentFolder === 'sent') loadEmails();
        } catch (error) {
            console.error("Failed to send email", error);
        }
    };

    const handleMarkAsRead = async (email: Email) => {
        if (!email.read) {
            await emailService.markAsRead(email.id);
            // Optimistic update
            setEmails(prev => prev.map(e => e.id === email.id ? { ...e, read: true } : e));
        }
    };

    const handleToggleStar = async (email: Email) => {
        await emailService.toggleStar(email.id);
        setEmails(prev => prev.map(e => e.id === email.id ? { ...e, starred: !e.starred } : e));
    };

    // Sidebar & List Components (Simplified for brevity but maintaining structure)
    const xSidebar = (
        <Box sx={{ height: '100%', borderRight: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
            <Box p={2}>
                <Fab variant="extended" color="primary" onClick={() => setComposeOpen(true)} sx={{ boxShadow: 2, width: '100%' }}>
                    <AddIcon sx={{ mr: 1 }} /> Compose
                </Fab>
            </Box>
            <List>
                {[{ id: 'inbox', icon: <InboxIcon /> }, { id: 'sent', icon: <SendIcon /> }, { id: 'drafts', icon: <DraftsIcon /> }, { id: 'trash', icon: <DeleteIcon /> }].map((item: any) => (
                    <ListItemButton
                        key={item.id}
                        selected={currentFolder === item.id}
                        onClick={() => { setCurrentFolder(item.id); setSelectedEmail(null); }}
                    >
                        <ListItemIcon>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.id.charAt(0).toUpperCase() + item.id.slice(1)} />
                    </ListItemButton>
                ))}
            </List>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex', height: 'calc(100vh - 100px)', bgcolor: 'background.paper', borderRadius: 2, overflow: 'hidden', boxShadow: 3 }}>
            <Box sx={{ width: isMobile ? '100%' : 240, display: isMobile && selectedEmail ? 'none' : 'block' }}>
                {xSidebar}
            </Box>
            <Box sx={{ width: isMobile ? '100%' : 320, display: isMobile && selectedEmail ? 'none' : 'block', borderRight: 1, borderColor: 'divider' }}>
                <List>
                    {emails.map(email => (
                        <ListItemButton
                            key={email.id}
                            selected={selectedEmail?.id === email.id}
                            onClick={() => { setSelectedEmail(email); handleMarkAsRead(email); }}
                        >
                            <ListItemAvatar><Avatar>{email.sender[0]}</Avatar></ListItemAvatar>
                            <ListItemText primary={email.subject} secondary={email.sender} />
                            <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleToggleStar(email); }}>
                                {email.starred ? <StarIcon color="warning" /> : <StarBorderIcon />}
                            </IconButton>
                        </ListItemButton>
                    ))}
                </List>
            </Box>
            <Box sx={{ flexGrow: 1, display: isMobile && !selectedEmail ? 'none' : 'block' }}>
                {selectedEmail ? (
                    <Box p={3}>
                        <Typography variant="h5">{selectedEmail.subject}</Typography>
                        <Typography color="text.secondary">{selectedEmail.sender}</Typography>
                        <Divider sx={{ my: 2 }} />
                        <Typography>{selectedEmail.body}</Typography>
                    </Box>
                ) : (
                    <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                        <Typography>Select an email</Typography>
                    </Box>
                )}
            </Box>

            <Dialog open={composeOpen} onClose={() => setComposeOpen(false)} fullWidth maxWidth="md">
                <Box p={3}>
                    <Typography variant="h6" sx={{ mb: 2 }}>New Message</Typography>
                    <TextField
                        fullWidth
                        label="To"
                        placeholder="recipient@example.com"
                        sx={{ mb: 2 }}
                        id="compose-to"
                    />
                    <TextField
                        fullWidth
                        label="Subject"
                        placeholder="Email subject"
                        sx={{ mb: 2 }}
                        id="compose-subject"
                    />
                    <TextField
                        fullWidth
                        label="Message"
                        multiline
                        rows={8}
                        placeholder="Write your message..."
                        sx={{ mb: 2 }}
                        id="compose-body"
                    />
                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                        <Button variant="outlined" onClick={() => setComposeOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => {
                                const to = (document.getElementById('compose-to') as HTMLInputElement)?.value || '';
                                const subject = (document.getElementById('compose-subject') as HTMLInputElement)?.value || '';
                                const body = (document.getElementById('compose-body') as HTMLTextAreaElement)?.value || '';
                                if (to && subject) {
                                    handleSendEmail(to, subject, body, []);
                                }
                            }}
                        >
                            Send
                        </Button>
                    </Box>
                </Box>
            </Dialog>
        </Box>
    );
};

export default EmailPage;
