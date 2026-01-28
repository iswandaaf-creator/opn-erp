import { useState, useEffect } from 'react';
import {
    Box, Paper, Typography, Button, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Chip, IconButton,
    Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Grid
} from '@mui/material';
import { Add as AddIcon, CheckCircle, Visibility } from '@mui/icons-material';
import api from '../../lib/api';

export const PurchaseOrderList = () => {
    const [orders, setOrders] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [products, setProducts] = useState<any[]>([]);
    const [open, setOpen] = useState(false);

    // Simple Form State (MVP: Single Item PO)
    const [newPO, setNewPO] = useState({
        supplierId: '',
        items: [{ productId: '', quantity: 1, unitCost: 0 }]
    });

    useEffect(() => {
        fetchOrders();
        fetchSuppliers();
        fetchProducts();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await api.get('/buying/purchase-orders');
            setOrders(res.data);
        } catch (err) { console.error(err); }
    };

    const fetchSuppliers = async () => {
        try {
            const res = await api.get('/suppliers');
            setSuppliers(res.data);
        } catch (err) { console.error(err); }
    };

    const fetchProducts = async () => {
        try {
            const res = await api.get('/products');
            setProducts(res.data);
        } catch (err) { console.error(err); }
    };

    const handleCreate = async () => {
        try {
            await api.post('/buying/purchase-orders', newPO);
            setOpen(false);
            fetchOrders();
        } catch (err) {
            alert('Failed to create PO');
        }
    };

    const handleReceive = async (id: number) => {
        if (!confirm('Receive this order? This will update inventory and accounting.')) return;
        try {
            // First submit (if required by logic, though UI could handle this differently)
            // For MVP flow: Submit -> Receive or Draft -> Ordered -> Received
            // Assuming Draft -> Ordered is done or skipped in this simple UI
            await api.patch(`/buying/purchase-orders/${id}/submit`); // Ensure it's ordered
            await api.patch(`/buying/purchase-orders/${id}/receive`);
            fetchOrders();
        } catch (err) {
            console.error(err);
            // If submit failed because it's already submitted, try receive directly
            try {
                await api.patch(`/buying/purchase-orders/${id}/receive`);
                fetchOrders();
            } catch (retryErr) {
                alert('Failed to receive order');
            }
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4">Purchase Orders (Buying)</Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)}>
                    New Purchase Order
                </Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Supplier</TableCell>
                            <TableCell>Items</TableCell>
                            <TableCell>Total Amount</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {orders.map((po: any) => (
                            <TableRow key={po.id}>
                                <TableCell>#{po.id}</TableCell>
                                <TableCell>{po.supplier?.name}</TableCell>
                                <TableCell>{po.items?.length || 0} items</TableCell>
                                <TableCell>${Number(po.totalAmount).toFixed(2)}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={po.status}
                                        color={po.status === 'RECEIVED' ? 'success' : 'default'}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>
                                    {(po.status === 'DRAFT' || po.status === 'ORDERED') && (
                                        <Button
                                            size="small"
                                            color="success"
                                            startIcon={<CheckCircle />}
                                            onClick={() => handleReceive(po.id)}
                                        >
                                            Receive
                                        </Button>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Create Purchase Order</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                        <TextField
                            select
                            label="Supplier"
                            fullWidth
                            value={newPO.supplierId}
                            onChange={(e) => setNewPO({ ...newPO, supplierId: e.target.value })}
                        >
                            {suppliers.map((s: any) => (
                                <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>
                            ))}
                        </TextField>

                        <Typography variant="subtitle2">Item Details</Typography>

                        <TextField
                            select
                            label="Product"
                            fullWidth
                            value={newPO.items[0].productId}
                            onChange={(e) => {
                                const newItems = [...newPO.items];
                                newItems[0].productId = e.target.value;
                                // Auto-fill cost from product price as default?
                                const prod = products.find((p: any) => p.id === e.target.value);
                                if (prod) newItems[0].unitCost = prod.price * 0.5; // Dummy logic: Cost is 50% of price
                                setNewPO({ ...newPO, items: newItems });
                            }}
                        >
                            {products.map((p: any) => (
                                <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>
                            ))}
                        </TextField>

                        <Grid container spacing={2}>
                            <Grid size={{ xs: 6 }}>
                                <TextField
                                    label="Quantity"
                                    type="number"
                                    fullWidth
                                    value={newPO.items[0].quantity}
                                    onChange={(e) => {
                                        const newItems = [...newPO.items];
                                        newItems[0].quantity = Number(e.target.value);
                                        setNewPO({ ...newPO, items: newItems });
                                    }}
                                />
                            </Grid>
                            <Grid size={{ xs: 6 }}>
                                <TextField
                                    label="Unit Cost"
                                    type="number"
                                    fullWidth
                                    value={newPO.items[0].unitCost}
                                    onChange={(e) => {
                                        const newItems = [...newPO.items];
                                        newItems[0].unitCost = Number(e.target.value);
                                        setNewPO({ ...newPO, items: newItems });
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleCreate}>Create Order</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};
