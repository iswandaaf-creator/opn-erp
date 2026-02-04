import { MD3LightTheme } from 'react-native-paper';

const theme = {
    ...MD3LightTheme,
    colors: {
        ...MD3LightTheme.colors,
        primary: '#3F51B5', // Indigo 500
        onPrimary: '#FFFFFF',
        primaryContainer: '#E8EAF6', // Indigo 50
        onPrimaryContainer: '#1A237E', // Indigo 900
        secondary: '#009688', // Teal 500
        onSecondary: '#FFFFFF',
        secondaryContainer: '#E0F2F1', // Teal 50
        onSecondaryContainer: '#004D40', // Teal 900
        background: '#FAFAFA', // Gray 50
        surface: '#FFFFFF',
        surfaceVariant: '#F5F5F5',
        onSurface: '#212121', // Gray 900
        error: '#B00020',
        outline: '#BDBDBD',
    },
    roundness: 16, // Softer corners
};

export default theme;
