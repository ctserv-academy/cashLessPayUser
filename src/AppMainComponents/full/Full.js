import React, { useCallback, useEffect, useMemo, useState, useLayoutEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom';
import AppHeader from '../appHeader/AppHeader';
import AppFooter from '../appFooter/AppFooter';
import AppNav from '../appNav/AppNav';


export default function Full() {
    const [isAppNavVisible, setIsAppNavVisible] = useState(false);
    const [deviceType, setDeviceType] = useState('');


    const getDeviceInfo = useCallback(() => {
        // Check if running on iOS
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        setDeviceType(isIOS ? 'ios' : 'web');
    }, []);
    useLayoutEffect(() => {
        getDeviceInfo()
    }, [getDeviceInfo]);


    const location = useLocation();

    const mainBodyContainerStyle = useMemo(() => {
        const style = (deviceType === 'ios' ? { height: "calc(100% - 190px)", overflow: "auto" } : { height: "calc(100% - 140px)", overflow: "auto" })
        if (location.pathname.toLowerCase() === '/home') {
            return {
                ...style, padding: 0
            }
        }
        else {
            return style
        }

    }, [location.pathname, deviceType]);
    useEffect(() => {
        console.log(location)
        window.addEventListener("click", onScreenClick);
        return () => {
            window.removeEventListener("click", onScreenClick);
        }
    }, [isAppNavVisible]);

    const onScreenClick = useCallback((e) => {
        if (isAppNavVisible === true && e.target.id !== "appNavMainContainer" && e.target.id !== "navSliderBtn" && e.target.id !== 'navSliderBtn1' && e.target.className.animVal !== "bi bi-list")
            setIsAppNavVisible(false)
    }, [isAppNavVisible]);

    const toggleAppNav = useCallback(() => {
        setIsAppNavVisible(prv => !prv);
    }, [])

    return (
        <>
            <div className="App" >
                <AppNav isAppNavVisile={isAppNavVisible} />
                <AppHeader />
                <main id="mainBodyContainer" style={mainBodyContainerStyle} >
                    <div className="container-fluid" style={{ height: '100%' }}>
                        <Outlet />
                    </div>
                </main>
                <AppFooter toggleAppNav={toggleAppNav} />
            </div>
        </>
    )
}



// class Full extends React.Component {
//     constructor() {
//         super();
//         this.state = {
//             isAppNavVisile: false
//         }


//     }

//     componentDidMount() {
//         window.addEventListener("click", this.onScreenClick);
//     }

//     componentWillUnmount() {
//         window.removeEventListener("click", this.onScreenClick);
//     }

//     onScreenClick = (e) => {
//         if (this.state.isAppNavVisile === true && e.target.id !== "appNavMainContainer" && e.target.id !== "navSliderBtn" && e.target.className.animVal !== "bi bi-list")
//             this.setState({ isAppNavVisile: false })
//     }

//     toggleAppNav = () => {
//         this.setState({ isAppNavVisile: !this.state.isAppNavVisile })
//     }

//     render() {
//         let { isAppNavVisile } = this.state
//         return (
//             <>
//                 <div className="App" >
//                     <AppNav isAppNavVisile={isAppNavVisile} />
//                     <AppHeader />
//                     <main id="mainBodyContainer" style={{ height: "calc(100% - 110px)", overflow: "auto" }} >
//                         <div className="container-fluid" style={{ height: '100%' }}>
//                             <Outlet />
//                         </div>
//                     </main>
//                     <AppFooter toggleAppNav={this.toggleAppNav} />
//                 </div>
//             </>
//         )
//     }
// }



// export default Full;
