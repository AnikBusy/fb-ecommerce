'use client'

import { createContext, useContext, useState, useCallback } from 'react'

const SettingsContext = createContext({})

export function SettingsProvider({ children, initialSettings }) {
    const [settings, setSettings] = useState(initialSettings || {
        siteName: 'My Shop',
        primaryColor: '#00ED64',
        deliveryChargeInsideDhaka: 60,
        deliveryChargeOutsideDhaka: 110,
    })

    const updateSettingsState = useCallback((newSettings) => {
        setSettings(prev => ({ ...prev, ...newSettings }));
    }, []);

    return (
        <SettingsContext.Provider value={{ ...settings, updateSettingsState }}>
            {children}
        </SettingsContext.Provider>
    )
}

export const useSettings = () => useContext(SettingsContext)
