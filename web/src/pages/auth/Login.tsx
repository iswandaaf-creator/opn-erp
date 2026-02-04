import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container, Box, Typography, TextField, Button,
    Card, CardContent, Alert, CircularProgress
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Avatar from '@mui/material/Avatar';
import api from '../../lib/api';

export const Login = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await api.post('/auth/login', { email, password });
            const { access_token, user } = response.data;

            localStorage.setItem('token', access_token);
            localStorage.setItem('user', JSON.stringify(user));

            if (user.role === 'ADMIN') navigate('/admin');
            else if (user.role === 'MANAGER') navigate('/manager');
            else navigate('/dashboard');
        } catch (err) {
            console.error('Login failed', err);
            setError('Invalid credentials. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
            >
                <Box sx={{ mb: 3 }}>
                    <img src="/logo.svg" alt="Open Erp." style={{ height: 50, width: 'auto' }} />
                </Box>
                <Typography component="h1" variant="h5" sx={{ fontWeight: 'bold' }}>
                    Sign in to Open Erp
                </Typography>

                <Card sx={{ mt: 3, width: '100%', boxShadow: 3 }}>
                    <CardContent>
                        <Box component="form" onSubmit={handleLogin} noValidate sx={{ mt: 1 }}>
                            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                autoFocus
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2, py: 1.5 }}
                                disabled={loading}
                            >
                                {loading ? <CircularProgress size={24} /> : 'Sign In'}
                            </Button>

                            <Box sx={{ mt: 4, textAlign: 'center' }}>
                                <Button
                                    variant="outlined"
                                    color="secondary"
                                    href="/android-app.apk"
                                    download
                                >
                                    Download Android App
                                </Button>
                            </Box>
                        </Box>
                    </CardContent>
                </Card>

                <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 5 }}>
                    {'Copyright © Open Erp '}
                    {new Date().getFullYear()}
                    {'.'}
                </Typography>
            </Box>
        </Container>
    );
};
