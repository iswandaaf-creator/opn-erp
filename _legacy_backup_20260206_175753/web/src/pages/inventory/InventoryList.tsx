import { useState, useEffect } from 'react';
import {
    Box, Paper, Typography, Button, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Chip, IconButton,
    Dialog, DialogTitle, DialogContent, DialogActions, TextField
} from '@mui/material';
import { Edit as EditIcon, Inventory as InventoryIcon } from '@mui/icons-material';
import api from '../../lib/api';

export const InventoryList = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchInventory();
    }, []);

    const fetchInventory = async () => {
        try {
            const res = await api.get('/products');
            setItems(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async () => {
        // Mock create for now, or implement full form
        const name = prompt("Product Name:");
        const type = prompt("Type (goods/service):", "goods");
        if (name && type) {
            const price = prompt("Price:");
            const quantity = type === 'goods' ? prompt("Quantity:") : 0;
            try {
                await api.post('/products', {
                    name,
                    sku: `SKU-${Math.floor(Math.random() * 1000)}`,
                    price: Number(price),
                    quantity: Number(quantity),
                    type
                });
                fetchInventory();
            } catch (e) { console.error(e); }
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <InventoryIcon fontSize="large" color="primary" />
                    Stock & Services
                </Typography>
                <Button variant="contained" startIcon={<EditIcon />} onClick={handleCreate}>
                    Add Product / Service
                </Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Type</TableCell>
                            <TableCell>Product Name</TableCell>
                            <TableCell>SKU</TableCell>
                            <TableCell align="right">Stock / Status</TableCell>
                            <TableCell align="right">Unit Value</TableCell>
                            <TableCell align="right">Total Value</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {items.map((item: any) => (
                            <TableRow key={item.id}>
                                <TableCell>
                                    <Chip
                                        label={item.type === 'service' ? 'SERVICE' : 'GOODS'}
                                        color={item.type === 'service' ? 'info' : 'default'}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>{item.name}</TableCell>
                                <TableCell>{item.sku || 'N/A'}</TableCell>
                                <TableCell align="right">
                                    {item.type === 'service' ? (
                                        <Chip label="Make to Order" variant="outlined" size="small" />
                                    ) : (
                                        <Chip
                                            label={item.quantity}
                                            color={item.quantity > 10 ? 'success' : item.quantity > 0 ? 'warning' : 'error'}
                                            variant="outlined"
                                        />
                                    )}
                                </TableCell>
                                <TableCell align="right">${Number(item.price).toFixed(2)}</TableCell>
                                <TableCell align="right">${(Number(item.price) * item.quantity).toFixed(2)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};
