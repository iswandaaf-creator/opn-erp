import { useState, useEffect } from 'react';
import {
    Box, Paper, Typography, Button, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Chip,
    Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem
} from '@mui/material';
import { Add as AddIcon, PlayArrow, CheckCircle } from '@mui/icons-material';
import api from '../../lib/api';

export const WorkOrderList = () => {
    const [orders, setOrders] = useState([]);
    const [open, setOpen] = useState(false);
    const [products, setProducts] = useState([]);
    const [newOrder, setNewOrder] = useState({ productId: '', quantity: 1 });

    useEffect(() => {
        fetchOrders();
        fetchProducts();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await api.get('/manufacturing/work-orders');
            setOrders(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchProducts = async () => {
        try {
            const res = await api.get('/products');
            setProducts(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const createOrder = async () => {
        try {
            await api.post('/manufacturing/work-orders', newOrder);
            setOpen(false);
            fetchOrders();
        } catch (error) {
            alert('Failed to create Work Order');
        }
    };

    const updateStatus = async (id: number, status: string) => {
        try {
            await api.patch(`/manufacturing/work-orders/${id}/status`, { status });
            fetchOrders();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4">Work Orders (Production)</Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)}>
                    New Work Order
                </Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Product</TableCell>
                            <TableCell>Quantity</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Start Date</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {orders.map((wo: any) => (
                            <TableRow key={wo.id}>
                                <TableCell>#{wo.id}</TableCell>
                                <TableCell>{wo.product?.name}</TableCell>
                                <TableCell>{wo.quantity}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={wo.status}
                                        color={wo.status === 'COMPLETED' ? 'success' : wo.status === 'IN_PROGRESS' ? 'primary' : 'default'}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>{wo.startDate ? new Date(wo.startDate).toLocaleDateString() : '-'}</TableCell>
                                <TableCell>
                                    {wo.status === 'DRAFT' && (
                                        <Button size="small" startIcon={<PlayArrow />} onClick={() => updateStatus(wo.id, 'IN_PROGRESS')}>
                                            Start
                                        </Button>
                                    )}
                                    {wo.status === 'IN_PROGRESS' && (
                                        <Button size="small" color="success" startIcon={<CheckCircle />} onClick={() => updateStatus(wo.id, 'COMPLETED')}>
                                            Finish
                                        </Button>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>Create Work Order</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1, minWidth: 300 }}>
                        <TextField
                            select
                            label="Product to Produce"
                            fullWidth
                            value={newOrder.productId}
                            onChange={(e) => setNewOrder({ ...newOrder, productId: e.target.value })}
                        >
                            {products.map((p: any) => (
                                <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            label="Quantity"
                            type="number"
                            fullWidth
                            value={newOrder.quantity}
                            onChange={(e) => setNewOrder({ ...newOrder, quantity: Number(e.target.value) })}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button variant="contained" onClick={createOrder}>Create</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};
