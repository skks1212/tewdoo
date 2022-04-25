import { Link } from "raviger";
import { useState } from "react";
import { User } from "../../types/StorageTypes";
import { logoutUser } from "../../utils/user";


export default function UserPanel(props : {user : User}){

    const [userPanel, setUserPanel] = useState(false);

    const buttonClass = "py-2 px-4 hover:bg-gray-100/40 block w-[100%]";

    return (
        <div id="user-panel" className="relative">
            {
                props.user.loggedIn ? 
                (   
                    <>
                    <button
                        onClick={()=>setUserPanel(!userPanel)} 
                        className="inline-flex justify-between items-center transition hover:bg-gray-100 rounded-xl py-2 px-4"
                    >
                        <div>
                            <i className="far fa-user-circle mr-1"></i> {props.user.username}
                        </div>
                        <div className="ml-2">
                            <i className="far fa-chevron-down"></i>
                        </div>
                    </button>
                    {
                        <div className={"absolute top-[60px] rounded-xl bg-white/40 backdrop-blur left-0 right-0 transition overflow-hidden " + (userPanel ? "visible opacity-100" : "invisible opacity-0")}>
                            <button className={buttonClass} onClick={()=>logoutUser()}>
                                Logout
                            </button>
                        </div>
                    }
                    </>
                ) : (
                    <Link href="login" className="bg-violet-600 transition rounded-xl px-4 py-2 text-white hover:bg-violet-700">
                        Login
                    </Link>
                )
            }
            
        </div>
    )
}