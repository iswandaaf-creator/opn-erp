import React from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { FactCheck, Rule, ReportProblem, Verified } from '@mui/icons-material';
import { StatCard } from '../../../components/dashboard/StatCard';

export const QualityDashboard: React.FC = () => {
    // const navigate = useNavigate();

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                Quality Control
            </Typography>

            {/* Quick Actions */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Paper
                        sx={{ p: 3, cursor: 'pointer', textAlign: 'center', transition: '0.3s', '&:hover': { transform: 'translateY(-5px)', boxShadow: 6 } }}
                    // onClick={() => navigate('/quality/inspections')} // Future route
                    >
                        <FactCheck sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                        <Typography variant="h6">Inspections</Typography>
                        <Typography variant="body2" color="text.secondary">
                            Perform quality checks
                        </Typography>
                    </Paper>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Paper
                        sx={{ p: 3, cursor: 'pointer', textAlign: 'center', transition: '0.3s', '&:hover': { transform: 'translateY(-5px)', boxShadow: 6 } }}
                    // onClick={() => navigate('/quality/reports')} // Future route
                    >
                        <Rule sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                        <Typography variant="h6">Compliance</Typography>
                        <Typography variant="body2" color="text.secondary">
                            View compliance reports
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>

            {/* Stats Overview */}
            <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard label="Pending Inspections" value="3" icon={FactCheck} color="warning" />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard label="Defects Found" value="1" icon={ReportProblem} color="error" />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard label="Passed Items" value="120" icon={Verified} color="success" />
                </Grid>
            </Grid>
        </Box>
    );
};
