import { defaultEnv, LocalEnv } from "../types/StorageTypes";

export const getEnv : () => LocalEnv = () => {
    const stored = localStorage.getItem('localEnv');
    const localEnv = stored ? JSON.parse(stored) : defaultEnv;
    return localEnv;
}

export const saveEnv = (localEnv : LocalEnv) => {
    localStorage.setItem('localEnv',JSON.stringify(localEnv));
    return getEnv();
}