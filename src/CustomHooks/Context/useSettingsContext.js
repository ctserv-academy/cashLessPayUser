import React, { useContext } from 'react'
import { SettingsContext } from '../../ContextProvider/Settings/SettingsContext'

export function useSettingsContext() {
    const { Settings, setSystemSettings } = useContext(SettingsContext);
    return { Settings, setSystemSettings }

}
