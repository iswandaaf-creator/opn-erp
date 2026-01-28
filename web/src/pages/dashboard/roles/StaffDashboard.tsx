import { Box, Grid, Card, CardActionArea, Typography, Paper, LinearProgress, Avatar } from '@mui/material';
import { ShoppingCart, EventNote, QrCodeScanner, History, EmojiEvents, Star } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { RadialBarChart, RadialBar, ResponsiveContainer } from 'recharts';

const data = [
    { name: 'Target', uv: 100, fill: '#f0f0f0' },
    { name: 'Sales', uv: 80, fill: '#8884d8' },
];

const MotionCard = motion(Card);

const QuickAction = ({ title, icon, color, onClick, delay }: any) => (
    <MotionCard
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.05, y: -5 }}
        whileTap={{ scale: 0.95 }}
        transition={{ delay }}
        sx={{
            height: 180,
            background: `linear-gradient(135deg, ${color} 0%, ${color}DD 100%)`,
            color: 'white',
            borderRadius: 4,
            boxShadow: `0 10px 20px -5px ${color}`,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
        }}
    >
        <CardActionArea sx={{ height: '100%', p: 3 }} onClick={onClick}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <Box sx={{
                    p: 2,
                    bgcolor: 'rgba(255,255,255,0.2)',
                    borderRadius: '50%',
                    mb: 2,
                    backdropFilter: 'blur(5px)'
                }}>
                    {icon}
                </Box>
                <Typography variant="h6" fontWeight="bold" sx={{ textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    {title}
                </Typography>
            </Box>
        </CardActionArea>
    </MotionCard>
);

export const StaffDashboard = () => {
    return (
        <Box>
            <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                    <Typography variant="h4" fontWeight="900" sx={{ color: 'text.primary' }}>
                        Good Morning, Team! ☀️
                    </Typography>
                    <Typography color="text.secondary">Let's make today amazing.</Typography>
                </Box>
                <Paper sx={{ px: 2, py: 1, borderRadius: 10, bgcolor: 'gold', color: 'black', display: 'flex', alignItems: 'center', boxShadow: 3 }}>
                    <EmojiEvents sx={{ mr: 1 }} />
                    <Typography fontWeight="bold">Store Rank: #1</Typography>
                </Paper>
            </Box>

            <Grid container spacing={4} sx={{ mb: 6 }}>
                <Grid size={{ xs: 6, md: 3 }}>
                    <QuickAction title="New Sale" icon={<ShoppingCart fontSize="large" />} color="#00C853" onClick={() => { }} delay={0.1} />
                </Grid>
                <Grid size={{ xs: 6, md: 3 }}>
                    <QuickAction title="Scan Item" icon={<QrCodeScanner fontSize="large" />} color="#2962FF" onClick={() => { }} delay={0.2} />
                </Grid>
                <Grid size={{ xs: 6, md: 3 }}>
                    <QuickAction title="My Tasks" icon={<EventNote fontSize="large" />} color="#FF6D00" onClick={() => window.location.href = '/tasks'} delay={0.3} />
                </Grid>
                <Grid size={{ xs: 6, md: 3 }}>
                    <QuickAction title="Sales History" icon={<History fontSize="large" />} color="#AA00FF" onClick={() => { }} delay={0.4} />
                </Grid>
            </Grid>

            <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 8 }}>
                    <Paper
                        component={motion.div}
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        sx={{ p: 4, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between', bgcolor: '#FFF', boxShadow: 3 }}
                    >
                        <Box sx={{ flex: 1 }}>
                            <Typography variant="h5" fontWeight="bold" gutterBottom>Daily Goal Progress</Typography>
                            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                                You are <Box component="span" fontWeight="bold" color="success.main">80%</Box> of the way to your daily target!
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <LinearProgress variant="determinate" value={80} sx={{ height: 10, borderRadius: 5, flex: 1 }} color="success" />
                                <Typography fontWeight="bold">80%</Typography>
                            </Box>
                        </Box>
                        <Box sx={{ width: 150, height: 150, position: 'relative' }}>
                            {/* Radial Bar Placeholder (Recharts radial needs data wrangling, simplified for MVP visual) */}
                            <Box sx={{
                                width: '100%', height: '100%', borderRadius: '50%',
                                border: '10px solid #f0f0f0',
                                borderTop: '10px solid #00C853',
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                                <Star fontSize="large" color="success" />
                            </Box>
                        </Box>
                    </Paper>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                    <Paper
                        component={motion.div}
                        initial={{ x: 50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        sx={{ p: 3, borderRadius: 4, bgcolor: '#E3F2FD', color: '#0D47A1', height: '100%' }}
                    >
                        <Typography variant="h6" fontWeight="bold" gutterBottom>Motivational Quote</Typography>
                        <Typography variant="h5" fontStyle="italic" sx={{ opacity: 0.8 }}>
                            "Quality means doing it right when no one is looking."
                        </Typography>
                        <Typography align="right" sx={{ mt: 2, fontWeight: 'bold' }}>- Henry Ford</Typography>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};
