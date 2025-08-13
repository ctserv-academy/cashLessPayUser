import React, { useEffect, useRef, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { HeaderMenu } from './HeaderMenu';
import { useCallback } from 'react';
import { Footer } from './footer/Footer';

export function Full() {
    const top = useRef(null);

    const STATE = {
        showMobileMenu: false,
        spinnerShow: false,
        saveContainerVisible: false,
        saveContainerButtons: {},
        saveContainerLabels: {},
        navmenus: "",
        backtotop: false,
        notifications: []
    };

    const [state, setState] = useState(STATE);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth)

    const navigate = useNavigate();

    const preventForward = useCallback(() => {
        navigate()
    }, [navigate])

    const handleResize = () => {
        setWindowWidth(window.innerWidth);
    };

    useEffect(() => {
        window.addEventListener("popstate", preventForward);
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener("popstate", preventForward);
            window.removeEventListener('resize', handleResize);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <div className="app" ref={top} >

                <HeaderMenu
                    id="main-header-container"
                    mobileMenu={true}
                    showMobileMenu={state.showMobileMenu}
                />

                <div className="app-body">
                    <main className="main" >
                        <div className={`container-fluid`} style={{ padding: 0 }}>
                            <Outlet />
                        </div>
                    </main>
                </div>
                <Footer />
            </div>
        </>
    )
}
