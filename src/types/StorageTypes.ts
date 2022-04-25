export type UserLoggedIn = {
    loggedIn : true,
    username : string,
    name : string,
    url : string
}

export type UserLoggedOut = {
    loggedIn : false
}

export type User = UserLoggedIn | UserLoggedOut;

export type LocalEnv = {
    user : User,
    auth_token? : string
}

export const defaultEnv : LocalEnv = {
    user : {
        loggedIn : false
    }
}