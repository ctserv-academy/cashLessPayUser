import React, { useContext, useEffect, useRef } from 'react'
import { Outlet } from 'react-router-dom';
import { LoadingContext } from '../ContextProvider/LoadingContext'
import { Loader } from '../ReusableComponents/Loader';
import "./loadingContainer.css"



export function LoadingContainer() {
    const { isLoading } = useContext(LoadingContext);
    const spinner = useRef(null);

    useEffect(() => {
        spinner.current =
            <div className="sk-three-bounce" style={{ position: "fixed", top: "calc(calc(50% - 12px) + 20px)", left: "calc(50% - 40px)" }}>
                <div className="sk-child sk-bounce1"></div>
                <div className="sk-child sk-bounce2"></div>
                <div className="sk-child sk-bounce3"></div>
            </div>;
    }, []);



    return (
        <>
            <Loader message={spinner.current} show={isLoading > 0} />
            <Outlet />
        </>
    )
}
