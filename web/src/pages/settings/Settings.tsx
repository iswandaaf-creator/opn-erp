import { useState, useEffect } from 'react';
import { Box, Typography, Paper, TextField, Button, Grid, Divider } from '@mui/material';
import api from '../../lib/api';

export const Settings = () => {
    const [settings, setSettings] = useState<any[]>([]);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await api.get('/settings');
            setSettings(res.data);
        } catch (e) {
            console.error(e);
        }
    };

    const handleUpdate = async (key: string, value: string) => {
        try {
            await api.post(`/settings/${key}`, { value });
            // Optimistic update or refetch
            setSettings(prev => prev.map(s => s.key === key ? { ...s, value } : s));
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" sx={{ mb: 3 }}>Application Settings</Typography>
            <Paper sx={{ p: 3, maxWidth: 600 }}>
                {settings.map((setting) => (
                    <Box key={setting.key} sx={{ mb: 3 }}>
                        <Typography variant="subtitle2" color="text.secondary">
                            {setting.description || setting.key}
                        </Typography>
                        <Grid container spacing={2} alignItems="center">
                            <Grid size={{ xs: 9 }}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    value={setting.value}
                                    onChange={(e) => {
                                        const newVal = e.target.value;
                                        setSettings(prev => prev.map(s => s.key === setting.key ? { ...s, value: newVal } : s));
                                    }}
                                />
                            </Grid>
                            <Grid size={{ xs: 3 }}>
                                <Button variant="outlined" onClick={() => handleUpdate(setting.key, setting.value)}>
                                    Save
                                </Button>
                            </Grid>
                        </Grid>
                        <Divider sx={{ mt: 2 }} />
                    </Box>
                ))}
            </Paper>
        </Box>
    );
};
