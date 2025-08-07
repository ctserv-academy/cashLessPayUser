import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { FetchData, get, set } from "../Helpers/utils";
import { InstallPromptContext } from "../ContextProviders/InstallPromptContext";
import { urlPath } from "../globals";
import { AuthContext } from "../ContextProviders/AuthContext";

export function usePWA() {
    // const [deferredPrompt, setDeferredPrompt] = useState(null)
    const { setDeferredPrompt, setIsInstalled, setAskForNotification, toggleAskForNotificationRef } = useContext(InstallPromptContext);
    const { clientData, setClientData } = useContext(AuthContext);



    const pushNotificationSupported = useRef(
        ('PushManager' in window)
    )
    const serviceWorkerSupported = useRef(
        ('ServiceWorker' in window)
    )
    const promptForNotification = useRef(
        // neverAskForNot.current === false && pushNotificationSupported.current
    )

    const controller = useRef(null);

    useEffect(() => {
        controller.current = new AbortController();
        return () => {
            controller.current.abort()
        }
    }, []);

    useEffect(() => {
        const readSettings = async () => {
            const isInstalled = await get('isInstalled')
            setIsInstalled(isInstalled ?? "N")
            const askForNotification = await get('askForNotification')
            setAskForNotification(askForNotification ?? "Y")
        }
        readSettings()
    }, [])


    useEffect(() => {
        const handleBeforeInstallPrompt = (event) => {
            console.log('beforeinstallprompt');
            event.preventDefault();
            setDeferredPrompt(event);
            return false;
        };
        const handleInstall = async () => {
            console.log('appinstalled')
            await set('isInstalled', true)
            setIsInstalled(true)
        }

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.addEventListener('appinstalled', handleInstall)

        console.log('promptForNotification.current', promptForNotification.current)
        // console.log('neverAskForNot.current', neverAskForNot.current)
        console.log('pushNotificationSupported.current', pushNotificationSupported.current)

        // if (promptForNotification.current) {

        //     console.log('promptForNotification.current', promptForNotification.current)
        //     //Does not fire pop up if already granted or rejected(In fact it will first read from site permissions)
        //     Notification.requestPermission(result => {
        //         console.log('result', result)
        //         if (result === 'granted') {
        //             checkForExistingPushSubscription()

        //         }
        //     })
        //     noNotifications()
        // }

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
            window.removeEventListener('appinstalled', handleInstall);
        }
    }, [])

    const noNotifications = useCallback(async () => {
        await set('promptForNotification', 'N')
        // localStorage.setItem('promptForNotification', 'N')
    }, [])
    const toggleAskForNotification = useCallback(async () => {

        if (!clientData) {
            const data = await get('clientData')
            console.log('toggleAskForNotification clientData', data)
            if (data) {
                setClientData(data)
            }
            else {
                console.log('clientData is not found exiting')
                return;
            }

        }


        if (pushNotificationSupported.current) {
            //Does not fire pop up if already granted or rejected(In fact it will first read from site permissions)
            if (Notification.permission === 'granted') {
                console.log('Push notifications are already granted')
                checkForExistingPushSubscription()
                return
            }
            else {
                alert('Push notifications are not granted please enable them')

            }


            Notification.requestPermission(result => {
                console.log('result', result)
                if (result === 'granted') {
                    set('askForNotification', "N")
                    setAskForNotification("N")
                    checkForExistingPushSubscription()

                }
                else {
                    set('askForNotification', "N")
                    setAskForNotification("N")
                }
            })


        } else {
            alert('Push notifications are not supported on this browser')
            set('askForNotification', "N")
            setAskForNotification("N")
        }
    }, [])
    toggleAskForNotificationRef.current = toggleAskForNotification

    const checkForExistingPushSubscription = useCallback(() => {
        let reg
        console.log('Starting checkForExistingPushSubscription')
        if (!navigator.serviceWorker) {
            console.log('Service Worker not supported')
            return;
        }

        console.log('Checking service worker registration...')
        navigator.serviceWorker.getRegistrations().then(registrations => {
            console.log('Current service worker registrations:', registrations);

            if (registrations.length === 0) {
                console.log('No service worker found, registering new one...');
                return navigator.serviceWorker.register('/service-worker.js', {
                    scope: '/'
                })
                    .then(registration => {
                        console.log('Service Worker registered:', registration);
                        return navigator.serviceWorker.ready;
                    });
            }
            // Use the existing registration
            reg = registrations[0];
            console.log('Using existing service worker:', reg);
            return Promise.resolve(reg);
        })
            .then(swreg => {
                console.log('Service Worker ready:', swreg)
                reg = swreg;
                console.log('Checking push subscription...')
                return swreg.pushManager.getSubscription()
            })
            .then(async sub => {
                console.log('Got subscription:', sub)
                if (!sub) {
                    console.log('No registration exists, making a new one')
                    createPushSubscription(reg)
                }
                else {
                    let _GCMID = await get('GCMID')
                    if (_GCMID != JSON.stringify(sub)) {
                        console.log('GCMID changed or not found, making a new one')
                        createPushSubscription(reg)
                    }
                    else {
                        console.log('Registration already exists')
                    }
                }
            })
            .catch(err => {
                console.error('Error in subscription process:', err)
            })
    }, [])
    const urlBase64ToUint8Array = (base64String) => {
        var padding = '='.repeat((4 - base64String.length % 4) % 4);
        var base64 = (base64String + padding)
            .replace(/\-/g, '+')
            .replace(/_/g, '/');

        var rawData = window.atob(base64);
        var outputArray = new Uint8Array(rawData.length);

        for (var i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }

    const createPushSubscription = useCallback((swreg) => {

        // yarn web-push generate-vapid-keys
        // =======================================

        // Public Key:
        // BGmlnCAf9ZoSCPgHvXGjTDv89QlNSna7lXoeXYNBjx2JF4_sSydzAMpIz17NFvlDHeU86WDDeQCwbaiRmFvJzvg

        // Private Key:
        // xxxxxxx --put the private key on backend level

        // =======================================

        let vapidPublicK = 'BGmlnCAf9ZoSCPgHvXGjTDv89QlNSna7lXoeXYNBjx2JF4_sSydzAMpIz17NFvlDHeU86WDDeQCwbaiRmFvJzvg'
        vapidPublicK = urlBase64ToUint8Array(vapidPublicK);

        swreg.pushManager.subscribe({
            applicationServerKey: vapidPublicK,
            userVisibleOnly: true
        }).then(async (subScrObject) => {
            console.log('subscription', JSON.stringify(subScrObject))

            const data = await get('clientData')

            const body = {
                _LocID: data.locationID,
                _clientID: data.clientID,
                _subscriptionObj: JSON.stringify(subScrObject)

            };
            await FetchData(`${urlPath}RegisterForPushNotifications`, 'post', body, null, controller.current.signal);
            await set('GCMID', JSON.stringify(subScrObject))
            await set('clientData', {
                ...data
            });
        });
    }, [])
    return []
}
