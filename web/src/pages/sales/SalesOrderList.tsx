import { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Card, CardContent, useTheme, useMediaQuery, Grid, Stack } from '@mui/material';
import { Add, AttachFile, MoreVert } from '@mui/icons-material';
import { DocumentManager } from '../../components/documents/DocumentManager';
import { useNavigate } from 'react-router-dom';
import api from '../../lib/api';

export const SalesOrderList = () => {
    const [orders, setOrders] = useState([]);
    const [selectedDoc, setSelectedDoc] = useState<{ id: string, type: string } | null>(null);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const navigate = useNavigate();

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

    const StatusChip = ({ status }: { status: string }) => (
        <Chip
            label={status}
            color={status === 'COMPLETED' ? 'success' : status === 'PENDING' ? 'warning' : 'info'}
            size="small"
        />
    );

    const ActionButtons = ({ o }: { o: any }) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton
                onClick={() => setSelectedDoc({ id: o.id, type: 'ORDER' })}
                title="Attachments"
                size="small"
            >
                <AttachFile fontSize="small" />
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
    );

    return (
        <Box sx={{ p: { xs: 1, md: 3 } }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant={isMobile ? "h5" : "h4"} fontWeight="bold">Sales Orders</Typography>
                <Button variant="contained" startIcon={<Add />} onClick={() => navigate('/sales/orders/create')}>
                    {isMobile ? "New" : "New Order"}
                </Button>
            </Box>

            {!isMobile ? (
                <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
                    <Table>
                        <TableHead sx={{ bgcolor: 'grey.50' }}>
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
                                <TableRow key={o.id} hover>
                                    <TableCell fontWeight="medium">{o.orderNumber}</TableCell>
                                    <TableCell>{o.customerName}</TableCell>
                                    <TableCell>{new Date(o.orderDate).toLocaleDateString()}</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                                        ${Number(o.totalAmount).toLocaleString()}
                                    </TableCell>
                                    <TableCell>
                                        <StatusChip status={o.status} />
                                    </TableCell>
                                    <TableCell>
                                        <ActionButtons o={o} />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            ) : (
                <Stack spacing={2}>
                    {orders.map((o: any) => (
                        <Card key={o.id} elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
                            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography variant="subtitle1" fontWeight="bold">{o.orderNumber}</Typography>
                                    <StatusChip status={o.status} />
                                </Box>
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                    {o.customerName}
                                </Typography>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', my: 1 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        {new Date(o.orderDate).toLocaleDateString()}
                                    </Typography>
                                    <Typography variant="subtitle1" color="primary.main" fontWeight="bold">
                                        ${Number(o.totalAmount).toLocaleString()}
                                    </Typography>
                                </Box>
                                <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'flex-end' }}>
                                    <ActionButtons o={o} />
                                </Box>
                            </CardContent>
                        </Card>
                    ))}
                </Stack>
            )}

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
