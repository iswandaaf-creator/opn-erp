import { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip } from '@mui/material';
import { Add } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import api from '../../lib/api';

export const SalesOrderList = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await api.get('/sales/orders');
            setOrders(res.data);
        } catch (error) {
            console.error("Failed to fetch orders", error);
        }
    };

    const navigate = useNavigate();

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4" fontWeight="bold">Sales Orders</Typography>
                <Button variant="contained" startIcon={<Add />} onClick={() => navigate('/sales/orders/create')}>
                    New Order
                </Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Order #</TableCell>
                            <TableCell>Customer</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Total</TableCell>
                            <TableCell>Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {orders.map((o: any) => (
                            <TableRow key={o.id}>
                                <TableCell>{o.orderNumber}</TableCell>
                                <TableCell>{o.customerName}</TableCell>
                                <TableCell>{new Date(o.orderDate).toLocaleDateString()}</TableCell>
                                <TableCell>${Number(o.totalAmount).toLocaleString()}</TableCell>
                                <TableCell>
                                    <Chip label={o.status} color="info" size="small" />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};
