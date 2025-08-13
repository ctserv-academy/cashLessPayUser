import React, { createContext, useState } from 'react'

export const LoadingContext = createContext();

export function LoadingContextWrapper({ children }) {
    const [isLoading, setisLoading] = useState(0);



    return (
        <LoadingContext.Provider value={{ isLoading, setisLoading }}>
            {children}
        </LoadingContext.Provider>

    )
}
