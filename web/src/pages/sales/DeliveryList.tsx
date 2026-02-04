import { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip } from '@mui/material';
import { Add } from '@mui/icons-material';
import api from '../../lib/api';

export const DeliveryList = () => {
    const [deliveries, setDeliveries] = useState([]);

    useEffect(() => {
        fetchDeliveries();
    }, []);

    const fetchDeliveries = async () => {
        try {
            const res = await api.get('/sales/delivery');
            setDeliveries(res.data);
        } catch (error) {
            console.error("Failed to fetch deliveries", error);
        }
    };

    const handleCreateTest = async () => {
        // This should normally come from an Order
        await api.post('/sales/delivery', {
            salesOrderId: 'TEST-ORDER-ID',
            shippingDate: new Date().toISOString(),
            trackingNumber: 'TRK-123456789'
        });
        fetchDeliveries();
    };

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4" fontWeight="bold">Delivery Orders</Typography>
                <Button variant="contained" startIcon={<Add />} onClick={handleCreateTest}>
                    Create DO
                </Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>DO Number</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Tracking</TableCell>
                            <TableCell>Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {deliveries.map((d: any) => (
                            <TableRow key={d.id}>
                                <TableCell>{d.deliveryNumber}</TableCell>
                                <TableCell>{new Date(d.shippingDate).toLocaleDateString()}</TableCell>
                                <TableCell>{d.trackingNumber || '-'}</TableCell>
                                <TableCell>
                                    <Chip label={d.status} color="warning" size="small" />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};
