export const commonStyles = {
    navButton : "",
    inputStyling : "px-4 py-2 border-gray-100 border-2 rounded-xl transition outline-0 focus:border-violet-700 block w-[250px]"
}

type getType = "hover" | "after" | "before" | "active" | "focus"

export const twGenerate = { //this is why i like raw css :)
    gen : (type : getType ,classes : string) => {
        return classes.split(" ").map((className)=>{
            return type+":"+className;
        }).join(" ");
    }
}