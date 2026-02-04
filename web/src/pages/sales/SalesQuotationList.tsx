import { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip } from '@mui/material';
import { Add } from '@mui/icons-material';
import api from '../../lib/api';

export const SalesQuotationList = () => {
    const [quotes, setQuotes] = useState([]);

    useEffect(() => {
        fetchQuotes();
    }, []);

    const fetchQuotes = async () => {
        try {
            const res = await api.get('/sales/quotations');
            setQuotes(res.data);
        } catch (error) {
            console.error("Failed to fetch quotes", error);
        }
    };

    const handleCreateTest = async () => {
        await api.post('/sales/quotations', {
            customerName: 'Prospect Client',
            totalAmount: 1200,
            validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        });
        fetchQuotes();
    };

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4" fontWeight="bold">Sales Quotations</Typography>
                <Button variant="contained" startIcon={<Add />} onClick={handleCreateTest}>
                    New Quote
                </Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Quote ID</TableCell>
                            <TableCell>Customer</TableCell>
                            <TableCell>Valid Until</TableCell>
                            <TableCell>Total</TableCell>
                            <TableCell>Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {quotes.map((q: any) => (
                            <TableRow key={q.id}>
                                <TableCell>{q.id.slice(0, 8)}</TableCell>
                                <TableCell>{q.customerName}</TableCell>
                                <TableCell>{new Date(q.validUntil).toLocaleDateString()}</TableCell>
                                <TableCell>${Number(q.totalAmount).toLocaleString()}</TableCell>
                                <TableCell>
                                    <Chip label={q.status} color="primary" variant="outlined" size="small" />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};
