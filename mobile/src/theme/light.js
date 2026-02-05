import { MD3LightTheme } from 'react-native-paper';

// Open Erp Premium Theme - Black/White/Red with modern aesthetics
const theme = {
    ...MD3LightTheme,
    colors: {
        ...MD3LightTheme.colors,
        // Primary - Deep Black
        primary: '#1A1A1A',
        onPrimary: '#FFFFFF',
        primaryContainer: '#EDEDED',
        onPrimaryContainer: '#1A1A1A',

        // Secondary - Vibrant Red Accent
        secondary: '#E53935',
        onSecondary: '#FFFFFF',
        secondaryContainer: '#FFEBEE',
        onSecondaryContainer: '#C62828',

        // Tertiary - Steel Gray for variety
        tertiary: '#607D8B',
        onTertiary: '#FFFFFF',
        tertiaryContainer: '#ECEFF1',
        onTertiaryContainer: '#37474F',

        // Background & Surface
        background: '#FAFAFA',
        surface: '#FFFFFF',
        surfaceVariant: '#F5F5F5',
        surfaceDisabled: '#E0E0E0',

        // On colors
        onSurface: '#1A1A1A',
        onSurfaceVariant: '#424242',
        onSurfaceDisabled: '#9E9E9E',

        // Status colors
        error: '#D32F2F',
        onError: '#FFFFFF',
        errorContainer: '#FFCDD2',
        onErrorContainer: '#B71C1C',

        // Outline and dividers
        outline: '#BDBDBD',
        outlineVariant: '#E0E0E0',

        // Elevation colors for shadows
        elevation: {
            level0: 'transparent',
            level1: '#FFFFFF',
            level2: '#F5F5F5',
            level3: '#EEEEEE',
            level4: '#E0E0E0',
            level5: '#BDBDBD',
        },

        // Inverse colors
        inverseSurface: '#1A1A1A',
        inverseOnSurface: '#FFFFFF',
        inversePrimary: '#FF5252',

        // Shadows
        shadow: '#000000',
        scrim: '#000000',
    },
    roundness: 16,
    animation: {
        scale: 1.02,
    },
    fonts: {
        ...MD3LightTheme.fonts,
        // Using system fonts with optimized weights
        displayLarge: { ...MD3LightTheme.fonts.displayLarge, fontWeight: '900' },
        displayMedium: { ...MD3LightTheme.fonts.displayMedium, fontWeight: '800' },
        displaySmall: { ...MD3LightTheme.fonts.displaySmall, fontWeight: '700' },
        headlineLarge: { ...MD3LightTheme.fonts.headlineLarge, fontWeight: '700' },
        headlineMedium: { ...MD3LightTheme.fonts.headlineMedium, fontWeight: '600' },
        headlineSmall: { ...MD3LightTheme.fonts.headlineSmall, fontWeight: '600' },
        titleLarge: { ...MD3LightTheme.fonts.titleLarge, fontWeight: '600' },
        titleMedium: { ...MD3LightTheme.fonts.titleMedium, fontWeight: '500' },
        titleSmall: { ...MD3LightTheme.fonts.titleSmall, fontWeight: '500' },
        labelLarge: { ...MD3LightTheme.fonts.labelLarge, fontWeight: '500' },
    }
};

export default theme;
