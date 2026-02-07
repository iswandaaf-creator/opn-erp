import { createTheme, type ThemeOptions } from '@mui/material/styles';

// Eva Design System Colors (matching UI Kitten mobile)
const evaColors = {
    primary: '#3366FF',
    primaryLight: '#598BFF',
    primaryDark: '#254EDB',
    success: '#00E096',
    successLight: '#2CE59B',
    successDark: '#00B383',
    info: '#0095FF',
    infoLight: '#42AAFF',
    infoDark: '#006FD6',
    warning: '#FFAA00',
    warningLight: '#FFC94D',
    warningDark: '#DB8B00',
    danger: '#FF3D71',
    dangerLight: '#FF708D',
    dangerDark: '#DB2C66',
};

const baseTheme: ThemeOptions = {
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h1: { fontWeight: 700 },
        h2: { fontWeight: 700 },
        h3: { fontWeight: 700 },
        h4: { fontWeight: 600, letterSpacing: '-0.5px' },
        h5: { fontWeight: 600 },
        h6: { fontWeight: 600 },
        button: { textTransform: 'none', fontWeight: 600 },
    },
    shape: {
        borderRadius: 12,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 10,
                    boxShadow: 'none',
                    padding: '10px 20px',
                    '&:hover': {
                        boxShadow: '0 4px 14px 0 rgba(51, 102, 255, 0.39)',
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 16,
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    fontWeight: 500,
                    borderRadius: 8,
                },
            },
        },
    },
};

// Light Theme
export const lightTheme = createTheme({
    ...baseTheme,
    palette: {
        mode: 'light',
        primary: {
            main: evaColors.primary,
            light: evaColors.primaryLight,
            dark: evaColors.primaryDark,
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#8F9BB3',
            light: '#C5CEE0',
            dark: '#2E3A59',
        },
        success: {
            main: evaColors.success,
            light: evaColors.successLight,
            dark: evaColors.successDark,
        },
        warning: {
            main: evaColors.warning,
            light: evaColors.warningLight,
            dark: evaColors.warningDark,
        },
        error: {
            main: evaColors.danger,
            light: evaColors.dangerLight,
            dark: evaColors.dangerDark,
        },
        info: {
            main: evaColors.info,
            light: evaColors.infoLight,
            dark: evaColors.infoDark,
        },
        background: {
            default: '#F7F9FC',
            paper: '#FFFFFF',
        },
        text: {
            primary: '#222B45',
            secondary: '#8F9BB3',
        },
    },
    components: {
        ...baseTheme.components,
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    backgroundColor: '#F7F9FC',
                },
            },
        },
        MuiTableCell: {
            styleOverrides: {
                head: {
                    fontWeight: 600,
                    backgroundColor: '#EDF1F7',
                    color: '#2E3A59',
                },
            },
        },
    },
});

// Dark Theme
export const darkTheme = createTheme({
    ...baseTheme,
    palette: {
        mode: 'dark',
        primary: {
            main: evaColors.primary,
            light: evaColors.primaryLight,
            dark: evaColors.primaryDark,
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#8F9BB3',
            light: '#C5CEE0',
            dark: '#2E3A59',
        },
        success: {
            main: evaColors.success,
            light: evaColors.successLight,
            dark: evaColors.successDark,
        },
        warning: {
            main: evaColors.warning,
            light: evaColors.warningLight,
            dark: evaColors.warningDark,
        },
        error: {
            main: evaColors.danger,
            light: evaColors.dangerLight,
            dark: evaColors.dangerDark,
        },
        info: {
            main: evaColors.info,
            light: evaColors.infoLight,
            dark: evaColors.infoDark,
        },
        background: {
            default: '#1A2138',
            paper: '#222B45',
        },
        text: {
            primary: '#FFFFFF',
            secondary: '#C5CEE0',
        },
    },
    components: {
        ...baseTheme.components,
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    backgroundColor: '#1A2138',
                },
            },
        },
        MuiTableCell: {
            styleOverrides: {
                head: {
                    fontWeight: 600,
                    backgroundColor: '#2E3A59',
                    color: '#FFFFFF',
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 16,
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.3)',
                    backgroundColor: '#222B45',
                },
            },
        },
    },
});

// Export for backwards compatibility
export const theme = lightTheme;
