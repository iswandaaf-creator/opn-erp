import { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, IconButton, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { Add, AttachFile } from '@mui/icons-material';
import api from '../../lib/api';
import { DocumentManager } from '../../components/documents/DocumentManager';

export const DeliveryList = () => {
    const [deliveries, setDeliveries] = useState([]);
    const [selectedDoc, setSelectedDoc] = useState<{ id: string, type: string } | null>(null);

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
            trackingNumber: 'TRK-' + Math.floor(Math.random() * 1000)
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
                            <TableCell>Actions</TableCell>
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
                                <TableCell>
                                    <IconButton
                                        onClick={() => setSelectedDoc({ id: d.id, type: 'DELIVERY' })}
                                        title="Attachments"
                                    >
                                        <AttachFile />
                                    </IconButton>
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
