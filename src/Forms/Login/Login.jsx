import React, { useContext, useEffect, useRef } from 'react'
import { useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { LoadingContext } from '../../ContextProvider/LoadingContext';
import { FetchData, FetchDataMultiple, convertImageBase64ToURL } from '../../utils/functions'
import { authUrlPath, unauthUrlPath, urlPath } from '../../globals';
import { useStateWithCallback } from '../../CustomHooks/useStateWithCallback';
import './Login.css';
import ButtonComponent from '../../ReusableComponents/Button/ButtonComponent';
import { ModalComp } from '../../ReusableComponents/ModalComp/ModalComp';
import OTPModal from './OTPModal';
import ReCAPTCHA from 'react-google-recaptcha';
import { usePWA } from '../../CustomHooks/usePWA';
// import ForgotPassword from '../../ForgetRestPass/ForgotPassword';
// import ResetPassword from '../../ForgetRestPass/ResetPassword';

export function Login() {
    const STATE = {
        username: '',
        password: '',
        errorUserClass: "",
        errorUserTxt: "",
        errorPswdClass: "",
        errorPswdTxt: "",
        errorLoginTxt: "",
        pswdChangeSuccess: "",
        pswdChangeError: "",
        forgotPswdModal: false,
        resetPassModal: false,
        active: false,

        sys: null,
        showHosName: false,
        hospitalName: null,
        showLogo: false,
        logo: null,
        showShortLogo: false,
        shortLogo: null,
        showBackground: false,
        bgImage: null,
        mobBgImage: null,

        backgroundImage: null,

        timeLeft: 6000,
        timerCounter: 0,
        otpModal: false,

        recaptchaValue: null,
        recaptchaExpired: false,
    }
    const [state, setState] = useStateWithCallback(STATE);
    const [deferredPrompt, showInstall, setShowInstall] = usePWA();
    // const { userData, setUserData } = useContext(AuthContext);
    const { setisLoading } = useContext(LoadingContext);
    const recaptchaRef = useRef(null);
    const navigate = useNavigate();
    const UsrRef = useRef(null);
    const PwdRef = useRef(null);
    const BtnRef = useRef(null);

    //This part is to call the login from the switchboard. 
    //this is the url fomat to call it: http://localhost:3000/#/login/usercode/password
    const { code: urlUcode } = useParams()
    // const { 
    // screenWidth } = useScreenSize()

    useEffect(() => {
        fetchSettingsData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const fetchSettingsData = useCallback(async () => {
        setisLoading(prv => prv + 1);
        try {
            const APICalls = [
                { url: `${unauthUrlPath}/System/GetMileraMDSystemFile`, Type: 'get', params: '', datafilterfunction: null },
                { url: `${unauthUrlPath}/System/GetLogoMilera`, Type: 'get', params: '', datafilterfunction: null },
            ]
            let resp = await FetchDataMultiple(APICalls);

            let logo = resp[1]?.data[0]?.Sys_WebLogoOnLogin
            let logoUrl = logo ? convertImageBase64ToURL(logo) : null

            let bgImage = resp[1]?.data[0]?.Sys_BackgOnLogin
            let bgURL = bgImage ? convertImageBase64ToURL(bgImage) : null

            let mobBgImage = resp[1]?.data[0]?.Sys_MobBackgOnLogin
            let mobBgURL = mobBgImage ? convertImageBase64ToURL(mobBgImage) : null

            let dischSumVersions = resp[0]?.data[0].versions
            setState(prv => {
                return {
                    ...prv,
                    sys: resp[0]?.data[0]?.sys,
                    showHosName: resp[1]?.data[0]?.Sys_ShowHospitalName === 'Y',
                    // hospitalName: resp[0]?.data[0]?.logo.Sys_HospitalName,
                    showLogo: resp[1]?.data[0]?.Sys_ShowLogoOnLogin === 'Y',
                    logo: logoUrl,
                    showShortLogo: resp[1]?.data[0]?.Sys_ShowShortLogo === 'Y',
                    shortLogo: resp[1]?.data[0]?.Sys_WebShortLogo,
                    showBackground: resp[1]?.data[0]?.Sys_ShowBackgOnLogin === 'Y',
                    bgImage: bgURL,
                    mobBgImage: mobBgURL,
                    dischSumVersions: dischSumVersions
                }
            }, (ns, sns) => {
                updateBackgroundImage(ns, sns)
            });
        } catch (error) {
            console.error(error)
        } finally {
            setisLoading(prv => prv - 1);
        }
    }, [setisLoading, setState]);

    const updateBackgroundImage = (ns, sns) => {
        const newBackgroundImage = window.innerWidth < 768 ? ns.mobBgImage : ns.bgImage;
        if (ns.backgroundImage !== newBackgroundImage) {
            sns(() => ({
                ...ns,
                backgroundImage: newBackgroundImage
            }));
        }
    };

    const handleResize = () => {
        updateBackgroundImage(state, setState);
    };

    useEffect(() => {
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state])

    const handleChange = useCallback((key, value) => {
        setState(prv => {
            return {
                ...prv,
                [key]: value
            }
        })
    }, [setState])

    const toggleModal = useCallback((key) => {
        setState(prv => {
            return {
                ...prv,
                [key]: !prv[key]
            }
        })
    }, [setState])

    const resendCode = useCallback((key) => {
        setState(prv => {
            return {
                ...prv,
                timerCounter: prv.timerCounter + 1
            }
        })
    }, [setState])

    const handleNavigate = useCallback(async (data, isSU) => {
        debugger
        let token = data.access_token;
        let userData = {
            userCode: data.userCode,
            userName: data.userName,
            userType: data.userType,
        }
        localStorage.setItem('expires_in', data.expires_in);
        localStorage.setItem('token', token);
        localStorage.setItem('userData', JSON.stringify(userData));
        if (state.showShortLogo) localStorage.setItem('header', JSON.stringify({ logo: state.shortLogo, hospName: state.hospitalName }))
        if (deferredPrompt.current) {
            console.log('deferredPrompt.current', deferredPrompt.current)
            await deferredPrompt.current.prompt();
        }


        if (isSU) {
            navigate('/SystemSettings', { replace: true });
        } else {
            localStorage.setItem('sysFile', JSON.stringify(state.sys))
            localStorage.setItem('dischSumVersions', JSON.stringify(state.dischSumVersions))
            navigate('/PatientList', { replace: true });
        }
    }, [navigate, state.sys, state.showShortLogo, state.shortLogo, state.hospitalName, deferredPrompt])

    const handleLogin = useCallback(async () => {
        navigate('/authenticate', { replace: true });

        // try {
        //     setState({ ...state, errorLoginTxt: '', pswdChangeSuccess: '', pswdChangeError: '' });
        //     setisLoading(prv => prv + 1)
        //     if (state.recaptchaValue && !state.recaptchaExpired) {
        //         const username = state.username;
        //         const password = state.password;
        //         let isError = false;
        //         if (!username || !password) {
        //             isError = true;
        //             setState({
        //                 ...state,
        //                 errorUserClass: username ? state.errorUserClass : "alert-danger",
        //                 errorUserTxt: username ? state.errorUserTxt : "Please enter your user name",
        //                 errorPswdClass: password ? state.errorPswdClass : "alert-danger",
        //                 errorPswdTxt: password ? state.errorPswdTxt : "Please enter your password",
        //             });
        //         }
        //         else {
        //             setState({
        //                 ...state,
        //                 errorUserClass: "",
        //                 errorUserTxt: "",
        //             });
        //         };

        //         if (!isError) {
        //             let resp = await FetchData(`${authUrlPath}`, 'post', { Usr_code: username, Usr_Pwrd: password });
        //             if (resp.data.length === 0 || resp.data[0] === '') {
        //                 recaptchaRef.current.reset();
        //                 setState({ ...state, errorLoginTxt: 'Invalid user code/password combination', recaptchaValue: null });
        //             }
        //             else {
        //                 let userData = {
        //                     userCode: resp.data[0].userCode,
        //                     userName: resp.data[0].userName,
        //                     userType: resp.data[0].userType,
        //                 }
        //                 localStorage.setItem('userData', JSON.stringify(userData));
        //                 if (state.showShortLogo) localStorage.setItem('header', JSON.stringify({ logo: state.shortLogo, hospName: state.hospitalName }))
        //                 // if (resp.data[0].userCode?.toLowerCase() === 'su') {
        //                 //     handleNavigate(resp.data[0], true)
        //                 // } else if (!resp.data[0].userType) {
        //                 //     recaptchaRef.current.reset();
        //                 //     setState({ ...state, errorLoginTxt: resp.data[0], recaptchaValue: null });
        //                 // } else if (resp.data[0].userType !== 'D') {
        //                 //     recaptchaRef.current.reset();
        //                 //     setState({ ...state, errorLoginTxt: 'This is a Physician Portal. Access Denied', recaptchaValue: null });
        //                 // } else {
        //                 //     if (state.sys?.sys_SendOTP) {
        //                 //         setState({ ...state, loginResp: resp.data[0] });
        //                 //         toggleModal('otpModal')
        //                 //     } else {
        //                 // handleNavigate(resp.data[0])
        //                 // }
        //                 // }

        //                 let _data = {
        //                     module: 'Adm'
        //                 }
        //                 localStorage.setItem('token', resp.data[0].access_token);

        //                 let priv_resp = await FetchData(`${urlPath}/UsersPrivileges/getUserPrivilegesByModule`, 'get', _data);
        //                 priv_resp = priv_resp.data.map(e => {
        //                     return {
        //                         "User": username,
        //                         "Module": "Admission",
        //                         "Step": e.stepCode,
        //                         "Step Name": e.step_Desc,
        //                         "Add": e.priv_Add ? 1 : 0,
        //                         "Modify": e.priv_Modify ? 1 : 0,
        //                         "Delete": e.priv_Delete ? 1 : 0,
        //                         "View": e.priv_View ? 1 : 0,
        //                         "SendMail": e.priv_SendMail ? 1 : 0,
        //                         "uuid": e.step_Guid
        //                     }
        //                 })

        //                 let obj = { userInfo: resp.data[0].userinfo, userPriv: priv_resp }

        //                 let sys_File = await FetchData(`${urlPath}/System/SysFeatures`, 'get',);
        //                 let inv_Sys = await FetchData(`${urlPath}/System/InvSystem`, 'get',);
        //                 let getMultiVersion = await FetchData(`${urlPath}/MultiVersion/GetMultiVersion`, 'get', { Module: 'ADM' });
        //                 let sys_obj = { sys: sys_File.data[0].sys, features: sys_File.data[0].features, invSys: inv_Sys.data[0] }

        //                 localStorage.setItem('sysFileData', JSON.stringify(sys_obj));
        //                 localStorage.setItem('user', JSON.stringify(obj));
        //                 localStorage.setItem('multiVersion', JSON.stringify(getMultiVersion.data));
        //                 navigate('/', { replace: true });
        //             }
        //         }
        //     } else {
        //         setState(prv => {
        //             return { ...prv, errorLoginTxt: "Please Complete Recaptcha." }
        //         });
        //     }
        // }
        // catch (e) {
        //     recaptchaRef.current.reset();
        //     setState({ ...state, errorLoginTxt: 'Login Failed', recaptchaValue: null });
        //     throw e;
        // }
        // finally {
        //     setisLoading(prv => prv - 1)
        // }
    }, [state, setState, setisLoading, toggleModal, handleNavigate])

    const handleOnAccept = useCallback(async () => {
        if (!state.otpCode) {
            setState(prv => {
                return {
                    ...prv,
                    ErrorOTPClass: "alert-danger",
                    ErrorOTPTxt: "Please enter OTP code"
                }
            });
        } else {
            setState(prv => {
                return {
                    ...prv,
                    ErrorOTPClass: "",
                    ErrorOTPTxt: ""
                }
            });
        }
        //if code successful
        handleNavigate(state.loginResp)
    }, [state.loginResp, handleNavigate, state.otpCode, setState])

    const OnTextChange = useCallback((id) => (e) => {
        switch (id) {
            case 'UCode':
                setState(prv => {
                    return { ...prv, username: e.target.value }
                })

                break;
            case 'Pass':
                setState(prv => {
                    return { ...prv, password: e.target.value }
                })
                break;
            default:
                break;
        }
    }, [setState])

    const handleKeyDown = useCallback(
        (event) => {
            if (event.key === 'Enter') {
                BtnRef.current.click();
            }
            else {
                switch (event.target) {
                    case UsrRef.current:
                        setState(prv => {
                            return {
                                ...prv,
                                errorUserClass: "",
                                errorUserTxt: "",
                                errorLoginTxt: ""
                            }
                        });
                        break;
                    case PwdRef.current:
                        setState(
                            prv => {
                                return {
                                    ...prv,
                                    errorPswdClass: "",
                                    errorPswdTxt: "",
                                    errorLoginTxt: ""
                                }
                            }
                        );
                        break;
                    default:
                        break;
                }
            }
        }, [setState])

    const onVerifySuccess = useCallback((value) => {
        setState((prv) => {
            return {
                ...prv,
                recaptchaValue: value,
                recaptchaExpired: value === null ? true : false,
                errorLoginTxt: ""
            }
        });
    }, [setState])

    return (
        (urlUcode === null || urlUcode === undefined) &&
        <div className="app">
            <div id="loginMainContainer" style={state.backgroundImage ? { backgroundImage: `url(${state.backgroundImage})` } : {}}>
                <div id="loginBody">
                    <div className="login-container-fluid">
                        <div className="row">
                            <div className="col-12">
                                {/* loginHeader */}
                                <div className="row">
                                    <div className="col-12" style={{ textAlign: "center" }}>
                                        {(state.showLogo && state.logo) ?
                                            <img
                                                id="loginLogo"
                                                // src={process.env.PUBLIC_URL + "/img/ctservlogo.png"}
                                                src={state.logo}
                                                alt={`Hospital S.A.L Logo`}
                                            />
                                            :
                                            <img
                                                id="loginLogo"
                                                src={process.env.PUBLIC_URL + "/img/ctservlogo.png"}
                                                alt={`Hospital S.A.L Logo`}
                                            />
                                        }
                                    </div>
                                    <div id="loginTitle" className='col-12 mt-2'>
                                        {/* <div>CTServ<span style={{ marginLeft: "10px" }}>E.M.R</span></div> */}
                                        {state.showHosName &&
                                            <div>{state.hospitalName}</div>
                                        }
                                    </div>
                                    <div id="loginNote" className="col-12 mt-2">
                                        <p className={state.errorLoginTxt || state.errorUserTxt || state.errorPswdTxt ?
                                            state.errorLoginTxt === "Oops!!! I don't know who you are." ? "mb-3 bg-warning alert-text-danger-fc" :
                                                "mb-3 alert-text-danger" : "mb-3 text-muted"} >
                                            {state.errorLoginTxt ? state.errorLoginTxt :
                                                state.errorUserTxt || state.errorPswdTxt ? "Please fill mandatory fields" :
                                                    "Sign In to your account"
                                            }
                                        </p>
                                    </div>
                                </div>

                                {/* loginElement */}
                                <div className="input-group mb-2">
                                    <span className={`input-group-addon ${state.errorUserClass}`}><i className="icon-user"></i></span>
                                    <input type="text" ref={UsrRef}
                                        className={`form-control ${state.errorUserClass}`} placeholder="User Name"
                                        value={state.username} onChange={OnTextChange('UCode')}
                                        onKeyDown={handleKeyDown} autoFocus={true} />
                                </div>


                                <div className="input-group mb-3">
                                    <span className={`input-group-addon ${state.errorPswdClass}`}><i className="icon-lock"></i></span>
                                    <input type="password" ref={PwdRef}
                                        className={`form-control ${state.errorPswdClass}`} placeholder="Password"
                                        value={state.password} onChange={OnTextChange('Pass')}
                                        onKeyDown={handleKeyDown} />
                                </div>

                                {/* <ul className="alert-container" style={{ position: "relative", display: "block" }}>
                                <li className="alert-text alert-text-danger" style={{ display: `${state.errorUserClass ? "block" : "none"}` }}> {state.errorUserTxt}</li>
                                <li className="alert-text alert-text-danger" style={{ display: `${state.errorPswdClass ? "block" : "none"}` }} > {state.errorPswdTxt}</li>
                                <li className="alert-text alert-text-danger" style={{ display: `${state.errorLoginTxt ? "block" : "none"}` }}>{state.errorLoginTxt}</li>
                            </ul> */}

                                <div className="row">
                                    <div className="col-12">
                                        <ButtonComponent
                                            className="btn btn-custom btn-block px-2 pointer"
                                            onClick={handleLogin}
                                            description={'Login'}
                                            innerRef={BtnRef}
                                        />
                                    </div>
                                </div>
                                <div className="row mt-1">
                                    <div className="col-12 action-container">
                                        <ModalComp
                                            className="modal-md allowBootstrapHeader"
                                            modal={state.otpModal}
                                            hideFooterButtons={true}
                                            // onClose={() => toggleModal('otpModal')}
                                            modalBody={
                                                <OTPModal
                                                    otpCode={state.otpCode}
                                                    handleChange={handleChange}
                                                    resendCode={resendCode}
                                                    timeLeft={state.timeLeft}
                                                    timerCounter={state.timerCounter}
                                                    onAccept={handleOnAccept}
                                                />
                                            }
                                            modalTitle={
                                                <>
                                                    <div className="row">
                                                        <div className="col-12 col-md-6">
                                                            <span>OTP Validation</span>
                                                        </div>
                                                    </div>
                                                </>
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="row mt-4 mb-1">
                                    <div className="col-12 text-center">
                                        <ReCAPTCHA
                                            ref={recaptchaRef}
                                            sitekey="6LeYAdUZAAAAAIWSkzPxjj-KrvE508XXIXgRp0En"
                                            //size="invisible"
                                            onChange={onVerifySuccess}
                                            style={{ margin: "auto", display: "inline-block" }}
                                        />
                                    </div>
                                </div>

                                {/* <div className="row mt-1">
                                <div className="col-12 action-container" id='btnForgetPass'>
                                    <a className="link-style" onClick={toggleModal}>Forgot Password</a>
                                    <ModalComp
                                        className="modal-lg allowBootstrapHeader"
                                        modal={state.forgotPswdModal}
                                        hideFooterButtons={false}
                                        modalBody={
                                            <ForgotPassword />
                                        }
                                        modalTitle={
                                            <>
                                                <div className="row">
                                                    <div className="col-12 col-md-6">
                                                        <span>Temporary Password Generation</span>
                                                    </div>
                                                </div>
                                            </>
                                        }
                                        onAccept={handleAccept}
                                        onClose={handleClose}
                                    />
                                </div>
                            </div>
                            <div className="row mt-1">
                                <div className="col-12 action-container">
                                    <a className="link-style" onClick={toggleModaal}>Change Password</a>
                                    <ModalComp
                                        className="modal-lg allowBootstrapHeader"
                                        modal={state.resetPassModal}
                                        hideFooterButtons={false}
                                        modalBody={
                                            <ResetPassword />
                                        }
                                        modalTitle={
                                            <>
                                                <div className="row">
                                                    <div className="col-12 col-md-6">
                                                        <span>Password Verification</span>
                                                    </div>
                                                </div>
                                            </>
                                        }
                                        //onAccept={handleAccept}
                                        onClose={handle2Close}
                                    />
                                </div>
                            </div> */}

                            </div>

                        </div>
                    </div>
                </div>
                <div id="loginFooter"
                    // className={`${isSafari && isTablet ? "push-up" : ""}`}
                    className='push-up'
                >
                    <img id="company-logo" src={process.env.PUBLIC_URL + "/img/ctservlogo.png"} alt="EMR CTServ Logo" />
                </div>
            </div>
        </div>

    )

}
