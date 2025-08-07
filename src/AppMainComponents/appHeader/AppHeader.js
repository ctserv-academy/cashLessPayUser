import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react'
import "./AppHeader.css"


export default function AppHeader() {
    const [deviceType, setDeviceType] = useState('');

    const getDeviceInfo = useCallback(() => {
        // Check if running on iOS
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        setDeviceType(isIOS ? 'ios' : 'web');
    }, []);
    useLayoutEffect(() => {
        getDeviceInfo()
    }, [getDeviceInfo]);
    return (
        <div id={`${deviceType === 'ios' ? "mainHeaderContainerIOS" : "mainHeaderContainer"}`}>
            <div id={`${deviceType === 'ios' ? "emptyHeaderIOS" : "emptyHeader"}`}></div>
            <img id={`${deviceType === 'ios' ? "headerLogoIOS" : "headerLogo"}`} alt="" src={`${process.env.PUBLIC_URL}/img/yammine_header.jpeg`} />
        </div>
    )
}



