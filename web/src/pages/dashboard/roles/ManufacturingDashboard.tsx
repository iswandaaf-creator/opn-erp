import React from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Factory, PrecisionManufacturing, Assignment, Build } from '@mui/icons-material';
import { StatCard } from '../../../components/dashboard/StatCard';

export const ManufacturingDashboard: React.FC = () => {
    const navigate = useNavigate();

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                Manufacturing Operations
            </Typography>

            {/* Quick Actions */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Paper
                        sx={{ p: 3, cursor: 'pointer', textAlign: 'center', transition: '0.3s', '&:hover': { transform: 'translateY(-5px)', boxShadow: 6 } }}
                        onClick={() => navigate('/work-orders')}
                    >
                        <PrecisionManufacturing sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                        <Typography variant="h6">Work Orders</Typography>
                        <Typography variant="body2" color="text.secondary">
                            Manage production orders and status
                        </Typography>
                    </Paper>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Paper
                        sx={{ p: 3, cursor: 'pointer', textAlign: 'center', transition: '0.3s', '&:hover': { transform: 'translateY(-5px)', boxShadow: 6 } }}
                        onClick={() => navigate('/bom')}
                    >
                        <Assignment sx={{ fontSize: 40, color: 'secondary.main', mb: 1 }} />
                        <Typography variant="h6">Bill of Materials</Typography>
                        <Typography variant="body2" color="text.secondary">
                            Manage product recipes and components
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>

            {/* Stats Overview */}
            <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard label="Active Work Orders" value="5" icon={Factory} color="primary" />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard label="Pending BOMs" value="2" icon={Build} color="warning" />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard label="Completed Today" value="12" icon={PrecisionManufacturing} color="success" />
                </Grid>
            </Grid>
        </Box>
    );
};
