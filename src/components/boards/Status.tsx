import { Draggable, Droppable } from "react-beautiful-dnd";
import { StatusType } from "../../types/BoardTypes";
import Task from "./Task";

type changeStatus =  (type: "title" | "description" | "is_complete_status", stat: StatusType, value: string | boolean) => Promise<void>

export default function Status (
    props : {
        status : StatusType, 
        index : number, 
        changeStatus : changeStatus,
        tasks : any,
        addTask : any,
        setTasks : any,
        deleteStatus : any
    }
    ){
    const tasks = props.tasks;
    const addTask = props.addTask;
    const setTasks = props.setTasks;
    const deleteStatus = props.deleteStatus;
    const stat = props.status;
    const changeStatus = props.changeStatus;
    return (
        <Draggable key = {props.index} draggableId={`${props.index}`} index={props.index}>
            {(provided)=>(
                <li className={"inline-block w-[300px] shrink-0 border-2 rounded-xl border-gray-100 "+ (stat.is_complete_status === true ? "bg-green-100" : "bg-white")} key={props.index} ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                    <div className="border-b-2 border-b-gray-100 p-4 font-bold flex justify-between items-center">
                        <input 
                            type="text"
                            className="font-bold outline-0 p-2 border-b-4 border-b-black/05 transition focus:border-b-violet-600 bg-transparent"
                            value={stat.title}
                            placeholder="Status Name"
                            onChange={(e)=>{
                                changeStatus("title",stat,e.target.value);
                            }} 
                        />
                        <button
                            title="Add Task"
                            onClick={()=>addTask(stat,(posted : any)=>{
                                if(tasks){
                                    setTasks([
                                        ...tasks,
                                        posted
                                    ])
                                }
                            })}
                            className="hover:text-violet-600"
                        >
                            <i className="far fa-circle-plus"></i>
                        </button>
                    </div>
                    <div className="p-4 ">
                    <Droppable droppableId="task_board" type="row" >
                        {(provided) => (
                            <ul {...provided.droppableProps} ref={provided.innerRef} className="flex flex-col gap-4">
                                {
                                    tasks?.filter((t : any) =>t.status_object.id === stat.id).map((task : any, i : number)=>{
                                        return (
                                            <Task task ={task} index = {i} setTasks={setTasks} tasks = {tasks} key={i} />
                                        )
                                    })
                                }
                                {provided.placeholder}
                            </ul>
                        )}
                    </Droppable>
                    </div>
                    <div className="border-t-2 border-t-gray-100 p-4 flex justify-between items-center">
                        <button
                            className="text-sm"
                            onClick={()=>changeStatus("is_complete_status",stat,!stat.is_complete_status)}
                        >
                            Completed Items <i className={"far  ml-2 "+(stat.is_complete_status? "text-green-500 fa-circle-check" : "text-gray-400 fa-circle-xmark")}></i>
                        </button>
                        <button 
                            className="hover:text-red-600 ml-4"
                            onClick={()=>deleteStatus(stat)}
                        >
                            <i className="fa-regular fa-trash"></i>
                        </button>
                    </div>
                </li>
            )}
        </Draggable>
    )
}