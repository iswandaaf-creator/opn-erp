import React from 'react';
import { Box, Typography, Grid, Paper, Button } from '@mui/material';
import { People, Security, Assessment, Settings } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { StatCard } from '../../components/dashboard/StatCard';
import { useTranslation } from 'react-i18next';

const SuperAdminDashboard: React.FC = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                        Super Admin Control
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Full system access and configuration
                    </Typography>
                </div>
                <Button variant="outlined" startIcon={<Settings />} onClick={() => navigate('/settings')}>
                    System Settings
                </Button>
            </Box>

            {/* Admin Stats */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard label="Total Users" value="24" icon={People} color="primary" />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard label="Active Sessions" value="18" icon={Security} color="success" />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard label="System Health" value="98%" icon={Assessment} color="info" />
                </Grid>
            </Grid>

            {/* Quick Access */}
            <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                Administrative Actions
            </Typography>
            <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 4 }}>
                    <Paper
                        sx={{ p: 3, cursor: 'pointer', textAlign: 'center', transition: '0.3s', '&:hover': { transform: 'translateY(-5px)', boxShadow: 6 } }}
                        onClick={() => navigate('/users')}
                    >
                        <People sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
                        <Typography variant="h6">User Management</Typography>
                        <Typography variant="body2" color="text.secondary">
                            Create, edit, and remove system users
                        </Typography>
                    </Paper>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                    <Paper
                        sx={{ p: 3, cursor: 'pointer', textAlign: 'center', transition: '0.3s', '&:hover': { transform: 'translateY(-5px)', boxShadow: 6 } }}
                        onClick={() => navigate('/settings')}
                    >
                        <Settings sx={{ fontSize: 40, color: 'warning.main', mb: 2 }} />
                        <Typography variant="h6">System Configuration</Typography>
                        <Typography variant="body2" color="text.secondary">
                            Global settings, currency, and localization
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default SuperAdminDashboard;
