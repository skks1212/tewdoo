export default function DummyLoader (props : {width? : number, height? : number, className? : string}){
    return (
        <div className={"bg-gray-100 rounded-xl lazy-load"+(props.className ? " "+props.className : "")} style={{width: (props.width ? props.width : "auto"), height:props.height ? props.height : "auto"}}>

        </div>
    )
}