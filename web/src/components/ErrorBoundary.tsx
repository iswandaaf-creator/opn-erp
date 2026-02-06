import React, { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
    showDetails?: boolean; // Replace process.env check with prop
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
        errorInfo: null,
    };

    public static getDerivedStateFromError(error: Error): Partial<State> {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
        this.setState({ errorInfo });
    }

    private handleReload = () => {
        window.location.reload();
    };

    private handleGoHome = () => {
        window.location.href = '/';
    };

    public render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        minHeight: '100vh',
                        backgroundColor: '#f5f5f5',
                        p: 3,
                    }}
                >
                    <Paper
                        elevation={3}
                        sx={{
                            p: 4,
                            maxWidth: 500,
                            textAlign: 'center',
                            borderRadius: 2,
                        }}
                    >
                        <ErrorOutlineIcon
                            sx={{ fontSize: 64, color: 'error.main', mb: 2 }}
                        />
                        <Typography variant="h5" gutterBottom fontWeight="bold">
                            Oops! Something went wrong
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                            We're sorry for the inconvenience. Please try refreshing the page
                            or go back to the home page.
                        </Typography>

                        {this.props.showDetails && this.state.error && (
                            <Box
                                sx={{
                                    backgroundColor: '#fff3f3',
                                    p: 2,
                                    borderRadius: 1,
                                    mb: 3,
                                    textAlign: 'left',
                                    overflow: 'auto',
                                    maxHeight: 200,
                                }}
                            >
                                <Typography variant="caption" component="pre" sx={{ fontSize: 12 }}>
                                    {this.state.error.toString()}
                                    {this.state.errorInfo?.componentStack}
                                </Typography>
                            </Box>
                        )}

                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                            <Button
                                variant="outlined"
                                onClick={this.handleGoHome}
                            >
                                Go Home
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={this.handleReload}
                            >
                                Refresh Page
                            </Button>
                        </Box>
                    </Paper>
                </Box>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
