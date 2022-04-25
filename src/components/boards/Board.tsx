import { useEffect, useState } from "react";
import { LocalEnv } from "../../types/StorageTypes";
import { API } from "../../utils/api";
import DummyLoader from "../loading/Dummy";
import { BasicLoad, Board, StatusType, TaskType } from "../../types/BoardTypes";
import { navigate } from "raviger";
import Modal from "../Modal";
import { commonStyles } from "../../styling/common";
import notFound from "../../med/no-status-2.jpg";
import { DragDropContext, Draggable, Droppable, DropResult } from "react-beautiful-dnd";
import { addTask, loadTasks } from "../../actions/TaskActions";
import Task from "./Task";
import Status from "./Status";



export default function BoardElement(props : {boardID : number, localEnv : LocalEnv}){

    const defaultStatus = {
        title : "",
        description : "No Description",
        is_complete_status : false
    }

    const [board, setBoard] = useState<Board | null>(null);
    const [saveStatus, setSaveStatus] = useState("Loading...");
    const [CFModal, setCFModal] = useState(false);
    const [createStatus, setCreateStatus] = useState(defaultStatus);
    const [statuses, setStatuses] = useState<StatusType[] | null>(null);
    const [prevStatuses, setPrevStatuses] = useState<StatusType[] | null>(null);
    const [tasks, setTasks] = useState<TaskType[] | null>(null);
    const [prevTasks, setPrevTasks] = useState<TaskType[] | null>(null);

    const loadBoard = async () => {
        const get = await API.boards.getBoard(props.boardID);
        if(get){
            setBoard(get);
            setSaveStatus('');
        }
    }

    const saveBoard = async () => {
        if(board){
            setSaveStatus('Saving...');
            const save = await API.boards.save(board);
            if(save){
                setSaveStatus('');
            }
        }
    }

    const deleteBoard = async () => {
        if(board){
            if(window.confirm("Are you sure you would like to delete this board?")){
                const deleteboard = await API.boards.delete(board.id);
                if(deleteboard){
                    navigate('/boards');
                }
            }
        }
    }

    const createStatusAPI = async () => {
        if(board && statuses){
            const post = await API.status.create(createStatus, props.boardID);
            if(post){
                console.log(post);
                setStatuses([
                    ...statuses,
                    post
                ])
                setBoard({
                    ...board,
                    meta : {
                        ...board.meta,
                        order : [
                            ...board.meta.order,
                            post.id
                        ]
                    }
                });
                
                setCFModal(false);
            }
        }
    }

    const loadStatus = async () => {
        if(board){
            const post : BasicLoad<StatusType[]> = await API.status.list(props.boardID);
            if(post){
                let sortedStatuses = post.results.sort((a : StatusType, b : StatusType) => {
                    return a.id - b.id;
                });
                if(board?.meta && board.meta.order.length === post.results.length){
                    
                    //check if we have an extra or missing statuses
                    let toRemove : number[] = [];
                    let toAdd : number[] = []
                    post.results.forEach((p)=>{
                        if(!board.meta.order.includes(p.id)){
                            toAdd.push(p.id);
                        }
                    })
                    board.meta.order.forEach((b)=>{
                        if(post.results.filter(pf=>pf.id === b).length === 0){
                            toRemove.push(b);
                        }
                    })
                    const finalArray = board.meta.order.concat(toAdd).filter(f=>!toRemove.includes(f));
                    setBoard({
                        ...board,
                        meta : {
                            ...board.meta,
                            order: finalArray
                        }
                    })
                    sortedStatuses = finalArray.map((b,i)=>{
                        return post.results.filter((p,i)=>p.id === b)[0];
                    })
                }else{
                    setBoard({...board, meta : {...board.meta, order : sortedStatuses.map(s=>s.id)}})
                }
                setStatuses(sortedStatuses);
                setPrevStatuses(sortedStatuses);
            }
        }else{
            console.log('board not setup',board);
        }
    }

    const changeStatus = async (type : "title" | "description" | "is_complete_status" | "order" , stat : StatusType, value : any, ) => {
        if(statuses){
            setStatuses(statuses.map((s, i)=>{
                if(s.id === stat.id){
                    switch (type) {
                        case "title":
                            return {
                                ...s,
                                title : typeof value === "string" ? value : ""
                            }
                        case "description":
                            return {
                                ...s,
                                description : typeof value === "string" ? value : ""
                            }
                        case "is_complete_status":
                            return {
                                ...s,
                                is_complete_status : typeof value === "boolean" ? value : false
                            }
                        case "order" : 
                            console.log(value);
                            return {
                                ...s,
                                order : value
                            }
                        default:
                            return s;
                    }
                }
                return s;
            }))
        }
    }

    const saveStatuses = async () => {
        
        if(statuses && prevStatuses){
            statuses.forEach(async (s) => {
                if( s != prevStatuses.filter(fs=>fs.id === s.id)[0]){
                    setSaveStatus('Saving...');
                    const patch = await API.status.save(props.boardID, s.id, {title: s.title, description : s.description, is_complete_status:s.is_complete_status, order : s.order});
                    if(patch){
                        //console.log('Saved', patch);
                        setSaveStatus('');
                        setPrevStatuses(prevStatuses.map(stat=>{
                            if(stat.id === s.id){
                                return s;
                            }else{
                                return stat;
                            }
                        }));
                    }
                }
            });
            
        }
        setSaveStatus('');
    }

    const deleteStatus = async (stat : StatusType) => {
        if(prevStatuses && statuses && board){
            if(window.confirm("Are you sure you would like to delete this state?")){
                setPrevStatuses(prevStatuses.filter(s=>s.id !== stat.id));
                setStatuses(statuses.filter(s=>s.id !== stat.id))
                setBoard({
                    ...board,
                    meta : {
                        ...board.meta,
                        order : board.meta.order.filter(f=>f!==stat.id)
                    }
                })
                const del = await API.status.delete(stat);
            }
        }
        
    }

    const reorderStatus = (result : DropResult) => {
        console.log(result);
        if(board && result.type !== 'row'){
            const dropSource = result.source.index ;
            const dropDestination = result.destination?.index;
            let oState = board?.meta.order;
            [ oState[dropDestination?dropDestination:0],  oState[dropSource]] = [ oState[dropSource],  oState[dropDestination?dropDestination:0]];
            setBoard({
                ...board,
                meta : {
                    ...board.meta,
                    order : oState
                }
            })
        }
        
    }

    const updateTasks = () => {
        if(tasks && prevTasks){
            tasks.forEach(async (s) => {
                if( s != prevTasks.filter(fs=>fs.id === s.id)[0]){
                    setSaveStatus('Saving...');
                    const patch = await API.task.save(props.boardID, s.id, {title: s.title, description : s.description, status : s.status_object.id});
                    if(patch){
                        //console.log('Saved', patch);
                        setSaveStatus('');
                        setPrevTasks(prevTasks.map(stat=>{
                            if(stat.id === s.id){
                                return s;
                            }else{
                                return stat;
                            }
                        }));
                    }
                }
            });
        }
    }

    useEffect(()=>{
        loadBoard();
        loadTasks(props.boardID,(tasks)=>{
            setTasks(tasks.results);
            setPrevTasks(tasks.results);
        });
    },[]);

    useEffect(()=>{
        let timeout = setTimeout(()=>{
            saveBoard();
        }, 500);
        if(!statuses){
            loadStatus();
        }
        return () => {
            clearTimeout(timeout);
        }
    },[board])

    useEffect(()=>{
        let timeout = setTimeout(()=>{
            saveStatuses();
        }, 500);
        return () => {
            clearTimeout(timeout);
        }
    },[statuses]);

    useEffect(()=>{
        let timeout = setTimeout(()=>{
            updateTasks();
        }, 500);
        return () => {
            clearTimeout(timeout);
        }
    },[tasks]);

    return (
        <>
            <br/>
            {
                CFModal ? (
                    <Modal title="New State" closeCB={setCFModal} actionCB={()=>createStatusAPI()} actionName="Create">
                        <form>
                            <input type="text" placeholder="Title" className={commonStyles.inputStyling + " w-full"} onChange={e=>setCreateStatus({...createStatus, title : e.target.value})}/>
                        </form>
                    </Modal>
                ) : 
                ""
            }
            <div className="py-6 px-20 flex justify-between items-center">
                <h1 className="font-bold text-3xl">
                    {
                        board ? (
                            <input 
                                type="text" 
                                placeholder="Board Name"
                                className="font-bold outline-0 p-2 border-b-4 border-b-gray-100 transition focus:border-b-violet-600"
                                value={board.title}
                                onChange={e=>{
                                    setBoard({
                                        ...board,
                                        title : e.target.value
                                    })
                                }}
                            />
                        ) : (
                            <DummyLoader height={36} width={200} className="inline-block"/>
                        )
                    }
                    
                </h1>
                <div>
                    <span className="text-gray-400 text-xs mr-3">
                        {saveStatus}
                    </span>
                    <button 
                        className="bg-violet-600 hover:bg-violet-700 transition rounded-xl py-2 px-4 text-white"
                        onClick={()=>setCFModal(true)}
                    >
                        <i className="fa-regular fa-clipboard-list-check"></i> &nbsp;Add State
                    </button>
                    <button 
                        className="hover:text-red-600 ml-4"
                        onClick={()=>deleteBoard()}
                    >
                        <i className="fa-regular fa-trash"></i>
                    </button>
                </div>
                
            </div>
            <DragDropContext onDragEnd={(e)=>{reorderStatus(e)}}>
                <Droppable droppableId="status_board" direction="horizontal" type="column">
                    {(provided) => (
                        <ul className="my-6 mx-20 flex gap-4 items-start" {...provided.droppableProps} ref={provided.innerRef}>
                            {
                                statuses ? (
                                    statuses.length < 1 ? (
                                        <div className="text-center flex justify-center flex-1">
                                            <div>
                                                <img src={notFound} alt="No Status Boards" className="w-[400px]"/>
                                                <br/>
                                                Add a state to start adding tasks!
                                            </div>

                                        </div>
                                    ) : 
                                    board?.meta.order.map((or, i)=>{
                                        const stat = statuses.filter(s=>s.id === or)[0];
                                        return (
                                            <Status 
                                                key={i}
                                                status = {stat} 
                                                index = {i} 
                                                changeStatus = {changeStatus}
                                                tasks = {tasks} 
                                                addTask = {addTask} 
                                                setTasks = {setTasks} 
                                                deleteStatus = {deleteStatus} 
                                            />
                                        );
                                    })
                                                
                                ) : 
                                (
                                    <>
                                        <DummyLoader height={700} width={300} className="inline-block shrink-0"/>
                                        <DummyLoader height={300} width={300} className="inline-block shrink-0"/>
                                        <DummyLoader height={500} width={300} className="inline-block shrink-0"/>
                                    </>

                                )
                            }
                            {provided.placeholder}
                        </ul>
                    )}
                </Droppable>
            </DragDropContext>
        </>
    )
}