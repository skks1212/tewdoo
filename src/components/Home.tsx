import { useEffect, useState } from "react";
import { loadTasks } from "../actions/TaskActions";
import { BasicLoad, Board, TaskType } from "../types/BoardTypes";
import { LocalEnv } from "../types/StorageTypes";
import { API } from "../utils/api";
import DummyLoader from "./loading/Dummy";
import notFound from "../med/no-tasks.jpg";

export default function Home(props : {localEnv : LocalEnv}){

    const status : [number | null, string, TaskType[] | null][] = [ //remove any later
        [null, "Pending Tasks", null],
        [null, "Completed Tasks", null],
        [null, "Total Tasks", null]
    ];

    const today = new Date();
    const timeStat = [
        today.getDay(),
        today.getDate(),
        today.getMonth()
    ]

    const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];

    const [stats, setStats] = useState(status);

    const [tasks , setTasks] = useState<TaskType[]>([]);

    const [panel, setPanel] = useState(0);

    const loadAllTasks = async () => {
        const loadBoards : BasicLoad<Board[]> = await API.boards.get();
        if(loadBoards){
            loadBoards.results.forEach(f=>{
                loadTask(f.id);
            })
            if(loadBoards.results.length === 0){
                setStats([
                    [0, "Pending Tasks", []],
                    [0, "Completed Tasks", []],
                    [0, "Total Tasks", []]
                ])
            }
        }
    }

    const loadTask = async (board : number) => {
        const task = await API.task.load(board);
        if(task){
            const pending = task.results.filter((t : any)=>t.status_object.is_complete_status === false);
            const completed = task.results.filter((t : any)=>t.status_object.is_complete_status === true);
            let currStat = stats;
            currStat[0][0] = pending.length;
            currStat[0][2] = pending;
            currStat[1][0] = completed.length;
            currStat[1][2] = completed;
            currStat[2][0] = task.results.length;
            currStat[2][2] = task.results;
            setStats([...currStat]);
        }
    }

    useEffect(()=>{
        loadAllTasks();
    },[]);

    const taskListing = (stat : any) => {
        
        if(stat[2] === null){
            return (
                <>
                    <DummyLoader height={40} className="mt-2"/>
                    <DummyLoader height={40} className="mt-2"/>
                    <DummyLoader height={40} className="mt-2"/>
                </>
            )
        }else if(stat[2].length === 0){
            return (
                <div className="flex flex-col items-center justify-center">
                    <img src={notFound} alt="No Tasks" className="w-[150px]"/>
                    <br/>
                    No Tasks
                </div>
            )
        }else{
            return stat[2].map((task : TaskType, i : number)=>{
                return (
                    <div 
                        key={i}
                        className="border-2 border-gray-100 rounded-xl p-3"
                    >
                        {task.title}
                        <span className="text-xs text-gray-500 block">
                            {task.board_object.title}
                        </span>
                    </div>
                )
            });
        }
    }

    return (
        <>
            <div className="py-6 px-20">
                {days[timeStat[0]]}, {months[timeStat[2]]} {timeStat[1]}
                <h1 className="font-bold text-3xl">
                    Hi, {props.localEnv.user.loggedIn ? props.localEnv.user.username : "Unnamed User"}
                </h1>
            </div>
            <ul className="flex justify-center items-center py-6 px-20 gap-4">
                {
                    stats.map((count, i)=>{
                        return(
                            <li className="border-2 border-gray-100 rounded-xl padding-200 flex-1 p-4" key={i}>
                                <div className="font-bold text-4xl overflow-hidden">
                                    {count[0] || count[0] === 0 ? count[0] : <DummyLoader width={40} height={40}/>}
                                </div>
                                <div className="text-sm text-gray-500 mt-2">
                                    {count[1]}
                                </div>
                            </li>
                        )
                    })
                }
            </ul>
            <div className="my-6 mx-20">
                <h3 className="font-bold text-xl">
                    My Tasks
                </h3>
                <br/>
                <div className="flex">
                    {
                        stats.map((status, i)=>(
                            <button key={i} className={"py-3 px-5 hover:bg-gray-100 transition rounded-xl panel-button "+ (panel === i ? "panel-selected" : "")} onClick={()=>setPanel(i)}>
                                {status[1].replace(" Tasks","")}
                            </button>
                        ))
                    }
                </div>
                <div>
                    {
                        stats.map((stat, i)=>(
                            <div 
                                key={i} 
                                style={{
                                    display : i === panel ? "flex" : "none"
                                }}
                                className="flex flex-col gap-2 pt-2"
                            >
                                {taskListing(stat)}
                                
                            </div>
                        ))
                    }
                </div>
            </div>
        </>
    )
}