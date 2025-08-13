import React, { createContext, useEffect, useState } from 'react'

export const ErrorContext = createContext();

export function ErrorContextWrapper({ children }) {
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
    }, [errorMessage])

    return (
        <ErrorContext.Provider value={{ errorMessage, setErrorMessage }}>
            {children}
        </ErrorContext.Provider>

    )
}
