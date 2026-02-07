import { useEffect, useState } from 'react';
import { Box, Paper, Typography, Chip, IconButton, Button, Grid, Card } from '@mui/material';
import { CheckCircle, Pending, Build, Person, Refresh } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../lib/api';

const MotionCard = motion(Card);

export const TaskDashboard = () => {
    const [tasks, setTasks] = useState<any[]>([]);

    const fetchTasks = async () => {
        try {
            const res = await api.get('/tasks');
            setTasks(res.data);
        } catch (error) {
            console.error("Failed to fetch tasks", error);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const handleComplete = async (id: number) => {
        try {
            await api.patch(`/tasks/${id}/status`, { status: 'COMPLETED' });
            fetchTasks();
        } catch (error) {
            console.error("Failed to complete task", error);
        }
    };

    return (
        <Box>
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                    <Typography variant="h4" fontWeight="bold">Service Queue</Typography>
                    <Typography color="text.secondary">Real-time fulfillment tasks</Typography>
                </Box>
                <Button variant="contained" startIcon={<Refresh />} onClick={fetchTasks}>Refresh</Button>
            </Box>

            <Grid container spacing={3}>
                <AnimatePresence>
                    {tasks.map((task, index) => (
                        <Grid size={{ xs: 12, md: 6, lg: 4 }} key={task.id}>
                            <MotionCard
                                layout
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.5 }}
                                transition={{ duration: 0.3 }}
                                sx={{
                                    p: 2,
                                    borderRadius: 3,
                                    position: 'relative',
                                    overflow: 'visible',
                                    border: task.status === 'COMPLETED' ? '1px solid #4caf50' : '1px solid #ff9800',
                                    bgcolor: task.status === 'COMPLETED' ? '#f1f8e9' : '#fff3e0'
                                }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', mb: 2 }}>
                                    <Chip
                                        icon={<Build sx={{ fontSize: 16 }} />}
                                        label={task.status}
                                        color={task.status === 'COMPLETED' ? 'success' : 'warning'}
                                        size="small"
                                        sx={{ fontWeight: 'bold' }}
                                    />
                                    <Chip
                                        icon={<Person sx={{ fontSize: 16 }} />}
                                        label={task.assignedTo || "Unassigned"}
                                        variant="outlined"
                                        size="small"
                                    />
                                </Box>
                                <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ textDecoration: task.status === 'COMPLETED' ? 'line-through' : 'none' }}>
                                    {task.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" paragraph>
                                    {task.description}
                                </Typography>

                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                                    {task.status !== 'COMPLETED' ? (
                                        <Button
                                            variant="contained"
                                            color="success"
                                            startIcon={<CheckCircle />}
                                            onClick={() => handleComplete(task.id)}
                                            fullWidth
                                            sx={{ borderRadius: 2 }}
                                        >
                                            Mark Complete
                                        </Button>
                                    ) : (
                                        <Button
                                            variant="text"
                                            color="success"
                                            startIcon={<CheckCircle />}
                                            disabled
                                            fullWidth
                                        >
                                            Done
                                        </Button>
                                    )}
                                </Box>
                            </MotionCard>
                        </Grid>
                    ))}
                </AnimatePresence>

                {tasks.length === 0 && (
                    <Grid size={{ xs: 12 }}>
                        <Paper sx={{ p: 5, textAlign: 'center', bgcolor: 'transparent', boxShadow: 'none' }}>
                            <Typography variant="h5" color="text.secondary">All caught up! 🎉</Typography>
                            <Typography>No pending tasks.</Typography>
                        </Paper>
                    </Grid>
                )}
            </Grid>
        </Box>
    );
};
