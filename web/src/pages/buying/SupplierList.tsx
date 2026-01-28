import { useState, useEffect } from 'react';
import {
    Box, Paper, Typography, Button, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, IconButton,
    Dialog, DialogTitle, DialogContent, DialogActions, TextField
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import api from '../../lib/api';

export const SupplierList = () => {
    const [suppliers, setSuppliers] = useState([]);
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', address: '' });

    useEffect(() => {
        fetchSuppliers();
    }, []);

    const fetchSuppliers = async () => {
        try {
            const res = await api.get('/suppliers');
            setSuppliers(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleSave = async () => {
        try {
            await api.post('/suppliers', formData);
            setOpen(false);
            setFormData({ name: '', email: '', phone: '', address: '' });
            fetchSuppliers();
        } catch (error) {
            console.error(error);
            alert('Failed to save supplier');
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4">Supplier Management</Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)}>
                    New Supplier
                </Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Phone</TableCell>
                            <TableCell>Address</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {suppliers.map((s: any) => (
                            <TableRow key={s.id}>
                                <TableCell>{s.name}</TableCell>
                                <TableCell>{s.email}</TableCell>
                                <TableCell>{s.phone}</TableCell>
                                <TableCell>{s.address}</TableCell>
                                <TableCell>
                                    <IconButton size="small"><EditIcon /></IconButton>
                                    <IconButton size="small"><DeleteIcon /></IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Add New Supplier</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                        <TextField
                            label="Supplier Name"
                            fullWidth
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                        <TextField
                            label="Email"
                            fullWidth
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                        <TextField
                            label="Phone"
                            fullWidth
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                        <TextField
                            label="Address"
                            fullWidth
                            multiline
                            rows={2}
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleSave}>Save</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};
