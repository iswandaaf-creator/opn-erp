import { useState, useEffect } from 'react';
import {
    Box, Typography, Paper, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Chip
} from '@mui/material';
import api from '../../lib/api';

export const AccountingJournal = () => {
    const [entries, setEntries] = useState([]);

    useEffect(() => {
        fetchJournal();
    }, []);

    const fetchJournal = async () => {
        const res = await api.get('/accounting');
        setEntries(res.data);
    };

    return (
        <Box>
            <Typography variant="h4" gutterBottom>Accounting Journal</Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Date</TableCell>
                            <TableCell>Reference</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Account</TableCell>
                            <TableCell align="right">Debit</TableCell>
                            <TableCell align="right">Credit</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {entries.flatMap((entry: any) =>
                            entry.lines.map((line: any, index: number) => (
                                <TableRow key={line.id}>
                                    {index === 0 && (
                                        <>
                                            <TableCell rowSpan={entry.lines.length}>{new Date(entry.date).toLocaleDateString()}</TableCell>
                                            <TableCell rowSpan={entry.lines.length}>{entry.reference}</TableCell>
                                            <TableCell rowSpan={entry.lines.length}>{entry.description}</TableCell>
                                        </>
                                    )}
                                    <TableCell>{line.accountName}</TableCell>
                                    <TableCell align="right">{Number(line.debit) > 0 ? `$${Number(line.debit).toFixed(2)}` : '-'}</TableCell>
                                    <TableCell align="right">{Number(line.credit) > 0 ? `$${Number(line.credit).toFixed(2)}` : '-'}</TableCell>
                                </TableRow>
                            ))
                        )}
                        {entries.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} align="center">No journal entries found.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};
