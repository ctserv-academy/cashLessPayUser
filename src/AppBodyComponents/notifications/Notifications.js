import React, { useState, useContext, useMemo, useCallback, useEffect, useRef } from 'react'
import './Notifications.css'
import { NotificationContext } from '../../ContextProviders/NotificationContext';
import { FetchData, formatNumber, formatTimestamp, set } from '../../Helpers/utils';
import { AuthContext } from '../../ContextProviders/AuthContext';
import { LoadingContext } from '../../ContextProviders/LoadingContext';
import { ToastNotificationContext } from '../../ContextProviders/ToastNotificationContext';
import { urlPath } from '../../globals';

const Notifications = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { notifications, setNotifications, setNotificationCount, setClearNotifications } = useContext(NotificationContext);
    const { clientData, setClientData } = useContext(AuthContext);
    const { setLoadingCounter } = useContext(LoadingContext);
    const { showToastNotification } = useContext(ToastNotificationContext);
    // Sort notifications by timestamp in descending order
    const sortedNotifications = useMemo(() => {
        return [...notifications].sort((a, b) => {
            const timestampA = a?.data?.timestamp || 0;
            const timestampB = b?.data?.timestamp || 0;
            return timestampB - timestampA;
        });
    }, [notifications]);
    const controller = useRef(null);
    useEffect(() => {
        controller.current = new AbortController();
        return () => {
            controller.current.abort()
        }
    }, []);
    useEffect(() => {
        refreshClientData()
    }, [])
    const toggleModal = () => {
        setIsModalOpen(prev => !prev);
    };

    const refreshClientData = useCallback(async () => {
        try {

            if (!clientData) {
                return
            }
            setLoadingCounter(prv => prv + 1);

            const body = {
                _countryCode: clientData.countryCode,
                _phone: clientData.phone,
                _register: false

            };
            let data = await FetchData(`${urlPath}GetClientData`, 'post', body, null, controller.current.signal);

            const { locationID, RecID: clientID, clientName, cardPrefix,
                cardNumber, balance, pointsConversion, pointsValue,
                verificationCode } = JSON.parse(data.GetClientDataResult)[0]
            await set('clientData', {
                ...clientData,
                locationID, clientID, clientName, cardPrefix,
                cardNumber, balance, pointsConversion, pointsValue,
                verificationCode, countryCode: clientData.countryCode
            });
            setClientData({
                ...clientData,
                locationID, clientID, clientName, cardPrefix,
                cardNumber, balance, pointsConversion, pointsValue,
                verificationCode, countryCode: clientData.countryCode
            })

        }
        catch (err) {
            showToastNotification("An Error Has Occured", false)
            console.log(err)
        }
        finally {
            setLoadingCounter(prv => prv - 1);
        }
    }, [clientData])

    const handleClear = () => {
        setNotifications([]);
        setNotificationCount(0);
        if (setClearNotifications.current) {
            setClearNotifications.current();
        }
        setIsModalOpen(false);
    };

    return (
        <>
            <div id="notificationsMainContainer">
                <div className='rewardPointsDivision'>
                    <h3>{clientData?.balance ? formatNumber(parseFloat(clientData?.balance), 0, 3) : '0'}</h3>
                    <div>points</div>
                </div>
                <h3 className='pageTitle'>Notifications</h3>
                <div className=''>
                    <div id='clearButton' onClick={toggleModal}>clear</div>
                </div>
            </div>
            <div style={{ clear: "both" }} />
            <div>
                {sortedNotifications && sortedNotifications.map((eachElem, rewardPointskey) => (
                    <div key={rewardPointskey} className='col-12 notificationDetailsCard'>
                        <div className='notificationRow row ml-2'>
                            <h6 className='col-12 notificationTitle'>{eachElem?.title || 'Notification'}</h6>
                            <div className='col-12 notificationDate'>
                                {eachElem?.data?.timestamp ? formatTimestamp(eachElem.data.timestamp) : 'No date'}
                            </div>
                            <div className='col-12 notificationDescription'>{eachElem?.body || 'No content'}</div>
                        </div>
                    </div>
                ))}
            </div>

            <div
                id="clearModalMainContainer"
                style={{ display: isModalOpen ? "block" : "none" }}
            />
            <div
                id="clearModal"
                style={{ display: isModalOpen ? "block" : "none" }}
            >
                <div className="modal-header">
                    <h5>Clear Notifications</h5>
                </div>
                <div className="modal-body">
                    <div>
                        Are you sure?
                    </div>
                </div>
                <div className="modal-footer">
                    <div
                        id='clearButton'
                        style={{ backgroundColor: "#515151" }}
                        onClick={handleClear}
                    >
                        clear
                    </div>
                    <div
                        id='clearButton'
                        style={{ backgroundColor: "#a1a1a1", marginLeft: "10px" }}
                        onClick={toggleModal}
                    >
                        close
                    </div>
                </div>
            </div>
        </>
    );
};

export default Notifications;