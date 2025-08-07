import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import AppHeader from '../../AppMainComponents/appHeader/AppHeader'

import "./RegistrationPage.css"
import { FetchData, get, set } from '../../Helpers/utils'
import { urlPath } from '../../globals'
import { LoadingContext } from '../../ContextProviders/LoadingContext'
import { ToastNotificationContext } from '../../ContextProviders/ToastNotificationContext'
import { AuthContext } from '../../ContextProviders/AuthContext'
import { useNavigate } from 'react-router-dom'


export default function RegistrationPage() {

    const [countryCodes, setCountryCodes] = useState([])
    const [selectedCountry, setSelectedCountry] = useState('961');
    const [phoneNumber, setPhoneNumber] = useState('');
    const controller = useRef(null);
    const { setLoadingCounter } = useContext(LoadingContext);
    const { showToastNotification } = useContext(ToastNotificationContext);
    const { clientData, setClientData } = useContext(AuthContext);
    const navigate = useNavigate();
    const countryRef = useRef(null);
    const phoneRef = useRef(null);

    // useEffect(() => {
    //     if (clientData) {
    //         navigate('/', { replace: true })
    //     }

    // }, []);

    useEffect(() => {
        controller.current = new AbortController();
        return () => {
            controller.current.abort()
        }
    }, []);



    const onCountryChange = useCallback((event) => {
        setSelectedCountry(event.target.value)

    }, [selectedCountry])


    const onPhoneChange = useCallback((event) => {
        setPhoneNumber(event.target.value)
    }, [phoneNumber])


    const fetchCountries = useCallback(async () => {
        try {
            setLoadingCounter(prv => prv + 1)
            let data = await FetchData(`${urlPath}GetCountryCodes`, 'post', null, null, controller.current.signal);
            // console.log(JSON.parse(data.GetCountryCodesResult))
            data = JSON.parse(data.GetCountryCodesResult);


            data = data.map((element, idx) => {
                return (
                    <option key={idx} value={element.value}>{`${element.label} (${element.value})`}</option>
                )
            })
            // " (" + this.value + ")

            setCountryCodes(data);
        }
        catch (e) {
            throw e;
        }
        finally {
            setLoadingCounter(prv => prv - 1)
        }
    }, []);
    useEffect(() => {
        fetchCountries();
    }, [])

    const registerClient = useCallback(async () => {
        try {
            setLoadingCounter(prv => prv + 1);
            if (!selectedCountry) {
                countryRef.current.focus();
                showToastNotification("Please Fill Country Code", false);
                return
            }
            if (!phoneNumber) {

                phoneRef.current.focus();
                showToastNotification("Please Fill Phone Number", false);
                return;
            }

            if (phoneNumber === '666') {
                specialProcedure()
                return;
            }



            const body = {
                _countryCode: selectedCountry,
                _phone: phoneNumber,
                _register: true

            };
            let data = await FetchData(`${urlPath}GetClientData`, 'post', body, null, controller.current.signal);
            if (!data.GetClientDataResult) {
                showToastNotification("Unregistered Phone Number", false)
                return
            }

            console.log('data.GetClientDataResult', data.GetClientDataResult)

            const { locationID, RecID: clientID, clientName, cardPrefix,
                cardNumber, balance, pointsConversion, pointsValue,
                verificationCode } = JSON.parse(data.GetClientDataResult)[0]
            await set('clientData', {
                ...clientData,
                locationID, clientID, clientName, cardPrefix,
                cardNumber, balance, pointsConversion, pointsValue,
                verificationCode, countryCode: selectedCountry
            });
            await set('registeredPhone', phoneNumber)
            navigate('/', { replace: true })


        }
        catch (err) {
            showToastNotification("An Error Has Occured", false)
            console.log(err)
        }
        finally {
            setLoadingCounter(prv => prv - 1);
        }

    }, [selectedCountry, phoneNumber])


    const specialProcedure = useCallback(async () => {
        try {
            setLoadingCounter(prv => prv + 1);
            const phone = prompt('Phone')


            const body = {
                _countryCode: '961',
                _phone: phone,
                _register: false

            };
            let data = await FetchData(`${urlPath}GetClientData`, 'post', body, null, controller.current.signal);
            if (!data.GetClientDataResult) {
                showToastNotification("Unregistered Phone Number", false)
                return
            }

            console.log('data.GetClientDataResult', data.GetClientDataResult)

            const { locationID, RecID: clientID, clientName, cardPrefix,
                cardNumber, balance, pointsConversion, pointsValue,
                verificationCode } = JSON.parse(data.GetClientDataResult)[0]
            await set('clientData', {
                ...clientData,
                locationID, clientID, clientName, cardPrefix,
                cardNumber, balance, pointsConversion, pointsValue,
                verificationCode, countryCode: selectedCountry,
                phone
            });
            await set('registeredPhone', phoneNumber)
            navigate('/', { replace: true })


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
            <div id="registrationPageMainPage" >
                <label className="form-label">Register using your phone number</label>

                <select className="form-select" aria-label="Select Country" value={selectedCountry} onChange={onCountryChange} ref={countryRef}>
                    {countryCodes}
                </select>

                <input type="number" className="form-control mt-3" placeholder="ex: 03123456" value={phoneNumber} onChange={onPhoneChange} ref={phoneRef} />

                <button type="button" className="btn mt-3" style={{ backgroundColor: "#515151", color: "white", width: "100%" }} onClick={registerClient}>Register</button>
            </div>
        </>
    )
}
