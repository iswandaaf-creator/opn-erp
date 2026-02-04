import { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip } from '@mui/material';
import { Add } from '@mui/icons-material';
import api from '../../lib/api';

export const SalesInvoiceList = () => {
    const [invoices, setInvoices] = useState([]);

    useEffect(() => {
        fetchInvoices();
    }, []);

    const fetchInvoices = async () => {
        try {
            const res = await api.get('/sales/invoices');
            setInvoices(res.data);
        } catch (error) {
            console.error("Failed to fetch invoices", error);
        }
    };

    const handleCreateTest = async () => {
        // Quick test function to generate a dummy invoice
        await api.post('/sales/invoices', {
            customerName: 'Test Customer',
            totalAmount: 5000,
            dueDate: new Date().toISOString()
        });
        fetchInvoices();
    };

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4" fontWeight="bold">Sales Invoices</Typography>
                <Button variant="contained" startIcon={<Add />} onClick={handleCreateTest}>
                    Create Invoice
                </Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Invoice #</TableCell>
                            <TableCell>Customer</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Total</TableCell>
                            <TableCell>Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {invoices.map((inv: any) => (
                            <TableRow key={inv.id}>
                                <TableCell>{inv.id.slice(0, 8)}</TableCell>
                                <TableCell>{inv.customerName}</TableCell>
                                <TableCell>{new Date(inv.createdAt).toLocaleDateString()}</TableCell>
                                <TableCell>${Number(inv.totalAmount).toLocaleString()}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={inv.status}
                                        color={inv.status === 'PAID' ? 'success' : inv.status === 'PARTIAL' ? 'warning' : 'error'}
                                        size="small"
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};
