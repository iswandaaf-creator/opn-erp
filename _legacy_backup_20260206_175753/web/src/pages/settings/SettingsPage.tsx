import React from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Switch,
    FormControlLabel,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Divider,
    Alert,
    Stack,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useThemeMode } from '../../contexts/ThemeContext';
import { useLanguage, LANGUAGES } from '../../contexts/LanguageContext';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import LanguageIcon from '@mui/icons-material/Language';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

interface SettingsPageProps {
    userRole?: string;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ userRole = 'staff' }) => {
    const { t, i18n } = useTranslation();
    const { mode, toggleTheme } = useThemeMode();
    const { language, setLanguage, currency, setCurrency } = useLanguage();

    const isOwner = userRole.toLowerCase() === 'owner' || userRole.toLowerCase() === 'superadmin';

    const handleLanguageChange = (event: any) => {
        const newLang = event.target.value;
        setLanguage(newLang);
        i18n.changeLanguage(newLang);
    };

    const handleCurrencyChange = (event: any) => {
        setCurrency(event.target.value);
    };

    return (
        <Box sx={{ p: 3, maxWidth: 800 }}>
            <Typography variant="h4" gutterBottom>
                {t('settings.title')}
            </Typography>

            {/* Appearance Settings */}
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                        {mode === 'dark' ? <DarkModeIcon /> : <LightModeIcon />}
                        <Typography variant="h6">{t('settings.appearance')}</Typography>
                    </Stack>

                    <FormControlLabel
                        control={
                            <Switch
                                checked={mode === 'dark'}
                                onChange={toggleTheme}
                                color="primary"
                            />
                        }
                        label={t('settings.darkMode')}
                    />
                </CardContent>
            </Card>

            {/* Language Settings */}
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                        <LanguageIcon />
                        <Typography variant="h6">{t('settings.language')}</Typography>
                    </Stack>

                    <FormControl fullWidth>
                        <InputLabel>{t('settings.selectLanguage')}</InputLabel>
                        <Select
                            value={language}
                            label={t('settings.selectLanguage')}
                            onChange={handleLanguageChange}
                        >
                            {LANGUAGES.map((lang) => (
                                <MenuItem key={lang.code} value={lang.code}>
                                    {lang.nativeName} ({lang.name})
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </CardContent>
            </Card>

            {/* Currency Settings */}
            <Card>
                <CardContent>
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                        <AttachMoneyIcon />
                        <Typography variant="h6">{t('settings.currency')}</Typography>
                    </Stack>

                    {!isOwner && (
                        <Alert severity="info" sx={{ mb: 2 }}>
                            {t('settings.currencyNote')}
                        </Alert>
                    )}

                    <FormControl fullWidth disabled={!isOwner}>
                        <InputLabel>{t('settings.selectCurrency')}</InputLabel>
                        <Select
                            value={currency}
                            label={t('settings.selectCurrency')}
                            onChange={handleCurrencyChange}
                        >
                            {LANGUAGES.map((lang) => (
                                <MenuItem key={lang.currency} value={lang.currency}>
                                    {lang.currencySymbol} - {lang.currency} ({lang.currencyName})
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </CardContent>
            </Card>
        </Box>
    );
};

export default SettingsPage;
