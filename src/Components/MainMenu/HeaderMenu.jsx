import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../ContextProvider/AuthContext';
import { clearSessionInfo } from '../../utils/session';
import { Nav, Navbar, NavbarBrand, NavbarToggler, Collapse, UncontrolledDropdown, DropdownMenu, DropdownToggle, DropdownItem } from 'reactstrap';
import './headerMenu.css';

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

    //Component Did Update Equivalent in Class Based Components
    useEffect(() => {
        if (state?.mobileMenu !== mobileMenu || state?.showMobileMenu !== showMobileMenu) {
            setState({ ...state, mobileMenu: mobileMenu, showMobileMenu: showMobileMenu });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mobileMenu, showMobileMenu])


    const logout = useCallback(() => {
        clearSessionInfo();
        navigate('/login', { replace: true })
    }, [navigate])

    const toggle = useCallback((key) => {
        setState({ ...state, isOpen: key !== "goToPage" ? !state.isOpen : false })
    }, [state])

    const goToPage = useCallback((url, uuid) => {
        // setState({ ...state, isOpen: false })
        console.log('url', url)
        toggle("goToPage")
        navigate(url, { state: { uuid } })
    }, [navigate, toggle])


    return (
        <>
            <Navbar color="light" light expand="md" className='app-header'>
                <NavbarBrand href="/">
                    <span className="navbar-brand"><img src="./img/ctserv.png" alt="logo" /></span>
                </NavbarBrand>
                <NavbarToggler onClick={toggle} />
                <Collapse isOpen={state.isOpen} navbar>
                    <Nav className="ml-auto" navbar>

                        <UncontrolledDropdown nav inNavbar>
                            <DropdownToggle nav caret onClick={() => { console.log('test 1') }}>
                                Test 1
                            </DropdownToggle>
                        </UncontrolledDropdown>

                        <UncontrolledDropdown nav inNavbar>
                            <DropdownToggle nav caret onClick={() => { console.log('test 2') }}>
                                Test 2
                            </DropdownToggle>
                        </UncontrolledDropdown>

                        <UncontrolledDropdown nav inNavbar>
                            <DropdownToggle nav caret onClick={() => { console.log('test 3') }}>
                                Test 3
                            </DropdownToggle>
                        </UncontrolledDropdown>

                        <UncontrolledDropdown nav inNavbar>
                            <DropdownToggle nav caret>
                                <i className="fa fa-user fa-lg hidden-sm-down" style={{ marginRight: "1rem" }}></i>
                                {state.userName} ({state.userType})
                                <i className="icon-arrow-down hidden-sm-down" style={{ marginLeft: "1rem" }}></i>
                            </DropdownToggle>
                            <DropdownMenu className='DropdownMenuRightclear'>
                                <DropdownItem className="pointer" onClick={() => goToPage('/profile')}><span><i className="fa fa-user"></i>Profile</span></DropdownItem>
                                <DropdownItem className="pointer" onClick={() => goToPage('/auth/Settings')}><span><i className="fa fa-cogs"></i>Settings</span></DropdownItem>
                                <DropdownItem className="pointer" onClick={logout}><span><i className="fa fa-lock"></i>Logout</span></DropdownItem>
                            </DropdownMenu>
                        </UncontrolledDropdown>
                    </Nav>
                </Collapse>
            </Navbar>

        </>

    )
}
