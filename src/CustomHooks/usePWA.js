import { useCallback, useEffect, useRef, useState } from "react";

export function usePWA() {
    const deferredPrompt = useRef(null)
    const [showInstall, setShowInstall] = useState(false)

    const neverAskForNot = useRef(localStorage.getItem('promptForNotification') ? true : false);
    const pushNotificationSupported = useRef(
        ('PushManager' in window)
    )
    const serviceWorkerSupported = useRef(
        ('ServiceWorker' in window)
    )
    const promptForNotification = useRef(
        neverAskForNot.current === false && pushNotificationSupported.current
    )

    const noNotifications = useCallback(() => {
        localStorage.setItem('promptForNotification', 'N')
    }, [])

    const checkForExistingPushSubscription = useCallback(() => {
        let reg
        navigator.serviceWorker.ready.then(swreg => {
            reg = swreg;
            return swreg.pushManager.getSubscription()
        }).then(sub => {
            // reg.pushManager.unregister()
            if (!sub) {
                console.log('No registration exists, making a new one')
                createPushSubscription(reg)
            }
            else {
                console.log('Registration already exists')
            }
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
        // BDfW2L-5GUzsRAKJFyddHSzAwjWCYjtITJQ5V7AhUBOF68r5Z3Xe9zPdWQDY9bS8RMO7RpOEVfGgJwsWKpQ2aTg

        // Private Key:
        // 36Pl6y7VT0IL990DnxuPPoIfcijqICEiGAaYu02j-Y4

        // =======================================

        let vapidPublicK = 'BDfW2L-5GUzsRAKJFyddHSzAwjWCYjtITJQ5V7AhUBOF68r5Z3Xe9zPdWQDY9bS8RMO7RpOEVfGgJwsWKpQ2aTg'
        vapidPublicK = urlBase64ToUint8Array(vapidPublicK);

        swreg.pushManager.subscribe({
            applicationServerKey: vapidPublicK,
            userVisibleOnly: true
        }).then(subScrObject => {
            console.log('subscription', JSON.stringify(subScrObject))


            fetch(`http://localhost:3005/api/subscribe`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }, body: JSON.stringify({ subscription: JSON.stringify(subScrObject), userCode: '' })
            }).then(res => res.json()).then(res => {
                console.log('Subscription updated')
            })
                .catch(function (err) {
                    console.log('Error while sending data', err);
                });

            // const body = {
            //     "url": "https://test-vm.southafricanorth.cloudapp.azure.com/SupportWS/Service1.svc/web/registerWebPushSubscription",
            //     "payload": { subscription: JSON.stringify(subScrObject), userCode: loginUserCode.value }
            // }
            // fetch(`${ENV.PHPregisterPushNotificationEndPoint}`, {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //         'Accept': 'application/json'
            //     }, body: JSON.stringify(body)
            // }).then(res => res.json()).then(res => {
            //     const resp = JSON.parse(registerWebPushSubscriptionResult)
            // })
            //     .catch(function (err) {
            //         console.log('Error while sending data', err);
            //     });






        });
    }, [])

    useEffect(() => {
        const handleBeforeInstallPrompt = (event) => {
            console.log('beforeinstallprompt');
            event.preventDefault();
            deferredPrompt.current = event;
            setShowInstall(true);
            return false;
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        console.log('promptForNotification.current', promptForNotification.current)
        console.log('neverAskForNot.current', neverAskForNot.current)
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
        }
    }, [])

    return [deferredPrompt, showInstall, setShowInstall]
}
