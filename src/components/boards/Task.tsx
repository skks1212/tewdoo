import { Draggable } from "react-beautiful-dnd";
import { API } from "../../utils/api";



export default function Task(props : {task : any, index : number, setTasks : any, tasks : any, deleteTask : any}){
    const task = props.task;
    const setTasks = props.setTasks;
    const tasks = props.tasks;
    const deleteTask = props.deleteTask;
    

    return (
        <Draggable key = {props.index} draggableId={`${task.status_object.id}_task_${props.index}`} index={props.index}>
            {(provided) => (
                <li 
                    key={props.index} 
                    ref={provided.innerRef} 
                    {...provided.draggableProps} 
                    {...provided.dragHandleProps} 
                    className="border-2 border-gray-100 rounded-xl p-3 bg-white"
                    tabIndex={0}
                >
                    <span className="">
                        <textarea
                            placeholder="Task"
                            className="bg-transparent w-full resize-none text-2xl font-bold outline-none border-b-2 border-b-transparent focus:border-b-violet-600"
                            value={task.title}
                            onChange={(e)=>setTasks(
                                tasks.map((t : any, i : number)=>{
                                    if(t.id === task.id){
                                        return {
                                            ...t,
                                            title : e.target.value
                                        }
                                    }else{
                                        return t;
                                    }
                                })
                            )}
                        />
                    </span>
                    <div className="text-right">
                        <button 
                            className="text-xs hover:text-red-600"
                            onClick={()=>deleteTask(task.id)}
                        >
                            Delete
                        </button>
                    </div>
                </li>
            )}
        </Draggable>
        
    )
}