import React from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Description, Receipt, CheckCircle } from '@mui/icons-material';
import { StatCard } from '../../../components/dashboard/StatCard';

export const SalesAdminDashboard: React.FC = () => {
    const navigate = useNavigate();

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                Sales Administration
            </Typography>

            {/* Quick Actions */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid size={{ xs: 12, md: 4 }}>
                    <Paper
                        sx={{ p: 3, cursor: 'pointer', textAlign: 'center', transition: '0.3s', '&:hover': { transform: 'translateY(-5px)', boxShadow: 6 } }}
                        onClick={() => navigate('/sales/quotations')}
                    >
                        <Description sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
                        <Typography variant="h6">Quotations</Typography>
                        <Typography variant="body2" color="text.secondary">
                            Manage price quotes
                        </Typography>
                    </Paper>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                    <Paper
                        sx={{ p: 3, cursor: 'pointer', textAlign: 'center', transition: '0.3s', '&:hover': { transform: 'translateY(-5px)', boxShadow: 6 } }}
                        onClick={() => navigate('/sales/orders')}
                    >
                        <ShoppingCart sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                        <Typography variant="h6">Sales Orders</Typography>
                        <Typography variant="body2" color="text.secondary">
                            Process customer orders
                        </Typography>
                    </Paper>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                    <Paper
                        sx={{ p: 3, cursor: 'pointer', textAlign: 'center', transition: '0.3s', '&:hover': { transform: 'translateY(-5px)', boxShadow: 6 } }}
                        onClick={() => navigate('/sales/invoices')}
                    >
                        <Receipt sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                        <Typography variant="h6">Invoices</Typography>
                        <Typography variant="body2" color="text.secondary">
                            View sales invoices
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>

            {/* Stats Overview */}
            <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard label="Pending Quotes" value="15" icon={Description} color="info" />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard label="New Orders" value="8" icon={ShoppingCart} color="primary" />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard label="Completed Orders" value="45" icon={CheckCircle} color="success" />
                </Grid>
            </Grid>
        </Box>
    );
};
