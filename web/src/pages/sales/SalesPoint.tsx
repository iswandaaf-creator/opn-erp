import { useState, useEffect } from 'react';
import {
    Box, Grid, Paper, Typography, Card, CardContent, CardActionArea,
    CardMedia, Button, IconButton, List, ListItem, ListItemText, Divider,
    TextField, CircularProgress, Dialog, DialogContent, DialogActions, DialogTitle
} from '@mui/material';
import { Add as AddIcon, Remove as RemoveIcon, Delete as DeleteIcon, ShoppingCart, Receipt } from '@mui/icons-material';
import api from '../../lib/api';
import { PrintInvoice } from '../../components/PrintInvoice';

export const SalesPoint = () => {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState<{ product: any, quantity: number }[]>([]);
    const [loading, setLoading] = useState(true);
    const [completedOrder, setCompletedOrder] = useState<any>(null);
    const [customerName, setCustomerName] = useState('Walk-in Customer');

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await api.get('/products');
            setProducts(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const addToCart = (product: any) => {
        const existing = cart.find(item => item.product.id === product.id);
        if (existing) {
            if (existing.quantity >= product.quantity) return; // Stock limit
            setCart(cart.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
        } else {
            setCart([...cart, { product, quantity: 1 }]);
        }
    };

    const removeFromCart = (productId: number) => {
        setCart(cart.filter(item => item.product.id !== productId));
    };

    const updateQuantity = (productId: number, delta: number) => {
        setCart(cart.map(item => {
            if (item.product.id === productId) {
                const newQty = item.quantity + delta;
                if (newQty > 0 && newQty <= item.product.quantity) return { ...item, quantity: newQty };
            }
            return item;
        }));
    };

    const totalAmount = cart.reduce((sum, item) => sum + (Number(item.product.price) * item.quantity), 0);

    const handleCheckout = async () => {
        if (cart.length === 0) return;

        try {
            const orderData = {
                customerName: customerName || 'Walk-in Customer',
                items: cart.map(item => ({
                    productId: item.product.id,
                    quantity: item.quantity
                }))
            };

            const res = await api.post('/orders', orderData);
            setCompletedOrder(res.data);
            setCart([]);
            fetchProducts(); // Refresh stock
        } catch (err) {
            alert('Checkout Failed');
            console.error(err);
        }
    };

    return (
        <Box sx={{ height: 'calc(100vh - 100px)', display: 'flex', gap: 2 }}>
            {/* Product Grid */}
            <Paper sx={{ flex: 1, p: 2, overflowY: 'auto', bgcolor: '#f5f5f5' }}>
                <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ShoppingCart /> Products
                </Typography>
                {loading ? <CircularProgress /> : (
                    <Grid container spacing={2}>
                        {products.map((product: any) => (
                            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={product.id}>
                                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                    <CardActionArea onClick={() => addToCart(product)} sx={{ flexGrow: 1 }}>
                                        <Box sx={{ height: 100, bgcolor: 'primary.light', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                                            <Typography variant="h3">{product.name.charAt(0)}</Typography>
                                        </Box>
                                        <CardContent>
                                            <Typography variant="h6" noWrap>{product.name}</Typography>
                                            <Typography variant="subtitle1" color="primary" fontWeight="bold">
                                                ${Number(product.price).toFixed(2)}
                                            </Typography>
                                            <Typography variant="caption" color={product.quantity < 5 ? 'error' : 'textSecondary'}>
                                                Stock: {product.quantity}
                                            </Typography>
                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Paper>

            {/* Cart Section */}
            <Paper sx={{ width: 400, p: 2, display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Receipt /> Current Order
                </Typography>

                <Box sx={{ mb: 2 }}>
                    <TextField
                        label="Customer Name"
                        fullWidth
                        size="small"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                    />
                </Box>

                <List sx={{ flexGrow: 1, overflowY: 'auto' }}>
                    {cart.map((item) => (
                        <div key={item.product.id}>
                            <ListItem secondaryAction={
                                <IconButton edge="end" aria-label="delete" onClick={() => removeFromCart(item.product.id)}>
                                    <DeleteIcon />
                                </IconButton>
                            }>
                                <ListItemText
                                    primary={item.product.name}
                                    secondary={`@ $${Number(item.product.price).toFixed(2)}`}
                                />
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <IconButton size="small" onClick={() => updateQuantity(item.product.id, -1)} disabled={item.quantity <= 1}>
                                        <RemoveIcon fontSize="small" />
                                    </IconButton>
                                    <Typography>{item.quantity}</Typography>
                                    <IconButton size="small" onClick={() => updateQuantity(item.product.id, 1)} disabled={item.quantity >= item.product.quantity}>
                                        <AddIcon fontSize="small" />
                                    </IconButton>
                                </Box>
                                <Typography sx={{ minWidth: 60, textAlign: 'right', fontWeight: 'bold' }}>
                                    ${(Number(item.product.price) * item.quantity).toFixed(2)}
                                </Typography>
                            </ListItem>
                            <Divider />
                        </div>
                    ))}
                    {cart.length === 0 && (
                        <Box sx={{ textAlign: 'center', mt: 4, color: 'text.secondary' }}>
                            <Typography>Cart is empty</Typography>
                            <Typography variant="caption">Select products to begin</Typography>
                        </Box>
                    )}
                </List>

                <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #ddd' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="h6">Total:</Typography>
                        <Typography variant="h5" color="primary" fontWeight="bold">
                            ${totalAmount.toFixed(2)}
                        </Typography>
                    </Box>
                    <Button
                        variant="contained"
                        fullWidth
                        size="large"
                        disabled={cart.length === 0}
                        onClick={handleCheckout}
                    >
                        PAY & PRINT
                    </Button>
                </Box>
            </Paper>

            {/* Success/Print Dialog */}
            <Dialog open={!!completedOrder} onClose={() => setCompletedOrder(null)}>
                <DialogTitle>Order Successful!</DialogTitle>
                <DialogContent>
                    <Typography>Order #{completedOrder?.id} has been created.</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setCompletedOrder(null)}>Close</Button>
                    {completedOrder && <PrintInvoice order={completedOrder} />}
                </DialogActions>
            </Dialog>
        </Box>
    );
};
