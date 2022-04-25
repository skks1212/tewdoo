import { StatusType } from "../types/BoardTypes";
import { API } from "../utils/api";

export const defaultTask = {
    title : "Untitled Task",
    description : "Just another task",
    status : 0
}

export const addTask = async (stat : StatusType, callback : (...args : any[]) => void) => {
    const post = await API.task.create(stat, {...defaultTask, status : stat.id});
    callback(post);
}

export const loadTasks = async (boardID : number, callback : (...args : any[]) => void) => {
    const loadTasks = await API.task.load(boardID);
    //console.log(loadTasks);
    callback(loadTasks);
}