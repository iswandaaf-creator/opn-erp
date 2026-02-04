import { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, IconButton, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { Add, AttachFile } from '@mui/icons-material';
import api from '../../lib/api';
import { DocumentManager } from '../../components/documents/DocumentManager';

export const PaymentList = () => {
    const [payments, setPayments] = useState([]);
    const [selectedDoc, setSelectedDoc] = useState<{ id: string, type: string } | null>(null);

    useEffect(() => {
        fetchPayments();
    }, []);

    const fetchPayments = async () => {
        try {
            const res = await api.get('/sales/payments');
            setPayments(res.data);
        } catch (error) {
            console.error("Failed to fetch payments", error);
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4" fontWeight="bold">Customer Payments</Typography>
                {/* Payments are usually created from Invoice list */}
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Payment ID</TableCell>
                            <TableCell>Invoice #</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Amount</TableCell>
                            <TableCell>Method</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {payments.map((p: any) => (
                            <TableRow key={p.id}>
                                <TableCell>{p.id.slice(0, 8)}</TableCell>
                                <TableCell>{p.invoice?.invoiceNumber || '-'}</TableCell>
                                <TableCell>{new Date(p.paymentDate).toLocaleDateString()}</TableCell>
                                <TableCell>${Number(p.amount).toLocaleString()}</TableCell>
                                <TableCell>{p.paymentMethod}</TableCell>
                                <TableCell>
                                    <IconButton
                                        onClick={() => setSelectedDoc({ id: p.id, type: 'PAYMENT' })}
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
