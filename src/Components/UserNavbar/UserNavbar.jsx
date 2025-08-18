import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
    Navbar, 
    NavbarBrand, 
    NavbarToggler, 
    Collapse, 
    Nav, 
    NavItem, 
    NavLink,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    Button
} from 'reactstrap';
import './UserNavbar.css';
import { clearSessionInfo } from '../../utils/session';

export function UserNavbar() {
    // ========================================
    // STATE MANAGEMENT
    // ========================================
    const [isOpen, setIsOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    // const [isInstalled, setIsInstalled] = useState(false);

    
    const navigate = useNavigate();
    const location = useLocation();

    // ========================================
    // NAVIGATION CONFIGURATION 
    // ========================================
    const navigationItems = [
        {
            id: 'home',
            label: 'Home',
            icon: 'fa-home',
            path: '/',
            showOnDesktop: true,
            showOnMobile: true
        },
        {
            id: 'payment',
            label: 'Payment',
            icon: 'fa-qrcode',
            path: '/payment',
            showOnDesktop: true,
            showOnMobile: true,
            isPrimary: true
        },
        {
            id: 'transactions',
            label: 'Transactions',
            icon: 'fa-list-alt',
            path: '/transactions',
            showOnDesktop: true,
            showOnMobile: true
        }
    ];

    // ========================================
    // PWA INSTALL FUNCTIONALITY
    // ========================================
    // useEffect(() => {
    //     const handleBeforeInstallPrompt = (e) => {
    //         e.preventDefault();
    //         setDeferredPrompt(e);
    //     };

    //     const checkIfInstalled = () => {
    //         if (window.matchMedia('(display-mode: standalone)').matches) {
    //             setIsInstalled(true);
    //         }
    //     };

    //     window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    //     window.addEventListener('appinstalled', () => setIsInstalled(true));
    //     checkIfInstalled();

    //     return () => {
    //         window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    //         window.removeEventListener('appinstalled', () => setIsInstalled(true));
    //     };
    // }, []);

    // ========================================
    // NAVIGATION HANDLERS
    // ========================================
    const toggle = () => setIsOpen(!isOpen);

    const handleNavigation = useCallback((path) => {
        navigate(path);
        setIsOpen(false);
    }, [navigate]);

    const logout = useCallback(() => {
        // Perform logout logic here
        // clearSessionInfo();
        navigate('/login', { replace: true});
    }, [navigate]);

    // const handleInstallApp = async () => {
    //     if (deferredPrompt) {
    //         deferredPrompt.prompt();
    //         const { outcome } = await deferredPrompt.userChoice;
    //         if (outcome === 'accepted') {
    //             setIsInstalled(true);
    //         }
    //         setDeferredPrompt(null);
    //     }
    // };

    const isCurrentPage = (path) => {
        return location.pathname === path || 
               (path === '/' && location.pathname === '/');
    };

    // ========================================
    // RENDER COMPONENT
    // ========================================
    return (
        <Navbar 
            className={`User-navbar ${isVisible ? 'navbar-visible' : 'navbar-hidden'}`}
            expand="lg" 
            fixed="top"
        >
            {/* ========================================
                BRAND SECTION (Logo + Name)
                ======================================== */}
            <NavbarBrand 
                className="User-brand" 
                onClick={() => handleNavigation('/')}
            >
                <div className="brand-container">
                    <div className="brand-logo">
                        <i className="fa fa-credit-card brand-icon"></i>
                    </div>
                    <div className="brand-text">
                        <span className="brand-name">Cashless</span>
                        <small className="brand-subtitle">User Portal</small>
                    </div>
                </div>
            </NavbarBrand>

            {/* ========================================
                DESKTOP NAVIGATION (Center)
                ======================================== */}
            <Nav className="desktop-nav d-none d-lg-flex mx-auto" navbar>
                {navigationItems.map((item) => (
                    <NavItem key={item.id} className="nav-item-desktop">
                        <NavLink
                            className={`nav-link-desktop ${isCurrentPage(item.path) ? 'active' : ''} ${item.isPrimary ? 'primary-nav' : ''}`}
                            onClick={() => handleNavigation(item.path)}
                        >
                            <i className={`fa ${item.icon} nav-icon`}></i>
                            <span className="nav-text">{item.label}</span>
                            {isCurrentPage(item.path) && <div className="active-indicator"></div>}
                        </NavLink>
                    </NavItem>
                ))}
            </Nav>

            {/* ========================================
                DESKTOP RIGHT SECTION - UPDATED LAYOUT
                ======================================== */}
            <div className="desktop-right-section d-none d-lg-flex">
                {/* Desktop User Info - Now First */}
                <UncontrolledDropdown>
                    <DropdownToggle tag="div" className="desktop-User-toggle">
                        <div className="User-info-section">
                            <div className="User-details">
                                <span className="User-name">User</span>
                                <small className="User-terminal">Terminal 1</small>
                            </div>
                            <i className="fa fa-user-circle User-avatar"></i>
                            <i className="fa fa-caret-down User-caret"></i>
                        </div>
                    </DropdownToggle>
                    <DropdownMenu right className="desktop-User-menu">
                        <DropdownItem header>
                            <strong>User Portal</strong>
                            <br />
                            <small className="text-muted">Terminal 1</small>
                        </DropdownItem>
                        <DropdownItem divider />
                        <DropdownItem 
                            className="desktop-menu-item"
                            onClick={() => handleNavigation('/profile')}
                        >
                            <i className="fa fa-user"></i>
                            Profile
                        </DropdownItem>
                        <DropdownItem divider />
                        <DropdownItem 
                            className="desktop-menu-item logout-item"
                            onClick={logout}
                        >
                            <i className="fa fa-sign-out"></i>
                            Logout
                        </DropdownItem>
                    </DropdownMenu>
                </UncontrolledDropdown>

                {/* Install App Button  
                {!isInstalled && deferredPrompt && (
                    <Button 
                        color="outline-light" 
                        size="sm" 
                        className="install-btn"
                        onClick={handleInstallApp}
                    >
                        <i className="fa fa-download"></i>
                        <span className="install-text ">Install App</span>
                    </Button>
                )}
                */}
            </div>

            {/* ========================================
                MOBILE CONTROLS (Settings + Hamburger)
                ======================================== */}
            <div className="mobile-controls d-lg-none">
                {/* Mobile Settings Icon */}
                <UncontrolledDropdown>
                    <DropdownToggle tag="div" className="mobile-profile-toggle">
                        <i className="fa fa-user mobile-profile-icon"></i>
                    </DropdownToggle>
                    <DropdownMenu right className="mobile-profile-menu">
                        <DropdownItem header>
                            <strong>User Portal</strong>
                            <br />
                            <small className="text-muted">Terminal 1</small>
                        </DropdownItem>
                        <DropdownItem divider />
                        <DropdownItem 
                            className="mobile-menu-item"
                            onClick={() => handleNavigation('/profile')}
                        >
                            <i className="fa fa-user"></i>
                            Profile
                        </DropdownItem>
                        {/* 
                        // Uncomment below to enable install app option in mobile menu
                        // {!isInstalled && deferredPrompt && (
                        //     <>
                        //         <DropdownItem divider />
                        //         <DropdownItem 
                        //             className="mobile-menu-item install-item"
                        //             onClick={handleInstallApp}
                        //         >
                        //             <i className="fa fa-download"></i>
                        //             Install App
                        //         </DropdownItem>
                        //     </>
                        // )}
                        */}
                        <DropdownItem divider />
                        <DropdownItem 
                            className="mobile-menu-item logout-item"
                            onClick={logout}
                        >
                            <i className="fa fa-sign-out"></i>
                            Logout
                        </DropdownItem>
                    </DropdownMenu>
                </UncontrolledDropdown>

                {/* Mobile Menu Toggler */}
                <NavbarToggler onClick={toggle} className="mobile-toggler">
                    <i className={`fa ${isOpen ? 'fa-times' : 'fa-bars'} toggler-icon`}></i>
                </NavbarToggler>
            </div>

            {/* ========================================
                MOBILE NAVIGATION MENU
                ======================================== */}
            <Collapse isOpen={isOpen} navbar>
                <Nav className="mobile-nav d-lg-none" navbar>
                    {navigationItems.map((item) => (
                        <NavItem key={item.id} className="nav-item-mobile">
                            <NavLink
                                className={`nav-link-mobile ${isCurrentPage(item.path) ? 'active' : ''} ${item.isPrimary ? 'primary-nav' : ''}`}
                                onClick={() => handleNavigation(item.path)}
                            >
                                <i className={`fa ${item.icon} nav-icon`}></i>
                                <span className="nav-text">{item.label}</span>
                                {isCurrentPage(item.path) && <div className="active-indicator-mobile"></div>}
                            </NavLink>
                        </NavItem>
                    ))}
                </Nav>
            </Collapse>
        </Navbar>
    );
}