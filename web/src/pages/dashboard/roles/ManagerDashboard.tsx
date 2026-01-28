import { Box, Grid, Card, CardContent, Typography, Paper, List, ListItem, ListItemText, Button, Chip, Divider, Avatar, useTheme, ListItemButton } from '@mui/material';
import { Assignment, Inventory, EventAvailable, ArrowForward, TrendingUp, Warning } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

const data = [
    { name: 'Completed', value: 400 },
    { name: 'Pending', value: 300 },
    { name: 'Delayed', value: 300 },
];
const COLORS = ['#00C49F', '#FFBB28', '#FF8042'];

const stockData = [
    { name: 'Coffee Beans', stock: 40 },
    { name: 'Milk', stock: 15 },
    { name: 'Cups', stock: 80 },
    { name: 'Sugar', stock: 25 },
];

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
                    Operational Intelligence & Workflow
                </Typography>
            </Box>

            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid size={{ xs: 12, md: 4 }}>
                    <ActionCard title="Pending Approvals" count="5" icon={<Assignment />} color="#ef6c00" delay={0.1} />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                    <ActionCard title="Low Stock Alerts" count="12" icon={<Inventory />} color="#d32f2f" delay={0.2} />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                    <ActionCard title="Staff Active" count="8" icon={<EventAvailable />} color="#0288d1" delay={0.3} />
                </Grid>
            </Grid>

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
                                <Chip icon={<TrendingUp />} label="+14% vs Last Week" color="success" size="small" />
                            </Box>
                        </Box>
                        <Box sx={{ p: 3, height: 300, display: 'flex' }}>
                            <Box sx={{ flex: 1 }}>
                                <Typography variant="subtitle2" align="center" gutterBottom>Task Completion Rate</Typography>
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={data}
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {data.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </Box>
                            <Box sx={{ flex: 1, borderLeft: '1px dashed #eee', pl: 2 }}>
                                <Typography variant="subtitle2" align="center" gutterBottom>Critical Stock Levels</Typography>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={stockData} layout="vertical">
                                        <XAxis type="number" hide />
                                        <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 12 }} />
                                        <Tooltip />
                                        <Bar dataKey="stock" fill="#FF8042" radius={[0, 4, 4, 0]} barSize={20} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </Box>
                        </Box>
                    </Paper>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                    <Paper component={motion.div}
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        sx={{ borderRadius: 4, boxShadow: theme.shadows[10], overflow: 'hidden' }}
                    >
                        <Box sx={{ p: 3, bgcolor: '#fff3e0', borderBottom: '1px solid #ffe0b2' }}>
                            <Typography variant="h6" fontWeight="bold" color="warning.dark">⚠️ Attention Required</Typography>
                        </Box>
                        <List sx={{ p: 0 }}>
                            {[
                                { title: "Review Q1 Sales Report", subtitle: "Due be 5 PM", priority: "URGENT", color: "error" },
                                { title: "Approve PO #992", subtitle: "Waiting since morning", priority: "MEDIUM", color: "warning" },
                                { title: "Interview: Sarah Jones", subtitle: "2:00 PM via Zoom", priority: "INFO", color: "info" }
                            ].map((item, i) => (
                                <Box key={i}>
                                    <ListItemButton sx={{ p: 2 }}>
                                        <Avatar sx={{ bgcolor: `${item.color}.light`, color: `${item.color}.main`, mr: 2 }}>
                                            <Warning />
                                        </Avatar>
                                        <ListItemText
                                            primary={<Typography fontWeight="bold">{item.title}</Typography>}
                                            secondary={item.subtitle}
                                        />
                                        <Chip label={item.priority} color={item.color as any} size="small" sx={{ fontWeight: 'bold', borderRadius: 1 }} />
                                    </ListItemButton>
                                    {i < 2 && <Divider variant="inset" component="li" />}
                                </Box>
                            ))}
                        </List>
                        <Box sx={{ p: 2, bgcolor: '#fafafa', textAlign: 'center' }}>
                            <Button size="small">View All Notifications</Button>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};
