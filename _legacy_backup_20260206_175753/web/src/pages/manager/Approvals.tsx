import { useState, useEffect } from 'react';
import { Box, Typography, Paper, List, ListItem, ListItemText, ListItemAvatar, Avatar, Chip, Button, Divider } from '@mui/material';
import { Assignment as AssignmentIcon } from '@mui/icons-material';
import api from '../../lib/api';

export const Approvals = () => {
    const [approvals, setApprovals] = useState<{ purchaseOrders: any[] }>({ purchaseOrders: [] });

    useEffect(() => {
        fetchApprovals();
    }, []);

    const fetchApprovals = async () => {
        try {
            const res = await api.get('/approvals/pending');
            setApprovals(res.data);
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" sx={{ mb: 3 }}>Pending Approvals</Typography>

            <Paper sx={{ mb: 3 }}>
                <Box sx={{ p: 2, bgcolor: 'background.default' }}>
                    <Typography variant="h6">Draft Purchase Orders</Typography>
                </Box>
                <List>
                    {approvals.purchaseOrders.length === 0 && (
                        <ListItem><ListItemText primary="No pending orders." /></ListItem>
                    )}
                    {approvals.purchaseOrders.map((po) => (
                        <div key={po.id}>
                            <ListItem>
                                <ListItemAvatar>
                                    <Avatar sx={{ bgcolor: 'warning.main' }}><AssignmentIcon /></Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={`PO #${po.id} - ${po.supplier?.name}`}
                                    secondary={`Total: $${po.totalAmount}`}
                                />
                                <Box>
                                    <Button size="small" variant="contained" color="success" sx={{ mr: 1 }}>Approve</Button>
                                    <Button size="small" variant="outlined" color="error">Reject</Button>
                                </Box>
                            </ListItem>
                            <Divider />
                        </div>
                    ))}
                </List>
            </Paper>
        </Box>
    );
};
