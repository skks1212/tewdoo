import React from "react"
import { navigate, useRoutes } from "raviger";
import AppContainer from "../AppContainer";
import { LocalEnv } from "../types/StorageTypes";
import LoadingFallback from "./LoadingFallback";
import { getEnv } from "../utils/env";
import { Boards } from "../components/boards/Boards";
import BoardElement from "../components/boards/Board";

const Home = React.lazy(()=>import("../components/Home"));
const About = React.lazy(()=>import("../components/About"));
const Login = React.lazy(()=>import("../components/Login"));
const Register = React.lazy(()=>import("../components/Register"));
const Todo = React.lazy(()=>import("../components/todo/Todo"));

const unlockedRoutes = ["login","register"];


const fallback = <LoadingFallback/>
export default function AppRouter(props : {localEnv : LocalEnv}) {
    const homeRoute = (
        <React.Suspense fallback={fallback}>
            <Home localEnv={props.localEnv}/>
        </React.Suspense>
    );
    const routes = {
        '/' : () => homeRoute,
        '/home' : () => homeRoute,
        '/about' : () => <React.Suspense fallback={fallback}><About /></React.Suspense>,
        '/boards' : () => <React.Suspense fallback={fallback}><Boards localEnv={props.localEnv}/></React.Suspense>,
        '/todo' : () => <React.Suspense fallback={fallback}><Todo localEnv={props.localEnv}/></React.Suspense>,
    
        '/login' : () => <React.Suspense fallback={fallback}><Login /></React.Suspense>,
        '/register' : () => <React.Suspense fallback={fallback}><Register /></React.Suspense>,
    
        "/board/:id" : ({id} : {id : string}) => <React.Suspense fallback={fallback}><BoardElement boardID={Number(id)} localEnv={props.localEnv} /></React.Suspense>,
    }    
    const routeResult = useRoutes(routes);
    const thisRoute = window.location.href.split('/').at(-1);
    if(getEnv().user.loggedIn){
        return <AppContainer localEnv = {props.localEnv}>{routeResult}</AppContainer>;
    }else{
        if(thisRoute? unlockedRoutes.includes(thisRoute) : false){
            return routeResult;
        }else{
            navigate('/login');
            return <Login/>
        }
    }
}