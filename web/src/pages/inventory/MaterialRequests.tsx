import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, TextField, MenuItem, Table, TableBody, TableCell, TableHead, TableRow, Paper, Chip } from '@mui/material';
import api from '../../lib/api';

const MaterialRequests: React.FC = () => {
    const [requests, setRequests] = useState([]);
    const [products, setProducts] = useState([]);
    const [formData, setFormData] = useState({ productId: '', quantity: '' });

    useEffect(() => {
        fetchRequests();
        fetchProducts();
    }, []);

    const fetchRequests = async () => {
        try {
            const res = await api.get('/inventory/requests');
            setRequests(res.data);
        } catch (error) {
            console.error('Failed to fetch requests', error);
        }
    };

    const fetchProducts = async () => {
        try {
            const res = await api.get('/products');
            setProducts(res.data);
        } catch (error) {
            console.error('Failed to fetch products', error);
        }
    };

    const handleSubmit = async () => {
        try {
            // Simplified: submitting single item request
            // In real app, this would be a list of items
            await api.post('/inventory/requests', {
                items: [{ productId: parseInt(formData.productId), quantity: parseInt(formData.quantity) }]
            });
            fetchRequests();
            setFormData({ productId: '', quantity: '' });
        } catch (error) {
            console.error('Failed to create request', error);
        }
    };

    const handleApprove = async (id: string) => {
        try {
            await api.patch(`/inventory/requests/${id}/approve`, { userId: '1' }); // Hardcoded UserID for now
            fetchRequests();
        } catch (error) {
            console.error('Failed to approve', error);
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>Material Requests (Permintaan Bahan Baku)</Typography>

            <Paper sx={{ p: 3, mb: 4 }}>
                <Typography variant="h6" gutterBottom>New Request</Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <TextField
                        select
                        label="Product"
                        value={formData.productId}
                        onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                        sx={{ minWidth: 200 }}
                    >
                        {products.map((p: any) => (
                            <MenuItem key={p.id} value={p.id}>{p.name} (SKU: {p.sku})</MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        type="number"
                        label="Quantity"
                        value={formData.quantity}
                        onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    />
                    <Button variant="contained" onClick={handleSubmit}>Submit Request</Button>
                </Box>
            </Paper>

            <Table component={Paper}>
                <TableHead>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Items</TableCell>
                        <TableCell>Created At</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {requests.map((req: any) => (
                        <TableRow key={req.id}>
                            <TableCell>{req.id.substring(0, 8)}...</TableCell>
                            <TableCell>
                                <Chip label={req.status} color={req.status === 'APPROVED' ? 'success' : 'warning'} />
                            </TableCell>
                            <TableCell>
                                {req.items?.map((item: any) => (
                                    <div key={item.productId}>Product #{item.productId}: {item.quantity} units</div>
                                ))}
                            </TableCell>
                            <TableCell>{new Date(req.createdAt).toLocaleString()}</TableCell>
                            <TableCell>
                                {req.status === 'PENDING' && (
                                    <Button size="small" variant="contained" color="success" onClick={() => handleApprove(req.id)}>
                                        Approve & Issue
                                    </Button>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Box>
    );
};

export default MaterialRequests;
