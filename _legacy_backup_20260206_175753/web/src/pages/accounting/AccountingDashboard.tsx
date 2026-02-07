import React from 'react';
import { Box, Typography, Paper, Grid, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Receipt, Description, LocalShipping, Payment, AccountBalance } from '@mui/icons-material';

const FlowCard = ({ title, icon, path, color, step }: any) => {
    const navigate = useNavigate();
    return (
        <Paper
            component={motion.div}
            whileHover={{ scale: 1.05 }}
            sx={{
                p: 3,
                textAlign: 'center',
                cursor: 'pointer',
                borderTop: `4px solid ${color}`,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
            }}
            onClick={() => navigate(path)}
        >
            <Box sx={{
                width: 50, height: 50, borderRadius: '50%', bgcolor: `${color}22`, color: color,
                display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2
            }}>
                {icon}
            </Box>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 1, fontWeight: 'bold' }}>STEP {step}</Typography>
            <Typography variant="h6" fontWeight="bold">{title}</Typography>
        </Paper>
    );
};

export const AccountingDashboard = () => {
    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>Accounting & Sales Workflow</Typography>
            <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
                Zahir Accounting Standard Process
            </Typography>

            {/* Visual Process Flow */}
            <Box sx={{ position: 'relative', mb: 6 }}>
                {/* Arrow Lines could be SVG, but for now we use Grid spacing */}
                <Grid container spacing={4} alignItems="center">
                    <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                        <FlowCard title="Sales Quotation" step="1" icon={<Description />} color="#2196f3" path="/sales/quotations" />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                        <FlowCard title="Sales Order" step="2" icon={<Receipt />} color="#00bcd4" path="/sales/orders" />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                        <FlowCard title="Delivery" step="3" icon={<LocalShipping />} color="#ff9800" path="/sales/delivery" />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                        <FlowCard title="Invoice" step="4" icon={<Receipt />} color="#f44336" path="/sales/invoices" />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                        <FlowCard title="Payment" step="5" icon={<Payment />} color="#4caf50" path="/sales/payments" />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                        <FlowCard title="Journal" step="AUTO" icon={<AccountBalance />} color="#9c27b0" path="/accounting" />
                    </Grid>
                </Grid>
            </Box>

            {/* Quick Actions / KPIs can go here */}
            <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>Financial Overview</Typography>
                        {/* Placeholder for charts */}
                        <Box sx={{ height: 200, bgcolor: '#f5f5f5', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Typography color="text.secondary">Cash Flow Chart</Typography>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};
