import React, { useCallback, useMemo } from 'react'

export function useSystemFileStateMutater(changeState, changeStateName) {

    const changeOwnOuterState = useMemo(() => changeState(changeStateName), []);

    const handleChange = useCallback((value, name) => {
        changeOwnOuterState(name, value);
    }, [])

    const handleDateTimeChange = useCallback((name, value) => {
        changeOwnOuterState(name, value)
    }, []);

    const handleBlur = useCallback((value, name) => {
        changeOwnOuterState(name, value)
    }, []);

    const callBacks = useMemo(() => {
        return { handleChange, handleDateTimeChange, handleBlur }
    }, []);

    return callBacks
}
