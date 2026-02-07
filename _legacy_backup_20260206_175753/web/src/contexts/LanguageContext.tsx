import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import i18n from '../i18n';

export interface LanguageConfig {
    code: string;
    name: string;
    nativeName: string;
    currency: string;
    currencySymbol: string;
    currencyName: string;
}

export const LANGUAGES: LanguageConfig[] = [
    { code: 'en', name: 'English', nativeName: 'English', currency: 'USD', currencySymbol: '$', currencyName: 'US Dollar' },
    { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', currency: 'IDR', currencySymbol: 'Rp', currencyName: 'Rupiah' },
    { code: 'ja', name: 'Japanese', nativeName: '日本語', currency: 'JPY', currencySymbol: '¥', currencyName: 'Yen' },
    { code: 'zh', name: 'Chinese', nativeName: '中文', currency: 'CNY', currencySymbol: '¥', currencyName: 'Yuan' },
    { code: 'ms', name: 'Malay', nativeName: 'Bahasa Melayu', currency: 'MYR', currencySymbol: 'RM', currencyName: 'Ringgit' },
    { code: 'th', name: 'Thai', nativeName: 'ไทย', currency: 'THB', currencySymbol: '฿', currencyName: 'Baht' },
];

interface LanguageContextType {
    language: string;
    setLanguage: (code: string) => void;
    currency: string;
    setCurrency: (code: string) => void;
    currencySymbol: string;
    formatCurrency: (amount: number) => string;
    currentLanguage: LanguageConfig;
    currentCurrency: LanguageConfig;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within LanguageProvider');
    }
    return context;
};

// Alias for currency-specific usage
export const useCurrency = useLanguage;

interface LanguageProviderProps {
    children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
    const [language, setLanguageState] = useState(() => {
        return localStorage.getItem('app-language') || 'id';
    });

    const [currency, setCurrencyState] = useState(() => {
        return localStorage.getItem('app-currency') || 'IDR';
    });

    useEffect(() => {
        localStorage.setItem('app-language', language);
        i18n.changeLanguage(language); // Notify i18next of change
    }, [language]);

    useEffect(() => {
        localStorage.setItem('app-currency', currency);
    }, [currency]);

    const currentLanguage = LANGUAGES.find(l => l.code === language) || LANGUAGES[1]; // Default ID
    const currentCurrency = LANGUAGES.find(l => l.currency === currency) || LANGUAGES[1];

    const formatCurrency = (amount: number): string => {
        const formatter = new Intl.NumberFormat(language === 'id' ? 'id-ID' : language, {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: currency === 'JPY' ? 0 : 2,
            maximumFractionDigits: currency === 'JPY' ? 0 : 2,
        });
        return formatter.format(amount);
    };

    const setLanguage = (code: string) => {
        setLanguageState(code);
    };

    const setCurrency = (code: string) => {
        setCurrencyState(code);
    };

    return (
        <LanguageContext.Provider value={{
            language,
            setLanguage,
            currency,
            setCurrency,
            currencySymbol: currentCurrency.currencySymbol,
            formatCurrency,
            currentLanguage,
            currentCurrency,
        }}>
            {children}
        </LanguageContext.Provider>
    );
};
