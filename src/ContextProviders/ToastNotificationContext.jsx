import React, { createContext, useCallback, useEffect, useRef, useState } from 'react'
import { Toaster, toast } from 'react-hot-toast';


export const ToastNotificationContext = createContext();

export function ToastContextWrapper({ children }) {
    const defaultToast = useRef({
        position: "bottom-center",
        reverseOrder: false,
        success: true
    })
    const [toastMessage, setToastMessage] = useState(defaultToast.current);
    const showToastNotification = useCallback((message, isSuccess = true) => {
        setToastMessage(prv => {
            return {
                ...prv, success: isSuccess, message
            }
        })

    }, [])

    useEffect(() => {
        let { position, reverseOrder } = defaultToast.current;
        position = toastMessage.position ? toastMessage.position : position;
        reverseOrder = toastMessage.reverseOrder ? toastMessage.reverseOrder : reverseOrder;
        defaultToast.current = { position, reverseOrder };

        if (toastMessage.message) {
            if (toastMessage.success) {
                toast.success(toastMessage.message);
            }
            else {
                toast.error(toastMessage.message);
            }
            setToastMessage(defaultToast.current)
        }







    }, [toastMessage])



    return (
        <ToastNotificationContext.Provider value={{ showToastNotification }} >
            <Toaster position={defaultToast.current.position} reverseOrder={defaultToast.current.reverseOrder} />
            {children}
        </ToastNotificationContext.Provider>
    )
}
