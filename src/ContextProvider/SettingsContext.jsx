import { createContext, useState } from "react";

export const SettingsContext = createContext();

export function SettingsContextWrapper({ children }) {
    const [Settings, setSettings] = useState(null);

    const setSystemSettings = (value) => {
        setSettings(value);
    }

    return (
        <SettingsContext.Provider value={{ Settings, setSystemSettings }}>
            {children}
        </SettingsContext.Provider>
    )
}




