import React from 'react'
import { Nav, NavItem, NavLink } from 'reactstrap';
import './Navbar.css'
import { map } from 'lodash';

export default function Navbar({ tabulationMenu, navLinkClick, detailsContainerRender }) {
    return (
        <div className='sysFile-nav-MainMenu col-2'>
            <div className='sysFile-nav-menuComponent'>
                {map(tabulationMenu, (eachMenu, eachMenuKey) => {
                    return (
                        <Nav tabs key={eachMenuKey} className={` ${eachMenuKey === 0 ? 'sysFile-nav first-sysFile-nav' : 'sysFile-nav'}  `}>
                            <NavItem className={detailsContainerRender === eachMenu.id ? 'sysFile-nav-item pointer sys-active' : 'sysFile-nav-item pointer'}>
                                <NavLink
                                    className={detailsContainerRender === eachMenu.id ? 'sysFile-nav-link sys-active' : 'sysFile-nav-link'}
                                    onClick={() => { navLinkClick(eachMenu.id); }}
                                >
                                    {eachMenu.label}
                                </NavLink>
                            </NavItem>
                        </Nav>
                    )
                })
                }
            </div>
        </div>
    )
}
