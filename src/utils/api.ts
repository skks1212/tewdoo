import { Board, StatusType, TaskType } from "../types/BoardTypes";
import { getEnv } from "./env";

const API_BASE_URL = "https://tewdooapp.herokuapp.com/api/";

type endpoint = `${string}/`;

type methods = "POST" | "GET" | "PATCH" | "DELETE" | "PUT";

export const request = async (endpoint : endpoint, method : methods = "GET", data : any = {}) => {

    let url = API_BASE_URL + endpoint;
    let payload : null | string = JSON.stringify(data);

    if(method === "GET"){
        const requestParams = data ? `?${Object.keys(data).map(key=>`${key}=${data[key]}`).join('&')}` : "";
        url = API_BASE_URL + endpoint + requestParams;
        payload = null;
    }

    const localToken = getEnv().auth_token;

    //Bearer Authentication
    const auth = !localToken ? "" : "Token " + localToken;

    const response = await fetch(url, {
        method : method,
        headers : {
            "Content-Type" : "application/json",
            Authorization : auth
        },
        body : payload
    });

    if(response.ok){
        try {
            const json = await response.json();
            return json;
        }catch (error) {
            const json = {error};
            return json;
        }
    } else {
        const errorJSON = await response.json();
        throw Error(errorJSON);
    }
    
}

export const API = {
    user : {
        login : (username : string, password : string) => request("auth-token/",'POST', {username, password}),
        me : () => request("users/me/"),
        register : (details : {username : string, email : string, password1 : string, password2 : string}) => request("auth/registration/", "POST", details)
    },
    boards : {
        get : () => request("boards/"),
        create : (create : {title : string, description : string}) => request("boards/","POST", create),
        delete : (id : number) => request(`boards/${id}/`, "DELETE"),
        getBoard : (id : number) => request(`boards/${id}/`),
        save : (data : Board) => request(`boards/${data.id}/`, "PATCH", {title : data.title, description : data.description, meta : data.meta})
    },
    status : {
        create : (create : {title : string, description : string, is_complete_status : boolean}, board : number) => request(`boards/${board}/status/`,"POST", create),
        list : (boardID : number) => request(`boards/${boardID}/status/`),
        save : (boardID : number, statusID : number, save : {title : string, description : string, is_complete_status : boolean}) => request(`boards/${boardID}/status/${statusID}/`,"PATCH", save),
        delete : (stat : StatusType) => request(`boards/${stat.board}/status/${stat.id}/`,"DELETE")
    },
    task : {
        create : (status : StatusType, params : {title : string, description : string, status : number}) => request(`boards/${status.board}/tasks/`, "POST", params),
        load : (boardID : number) => request(`boards/${boardID}/tasks/`),
        save : (boardID : number, taskID : number, payload : {title : string, description : string, status : number}) => request(`boards/${boardID}/tasks/${taskID}/`, "PATCH", payload),
        delete : (boardID : number, taskID : number) => request(`boards/${boardID}/tasks/${taskID}/`, "DELETE")
    }
}