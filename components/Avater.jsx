import { useEffect, useState } from "react";

export const Avater = ({data}) => {
  
    const [color, setColor] = useState([
        "bg-red",
        "bg-blue",
        "bg-black",
    ])

    const [choice, setChoice] = useState("");

    useEffect(() => {
        const choose = color[Math.floor(Math.random() * color.length)]
        setChoice(choose);
    }, [])


    return <div className={`avater`} id={`${choice}`}>
        <h1>{data?.name?.charAt(0)}</h1>
        {data?.active && <div className="active"></div>}
    </div>
}