import { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, IconButton, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { Add, AttachFile } from '@mui/icons-material';
import { DocumentManager } from '../../components/documents/DocumentManager';
import { useNavigate } from 'react-router-dom';
import api from '../../lib/api';

export const SalesOrderList = () => {
    const [orders, setOrders] = useState([]);
    const [selectedDoc, setSelectedDoc] = useState<{ id: string, type: string } | null>(null);

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
                            <TableCell>Actions</TableCell>
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
                                <TableCell>
                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        <IconButton
                                            onClick={() => setSelectedDoc({ id: o.id, type: 'ORDER' })}
                                            title="Attachments"
                                        >
                                            <AttachFile />
                                        </IconButton>
                                        <Button
                                            size="small"
                                            variant="outlined"
                                            color="warning"
                                            onClick={async () => {
                                                if (window.confirm('Create Delivery Order?')) {
                                                    await api.post(`/sales/orders/${o.id}/convert-delivery`);
                                                    alert('Delivery Order Created!');
                                                }
                                            }}
                                        >
                                            Delivery
                                        </Button>
                                        <Button
                                            size="small"
                                            variant="outlined"
                                            color="error"
                                            onClick={async () => {
                                                if (window.confirm('Create Invoice?')) {
                                                    await api.post(`/sales/orders/${o.id}/convert-invoice`);
                                                    alert('Invoice Created!');
                                                }
                                            }}
                                        >
                                            Invoice
                                        </Button>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={!!selectedDoc} onClose={() => setSelectedDoc(null)} maxWidth="md" fullWidth>
                <DialogTitle>Document Attachments</DialogTitle>
                <DialogContent>
                    {selectedDoc && (
                        <DocumentManager
                            entityId={selectedDoc.id}
                            entityType={selectedDoc.type}
                        />
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setSelectedDoc(null)}>Close</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};
