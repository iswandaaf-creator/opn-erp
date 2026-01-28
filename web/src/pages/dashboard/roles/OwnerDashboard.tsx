import { useEffect, useState } from 'react';
import { Box, Grid, Card, CardContent, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Alert, Snackbar } from '@mui/material';
import { AttachMoney, TrendingUp, People, Warning, NotificationsActive } from '@mui/icons-material';
import { alpha } from '@mui/material/styles';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { io } from 'socket.io-client';

// Initial Data
const initialChartData = [
    { name: '10:00', uv: 4000 },
    { name: '11:00', uv: 3000 },
    { name: '12:00', uv: 2000 },
    { name: '13:00', uv: 2780 },
    { name: '14:00', uv: 1890 },
    { name: '15:00', uv: 2390 },
    { name: '16:00', uv: 3490 },
];

const StatCard = ({ title, value, trend, isUp, icon, color }: any) => (
    <Card sx={{ height: '100%', background: `linear-gradient(135deg, ${alpha(color, 0.1)} 0%, ${alpha(color, 0.2)} 100%)`, border: `1px solid ${alpha(color, 0.3)}` }}>
        <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                    <Typography color="textSecondary" gutterBottom variant="overline" sx={{ fontWeight: 'bold' }}>
                        {title}
                    </Typography>
                    <Typography variant="h4" component="div" sx={{ fontWeight: 800, color: 'text.primary' }}>
                        {value}
                    </Typography>
                </Box>
                <Box sx={{
                    p: 1.5,
                    borderRadius: 3,
                    bgcolor: color,
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    {icon}
                </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 3 }}>
                <Typography variant="body2" sx={{ color: isUp ? 'success.main' : 'error.main', fontWeight: 'bold' }}>
                    {trend}
                </Typography>
                <Typography variant="caption" color="textSecondary" sx={{ ml: 1 }}>
                    vs last month
                </Typography>
            </Box>
        </CardContent>
    </Card>
);

export const OwnerDashboard = () => {
    const [chartData, setChartData] = useState(initialChartData);
    const [notifications, setNotifications] = useState<any[]>([]);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [lastNotification, setLastNotification] = useState('');

    useEffect(() => {
        // Connect to WebSocket
        const socket = io('http://localhost:3000');

        socket.on('connect', () => {
            console.log('Connected to WebSocket');
        });

        socket.on('notification', (data: any) => {
            setNotifications(prev => [data, ...prev].slice(0, 5));
            setLastNotification(data.message);
            setOpenSnackbar(true);
        });

        // Mock Real-time Data updates
        const interval = setInterval(() => {
            setChartData(prev => {
                const newData = [...prev.slice(1), {
                    name: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    uv: Math.floor(Math.random() * 5000) + 1000
                }];
                return newData;
            });
        }, 5000);

        return () => {
            socket.disconnect();
            clearInterval(interval);
        };
    }, []);

    return (
        <Box>
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                    <Typography variant="h4" fontWeight="bold">Owner Command Center</Typography>
                    <Typography color="text.secondary">Real-time Financials & System Health</Typography>
                </Box>
                <Chip icon={<NotificationsActive />} label="Live Updates On" color="success" variant="outlined" />
            </Box>

            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard title="Real-time Revenue" value="$45,231" trend="+12.5%" isUp={true} icon={<AttachMoney />} color="#1976d2" />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard title="Net Profit" value="$12,450" trend="+8.2%" isUp={true} icon={<TrendingUp />} color="#2e7d32" />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard title="Total Customers" value="854" trend="+15 New" isUp={true} icon={<People />} color="#9c27b0" />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard title="System Alerts" value="3" trend="-2 Resolved" isUp={true} icon={<Warning />} color="#ed6c02" />
                </Grid>
            </Grid>

            <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 8 }}>
                    <Paper sx={{ p: 3, height: 400, mb: 3 }}>
                        <Typography variant="h6" gutterBottom>Live Revenue Trend</Typography>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="name" />
                                <YAxis />
                                <CartesianGrid strokeDasharray="3 3" />
                                <Tooltip />
                                <Area type="monotone" dataKey="uv" stroke="#8884d8" fillOpacity={1} fill="url(#colorUv)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </Paper>

                    <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0' }}>
                        <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0' }}>
                            <Typography variant="h6">Recent High-Value Transactions</Typography>
                        </Box>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Transaction ID</TableCell>
                                    <TableCell>Customer</TableCell>
                                    <TableCell>Amount</TableCell>
                                    <TableCell>Status</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {[1, 2, 3].map((i) => (
                                    <TableRow key={i}>
                                        <TableCell>#TRX-{1000 + i}</TableCell>
                                        <TableCell>Corporate Client {i}</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>${(1500 * i).toLocaleString()}</TableCell>
                                        <TableCell><Chip label="Completed" color="success" size="small" /></TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                    <Paper sx={{ p: 2, height: '100%', bgcolor: 'background.default' }}>
                        <Typography variant="h6" gutterBottom display="flex" alignItems="center">
                            <NotificationsActive sx={{ mr: 1, color: 'warning.main' }} />
                            Live Feed
                        </Typography>
                        <Box sx={{ mt: 2 }}>
                            {notifications.length === 0 && (
                                <Typography variant="body2" color="text.secondary">Waiting for events...</Typography>
                            )}
                            {notifications.map((note, index) => (
                                <Alert severity={note.type} sx={{ mb: 1 }} key={index}>
                                    {note.message}
                                    <Typography variant="caption" display="block" color="text.secondary">
                                        {new Date(note.time).toLocaleTimeString()}
                                    </Typography>
                                </Alert>
                            ))}
                            <Box sx={{ my: 2 }}>
                                <Typography variant="subtitle2" color="text.secondary">System Log</Typography>
                            </Box>
                            {[
                                'Server Maintenance Scheduled',
                                'Backup Completed Successfully',
                                'New User Registration: John Doe'
                            ].map((item, index) => (
                                <Box key={index} sx={{ mb: 2, p: 1.5, bgcolor: 'background.paper', borderRadius: 1, boxShadow: 1 }}>
                                    <Typography variant="body2">{item}</Typography>
                                    <Typography variant="caption" color="textSecondary">2 hours ago</Typography>
                                </Box>
                            ))}
                        </Box>
                    </Paper>
                </Grid>
            </Grid>

            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={() => setOpenSnackbar(false)}
                message={lastNotification}
            />
        </Box>
    );
};
