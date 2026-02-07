import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Dialog, DialogContent, TextField, List, ListItem,
    ListItemButton, ListItemIcon, ListItemText, Typography,
    Box, InputAdornment, useTheme
} from '@mui/material';
import {
    Search as SearchIcon,
    Dashboard as DashboardIcon,
    People as PeopleIcon,
    Settings as SettingsIcon,
    ShoppingCart as ShoppingCartIcon,
    Inventory as InventoryIcon,
    Factory as FactoryIcon,
    Business as BusinessIcon,
    ExitToApp as LogoutIcon,
    ArrowForwardIos as ArrowIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

const actions = [
    { id: 'home', label: 'Go to Dashboard', icon: <DashboardIcon />, path: '/admin' },
    { id: 'pos', label: 'Open POS / Sales', icon: <ShoppingCartIcon />, path: '/pos' },
    { id: 'inventory', label: 'Manage Inventory', icon: <InventoryIcon />, path: '/inventory' },
    { id: 'employees', label: 'Manage Employees', icon: <PeopleIcon />, path: '/employees' },
    { id: 'manufacturing', label: 'Manufacturing', icon: <FactoryIcon />, path: '/work-orders' },
    { id: 'platform', label: 'Platform Admin', icon: <BusinessIcon />, path: '/super-admin' },
    { id: 'settings', label: 'Settings', icon: <SettingsIcon />, path: '/settings' },
    { id: 'logout', label: 'Log Out', icon: <LogoutIcon />, path: '/logout' }, // Handled specially
];

export const CommandPalette = () => {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const navigate = useNavigate();
    const theme = useTheme();

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setOpen((prev) => !prev);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const filteredActions = actions.filter(
        (action) => action.label.toLowerCase().includes(query.toLowerCase())
    );

    useEffect(() => {
        setSelectedIndex(0);
    }, [query]);

    // Keyboard navigation within the list
    useEffect(() => {
        if (!open) return;
        const handleNav = (e: KeyboardEvent) => {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedIndex((prev) => (prev + 1) % filteredActions.length);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedIndex((prev) => (prev - 1 + filteredActions.length) % filteredActions.length);
            } else if (e.key === 'Enter') {
                e.preventDefault();
                if (filteredActions[selectedIndex]) {
                    handleSelect(filteredActions[selectedIndex]);
                }
            }
        };
        window.addEventListener('keydown', handleNav);
        return () => window.removeEventListener('keydown', handleNav);
    }, [open, filteredActions, selectedIndex]);

    const handleSelect = (action: any) => {
        setOpen(false);
        if (action.id === 'logout') {
            localStorage.clear();
            navigate('/login');
        } else {
            navigate(action.path);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={() => setOpen(false)}
            fullWidth
            maxWidth="sm"
            PaperProps={{
                sx: {
                    borderRadius: 3,
                    bgcolor: 'rgba(255, 255, 255, 0.85)',
                    backdropFilter: 'blur(20px)',
                    boxShadow: theme.shadows[20],
                    overflow: 'hidden'
                }
            }}
            transitionDuration={200}
        >
            <Box sx={{ p: 2, pb: 0 }}>
                <TextField
                    autoFocus
                    fullWidth
                    placeholder="Type a command or search..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon color="action" />
                            </InputAdornment>
                        ),
                        disableUnderline: true,
                        sx: { fontSize: '1.2rem', fontWeight: 500 }
                    }}
                    variant="standard"
                />
            </Box>
            <DialogContent sx={{ p: 1, maxHeight: 400 }}>
                <List>
                    {filteredActions.length > 0 ? (
                        filteredActions.map((action, index) => (
                            <ListItem key={action.id} disablePadding>
                                <ListItemButton
                                    onClick={() => handleSelect(action)}
                                    selected={index === selectedIndex}
                                    sx={{
                                        borderRadius: 2,
                                        mb: 0.5,
                                        '&.Mui-selected': {
                                            bgcolor: 'primary.light',
                                            color: 'primary.contrastText',
                                            '& .MuiListItemIcon-root': { color: 'primary.contrastText' },
                                            '&:hover': { bgcolor: 'primary.main' }
                                        },
                                        '&:hover': {
                                            bgcolor: 'rgba(0,0,0,0.05)'
                                        }
                                    }}
                                >
                                    <ListItemIcon sx={{ minWidth: 40 }}>{action.icon}</ListItemIcon>
                                    <ListItemText primary={action.label} />
                                    {index === selectedIndex && (
                                        <ArrowIcon fontSize="small" sx={{ opacity: 0.7 }} />
                                    )}
                                    <Box sx={{ ml: 2, opacity: 0.5, fontSize: '0.75rem', border: '1px solid #ccc', borderRadius: 1, px: 0.5 }}>
                                        Create
                                    </Box>
                                </ListItemButton>
                            </ListItem>
                        ))
                    ) : (
                        <Box sx={{ p: 3, textAlign: 'center', opacity: 0.6 }}>
                            <Typography>No matching commands found</Typography>
                        </Box>
                    )}
                </List>
                <Box sx={{
                    borderTop: '1px solid rgba(0,0,0,0.1)',
                    mt: 1, pt: 1,
                    display: 'flex', justifyContent: 'space-between',
                    px: 1, color: 'text.secondary', fontSize: '0.75rem'
                }}>
                    <span><strong>↑↓</strong> to navigate</span>
                    <span><strong>↵</strong> to select</span>
                    <span><strong>esc</strong> to close</span>
                </Box>
            </DialogContent>
        </Dialog>
    );
};
