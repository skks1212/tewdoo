import { useEffect, useRef, useState } from "react";
import { commonStyles } from "../../styling/common";
import { BasicLoad, Board } from "../../types/BoardTypes";
import { LocalEnv } from "../../types/StorageTypes";
import { API } from "../../utils/api";
import DummyLoader from "../loading/Dummy";
import Modal from "../Modal";
import notFound from "../../med/not-found.jpg";
import { Link } from "raviger";

const defaultCreate = {
    title : "",
    description : ""
}

export function Boards(props : {localEnv : LocalEnv}){

    const [CFModal, setCFModal] = useState(false);
    const [createBoard, setCreateBoard] = useState(defaultCreate);
    const [boards, setBoards] = useState<BasicLoad<Board[] | null>>({results : null})

    const createBoardAPI = async () => {
        const post = await API.boards.create(createBoard);
        if(post){
            loadBoards();
            const post2 = await API.status.create({title : "Incomplete", description : "Incomplete Tasks", is_complete_status : false}, post.id);
            const post3 = await API.status.create({title : "In Progress", description : "Tasks in progress", is_complete_status : false}, post.id);
            const post4 = await API.status.create({title : "Complete", description : "Completed Tasks", is_complete_status : true}, post.id);
            if(post2 && post3 && post4){
                console.log('Set up board');
            }
            
        }
        setCFModal(false);
    }

    const loadBoards = async () => {
        const get : BasicLoad<Board[]> = await API.boards.get();
        if(get){
            const sortedBoards = get.results.sort((a : Board, b : Board) => {
                return a.id - b.id;
            });
            setBoards({...get, results : sortedBoards});
        }
    }

    useEffect(()=>{
        loadBoards();
    },[])

    return (
        <>  
            <br/>
            <div className="py-6 px-20 flex justify-between items-center">
                <h1 className="font-bold text-3xl">
                    My Boards
                </h1>
                <button 
                    className="bg-violet-600 hover:bg-violet-700 transition rounded-xl py-2 px-4 text-white"
                    onClick={()=>setCFModal(true)}
                >
                    <i className="far fa-circle-plus"></i> &nbsp;Create New
                </button>
            </div>
            {
                CFModal ? (
                    <Modal title="New Board" closeCB={setCFModal} actionCB={()=>createBoardAPI()} actionName="Create">
                        <form>
                            <input type="text" placeholder="Title" className={commonStyles.inputStyling + " w-full"} onChange={e=>setCreateBoard({...createBoard, title : e.target.value})}/>
                            <br/>
                            <textarea placeholder="Description" className={commonStyles.inputStyling + " w-full"} onChange={e=>setCreateBoard({...createBoard, description : e.target.value})}></textarea>  
                        </form>
                    </Modal>
                ) : 
                ""
            }
            <ul className="py-6 px-20 flex flex-wrap gap-4 items-center">
                {
                    boards.results ? (
                        boards.results.length < 1 ? (
                            <div className="text-center flex justify-center flex-1">
                                <div>
                                    <img src={notFound} alt="No Boards" className="w-[400px]"/>
                                    <br/>
                                    No Boards Found. Create some?
                                </div>
                                
                            </div>
                        ) : 
                        boards.results.map((board, i)=>(
                            <Link 
                                href={"board/"+board.id} 
                                tabIndex={0}
                                key={i}
                                className="rounded-xl border-2 border-gray-100 p-4 h-[200px] w-[300px] inline-flex flex-col justify-between hover:border-violet-700 transition"
                            >
                                <div className="flex justify-between items-center">
                                    <h2 className="font-bold text-xl">
                                        {board.title}
                                    </h2>
                                    
                                </div>
                                
                                <div>
                                    {board.description}
                                </div>
                                
                            </Link>
                        ))

                    ) : 
                    (
                        <>
                            <DummyLoader height={200} width={300} className="inline-block flex-1 shrink-0"/>
                            <DummyLoader height={200} width={300} className="inline-block flex-1 shrink-0"/>
                            <DummyLoader height={200} width={300} className="inline-block flex-1 shrink-0"/>
                        </>
                        
                    )
                }
            </ul>
            
        </>
    )
}