import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../ContextProvider/AuthContext'
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { isEmpty } from 'lodash';
// import { ErrorContext } from '../ContextProvider/ErrorContext';

export function AuthenticationContainer() {
    const { userData, setUserData } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const token = localStorage.getItem('token')
    const [loading, setLoading] = useState(true);

    const CheckAuthenticationData = () => {
        try {
            // if (!localStorage.getItem('token') && localStorage.getItem('userData') && window.location.hash !== "#/login" && window.location.hash !== "#/" && window.location.hash !== "/" && window.location.hash !== "") {
            //     navigate('/error', { replace: true });
            //     localStorage.clear()
            //     return
            // }
            // else if (!localStorage.getItem('token') && !isEmpty(localStorage)) {
            //     navigate('/login', { replace: true });
            // }
            // else if (!userData) {
            //     // setUserData(JSON.parse(getSessionInfo('user')))
            //     setUserData(JSON.parse(localStorage.getItem('user')))
            // }
        }
        catch (err) {

        }
        finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        CheckAuthenticationData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.pathname, token])

    if (loading) {
        return <></>
    }

    return <Outlet />
}
