import { MD3LightTheme } from 'react-native-paper';

const theme = {
    ...MD3LightTheme,
    colors: {
        ...MD3LightTheme.colors,
        primary: '#000000', // Black
        onPrimary: '#FFFFFF',
        primaryContainer: '#EEEEEE',
        onPrimaryContainer: '#000000',
        secondary: '#E60000', // Red Accent
        onSecondary: '#FFFFFF',
        secondaryContainer: '#FFEBEE',
        onSecondaryContainer: '#B71C1C',
        background: '#F4F4F5', // Zinc 50
        surface: '#FFFFFF',
        surfaceVariant: '#EEEEEE',
        onSurface: '#000000',
        error: '#D32F2F',
        outline: '#757575',
    },
    roundness: 12,
};

export default theme;
