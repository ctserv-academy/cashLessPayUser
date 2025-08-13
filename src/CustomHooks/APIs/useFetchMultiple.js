import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import { handleEmpty, PromisfiedAxiosRequest } from "../../utils/functions";


export function useFetchDataMultiple(params) {

    params.forEach(element => {
        if (element.Type.toLowerCase() !== 'get' && element.Type.toLowerCase() !== 'post') {
            handleEmpty();
        }
    });


    const [data, setData] = useState([]);
    const [error, setError] = useState('');
    const controller = useRef(null);

    useEffect(() => {
        controller.current = new AbortController();
        return () => {
            controller.current.abort()
        }
    }, [])

    const GetAll = useCallback(async () => {
        try {
            let resp = await Promise.all(params.map(p => {
                return PromisfiedAxiosRequest(p.url, p.Type, p.params)
            }))
            setData(resp);

        }
        catch (e) {
            setError(e)
        }
    }, []);

    useEffect(() => {
        GetAll();
    }, [params])

    return [data, error, GetAll];
}