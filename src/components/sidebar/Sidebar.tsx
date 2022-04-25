import { ActiveLink, Link } from "raviger"
import { twGenerate } from "../../styling/common"

interface NavButton {name : string, icon : string, location : string}

function NavButton(props : NavButton){
    return (
        <ActiveLink
            activeClass="active-sidebar-link"
            href={props.location}
            className="px-4 py-2 rounded-lg block relative transition hover:bg-gray-100 m-2"
        >
            <i className={`far fa-${props.icon} w-[30px]`}></i>
            {props.name}
        </ActiveLink>
    )
}

const links : NavButton[] = [
    {
        location : "/home",
        icon : "house-blank",
        name : "Home"
    },
    {
        location : "/boards",
        icon : "chalkboard",
        name : "Boards"
    },
    {
        location : "/todo",
        icon : "list",
        name : "Todo"
    }
]

export default function SideBar(){
    return (
        <div className="w-[220px] fixed bottom-0 top-[61px] left-0 border-r-2 border-r-gray-100 bg-white z-10">
            {
                links.map((link, i)=> (
                    <NavButton
                        key={i}
                        location={link.location}
                        icon = {link.icon}
                        name = {link.name}
                    />
                ))
            }
        </div>
    )
}