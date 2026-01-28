import { useState, useEffect } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Chip, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import api from '../../lib/api';

export const CRM = () => {
    const [customers, setCustomers] = useState([]);
    const [openForCreate, setOpenForCreate] = useState(false);
    const [newItem, setNewItem] = useState({ name: '', email: '', phone: '', status: 'LEAD' });

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            const res = await api.get('/crm/customers');
            setCustomers(res.data);
        } catch (e) {
            console.error("Failed to load customers", e);
        }
    };

    const handleCreate = async () => {
        try {
            await api.post('/crm/customers', newItem);
            setOpenForCreate(false);
            fetchCustomers();
            setNewItem({ name: '', email: '', phone: '', status: 'LEAD' });
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4">CRM / Leads</Typography>
                <Button variant="contained" onClick={() => setOpenForCreate(true)}>Add Lead</Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Phone</TableCell>
                            <TableCell>Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {customers.map((c: any) => (
                            <TableRow key={c.id}>
                                <TableCell>{c.name}</TableCell>
                                <TableCell>{c.email}</TableCell>
                                <TableCell>{c.phone}</TableCell>
                                <TableCell>
                                    <Chip label={c.status} color={c.status === 'CUSTOMER' ? 'success' : 'primary'} size="small" />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={openForCreate} onClose={() => setOpenForCreate(false)}>
                <DialogTitle>Add New Lead</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Name" fullWidth margin="normal"
                        value={newItem.name}
                        onChange={e => setNewItem({ ...newItem, name: e.target.value })}
                    />
                    <TextField
                        label="Email" fullWidth margin="normal"
                        value={newItem.email}
                        onChange={e => setNewItem({ ...newItem, email: e.target.value })}
                    />
                    <TextField
                        label="Phone" fullWidth margin="normal"
                        value={newItem.phone}
                        onChange={e => setNewItem({ ...newItem, phone: e.target.value })}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenForCreate(false)}>Cancel</Button>
                    <Button onClick={handleCreate} variant="contained">Save</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};
