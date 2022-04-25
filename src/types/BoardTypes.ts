export type Board = {
    id : number,
    created_date : string,
    modified_date : string,
    title : string,
    description : string,
    meta : {
        order : number[]
    }
}
export type BasicLoad<T> = {
    count? : number,
    next? : string,
    previous? : string,
    results : T
}
export type StatusType = {
    id : number,
    created_date : string,
    modified_date : string,
    title : string,
    description : string,
    board : number,
    is_complete_status : boolean,
    order : number[]
}

export type TaskType = any 
/*{
    id : number,
    status : number,
    created_date : string,
    modified_date : string,
    title : string,
    description : string,
    board : number
}*/