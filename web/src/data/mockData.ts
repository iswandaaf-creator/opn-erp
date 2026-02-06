export interface User {
    id: string;
    name: string;
    avatar: string; // Color code or image URL
    role: string;
    status: 'online' | 'offline' | 'away';
}

export interface Message {
    id: string;
    senderId: string;
    content: string;
    timestamp: number;
    isMe: boolean;
    type: 'text' | 'image' | 'file';
    fileUrl?: string; // For attachments
}

export interface Conversation {
    id: string;
    name: string;
    lastMessage: string;
    timestamp: number;
    unreadCount: number;
    members: User[];
    isGroup: boolean;
    messages: Message[];
}

export interface Email {
    id: string;
    sender: string;
    subject: string;
    body: string;
    date: string;
    read: boolean;
    starred: boolean;
    folder: 'inbox' | 'sent' | 'drafts' | 'trash';
    attachments?: { name: string; type: string }[];
}

const currentUser: User = { id: 'me', name: 'You', avatar: '#1976D2', role: 'OWNER', status: 'online' };

export const mockUsers: User[] = [
    { id: '1', name: 'Alice Owner', avatar: '#1976D2', role: 'OWNER', status: 'online' },
    { id: '2', name: 'Bob Manager', avatar: '#9C27B0', role: 'MANAGER', status: 'offline' },
    { id: '3', name: 'Charlie Cashier', avatar: '#4CAF50', role: 'CASHIER', status: 'online' },
    { id: '4', name: 'David Kitchen', avatar: '#FF9800', role: 'KITCHEN', status: 'away' },
    { id: '5', name: 'Tom Staff', avatar: '#00BCD4', role: 'STAFF', status: 'online' },
];

export const mockConversations: Conversation[] = [
    {
        id: '1',
        name: 'General Management',
        lastMessage: 'Weekly report is due today',
        timestamp: Date.now() - 1000 * 60 * 5, // 5 mins ago
        unreadCount: 2,
        isGroup: true,
        members: [mockUsers[0], mockUsers[1]],
        messages: [
            { id: 'm1', senderId: '2', content: 'Hi everyone, how is the report?', timestamp: Date.now() - 1000 * 60 * 60, isMe: false, type: 'text' },
            { id: 'm2', senderId: 'me', content: 'Almost done, sending it shortly.', timestamp: Date.now() - 1000 * 60 * 30, isMe: true, type: 'text' },
            { id: 'm3', senderId: '2', content: 'Great, thanks!', timestamp: Date.now() - 1000 * 60 * 5, isMe: false, type: 'text' },
        ]
    },
    {
        id: '2',
        name: 'Kitchen Staff',
        lastMessage: 'New menu items added',
        timestamp: Date.now() - 1000 * 60 * 60 * 2, // 2 hours ago
        unreadCount: 0,
        isGroup: true,
        members: [mockUsers[3], mockUsers[4]],
        messages: [
            { id: 'm1', senderId: '4', content: 'We need to update the menu.', timestamp: Date.now() - 1000 * 60 * 60 * 3, isMe: false, type: 'text' },
            { id: 'm2', senderId: 'me', content: 'Updated in the system.', timestamp: Date.now() - 1000 * 60 * 60 * 2, isMe: true, type: 'text' },
        ]
    },
    {
        id: '3',
        name: 'Bob Manager',
        lastMessage: 'Can we meet at 3 PM?',
        timestamp: Date.now() - 1000 * 60 * 60 * 24, // 1 day ago
        unreadCount: 0,
        isGroup: false,
        members: [mockUsers[1]],
        messages: [
            { id: 'm1', senderId: '2', content: 'Can we meet at 3 PM?', timestamp: Date.now() - 1000 * 60 * 60 * 24, isMe: false, type: 'text' },
        ]
    }
];

export const mockEmails: Email[] = [
    {
        id: 'e1',
        sender: 'bob@openerp.com',
        subject: 'Weekly Sales Report',
        body: 'Here is the sales report for the last week. We saw a 15% increase in revenue.',
        date: '10:30 AM',
        read: false,
        starred: true,
        folder: 'inbox',
        attachments: [{ name: 'report.pdf', type: 'pdf' }]
    },
    {
        id: 'e2',
        sender: 'support@vendor.com',
        subject: 'Invoice #4432',
        body: 'Please find attached the invoice for your recent order.',
        date: 'Yesterday',
        read: true,
        starred: false,
        folder: 'inbox'
    },
    {
        id: 'e3',
        sender: 'me',
        subject: 'Meeting Notes',
        body: 'Notes from today\'s staff meeting...',
        date: 'Yesterday',
        read: true,
        starred: false,
        folder: 'sent'
    },
    {
        id: 'e4',
        sender: 'me',
        subject: 'Draft: Q3 Strategy',
        body: 'Points to discuss: 1. Expansion... 2. Marketing...',
        date: '2 days ago',
        read: true,
        starred: false,
        folder: 'drafts'
    }
];
