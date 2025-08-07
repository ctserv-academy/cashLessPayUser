import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { get, set, remove } from '../Helpers/utils';
import { AuthContext } from '../ContextProviders/AuthContext';
import { useNavigate } from 'react-router-dom';



export default function usePushNotificationsContainer() {
    const nullEntry = useRef([]);
    const { clientData, setClientData } = useContext(AuthContext);
    const [notifications, setnotifications] = useState(nullEntry.current);
    const [notificationCount, setNotificationCount] = useState(0);
    const navigate = useNavigate();



    // useEffect(() => {

    //     showHelloToast(notifications.length.toString())
    //     // console.log('notifications', notifications)
    // })

    const registerFCMNotifications = useCallback(async () => {


        PushNotifications.checkPermissions().then((res) => {
            if (res.receive !== 'granted') {
                PushNotifications.requestPermissions().then((res) => {
                    if (res.receive === 'denied') {
                        console.log('Push Notification permission denied');
                    }
                    else {
                        console.log('Push Notification permission granted');
                        register();
                    }
                });
            }
            else {
                register();
            }
        });


    }, [clientData]);

    useEffect(() => {
        registerFCMNotifications()
        return () => {
            PushNotifications.removeAllListeners();
        }
    }, [])

    const register = () => {
        console.log('registerrrrrrrrr')

        // Register with Apple / Google to receive push via APNS/FCM
        PushNotifications.register();

        // On success, we should be able to receive notifications
        PushNotifications.addListener('registration',
            (token) => {
                if (clientData && token !== clientData?.GCMID) {
                    console.log('token and GCMID are different, updating backend')
                    console.log('token', token.value)
                    //update backend
                }
                else {
                    console.log('token and GCMID are the same')
                    console.log('token', token.value)
                }
                //console.log('token', token.value, 'clientData', clientData);
                get('clientData').then(value => {
                    set('clientData', { ...value, GCMID: token.value });
                })

            }
        );

        // Some issue with our setup and push will not work
        PushNotifications.addListener('registrationError',
            (error) => {
                alert('Error on registration: ' + JSON.stringify(error));
            }
        );

        // Show us the notification payload if the app is open on our device
        PushNotifications.addListener('pushNotificationReceived',
            (notification) => {
                setNotificationCount(notificationCount => notificationCount + 1)
                console.log('pushNotificationReceived', notification)
                setnotifications(notifications => [...notifications, { id: notification.id, title: notification.title, body: notification.body, type: 'foreground' }])

            }
        );

        // Method called when tapping on a notification
        PushNotifications.addListener('pushNotificationActionPerformed',
            (notification) => {
                console.log(notification)
                setnotifications(notifications => [...notifications, { id: notification.notification.data.id, title: notification.notification.data.title, body: notification.notification.data.body, type: 'action' }])
                navigate('/home', { replace: true })
            }
        );
    }


    return [register, notificationCount];

}


