import { isRequired } from "./isRequired";

export const setSessionInfo = (key = isRequired("key"), value = isRequired("value")) => {
    sessionStorage.setItem(key, value);
}

export const getSessionInfo = (key = isRequired("key")) => {
    return sessionStorage.getItem(key);
}

export const clearSessionInfo = () => {
    sessionStorage.clear();
}