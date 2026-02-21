import React, { createContext, useContext, useState, useEffect } from 'react';

const GlobalContext = createContext();

export const currencies = [
    { code: 'INR', symbol: '₹', label: 'IND | INR', rate: 1, flag: '🇮🇳' },
    { code: 'USD', symbol: '$', label: 'USA | USD', rate: 0.012, flag: '🇺🇸' },
    { code: 'AED', symbol: 'DH', label: 'UAE | AED', rate: 0.044, flag: '🇦🇪' },
    { code: 'EUR', symbol: '€', label: 'EUR | EUR', rate: 0.011, flag: '🇪🇺' },
    { code: 'GBP', symbol: '£', label: 'UK | GBP', rate: 0.0095, flag: '🇬🇧' },
    { code: 'SAR', symbol: 'SR', label: 'KSA | SAR', rate: 0.045, flag: '🇸🇦' },
    { code: 'QAR', symbol: 'QR', label: 'QAT | QAR', rate: 0.044, flag: '🇶🇦' },
    { code: 'KWD', symbol: 'KD', label: 'KWT | KWD', rate: 0.0037, flag: '🇰🇼' },
];

export const GlobalProvider = ({ children }) => {
    const [currency, setCurrency] = useState(() => {
        try {
            const saved = localStorage.getItem('travelgo_currency');
            return saved ? JSON.parse(saved) : currencies[0];
        } catch (error) {
            console.error("Currency parse error:", error);
            return currencies[0];
        }
    });

    useEffect(() => {
        localStorage.setItem('travelgo_currency', JSON.stringify(currency));
    }, [currency]);

    const formatPrice = (amount) => {
        if (amount === undefined || amount === null) return '';
        const converted = amount * currency.rate;
        return `${currency.symbol}${converted.toLocaleString(undefined, {
            minimumFractionDigits: currency.rate === 1 ? 0 : 2,
            maximumFractionDigits: 2
        })}`;
    };

    return (
        <GlobalContext.Provider value={{ currency, setCurrency, formatPrice }}>
            {children}
        </GlobalContext.Provider>
    );
};

export const useGlobal = () => {
    const context = useContext(GlobalContext);
    if (!context) {
        throw new Error('useGlobal must be used within a GlobalProvider');
    }
    return context;
};
