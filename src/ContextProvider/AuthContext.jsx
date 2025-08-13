import React, { createContext, useCallback, useState } from 'react'


export const AuthContext = createContext();

export function AuthContextWrapper({ children }) {
    const [userData, setUserData] = useState(null);

    const getUserInfo = useCallback(() => {
        return userData.userInfo
    }, [userData])
    const getUserPrivs = useCallback((stepuuid) => {
        let res = userData?.userPriv.filter(e => e.uuid.toLowerCase() === stepuuid.toLowerCase())
        if (res?.length > 0) {
            return res[0];
        }
        else {
            return null;
        }

    }, [userData])


    return (
        <AuthContext.Provider value={{ userData, setUserData, getUserInfo, getUserPrivs }}>
            {children}
        </AuthContext.Provider>

    )
}
