import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../ContextProvider/AuthContext';
import { clearSessionInfo } from '../../utils/session';
import { Nav, Navbar, UncontrolledDropdown, DropdownMenu, DropdownToggle, DropdownItem } from 'reactstrap';
import './headerMenu.css'
import { mobileDevicesWidth } from '../../globals';
import { convertImageBase64ToURL } from '../../utils/functions';

export function HeaderMenu({ mobileMenu, showMobileMenu }) {

    const { userData } = useContext(AuthContext);

    const STATE = {
        mobileMenu: false,
        logindropdownOpen: false,
        loginname: userData?.userInfo?.user_name || '',
        showMobileMenu: false,
        genHospCodingDropD: false,
        vendorDropDown: false,
        purchasingDropDown: false,
        productsDropDown: false,
        usersDropD: false,
        privdata: userData?.userPriv || [],
        isOpen: false,

        userName: JSON.parse(localStorage.getItem('userData'))?.userName,
        userCode: JSON.parse(localStorage.getItem('userData'))?.userCode,
        userType: JSON.parse(localStorage.getItem('userData'))?.userType,
    };


    const [state, setState] = useState(STATE);
    const navigate = useNavigate();
    const [windowWidth, setWindowWidth] = useState(window.innerWidth)

    let header = JSON.parse(localStorage.getItem('header'))
    let logoUrl = header?.logo ? convertImageBase64ToURL(header.logo) : null

    const handleResize = () => {
        setWindowWidth(window.innerWidth);
    };

    useEffect(() => {
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    //Component Did Update Equivalent in Class Based Components
    useEffect(() => {
        if (state?.mobileMenu !== mobileMenu || state?.showMobileMenu !== showMobileMenu) {
            setState({ ...state, mobileMenu: mobileMenu, showMobileMenu: showMobileMenu });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mobileMenu, showMobileMenu])


    useEffect(() => {
        setState((prv) => { return { ...prv, loginname: userData?.userInfo?.user_name, privdata: userData?.userPriv } })
    }, [userData])


    const logout = useCallback(() => {
        clearSessionInfo();
        localStorage.clear()
        navigate('/login', { replace: true })
    }, [navigate])


    return (
        <>

            <Navbar color="light" light expand="md" className='app-header'>
                <div>
                    <img
                        id="shortLogo"
                        src={logoUrl}
                        alt={`Hospital S.A.L Logo`}
                        width='50px'
                        height='50px'
                    />
                    {windowWidth > mobileDevicesWidth && <span className='ms-4'> {header?.hospName}</span>}
                </div>

                <div className="userInfo-header-right">
                    <div className="header-content">
                        <i className="notifIconCSS fa fa-bell-o fa-1x notifIcon"></i>
                        <span >
                            {state.userName} ({state.userType})
                        </span>
                        <i className="fa fa-user userIcon"></i>
                        <Nav className="ml-auto" navbar>
                            <UncontrolledDropdown nav inNavbar>
                                <DropdownToggle className="user-dropdown-toggle">
                                    <i className="fa fa-caret-down dropdown-icon"></i>
                                </DropdownToggle>
                                <DropdownMenu className="DropdownMenuRightclear">
                                    <DropdownItem className="pointer" onClick={logout}>
                                        <span><i className="fa fa-lock"></i>Logout</span>
                                    </DropdownItem>
                                </DropdownMenu>
                            </UncontrolledDropdown>
                        </Nav>
                    </div>
                </div>


            </Navbar >
        </>

    )
}
