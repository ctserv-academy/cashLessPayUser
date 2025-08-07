import React, { createContext, useEffect, useState } from 'react'

export const LoadingContext = createContext();
export function LoadingContextWrapper({ children }) {
    const [loadingcounter, setLoadingCounter] = useState(0);

    return (
        <LoadingContext.Provider value={{ loadingcounter, setLoadingCounter }}>
            {children}
        </LoadingContext.Provider>
    )
}
