import { useEffect, useState } from 'react';
import { Box, Grid, Card, CardContent, Typography, Paper, List, ListItemButton, ListItemText, Button, Chip, Divider, Avatar, useTheme } from '@mui/material';
import { Assignment, Inventory, EventAvailable, ArrowForward, TrendingUp, Warning } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { useNavigate } from 'react-router-dom';
import api from '../../../lib/api';

const COLORS = ['#00C49F', '#FFBB28', '#FF8042'];

const MotionCard = motion(Card);

const ActionCard = ({ title, count, icon, color, action, delay }: any) => (
    <MotionCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay }}
        sx={{
            height: '100%',
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)',
            borderLeft: `6px solid ${color}`,
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
            borderRadius: 3,
            overflow: 'visible'
        }}
    >
        <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box sx={{
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: `${color}22`,
                    color: color,
                    mr: 2,
                    boxShadow: `0 4px 12px ${color}33`
                }}>
                    {icon}
                </Box>
                <Typography variant="h6" fontWeight="bold" color="text.secondary">{title}</Typography>
            </Box>
            <Typography variant="h3" sx={{ fontWeight: 800, mb: 1, color: 'text.primary' }}>{count}</Typography>
            <Button
                variant="text"
                size="small"
                sx={{ color: color, fontWeight: 'bold' }}
                onClick={action}
                endIcon={<ArrowForward />}
            >
                Review Items
            </Button>
        </CardContent>
    </MotionCard>
);

export const ManagerDashboard = () => {
    const theme = useTheme();
    const navigate = useNavigate();

    // State
    const [stats, setStats] = useState({
        pendingApprovals: 0,
        lowStockCount: 0,
        activeStaff: 0
    });
    const [stockData, setStockData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            // Parallel Fetch
            const [approvalsRes, productsRes, usersRes] = await Promise.all([
                api.get('/approvals/pending'),
                api.get('/products'),
                api.get('/users')
            ]);

            const pendingApprovals = approvalsRes.data.purchaseOrders.length;

            // Filter Low Stock (< 10)
            const products = productsRes.data;
            const lowStockItems = products.filter((p: any) => p.quantity < 20);
            const lowStockCount = lowStockItems.length;

            // Format data for BarChart (Top 5 low stock)
            const chartData = lowStockItems.slice(0, 5).map((p: any) => ({
                name: p.name,
                stock: p.quantity
            }));

            // Count Staff
            const activeStaff = usersRes.data.length;

            setStats({ pendingApprovals, lowStockCount, activeStaff });
            setStockData(chartData as any);
            setLoading(false);
        } catch (error) {
            console.error("Dashboard Sync Failed", error);
        }
    };

    return (
        <Box>
            <Box sx={{ mb: 4 }} component={motion.div} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Typography variant="h3" fontWeight="900" sx={{
                    background: 'linear-gradient(45deg, #FF6B6B 30%, #FF8E53 90%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                }}>
                    Manager Control Room
                </Typography>
                <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 1 }}>
                    Live Operational Intelligence from Cloud
                </Typography>
            </Box>

            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid size={{ xs: 12, md: 4 }}>
                    <ActionCard
                        title="Pending Approvals"
                        count={stats.pendingApprovals}
                        icon={<Assignment />}
                        color="#ef6c00"
                        delay={0.1}
                        action={() => navigate('/manager')}
                    />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                    <ActionCard
                        title="Low Stock Alerts"
                        count={stats.lowStockCount}
                        icon={<Inventory />}
                        color="#d32f2f"
                        delay={0.2}
                        action={() => navigate('/inventory')}
                    />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                    <ActionCard
                        title="Total Users"
                        count={stats.activeStaff}
                        icon={<EventAvailable />}
                        color="#0288d1"
                        delay={0.3}
                        action={() => navigate('/users')}
                    />
                </Grid>
            </Grid>

            {/* Charts Section */}
            <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Paper component={motion.div}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        sx={{ p: 0, borderRadius: 4, boxShadow: theme.shadows[10], overflow: 'hidden' }}
                    >
                        <Box sx={{ p: 3, bgcolor: '#f8f9fa', borderBottom: '1px solid #eee' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Typography variant="h6" fontWeight="bold">Efficiency Metrics</Typography>
                                <Chip icon={<TrendingUp />} label="Live Data" color="success" size="small" />
                            </Box>
                        </Box>
                        <Box sx={{ p: 3, height: 300 }}>
                            {stockData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={stockData} layout="vertical">
                                        <XAxis type="number" hide />
                                        <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12 }} />
                                        <Tooltip />
                                        <Bar dataKey="stock" fill="#FF8042" radius={[0, 4, 4, 0]} barSize={20} />
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                                    <Typography color="textSecondary">No low stock alerts. Good job!</Typography>
                                </Box>
                            )}
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};
