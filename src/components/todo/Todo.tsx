import { LocalEnv } from "../../types/StorageTypes";

export default function Todo(props : {localEnv : LocalEnv}){
    return (
        <>
            <br/>
            <div className="py-6 px-20">
                <h1 className="font-bold text-3xl">
                    Todo
                </h1>
            </div>
        </>
    )
}