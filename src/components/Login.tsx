import { Link, navigate } from "raviger";
import React, { useState } from "react";
import { commonStyles } from "../styling/common";
import { API } from "../utils/api";
import { getEnv, saveEnv } from "../utils/env";

const defaulltcredentials = {
    username : "",
    password : ""
}

export default function Login () {
    
    if(getEnv().user.loggedIn){
        navigate('/');
    }

    const [credentialState, setCreds] = useState(defaulltcredentials);
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const username = credentialState.username;
        const password = credentialState.password;
        try {
            const data = await API.user.login(username, password);
            const env = getEnv();
            saveEnv({
                ...env,
                user : {
                    ...env.user,
                    loggedIn : true,
                    username : "fetching",
                    url : "fetching",
                    name : "fetching"
                },
                auth_token : data.token
            });
            //navigate('/');
            window.location.href = '/';
        } catch (error) {
            console.log(error);
            setErrorMessage("Invalid Email / Password");
        }
    };

    return (
        <div className="flex items-center justify-center h-screen">
            <div className="">
            <h1 className="text-3xl font-bold" tabIndex={0}>
                Sign In
            </h1>
            <br/>

            <form onSubmit={(e)=>handleSubmit(e)}>
                {errorMessage && <div tabIndex={0} className="bg-red-100 border-2 border-red-200 rounded-xl p-2 mb-4 text-sm">{errorMessage}</div>}
                <input
                    type="text"
                    className={commonStyles.inputStyling}
                    onChange={e=>{
                        setCreds({
                            ...credentialState,
                            username : e.target.value
                        })
                    }}
                    name = "username"
                    placeholder = "Username"
                    value={credentialState.username}
                    />
                <br/>
                <input
                    type="password"
                    className={commonStyles.inputStyling}
                    onChange={e=>{
                        setCreds({
                            ...credentialState,
                            password : e.target.value
                        })
                    }}
                    placeholder = "Password"
                    name = "password"
                    value={credentialState.password}
                    />
                <br/>
                <button className="bg-violet-700 rounded-xl px-6 py-2 font-bold hover:bg-violet-800 transition text-white hover:rounded-xl">
                    <i className="far fa-arrow-right-to-arc"></i> Login
                </button>
                <br/>
                <br/>
                <Link href="register" className="text-violet-700 hover:underline">
                    Don't have an account?
                </Link>
            </form>
            </div>
        </div>
    )
}