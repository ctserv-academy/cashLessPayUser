import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import AnimatedNumbers from "react-animated-numbers";
import Barcode from 'react-barcode';

import "./Home.css"
import { AuthContext } from '../../ContextProviders/AuthContext';
import { InstallPromptContext } from '../../ContextProviders/InstallPromptContext';


export default function Home() {

    const { clientData } = useContext(AuthContext);
    const { isInstalled, deferredPrompt, setIsInstalled, toggleAskForNotificationRef, askForNotification } = useContext(InstallPromptContext);
    const originalCardNo = useRef('');
    const cardNbrWithoutPrefix = useRef('');
    const clientName = useRef('')
    const [cardNo, setCardNo] = useState(originalCardNo.current);
    const [touchStart, setTouchStart] = useState(0)
    const [touchEnd, setTouchEnd] = useState(0)
    const [cntr, setcntr] = useState(0)

    useEffect(() => {

        if (askForNotification === "Y") {
            toggleAskForNotificationRef.current()
        }
    }, [])

    useEffect(() => {
        if (clientData) {
            originalCardNo.current = clientData.cardPrefix ? clientData.cardPrefix?.replaceAll(" ", "") + clientData?.cardNumber.replaceAll(" ", "") : '';
            cardNbrWithoutPrefix.current = clientData.cardNumber?.replaceAll(" ", "")
            setCardNo(0);
            clientName.current = clientData.clientName
        }
    }, [clientData])
    const timeoutId = useRef(null);
    const minSwipeDistance = 50

    const animateNumbers = useCallback(() => {
        timeoutId.current = setTimeout(() => {
            setCardNo(prv => prv + 1);
            animateNumbers()

        }, 12000)

    }, [cardNo]);



    useEffect(() => {
        animateNumbers()
        return () => {
            clearTimeout(timeoutId.current)
        }
    }, []);


    const handleTouchStart = (e) => {
        setTouchEnd(null)
        setTouchStart(e.targetTouches[0].clientX)
    }

    const handleTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX)

    const handleTouchEnd = () => {
        if (!touchStart || !touchEnd) return
        const distance = touchStart - touchEnd
        const isLeftSwipe = distance > minSwipeDistance
        if (isLeftSwipe)
            setcntr(1)
        else
            setcntr(0)
    }

    useEffect(() => {
        clearTimeout(timeoutId.current);
        animateNumbers();

    }, [cntr])


    return (
        <div id="home-main-container">
            {isInstalled === "N" && deferredPrompt && (
                <a
                    href="#"
                    id="install-fab"
                    onClick={async (e) => {
                        e.preventDefault();
                        deferredPrompt.prompt();
                        const { outcome } = await deferredPrompt.userChoice;
                        if (outcome === 'accepted') {
                            setIsInstalled(true);
                        }
                    }}
                >
                    Install Application
                </a>
            )}
            <div id='upper-section-background' onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
                {cntr === 0 && <div id='card-container-face'>
                    <div id='card-face-card-number' style={{ position: 'absolute', top: '55%' }}>
                        <AnimatedNumbers
                            key={cardNo}
                            animateToNumber={originalCardNo.current}
                            // fontStyle={{ fontSize: 32 }}
                            configs={(number, index) => {
                                return { mass: 1, tension: 230, friction: 140 };
                            }}
                        ></AnimatedNumbers>

                    </div>
                    <div id="card-face-client-name" style={{ position: 'absolute', top: '80%' }}>
                        {clientName.current}
                    </div>


                </div>
                }
                {
                    cntr === 1 && <div id='card-container-tail_old'>
                        <div className='text-center pt-3 pb-1' >
                            <span id="card-tail-client-name" >
                                {clientName.current}
                            </span>
                        </div>
                        <div id="card-tail-barcode">

                            <Barcode
                                format='CODE39'
                                font='14'
                                width={2}
                                displayValue={false}
                                height={85}
                                value={cardNbrWithoutPrefix.current.toString()} />

                        </div>
                        <div id="card-tail-card-number-container">
                            <div id="card-tail-card-number">
                                <AnimatedNumbers
                                    key={cardNo}
                                    animateToNumber={originalCardNo.current}
                                    // fontStyle={{ fontSize: 32 }}
                                    configs={(number, index) => {
                                        return { mass: 1, tension: 230, friction: 140 };
                                    }}
                                ></AnimatedNumbers>
                            </div>
                        </div>
                        {/* <div id="card-tail-footer-caption" className='text-center'>
                            <span >
                                Place code next to scanner
                            </span>

                        </div> */}


                    </div>
                }

                <div className='mt-2'>
                    <div className='row'>
                        <div className='col-6 text-end'>
                            <span className={`carousel-dot ${cntr === 0 ? 'carousel-dot-filled' : ''} `} onClick={() => {
                                setcntr(0)
                            }} />
                        </div>
                        <div className='col-6 text-start'>
                            <span className={`carousel-dot ${cntr === 1 ? 'carousel-dot-filled' : ''} `} onClick={() => {
                                setcntr(1)
                            }} />
                        </div>
                    </div>
                    <div id='carousel-controls-caption' className='row'>
                        <div className='col-12 text-center' style={{ color: 'lightgray' }} >
                            Swipe To Scan
                        </div>

                    </div>


                </div>
            </div>

            <div id='lower-section-background'>
                <div id="userMainContainer" className='mt-5'>
                    <div id="userContainer">
                        <div id="userIcon">
                            <img src={`${process.env.PUBLIC_URL}/images/profile.png`}></img>
                            {/* <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="currentColor" className="bi bi-person-circle" viewBox="0 0 16 16">
                                <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                                <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z" />
                            </svg> */}
                        </div>
                        <div id="userProfile">{clientName.current}</div>
                    </div>
                </div>
            </div>

        </div >
    );
}


// class Home extends React.Component {
//     constructor() {
//         super();
//         this.state = {
//         }
//     }

//     render() {

//         return (
//             <div id="home-main-container">
//                 <div id="barcodeMainContainer">
//                     <div id="barcodeContainer">
//                         <Barcode value="234234523566662345" />
//                     </div>
//                 </div>
//                 <div id="userMainContainer" className='mt-5'>
//                     <div id="userContainer">
//                         <div  id="userIcon">
//                             <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="currentColor" class="bi bi-person-circle" viewBox="0 0 16 16">
//                                 <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
//                                 <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z" />
//                             </svg>
//                         </div>
//                         <div id="userProfile">bassem</div>
//                     </div>
//                 </div>
//             </div >
//         );
//     }
// }

// export default Home;