import React, { useState, useEffect } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableHead, TableRow, Paper, Chip } from '@mui/material';
import api from '../../lib/api';

const StockLedger: React.FC = () => {
    const [ledger, setLedger] = useState([]);

    useEffect(() => {
        fetchLedger();
    }, []);

    const fetchLedger = async () => {
        try {
            const res = await api.get('/inventory/ledger');
            setLedger(res.data);
        } catch (error) {
            console.error('Failed to fetch ledger', error);
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>Stock Ledger (Kartu Stok)</Typography>

            <Table component={Paper}>
                <TableHead>
                    <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>Product</TableCell>
                        <TableCell>Warehouse</TableCell>
                        <TableCell>Quantity</TableCell>
                        <TableCell>Reference</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {ledger.map((entry: any) => (
                        <TableRow key={entry.id}>
                            <TableCell>{new Date(entry.createdAt).toLocaleString()}</TableCell>
                            <TableCell>
                                <Chip
                                    label={entry.type}
                                    color={entry.type === 'IN' ? 'success' : 'error'}
                                    size="small"
                                />
                            </TableCell>
                            <TableCell>{entry.product?.name}</TableCell>
                            <TableCell>{entry.warehouse?.name || 'Main Warehouse'}</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>
                                {entry.type === 'OUT' ? '-' : '+'}{entry.quantity}
                            </TableCell>
                            <TableCell>{entry.referenceDocType} #{entry.referenceDocId?.substring(0, 8)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Box>
    );
};

export default StockLedger;
