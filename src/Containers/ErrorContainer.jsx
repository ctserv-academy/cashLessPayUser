import React, { useContext } from 'react'
import { Outlet } from 'react-router-dom';
import { ErrorContext } from '../ContextProvider/ErrorContext'




export function ErrorContainer() {
    const { errorMessage } = useContext(ErrorContext);
    let style = {
        display: 'hidden'
    }
    if (!errorMessage) {
        style.display = 'none'
    }
    else {
        style.display = 'block'
    }



    return (
        <>
            <h1 style={style}>Error: {errorMessage}</h1>
            <Outlet />
        </>

    )
}
