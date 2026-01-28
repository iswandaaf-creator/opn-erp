import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Button, Paper, Grid, Card, CardContent,
    Dialog, DialogTitle, DialogContent, DialogActions, TextField,
    Chip, Stepper, Step, StepLabel, IconButton, useTheme, Avatar
} from '@mui/material';
import {
    Add as AddIcon,
    Business as BusinessIcon,
    Group as GroupIcon,
    Dns as ServerIcon,
    CheckCircle as ActiveIcon,
    Warning as InactiveIcon,
    ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../lib/api';

// --- Types ---
interface Company {
    id: string;
    name: string;
    address: string;
    status: string;
    users: any[];
}

// --- Animation Components ---
const MotionCard = motion(Card);
const MotionPaper = motion(Paper);

export const SuperAdminDashboard = () => {
    const theme = useTheme();
    const [companies, setCompanies] = useState<Company[]>([]);
    const [stats, setStats] = useState({ totalOrgs: 0, totalUsers: 0, activeOrgs: 0 });

    // Dialog & Wizard State
    const [openDialog, setOpenDialog] = useState(false);
    const [activeStep, setActiveStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        address: '',
        ownerName: '',
        ownerEmail: '',
        password: ''
    });

    useEffect(() => {
        fetchCompanies();
    }, []);

    const fetchCompanies = async () => {
        try {
            const res = await api.get('/companies');
            const data = res.data;
            setCompanies(data);

            // Calculate Stats
            const active = data.filter((c: Company) => c.status === 'ACTIVE').length;
            const users = data.reduce((acc: number, curr: Company) => acc + (curr.users?.length || 0), 0);
            setStats({ totalOrgs: data.length, totalUsers: users, activeOrgs: active });
        } catch (err) {
            console.error('Failed to fetch companies', err);
        }
    };

    const handleCreate = async () => {
        setLoading(true);
        setError('');
        try {
            await api.post('/companies', formData);
            setOpenDialog(false);
            setActiveStep(0);
            fetchCompanies();
            setFormData({ name: '', address: '', ownerName: '', ownerEmail: '', password: '' });
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to create company');
        } finally {
            setLoading(false);
        }
    };

    const handleNext = () => setActiveStep((prev) => prev + 1);
    const handleBack = () => setActiveStep((prev) => prev - 1);

    const steps = ['Organization Details', 'Owner Setup', 'Review & Launch'];

    const getStepContent = (step: number) => {
        switch (step) {
            case 0:
                return (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 2 }}>
                        <TextField
                            label="Organization Name"
                            fullWidth
                            variant="outlined"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            InputProps={{ sx: { borderRadius: 2 } }}
                        />
                        <TextField
                            label="Headquarters Address"
                            fullWidth
                            multiline
                            rows={3}
                            variant="outlined"
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            InputProps={{ sx: { borderRadius: 2 } }}
                        />
                    </Box>
                );
            case 1:
                return (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                            The system will automatically provision a Super Owner account for this organization.
                        </Typography>
                        <TextField
                            label="Owner Full Name"
                            fullWidth
                            variant="outlined"
                            value={formData.ownerName}
                            onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                            InputProps={{ sx: { borderRadius: 2 } }}
                        />
                        <TextField
                            label="Owner Email (Login ID)"
                            type="email"
                            fullWidth
                            variant="outlined"
                            value={formData.ownerEmail}
                            onChange={(e) => setFormData({ ...formData, ownerEmail: e.target.value })}
                            InputProps={{ sx: { borderRadius: 2 } }}
                        />
                        <TextField
                            label="Initial Password"
                            type="password"
                            fullWidth
                            variant="outlined"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            InputProps={{ sx: { borderRadius: 2 } }}
                        />
                    </Box>
                );
            case 2:
                return (
                    <Box sx={{ pt: 2, textAlign: 'center' }}>
                        <Avatar sx={{ width: 80, height: 80, margin: '0 auto', bgcolor: 'primary.main', mb: 2 }}>
                            <BusinessIcon fontSize="large" />
                        </Avatar>
                        <Typography variant="h5" gutterBottom>{formData.name}</Typography>
                        <Typography color="text.secondary" gutterBottom>{formData.address}</Typography>
                        <Paper variant="outlined" sx={{ p: 2, mt: 2, textAlign: 'left', bgcolor: 'grey.50' }}>
                            <Typography variant="subtitle2">Owner Provisioning:</Typography>
                            <Typography variant="body2">Name: {formData.ownerName}</Typography>
                            <Typography variant="body2">Email: {formData.ownerEmail}</Typography>
                        </Paper>
                    </Box>
                );
            default:
                return 'Unknown step';
        }
    };

    return (
        <Box>
            {/* Header Section */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box>
                    <Typography variant="h3" fontWeight="900" sx={{
                        background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>
                        GOD MODE
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 1 }}>
                        Platform Surveillance & Omni-Control
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    size="large"
                    startIcon={<AddIcon />}
                    onClick={() => setOpenDialog(true)}
                    sx={{
                        borderRadius: 4,
                        textTransform: 'none',
                        fontSize: '1.1rem',
                        px: 4,
                        py: 1.5,
                        boxShadow: '0 8px 20px -4px rgba(33, 150, 243, 0.4)'
                    }}
                >
                    Deploy Organization
                </Button>
            </Box>

            {/* Stats Grid */}
            <Grid container spacing={3} sx={{ mb: 6 }}>
                {[
                    { title: 'Total Organizations', value: stats.totalOrgs, icon: <BusinessIcon fontSize="large" />, color: '#2196F3' },
                    { title: 'Active Networks', value: stats.activeOrgs, icon: <ActiveIcon fontSize="large" />, color: '#00C853' },
                    { title: 'Monitored Users', value: stats.totalUsers, icon: <GroupIcon fontSize="large" />, color: '#FF9800' },
                    { title: 'System Health', value: '100%', icon: <ServerIcon fontSize="large" />, color: '#F44336' },
                ].map((item, index) => (
                    <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                        <MotionCard
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: index * 0.1 }}
                            sx={{
                                borderRadius: 4,
                                height: '100%',
                                background: `linear-gradient(135deg, ${item.color}15 0%, ${item.color}05 100%)`,
                                border: `1px solid ${item.color}30`,
                                position: 'relative',
                                overflow: 'visible'
                            }}
                        >
                            <CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <Box>
                                        <Typography color="text.secondary" variant="subtitle2" fontWeight="bold">
                                            {item.title}
                                        </Typography>
                                        <Typography variant="h3" fontWeight="bold" sx={{ color: item.color, mt: 1 }}>
                                            {item.value}
                                        </Typography>
                                    </Box>
                                    <Box sx={{
                                        p: 1.5,
                                        borderRadius: 3,
                                        bgcolor: item.color,
                                        color: 'white',
                                        boxShadow: `0 4px 12px ${item.color}60`
                                    }}>
                                        {item.icon}
                                    </Box>
                                </Box>
                            </CardContent>
                        </MotionCard>
                    </Grid>
                ))}
            </Grid>

            {/* Content Area */}
            <Typography variant="h5" fontWeight="bold" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                <BusinessIcon color="action" /> Tenant Network
            </Typography>

            <Grid container spacing={3}>
                <AnimatePresence>
                    {companies.map((company, index) => (
                        <Grid size={{ xs: 12, md: 6, lg: 4 }} key={company.id}>
                            <MotionCard
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ y: -8, boxShadow: theme.shadows[10] }}
                                sx={{ borderRadius: 4, position: 'relative', overflow: 'hidden' }}
                            >
                                <Box sx={{
                                    height: 100,
                                    background: `linear-gradient(120deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                                    position: 'relative',
                                    p: 3
                                }}>
                                    <Chip
                                        label={company.status}
                                        size="small"
                                        sx={{
                                            bgcolor: company.status === 'ACTIVE' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
                                            color: 'white',
                                            fontWeight: 'bold',
                                            backdropFilter: 'blur(4px)'
                                        }}
                                    />
                                    <Avatar sx={{
                                        width: 64, height: 64,
                                        bgcolor: 'white', color: 'primary.main',
                                        position: 'absolute', bottom: -32, left: 24,
                                        boxShadow: theme.shadows[4],
                                        fontWeight: 'bold', fontSize: 28
                                    }}>
                                        {company.name.charAt(0)}
                                    </Avatar>
                                </Box>
                                <CardContent sx={{ pt: 5, pb: 2 }}>
                                    <Typography variant="h6" fontWeight="bold">{company.name}</Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: 40 }}>
                                        {company.address}
                                    </Typography>

                                    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                                        <Paper variant="outlined" sx={{ flex: 1, p: 1, textAlign: 'center', borderRadius: 2 }}>
                                            <Typography variant="caption" display="block" color="text.secondary">USERS</Typography>
                                            <Typography variant="h6" fontWeight="bold">{company.users?.length || 0}</Typography>
                                        </Paper>
                                        <Paper variant="outlined" sx={{ flex: 1, p: 1, textAlign: 'center', borderRadius: 2 }}>
                                            <Typography variant="caption" display="block" color="text.secondary">REVENUE</Typography>
                                            <Typography variant="h6" fontWeight="bold">-</Typography>
                                        </Paper>
                                    </Box>

                                    <Button fullWidth variant="outlined" endIcon={<ArrowForwardIcon />} sx={{ borderRadius: 2 }}>
                                        Manage Tenant
                                    </Button>
                                </CardContent>
                            </MotionCard>
                        </Grid>
                    ))}
                </AnimatePresence>
            </Grid>

            {/* Creation Wizard Dialog */}
            <Dialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                maxWidth="md"
                fullWidth
                PaperProps={{ sx: { borderRadius: 4, overflow: 'hidden' } }}
            >
                <Box sx={{ bgcolor: 'secondary.main', color: 'white', p: 3 }}>
                    <Typography variant="h5" fontWeight="bold">Deploy New Organization</Typography>
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>Provision a new tenant environment and super owner.</Typography>
                </Box>

                <DialogContent sx={{ p: 4 }}>
                    <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
                        {steps.map((label) => (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>

                    {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}

                    <Box sx={{ minHeight: 300 }}>
                        {getStepContent(activeStep)}
                    </Box>
                </DialogContent>

                <DialogActions sx={{ p: 3, bgcolor: 'grey.50', justifyContent: 'space-between' }}>
                    <Button
                        disabled={activeStep === 0}
                        onClick={handleBack}
                        sx={{ visibility: activeStep === 0 ? 'hidden' : 'visible' }}
                    >
                        Back
                    </Button>
                    <Box>
                        <Button onClick={() => setOpenDialog(false)} sx={{ mr: 1 }}>
                            Cancel
                        </Button>
                        {activeStep === steps.length - 1 ? (
                            <Button
                                variant="contained"
                                size="large"
                                onClick={handleCreate}
                                disabled={loading}
                                endIcon={loading ? null : <BusinessIcon />}
                            >
                                {loading ? 'Provisioning...' : 'Launch Organization'}
                            </Button>
                        ) : (
                            <Button
                                variant="contained"
                                onClick={handleNext}
                                endIcon={<ArrowForwardIcon />}
                            >
                                Continue
                            </Button>
                        )}
                    </Box>
                </DialogActions>
            </Dialog>
        </Box>
    );
};
