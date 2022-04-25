import { navigate, usePath } from "raviger";
import React from "react";
import Header from "./components/header/Header";
import Login from "./components/Login";
import SideBar from "./components/sidebar/Sidebar";
import { LocalEnv } from "./types/StorageTypes";

export default function AppContainer( props : {children : React.ReactNode, localEnv : LocalEnv}){
        return (
            <>
                <div className="bg-white">
                    <Header localEnv={props.localEnv} />
                    <SideBar/>
                    <div className="ml-[220px] mt-[62px]">
                        {props.children}
                    </div>
                    
                </div>
            </>
        )
    
    
}