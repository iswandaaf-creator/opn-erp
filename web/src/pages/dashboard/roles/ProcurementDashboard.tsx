import React from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, People, Inventory, LocalShipping } from '@mui/icons-material';
import { StatCard } from '../../../components/dashboard/StatCard';

export const ProcurementDashboard: React.FC = () => {
    const navigate = useNavigate();

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                Procurement & Purchasing
            </Typography>

            {/* Quick Actions */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Paper
                        sx={{ p: 3, cursor: 'pointer', textAlign: 'center', transition: '0.3s', '&:hover': { transform: 'translateY(-5px)', boxShadow: 6 } }}
                        onClick={() => navigate('/buying/orders')}
                    >
                        <ShoppingBag sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                        <Typography variant="h6">Purchase Orders</Typography>
                        <Typography variant="body2" color="text.secondary">
                            Create and manage POs
                        </Typography>
                    </Paper>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Paper
                        sx={{ p: 3, cursor: 'pointer', textAlign: 'center', transition: '0.3s', '&:hover': { transform: 'translateY(-5px)', boxShadow: 6 } }}
                        onClick={() => navigate('/buying/suppliers')}
                    >
                        <People sx={{ fontSize: 40, color: 'secondary.main', mb: 1 }} />
                        <Typography variant="h6">Suppliers</Typography>
                        <Typography variant="body2" color="text.secondary">
                            Manage supplier database
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>

            {/* Stats Overview */}
            <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard label="Open POs" value="8" icon={ShoppingBag} color="primary" />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard label="Pending Approval" value="3" icon={Assignment} color="warning" />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard label="Incoming Shipments" value="4" icon={LocalShipping} color="info" />
                </Grid>
            </Grid>
        </Box>
    );
};

import { Assignment } from '@mui/icons-material';
