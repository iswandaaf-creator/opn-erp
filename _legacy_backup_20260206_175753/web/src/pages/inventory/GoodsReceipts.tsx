import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, TextField, MenuItem, Table, TableBody, TableCell, TableHead, TableRow, Paper, Chip } from '@mui/material';
import api from '../../lib/api';

const GoodsReceipts: React.FC = () => {
    const [receipts, setReceipts] = useState([]);
    const [products, setProducts] = useState([]);
    const [formData, setFormData] = useState({ productId: '', quantity: '' });

    useEffect(() => {
        fetchReceipts();
        fetchProducts();
    }, []);

    const fetchReceipts = async () => {
        try {
            const res = await api.get('/inventory/receipts');
            setReceipts(res.data);
        } catch (error) {
            console.error('Failed to fetch receipts', error);
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
            await api.post('/inventory/receipts', {
                productId: parseInt(formData.productId),
                quantity: parseInt(formData.quantity)
            });
            fetchReceipts();
            setFormData({ productId: '', quantity: '' });
        } catch (error) {
            console.error('Failed to create receipt', error);
        }
    };

    const handleVerify = async (id: string) => {
        try {
            await api.patch(`/inventory/receipts/${id}/verify`, { userId: '1' });
            fetchReceipts();
        } catch (error) {
            console.error('Failed to verify', error);
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>Goods Receipts (Penerimaan Barang Jadi)</Typography>

            <Paper sx={{ p: 3, mb: 4 }}>
                <Typography variant="h6" gutterBottom>Declare Production Output</Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <TextField
                        select
                        label="Product"
                        value={formData.productId}
                        onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                        sx={{ minWidth: 200 }}
                    >
                        {products.map((p: any) => (
                            <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        type="number"
                        label="Quantity"
                        value={formData.quantity}
                        onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    />
                    <Button variant="contained" onClick={handleSubmit}>Submit Receipt</Button>
                </Box>
            </Paper>

            <Table component={Paper}>
                <TableHead>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Product</TableCell>
                        <TableCell>Quantity</TableCell>
                        <TableCell>Created At</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {receipts.map((rec: any) => (
                        <TableRow key={rec.id}>
                            <TableCell>{rec.id.substring(0, 8)}...</TableCell>
                            <TableCell>
                                <Chip label={rec.status} color={rec.status === 'VERIFIED' ? 'success' : 'warning'} />
                            </TableCell>
                            <TableCell>{rec.product?.name}</TableCell>
                            <TableCell>{rec.quantity}</TableCell>
                            <TableCell>{new Date(rec.createdAt).toLocaleString()}</TableCell>
                            <TableCell>
                                {rec.status === 'PENDING' && (
                                    <Button size="small" variant="contained" color="success" onClick={() => handleVerify(rec.id)}>
                                        Verify & Receive
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

export default GoodsReceipts;
