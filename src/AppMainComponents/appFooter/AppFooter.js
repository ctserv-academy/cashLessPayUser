import React, { useState, useCallback, useLayoutEffect, useContext } from 'react'
import "./AppFooter.css"
import { Link } from 'react-router-dom';
import { NotificationContext } from '../../ContextProviders/NotificationContext';
import { useNetwork } from '../../hooks/useNetwork';



export default function AppFooter({ toggleAppNav, ...rest }) {
    const [deviceType, setDeviceType] = useState('');
    const { notificationCount, setNotificationCount } = useContext(NotificationContext);
    const { isOnline } = useNetwork();
    const getDeviceInfo = useCallback(() => {
        // Check if running on iOS
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        setDeviceType(isIOS ? 'ios' : 'web');
    }, []);

    useLayoutEffect(() => {
        getDeviceInfo();
    }, [getDeviceInfo]);

    return (
        <>
            {!isOnline &&
                <div id="NoInternetBannerMianContainer">
                    No Internet &nbsp;&nbsp;
                    <svg className="wifi-container bi bi-wifi" xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M15.384 6.115a.485.485 0 0 0-.047-.736A12.44 12.44 0 0 0 8 3C5.259 3 2.723 3.882.663 5.379a.485.485 0 0 0-.048.736.52.52 0 0 0 .668.05A11.45 11.45 0 0 1 8 4c2.507 0 4.827.802 6.716 2.164.205.148.49.13.668-.049" />
                        <path d="M13.229 8.271a.482.482 0 0 0-.063-.745A9.46 9.46 0 0 0 8 6c-1.905 0-3.68.56-5.166 1.526a.48.48 0 0 0-.063.745.525.525 0 0 0 .652.065A8.46 8.46 0 0 1 8 7a8.46 8.46 0 0 1 4.576 1.336c.206.132.48.108.653-.065m-2.183 2.183c.226-.226.185-.605-.1-.75A6.5 6.5 0 0 0 8 9c-1.06 0-2.062.254-2.946.704-.285.145-.326.524-.1.75l.015.015c.16.16.407.19.611.09A5.5 5.5 0 0 1 8 10c.868 0 1.69.201 2.42.56.203.1.45.07.61-.091zM9.06 12.44c.196-.196.198-.52-.04-.66A2 2 0 0 0 8 11.5a2 2 0 0 0-1.02.28c-.238.14-.236.464-.04.66l.706.706a.5.5 0 0 0 .707 0l.707-.707z" />
                    </svg>
                </div >
            }
            <div id={deviceType === 'ios' ? "mainFooterContainerIOS" : "mainFooterContainer"}>
                <div className='row justify-content-center'>
                    <div className='col-2 text-center ms-1'>
                        <Link to="/Home">
                            <img src={`${process.env.PUBLIC_URL}/images/icons/home.png`} />
                        </Link>
                    </div>

                    <div className='col-2 text-center ms-2'>
                        <Link to="/RewardsPoints">
                            <img src={`${process.env.PUBLIC_URL}/images/icons/points.png`} />
                        </Link>
                    </div>

                    <div className='col-2 text-center ms-2'>
                        <Link onClick={() => {
                            setNotificationCount(0)
                        }} to="/Notifications" className="notification-icon-container">
                            <img src={`${process.env.PUBLIC_URL}/images/icons/notifications.png`} />
                            {notificationCount > 0 && (
                                <span className="footer-notification-badge">
                                    {notificationCount}
                                </span>
                            )}
                        </Link>
                    </div>

                    <div className='col-2 text-center ms-2'>
                        <Link to="/ContactUs">
                            <img src={`${process.env.PUBLIC_URL}/images/icons/info.png`} />
                        </Link>
                    </div>

                    {/* <div id="navSliderBtn" className='col-2 text-center ms-2' onClick={toggleAppNav} >
                    <img id='navSliderBtn1' src={`${process.env.PUBLIC_URL}/images/icons/menu.png`} />


                </div> */}

                </div>
            </div>
        </>

    )

}

