import React, { createContext, useState } from 'react'


export const AuthContext = createContext();

export function AuthContextWrapper({ children }) {
    const [clientData, setClientData] = useState(null);



    return (
        <AuthContext.Provider value={{ clientData, setClientData }} >
            {children}
        </AuthContext.Provider>
    )
}
