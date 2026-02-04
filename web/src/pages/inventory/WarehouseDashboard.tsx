import React from 'react';
import { Box, Typography, Grid, Paper, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Warehouse, ShoppingCart, ReceiptLong, History } from '@mui/icons-material';
import StatCard from '../../components/dashboard/StatCard';

const WarehouseDashboard: React.FC = () => {
    const navigate = useNavigate();

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                Warehouse Management
            </Typography>

            {/* Quick Actions */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={4}>
                    <Paper
                        sx={{ p: 3, cursor: 'pointer', textAlign: 'center', transition: '0.3s', '&:hover': { transform: 'translateY(-5px)', boxShadow: 6 } }}
                        onClick={() => navigate('/inventory/material-requests')}
                    >
                        <ShoppingCart sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                        <Typography variant="h6">Material Requests</Typography>
                        <Typography variant="body2" color="text.secondary">
                            Process raw material requests from Production
                        </Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Paper
                        sx={{ p: 3, cursor: 'pointer', textAlign: 'center', transition: '0.3s', '&:hover': { transform: 'translateY(-5px)', boxShadow: 6 } }}
                        onClick={() => navigate('/inventory/goods-receipts')}
                    >
                        <ReceiptLong sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                        <Typography variant="h6">Goods Receipts</Typography>
                        <Typography variant="body2" color="text.secondary">
                            Receive finished goods from Production
                        </Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Paper
                        sx={{ p: 3, cursor: 'pointer', textAlign: 'center', transition: '0.3s', '&:hover': { transform: 'translateY(-5px)', boxShadow: 6 } }}
                        onClick={() => navigate('/inventory/stock-ledger')}
                    >
                        <History sx={{ fontSize: 40, color: 'secondary.main', mb: 1 }} />
                        <Typography variant="h6">Stock Ledger</Typography>
                        <Typography variant="body2" color="text.secondary">
                            View full transaction history
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>

            {/* Stats Overview */}
            <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard title="Pending Requests" value="12" icon={<ShoppingCart />} color="#FF9800" />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard title="Pending Receipts" value="5" icon={<ReceiptLong />} color="#4CAF50" />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard title="Low Stock Items" value="8" icon={<Warehouse />} color="#F44336" />
                </Grid>
            </Grid>
        </Box>
    );
};

export default WarehouseDashboard;
