import { useState, useEffect } from 'react';

export const useNetwork = () => {
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [networkType, setNetworkType] = useState(
        // Use connection API if available, otherwise null
        navigator.connection?.effectiveType || null
    );

    useEffect(() => {
        // Handler for online status
        const handleOnline = () => {
            console.log('Online');
            setIsOnline(true);
        };

        // Handler for offline status
        const handleOffline = () => {
            console.log('Offline');
            setIsOnline(false);
        };

        // Handler for connection change
        const handleConnectionChange = () => {
            if (navigator.connection) {
                setNetworkType(navigator.connection.effectiveType);
            }
        };

        // Add event listeners
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        // Add connection change listener if supported
        if (navigator.connection) {
            navigator.connection.addEventListener('change', handleConnectionChange);
        }

        // Cleanup
        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
            if (navigator.connection) {
                navigator.connection.removeEventListener('change', handleConnectionChange);
            }
        };
    }, []);

    return {
        isOnline,
        networkType,
        // Helper properties for different connection types
        is4G: networkType === '4g',
        is3G: networkType === '3g',
        is2G: networkType === '2g',
        isSlow: networkType === 'slow-2g'
    };
}; 