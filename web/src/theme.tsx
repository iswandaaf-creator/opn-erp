import { createTheme, alpha } from '@mui/material/styles';

declare module '@mui/material/styles' {
    interface Palette {
        neutral: Palette['primary'];
    }
    interface PaletteOptions {
        neutral?: PaletteOptions['primary'];
    }
}

const primaryColor = '#2563eb'; // Modern Blue
const secondaryColor = '#64748b'; // Slate

export const theme = createTheme({
    palette: {
        primary: {
            main: primaryColor,
            light: '#60a5fa',
            dark: '#1e40af',
            contrastText: '#ffffff',
        },
        secondary: {
            main: secondaryColor,
            light: '#94a3b8',
            dark: '#475569',
            contrastText: '#ffffff',
        },
        background: {
            default: '#f3f4f6', // Light Gray background for contrast
            paper: '#ffffff',
        },
        text: {
            primary: '#1e293b', // Slate 900
            secondary: '#64748b', // Slate 500
        },
        neutral: {
            main: '#64748b',
            contrastText: '#fff',
        },
    },
    typography: {
        fontFamily: '"Roboto", "Inter", "Helvetica", "Arial", sans-serif',
        h1: { fontWeight: 700 },
        h2: { fontWeight: 700 },
        h3: { fontWeight: 700 },
        h4: { fontWeight: 600, letterSpacing: '-0.5px' },
        h5: { fontWeight: 600 },
        h6: { fontWeight: 600 },
        button: { textTransform: 'none', fontWeight: 600 },
    },
    shape: {
        borderRadius: 12, // More rounded modern look
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    backgroundColor: '#f3f4f6',
                    scrollbarColor: '#94a3b8 #f1f5f9',
                    '&::-webkit-scrollbar, & *::-webkit-scrollbar': {
                        backgroundColor: 'transparent',
                        width: 8,
                        height: 8,
                    },
                    '&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb': {
                        borderRadius: 8,
                        backgroundColor: '#94a3b8',
                        minHeight: 24,
                        border: '2px solid transparent',
                        backgroundClip: 'content-box',
                    },
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 10,
                    boxShadow: 'none',
                    padding: '8px 16px',
                    '&:hover': {
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                    },
                },
                contained: {
                    '&:hover': {
                        backgroundColor: primaryColor,
                        filter: 'brightness(110%)'
                    }
                }
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 16, // Softer cards
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                    backgroundImage: 'none',
                    border: '1px solid rgba(255, 255, 255, 0.5)',
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                },
                elevation1: {
                    boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
                }
            },
        },
        MuiTableCell: {
            styleOverrides: {
                head: {
                    fontWeight: 600,
                    backgroundColor: '#f8fafc',
                    color: '#475569',
                    borderBottom: '2px solid #e2e8f0',
                },
                body: {
                    fontSize: '0.875rem'
                }
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    fontWeight: 500,
                    borderRadius: 8
                }
            }
        }
    },
});
