import axios from 'axios';
import { cloneDeep, isEmpty } from 'lodash';
import storage from './storage';

export function formatNumber(nbr, n, x) {
    var re = '(\\d)(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\.' : '$') + ')';
    return nbr.toFixed(Math.max(0, ~~n)).replace(new RegExp(re, 'g'), '$1,');
};

export async function set(key, value) {
    await storage.set(key, value);
}

export async function get(key) {
    return await storage.get(key);
}

export async function remove(key) {
    await storage.remove(key);
}

export function awaitableTimeOut(timeout) {
    return new Promise((rs, rj) => {
        setTimeout(() => {
            rs(1)
        }, timeout);

    })
}
export function handleEmpty() {
    throw new Error('Invalid Type, must be get or post ')
}
export async function FetchData(url, Type = handleEmpty(), params = null, datafilterfunction = () => true, controller) {
    try {
        if (Type === 'get') {
            let queryparams = new URLSearchParams({ ...params });
            let resp = await axios({ method: 'get', url: url + `${!isEmpty(params) ? `?${queryparams.toString()}` : ''}`, crossDomain: true, signal: controller ? controller.signal : null });
            await awaitableTimeOut(500);
            return resp.data;
        }
        else {
            let resp = await axios({
                method: 'post',
                signal: controller ? controller.signal : null,
                url: url,
                data: isEmpty(params) ? JSON.stringify({}) : JSON.stringify(params),
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                }
            });

            await awaitableTimeOut(500);

            return resp.data;
            // await awaitableTimeOut(500);

            // let uri = new URL(url);
            // let MethodName = uri.href.substring(uri.href.lastIndexOf("/")).replace("/", '')
            // let r = resp.data[`${MethodName}Result`];
            // if (isEmpty(r)) {
            //     return []
            // }
            // else {
            //     return JSON.parse(r)
            // }


        }
    }
    catch (e) {
        throw e;
    }


}

/**
 * Formats a timestamp to yyyy-MM-dd HH:mm format
 * @param {number} timestamp - Unix timestamp in milliseconds
 * @returns {string} Formatted date-time string (e.g., "2024-03-15 14:30")
 */
export const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}`;
}; 
