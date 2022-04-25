import { Draggable } from "react-beautiful-dnd";

export default function Task(props : {task : any, index : number, setTasks : any, tasks : any}){
    const task = props.task;
    const setTasks = props.setTasks;
    const tasks = props.tasks;
    return (
        <Draggable key = {props.index} draggableId={`task_${task.id}`} index={props.index}>
            {(provided) => (
                <li 
                    key={props.index} 
                    ref={provided.innerRef} 
                    {...provided.draggableProps} 
                    {...provided.dragHandleProps} 
                    className="border-2 border-black/10 rounded-xl p-3 bg-white"
                    tabIndex={0}
                >
                    <input 
                        type="text"
                        placeholder="Task Name"
                        className="bg-transparent w-full border-b-2 border-b-gray-100 outline-none focus:border-b-violet-600"
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
                    <br/>
                    <span className="text-gray-500">
                        <textarea
                            placeholder="Task Description"
                            className="bg-transparent w-full resize-none outline-none border-b-2 border-b-transparent focus:border-b-violet-600"
                            value={task.description}
                            onChange={(e)=>setTasks(
                                tasks.map((t : any, i : number)=>{
                                    if(t.id === task.id){
                                        return {
                                            ...t,
                                            description : e.target.value
                                        }
                                    }else{
                                        return t;
                                    }
                                })
                            )}
                        />
                    </span>
                </li>
            )}
        </Draggable>
        
    )
}