import { useState, useEffect } from 'react';
import {
    Box, Typography, Button, Paper, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Chip, IconButton, Dialog,
    DialogTitle, DialogContent, TextField, DialogActions, Select, MenuItem, InputLabel, FormControl
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import api from '../../lib/api';

export const UserList = () => {
    const [users, setUsers] = useState([]);
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({ fullName: '', email: '', password: '', role: 'USER' });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await api.get('/users');
            setUsers(res.data);
        } catch (e) {
            console.error("Failed to fetch users", e);
        }
    };

    const handleSave = async () => {
        // Need to implement createUser in backend first properly exposed
        alert("Create User functionality requires backend update");
        setOpen(false);
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4">User Management</Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)}>Add User</Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Full Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Role</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell align="center">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user: any) => (
                            <TableRow key={user.id}>
                                <TableCell>{user.fullName}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell><Chip label={user.role} color={user.role === 'ADMIN' ? 'error' : 'primary'} size="small" /></TableCell>
                                <TableCell><Chip label={user.isActive ? 'Active' : 'Inactive'} color="success" size="small" variant="outlined" /></TableCell>
                                <TableCell align="center">
                                    <IconButton size="small" color="error"><DeleteIcon /></IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>New User</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1, minWidth: 300 }}>
                        <TextField label="Full Name" fullWidth value={formData.fullName} onChange={e => setFormData({ ...formData, fullName: e.target.value })} />
                        <TextField label="Email" fullWidth value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                        <TextField label="Password" type="password" fullWidth value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} />
                        <FormControl fullWidth>
                            <InputLabel>Role</InputLabel>
                            <Select value={formData.role} label="Role" onChange={(e) => setFormData({ ...formData, role: e.target.value })}>
                                <MenuItem value="USER">User</MenuItem>
                                <MenuItem value="ADMIN">Admin</MenuItem>
                                <MenuItem value="MANAGER">Manager</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleSave}>Create</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};
