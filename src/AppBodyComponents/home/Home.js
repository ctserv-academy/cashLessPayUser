import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import Barcode from 'react-barcode';

import "./Home.css"
import { AuthContext } from '../../ContextProviders/AuthContext';
import { InstallPromptContext } from '../../ContextProviders/InstallPromptContext';


export default function Home() {

    const { clientData } = useContext(AuthContext);
    const { isInstalled, deferredPrompt, setIsInstalled, toggleAskForNotificationRef, askForNotification } = useContext(InstallPromptContext);
    const clientName = useRef('')
    const clientPhone = useRef('')
    const [cardNo, setCardNo] = useState('');


    useEffect(() => {


        toggleAskForNotificationRef.current()

    }, [])

    useEffect(() => {
        if (clientData) {
            setCardNo(clientData.cardNumber);
            clientName.current = clientData.clientName
            clientPhone.current = clientData.phone
        }
    }, [clientData])




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
            <div id='upper-section-background' >

                <div id='card-container-tail'>
                    <div className='text-center pt-3 pb-1 mt-3' >
                        <span id="card-tail-client-name" >
                            Card Number
                        </span>
                    </div>
                    <div id="card-tail-barcode"  >

                        <Barcode
                            format='CODE39'
                            font='14'
                            width={2}
                            displayValue={false}
                            height={85}
                            value={cardNo} />

                    </div>
                    {/* <div style={{ fontSize: '17px', textAlign: 'center' }}  >
                        {cardNo}
                    </div> */}

                </div>

            </div>

            <div id='lower-section-background'>
                <div id="userMainContainer" className='mt-5'>
                    <div id="userContainer">
                        <div id="userIcon">
                            <img src={`${process.env.PUBLIC_URL}/images/profile.png`}></img>

                        </div>
                        <div id="userProfile">{clientName.current}</div>
                        <div id="userProfile">{clientPhone.current}</div>
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