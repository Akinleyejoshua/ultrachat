import { AiOutlineLink } from "react-icons/ai"

export const Header = () => {
    return <header>
        <nav>
            <div className="navbrand">
                <a href="/">Ultra Chat</a>
            </div>

            <div className="navlinks">
                <a target="blank" href="https://akinleyejoshua.vercel.app">
                    <AiOutlineLink className="icon"/>
                </a>
            </div>
        </nav>
    </header>
}