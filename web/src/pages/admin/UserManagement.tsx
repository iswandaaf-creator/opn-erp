import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Button, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Chip, IconButton, Dialog, DialogTitle,
    DialogContent, DialogActions, TextField, Select, MenuItem, FormControl, InputLabel
} from '@mui/material';
import { Add, Edit, Delete, Security } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

// Mock User Data Type
interface User {
    id: string;
    email: string;
    role: string;
    name: string;
}

const UserManagement: React.FC = () => {
    const { t } = useTranslation();
    const [users, setUsers] = useState<User[]>([]);
    const [open, setOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentUser, setCurrentUser] = useState<Partial<User>>({});

    // Simulating fetching users from localStorage or API
    useEffect(() => {
        // In a real app, fetch from API
        const storedUsers = JSON.parse(localStorage.getItem('users_db') || '[]');
        if (storedUsers.length === 0) {
            // Seed some data if empty
            const seed = [
                { id: '1', email: 'owner@openerp.com', role: 'OWNER', name: 'Big Boss' },
                { id: '2', email: 'manager@openerp.com', role: 'MANAGER', name: 'Ops Manager' },
                { id: '3', email: 'staff@openerp.com', role: 'STAFF', name: 'Staff Member' }
            ];
            localStorage.setItem('users_db', JSON.stringify(seed));
            setUsers(seed);
        } else {
            setUsers(storedUsers);
        }
    }, []);

    const handleSave = () => {
        let updatedUsers = [...users];
        if (editMode) {
            updatedUsers = users.map(u => u.id === currentUser.id ? { ...u, ...currentUser } as User : u);
        } else {
            const newUser = { ...currentUser, id: Date.now().toString() } as User;
            updatedUsers.push(newUser);
        }
        setUsers(updatedUsers);
        localStorage.setItem('users_db', JSON.stringify(updatedUsers));
        setOpen(false);
    };

    const handleDelete = (id: string) => {
        if (window.confirm(t('common.deleteConfirm') || 'Are you sure?')) {
            const updatedUsers = users.filter(u => u.id !== id);
            setUsers(updatedUsers);
            localStorage.setItem('users_db', JSON.stringify(updatedUsers));
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4" fontWeight="bold">
                    {t('common.users') || 'User Management'}
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => { setEditMode(false); setCurrentUser({ role: 'STAFF' }); setOpen(true); }}
                >
                    {t('common.add') || 'Add User'}
                </Button>
            </Box>

            <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
                <Table>
                    <TableHead sx={{ bgcolor: 'background.default' }}>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Role</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id} hover>
                                <TableCell>{user.name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={user.role}
                                        color={user.role === 'OWNER' ? 'error' : user.role === 'MANAGER' ? 'primary' : 'default'}
                                        size="small"
                                        icon={<Security fontSize="small" />}
                                    />
                                </TableCell>
                                <TableCell align="right">
                                    <IconButton size="small" onClick={() => { setEditMode(true); setCurrentUser(user); setOpen(true); }}>
                                        <Edit fontSize="small" />
                                    </IconButton>
                                    <IconButton size="small" color="error" onClick={() => handleDelete(user.id)}>
                                        <Delete fontSize="small" />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Add/Edit Dialog */}
            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>{editMode ? 'Edit User' : 'Add New User'}</DialogTitle>
                <DialogContent sx={{ pt: 2 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                        <TextField
                            label="Name"
                            fullWidth
                            value={currentUser.name || ''}
                            onChange={e => setCurrentUser({ ...currentUser, name: e.target.value })}
                        />
                        <TextField
                            label="Email"
                            fullWidth
                            value={currentUser.email || ''}
                            onChange={e => setCurrentUser({ ...currentUser, email: e.target.value })}
                        />
                        {!editMode && (
                            <TextField
                                label="Password"
                                type="password"
                                fullWidth
                                onChange={() => { }} // Mock
                            />
                        )}
                        <FormControl fullWidth>
                            <InputLabel>Role</InputLabel>
                            <Select
                                value={currentUser.role || 'STAFF'}
                                label="Role"
                                onChange={e => setCurrentUser({ ...currentUser, role: e.target.value })}
                            >
                                <MenuItem value="OWNER">Owner</MenuItem>
                                <MenuItem value="SUPER_ADMIN">Super Admin</MenuItem>
                                <MenuItem value="MANAGER">Manager</MenuItem>
                                <MenuItem value="STAFF">Staff</MenuItem>
                                <MenuItem value="CASHIER">Cashier</MenuItem>
                                <MenuItem value="INVENTORY">Inventory</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>{t('common.cancel') || 'Cancel'}</Button>
                    <Button onClick={handleSave} variant="contained">{t('common.save') || 'Save'}</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default UserManagement;
