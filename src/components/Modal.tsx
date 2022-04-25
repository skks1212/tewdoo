export default function Modal(props : 
    {
        children : React.ReactNode, 
        title : string,
        closeCB : React.Dispatch<React.SetStateAction<boolean>>,
        actionCB: ()=> void,
        actionName : string
    }){
    return (
        <div className="inset-0 bg-black/20 fixed backdrop-blur flex items-center justify-center z-20">
            <div className="w-[500px] bg-white rounded-xl flex-col justify-between">
                <div>
                    <div className="font-bold text-2xl p-4 border-b-2 border-gray-100" tabIndex={0}>
                        {props.title}
                    </div>
                    <div className="p-4 " tabIndex={0}>
                        {props.children}
                    </div>
                </div>
                <div className="gap-4 flex items-center justify-end p-4 border-t-2 border-gray-100">
                    <button className="rounded-lg bg-gray-100 px-4 py-2 border-2 border-gray-100 hover:bg-gray-200 transition" onClick={() => props.closeCB(false)} title="Cancel">
                        Cancel
                    </button>
                    <button className="rounded-lg bg-violet-700 px-4 py-2 border-2 border-violet-700 text-white hover:bg-violet-800 transition" onClick={()=> props.actionCB()} title={props.actionName}>
                        {props.actionName}
                    </button>
                </div>
            </div>
            
        </div>
    )
}