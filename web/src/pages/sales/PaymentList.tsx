import { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { Add } from '@mui/icons-material';
import api from '../../lib/api';

export const PaymentList = () => {
    const [payments, setPayments] = useState([]);

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
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};
