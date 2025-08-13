import { isEqual } from 'lodash';
import { useCallback, useEffect, useRef, useState } from 'react'

export function useStateWithCallback(initialState) {

    const [state, setstte] = useState(initialState);
    const cb = useRef(null);
    // const [cb, setCb] = useState(null)

    const setState = useCallback((obj, callback) => {
        if (callback) {
            cb.current = callback

        }
        else {
            cb.current = null;
        }
        if (typeof obj === 'function') {
            setstte(obj)
        }
        else {
            setstte({ ...state, ...obj });
        }


    }, [state])


    useEffect(() => {
        if (state && !isEqual(state, initialState) && cb.current) {
            cb.current(state, setState)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state, cb])

    return [state, setState]

}
