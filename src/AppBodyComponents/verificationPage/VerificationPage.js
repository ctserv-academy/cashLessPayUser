import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import "./VerificationPage.css"

import AppHeader from '../../AppMainComponents/appHeader/AppHeader'
import { AuthContext } from '../../ContextProviders/AuthContext';
import { LoadingContext } from '../../ContextProviders/LoadingContext';
import { ToastNotificationContext } from '../../ContextProviders/ToastNotificationContext';
import { FetchData } from '../../Helpers/utils';
import { urlPath } from '../../globals';
import { useNavigate } from 'react-router-dom';
import { get, set, remove } from '../../Helpers/utils';
import { usePWA } from '../../hooks/usePWA';
import { InstallPromptContext } from '../../ContextProviders/InstallPromptContext';

export default function VerificationPage() {
    const { clientData, setClientData } = useContext(AuthContext);
    const { setLoadingCounter } = useContext(LoadingContext);
    const { showToastNotification } = useContext(ToastNotificationContext);
    const [verificationCode, setVerificationCode] = useState('');
    const { deferredPrompt } = useContext(InstallPromptContext);


    const controller = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        controller.current = new AbortController();
        return () => {
            controller.current.abort()
        }
    }, []);

    useEffect(() => {
        console.log('clientData', clientData);
        get('clientData').then(data => console.log('Client Data', data))


    }, [])

    const verifyUser = useCallback(() => {

    }, [])

    const onVerificationChange = useCallback((event) => {
        setVerificationCode(event.target.value);
    }, [verificationCode]);

    useEffect(() => {
        console.log('deferredPromptSideEffect', deferredPrompt)
    }, [deferredPrompt])
    const verifyClient = useCallback(async () => {
        try {
            setLoadingCounter(prv => prv + 1);
            let body = {
                _LocID: clientData.locationID,
                _clientID: clientData.clientID,
                _OTP: verificationCode

            };
            const data = await FetchData(`${urlPath}VerifyOTP`, 'post', body, null, controller.current.signal);

            if (data.VerifyOTPResult.toLowerCase() === "false") {
                showToastNotification("Wrong Verification Code!", false);
                return;
            }
            else {
                await set('isVerified', true)
                console.log('deferredPrompt', deferredPrompt)
                if (deferredPrompt) {
                    const promptResult = await deferredPrompt.prompt();
                    console.log('promptResult', promptResult)
                }
                navigate('/home', { replace: true })
            }


            // let phone = await get('registeredPhone');
            // await set('clientData', {
            //     ...clientData,
            //     phone
            // });

            // if (clientData) {
            //     if (clientData.verificationCode !== verificationCode) {
            //         showToastNotification("Wrong Verification Code!", false);
            //         return;
            //     }
            // }

            // const body = {
            //     _LocID: clientData.locationID,
            //     _clientID: clientData.clientID,
            //     _Platform: info?.platform,
            //     _GCMID: clientData.GCMID

            // };
            // let data = await FetchData(`${urlPath}RegisterDeviceGCMID`, 'post', body, null, controller.current.signal);
            // let phone = await get('registeredPhone');
            // await set('clientData', {
            //     ...clientData,
            //     phone
            // });




        }
        catch (err) {
            showToastNotification("An Error Has Occured", false)
            console.log(err)
        }
        finally {
            setLoadingCounter(prv => prv - 1);
        }

    }, [verificationCode])

    const requestNewOTP = useCallback(async () => {
        try {
            setLoadingCounter(prv => prv + 1);
            const phone = await get('registeredPhone')
            const countryCode = clientData.countryCode


            const body = {
                _countryCode: countryCode,
                _phone: phone,

            };
            let data = await FetchData(`${urlPath}ResendOTP`, 'post', body, null, controller.current.signal);
            if (!data.ResendOTPResult) {
                showToastNotification("You Have Exceeded The OTP Daily Limit", false)
                return
            }
            else {
                showToastNotification("Verification Code Sent Successfully Please Check You SMS Messages", true)
            }

        }
        catch (err) {
            showToastNotification("An Error Has Occured", false)
            console.log(err)
        }
        finally {
            setLoadingCounter(prv => prv - 1);
        }
    }, [])
    return (
        <>
            <AppHeader />
            <div id="verificationPageMainPage" >
                <label className="form-label">Enter verification code</label>

                <input type="number" className="form-control" placeholder="Verification Code" value={verificationCode} onChange={onVerificationChange} />

                <button type="button" className="btn mt-3" style={{ backgroundColor: "#515151", color: "white", width: "100%" }} onClick={verifyClient}>Verify</button>

                <div className="row">
                    <div className="col-12 mt-1" style={{ textAlign: "right" }}>
                        <button type="button"
                            className="btn btn-info px-3 pointer btn-radius"
                            onClick={
                                requestNewOTP
                            }>
                            Request New Verification Code
                        </button>
                    </div>
                </div>
            </div >
        </>
    )
}
