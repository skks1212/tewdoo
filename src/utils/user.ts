import { defaultEnv, LocalEnv } from "../types/StorageTypes";
import { API } from "./api";
import { getEnv, saveEnv } from "./env";

export const checkUser = async (setState : (userData : LocalEnv)=> void) => {
    //Check for login
    const localEnv = getEnv();
    const loggedIn = localEnv.user.loggedIn;

    if(loggedIn && localEnv.auth_token){
        const fetchMe = await API.user.me();
        saveEnv({
            ...localEnv,
            user : {
                ...localEnv.user,
                loggedIn : true,
                ...fetchMe
            }
        });
        
    }else{
        console.log('User not logged in');
        //saveEnv(defaultEnv);
    }
    setState(getEnv());
}

export const logoutUser = () => {
    const conf = window.confirm('Are you sure you would like to logout?');
    if(conf) {
        localStorage.removeItem('localEnv');
        window.location.href = '/login';
    }
}