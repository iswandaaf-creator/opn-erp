import { useState, useEffect } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, TextField, MenuItem, Box, Alert, CircularProgress
} from '@mui/material';
import api from '../../lib/api';

export const NewOrderDialog = ({ open, onClose, onSuccess }: any) => {
    const [products, setProducts] = useState<any[]>([]);
    const [selectedProduct, setSelectedProduct] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [customerName, setCustomerName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (open) {
            fetchProducts();
        }
    }, [open]);

    const fetchProducts = async () => {
        try {
            const res = await api.get('/products');
            setProducts(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError('');
        try {
            await api.post('/orders', {
                customerName,
                items: [{ productId: Number(selectedProduct), quantity: Number(quantity) }]
            });
            onSuccess();
            onClose();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to create order');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>New Transaction</DialogTitle>
            <DialogContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                    {error && <Alert severity="error">{error}</Alert>}

                    <TextField
                        label="Customer Name"
                        fullWidth
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                    />

                    <TextField
                        select
                        label="Product"
                        fullWidth
                        value={selectedProduct}
                        onChange={(e) => setSelectedProduct(e.target.value)}
                    >
                        {products.map((p) => (
                            <MenuItem key={p.id} value={p.id} disabled={p.quantity <= 0}>
                                {p.name} (Stock: {p.quantity}) - ${p.price}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        label="Quantity"
                        type="number"
                        fullWidth
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                        inputProps={{ min: 1 }}
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={loading}>Cancel</Button>
                <Button variant="contained" onClick={handleSubmit} disabled={loading}>
                    {loading ? <CircularProgress size={24} /> : 'Create Order'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
