import { useCallback, useEffect, useState } from "react";

function getItem<T>(key: string): T {
    return document.cookie.split("; ").reduce((total, currentCookie) => {
        const item = currentCookie.split("=");
        const storedKey = item[0];
        const storedValue = item[1];
        return key === storedKey ? decodeURIComponent(storedValue) : total;
    }, "") as unknown as T;
}

function setItem<T>(key: string, value: T, numberOfDays?: number) {
    const now = new Date();
    // set the time to be now + numberOfDays
    now.setTime(now.getTime() + (numberOfDays || 100) * 60 * 60 * 24 * 1000);
    document.cookie = `${key}=${value}; expires=${now.toUTCString()}; path=/`;
}

export function useCookie<T extends string>(
    key: string,
    defaultValue: T
): [T, (value: T, numberOfDays?: number) => void] {
    const getCookie = () => getItem<T>(key) || defaultValue;
    const [cookie, setCookie] = useState(getCookie());

    const updateCookie = useCallback(
        (value: T, numberOfDays?: number) => {
            setCookie(value);
            setItem<T>(key, value, numberOfDays);
        },
        [key]
    );

    // when first load, refresh the cookie
    useEffect(() => {
        updateCookie(cookie);
    }, [updateCookie, cookie]);

    return [cookie, updateCookie];
}
