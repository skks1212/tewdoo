import { ActiveLink, Link } from "raviger";
import React from "react";
import logo from "../logo.svg";
import { LocalEnv } from "../../types/StorageTypes";
import { logoutUser } from "../../utils/user";
import UserPanel from "./UserPanel";
import tewdoo from "../../med/tewdoo.png";

export default function Header(props: {localEnv: LocalEnv}) {
    const User = props.localEnv.user;
    return (
        <header className="flex justify-between items-center border-b-2 border-b-gray-100 backdrop-blur bg-white/40 z-20 fixed inset-x-0 top-0 px-4">
            <div className="flex items-center justify-center p-4">
                <div className="text-xl mr-2 text-violet-600">
                    <i className="fa-duotone fa-calendar"></i>
                </div>
                <div className="text-xl font-bold">
                    TewDoo
                </div>
            </div>
            <div>
                <UserPanel user={User}/>
            </div>
        </header>
    );
};