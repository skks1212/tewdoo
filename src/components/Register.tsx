import { Link, navigate } from "raviger";
import React, { useState } from "react";
import { commonStyles } from "../styling/common";
import { API } from "../utils/api";
import { getEnv, saveEnv } from "../utils/env";

const defaulltcredentials = {
    username : "",
    email : "",
    password1 : "",
    password2 : ""
}

export default function Register () {
    
    const [credentialState, setCreds] = useState(defaulltcredentials);
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const data = await API.user.register(credentialState);
                if(data){
                    window.location.href = '/';
                }
        } catch (error) {
            console.log(error);
            setErrorMessage("Username / Email taken or password too small");
        }
    };

    return (
        <div className="flex items-center justify-center h-screen">
            <div className="">
            <h1 className="text-3xl font-bold" tabIndex={0}>
                Sign Up
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
                    type="text"
                    className={commonStyles.inputStyling}
                    onChange={e=>{
                        setCreds({
                            ...credentialState,
                            email : e.target.value
                        })
                    }}
                    name = "email"
                    placeholder = "Email ID"
                    value={credentialState.email}
                />
                <br/>
                <input
                    type="password"
                    className={commonStyles.inputStyling}
                    onChange={e=>{
                        setCreds({
                            ...credentialState,
                            password1 : e.target.value
                        })
                    }}
                    placeholder = "Password"
                    name = "password1"
                    value={credentialState.password1}
                />
                <br/>
                <input
                    type="password"
                    className={commonStyles.inputStyling}
                    onChange={e=>{
                        setCreds({
                            ...credentialState,
                            password2 : e.target.value
                        })
                    }}
                    placeholder = "Confirm Password"
                    name = "password2"
                    value={credentialState.password2}
                />
                <br/>
                <button className="bg-violet-700 rounded-xl px-6 py-2 font-bold hover:bg-violet-800 transition text-white hover:rounded-xl">
                    <i className="far fa-arrow-right-to-arc"></i> Register
                </button>
                <br/>
                <br/>
                <Link href="login" className="text-violet-700 hover:underline">
                    Already have and account?
                </Link>
            </form>
            </div>
        </div>
    )
}